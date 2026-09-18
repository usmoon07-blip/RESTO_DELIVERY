import bot from '../core/bot.js';
import config from '../config/default.js';
import botController, { matchesButton } from '../controllers/botController.js';
import {
  detectNgrokUrl,
  getWebAppUrl,
  isHttps,
  setWebAppUrl,
} from '../core/webapp.js';
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

/** Telegram pastki menyu tugmasini joriy manzilga moslaydi */
async function syncMenuButton() {
  const url = getWebAppUrl();

  try {
    if (isHttps(url)) {
      await bot.telegram.setChatMenuButton({
        menuButton: { type: 'web_app', text: 'Menu', web_app: { url } },
      });
    } else {
      await bot.telegram.setChatMenuButton({ menuButton: { type: 'commands' } });
    }
  } catch (error) {
    console.warn('⚠️  Menyu tugmasi sozlanmadi:', error.message);
  }
}

/**
 * ngrok manzilini topib qo'yadi. Topilsa — `.env` ni qo'lda tahrirlash
 * va serverni qayta ishga tushirish shart emas.
 */
export async function refreshWebAppUrl({ quiet = false } = {}) {
  if (!config.bot.autoNgrok) return getWebAppUrl();

  // .env da allaqachon https manzil turgan bo'lsa, unga tegmaymiz
  if (isHttps(config.bot.webAppUrl)) return getWebAppUrl();

  const found = await detectNgrokUrl(config.bot.webAppPort);
  if (!found) return getWebAppUrl();

  if (setWebAppUrl(found)) {
    console.log(`🔗 ngrok topildi: ${found}`);
    await syncMenuButton();
  } else if (!quiet) {
    console.log(`🔗 Mini App: ${found}`);
  }

  return found;
}

/** Botni ishga tushirish (localhost uchun long polling) */
export async function launchBot() {
  registerBotHandlers();

  await refreshWebAppUrl({ quiet: true });
  await syncMenuButton();

  try {
    await bot.telegram.setMyCommands([
      { command: 'start', description: 'Restart / Перезапустить / Qayta ishga tushirish' },
      { command: 'language', description: 'Language / Язык / Til' },
      { command: 'help', description: 'Help / Помощь / Yordam' },
    ]);
  } catch (error) {
    console.warn('⚠️  Buyruqlar sozlanmadi:', error.message);
  }

  // ngrok keyinroq ishga tushsa ham o'zi ulanib oladi
  if (config.bot.autoNgrok && !isHttps(config.bot.webAppUrl)) {
    setInterval(() => refreshWebAppUrl({ quiet: true }), 20000).unref();
  }

  // `launch()` promise'i bot to'xtaguncha yopilmaydi — shuning uchun `await` qilmaymiz.
  // Xatolikni ushlamasak, butun server qulab tushadi.
  bot.launch({ dropPendingUpdates: true }).catch((error) => {
    console.error("⚠️  Bot polling to'xtadi:", error.message);
  });

  const me = await bot.telegram.getMe();
  console.log(`🤖 Bot ishga tushdi: @${me.username}`);

  if (!isHttps(getWebAppUrl())) {
    console.log(
      '⚠️  Mini App tugmasi hali yo\'q — ngrok ishga tushsa, bot uni o\'zi topadi',
    );
  }

  return me;
}

export default { registerBotHandlers, launchBot };
