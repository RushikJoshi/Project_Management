import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/Modal/index.tsx';
import { useAdminCalendarStore, AdminTask } from '../store/useAdminCalendarStore.ts';
import { addHours, format, startOfHour } from 'date-fns';
import { Clock, Tag, AlignLeft, Users, Paperclip, MessageSquare, Trash2, Send, Plus } from 'lucide-react';
import { useAuthStore } from '../../../../context/authStore.ts';

export const AdminTaskModal = () => {
    const { selectedTask, setSelectedTask, createTask, updateTask, deleteTask, addComment, uploadAttachment } = useAdminCalendarStore();
    const { user } = useAuthStore();

    const isNew = selectedTask === 'new';
    const task = isNew ? null : (selectedTask as AdminTask);
    const isOpen = selectedTask !== null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('none');
    const [status, setStatus] = useState('Pending');
    const [startTime, setStartTime] = useState(startOfHour(addHours(new Date(), 1)));
    const [endTime, setEndTime] = useState(addHours(startTime, 1));
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTitle(task?.title || '');
            setDescription(task?.description || '');
            setPriority(task?.priority || 'none');
            setStatus(task?.status || 'Pending');
            setStartTime(task ? new Date(task.startDateTime) : startOfHour(addHours(new Date(), 1)));
            setEndTime(task ? new Date(task.endDateTime) : addHours(startOfHour(addHours(new Date(), 1)), 1));
        }
    }, [isOpen, task]);

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            title, description, priority: priority as AdminTask['priority'], status: status as AdminTask['status'],
            startDateTime: startTime.toISOString(),
            endDateTime: endTime.toISOString(),
        };
        if (isNew) await createTask(data);
        else if (task) await updateTask(task._id, data);
        setSelectedTask(null);
    };

    const handleDelete = async () => {
        if (!isNew && task && window.confirm("Are you sure you want to delete this task?")) {
            await deleteTask(task._id);
            setSelectedTask(null);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isNew || !task) return;
        await addComment(task._id, {
            text: commentText,
            userId: user?.id || 'admin',
            userName: user?.name || 'Admin'
        });
        setCommentText('');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || isNew || !task) return;
        await uploadAttachment(task._id, e.target.files[0]);
    };

    return (
        <Modal open={isOpen} onClose={() => setSelectedTask(null)} title={isNew ? 'Create Admin Task' : 'Edit Admin Task'} size="lg">
            <div className="flex flex-col md:flex-row h-[70vh] md:h-auto overflow-hidden">
                <form onSubmit={handleSave} className="p-6 space-y-5 flex-1 overflow-y-auto border-r border-surface-200 dark:border-surface-800">
                    <input
                        required type="text" placeholder="Task title"
                        value={title} onChange={e => setTitle(e.target.value)}
                        className="w-full bg-transparent text-xl font-display font-semibold border-none outline-none placeholder:text-surface-300 dark:placeholder:text-surface-700 text-surface-900 dark:text-white"
                    />

                    <div className="flex flex-col gap-4 bg-surface-50/50 dark:bg-surface-900/30 p-4 rounded-xl border border-surface-200 dark:border-surface-800">
                        <div className="flex items-center gap-3">
                            <Clock size={16} className="text-surface-400 w-24" />
                            <div className="flex items-center gap-2 flex-1">
                                <input type="datetime-local" required value={format(startTime, "yyyy-MM-dd'T'HH:mm")} onChange={e => setStartTime(new Date(e.target.value))} className="input h-9 text-xs flex-1" />
                                <span className="text-surface-400">—</span>
                                <input type="datetime-local" required value={format(endTime, "yyyy-MM-dd'T'HH:mm")} onChange={e => setEndTime(new Date(e.target.value))} className="input h-9 text-xs flex-1" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Tag size={16} className="text-surface-400 w-24" />
                            <select value={priority} onChange={e => setPriority(e.target.value)} className="input h-9 text-xs flex-1">
                                <option value="none">No Priority</option>
                                <option value="red">High (Red)</option>
                                <option value="yellow">Medium (Yellow)</option>
                                <option value="blue">Normal (Blue)</option>
                                <option value="green">Low (Green)</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-24 text-surface-400 text-xs font-semibold uppercase tracking-widest pl-1">Status</div>
                            <select value={status} onChange={e => setStatus(e.target.value)} className="input h-9 text-xs flex-1">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <AlignLeft size={16} className="text-surface-400 mt-2" />
                        <textarea placeholder="Add a detailed description..." value={description} onChange={e => setDescription(e.target.value)} className="input min-h-[100px] py-2 flex-1 resize-y box-border overflow-hidden" />
                    </div>

                    <div className="flex justify-between gap-3 pt-4 mt-6 border-t border-surface-100 dark:border-surface-800">
                        {isNew ? <div /> : (
                            <button type="button" onClick={handleDelete} className="btn-ghost btn-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold"><Trash2 size={16} /> Delete</button>
                        )}
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setSelectedTask(null)} className="btn-ghost btn-md font-semibold">Cancel</button>
                            <button type="submit" className="btn-primary btn-md font-semibold px-6 shadow-md">{isNew ? 'Create Task' : 'Save Changes'}</button>
                        </div>
                    </div>
                </form>

                {/* Right side panel for comments and attachments */}
                {!isNew && task && (
                    <div className="w-full md:w-80 bg-surface-50 dark:bg-surface-900/30 flex flex-col">
                        <div className="p-4 border-b border-surface-200 dark:border-surface-800 shrink-0">
                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3"><Paperclip size={14} /> Attachments</h4>
                            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                                {task.attachments?.map((att: any) => (
                                    <a key={att._id} href={att.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 text-xs hover:border-brand-500 transition-colors">
                                        <div className="w-6 h-6 rounded bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0"><Paperclip size={12} /></div>
                                        <span className="truncate flex-1">{att.fileName}</span>
                                    </a>
                                ))}
                            </div>
                            <label className="btn-secondary btn-sm w-full cursor-pointer justify-center border border-dashed border-surface-300 dark:border-surface-700 hover:border-brand-500 hover:text-brand-600 transition-colors">
                                <Plus size={14} /> Upload File
                                <input type="file" className="hidden" onChange={handleFileUpload} />
                            </label>
                        </div>

                        <div className="flex-1 flex flex-col p-4 overflow-hidden">
                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 shrink-0"><MessageSquare size={14} /> Comments</h4>
                            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                                {task.comments?.map((c: any) => (
                                    <div key={c._id} className="bg-white dark:bg-surface-800 p-3 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold">{c.userName}</span>
                                            <span className="text-[9px] text-surface-400">{format(new Date(c.createdAt), 'MMM d, HH:mm')}</span>
                                        </div>
                                        <p className="text-xs text-surface-600 dark:text-surface-300">{c.text}</p>
                                    </div>
                                ))}
                                {(!task.comments || task.comments.length === 0) && (
                                    <p className="text-xs text-surface-400 text-center py-4">No comments yet</p>
                                )}
                            </div>

                            <form onSubmit={handleComment} className="flex gap-2 mt-auto shrink-0 relative">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="input h-9 text-xs flex-1 pr-9"
                                />
                                <button type="submit" disabled={!commentText.trim()} className="absolute right-1 top-1 bottom-1 w-7 flex items-center justify-center text-brand-600 disabled:opacity-50 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded transition-colors"><Send size={14} /></button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AdminTaskModal;
