# SnapReady — تحليل جاهزية حساب Snapchat للتوثيق

موقع صفحة واحدة عربي (RTL, Mobile-First) بهوية مستوحاة من Snapchat، مع "محرّك" طلبات متكامل مع
متجر **سلة**: نموذج → تحويل للدفع → Webhook بعد الشراء → بريد شكر تلقائي.

- **الخطة الكاملة والمراحل:** [`docs/PLAN.md`](docs/PLAN.md)
- **إعداد سلة والـ Webhook:** [`docs/SALLA-SETUP.md`](docs/SALLA-SETUP.md)
- **فيديو الخلفية:** [`docs/VIDEO.md`](docs/VIDEO.md)
- **النشر على Hostinger:** [`docs/DEPLOY-HOSTINGER.md`](docs/DEPLOY-HOSTINGER.md)

## التشغيل محليًا

```bash
pnpm install
cp .env.example .env.local   # عدّل القيم
pnpm dev                     # http://localhost:3000
```

بدون مفاتيح (Resend / Upstash) يعمل كل شيء في وضع تجريبي: النماذج تُحفظ في الذاكرة والرسائل تُطبع في السجل.

## أين أعدّل المحتوى؟

كل النصوص والأسعار والأسئلة الشائعة وبيانات الخبير في ملف واحد: `src/content/site.ts`.

| ما تريد تغييره | المكان |
| --- | --- |
| الأسعار / مميزات الباقات / روابط سلة | `site.packages` (أو متغيرات `SALLA_PRODUCT_URL_*`) |
| بيانات الخبير والصورة | `site.expert` + ضع الصورة في `public/` |
| قصص النجاح | `site.proof.cases` واجعل `isPlaceholder: false` |
| الأسئلة الشائعة | `site.faq.items` (تنعكس تلقائيًا في FAQPage schema) |
| تاريخ آخر تحديث | `site.lastUpdated` |
| رقم واتساب / البريد / الرابط | `site.brand` أو متغيرات `NEXT_PUBLIC_*` |

## البنية

```
src/
  app/
    page.tsx                  # تركيب الأقسام
    layout.tsx                # RTL + الخط + خلفية الفيديو + نموذج الطلب
    success/page.tsx          # صفحة "تم استلام طلبك" (?order=XXXX)
    api/lead/route.ts         # استقبال النموذج → حفظ + بريد للإدارة → رابط سلة
    api/webhooks/salla/route.ts # Webhook سلة → بريد شكر + إشعار إدارة (+ WhatsApp)
    api/health/route.ts       # حالة التكاملات
  components/
    sections/                 # Hero, AnswerBlock, ProblemSolution, HowItWorks, Packages,
                              # Deliverables, Expert, Proof, Comparison, Faq, FinalCta
    order/                    # OrderProvider (Context) + OrderDialog + OrderForm
    background/ScrollVideo.tsx
    seo/JsonLd.tsx
    ui/                       # Button, Reveal, TiltCard, SectionHeading, ...
  content/site.ts             # كل المحتوى والإعدادات
  lib/                        # env, store, email, salla, whatsapp, validation, rate-limit
```

## النشر على Hostinger

استضافة Node.js في hPanel: Build `npm run build`، Start `npm start`، Node 22، ومتغيرات البيئة من
`.env.example`. الدليل الكامل (وبديل الـ VPS عبر Docker) في [`docs/DEPLOY-HOSTINGER.md`](docs/DEPLOY-HOSTINGER.md).

## النشر (Vercel)

1. اربط المستودع بـ Vercel (Framework: Next.js).
2. أضف متغيرات البيئة من `.env.example`.
3. أنشئ قاعدة Upstash Redis من Vercel Marketplace (تُضاف المتغيرات تلقائيًا).
4. تحقّق من `https://your-domain.com/api/health` ثم أضف رابط الـ Webhook في سلة.

## صورة المشاركة (Open Graph)

`public/og.png` تُولَّد من محتوى `site.ts` عبر Chromium (لأن محرّك `next/og` لا يدعم تشكيل العربية وBidi):

```bash
pnpm og                       # يحتاج Google Chrome مثبّتًا
CHROME_PATH=/path/to/chrome pnpm og
```

أعد توليدها بعد تغيير العنوان أو الأسعار أو اسم العلامة.

## الجودة

```bash
pnpm lint          # ESLint
pnpm exec tsc --noEmit
pnpm build
```
