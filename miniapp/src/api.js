import { initData } from './telegram.js';

const BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Suratlar manzili.
 *
 * Bazada `/uploads/xxx.jpg` ko'rinishida saqlanadi — bu localhostda ishlaydi,
 * lekin serverda sayt (Vercel) va suratlar (Render) boshqa-boshqa manzilda
 * turadi. Shuning uchun nisbiy yo'lga API manzilini qo'shamiz.
 */
const MEDIA_ORIGIN = BASE.replace(/\/api\/?$/, '');

export function mediaUrl(url) {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url; // allaqachon to'liq
  if (!MEDIA_ORIGIN) return url; // localhost — Vite proxy o'zi hal qiladi
  return `${MEDIA_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}


async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-init-data': initData,
      ...(options.headers || {}),
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || `Xatolik (${response.status})`);
  }

  return payload.data;
}

export const api = {
  getConfig: () => request('/client/config'),
  getProducts: () => request('/client/products'),
  getCategories: () => request('/client/categories'),
  getMe: () => request('/client/me'),
  savePhone: (phone) =>
    request('/client/me/phone', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
  getPromos: () => request('/client/promos'),
  checkPromo: (code, subtotal) =>
    request('/client/promo/check', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),
  saveLanguage: (language) =>
    request('/client/me/language', {
      method: 'POST',
      body: JSON.stringify({ language }),
    }),
  getMyOrders: () => request('/client/orders'),
  createOrder: (order) =>
    request('/client/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  cancelOrder: (id) =>
    request(`/client/orders/${id}/cancel`, { method: 'POST' }),
};

export default api;
