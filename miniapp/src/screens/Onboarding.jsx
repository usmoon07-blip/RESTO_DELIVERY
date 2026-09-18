import { useState } from 'react';
import { haptic } from '../telegram.js';

const SLIDES = [
  {
    emoji: '🍕',
    title: 'Sizni ochlik qiynayaptimi?',
    text: 'Biz issiqqina pizzalarni tezkor yetkazamiz. Tandirdan to\'g\'ri sizning eshigingizgacha.',
  },
  {
    emoji: '⚡️',
    title: 'Bu qanday ishlaydi?',
    text: 'Tanlang, buyurtma bering va rohatlaning. Bor-yo\'g\'i uch qadam — va dasturxon tayyor.',
  },
  {
    emoji: '❤️',
    title: '10,000+ odam allaqachon biz bilan',
    text: 'Har kuni minglab mijozlar bizni tanlaydi. Endi navbat sizniki!',
  },
];

export default function Onboarding({ onFinish }) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  const next = () => {
    haptic('light');
    if (isLast) onFinish();
    else setIndex((i) => i + 1);
  };

  return (
    <div className="onboarding">
      <button className="onboarding__skip" onClick={onFinish}>
        {isLast ? '' : "O'tkazib yuborish"}
      </button>

      <div className="onboarding__visual">
        <div className="onboarding__circle" key={index}>
          {slide.emoji}
        </div>
      </div>

      <div className="onboarding__text" key={`t-${index}`}>
        <h1 className="onboarding__title">{slide.title}</h1>
        <p className="onboarding__sub">{slide.text}</p>
      </div>

      <div className="onboarding__dots">
        {SLIDES.map((_, i) => (
          <span key={i} className={`dot ${i === index ? 'dot--active' : ''}`} />
        ))}
      </div>

      <button className="btn btn--dark" onClick={next}>
        {isLast ? 'Boshla' : 'Keyingisi'}
      </button>
    </div>
  );
}
