import { PrismaClient } from '@prisma/client';
import { MENU } from './menu.js';

const prisma = new PrismaClient();

/** Menyu yozuvini Product jadvaliga moslash */
function toProduct(item, index) {
  const description = item.subtitle
    ? `${item.subtitle} — ${item.ingredients.join(', ')}`
    : item.ingredients.join(', ');

  return {
    name: item.name,
    description,
    imageUrl: item.imageUrl || '',
    oldPrice: item.oldPrice ?? null,
    newPrice: item.price,
    category: item.category,
    ingredients: item.ingredients,
    isActive: true,
    sortOrder: index + 1,
  };
}

const PROMO_CODES = [
  {
    code: 'RESTO10',
    description: "Barcha buyurtmalarga 10% chegirma",
    type: 'PERCENT',
    value: 10,
    minOrderAmount: 150000,
    maxDiscount: 50000,
  },
  {
    code: 'YANGI20',
    description: "Birinchi buyurtmangizga 20 000 so'm chegirma",
    type: 'FIXED',
    value: 20000,
    minOrderAmount: 200000,
  },
  {
    code: 'MEZE5',
    description: 'Har qanday buyurtmaga 5% chegirma',
    type: 'PERCENT',
    value: 5,
    minOrderAmount: 0,
    maxDiscount: 30000,
  },
];

async function main() {
  console.log('🌱 Seed boshlandi...\n');

  /* ------------------------------ Mahsulotlar ------------------------------ */
  let added = 0;
  let updated = 0;

  for (const [index, item] of MENU.entries()) {
    const data = toProduct(item, index);
    const existing = await prisma.product.findFirst({ where: { name: data.name } });

    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await prisma.product.create({ data });
      added += 1;
    }
  }

  console.log(`🍽️  Mahsulotlar: ${added} ta qo'shildi, ${updated} ta yangilandi`);

  const categories = [...new Set(MENU.map((i) => i.category))];
  for (const category of categories) {
    const count = MENU.filter((i) => i.category === category).length;
    console.log(`     • ${category} — ${count} ta`);
  }

  /* ------------------------------ Promokodlar ------------------------------ */
  for (const promo of PROMO_CODES) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: promo,
      create: promo,
    });
  }
  console.log(`\n🎟️  Promokodlar: ${PROMO_CODES.length} ta tayyor`);
  PROMO_CODES.forEach((p) => console.log(`     • ${p.code} — ${p.description}`));

  const [productCount, promoCount] = await Promise.all([
    prisma.product.count(),
    prisma.promoCode.count(),
  ]);

  console.log(
    `\n✅ Seed tugadi. Bazada ${productCount} ta mahsulot, ${promoCount} ta promokod.`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
