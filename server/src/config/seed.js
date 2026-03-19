import Company from '../models/Company.js';
import Workspace from '../models/Workspace.js';
import User from '../models/User.js';
import Membership from '../models/Membership.js';
import { hashPassword } from '../utils/password.js';

export async function ensureDevSeed() {
  if (process.env.NODE_ENV === 'production') return;
  const superAdminEmail = 'gitakshmi@gmail.com';
  const superAdminName = 'Dhiren Makwana';

  // #region agent log
  fetch('http://127.0.0.1:7356/ingest/f2bbb2a3-c016-48c5-8c3f-7d86788fca17',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d61fd'},body:JSON.stringify({sessionId:'1d61fd',runId:'pre-fix',hypothesisId:'H9',location:'server/src/config/seed.js:14',message:'ensureDevSeed_start',data:{nodeEnv:process.env.NODE_ENV||null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log

  let company = await Company.findOne({ email: superAdminEmail });
  if (!company) {
    company = await Company.create({
      name: 'Gitakshmi Technologies',
      email: superAdminEmail,
      status: 'active',
      color: '#3366ff',
    });
  }

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

