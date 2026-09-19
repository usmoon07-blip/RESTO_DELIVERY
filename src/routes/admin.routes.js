import { Router } from 'express';
import { adminAuth } from '../middlewares/auth.middleware.js';
import adminController from '../controllers/adminController.js';
import handleUpload from '../middlewares/upload.middleware.js';

const router = Router();

// Barcha admin yo'llari parol bilan himoyalangan
router.use(adminAuth);

router.post('/login', adminController.login);
router.get('/stats', adminController.getStats);
router.get('/report', adminController.getReport);

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

// Surat yuklash
router.post('/upload', handleUpload, adminController.uploadProductImage);

// Promokodlar
router.get('/promos', adminController.getPromos);
router.post('/promos', adminController.createPromo);
router.put('/promos/:id', adminController.updatePromo);
router.delete('/promos/:id', adminController.deletePromo);

// Mijozlar
router.get('/users', adminController.getUsers);

export default router;
