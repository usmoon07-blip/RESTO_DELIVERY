import path from 'node:path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import config, { assertConfig } from './config/default.js';
import { connectDatabase, disconnectDatabase } from './database/connection.js';
import { launchBot } from './routes/bot.routes.js';
import { getWebAppUrl } from './core/webapp.js';
import { VERSION } from './core/version.js';
import bot from './core/bot.js';
import { UPLOAD_DIR } from './middlewares/upload.middleware.js';
import clientRoutes from './routes/client.routes.js';
import adminRoutes from './routes/admin.routes.js';

assertConfig();

const app = express();

/* ----------------------------- Middleware ----------------------------- */
app.use(cors({ origin: config.cors.origins, credentials: true }));
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

/* --------------------------- 404 va xatolar --------------------------- */
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

/* ------------------------------ Ishga tushirish ------------------------------ */
async function start() {
  console.log(`\n\ud83c\udf7d  Resto — versiya ${VERSION}\n`);

  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`🚀 Server: http://localhost:${config.port}`);
  });

  // Bot ishga tushmasa ham API to'xtab qolmasligi kerak
  try {
    await launchBot();
  } catch (error) {
    console.error('⚠️  Bot ishga tushmadi:', error.message);
    console.error('   BOT_TOKEN to\'g\'riligini va internet aloqasini tekshiring.');
  }

  console.log(`📱 Mini App: ${getWebAppUrl()}`);
  console.log('\n✅ Hammasi tayyor!\n');
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
