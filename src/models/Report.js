import prisma from '../database/connection.js';

/**
 * Hisobot — Admin Panel "Hisobot" bo'limi uchun.
 *
 * Hisob-kitob JS tomonida qilinadi: sana chegaralari restoranning o'z
 * vaqt mintaqasida (serverning mahalliy vaqti) bo'lishi kerak, SQL'da esa
 * vaqt UTC'da saqlanadi.
 */

const MAX_ROWS = 20000; // juda katta bazada ham xotira portlamasin

/** Mahalliy vaqt bo'yicha kun boshlanishi */
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** `days` kun oldingi kun boshlanishi (1 = faqat bugun) */
export function periodStart(days) {
  if (!days) return null; // butun davr
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - (days - 1));
  return d;
}

/** YYYY-MM-DD, mahalliy vaqtda */
function dayKey(date) {
  const d = new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Bo'sh hisoblagich */
const bucket = () => ({ count: 0, sum: 0 });

export const ReportModel = {
  /**
   * @param {number|null} days 1 | 7 | 30 | null (hammasi)
   */
  async build(days = 30) {
    const from = periodStart(days);
    const where = from ? { createdAt: { gte: from } } : {};

    const [orders, newCustomers, totalCustomers] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        take: MAX_ROWS,
        select: {
          id: true,
          items: true,
          subtotal: true,
          discount: true,
          total: true,
          deliveryType: true,
          paymentMethod: true,
          status: true,
          createdAt: true,
          user: { select: { id: true, firstName: true, lastName: true, username: true, phone: true } },
        },
      }),
      prisma.user.count({ where: from ? { createdAt: { gte: from } } : {} }),
      prisma.user.count(),
    ]);

    const payment = { CASH: bucket(), CARD: bucket() };
    const delivery = { DELIVERY: bucket(), PICKUP: bucket() };
    const byStatus = {};
    const daily = new Map();
    const hourly = Array.from({ length: 24 }, () => 0);
    const productMap = new Map();
    const customerMap = new Map();

    let paidOrders = 0; // bekor qilinmaganlar
    let revenue = 0; // bekor qilinmaganlar summasi
    let deliveredOrders = 0;
    let deliveredRevenue = 0; // qo'lga tekkan pul
    let cancelled = 0;
    let discountTotal = 0;

    for (const order of orders) {
      byStatus[order.status] = (byStatus[order.status] || 0) + 1;

      if (order.status === 'CANCELLED') {
        cancelled += 1;
        continue; // bekor qilingani hech qayerda hisobga olinmaydi
      }

      paidOrders += 1;
      revenue += order.total;
      discountTotal += order.discount || 0;

      if (order.status === 'DELIVERED') {
        deliveredOrders += 1;
        deliveredRevenue += order.total;
      }

      const pay = payment[order.paymentMethod] || (payment[order.paymentMethod] = bucket());
      pay.count += 1;
      pay.sum += order.total;

      const dlv = delivery[order.deliveryType] || (delivery[order.deliveryType] = bucket());
      dlv.count += 1;
      dlv.sum += order.total;

      const key = dayKey(order.createdAt);
      const day = daily.get(key) || { date: key, orders: 0, revenue: 0 };
      day.orders += 1;
      day.revenue += order.total;
      daily.set(key, day);

      hourly[new Date(order.createdAt).getHours()] += 1;

      for (const item of order.items || []) {
        // Kalit — mahsulot id'si. Nom mijozning tilida saqlanadi, shuning
        // uchun nom bo'yicha guruhlasak bitta taom uch marta sanaladi.
        const key = item.productId ? `id:${item.productId}` : `name:${item.name || '—'}`;
        const row = productMap.get(key) || {
          productId: item.productId || null,
          name: item.name || '—',
          qty: 0,
          sum: 0,
        };
        row.qty += Number(item.qty) || 0;
        row.sum += Number(item.lineTotal) || (Number(item.price) || 0) * (Number(item.qty) || 0);
        productMap.set(key, row);
      }

      if (order.user) {
        const id = order.user.id;
        const row = customerMap.get(id) || {
          id,
          name: [order.user.firstName, order.user.lastName].filter(Boolean).join(' ') || '—',
          username: order.user.username,
          phone: order.user.phone,
          orders: 0,
          sum: 0,
        };
        row.orders += 1;
        row.sum += order.total;
        customerMap.set(id, row);
      }
    }

    const totalSeen = orders.length;

    const topProducts = [...productMap.values()]
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);

    // Nomlarni bazadagi asosiy nomga almashtiramiz — hisobot bitta tilda bo'lsin
    const ids = topProducts.map((p) => p.productId).filter(Boolean);
    if (ids.length) {
      const products = await prisma.product.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true },
      });
      const names = new Map(products.map((p) => [p.id, p.name]));
      for (const row of topProducts) {
        if (row.productId && names.has(row.productId)) row.name = names.get(row.productId);
      }
    }

    return {
      days,
      from: from ? from.toISOString() : null,

      totals: {
        orders: paidOrders,
        cancelled,
        cancelRate: totalSeen ? Math.round((cancelled / totalSeen) * 100) : 0,
        revenue,
        deliveredOrders,
        deliveredRevenue,
        avgCheck: paidOrders ? Math.round(revenue / paidOrders) : 0,
        discountTotal,
        newCustomers,
        totalCustomers,
        repeatCustomers: [...customerMap.values()].filter((c) => c.orders > 1).length,
      },

      payment,
      delivery,
      byStatus,

      daily: [...daily.values()],
      hourly: hourly.map((count, hour) => ({ hour, count })),

      topProducts,
      topCustomers: [...customerMap.values()].sort((a, b) => b.sum - a.sum).slice(0, 10),

      truncated: totalSeen >= MAX_ROWS,
    };
  },
};

export default ReportModel;
