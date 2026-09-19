# Serverga yuklash

Hammasi **bitta Render xizmatida** turadi — alohida hosting (Vercel) kerak emas.

```
https://SIZNING-MANZIL.onrender.com          -> Mini App
https://SIZNING-MANZIL.onrender.com/admin    -> Admin Panel
https://SIZNING-MANZIL.onrender.com/api      -> API
```

Bitta manzil bo'lgani uchun CORS ham, manzillarni bir-biriga ulash ham
kerak emas.

---

## Bir marta qilinadigan ish

**Havola:** https://render.com/deploy?repo=https://github.com/usmoon07-blip/RESTO_DELIVERY

GitHub bilan kiring → **Authorize Render**. Render sozlamalarni loyihaning
o'zidan (`render.yaml`) o'qiydi, sizdan faqat **5 ta qiymat** so'raydi:

| Maydon | Nima yoziladi |
|---|---|
| `DATABASE_URL` | Neon manzilingiz |
| `DIRECT_URL` | Neon manzilingiz (`-pooler`siz) |
| `BOT_TOKEN` | Bot tokeni |
| `ADMIN_IDS` | Telegram ID raqamingiz |
| `ADMIN_PASSWORD` | Yangi kuchli parol |

**Apply** → 5–8 daqiqa (backend, Mini App va Admin Panel birga quriladi).

Tekshirish: manzilga `/api/health` qo'shib oching — `{"ok":true,...}` chiqsin.

---

## Keyin nima bo'ladi

GitHub'ga har yangi o'zgarish tushganda Render **o'zi qayta quradi**.
Qo'lda hech narsa qilish kerak emas.

Bot manzilni ham o'zi topadi: `WEB_APP_URL` yozilmagan bo'lsa, serverning
o'z manzili ishlatiladi.

---

## Uchta narsani bilib qo'ying

**1. Bepul Render 15 daqiqadan keyin uxlaydi.** Keyingi xabarda uyg'onadi,
lekin birinchi javob 30–60 soniya kechikadi.
*Yechim:* https://cron-job.org da har 10 daqiqada
`https://SIZNING-MANZIL.onrender.com/api/health` ni ochadigan vazifa yarating —
bepul. Yoki Render'da oyiga $7 to'lang.

**2. Yuklangan taom suratlari saqlanmaydi** — bepul Render har qayta ishga
tushganda diskni tozalaydi. Suratlarni qo'shishdan oldin ayting.

**3. `RESTO.bat` ni yopib qo'ying.** Serverda ishlayotgan bo'lsa,
kompyuterda ham ishga tushirmang — bitta botni ikki joydan tinglab bo'lmaydi.

---

## Alohida hostingda turg'izmoqchi bo'lsangiz

Mini App yoki Admin Panelni Vercel kabi joyda turg'izish ham mumkin —
kod buni qo'llab-quvvatlaydi:

- Frontendni qurganda `VITE_API_URL` ni Render manzili + `/api` qiling
- Render'da `CORS_ORIGINS` ga o'sha saytlar manzilini yozing
- Mini App alohida tursa, `WEB_APP_URL` ga uning manzilini yozing

Lekin bitta serverda ushlab turish soddaroq va xatolik kamroq bo'ladi.
