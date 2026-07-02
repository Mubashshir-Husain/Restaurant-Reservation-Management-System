import asyncHandler from '../utils/asyncHandler.js';
import * as reservationService from '../services/reservation.service.js';
import { TIME_SLOTS } from '../Config/constants.js';

const listTimeSlots = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: TIME_SLOTS });
});

const checkAvailability = asyncHandler(async (req, res) => {
  const { date, timeSlot, guests } = req.query;
  const available = await reservationService.findAvailableTables({
    date,
    timeSlot,
    guests: Number(guests),
  });
  res.status(200).json({ success: true, data: available });
});

const createReservation = asyncHandler(async (req, res) => {
  const { date, timeSlot, guests, tableId } = req.body;
  const reservation = await reservationService.createReservation({
    userId: req.user._id,
    date,
    timeSlot,
    guests,
    tableId,
  });
  res.status(201).json({ success: true, data: reservation });
});

const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await reservationService.getOwnReservations(req.user._id);
  res.status(200).json({ success: true, data: reservations });
});

const cancelMyReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.cancelReservation({
    reservationId: req.params.id,
    requestingUser: { id: req.user._id, role: req.user.role },
  });
  res.status(200).json({ success: true, data: reservation });
});

export {
  listTimeSlots,
  checkAvailability,
  createReservation,
  getMyReservations,
  cancelMyReservation,
};