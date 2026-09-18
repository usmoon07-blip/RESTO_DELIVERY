import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { discountPercent, formatSum } from '../utils.js';
import { haptic } from '../telegram.js';
import { IconMinus, IconPlus } from './Icons.jsx';
import { Placeholder } from './ProductCard.jsx';

export default function ProductSheet({ product, onClose }) {
  const { addToCart, appConfig } = useApp();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [product?.id]);

  if (!product) return null;

  const sale = discountPercent(product);

  // Tavsifning boshidagi turkcha nom (masalan "Acili Ezme — ...")
  const [maybeSubtitle] = product.description.split(' — ');
  const subtitle =
    product.description.includes(' — ') && maybeSubtitle.length < 40
      ? maybeSubtitle
      : null;

  const handleAdd = () => {
    addToCart(product, qty, { silent: true });
    haptic('success');
    onClose();
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet__grip" />

        <div className="sheet__scroll">
          <div className="sheet__body">
            <div className="sheet__media">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <Placeholder />
              )}
            </div>

            <h2 className="sheet__title">{product.name}</h2>
            {subtitle && <div className="sheet__sub">{subtitle}</div>}

            <div className="sheet__price">
              {sale > 0 && (
                <span className="price-old" style={{ marginRight: 8 }}>
                  {formatSum(product.oldPrice)}
                </span>
              )}
              <span className={sale > 0 ? 'price-new--sale' : ''}>
                {formatSum(product.newPrice)} {appConfig.currency}
              </span>
            </div>

            {product.ingredients?.length > 0 && (
              <>
                <div className="sheet__label">Tarkibi</div>
                <ul className="ing">
                  {product.ingredients.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="sheet__cta">
          <div className="stepper stepper--lg">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <IconMinus />
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(30, q + 1))}>
              <IconPlus />
            </button>
          </div>

          <button className="btn btn--brand" onClick={handleAdd}>
            {formatSum(product.newPrice * qty)} {appConfig.currency}
          </button>
        </div>
      </div>
    </>
  );
}
