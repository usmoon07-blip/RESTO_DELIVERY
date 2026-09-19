import { initData } from './telegram.js';

const BASE = import.meta.env.VITE_API_URL || '/api';

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
