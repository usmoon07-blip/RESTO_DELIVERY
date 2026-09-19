import path from 'node:path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import config, { assertConfig } from './config/default.js';
import { connectDatabase, disconnectDatabase } from './database/connection.js';
import { launchBot, setupWebhook } from './routes/bot.routes.js';
import { getWebAppUrl } from './core/webapp.js';
import { VERSION } from './core/version.js';
import bot from './core/bot.js';
import { UPLOAD_DIR } from './middlewares/upload.middleware.js';
import clientRoutes from './routes/client.routes.js';
import adminRoutes from './routes/admin.routes.js';

assertConfig();

const app = express();

/* ----------------------------- Middleware ----------------------------- */
/**
 * Ishlab chiqarishda faqat ro'yxatdagi saytlarga ruxsat.
 * Ro'yxat bo'sh bo'lsa (localhost) — hammasiga.
 * Telegram Mini App ba'zan Origin yubormaydi, shuning uchun
 * Origin'siz so'rovlar ham o'tkaziladi.
 */
const allowed = config.cors.origins;
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowed.length === 0) return callback(null, true);
      callback(null, allowed.includes(origin.replace(/\/$/, '')));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

/* --------------------------- Yuklangan suratlar --------------------------- */
app.use(
  '/uploads',
  express.static(UPLOAD_DIR, { maxAge: '7d', fallthrough: true }),
);

/* ------------------------------- Routes ------------------------------- */
app.get('/', (req, res) => {
  res.json({
    ok: true,
    name: `${config.business.restaurantName} API`,
    version: '1.0.0',
    endpoints: ['/api/health', '/api/client/*', '/api/admin/*'],
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), env: config.env });
});

app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

/**
 * 404 va xatolar — eng oxirida ro'yxatdan o'tishi kerak, shuning uchun
 * webhook marshrutidan keyin qo'shiladi.
 */
function registerFallbacks() {
  app.use((req, res) => {
    res.status(404).json({ ok: false, error: `Yo'l topilmadi: ${req.originalUrl}` });
  });

  app.use((error, req, res, next) => {
    console.error('❌ Server xatosi:', error);
    res.status(error.status || 500).json({
      ok: false,
      error: config.env === 'development' ? error.message : 'Serverda xatolik yuz berdi',
    });
  });
}

/* ------------------------------ Ishga tushirish ------------------------------ */
async function start() {
  console.log(`\n\ud83c\udf7d  Resto — versiya ${VERSION}\n`);

  await connectDatabase();

  // Serverda (Render) Telegram xabarlarni shu manzilga yuboradi.
  // Localhostda null qaytadi — u holda long polling ishlatiladi.
  let webhook = null;
  try {
    webhook = await setupWebhook();
    if (webhook) app.use(webhook);
  } catch (error) {
    console.error('⚠️  Webhook sozlanmadi:', error.message);
  }

  registerFallbacks();

  app.listen(config.port, () => {
    console.log(`🚀 Server: ${config.deploy.publicUrl || `http://localhost:${config.port}`}`);
  });

  // Bot ishga tushmasa ham API va Admin Panel to'xtab qolmasligi kerak
  let botOk = true;
  try {
    await launchBot({ webhookReady: Boolean(webhook) });
  } catch {
    botOk = false; // sabab launchBot ichida katta blok bilan chiqarildi
  }

  console.log(`📱 Mini App: ${getWebAppUrl()}`);

  // Serverda bu maslahatlar keraksiz (u yerda .bat fayllar yo'q)
  const onServer = Boolean(config.deploy.publicUrl);

  if (!onServer) {
    console.log(`🖥  Admin Panel: http://localhost:5174  (parol: ${config.admin.password})`);
  }

  if (botOk) {
    console.log('\n✅ Hammasi tayyor!\n');
  } else if (onServer) {
    console.log('\n⚠️  API ishlayapti, lekin BOT ISHLAMAYAPTI — yuqoridagi xatolikka qarang.\n');
  } else {
    console.log('\n⚠️  Admin Panel ishlayapti, lekin BOT ISHLAMAYAPTI.');
    console.log('   Yuqoridagi xatolik matniga qarang.');
    console.log('   Batafsil tekshirish uchun: TEKSHIR.bat\n');
  }

  if (!onServer) {
    console.log('   Loyiha papkasidagi yordamchi fayllar:');
    console.log('     ADMIN.bat       — Admin Panelni brauzerda ochadi');
    console.log('     SOZLAMALAR.bat  — bot tokeni / admin parolini almashtiradi');
    console.log('     TEKSHIR.bat     — nima ishlamayotganini tekshiradi');
    console.log('');
  }
}

start().catch((error) => {
  console.error("❌ Ishga tushirishda xatolik:", error);
  process.exit(1);
});

/* ------------------------------ Graceful stop ------------------------------ */
const shutdown = async (signal) => {
  console.log(`\n${signal} — to'xtatilmoqda...`);
  try {
    bot.stop(signal);
  } catch {
    /* ignore */
  }
  await disconnectDatabase();
  process.exit(0);
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
