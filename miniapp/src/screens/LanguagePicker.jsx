import { useApp } from '../context/AppContext.jsx';
import { LANGS } from '../i18n.js';
import { haptic } from '../telegram.js';
import Logo from '../components/Logo.jsx';
import { IconChevron } from '../components/Icons.jsx';

/**
 * Ilova birinchi marta ochilganda chiqadigan til tanlash ekrani.
 * Matn uchala tilda — chunki bu paytda foydalanuvchi tili hali noma'lum.
 */
export default function LanguagePicker({ onDone }) {
  const { setLang } = useApp();

  const choose = (code) => {
    haptic('light');
    setLang(code);
    onDone();
  };

  return (
    <div className="picker">
      <div className="picker__top">
        <Logo height={76} style={{ color: 'var(--brand)' }} />
      </div>

      <div className="picker__head">
        <div className="picker__title">Tilni tanlang</div>
        <div className="picker__title picker__title--muted">Выберите язык</div>
        <div className="picker__title picker__title--muted">Choose a language</div>
      </div>

      <div className="picker__list">
        {LANGS.map((item) => (
          <button
            key={item.code}
            className="picker__item"
            onClick={() => choose(item.code)}
          >
            <span className="picker__flag">{item.flag}</span>
            <span className="picker__label">{item.label}</span>
            <span className="picker__go">
              <IconChevron />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
