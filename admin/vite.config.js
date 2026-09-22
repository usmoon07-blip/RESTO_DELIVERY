import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  /**
   * Admin Panel ikki joyda turishi mumkin:
   *   Render'da  -> https://.../admin   (shuning uchun base=/admin/)
   *   Vercel'da  -> ildizda             (base=/)
   * Vercel qurilish paytida VERCEL o'zgaruvchisini o'zi qo'yadi,
   * shuning uchun qo'lda hech narsa sozlash kerak emas.
   * Dev serverda (localhost:5174) ham ildizda.
   */
  base: process.env.VERCEL ? '/' : command === 'build' ? '/admin/' : '/',

  plugins: [react()],
  server: {
    port: 5174,
    // Port band bo'lsa jimgina boshqasiga o'tib ketmasin — xatolik
    // ko'rinib tursin
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
}));
