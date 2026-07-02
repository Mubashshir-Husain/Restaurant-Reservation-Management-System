import asyncHandler from '../utils/asyncHandler.js';
import * as reservationService from '../services/reservation.service.js';

const getAllReservations = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const reservations = await reservationService.getAllReservations({ date });
  res.status(200).json({ success: true, data: reservations });
});

const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await reservationService.getReservationById(req.params.id);
  res.status(200).json({ success: true, data: reservation });
});

const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.updateReservation(
    req.params.id,
    req.body
  );
  res.status(200).json({ success: true, data: reservation });
});

const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.cancelReservation({
    reservationId: req.params.id,
    requestingUser: { id: req.user._id, role: req.user.role },
  });
  res.status(200).json({ success: true, data: reservation });
});

export {
  getAllReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
};