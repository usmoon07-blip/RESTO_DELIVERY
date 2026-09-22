/**
 * Menyu yozuvini mahsulot maydonlariga o'giradi.
 *
 * Bu yerda turibdi, chunki ikki joyda ishlatiladi:
 *   prisma/seed.js              — bazaga yozish
 *   scripts/build-menu-snapshot — Mini App uchun menyu nusxasi
 * Ikki joyda alohida yozilsa, vaqt o'tib bir-biridan farq qilib ketardi.
 */
import { CATEGORIES, DISH_NAMES, INGREDIENTS, translate } from './menu-i18n.js';

/** "Айсти 450 ml" → { base: "Айсти", suffix: " 450 ml" } */
export function splitSize(name) {
  const match = name.match(/^(.*?)(\s+(?:450 ml|1 L))$/);
  return match ? { base: match[1], suffix: match[2] } : { base: name, suffix: '' };
}

export function describe(subtitle, ingredients) {
  return subtitle ? `${subtitle} — ${ingredients.join(', ')}` : ingredients.join(', ');
}

export function toProduct(item, index) {
  const { base, suffix } = splitSize(item.name);

  const ingredientsUz = item.ingredients.map((x) => translate(INGREDIENTS, x, 'uz'));
  const ingredientsEn = item.ingredients.map((x) => translate(INGREDIENTS, x, 'en'));

  const nameUz = translate(DISH_NAMES, base, 'uz') + suffix;
  const nameEn = translate(DISH_NAMES, base, 'en') + suffix;

  return {
    name: item.name,
    description: describe(item.subtitle, item.ingredients),
    category: item.category,
    ingredients: item.ingredients,

    nameUz,
    nameEn,
    descriptionUz: describe(item.subtitle, ingredientsUz),
    descriptionEn: describe(item.subtitle, ingredientsEn),
    categoryUz: translate(CATEGORIES, item.category, 'uz'),
    categoryEn: translate(CATEGORIES, item.category, 'en'),
    ingredientsUz,
    ingredientsEn,

    imageUrl: item.imageUrl || '',
    oldPrice: item.oldPrice ?? null,
    newPrice: item.price,
    isActive: true,
    sortOrder: index + 1,
  };
}

export default toProduct;
