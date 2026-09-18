import { useEffect, useState } from 'react';
import { haptic } from '../telegram.js';
import { useApp } from '../context/AppContext.jsx';
import { IconClose } from './Icons.jsx';

const EMOJIS = ['✨', '🫓', '🔥', '🎟️', '🛵'];

export function StoryViewer({ stories, startIndex = 0, onClose, onSeen }) {
  const [index, setIndex] = useState(startIndex);
  const story = stories[index];

  useEffect(() => {
    onSeen?.(stories[index].id);
    const timer = setTimeout(() => {
      if (index < stories.length - 1) setIndex((i) => i + 1);
      else onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="sv">
      <div className="sv__bars">
        {stories.map((s, i) => (
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
            index < stories.length - 1 ? setIndex((i) => i + 1) : onClose()
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
  const { t } = useApp();
  const [openIndex, setOpenIndex] = useState(null);

  const stories = t('stories').map((story, i) => ({
    ...story,
    id: `story-${i}`,
    emoji: EMOJIS[i] || '✨',
  }));

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
        {stories.map((story, i) => (
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
          stories={stories}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          onSeen={markSeen}
        />
      )}
    </>
  );
}
