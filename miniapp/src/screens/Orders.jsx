import { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatDate, formatSum } from '../utils.js';
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
    t,
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
      showToast(t('reorderMissing'));
      return;
    }

    showToast(t('reorderDone'));
    onGoCart();
  };

  return (
    <div className="page">
      <div className="screen-head">
        <h1 className="screen-title">{t('orders')}</h1>
        <div className="screen-sub">
          {orders.length > 0 ? t('ordersCount', orders.length) : t('ordersHistory')}
        </div>
      </div>

      <div className="wrap">
        {orders.length === 0 ? (
          <div className="empty">
            <div className="empty__ico">
              <IconReceipt />
            </div>
            <div className="empty__title">{t('noOrders')}</div>
            <div className="empty__text">{t('noOrdersText')}</div>
            <button className="btn btn--brand" onClick={onGoMenu}>
              {t('openMenu')}
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div className="ocard" key={order.id}>
              <div className="ocard__top">
                <div>
                  <div className="ocard__id">{t('orderNo', order.id)}</div>
                  <div className="ocard__date">{formatDate(order.createdAt)}</div>
                </div>
                <span className={`badge badge--${order.status}`}>
                  {t('status')[order.status]}
                </span>
              </div>

              <div className="ocard__items">
                {(order.items || [])
                  .map((i) => `${i.name} × ${i.qty}`)
                  .join(' · ')}
              </div>

              <div className="ocard__bot">
                <div className="ocard__total">
                  {formatSum(order.total)} {t('currency')}
                </div>
                <button className="link" onClick={() => reorder(order)}>
                  {t('reorder')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
