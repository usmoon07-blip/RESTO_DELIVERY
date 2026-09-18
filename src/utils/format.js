import config from '../config/default.js';

/** 49000 -> "49 000 so'm" */
export function formatPrice(value) {
  const n = Number(value) || 0;
  return `${n.toLocaleString('ru-RU').replace(/ /g, ' ')} ${config.business.currency}`;
}
