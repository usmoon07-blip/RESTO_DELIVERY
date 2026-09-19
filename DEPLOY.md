# Serverga yuklash — 4 qadam

Shundan keyin kompyuter o'chiq bo'lsa ham hammasi ishlaydi. Hammasi bepul.

---

## 1-qadam — Render (bot va API)

**Havola:** https://render.com/deploy?repo=https://github.com/usmoon07-blip/RESTO_DELIVERY

Bosing → GitHub bilan kiring → **Connect GitHub** → **Authorize Render**.

Render sozlamalarni loyihaning o'zidan o'qiydi. Sizdan faqat **5 ta qiymat**
so'raydi. Ularni pastdagi jadvaldan nusxalang:

| Maydon | Nima yoziladi |
|---|---|
| `DATABASE_URL` | Neon manzilingiz |
| `DIRECT_URL` | Neon manzilingiz (`-pooler`siz) |
| `BOT_TOKEN` | Botingiz tokeni |
| `ADMIN_IDS` | Telegram ID raqamingiz |
| `ADMIN_PASSWORD` | **Yangi kuchli parol** (admin123 emas!) |

**Apply** / **Create** tugmasini bosing va 3–5 daqiqa kuting.

Tayyor bo'lgach yuqorida manzil chiqadi:

```
https://resto-api-XXXX.onrender.com
```

**Shu manzilni nusxalang.** Keyingi qadamlarda uch marta kerak bo'ladi.

> Tekshirish: shu manzilga `/api/health` qo'shib brauzerda oching.
> `{"ok":true,...}` chiqsa — ishladi.

---

## 2-qadam — Vercel (Mini App)

**Havola:** https://vercel.com/new

GitHub bilan kiring → ro'yxatdan **RESTO_DELIVERY** ni toping → **Import**.

Uchta joyni to'ldiring:

| Maydon | Qiymat |
|---|---|
| Project Name | `resto-mini` |
| **Root Directory** → *Edit* | **`miniapp`** |
| Environment Variables | Nomi: `VITE_API_URL` |
| | Qiymati: `https://resto-api-XXXX.onrender.com/api` |

> `XXXX` o'rniga 1-qadamdagi o'z manzilingiz. Oxirida **`/api`** bo'lishi shart.

**Deploy** → 1–2 daqiqa → manzil chiqadi, masalan `https://resto-mini.vercel.app`.
**Nusxalang.**

---

## 3-qadam — Vercel (Admin Panel)

Yana **https://vercel.com/new** → **RESTO_DELIVERY** → **Import**.

Xuddi shu tartib, faqat ikki joyi boshqacha:

| Maydon | Qiymat |
|---|---|
| Project Name | `resto-admin` |
| **Root Directory** → *Edit* | **`admin`** |
| `VITE_API_URL` | `https://resto-api-XXXX.onrender.com/api` |

**Deploy** → manzil chiqadi, masalan `https://resto-admin.vercel.app`. **Nusxalang.**

---

## 4-qadam — Bog'lash

Render'ga qaytasiz: **resto-api** → chap menyuda **Environment** →
**Add Environment Variable** bilan **ikkita** qiymat qo'shasiz:

| Nomi | Qiymati |
|---|---|
| `WEB_APP_URL` | `https://resto-mini.vercel.app` |
| `CORS_ORIGINS` | `https://resto-mini.vercel.app,https://resto-admin.vercel.app` |

> `CORS_ORIGINS` da vergul bor, **bo'sh joy yo'q**. Manzil oxirida `/` bo'lmasin.

**Save Changes** → Render o'zi qayta ishga tushadi (1–2 daqiqa).

---

# Tamom

Botga `/start` yozing — **«Buyurtma berish»** tugmasi ishlaydi.
Admin Panel: `https://resto-admin.vercel.app`

---

## Uchta narsani bilib qo'ying

**1. Bepul Render 15 daqiqadan keyin uxlaydi.** Keyingi xabarda uyg'onadi,
lekin birinchi javob 30–60 soniya kechikadi.
*Yechim:* https://cron-job.org da har 10 daqiqada
`https://resto-api-XXXX.onrender.com/api/health` ni ochadigan vazifa yarating —
bepul va xizmat uxlamaydi. Yoki Render'da oyiga $7 to'lang.

**2. Yuklangan taom suratlari saqlanmaydi** — bepul Render har qayta ishga
tushganda diskni tozalaydi. Suratlarni qo'shishdan oldin ayting, boshqa
joyga saqlaydigan qilaman.

**3. `RESTO.bat` ni yopib qo'ying.** Serverda ishlayotgan bo'lsa, kompyuterda
ham ishga tushirmang — bitta botni ikki joydan tinglab bo'lmaydi.

> Kodni o'zgartirsak, Render va Vercel **o'zi** qayta quradi. Qo'lda hech narsa
> qilish kerak emas.
