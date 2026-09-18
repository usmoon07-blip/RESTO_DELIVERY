import { useApp } from '../context/AppContext.jsx';
import { haptic } from '../telegram.js';

const ITEMS = [
  { key: 'home', icon: '🏠', label: 'Bosh sahifa' },
  { key: 'catalog', icon: '🔍', label: 'Katalog' },
  { key: 'cart', icon: '🛒', label: 'Savatcha' },
  { key: 'profile', icon: '👤', label: 'Profil' },
];

export default function BottomNav({ tab, onChange }) {
  const { cartCount } = useApp();

  return (
    <nav className="nav">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          className={`nav__item ${tab === item.key ? 'nav__item--active' : ''}`}
          onClick={() => {
            haptic('light');
            onChange(item.key);
          }}
        >
          <span className="nav__icon">{item.icon}</span>
          <span className="nav__label">{item.label}</span>
          {item.key === 'cart' && cartCount > 0 && (
            <span className="nav__dot">{cartCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
