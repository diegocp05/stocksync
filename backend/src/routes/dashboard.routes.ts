import { Router } from 'express';
import { getMetrics } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/metrics', getMetrics);

export default router;
