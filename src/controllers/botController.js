import config from '../config/default.js';
import UserModel from '../models/User.js';
import OrderModel from '../models/Order.js';
import { formatPrice } from '../utils/format.js';
import { LANGUAGES, LANGUAGE_NAMES, STATUS_MARK, t } from '../i18n/index.js';
import { getWebAppUrl, isHttps } from '../core/webapp.js';
import { VERSION } from '../core/version.js';

const { restaurantName } = config.business;

/** Foydalanuvchining tanlagan tili */
async function langOf(ctx) {
  const user = await UserModel.findByTelegramId(ctx.from.id);
  return user?.language || 'UZ';
}

/** Mini App tugmasi bo'lgan klaviatura */
export function mainKeyboard(lang = 'UZ') {
  const url = getWebAppUrl();

  const rows = [
    [t(lang, 'btnPhone')],
    [t(lang, 'btnOrders'), t(lang, 'btnAbout')],
    [t(lang, 'btnLanguage')],
  ];

  // Telegram web_app tugmasi faqat HTTPS bilan ishlaydi (ngrok kerak)
  if (isHttps(url)) {
    rows.unshift([{ text: t(lang, 'btnOrder'), web_app: { url } }]);
  }

  return { reply_markup: { keyboard: rows, resize_keyboard: true } };
}

/** Til tanlash tugmalari */
export function languageKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: LANGUAGES.map((code) => [
        { text: LANGUAGE_NAMES[code], callback_data: `lang:${code}` },
      ]),
    },
  };
}

