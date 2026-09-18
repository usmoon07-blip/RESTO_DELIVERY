export function formatSum(value) {
  return (Number(value) || 0).toLocaleString('ru-RU').replace(/ /g, ' ');
}

export function formatDate(value) {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const STATUS_LABELS = {
  PENDING: 'Kutilmoqda',
  CONFIRMED: 'Tasdiqlandi',
  PREPARING: 'Tayyorlanmoqda',
  DELIVERING: "Yo'lda",
  DELIVERED: 'Yetkazildi',
  CANCELLED: 'Bekor qilindi',
};

/** Chegirma foizi */
export function discountPercent(product) {
  if (!product?.oldPrice || product.oldPrice <= product.newPrice) return 0;
  return Math.round(100 - (product.newPrice / product.oldPrice) * 100);
}
