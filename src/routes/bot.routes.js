import bot from '../core/bot.js';
import config from '../config/default.js';
import botController, { isHttps } from '../controllers/botController.js';

/** Bot handlerlarini ro'yxatdan o'tkazish */
export function registerBotHandlers() {
  bot.start(botController.onStart);
  bot.help(botController.onHelp);

  bot.on('contact', botController.onContact);

  bot.hears('📞 Raqamni yuborish', botController.onRequestPhone);
  bot.hears('📜 Buyurtmalarim', botController.onMyOrders);
  bot.hears('ℹ️ Biz haqimizda', botController.onAbout);

  // Mini App ichidan yuborilgan ma'lumot (zaxira variant)
  bot.on('web_app_data', async (ctx) => {
    await ctx.reply('✅ Ma\'lumot qabul qilindi.');
  });

  bot.on('message', async (ctx) => {
    if (ctx.message?.text?.startsWith('/')) return;
    await ctx.replyWithHTML(
      'Buyurtma berish uchun pastdagi menyudan foydalaning 👇',
      botController.mainKeyboard(),
    );
  });

  bot.catch((error, ctx) => {
    console.error(`❌ Bot xatolik (${ctx.updateType}):`, error.message);
  });
}

/** Botni ishga tushirish (localhost uchun long polling) */
export async function launchBot() {
  registerBotHandlers();

  // Telegram pastki menyu tugmasi (faqat HTTPS bilan ishlaydi)
  try {
    if (isHttps(config.bot.webAppUrl)) {
      await bot.telegram.setChatMenuButton({
        menuButton: {
          type: 'web_app',
          text: '🍕 Buyurtma',
          web_app: { url: config.bot.webAppUrl },
        },
      });
    } else {
      await bot.telegram.setChatMenuButton({ menuButton: { type: 'commands' } });
    }

    await bot.telegram.setMyCommands([
      { command: 'start', description: 'Botni ishga tushirish' },
      { command: 'help', description: 'Yordam' },
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
