import config from '../config/default.js';

/** 49000 -> "49 000 so'm" */
export function formatPrice(value) {
  const n = Number(value) || 0;
  return `${n.toLocaleString('ru-RU').replace(/ /g, ' ')} ${config.business.currency}`;
}

export const STATUS_LABELS = {
  PENDING: 'Kutilmoqda',
  CONFIRMED: 'Tasdiqlandi',
  PREPARING: 'Tayyorlanmoqda',
  DELIVERING: "Yo'lda",
  DELIVERED: 'Yetkazildi',
  CANCELLED: 'Bekor qilindi',
};

export const STATUS_EMOJI = {
  PENDING: '🕐',
  CONFIRMED: '✅',
  PREPARING: '👨‍🍳',
  DELIVERING: '🛵',
  DELIVERED: '🎉',
  CANCELLED: '❌',
};

export const DELIVERY_LABELS = {
  DELIVERY: 'Yetkazib berish',
  PICKUP: 'Borib olish',
};

export const PAYMENT_LABELS = {
  CASH: 'Naqd pul',
  CARD: 'Karta orqali',
};
