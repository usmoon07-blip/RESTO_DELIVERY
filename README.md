# 🍕 Resto — Telegram Mini App + Admin Panel

Telegram bot, mijozlar uchun Mini App va ma'murlar uchun Admin Panel.
Butunlay **localhost**da ishlaydi, hech qayerga deploy qilish shart emas.

| Qism | Texnologiya | Manzil |
|---|---|---|
| Backend (Bot + API) | Node.js, Express, Telegraf, Prisma | http://localhost:5000 |
| Mini App (mijoz) | React + Vite | http://localhost:5173 |
| Admin Panel | React + Vite | http://localhost:5174 |
| Baza | PostgreSQL (Neon) | bulutda |

---

## 1. `.env` faylini yaratish

Loyihaning asosiy papkasida `.env` fayli bo'lishi shart.
`.env.example` dan nusxa oling va o'z ma'lumotlaringizni yozing:

```bash
cp .env.example .env
```

---

## 2. Paketlarni o'rnatish

```bash
# 1) Backend
npm install

# 2) Mini App
cd miniapp && npm install && cd ..

# 3) Admin Panel
cd admin && npm install && cd ..
```

---

## 3. Bazani tayyorlash

```bash
npm run db:push    # jadvallarni Neon bazasiga yaratadi
npm run db:seed    # restoranning to'liq menyusini bazaga yozadi
```

`npm run db:seed` **164 ta taomni 25 ta kategoriya bo'yicha** yozadi
(Мезе–Стартеры, Закуски, Салаты, Супы, Паста, Блюда в тандыре, Шашлыки,
Стейки, Бургеры, Show-блюда, Теппан, Роллы, Горячие роллы, Маки, Гункан,
Нигири, Сашими, Кофе, Коктейли, Лимонады va boshqalar) hamda 3 ta promokod.

Menyu `prisma/menu.js` faylida saqlanadi. Taom qo'shish yoki narxni
o'zgartirish uchun shu faylni tahrirlab `npm run db:seed` ni qayta ishga
tushiring — yoki Admin Panel orqali qiling.

> Seed menyuda qolmagan eski taomlarni **o'chirmaydi**, faqat yashiradi —
> shunda eski buyurtmalar tarixi buzilmaydi.

Yoki bitta buyruq bilan:

```bash
npm run setup
```

Bazani ko'z bilan ko'rish uchun: `npm run db:studio`

---

## 4. Ishga tushirish (3 ta alohida terminal)

```bash
# 1-terminal — Backend + Bot
npm run dev

# 2-terminal — Mini App
cd miniapp && npm run dev

# 3-terminal — Admin Panel
cd admin && npm run dev
```

Admin Panel: http://localhost:5174 (parol — `.env` dagi `ADMIN_PASSWORD`)

Admin Panelda 3 ta bo'lim bor:

| Bo'lim | Kimga | Vazifasi |
|---|---|---|
| 👨‍🍳 **Oshxona ekrani** | Oshpaz / operator | Zakazlar 3 ta ustunda, tovushli signal, 3 soniyada yangilanadi |
| **Buyurtmalar** | Menejer | To'liq jadval, filtr, statistika, tushum |
| **Mahsulotlar** | Menejer | Pizza qo'shish / tahrirlash / o'chirish |

### 👨‍🍳 Oshxona ekrani qanday ishlaydi

Buyurtma tushishi bilan **"Yangi buyurtmalar"** ustunida paydo bo'ladi,
kartochka qizil rangda chaqnaydi va signal chalinadi.

```
🔔 Yangi buyurtmalar  →  👨‍🍳 Tayyorlanmoqda  →  🛵 Yo'lda / Olib ketishga tayyor  →  ✅ Yakunlandi
```

- **Tovush:** birinchi marta **"🔔 Tovushni yoqish"** tugmasini bosing
  (brauzer qoidasi — tovush faqat bir marta bosilgandan keyin ishlaydi).
- **To'liq ekran:** "⛶ To'liq ekran" tugmasi — planshet yoki devordagi
  monitor uchun.
- **Taymer:** har bir kartochkada buyurtma tushganidan beri necha daqiqa
  o'tgani ko'rinadi. 15 daqiqadan keyin sariq, 25 daqiqadan keyin qizil.
- Har bir tugma bosilganda **bot mijozga avtomatik xabar yuboradi**.
- Yakunlangan va bekor qilingan buyurtmalar ekrandan o'zi yo'qoladi.

---

## 5. ngrok orqali Telegramga ulash

Telegram Mini App **faqat HTTPS** manzil bilan ishlaydi, shuning uchun
localhost'ni ngrok orqali internetga chiqaramiz.

1. https://ngrok.com — ro'yxatdan o'ting, dasturni yuklab oling.
2. Authtoken'ni ulang:
   ```bash
   ngrok config add-authtoken SIZNING_TOKENINGIZ
   ```
3. 4-terminalda Mini App portini tunnel qiling:
   ```bash
   ngrok http 5173
   ```
