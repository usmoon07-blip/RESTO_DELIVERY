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
    languageSet: "Til o'zbekchaga o'zgartirildi",

    greeting: (name, restaurant, hasApp) =>
      [
        `Assalomu alaykum, <b>${name}</b>.`,
        '',
        `<b>${restaurant}</b> dasturxoniga xush kelibsiz.`,
        '',
        'Har bir taom buyurtmadan keyin tayyorlanadi —',
        "<i>tandirda, ochiq olovda, o'z vaqtida.</i>",
        '',
        hasApp
          ? 'Menyuni ochish uchun pastdagi tugmani bosing.'
          : 'Menyu tez orada ochiladi.',
      ].join('\n'),

    btnOrder: 'Buyurtma berish',
    btnPhone: 'Raqamni yuborish',
    btnOrders: 'Buyurtmalarim',
    btnAbout: 'Biz haqimizda',
    btnLanguage: 'Til',

    askPhone: "Tezroq bog'lanishimiz uchun telefon raqamingizni yuboring.",
    phonePrompt: 'Raqamingizni yuborish uchun pastdagi tugmani bosing.',
    phoneSaved: (phone) => `Rahmat! Raqamingiz saqlandi: <b>${phone}</b>`,
    phoneNotYours: "Iltimos, o'zingizning raqamingizni yuboring.",

    noOrders: "Sizda hali buyurtmalar yo'q.\n\nBirinchi buyurtmangizni bering!",
    ordersTitle: "<b>So'nggi buyurtmalaringiz:</b>",

    btnCancelOrder: (id) => `#${id} — bekor qilish`,
    cancelAsk: (id) =>
      `<b>#${id}</b> buyurtmani rostdan bekor qilamizmi?\n\nBu amalni ortga qaytarib bo'lmaydi.`,
    cancelYes: 'Ha, bekor qilinsin',
    cancelNo: "Yo'q",
    cancelDone: (id) =>
      `<b>#${id}</b> buyurtma bekor qilindi.\n\nBizni tanlaganingiz uchun rahmat — sizni yana kutamiz.`,
    cancelTooLate:
      "Bu buyurtma allaqachon tayyorlanmoqda, shuning uchun ilovadan bekor qilib bo'lmaydi.\n\n" +
      'Iltimos, restoranga qo\'ng\'iroq qiling — yordam beramiz.',
    cancelAlready: 'Bu buyurtma allaqachon bekor qilingan.',
    cancelNotFound: 'Buyurtma topilmadi.',
    startFirst: "Avval /start buyrug'ini bosing.",

    about: (restaurant, fee, free) =>
      [
        `<b>${restaurant}</b>`,
        '',
        "Turk va zamonaviy oshxona. Mezelardan tandirda pishirilgan pidegacha.",
        '',
        'Ish vaqti: 10:00 — 23:00 (har kuni)',
        `Yetkazib berish: ${fee}`,
        `${free} dan yuqori buyurtmalarga yetkazish bepul`,
        '',
        'Aloqa: +998 (90) 123-45-67',
      ].join('\n'),

    help: [
      '<b>Botdan foydalanish:</b>',
      '',
      '<b>Buyurtma berish</b> — ilovani ochadi',
      '<b>Raqamni yuborish</b> — aloqa raqamingizni saqlaydi',
      '<b>Buyurtmalarim</b> — buyurtmalar tarixi',
      '<b>Til</b> — ilova va bot tilini almashtirish',
      '',
      '/start — botni qayta ishga tushirish',
      '/language — tilni almashtirish',
    ].join('\n'),

    useMenu: 'Buyurtma berish uchun pastdagi menyudan foydalaning.',
    dataReceived: "Ma'lumot qabul qilindi.",

    devWarning:
      '<b>Eslatma (faqat siz ko\'rasiz):</b>\n\n' +
      "Mini App tugmasi hali yo'q — tunnel hali ulanmagan.\n\n" +
      "<b>RESTO.bat</b> oynasida yashil <b>TUNNEL</b> qatorini kuting: u manzilni " +
      "o'zi topadi (birinchi marta 1-2 daqiqa vaqt olishi mumkin).\n\n" +
      "So'ng /start ni qayta bosing.",

    orderAccepted: '<b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>',
    orderCourier: "Kuryerimiz tez orada bog'lanadi",
    orderNumber: 'Buyurtma raqami',
    orderItems: 'Mahsulotlar',
    orderDiscount: 'Chegirma',
    orderDelivery: 'Yetkazib berish',
    orderFree: 'Bepul',
    orderTotal: 'Jami',
    orderType: 'Turi',
    orderPayment: "To'lov",
    orderAddress: 'Manzil',
    orderPhone: 'Telefon',
    orderLocation: 'Qabul qilingan manzilingiz:',

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
    errMenuChanged: "Menyu yangilandi. Iltimos, ilovani yopib qayta oching va savatni to'ldiring.",
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
    languageSet: 'Язык изменён на русский',

    greeting: (name, restaurant, hasApp) =>
      [
        `Здравствуйте, <b>${name}</b>.`,
        '',
        `Добро пожаловать в <b>${restaurant}</b>.`,
        '',
        'Каждое блюдо готовится после заказа —',
        '<i>в тандыре, на открытом огне, точно ко времени.</i>',
        '',
        hasApp
          ? 'Чтобы открыть меню, нажмите кнопку ниже.'
          : 'Меню откроется совсем скоро.',
      ].join('\n'),

    btnOrder: 'Сделать заказ',
    btnPhone: 'Отправить номер',
    btnOrders: 'Мои заказы',
    btnAbout: 'О нас',
    btnLanguage: 'Язык',

    askPhone: 'Отправьте номер телефона, чтобы мы могли быстрее связаться.',
    phonePrompt: 'Нажмите кнопку ниже, чтобы отправить номер.',
    phoneSaved: (phone) => `Спасибо! Ваш номер сохранён: <b>${phone}</b>`,
    phoneNotYours: 'Пожалуйста, отправьте свой собственный номер.',

    noOrders: 'У вас пока нет заказов.\n\nСделайте свой первый заказ!',
    ordersTitle: '<b>Ваши последние заказы:</b>',

    btnCancelOrder: (id) => `#${id} — отменить`,
    cancelAsk: (id) =>
      `Точно отменить заказ <b>#${id}</b>?\n\nЭто действие нельзя отменить.`,
    cancelYes: 'Да, отменить',
    cancelNo: 'Нет',
    cancelDone: (id) =>
      `Заказ <b>#${id}</b> отменён.\n\nСпасибо, что выбрали нас — будем рады видеть вас снова.`,
    cancelTooLate:
      'Этот заказ уже готовится, поэтому отменить его из приложения нельзя.\n\n' +
      'Пожалуйста, позвоните в ресторан — мы поможем.',
    cancelAlready: 'Этот заказ уже отменён.',
    cancelNotFound: 'Заказ не найден.',
    startFirst: 'Сначала нажмите /start.',

    about: (restaurant, fee, free) =>
      [
        `<b>${restaurant}</b>`,
        '',
        'Турецкая и современная кухня. От мезе до пиде из тандыра.',
        '',
        'Время работы: 10:00 — 23:00 (ежедневно)',
        `Доставка: ${fee}`,
        `При заказе от ${free} доставка бесплатно`,
        '',
        'Связь: +998 (90) 123-45-67',
      ].join('\n'),

    help: [
      '<b>Как пользоваться ботом:</b>',
      '',
      '<b>Сделать заказ</b> — открывает приложение',
      '<b>Отправить номер</b> — сохраняет ваш контакт',
      '<b>Мои заказы</b> — история заказов',
      '<b>Язык</b> — сменить язык бота и приложения',
      '',
      '/start — перезапустить бота',
      '/language — сменить язык',
    ].join('\n'),

    useMenu: 'Используйте меню ниже, чтобы сделать заказ.',
    dataReceived: 'Данные получены.',

    devWarning:
      '<b>Заметка (видите только вы):</b>\n\n' +
      'Кнопки Mini App пока нет — туннель ещё не подключился.\n\n' +
      'В окне <b>RESTO.bat</b> дождитесь зелёной строки <b>TUNNEL</b>: адрес ' +
      'определится сам (в первый раз может занять 1-2 минуты).\n\n' +
      'Затем нажмите /start снова.',

    orderAccepted: '<b>Ваш заказ успешно принят!</b>',
    orderCourier: 'Наш курьер скоро свяжется с вами',
    orderNumber: 'Номер заказа',
    orderItems: 'Товары',
    orderDiscount: 'Скидка',
    orderDelivery: 'Доставка',
    orderFree: 'Бесплатно',
    orderTotal: 'Итого',
    orderType: 'Тип',
    orderPayment: 'Оплата',
    orderAddress: 'Адрес',
    orderPhone: 'Телефон',
    orderLocation: 'Принятый адрес:',

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
    errMenuChanged: 'Меню обновилось. Пожалуйста, закройте и снова откройте приложение и соберите корзину заново.',
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
    languageSet: 'Language changed to English',

    greeting: (name, restaurant, hasApp) =>
      [
        `Hello, <b>${name}</b>.`,
        '',
        `Welcome to <b>${restaurant}</b>.`,
        '',
        'Every dish is cooked to order —',
        '<i>in the tandoor, over open fire, right on time.</i>',
        '',
        hasApp
          ? 'Tap the button below to open the menu.'
          : 'The menu will open shortly.',
      ].join('\n'),

    btnOrder: 'Place an order',
    btnPhone: 'Share phone number',
    btnOrders: 'My orders',
    btnAbout: 'About us',
    btnLanguage: 'Language',

    askPhone: 'Share your phone number so we can reach you faster.',
    phonePrompt: 'Tap the button below to share your number.',
    phoneSaved: (phone) => `Thank you! Your number is saved: <b>${phone}</b>`,
    phoneNotYours: 'Please share your own phone number.',

    noOrders: "You don't have any orders yet.\n\nPlace your first order!",
    ordersTitle: '<b>Your recent orders:</b>',

    btnCancelOrder: (id) => `#${id} — cancel`,
    cancelAsk: (id) =>
      `Cancel order <b>#${id}</b>?\n\nThis cannot be undone.`,
    cancelYes: 'Yes, cancel it',
    cancelNo: 'No',
    cancelDone: (id) =>
      `Order <b>#${id}</b> has been cancelled.\n\nThank you for choosing us — we hope to see you again.`,
    cancelTooLate:
      'This order is already being prepared, so it cannot be cancelled from the app.\n\n' +
      'Please call the restaurant and we will help.',
    cancelAlready: 'This order has already been cancelled.',
    cancelNotFound: 'Order not found.',
    startFirst: 'Please press /start first.',

    about: (restaurant, fee, free) =>
      [
        `<b>${restaurant}</b>`,
        '',
        'Turkish and modern cuisine — from meze to tandoor-baked pide.',
        '',
        'Opening hours: 10:00 — 23:00 (daily)',
        `Delivery: ${fee}`,
        `Free delivery on orders over ${free}`,
        '',
        'Contact: +998 (90) 123-45-67',
      ].join('\n'),

    help: [
      '<b>How to use the bot:</b>',
      '',
      '<b>Place an order</b> — opens the app',
      '<b>Share phone number</b> — saves your contact',
      '<b>My orders</b> — order history',
      '<b>Language</b> — change the bot and app language',
      '',
      '/start — restart the bot',
      '/language — change language',
    ].join('\n'),

    useMenu: 'Use the menu below to place an order.',
    dataReceived: 'Data received.',

    devWarning:
      '<b>Note (only you can see this):</b>\n\n' +
      'The Mini App button is not available yet — the tunnel is not up.\n\n' +
      'In the <b>RESTO.bat</b> window wait for the green <b>TUNNEL</b> line: the ' +
      'address is detected automatically (the first run may take 1-2 minutes).\n\n' +
      'Then press /start again.',

    orderAccepted: '<b>Your order has been accepted!</b>',
    orderCourier: 'Our courier will contact you shortly',
    orderNumber: 'Order number',
    orderItems: 'Items',
    orderDiscount: 'Discount',
    orderDelivery: 'Delivery',
    orderFree: 'Free',
    orderTotal: 'Total',
    orderType: 'Type',
    orderPayment: 'Payment',
    orderAddress: 'Address',
    orderPhone: 'Phone',
    orderLocation: 'Your saved location:',

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
    errMenuChanged: 'The menu has been updated. Please reopen the app and fill your cart again.',
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

/** Bot xabarlarida holat oldidan turadigan sodda belgi */
export const STATUS_MARK = {
  PENDING: '•',
  CONFIRMED: '•',
  PREPARING: '•',
  DELIVERING: '•',
  DELIVERED: '•',
  CANCELLED: '×',
};

// Eski nom bilan ham ishlashi uchun
export const STATUS_EMOJI = STATUS_MARK;

export default { t, LANGUAGES, LANGUAGE_NAMES, detectLanguage, toFieldLang, STATUS_EMOJI };
