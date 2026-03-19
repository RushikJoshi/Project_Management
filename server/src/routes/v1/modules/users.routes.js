import express from 'express';

import { requireAuth } from '../../../middleware/auth.middleware.js';
import * as UsersController from '../../../controllers/users.controller.js';

const router = express.Router();
router.use(requireAuth);

router.get('/me', UsersController.me);
router.post('/', UsersController.create);
router.get('/', UsersController.list);
router.get('/:id', UsersController.get);

export default router;

