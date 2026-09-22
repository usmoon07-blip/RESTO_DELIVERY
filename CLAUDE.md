# Resto — loyiha haqida

Telegram bot + Mini App + Admin Panel. Restoran: **Resto Restaurant**, Toshkent.

## Ishlashdan oldin o'qing

**[RETSEPT.md](RETSEPT.md)** — bepul serverda ishlash retsepti: webhook,
menyu nusxasi, serverni uxlatmaslik, CORS, xavfsizlik va barcha tuzoqlar.
Yangi imkoniyat qo'shishdan oldin shuni ko'rib chiqing.

## Foydalanuvchi haqida

- **Dasturchi emas.** Kod haqida gapirmang — nima o'zgarganini va nima
  qilish kerakligini oddiy tilda ayting.
- **O'zbek tilida** javob bering.
- Windows kompyuter, interfeys rus tilida.
- Fayllarni qo'lda tahrirlash qiyin — `.bat` fayllar va avtomatik
  yechimlar afzal.

## Muhim qoidalar

- **Ortiqcha emoji yo'q.** Restoran premium segmentda — bezak emojilar
  arzon ko'rinish beradi. Faqat SVG ikonkalar va til bayroqchalari.
- **Uch til:** o'zbek, rus, ingliz. Har qanday yangi matn uchalasida ham.
- **Narx va chegirma har doim serverda qayta hisoblanadi** — mijoz
  telefonidan kelgan summaga ishonilmaydi.
- **Menyu nomlari mijoz tilida saqlanadi** — hisobotda taomlarni nom
  bo'yicha emas, **id bo'yicha** guruhlang.

## Tuzilishi

```
src/           backend (Express + Telegraf + Prisma)
miniapp/       React Mini App (mijozlar)
admin/         React Admin Panel (xodimlar)
prisma/        schema, menyu (164 taom), seed
scripts/       tunnel, doctor, menyu nusxasi, sozlamalar
*.bat          Windows yordamchilari
```

## Ishga tushirish

- Kompyuterda: `RESTO.bat` (o'zi yangilanadi va hammasini ishga tushiradi)
- Serverda: Render (backend + admin), Vercel (Mini App)
