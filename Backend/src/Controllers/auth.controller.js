import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, adminSecret } = req.body;
  const result = await authService.register({ name, email, password, role, adminSecret });
  res.status(201).json({ success: true, data: result });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.status(200).json({ success: true, data: result });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: authService.sanitizeUser(req.user) });
});

export { register, login, getMe };