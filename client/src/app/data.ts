import type { User, Project, Task, QuickTask, Team, Workspace, Notification, Activity } from './types';

// Helper to generate IDs that look like ObjectIds for Mongoose compatibility
const uid = (n: number) => `65f00000000000000000010${n}`;
const pid = (n: number) => `65f00000000000000000020${n}`;
const tid = (n: number) => `65f00000000000000000030${n}`;
const wid = (n: number) => `65f00000000000000000040${n}`;

export const MOCK_USERS: User[] = [
  { id: uid(1), name: 'Alex Morgan', email: 'alex@flowboard.io', role: 'super_admin', jobTitle: 'Super Admin', department: 'Platform', workspaceId: wid(1), createdAt: '2024-01-01', isActive: true, color: '#3366ff' },
  { id: uid(2), name: 'Sarah Chen', email: 'sarah@acme.com', role: 'admin', jobTitle: 'Engineering Manager', department: 'Engineering', workspaceId: wid(1), createdAt: '2024-01-05', isActive: true, color: '#7c3aed' },
  { id: uid(3), name: 'James Wilson', email: 'james@acme.com', role: 'manager', jobTitle: 'Project Manager', department: 'Product', workspaceId: wid(1), createdAt: '2024-01-10', isActive: true, color: '#f43f5e' },
  { id: uid(4), name: 'Emily Parker', email: 'emily@acme.com', role: 'team_leader', jobTitle: 'Tech Lead', department: 'Engineering', workspaceId: wid(1), createdAt: '2024-02-01', isActive: true, color: '#f59e0b' },
  { id: uid(5), name: 'Marcus Johnson', email: 'marcus@acme.com', role: 'team_member', jobTitle: 'Full Stack Developer', department: 'Engineering', workspaceId: wid(1), createdAt: '2024-02-10', isActive: true, color: '#10b981' },
  { id: uid(6), name: 'Lisa Zhang', email: 'lisa@acme.com', role: 'team_member', jobTitle: 'UI/UX Designer', department: 'Design', workspaceId: wid(1), createdAt: '2024-03-01', isActive: true, color: '#06b6d4' },
  { id: uid(7), name: 'Ryan Davis', email: 'ryan@acme.com', role: 'team_member', jobTitle: 'Backend Developer', department: 'Engineering', workspaceId: wid(1), createdAt: '2024-03-15', isActive: false, color: '#f97316' },
  { id: uid(8), name: 'Nina Patel', email: 'nina@acme.com', role: 'team_leader', jobTitle: 'Design Lead', department: 'Design', workspaceId: wid(1), createdAt: '2024-04-01', isActive: true, color: '#ec4899' },
];

export const MOCK_WORKSPACES: Workspace[] = [
  { id: wid(1), name: 'Gitakshmi Technologies  ', slug: 'gitakshmitech', plan: 'pro', membersCount: 24, createdAt: '2024-01-01', ownerId: uid(2) },
  { id: wid(2), name: 'GItakshmi Group', slug: 'gitakshmigroup', plan: 'free', membersCount: 8, createdAt: '2024-02-15', ownerId: uid(3) },
  { id: wid(3), name: 'Gitakshmi Labs', slug: 'gitakshmilabs', plan: 'enterprise', membersCount: 64, createdAt: '2023-11-01', ownerId: uid(1) },
];

