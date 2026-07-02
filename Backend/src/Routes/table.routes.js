import express from 'express';
import { body } from 'express-validator';
import * as tableController from '../Controllers/table.controller.js';
import protect from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { ROLES } from '../Config/constants.js';

const router = express.Router();

router.use(protect);

router.get('/', tableController.listTables);

router.post(
  '/',
  authorize(ROLES.ADMIN),
  [
    body('label').trim().notEmpty().withMessage('Table label is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  ],
  validate,
  tableController.createTable
);

router.put(
  '/:id',
  authorize(ROLES.ADMIN),
  [
    body('label').optional().trim().notEmpty(),
    body('capacity').optional().isInt({ min: 1 }),
    body('isActive').optional().isBoolean(),
  ],
  validate,
  tableController.updateTable
);

router.delete('/:id', authorize(ROLES.ADMIN), tableController.deleteTable);

export default router;