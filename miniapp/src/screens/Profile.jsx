import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatDate, formatSum, STATUS_LABELS } from '../utils.js';
import api from '../api.js';
import { haptic } from '../telegram.js';

export default function Profile({ onGoCart }) {
  const { profile, userName, appConfig, products, addToCart, clearCart } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  /** Eski buyurtmani qayta savatchaga solish */
  const reorder = (order) => {
    haptic('success');
    clearCart();

    for (const item of order.items || []) {
      const product = products.find((p) => p.id === item.productId);
      if (product) addToCart(product, item.qty);
    }

    onGoCart();
  };

  return (
    <div className="page">
      <div className="profile-head">
        <div className="profile-head__avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="profile-head__name">{userName}</div>
          <div className="profile-head__phone">
            {profile?.phone || 'Telefon raqam kiritilmagan'}
          </div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="stat__value">{orders.length}</div>
          <div className="stat__label">Buyurtmalar</div>
        </div>
        <div className="stat">
          <div className="stat__value">{formatSum(totalSpent)}</div>
          <div className="stat__label">Jami xarid ({appConfig.currency})</div>
        </div>
      </div>

      <div className="container">
        <div className="section-title">📜 Mening buyurtmalarim</div>

        {loading ? (
          <>
            <div className="skeleton" style={{ height: 120, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 120 }} />
          </>
        ) : orders.length === 0 ? (
          <div className="empty" style={{ padding: '40px 20px' }}>
            <div className="empty__icon">📦</div>
            <div className="empty__title">Buyurtmalar yo'q</div>
            <div className="empty__text">
              Birinchi buyurtmangizni bering — tarix shu yerda saqlanadi
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card__top">
                <div>
                  <div className="order-card__id">Buyurtma #{order.id}</div>
                  <div className="order-card__date">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <span className={`badge badge--${order.status}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="order-card__items">
                {(order.items || [])
                  .map((i) => `${i.name} × ${i.qty}`)
                  .join(' · ')}
              </div>

              <div className="order-card__bottom">
                <div className="order-card__total">
                  {formatSum(order.total)} {appConfig.currency}
                </div>
                <button className="link-btn" onClick={() => reorder(order)}>
                  🔁 Yana shundan buyurtma qilish
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="container" style={{ marginTop: 18 }}>
        <div className="free-delivery">
          🕐 Ish vaqti: 10:00 — 23:00 &nbsp;·&nbsp; 📞 +998 90 123-45-67
        </div>
      </div>
    </div>
  );
}
