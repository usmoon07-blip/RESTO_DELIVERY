/**
 * Mini App tarjimalari: o'zbek, rus, ingliz.
 * Til tanlanmagan bo'lsa Telegram sozlamasidan aniqlanadi.
 */

export const LANGS = [
  { code: 'UZ', label: "O'zbekcha", flag: '🇺🇿' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
  { code: 'EN', label: 'English', flag: '🇬🇧' },
];

export function detectLang(code) {
  const value = String(code || '').toLowerCase();
  if (value.startsWith('ru')) return 'RU';
  if (value.startsWith('en')) return 'EN';
  return 'UZ';
}

const UZ = {
  // --- Umumiy ---
  loading: 'Yuklanmoqda...',
  errorTitle: 'Ulanishda xatolik',
  retry: 'Qayta urinish',
  save: 'Saqlash',
  openMenu: 'Menyuni ochish',
  currency: "so'm",

  // --- Onboarding ---
  onboard: [
    {
      title: 'Turk oshxonasi — eshigingizgacha',
      text: 'Mezelar, salatlar, tandirda pishirilgan pide va suşilar. Resto Restaurant menyusi endi telefoningizda.',
    },
    {
      title: 'Bu qanday ishlaydi?',
      text: "Tanlang, buyurtma bering va rohatlaning. Bor-yo'g'i uch qadam — va dasturxon tayyor.",
    },
    {
      title: '45 daqiqada yetkazamiz',
      text: "150 000 so'mdan yuqori buyurtmalarga yetkazib berish bepul.",
    },
  ],
  skip: "O'tkazib yuborish",
  next: 'Keyingisi',
  start: 'Boshlash',

  // --- Menyu ---
  navMenu: 'Menyu',
  searchPlaceholder: 'Menyudan qidirish',
  setAddress: 'Manzilni belgilang',
  etaDelivery: '45 daqiqada yetkazamiz',
  etaPickup: "15 daqiqada tayyor bo'ladi",
  searchResults: 'Qidiruv natijasi',
  nothingFound: 'Hech narsa topilmadi',
  tryAnother: "Boshqa nom bilan qidirib ko'ring",
  promos: 'Aksiyalar',
  promoCodes: 'Promokodlar',
  dishCount: (n) => `${n} ta taom`,
  itemCount: (n) => `${n} ta`,

  // --- Storylar ---
  stories: [
    { label: 'Resto haqida', title: 'Resto Restaurant', text: "Turk va zamonaviy oshxona. Mezelardan tandirda pishirilgan pidegacha — hammasi bir joyda." },
    { label: 'Mezelar', title: "Mezelar — 39 000 so'm", text: 'Acili Ezme, Haydari, Humus, Haravat. Stolingizni haqiqiy turk taomlari bilan boshlang.' },
    { label: 'Tandir', title: 'Tandirda pishiriladi', text: "Pide va pitsalar an'anaviy tandirda pishiriladi — shuning uchun ta'mi boshqacha." },
    { label: 'Promokod', title: 'RESTO10', text: "150 000 so'mdan yuqori buyurtmalarga 10% chegirma. Savatda promokodni kiriting." },
    { label: 'Yetkazish', title: '45 daqiqada yetkazamiz', text: "150 000 so'mdan yuqori buyurtmalarga yetkazib berish bepul." },
  ],

  // --- Bannerlar ---
  banners: [
    { tag: 'Yetkazib berish', title: 'Bepul yetkazib berish', sub: "150 000 so'mdan yuqori buyurtmalarga" },
    { tag: 'Promokod', title: 'RESTO10 — 10% chegirma', sub: 'Savatda promokodni kiriting' },
    { tag: 'Yangi', title: 'Tandirda pishirilgan pide', sub: "An'anaviy retsept, zamonaviy ta'm" },
  ],

  // --- Mahsulot ---
  addToCart: 'Savatchaga',
  ingredients: 'Tarkibi',
  addedToCart: (name) => `${name} savatga qo'shildi`,

  // --- Savat ---
  cart: 'Savat',
  cartKinds: (n) => `${n} xil taom`,
  cartEmpty: "Savat bo'sh",
  cartEmptyText: "Menyudan o'zingizga yoqqan taomni tanlang",
  upsell: (name, price, cur) =>
    `Bunga qo'shimcha ravishda ${name} ni atigi ${price} ${cur} ga qo'shasizmi?`,
  promoPlaceholder: 'Promokod',
  promoApply: "Qo'llash",
  promoRemove: 'Olib tashlash',
  promoApplied: (sum) => `Promokod qo'llanildi: −${sum}`,
  promoRemoved: 'Promokod olib tashlandi',
  promoCancelled: 'Promokod bekor qilindi',
  sumItems: 'Taomlar',
  sumDiscount: 'Chegirma',
  sumDelivery: 'Yetkazib berish',
  sumFree: 'Bepul',
  sumTotal: 'Jami',
  freeDeliveryLeft: (sum, cur) =>
    `Yana ${sum} ${cur} qo'shsangiz, yetkazib berish bepul bo'ladi`,
  checkout: 'Rasmiylashtirish',

  // --- Rasmiylashtirish ---
  checkoutTitle: 'Rasmiylashtirish',
  howToGet: 'Qanday olasiz?',
  delivery: 'Yetkazib berish',
  pickup: 'Borib olish',
  min45: '45 daqiqa',
  min15: '15 daqiqa',
  deliveryAddress: 'Yetkazib berish manzili',
  pickupAddress: 'Olib ketish manzili',
  detectLocation: 'Joriy joylashuvimni aniqlash',
  detecting: 'Aniqlanmoqda...',
  locationFound: 'Joylashuv aniqlandi',
  addressPlaceholder: "Ko'cha, uy, xonadon, mo'ljal...",
  phoneLabel: 'Telefon raqamingiz',
  phoneFromTelegram: 'Telegramdagi raqamimni olish',
  phoneManual: "Raqamni qo'lda kiriting yoki botdagi tugmani bosing",
  paymentType: "To'lov turi",
  cash: 'Naqd pul',
  toCourier: 'Kuryerga',
  card: 'Karta orqali',
  terminal: 'Terminal / Click',
  commentLabel: 'Izoh (ixtiyoriy)',
  commentPlaceholder: "Masalan: eshik qo'ng'irog'i ishlamaydi, qo'ng'iroq qiling",
  itemsKinds: (n) => `Taomlar (${n} xil)`,
  payTotal: "Jami to'lov",
  confirmOrder: 'Buyurtmani tasdiqlash',
  sending: 'Yuborilmoqda...',
  errPhone: "Telefon raqamingizni to'liq kiriting",
  errAddress: 'Manzilni kiriting yoki joylashuvni aniqlang',

  // --- Manzil oynasi ---
  addressTitle: 'Manzil',
  addressSub: 'Buyurtmani qanday olishni tanlang',
  addressSaved: 'Manzil saqlandi',
  address: 'Manzil',

  // --- Buyurtmalar ---
  orders: 'Buyurtmalar',
  ordersCount: (n) => `${n} ta buyurtma`,
  ordersHistory: 'Xaridlar tarixi',
  noOrders: "Buyurtmalar yo'q",
  noOrdersText: 'Birinchi buyurtmangizni bering — tarix shu yerda saqlanadi',
  orderNo: (id) => `Buyurtma #${id}`,
  reorder: 'Yana buyurtma qilish',
  cancelOrder: 'Bekor qilish',
  cancelAsk: (id) => `#${id} buyurtmani bekor qilamizmi?`,
  cancelDone: 'Buyurtma bekor qilindi',
  cancelling: 'Bekor qilinmoqda...',
  reorderDone: "Savatga qo'shildi",
  reorderMissing: "Bu taomlar hozir menyuda yo'q",

  // --- Aksiyalar ---
  promosSub: 'Promokodlar va chegirmadagi taomlar',
  noPromos: "Hozircha aksiya yo'q",
  noPromosText: "Yangi takliflar tez orada shu yerda paydo bo'ladi",
  discountPercent: (v) => `${v}% chegirma`,
  discountFixed: (v, cur) => `${v} ${cur} chegirma`,
  minOrder: (sum, cur) => `${sum} ${cur} dan yuqori buyurtmalarga`,
  anyOrder: 'Har qanday buyurtmaga amal qiladi',
  copied: "✓ Nusxalandi — savatda qo'llang",
  copiedToast: (code) => `${code} nusxalandi`,
  salesTitle: 'Chegirmadagi taomlar',

  // --- Profil ---
  profile: 'Profil',
  noPhone: 'Telefon raqam kiritilmagan',
  statOrders: 'Buyurtmalar',
  statSpent: (cur) => `Jami xarid (${cur})`,
  rowOrders: 'Mening buyurtmalarim',
  rowOrdersSub: 'Xaridlar tarixi va qayta buyurtma',
  rowAddress: 'Yetkazib berish manzili',
  rowNoAddress: 'Manzil saqlanmagan',
  rowContact: 'Aloqa',
  rowHours: 'Ish vaqti',
  rowHoursSub: 'Har kuni 10:00 — 23:00',
  rowLanguage: 'Til',

  // --- Muvaffaqiyat ---
  successTitle: 'Buyurtma qabul qilindi!',
  successText:
    "Kuryerimiz tez orada siz bilan bog'lanadi. Tafsilotlarni botdan ko'rishingiz mumkin.",

  status: {
    PENDING: 'Kutilmoqda',
    CONFIRMED: 'Tasdiqlandi',
    PREPARING: 'Tayyorlanmoqda',
    DELIVERING: "Yo'lda",
    DELIVERED: 'Yetkazildi',
    CANCELLED: 'Bekor qilindi',
  },
};

const RU = {
  loading: 'Загрузка...',
  errorTitle: 'Ошибка подключения',
  retry: 'Попробовать снова',
  save: 'Сохранить',
  openMenu: 'Открыть меню',
  currency: 'сум',

  onboard: [
    {
      title: 'Турецкая кухня — до вашей двери',
      text: 'Мезе, салаты, пиде из тандыра и суши. Меню Resto Restaurant теперь в вашем телефоне.',
    },
    {
      title: 'Как это работает?',
      text: 'Выбирайте, заказывайте и наслаждайтесь. Всего три шага — и стол накрыт.',
    },
    {
      title: 'Доставим за 45 минут',
      text: 'При заказе от 150 000 сум доставка бесплатна.',
    },
  ],
  skip: 'Пропустить',
  next: 'Далее',
  start: 'Начать',

  navMenu: 'Меню',
  searchPlaceholder: 'Поиск по меню',
  setAddress: 'Укажите адрес',
  etaDelivery: 'Доставим за 45 минут',
  etaPickup: 'Будет готово за 15 минут',
  searchResults: 'Результаты поиска',
  nothingFound: 'Ничего не найдено',
  tryAnother: 'Попробуйте другое название',
  promos: 'Акции',
  promoCodes: 'Промокоды',
  dishCount: (n) => `${n} блюд`,
  itemCount: (n) => `${n} шт`,

  stories: [
    { label: 'О Resto', title: 'Resto Restaurant', text: 'Турецкая и современная кухня. От мезе до пиде из тандыра — всё в одном месте.' },
    { label: 'Мезе', title: 'Мезе — 39 000 сум', text: 'Ачил Эзме, Хайдари, Хумус, Хоровац. Начните стол с настоящих турецких закусок.' },
    { label: 'Тандыр', title: 'Готовим в тандыре', text: 'Пиде и пиццы готовятся в традиционном тандыре — поэтому вкус особенный.' },
    { label: 'Промокод', title: 'RESTO10', text: 'Скидка 10% при заказе от 150 000 сум. Введите промокод в корзине.' },
    { label: 'Доставка', title: 'Доставим за 45 минут', text: 'При заказе от 150 000 сум доставка бесплатна.' },
  ],

  banners: [
    { tag: 'Доставка', title: 'Бесплатная доставка', sub: 'При заказе от 150 000 сум' },
    { tag: 'Промокод', title: 'RESTO10 — скидка 10%', sub: 'Введите промокод в корзине' },
    { tag: 'Новинка', title: 'Пиде из тандыра', sub: 'Традиционный рецепт, современный вкус' },
  ],

  addToCart: 'В корзину',
  ingredients: 'Состав',
  addedToCart: (name) => `${name} добавлено в корзину`,

  cart: 'Корзина',
  cartKinds: (n) => `${n} наименований`,
  cartEmpty: 'Корзина пуста',
  cartEmptyText: 'Выберите понравившееся блюдо из меню',
  upsell: (name, price, cur) =>
    `Добавить к заказу ${name} всего за ${price} ${cur}?`,
  promoPlaceholder: 'Промокод',
  promoApply: 'Применить',
  promoRemove: 'Убрать',
  promoApplied: (sum) => `Промокод применён: −${sum}`,
  promoRemoved: 'Промокод убран',
  promoCancelled: 'Промокод отменён',
  sumItems: 'Блюда',
  sumDiscount: 'Скидка',
  sumDelivery: 'Доставка',
  sumFree: 'Бесплатно',
  sumTotal: 'Итого',
  freeDeliveryLeft: (sum, cur) =>
    `Добавьте ещё на ${sum} ${cur} — и доставка станет бесплатной`,
  checkout: 'Оформить',

  checkoutTitle: 'Оформление',
  howToGet: 'Как получите заказ?',
  delivery: 'Доставка',
  pickup: 'Самовывоз',
  min45: '45 минут',
  min15: '15 минут',
  deliveryAddress: 'Адрес доставки',
  pickupAddress: 'Адрес самовывоза',
  detectLocation: 'Определить моё местоположение',
  detecting: 'Определяем...',
  locationFound: 'Местоположение определено',
  addressPlaceholder: 'Улица, дом, квартира, ориентир...',
  phoneLabel: 'Ваш номер телефона',
  phoneFromTelegram: 'Взять номер из Telegram',
  phoneManual: 'Введите номер вручную или нажмите кнопку в боте',
  paymentType: 'Способ оплаты',
  cash: 'Наличные',
  toCourier: 'Курьеру',
  card: 'Картой',
  terminal: 'Терминал / Click',
  commentLabel: 'Комментарий (необязательно)',
  commentPlaceholder: 'Например: домофон не работает, позвоните',
  itemsKinds: (n) => `Блюда (${n} наим.)`,
  payTotal: 'Итого к оплате',
  confirmOrder: 'Подтвердить заказ',
  sending: 'Отправляем...',
  errPhone: 'Введите номер телефона полностью',
  errAddress: 'Укажите адрес или определите местоположение',

  addressTitle: 'Адрес',
  addressSub: 'Выберите, как получить заказ',
  addressSaved: 'Адрес сохранён',
  address: 'Адрес',

  orders: 'Заказы',
  ordersCount: (n) => `${n} заказов`,
  ordersHistory: 'История покупок',
  noOrders: 'Заказов нет',
  noOrdersText: 'Сделайте первый заказ — история появится здесь',
  orderNo: (id) => `Заказ #${id}`,
  reorder: 'Заказать снова',
  cancelOrder: 'Отменить',
  cancelAsk: (id) => `Отменить заказ #${id}?`,
  cancelDone: 'Заказ отменён',
  cancelling: 'Отменяем...',
  reorderDone: 'Добавлено в корзину',
  reorderMissing: 'Этих блюд сейчас нет в меню',

  promosSub: 'Промокоды и блюда со скидкой',
  noPromos: 'Пока нет акций',
  noPromosText: 'Новые предложения появятся здесь совсем скоро',
  discountPercent: (v) => `Скидка ${v}%`,
  discountFixed: (v, cur) => `Скидка ${v} ${cur}`,
  minOrder: (sum, cur) => `При заказе от ${sum} ${cur}`,
  anyOrder: 'Действует на любой заказ',
  copied: '✓ Скопировано — примените в корзине',
  copiedToast: (code) => `${code} скопирован`,
  salesTitle: 'Блюда со скидкой',

  profile: 'Профиль',
  noPhone: 'Номер телефона не указан',
  statOrders: 'Заказов',
  statSpent: (cur) => `Всего покупок (${cur})`,
  rowOrders: 'Мои заказы',
  rowOrdersSub: 'История покупок и повтор заказа',
  rowAddress: 'Адрес доставки',
  rowNoAddress: 'Адрес не сохранён',
  rowContact: 'Связь',
  rowHours: 'Время работы',
  rowHoursSub: 'Ежедневно 10:00 — 23:00',
  rowLanguage: 'Язык',

  successTitle: 'Заказ принят!',
  successText: 'Наш курьер скоро свяжется с вами. Детали можно посмотреть в боте.',

  status: {
    PENDING: 'Ожидает',
    CONFIRMED: 'Подтверждён',
    PREPARING: 'Готовится',
    DELIVERING: 'В пути',
    DELIVERED: 'Доставлен',
    CANCELLED: 'Отменён',
  },
};

const EN = {
  loading: 'Loading...',
  errorTitle: 'Connection error',
  retry: 'Try again',
  save: 'Save',
  openMenu: 'Open the menu',
  currency: "so'm",

  onboard: [
    {
      title: 'Turkish cuisine at your door',
      text: 'Meze, salads, tandoor-baked pide and sushi. The Resto Restaurant menu is now on your phone.',
    },
    {
      title: 'How does it work?',
      text: 'Choose, order and enjoy. Just three steps — and the table is set.',
    },
    {
      title: 'Delivered in 45 minutes',
      text: "Free delivery on orders over 150,000 so'm.",
    },
  ],
  skip: 'Skip',
  next: 'Next',
  start: 'Get started',

  navMenu: 'Menu',
  searchPlaceholder: 'Search the menu',
  setAddress: 'Set your address',
  etaDelivery: 'Delivered in 45 minutes',
  etaPickup: 'Ready in 15 minutes',
  searchResults: 'Search results',
  nothingFound: 'Nothing found',
  tryAnother: 'Try a different name',
  promos: 'Offers',
  promoCodes: 'Promo codes',
  dishCount: (n) => `${n} dishes`,
  itemCount: (n) => `${n} items`,

  stories: [
    { label: 'About Resto', title: 'Resto Restaurant', text: 'Turkish and modern cuisine. From meze to tandoor-baked pide — all in one place.' },
    { label: 'Meze', title: "Meze — 39,000 so'm", text: 'Acili Ezme, Haydari, Hummus, Horovats. Start your table with true Turkish appetizers.' },
    { label: 'Tandoor', title: 'Baked in a tandoor', text: 'Pide and pizzas are baked in a traditional tandoor — that is why the taste is different.' },
    { label: 'Promo code', title: 'RESTO10', text: "10% off on orders over 150,000 so'm. Enter the code in your cart." },
    { label: 'Delivery', title: 'Delivered in 45 minutes', text: "Free delivery on orders over 150,000 so'm." },
  ],

  banners: [
    { tag: 'Delivery', title: 'Free delivery', sub: "On orders over 150,000 so'm" },
    { tag: 'Promo code', title: 'RESTO10 — 10% off', sub: 'Enter the code in your cart' },
    { tag: 'New', title: 'Tandoor-baked pide', sub: 'Traditional recipe, modern taste' },
  ],

  addToCart: 'Add to cart',
  ingredients: 'Ingredients',
  addedToCart: (name) => `${name} added to cart`,

  cart: 'Cart',
  cartKinds: (n) => `${n} items`,
  cartEmpty: 'Your cart is empty',
  cartEmptyText: 'Pick something you like from the menu',
  upsell: (name, price, cur) => `Add ${name} to your order for just ${price} ${cur}?`,
  promoPlaceholder: 'Promo code',
  promoApply: 'Apply',
  promoRemove: 'Remove',
  promoApplied: (sum) => `Promo code applied: −${sum}`,
  promoRemoved: 'Promo code removed',
  promoCancelled: 'Promo code cancelled',
  sumItems: 'Items',
  sumDiscount: 'Discount',
  sumDelivery: 'Delivery',
  sumFree: 'Free',
  sumTotal: 'Total',
  freeDeliveryLeft: (sum, cur) => `Add ${sum} ${cur} more and delivery is free`,
  checkout: 'Checkout',

  checkoutTitle: 'Checkout',
  howToGet: 'How would you like it?',
  delivery: 'Delivery',
  pickup: 'Pickup',
  min45: '45 minutes',
  min15: '15 minutes',
  deliveryAddress: 'Delivery address',
  pickupAddress: 'Pickup address',
  detectLocation: 'Detect my location',
  detecting: 'Detecting...',
  locationFound: 'Location detected',
  addressPlaceholder: 'Street, building, apartment, landmark...',
  phoneLabel: 'Your phone number',
  phoneFromTelegram: 'Use my Telegram number',
  phoneManual: 'Enter the number manually or tap the button in the bot',
  paymentType: 'Payment method',
  cash: 'Cash',
  toCourier: 'To the courier',
  card: 'Card',
  terminal: 'Terminal / Click',
  commentLabel: 'Comment (optional)',
  commentPlaceholder: 'For example: the doorbell is broken, please call',
  itemsKinds: (n) => `Items (${n})`,
  payTotal: 'Total to pay',
  confirmOrder: 'Confirm order',
  sending: 'Sending...',
  errPhone: 'Please enter your full phone number',
  errAddress: 'Enter an address or detect your location',

  addressTitle: 'Address',
  addressSub: 'Choose how you want your order',
  addressSaved: 'Address saved',
  address: 'Address',

  orders: 'Orders',
  ordersCount: (n) => `${n} orders`,
  ordersHistory: 'Purchase history',
  noOrders: 'No orders yet',
  noOrdersText: 'Place your first order — history will appear here',
  orderNo: (id) => `Order #${id}`,
  reorder: 'Order again',
  cancelOrder: 'Cancel',
  cancelAsk: (id) => `Cancel order #${id}?`,
  cancelDone: 'Order cancelled',
  cancelling: 'Cancelling...',
  reorderDone: 'Added to cart',
  reorderMissing: 'These dishes are not on the menu right now',

  promosSub: 'Promo codes and discounted dishes',
  noPromos: 'No offers yet',
  noPromosText: 'New offers will appear here very soon',
  discountPercent: (v) => `${v}% off`,
  discountFixed: (v, cur) => `${v} ${cur} off`,
  minOrder: (sum, cur) => `On orders over ${sum} ${cur}`,
  anyOrder: 'Valid on any order',
  copied: '✓ Copied — apply it in your cart',
  copiedToast: (code) => `${code} copied`,
  salesTitle: 'Discounted dishes',

  profile: 'Profile',
  noPhone: 'No phone number saved',
  statOrders: 'Orders',
  statSpent: (cur) => `Total spent (${cur})`,
  rowOrders: 'My orders',
  rowOrdersSub: 'Purchase history and reordering',
  rowAddress: 'Delivery address',
  rowNoAddress: 'No address saved',
  rowContact: 'Contact',
  rowHours: 'Opening hours',
  rowHoursSub: 'Daily 10:00 — 23:00',
  rowLanguage: 'Language',

  successTitle: 'Order accepted!',
  successText: 'Our courier will contact you shortly. You can see the details in the bot.',

  status: {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    DELIVERING: 'On the way',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  },
};

const PACKS = { UZ, RU, EN };

/** Tarjima funksiyasini qaytaradi */
export function makeT(lang) {
  const pack = PACKS[lang] || UZ;
  return (key, ...args) => {
    const value = pack[key] ?? UZ[key] ?? key;
    return typeof value === 'function' ? value(...args) : value;
  };
}

/* ------------------- Mahsulot maydonlarini tilga moslash ------------------- */

export function productName(product, lang) {
  if (lang === 'UZ') return product.nameUz || product.name;
  if (lang === 'EN') return product.nameEn || product.name;
  return product.name;
}

export function productDescription(product, lang) {
  if (lang === 'UZ') return product.descriptionUz || product.description;
  if (lang === 'EN') return product.descriptionEn || product.description;
  return product.description;
}

export function productIngredients(product, lang) {
  if (lang === 'UZ') return product.ingredientsUz?.length ? product.ingredientsUz : product.ingredients;
  if (lang === 'EN') return product.ingredientsEn?.length ? product.ingredientsEn : product.ingredients;
  return product.ingredients;
}

/** Kategoriya obyekti { key, ru, uz, en } dan nom olish */
export function categoryName(category, lang) {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category[lang.toLowerCase()] || category.ru || category.key;
}

export default { makeT, detectLang, LANGS };
