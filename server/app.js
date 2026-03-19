import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mongoose from 'mongoose';

import path from 'path';
import { fileURLToPath } from 'url';

import { requestLogger } from './src/utils/logger.js';
import { notFoundHandler, errorHandler } from './src/middleware/error.middleware.js';
import { sanitizeMongoBodyParams } from './src/middleware/sanitize.middleware.js';
import v1Routes from './src/routes/v1/index.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const corsOrigins = corsOrigin.split(',').map((s) => s.trim()).filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(requestLogger());
app.use(sanitizeMongoBodyParams);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (corsOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS_NOT_ALLOWED'), false);
  },
  credentials: false,
}));

app.use(express.json({ limit: '1mb' }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}));

app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));
app.get('/readyz', (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  if (ready) return res.status(200).json({ ok: true, db: 'connected' });
  res.status(503).json({ ok: false, db: 'disconnected', readyState: mongoose.connection.readyState });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1', v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;