import Reservation from '../Models/Reservation.js';
import Table from '../Models/Table.js';
import User from '../Models/user.js';
import ApiError from '../utils/ApiError.js';
import { sendBookingConfirmation } from './email.service.js';
import {
  SLOT_DURATION_MINUTES,
  RESERVATION_STATUS,
  ROLES,
} from '../Config/constants.js';

// Converts 'HH:MM' -> minutes since midnight, so we can do generic interval
// overlap comparisons rather than only relying on exact string equality.
const slotToMinutes = (timeSlot) => {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  return hours * 60 + minutes;
};

// Standard interval overlap check: two ranges [aStart, aEnd) and
// [bStart, bEnd) overlap if aStart < bEnd AND bStart < aEnd.
const intervalsOverlap = (aStart, aEnd, bStart, bEnd) =>
  aStart < bEnd && bStart < aEnd;

/**
 * Finds tables that are free (not already booked) for a given date/timeSlot
 * and that have enough capacity for the requested number of guests.
 */
const findAvailableTables = async ({ date, timeSlot, guests }) => {
  const requestedStart = slotToMinutes(timeSlot);
  const requestedEnd = requestedStart + SLOT_DURATION_MINUTES;

  const [candidateTables, sameDayReservations] = await Promise.all([
    Table.find({ isActive: true, capacity: { $gte: guests } }),
    Reservation.find({ date, status: RESERVATION_STATUS.CONFIRMED }).select(
      'table timeSlot'
    ),
  ]);

  const bookedTableIds = new Set(
    sameDayReservations
      .filter((r) => {
        const start = slotToMinutes(r.timeSlot);
        const end = start + SLOT_DURATION_MINUTES;
        return intervalsOverlap(requestedStart, requestedEnd, start, end);
      })
      .map((r) => r.table.toString())
  );

  return candidateTables.filter((t) => !bookedTableIds.has(t._id.toString()));
};

/**
 * Creates a reservation after validating capacity and conflicts.
 * If `tableId` is not supplied, the first available suitable table is
 * auto-assigned.
 */
const createReservation = async ({ userId, date, timeSlot, guests, tableId }) => {
  let table;

  if (tableId) {
    table = await Table.findById(tableId);
    if (!table || !table.isActive) {
      throw new ApiError(404, 'Selected table not found or inactive.');
    }
    if (table.capacity < guests) {
      throw new ApiError(
        400,
        `Table '${table.label}' seats up to ${table.capacity} guests, which is fewer than the requested ${guests}.`
      );
    }

    const conflict = await hasConflict({ tableId: table._id, date, timeSlot });
    if (conflict) {
      throw new ApiError(
        409,
        'This table is already booked for the selected date and time slot.'
      );
    }
  } else {
    const available = await findAvailableTables({ date, timeSlot, guests });
    if (available.length === 0) {
      throw new ApiError(
        409,
        'No tables are available for the requested date, time slot, and party size.'
      );
    }
    // Auto-assign the smallest suitable table to leave larger tables free.
    table = available.sort((a, b) => a.capacity - b.capacity)[0];
  }

  try {
    // Determine if booking is within 24 hours to prevent duplicate reminders
    const [hours, minutes] = timeSlot.split(':');
    const resDateTime = new Date(`${date}T${hours}:${minutes}:00`);
    const isWithin24Hours = (resDateTime.getTime() - Date.now()) <= 24 * 60 * 60 * 1000;

    const reservation = await Reservation.create({
      user: userId,
      table: table._id,
      date,
      timeSlot,
      guests,
      status: RESERVATION_STATUS.CONFIRMED,
      reminderSent: isWithin24Hours,
    });

    const populated = await reservation.populate('table');
    
    // Fetch user details to send booking confirmation email
    const user = await User.findById(userId);
    if (user && user.email) {
      sendBookingConfirmation(user.email, user.name, populated);
    }

    return populated;
  } catch (err) {
    // Race condition safety net: the partial unique index on the model
    // rejects a concurrent duplicate booking even if our earlier check
    // passed, so translate that into a clean 409 instead of a raw 500.
    if (err.code === 11000) {
      throw new ApiError(
        409,
        'This table is already booked for the selected date and time slot.'
      );
    }
    throw err;
  }
};

