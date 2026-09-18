import { useEffect, useMemo, useRef, useState } from 'react';
import Stories from '../components/Stories.jsx';
import Banners from '../components/Banners.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { categoryEmoji } from '../utils.js';
import { categoryName, productDescription, productName } from '../i18n.js';
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
function MenuSection({ category, title, count, items, onOpenProduct, innerRef }) {
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
        <h2 className="section-head__title">{title}</h2>
        <span className="section-head__count">{count}</span>
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
  const { products, categories, address, lang, t } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]?.key || '');

  const sectionRefs = useRef({});
  // Kategoriya bosilganda skroll kuzatuvchisi vaqtincha to'xtatiladi
  const lockedCategory = useRef(null);
  const catsRef = useRef(null);

  const searching = query.trim().length > 0;

  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const haystack = [
          p.name,
          p.nameUz,
          p.nameEn,
          p.description,
          p.descriptionUz,
          p.descriptionEn,
          p.category,
          p.categoryUz,
          p.categoryEn,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 60);
  }, [products, query]);

  const grouped = useMemo(
    () =>
      categories.map((category) => ({
        category: category.key,
        title: categoryName(category, lang),
        items: products.filter((p) => p.category === category.key),
      })),
    [products, categories, lang],
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
              placeholder={t('searchPlaceholder')}
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
            {address?.text || t('setAddress')}
          </span>
          <span className="addr__sub">
            {address?.mode === 'PICKUP' ? t('etaPickup') : t('etaDelivery')}
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
            <h2 className="section-head__title">{t('searchResults')}</h2>
            <span className="section-head__count">{t('itemCount', found.length)}</span>
          </div>

          {found.length === 0 ? (
            <div className="empty">
              <div className="empty__ico">
                <IconSearch />
              </div>
              <div className="empty__title">{t('nothingFound')}</div>
              <div className="empty__text">{t('tryAnother')}</div>
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
              {t('promos')}
            </button>
            <button className="quick__btn" onClick={onGoPromos}>
              <span className="quick__ico quick__ico--b">
                <IconTicket />
              </span>
              {t('promoCodes')}
            </button>
          </div>

          <Banners onBannerClick={onGoPromos} />

          {/* ------------------------ Kategoriyalar ------------------------ */}
          <div className="cats">
            <div className="cats__rail" ref={catsRef}>
              {categories.map((category) => (
                <button
                  key={category.key}
                  className={`cat ${activeCategory === category.key ? 'cat--on' : ''}`}
                  onClick={() => goToCategory(category.key)}
                >
                  <span className="cat__emoji">{categoryEmoji(category.key)}</span>
                  {categoryName(category, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* -------------------------- Bo'limlar -------------------------- */}
          {grouped.map(({ category, title, items }) => (
            <MenuSection
              key={category}
              category={category}
              title={title}
              count={t('dishCount', items.length)}
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
