import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { AdminTask } from '../store/useAdminCalendarStore.ts';
import { format } from 'date-fns';
import { cn } from '../../../../utils/helpers.ts';
import { Clock } from 'lucide-react';

const priorityColors = {
    red: 'bg-[#ffd3d3] text-[#a03030]',
    green: 'bg-[#c5eadb] text-[#2c7760]',
    blue: 'bg-[#d3e3fd] text-[#2e5ea7]',
    yellow: 'bg-[#ffe4b5] text-[#a06a1a]', // Or orange-ish
    none: 'bg-white text-surface-800 border-surface-200 dark:bg-surface-800 dark:border-surface-700 dark:text-surface-100 border',
};

export const AdminTaskCard = ({ task, isOverlay = false, onClick, isMonthView = false }: { task: AdminTask, isOverlay?: boolean, onClick?: () => void, isMonthView?: boolean }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task._id, data: task });

    if (isMonthView) {
        return (
            <div ref={setNodeRef} {...listeners} {...attributes} onClick={e => { e.stopPropagation(); onClick?.(); }}
                className={cn('px-2 py-1 rounded-md text-[10px] font-medium truncate cursor-grab active:cursor-grabbing mx-1 mb-1', priorityColors[task.priority])}
                style={{ opacity: isDragging ? 0.4 : 1 }}>
                {format(new Date(task.startDateTime), 'HH:mm')} {task.title}
            </div>
        );
    }

    // Calculate duration
    const start = new Date(task.startDateTime);
    const end = new Date(task.endDateTime);
    const durationMins = (end.getTime() - start.getTime()) / 60000;
    let durationText = '';
    if (durationMins >= 60) {
        const h = Math.floor(durationMins / 60);
        const m = Math.floor(durationMins % 60);
        durationText = `${h}h${m > 0 ? ` ${m}m` : ''}`;
    } else {
        durationText = `${durationMins}m`;
    }

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} onClick={e => { e.stopPropagation(); onClick?.(); }}
            className={cn('w-full p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab border-none flex flex-col gap-2 overflow-hidden relative group', priorityColors[task.priority])}
            style={{ opacity: isDragging ? 0.5 : 1 }}>

            <div className="flex items-center gap-2 mb-1 pointer-events-none">
                <Clock size={12} className="opacity-70" />
                <span className="text-[11px] font-semibold opacity-90">{format(start, 'HH:mm')} - {format(end, 'HH:mm')}</span>
            </div>

            <p className="font-semibold text-sm leading-tight pointer-events-none">{task.title}</p>

            {task.description && (
                <p className="text-[10px] opacity-70 line-clamp-2 mt-1 pointer-events-none">{task.description}</p>
            )}

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5 pointer-events-none">
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[9px] font-bold uppercase tracking-wider">{task.status}</span>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold opacity-70">{durationText}</span>
                    {task.assignedUser && (
                        <div className="w-5 h-5 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center text-[9px] font-bold shadow-sm">
                            {task.assignedUser.substring(0, 1).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