4. Chiqqan `https://....ngrok-free.app` manzilini `.env` ga yozing:
   ```
   WEB_APP_URL="https://xxxx-xx-xx.ngrok-free.app"
   ```
5. Backendni qayta ishga tushiring (`Ctrl+C` → `npm run dev`).
6. Botga `/start` yozing — "🍕 Buyurtma berish" tugmasi paydo bo'ladi.

> ngrok'ni har qayta ishga tushirganingizda manzil o'zgaradi —
> `.env` dagi `WEB_APP_URL` ni yangilab, backendni qayta ishga tushiring.

---

## 6. Loyiha tuzilishi

```
RESTO_DELIVERY/
├── src/
│   ├── config/default.js           # Sozlamalar
│   ├── core/bot.js                 # Bot instansiyasi
│   ├── database/connection.js      # Prisma ulanishi
│   ├── models/                     # User, Product, Order
│   ├── controllers/                # bot, cart (mijoz), admin
│   ├── routes/                     # bot, client, admin yo'llari
│   ├── middlewares/auth.middleware.js
│   ├── utils/format.js
│   └── index.js                    # Kirish nuqtasi
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── miniapp/                        # React Mini App (mijozlar)
├── admin/                          # React Admin Panel
├── .env
└── package.json
```

---

## 7. Mini App tuzilishi

Mini App 5 ta bo'limdan iborat (pastdagi menyu):

| Bo'lim | Nima bor |
|---|---|
| 🍽 **Menyu** | Qidiruv, manzil, storylar, aksiya bannerlari, kategoriyalar bo'yicha taomlar |
| 🧾 **Buyurtmalar** | Xaridlar tarixi, holati va "yana buyurtma qilish" |
| 🛍 **Savat** | Taomlar, qo'shimcha taklif, promokod, yakuniy summa |
| ⚡ **Aksiyalar** | Promokodlar (nusxalash bilan) va chegirmadagi taomlar |
| 👤 **Profil** | Ism, telefon, saqlangan manzil, statistika, aloqa |

Qo'shimcha imkoniyatlar:
- **Manzil xotirada saqlanadi** — keyingi buyurtmada avtomatik to'ldiriladi
- **Kategoriyalar paneli yopishib turadi** va skroll paytida o'zi ajralib ko'rsatiladi
- **Qidiruv** taom nomi, tarkibi va kategoriyasi bo'yicha ishlaydi
- **Promokod** savatchada tekshiriladi, summa o'zgarsa qayta hisoblanadi

---

## 8. Promokodlar

Promokodlar Admin Panel → **Promokodlar** bo'limida boshqariladi.

