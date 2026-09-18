export function formatSum(value) {
  return (Number(value) || 0).toLocaleString('ru-RU').replace(/ /g, ' ');
}

export function formatDate(value) {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
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

export const DELIVERY_LABELS = {
  DELIVERY: 'Yetkazib berish',
  PICKUP: 'Borib olish',
};

export const PAYMENT_LABELS = {
  CASH: 'Naqd',
  CARD: 'Karta',
};

export const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#f1f1f4"/><circle cx="40" cy="40" r="20" fill="#e2e2e7"/></svg>`,
  );

export function onImageError(event) {
  if (event.currentTarget.dataset.fallback === '1') return;
  event.currentTarget.dataset.fallback = '1';
  event.currentTarget.src = FALLBACK_IMAGE;
}
