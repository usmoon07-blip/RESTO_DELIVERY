import crypto from 'node:crypto';
import config from '../config/default.js';
import UserModel from '../models/User.js';

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
      return res
        .status(401)
        .json({ ok: false, error: "Avtorizatsiya xatosi. Ilovani Telegram orqali oching." });
    }

    req.tgUser = tgUser;
    req.user = await UserModel.findOrCreate(tgUser);
    next();
  } catch (error) {
    next(error);
  }
}

/** Admin Panel API himoyasi — `x-admin-password` sarlavhasi orqali */
export function adminAuth(req, res, next) {
  const password = req.header('x-admin-password');

  if (!password || password !== config.admin.password) {
    return res.status(401).json({ ok: false, error: "Parol noto'g'ri" });
  }

  next();
}

export default { telegramAuth, adminAuth, verifyInitData };
