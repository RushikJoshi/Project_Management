import * as WorkspaceService from '../services/workspace.service.js';

export async function list(req, res, next) {
  try {
    const { sub: userId, companyId } = req.auth;
    const items = await WorkspaceService.listWorkspacesForUser({ userId, companyId });
    return res.status(200).json({ success: true, data: items });
  } catch (e) {
    return next(e);
  }
}

