import { useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatSum, onImageError } from '../utils.js';
import { haptic } from '../telegram.js';

export default function Cart({ onGoCatalog, onCheckout }) {
  const {
    cart,
    products,
    setQty,
    removeFromCart,
    addToCart,
    subtotal,
    appConfig,
  } = useApp();

  /** Qo'shimcha taklif uchun eng arzon ichimlik */
  const upsellProduct = useMemo(() => {
    const drinks = products.filter((p) => p.category !== 'Pizza');
    if (drinks.length === 0) return null;
    return drinks.reduce((cheapest, p) =>
      p.newPrice < cheapest.newPrice ? p : cheapest,
    );
  }, [products]);

  const upsellOn = Boolean(
    upsellProduct && cart.some((i) => i.productId === upsellProduct.id),
  );

  const toggleUpsell = () => {
    if (!upsellProduct) return;
    haptic('light');
    if (upsellOn) removeFromCart(upsellProduct.id);
    else addToCart(upsellProduct, 1);
  };

  const deliveryFee =
    subtotal >= appConfig.freeDeliveryFrom ? 0 : appConfig.deliveryFee;
  const total = subtotal + deliveryFee;
  const left = Math.max(0, appConfig.freeDeliveryFrom - subtotal);

  if (cart.length === 0) {
    return (
      <div className="page">
        <header className="header">
          <div>
            <div className="header__hello">Buyurtmangiz</div>
            <div className="header__name">Savatcha</div>
          </div>
        </header>

        <div className="empty">
          <div className="empty__icon">🛒</div>
          <div className="empty__title">Savatcha bo'sh</div>
          <div className="empty__text">
            Menyudan o'zingizga yoqqan pizzani tanlang va shu yerga qo'shing
          </div>
          <button className="btn btn--dark" onClick={onGoCatalog}>
            Menyuni ochish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <div className="header__hello">Buyurtmangiz</div>
          <div className="header__name">Savatcha</div>
        </div>
      </header>

      <div className="container">
        {cart.map((item) => (
          <div className="cart-item" key={item.productId}>
            <img
              className="cart-item__img"
              src={item.imageUrl}
              alt={item.name}
              onError={onImageError}
            />
            <div className="cart-item__info">
              <div>
                <div className="cart-item__name">{item.name}</div>
                <div className="cart-item__price">
                  {formatSum(item.price * item.qty)} {appConfig.currency}
                </div>
              </div>
              <div className="cart-item__row">
                <div className="qty qty--sm">
                  <button onClick={() => setQty(item.productId, item.qty - 1)}>
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => setQty(item.productId, item.qty + 1)}>
                    ＋
                  </button>
                </div>
                <button
                  className="cart-item__remove"
                  onClick={() => removeFromCart(item.productId)}
                >
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}

        {upsellProduct && (
          <div className="upsell">
            <img
              className="upsell__img"
              src={upsellProduct.imageUrl}
              alt={upsellProduct.name}
              onError={onImageError}
            />
            <div className="upsell__text">
              <div className="upsell__title">
                Bunga qo'shimcha ravishda <b>{upsellProduct.name}</b> ni atigi{' '}
                {formatSum(upsellProduct.newPrice)} {appConfig.currency} ga
                qo'shasizmi?
              </div>
            </div>
            <button
              className={`switch ${upsellOn ? 'switch--on' : ''}`}
              onClick={toggleUpsell}
              aria-label="Qo'shimcha mahsulot"
            />
          </div>
        )}

        <div className="totals">
          <div className="totals__row">
            <span>Mahsulotlar</span>
            <span>
              {formatSum(subtotal)} {appConfig.currency}
            </span>
          </div>
          <div className="totals__row">
            <span>Yetkazib berish</span>
            <span>
              {deliveryFee === 0 ? 'Bepul 🎁' : `${formatSum(deliveryFee)} ${appConfig.currency}`}
            </span>
          </div>
          <div className="totals__row totals__row--main">
            <span>Jami</span>
            <span>
              {formatSum(total)} {appConfig.currency}
            </span>
          </div>
        </div>

        {left > 0 && (
          <div className="free-delivery">
            Yana <b>{formatSum(left)} {appConfig.currency}</b> qo'shsangiz,
            yetkazib berish bepul bo'ladi 🎁
          </div>
        )}

        <button
          className="btn btn--dark"
          style={{ marginTop: 18 }}
          onClick={onCheckout}
        >
          Rasmiylashtirish — {formatSum(total)} {appConfig.currency}
        </button>
      </div>
    </div>
  );
}
