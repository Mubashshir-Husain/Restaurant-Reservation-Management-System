// Wraps an async route/controller function so any thrown error or rejected
// promise is forwarded to Express's centralized error handler instead of
// crashing the process or requiring a try/catch in every controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;