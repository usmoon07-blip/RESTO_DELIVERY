# Serverga yuklash — qadamba-qadam

Shundan keyin kompyuteringiz o'chiq bo'lsa ham bot va Mini App ishlayveradi.

| Qism | Qayerda turadi | Narxi |
|---|---|---|
| Backend (bot + API) | **Render** | bepul |
| Mini App | **Vercel** | bepul |
| Admin Panel | **Vercel** | bepul |
| Baza | **Neon** (allaqachon bor) | bepul |

Tartib muhim: **avval Render, keyin Vercel, oxirida ikkisini bog'laymiz.**

---

## 0. Tayyorgarlik

Kerak bo'ladigan narsalar (hammasi sizda bor):

- GitHub akkaunti — `usmoon07-blip`
- Neon bazasi manzili (`DATABASE_URL`)
- Bot tokeni (@BotFather dan)
- Telegram ID raqamingiz

> **Parolni hozir o'zgartiring.** Admin Panel internetda ochiq turadi.
> Yangi parolni o'ylab qo'ying (kamida 10 belgi) — 3-bosqichda kerak bo'ladi.

---

## 1. RENDER — backend

### 1.1. Ro'yxatdan o'tish

1. https://render.com → **Get Started** → **GitHub** bilan kiring
2. Render GitHub'ga ulanishga ruxsat so'raydi → **Authorize**

### 1.2. Xizmat yaratish

1. **New +** → **Web Service**
2. Ro'yxatdan `RESTO_DELIVERY` omborini tanlang → **Connect**
3. Quyidagilarni to'ldiring:

