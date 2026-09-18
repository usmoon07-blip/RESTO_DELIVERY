import config from '../config/default.js';
import ProductModel from '../models/Product.js';
import OrderModel from '../models/Order.js';
import UserModel from '../models/User.js';
import bot, { sendMessageSafe } from '../core/bot.js';
import {
  formatPrice,
  DELIVERY_LABELS,
  PAYMENT_LABELS,
} from '../utils/format.js';

/** GET /api/client/config — Mini App uchun sozlamalar */
export function getAppConfig(req, res) {
  res.json({
    ok: true,
    data: {
      restaurantName: config.business.restaurantName,
      currency: config.business.currency,
      deliveryFee: config.business.deliveryFee,
      freeDeliveryFrom: config.business.freeDeliveryFrom,
    },
  });
}

/** GET /api/client/me — profil */
export async function getMe(req, res) {
  res.json({
    ok: true,
    data: {
      id: req.user.id,
      telegramId: req.user.telegramId,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      phone: req.user.phone,
      isDevUser: Boolean(req.isDevUser),
    },
  });
}

/** POST /api/client/me/phone — telefon raqamni saqlash */
export async function savePhone(req, res, next) {
  try {
    const phone = String(req.body?.phone || '').trim();

    if (phone.replace(/\D/g, '').length < 9) {
      return res.status(400).json({ ok: false, error: "Telefon raqam noto'g'ri" });
    }

    const user = await UserModel.updatePhone(req.user.telegramId, phone);
    res.json({ ok: true, data: { phone: user.phone } });
  } catch (error) {
    next(error);
  }
}

/** GET /api/client/products */
export async function getProducts(req, res, next) {
  try {
    const products = await ProductModel.findActive();
    res.json({ ok: true, data: products });
  } catch (error) {
    next(error);
  }
}

/** GET /api/client/categories */
export async function getCategories(req, res, next) {
  try {
    const categories = await ProductModel.categories();
    res.json({ ok: true, data: categories });
  } catch (error) {
    next(error);
  }
}

/** GET /api/client/orders — mening buyurtmalarim */
export async function getMyOrders(req, res, next) {
  try {
    const orders = await OrderModel.findByUserId(req.user.id);
    res.json({ ok: true, data: orders });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/client/orders — buyurtmani qabul qilish
 * Narxlar mijoz tomonidan emas, bazadan olinadi (xavfsizlik uchun).
 */
export async function createOrder(req, res, next) {
  try {
    const {
      items = [],
      deliveryType = 'DELIVERY',
      paymentMethod = 'CASH',
      address = '',
      latitude = null,
      longitude = null,
      phone = '',
      comment = '',
    } = req.body || {};

    // --- Validatsiya ---
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: "Savatcha bo'sh" });
    }

    if (!['DELIVERY', 'PICKUP'].includes(deliveryType)) {
      return res.status(400).json({ ok: false, error: "Yetkazish turi noto'g'ri" });
    }

    if (!['CASH', 'CARD'].includes(paymentMethod)) {
      return res.status(400).json({ ok: false, error: "To'lov turi noto'g'ri" });
    }

    const cleanPhone = String(phone).trim();
    if (cleanPhone.replace(/\D/g, '').length < 9) {
      return res
        .status(400)
        .json({ ok: false, error: 'Telefon raqamingizni kiriting' });
    }

    if (deliveryType === 'DELIVERY' && !String(address).trim() && latitude == null) {
      return res
        .status(400)
        .json({ ok: false, error: 'Yetkazib berish manzilini kiriting' });
    }

    // --- Narxlarni bazadan qayta hisoblash ---
    const ids = [...new Set(items.map((i) => Number(i.productId)).filter(Boolean))];
    const products = await ProductModel.findManyByIds(ids);
    const productMap = new Map(products.map((p) => [p.id, p]));

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(Number(item.productId));
      if (!product || !product.isActive) continue;

      const qty = Math.max(1, Math.min(50, Number(item.qty) || 1));
      const lineTotal = product.newPrice * qty;
      subtotal += lineTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.newPrice,
        qty,
        imageUrl: product.imageUrl,
        lineTotal,
      });
    }

    if (orderItems.length === 0) {
      return res
        .status(400)
        .json({ ok: false, error: 'Tanlangan mahsulotlar topilmadi' });
    }

    const { deliveryFee: fee, freeDeliveryFrom } = config.business;
    const deliveryFee =
      deliveryType === 'DELIVERY' && subtotal < freeDeliveryFrom ? fee : 0;
    const total = subtotal + deliveryFee;

    // --- Bazaga yozish ---
    const order = await OrderModel.create({
      userId: req.user.id,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      deliveryType,
      paymentMethod,
      address: String(address).trim() || null,
      latitude: latitude != null ? Number(latitude) : null,
      longitude: longitude != null ? Number(longitude) : null,
      phone: cleanPhone,
      comment: String(comment).trim() || null,
    });

    // Telefon raqamni profilga ham saqlab qo'yamiz
    if (req.user.phone !== cleanPhone) {
      await UserModel.updatePhone(req.user.telegramId, cleanPhone).catch(() => {});
    }

    // --- Botdan mijozga xabar ---
    const itemLines = orderItems
      .map((i) => `• ${i.name} × ${i.qty} — ${formatPrice(i.lineTotal)}`)
      .join('\n');

    const message = [
      '🍕 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>',
      'Kuryerimiz tez orada bog\'lanadi 🍕',
      '',
      `<b>Buyurtma raqami:</b> #${order.id}`,
      '',
      itemLines,
      '',
      `<b>Mahsulotlar:</b> ${formatPrice(subtotal)}`,
      deliveryFee > 0
        ? `<b>Yetkazib berish:</b> ${formatPrice(deliveryFee)}`
        : deliveryType === 'DELIVERY'
          ? '<b>Yetkazib berish:</b> Bepul 🎁'
          : null,
      `<b>Jami:</b> ${formatPrice(total)}`,
      '',
      `<b>Turi:</b> ${DELIVERY_LABELS[deliveryType]}`,
      `<b>To'lov:</b> ${PAYMENT_LABELS[paymentMethod]}`,
      order.address ? `<b>Manzil:</b> ${order.address}` : null,
      `<b>Telefon:</b> ${cleanPhone}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (!req.isDevUser) {
      await sendMessageSafe(req.user.telegramId, message);

      if (order.latitude != null && order.longitude != null) {
        await sendMessageSafe(
          req.user.telegramId,
          '📍 Qabul qilingan manzilingiz:',
        );
        try {
          await bot.telegram.sendLocation(
            req.user.telegramId,
            order.latitude,
            order.longitude,
          );
        } catch {
          /* ignore */
        }
      }
    }

    console.log(`🧾 Yangi buyurtma #${order.id} — ${formatPrice(total)}`);

    res.status(201).json({ ok: true, data: order });
  } catch (error) {
    next(error);
  }
}

export default {
  getAppConfig,
  getMe,
  savePhone,
  getProducts,
  getCategories,
  getMyOrders,
  createOrder,
};
