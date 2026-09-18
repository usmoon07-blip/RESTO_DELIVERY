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
      setError("Raqamni qo'lda kiriting yoki botdagi '📞 Raqamni yuborish' tugmasini bosing");
    }
  };

  const submit = async () => {
    setError('');

    if (phone.replace(/\D/g, '').length < 9) {
      setError("Telefon raqamingizni to'liq kiriting");
      return haptic('error');
    }

    if (deliveryType === 'DELIVERY' && !text.trim() && !coords) {
      setError('Manzilni kiriting yoki joylashuvni aniqlang');
      return haptic('error');
    }

    setSending(true);
    try {
      await api.createOrder({
        items: cart.map((i) => ({ productId: i.productId, qty: i.qty })),
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
          Savat
        </button>
        <h1 className="screen-title" style={{ marginTop: 6 }}>
          Rasmiylashtirish
        </h1>
      </div>

      <div className="wrap">
        {error && <div className="alert">{error}</div>}

        {/* --------------------------- Olish turi --------------------------- */}
        <div className="field">
          <label className="field__label">Qanday olasiz?</label>
          <div className="segment">
            <button
              className={`seg ${deliveryType === 'DELIVERY' ? 'seg--on' : ''}`}
              onClick={() => {
                haptic('light');
                setDeliveryType('DELIVERY');
              }}
            >
              <IconScooter />
              <div className="seg__title">Yetkazib berish</div>
              <div className="seg__sub">45 daqiqa</div>
            </button>
            <button
              className={`seg ${deliveryType === 'PICKUP' ? 'seg--on' : ''}`}
              onClick={() => {
                haptic('light');
                setDeliveryType('PICKUP');
              }}
            >
              <IconStore />
              <div className="seg__title">Borib olish</div>
              <div className="seg__sub">15 daqiqa</div>
            </button>
          </div>
        </div>

        {/* ----------------------------- Manzil ----------------------------- */}
        {deliveryType === 'DELIVERY' ? (
          <>
            <div className="field">
              <label className="field__label">Yetkazib berish manzili</label>
              <button
                className={`geo ${coords ? 'geo--ok' : ''}`}
                onClick={detectLocation}
                disabled={geoBusy}
              >
                <IconPin />
                <span>
                  {geoBusy
                    ? 'Aniqlanmoqda...'
                    : coords
                      ? `Joylashuv aniqlandi (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
                      : 'Joriy joylashuvimni aniqlash'}
                </span>
              </button>
            </div>

            <div className="field">
              <textarea
                className="input"
                placeholder="Ko'cha, uy, xonadon, mo'ljal..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="field">
            <label className="field__label">Olib ketish manzili</label>
            <div className="geo geo--ok">
              <IconStore />
              <span>{PICKUP_ADDRESS}</span>
            </div>
          </div>
        )}

        {/* ----------------------------- Telefon ----------------------------- */}
        <div className="field">
          <label className="field__label">Telefon raqamingiz</label>
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
              Telegramdagi raqamimni olish
            </button>
          )}
        </div>

        {/* ------------------------------ To'lov ------------------------------ */}
        <div className="field">
          <label className="field__label">To'lov turi</label>
          <div className="segment">
            <button
              className={`seg ${paymentMethod === 'CASH' ? 'seg--on' : ''}`}
              onClick={() => {
                haptic('light');
                setPaymentMethod('CASH');
              }}
            >
              <IconWallet />
              <div className="seg__title">Naqd pul</div>
              <div className="seg__sub">Kuryerga</div>
            </button>
            <button
              className={`seg ${paymentMethod === 'CARD' ? 'seg--on' : ''}`}
              onClick={() => {
                haptic('light');
                setPaymentMethod('CARD');
              }}
            >
              <IconWallet />
              <div className="seg__title">Karta orqali</div>
              <div className="seg__sub">Terminal / Click</div>
            </button>
          </div>
        </div>

        {/* ------------------------------- Izoh ------------------------------- */}
        <div className="field">
          <label className="field__label">Izoh (ixtiyoriy)</label>
          <textarea
            className="input"
            placeholder="Masalan: eshik qo'ng'irog'i ishlamaydi, qo'ng'iroq qiling"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* ------------------------------ Summa ------------------------------ */}
        <div className="totals">
          <div className="totals__row">
            <span>Taomlar ({cart.length} xil)</span>
            <span>
              {formatSum(subtotal)} {appConfig.currency}
            </span>
          </div>

          {discount > 0 && (
            <div className="totals__row totals__row--sale">
              <span>Chegirma ({promo.code})</span>
              <span>
                −{formatSum(discount)} {appConfig.currency}
              </span>
            </div>
          )}

          <div className="totals__row">
            <span>Yetkazib berish</span>
            <span>
              {deliveryType === 'PICKUP'
                ? '—'
                : deliveryFee === 0
                  ? 'Bepul'
                  : `${formatSum(deliveryFee)} ${appConfig.currency}`}
            </span>
          </div>

          <div className="totals__row totals__row--main">
            <span>Jami to'lov</span>
            <span>
              {formatSum(payable)} {appConfig.currency}
            </span>
          </div>
        </div>

        <button
          className="btn btn--brand"
          style={{ marginTop: 18 }}
          onClick={submit}
          disabled={sending}
        >
          {sending ? 'Yuborilmoqda...' : 'Buyurtmani tasdiqlash'}
        </button>
      </div>
    </div>
  );
}
