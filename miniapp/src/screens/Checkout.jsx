import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatSum } from '../utils.js';
import api from '../api.js';
import { PICKUP_ADDRESS } from '../components/AddressSheet.jsx';
import {
  closeApp,
  getGeolocation,
  haptic,
  requestContact,
  tg,
} from '../telegram.js';
import {
  IconBack,
  IconPhone,
  IconPin,
  IconScooter,
  IconStore,
  IconWallet,
} from '../components/Icons.jsx';

export default function Checkout({ onBack, onSuccess }) {
  const {
    cart,
    subtotal,
    discount,
    total,
    promo,
    appConfig,
    profile,
    address,
    setAddress,
    clearCart,
    t,
  } = useApp();

  const [deliveryType, setDeliveryType] = useState(address?.mode || 'DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [text, setText] = useState(
    address?.mode === 'PICKUP' ? '' : address?.text || '',
  );
  const [coords, setCoords] = useState(
    address?.latitude != null
      ? { latitude: address.latitude, longitude: address.longitude }
      : null,
  );
  const [comment, setComment] = useState('');
  const [geoBusy, setGeoBusy] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const deliveryFee =
    deliveryType === 'DELIVERY' && subtotal < appConfig.freeDeliveryFrom
      ? appConfig.deliveryFee
      : 0;
  const payable = Math.max(0, subtotal - discount) + deliveryFee;

  const detectLocation = async () => {
    setGeoBusy(true);
    setError('');
    try {
      setCoords(await getGeolocation());
      haptic('success');
    } catch (e) {
      setError(e.message);
      haptic('error');
    } finally {
      setGeoBusy(false);
    }
  };

  const pickPhone = async () => {
    const result = await requestContact();
    if (result) {
      setPhone(result);
      haptic('success');
    } else {
      setError(t('phoneManual'));
    }
  };

  const submit = async () => {
    setError('');

    if (phone.replace(/\D/g, '').length < 9) {
      setError(t('errPhone'));
      return haptic('error');
    }

    if (deliveryType === 'DELIVERY' && !text.trim() && !coords) {
      setError(t('errAddress'));
      return haptic('error');
    }

    setSending(true);
    try {
      await api.createOrder({
        // Nom ham yuboriladi: server uni bazadagi nom bilan solishtirib,
        // savat eskirgan bo'lsa noto'g'ri taom o'tib ketishiga yo'l qo'ymaydi
        items: cart.map((i) => ({ productId: i.productId, qty: i.qty, name: i.name })),
        deliveryType,
        paymentMethod,
        address: deliveryType === 'PICKUP' ? PICKUP_ADDRESS : text.trim(),
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        phone: phone.trim(),
        comment: comment.trim(),
        promoCode: promo?.code || '',
      });

      // Manzilni keyingi safar uchun eslab qolamiz
      setAddress({
        mode: deliveryType,
        text: deliveryType === 'PICKUP' ? PICKUP_ADDRESS : text.trim(),
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
      });

      clearCart();
      haptic('success');
      onSuccess();

      setTimeout(() => closeApp(), 2600);
    } catch (e) {
      setError(e.message);
      haptic('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page">
      <div className="screen-head">
        <button className="link" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconBack style={{ width: 16, height: 16 }} />
          {t('cart')}
        </button>
        <h1 className="screen-title" style={{ marginTop: 6 }}>
          {t('checkoutTitle')}
        </h1>
      </div>

      <div className="wrap">
        {error && <div className="alert">{error}</div>}

        {/* --------------------------- Olish turi --------------------------- */}
        <div className="field">
          <label className="field__label">{t('howToGet')}</label>
          <div className="segment">
            <button
              className={`seg ${deliveryType === 'DELIVERY' ? 'seg--on' : ''}`}
              onClick={() => {
                haptic('light');
                setDeliveryType('DELIVERY');
              }}
            >
              <IconScooter />
              <div className="seg__title">{t('delivery')}</div>
              <div className="seg__sub">{t('min45')}</div>
            </button>
            <button
              className={`seg ${deliveryType === 'PICKUP' ? 'seg--on' : ''}`}
              onClick={() => {
                haptic('light');
                setDeliveryType('PICKUP');
              }}
            >
              <IconStore />
              <div className="seg__title">{t('pickup')}</div>
              <div className="seg__sub">{t('min15')}</div>
            </button>
          </div>
        </div>

        {/* ----------------------------- Manzil ----------------------------- */}
        {deliveryType === 'DELIVERY' ? (
          <>
            <div className="field">
              <label className="field__label">{t('deliveryAddress')}</label>
              <button
                className={`geo ${coords ? 'geo--ok' : ''}`}
                onClick={detectLocation}
                disabled={geoBusy}
              >
                <IconPin />
                <span>
                  {geoBusy
                    ? t('detecting')
                    : coords
                      ? `${t('locationFound')} (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
                      : t('detectLocation')}
                </span>
              </button>
            </div>

            <div className="field">
              <textarea
                className="input"
                placeholder={t('addressPlaceholder')}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="field">
            <label className="field__label">{t('pickupAddress')}</label>
            <div className="geo geo--ok">
              <IconStore />
              <span>{PICKUP_ADDRESS}</span>
            </div>
          </div>
        )}

        {/* ----------------------------- Telefon ----------------------------- */}
        <div className="field">
          <label className="field__label">{t('phoneLabel')}</label>
          <input
            className="input"
            type="tel"
            inputMode="tel"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {tg?.requestContact && (
            <button
              className="btn btn--soft btn--sm"
              style={{ marginTop: 10 }}
              onClick={pickPhone}
            >
              <IconPhone style={{ width: 16, height: 16 }} />
              {t('phoneFromTelegram')}
            </button>
          )}
        </div>

        {/* ------------------------------ To'lov ------------------------------ */}
        <div className="field">
          <label className="field__label">{t('paymentType')}</label>
          <div className="segment">
            <button
              className={`seg ${paymentMethod === 'CASH' ? 'seg--on' : ''}`}
              onClick={() => {
                haptic('light');
                setPaymentMethod('CASH');
              }}
            >
              <IconWallet />
              <div className="seg__title">{t('cash')}</div>
              <div className="seg__sub">{t('toCourier')}</div>
            </button>
            <button
              className={`seg ${paymentMethod === 'CARD' ? 'seg--on' : ''}`}
              onClick={() => {
                haptic('light');
                setPaymentMethod('CARD');
              }}
            >
              <IconWallet />
              <div className="seg__title">{t('card')}</div>
              <div className="seg__sub">{t('terminal')}</div>
            </button>
          </div>
        </div>

        {/* ------------------------------- Izoh ------------------------------- */}
        <div className="field">
          <label className="field__label">{t('commentLabel')}</label>
          <textarea
            className="input"
            placeholder={t('commentPlaceholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* ------------------------------ Summa ------------------------------ */}
        <div className="totals">
          <div className="totals__row">
            <span>{t('itemsKinds', cart.length)}</span>
            <span>
              {formatSum(subtotal)} {t('currency')}
            </span>
          </div>

          {discount > 0 && (
            <div className="totals__row totals__row--sale">
              <span>
                {t('sumDiscount')} ({promo.code})
              </span>
              <span>
                −{formatSum(discount)} {t('currency')}
              </span>
            </div>
          )}

          <div className="totals__row">
            <span>{t('sumDelivery')}</span>
            <span>
              {deliveryType === 'PICKUP'
                ? '—'
                : deliveryFee === 0
                  ? t('sumFree')
                  : `${formatSum(deliveryFee)} ${t('currency')}`}
            </span>
          </div>

          <div className="totals__row totals__row--main">
            <span>{t('payTotal')}</span>
            <span>
              {formatSum(payable)} {t('currency')}
            </span>
          </div>
        </div>

        <button
          className="btn btn--brand"
          style={{ marginTop: 18 }}
          onClick={submit}
          disabled={sending}
        >
          {sending ? t('sending') : t('confirmOrder')}
        </button>
      </div>
    </div>
  );
}
