/**
 * Serverni o'zini o'zi uyg'oq ushlashi.
 *
 * Bepul Render 15 daqiqa jimlikdan keyin xizmatni uxlatadi. GitHub'dagi
 * jadvalli turtki ishonchsiz bo'lib chiqdi: 10 daqiqa o'rniga o'rtacha
 * 63 daqiqada, ba'zan 7 soatda bir ishga tushadi — server ko'p vaqt
 * uxlab yotadi.
 *
 * Shuning uchun server o'z tashqi manziliga muntazam so'rov yuboradi.
 * Bu Render uchun oddiy kiruvchi so'rov bo'lib ko'rinadi va uxlash
 * hisoblagichini qayta boshlaydi.
 *
 * Faqat restoran ish vaqtida ishlaydi — bepul rejada oyiga 750 soat
 * chegara bor, sutka bo'yi ushlab tursak chegaraga tegib ketamiz.
 */
import config from '../config/default.js';

const EVERY_MS = 10 * 60 * 1000; // 10 daqiqa — uxlash chegarasi 15 daqiqa

/** Toshkent vaqti UTC+5 */
const TASHKENT_OFFSET_H = 5;

/** Ish vaqti: 09:00 dan 02:00 gacha (kechasi) */
const OPEN_HOUR = 9;
const CLOSE_HOUR = 2;

/** Hozir restoran ish vaqtimi (Toshkent bo'yicha) */
export function isWorkingHours(now = new Date()) {
  const hour = (now.getUTCHours() + TASHKENT_OFFSET_H) % 24;
  // Oraliq yarim tundan o'tadi: 09..23 va 00..01
  return hour >= OPEN_HOUR || hour < CLOSE_HOUR;
}

export function startKeepAwake() {
  const base = config.deploy.publicUrl;

  // Localhostda kerak emas — u yerda hech kim uxlatmaydi.
  // Serverda bu manzilni Render o'zi beradi, localhostda esa bo'sh bo'ladi.
  if (!base) return false;

  const url = `${base}/api/health`;

  const ping = async () => {
    if (!isWorkingHours()) return; // tunda uxlasin, soat tejaladi

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      await fetch(url, { signal: controller.signal, headers: { 'x-keep-awake': '1' } });
      clearTimeout(timer);
    } catch {
      // Tarmoq xatosi muhim emas — keyingi urinishda qayta uriladi
    }
  };

  // Birinchi turtki biroz kechiktiriladi: server endi ko'tarilgan bo'ladi
  setTimeout(ping, 60 * 1000).unref();
  setInterval(ping, EVERY_MS).unref();

  console.log('⏰ Server ish vaqtida o\'zini uyg\'oq ushlaydi (har 10 daqiqada)');
  return true;
}

export default startKeepAwake;
