import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { productName } from '../i18n.js';
import api from '../api.js';
import snapshot from '../data/menu-snapshot.json';
import { haptic, tgUser } from '../telegram.js';
import { detectLang, makeT } from '../i18n.js';

const AppContext = createContext(null);

const CART_KEY = 'resto_cart_v2';
const ADDR_KEY = 'resto_address_v1';
const LANG_KEY = 'resto_lang';

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
  /** Savatchada saqlanadigan nom — joriy tilda */
  const productLabel = (product) => productName(product, langRef.current || 'UZ');

  /**
   * Menyu nusxasi ilova bilan birga keladi, shuning uchun taomlar
   * server javob berishini kutmasdan darhol ko'rinadi. Server javob
   * bergach ma'lumot jimgina yangilanadi.
   */
  const [products, setProducts] = useState(snapshot.products || []);
  const [categories, setCategories] = useState(snapshot.categories || []);
  const hasSnapshot = (snapshot.products || []).length > 0;
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

  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved) return saved;
    } catch {
      /* ignore */
    }
    return detectLang(tgUser?.language_code);
  });
  const [promo, setPromo] = useState(null); // { code, discount }

  const [loading, setLoading] = useState(!hasSnapshot);
  const [error, setError] = useState(null);
  const [toast, setToastState] = useState(null);

  /* ------------------------------- Yuklash ------------------------------- */
  const load = useCallback(async () => {
    // Nusxa bor bo'lsa ekran allaqachon to'la — kutish ekrani chiqarmaymiz
    if (!hasSnapshot) setLoading(true);
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
      api
        .getMe()
        .then((me) => {
          setProfile(me);
          // Foydalanuvchi ilgari til tanlagan bo'lsa, serverdagisi ustun turadi
          try {
            if (me?.language && !localStorage.getItem(LANG_KEY)) {
              setLangState(me.language);
            }
          } catch {
            setLangState(me?.language || 'UZ');
          }
        })
        .catch(() => setProfile(null));
      api.getMyOrders().then(setOrders).catch(() => setOrders([]));
    } catch (e) {
      // Nusxa ko'rinib turgan bo'lsa, mijozga xatolik ko'rsatmaymiz —
      // u menyuni ko'rayotgan bo'ladi, biz esa fonda qayta urinamiz.
      if (!hasSnapshot) setError(e.message);
      else console.warn('Server javob bermadi, menyu nusxasi ko\'rsatilmoqda:', e.message);
    } finally {
      setLoading(false);
    }
  }, [hasSnapshot]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => writeJson(CART_KEY, cart), [cart]);

  const refreshOrders = useCallback(
    () => api.getMyOrders().then(setOrders).catch(() => {}),
    [],
  );

  /* -------------------------------- Toast -------------------------------- */
  // addToCart ichida eng so'nggi til va tarjimadan foydalanish uchun
  const tRef = useRef(null);
  const langRef = useRef('UZ');

  const showToast = useCallback((message) => {
    setToastState(message);
    setTimeout(() => setToastState((cur) => (cur === message ? null : cur)), 2200);
  }, []);

  /* --------------------------------- Til --------------------------------- */
  const t = useMemo(() => makeT(lang), [lang]);

  const setLang = useCallback((code) => {
    setLangState(code);
    try {
      localStorage.setItem(LANG_KEY, code);
    } catch {
      /* ignore */
    }
    // Bot ham shu tilda javob berishi uchun serverga saqlaymiz
    api.saveLanguage(code).catch(() => {});
    setProfile((prev) => (prev ? { ...prev, language: code } : prev));
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
            name: productLabel(product),
            price: product.newPrice,
            imageUrl: product.imageUrl,
            qty,
          },
        ];
      });
      if (!silent) showToast(tRef.current('addedToCart', productLabel(product)));
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
        showToast(tRef.current('promoCancelled'));
      });
  }, [subtotal]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------ Hisoblar ------------------------------ */
  const discount = promo?.discount || 0;

  const deliveryFee = useMemo(
    () => (subtotal >= appConfig.freeDeliveryFrom ? 0 : appConfig.deliveryFee),
    [subtotal, appConfig],
  );

  const total = Math.max(0, subtotal - discount) + deliveryFee;

  tRef.current = t;
  langRef.current = lang;

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
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
      userName: profile?.firstName || tgUser?.first_name || 'Guest',
    }),
    [
      lang,
      setLang,
      t,
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
