/** قراءة متغيرات البيئة في مكان واحد (الخادم فقط). لا تُصدَّر الأسرار للمتصفح. */
function str(key: string, fallback = ""): string {
  const v = process.env[key];
  return v && v.trim().length > 0 ? v.trim() : fallback;
}

export const env = {
  siteUrl: str("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  isProd: process.env.NODE_ENV === "production",

  // البريد
  resendApiKey: str("RESEND_API_KEY"),
  emailFrom: str("EMAIL_FROM", "SnapReady <onboarding@resend.dev>"),
  adminEmail: str("ADMIN_EMAIL"),

  // التخزين
  upstashUrl: str("UPSTASH_REDIS_REST_URL"),
  upstashToken: str("UPSTASH_REDIS_REST_TOKEN"),

  // سلة
  sallaWebhookSecret: str("SALLA_WEBHOOK_SECRET"),
  /** "auto" يقرأ الاستراتيجية من ترويسة x-salla-security-strategy، أو ثبّتها: "signature" | "token" */
  sallaStrategy: str("SALLA_WEBHOOK_STRATEGY", "auto") as "auto" | "signature" | "token",
  /** الأحداث التي تُطلق بريد الشكر */
  sallaTriggerEvents: str("SALLA_TRIGGER_EVENTS", "order.created,order.status.updated,order.payment.updated")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  /** حالات الطلب التي لا نرسل عندها (لم يُدفع بعد / أُلغي) */
  sallaSkipStatuses: str("SALLA_SKIP_STATUSES", "payment_pending,canceled,cancelled,restored,restoring")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // WhatsApp Cloud API (اختياري)
  waToken: str("WHATSAPP_TOKEN"),
  waPhoneId: str("WHATSAPP_PHONE_ID"),
  waTemplate: str("WHATSAPP_TEMPLATE_NAME"),
  waTemplateLang: str("WHATSAPP_TEMPLATE_LANG", "ar"),
} as const;

export const configured = {
  email: Boolean(env.resendApiKey),
  adminEmail: Boolean(env.adminEmail),
  store: Boolean(env.upstashUrl && env.upstashToken),
  sallaWebhook: Boolean(env.sallaWebhookSecret),
  whatsapp: Boolean(env.waToken && env.waPhoneId && env.waTemplate),
};