/** Til tanlangandan keyingi salomlashuv */
async function sendWelcome(ctx, user) {
  const lang = user.language;

  // Mini App tugmasi faqat https manzil bo'lganda chiqadi — matn ham
  // shunga qarab yoziladi, bo'lmagan tugmani bosishga chaqirmaslik uchun
  const hasApp = isHttps(getWebAppUrl());

  await ctx.replyWithHTML(
    t(lang, 'greeting', user.firstName, restaurantName, hasApp),
    mainKeyboard(lang),
  );

  // Bu eslatma faqat restoran egasiga (ADMIN_IDS) ko'rinadi —
  // oddiy mijoz uni ko'rmaydi.
  const isAdmin = config.bot.adminIds.includes(String(ctx.from.id));
  if (isAdmin && !isHttps(getWebAppUrl())) {
    await ctx.replyWithHTML(`${t(lang, 'devWarning')}\n\n<code>v${VERSION}</code>`);
  }

  if (!user.phone) {
    await ctx.replyWithHTML(t(lang, 'askPhone'), {
      reply_markup: {
        keyboard: [[{ text: t(lang, 'btnPhone'), request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
}

/** /start */
export async function onStart(ctx) {
  const existing = await UserModel.findByTelegramId(ctx.from.id);
  const user = await UserModel.findOrCreate(ctx.from);

  // Birinchi marta kirganda avval til so'raladi
  if (!existing) {
    return ctx.reply(t(user.language, 'chooseLanguage'), languageKeyboard());
  }

  await sendWelcome(ctx, user);
}

/** /language */
export async function onLanguage(ctx) {
  const lang = await langOf(ctx);
  await ctx.reply(t(lang, 'chooseLanguage'), languageKeyboard());
}

/** Til tugmasi bosilganda */
export async function onLanguageChosen(ctx) {
  const code = ctx.match?.[1] || ctx.callbackQuery?.data?.split(':')[1];
  const language = LANGUAGES.includes(code) ? code : 'UZ';

  await UserModel.findOrCreate(ctx.from);
  const user = await UserModel.updateLanguage(ctx.from.id, language);

  await ctx.answerCbQuery(t(language, 'languageSet'));
  try {
    await ctx.editMessageReplyMarkup();
  } catch {
    /* xabar allaqachon o'zgargan bo'lishi mumkin */
  }

  await sendWelcome(ctx, user);
}

/** Kontakt yuborilganda */
export async function onContact(ctx) {
  const contact = ctx.message?.contact;
  if (!contact) return;

  const lang = await langOf(ctx);

  if (String(contact.user_id) !== String(ctx.from.id)) {
    return ctx.reply(t(lang, 'phoneNotYours'));
  }

  const phone = contact.phone_number.startsWith('+')
    ? contact.phone_number
    : `+${contact.phone_number}`;

  await UserModel.findOrCreate(ctx.from);
  await UserModel.updatePhone(ctx.from.id, phone);

  await ctx.replyWithHTML(t(lang, 'phoneSaved', phone), mainKeyboard(lang));
}

/** Raqam so'rash tugmasi */
export async function onRequestPhone(ctx) {
  const lang = await langOf(ctx);
  await ctx.reply(t(lang, 'phonePrompt'), {
    reply_markup: {
      keyboard: [[{ text: t(lang, 'btnPhone'), request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}

/** Buyurtmalar tarixi */
export async function onMyOrders(ctx) {
  const user = await UserModel.findByTelegramId(ctx.from.id);
  if (!user) return ctx.reply(t('UZ', 'startFirst'));

  const lang = user.language;
  const orders = await OrderModel.findByUserId(user.id, 5);

  if (orders.length === 0) {
    return ctx.replyWithHTML(t(lang, 'noOrders'), mainKeyboard(lang));
  }

  const statuses = t(lang, 'status');

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
        `${STATUS_MARK[order.status]} <b>#${order.id}</b> — ${statuses[order.status]}`,
        items,
        `   ${formatPrice(order.total)}`,
        `   ${date}`,
      ].join('\n');
    })
    .join('\n\n');

  // Bekor qilinishi mumkin bo'lgan buyurtmalar uchun tugma
  const cancellable = orders.filter((o) => OrderModel.CANCELLABLE.includes(o.status));
  const keyboard = cancellable.length
    ? {
        reply_markup: {
          inline_keyboard: cancellable.map((o) => [
            { text: t(lang, 'btnCancelOrder', o.id), callback_data: `cancel:${o.id}` },
          ]),
        },
      }
    : undefined;

  await ctx.replyWithHTML(`${t(lang, 'ordersTitle')}\n\n${text}`, keyboard);
}

/** Bekor qilish tugmasi bosildi — avval tasdiqlaymiz */
export async function onCancelAsk(ctx) {
  const id = Number(ctx.match[1]);
  const lang = await langOf(ctx);

  await ctx.answerCbQuery();
  await ctx.replyWithHTML(t(lang, 'cancelAsk', id), {
    reply_markup: {
      inline_keyboard: [
        [{ text: t(lang, 'cancelYes'), callback_data: `cancelYes:${id}` }],
        [{ text: t(lang, 'cancelNo'), callback_data: 'cancelNo' }],
      ],
    },
  });
}

/** Tasdiqlandi — buyurtma bekor qilinadi */
export async function onCancelConfirm(ctx) {
  const id = Number(ctx.match[1]);
  const user = await UserModel.findByTelegramId(ctx.from.id);
  if (!user) return ctx.answerCbQuery();

  const lang = user.language;
  const result = await OrderModel.cancelByUser(id, user.id);

  const messages = {
    NOT_FOUND: 'cancelNotFound',
    ALREADY: 'cancelAlready',
    TOO_LATE: 'cancelTooLate',
  };

  await ctx.answerCbQuery();
  await removeKeyboard(ctx);

  if (!result.ok) {
    return ctx.replyWithHTML(t(lang, messages[result.reason]));
  }

  return ctx.replyWithHTML(t(lang, 'cancelDone', id));
}

/** "Yo'q" — hech narsa qilmaymiz */
export async function onCancelDismiss(ctx) {
  await ctx.answerCbQuery();
  await removeKeyboard(ctx);
}

/** Tugmalarni olib tashlaymiz — ikki marta bosilmasin */
async function removeKeyboard(ctx) {
  try {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  } catch {
    /* xabar o'chirilgan yoki eski bo'lsa — muammo emas */
  }
}

/** Biz haqimizda */
export async function onAbout(ctx) {
  const lang = await langOf(ctx);
  await ctx.replyWithHTML(
    t(
      lang,
      'about',
      restaurantName,
      formatPrice(config.business.deliveryFee),
      formatPrice(config.business.freeDeliveryFrom),
    ),
    mainKeyboard(lang),
  );
}

/** /help */
export async function onHelp(ctx) {
  const lang = await langOf(ctx);
  await ctx.replyWithHTML(t(lang, 'help'), mainKeyboard(lang));
}

/** Har qanday boshqa xabar */
export async function onFallback(ctx) {
  const lang = await langOf(ctx);
  await ctx.replyWithHTML(t(lang, 'useMenu'), mainKeyboard(lang));
}

/** Tugma matni qaysi tilda bo'lishidan qat'i nazar tanib olish */
export function matchesButton(text, key) {
  return LANGUAGES.some((lang) => t(lang, key) === text);
}

export default {
  onStart,
  onLanguage,
  onLanguageChosen,
  onContact,
  onRequestPhone,
  onMyOrders,
  onCancelAsk,
  onCancelConfirm,
  onCancelDismiss,
  onAbout,
  onHelp,
  onFallback,
  mainKeyboard,
  languageKeyboard,
  matchesButton,
};
