import { create } from 'zustand';
import API from '../../../../api/axios.ts';

export type CalendarView = 'month' | 'week' | 'day';

export interface AdminTask {
    _id: string;
    title: string;
    description: string;
    assignedUser: string;
    startDateTime: string;
    endDateTime: string;
    priority: 'red' | 'green' | 'blue' | 'yellow' | 'none';
    status: 'Pending' | 'In Progress' | 'Done';
    tags: string[];
    comments: { _id: string; text: string; userName: string; createdAt: string }[];
    attachments: { _id: string; fileName: string; fileUrl: string; fileType: string }[];
}

interface AdminCalendarState {
    view: CalendarView;
    currentDate: Date;
    tasks: AdminTask[];
    loading: boolean;
    selectedTask: AdminTask | 'new' | null;
    setView: (view: CalendarView) => void;
    setSelectedTask: (task: AdminTask | 'new' | null) => void;
    setCurrentDate: (date: Date | ((prev: Date) => Date)) => void;
    fetchTasks: (start: Date, end: Date) => Promise<void>;
    createTask: (data: Partial<AdminTask>) => Promise<void>;
    updateTask: (id: string, data: Partial<AdminTask>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    addComment: (taskId: string, comment: any) => Promise<void>;
    uploadAttachment: (taskId: string, file: File) => Promise<void>;
}

export const useAdminCalendarStore = create<AdminCalendarState>((set) => ({
    view: 'week',
    currentDate: new Date(),
    tasks: [],
    loading: false,
    selectedTask: null,

    setView: (view) => set({ view }),
    setSelectedTask: (task) => set({ selectedTask: task }),

    setCurrentDate: (dateOrFn) => {
        set((state) => ({
            currentDate: typeof dateOrFn === 'function' ? dateOrFn(state.currentDate) : dateOrFn,
        }));
    },

    fetchTasks: async (start, end) => {
        set({ loading: true });
        try {
            const res = await API.get('/admin/calendar/tasks', {
                params: { 
                    start: start.toISOString(), 
                    end: end.toISOString() 
                }
            });
            set({ tasks: res.data, loading: false });
        } catch (err) {
            console.error(err);
            set({ tasks: [], loading: false });
        }
    },

    createTask: async (data) => {
        try {
            const res = await API.post('/admin/calendar/tasks', data);
            set((state) => ({ tasks: [...state.tasks, res.data] }));
        } catch (err) {
            console.error(err);
        }
    },

    updateTask: async (id, data) => {
        try {
            const res = await API.put(`/admin/calendar/tasks/${id}`, data);
            set((state) => ({
                tasks: state.tasks.map((t) => (t._id === id ? res.data : t)),
                selectedTask:
                    state.selectedTask && state.selectedTask !== 'new' && state.selectedTask._id === id
                        ? res.data
                        : state.selectedTask,
            }));
        } catch (err) {
            console.error(err);
        }
    },

    deleteTask: async (id) => {
        try {
            await API.delete(`/admin/calendar/tasks/${id}`);
            set((state) => ({
                tasks: state.tasks.filter((t) => t._id !== id),
                selectedTask:
                    state.selectedTask && state.selectedTask !== 'new' && state.selectedTask._id === id
                        ? null
                        : state.selectedTask,
            }));
        } catch (err) {
            console.error(err);
        }
    },

    addComment: async (taskId, comment) => {
        try {
            const res = await API.post(`/admin/calendar/tasks/${taskId}/comments`, comment);
            set((state) => ({
                tasks: state.tasks.map((t) => (t._id === taskId ? res.data : t)),
                selectedTask:
                    state.selectedTask && state.selectedTask !== 'new' && state.selectedTask._id === taskId
                        ? res.data
                        : state.selectedTask,
            }));
        } catch (err) {
            console.error(err);
        }
    },

    uploadAttachment: async (taskId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await API.post(`/admin/calendar/tasks/${taskId}/attachments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set((state) => ({
                tasks: state.tasks.map((t) => (t._id === taskId ? res.data : t)),
                selectedTask:
                    state.selectedTask && state.selectedTask !== 'new' && state.selectedTask._id === taskId
                        ? res.data
                        : state.selectedTask,
            }));
        } catch (err) {
            console.error(err);
        }
    }
}));
