import { useApp } from '../context/AppContext.jsx';
import { haptic } from '../telegram.js';
import {
  IconBag,
  IconDish,
  IconReceipt,
  IconSpark,
  IconUser,
} from './Icons.jsx';

const ITEMS = [
  { key: 'menu', Icon: IconDish, label: 'navMenu' },
  { key: 'orders', Icon: IconReceipt, label: 'orders' },
  { key: 'cart', Icon: IconBag, label: 'cart' },
  { key: 'promos', Icon: IconSpark, label: 'promos' },
  { key: 'profile', Icon: IconUser, label: 'profile' },
];

export default function BottomNav({ tab, onChange }) {
  const { cartCount, t } = useApp();

  return (
    <nav className="nav">
      {ITEMS.map(({ key, Icon, label }) => (
        <button
          key={key}
          className={`nav__item ${tab === key ? 'nav__item--on' : ''}`}
          onClick={() => {
            haptic('light');
            onChange(key);
          }}
        >
          <Icon />
          <span className="nav__label">{t(label)}</span>
          {key === 'cart' && cartCount > 0 && (
            <span className="nav__dot">{cartCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
