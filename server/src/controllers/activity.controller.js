import * as ActivityService from '../services/activity.service.js';

export async function list(req, res, next) {
  try {
    const { companyId, workspaceId } = req.auth;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const items = await ActivityService.listActivity({ companyId, workspaceId, limit });
    return res.status(200).json({ success: true, data: items });
  } catch (e) {
    return next(e);
  }
}