const hasConflict = async ({ tableId, date, timeSlot, excludeReservationId }) => {
  const requestedStart = slotToMinutes(timeSlot);
  const requestedEnd = requestedStart + SLOT_DURATION_MINUTES;

  const query = {
    table: tableId,
    date,
    status: RESERVATION_STATUS.CONFIRMED,
  };
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  const existing = await Reservation.find(query).select('timeSlot');
  return existing.some((r) => {
    const start = slotToMinutes(r.timeSlot);
    const end = start + SLOT_DURATION_MINUTES;
    return intervalsOverlap(requestedStart, requestedEnd, start, end);
  });
};

const getOwnReservations = async (userId) =>
  Reservation.find({ user: userId }).populate('table').sort({ date: -1 });

const getAllReservations = async ({ date } = {}) => {
  const filter = {};
  if (date) filter.date = date;
  return Reservation.find(filter)
    .populate('table')
    .populate('user', 'name email')
    .sort({ date: -1, timeSlot: 1 });
};

const getReservationById = async (id) => {
  const reservation = await Reservation.findById(id)
    .populate('table')
    .populate('user', 'name email');
  if (!reservation) {
    throw new ApiError(404, 'Reservation not found.');
  }
  return reservation;
};

/**
 * Cancels a reservation. Customers may only cancel their own reservations;
 * admins may cancel any reservation. Ownership/role check happens here so
 * the rule lives in one place regardless of which route calls it.
 */
const cancelReservation = async ({ reservationId, requestingUser }) => {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new ApiError(404, 'Reservation not found.');
  }

  const isOwner = reservation.user.toString() === requestingUser.id.toString();
  const isAdmin = requestingUser.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to cancel this reservation.');
  }

  if (reservation.status === RESERVATION_STATUS.CANCELLED) {
    throw new ApiError(400, 'Reservation is already cancelled.');
  }

  reservation.status = RESERVATION_STATUS.CANCELLED;
  await reservation.save();
  return reservation;
};

/**
 * Admin-only update: change date/timeSlot/table/guests/status on any
 * reservation, re-validating capacity and conflicts against the new values.
 */
const updateReservation = async (reservationId, updates) => {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new ApiError(404, 'Reservation not found.');
  }

  const nextDate = updates.date ?? reservation.date;
  const nextTimeSlot = updates.timeSlot ?? reservation.timeSlot;
  const nextGuests = updates.guests ?? reservation.guests;
  const nextTableId = updates.tableId ?? reservation.table.toString();

  if (updates.status && updates.status === RESERVATION_STATUS.CONFIRMED) {
    const table = await Table.findById(nextTableId);
    if (!table || !table.isActive) {
      throw new ApiError(404, 'Selected table not found or inactive.');
    }
    if (table.capacity < nextGuests) {
      throw new ApiError(
        400,
        `Table '${table.label}' seats up to ${table.capacity} guests, which is fewer than the requested ${nextGuests}.`
      );
    }

    const conflict = await hasConflict({
      tableId: nextTableId,
      date: nextDate,
      timeSlot: nextTimeSlot,
      excludeReservationId: reservation._id,
    });
    if (conflict) {
      throw new ApiError(
        409,
        'This table is already booked for the selected date and time slot.'
      );
    }
  }

  reservation.date = nextDate;
  reservation.timeSlot = nextTimeSlot;
  reservation.guests = nextGuests;
  reservation.table = nextTableId;
  if (updates.status) reservation.status = updates.status;

  try {
    await reservation.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(
        409,
        'This table is already booked for the selected date and time slot.'
      );
    }
    throw err;
  }

  return reservation.populate('table');
};

export {
  findAvailableTables,
  createReservation,
  getOwnReservations,
  getAllReservations,
  getReservationById,
  cancelReservation,
  updateReservation,
  hasConflict,
};