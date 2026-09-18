import { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatDate, formatSum, STATUS_LABELS } from '../utils.js';
import { haptic } from '../telegram.js';
import { IconReceipt } from '../components/Icons.jsx';

export default function Orders({ onGoMenu, onGoCart }) {
  const {
    orders,
    refreshOrders,
    appConfig,
    products,
    addToCart,
    clearCart,
    showToast,
  } = useApp();

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const reorder = (order) => {
    haptic('success');
    clearCart();

    let added = 0;
    for (const item of order.items || []) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        addToCart(product, item.qty, { silent: true });
        added += 1;
      }
    }

    if (added === 0) {
      showToast('Bu taomlar hozir menyuda yo\'q');
      return;
    }

    showToast('Savatchaga qo\'shildi');
    onGoCart();
  };

  return (
    <div className="page">
      <div className="screen-head">
        <h1 className="screen-title">Buyurtmalar</h1>
        <div className="screen-sub">
          {orders.length > 0 ? `${orders.length} ta buyurtma` : 'Xaridlar tarixi'}
        </div>
      </div>

      <div className="wrap">
        {orders.length === 0 ? (
          <div className="empty">
            <div className="empty__ico">
              <IconReceipt />
            </div>
            <div className="empty__title">Buyurtmalar yo'q</div>
            <div className="empty__text">
              Birinchi buyurtmangizni bering — tarix shu yerda saqlanadi
            </div>
            <button className="btn btn--brand" onClick={onGoMenu}>
              Menyuni ochish
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div className="ocard" key={order.id}>
              <div className="ocard__top">
                <div>
                  <div className="ocard__id">Buyurtma #{order.id}</div>
                  <div className="ocard__date">{formatDate(order.createdAt)}</div>
                </div>
                <span className={`badge badge--${order.status}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="ocard__items">
                {(order.items || [])
                  .map((i) => `${i.name} × ${i.qty}`)
                  .join(' · ')}
              </div>

              <div className="ocard__bot">
                <div className="ocard__total">
                  {formatSum(order.total)} {appConfig.currency}
                </div>
                <button className="link" onClick={() => reorder(order)}>
                  Yana buyurtma qilish
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
