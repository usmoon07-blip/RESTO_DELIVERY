import prisma from '../database/connection.js';

export const ProductModel = {
  /** Mini App uchun — faqat faol mahsulotlar */
  findActive() {
    return prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  },

  /** Admin uchun — barchasi */
  findAll() {
    return prisma.product.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  },

  findById(id) {
    return prisma.product.findUnique({ where: { id: Number(id) } });
  },

  findManyByIds(ids) {
    return prisma.product.findMany({
      where: { id: { in: ids.map(Number) } },
    });
  },

  async categories() {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category);
  },

  create(data) {
    return prisma.product.create({ data });
  },

  update(id, data) {
    return prisma.product.update({ where: { id: Number(id) }, data });
  },

  remove(id) {
    return prisma.product.delete({ where: { id: Number(id) } });
  },

  count() {
    return prisma.product.count();
  },
};

export default ProductModel;
