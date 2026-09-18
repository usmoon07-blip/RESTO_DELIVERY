import prisma from '../database/connection.js';

export const PromoCodeModel = {
  findByCode(code) {
    return prisma.promoCode.findUnique({
      where: { code: String(code).trim().toUpperCase() },
    });
  },

  findAll() {
    return prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
  },

  /** Mini App uchun — amal qiladigan ochiq promokodlar */
  findActive() {
    return prisma.promoCode.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  create(data) {
    return prisma.promoCode.create({ data });
  },

  update(id, data) {
    return prisma.promoCode.update({ where: { id: Number(id) }, data });
  },

  remove(id) {
    return prisma.promoCode.delete({ where: { id: Number(id) } });
  },

  incrementUsage(id) {
    return prisma.promoCode.update({
      where: { id: Number(id) },
      data: { usedCount: { increment: 1 } },
    });
  },
};

/**
 * Promokodni tekshiradi va chegirma summasini hisoblaydi.
 * @returns {{ ok: true, promo, discount } | { ok: false, errorKey, args? }}
 */
export function evaluatePromo(promo, subtotal) {
  if (!promo || !promo.isActive) {
    return { ok: false, errorKey: 'errPromoNotFound' };
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return { ok: false, errorKey: 'errPromoExpired' };
  }

  if (promo.usageLimit != null && promo.usedCount >= promo.usageLimit) {
    return { ok: false, errorKey: 'errPromoLimit' };
  }

  if (subtotal < promo.minOrderAmount) {
    const formatted = promo.minOrderAmount
      .toLocaleString('ru-RU')
      .replace(/\u00A0/g, ' ');
    return { ok: false, errorKey: 'errPromoMin', args: [formatted] };
  }

  let discount =
    promo.type === 'PERCENT'
      ? Math.floor((subtotal * promo.value) / 100)
      : promo.value;

  if (promo.type === 'PERCENT' && promo.maxDiscount != null) {
    discount = Math.min(discount, promo.maxDiscount);
  }

  discount = Math.max(0, Math.min(discount, subtotal));

  return { ok: true, promo, discount };
}

export default PromoCodeModel;
