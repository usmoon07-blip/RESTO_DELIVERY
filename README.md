# 🍕 Premium Pizza — Telegram Mini App + Admin Panel

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
npm run db:seed    # 4 ta pizza + 2 ta ichimlikni bazaga yozadi
```

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

## 7. API yo'llari

### Mijoz (`/api/client`) — Telegram initData bilan himoyalangan
| Metod | Yo'l | Vazifasi |
|---|---|---|
| GET | `/config` | Sozlamalar (narx, yetkazish) |
| GET | `/products` | Faol mahsulotlar |
| GET | `/categories` | Kategoriyalar |
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
| PATCH | `/orders/:id/status` | Holatni o'zgartirish |
| DELETE | `/orders/:id` | O'chirish |
| GET/POST/PUT/DELETE | `/products` | Mahsulotlar CRUD |
| GET | `/users` | Mijozlar |

---

## 8. Foydali maslahatlar

- **Brauzerda test qilish:** `.env` da `ALLOW_BROWSER_DEV=true` bo'lsa,
  Mini Appni oddiy brauzerda (http://localhost:5173) ochib sinab ko'rasiz.
  Ishlab chiqarishda buni `false` qiling.
- **Buyurtma holatini o'zgartirsangiz**, bot mijozga avtomatik xabar yuboradi.
- **Bepul yetkazish chegarasi** — `.env` dagi `FREE_DELIVERY_FROM`.
- `npm run db:push` xato bersa, `.env` dagi `DIRECT_URL` ni o'chirib,
  `DATABASE_URL` bilan bir xil qiling.
