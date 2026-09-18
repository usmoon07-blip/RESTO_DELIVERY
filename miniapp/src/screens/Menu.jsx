import { useEffect, useMemo, useRef, useState } from 'react';
import Stories from '../components/Stories.jsx';
import Banners from '../components/Banners.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { categoryEmoji } from '../utils.js';
import { haptic } from '../telegram.js';
import {
  IconChevron,
  IconClose,
  IconPin,
  IconSearch,
  IconSpark,
  IconTicket,
} from '../components/Icons.jsx';

export default function Menu({ onOpenProduct, onOpenAddress, onGoPromos }) {
  const { products, categories, address } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');

  const sectionRefs = useRef({});

  const searching = query.trim().length > 0;

  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [products, query]);

  const grouped = useMemo(
    () =>
      categories.map((category) => ({
        category,
        items: products.filter((p) => p.category === category),
      })),
    [products, categories],
  );

  /* Skroll paytida faol kategoriyani belgilash */
  useEffect(() => {
    if (searching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target?.dataset?.category) {
          setActiveCategory(visible.target.dataset.category);
        }
      },
      { rootMargin: '-140px 0px -70% 0px', threshold: 0 },
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [grouped, searching]);

  const goToCategory = (category) => {
    haptic('light');
    setActiveCategory(category);
    sectionRefs.current[category]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="page">
      {/* ------------------------------ Header ------------------------------ */}
      <header className="hdr">
        <div className="hdr__row">
          <div className="hdr__brand">
            <div className="brand-mark">Resto</div>
            <div className="brand-mark__sub">Restaurant</div>
          </div>

          <label className="search">
            <IconSearch />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Menyudan qidirish"
            />
            {searching && (
              <button
                className="search__clear"
                onClick={() => setQuery('')}
                aria-label="Tozalash"
              >
                <IconClose />
              </button>
            )}
          </label>
        </div>
      </header>

      {/* ---------------------------- Manzil ---------------------------- */}
      <button className="addr" onClick={onOpenAddress}>
        <span className="addr__icon">
          <IconPin />
        </span>
        <span className="addr__text">
          <span className="addr__title">
            {address?.text || 'Manzilni belgilang'}
          </span>
          <span className="addr__sub">
            {address?.mode === 'PICKUP'
              ? '15 daqiqada tayyor bo\'ladi'
              : '45 daqiqada yetkazamiz'}
          </span>
        </span>
        <span className="addr__go">
          <IconChevron />
        </span>
      </button>

      {searching ? (
        /* --------------------------- Qidiruv --------------------------- */
        <section className="section" style={{ paddingTop: 18 }}>
          <div className="section-head">
            <h2 className="section-head__title">Qidiruv natijasi</h2>
            <span className="section-head__count">{found.length} ta</span>
          </div>

          {found.length === 0 ? (
            <div className="empty">
              <div className="empty__ico">
                <IconSearch />
              </div>
              <div className="empty__title">Hech narsa topilmadi</div>
              <div className="empty__text">
                Boshqa nom bilan qidirib ko'ring
              </div>
            </div>
          ) : (
            <div className="grid">
              {found.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={onOpenProduct}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <Stories />

          <div className="quick">
            <button className="quick__btn" onClick={onGoPromos}>
              <span className="quick__ico quick__ico--a">
                <IconSpark />
              </span>
              Aksiyalar
            </button>
            <button className="quick__btn" onClick={onGoPromos}>
              <span className="quick__ico quick__ico--b">
                <IconTicket />
              </span>
              Promokodlar
            </button>
          </div>

          <Banners onBannerClick={onGoPromos} />

          {/* ------------------------ Kategoriyalar ------------------------ */}
          <div className="cats">
            <div className="cats__rail">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`cat ${activeCategory === category ? 'cat--on' : ''}`}
                  onClick={() => goToCategory(category)}
                >
                  <span className="cat__emoji">{categoryEmoji(category)}</span>
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* -------------------------- Bo'limlar -------------------------- */}
          {grouped.map(({ category, items }) => (
            <section
              className="section"
              key={category}
              data-category={category}
              ref={(el) => {
                sectionRefs.current[category] = el;
              }}
            >
              <div className="section-head">
                <h2 className="section-head__title">{category}</h2>
                <span className="section-head__count">{items.length} ta taom</span>
              </div>

              <div className="grid">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={onOpenProduct}
                  />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
