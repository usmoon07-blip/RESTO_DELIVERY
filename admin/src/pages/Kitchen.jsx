import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api.js';
import { enableSound, isSoundEnabled, playNewOrderSound } from '../sound.js';
import { DELIVERY_LABELS, PAYMENT_LABELS, formatSum } from '../utils.js';

const REFRESH_MS = 3000;

/** Ustunlar: har biri qaysi holatlarni ko'rsatadi */
const COLUMNS = [
  {
    key: 'new',
    title: 'Yangi buyurtmalar',
    icon: '🔔',
    statuses: ['PENDING'],
    action: { label: 'Qabul qildim', next: 'CONFIRMED' },
  },
  {
    key: 'cooking',
    title: 'Tayyorlanmoqda',
    icon: '👨‍🍳',
    statuses: ['CONFIRMED', 'PREPARING'],
    action: { label: 'Tayyor bo\'ldi', next: null }, // pastda aniqlanadi
  },
  {
    key: 'ready',
    title: "Yo'lda / Olib ketishga tayyor",
    icon: '🛵',
    statuses: ['DELIVERING'],
    action: { label: 'Yakunlandi', next: 'DELIVERED' },
  },
];

/** Buyurtma tushganidan beri necha daqiqa o'tgani */
function minutesSince(date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 60000);
}