export const MOCK_PROJECTS: Project[] = [
  { id: pid(1), name: 'Website Redesign', description: 'Complete overhaul of the company website with new branding', color: '#3366ff', status: 'active', workspaceId: wid(1), teamId: tid(1), ownerId: uid(3), members: [uid(4), uid(5), uid(6)], startDate: '2024-11-01', endDate: '2025-02-28', progress: 65, tasksCount: 24, completedTasksCount: 16, createdAt: '2024-11-01', updatedAt: '2025-01-10' },
  { id: pid(2), name: 'Mobile App v2.0', description: 'New features and performance improvements for mobile app', color: '#7c3aed', status: 'active', workspaceId: wid(1), teamId: tid(2), ownerId: uid(3), members: [uid(4), uid(5), uid(7)], startDate: '2025-01-01', endDate: '2025-04-30', progress: 28, tasksCount: 42, completedTasksCount: 12, createdAt: '2025-01-01', updatedAt: '2025-01-12' },
  { id: pid(3), name: 'API Integration', description: 'Third-party API integrations for enhanced functionality', color: '#10b981', status: 'active', workspaceId: wid(1), teamId: tid(1), ownerId: uid(4), members: [uid(5), uid(7)], startDate: '2025-01-15', endDate: '2025-03-15', progress: 45, tasksCount: 18, completedTasksCount: 8, createdAt: '2025-01-15', updatedAt: '2025-01-14' },
  { id: pid(4), name: 'Brand Identity', description: 'New brand identity system and design language', color: '#f43f5e', status: 'on_hold', workspaceId: wid(1), teamId: tid(3), ownerId: uid(8), members: [uid(6), uid(8)], startDate: '2024-10-01', endDate: '2025-01-31', progress: 80, tasksCount: 15, completedTasksCount: 12, createdAt: '2024-10-01', updatedAt: '2025-01-08' },
  { id: pid(5), name: 'Q1 Marketing Campaign', description: 'Launch campaign for Q1 2025 product releases', color: '#f59e0b', status: 'active', workspaceId: wid(1), ownerId: uid(3), members: [uid(6), uid(8)], startDate: '2025-01-01', endDate: '2025-03-31', progress: 15, tasksCount: 20, completedTasksCount: 3, createdAt: '2025-01-01', updatedAt: '2025-01-13' },
  { id: pid(6), name: 'Infrastructure Upgrade', description: 'Cloud infrastructure migration and optimization', color: '#06b6d4', status: 'completed', workspaceId: wid(1), teamId: tid(2), ownerId: uid(4), members: [uid(5), uid(7)], startDate: '2024-09-01', endDate: '2024-12-31', progress: 100, tasksCount: 30, completedTasksCount: 30, createdAt: '2024-09-01', updatedAt: '2024-12-31' },
];

export const MOCK_TASKS: Task[] = [
  { id: tid(11), title: 'Design homepage hero section', description: 'Create visually compelling hero with animation', status: 'in_progress', priority: 'high', projectId: pid(1), assigneeIds: [uid(6)], reporterId: uid(3), dueDate: '2025-01-20', estimatedHours: 8, order: 0, createdAt: '2024-11-05', updatedAt: '2025-01-10', labels: ['design', 'frontend'] },
  { id: tid(12), title: 'Implement authentication flow', description: 'JWT-based auth with refresh tokens', status: 'done', priority: 'urgent', projectId: pid(1), assigneeIds: [uid(5)], reporterId: uid(4), dueDate: '2025-01-15', estimatedHours: 16, order: 0, createdAt: '2024-11-08', updatedAt: '2025-01-09', labels: ['backend', 'security'] },
  { id: tid(13), title: 'Setup CI/CD pipeline', description: 'GitHub Actions for automated deployment', status: 'done', priority: 'high', projectId: pid(1), assigneeIds: [uid(7)], reporterId: uid(4), dueDate: '2024-12-31', estimatedHours: 12, order: 1, createdAt: '2024-11-10', updatedAt: '2024-12-30', labels: ['devops'] },
  { id: tid(14), title: 'Mobile navigation redesign', description: 'Improve bottom nav for mobile users', status: 'todo', priority: 'medium', projectId: pid(2), assigneeIds: [uid(6), uid(5)], reporterId: uid(3), dueDate: '2025-02-10', estimatedHours: 6, order: 0, createdAt: '2025-01-02', updatedAt: '2025-01-12', labels: ['mobile', 'ux'] },
  { id: tid(15), title: 'Push notification service', description: 'Implement FCM push notifications', status: 'in_progress', priority: 'high', projectId: pid(2), assigneeIds: [uid(7)], reporterId: uid(4), dueDate: '2025-02-15', estimatedHours: 20, order: 0, createdAt: '2025-01-05', updatedAt: '2025-01-13', labels: ['backend', 'mobile'] },
  { id: tid(16), title: 'Stripe payment integration', description: 'Integrate Stripe for subscription billing', status: 'backlog', priority: 'high', projectId: pid(3), assigneeIds: [uid(5)], reporterId: uid(4), dueDate: '2025-02-28', estimatedHours: 24, order: 0, createdAt: '2025-01-15', updatedAt: '2025-01-15', labels: ['payments', 'backend'] },
];

