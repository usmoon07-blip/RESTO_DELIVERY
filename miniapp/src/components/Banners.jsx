import { useRef, useState } from 'react';

const BANNERS = [
  {
    id: 'free',
    tag: 'Yetkazib berish',
    title: 'Bepul yetkazib berish',
    sub: "150 000 so'mdan yuqori buyurtmalarga",
    glyph: '🛵',
    className: 'banner--1',
  },
  {
    id: 'promo',
    tag: 'Promokod',
    title: 'RESTO10 — 10% chegirma',
    sub: 'Savatchada promokodni kiriting',
    glyph: '🎟️',
    className: 'banner--2',
  },
  {
    id: 'tandir',
    tag: 'Yangi',
    title: 'Tandirda pishirilgan pide',
    sub: "An'anaviy retsept, zamonaviy ta'm",
    glyph: '🔥',
    className: 'banner--3',
  },
];

export default function Banners({ onBannerClick }) {
  const [active, setActive] = useState(0);
  const railRef = useRef(null);

  const handleScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const index = Math.round(rail.scrollLeft / (rail.scrollWidth / BANNERS.length));
    setActive(Math.min(BANNERS.length - 1, Math.max(0, index)));
  };

  return (
    <>
      <div className="banners" ref={railRef} onScroll={handleScroll}>
        {BANNERS.map((banner) => (
          <button
            key={banner.id}
            className={`banner ${banner.className}`}
            onClick={() => onBannerClick?.(banner)}
          >
            <span className="banner__glyph">{banner.glyph}</span>
            <span className="banner__tag">{banner.tag}</span>
            <span className="banner__title">{banner.title}</span>
            <span className="banner__sub">{banner.sub}</span>
          </button>
        ))}
      </div>

      <div className="dots">
        {BANNERS.map((banner, i) => (
          <span key={banner.id} className={i === active ? 'on' : ''} />
        ))}
      </div>
    </>
  );
}
