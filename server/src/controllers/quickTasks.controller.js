import * as QuickTaskService from '../services/quickTask.service.js';

export async function list(req, res, next) {
  try {
    const { companyId, workspaceId } = req.auth;
    const items = await QuickTaskService.listQuickTasks({ companyId, workspaceId });
    return res.status(200).json({ success: true, data: items });
  } catch (e) {
    return next(e);
  }
}

export async function create(req, res, next) {
  try {
    const { companyId, workspaceId, sub: userId } = req.auth;
    const qt = await QuickTaskService.createQuickTask({ companyId, workspaceId, userId, data: req.body });
    return res.status(201).json({ success: true, data: qt });
  } catch (e) {
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    const { companyId, workspaceId, sub: userId } = req.auth;
    const qt = await QuickTaskService.updateQuickTask({ companyId, workspaceId, userId, id: req.params.id, updates: req.body });
    if (!qt) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quick task not found' } });
    return res.status(200).json({ success: true, data: qt });
  } catch (e) {
    return next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const { companyId, workspaceId, sub: userId } = req.auth;
    const qt = await QuickTaskService.deleteQuickTask({ companyId, workspaceId, userId, id: req.params.id });
    if (!qt) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quick task not found' } });
    return res.status(200).json({ success: true, data: { ok: true } });
  } catch (e) {
    return next(e);
  }
}

