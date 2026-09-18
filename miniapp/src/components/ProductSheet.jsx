import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatSum, onImageError } from '../utils.js';
import { haptic } from '../telegram.js';

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

  const total = product.newPrice * qty;

  const handleAdd = () => {
    addToCart(product, qty);
    haptic('success');
    onClose();
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet__handle" />

        <div className="sheet__scroll">
          <div className="sheet__body">
            <img
              className="sheet__img"
              src={product.imageUrl}
              alt={product.name}
              onError={onImageError}
            />

            <h2 className="sheet__title">{product.name}</h2>

            <div className="card__prices" style={{ marginTop: 10 }}>
              {product.oldPrice > product.newPrice && (
                <span className="price-old" style={{ fontSize: 14 }}>
                  {formatSum(product.oldPrice)}
                </span>
              )}
              <span className="price-new" style={{ fontSize: 20 }}>
                {formatSum(product.newPrice)} {appConfig.currency}
              </span>
            </div>

            {product.description && (
              <p className="sheet__desc">{product.description}</p>
            )}

            {product.ingredients?.length > 0 && (
              <>
                <div className="sheet__label">Tarkibi</div>
                <ul className="ingredients">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="sheet__cta">
          <div className="qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(20, q + 1))}>＋</button>
          </div>

          <button className="btn btn--dark" onClick={handleAdd}>
            Savatchaga qo'shish — {formatSum(total)}
          </button>
        </div>
      </div>
    </>
  );
}
