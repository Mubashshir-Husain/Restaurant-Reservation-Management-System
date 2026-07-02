import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

// Runs after an array of express-validator checks; collects any validation
// errors and forwards a single, consistent 400 response.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(new ApiError(400, 'Validation failed', details));
  }
  next();
};

export default validate;