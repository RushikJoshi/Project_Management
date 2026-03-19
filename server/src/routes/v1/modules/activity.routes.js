import express from 'express';

import { requireAuth } from '../../../middleware/auth.middleware.js';
import * as ActivityController from '../../../controllers/activity.controller.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', ActivityController.list);

export default router;

