import crypto from 'node:crypto';
import config from '../config/default.js';
import UserModel from '../models/User.js';
import { detectLanguage, t } from '../i18n/index.js';

/**
 * Telegram WebApp initData ni imzo bo'yicha tekshiradi.
 * Hujjat: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyInitData(initData, botToken) {
  if (!initData) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;

  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Timing-safe solishtirish
  const a = Buffer.from(computedHash, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  // Muddati o'tganini tekshirish
  const authDate = Number(params.get('auth_date'));
  if (Number.isFinite(authDate)) {
    const ageSec = Math.floor(Date.now() / 1000) - authDate;
    if (ageSec > config.auth.initDataMaxAgeSec) return null;
  }

  const rawUser = params.get('user');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

/**
 * Mini App so'rovlarini himoyalaydi.
 * Frontend `x-telegram-init-data` sarlavhasida initData yuboradi.
 * ALLOW_BROWSER_DEV=true bo'lsa, oddiy brauzerda test uchun soxta foydalanuvchi beriladi.
 */
export async function telegramAuth(req, res, next) {
  try {
    const initData = req.header('x-telegram-init-data');
    let tgUser = verifyInitData(initData, config.bot.token);

    if (!tgUser && config.auth.allowBrowserDev) {
      tgUser = {
        id: 999000001,
        first_name: 'Dev',
        last_name: 'Tester',
        username: 'dev_tester',
        language_code: 'uz',
      };
      req.isDevUser = true;
    }

    if (!tgUser) {
      const lang = detectLanguage(req.header('x-lang') || req.query.lang);
      return res.status(401).json({ ok: false, error: t(lang, 'errAuth') });
    }

    req.tgUser = tgUser;
    req.user = await UserModel.findOrCreate(tgUser);
    next();
  } catch (error) {
    next(error);
  }
}

/** Admin Panel API himoyasi — `x-admin-password` sarlavhasi orqali */
/**
 * Parolni tanlab ko'rishdan himoya.
 *
 * Admin Panel internetda ochiq turadi, shuning uchun bitta IP'dan
 * ketma-ket noto'g'ri urinishlar cheklanadi. Ro'yxat xotirada turadi —
 * server qayta ishga tushsa tozalanadi, bu yetarli.
 */
const MAX_FAILS = 8;
const BLOCK_MS = 15 * 60 * 1000;
const attempts = new Map(); // ip -> { fails, until }

function clientIp(req) {
  // Render/Vercel orqasida haqiqiy IP shu sarlavhada keladi
  const forwarded = req.header('x-forwarded-for');
  return (forwarded ? forwarded.split(',')[0] : req.ip || '').trim() || 'unknown';
}

/** Vaqti o'tgan yozuvlarni tozalaymiz — xotira o'smasin */
function sweep(now) {
  if (attempts.size < 500) return;
  for (const [ip, row] of attempts) {
    if (row.until < now && row.fails === 0) attempts.delete(ip);
  }
}

/** Parol to'g'ri kelganini vaqtga bog'liq bo'lmagan usulda tekshiramiz */
function samePassword(given, expected) {
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function adminAuth(req, res, next) {
  const ip = clientIp(req);
  const now = Date.now();
  const row = attempts.get(ip) || { fails: 0, until: 0 };

  if (row.until > now) {
    const minutes = Math.ceil((row.until - now) / 60000);
    return res.status(429).json({
      ok: false,
      error: `Juda ko'p urinish. ${minutes} daqiqadan keyin qayta urining.`,
    });
  }

  const password = req.header('x-admin-password');

  if (!password || !samePassword(password, config.admin.password)) {
    row.fails += 1;
    if (row.fails >= MAX_FAILS) {
      row.until = now + BLOCK_MS;
      row.fails = 0;
      console.warn(`⚠️  ${ip} — ko'p marta noto'g'ri parol, 15 daqiqaga bloklandi`);
    }
    attempts.set(ip, row);
    sweep(now);
    return res.status(401).json({ ok: false, error: "Parol noto'g'ri" });
  }

  attempts.delete(ip); // to'g'ri parol — hisob tozalanadi
  next();
}

export default { telegramAuth, adminAuth, verifyInitData };
