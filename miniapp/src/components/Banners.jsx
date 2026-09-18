import { useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { IconFlame, IconScooter, IconTicket } from './Icons.jsx';

const STYLES = [
  { Glyph: IconScooter, className: 'banner--1' },
  { Glyph: IconTicket, className: 'banner--2' },
  { Glyph: IconFlame, className: 'banner--3' },
];

export default function Banners({ onBannerClick }) {
  const { t } = useApp();
  const [active, setActive] = useState(0);
  const railRef = useRef(null);

  const banners = t('banners').map((banner, i) => ({
    ...banner,
    ...STYLES[i],
    id: `banner-${i}`,
  }));

  const handleScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const index = Math.round(rail.scrollLeft / (rail.scrollWidth / banners.length));
    setActive(Math.min(banners.length - 1, Math.max(0, index)));
  };

  return (
    <>
      <div className="banners" ref={railRef} onScroll={handleScroll}>
        {banners.map((banner) => (
          <button
            key={banner.id}
            className={`banner ${banner.className}`}
            onClick={() => onBannerClick?.(banner)}
          >
            <banner.Glyph className="banner__glyph" />
            <span className="banner__tag">{banner.tag}</span>
            <span className="banner__title">{banner.title}</span>
            <span className="banner__sub">{banner.sub}</span>
          </button>
        ))}
      </div>

      <div className="dots">
        {banners.map((banner, i) => (
          <span key={banner.id} className={i === active ? 'on' : ''} />
        ))}
      </div>
    </>
  );
}
