import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Margarita',
    description:
      'Klassikaning eng sofi. Italiyacha pomidor sousi, mozzarella va yangi rayhon — sodda, lekin mukammal.',
    imageUrl:
      'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80',
    oldPrice: 65000,
    newPrice: 49000,
    category: 'Pizza',
    ingredients: ['Pomidor sousi', 'Mozzarella pishlog\'i', 'Yangi rayhon', 'Zaytun moyi'],
    sortOrder: 1,
  },
  {
    name: 'Peperoni',
    description:
      'Achchiqroq peperoni kolbasa, qo\'shaloq mozzarella va maxsus souz. Eng ko\'p buyurtma qilinadigan pizza.',
    imageUrl:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
    oldPrice: 85000,
    newPrice: 69000,
    category: 'Pizza',
    ingredients: ['Peperoni kolbasa', 'Qo\'shaloq mozzarella', 'Pomidor sousi', 'Origano'],
    sortOrder: 2,
  },
  {
    name: 'Qazi pizza',
    description:
      'Milliy ta\'m — chinakam qazi, qizil piyoz va mozzarella. Faqat bizda mavjud mualliflik retsept.',
    imageUrl:
      'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80',
    oldPrice: 110000,
    newPrice: 89000,
    category: 'Pizza',
    ingredients: ['Chinakam qazi', 'Qizil piyoz', 'Mozzarella', 'Pomidor sousi', 'Ko\'katlar'],
    sortOrder: 3,
  },
  {
    name: 'Pishloqli',
    description:
      '4 xil pishloq uyg\'unligi: mozzarella, cheddar, parmezan va dor blyu. Pishloq sevuvchilar uchun.',
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    oldPrice: 95000,
    newPrice: 79000,
    category: 'Pizza',
    ingredients: ['Mozzarella', 'Cheddar', 'Parmezan', 'Dor blyu', 'Qaymoqli souz'],
    sortOrder: 4,
  },
  {
    name: 'Kola 0.5L',
    description: 'Muzdek gazlangan ichimlik. Pizzaning eng yaxshi hamrohi.',
    imageUrl:
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80',
    oldPrice: 8000,
    newPrice: 5000,
    category: 'Ichimliklar',
    ingredients: ['Gazlangan ichimlik', '0.5 litr', 'Muzdek'],
    sortOrder: 5,
  },
  {
    name: 'Fanta 0.5L',
    description: 'Apelsin ta\'mli muzdek gazlangan ichimlik.',
    imageUrl:
      'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=800&q=80',
    oldPrice: 8000,
    newPrice: 5000,
    category: 'Ichimliklar',
    ingredients: ['Apelsin ta\'mi', '0.5 litr', 'Muzdek'],
    sortOrder: 6,
  },
];

async function main() {
  console.log('🌱 Seed boshlandi...');

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: product });
      console.log(`  ↻ Yangilandi: ${product.name}`);
    } else {
      await prisma.product.create({ data: product });
      console.log(`  + Qo'shildi:  ${product.name}`);
    }
  }

  const count = await prisma.product.count();
  console.log(`✅ Seed tugadi. Bazada jami ${count} ta mahsulot bor.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
