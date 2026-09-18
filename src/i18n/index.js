/**
 * Backend va bot uchun tarjimalar: o'zbek, rus, ingliz.
 */

export const LANGUAGES = ['UZ', 'RU', 'EN'];

export const LANGUAGE_NAMES = {
  UZ: "🇺🇿 O'zbekcha",
  RU: '🇷🇺 Русский',
  EN: '🇬🇧 English',
};

/** 'UZ' -> 'uz' (mahsulot maydonlari uchun) */
export const toFieldLang = (lang) => String(lang || 'UZ').toLowerCase();

/** Telegram language_code -> bizning til kodi */
export function detectLanguage(code) {
  const value = String(code || '').toLowerCase();
  if (value.startsWith('ru')) return 'RU';
  if (value.startsWith('en')) return 'EN';
  if (value.startsWith('uz')) return 'UZ';
  return 'UZ';
}

const DICT = {
  UZ: {
    chooseLanguage: 'Tilni tanlang / Выберите язык / Choose a language',
    languageSet: "✅ Til o'zbekchaga o'zgartirildi",

    greeting: (name, restaurant) =>
      [
        `Assalomu alaykum, <b>${name}</b>! 👋`,
        '',
        `<b>${restaurant}</b> — turk va zamonaviy oshxona.`,
        '',
        '🔥 Tandirda pishiriladi',
        '🚀 45 daqiqada yetkazib berish',
        "💳 Naqd yoki karta orqali to'lov",
        '',
        'Buyurtma berish uchun pastdagi tugmani bosing 👇',
      ].join('\n'),

    btnOrder: '🍽 Buyurtma berish',
    btnPhone: '📞 Raqamni yuborish',
    btnOrders: '📜 Buyurtmalarim',
    btnAbout: 'ℹ️ Biz haqimizda',
    btnLanguage: '🌐 Til',

    askPhone: "Tezroq bog'lanishimiz uchun telefon raqamingizni yuboring 👇",
    phonePrompt: 'Raqamingizni yuborish uchun pastdagi tugmani bosing 👇',
    phoneSaved: (phone) => `✅ Rahmat! Raqamingiz saqlandi: <b>${phone}</b>`,
    phoneNotYours: "Iltimos, o'zingizning raqamingizni yuboring.",

    noOrders: "Sizda hali buyurtmalar yo'q 🤷‍♂️\n\nBirinchi buyurtmangizni bering!",
    ordersTitle: "📜 <b>So'nggi buyurtmalaringiz:</b>",
    startFirst: "Avval /start buyrug'ini bosing.",

    about: (restaurant, fee, free) =>
      [
        `<b>${restaurant}</b> 🍽`,
        '',
        "Turk va zamonaviy oshxona. Mezelardan tandirda pishirilgan pidegacha.",
        '',
        '🕐 Ish vaqti: 10:00 — 23:00 (har kuni)',
        `🛵 Yetkazib berish: ${fee}`,
        `🎁 ${free} dan yuqori buyurtmalarga yetkazish BEPUL`,
        '',
        '📞 Aloqa: +998 (90) 123-45-67',
      ].join('\n'),

    help: [
      '<b>Botdan foydalanish:</b>',
      '',
      '🍽 <b>Buyurtma berish</b> — ilovani ochadi',
      '📞 <b>Raqamni yuborish</b> — aloqa raqamingizni saqlaydi',
      '📜 <b>Buyurtmalarim</b> — buyurtmalar tarixi',
      '🌐 <b>Til</b> — ilova va bot tilini almashtirish',
      '',
      '/start — botni qayta ishga tushirish',
      '/language — tilni almashtirish',
    ].join('\n'),

    useMenu: 'Buyurtma berish uchun pastdagi menyudan foydalaning 👇',
    dataReceived: "✅ Ma'lumot qabul qilindi.",

    devWarning:
      '⚠️ <b>Diqqat (faqat dasturchi uchun):</b>\n\n' +
      "Mini App tugmasi ko'rinishi uchun <code>.env</code> faylidagi " +
      '<code>WEB_APP_URL</code> ga <b>ngrok</b> dan olingan <b>https://</b> manzilni yozing ' +
      'va serverni qayta ishga tushiring.',

    orderAccepted: '🎉 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>',
    orderCourier: "Kuryerimiz tez orada bog'lanadi",
    orderNumber: 'Buyurtma raqami',
    orderItems: 'Mahsulotlar',
    orderDiscount: 'Chegirma',
    orderDelivery: 'Yetkazib berish',
    orderFree: 'Bepul 🎁',
    orderTotal: 'Jami',
    orderType: 'Turi',
    orderPayment: "To'lov",
    orderAddress: 'Manzil',
    orderPhone: 'Telefon',
    orderLocation: '📍 Qabul qilingan manzilingiz:',

    statusTitle: (id) => `<b>Buyurtma #${id}</b>`,
    statusLabel: 'Holati',
    sumLabel: 'Summa',

    status: {
      PENDING: 'Kutilmoqda',
      CONFIRMED: 'Tasdiqlandi',
      PREPARING: 'Tayyorlanmoqda',
      DELIVERING: "Yo'lda",
      DELIVERED: 'Yetkazildi',
      CANCELLED: 'Bekor qilindi',
    },
    delivery: { DELIVERY: 'Yetkazib berish', PICKUP: 'Borib olish' },
    payment: { CASH: 'Naqd pul', CARD: 'Karta orqali' },

    errAuth: 'Avtorizatsiya xatosi. Ilovani Telegram orqali oching.',
    errCartEmpty: "Savat bo'sh",
    errDeliveryType: "Yetkazish turi noto'g'ri",
    errPaymentType: "To'lov turi noto'g'ri",
    errPhone: 'Telefon raqamingizni kiriting',
    errAddress: 'Yetkazib berish manzilini kiriting',
    errProducts: 'Tanlangan mahsulotlar topilmadi',
    errPhoneInvalid: "Telefon raqam noto'g'ri",
    errPromoEmpty: 'Promokodni kiriting',
    errPromoNotFound: 'Bunday promokod topilmadi',
    errPromoExpired: 'Promokod muddati tugagan',
    errPromoLimit: 'Promokoddan foydalanish limiti tugagan',
    errPromoMin: (sum) => `Bu promokod ${sum} so'mdan yuqori buyurtmalarga amal qiladi`,
  },

  RU: {
    chooseLanguage: 'Tilni tanlang / Выберите язык / Choose a language',
    languageSet: '✅ Язык изменён на русский',

    greeting: (name, restaurant) =>
      [
        `Здравствуйте, <b>${name}</b>! 👋`,
        '',
        `<b>${restaurant}</b> — турецкая и современная кухня.`,
        '',
        '🔥 Готовим в тандыре',
        '🚀 Доставка за 45 минут',
        '💳 Оплата наличными или картой',
        '',
        'Нажмите кнопку ниже, чтобы сделать заказ 👇',
      ].join('\n'),

    btnOrder: '🍽 Сделать заказ',
    btnPhone: '📞 Отправить номер',
    btnOrders: '📜 Мои заказы',
    btnAbout: 'ℹ️ О нас',
    btnLanguage: '🌐 Язык',

    askPhone: 'Отправьте номер телефона, чтобы мы могли быстрее связаться 👇',
    phonePrompt: 'Нажмите кнопку ниже, чтобы отправить номер 👇',
    phoneSaved: (phone) => `✅ Спасибо! Ваш номер сохранён: <b>${phone}</b>`,
    phoneNotYours: 'Пожалуйста, отправьте свой собственный номер.',

    noOrders: 'У вас пока нет заказов 🤷‍♂️\n\nСделайте свой первый заказ!',
    ordersTitle: '📜 <b>Ваши последние заказы:</b>',
    startFirst: 'Сначала нажмите /start.',

    about: (restaurant, fee, free) =>
      [
        `<b>${restaurant}</b> 🍽`,
        '',
        'Турецкая и современная кухня. От мезе до пиде из тандыра.',
        '',
        '🕐 Время работы: 10:00 — 23:00 (ежедневно)',
        `🛵 Доставка: ${fee}`,
        `🎁 При заказе от ${free} доставка БЕСПЛАТНО`,
        '',
        '📞 Связь: +998 (90) 123-45-67',
      ].join('\n'),

    help: [
      '<b>Как пользоваться ботом:</b>',
      '',
      '🍽 <b>Сделать заказ</b> — открывает приложение',
      '📞 <b>Отправить номер</b> — сохраняет ваш контакт',
      '📜 <b>Мои заказы</b> — история заказов',
      '🌐 <b>Язык</b> — сменить язык бота и приложения',
      '',
      '/start — перезапустить бота',
      '/language — сменить язык',
    ].join('\n'),

    useMenu: 'Используйте меню ниже, чтобы сделать заказ 👇',
    dataReceived: '✅ Данные получены.',

    devWarning:
      '⚠️ <b>Внимание (только для разработчика):</b>\n\n' +
      'Чтобы появилась кнопка Mini App, укажите в файле <code>.env</code> ' +
      'в <code>WEB_APP_URL</code> адрес <b>https://</b> из <b>ngrok</b> ' +
      'и перезапустите сервер.',

    orderAccepted: '🎉 <b>Ваш заказ успешно принят!</b>',
    orderCourier: 'Наш курьер скоро свяжется с вами',
    orderNumber: 'Номер заказа',
    orderItems: 'Товары',
    orderDiscount: 'Скидка',
    orderDelivery: 'Доставка',
    orderFree: 'Бесплатно 🎁',
    orderTotal: 'Итого',
    orderType: 'Тип',
    orderPayment: 'Оплата',
    orderAddress: 'Адрес',
    orderPhone: 'Телефон',
    orderLocation: '📍 Принятый адрес:',

    statusTitle: (id) => `<b>Заказ #${id}</b>`,
    statusLabel: 'Статус',
    sumLabel: 'Сумма',

    status: {
      PENDING: 'Ожидает',
      CONFIRMED: 'Подтверждён',
      PREPARING: 'Готовится',
      DELIVERING: 'В пути',
      DELIVERED: 'Доставлен',
      CANCELLED: 'Отменён',
    },
    delivery: { DELIVERY: 'Доставка', PICKUP: 'Самовывоз' },
    payment: { CASH: 'Наличные', CARD: 'Картой' },

    errAuth: 'Ошибка авторизации. Откройте приложение через Telegram.',
    errCartEmpty: 'Корзина пуста',
    errDeliveryType: 'Неверный тип доставки',
    errPaymentType: 'Неверный тип оплаты',
    errPhone: 'Введите номер телефона',
    errAddress: 'Укажите адрес доставки',
    errProducts: 'Выбранные товары не найдены',
    errPhoneInvalid: 'Неверный номер телефона',
    errPromoEmpty: 'Введите промокод',
    errPromoNotFound: 'Такой промокод не найден',
    errPromoExpired: 'Срок действия промокода истёк',
    errPromoLimit: 'Лимит использования промокода исчерпан',
    errPromoMin: (sum) => `Промокод действует на заказы от ${sum} сум`,
  },

  EN: {
    chooseLanguage: 'Tilni tanlang / Выберите язык / Choose a language',
    languageSet: '✅ Language changed to English',

    greeting: (name, restaurant) =>
      [
        `Hello, <b>${name}</b>! 👋`,
        '',
        `<b>${restaurant}</b> — Turkish and modern cuisine.`,
        '',
        '🔥 Cooked in a tandoor',
        '🚀 Delivery in 45 minutes',
        '💳 Pay by cash or card',
        '',
        'Tap the button below to place an order 👇',
      ].join('\n'),

    btnOrder: '🍽 Place an order',
    btnPhone: '📞 Share phone number',
    btnOrders: '📜 My orders',
    btnAbout: 'ℹ️ About us',
    btnLanguage: '🌐 Language',

    askPhone: 'Share your phone number so we can reach you faster 👇',
    phonePrompt: 'Tap the button below to share your number 👇',
    phoneSaved: (phone) => `✅ Thank you! Your number is saved: <b>${phone}</b>`,
    phoneNotYours: 'Please share your own phone number.',

    noOrders: "You don't have any orders yet 🤷‍♂️\n\nPlace your first order!",
    ordersTitle: '📜 <b>Your recent orders:</b>',
    startFirst: 'Please press /start first.',

    about: (restaurant, fee, free) =>
      [
        `<b>${restaurant}</b> 🍽`,
        '',
        'Turkish and modern cuisine — from meze to tandoor-baked pide.',
        '',
        '🕐 Opening hours: 10:00 — 23:00 (daily)',
        `🛵 Delivery: ${fee}`,
        `🎁 FREE delivery on orders over ${free}`,
        '',
        '📞 Contact: +998 (90) 123-45-67',
      ].join('\n'),

    help: [
      '<b>How to use the bot:</b>',
      '',
      '🍽 <b>Place an order</b> — opens the app',
      '📞 <b>Share phone number</b> — saves your contact',
      '📜 <b>My orders</b> — order history',
      '🌐 <b>Language</b> — change the bot and app language',
      '',
      '/start — restart the bot',
      '/language — change language',
    ].join('\n'),

    useMenu: 'Use the menu below to place an order 👇',
    dataReceived: '✅ Data received.',

    devWarning:
      '⚠️ <b>Note (for the developer only):</b>\n\n' +
      'For the Mini App button to appear, set <code>WEB_APP_URL</code> in ' +
      'your <code>.env</code> file to the <b>https://</b> address from <b>ngrok</b> ' +
      'and restart the server.',

    orderAccepted: '🎉 <b>Your order has been accepted!</b>',
    orderCourier: 'Our courier will contact you shortly',
    orderNumber: 'Order number',
    orderItems: 'Items',
    orderDiscount: 'Discount',
    orderDelivery: 'Delivery',
    orderFree: 'Free 🎁',
    orderTotal: 'Total',
    orderType: 'Type',
    orderPayment: 'Payment',
    orderAddress: 'Address',
    orderPhone: 'Phone',
    orderLocation: '📍 Your saved location:',

    statusTitle: (id) => `<b>Order #${id}</b>`,
    statusLabel: 'Status',
    sumLabel: 'Total',

    status: {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      PREPARING: 'Preparing',
      DELIVERING: 'On the way',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
    },
    delivery: { DELIVERY: 'Delivery', PICKUP: 'Pickup' },
    payment: { CASH: 'Cash', CARD: 'Card' },

    errAuth: 'Authorization error. Please open the app from Telegram.',
    errCartEmpty: 'Your cart is empty',
    errDeliveryType: 'Invalid delivery type',
    errPaymentType: 'Invalid payment type',
    errPhone: 'Please enter your phone number',
    errAddress: 'Please enter the delivery address',
    errProducts: 'Selected items were not found',
    errPhoneInvalid: 'Invalid phone number',
    errPromoEmpty: 'Please enter a promo code',
    errPromoNotFound: 'Promo code not found',
    errPromoExpired: 'This promo code has expired',
    errPromoLimit: 'This promo code has reached its usage limit',
    errPromoMin: (sum) => `This promo code applies to orders over ${sum} so'm`,
  },
};

/** t('RU', 'btnOrder') yoki t('RU', 'greeting', name, restaurant) */
export function t(lang, key, ...args) {
  const pack = DICT[lang] || DICT.UZ;
  const value = pack[key] ?? DICT.UZ[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
}

export const STATUS_EMOJI = {
  PENDING: '🕐',
  CONFIRMED: '✅',
  PREPARING: '👨‍🍳',
  DELIVERING: '🛵',
  DELIVERED: '🎉',
  CANCELLED: '❌',
};

export default { t, LANGUAGES, LANGUAGE_NAMES, detectLanguage, toFieldLang, STATUS_EMOJI };
