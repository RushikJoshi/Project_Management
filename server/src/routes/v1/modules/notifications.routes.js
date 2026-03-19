import express from 'express';

import { requireAuth } from '../../../middleware/auth.middleware.js';
import * as NotificationsController from '../../../controllers/notifications.controller.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', NotificationsController.list);
router.patch('/:id/read', NotificationsController.markRead);
router.patch('/read-all', NotificationsController.markAllRead);

export default router;

