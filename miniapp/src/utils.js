export function formatSum(value) {
  return (Number(value) || 0).toLocaleString('ru-RU').replace(/ /g, ' ');
}

export function formatDate(value) {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const STATUS_LABELS = {
  PENDING: 'Kutilmoqda',
  CONFIRMED: 'Tasdiqlandi',
  PREPARING: 'Tayyorlanmoqda',
  DELIVERING: "Yo'lda",
  DELIVERED: 'Yetkazildi',
  CANCELLED: 'Bekor qilindi',
};

/** Kategoriya nomiga qarab belgi tanlanadi */
const CATEGORY_EMOJI = [
  [/мезе|старт|meze/i, '🫓'],
  [/закус|snack/i, '🥪'],
  [/салат|salad/i, '🥗'],
  [/суп|çorba|corba/i, '🍲'],
  [/тандыр|пиде|пицц|pide|pizza/i, '🔥'],
  [/горяч|мясо|стейк|гриль|кебаб|донер/i, '🍖'],
  [/рыб|море|fish/i, '🐟'],
  [/паст|ризотт|pasta/i, '🍝'],
  [/гарнир|side/i, '🍚'],
  [/десерт|сладк|dessert/i, '🍰'],
  [/напит|сок|чай|кофе|лимонад|drink|ichim/i, '🥤'],
  [/завтрак|breakfast/i, '🍳'],
  [/хлеб|выпеч|bread/i, '🥖'],
];

export function categoryEmoji(category = '') {
  for (const [pattern, emoji] of CATEGORY_EMOJI) {
    if (pattern.test(category)) return emoji;
  }
  return '🍽️';
}

/** Chegirma foizi */
export function discountPercent(product) {
  if (!product?.oldPrice || product.oldPrice <= product.newPrice) return 0;
  return Math.round(100 - (product.newPrice / product.oldPrice) * 100);
}
