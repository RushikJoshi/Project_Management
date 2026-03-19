import express from 'express';
import { z } from 'zod';

import { requireAuth } from '../../../middleware/auth.middleware.js';
import { validateBody } from '../../../middleware/validate.middleware.js';
import * as TasksController from '../../../controllers/tasks.controller.js';

const router = express.Router();

router.use(requireAuth);

const taskCreateSchema = z.object({
  projectId: z.string().min(10),
  title: z.string().trim().min(2).max(300),
  description: z.string().trim().max(10000).optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'in_review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeIds: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  order: z.number().optional(),
  labels: z.array(z.string()).optional(),
});

const taskUpdateSchema = taskCreateSchema.partial().omit({ projectId: true });

const moveStatusSchema = z.object({
  status: z.enum(['backlog', 'todo', 'in_progress', 'in_review', 'done']),
});

router.get('/', TasksController.list);
router.post('/', validateBody(taskCreateSchema), TasksController.create);
router.put('/:id', validateBody(taskUpdateSchema), TasksController.update);
router.delete('/:id', TasksController.remove);
router.patch('/:id/status', validateBody(moveStatusSchema), TasksController.moveStatus);

export default router;

