import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Flag, User, X } from 'lucide-react';
import { Modal } from '../Modal';
import { cn, generateId } from '../../utils/helpers';
import { useAppStore } from '../../context/appStore';
import { useAuthStore } from '../../context/authStore';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../app/constants';
import type { Priority, QuickTask, QuickTaskStatus, Role } from '../../app/types';

type QuickTaskFormData = {
  title: string;
  description?: string;
  priority: Priority;
  status: QuickTaskStatus;
  assigneeId: string;
  dueDate?: string;
};

const ASSIGNABLE_ROLES: Role[] = ['manager', 'team_leader', 'team_member'];

interface QuickTaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: QuickTask | null;
}

export const QuickTaskModal: React.FC<QuickTaskModalProps> = ({ open, onClose, task }) => {
  const { user } = useAuthStore();
  const { users, addQuickTask, updateQuickTask, deleteQuickTask } = useAppStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickTaskFormData>({
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'medium',
      status: task?.status ?? 'todo',
      assigneeId: task?.assigneeId ?? '',
      dueDate: task?.dueDate ?? '',
    },
  });

  useEffect(() => {
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'medium',
      status: task?.status ?? 'todo',
      assigneeId: task?.assigneeId ?? '',
      dueDate: task?.dueDate ?? '',
    });
  }, [task, reset, open]);

  const assignableUsers = users
    .filter(u => u.isActive)
    .filter(u => ASSIGNABLE_ROLES.includes(u.role));

  const onSubmit = (data: QuickTaskFormData) => {
    const now = new Date().toISOString();
    const reporterId = user?.id ?? 'u1';
    const payload: QuickTask = {
      id: task?.id ?? generateId(),
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId || null,
      reporterId: task?.reporterId ?? reporterId,
      dueDate: data.dueDate || undefined,
      createdAt: task?.createdAt ?? now,
      updatedAt: now,
    };

    if (task) updateQuickTask(task.id, payload);
    else addQuickTask(payload);

    onClose();
  };

  const handleDelete = () => {
    if (!task) return;
    deleteQuickTask(task.id);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="lg" showClose={false}>
      <div className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-semibold text-lg text-surface-900 dark:text-white">
              {task ? 'Edit Quick Task' : 'New Quick Task'}
            </h2>
            <p className="text-sm text-surface-400">
              Assign to one person (no project required)
            </p>
          </div>
          <div className="flex items-center gap-1">
            {task && (
              <button
                onClick={handleDelete}
                className="btn-ghost w-8 h-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                title="Delete"
              >
                <X size={14} />
              </button>
            )}
            <button onClick={onClose} className="btn-ghost w-8 h-8" title="Close">
              <X size={14} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className={cn('input', errors.title && 'border-rose-300 focus:ring-rose-200')}
              placeholder="e.g. Follow up with design review"
              autoFocus
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description')}
              className="input h-auto min-h-[90px] py-2 resize-none"
              rows={3}
              placeholder="Add details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <div className="relative">
                <select {...register('status')} className="input pr-10 appearance-none">
                  <option value="todo">{STATUS_CONFIG.todo.label}</option>
                  <option value="in_progress">{STATUS_CONFIG.in_progress.label}</option>
                  <option value="done">{STATUS_CONFIG.done.label}</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
                  <Calendar size={14} />
                </span>
              </div>
            </div>

            <div>
              <label className="label">Due date</label>
              <div className="relative">
                <input type="date" {...register('dueDate')} className="input pr-10" />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="label">Priority</label>
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG.low][]).map(([key, cfg]) => (
                <label key={key} className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors',
                  'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                )}>
                  <input type="radio" value={key} {...register('priority')} className="accent-brand-600" />
                  <Flag size={12} style={{ color: cfg.color }} />
                  <span className={cn('text-sm font-medium', cfg.text)}>{cfg.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Assignee</label>
            <div className="relative">
              <select {...register('assigneeId')} className="input pr-10 appearance-none">
                <option value="">Unassigned</option>
                {assignableUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
              <User size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary btn-sm hidden md:flex" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-sm hidden md:flex">
              {task ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default QuickTaskModal;

