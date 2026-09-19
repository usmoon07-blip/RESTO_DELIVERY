import ProductModel from '../models/Product.js';
import OrderModel from '../models/Order.js';
import ReportModel from '../models/Report.js';
import UserModel from '../models/User.js';
import PromoCodeModel from '../models/PromoCode.js';
import { sendMessageSafe } from '../core/bot.js';
import { formatPrice } from '../utils/format.js';
import { STATUS_MARK, t } from '../i18n/index.js';

const VALID_STATUSES = Object.keys(STATUS_MARK);

/** POST /api/admin/login — parolni tekshirish (adminAuth middleware ishlatiladi) */
export function login(req, res) {
  res.json({ ok: true, data: { authorized: true } });
}

/** GET /api/admin/stats */
export async function getStats(req, res, next) {
  try {
    const [orderStats, products, users] = await Promise.all([
      OrderModel.stats(),
      ProductModel.count(),
      UserModel.count(),
    ]);

    res.json({
      ok: true,
      data: { ...orderStats, totalProducts: products, totalUsers: users },
    });
  } catch (error) {
    next(error);
  }
}

/** GET /api/admin/report?days=1|7|30|0 — 0 yoki bo'sh = butun davr */
export async function getReport(req, res, next) {
  try {
    const allowed = [1, 7, 30, 90];
    const raw = Number(req.query.days);
    const days = allowed.includes(raw) ? raw : raw === 0 ? null : 30;

    res.json({ ok: true, data: await ReportModel.build(days) });
  } catch (error) {
    next(error);
  }
}

/* ============================ BUYURTMALAR ============================ */

/** GET /api/admin/orders?status=PENDING */
export async function getOrders(req, res, next) {
  try {
    const { status, limit, active } = req.query;
    const orders = await OrderModel.findAll({
      status: VALID_STATUSES.includes(status) ? status : undefined,
      active: active === 'true',
      limit: limit || 100,
    });
    res.json({ ok: true, data: orders });
  } catch (error) {
    next(error);
  }
}

/** GET /api/admin/orders/:id */
export async function getOrder(req, res, next) {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ ok: false, error: 'Buyurtma topilmadi' });
    res.json({ ok: true, data: order });
  } catch (error) {
    next(error);
  }
}

/** PATCH /api/admin/orders/:id/status — holatni o'zgartirish + mijozga xabar */
export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body || {};

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ ok: false, error: "Holat noto'g'ri" });
    }

    const order = await OrderModel.updateStatus(req.params.id, status);

    // Mijozga xabar uning o'z tilida boradi
    const lang = order.user.language || 'UZ';
    await sendMessageSafe(
      order.user.telegramId,
      [
        t(lang, 'statusTitle', order.id),
        '',
        `${t(lang, 'statusLabel')}: <b>${t(lang, 'status')[status]}</b>`,
        `${t(lang, 'sumLabel')}: ${formatPrice(order.total)}`,
      ].join('\n'),
    );

    res.json({ ok: true, data: order });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ ok: false, error: 'Buyurtma topilmadi' });
    }
    next(error);
  }
}

/** DELETE /api/admin/orders/:id */
export async function deleteOrder(req, res, next) {
  try {
    await OrderModel.remove(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ ok: false, error: 'Buyurtma topilmadi' });
    }
    next(error);
  }
}

/* ============================ MAHSULOTLAR (CRUD) ============================ */

function normalizeProduct(body = {}) {
  const toIntOrNull = (v) => {
    if (v === '' || v === null || v === undefined) return null;
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  };

  let ingredients = body.ingredients;
  if (typeof ingredients === 'string') {
    ingredients = ingredients
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const splitList = (value) => {
    if (Array.isArray(value)) return value;
    return String(value || '')
      .split(/[\n,]/)
      .map((x) => x.trim())
      .filter(Boolean);
  };

  return {
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    imageUrl: String(body.imageUrl || '').trim(),

    nameUz: String(body.nameUz || '').trim() || null,
    nameEn: String(body.nameEn || '').trim() || null,
    descriptionUz: String(body.descriptionUz || '').trim(),
    descriptionEn: String(body.descriptionEn || '').trim(),
    categoryUz: String(body.categoryUz || '').trim() || null,
    categoryEn: String(body.categoryEn || '').trim() || null,
    ingredientsUz: splitList(body.ingredientsUz),
    ingredientsEn: splitList(body.ingredientsEn),

    oldPrice: toIntOrNull(body.oldPrice),
    newPrice: toIntOrNull(body.newPrice),
    category: String(body.category || 'Pizza').trim() || 'Pizza',
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    isActive: body.isActive === undefined ? true : Boolean(body.isActive),
    sortOrder: toIntOrNull(body.sortOrder) ?? 0,
  };
}

/** GET /api/admin/products */
export async function getProducts(req, res, next) {
  try {
    const products = await ProductModel.findAll();
    res.json({ ok: true, data: products });
  } catch (error) {
    next(error);
  }
}

/** POST /api/admin/products */
export async function createProduct(req, res, next) {
  try {
    const data = normalizeProduct(req.body);

    if (!data.name) {
      return res.status(400).json({ ok: false, error: 'Mahsulot nomini kiriting' });
    }
    if (data.newPrice === null || data.newPrice < 0) {
      return res.status(400).json({ ok: false, error: "Narxni to'g'ri kiriting" });
    }

    const product = await ProductModel.create(data);
    res.status(201).json({ ok: true, data: product });
  } catch (error) {
    next(error);
  }
}

/** PUT /api/admin/products/:id */
export async function updateProduct(req, res, next) {
  try {
    const data = normalizeProduct(req.body);

    if (!data.name) {
      return res.status(400).json({ ok: false, error: 'Mahsulot nomini kiriting' });
    }
    if (data.newPrice === null || data.newPrice < 0) {
      return res.status(400).json({ ok: false, error: "Narxni to'g'ri kiriting" });
    }

    const product = await ProductModel.update(req.params.id, data);
    res.json({ ok: true, data: product });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ ok: false, error: 'Mahsulot topilmadi' });
    }
    next(error);
  }
}

