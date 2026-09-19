import dotenv from 'dotenv';

dotenv.config();

const toBool = (v, fallback = false) =>
  v === undefined ? fallback : String(v).toLowerCase() === 'true';

const toInt = (v, fallback = 0) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};


const publicUrl = (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || '')
  .trim()
  .replace(/\/$/, '');

/**
 * Mini App manzili.
 * Serverda Mini App shu serverning ildizida turadi, shuning uchun serverning
 * o'z manzili olinadi — qo'lda hech narsa kiritish shart emas.
 * WEB_APP_URL faqat haqiqiy https manzil bo'lsa ustunlik qiladi (masalan
 * alohida hostingda turgan bo'lsa).
 */
function pickWebAppUrl() {
  const given = (process.env.WEB_APP_URL || '').trim().replace(/\/$/, '');
  if (/^https:\/\//i.test(given)) return given;
  if (publicUrl) return publicUrl;
  return given || 'http://localhost:5173';
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 5000),

  bot: {
    token: process.env.BOT_TOKEN || '',
    adminIds: (process.env.ADMIN_IDS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    /**
     * Mini App manzili.
     * Serverda Mini App shu serverning ildizida turadi, shuning uchun
     * WEB_APP_URL yozilmagan bo'lsa serverning o'z manzili olinadi —
     * qo'lda hech narsa kiritish shart emas.
     */
    webAppUrl: pickWebAppUrl(),
    // Mini App qaysi portda turadi (tunnel manzilini topish uchun)
    webAppPort: toInt(process.env.WEB_APP_PORT, 5173),
    // Tunnel manzilini avtomatik topish (Cloudflare yoki ngrok).
    // Eski `.env` fayllarida AUTO_NGROK yozilgan — u ham ishlayveradi.
    autoTunnel: toBool(process.env.AUTO_TUNNEL ?? process.env.AUTO_NGROK, true),
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
    restaurantName: process.env.RESTAURANT_NAME || 'Resto Restaurant',
    currency: process.env.CURRENCY || "so'm",
    deliveryFee: toInt(process.env.DELIVERY_FEE, 15000),
    freeDeliveryFrom: toInt(process.env.FREE_DELIVERY_FROM, 150000),
  },

  cors: {
    /**
     * Ishlab chiqarishda faqat o'z saytlarimizga ruxsat beramiz.
     * CORS_ORIGINS="https://a.vercel.app,https://b.vercel.app"
     * Bo'sh bo'lsa (localhost) — hammasiga ruxsat.
     */
    origins: (process.env.CORS_ORIGINS || '')
      .split(',')
      .map((s) => s.trim().replace(/\/$/, ''))
      .filter(Boolean),
  },

  deploy: {
    /**
     * Serverning o'z tashqi manzili. Render uni RENDER_EXTERNAL_URL
     * o'zgaruvchisida o'zi beradi.
     * Shu manzil bo'lsa — bot webhook rejimida ishlaydi (kompyuter kerak emas),
     * bo'lmasa — long polling (localhost uchun).
     */
    publicUrl,
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
