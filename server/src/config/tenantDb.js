import mongoose from 'mongoose';

import { getUserModel } from '../models/User.js';
import { getWorkspaceModel } from '../models/Workspace.js';
import { getMembershipModel } from '../models/Membership.js';
import { getProjectModel } from '../models/Project.js';
import { getTaskModel } from '../models/Task.js';
import { getTeamModel } from '../models/Team.js';
import { getQuickTaskModel } from '../models/QuickTask.js';
import { getNotificationModel } from '../models/Notification.js';
import { getActivityLogModel } from '../models/ActivityLog.js';
import { getRefreshTokenModel } from '../models/RefreshToken.js';

const tenantConnCache = new Map();

function getTenantDbName(companyId) {
  const id = String(companyId || '').trim();
  if (!id) {
    const err = new Error('Missing companyId for tenant database');
    err.statusCode = 500;
    err.code = 'TENANT_COMPANY_ID_MISSING';
    throw err;
  }
  return `PMS_${id}`;
}

export function getTenantConnection(companyId) {
  const dbName = getTenantDbName(companyId);
  const cached = tenantConnCache.get(dbName);
  if (cached) return cached;
  const conn = mongoose.connection.useDb(dbName, { useCache: true });
  tenantConnCache.set(dbName, conn);
  return conn;
}

export function getTenantModels(companyId) {
  const conn = getTenantConnection(companyId);
  return {
    conn,
    User: getUserModel(conn),
    Workspace: getWorkspaceModel(conn),
    Membership: getMembershipModel(conn),
    Project: getProjectModel(conn),
    Task: getTaskModel(conn),
    Team: getTeamModel(conn),
    QuickTask: getQuickTaskModel(conn),
    Notification: getNotificationModel(conn),
    ActivityLog: getActivityLogModel(conn),
    RefreshToken: getRefreshTokenModel(conn),
  };
}

