import { PrismaClient } from '@prisma/client';
import { MENU } from './menu.js';
import { CATEGORIES, DISH_NAMES, INGREDIENTS, translate } from './menu-i18n.js';
import { splitSize, toProduct } from './to-product.js';

const prisma = new PrismaClient();



/** Menyu yozuvini Product jadvaliga moslash (tarjimalari bilan) */

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

  // Menyuda qolmagan eski mahsulotlar o'chirilmaydi, faqat yashiriladi —
  // shunda eski buyurtmalar tarixi buzilmaydi.
  const menuNames = MENU.map((i) => i.name);
  const { count: hidden } = await prisma.product.updateMany({
    where: { name: { notIn: menuNames }, isActive: true },
    data: { isActive: false },
  });

  console.log(`🍽️  Mahsulotlar: ${added} ta qo'shildi, ${updated} ta yangilandi`);
  if (hidden > 0) console.log(`     ${hidden} ta eski mahsulot yashirildi`);

  const categories = [...new Set(MENU.map((i) => i.category))];
  for (const category of categories) {
    const count = MENU.filter((i) => i.category === category).length;
    const uz = translate(CATEGORIES, category, 'uz');
    console.log(`     • ${category} / ${uz} — ${count} ta`);
  }

  // Tarjimasi topilmagan matnlarni ogohlantirib qo'yamiz
  const untranslated = new Set();
  for (const item of MENU) {
    const { base } = splitSize(item.name);
    if (!DISH_NAMES[base]) untranslated.add(base);
    for (const ing of item.ingredients) {
      if (!INGREDIENTS[ing]) untranslated.add(ing);
    }
    if (!CATEGORIES[item.category]) untranslated.add(item.category);
  }
  if (untranslated.size > 0) {
    console.log(`\n⚠️  Tarjimasi yo'q (${untranslated.size} ta) — prisma/menu-i18n.js ga qo'shing:`);
    [...untranslated].forEach((x) => console.log(`     • ${x}`));
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
