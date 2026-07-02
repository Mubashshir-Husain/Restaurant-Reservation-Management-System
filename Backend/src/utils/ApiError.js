// A lightweight typed error so controllers/services can throw errors with a
// specific HTTP status code, and the centralized error middleware knows how
// to respond without guessing.
class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;