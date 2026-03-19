import User from '../models/User.js';
import Membership from '../models/Membership.js';
import { hashPassword } from '../utils/password.js';

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

export async function createUser({ companyId, workspaceId, actorRole, input }) {
  if (!['super_admin', 'admin'].includes(actorRole)) {
    const err = new Error('Only company admins can create users');
    err.statusCode = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  const allowedRoles = actorRole === 'super_admin'
    ? ['super_admin', 'admin', 'manager', 'team_leader', 'team_member']
    : ['admin', 'manager', 'team_leader', 'team_member'];

  if (!allowedRoles.includes(input.role)) {
    const err = new Error('You are not allowed to create a user with this role');
    err.statusCode = 403;
    err.code = 'FORBIDDEN_ROLE';
    throw err;
  }

  const email = input.email.trim().toLowerCase();
  const existing = await User.findOne({ companyId, email });
  if (existing) {
    const err = new Error('A user with this email already exists in this company');
    err.statusCode = 409;
    err.code = 'USER_EXISTS';
    throw err;
  }

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    companyId,
    name: input.name.trim(),
    email,
    passwordHash,
    role: input.role,
    jobTitle: input.jobTitle?.trim() || '',
    department: input.department?.trim() || '',
    isActive: true,
    color: input.color?.trim() || '#3366ff',
  });

  await Membership.updateOne(
    { companyId, workspaceId, userId: user._id },
    { $setOnInsert: { role: input.role, status: 'active' } },
    { upsert: true }
  );

  return user;
}

