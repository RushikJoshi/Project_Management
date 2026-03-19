import { getTenantModels } from '../config/tenantDb.js';

export async function listActivity({ companyId, workspaceId, limit = 50 }) {
  const { ActivityLog } = getTenantModels(companyId);
  const items = await ActivityLog.find({ companyId, workspaceId }).sort({ createdAt: -1 }).limit(limit);
  return items;
}

