import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '../../../utils/helpers';
import { useAdminCalendarStore } from './store/useAdminCalendarStore';
import { AdminCalendarBoard } from './components/AdminCalendarBoard.tsx';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay, format, addWeeks, subWeeks, addMonths, subMonths, addDays, subDays } from 'date-fns';
import { AdminTaskModal } from './components/AdminTaskModal.tsx';
import { useAuthStore } from '../../../context/authStore';

export const AdminCalendarPage: React.FC = () => {
    const { view, setView, currentDate, setCurrentDate, fetchTasks, setSelectedTask } = useAdminCalendarStore();
    const { user } = useAuthStore();
    const canCreate = ['admin', 'super-admin', 'manager', 'team-leader'].includes(user?.role || '');

    useEffect(() => {
        let start, end;
        if (view === 'month') {
            start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
            end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
        } else if (view === 'week') {
            start = startOfWeek(currentDate, { weekStartsOn: 1 });
            end = endOfWeek(currentDate, { weekStartsOn: 1 });
        } else {
            start = startOfDay(currentDate);
            end = endOfDay(currentDate);
        }
        fetchTasks(start, end);
    }, [currentDate, view, fetchTasks]);

    const navigate = (dir: 'prev' | 'next') => {
        if (view === 'month') {
            setCurrentDate((prev: Date) => dir === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
        } else if (view === 'week') {
            setCurrentDate((prev: Date) => dir === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
        } else {
            setCurrentDate((prev: Date) => dir === 'next' ? addDays(prev, 1) : subDays(prev, 1));
        }
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-110px)] px-2 sm:px-4 lg:px-6">
            <div className="page-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 mb-6">
                <div>
                    <h1 className="page-title text-2xl sm:text-3xl">Calendar</h1>
                    <p className="page-subtitle text-xs sm:text-sm">Advanced schedule and task management</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    {canCreate && (
                        <button onClick={() => setSelectedTask('new')} className="btn-primary btn-md sm:btn-sm rounded-xl grow sm:grow-0">
                            <Plus size={16} /> <span className="sm:inline">Create Task</span>
                        </button>
                    )}

                    <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl p-1">
                        <button
                            onClick={() => setView('month')}
                            className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                                view === 'month' ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500')}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                                view === 'week' ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500')}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setView('day')}
                            className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                                view === 'day' ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500')}
                        >
                            Day
                        </button>
                    </div>
                </div>
            </div>

            <div className="card flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-surface-100 dark:border-surface-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('prev')} className="btn-ghost w-8 h-8 rounded-xl"><ChevronLeft size={16} /></button>
                        <h2 className="font-display font-semibold text-surface-900 dark:text-white text-lg w-52 text-center">
                            {view === 'month' && format(currentDate, 'MMMM yyyy')}
                            {view === 'week' && `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`}
                            {view === 'day' && format(currentDate, 'EEEE, MMM d, yyyy')}
                        </h2>
                        <button onClick={() => navigate('next')} className="btn-ghost w-8 h-8 rounded-xl"><ChevronRight size={16} /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="btn-secondary btn-sm text-xs ml-2">Today</button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto relative bg-surface-50/30 dark:bg-surface-950/30">
                    <AdminCalendarBoard />
                </div>
            </div>

            <AdminTaskModal />
        </div>
    );
};

export default AdminCalendarPage;
