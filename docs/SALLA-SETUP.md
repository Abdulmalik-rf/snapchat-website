# إعداد سلة (Salla)

يحتاج الموقع من سلة شيئين: **رابط منتج لكل باقة** و **Webhook** يخبر الموقع عند إتمام الشراء.

## 1) إنشاء المنتجات الثلاثة

في لوحة تحكم المتجر أنشئ ثلاثة منتجات (رقمية / خدمة) بنفس الأسعار:

| الباقة | السعر | المتغيّر في `.env` |
| --- | --- | --- |
| 01 — تحليل جاهزية الحساب | 99 ريال | `SALLA_PRODUCT_URL_ANALYSIS` |
| 02 — التحليل + الخطة التسويقية | 499 ريال | `SALLA_PRODUCT_URL_PLAN` |
| 03 — التحليل + الخطة + متابعة مختص | 799 ريال | `SALLA_PRODUCT_URL_EXPERT` |

انسخ رابط صفحة كل منتج وضعه في متغير البيئة المقابل (أو في `src/content/site.ts` → `sallaUrl`).

> نصيحة: فعّل في إعدادات المنتج "الطلب يحتاج بريدًا إلكترونيًا" حتى نستطيع مطابقة الطلب مع بيانات النموذج.
> المطابقة تتم عبر **البريد الإلكتروني** الذي أدخله العميل في النموذج وفي سلة.

## 2) إعداد الـ Webhook

1. ادخل إلى [بوابة شركاء سلة](https://salla.partners) وأنشئ تطبيقًا خاصًا (Private App) لمتجرك، أو استخدم صفحة الـ Webhooks
   في لوحة المتجر إن كانت متاحة لخطتك.
2. أضف Webhook بالإعدادات التالية:
   - **URL:** `https://your-domain.com/api/webhooks/salla`
   - **الأحداث:** `order.created` و `order.status.updated` (و `order.payment.updated` إن وُجد).
   - **Security Strategy:** `Signature` (موصى به). ضع سرًا قويًا وانسخه إلى `SALLA_WEBHOOK_SECRET`.
     - إن اخترت `Token` ضع نفس القيمة في `SALLA_WEBHOOK_SECRET` واضبط `SALLA_WEBHOOK_STRATEGY=token`.
3. ثبّت التطبيق على المتجر.

### كيف يقرّر الموقع أن الطلب "مدفوع"؟

- يقبل الأحداث المذكورة في `SALLA_TRIGGER_EVENTS`.
- يتجاهل الطلب إن كانت حالته ضمن `SALLA_SKIP_STATUSES` (افتراضيًا: `payment_pending`, `canceled`, `restored`, `restoring`).
  فالطلب بتحويل بنكي يبقى `payment_pending` حتى يُؤكَّد، وعندها يصل حدث `order.status.updated` ونرسل البريد.
- كل طلب يُعالج **مرة واحدة فقط** (بمعرّف الطلب) حتى لو وصل الحدث مرتين.

### ماذا يحدث عند الشراء؟

1. بريد للمشتري: "تم استلام طلبك بنجاح ✅ … سنتواصل خلال 24 ساعة" مع رقم الطلب ورابط `/success?order=XXXX`.
2. بريد للإدارة (`ADMIN_EMAIL`) بتفاصيل الطلب + بيانات النموذج المطابقة (اسم مستخدم Snapchat، هل سبق التقديم…).
3. رسالة WhatsApp للمشتري إن كان WhatsApp Cloud API مضبوطًا.

## 3) اختبار الـ Webhook محليًا

```bash
# شغّل الموقع
pnpm dev

# احسب التوقيع وأرسل حدثًا تجريبيًا (استبدل السر)
SECRET=change-me
BODY='{"event":"order.created","merchant":1,"data":{"id":1001,"reference_id":48211,"status":{"slug":"under_review","name":"بانتظار المراجعة"},"customer":{"first_name":"محمد","last_name":"العلي","email":"test@example.com","mobile":"512345678","mobile_code":"+966"},"items":[{"name":"تحليل جاهزية الحساب","quantity":1}],"amounts":{"total":{"amount":99,"currency":"SAR"}}}}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')
curl -s -X POST http://localhost:3000/api/webhooks/salla \
  -H "Content-Type: application/json" \
  -H "X-Salla-Security-Strategy: signature" \
  -H "X-Salla-Signature: $SIG" \
  --data "$BODY"
```

بدون `RESEND_API_KEY` تُطبع الرسائل في سجل الخادم (Dry-run) بدل إرسالها.

## 4) صفحة الشكر في سلة (اختياري)

إن كانت قالب/خطة متجرك تسمح بتحويل العميل بعد الدفع إلى رابط خارجي، استخدم:
`https://your-domain.com/success?order={order_reference}` — وإلا فسيصل العميل إلى نفس الصفحة من رابط البريد.
