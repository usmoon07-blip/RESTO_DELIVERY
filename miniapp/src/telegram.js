export const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;

/** Mini App ishga tushganda chaqiriladi */
export function initTelegram() {
  if (!tg) return;

  tg.ready();
  tg.expand();

  try {
    tg.setHeaderColor('#ffffff');
    tg.setBackgroundColor('#ffffff');
  } catch {
    /* eski versiyalarda mavjud emas */
  }

  try {
    tg.disableVerticalSwipes?.();
  } catch {
    /* ignore */
  }
}

export const initData = tg?.initData || '';

export const tgUser = tg?.initDataUnsafe?.user || null;

/** Yengil tebranish (haptic feedback) */
export function haptic(type = 'light') {
  try {
    if (type === 'success' || type === 'error' || type === 'warning') {
      tg?.HapticFeedback?.notificationOccurred(type);
    } else {
      tg?.HapticFeedback?.impactOccurred(type);
    }
  } catch {
    /* ignore */
  }
}

export function closeApp() {
  try {
    tg?.close();
  } catch {
    /* ignore */
  }
}

/** Telegramdan telefon raqamni so'rash (Bot API 6.9+) */
export function requestContact() {
  return new Promise((resolve) => {
    if (!tg?.requestContact) return resolve(null);

    try {
      tg.requestContact((granted, result) => {
        if (!granted) return resolve(null);

        const raw =
          result?.responseUnsafe?.contact?.phone_number ||
          result?.response?.contact?.phone_number ||
          null;

        resolve(raw ? (raw.startsWith('+') ? raw : `+${raw}`) : null);
      });
    } catch {
      resolve(null);
    }
  });
}

/** Brauzer orqali joylashuvni aniqlash */
export function getGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Qurilmangiz joylashuvni qo'llab-quvvatlamaydi"));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => reject(new Error("Joylashuvga ruxsat berilmadi. Manzilni qo'lda kiriting.")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  });
}
