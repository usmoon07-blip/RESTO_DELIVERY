import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import BottomNav from './components/BottomNav.jsx';
import ProductSheet from './components/ProductSheet.jsx';
import AddressSheet from './components/AddressSheet.jsx';
import Toast from './components/Toast.jsx';
import Onboarding from './screens/Onboarding.jsx';
import Menu from './screens/Menu.jsx';
import CartScreen from './screens/CartScreen.jsx';
import Promos from './screens/Promos.jsx';
import Orders from './screens/Orders.jsx';
import Profile from './screens/Profile.jsx';
import Checkout from './screens/Checkout.jsx';
import { initTelegram, tg } from './telegram.js';
import { IconCheck } from './components/Icons.jsx';

const ONBOARDING_KEY = 'resto_onboarding_done';

function Shell() {
  const { loading, error, reload, refreshOrders } = useApp();

  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === '1',
  );
  const [tab, setTab] = useState('menu');
  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sheetProduct, setSheetProduct] = useState(null);
  const [addressOpen, setAddressOpen] = useState(false);

  /* Telegramning "orqaga" tugmasi */
  useEffect(() => {
    const backButton = tg?.BackButton;
    if (!backButton) return;

    const visible = checkout || sheetProduct || addressOpen;
    if (visible) backButton.show();
    else backButton.hide();

    const handler = () => {
      if (sheetProduct) setSheetProduct(null);
      else if (addressOpen) setAddressOpen(false);
      else if (checkout) setCheckout(false);
    };

    backButton.onClick(handler);
    return () => backButton.offClick(handler);
  }, [checkout, sheetProduct, addressOpen]);

  const goTo = (next) => {
    setCheckout(false);
    setTab(next);
    window.scrollTo({ top: 0 });
  };

  if (!onboarded) {
    return (
      <Onboarding
        onFinish={() => {
          localStorage.setItem(ONBOARDING_KEY, '1');
          setOnboarded(true);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" />
        <div style={{ color: 'var(--ink-3)', fontSize: 14 }}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty" style={{ paddingTop: 140 }}>
        <div className="empty__title">Ulanishda xatolik</div>
        <div className="empty__text">{error}</div>
        <button className="btn btn--brand" onClick={reload}>
          Qayta urinish
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="success">
        <div className="brand-mark">Resto</div>
        <div className="success__ico">
          <IconCheck />
        </div>
        <div className="success__title">Buyurtma qabul qilindi!</div>
        <div className="success__text">
          Kuryerimiz tez orada siz bilan bog'lanadi. Tafsilotlarni botdan
          ko'rishingiz mumkin.
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
            refreshOrders();
          }}
        />
      ) : (
        <>
          {tab === 'menu' && (
            <Menu
              onOpenProduct={setSheetProduct}
              onOpenAddress={() => setAddressOpen(true)}
              onGoPromos={() => goTo('promos')}
            />
          )}
          {tab === 'orders' && (
            <Orders onGoMenu={() => goTo('menu')} onGoCart={() => goTo('cart')} />
          )}
          {tab === 'cart' && (
            <CartScreen
              onGoMenu={() => goTo('menu')}
              onCheckout={() => setCheckout(true)}
            />
          )}
          {tab === 'promos' && <Promos onOpenProduct={setSheetProduct} />}
          {tab === 'profile' && (
            <Profile
              onOpenAddress={() => setAddressOpen(true)}
              onGoOrders={() => goTo('orders')}
            />
          )}

          <BottomNav tab={tab} onChange={goTo} />
        </>
      )}

      {sheetProduct && (
        <ProductSheet
          product={sheetProduct}
          onClose={() => setSheetProduct(null)}
        />
      )}

      {addressOpen && <AddressSheet onClose={() => setAddressOpen(false)} />}

      <Toast />
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
