# النشر على Hostinger (نطاق مؤقت)

الموقع يحتوي مسارات API (نموذج الطلب + Webhook سلة)، لذا يحتاج خادم Node.js يعمل باستمرار.
على Hostinger الخيار المناسب هو **VPS** (أي خطة KVM). استضافة الويب المشتركة تشغّل PHP وملفات ثابتة
فقط ولن تعمل معها مسارات الـ API.

كل VPS في Hostinger يأتي بنطاق مؤقت جاهز بصيغة `srvXXXXXX.hstgr.cloud` يشير إلى عنوان الخادم،
وهو ما سنستخدمه حتى يُربط النطاق الحقيقي لاحقًا.

## ما ستحتاجه

- VPS على Hostinger (Ubuntu 24.04 أو أي قالب فيه Docker).
- عنوان IP وكلمة مرور root من hPanel → VPS → Overview، والنطاق المؤقت من نفس الصفحة.
- المستودع على GitHub (أو نسخة من المشروع تنقلها إلى الخادم).

> **الحصول على النطاق المؤقت عبر API (اختياري):**
> ```bash
> curl -s -H "Authorization: Bearer $HOSTINGER_API_TOKEN" \
>   https://developers.hostinger.com/api/vps/v1/virtual-machines | jq '.[] | {id, hostname, ipv4}'
> ```
> لا تضع الـ Token داخل الكود أو المحادثات؛ خزّنه في متغير بيئة على جهازك فقط.

## الطريقة 1 — سكربت واحد على الخادم (موصى بها)

```bash
ssh root@<IP_ADDRESS>

curl -fsSL https://raw.githubusercontent.com/Abdulmalik-rf/snapchat-website/main/deploy/hostinger-vps.sh \
  | bash -s -- --repo https://github.com/Abdulmalik-rf/snapchat-website --branch main --domain srvXXXXXX.hstgr.cloud
```

السكربت يقوم بـ:
1. تثبيت Docker إن لم يكن موجودًا.
2. سحب المستودع إلى `/opt/snapchat-website`.
3. إنشاء `.env` من `.env.example` وضبط `NEXT_PUBLIC_SITE_URL` و`SITE_DOMAIN`.
4. فتح المنفذين 80 و443، ثم `docker compose up -d --build` (التطبيق + Caddy بشهادة HTTPS تلقائية).

بعد التشغيل الأول، عدّل `/opt/snapchat-website/.env` بمفاتيح Resend وسلة وUpstash ثم:

```bash
cd /opt/snapchat-website && docker compose up -d --build
```

## الطريقة 2 — بدون GitHub (رفع الملفات يدويًا)

```bash
# من جهازك
rsync -az --exclude node_modules --exclude .next ./ root@<IP_ADDRESS>:/opt/snapchat-website/
ssh root@<IP_ADDRESS> "cd /opt/snapchat-website && bash deploy/hostinger-vps.sh --local --domain srvXXXXXX.hstgr.cloud"
```

## التحقق

- `https://srvXXXXXX.hstgr.cloud/api/health` يعرض حالة التكاملات.
- أضف رابط الـ Webhook في سلة: `https://srvXXXXXX.hstgr.cloud/api/webhooks/salla` (انظر `docs/SALLA-SETUP.md`).

## التحديث لاحقًا

```bash
ssh root@<IP_ADDRESS> "cd /opt/snapchat-website && git pull && docker compose up -d --build"
```

## ربط النطاق الحقيقي

1. في DNS النطاق أضف سجل `A` يشير إلى IP الخادم (و`A` لـ `www` إن أردت).
2. عدّل في `.env`: `SITE_DOMAIN=your-domain.com` و`NEXT_PUBLIC_SITE_URL=https://your-domain.com`.
3. `docker compose up -d --build` — سيُصدر Caddy الشهادة تلقائيًا.

## الملفات ذات الصلة

| الملف | الدور |
| --- | --- |
| `Dockerfile` | بناء متعدد المراحل، مخرجات Next "standalone"، يعمل كمستخدم غير root |
| `docker-compose.yml` | خدمة التطبيق + Caddy (HTTPS تلقائي) |
| `deploy/Caddyfile` | إعداد الـ reverse proxy والترويسات الأمنية |
| `deploy/hostinger-vps.sh` | سكربت التثبيت والتحديث |
