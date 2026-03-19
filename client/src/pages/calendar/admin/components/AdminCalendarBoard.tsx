import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { useAdminCalendarStore, AdminTask } from '../store/useAdminCalendarStore.ts';
import { startOfWeek, addDays, format, differenceInMinutes, startOfDay, addMinutes, eachDayOfInterval, endOfWeek, isSameMonth, isToday, parseISO, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { AdminTaskCard } from './AdminTaskCard.tsx';
import { cn } from '../../../../utils/helpers.ts';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../../../context/authStore';

const DayColumnSlot = ({ day, tasks, onTaskClick }: { day: Date, tasks: AdminTask[], onTaskClick: (t: AdminTask | 'new') => void }) => {
    const id = `col-${format(day, 'yyyy-MM-dd')}`;
    const { setNodeRef, isOver } = useDroppable({ id, data: { day, type: 'daycolumn' } });
    const { user } = useAuthStore();
    const canCreate = ['admin', 'super-admin', 'manager', 'team-leader'].includes(user?.role || '');

    return (
        <div ref={setNodeRef} className={cn(
            'min-h-[500px] border-r border-surface-200 dark:border-surface-800 p-2.5 flex flex-col gap-3 transition-colors relative',
            isOver && 'bg-brand-50/50 dark:bg-brand-950/30 ring-inset ring-2 ring-brand-400'
        )}>
            {tasks.map(t => (
                <div key={t._id} className="w-full">
                    <AdminTaskCard task={t} onClick={() => onTaskClick(t)} />
                </div>
            ))}
            {canCreate && (
                <button
                    onClick={() => onTaskClick('new')}
                    className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-surface-400 hover:text-brand-600 bg-transparent hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-lg border border-dashed border-surface-200 hover:border-brand-200 dark:border-surface-700 dark:hover:border-brand-800 transition-colors"
                >
                    <Plus size={14} /> Add task
                </button>
            )}
        </div>
    );
};

const MonthDaySlot = ({ day, isCurrentMonth, tasks, onTaskClick }: { day: Date, isCurrentMonth: boolean, tasks: AdminTask[], onTaskClick: (t: AdminTask) => void }) => {
    const id = `${format(day, 'yyyy-MM-dd')}`;
    const { setNodeRef, isOver } = useDroppable({ id, data: { day, type: 'monthday' } });

    return (
        <div ref={setNodeRef} className={cn(
            'min-h-[120px] p-1.5 border-b border-r border-surface-200 dark:border-surface-800 transition-colors relative flex flex-col',
            !isCurrentMonth && 'bg-surface-50/40 dark:bg-surface-950/20',
            isToday(day) && 'bg-brand-50/20 dark:bg-brand-950/20 ring-1 ring-inset ring-brand-200 dark:ring-brand-800',
            isOver && 'bg-brand-50/50 dark:bg-brand-900/30 ring-2 ring-inset ring-brand-400'
        )}>
            <div className="flex justify-between items-center mb-1">
                <span className={cn(
                    'w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full',
                    isToday(day) ? 'bg-brand-600 text-white' : 'text-surface-600 dark:text-surface-400'
                )}>{format(day, 'd')}</span>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto">
                {tasks.map(t => (
                    <div key={t._id} className="relative h-6">
                        <AdminTaskCard task={t} isMonthView onClick={() => onTaskClick(t)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AdminCalendarBoard: React.FC = () => {
    const { view, currentDate, tasks, updateTask, setSelectedTask } = useAdminCalendarStore();
    const [activeTask, setActiveTask] = useState<AdminTask | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    // Calculations
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Month rendering
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const handleDragStart = (e: any) => {
        const t = tasks.find(t => t._id === e.active.id);
        if (t) setActiveTask(t);
    };

    const handleDragEnd = async (e: DragEndEvent) => {
        const { active, over } = e;
        setActiveTask(null);
        if (!over) return;

        const task = tasks.find(t => t._id === active.id);
        if (!task) return;

        const data = over.data.current as any;
        if (data.type === 'daycolumn') {
            const { day } = data;
            const oldStart = new Date(task.startDateTime);
            const duration = differenceInMinutes(new Date(task.endDateTime), oldStart);
            const newStart = new Date(day);
            newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), 0, 0);
            const newEnd = addMinutes(newStart, duration);
            await updateTask(task._id, { startDateTime: newStart.toISOString(), endDateTime: newEnd.toISOString() });
        } else if (data.type === 'monthday') {
            const { day } = data;
            const oldStart = new Date(task.startDateTime);
            const duration = differenceInMinutes(new Date(task.endDateTime), oldStart);
            const newStart = new Date(day);
            newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), 0, 0);
            const newEnd = addMinutes(newStart, duration);
            await updateTask(task._id, { startDateTime: newStart.toISOString(), endDateTime: newEnd.toISOString() });
        }
    };

    const getCardStyle = (task: AdminTask, day: Date) => {
        const start = new Date(task.startDateTime);
        const end = new Date(task.endDateTime);
        if (format(start, 'yyyy-MM-dd') !== format(day, 'yyyy-MM-dd')) return null;

        const mins = start.getHours() * 60 + start.getMinutes();
        const dur = differenceInMinutes(end, start);

        return {
            top: `${(mins / 60) * 60}px`,
            height: `${Math.max((dur / 60) * 60, 30)}px`,
            position: 'absolute' as const,
            left: '4px', right: '4px', zIndex: 10
        };
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {view === 'month' && (
                <div className="flex flex-col h-full">
                    <div className="grid grid-cols-7 border-b border-surface-200 dark:border-surface-800 shrink-0 bg-white dark:bg-surface-950">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <div key={d} className="py-2.5 text-center text-xs font-semibold text-surface-500 uppercase tracking-widest">{d}</div>
                        ))}
                    </div>
                    <div className="flex-1 grid grid-cols-7 auto-rows-[minmax(120px,1fr)] bg-white dark:bg-surface-950 shrink-0 overflow-y-auto w-full min-w-[700px] sm:min-w-0">
                        {calendarDays.map(day => (
                            <MonthDaySlot
                                key={day.toISOString()}
                                day={day}
                                isCurrentMonth={isSameMonth(day, currentDate)}
                                tasks={tasks.filter(t => format(new Date(t.startDateTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))}
                                onTaskClick={setSelectedTask}
                            />
                        ))}
                    </div>
                </div>
            )}

            {(view === 'week' || view === 'day') && (
                <div className="flex flex-col h-full bg-surface-50/50 dark:bg-surface-950/20 absolute inset-0 overflow-x-auto">
                    <div className={cn("grid border-b border-surface-200 dark:border-surface-800 shrink-0 z-20 bg-white dark:bg-surface-950 shadow-sm", view === 'week' ? "grid-cols-7 min-w-[700px] sm:min-w-0" : "grid-cols-1")}>
                        {(view === 'week' ? weekDays : [currentDate]).map(day => (
                            <div key={day.toISOString()} className={cn("px-4 py-3 border-r border-surface-200 dark:border-surface-800 text-center last:border-r-0", isToday(day) && "bg-brand-50/10 dark:bg-brand-950/20")}>
                                <div className="flex items-baseline justify-center gap-1.5">
                                    <span className={cn("text-lg font-bold", isToday(day) ? "text-brand-600 dark:text-brand-400" : "text-surface-900 dark:text-white")}>{format(day, 'd')}</span>
                                    <span className={cn("text-sm font-semibold", isToday(day) ? "text-brand-600 dark:text-brand-400" : "text-surface-500")}>{format(day, 'EEE')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className={cn("grid min-h-full", view === 'week' ? "grid-cols-7 min-w-[700px] sm:min-w-0" : "grid-cols-1")}>
                            {(view === 'week' ? weekDays : [currentDate]).map(day => {
                                const thisDayTasks = tasks.filter(t => format(new Date(t.startDateTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
                                return (
                                    <DayColumnSlot
                                        key={day.toISOString()}
                                        day={day}
                                        tasks={thisDayTasks}
                                        onTaskClick={setSelectedTask}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            <DragOverlay>
                {activeTask ? (
                    <div className="opacity-90 rotate-2 cursor-grabbing shadow-2xl rounded-xl">
                        <AdminTaskCard task={activeTask} isOverlay />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default AdminCalendarBoard;
