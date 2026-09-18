import bot from '../core/bot.js';
import config from '../config/default.js';
import botController, { isHttps, matchesButton } from '../controllers/botController.js';
import { t } from '../i18n/index.js';
import UserModel from '../models/User.js';

/** Bot handlerlarini ro'yxatdan o'tkazish */
export function registerBotHandlers() {
  bot.start(botController.onStart);
  bot.help(botController.onHelp);
  bot.command('language', botController.onLanguage);

  // Til tanlash tugmasi
  bot.action(/^lang:(UZ|RU|EN)$/, botController.onLanguageChosen);

  bot.on('contact', botController.onContact);

  // Tugmalar uch tilda bo'lgani uchun matn bo'yicha aniqlanadi
  bot.on('text', async (ctx, next) => {
    const text = ctx.message?.text;
    if (!text || text.startsWith('/')) return next();

    if (matchesButton(text, 'btnPhone')) return botController.onRequestPhone(ctx);
    if (matchesButton(text, 'btnOrders')) return botController.onMyOrders(ctx);
    if (matchesButton(text, 'btnAbout')) return botController.onAbout(ctx);
    if (matchesButton(text, 'btnLanguage')) return botController.onLanguage(ctx);

    return next();
  });

  // Mini App ichidan yuborilgan ma'lumot (zaxira variant)
  bot.on('web_app_data', async (ctx) => {
    const user = await UserModel.findByTelegramId(ctx.from.id);
    await ctx.reply(t(user?.language || 'UZ', 'dataReceived'));
  });

  bot.on('message', botController.onFallback);

  bot.catch((error, ctx) => {
    console.error(`❌ Bot xatolik (${ctx.updateType}):`, error.message);
  });
}

/** Botni ishga tushirish (localhost uchun long polling) */
export async function launchBot() {
  registerBotHandlers();

  try {
    if (isHttps(config.bot.webAppUrl)) {
      await bot.telegram.setChatMenuButton({
        menuButton: {
          type: 'web_app',
          text: '🍽 Menu',
          web_app: { url: config.bot.webAppUrl },
        },
      });
    } else {
      await bot.telegram.setChatMenuButton({ menuButton: { type: 'commands' } });
    }

    await bot.telegram.setMyCommands([
      { command: 'start', description: 'Restart / Перезапустить / Qayta ishga tushirish' },
      { command: 'language', description: 'Language / Язык / Til' },
      { command: 'help', description: 'Help / Помощь / Yordam' },
    ]);
  } catch (error) {
    console.warn('⚠️  Menyu sozlanmadi:', error.message);
  }

  // `launch()` promise'i bot to'xtaguncha yopilmaydi — shuning uchun `await` qilmaymiz.
  // Xatolikni ushlamasak, butun server qulab tushadi.
  bot.launch({ dropPendingUpdates: true }).catch((error) => {
    console.error("⚠️  Bot polling to'xtadi:", error.message);
  });

  const me = await bot.telegram.getMe();
  console.log(`🤖 Bot ishga tushdi: @${me.username}`);

  return me;
}

export default { registerBotHandlers, launchBot };
