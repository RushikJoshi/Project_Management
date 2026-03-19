import { getTenantModels } from '../config/tenantDb.js';

export async function listQuickTasks({ companyId, workspaceId }) {
  const { QuickTask } = getTenantModels(companyId);
  return QuickTask.find({ companyId, workspaceId }).sort({ updatedAt: -1 });
}

export async function createQuickTask({ companyId, workspaceId, userId, data }) {
  const { QuickTask, ActivityLog } = getTenantModels(companyId);
  const qt = await QuickTask.create({
    companyId,
    workspaceId,
    title: data.title,
    description: data.description,
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    assigneeId: data.assigneeId || null,
    reporterId: userId,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
  });

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'quick_task_created',
    description: `Created quick task "${qt.title}"`,
    entityType: 'quick_task',
    entityId: qt._id,
    metadata: {},
  });

  return qt;
}

export async function updateQuickTask({ companyId, workspaceId, userId, id, updates }) {
  const { QuickTask, ActivityLog } = getTenantModels(companyId);
  const qt = await QuickTask.findOneAndUpdate(
    { _id: id, companyId, workspaceId },
    {
      $set: {
        ...updates,
        ...(updates.dueDate ? { dueDate: new Date(updates.dueDate) } : {}),
      },
    },
    { new: true }
  );
  if (!qt) return null;

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'quick_task_updated',
    description: `Updated quick task "${qt.title}"`,
    entityType: 'quick_task',
    entityId: qt._id,
    metadata: {},
  });

  return qt;
}

export async function deleteQuickTask({ companyId, workspaceId, userId, id }) {
  const { QuickTask, ActivityLog } = getTenantModels(companyId);
  const qt = await QuickTask.findOneAndDelete({ _id: id, companyId, workspaceId });
  if (!qt) return null;

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'quick_task_deleted',
    description: `Deleted quick task "${qt.title}"`,
    entityType: 'quick_task',
    entityId: qt._id,
    metadata: {},
  });

  return qt;
}

