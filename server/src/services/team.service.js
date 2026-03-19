import Team from '../models/Team.js';
import ActivityLog from '../models/ActivityLog.js';

export async function listTeams({ companyId, workspaceId }) {
  const items = await Team.find({ companyId, workspaceId }).sort({ createdAt: -1 });
  return items;
}

export async function createTeam({ companyId, workspaceId, userId, data }) {
  const team = await Team.create({
    companyId,
    workspaceId,
    name: data.name,
    description: data.description,
    leaderId: data.leaderId || userId,
    members: data.members || [userId],
    projectIds: data.projectIds || [],
    color: data.color,
  });

  await ActivityLog.create({
    companyId,
    workspaceId,
    userId,
    type: 'team_created',
    description: `Created team "${team.name}"`,
    entityType: 'team',
    entityId: team._id,
    metadata: {},
  });

  return team;
}

