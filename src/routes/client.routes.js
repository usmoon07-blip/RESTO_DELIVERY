import { Router } from 'express';
import { telegramAuth } from '../middlewares/auth.middleware.js';
import cartController from '../controllers/cartController.js';

const router = Router();

// Ochiq: katalog va sozlamalar
router.get('/config', cartController.getAppConfig);
router.get('/products', cartController.getProducts);
router.get('/categories', cartController.getCategories);
router.get('/promos', cartController.getPromos);
router.post('/promo/check', cartController.checkPromo);

// Himoyalangan: Telegram initData talab qilinadi
router.get('/me', telegramAuth, cartController.getMe);
router.post('/me/phone', telegramAuth, cartController.savePhone);
router.get('/orders', telegramAuth, cartController.getMyOrders);
router.post('/orders', telegramAuth, cartController.createOrder);

export default router;
