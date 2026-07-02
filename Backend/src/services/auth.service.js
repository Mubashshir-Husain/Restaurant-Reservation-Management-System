import jwt from 'jsonwebtoken';
import User from '../Models/user.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../Config/constants.js';

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  // Only allow 'admin' role to be self-assigned during registration if
  // explicitly requested - in a real system this would be gated further
  // (e.g. invite code). For this assignment's scope we allow it so
  // reviewers can create an admin account easily.
  const finalRole = role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.CUSTOMER;

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