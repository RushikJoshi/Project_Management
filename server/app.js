import express from 'express';
const app = express();
import ProjectRoutes from './src/routes/ProjectRoutes.js';
import cors from 'cors';
const allowedOrigins = 'http://localhost:5173';

import path from 'path';
import { fileURLToPath } from 'url';
import adminCalendarRoutes from './src/routes/admin/calendar.routes.js';
import adminChatRoutes from './src/routes/admin/adminChat.routes.js';
import adminDashboardRoutes from './src/routes/admin/adminDashboard.routes.js';
import authRoutes from './src/routes/AuthRoutes.js';
import adminNotificationRoutes from './src/routes/admin/adminNotification.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/projects', ProjectRoutes);
app.use('/api/admin/calendar', adminCalendarRoutes);
app.use('/api/admin/chat', adminChatRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/notifications', adminNotificationRoutes);

export default app;