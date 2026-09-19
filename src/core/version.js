import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Loyiha versiyasi. Terminalda va admin uchun eslatmada ko'rsatiladi —
 * shunda qaysi nusxa ishlayotgani darrov ma'lum bo'ladi.
 */
function read() {
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(fs.readFileSync(path.join(here, '../../package.json'), 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export const VERSION = read();
export default VERSION;
