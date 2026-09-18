const BASE = import.meta.env.VITE_API_URL || '/api';
const KEY = 'pp_admin_password';

export function getPassword() {
  return localStorage.getItem(KEY) || '';
}

export function setPassword(password) {
  localStorage.setItem(KEY, password);
}

export function clearPassword() {
  localStorage.removeItem(KEY);
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE}/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': getPassword(),
      ...(options.headers || {}),
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (response.status === 401) {
    clearPassword();
    throw new Error(payload?.error || "Parol noto'g'ri");
  }

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || `Xatolik (${response.status})`);
  }

  return payload.data;
}

export const api = {
  login: (password) =>
    fetch(`${BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
    }).then(async (r) => {
      const data = await r.json().catch(() => null);
      if (!r.ok || !data?.ok) throw new Error(data?.error || "Parol noto'g'ri");
      return true;
    }),

  getStats: () => request('/stats'),

  getOrders: (status) =>
    request(`/orders${status ? `?status=${status}` : ''}`),
  /** Oshxona ekrani uchun — faqat tugallanmagan buyurtmalar */
  getActiveOrders: () => request('/orders?active=true'),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  getProducts: () => request('/products'),
  createProduct: (data) =>
    request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  getUsers: () => request('/users'),
};

export default api;
