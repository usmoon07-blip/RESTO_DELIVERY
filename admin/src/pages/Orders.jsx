import { useCallback, useEffect, useState } from 'react';
import api from '../api.js';
import {
  DELIVERY_LABELS,
  PAYMENT_LABELS,
  STATUS_LABELS,
  formatDate,
  formatSum,
} from '../utils.js';

const STATUSES = Object.keys(STATUS_LABELS);

export default function Orders({ onAuthError }) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const [list, statistics] = await Promise.all([
          api.getOrders(filter),
          api.getStats(),
        ]);
        setOrders(list);
        setStats(statistics);
        setError('');
      } catch (e) {
        if (e.message.includes('Parol')) return onAuthError();
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [filter, onAuthError],
  );

  useEffect(() => {
    load();
  }, [load]);

  /* Har 10 soniyada avtomatik yangilanadi */
  useEffect(() => {
    const timer = setInterval(() => load(true), 10000);
    return () => clearInterval(timer);
  }, [load]);

  const changeStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      await load(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm(`#${id} buyurtma o'chirilsinmi?`)) return;
    try {
      await api.deleteOrder(id);
      await load(true);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="page-title">Buyurtmalar</div>
          <div className="page-sub">
            <span className="live-dot">Real vaqtda yangilanadi (10 soniya)</span>
          </div>
        </div>

        <div className="toolbar">
          <select
            className="select select--sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Barcha holatlar</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button className="btn btn--light btn--sm" onClick={() => load()}>
            Yangilash
          </button>
        </div>
      </div>

      {stats && (
        <div className="stats">
          <div className="stat-card">
            <div className="stat-card__label">Jami buyurtmalar</div>
            <div className="stat-card__value">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Yangi (kutilmoqda)</div>
            <div className="stat-card__value">{stats.pendingOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Yetkazilgan</div>
            <div className="stat-card__value">{stats.deliveredOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Tushum (so'm)</div>
            <div className="stat-card__value">{formatSum(stats.revenue)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Mijozlar</div>
            <div className="stat-card__value">{stats.totalUsers}</div>
          </div>
        </div>
      )}

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : orders.length === 0 ? (
        <div className="table-wrap">
          <div className="empty-state">
            <div className="empty-state__icon">—</div>
            <div>Buyurtmalar yo'q</div>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Mijoz</th>
                <th>Telefon</th>
                <th>Buyurtma</th>
                <th>Yetkazish / Manzil</th>
                <th>To'lov</th>
                <th>Summa</th>
                <th>Sana</th>
                <th>Holati</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="cell-strong">#{order.id}</td>

                  <td>
                    <div className="cell-strong">
                      {order.user?.firstName} {order.user?.lastName || ''}
                    </div>
                    <div className="cell-muted">
                      {order.user?.username ? `@${order.user.username}` : `ID ${order.user?.telegramId}`}
                    </div>
                  </td>

                  <td>
                    <a href={`tel:${order.phone}`} className="cell-strong">
                      {order.phone || '—'}
                    </a>
                  </td>

                  <td>
                    <div className="items-list">
                      {(order.items || []).map((item, i) => (
                        <div key={i}>
                          {item.name} × <b>{item.qty}</b> —{' '}
                          {formatSum(item.price * item.qty)}
                        </div>
                      ))}
                    </div>
                    {order.comment && (
                      <div className="cell-muted">Izoh: {order.comment}</div>
                    )}
                  </td>

                  <td>
                    <div>{DELIVERY_LABELS[order.deliveryType]}</div>
                    <div className="cell-muted">{order.address || '—'}</div>
                    {order.latitude != null && (
                      <a
                        className="cell-muted"
                        href={`https://maps.google.com/?q=${order.latitude},${order.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Xaritada ochish
                      </a>
                    )}
                  </td>

                  <td>{PAYMENT_LABELS[order.paymentMethod]}</td>

                  <td>
                    <div className="cell-strong">{formatSum(order.total)}</div>
                    {order.deliveryFee > 0 && (
                      <div className="cell-muted">
                        + {formatSum(order.deliveryFee)} yetkazish
                      </div>
                    )}
                  </td>

                  <td className="cell-muted">{formatDate(order.createdAt)}</td>

                  <td>
                    <span className={`badge badge--${order.status}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>

                  <td>
                    <div className="actions">
                      <select
                        className="select select--sm"
                        value={order.status}
                        onChange={(e) => changeStatus(order.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => remove(order.id)}
                      >
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
