/**
 * Mini App uchun menyu nusxasi.
 *
 * Bepul serverda xizmat 15 daqiqa jimlikdan keyin uxlaydi va keyingi
 * mijoz menyuni ko'rish uchun 30-60 soniya kutadi — bu xaridni yo'qotadi.
 *
 * Shuning uchun menyuning nusxasi Mini App bilan birga yuklanadi:
 * ilova ochilishi bilanoq taomlar ko'rinadi, server javob bergach
 * ma'lumot jimgina yangilanadi.
 *
 * Nusxa tayyorlanmasa ham qurilish to'xtamaydi — shunchaki bo'sh
 * nusxa yoziladi va ilova avvalgidek serverni kutadi.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const OUT = path.join(ROOT, 'miniapp', 'src', 'data', 'menu-snapshot.json');

async function build() {
  const { MENU } = await import(path.join(ROOT, 'prisma', 'menu.js'));
  const { toProduct } = await import(path.join(ROOT, 'prisma', 'to-product.js'));

  const products = MENU.map((item, index) => ({
    // Raqam bazadagi tartib bilan bir xil bo'ladi (seed shu tartibda yozadi).
    // Baribir mos kelmay qolsa, server buyurtmani nom bo'yicha tekshiradi
    // va noto'g'ri taom o'tib ketmaydi.
    id: index + 1,
    ...toProduct(item, index),
  }));

  const seen = new Set();
  const categories = [];
  for (const p of products) {
    if (seen.has(p.category)) continue;
    seen.add(p.category);
    categories.push({
      key: p.category,
      ru: p.category,
      uz: p.categoryUz || p.category,
      en: p.categoryEn || p.category,
    });
  }

  return { products, categories, builtAt: new Date().toISOString() };
}

let snapshot = { products: [], categories: [], builtAt: null };

try {
  snapshot = await build();
  console.log(
    `[MENYU] Nusxa tayyor: ${snapshot.products.length} taom, ${snapshot.categories.length} kategoriya`,
  );
} catch (error) {
  console.log(`[MENYU] Nusxa tayyorlanmadi (${error.message}) — bo'sh nusxa yoziladi`);
}

try {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(snapshot), 'utf8');
} catch (error) {
  // Yozib bo'lmasa ham qurilish to'xtamaydi — omborda saqlangan
  // eski nusxa ishlatiladi.
  console.log(`[MENYU] Yozib bo'lmadi (${error.message}) — eski nusxa qoladi`);
}
