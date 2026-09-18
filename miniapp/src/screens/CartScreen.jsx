import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatSum } from '../utils.js';
import { haptic } from '../telegram.js';
import api from '../api.js';
import { Placeholder } from '../components/ProductCard.jsx';
import { productName } from '../i18n.js';
import {
  IconBag,
  IconCheck,
  IconMinus,
  IconPlus,
} from '../components/Icons.jsx';

export default function CartScreen({ onGoMenu, onCheckout }) {
  const {
    cart,
    products,
    setQty,
    removeFromCart,
    addToCart,
    subtotal,
    discount,
    deliveryFee,
    total,
    promo,
    setPromo,
    appConfig,
    showToast,
    lang,
    t,
  } = useApp();

  const [code, setCode] = useState('');
  const [promoBusy, setPromoBusy] = useState(false);
  const [promoError, setPromoError] = useState('');

  /** Qo'shimcha taklif — menyudagi eng arzon taom (barqaror tanlov) */
  const upsell = useMemo(() => {
    if (products.length === 0) return null;
    return products.reduce((min, p) => (p.newPrice < min.newPrice ? p : min));
  }, [products]);

  const upsellOn = Boolean(
    upsell && cart.some((i) => i.productId === upsell.id),
  );

  const toggleUpsell = () => {
    if (!upsell) return;
    haptic('light');
    if (upsellOn) removeFromCart(upsell.id);
    else addToCart(upsell, 1, { silent: true });
  };

  const applyPromo = async () => {
    const value = code.trim();
    if (!value) return;

    setPromoBusy(true);
    setPromoError('');
    try {
      const result = await api.checkPromo(value, subtotal);
      setPromo({ code: result.code, discount: result.discount });
      setCode('');
      haptic('success');
      showToast(t('promoApplied', formatSum(result.discount)));
    } catch (e) {
      setPromoError(e.message);
      haptic('error');
    } finally {
      setPromoBusy(false);
    }
  };

  const left = Math.max(0, appConfig.freeDeliveryFrom - subtotal);

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="screen-head">
          <h1 className="screen-title">{t('cart')}</h1>
        </div>

        <div className="empty">
          <div className="empty__ico">
            <IconBag />
          </div>
          <div className="empty__title">{t('cartEmpty')}</div>
          <div className="empty__text">{t('cartEmptyText')}</div>
          <button className="btn btn--brand" onClick={onGoMenu}>
            {t('openMenu')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="screen-head">
        <h1 className="screen-title">{t('cart')}</h1>
        <div className="screen-sub">{t('cartKinds', cart.length)}</div>
      </div>

      <div className="wrap">
        {cart.map((item) => (
          <div className="citem" key={item.productId}>
            <div className="citem__media">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} />
              ) : (
                <Placeholder />
              )}
            </div>

            <div className="citem__info">
              <div className="citem__name">{item.name}</div>
              <div className="citem__row">
                <div className="stepper stepper--sm">
                  <button onClick={() => setQty(item.productId, item.qty - 1)}>
                    <IconMinus />
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => setQty(item.productId, item.qty + 1)}>
                    <IconPlus />
                  </button>
                </div>
                <div className="citem__price">
                  {formatSum(item.price * item.qty)} {t('currency')}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* --------------------------- Qo'shimcha --------------------------- */}
        {upsell && (
          <div className="upsell">
            <div className="upsell__media">
              {upsell.imageUrl ? (
                <img src={upsell.imageUrl} alt={upsell.name} />
              ) : (
                <Placeholder />
              )}
            </div>
            <div className="upsell__text">
              {t(
                'upsell',
                productName(upsell, lang),
                formatSum(upsell.newPrice),
                t('currency'),
              )}
            </div>
            <button
              className={`switch ${upsellOn ? 'switch--on' : ''}`}
              onClick={toggleUpsell}
              aria-label="Qo'shish"
            />
          </div>
        )}

        {/* --------------------------- Promokod --------------------------- */}
        {promo ? (
          <div className="promo-applied">
            <span className="promo-applied__ico">
              <IconCheck />
            </span>
            <span className="promo-applied__text">
              <span className="promo-applied__code">{promo.code}</span>
              <span className="promo-applied__sub">
                −{formatSum(promo.discount)} {t('currency')}
              </span>
            </span>
            <button
              className="link"
              onClick={() => {
                setPromo(null);
                showToast(t('promoRemoved'));
              }}
            >
              {t('promoRemove')}
            </button>
          </div>
        ) : (
          <>
            <div className="promo-row">
              <input
                className="input"
                placeholder={t('promoPlaceholder')}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setPromoError('');
                }}
              />
              <button
                className="btn btn--soft"
                style={{ width: 'auto', padding: '0 20px' }}
                onClick={applyPromo}
                disabled={promoBusy || !code.trim()}
              >
                {promoBusy ? '...' : t('promoApply')}
              </button>
            </div>
            {promoError && (
              <div className="alert" style={{ marginTop: 10 }}>
                {promoError}
              </div>
            )}
          </>
        )}

        {/* ----------------------------- Summa ----------------------------- */}
        <div className="totals">
          <div className="totals__row">
            <span>{t('sumItems')}</span>
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
              {deliveryFee === 0
                ? t('sumFree')
                : `${formatSum(deliveryFee)} ${t('currency')}`}
            </span>
          </div>

          <div className="totals__row totals__row--main">
            <span>{t('sumTotal')}</span>
            <span>
              {formatSum(total)} {t('currency')}
            </span>
          </div>
        </div>

        {left > 0 && (
          <div className="hint">
            {t('freeDeliveryLeft', formatSum(left), t('currency'))}
          </div>
        )}

        <button
          className="btn btn--brand"
          style={{ marginTop: 18 }}
          onClick={onCheckout}
        >
          {t('checkout')} — {formatSum(total)} {t('currency')}
        </button>
      </div>
    </div>
  );
}
