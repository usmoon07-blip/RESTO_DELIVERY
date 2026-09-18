import { useState } from 'react';
import { haptic } from '../telegram.js';

const SLIDES = [
  {
    emoji: '🫓',
    title: 'Turk oshxonasi — eshigingizgacha',
    text: "Mezelar, salatlar, tandirda pishirilgan pide va pizzalar. Resto Restaurant menyusi endi telefoningizda.",
  },
  {
    emoji: '⚡️',
    title: 'Bu qanday ishlaydi?',
    text: 'Tanlang, buyurtma bering va rohatlaning. Bor-yo\'g\'i uch qadam — va dasturxon tayyor.',
  },
  {
    emoji: '🛵',
    title: '45 daqiqada yetkazamiz',
    text: "150 000 so'mdan yuqori buyurtmalarga yetkazib berish bepul.",
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
    <div className="onboard">
      <div className="onboard__top">
        <div>
          <div className="brand-mark">Resto</div>
          <div className="brand-mark__sub">Restaurant</div>
        </div>
        <button className="onboard__skip" onClick={onFinish}>
          {isLast ? '' : "O'tkazib yuborish"}
        </button>
      </div>

      <div className="onboard__visual">
        <div className="onboard__circle" key={index}>
          {slide.emoji}
        </div>
      </div>

      <div className="onboard__text" key={`t-${index}`}>
        <h1 className="onboard__title">{slide.title}</h1>
        <p className="onboard__sub">{slide.text}</p>
      </div>

      <div className="onboard__dots">
        {SLIDES.map((_, i) => (
          <span key={i} className={i === index ? 'on' : ''} />
        ))}
      </div>

      <button className="btn btn--brand" onClick={next}>
        {isLast ? 'Boshlash' : 'Keyingisi'}
      </button>
    </div>
  );
}