| Maydon | Qiymat |
|---|---|
| Name | `resto-api` |
| Region | **Frankfurt (EU Central)** |
| Branch | `claude/friendly-shannon-9i984v` |
| Root Directory | *(bo'sh qoldiring)* |
| Runtime | `Node` |
| Build Command | `npm install && npx prisma generate && npx prisma db push --skip-generate` |
| Start Command | `node src/index.js` |
| Instance Type | **Free** |

### 1.3. Sozlamalarni kiritish

Pastda **Environment Variables** bo'limi bor. **Add Environment Variable**
tugmasi bilan bittalab qo'shing:

| Nomi | Qiymati |
|---|---|
| `DATABASE_URL` | Neon manzilingiz (`.env` dagi bilan bir xil) |
| `DIRECT_URL` | Neon manzilingiz (`-pooler`siz variant) |
| `BOT_TOKEN` | @BotFather bergan token |
| `ADMIN_IDS` | Telegram ID raqamingiz |
| `ADMIN_PASSWORD` | **yangi kuchli parol** |
| `ALLOW_BROWSER_DEV` | `false` |
| `NODE_VERSION` | `22` |
| `NODE_ENV` | `production` |
| `CURRENCY` | `so'm` |
| `DELIVERY_FEE` | `15000` |
| `FREE_DELIVERY_FROM` | `150000` |
| `RESTAURANT_NAME` | `Resto` |

> `WEB_APP_URL` va `CORS_ORIGINS` ni **hozir qo'shmaymiz** — ular Vercel
> manzillari tayyor bo'lgach, 3-bosqichda qo'shiladi.

4. **Create Web Service** → 3–5 daqiqa kutiladi

### 1.4. Tekshirish

Yuqorida manzil paydo bo'ladi, masalan `https://resto-api.onrender.com`.
**Shu manzilni nusxalab qo'ying** — keyin kerak bo'ladi.

Brauzerda `https://SIZNING-MANZIL.onrender.com/api/health` ni oching.
Shunday javob chiqishi kerak:

```json
{"ok":true,"uptime":12.3,"env":"production"}
```

Chiqmasa — Render'dagi **Logs** bo'limiga qarang.

---

## 2. VERCEL — Mini App va Admin Panel

**Ikkita alohida loyiha** yaratiladi. Bitta ombordan, lekin har biri
o'z papkasidan quriladi.

### 2.1. Ro'yxatdan o'tish

https://vercel.com → **Sign Up** → **Continue with GitHub**

### 2.2. Mini App

1. **Add New...** → **Project**
2. `RESTO_DELIVERY` → **Import**
3. Sozlamalar:

| Maydon | Qiymat |
|---|---|
| Project Name | `resto-mini` |
| Framework Preset | `Vite` |
| **Root Directory** | **`miniapp`** ← *Edit tugmasi orqali tanlanadi* |

4. **Environment Variables** ni oching va qo'shing:

| Nomi | Qiymati |
|---|---|
| `VITE_API_URL` | `https://resto-api.onrender.com/api` |

> Oxirida `/api` borligiga e'tibor bering. Manzilni 1.4-bosqichdan oling.

5. **Deploy** → 1–2 daqiqa

Manzil chiqadi, masalan `https://resto-mini.vercel.app` — **nusxalab qo'ying.**

### 2.3. Admin Panel

Xuddi shu tartib, faqat ikki joyi boshqacha:

| Maydon | Qiymat |
|---|---|
| Project Name | `resto-admin` |
| **Root Directory** | **`admin`** |
| `VITE_API_URL` | `https://resto-api.onrender.com/api` |

Manzil chiqadi, masalan `https://resto-admin.vercel.app` — **nusxalab qo'ying.**

---

## 3. IKKISINI BOG'LASH

Render'ga qaytamiz: **resto-api** → **Environment** → yana ikkita
o'zgaruvchi qo'shamiz:

| Nomi | Qiymati |
|---|---|
| `WEB_APP_URL` | `https://resto-mini.vercel.app` |
| `CORS_ORIGINS` | `https://resto-mini.vercel.app,https://resto-admin.vercel.app` |

> `CORS_ORIGINS` da **vergul bor, bo'sh joy yo'q**. Manzillar oxirida
> `/` bo'lmasin.

**Save Changes** → Render o'zi qayta ishga tushadi (1–2 daqiqa).

Tamom. Botga `/start` yozing — «Buyurtma berish» tugmasi ishlaydi.

---

## Bilib qo'yish kerak bo'lgan narsalar

### Bepul Render 15 daqiqadan keyin uxlaydi

Hech kim yozmasa, Render xizmatni uxlatib qo'yadi. Keyingi xabar kelganda
u uyg'onadi, lekin **birinchi javob 30–60 soniya kechikadi**. Keyingilari
tez bo'ladi.

Ikki yechim bor:

1. **Bepul:** https://cron-job.org da ro'yxatdan o'ting va har 10 daqiqada
   `https://resto-api.onrender.com/api/health` manzilini ochadigan vazifa
   yarating. Xizmat uxlamay turadi.
2. **Oyiga $7:** Render'da **Starter** rejaga o'ting — doim uyg'oq turadi.

Haqiqiy mijozlar kela boshlaganda ikkinchi variantni tanlash to'g'ri bo'ladi.

### Yuklangan suratlar saqlanmaydi

Bepul Render'da diskda saqlangan fayllar har qayta ishga tushganda
o'chib ketadi. Ya'ni Admin Panel orqali yuklangan **taom suratlari
yo'qoladi**.

Hozir bu muammo emas (suratlar hali qo'shilmagan). Suratlarni
qo'shishdan oldin ayting — men ularni Cloudinary kabi bepul xizmatga
saqlaydigan qilib beraman.

### Baza o'zgarmaydi

Neon bazasi o'sha-o'sha qoladi. Localhostda ishlatgan menyu, promokodlar
va buyurtmalar joyida bo'ladi.

### Kompyuterda ham ishlataverasizmi?

Ha. `RESTO.bat` avvalgidek ishlayveradi. Lekin **ikkalasini bir vaqtda
ishlatmang** — bitta botni ikki joydan tinglab bo'lmaydi, Telegram
xatolik beradi. Serverda ishlayotgan bo'lsa, `RESTO.bat` ni yopib qo'ying.

### Kodni o'zgartirsangiz

GitHub'ga yangi commit tushishi bilan Render va Vercel **o'zi** qayta
quradi. Qo'lda hech narsa qilish kerak emas.

---

## Xavfsizlik

Loyiha internetga chiqqani uchun quyidagilar qo'shildi:

- **CORS** — API'ga faqat sizning ikki saytingiz murojaat qila oladi
- **Parolni tanlab ko'rishdan himoya** — bitta IP'dan 8 marta noto'g'ri
  parol kiritilsa, 15 daqiqaga bloklanadi
- **Webhook maxfiy kaliti** — Telegram nomidan soxta xabar yuborib
  bo'lmaydi
- **`ALLOW_BROWSER_DEV=false`** — Mini App faqat Telegram ichida ochiladi

Shunga qaramay **admin parolini albatta kuchli qiling**. U yagona
himoya — parolni bilgan odam buyurtmalarni va menyuni o'zgartira oladi.
