# النشر على Hostinger

الموقع تطبيق Next.js عادي: أمر بناء `npm run build` وأمر تشغيل `npm start`، ويستمع على المنفذ
الذي يمرّره المضيف في المتغير `PORT`. لذلك يعمل على **استضافة الويب في Hostinger التي تدعم Node.js**
بدون VPS. (الـ VPS خيار بديل في آخر هذا الملف.)

## الطريقة 1 — استضافة Node.js في hPanel (موصى بها)

1. في hPanel: **Websites → Add website → Node.js** (أو "Deploy Node.js app" حسب الخطة).
2. اختر **Import from GitHub** واربط مستودع `Abdulmalik-rf/snapchat-website` والفرع `main`
   (أو ارفع ملف ZIP للمشروع بدون `node_modules`).
3. الإعدادات:

   | الحقل | القيمة |
   | --- | --- |
   | Framework | Next.js |
   | Node version | 22 (ملف `.nvmrc` موجود) |
   | Root directory | `/` |
   | Build command | `npm run build` |
   | Start command | `npm start` |

4. **Environment variables** — انسخ ما تحتاجه من `.env.example`. الأهم:

   | المتغير | القيمة |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | النطاق المؤقت الذي يعطيك إياه Hostinger، مثال `https://xxxx.hostingersite.com` |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | رقم واتساب بصيغة دولية بدون + |
   | `SALLA_PRODUCT_URL_ANALYSIS` / `_PLAN` / `_EXPERT` | روابط منتجات سلة |
   | `SALLA_WEBHOOK_SECRET` | سرّ الـ Webhook من سلة |
   | `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL` | البريد |
   | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | التخزين (موصى به: بدونه تُحفظ النماذج في الذاكرة وتضيع عند إعادة التشغيل) |

5. اضغط **Deploy**. بعد الانتهاء افتح `https://<النطاق-المؤقت>/api/health` للتأكد من التكاملات.
6. أضف رابط الـ Webhook في سلة: `https://<النطاق-المؤقت>/api/webhooks/salla` (انظر `docs/SALLA-SETUP.md`).

ملاحظات:
- متغيرات `NEXT_PUBLIC_*` تُدمج وقت البناء؛ عند تغييرها أعد النشر (Redeploy).
- إن كانت الاستضافة تستخدم `npm` فستتجاهل `pnpm-lock.yaml` وتثبّت الإصدارات حسب `package.json`؛ هذا مقصود ويعمل.
- عند ربط النطاق الحقيقي لاحقًا غيّر `NEXT_PUBLIC_SITE_URL` وأعد النشر.

## الطريقة 2 — VPS عبر Docker (بديل)

كل VPS في Hostinger يأتي بنطاق مؤقت `srvXXXXXX.hstgr.cloud`. على الخادم:

```bash
ssh root@<IP_ADDRESS>
curl -fsSL https://raw.githubusercontent.com/Abdulmalik-rf/snapchat-website/main/deploy/hostinger-vps.sh \
  | bash -s -- --repo https://github.com/Abdulmalik-rf/snapchat-website --branch main --domain srvXXXXXX.hstgr.cloud
```

السكربت يثبّت Docker، يسحب المستودع إلى `/opt/snapchat-website`، ينشئ `.env`، ويشغّل التطبيق خلف Caddy
بشهادة HTTPS تلقائية. بدون GitHub: انسخ المشروع بـ `rsync` ثم `bash deploy/hostinger-vps.sh --local --domain ...`.
التحديث لاحقًا: `git pull && docker compose up -d --build`.

| الملف | الدور |
| --- | --- |
| `Dockerfile` | بناء متعدد المراحل بمخرجات "standalone" (تُفعَّل بـ `STANDALONE=1`) |
| `docker-compose.yml` + `deploy/Caddyfile` | التطبيق + Caddy (HTTPS تلقائي) |
| `deploy/hostinger-vps.sh` | سكربت التثبيت والتحديث |
