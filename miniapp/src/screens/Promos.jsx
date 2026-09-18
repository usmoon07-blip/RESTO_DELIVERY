import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { discountPercent, formatSum } from '../utils.js';
import { haptic } from '../telegram.js';
import { IconCopy, IconSpark, IconTicket } from '../components/Icons.jsx';

export default function Promos({ onOpenProduct }) {
  const { promos, products, showToast, t } = useApp();
  const [copied, setCopied] = useState(null);

  const sales = useMemo(
    () => products.filter((p) => discountPercent(p) > 0),
    [products],
  );

  const copy = async (code) => {
    haptic('success');
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard mavjud bo'lmasa ham davom etamiz */
    }
    setCopied(code);
    showToast(t('copiedToast', code));
    setTimeout(() => setCopied((c) => (c === code ? null : c)), 2000);
  };

  const promoValue = (promo) =>
    promo.type === 'PERCENT'
      ? t('discountPercent', promo.value)
      : t('discountFixed', formatSum(promo.value), t('currency'));

  return (
    <div className="page">
      <div className="screen-head">
        <h1 className="screen-title">{t('promos')}</h1>
        <div className="screen-sub">{t('promosSub')}</div>
      </div>

      <div className="wrap">
        {promos.length === 0 ? (
          <div className="empty">
            <div className="empty__ico">
              <IconSpark />
            </div>
            <div className="empty__title">{t('noPromos')}</div>
            <div className="empty__text">{t('noPromosText')}</div>
          </div>
        ) : (
          promos.map((promo, index) => (
            <div
              className={`promo-card ${index % 2 === 1 ? 'promo-card--alt' : ''}`}
              key={promo.code}
            >
              <span className="promo-card__glyph">
                <IconTicket />
              </span>

              <div className="promo-card__value">{promoValue(promo)}</div>
              {promo.description && (
                <div className="promo-card__desc">{promo.description}</div>
              )}

              <div className="promo-card__foot">
                <div className="promo-card__code">{promo.code}</div>
                <button
                  className="promo-card__copy"
                  onClick={() => copy(promo.code)}
                  aria-label="Nusxalash"
                >
                  <IconCopy />
                </button>
              </div>

              <div className="promo-card__min">
                {copied === promo.code
                  ? t('copied')
                  : promo.minOrderAmount > 0
                    ? t('minOrder', formatSum(promo.minOrderAmount), t('currency'))
                    : t('anyOrder')}
              </div>
            </div>
          ))
        )}
      </div>

      {sales.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="section-head__title">{t('salesTitle')}</h2>
            <span className="section-head__count">{t('itemCount', sales.length)}</span>
          </div>
          <div className="grid">
            {sales.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={onOpenProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
