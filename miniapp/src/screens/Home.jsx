import Stories from '../components/Stories.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatSum, onImageError } from '../utils.js';

export default function Home({ onGoCatalog, onOpenProduct }) {
  const { userName, products, appConfig, cartCount } = useApp();
  const popular = products.slice(0, 4);

  const hour = new Date().getHours();
  const greeting =
    hour < 6 ? 'Xayrli tun' : hour < 12 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech';

  return (
    <div className="page">
      <header className="header">
        <div>
          <div className="header__hello">{greeting},</div>
          <div className="header__name">{userName} 👋</div>
        </div>
        <div className="header__avatar">{userName.charAt(0).toUpperCase()}</div>
      </header>

      <Stories />

      <section className="hero">
        <span className="hero__badge">Bugungi taklif</span>
        <h2 className="hero__title">Yangi buyurtma berish</h2>
        <p className="hero__sub">
          Eng mazali pizzalar 30 daqiqada eshigingizda bo'ladi
        </p>
        <button className="hero__btn" onClick={onGoCatalog}>
          {cartCount > 0 ? 'Buyurtmani davom ettirish' : 'Menyuni ochish'} →
        </button>
      </section>

      <div className="features">
        <div className="feature">
          <div className="feature__icon">🛵</div>
          <div className="feature__title">30 daqiqa</div>
          <div className="feature__sub">Tezkor yetkazish</div>
        </div>
        <div className="feature">
          <div className="feature__icon">🔥</div>
          <div className="feature__title">Tandir</div>
          <div className="feature__sub">Issiq va yangi</div>
        </div>
        <div className="feature">
          <div className="feature__icon">💳</div>
          <div className="feature__title">Naqd/Karta</div>
          <div className="feature__sub">Qulay to'lov</div>
        </div>
      </div>

      <div className="container">
        <div
          className="section-title"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>Ommabop taomlar</span>
          <button className="link-btn" onClick={onGoCatalog}>
            Barchasi →
          </button>
        </div>
      </div>

      <div className="grid">
        {popular.map((product) => (
          <div
            key={product.id}
            className="card"
            onClick={() => onOpenProduct(product)}
          >
            <div className="card__img-wrap">
              <img
                className="card__img"
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onError={onImageError}
              />
            </div>
            <div className="card__body">
              <div className="card__name">{product.name}</div>
              <div className="card__prices">
                {product.oldPrice > product.newPrice && (
                  <span className="price-old">{formatSum(product.oldPrice)}</span>
                )}
                <span className="price-new">{formatSum(product.newPrice)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container" style={{ marginTop: 26 }}>
        <div className="free-delivery">
          🎁 {formatSum(appConfig.freeDeliveryFrom)} {appConfig.currency} dan yuqori
          buyurtmalarga yetkazib berish <b>bepul</b>
        </div>
      </div>
    </div>
  );
}
