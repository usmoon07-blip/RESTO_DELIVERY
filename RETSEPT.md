# Bepul serverda Telegram Mini App — retsept

> **Bu fayl keyingi loyihalar uchun.** Yangi bot/Mini App qilganingizda
> shu faylni Claude'ga ko'rsating va «RETSEPT.md bo'yicha qil» deng.
> Hamma tuzoqlar va yechimlar shu yerda yozilgan — qayta kashf qilish
> shart emas.

Sinovdan o'tgan tizim: **Resto Restaurant** (Toshkent), 164 taom, 3 til.

---

## Arxitektura

| Qism | Qayerda | Nega |
|---|---|---|
| Backend + bot + baza ulanishi | **Render** (bepul) | Node.js doimiy ishlaydi, webhook qabul qiladi |
| Mini App | **Vercel** (bepul) | Mijozlar ko'radi, tezlik muhim |
| Admin Panel | **Render** `/admin` da | Xodimlar ko'radi, tezlik muhim emas |
| Baza | **Neon** PostgreSQL (bepul) | Ulanish limiti yetarli |

Admin panelni Vercel'ga chiqarmaslik — ataylab. U kuniga bir marta
ochiladi, ortiqcha sozlash va xatolik manbai bo'lishiga arzimaydi.

---

## Majburiy yechimlar (busiz ishlamaydi)

### 1. Bot — long polling emas, webhook

Kompyuter o'chsa ham ishlashi uchun bot Telegramdan xabar **so'ramaydi**,
Telegram serverga **o'zi yuboradi**.

```js
// PUBLIC_URL yoki RENDER_EXTERNAL_URL bo'lsa — webhook, bo'lmasa polling
const middleware = await bot.createWebhook({
  domain: base,
  path: `/telegram/${sha256(token).slice(0, 32)}`, // token manzilda ko'rinmasin
  secret_token: sha256(`${token}:webhook`).slice(0, 48),
  drop_pending_updates: true,
});
app.use(middleware); // 404 handler'dan OLDIN ro'yxatdan o'tsin
```

**Tuzoq:** webhook marshruti 404 handler'dan keyin qo'yilsa ishlamaydi.
Shuning uchun 404 va xatolik handlerlari funksiyaga o'raladi va
webhook ulangandan keyin chaqiriladi.

### 2. `npm install --include=dev`

Render `NODE_ENV=production` qo'yadi, npm esa bu holatda **dev-paketlarni
o'tkazib yuboradi** — vite va prisma o'rnatilmaydi, qurilish buziladi.

```yaml
buildCommand: npm install --include=dev && npx prisma generate && ...
```

### 3. Frontend ikki joyda tursa — base yo'li

Admin Render'da `/admin` da, Vercel'da esa ildizda turadi:

```js
base: process.env.VERCEL ? '/' : command === 'build' ? '/admin/' : '/',
```

Vercel qurilish paytida `VERCEL` o'zgaruvchisini o'zi qo'yadi.

### 4. CORS va suratlar

```js
// Faqat o'z saytlarimizga ruxsat; Origin'siz so'rovlar (Telegram) o'tadi
origin(origin, cb) {
  if (!origin || allowed.length === 0) return cb(null, true);
  cb(null, allowed.includes(origin.replace(/\/$/, '')));
}
```

Suratlar bazada `/uploads/x.jpg` deb saqlanadi — sayt boshqa manzilda
bo'lsa ishlamaydi. Frontendda `mediaUrl()` nisbiy yo'lga API manzilini
qo'shadi.

---

## Tezlik — eng muhim qism

Bepul Render **15 daqiqa jimlikdan keyin uxlaydi**, uyg'onishi 30–60
soniya. Mijoz bu vaqt kutmaydi — ketadi.

### A. Menyu nusxasi (eng katta ta'sir)

Menyu nusxasi frontend bilan **birga yuklanadi**. Ilova ochilishi
bilanoq taomlar ko'rinadi, server javob bergach jimgina yangilanadi.

