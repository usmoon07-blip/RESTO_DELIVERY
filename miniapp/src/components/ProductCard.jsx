import { useApp } from '../context/AppContext.jsx';
import { discountPercent, formatSum } from '../utils.js';
import { IconDish, IconMinus, IconPlus } from './Icons.jsx';

/** Surat bo'lmaganda ko'rsatiladigan brend uslubidagi o'rin bosar */
export function Placeholder() {
  return (
    <div className="pcard__ph">
      <IconDish />
    </div>
  );
}

export default function ProductCard({ product, onOpen }) {
  const { addToCart, setQty, qtyOf } = useApp();
  const qty = qtyOf(product.id);
  const sale = discountPercent(product);

  return (
    <article className="pcard">
      <div className="pcard__media" onClick={() => onOpen(product)}>
        {product.imageUrl ? (
          <img
            className="pcard__img"
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <Placeholder />
        )}
        {sale > 0 && <span className="pcard__badge">−{sale}%</span>}
      </div>

      <div className="pcard__body" onClick={() => onOpen(product)}>
        <div className="pcard__name">{product.name}</div>
        <div className="pcard__prices">
          {sale > 0 && (
            <span className="price-old">{formatSum(product.oldPrice)}</span>
          )}
          <span className={`price-new ${sale > 0 ? 'price-new--sale' : ''}`}>
            {formatSum(product.newPrice)}
          </span>
        </div>
      </div>

      <div className="pcard__foot">
        {qty === 0 ? (
          <button className="addbtn" onClick={() => addToCart(product)}>
            <IconPlus />
            Savatchaga
          </button>
        ) : (
          <div className="stepper">
            <button
              onClick={() => setQty(product.id, qty - 1)}
              aria-label="Kamaytirish"
            >
              <IconMinus />
            </button>
            <span>{qty}</span>
            <button
              onClick={() => setQty(product.id, qty + 1)}
              aria-label="Ko'paytirish"
            >
              <IconPlus />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
