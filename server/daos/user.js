import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function createUser({ username, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return User.create({ username, email, passwordHash });
}

export async function authUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.passwordHash);
  return match ? user : null;
}

export async function resetPassword(userId, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  return User.findByIdAndUpdate(userId, { passwordHash }, { new: true });
}
