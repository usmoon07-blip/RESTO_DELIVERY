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

const CART_KEY = 'pp_cart_v1';

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [appConfig, setAppConfig] = useState({
    restaurantName: 'Resto',
    currency: "so'm",
    deliveryFee: 15000,
    freeDeliveryFrom: 150000,
  });
  const [profile, setProfile] = useState(null);
  const [cart, setCart] = useState(readCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* --------------------------- Ma'lumotlarni yuklash --------------------------- */
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

      try {
        setProfile(await api.getMe());
      } catch {
        setProfile(null);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  /* --------------------------------- Savatcha --------------------------------- */
  const addToCart = useCallback((product, qty = 1) => {
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
  }, []);

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

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart],
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart],
  );

  const isInCart = useCallback(
    (productId) => cart.some((i) => i.productId === productId),
    [cart],
  );

  const value = useMemo(
    () => ({
      products,
      categories,
      appConfig,
      profile,
      setProfile,
      cart,
      cartCount,
      subtotal,
      loading,
      error,
      reload: load,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      isInCart,
      userName: profile?.firstName || tgUser?.first_name || 'Mehmon',
    }),
    [
      products,
      categories,
      appConfig,
      profile,
      cart,
      cartCount,
      subtotal,
      loading,
      error,
      load,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      isInCart,
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
