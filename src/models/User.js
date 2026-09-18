import prisma from '../database/connection.js';
import { detectLanguage } from '../i18n/index.js';

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

    // Til faqat birinchi marta Telegram sozlamasidan olinadi —
    // keyin foydalanuvchi o'zi tanlagani saqlanib qoladi.
    return prisma.user.upsert({
      where: { telegramId },
      update: data,
      create: {
        telegramId,
        ...data,
        language: detectLanguage(data.languageCode),
      },
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

  updateLanguage(telegramId, language) {
    return prisma.user.update({
      where: { telegramId: String(telegramId) },
      data: { language },
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
