import { useEffect, useState } from 'react';
import { haptic } from '../telegram.js';
import { IconClose } from './Icons.jsx';

export const STORIES = [
  {
    id: 'welcome',
    emoji: '✨',
    label: 'Resto haqida',
    title: 'Resto Restaurant',
    text: "Turk va zamonaviy oshxona. Mezelardan tandirda pishirilgan pidegacha — hammasi bir joyda.",
  },
  {
    id: 'meze',
    emoji: '🫓',
    label: 'Mezelar',
    title: "Mezelar — 39 000 so'm",
    text: 'Acili Ezme, Haydari, Humus, Haravat. Stolingizni haqiqiy turk taomlari bilan boshlang.',
  },
  {
    id: 'tandir',
    emoji: '🔥',
    label: 'Tandir',
    title: 'Tandirda pishiriladi',
    text: "Pide va pizzalar an'anaviy tandirda pishiriladi — shuning uchun ta'mi boshqacha.",
  },
  {
    id: 'promo',
    emoji: '🎟️',
    label: 'Promokod',
    title: 'RESTO10',
    text: "150 000 so'mdan yuqori buyurtmalarga 10% chegirma. Savatchada promokodni kiriting.",
  },
  {
    id: 'delivery',
    emoji: '🛵',
    label: 'Yetkazish',
    title: '45 daqiqada yetkazamiz',
    text: "150 000 so'mdan yuqori buyurtmalarga yetkazib berish bepul.",
  },
];

export function StoryViewer({ startIndex = 0, onClose, onSeen }) {
  const [index, setIndex] = useState(startIndex);
  const story = STORIES[index];

  useEffect(() => {
    onSeen?.(STORIES[index].id);
    const timer = setTimeout(() => {
      if (index < STORIES.length - 1) setIndex((i) => i + 1);
      else onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="sv">
      <div className="sv__bars">
        {STORIES.map((s, i) => (
          <div
            key={s.id}
            className={`sv__bar ${
              i === index ? 'sv__bar--active' : i < index ? 'sv__bar--done' : ''
            }`}
          >
            <span />
          </div>
        ))}
      </div>

      <button className="sv__close" onClick={onClose}>
        <IconClose />
      </button>

      <div className="sv__nav">
        <button
          onClick={() => (index > 0 ? setIndex((i) => i - 1) : onClose())}
          aria-label="Orqaga"
        />
        <button
          onClick={() =>
            index < STORIES.length - 1 ? setIndex((i) => i + 1) : onClose()
          }
          aria-label="Oldinga"
        />
      </div>

      <div className="sv__body">
        <div className="sv__emoji">{story.emoji}</div>
        <div className="sv__title">{story.title}</div>
        <div className="sv__text">{story.text}</div>
      </div>
    </div>
  );
}

export default function Stories() {
  const [openIndex, setOpenIndex] = useState(null);
  const [seen, setSeen] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resto_stories_seen') || '[]');
    } catch {
      return [];
    }
  });

  const markSeen = (id) =>
    setSeen((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('resto_stories_seen', JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  return (
    <>
      <div className="rail">
        {STORIES.map((story, i) => (
          <button
            key={story.id}
            className={`story ${seen.includes(story.id) ? 'story--seen' : ''}`}
            onClick={() => {
              haptic('light');
              setOpenIndex(i);
            }}
          >
            <div className="story__in">
              <span className="story__emoji">{story.emoji}</span>
              <span className="story__label">{story.label}</span>
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <StoryViewer
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          onSeen={markSeen}
        />
      )}
    </>
  );
}
