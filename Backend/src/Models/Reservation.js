import mongoose from 'mongoose';
import { TIME_SLOTS, RESERVATION_STATUS } from '../Config/constants.js';

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    date: {
      // Stored as 'YYYY-MM-DD' string to keep date comparisons simple and
      // timezone-independent for this assignment's scope.
      type: String,
      required: [true, 'Reservation date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      enum: TIME_SLOTS,
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Guests must be at least 1'],
    },
    status: {
      type: String,
      enum: [RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.CANCELLED],
      default: RESERVATION_STATUS.CONFIRMED,
    },
  },
  { timestamps: true }
);

// Prevents two ACTIVE reservations from ever being saved for the same table,
// date, and time slot at the database layer (defense in depth on top of the
// application-level check in reservation.service.js). Cancelled reservations
// are excluded so the slot can be re-booked after a cancellation.
reservationSchema.index(
  { table: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: RESERVATION_STATUS.CONFIRMED },
  }
);

reservationSchema.index({ user: 1 });
reservationSchema.index({ date: 1 });

export default mongoose.model('Reservation', reservationSchema);