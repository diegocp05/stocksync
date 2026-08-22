import { Router } from 'express';
import { generateOrdersFromLowStock, listOrders, downloadOrderPDF } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/generate', generateOrdersFromLowStock);
router.get('/', listOrders);
router.get('/:id/pdf', downloadOrderPDF);

export default router;
