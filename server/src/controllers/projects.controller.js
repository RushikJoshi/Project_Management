import * as ProjectService from '../services/project.service.js';

export async function list(req, res, next) {
  try {
    const { companyId, workspaceId, sub: userId } = req.auth;
    const { status, department, q, page, limit } = req.query;
    const result = await ProjectService.listProjects({
      companyId,
      workspaceId,
      status,
      department,
      q,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    return res.status(200).json({ success: true, data: result.items, meta: { total: result.total, page: result.page, limit: result.limit } });
  } catch (e) {
    return next(e);
  }
}

export async function get(req, res, next) {
  try {
    const { companyId, workspaceId } = req.auth;
    const project = await ProjectService.getProject({ companyId, workspaceId, projectId: req.params.id });
    if (!project) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    return res.status(200).json({ success: true, data: project });
  } catch (e) {
    return next(e);
  }
}

export async function create(req, res, next) {
  try {
    const { companyId, workspaceId, sub: userId } = req.auth;
    const project = await ProjectService.createProject({ companyId, workspaceId, userId, data: req.body });
    return res.status(201).json({ success: true, data: project });
  } catch (e) {
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    const { companyId, workspaceId, sub: userId } = req.auth;
    const project = await ProjectService.updateProject({ companyId, workspaceId, userId, projectId: req.params.id, updates: req.body });
    if (!project) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    return res.status(200).json({ success: true, data: project });
  } catch (e) {
    return next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const { companyId, workspaceId, sub: userId } = req.auth;
    const project = await ProjectService.deleteProject({ companyId, workspaceId, userId, projectId: req.params.id });
    if (!project) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    return res.status(200).json({ success: true, data: { ok: true } });
  } catch (e) {
    return next(e);
  }
}

