import * as UserService from '../services/user.service.js';

export async function me(req, res, next) {
  try {
    const { sub: userId, companyId } = req.auth;
    const user = await UserService.getMe({ companyId, userId });
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    return res.status(200).json({ success: true, data: user });
  } catch (e) {
    return next(e);
  }
}

export async function list(req, res, next) {
  try {
    const { companyId } = req.auth;
    const users = await UserService.listUsers({ companyId });
    return res.status(200).json({ success: true, data: users });
  } catch (e) {
    return next(e);
  }
}

export async function get(req, res, next) {
  try {
    const { companyId } = req.auth;
    const user = await UserService.getUser({ companyId, id: req.params.id });
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    return res.status(200).json({ success: true, data: user });
  } catch (e) {
    return next(e);
  }
}

export async function create(req, res, next) {
  try {
    const { companyId, workspaceId, role } = req.auth;
    const user = await UserService.createUser({
      companyId,
      workspaceId,
      actorRole: role,
      input: req.body,
    });
    return res.status(201).json({ success: true, data: user });
  } catch (e) {
    return next(e);
  }
}

