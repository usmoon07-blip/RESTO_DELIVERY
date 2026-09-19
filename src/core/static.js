/**
 * Serverda Mini App va Admin Panelni shu serverning o'zidan tarqatamiz.
 *
 *   /        -> Mini App   (miniapp/dist)
 *   /admin   -> Admin Panel (admin/dist)
 *
 * Shunda alohida hosting (Vercel) ham, CORS ham kerak bo'lmaydi:
 * sayt ham, API ham bitta manzilda turadi.
 *
 * Localhostda dist papkalari bo'lmaydi — u holda hech narsa qilinmaydi,
 * Vite dev serverlari avvalgidek ishlayveradi.
 */
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';

const ROOT = process.cwd();

/** Bular API yo'llari — SPA sahifasi bilan almashtirilmasligi kerak */
const API_PREFIXES = ['/api', '/uploads', '/telegram'];

const isApiPath = (url) => API_PREFIXES.some((p) => url === p || url.startsWith(`${p}/`));

function distOf(app) {
  const dir = path.join(ROOT, app, 'dist');
  return fs.existsSync(path.join(dir, 'index.html')) ? dir : null;
}

/**
 * @returns {string[]} ulangan ilovalar nomi (log uchun)
 */
export function serveFrontends(app) {
  const served = [];

  // --- Admin Panel: /admin ---
  const adminDist = distOf('admin');
  if (adminDist) {
    // redirect: false — /admin manzili /admin/ ga qayta yo'naltirilmasin
    app.use('/admin', express.static(adminDist, { index: false, redirect: false, maxAge: '1h' }));
    app.get('/admin', (req, res) => res.sendFile(path.join(adminDist, 'index.html')));
    app.get('/admin/*', (req, res) => res.sendFile(path.join(adminDist, 'index.html')));
    served.push('/admin');
  }

  // --- Mini App: ildiz ---
  const miniDist = distOf('miniapp');
  if (miniDist) {
    app.use(express.static(miniDist, { index: false, maxAge: '1h' }));

    // SPA: qolgan barcha sahifalar index.html ga tushadi.
    // API yo'llari bundan mustasno — ular 404 JSON qaytarishi kerak.
    app.get('*', (req, res, next) => {
      if (isApiPath(req.path)) return next();
      res.sendFile(path.join(miniDist, 'index.html'));
    });
    served.push('/');
  }

  return served;
}

export default serveFrontends;
