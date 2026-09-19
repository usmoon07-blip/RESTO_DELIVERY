import crypto from 'node:crypto';
import bot from '../core/bot.js';
import config from '../config/default.js';
import botController, { matchesButton } from '../controllers/botController.js';
import {
  detectPublicUrl,
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

  // Buyurtmani bekor qilish: so'rash -> tasdiqlash
  bot.action(/^cancel:(\d+)$/, botController.onCancelAsk);
  bot.action(/^cancelYes:(\d+)$/, botController.onCancelConfirm);
  bot.action('cancelNo', botController.onCancelDismiss);

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
        menuButton: { type: 'web_app', text: 'Menyu', web_app: { url } },
      });
    } else {
      await bot.telegram.setChatMenuButton({ menuButton: { type: 'commands' } });
    }
  } catch (error) {
    console.warn('⚠️  Menyu tugmasi sozlanmadi:', explainTelegramError(error)[0]);
  }
}

/**
 * Tunnel manzilini topib qo'yadi (Cloudflare yoki ngrok). Topilsa — `.env` ni
 * qo'lda tahrirlash va serverni qayta ishga tushirish shart emas.
 */
export async function refreshWebAppUrl({ quiet = false } = {}) {
  if (!config.bot.autoTunnel) return getWebAppUrl();

  // .env da allaqachon https manzil turgan bo'lsa, unga tegmaymiz
  if (isHttps(config.bot.webAppUrl)) return getWebAppUrl();

  const found = await detectPublicUrl(config.bot.webAppPort);
  if (!found) return getWebAppUrl();

  if (setWebAppUrl(found)) {
    console.log(`🔗 Mini App manzili topildi: ${found}`);
    await syncMenuButton();
  } else if (!quiet) {
    console.log(`🔗 Mini App: ${found}`);
  }

  return found;
}

/**
 * Telegram xatoligini oddiy tilda tushuntiradi — terminalda nima qilish
 * kerakligi darrov ko'rinsin.
 */
export function explainTelegramError(error) {
  // Xatolik matnida to'liq URL, demak BOT_TOKEN ham bo'ladi — uni yashiramiz
  const text = String(error?.message || error).replace(/bot\d+:[A-Za-z0-9_-]+/g, 'bot***');

  if (/401|[Uu]nauthorized/.test(text)) {
    return [
      'BOT_TOKEN noto\'g\'ri — Telegram bu tokenni tanimadi.',
      'SOZLAMALAR.bat ni oching, 1 ni tanlang va @BotFather dagi tokenni qayta joylang.',
    ];
  }

  if (/404/.test(text)) {
    return [
      'Bunday bot topilmadi — token o\'chirilgan yoki bekor qilingan bo\'lishi mumkin.',
      'BotFather da /mybots -> API Token orqali tokenni qayta oling.',
    ];
  }

  if (/409|[Cc]onflict/.test(text)) {
    return [
      'Shu bot boshqa joyda ham ishlab turibdi (eski oyna yoki boshqa kompyuter).',
      'Barcha qora oynalarni yoping va RESTO.bat ni qaytadan ishga tushiring.',
    ];
  }

  if (/fetch failed|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|timeout|not valid JSON|Host not/.test(text)) {
    return [
      'Telegram serveriga ulanib bo\'lmadi — internet yoki bloklash muammosi.',
      'Internetni tekshiring. Telegram bloklangan bo\'lsa VPN yoqing.',
    ];
  }

  return [text, 'Muammo takrorlansa, shu matnni yuboring.'];
}

/** Ko'zga tashlanadigan xatolik bloki */
function shout(title, lines) {
  console.error('');
  console.error('  ============================================');
  console.error(`   ${title}`);
  console.error('  ============================================');
  for (const line of lines) console.error(`   ${line}`);
  console.error('  ============================================');
  console.error('');
}

/**
 * Webhook manzilini token asosida yasaymiz — tashqi odam topa olmasin.
 * Token o'zi manzilga tushmaydi, faqat uning hash'i.
 */
function webhookPath() {
  const hash = crypto.createHash('sha256').update(config.bot.token).digest('hex');
  return `/telegram/${hash.slice(0, 32)}`;
}

/**
 * Serverda (Render) long polling emas, webhook ishlatiladi:
 * Telegram xabarni o'zi serverga yuboradi, server esa uxlab qolsa
 * shu so'rov bilan uyg'onadi.
 *
 * @returns {Promise<Function|null>} Express middleware yoki null (localhost)
 */
export async function setupWebhook() {
  const base = config.deploy.publicUrl;
  if (!isHttps(base)) return null; // localhost — long polling ishlatiladi

  const path = webhookPath();

  // Telegram so'rovni rostdan yuborganini tekshirish uchun maxfiy kalit
  const secretToken = crypto
    .createHash('sha256')
    .update(`${config.bot.token}:webhook`)
    .digest('hex')
    .slice(0, 48);

  const middleware = await bot.createWebhook({
    domain: base,
    path,
    secret_token: secretToken,
    drop_pending_updates: true,
  });

  console.log(`🔗 Webhook: ${base}${path}`);
  return middleware;
}

/** Botni ishga tushirish */
export async function launchBot({ webhookReady = false } = {}) {
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
    console.warn('⚠️  Buyruqlar sozlanmadi:', explainTelegramError(error)[0]);
  }

  // Tunnel keyinroq ishga tushsa ham bot o'zi ulanib oladi
  if (config.bot.autoTunnel && !isHttps(config.bot.webAppUrl)) {
    setInterval(() => refreshWebAppUrl({ quiet: true }), 20000).unref();
  }

  if (!webhookReady) {
    // Localhost: long polling.
    // `launch()` promise'i bot to'xtaguncha yopilmaydi — shuning uchun `await`
    // qilmaymiz. Xatolikni ushlamasak, butun server qulab tushadi.
    bot.launch({ dropPendingUpdates: true }).catch((error) => {
      shout('BOT XABARLARNI QABUL QILMAYAPTI', explainTelegramError(error));
    });
  }

  let me;
  try {
    me = await bot.telegram.getMe();
  } catch (error) {
    shout('BOT ISHGA TUSHMADI', explainTelegramError(error));
    throw error;
  }

  console.log(`🤖 Bot ishga tushdi: @${me.username} (${webhookReady ? 'webhook' : 'polling'})`);
  console.log(`   Telegramda oching: https://t.me/${me.username}`);

  if (!isHttps(getWebAppUrl())) {
    console.log(
      '⚠️  Mini App tugmasi hali yo\'q — tunnel ishga tushsa, bot uni o\'zi topadi',
    );
  }

  return me;
}

export default { registerBotHandlers, launchBot, setupWebhook };
