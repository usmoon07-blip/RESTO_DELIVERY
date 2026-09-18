import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import BottomNav from './components/BottomNav.jsx';
import ProductSheet from './components/ProductSheet.jsx';
import Onboarding from './screens/Onboarding.jsx';
import Home from './screens/Home.jsx';
import Catalog from './screens/Catalog.jsx';
import Cart from './screens/Cart.jsx';
import Checkout from './screens/Checkout.jsx';
import Profile from './screens/Profile.jsx';
import { initTelegram, tg } from './telegram.js';

const ONBOARDING_KEY = 'pp_onboarding_done';

function Shell() {
  const { loading, error, reload } = useApp();

  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === '1',
  );
  const [tab, setTab] = useState('home');
  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sheetProduct, setSheetProduct] = useState(null);

  /* Telegram "orqaga" tugmasi */
  useEffect(() => {
    const backButton = tg?.BackButton;
    if (!backButton) return;

    const show = checkout || sheetProduct;

    if (show) backButton.show();
    else backButton.hide();

    const handler = () => {
      if (sheetProduct) setSheetProduct(null);
      else if (checkout) setCheckout(false);
    };

    backButton.onClick(handler);
    return () => backButton.offClick(handler);
  }, [checkout, sheetProduct]);

  const finishOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setOnboarded(true);
  };

  const openProduct = (product) => setSheetProduct(product);

  const goTo = (nextTab) => {
    setCheckout(false);
    setTab(nextTab);
    window.scrollTo({ top: 0 });
  };

  if (!onboarded) return <Onboarding onFinish={finishOnboarding} />;

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" />
        <div className="muted">Yuklanmoqda...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty" style={{ paddingTop: 140 }}>
        <div className="empty__icon">⚠️</div>
        <div className="empty__title">Ulanishda xatolik</div>
        <div className="empty__text">{error}</div>
        <button className="btn btn--dark" onClick={reload}>
          Qayta urinish
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="success">
        <div className="brand-mark" style={{ marginBottom: 26 }}>
          Resto
        </div>
        <div className="success__icon">🎉</div>
        <div className="success__title">Buyurtma qabul qilindi!</div>
        <div className="success__text">
          Kuryerimiz tez orada siz bilan bog'lanadi. Tafsilotlarni botdan
          ko'rishingiz mumkin 🍕
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {checkout ? (
        <Checkout
          onBack={() => setCheckout(false)}
          onSuccess={() => {
            setCheckout(false);
            setSuccess(true);
          }}
        />
      ) : (
        <>
          {tab === 'home' && (
            <Home
              onGoCatalog={() => goTo('catalog')}
              onOpenProduct={openProduct}
            />
          )}
          {tab === 'catalog' && <Catalog onOpenProduct={openProduct} />}
          {tab === 'cart' && (
            <Cart
              onGoCatalog={() => goTo('catalog')}
              onCheckout={() => setCheckout(true)}
            />
          )}
          {tab === 'profile' && <Profile onGoCart={() => goTo('cart')} />}

          <BottomNav tab={tab} onChange={goTo} />
        </>
      )}

      {sheetProduct && (
        <ProductSheet
          product={sheetProduct}
          onClose={() => setSheetProduct(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
