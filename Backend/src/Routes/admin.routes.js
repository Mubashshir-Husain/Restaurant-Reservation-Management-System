import express from 'express';
import { body, query } from 'express-validator';
import * as adminController from '../Controllers/admin.controller.js';
import protect from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { ROLES, TIME_SLOTS, RESERVATION_STATUS } from '../Config/constants.js';

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get(
  '/reservations',
  [query('date').optional().matches(/^\d{4}-\d{2}-\d{2}$/)],
  validate,
  adminController.getAllReservations
);

router.get('/reservations/:id', adminController.getReservationById);

router.put(
  '/reservations/:id',
  [
    body('date').optional().matches(/^\d{4}-\d{2}-\d{2}$/),
    body('timeSlot').optional().isIn(TIME_SLOTS),
    body('guests').optional().isInt({ min: 1 }),
    body('tableId').optional().isMongoId(),
    body('status').optional().isIn(Object.values(RESERVATION_STATUS)),
  ],
  validate,
  adminController.updateReservation
);

router.delete('/reservations/:id', adminController.cancelReservation);

export default router;