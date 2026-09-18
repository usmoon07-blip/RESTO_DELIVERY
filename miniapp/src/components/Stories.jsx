import { useEffect, useState } from 'react';
import { haptic } from '../telegram.js';

export const STORIES = [
  {
    id: 'promo',
    emoji: '🔥',
    label: 'Chegirma',
    title: '−30% barcha pizzalarga',
    text: 'Faqat shu hafta davomida. Buyurtmangizni hoziroq bering va tejab qoling!',
  },
  {
    id: 'new',
    emoji: '🆕',
    label: 'Yangi',
    title: 'Qazi pizza',
    text: "Milliy ta'm va italyan an'anasi uyg'unligi. Faqat bizda — mualliflik retsept.",
  },
  {
    id: 'fast',
    emoji: '🛵',
    label: '30 daqiqa',
    title: '30 daqiqada yetkazamiz',
    text: "Kechiksak — pizza bizdan sovg'a. Shahar bo'ylab tezkor yetkazib berish.",
  },
  {
    id: 'combo',
    emoji: '🎁',
    label: 'Kombo',
    title: '2 pizza + ichimlik',
    text: "Kombo to'plamlar bilan 25% gacha tejang. Katalogdan tanlang.",
  },
  {
    id: 'quality',
    emoji: '👨‍🍳',
    label: 'Sifat',
    title: 'Har kuni yangi xamir',
    text: "Tandirda pishiriladi, 100% tabiiy masalliqlar. Konservantlarsiz.",
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
  }, [index]);

  return (
    <div className="story-viewer">
      <div className="story-viewer__bars">
        {STORIES.map((s, i) => (
          <div
            key={s.id}
            className={`story-viewer__bar ${
              i === index
                ? 'story-viewer__bar--active'
                : i < index
                  ? 'story-viewer__bar--done'
                  : ''
            }`}
          >
            <span />
          </div>
        ))}
      </div>

      <button className="story-viewer__close" onClick={onClose}>
        ✕
      </button>

      <div className="story-viewer__nav">
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

      <div className="story-viewer__body">
        <div className="story-viewer__emoji">{story.emoji}</div>
        <div className="story-viewer__title">{story.title}</div>
        <div className="story-viewer__text">{story.text}</div>
      </div>
    </div>
  );
}

export default function Stories() {
  const [openIndex, setOpenIndex] = useState(null);
  const [seen, setSeen] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pp_stories_seen') || '[]');
    } catch {
      return [];
    }
  });

  const markSeen = (id) => {
    setSeen((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('pp_stories_seen', JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <>
      <div className="stories">
        {STORIES.map((story, i) => (
          <button
            key={story.id}
            className={`story ${seen.includes(story.id) ? 'story--seen' : ''}`}
            onClick={() => {
              haptic('light');
              setOpenIndex(i);
            }}
          >
            <div className="story__ring">
              <div className="story__inner">{story.emoji}</div>
            </div>
            <div className="story__label">{story.label}</div>
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
