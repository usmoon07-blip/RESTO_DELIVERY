import { useState } from 'react';
import { haptic } from '../telegram.js';
import { useApp } from '../context/AppContext.jsx';

const EMOJIS = ['🫓', '⚡️', '🛵'];

export default function Onboarding({ onFinish }) {
  const { t } = useApp();
  const [index, setIndex] = useState(0);
  const slides = t('onboard');
  const isLast = index === slides.length - 1;
  const slide = slides[index];

  const next = () => {
    haptic('light');
    if (isLast) onFinish();
    else setIndex((i) => i + 1);
  };

  return (
    <div className="onboard">
      <div className="onboard__top">
        <div>
          <div className="brand-mark">Resto</div>
          <div className="brand-mark__sub">Restaurant</div>
        </div>
        <button className="onboard__skip" onClick={onFinish}>
          {isLast ? '' : t('skip')}
        </button>
      </div>

      <div className="onboard__visual">
        <div className="onboard__circle" key={index}>
          {EMOJIS[index]}
        </div>
      </div>

      <div className="onboard__text" key={`t-${index}`}>
        <h1 className="onboard__title">{slide.title}</h1>
        <p className="onboard__sub">{slide.text}</p>
      </div>

      <div className="onboard__dots">
        {slides.map((_, i) => (
          <span key={i} className={i === index ? 'on' : ''} />
        ))}
      </div>

      <button className="btn btn--brand" onClick={next}>
        {isLast ? t('start') : t('next')}
      </button>
    </div>
  );
}
