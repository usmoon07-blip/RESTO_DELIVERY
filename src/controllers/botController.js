import config from '../config/default.js';
import UserModel from '../models/User.js';
import OrderModel from '../models/Order.js';
import { formatPrice, STATUS_LABELS, STATUS_EMOJI } from '../utils/format.js';

const { restaurantName } = config.business;

export const isHttps = (url) => /^https:\/\//i.test(url || '');

/** Mini App tugmasi bo'lgan klaviatura */
export function mainKeyboard() {
  const url = config.bot.webAppUrl;

  if (!isHttps(url)) {
    // Telegram web_app tugmasi faqat HTTPS bilan ishlaydi (ngrok kerak)
    return {
      reply_markup: {
        keyboard: [['📞 Raqamni yuborish'], ['📜 Buyurtmalarim', 'ℹ️ Biz haqimizda']],
        resize_keyboard: true,
      },
    };
  }

  return {
    reply_markup: {
      keyboard: [
        [{ text: '🍕 Buyurtma berish', web_app: { url } }],
        ['📞 Raqamni yuborish'],
        ['📜 Buyurtmalarim', 'ℹ️ Biz haqimizda'],
      ],
      resize_keyboard: true,
    },
  };
}

/** /start */
export async function onStart(ctx) {
  const user = await UserModel.findOrCreate(ctx.from);

  const greeting = [
    `Assalomu alaykum, <b>${user.firstName}</b>! 👋`,
    '',
    `<b>${restaurantName}</b> — shahardagi eng mazali pizzalar.`,
    '',
    '🔥 Tandirda pishirilgan xamir',
    '🚀 30 daqiqada yetkazib berish',
    '💳 Naqd yoki karta orqali to\'lov',
    '',
    'Buyurtma berish uchun pastdagi tugmani bosing 👇',
  ].join('\n');

  await ctx.replyWithHTML(greeting, mainKeyboard());

  if (!isHttps(config.bot.webAppUrl)) {
    await ctx.replyWithHTML(
      '⚠️ <b>Diqqat (faqat dasturchi uchun):</b>\n\n' +
        'Mini App tugmasi ko\'rinishi uchun <code>.env</code> faylidagi ' +
        '<code>WEB_APP_URL</code> ga <b>ngrok</b> dan olingan <b>https://</b> manzilni yozing ' +
        'va serverni qayta ishga tushiring.',
    );
  }

  if (!user.phone) {
    await ctx.replyWithHTML(
      'Tezroq bog\'lanishimiz uchun telefon raqamingizni yuboring 👇',
      {
        reply_markup: {
          keyboard: [[{ text: '📞 Raqamni yuborish', request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    );
  }
}

/** Kontakt yuborilganda */
export async function onContact(ctx) {
  const contact = ctx.message?.contact;
  if (!contact) return;

  // Faqat o'zining raqamini qabul qilamiz
  if (String(contact.user_id) !== String(ctx.from.id)) {
    return ctx.reply("Iltimos, o'zingizning raqamingizni yuboring.");
  }

  const phone = contact.phone_number.startsWith('+')
    ? contact.phone_number
    : `+${contact.phone_number}`;

  await UserModel.findOrCreate(ctx.from);
  await UserModel.updatePhone(ctx.from.id, phone);

  await ctx.replyWithHTML(
    `✅ Rahmat! Raqamingiz saqlandi: <b>${phone}</b>`,
    mainKeyboard(),
  );
}

/** "📞 Raqamni yuborish" tugmasi */
export async function onRequestPhone(ctx) {
  await ctx.reply('Raqamingizni yuborish uchun pastdagi tugmani bosing 👇', {
    reply_markup: {
      keyboard: [[{ text: '📞 Raqamni yuborish', request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}

/** "📜 Buyurtmalarim" */
export async function onMyOrders(ctx) {
  const user = await UserModel.findByTelegramId(ctx.from.id);

  if (!user) {
    return ctx.reply('Avval /start buyrug\'ini bosing.');
  }

  const orders = await OrderModel.findByUserId(user.id, 5);

  if (orders.length === 0) {
    return ctx.replyWithHTML(
      'Sizda hali buyurtmalar yo\'q 🤷‍♂️\n\nBirinchi buyurtmangizni bering!',
      mainKeyboard(),
    );
  }

  const text = orders
    .map((order) => {
      const items = (order.items || [])
        .map((i) => `   • ${i.name} × ${i.qty}`)
        .join('\n');

      const date = new Date(order.createdAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return [
        `${STATUS_EMOJI[order.status]} <b>Buyurtma #${order.id}</b> — ${STATUS_LABELS[order.status]}`,
        items,
        `   💰 ${formatPrice(order.total)}`,
        `   📅 ${date}`,
      ].join('\n');
    })
    .join('\n\n');

  await ctx.replyWithHTML(`📜 <b>So'nggi buyurtmalaringiz:</b>\n\n${text}`);
}

/** "ℹ️ Biz haqimizda" */
export async function onAbout(ctx) {
  await ctx.replyWithHTML(
    [
      `<b>${restaurantName}</b> 🍕`,
      '',
      'Biz 2018-yildan beri shahar aholisini eng sifatli va mazali pizzalar bilan ta\'minlab kelmoqdamiz.',
      '',
      '🕐 Ish vaqti: 10:00 — 23:00 (har kuni)',
      `🛵 Yetkazib berish: ${formatPrice(config.business.deliveryFee)}`,
      `🎁 ${formatPrice(config.business.freeDeliveryFrom)} dan yuqori buyurtmalarga yetkazish BEPUL`,
      '',
      '📞 Aloqa: +998 (90) 123-45-67',
    ].join('\n'),
    mainKeyboard(),
  );
}

/** /help */
export async function onHelp(ctx) {
  await ctx.replyWithHTML(
    [
      '<b>Botdan foydalanish:</b>',
      '',
      '🍕 <b>Buyurtma berish</b> — ilovani ochadi',
      '📞 <b>Raqamni yuborish</b> — aloqa raqamingizni saqlaydi',
      '📜 <b>Buyurtmalarim</b> — buyurtmalar tarixi',
      'ℹ️ <b>Biz haqimizda</b> — ish vaqti va aloqa',
      '',
      '/start — botni qayta ishga tushirish',
    ].join('\n'),
    mainKeyboard(),
  );
}

export default {
  onStart,
  onContact,
  onRequestPhone,
  onMyOrders,
  onAbout,
  onHelp,
  mainKeyboard,
  isHttps,
};