```js
const [products, setProducts] = useState(snapshot.products || []);
const hasSnapshot = (snapshot.products || []).length > 0;
const [loading, setLoading] = useState(!hasSnapshot);
// Server javob bermasa xatolik KO'RSATILMAYDI — mijoz menyuni ko'rib turadi
if (!hasSnapshot) setError(e.message);
```

Nusxa `prebuild` bosqichida menyu manbasidan yasaladi. Yasalmasa ham
qurilish to'xtamaydi — omborda saqlangan eski nusxa ishlatiladi.

**Xavf va himoyasi:** nusxadagi taom raqamlari bazadagidan farq qilsa,
mijoz boshqa taom buyurtma qilib qoladi. Shuning uchun ilova taom
**nomini ham yuboradi**, server uni baza bilan solishtiradi:

```js
if (item.name) {
  const known = [product.name, product.nameUz, product.nameEn].filter(Boolean);
  if (!known.includes(String(item.name))) {
    return res.status(409).json({ ok: false, error: t(lang, 'errMenuChanged') });
  }
}
```

### B. Serverni uxlatmaslik

GitHub Actions har 10 daqiqada turtki beradi — tashqi xizmatga ro'yxatdan
o'tish kerak emas:

```yaml
on:
  schedule:
    - cron: '*/10 4-21 * * *'   # UTC 04-21 = Toshkent 09:00-02:00
```

**Faqat ish vaqtida** — bepul Render'da oyiga 750 soat chegara bor.
18 soat × 30 kun = 540 soat, sig'adi. Sutka bo'yi ursangiz 730 soat
bo'ladi va chegaraga juda yaqinlashadi.

> GitHub 60 kun faoliyatsiz omborda jadvalli ishlarni o'chirib qo'yadi.
> Vaqti-vaqti bilan commit bo'lsa muammo yo'q.

---

## Xavfsizlik

Admin panel internetda ochiq turadi — parol yagona himoya:

- **Parolni tanlab ko'rishdan himoya:** bitta IP'dan 8 xato urinish →
  15 daqiqa blok. Ro'yxat xotirada, server qayta ishga tushganda tozalanadi.
- **`timingSafeEqual`** bilan solishtirish
- **`ALLOW_BROWSER_DEV=false`** ishlab chiqarishda — aks holda Telegramsiz
  ham kirish mumkin
- **Xatolik matnidan tokenni yashirish:** `text.replace(/bot\d+:[\w-]+/g, 'bot***')`
  — aks holda BOT_TOKEN log'larga tushadi

---

## Bilib qo'yish kerak

**Render bepul: disk vaqtinchalik.** Yuklangan suratlar har qayta ishga
tushganda o'chadi. Suratlar kerak bo'lsa Cloudinary yoki shunga o'xshash
xizmat.

**Bitta botni ikki joydan tinglab bo'lmaydi.** Serverda ishlayotgan bo'lsa,
kompyuterda ishga tushirmang — Telegram 409 Conflict beradi.

**Mijozga Render sahifasini ko'rsatmang.** Qora ekrandagi log'lar oddiy
ish jarayoni, lekin mijozni cho'chitadi.

**Bot buyruqlarini sinashda `entities` kerak.** Telegraf `/start` ni
`entities` orqali taniydi, faqat matn bo'yicha emas:

```json
{"text":"/start","entities":[{"offset":0,"length":6,"type":"bot_command"}]}
```

---

## Ishga tushirish tartibi

1. **Neon** — baza yarat, `DATABASE_URL` ol
2. **Render** — Blueprint (`render.yaml`) orqali, 5 ta maxfiy qiymat kirit
3. Manzilni tekshir: `/api/health` → `{"ok":true}`
4. **Vercel** — Mini App uchun bitta loyiha, Root Directory to'g'ri bo'lsin,
   `VITE_API_URL` = Render manzili + `/api`
5. **Render'da** `WEB_APP_URL` va `CORS_ORIGINS` qo'sh
6. **GitHub Actions** turtkisidagi manzilni yangi serverga moslashtir

> **Eng ko'p uchraydigan xato:** Vercel'da Root Directory ni belgilashni
> unutish. Unda ombor ildizi qurilib, noto'g'ri narsa chiqadi.