export const MOCK_QUICK_TASKS: QuickTask[] = [
  { id: 'qt1', title: 'Prepare weekly status update', description: 'Summarize blockers, progress, and next steps', status: 'todo', priority: 'medium', assigneeId: uid(3), reporterId: uid(3), dueDate: '2025-01-17', createdAt: '2025-01-14T08:30:00', updatedAt: '2025-01-14T08:30:00' },
  { id: 'qt2', title: 'Review PR for notifications', description: 'Check edge cases and UI consistency', status: 'in_progress', priority: 'high', assigneeId: uid(4), reporterId: uid(3), dueDate: '2025-01-16', createdAt: '2025-01-14T09:00:00', updatedAt: '2025-01-14T11:10:00' },
];

export const MOCK_TEAMS: Team[] = [
  { id: tid(1), name: 'Frontend Squad', description: 'UI/UX and frontend development', workspaceId: wid(1), leaderId: uid(4), members: [uid(4), uid(5), uid(6)], projectIds: [pid(1), pid(3)], color: '#3366ff', createdAt: '2024-01-15' },
  { id: tid(2), name: 'Backend Team', description: 'API, infrastructure and backend services', workspaceId: wid(1), leaderId: uid(4), members: [uid(4), uid(7), uid(5)], projectIds: [pid(2), pid(3), pid(6)], color: '#7c3aed', createdAt: '2024-01-15' },
  { id: tid(3), name: 'Design Crew', description: 'Brand, design system and creative direction', workspaceId: wid(1), leaderId: uid(8), members: [uid(8), uid(6)], projectIds: [pid(4), pid(5)], color: '#f43f5e', createdAt: '2024-02-01' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'task_assigned', title: 'Task assigned to you', message: 'James assigned "Design homepage hero section" to you', isRead: false, userId: uid(6), relatedId: tid(11), createdAt: '2025-01-14T10:30:00' },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'task_created', description: 'Created task "SEO audit and optimization"', userId: uid(3), entityId: tid(11), entityType: 'task', createdAt: '2025-01-14T11:00:00' },
];

export const PROJECT_COLORS = [
  '#3366ff', '#7c3aed', '#f43f5e', '#f59e0b', '#10b981', 
  '#06b6d4', '#f97316', '#ec4899', '#8b5cf6', '#14b8a6',
];

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400' },
  high: { label: 'High', color: '#f97316', bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400' },
  urgent: { label: 'Urgent', color: '#f43f5e', bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-400' },
};

export const STATUS_CONFIG = {
  backlog: { label: 'Backlog', color: '#8896b8', bg: 'bg-surface-100 dark:bg-surface-800', text: 'text-surface-600 dark:text-surface-400' },
  todo: { label: 'To Do', color: '#5e72a0', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400' },
  in_progress: { label: 'In Progress', color: '#3366ff', bg: 'bg-brand-50 dark:bg-brand-950/30', text: 'text-brand-700 dark:text-brand-400' },
  in_review: { label: 'In Review', color: '#7c3aed', bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-400' },
  done: { label: 'Done', color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400' },
};

export const ROLE_CONFIG = {
  super_admin: { label: 'Super Admin', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  admin: { label: 'Admin', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/30' },
  manager: { label: 'Manager', color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-950/30' },
  team_leader: { label: 'Team Leader', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  team_member: { label: 'Team Member', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
};
