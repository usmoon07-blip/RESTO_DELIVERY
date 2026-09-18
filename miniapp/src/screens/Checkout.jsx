import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatSum } from '../utils.js';
import api from '../api.js';
import {
  closeApp,
  getGeolocation,
  haptic,
  requestContact,
  tg,
} from '../telegram.js';

const PICKUP_ADDRESS = "Toshkent sh., Amir Temur ko'chasi 1-uy";

export default function Checkout({ onBack, onSuccess }) {
  const { cart, subtotal, appConfig, profile, clearCart } = useApp();

  const [deliveryType, setDeliveryType] = useState('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [comment, setComment] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const deliveryFee =
    deliveryType === 'DELIVERY' && subtotal < appConfig.freeDeliveryFrom
      ? appConfig.deliveryFee
      : 0;
  const total = subtotal + deliveryFee;

  /* ------------------------------ Lokatsiya ------------------------------ */
  const detectLocation = async () => {
    setGeoLoading(true);
    setError('');
    try {
      const position = await getGeolocation();
      setCoords(position);
      haptic('success');
    } catch (e) {
      setError(e.message);
      haptic('error');
    } finally {
      setGeoLoading(false);
    }
  };

  /* ------------------------------ Telefon ------------------------------ */
  const pickPhoneFromTelegram = async () => {
    const result = await requestContact();
    if (result) {
      setPhone(result);
      haptic('success');
    } else {
      setError("Raqamni qo'lda kiriting yoki botda '📞 Raqamni yuborish' tugmasini bosing");
    }
  };

  /* ------------------------------ Yuborish ------------------------------ */
  const submit = async () => {
    setError('');

    if (phone.replace(/\D/g, '').length < 9) {
      setError('Telefon raqamingizni to\'liq kiriting');
      return haptic('error');
    }

    if (deliveryType === 'DELIVERY' && !address.trim() && !coords) {
      setError('Manzilni kiriting yoki joylashuvni aniqlang');
      return haptic('error');
    }

    setSending(true);
    try {
      await api.createOrder({
        items: cart.map((i) => ({ productId: i.productId, qty: i.qty })),
        deliveryType,
        paymentMethod,
        address: deliveryType === 'PICKUP' ? PICKUP_ADDRESS : address.trim(),
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        phone: phone.trim(),
        comment: comment.trim(),
      });

      clearCart();
      haptic('success');
      onSuccess();

      // Mini App 2.5 soniyadan so'ng yopiladi
      setTimeout(() => closeApp(), 2500);
    } catch (e) {
      setError(e.message);
      haptic('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <button className="link-btn" onClick={onBack}>
            ← Savatcha
          </button>
          <div className="header__name" style={{ marginTop: 4 }}>
            Rasmiylashtirish
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: 10 }}>
        {error && <div className="alert">{error}</div>}

        {/* --------- Yetkazish turi --------- */}
        <div className="field">
          <label className="field__label">Qanday olasiz?</label>
          <div className="segment">
            <button
              className={`segment__item ${deliveryType === 'DELIVERY' ? 'segment__item--active' : ''}`}
              onClick={() => {
                haptic('light');
                setDeliveryType('DELIVERY');
              }}
            >
              <div className="segment__icon">🛵</div>
              <div className="segment__title">Yetkazib berish</div>
              <div className="segment__sub">30-40 daqiqa</div>
            </button>
            <button
              className={`segment__item ${deliveryType === 'PICKUP' ? 'segment__item--active' : ''}`}
              onClick={() => {
                haptic('light');
                setDeliveryType('PICKUP');
              }}
            >
              <div className="segment__icon">🏃</div>
              <div className="segment__title">Borib olish</div>
              <div className="segment__sub">15 daqiqa</div>
            </button>
          </div>
        </div>

        {/* --------- Manzil --------- */}
        {deliveryType === 'DELIVERY' ? (
          <>
            <div className="field">
              <label className="field__label">Yetkazib berish manzili</label>
              <button
                className={`location-btn ${coords ? 'location-btn--done' : ''}`}
                onClick={detectLocation}
                disabled={geoLoading}
              >
                <span>📍</span>
                <span>
                  {geoLoading
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="field">
            <label className="field__label">Olib ketish manzili</label>
            <div className="location-btn location-btn--done">
              <span>🏠</span>
              <span>{PICKUP_ADDRESS}</span>
            </div>
          </div>
        )}

        {/* --------- Telefon --------- */}
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
              className="btn btn--light btn--sm"
              style={{ marginTop: 10 }}
              onClick={pickPhoneFromTelegram}
            >
              📞 Telegramdagi raqamimni olish
            </button>
          )}
        </div>

        {/* --------- To'lov --------- */}
        <div className="field">
          <label className="field__label">To'lov turi</label>
          <div className="segment">
            <button
              className={`segment__item ${paymentMethod === 'CASH' ? 'segment__item--active' : ''}`}
              onClick={() => {
                haptic('light');
                setPaymentMethod('CASH');
              }}
            >
              <div className="segment__icon">💵</div>
              <div className="segment__title">Naqd pul</div>
              <div className="segment__sub">Kuryerga</div>
            </button>
            <button
              className={`segment__item ${paymentMethod === 'CARD' ? 'segment__item--active' : ''}`}
              onClick={() => {
                haptic('light');
                setPaymentMethod('CARD');
              }}
            >
              <div className="segment__icon">💳</div>
              <div className="segment__title">Karta orqali</div>
              <div className="segment__sub">Terminal / Click</div>
            </button>
          </div>
        </div>

        {/* --------- Izoh --------- */}
        <div className="field">
          <label className="field__label">Izoh (ixtiyoriy)</label>
          <textarea
            className="input"
            placeholder="Masalan: eshik qo'ng'irog'i ishlamaydi, qo'ng'iroq qiling"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* --------- Summa --------- */}
        <div className="totals">
          <div className="totals__row">
            <span>Mahsulotlar ({cart.length} xil)</span>
            <span>
              {formatSum(subtotal)} {appConfig.currency}
            </span>
          </div>
          <div className="totals__row">
            <span>Yetkazib berish</span>
            <span>
              {deliveryFee === 0
                ? deliveryType === 'PICKUP'
                  ? '—'
                  : 'Bepul 🎁'
                : `${formatSum(deliveryFee)} ${appConfig.currency}`}
            </span>
          </div>
          <div className="totals__row totals__row--main">
            <span>Jami to'lov</span>
            <span>
              {formatSum(total)} {appConfig.currency}
            </span>
          </div>
        </div>

        <button
          className="btn btn--accent"
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
