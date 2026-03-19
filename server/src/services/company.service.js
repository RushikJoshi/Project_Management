import Company from '../models/Company.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Workspace from '../models/Workspace.js';
import Membership from '../models/Membership.js';
import { hashPassword } from '../utils/password.js';

export async function listCompanies() {
  const companies = await Company.find().sort({ createdAt: -1 });

  // lightweight counts (can be optimized with aggregation later)
  const ids = companies.map((c) => c._id);
  const [userCounts, projectCounts] = await Promise.all([
    User.aggregate([{ $match: { companyId: { $in: ids } } }, { $group: { _id: '$companyId', count: { $sum: 1 } } }]),
    Project.aggregate([{ $match: { companyId: { $in: ids } } }, { $group: { _id: '$companyId', count: { $sum: 1 } } }]),
  ]);

  const uMap = new Map(userCounts.map((x) => [String(x._id), x.count]));
  const pMap = new Map(projectCounts.map((x) => [String(x._id), x.count]));

  return companies.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    usersCount: uMap.get(c.id) || 0,
    projectsCount: pMap.get(c.id) || 0,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    color: c.color || '#3366ff',
  }));
}

export async function createCompanyWithAdmin({ name, adminName, adminEmail, adminPassword, initialUserLimit, status }) {
  const existing = await Company.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    const err = new Error('Company admin email already exists');
    err.statusCode = 409;
    err.code = 'DUPLICATE_EMAIL';
    throw err;
  }

  const company = await Company.create({
    name,
    email: adminEmail.toLowerCase(),
    status,
    color: '#3366ff',
  });

  const passwordHash = await hashPassword(adminPassword);
  const admin = await User.create({
    companyId: company._id,
    name: adminName,
    email: adminEmail.toLowerCase(),
    passwordHash,
    role: 'admin',
    isActive: true,
  });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || `company-${company.id.slice(-6)}`;
  const workspace = await Workspace.create({
    companyId: company._id,
    name,
    slug,
    plan: 'pro',
    ownerId: admin._id,
  });

  await Membership.create({
    companyId: company._id,
    workspaceId: workspace._id,
    userId: admin._id,
    role: 'admin',
    status: 'active',
  });

  return {
    id: company.id,
    name: company.name,
    email: company.email,
    usersCount: 1,
    projectsCount: 0,
    status: company.status,
    createdAt: company.createdAt.toISOString(),
    color: company.color || '#3366ff',
    initialUserLimit: initialUserLimit ?? 50,
    adminUserId: admin.id,
    workspaceId: workspace.id,
  };
}

