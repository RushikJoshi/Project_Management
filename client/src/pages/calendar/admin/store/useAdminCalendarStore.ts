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

import { addHours, startOfDay, addDays, subDays } from 'date-fns';

const today = new Date();
const mockTasks: AdminTask[] = [
    {
        _id: '1', title: 'Executive meeting', description: 'Briefing with stakeholders',
        assignedUser: 'Sarah', startDateTime: addHours(startOfDay(today), 9).toISOString(), endDateTime: addHours(startOfDay(today), 11).toISOString(),
        priority: 'blue', status: 'Pending', tags: ['meeting'], comments: [], attachments: []
    },
    {
        _id: '2', title: 'Analyze results', description: 'Weekly performance metrics',
        assignedUser: 'John', startDateTime: addHours(startOfDay(subDays(today, 1)), 10).toISOString(), endDateTime: addHours(startOfDay(subDays(today, 1)), 12).toISOString(),
        priority: 'none', status: 'Done', tags: [], comments: [], attachments: []
    },
    {
        _id: '3', title: 'Negotiate contract terms', description: 'With John',
        assignedUser: 'Mike', startDateTime: addHours(startOfDay(today), 12).toISOString(), endDateTime: addHours(startOfDay(today), 14).toISOString(),
        priority: 'yellow', status: 'In Progress', tags: [], comments: [], attachments: []
    },
    {
        _id: '4', title: 'Discuss design drafts', description: 'Website Development',
        assignedUser: 'Emma', startDateTime: addHours(startOfDay(today), 13).toISOString(), endDateTime: addHours(startOfDay(today), 14.5).toISOString(),
        priority: 'yellow', status: 'Pending', tags: [], comments: [], attachments: []
    },
    {
        _id: '5', title: 'Prepare information', description: 'Webinar slide deck',
        assignedUser: 'Sofia', startDateTime: addHours(startOfDay(today), 12.5).toISOString(), endDateTime: addHours(startOfDay(today), 15.5).toISOString(),
        priority: 'green', status: 'Pending', tags: [], comments: [], attachments: []
    },
    {
        _id: '6', title: 'Write email copy', description: 'Onboarding campaign',
        assignedUser: 'Marry', startDateTime: addHours(startOfDay(addDays(today, 1)), 13).toISOString(), endDateTime: addHours(startOfDay(addDays(today, 1)), 14).toISOString(),
        priority: 'green', status: 'Pending', tags: [], comments: [], attachments: []
    },
    {
        _id: '7', title: 'Analyze ROI of campaigns', description: 'Marketing meeting',
        assignedUser: 'Sofia', startDateTime: addHours(startOfDay(addDays(today, 1)), 9).toISOString(), endDateTime: addHours(startOfDay(addDays(today, 1)), 10).toISOString(),
        priority: 'red', status: 'Pending', tags: [], comments: [], attachments: []
    }
];

export const useAdminCalendarStore = create<AdminCalendarState>((set, get) => ({
    view: 'week',
    currentDate: new Date(),
    tasks: mockTasks,
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
            set({ loading: false });
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
        set((state) => ({
            tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...data } : t)),
        }));
        try {
            await API.put(`/admin/calendar/tasks/${id}`, data);
        } catch (err) {
            console.error(err);
        }
    },

    deleteTask: async (id) => {
        set((state) => ({
            tasks: state.tasks.filter((t) => t._id !== id),
        }));
        try {
            await API.delete(`/admin/calendar/tasks/${id}`);
        } catch (err) {
            console.error(err);
        }
    },

    addComment: async (taskId, comment) => {
        try {
            const res = await API.post(`/admin/calendar/tasks/${taskId}/comments`, comment);
            set((state) => ({
                tasks: state.tasks.map((t) => (t._id === taskId ? res.data : t)),
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
            }));
        } catch (err) {
            console.error(err);
        }
    }
}));
