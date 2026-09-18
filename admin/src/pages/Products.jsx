import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api.js';
import { formatSum, onImageError } from '../utils.js';

const EMPTY = {
  name: '',
  nameUz: '',
  nameEn: '',
  description: '',
  descriptionUz: '',
  descriptionEn: '',
  categoryUz: '',
  categoryEn: '',
  ingredientsUz: '',
  ingredientsEn: '',
  imageUrl: '',
  oldPrice: '',
  newPrice: '',
  category: 'Pizza',
  ingredients: '',
  isActive: true,
  sortOrder: 0,
};

function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState(
    product
      ? {
          ...product,
          nameUz: product.nameUz ?? '',
          nameEn: product.nameEn ?? '',
          categoryUz: product.categoryUz ?? '',
          categoryEn: product.categoryEn ?? '',
          oldPrice: product.oldPrice ?? '',
          ingredients: (product.ingredients || []).join('\n'),
          ingredientsUz: (product.ingredientsUz || []).join('\n'),
          ingredientsEn: (product.ingredientsEn || []).join('\n'),
        }
      : EMPTY,
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const url = await api.uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

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
        name: form.name,
        nameUz: form.nameUz,
        nameEn: form.nameEn,
        description: form.description,
        descriptionUz: form.descriptionUz,
        descriptionEn: form.descriptionEn,
        categoryUz: form.categoryUz,
        categoryEn: form.categoryEn,
        ingredientsUz: form.ingredientsUz,
        ingredientsEn: form.ingredientsEn,
        imageUrl: form.imageUrl,
        oldPrice: form.oldPrice === '' ? null : Number(form.oldPrice),
        newPrice: Number(form.newPrice),
        category: form.category,
        ingredients: form.ingredients,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (product) await api.updateProduct(product.id, payload);
      else await api.createProduct(payload);

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="modal__head">
          <div className="modal__title">
            {product ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish"}
          </div>
          <button type="button" className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="field">
          <label className="field__label">Nomi (ruscha, asosiy) *</label>
          <input
            className="input"
            value={form.name}
            onChange={set('name')}
            placeholder="Хумус"
            required
          />
        </div>

        <div className="row-2">
          <div className="field">
            <label className="field__label">Nomi (o'zbekcha)</label>
            <input
              className="input"
              value={form.nameUz}
              onChange={set('nameUz')}
              placeholder="Hummus"
            />
          </div>
          <div className="field">
            <label className="field__label">Nomi (inglizcha)</label>
            <input
              className="input"
              value={form.nameEn}
              onChange={set('nameEn')}
              placeholder="Hummus"
            />
          </div>
        </div>

        <div className="field">
          <label className="field__label">Ta'rifi</label>
          <textarea
            className="input"
            value={form.description}
            onChange={set('description')}
            placeholder="Pomidor sousi, mozzarella va yangi rayhon"
          />
        </div>

        <div className="field">
          <label className="field__label">Surat</label>

          <div className="upload">
            <div className="upload__preview">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="" onError={onImageError} />
              ) : (
                <span className="upload__empty">Surat yo'q</span>
              )}
            </div>

            <div className="upload__side">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={pickFile}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn--light btn--sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Yuklanmoqda...' : 'Kompyuterdan yuklash'}
              </button>

              {form.imageUrl && (
                <button
                  type="button"
                  className="btn btn--sm btn--danger"
                  onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                >
                  Suratni olib tashlash
                </button>
              )}

              <div className="upload__hint">JPG, PNG yoki WEBP · 8 MB gacha</div>
            </div>
          </div>

          <input
            className="input"
            style={{ marginTop: 10 }}
            value={form.imageUrl}
            onChange={set('imageUrl')}
            placeholder="yoki havolani kiriting: https://..."
          />
        </div>

        <div className="row-2">
          <div className="field">
            <label className="field__label">Eski narx (chizilib ko'rsatiladi)</label>
            <input
              className="input"
              type="number"
              value={form.oldPrice}
              onChange={set('oldPrice')}
              placeholder="65000"
            />
          </div>
          <div className="field">
            <label className="field__label">Yangi narx *</label>
            <input
              className="input"
              type="number"
              value={form.newPrice}
              onChange={set('newPrice')}
              placeholder="49000"
              required
            />
          </div>
        </div>

        <div className="row-2">
          <div className="field">
            <label className="field__label">Kategoriya</label>
            <input
              className="input"
              value={form.category}
              onChange={set('category')}
              placeholder="Pizza"
            />
          </div>
          <div className="field">
            <label className="field__label">Tartib raqami</label>
            <input
              className="input"
              type="number"
              value={form.sortOrder}
              onChange={set('sortOrder')}
            />
          </div>
        </div>

        <div className="field">
          <label className="field__label">
            Tarkibi — ruscha (har birini yangi qatordan)
          </label>
          <textarea
            className="input"
            value={form.ingredients}
            onChange={set('ingredients')}
            placeholder={'Нут\nТахина\nЧеснок'}
          />
        </div>

        <div className="row-2">
          <div className="field">
            <label className="field__label">Tarkibi — o'zbekcha</label>
            <textarea
              className="input"
              value={form.ingredientsUz}
              onChange={set('ingredientsUz')}
              placeholder={"No'xat\nTahina\nSarimsoq"}
            />
          </div>
          <div className="field">
            <label className="field__label">Tarkibi — inglizcha</label>
            <textarea
              className="input"
              value={form.ingredientsEn}
              onChange={set('ingredientsEn')}
              placeholder={'Chickpeas\nTahini\nGarlic'}
            />
          </div>
        </div>

        <div className="row-2">
          <div className="field">
            <label className="field__label">Kategoriya (o'zbekcha)</label>
            <input
              className="input"
              value={form.categoryUz}
              onChange={set('categoryUz')}
              placeholder="Mezelar"
            />
          </div>
          <div className="field">
            <label className="field__label">Kategoriya (inglizcha)</label>
            <input
              className="input"
              value={form.categoryEn}
              onChange={set('categoryEn')}
              placeholder="Meze & Starters"
            />
          </div>
        </div>

        <div className="alert" style={{ background: '#f7f5f3', color: 'var(--text-2)' }}>
          Tarjima maydonlari bo'sh qoldirilsa, mijozga ruscha varianti ko'rsatiladi.
        </div>

        <div className="field">
          <label
            className="field__label"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={set('isActive')}
            />
            Faol (Mini Appda ko'rinadi)
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

export default function Products({ onAuthError }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | 'new' | product

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await api.getProducts());
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

  const remove = async (product) => {
    if (!confirm(`"${product.name}" o'chirilsinmi?`)) return;
    try {
      await api.deleteProduct(product.id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="page-title">Mahsulotlar</div>
          <div className="page-sub">Jami {products.length} ta mahsulot</div>
        </div>

        <button className="btn btn--dark" onClick={() => setModal('new')}>
          ＋ Yangi mahsulot
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : products.length === 0 ? (
        <div className="table-wrap">
          <div className="empty-state">
            <div className="empty-state__icon">—</div>
            <div>Mahsulotlar yo'q. Yangisini qo'shing.</div>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rasm</th>
                <th>Nomi</th>
                <th>Kategoriya</th>
                <th>Eski narx</th>
                <th>Yangi narx</th>
                <th>Holati</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      className="thumb"
                      src={product.imageUrl}
                      alt={product.name}
                      onError={onImageError}
                    />
                  </td>
                  <td>
                    <div className="cell-strong">{product.name}</div>
                    <div className="cell-muted">{product.description}</div>
                  </td>
                  <td>
                    <span className="badge">{product.category}</span>
                  </td>
                  <td className="cell-muted">
                    {product.oldPrice ? (
                      <s>{formatSum(product.oldPrice)}</s>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="cell-strong">{formatSum(product.newPrice)}</td>
                  <td>
                    <span
                      className={`badge ${product.isActive ? 'badge--on' : 'badge--off'}`}
                    >
                      {product.isActive ? 'Faol' : "O'chirilgan"}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn--sm btn--light"
                        onClick={() => setModal(product)}
                      >
                        Tahrirlash
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => remove(product)}
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
        <ProductModal
          product={modal === 'new' ? null : modal}
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
