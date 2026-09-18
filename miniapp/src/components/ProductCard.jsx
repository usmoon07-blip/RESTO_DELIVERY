import { useApp } from '../context/AppContext.jsx';
import { formatSum, onImageError } from '../utils.js';

export default function ProductCard({ product, onOpen }) {
  const { addToCart, isInCart } = useApp();
  const inCart = isInCart(product.id);

  const discount =
    product.oldPrice && product.oldPrice > product.newPrice
      ? Math.round(100 - (product.newPrice / product.oldPrice) * 100)
      : 0;

  return (
    <div className="card" onClick={() => onOpen(product)}>
      <div className="card__img-wrap">
        <img
          className="card__img"
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={onImageError}
        />
        {discount > 0 && <span className="card__badge">−{discount}%</span>}
        <button
          className={`card__add ${inCart ? 'card__add--in' : ''}`}
          aria-label="Savatchaga qo'shish"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          {inCart ? '✓' : '＋'}
        </button>
      </div>

      <div className="card__body">
        <div className="card__name">{product.name}</div>
        <div className="card__desc">{product.description}</div>
        <div className="card__prices">
          {product.oldPrice > product.newPrice && (
            <span className="price-old">{formatSum(product.oldPrice)}</span>
          )}
          <span className="price-new">{formatSum(product.newPrice)}</span>
        </div>
      </div>
    </div>
  );
}
