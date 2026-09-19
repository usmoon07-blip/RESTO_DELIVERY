/**
 * Eski nusxa ishlab turganda portlar band bo'lib qoladi va loyiha
 * ishga tushmaydi (yoki Vite boshqa portga o'tib ketadi — bunda tunnel
 * noto'g'ri portga qaraydi).
 *
 * Shuning uchun `npm start` dan oldin shu portlarni tinglab turgan
 * jarayonlar to'xtatiladi. Faqat LISTEN holatidagi, aniq shu portlar —
 * boshqa dasturlarga tegilmaydi.
 */
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const PORTS = [
  Number(process.env.PORT || 5000),
  Number(process.env.WEB_APP_PORT || 5173),
  5174,
];

const run = (cmd, args) => {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return ''; // buyruq topilmasa yoki natija bo'sh bo'lsa
  }
};

/** Shu portni LISTEN qilib turgan jarayon raqamlari */
function pidsOnPort(port) {
  const pids = new Set();

  if (os.platform() === 'win32') {
    for (const line of run('netstat', ['-ano', '-p', 'TCP']).split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 5) continue;

      const [, local, , state, pid] = parts;
      if (state !== 'LISTENING') continue;
      // "0.0.0.0:5173" yoki "[::]:5173" — oxiridagi port aynan mos kelsin
      if (local.slice(local.lastIndexOf(':') + 1) !== String(port)) continue;

      if (/^\d+$/.test(pid) && pid !== '0') pids.add(pid);
    }
    return [...pids];
  }

  for (const pid of run('lsof', ['-ti', `tcp:${port}`, '-sTCP:LISTEN']).split(/\s+/)) {
    if (/^\d+$/.test(pid)) pids.add(pid);
  }
  return [...pids];
}

function kill(pid) {
  if (String(pid) === String(process.pid)) return false;

  try {
    if (os.platform() === 'win32') {
      execFileSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      process.kill(Number(pid), 'SIGKILL');
    }
    return true;
  } catch {
    return false;
  }
}

let freed = 0;
for (const port of PORTS) {
  for (const pid of pidsOnPort(port)) {
    if (kill(pid)) {
      console.log(`[PORT] ${port}-port bo'shatildi (eski jarayon ${pid} to'xtatildi)`);
      freed += 1;
    } else {
      console.log(`[PORT] ${port}-port band, lekin to'xtatib bo'lmadi (jarayon ${pid}).`);
      console.log('[PORT] Barcha qora oynalarni yoping va qaytadan urinib ko\'ring.');
    }
  }
}

if (freed) console.log(`[PORT] ${freed} ta eski jarayon to'xtatildi.\n`);
