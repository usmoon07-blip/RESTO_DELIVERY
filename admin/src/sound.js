/**
 * Yangi buyurtma signali — tashqi audio fayl kerak emas,
 * tovush brauzerning o'zida (Web Audio API) hosil qilinadi.
 */
let audioCtx = null;

/** Brauzer qoidasiga ko'ra tovush faqat foydalanuvchi bosgandan keyin ishlaydi */
export function enableSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;

    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    return true;
  } catch {
    return false;
  }
}

export function isSoundEnabled() {
  return Boolean(audioCtx && audioCtx.state === 'running');
}

/** "Ding-ding-ding" signali */
export function playNewOrderSound() {
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  [0, 0.28, 0.56].forEach((offset, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(index === 2 ? 1180 : 880, now + offset);

    gain.gain.setValueAtTime(0, now + offset);
    gain.gain.linearRampToValueAtTime(0.35, now + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + offset);
    osc.stop(now + offset + 0.24);
  });
}
