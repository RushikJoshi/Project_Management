import Workspace from '../models/Workspace.js';
import Membership from '../models/Membership.js';

export async function listWorkspacesForUser({ userId, companyId }) {
  const memberships = await Membership.find({ userId, companyId, status: 'active' }).select('workspaceId');
  const ids = memberships.map((m) => m.workspaceId);
  const items = await Workspace.find({ _id: { $in: ids }, companyId }).sort({ createdAt: -1 });
  return items;
}

