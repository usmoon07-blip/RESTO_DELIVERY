import fs from 'node:fs';
import path from 'node:path';
import config from '../config/default.js';

/**
 * Mini App manzili ishlash vaqtida o'zgarishi mumkin (tunnel qayta ishga
 * tushganda manzil almashadi), shuning uchun u shu yerda saqlanadi.
 */
let current = config.bot.webAppUrl;

/** Cloudflare tunneli manzilini shu faylga yozadi (scripts/tunnel.js) */
const TUNNEL_FILE = path.join(process.cwd(), '.tunnel-url');

export const isHttps = (url) => /^https:\/\//i.test(url || '');

export function getWebAppUrl() {
  return current;
}

export function setWebAppUrl(url) {
  const changed = current !== url;
  current = url;
  return changed;
}

/**
 * Cloudflare tunneli `.tunnel-url` fayliga manzilni yozadi.
 * Hech qanday ro'yxatdan o'tish va token kerak emas.
 */
export function detectTunnelFileUrl() {
  try {
    const url = fs.readFileSync(TUNNEL_FILE, 'utf8').trim();
    return isHttps(url) ? url : null;
  } catch {
    return null; // tunnel hali ishga tushmagan — muammo emas
  }
}

/**
 * ngrok o'zining lokal API'sini 4040-portda ochadi.
 * Kimda ngrok bo'lsa, u ham avtomatik ishlaydi.
 */
export async function detectNgrokUrl(targetPort) {
  const endpoints = [
    'http://127.0.0.1:4040/api/tunnels',
    'http://127.0.0.1:4041/api/tunnels',
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1500);

      const response = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timer);
      if (!response.ok) continue;

      const { tunnels = [] } = await response.json();

      // Mini App portiga qaragan https tunnelni izlaymiz
      const match =
        tunnels.find(
          (t) =>
            isHttps(t.public_url) &&
            String(t.config?.addr || '').endsWith(`:${targetPort}`),
        ) || tunnels.find((t) => isHttps(t.public_url));

      if (match) return match.public_url;
    } catch {
      /* ngrok ishlamayapti — muammo emas */
    }
  }

  return null;
}

/**
 * Mini App uchun tashqi https manzilni topadi:
 * avval Cloudflare tunneli, keyin ngrok.
 */
export async function detectPublicUrl(targetPort) {
  return detectTunnelFileUrl() || (await detectNgrokUrl(targetPort));
}

export default {
  getWebAppUrl,
  setWebAppUrl,
  detectTunnelFileUrl,
  detectNgrokUrl,
  detectPublicUrl,
  isHttps,
};
