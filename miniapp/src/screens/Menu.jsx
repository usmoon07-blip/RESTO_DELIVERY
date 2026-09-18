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

/**
 * Bo'lim kartochkalari faqat ekranga yaqinlashganda yuklanadi.
 * Menyu katta bo'lganda (100+ taom) ilova sekinlashmasligi uchun.
 */
function MenuSection({ category, items, onOpenProduct, innerRef }) {
  const [mounted, setMounted] = useState(false);
  const localRef = useRef(null);

  useEffect(() => {
    if (mounted) return;
    const el = localRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '700px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  const rows = Math.ceil(items.length / 2);

  return (
    <section
      className="section"
      data-category={category}
      ref={(el) => {
        localRef.current = el;
        innerRef(el);
      }}
    >
      <div className="section-head">
        <h2 className="section-head__title">{category}</h2>
        <span className="section-head__count">{items.length} ta taom</span>
      </div>

      {mounted ? (
        <div className="grid">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpenProduct}
            />
          ))}
        </div>
      ) : (
        <div style={{ height: rows * 302 }} />
      )}
    </section>
  );
}

export default function Menu({ onOpenProduct, onOpenAddress, onGoPromos }) {
  const { products, categories, address } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');

  const sectionRefs = useRef({});
  // Kategoriya bosilganda skroll kuzatuvchisi vaqtincha to'xtatiladi
  const lockedCategory = useRef(null);
  const catsRef = useRef(null);

  const searching = query.trim().length > 0;

  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 60);
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

    // Yopishib turgan panel ostidagi chiziq: shu chiziqdan yuqoridagi
    // eng oxirgi bo'lim faol hisoblanadi.
    const LINE = 140;
    let ticking = false;

    const update = () => {
      ticking = false;
      if (lockedCategory.current) return;

      let current = null;
      for (const { category } of grouped) {
        const el = sectionRefs.current[category];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= LINE) current = category;
      }

      if (current) setActiveCategory(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, [grouped, searching]);

  /* Faol kategoriya tegi gorizontal panelda ko'rinib tursin */
  useEffect(() => {
    const chip = catsRef.current?.querySelector('.cat--on');
    chip?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategory]);

  const goToCategory = (category) => {
    haptic('light');
    setActiveCategory(category);
    lockedCategory.current = category;

    const scrollTo = (behavior) =>
      sectionRefs.current[category]?.scrollIntoView({ behavior, block: 'start' });

    scrollTo('smooth');

    // Bo'limlar yuklangach joyi biroz siljishi mumkin — qayta aniqlashtiramiz
    setTimeout(() => scrollTo('auto'), 450);
    setTimeout(() => {
      scrollTo('auto');
      lockedCategory.current = null;
    }, 800);
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
            <div className="cats__rail" ref={catsRef}>
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
            <MenuSection
              key={category}
              category={category}
              items={items}
              onOpenProduct={onOpenProduct}
              innerRef={(el) => {
                sectionRefs.current[category] = el;
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
