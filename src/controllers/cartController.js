import config from '../config/default.js';
import ProductModel from '../models/Product.js';
import OrderModel from '../models/Order.js';
import UserModel from '../models/User.js';
import PromoCodeModel, { evaluatePromo } from '../models/PromoCode.js';
import bot, { sendMessageSafe } from '../core/bot.js';
import { formatPrice } from '../utils/format.js';
import { LANGUAGES, t, toFieldLang } from '../i18n/index.js';

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
      language: req.user.language,
      isDevUser: Boolean(req.isDevUser),
    },
  });
}

/** POST /api/client/me/phone — telefon raqamni saqlash */
export async function savePhone(req, res, next) {
  try {
    const phone = String(req.body?.phone || '').trim();

    if (phone.replace(/\D/g, '').length < 9) {
      return res
        .status(400)
        .json({ ok: false, error: t(req.user.language, 'errPhoneInvalid') });
    }

    const user = await UserModel.updatePhone(req.user.telegramId, phone);
    res.json({ ok: true, data: { phone: user.phone } });
  } catch (error) {
    next(error);
  }
}

/** POST /api/client/me/language — tilni saqlash */
export async function saveLanguage(req, res, next) {
  try {
    const language = String(req.body?.language || '').toUpperCase();

    if (!LANGUAGES.includes(language)) {
      return res.status(400).json({ ok: false, error: 'Unknown language' });
    }

    const user = await UserModel.updateLanguage(req.user.telegramId, language);
    res.json({ ok: true, data: { language: user.language } });
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

/** GET /api/client/promos — amal qilayotgan promokodlar ro'yxati */
export async function getPromos(req, res, next) {
  try {
    const promos = await PromoCodeModel.findActive();
    res.json({
      ok: true,
      data: promos.map((p) => ({
        code: p.code,
        description: p.description,
        type: p.type,
        value: p.value,
        minOrderAmount: p.minOrderAmount,
        maxDiscount: p.maxDiscount,
        expiresAt: p.expiresAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}

/** POST /api/client/promo/check — promokodni tekshirish */
export async function checkPromo(req, res, next) {
  try {
    const { code, subtotal } = req.body || {};

    const lang = req.user.language;

    if (!code || !String(code).trim()) {
      return res.status(400).json({ ok: false, error: t(lang, 'errPromoEmpty') });
    }

    const promo = await PromoCodeModel.findByCode(code);
    const result = evaluatePromo(promo, Math.max(0, Number(subtotal) || 0));

    if (!result.ok) {
      return res
        .status(400)
        .json({ ok: false, error: t(lang, result.errorKey, ...(result.args || [])) });
    }

    res.json({
      ok: true,
      data: {
        code: result.promo.code,
        description: result.promo.description,
        discount: result.discount,
      },
    });
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
      promoCode = '',
    } = req.body || {};

    const lang = req.user.language;
    const field = toFieldLang(lang);

    // --- Validatsiya ---
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: t(lang, 'errCartEmpty') });
    }

    if (!['DELIVERY', 'PICKUP'].includes(deliveryType)) {
      return res.status(400).json({ ok: false, error: t(lang, 'errDeliveryType') });
    }

    if (!['CASH', 'CARD'].includes(paymentMethod)) {
      return res.status(400).json({ ok: false, error: t(lang, 'errPaymentType') });
    }

    const cleanPhone = String(phone).trim();
    if (cleanPhone.replace(/\D/g, '').length < 9) {
      return res.status(400).json({ ok: false, error: t(lang, 'errPhone') });
    }

    if (deliveryType === 'DELIVERY' && !String(address).trim() && latitude == null) {
      return res.status(400).json({ ok: false, error: t(lang, 'errAddress') });
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

      const localName =
        field === 'uz'
          ? product.nameUz || product.name
          : field === 'en'
            ? product.nameEn || product.name
            : product.name;

      orderItems.push({
        productId: product.id,
        name: localName,
        price: product.newPrice,
        qty,
        imageUrl: product.imageUrl,
        lineTotal,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ ok: false, error: t(lang, 'errProducts') });
    }

    // --- Promokod (narx kabi, u ham serverda qayta tekshiriladi) ---
    let discount = 0;
    let appliedPromo = null;

    if (String(promoCode).trim()) {
      const promo = await PromoCodeModel.findByCode(promoCode);
      const result = evaluatePromo(promo, subtotal);

      if (!result.ok) {
        return res
          .status(400)
          .json({ ok: false, error: t(lang, result.errorKey, ...(result.args || [])) });
      }

      discount = result.discount;
      appliedPromo = result.promo;
    }

    const { deliveryFee: fee, freeDeliveryFrom } = config.business;
    const deliveryFee =
      deliveryType === 'DELIVERY' && subtotal < freeDeliveryFrom ? fee : 0;
    const total = Math.max(0, subtotal - discount) + deliveryFee;

    // --- Bazaga yozish ---
    const order = await OrderModel.create({
      userId: req.user.id,
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      promoCode: appliedPromo ? appliedPromo.code : null,
      total,
      deliveryType,
      paymentMethod,
      address: String(address).trim() || null,
      latitude: latitude != null ? Number(latitude) : null,
      longitude: longitude != null ? Number(longitude) : null,
      phone: cleanPhone,
      comment: String(comment).trim() || null,
    });

    if (appliedPromo) {
      await PromoCodeModel.incrementUsage(appliedPromo.id).catch(() => {});
    }

    // Telefon raqamni profilga ham saqlab qo'yamiz
    if (req.user.phone !== cleanPhone) {
      await UserModel.updatePhone(req.user.telegramId, cleanPhone).catch(() => {});
    }

    // --- Botdan mijozga xabar ---
    const itemLines = orderItems
      .map((i) => `• ${i.name} × ${i.qty} — ${formatPrice(i.lineTotal)}`)
      .join('\n');

    const message = [
      t(lang, 'orderAccepted'),
      t(lang, 'orderCourier'),
      '',
      `<b>${t(lang, 'orderNumber')}:</b> #${order.id}`,
      '',
      itemLines,
      '',
      `<b>${t(lang, 'orderItems')}:</b> ${formatPrice(subtotal)}`,
      discount > 0
        ? `<b>${t(lang, 'orderDiscount')} (${appliedPromo.code}):</b> −${formatPrice(discount)}`
        : null,
      deliveryFee > 0
        ? `<b>${t(lang, 'orderDelivery')}:</b> ${formatPrice(deliveryFee)}`
        : deliveryType === 'DELIVERY'
          ? `<b>${t(lang, 'orderDelivery')}:</b> ${t(lang, 'orderFree')}`
          : null,
      `<b>${t(lang, 'orderTotal')}:</b> ${formatPrice(total)}`,
      '',
      `<b>${t(lang, 'orderType')}:</b> ${t(lang, 'delivery')[deliveryType]}`,
      `<b>${t(lang, 'orderPayment')}:</b> ${t(lang, 'payment')[paymentMethod]}`,
      order.address ? `<b>${t(lang, 'orderAddress')}:</b> ${order.address}` : null,
      `<b>${t(lang, 'orderPhone')}:</b> ${cleanPhone}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (!req.isDevUser) {
      await sendMessageSafe(req.user.telegramId, message);

      if (order.latitude != null && order.longitude != null) {
        await sendMessageSafe(req.user.telegramId, t(lang, 'orderLocation'));
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
  saveLanguage,
  getProducts,
  getCategories,
  getPromos,
  checkPromo,
  getMyOrders,
  createOrder,
};
