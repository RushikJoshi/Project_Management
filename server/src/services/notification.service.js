import { getTenantModels } from '../config/tenantDb.js';

export async function listNotifications({ companyId, workspaceId, userId, page = 1, limit = 50 }) {
  const { Notification } = getTenantModels(companyId);
  const filter = { companyId, workspaceId, userId };
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);
  return { items, total, page, limit };
}

export async function markRead({ companyId, workspaceId, userId, id }) {
  const { Notification } = getTenantModels(companyId);
  const n = await Notification.findOneAndUpdate(
    { _id: id, companyId, workspaceId, userId },
    { $set: { isRead: true } },
    { new: true }
  );
  return n;
}

export async function markAllRead({ companyId, workspaceId, userId }) {
  const { Notification } = getTenantModels(companyId);
  await Notification.updateMany({ companyId, workspaceId, userId, isRead: false }, { $set: { isRead: true } });
}

