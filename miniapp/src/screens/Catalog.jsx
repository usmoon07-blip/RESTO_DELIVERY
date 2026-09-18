import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { haptic } from '../telegram.js';

export default function Catalog({ onOpenProduct }) {
  const { products, categories } = useApp();
  const [active, setActive] = useState('Hammasi');
  const [query, setQuery] = useState('');

  const chips = useMemo(() => ['Hammasi', ...categories], [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const byCategory = active === 'Hammasi' || p.category === active;
      const bySearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return byCategory && bySearch;
    });
  }, [products, active, query]);

  return (
    <div className="page">
      <header className="header">
        <div>
          <div className="header__hello">Menyu</div>
          <div className="header__name">Katalog</div>
        </div>
      </header>

      <div className="container" style={{ margin: '10px 0 14px' }}>
        <input
          className="input"
          placeholder="🔍 Qidirish..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="chips">
        {chips.map((chip) => (
          <button
            key={chip}
            className={`chip ${active === chip ? 'chip--active' : ''}`}
            onClick={() => {
              haptic('light');
              setActive(chip);
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty__icon">🔍</div>
          <div className="empty__title">Hech narsa topilmadi</div>
          <div className="empty__text">
            Boshqa kategoriya yoki nom bilan qidirib ko'ring
          </div>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpenProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
