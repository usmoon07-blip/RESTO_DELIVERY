import dotenv from 'dotenv';

dotenv.config();

const toBool = (v, fallback = false) =>
  v === undefined ? fallback : String(v).toLowerCase() === 'true';

const toInt = (v, fallback = 0) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 5000),

  bot: {
    token: process.env.BOT_TOKEN || '',
    adminIds: (process.env.ADMIN_IDS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    webAppUrl: process.env.WEB_APP_URL || 'http://localhost:5173',
  },

  admin: {
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },

  auth: {
    // Telegram tashqarisida (oddiy brauzerda) test qilishga ruxsat
    allowBrowserDev: toBool(process.env.ALLOW_BROWSER_DEV, false),
    // initData amal qilish muddati (soniyada) — 24 soat
    initDataMaxAgeSec: 86400,
  },

  business: {
    restaurantName: process.env.RESTAURANT_NAME || 'Resto',
    currency: process.env.CURRENCY || "so'm",
    deliveryFee: toInt(process.env.DELIVERY_FEE, 15000),
    freeDeliveryFrom: toInt(process.env.FREE_DELIVERY_FROM, 150000),
  },

  cors: {
    // Localhostdagi Mini App va Admin Panel portlari
    origins: true,
  },
};

export function assertConfig() {
  const missing = [];
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
  if (!config.bot.token) missing.push('BOT_TOKEN');

  if (missing.length) {
    console.error(`\n❌ .env faylida quyidagilar yo'q: ${missing.join(', ')}\n`);
    process.exit(1);
  }
}

export default config;
