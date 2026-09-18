import { PrismaClient } from '@prisma/client';
import config from '../config/default.js';

/**
 * Prisma klienti — butun loyiha bo'ylab bitta instansiya ishlatiladi.
 * `node --watch` rejimida qayta-qayta ulanib ketmasligi uchun global'da saqlanadi.
 */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: config.env === 'development' ? ['warn', 'error'] : ['error'],
  });

if (config.env === 'development') {
  globalForPrisma.__prisma = prisma;
}

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('🗄️  PostgreSQL (Neon) ga ulanildi');
  } catch (error) {
    console.error("❌ Bazaga ulanib bo'lmadi:", error.message);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export default prisma;
