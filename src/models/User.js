import prisma from '../database/connection.js';

export const UserModel = {
  /** Telegram foydalanuvchisini topadi yoki yaratadi (upsert) */
  async findOrCreate(tgUser) {
    const telegramId = String(tgUser.id);

    const data = {
      firstName: tgUser.first_name || tgUser.firstName || 'Mijoz',
      lastName: tgUser.last_name || tgUser.lastName || null,
      username: tgUser.username || null,
      languageCode: tgUser.language_code || tgUser.languageCode || null,
    };

    return prisma.user.upsert({
      where: { telegramId },
      update: data,
      create: { telegramId, ...data },
    });
  },

  findByTelegramId(telegramId) {
    return prisma.user.findUnique({ where: { telegramId: String(telegramId) } });
  },

  findById(id) {
    return prisma.user.findUnique({ where: { id: Number(id) } });
  },

  updatePhone(telegramId, phone) {
    return prisma.user.update({
      where: { telegramId: String(telegramId) },
      data: { phone },
    });
  },

  count() {
    return prisma.user.count();
  },

  findAll() {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  },
};

export default UserModel;
