/**
 * Mini App uchun HTTPS tunnel — Cloudflare orqali.
 *
 * ngrok'dan farqi: ro'yxatdan o'tish, token va hech qanday sozlash kerak emas.
 * Dastur cloudflared dasturchasini o'zi yuklab oladi (bir marta) va ishga
 * tushiradi, tunnel manzilini .tunnel-url fayliga yozadi.
 * Backend o'sha fayldan manzilni o'qib, Telegram tugmasini yangilaydi.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { pipeline } from 'node:stream/promises';

const PORT = Number(process.env.WEB_APP_PORT || 5173);
const ROOT = process.cwd();
const URL_FILE = path.join(ROOT, '.tunnel-url');
const URL_RE = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/i;

/** Shu operatsion tizim uchun cloudflared fayli */
function binaryInfo() {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'win32') {
    const file = arch === 'ia32' ? 'cloudflared-windows-386.exe' : 'cloudflared-windows-amd64.exe';
    return { name: 'cloudflared.exe', asset: file };
  }

  if (platform === 'linux') {
    const map = { x64: 'amd64', arm64: 'arm64', arm: 'arm' };
    return { name: 'cloudflared', asset: `cloudflared-linux-${map[arch] || 'amd64'}` };
  }

  if (platform === 'darwin') {
    return { name: 'cloudflared', asset: null }; // macOS: brew install cloudflared
  }

  return { name: 'cloudflared', asset: null };
}

function clearUrlFile() {
  try {
    fs.unlinkSync(URL_FILE);
  } catch {
    /* fayl yo'q bo'lsa muammo emas */
  }
}

async function ensureBinary() {
  const { name, asset } = binaryInfo();
  const target = path.join(ROOT, name);

  if (fs.existsSync(target)) return target;

  if (!asset) {
    console.log("[TUNNEL] Bu tizim uchun avtomatik yuklash yo'q.");
    console.log('[TUNNEL] macOS: brew install cloudflared');
    return null;
  }

  const url = `https://github.com/cloudflare/cloudflared/releases/latest/download/${asset}`;
  console.log('[TUNNEL] Tunnel dasturi yuklanmoqda (bir marta, ~40 MB)...');

  const tmp = `${target}.part`;
  try {
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    await pipeline(response.body, fs.createWriteStream(tmp));
    fs.renameSync(tmp, target);
    if (os.platform() !== 'win32') fs.chmodSync(target, 0o755);

    console.log('[TUNNEL] Yuklandi.');
    return target;
  } catch (error) {
    try {
      fs.unlinkSync(tmp); // yarim yuklangan fayl qolib ketmasin
    } catch {
      /* ignore */
    }
    console.log(`[TUNNEL] Yuklab bo'lmadi: ${error.message}`);
    console.log("[TUNNEL] Internetni tekshiring yoki keyinroq qayta urinib ko'ring.");
    return null;
  }
}

let child = null;
let attempt = 0;

function start(binary) {
  child = spawn(
    binary,
    ['tunnel', '--url', `http://localhost:${PORT}`, '--no-autoupdate'],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );

  let announced = false;
  const recent = []; // manzil topilmasa, sababini ko'rsatish uchun

  const scan = (chunk) => {
    const text = chunk.toString();

    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      recent.push(line.trim());
      if (recent.length > 6) recent.shift();
    }

    const match = text.match(URL_RE);
    if (!match || announced) return;

    announced = true;
    attempt = 0; // muvaffaqiyat — hisobni nolga qaytaramiz
    fs.writeFileSync(URL_FILE, match[0], 'utf8');
    console.log('');
    console.log('[TUNNEL] ============================================');
    console.log(`[TUNNEL]  Mini App manzili: ${match[0]}`);
    console.log("[TUNNEL]  Bot uni 20 soniya ichida o'zi topadi.");
    console.log('[TUNNEL] ============================================');
    console.log('');
  };

  child.stdout.on('data', scan);
  child.stderr.on('data', scan);

  child.on('error', (error) => {
    console.log(`[TUNNEL] Ishga tushmadi: ${error.message}`);
  });

  child.on('exit', (code) => {
    child = null;
    clearUrlFile();

    // Manzil topilmagan bo'lsa — sababi cloudflared chiqargan matnda
    if (!announced) {
      for (const line of recent) console.log(`[TUNNEL] ${line}`);
    }

    attempt += 1;
    const delay = Math.min(5000 * attempt, 60000);
    console.log(
      `[TUNNEL] To'xtadi (kod ${code}). ${Math.round(delay / 1000)} soniyadan keyin qayta urinilmoqda...`,
    );
    setTimeout(() => start(binary), delay);
  });
}

function stop() {
  try {
    if (child) child.kill();
  } catch {
    /* ignore */
  }
  clearUrlFile();
  process.exit(0);
}

// Signal tinglovchilari bir marta — har qayta urinishda emas
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

clearUrlFile(); // eski manzil qolib ketmasin

const binary = await ensureBinary();
if (binary) {
  console.log('[TUNNEL] Ishga tushmoqda...');
  start(binary);
} else {
  console.log("[TUNNEL] Tunnel ishga tushmadi — bot tugmasiz ishlayveradi.");
}