| Maydon | Ma'nosi |
|---|---|
| Kod | Mijoz kiritadigan so'z (avtomatik katta harfga o'giriladi) |
| Turi | Foizli (%) yoki belgilangan summa |
| Eng kam buyurtma | Shu summadan past buyurtmalarga amal qilmaydi |
| Eng ko'p chegirma | Foizli kodlar uchun yuqori chegara |
| Foydalanish limiti | Necha marta ishlatish mumkin (bo'sh — cheksiz) |
| Muddati | Shu sanadan keyin ishlamaydi |

Seed bilan 3 ta promokod keladi: `RESTO10` (10%), `YANGI20` (20 000 so'm), `MEZE5` (5%).

> Chegirma **serverda qayta hisoblanadi** — mijoz brauzerdan soxta summa yuborsa ham
> haqiqiy narx bazadan olinadi.

---

## 9. API yo'llari

### Mijoz (`/api/client`) — Telegram initData bilan himoyalangan
| Metod | Yo'l | Vazifasi |
|---|---|---|
| GET | `/config` | Sozlamalar (narx, yetkazish) |
| GET | `/products` | Faol mahsulotlar |
| GET | `/categories` | Kategoriyalar (menyudagi tartibda) |
| GET | `/promos` | Amal qilayotgan promokodlar |
| POST | `/promo/check` | Promokodni tekshirish |
| GET | `/me` | Profil |
| POST | `/me/phone` | Telefonni saqlash |
| GET | `/orders` | Mening buyurtmalarim |
| POST | `/orders` | Yangi buyurtma |

### Admin (`/api/admin`) — `x-admin-password` sarlavhasi bilan
| Metod | Yo'l | Vazifasi |
|---|---|---|
| POST | `/login` | Parolni tekshirish |
| GET | `/stats` | Statistika |
| GET | `/orders` | Buyurtmalar (`?status=PENDING`) |
| GET | `/orders?active=true` | Oshxona ekrani — tugallanmagan buyurtmalar |
| PATCH | `/orders/:id/status` | Holatni o'zgartirish |
| DELETE | `/orders/:id` | O'chirish |
| GET/POST/PUT/DELETE | `/products` | Mahsulotlar CRUD |
| GET/POST/PUT/DELETE | `/promos` | Promokodlar CRUD |
| GET | `/users` | Mijozlar |

---

## 10. Uch til: o'zbek, rus, ingliz

Mini App va bot to'liq **3 tilda** ishlaydi.

**Til qanday tanlanadi:**
1. Foydalanuvchi botda birinchi marta `/start` bosganda til so'raladi
2. Mini App ochilganda Telegram sozlamasidan avtomatik aniqlanadi
3. Istalgan vaqtda: Mini App → **Profil** → til tugmalari, yoki botda `/language`

Mini Appda til almashtirilsa, **bot ham o'sha tilga o'tadi** (serverga saqlanadi).

**Nima tarjima qilingan:**

| Qism | Fayl |
|---|---|
| Mini App interfeysi (107 kalit) | `miniapp/src/i18n.js` |
| Bot xabarlari (52 kalit) | `src/i18n/index.js` |
| Menyu: 25 kategoriya, 156 taom nomi, 338 tarkib | `prisma/menu-i18n.js` |

Taom nomlari bazada uchta ustunda saqlanadi: `name` (ruscha, asosiy),
`nameUz`, `nameEn`. Tarjima bo'sh bo'lsa **ruscha varianti** ko'rsatiladi —
ya'ni tarjimasiz taom ham to'g'ri ishlaydi.

**Yangi taom qo'shganda tarjimani qayerga yozish kerak?**
- Admin Panel → Mahsulotlar → tahrirlash oynasida uchala til uchun maydon bor
- Yoki `prisma/menu-i18n.js` ga yozib, `npm run db:seed` ni qayta ishga tushiring
  (tarjimasi topilmagan so'zlar seed oxirida ogohlantirish bilan chiqadi)

> Admin Panel o'zi faqat o'zbek tilida — u restoran xodimlari uchun.

---

## 11. Taom suratlari

Admin Panel → **Mahsulotlar** → taomni tahrirlash → **Surat** bo'limi:

- **"Kompyuterdan yuklash"** — suratni to'g'ridan-to'g'ri tanlaysiz
- Yoki tayyor havolani (`https://...`) qo'lda kiritasiz

Yuklangan suratlar `uploads/` papkasida saqlanadi va `/uploads/...` manzili
orqali beriladi. Bazada faqat yo'li saqlanadi.

| Cheklov | Qiymat |
|---|---|
| Format | JPG, PNG, WEBP, AVIF |
| Hajm | 8 MB gacha |

> `uploads/` papkasi `.gitignore` da — suratlar GitHub'ga yuklanmaydi,
> faqat sizning kompyuteringizda qoladi.

Surat qo'yilmagan taomlar brend uslubidagi o'rin bosar belgi bilan chiqadi —
ya'ni menyu suratsiz ham to'liq ishlaydi.

---

## 12. Brend ranglari va shriftlari

Dizayn Resto Restaurant'ning Instagram brendiga moslangan.

| O'zgaruvchi | Rang | Qayerda ishlatiladi |
|---|---|---|
| `--accent` | `#8c7a71` | Logotip, story halqalari, urg'ular |
| `--accent-strong` | `#6e5d55` | Tugmalar, havolalar |
| `--price` | `#c8102e` | Chegirma narxlari, belgilar |
| `--dark` | `#2a2422` | Asosiy tugmalar, hero bloki |
| `--muted-bg` | `#f7f5f3` | Iliq kulrang fon |

Ranglarni o'zgartirish uchun faqat 2 ta fayldagi `:root` blokini tahrirlang:
`miniapp/src/styles.css` va `admin/src/styles.css`.

**Logotip** — restoranning asl logotipidan olingan vektor:

| Fayl | Nima |
|---|---|
| `public/logo.svg` | To'liq logotip: "Resto" + "RESTAURANT" |
| `public/logo-script.svg` | Faqat qo'lyozma "Resto" (kichik joylar uchun) |

Logotip SVG niqob orqali chiziladi, rangi `currentColor` bilan beriladi —
shuning uchun oq fonda taupe, taupe fonda oq bo'lib ko'rinadi.
`<Logo variant="full" height={40} />` komponenti orqali qo'yiladi.

**Shriftlar** (loyiha ichida saqlangan, internetsiz ham ishlaydi):

| Shrift | Qayerda |
|---|---|
| Playfair Display | Sarlavhalar (serif) |
| Inter | Asosiy matn |

Fayllar: `miniapp/public/fonts/` va `admin/public/fonts/`

---

## 13. Foydali maslahatlar

- **Brauzerda test qilish:** `.env` da `ALLOW_BROWSER_DEV=true` bo'lsa,
  Mini Appni oddiy brauzerda (http://localhost:5173) ochib sinab ko'rasiz.
  Ishlab chiqarishda buni `false` qiling.
- **Buyurtma holatini o'zgartirsangiz**, bot mijozga avtomatik xabar yuboradi.
- **Bepul yetkazish chegarasi** — `.env` dagi `FREE_DELIVERY_FROM`.
- `npm run db:push` xato bersa, `.env` dagi `DIRECT_URL` ni o'chirib,
  `DATABASE_URL` bilan bir xil qiling.
