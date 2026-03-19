import axios from 'axios';

// Base API instance — connect to real backend by changing baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flowboard-auth');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (parsed?.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
      } catch {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('flowboard-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Typed service functions (stubbed — replace with real API calls)
export const projectsService = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: unknown) => api.post('/projects', data),
  update: (id: string, data: unknown) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const tasksService = {
  getAll: (projectId?: string) => api.get('/tasks', { params: { projectId } }),
  getById: (id: string) => api.get(`/tasks/${id}`),
  create: (data: unknown) => api.post('/tasks', data),
  update: (id: string, data: unknown) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  move: (id: string, status: string) => api.patch(`/tasks/${id}/status`, { status }),
};

export const usersService = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: unknown) => api.post('/users', data),
  update: (id: string, data: unknown) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  me: () => api.get('/users/me'),
};

export const teamsService = {
  getAll: () => api.get('/teams'),
  getById: (id: string) => api.get(`/teams/${id}`),
  create: (data: unknown) => api.post('/teams', data),
  update: (id: string, data: unknown) => api.put(`/teams/${id}`, data),
};

export const workspacesService = {
  getAll: () => api.get('/workspaces'),
};

export const companiesService = {
  getAll: () => api.get('/companies'),
  create: (data: unknown) => api.post('/companies', data),
};

export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: unknown) => api.post('/auth/register', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  logout: () => api.post('/auth/logout'),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
};

export const quickTasksService = {
  getAll: () => api.get('/quick-tasks'),
  create: (data: unknown) => api.post('/quick-tasks', data),
  update: (id: string, data: unknown) => api.put(`/quick-tasks/${id}`, data),
  delete: (id: string) => api.delete(`/quick-tasks/${id}`),
};

export const notificationsService = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const activityService = {
  getRecent: (limit = 50) => api.get('/activity', { params: { limit } }),
};
