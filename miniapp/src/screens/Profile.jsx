import { useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatSum } from '../utils.js';
import { IconChevron, IconInfo, IconPhone, IconPin, IconReceipt } from '../components/Icons.jsx';

export default function Profile({ onOpenAddress, onGoOrders }) {
  const { profile, userName, orders, appConfig, address } = useApp();

  const totalSpent = useMemo(
    () =>
      orders
        .filter((o) => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + o.total, 0),
    [orders],
  );

  return (
    <div className="page">
      <div className="screen-head">
        <h1 className="screen-title">Profil</h1>
      </div>

      <div className="profile__head">
        <div className="profile__ava">{userName.charAt(0).toUpperCase()}</div>
        <div>
          <div className="profile__name">{userName}</div>
          <div className="profile__phone">
            {profile?.phone || 'Telefon raqam kiritilmagan'}
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat__v">{orders.length}</div>
          <div className="stat__l">Buyurtmalar</div>
        </div>
        <div className="stat">
          <div className="stat__v">{formatSum(totalSpent)}</div>
          <div className="stat__l">Jami xarid ({appConfig.currency})</div>
        </div>
      </div>

      <div className="rows">
        <button className="row" onClick={onGoOrders}>
          <span className="row__ico">
            <IconReceipt />
          </span>
          <span className="row__text">
            <span className="row__title">Mening buyurtmalarim</span>
            <span className="row__sub">Xaridlar tarixi va qayta buyurtma</span>
          </span>
          <span className="row__go">
            <IconChevron />
          </span>
        </button>

        <button className="row" onClick={onOpenAddress}>
          <span className="row__ico">
            <IconPin />
          </span>
          <span className="row__text">
            <span className="row__title">Yetkazib berish manzili</span>
            <span className="row__sub">
              {address?.text || 'Manzil saqlanmagan'}
            </span>
          </span>
          <span className="row__go">
            <IconChevron />
          </span>
        </button>

        <a className="row" href="tel:+998901234567">
          <span className="row__ico">
            <IconPhone />
          </span>
          <span className="row__text">
            <span className="row__title">Aloqa</span>
            <span className="row__sub">+998 90 123-45-67</span>
          </span>
          <span className="row__go">
            <IconChevron />
          </span>
        </a>

        <div className="row">
          <span className="row__ico">
            <IconInfo />
          </span>
          <span className="row__text">
            <span className="row__title">Ish vaqti</span>
            <span className="row__sub">Har kuni 10:00 — 23:00</span>
          </span>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: 22, textAlign: 'center' }}>
        <div className="brand-mark" style={{ fontSize: 34, color: 'var(--brand)' }}>
          Resto
        </div>
        <div
          className="brand-mark__sub"
          style={{ color: 'var(--ink-3)', marginTop: 4 }}
        >
          Restaurant
        </div>
      </div>
    </div>
  );
}
