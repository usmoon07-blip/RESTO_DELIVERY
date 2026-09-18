import prisma from '../database/connection.js';

export const OrderModel = {
  create(data) {
    return prisma.order.create({
      data,
      include: { user: true },
    });
  },

  findById(id) {
    return prisma.order.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });
  },

  /** Mijozning buyurtmalar tarixi */
  findByUserId(userId, limit = 50) {
    return prisma.order.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  /**
   * Admin Panel uchun — filtrlash bilan.
   * `active: true` — oshxona ekrani uchun faqat tugallanmagan buyurtmalar.
   */
  findAll({ status, active, limit = 100 } = {}) {
    let where;
    if (status) where = { status };
    else if (active) where = { status: { notIn: ['DELIVERED', 'CANCELLED'] } };

    return prisma.order.findMany({
      where,
      orderBy: { createdAt: active ? 'asc' : 'desc' },
      take: Number(limit),
      include: { user: true },
    });
  },

  updateStatus(id, status) {
    return prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: { user: true },
    });
  },

  remove(id) {
    return prisma.order.delete({ where: { id: Number(id) } });
  },

  async stats() {
    const [total, pending, delivered, revenueAgg] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } },
      }),
    ]);

    return {
      totalOrders: total,
      pendingOrders: pending,
      deliveredOrders: delivered,
      revenue: revenueAgg._sum.total || 0,
    };
  },
};

export default OrderModel;
