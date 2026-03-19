import Company from '../models/Company.js';
import AuthLookup from '../models/AuthLookup.js';
import { getTenantModels } from '../config/tenantDb.js';
import { hashPassword } from '../utils/password.js';

export async function ensureDevSeed() {
  if (process.env.NODE_ENV === 'production') return;
  const superAdminEmail = 'gitakshmi@gmail.com';
  const superAdminName = 'Dhiren Makwana';

  let company = await Company.findOne({ email: superAdminEmail });
  if (!company) {
    company = await Company.create({
      name: 'Gitakshmi Technologies',
      email: superAdminEmail,
      status: 'active',
      color: '#3366ff',
    });
  }

  await AuthLookup.updateOne(
    { email: superAdminEmail },
    { $set: { email: superAdminEmail, companyId: company._id } },
    { upsert: true }
  );

  const { User, Workspace, Membership } = getTenantModels(company._id);

  let superAdmin = await User.findOne({ companyId: company._id, email: superAdminEmail }).select('+passwordHash');
  if (!superAdmin) {
    const passwordHash = await hashPassword('Gitakshmi@123');
    superAdmin = await User.create({
      companyId: company._id,
      name: superAdminName,
      email: superAdminEmail,
      passwordHash,
      role: 'super_admin',
      jobTitle: 'Super Admin',
      department: 'Platform',
      isActive: true,
      color: '#3366ff',
    });
  }

  let workspace = await Workspace.findOne({ companyId: company._id, slug: 'gitakshmitech' });
  if (!workspace) {
    workspace = await Workspace.create({
      companyId: company._id,
      name: 'Gitakshmi Technologies',
      slug: 'gitakshmitech',
      plan: 'pro',
      ownerId: superAdmin._id,
    });
  }

  await Membership.updateOne(
    { companyId: company._id, workspaceId: workspace._id, userId: superAdmin._id },
    { $setOnInsert: { role: 'super_admin', status: 'active' } },
    { upsert: true }
  );
}

