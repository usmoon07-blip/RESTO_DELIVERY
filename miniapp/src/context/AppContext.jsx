import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../api.js';
import { haptic, tgUser } from '../telegram.js';

const AppContext = createContext(null);

const CART_KEY = 'resto_cart_v2';
const ADDR_KEY = 'resto_address_v1';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promos, setPromos] = useState([]);
  const [appConfig, setAppConfig] = useState({
    restaurantName: 'Resto',
    currency: "so'm",
    deliveryFee: 15000,
    freeDeliveryFrom: 150000,
  });
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  const [cart, setCart] = useState(() => {
    const saved = readJson(CART_KEY, []);
    return Array.isArray(saved) ? saved : [];
  });
  const [address, setAddressState] = useState(() => readJson(ADDR_KEY, null));
  const [promo, setPromo] = useState(null); // { code, discount }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToastState] = useState(null);

  /* ------------------------------- Yuklash ------------------------------- */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cfg, prods, cats] = await Promise.all([
        api.getConfig(),
        api.getProducts(),
        api.getCategories(),
      ]);
      setAppConfig(cfg);
      setProducts(prods);
      setCategories(cats);

      api.getPromos().then(setPromos).catch(() => setPromos([]));
      api.getMe().then(setProfile).catch(() => setProfile(null));
      api.getMyOrders().then(setOrders).catch(() => setOrders([]));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => writeJson(CART_KEY, cart), [cart]);

  const refreshOrders = useCallback(
    () => api.getMyOrders().then(setOrders).catch(() => {}),
    [],
  );

  /* -------------------------------- Toast -------------------------------- */
  const showToast = useCallback((message) => {
    setToastState(message);
    setTimeout(() => setToastState((cur) => (cur === message ? null : cur)), 2200);
  }, []);

  /* ------------------------------- Manzil ------------------------------- */
  const setAddress = useCallback((value) => {
    setAddressState(value);
    writeJson(ADDR_KEY, value);
  }, []);

  /* ------------------------------ Savatcha ------------------------------ */
  const addToCart = useCallback(
    (product, qty = 1, { silent = false } = {}) => {
      haptic('light');
      setCart((prev) => {
        const found = prev.find((i) => i.productId === product.id);
        if (found) {
          return prev.map((i) =>
            i.productId === product.id ? { ...i, qty: i.qty + qty } : i,
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.newPrice,
            imageUrl: product.imageUrl,
            qty,
          },
        ];
      });
      if (!silent) showToast(`${product.name} savatchaga qo'shildi`);
    },
    [showToast],
  );

  const setQty = useCallback((productId, qty) => {
    haptic('light');
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    haptic('medium');
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromo(null);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart],
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart],
  );

  const qtyOf = useCallback(
    (productId) => cart.find((i) => i.productId === productId)?.qty || 0,
    [cart],
  );

  /* Savatcha summasi o'zgarsa, promokodni qayta tekshiramiz */
  useEffect(() => {
    if (!promo) return;

    if (subtotal === 0) {
      setPromo(null);
      return;
    }

    api
      .checkPromo(promo.code, subtotal)
      .then((result) =>
        setPromo((cur) =>
          cur && cur.code === result.code ? { ...cur, discount: result.discount } : cur,
        ),
      )
      .catch(() => {
        setPromo(null);
        showToast('Promokod bekor qilindi');
      });
  }, [subtotal]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------ Hisoblar ------------------------------ */
  const discount = promo?.discount || 0;

  const deliveryFee = useMemo(
    () => (subtotal >= appConfig.freeDeliveryFrom ? 0 : appConfig.deliveryFee),
    [subtotal, appConfig],
  );

  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const value = useMemo(
    () => ({
      products,
      categories,
      promos,
      appConfig,
      profile,
      setProfile,
      orders,
      refreshOrders,
      cart,
      cartCount,
      subtotal,
      discount,
      deliveryFee,
      total,
      promo,
      setPromo,
      address,
      setAddress,
      loading,
      error,
      reload: load,
      addToCart,
      setQty,
      qtyOf,
      removeFromCart,
      clearCart,
      toast,
      showToast,
      userName: profile?.firstName || tgUser?.first_name || 'Mehmon',
    }),
    [
      products,
      categories,
      promos,
      appConfig,
      profile,
      orders,
      refreshOrders,
      cart,
      cartCount,
      subtotal,
      discount,
      deliveryFee,
      total,
      promo,
      address,
      setAddress,
      loading,
      error,
      load,
      addToCart,
      setQty,
      qtyOf,
      removeFromCart,
      clearCart,
      toast,
      showToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp faqat AppProvider ichida ishlatiladi');
  return ctx;
}

export default AppContext;
