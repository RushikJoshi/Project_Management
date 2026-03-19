import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Flag, Search, User, X } from 'lucide-react';
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
    setValue,
    watch,
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

  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [assigneeQuery, setAssigneeQuery] = useState('');
  const assigneeRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    setAssigneeOpen(false);
    setAssigneeQuery('');
  }, [open, task]);

  useEffect(() => {
    if (!assigneeOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (assigneeRef.current?.contains(event.target as Node)) return;
      setAssigneeOpen(false);
      setAssigneeQuery('');
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [assigneeOpen]);

  const assignableUsers = users
    .filter(u => u.isActive)
    .filter(u => ASSIGNABLE_ROLES.includes(u.role));

  const selectedAssigneeId = watch('assigneeId');
  const selectedAssignee = assignableUsers.find((u) => u.id === selectedAssigneeId) ?? null;

  const filteredAssignableUsers = useMemo(() => {
    const query = assigneeQuery.trim().toLowerCase();
    if (!query) return assignableUsers;

    return assignableUsers.filter((u) => {
      const roleLabel = u.role.replace(/_/g, ' ');
      return (
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        roleLabel.includes(query)
      );
    });
  }, [assignableUsers, assigneeQuery]);

  const assigneeLabel = selectedAssignee
    ? `${selectedAssignee.name} (${selectedAssignee.role.replace(/_/g, ' ')})`
    : 'Unassigned';

  const handleAssigneeSelect = (assigneeId: string) => {
    setValue('assigneeId', assigneeId, { shouldDirty: true });
    setAssigneeOpen(false);
    setAssigneeQuery('');
  };

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
            <div ref={assigneeRef} className="relative">
              <input type="hidden" {...register('assigneeId')} />
              <div
                className={cn(
                  'input min-h-[44px] flex items-center gap-2 pr-10',
                  assigneeOpen && 'ring-2 ring-brand-200 border-brand-400'
                )}
              >
                <Search size={14} className="text-surface-400 flex-shrink-0" />
                <input
                  value={assigneeOpen ? assigneeQuery : assigneeLabel}
                  onFocus={() => setAssigneeOpen(true)}
                  onChange={(e) => {
                    setAssigneeOpen(true);
                    setAssigneeQuery(e.target.value);
                  }}
                  placeholder="Search assignee..."
                  className="flex-1 bg-transparent outline-none text-surface-800 dark:text-surface-200 placeholder:text-surface-400"
                />
              </div>
              <User size={14} className="absolute right-3 top-[22px] -translate-y-1/2 text-surface-400 pointer-events-none" />

              {assigneeOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-card">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleAssigneeSelect('')}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors',
                      !selectedAssigneeId
                        ? 'bg-brand-600 text-white'
                        : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/60'
                    )}
                  >
                    <span>Unassigned</span>
                    <span className={cn('text-[11px]', !selectedAssigneeId ? 'text-white/80' : 'text-surface-400')}>No owner</span>
                  </button>

                  <div className="max-h-52 overflow-y-auto border-t border-surface-100 dark:border-surface-800">
                    {filteredAssignableUsers.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-surface-400">
                        No matching assignees found.
                      </div>
                    ) : (
                      filteredAssignableUsers.map((u) => {
                        const isSelected = u.id === selectedAssigneeId;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleAssigneeSelect(u.id)}
                            className={cn(
                              'w-full px-4 py-3 text-left transition-colors',
                              isSelected
                                ? 'bg-brand-50 dark:bg-brand-950/30'
                                : 'hover:bg-surface-50 dark:hover:bg-surface-800/60'
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className={cn('text-sm font-medium', isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-surface-800 dark:text-surface-200')}>
                                {u.name}
                              </span>
                              <span className="text-[11px] uppercase tracking-wide text-surface-400">
                                {u.role.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="mt-0.5 text-xs text-surface-400">
                              {u.email}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
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

