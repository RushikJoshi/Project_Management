import Task from '../models/Task.js';
import Project from '../models/Project.js';
import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';

export async function listTasks({ companyId, workspaceId, projectId, assigneeId, status, priority, page = 1, limit = 200 }) {
  const filter = { companyId, workspaceId };
  if (projectId) filter.projectId = projectId;
  if (assigneeId) filter.assigneeIds = assigneeId;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Task.find(filter).sort({ projectId: 1, status: 1, order: 1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);
  return { items, total, page, limit };
}

export async function createTask({ companyId, workspaceId, userId, data }) {
  const task = await Task.create({
    companyId,
    workspaceId,
    projectId: data.projectId,
    title: data.title,
    description: data.description,
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    assigneeIds: data.assigneeIds || [],
    reporterId: userId,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    estimatedHours: data.estimatedHours ?? null,
    order: data.order ?? 0,
    labels: data.labels || [],
  });

  await Project.updateOne({ _id: task.projectId, companyId, workspaceId }, { $inc: { tasksCount: 1 } });

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'task_created',
    description: `Created task "${task.title}"`,
    entityType: 'task',
    entityId: task._id,
    metadata: { projectId: task.projectId },
  });

  if (task.assigneeIds?.length) {
    await Notification.insertMany(
      task.assigneeIds.map((assignee) => ({
        companyId,
        workspaceId,
        userId: assignee,
        type: 'task_assigned',
        title: 'Task assigned to you',
        message: `You were assigned "${task.title}"`,
        isRead: false,
        relatedId: String(task._id),
      }))
    );
  }

  return task;
}

export async function updateTask({ companyId, workspaceId, userId, taskId, updates }) {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, companyId, workspaceId },
    {
      $set: {
        ...updates,
        ...(updates.dueDate ? { dueDate: new Date(updates.dueDate) } : {}),
        ...(updates.startDate ? { startDate: new Date(updates.startDate) } : {}),
      },
    },
    { new: true }
  );
  if (!task) return null;

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'task_updated',
    description: `Updated task "${task.title}"`,
    entityType: 'task',
    entityId: task._id,
    metadata: { projectId: task.projectId },
  });

  return task;
}

export async function moveTaskStatus({ companyId, workspaceId, userId, taskId, status }) {
  return updateTask({ companyId, workspaceId, userId, taskId, updates: { status } });
}

export async function deleteTask({ companyId, workspaceId, userId, taskId }) {
  const task = await Task.findOneAndDelete({ _id: taskId, companyId, workspaceId });
  if (!task) return null;

  await Project.updateOne({ _id: task.projectId, companyId, workspaceId }, { $inc: { tasksCount: -1 } });

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'task_deleted',
    description: `Deleted task "${task.title}"`,
    entityType: 'task',
    entityId: task._id,
    metadata: { projectId: task.projectId },
  });

  return task;
}

