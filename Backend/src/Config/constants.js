// Central place for business-rule constants so they are easy to tune.

// Fixed set of bookable time slots (24h format). Each slot has a fixed
// duration, so slots themselves never overlap by design. Overlap logic in
// reservation.service.js is still generic (start/end minute comparison) so
// this list can be changed to arbitrary times without breaking anything.
export const TIME_SLOTS = [
  '12:00',
  '13:30',
  '15:00',
  '19:00',
  '20:30',
  '22:00',
];

export const SLOT_DURATION_MINUTES = 90;

export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

export const RESERVATION_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};