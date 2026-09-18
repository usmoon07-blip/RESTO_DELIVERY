import ProductModel from '../models/Product.js';
import OrderModel from '../models/Order.js';
import UserModel from '../models/User.js';
import { sendMessageSafe } from '../core/bot.js';
import { formatPrice, STATUS_LABELS, STATUS_EMOJI } from '../utils/format.js';

const VALID_STATUSES = Object.keys(STATUS_LABELS);

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

/* ============================ BUYURTMALAR ============================ */

/** GET /api/admin/orders?status=PENDING */
export async function getOrders(req, res, next) {
  try {
    const { status, limit } = req.query;
    const orders = await OrderModel.findAll({
      status: VALID_STATUSES.includes(status) ? status : undefined,
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

    await sendMessageSafe(
      order.user.telegramId,
      `${STATUS_EMOJI[status]} <b>Buyurtma #${order.id}</b>\n\nHolati: <b>${STATUS_LABELS[status]}</b>\nSumma: ${formatPrice(order.total)}`,
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

  return {
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    imageUrl: String(body.imageUrl || '').trim(),
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
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
};
