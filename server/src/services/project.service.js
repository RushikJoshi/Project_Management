import { getTenantModels } from '../config/tenantDb.js';

export async function listProjects({ companyId, workspaceId, status, department, q, page = 1, limit = 50 }) {
  const { Project } = getTenantModels(companyId);
  const filter = { companyId, workspaceId };
  if (status) filter.status = status;
  if (department) filter.department = department;
  if (q) filter.$text = { $search: q };

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  return { items, total, page, limit };
}

export async function getProject({ companyId, workspaceId, projectId }) {
  const { Project } = getTenantModels(companyId);
  const project = await Project.findOne({ _id: projectId, companyId, workspaceId });
  return project;
}

export async function createProject({ companyId, workspaceId, userId, data }) {
  const { Project, ActivityLog } = getTenantModels(companyId);
  const project = await Project.create({
    companyId,
    workspaceId,
    name: data.name,
    description: data.description,
    color: data.color,
    status: data.status || 'active',
    department: data.department || 'General',
    teamId: data.teamId || null,
    ownerId: userId,
    members: Array.isArray(data.members) && data.members.length > 0 ? data.members : [userId],
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    progress: 0,
    tasksCount: 0,
    completedTasksCount: 0,
  });

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'project_created',
    description: `Created project "${project.name}"`,
    entityType: 'project',
    entityId: project._id,
    metadata: { projectId: project._id },
  });

  return project;
}

export async function updateProject({ companyId, workspaceId, userId, projectId, updates }) {
  const { Project, ActivityLog } = getTenantModels(companyId);
  const project = await Project.findOneAndUpdate(
    { _id: projectId, companyId, workspaceId },
    {
      $set: {
        ...updates,
        ...(updates.startDate ? { startDate: new Date(updates.startDate) } : {}),
        ...(updates.endDate ? { endDate: new Date(updates.endDate) } : {}),
      },
    },
    { new: true }
  );
  if (!project) return null;

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'project_updated',
    description: `Updated project "${project.name}"`,
    entityType: 'project',
    entityId: project._id,
    metadata: { projectId: project._id },
  });

  return project;
}

export async function deleteProject({ companyId, workspaceId, userId, projectId }) {
  const { Project, ActivityLog } = getTenantModels(companyId);
  const project = await Project.findOneAndDelete({ _id: projectId, companyId, workspaceId });
  if (!project) return null;

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'project_deleted',
    description: `Deleted project "${project.name}"`,
    entityType: 'project',
    entityId: project._id,
    metadata: { projectId: project._id },
  });

  return project;
}

