import { Telegraf } from 'telegraf';
import config from '../config/default.js';

/**
 * Butun loyihada ishlatiladigan yagona bot instansiyasi.
 * TELEGRAM_API_ROOT — sinov uchun (odatda bo'sh, Telegram'ning o'zi ishlatiladi).
 */
export const bot = new Telegraf(config.bot.token, {
  telegram: process.env.TELEGRAM_API_ROOT
    ? { apiRoot: process.env.TELEGRAM_API_ROOT }
    : undefined,
});

/**
 * Mijozga xabar yuborish (xatolik bo'lsa dastur qulamaydi).
 * Masalan: foydalanuvchi botni bloklagan bo'lsa.
 */
export async function sendMessageSafe(telegramId, text, extra = {}) {
  try {
    await bot.telegram.sendMessage(telegramId, text, {
      parse_mode: 'HTML',
      ...extra,
    });
    return true;
  } catch (error) {
    console.warn(`⚠️  ${telegramId} ga xabar yuborilmadi: ${error.message}`);
    return false;
  }
}

export default bot;