/** DELETE /api/admin/products/:id */
export async function deleteProduct(req, res, next) {
  try {
    await ProductModel.remove(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ ok: false, error: 'Mahsulot topilmadi' });
    }
    next(error);
  }
}

/* ============================ PROMOKODLAR ============================ */

function normalizePromo(body = {}) {
  const toIntOrNull = (v) => {
    if (v === '' || v === null || v === undefined) return null;
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  };

  return {
    code: String(body.code || '').trim().toUpperCase(),
    description: String(body.description || '').trim(),
    type: body.type === 'FIXED' ? 'FIXED' : 'PERCENT',
    value: toIntOrNull(body.value) ?? 0,
    minOrderAmount: toIntOrNull(body.minOrderAmount) ?? 0,
    maxDiscount: toIntOrNull(body.maxDiscount),
    usageLimit: toIntOrNull(body.usageLimit),
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    isActive: body.isActive === undefined ? true : Boolean(body.isActive),
  };
}

/** GET /api/admin/promos */
export async function getPromos(req, res, next) {
  try {
    res.json({ ok: true, data: await PromoCodeModel.findAll() });
  } catch (error) {
    next(error);
  }
}

/** POST /api/admin/promos */
export async function createPromo(req, res, next) {
  try {
    const data = normalizePromo(req.body);

    if (!data.code) {
      return res.status(400).json({ ok: false, error: 'Promokodni kiriting' });
    }
    if (data.value <= 0) {
      return res.status(400).json({ ok: false, error: "Chegirma qiymatini kiriting" });
    }
    if (data.type === 'PERCENT' && data.value > 100) {
      return res.status(400).json({ ok: false, error: 'Foiz 100 dan oshmasligi kerak' });
    }

    res.status(201).json({ ok: true, data: await PromoCodeModel.create(data) });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ ok: false, error: 'Bunday promokod allaqachon bor' });
    }
    next(error);
  }
}

/** PUT /api/admin/promos/:id */
export async function updatePromo(req, res, next) {
  try {
    const data = normalizePromo(req.body);

    if (!data.code) {
      return res.status(400).json({ ok: false, error: 'Promokodni kiriting' });
    }
    if (data.value <= 0) {
      return res.status(400).json({ ok: false, error: "Chegirma qiymatini kiriting" });
    }

    res.json({ ok: true, data: await PromoCodeModel.update(req.params.id, data) });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ ok: false, error: 'Promokod topilmadi' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ ok: false, error: 'Bunday promokod allaqachon bor' });
    }
    next(error);
  }
}

/** DELETE /api/admin/promos/:id */
export async function deletePromo(req, res, next) {
  try {
    await PromoCodeModel.remove(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ ok: false, error: 'Promokod topilmadi' });
    }
    next(error);
  }
}

/* ============================== SURATLAR ============================== */

/** POST /api/admin/upload — mahsulot surati (form-data: image) */
export function uploadProductImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'Surat tanlanmadi' });
  }

  res.status(201).json({
    ok: true,
    data: { url: `/uploads/${req.file.filename}`, size: req.file.size },
  });
}

/** GET /api/admin/users */
export async function getUsers(req, res, next) {
  try {
    const users = await UserModel.findAll();
    res.json({ ok: true, data: users });
  } catch (error) {
    next(error);
  }
}

export default {
  login,
  getStats,
  getReport,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getPromos,
  createPromo,
  updatePromo,
  deletePromo,
  uploadProductImage,
  getUsers,
};
