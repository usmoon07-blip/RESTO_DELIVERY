import { useCallback, useEffect, useState } from 'react';
import api from '../api.js';
import { formatSum } from '../utils.js';

const EMPTY = {
  code: '',
  description: '',
  type: 'PERCENT',
  value: '',
  minOrderAmount: '',
  maxDiscount: '',
  usageLimit: '',
  expiresAt: '',
  isActive: true,
};

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function PromoModal({ promo, onClose, onSaved }) {
  const [form, setForm] = useState(
    promo
      ? {
          ...promo,
          value: promo.value ?? '',
          minOrderAmount: promo.minOrderAmount ?? '',
          maxDiscount: promo.maxDiscount ?? '',
          usageLimit: promo.usageLimit ?? '',
          expiresAt: toDateInput(promo.expiresAt),
        }
      : EMPTY,
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        code: form.code,
        description: form.description,
        type: form.type,
        value: form.value,
        minOrderAmount: form.minOrderAmount,
        maxDiscount: form.type === 'PERCENT' ? form.maxDiscount : '',
        usageLimit: form.usageLimit,
        expiresAt: form.expiresAt || null,
        isActive: form.isActive,
      };

      if (promo) await api.updatePromo(promo.id, payload);
      else await api.createPromo(payload);

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal__head">
          <div className="modal__title">
            {promo ? 'Promokodni tahrirlash' : "Yangi promokod"}
          </div>
          <button type="button" className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="row-2">
          <div className="field">
            <label className="field__label">Kod *</label>
            <input
              className="input"
              value={form.code}
              onChange={set('code')}
              placeholder="RESTO10"
              style={{ textTransform: 'uppercase' }}
              required
            />
          </div>
          <div className="field">
            <label className="field__label">Turi</label>
            <select className="select" value={form.type} onChange={set('type')}>
              <option value="PERCENT">Foizli (%)</option>
              <option value="FIXED">Belgilangan summa</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field__label">Tavsif</label>
          <input
            className="input"
            value={form.description}
            onChange={set('description')}
            placeholder="Barcha buyurtmalarga 10% chegirma"
          />
        </div>

        <div className="row-2">
          <div className="field">
            <label className="field__label">
              {form.type === 'PERCENT' ? 'Foiz (%) *' : "Summa (so'm) *"}
            </label>
            <input
              className="input"
              type="number"
              value={form.value}
              onChange={set('value')}
              placeholder={form.type === 'PERCENT' ? '10' : '20000'}
              required
            />
          </div>
          <div className="field">
            <label className="field__label">Eng kam buyurtma summasi</label>
            <input
              className="input"
              type="number"
              value={form.minOrderAmount}
              onChange={set('minOrderAmount')}
              placeholder="150000"
            />
          </div>
        </div>

        <div className="row-2">
          {form.type === 'PERCENT' && (
            <div className="field">
              <label className="field__label">Eng ko'p chegirma</label>
              <input
                className="input"
                type="number"
                value={form.maxDiscount}
                onChange={set('maxDiscount')}
                placeholder="50000"
              />
            </div>
          )}
          <div className="field">
            <label className="field__label">Foydalanish limiti</label>
            <input
              className="input"
              type="number"
              value={form.usageLimit}
              onChange={set('usageLimit')}
              placeholder="Cheksiz"
            />
          </div>
        </div>

        <div className="field">
          <label className="field__label">Amal qilish muddati</label>
          <input
            className="input"
            type="date"
            value={form.expiresAt}
            onChange={set('expiresAt')}
          />
        </div>

        <div className="field">
          <label
            className="field__label"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} />
            Faol (Mini Appda ishlaydi)
          </label>
        </div>

        <div className="modal__foot">
          <button type="button" className="btn btn--light" onClick={onClose}>
            Bekor qilish
          </button>
          <button className="btn btn--dark" disabled={saving}>
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Promos({ onAuthError }) {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPromos(await api.getPromos());
      setError('');
    } catch (e) {
      if (e.message.includes('Parol')) return onAuthError();
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [onAuthError]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (promo) => {
    if (!confirm(`"${promo.code}" o'chirilsinmi?`)) return;
    try {
      await api.deletePromo(promo.id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="page-title">Promokodlar</div>
          <div className="page-sub">Jami {promos.length} ta promokod</div>
        </div>
        <button className="btn btn--dark" onClick={() => setModal('new')}>
          ＋ Yangi promokod
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : promos.length === 0 ? (
        <div className="table-wrap">
          <div className="empty-state">
            <div className="empty-state__icon">🎟️</div>
            <div>Promokodlar yo'q. Yangisini qo'shing.</div>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kod</th>
                <th>Tavsif</th>
                <th>Chegirma</th>
                <th>Eng kam summa</th>
                <th>Ishlatilgan</th>
                <th>Muddati</th>
                <th>Holati</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.id}>
                  <td className="cell-strong">{promo.code}</td>
                  <td className="cell-muted">{promo.description || '—'}</td>
                  <td className="cell-strong">
                    {promo.type === 'PERCENT'
                      ? `${promo.value}%`
                      : `${formatSum(promo.value)} so'm`}
                    {promo.type === 'PERCENT' && promo.maxDiscount && (
                      <div className="cell-muted">
                        maks. {formatSum(promo.maxDiscount)}
                      </div>
                    )}
                  </td>
                  <td>
                    {promo.minOrderAmount > 0
                      ? formatSum(promo.minOrderAmount)
                      : '—'}
                  </td>
                  <td>
                    {promo.usedCount}
                    {promo.usageLimit != null && ` / ${promo.usageLimit}`}
                  </td>
                  <td className="cell-muted">
                    {promo.expiresAt
                      ? new Date(promo.expiresAt).toLocaleDateString('ru-RU')
                      : 'Cheksiz'}
                  </td>
                  <td>
                    <span
                      className={`badge ${promo.isActive ? 'badge--on' : 'badge--off'}`}
                    >
                      {promo.isActive ? 'Faol' : "O'chirilgan"}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn--sm btn--light"
                        onClick={() => setModal(promo)}
                      >
                        Tahrirlash
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => remove(promo)}
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

      {modal && (
        <PromoModal
          promo={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}
    </div>
  );
}
