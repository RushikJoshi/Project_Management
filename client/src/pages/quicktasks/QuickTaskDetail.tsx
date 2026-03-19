import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Flag, Trash2, User2, Zap } from 'lucide-react';
import { cn, formatDate } from '../../utils/helpers';
import { useAppStore } from '../../context/appStore';
import { useAuthStore } from '../../context/authStore';
import { MOCK_USERS, PRIORITY_CONFIG, STATUS_CONFIG } from '../../app/data';
import { EmptyState } from '../../components/ui';
import { QuickTaskModal } from '../../components/QuickTaskModal';
import type { Priority, QuickTaskStatus, Role } from '../../app/types';

const ASSIGNABLE_ROLES: Role[] = ['manager', 'team_leader', 'team_member'];

export const QuickTaskDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const { quickTasks, updateQuickTask, deleteQuickTask, setQuickTaskStatus } = useAppStore();
  const task = quickTasks.find(t => t.id === id);

  const [editOpen, setEditOpen] = useState(false);

  const assignee = task?.assigneeId ? MOCK_USERS.find(u => u.id === task.assigneeId) : null;
  const reporter = task ? MOCK_USERS.find(u => u.id === task.reporterId) : null;
  const assignableUsers = useMemo(() => (
    MOCK_USERS.filter(u => u.isActive).filter(u => ASSIGNABLE_ROLES.includes(u.role))
  ), []);

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyState
          icon={<Zap size={28} />}
          title="Quick task not found"
          description="It may have been deleted."
          action={<Link to="/quick-tasks" className="btn-primary">Back to Quick Tasks</Link>}
        />
      </div>
    );
  }

  const priority = PRIORITY_CONFIG[task.priority];
  const statusCfg =
    task.status === 'todo' ? STATUS_CONFIG.todo :
    task.status === 'in_progress' ? STATUS_CONFIG.in_progress :
    STATUS_CONFIG.done;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const onChangeStatus = (s: QuickTaskStatus) => setQuickTaskStatus(task.id, s);
  const onChangePriority = (p: Priority) => updateQuickTask(task.id, { priority: p, updatedAt: new Date().toISOString() });
  const onChangeAssignee = (assigneeId: string) => updateQuickTask(task.id, { assigneeId: assigneeId || null, updatedAt: new Date().toISOString() });
  const onChangeDueDate = (dueDate: string) => updateQuickTask(task.id, { dueDate: dueDate || undefined, updatedAt: new Date().toISOString() });
  const onDelete = () => {
    deleteQuickTask(task.id);
    navigate('/quick-tasks');
  };

  const canEdit = !!user;

  return (
    <div className="max-w-full mx-auto">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="btn-ghost btn-sm">
            <ArrowLeft size={16} />
            Back
          </button>
          <Link to="/quick-tasks" className="text-sm text-surface-400 hover:text-surface-600">
            Quick Tasks
          </Link>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={cn('badge text-[10px]', priority.bg, priority.text)}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priority.color }} />
                {priority.label}
              </span>
              <span className={cn('badge text-[10px]', statusCfg.bg, statusCfg.text)}>
                {statusCfg.label}
              </span>
              {isOverdue && (
                <span className="badge text-[10px] bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300">
                  Overdue
                </span>
              )}
            </div>

            <h1 className="page-title">{task.title}</h1>
            {task.description && (
              <p className="page-subtitle whitespace-pre-line">{task.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="btn-secondary" onClick={() => setEditOpen(true)} disabled={!canEdit}>
              Edit
            </button>
            <button className="btn-ghost text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={onDelete} disabled={!canEdit}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-3">Details</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Status</label>
                <div className="flex gap-2 flex-wrap">
                  {(['todo', 'in_progress', 'done'] as QuickTaskStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => onChangeStatus(s)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                        task.status === s
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'border-surface-200 dark:border-surface-700 text-surface-500 hover:border-surface-300 dark:hover:border-surface-600 hover:text-surface-700 dark:hover:text-surface-300'
                      )}
                      disabled={!canEdit}
                    >
                      {s === 'todo' ? STATUS_CONFIG.todo.label : s === 'in_progress' ? STATUS_CONFIG.in_progress.label : STATUS_CONFIG.done.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Priority</label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG.low][]).map(([p, cfg]) => (
                    <button
                      key={p}
                      onClick={() => onChangePriority(p)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                        task.priority === p
                          ? `${cfg.bg} ${cfg.text} border-current`
                          : 'border-surface-200 dark:border-surface-700 text-surface-500 hover:border-surface-300 dark:hover:border-surface-600'
                      )}
                      disabled={!canEdit}
                    >
                      <Flag size={10} style={{ color: cfg.color }} />
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Assignee</label>
                  <div className="relative">
                    <select
                      value={task.assigneeId ?? ''}
                      onChange={(e) => onChangeAssignee(e.target.value)}
                      className="input pr-10 appearance-none"
                      disabled={!canEdit}
                    >
                      <option value="">Unassigned</option>
                      {assignableUsers.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role.replace('_', ' ')})
                        </option>
                      ))}
                    </select>
                    <User2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-surface-400 mt-1">
                    {assignee ? `Currently: ${assignee.name}` : 'Currently: Unassigned'}
                  </p>
                </div>

                <div>
                  <label className="label">Due date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={task.dueDate ?? ''}
                      onChange={(e) => onChangeDueDate(e.target.value)}
                      className="input pr-10"
                      disabled={!canEdit}
                    />
                    <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-2">Activity</h3>
            <p className="text-sm text-surface-400">
              Created {task.createdAt ? formatDate(task.createdAt) : '—'} · Updated {task.updatedAt ? formatDate(task.updatedAt) : '—'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-3">People</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-surface-400">Assignee</span>
                <span className="text-surface-700 dark:text-surface-300 font-medium truncate">
                  {assignee?.name ?? 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-surface-400">Reporter</span>
                <span className="text-surface-700 dark:text-surface-300 font-medium truncate">
                  {reporter?.name ?? '—'}
                </span>
              </div>
            </div>
          </div>

          <div className={cn('card p-5', isOverdue && 'border-rose-200 dark:border-rose-900/50')}>
            <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-3">Dates</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-surface-400">Due</span>
                <span className={cn('font-medium', isOverdue ? 'text-rose-600 dark:text-rose-300' : 'text-surface-700 dark:text-surface-300')}>
                  {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickTaskModal open={editOpen} onClose={() => setEditOpen(false)} task={task} />
    </div>
  );
};

export default QuickTaskDetailPage;

