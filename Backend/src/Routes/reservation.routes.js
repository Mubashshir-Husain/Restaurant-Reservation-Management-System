import express from 'express';
import { body, query } from 'express-validator';
import * as reservationController from '../Controllers/reservation.controller.js';
import protect from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { TIME_SLOTS } from '../Config/constants.js';

const router = express.Router();

router.use(protect);

router.get('/time-slots', reservationController.listTimeSlots);

router.get(
  '/availability',
  [
    query('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('date must be YYYY-MM-DD'),
    query('timeSlot').isIn(TIME_SLOTS).withMessage('Invalid time slot'),
    query('guests').isInt({ min: 1 }).withMessage('guests must be a positive integer'),
  ],
  validate,
  reservationController.checkAvailability
);

router.post(
  '/',
  [
    body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('date must be YYYY-MM-DD'),
    body('timeSlot').isIn(TIME_SLOTS).withMessage('Invalid time slot'),
    body('guests').isInt({ min: 1 }).withMessage('guests must be a positive integer'),
    body('tableId').optional().isMongoId().withMessage('Invalid tableId'),
  ],
  validate,
  reservationController.createReservation
);

router.get('/my', reservationController.getMyReservations);

router.delete('/:id', reservationController.cancelMyReservation);

export default router;