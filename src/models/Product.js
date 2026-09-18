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

  /**
   * Kategoriyalar menyudagi tartibda qaytariladi (alifbo bo'yicha emas):
   * har bir kategoriyaning eng kichik sortOrder'i bo'yicha.
   */
  async categories() {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true, categoryUz: true, categoryEn: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    const seen = new Set();
    const ordered = [];
    for (const row of rows) {
      if (seen.has(row.category)) continue;
      seen.add(row.category);
      ordered.push({
        key: row.category,
        ru: row.category,
        uz: row.categoryUz || row.category,
        en: row.categoryEn || row.category,
      });
    }
    return ordered;
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
