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

/**
 * Yandex Xarita havolasi.
 *
 * Koordinata bo'lsa — o'sha nuqtaga yo'nalish quriladi (telefonda Yandex
 * Navigator yoki Xaritalar ilovasi ochiladi). Koordinata bo'lmasa —
 * mijoz yozgan manzil matni bo'yicha qidiriladi.
 */
export function yandexUrl(order) {
  if (order?.latitude != null && order?.longitude != null) {
    return `https://yandex.uz/maps/?rtext=~${order.latitude},${order.longitude}&rtt=auto&z=17`;
  }

  const text = String(order?.address || '').trim();
  if (!text) return null;

  return `https://yandex.uz/maps/?text=${encodeURIComponent(`Toshkent, ${text}`)}`;
}

/** Kuryerga Telegramga tashlash uchun tayyor matn */
export function courierNote(order) {
  const lines = [
    `Buyurtma #${order.id}`,
    order.phone ? `Telefon: ${order.phone}` : null,
    order.address ? `Manzil: ${order.address}` : null,
    `Summa: ${formatSum(order.total)} so'm (${PAYMENT_LABELS[order.paymentMethod] || ''})`,
    yandexUrl(order),
  ];
  return lines.filter(Boolean).join('\n');
}

/** Matnni almashish buferiga nusxalaydi */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Eski brauzerlar uchun zaxira yo'l
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}
