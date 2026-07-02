import ApiError from '../utils/ApiError.js';

// 404 handler for unmatched routes - forwards to the error middleware below.
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Centralized error handler. Normalizes Mongoose/JWT/duplicate-key errors
// into consistent { success: false, message, details } JSON responses with
// proper HTTP status codes.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = 'Validation failed';
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field '${err.path}'`;
  }

  // Mongo duplicate key error (e.g. duplicate email, or the reservation
  // partial-unique-index race condition on double booking)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {}).join(', ');
    if (err.keyPattern && err.keyPattern.table) {
      message = 'This table is already booked for the selected date and time slot.';
    } else {
      message = `Duplicate value for field(s): ${field}`;
    }
  }

  // JWT errors (defensive - auth middleware already handles most of this)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
};