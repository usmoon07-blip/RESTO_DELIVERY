import { Telegraf } from 'telegraf';
import config from '../config/default.js';

/** Butun loyihada ishlatiladigan yagona bot instansiyasi */
export const bot = new Telegraf(config.bot.token);

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
