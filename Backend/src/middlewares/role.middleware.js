import ApiError from '../utils/ApiError.js';

// Usage: authorize('admin') or authorize('admin', 'customer')
// Must run after the `protect` middleware so req.user is populated.
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized.');
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(
      403,
      `Access denied. Requires role: ${allowedRoles.join(' or ')}.`
    );
  }

  next();
};

export default authorize;