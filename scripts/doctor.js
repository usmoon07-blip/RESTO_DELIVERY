/**
 * `npm run doctor` — ishga tushirishdan oldin hamma narsa joyidami,
 * tekshirib beradi va nima qilish kerakligini aytadi.
 */
import fs from 'node:fs';
import net from 'node:net';
import { PrismaClient } from '@prisma/client';
import config from '../src/config/default.js';
import { detectNgrokUrl, detectTunnelFileUrl } from '../src/core/webapp.js';

const OK = '  ✅';
const NO = '  ❌';
const WARN = '  ⚠️ ';

let problems = 0;

const fail = (msg, hint) => {
  problems += 1;
  console.log(`${NO} ${msg}`);
  if (hint) console.log(`      → ${hint}`);
};

function portBusy(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    socket.setTimeout(700);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

console.log('\n🩺 Resto — tekshiruv\n');

/* ------------------------------ 1. .env ------------------------------ */
console.log('1. Sozlamalar (.env)');
if (!fs.existsSync('.env')) {
  fail(".env fayli yo'q", 'cp .env.example .env — so\'ng ichini to\'ldiring');
} else {
  console.log(`${OK} .env topildi`);

  if (!process.env.DATABASE_URL) {
    fail("DATABASE_URL yo'q", 'Neon connection string ni yozing');
  } else {
    console.log(`${OK} DATABASE_URL bor`);
  }

  if (!config.bot.token) {
    fail("BOT_TOKEN yo'q", 'BotFather bergan tokenni yozing');
  } else {
    console.log(`${OK} BOT_TOKEN bor`);
  }

  if (config.admin.password === 'admin123') {
    console.log(`${WARN} ADMIN_PASSWORD hali "admin123" — o'zgartiring`);
  } else {
    console.log(`${OK} ADMIN_PASSWORD o'zgartirilgan`);
  }

  if (config.auth.allowBrowserDev) {
    console.log(`${WARN} ALLOW_BROWSER_DEV=true — sinov uchun qulay,`);
    console.log("      lekin mijozlarga ochishdan oldin false qiling");
  }
}

/* ------------------------------ 2. Baza ------------------------------ */
console.log("\n2. Ma'lumotlar bazasi");
const prisma = new PrismaClient({ log: [] });
try {
  await prisma.$connect();
  console.log(`${OK} Bazaga ulanildi`);

  const [products, promos, orders] = await Promise.all([
    prisma.product.count(),
    prisma.promoCode.count(),
    prisma.order.count(),
  ]);

  if (products === 0) {
    fail("Bazada mahsulot yo'q", 'npm run db:seed');
  } else {
    console.log(
      `${OK} ${products} ta mahsulot, ${promos} ta promokod, ${orders} ta buyurtma`,
    );
  }
} catch (error) {
  fail(
    `Bazaga ulanib bo'lmadi: ${error.message.split('\n')[0]}`,
    "DATABASE_URL to'g'riligini va internetni tekshiring, so'ng: npm run db:push",
  );
} finally {
  await prisma.$disconnect().catch(() => {});
}

/* ------------------------------ 3. Bot ------------------------------ */
console.log('\n3. Telegram bot');
if (config.bot.token) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.bot.token}/getMe`,
      { signal: AbortSignal.timeout(10000) },
    );

    const raw = await response.text();
    let data = null;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(
        'Telegram javob bermadi (tarmoq yoki proksi to\'sib qo\'ygan bo\'lishi mumkin)',
      );
    }

    if (data.ok) {
      console.log(`${OK} Token ishlayapti — @${data.result.username}`);
    } else {
      fail(
        `Telegram javobi: ${data.description}`,
        'BotFather dan yangi token oling va .env ga yozing',
      );
    }
  } catch (error) {
    fail(
      `Telegram serveriga ulanib bo'lmadi: ${error.message}`,
      'Internet aloqasini tekshiring',
    );
  }
}

/* ----------------------------- 4. Tunnel ----------------------------- */
console.log('\n4. Mini App manzili');
if (/^https:\/\//i.test(config.bot.webAppUrl)) {
  console.log(`${OK} .env da https manzil turibdi: ${config.bot.webAppUrl}`);
} else {
  const tunnel = detectTunnelFileUrl();
  const found = tunnel || (await detectNgrokUrl(config.bot.webAppPort));
  if (found) {
    console.log(`${OK} Tunnel ishlayapti: ${found}`);
    console.log("      Bot uni o'zi topadi — .env ni tahrirlash shart emas");
  } else {
    console.log(`${WARN} Tunnel ishlamayapti`);
    console.log('      → Alohida terminalda: npm run tunnel');
    console.log('      (yoki `npm start` — u tunnelni ham o\'zi ishga tushiradi)');
    console.log('      Busiz bot ishlaydi, lekin Mini App tugmasi chiqmaydi');
  }
}

/* ----------------------------- 5. Portlar ----------------------------- */
console.log('\n5. Portlar');
for (const [port, name] of [
  [config.port, 'Backend'],
  [5173, 'Mini App'],
  [5174, 'Admin'],
]) {
  const busy = await portBusy(port);
  console.log(
    busy
      ? `${WARN} ${port} band (${name} allaqachon ishlayaptimi?)`
      : `${OK} ${port} bo'sh (${name})`,
  );
}

/* ------------------------------ Xulosa ------------------------------ */
console.log(
  problems === 0
    ? '\n✅ Hammasi joyida. Ishga tushirish: npm start\n'
    : `\n❌ ${problems} ta muammo bor — yuqoridagi ko'rsatmalarga amal qiling\n`,
);

process.exit(problems === 0 ? 0 : 1);
