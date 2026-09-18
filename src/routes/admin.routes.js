import { Router } from 'express';
import { adminAuth } from '../middlewares/auth.middleware.js';
import adminController from '../controllers/adminController.js';

const router = Router();

// Barcha admin yo'llari parol bilan himoyalangan
router.use(adminAuth);

router.post('/login', adminController.login);
router.get('/stats', adminController.getStats);

// Buyurtmalar
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrder);
router.patch('/orders/:id/status', adminController.updateOrderStatus);
router.delete('/orders/:id', adminController.deleteOrder);

// Mahsulotlar (CRUD)
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Mijozlar
router.get('/users', adminController.getUsers);

export default router;