function timeOnly(date) {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function OrderCard({ order, column, isNew, onAdvance, onCancel, busy }) {
  const minutes = minutesSince(order.createdAt);
  const urgency = minutes >= 25 ? 'late' : minutes >= 15 ? 'warn' : 'ok';

  // "Tayyorlanmoqda" ustunida keyingi holat yetkazish turiga bog'liq
  let next = column.action.next;
  let label = column.action.label;

  if (column.key === 'cooking') {
    if (order.status === 'CONFIRMED') {
      next = 'PREPARING';
      label = 'Tayyorlashni boshladim';
    } else {
      next = order.deliveryType === 'PICKUP' ? 'DELIVERED' : 'DELIVERING';
      label =
        order.deliveryType === 'PICKUP'
          ? "Tayyor — mijoz olib ketdi"
          : "Tayyor — kuryerga berildi";
    }
  }

  if (column.key === 'ready' && order.deliveryType === 'PICKUP') {
    label = 'Mijoz olib ketdi';
  }

  return (
    <article className={`kds-card kds-card--${urgency} ${isNew ? 'kds-card--new' : ''}`}>
      <header className="kds-card__head">
        <div className="kds-card__id">#{order.id}</div>
        <div className={`kds-timer kds-timer--${urgency}`}>
          ⏱ {minutes} daq
        </div>
      </header>

      <div className="kds-card__meta">
        <span className="kds-tag">
          {order.deliveryType === 'PICKUP' ? '🏃' : '🛵'}{' '}
          {DELIVERY_LABELS[order.deliveryType]}
        </span>
        <span className="kds-tag">
          {order.paymentMethod === 'CARD' ? '💳' : '💵'}{' '}
          {PAYMENT_LABELS[order.paymentMethod]}
        </span>
        <span className="kds-tag kds-tag--time">{timeOnly(order.createdAt)}</span>
      </div>

      <ul className="kds-items">
        {(order.items || []).map((item, i) => (
          <li key={i}>
            <span className="kds-items__qty">{item.qty}×</span>
            <span className="kds-items__name">{item.name}</span>
          </li>
        ))}
      </ul>

      {order.comment && <div className="kds-comment">💬 {order.comment}</div>}

      <div className="kds-card__info">
        <div>
          <b>{order.user?.firstName}</b>{' '}
          <a href={`tel:${order.phone}`}>{order.phone}</a>
        </div>
        {order.deliveryType === 'DELIVERY' && order.address && (
          <div className="kds-address">📍 {order.address}</div>
        )}
        <div className="kds-total">{formatSum(order.total)} so'm</div>
      </div>

      <div className="kds-card__actions">
        <button
          className="kds-btn kds-btn--main"
          disabled={busy}
          onClick={() => onAdvance(order.id, next)}
        >
          {label}
        </button>
        {column.key === 'new' && (
          <button
            className="kds-btn kds-btn--ghost"
            disabled={busy}
            onClick={() => onCancel(order.id)}
          >
            Bekor qilish
          </button>
        )}
      </div>
    </article>
  );
}

export default function Kitchen({ onAuthError }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [, forceTick] = useState(0);

  const knownPendingIds = useRef(null);
  const newIds = useRef(new Set());

  const load = useCallback(async () => {
    try {
      const list = await api.getActiveOrders();
      setOrders(list);
      setError('');

      // Yangi buyurtma kelganini aniqlash
      const pendingIds = new Set(
        list.filter((o) => o.status === 'PENDING').map((o) => o.id),
      );

      if (knownPendingIds.current === null) {
        knownPendingIds.current = pendingIds;
      } else {
        const fresh = [...pendingIds].filter(
          (id) => !knownPendingIds.current.has(id),
        );

        if (fresh.length > 0) {
          playNewOrderSound();
          fresh.forEach((id) => newIds.current.add(id));
          setTimeout(() => {
            fresh.forEach((id) => newIds.current.delete(id));
            forceTick((n) => n + 1);
          }, 12000);
        }

        knownPendingIds.current = pendingIds;
      }
    } catch (e) {
      if (e.message.includes('Parol')) return onAuthError();
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [onAuthError]);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  /* Taymerlar har 20 soniyada yangilanib tursin */
  useEffect(() => {
    const timer = setInterval(() => forceTick((n) => n + 1), 20000);
    return () => clearInterval(timer);
  }, []);

  const advance = async (id, status) => {
    setBusyId(id);
    try {
      await api.updateOrderStatus(id, status);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const cancel = async (id) => {
    if (!confirm(`#${id} buyurtma bekor qilinsinmi?`)) return;
    await advance(id, 'CANCELLED');
  };

  const toggleSound = () => {
    const ok = enableSound();
    setSoundOn(ok && isSoundEnabled());
    if (ok) playNewOrderSound();
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  return (
    <div className="kds">
      <div className="kds__bar">
        <div className="kds__title">
          👨‍🍳 Oshxona ekrani
          <span className="live-dot" style={{ marginLeft: 12 }}>
            har 3 soniyada yangilanadi
          </span>
        </div>

        <div className="toolbar">
          {!soundOn && (
            <button className="btn btn--accent btn--sm" onClick={toggleSound}>
              🔔 Tovushni yoqish
            </button>
          )}
          {soundOn && (
            <span className="kds__sound-on">🔔 Tovush yoqilgan</span>
          )}
          <button className="btn btn--light btn--sm" onClick={toggleFullscreen}>
            ⛶ To'liq ekran
          </button>
        </div>
      </div>

      {!soundOn && (
        <div className="kds__hint">
          Yangi buyurtma kelganda signal eshitilishi uchun bir marta{' '}
          <b>"🔔 Tovushni yoqish"</b> tugmasini bosing (brauzer qoidasi shuni
          talab qiladi).
        </div>
      )}

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="kds__board">
          {COLUMNS.map((column) => {
            const list = orders.filter((o) => column.statuses.includes(o.status));

            return (
              <section className="kds-col" key={column.key}>
                <header className="kds-col__head">
                  <span>
                    {column.icon} {column.title}
                  </span>
                  <span className="kds-col__count">{list.length}</span>
                </header>

                <div className="kds-col__body">
                  {list.length === 0 ? (
                    <div className="kds-col__empty">Bo'sh</div>
                  ) : (
                    list.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        column={column}
                        isNew={newIds.current.has(order.id)}
                        onAdvance={advance}
                        onCancel={cancel}
                        busy={busyId === order.id}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
