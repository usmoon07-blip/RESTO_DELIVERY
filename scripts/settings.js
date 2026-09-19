/**
 * Sozlamalarni terminal orqali almashtirish — `.env` ni qo'lda
 * tahrirlamasdan. SOZLAMALAR.bat shu faylni chaqiradi.
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ENV_FILE = path.join(process.cwd(), '.env');
const TOKEN_RE = /^\d{6,}:[A-Za-z0-9_-]{30,}$/;

function readEnv() {
  try {
    return fs.readFileSync(ENV_FILE, 'utf8');
  } catch {
    console.log('\n.env fayli topilmadi. Avval RESTO.bat ni bir marta ishga tushiring.\n');
    process.exit(1);
  }
}

/** Bitta kalitni almashtiradi, bo'lmasa oxiriga qo'shadi */
function setKey(text, key, value) {
  const line = `${key}="${value}"`;
  const re = new RegExp(`^${key}=.*$`, 'm');

  if (re.test(text)) return text.replace(re, line);
  return `${text.replace(/\s*$/, '')}\n${line}\n`;
}

function save(text) {
  fs.copyFileSync(ENV_FILE, `${ENV_FILE}.backup`); // eskisi saqlanib qolsin
  fs.writeFileSync(ENV_FILE, text, 'utf8');
}

/** Token haqiqiyligini Telegramdan tekshiramiz */
async function checkToken(token) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    return data.ok ? data.result : null;
  } catch {
    return null; // internet yo'q — token formati to'g'ri bo'lsa yetarli
  }
}

async function changeToken(rl) {
  console.log('\nYangi bot tokenini @BotFather dan oling va shu yerga joylang.');
  console.log('Ko\'rinishi: 1234567890:AAaBbCc...\n');

  const token = (await rl.question('Yangi token: ')).trim();

  if (!TOKEN_RE.test(token)) {
    console.log('\nBu tokenga o\'xshamaydi. Hech narsa o\'zgartirilmadi.\n');
    return;
  }

  console.log('\nTekshirilmoqda...');
  const me = await checkToken(token);

  if (me) {
    console.log(`Bot topildi: @${me.username} (${me.first_name})`);
    const yes = (await rl.question('Shu botga almashtiramizmi? (ha/yoq): ')).trim().toLowerCase();
    if (yes !== 'ha' && yes !== 'ha.' && yes !== 'y') {
      console.log('\nBekor qilindi.\n');
      return;
    }
  } else {
    console.log('Telegramdan tasdiqlab bo\'lmadi (internet yoki token muammosi).');
    const yes = (await rl.question('Baribir saqlaymizmi? (ha/yoq): ')).trim().toLowerCase();
    if (yes !== 'ha' && yes !== 'y') {
      console.log('\nBekor qilindi.\n');
      return;
    }
  }

  save(setKey(readEnv(), 'BOT_TOKEN', token));
  console.log('\nSaqlandi. Endi RESTO.bat ni qayta ishga tushiring.\n');
}

async function changePassword(rl) {
  console.log('\nAdmin Panelga kirish parolini o\'zgartiramiz.\n');

  const pass = (await rl.question('Yangi parol: ')).trim();

  if (pass.length < 4) {
    console.log('\nParol juda qisqa (kamida 4 belgi). Hech narsa o\'zgartirilmadi.\n');
    return;
  }
  if (/["\r\n]/.test(pass)) {
    console.log('\nParolda qo\'shtirnoq bo\'lmasin. Hech narsa o\'zgartirilmadi.\n');
    return;
  }

  save(setKey(readEnv(), 'ADMIN_PASSWORD', pass));
  console.log('\nSaqlandi. Endi RESTO.bat ni qayta ishga tushiring.\n');
}

const rl = readline.createInterface({ input, output });

console.log('');
console.log('==========================================');
console.log('   RESTO - Sozlamalar');
console.log('==========================================');
console.log('');
console.log('  1 - Bot tokenini almashtirish');
console.log('  2 - Admin Panel parolini almashtirish');
console.log('  0 - Chiqish');
console.log('');

const choice = (await rl.question('Tanlang (1, 2 yoki 0): ')).trim();

if (choice === '1') await changeToken(rl);
else if (choice === '2') await changePassword(rl);
else console.log('\nChiqildi.\n');

rl.close();
