import ActivityLog from '../models/ActivityLog.js';

export async function listActivity({ companyId, workspaceId, limit = 50 }) {
  const items = await ActivityLog.find({ companyId, workspaceId }).sort({ createdAt: -1 }).limit(limit);
  return items;
}

