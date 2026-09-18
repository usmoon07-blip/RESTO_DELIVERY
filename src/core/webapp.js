import config from '../config/default.js';

/**
 * Mini App manzili ishlash vaqtida o'zgarishi mumkin (ngrok qayta ishga
 * tushganda manzil almashadi), shuning uchun u shu yerda saqlanadi.
 */
let current = config.bot.webAppUrl;

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
 * ngrok o'zining lokal API'sini 4040-portda ochadi.
 * Shu orqali tunnel manzilini avtomatik topamiz — `.env` ni qo'lda
 * tahrirlash shart emas.
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

export default { getWebAppUrl, setWebAppUrl, detectNgrokUrl, isHttps };
