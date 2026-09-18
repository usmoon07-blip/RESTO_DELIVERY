/** 49000 -> "49 000" */
export function formatSum(value) {
  return (Number(value) || 0).toLocaleString('ru-RU').replace(/ /g, ' ');
}

export function formatPrice(value, currency = "so'm") {
  return `${formatSum(value)} ${currency}`;
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

export const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#F4F4F5"/>
      <circle cx="200" cy="200" r="110" fill="#E9E9EC"/>
      <circle cx="165" cy="175" r="16" fill="#D9D9DE"/>
      <circle cx="235" cy="200" r="13" fill="#D9D9DE"/>
      <circle cx="190" cy="240" r="15" fill="#D9D9DE"/>
    </svg>`,
  );

/** Rasm yuklanmasa — zaxira rasm */
export function onImageError(event) {
  if (event.currentTarget.dataset.fallback === '1') return;
  event.currentTarget.dataset.fallback = '1';
  event.currentTarget.src = FALLBACK_IMAGE;
}
