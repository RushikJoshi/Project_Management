import express from 'express';
import { z } from 'zod';

import { requireAuth } from '../../../middleware/auth.middleware.js';
import { validateBody } from '../../../middleware/validate.middleware.js';
import * as QuickTasksController from '../../../controllers/quickTasks.controller.js';

const router = express.Router();
router.use(requireAuth);

const createSchema = z.object({
  title: z.string().trim().min(2).max(300),
  description: z.string().trim().max(10000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().optional(),
});

router.get('/', QuickTasksController.list);
router.post('/', validateBody(createSchema), QuickTasksController.create);
router.put('/:id', validateBody(createSchema.partial()), QuickTasksController.update);
router.delete('/:id', QuickTasksController.remove);

export default router;

