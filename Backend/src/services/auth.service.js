import jwt from 'jsonwebtoken';
import User from '../Models/user.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../Config/constants.js';

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async ({ name, email, password, role, adminSecret }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  let finalRole = ROLES.CUSTOMER;
  if (role === ROLES.ADMIN) {
    // 1. Enforce single-admin rule
    const adminExists = await User.findOne({ role: ROLES.ADMIN });
    if (adminExists) {
      throw new ApiError(409, 'An administrator account already exists. Only one admin is allowed.');
    }
    // 2. Validate admin security code
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      throw new ApiError(403, 'Invalid Admin Security Key.');
    }
    finalRole = ROLES.ADMIN;
  }

  const user = await User.create({ name, email, password, role: finalRole });

  return {
    user: sanitizeUser(user),
    token: generateToken(user),
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  return {
    user: sanitizeUser(user),
    token: generateToken(user),
  };
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export { register, login, sanitizeUser };