import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getProducts);
router.post('/', createProduct);

export default router;
