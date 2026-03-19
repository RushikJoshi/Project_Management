import { getTenantModels } from '../config/tenantDb.js';

export async function listWorkspacesForUser({ userId, companyId }) {
  const { Workspace, Membership } = getTenantModels(companyId);
  const memberships = await Membership.find({ userId, companyId, status: 'active' }).select('workspaceId');
  const ids = memberships.map((m) => m.workspaceId);
  const items = await Workspace.find({ _id: { $in: ids }, companyId }).sort({ createdAt: -1 });
  return items;
}

