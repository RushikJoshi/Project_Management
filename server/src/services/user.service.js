import User from '../models/User.js';
import Membership from '../models/Membership.js';

export async function getMe({ userId }) {
  const user = await User.findById(userId);
  return user;
}

export async function listUsers({ companyId }) {
  const users = await User.find({ companyId }).sort({ createdAt: -1 });
  return users;
}

export async function getUser({ companyId, id }) {
  const user = await User.findOne({ _id: id, companyId });
  return user;
}

