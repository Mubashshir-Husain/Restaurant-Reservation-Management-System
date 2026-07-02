import express from 'express';
import { body } from 'express-validator';
import * as authController from '../Controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['customer', 'admin'])
      .withMessage('Role must be customer or admin'),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

router.get('/me', protect, authController.getMe);

export default router;