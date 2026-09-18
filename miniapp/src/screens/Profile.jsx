import { useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatSum } from '../utils.js';
import { LANGS } from '../i18n.js';
import { haptic } from '../telegram.js';
import {
  IconChevron,
  IconInfo,
  IconPhone,
  IconPin,
  IconReceipt,
} from '../components/Icons.jsx';

export default function Profile({ onOpenAddress, onGoOrders }) {
  const { profile, userName, orders, address, lang, setLang, t } = useApp();

  const totalSpent = useMemo(
    () =>
      orders
        .filter((o) => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + o.total, 0),
    [orders],
  );

  const changeLang = (code) => {
    if (code === lang) return;
    haptic('light');
    setLang(code);
  };

  return (
    <div className="page">
      <div className="screen-head">
        <h1 className="screen-title">{t('profile')}</h1>
      </div>

      <div className="profile__head">
        <div className="profile__ava">{userName.charAt(0).toUpperCase()}</div>
        <div>
          <div className="profile__name">{userName}</div>
          <div className="profile__phone">{profile?.phone || t('noPhone')}</div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat__v">{orders.length}</div>
          <div className="stat__l">{t('statOrders')}</div>
        </div>
        <div className="stat">
          <div className="stat__v">{formatSum(totalSpent)}</div>
          <div className="stat__l">{t('statSpent', t('currency'))}</div>
        </div>
      </div>

      {/* ---------------------------- Til tanlash ---------------------------- */}
      <div className="wrap">
        <div className="field__label">{t('rowLanguage')}</div>
        <div className="langs">
          {LANGS.map((item) => (
            <button
              key={item.code}
              className={`lang ${lang === item.code ? 'lang--on' : ''}`}
              onClick={() => changeLang(item.code)}
            >
              <span className="lang__flag">{item.flag}</span>
              <span className="lang__label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rows" style={{ marginTop: 18 }}>
        <button className="row" onClick={onGoOrders}>
          <span className="row__ico">
            <IconReceipt />
          </span>
          <span className="row__text">
            <span className="row__title">{t('rowOrders')}</span>
            <span className="row__sub">{t('rowOrdersSub')}</span>
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
            <span className="row__title">{t('rowAddress')}</span>
            <span className="row__sub">{address?.text || t('rowNoAddress')}</span>
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
            <span className="row__title">{t('rowContact')}</span>
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
            <span className="row__title">{t('rowHours')}</span>
            <span className="row__sub">{t('rowHoursSub')}</span>
          </span>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: 22, textAlign: 'center' }}>
        <div className="brand-mark" style={{ fontSize: 34, color: 'var(--brand)' }}>
          Resto
        </div>
        <div className="brand-mark__sub" style={{ color: 'var(--ink-3)', marginTop: 4 }}>
          Restaurant
        </div>
      </div>
    </div>
  );
}
