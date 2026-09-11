import { NextResponse } from "next/server";
import { site } from "@/content/site";
import { env, configured } from "@/lib/env";
import { getStore } from "@/lib/store";
import { sendEmail } from "@/lib/email";
import { orderThankYouEmail, orderAdminEmail } from "@/lib/emails/templates";
import { sendWhatsAppOrderNotice } from "@/lib/whatsapp";
import {
  verifySallaSignature,
  verifySallaToken,
  getCustomerEmail,
  getCustomerMobile,
  getCustomerName,
  getOrderRef,
  getStatusSlug,
  type SallaWebhookPayload,
} from "@/lib/salla";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/salla
 * يستقبل أحداث الطلبات من سلة. عند طلب مدفوع (أو خرج من حالة انتظار الدفع) يرسل:
 *  1) بريد "شكرًا لشرائك — سنتواصل خلال 24 ساعة" للمشتري (+ WhatsApp إن كان مفعّلًا)
 *  2) بريدًا للإدارة مع بيانات النموذج المطابقة بالبريد الإلكتروني
 * يمنع التكرار برقم الطلب.
 */
export async function POST(req: Request) {
  const raw = await req.text();

  // 1) التحقق من المصدر
  if (configured.sallaWebhook) {
    const headerStrategy = (req.headers.get("x-salla-security-strategy") ?? "").toLowerCase();
    const strategy = env.sallaStrategy === "auto" ? (headerStrategy === "token" ? "token" : "signature") : env.sallaStrategy;
    const ok =
      strategy === "token"
        ? verifySallaToken(req.headers.get("authorization"), env.sallaWebhookSecret)
        : verifySallaSignature(raw, req.headers.get("x-salla-signature"), env.sallaWebhookSecret);
    if (!ok) return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  } else if (env.isProd) {
    console.error("[salla] SALLA_WEBHOOK_SECRET غير مضبوط — رُفض الطلب.");
    return NextResponse.json({ ok: false, error: "webhook not configured" }, { status: 503 });
  }

  // 2) قراءة الحمولة
  let payload: SallaWebhookPayload;
  try {
    payload = JSON.parse(raw) as SallaWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  const event = payload?.event ?? "";
  const order = payload?.data;
  if (!event.startsWith("order.") || !order || order.id === undefined) {
    return NextResponse.json({ ok: true, ignored: true, event });
  }
  if (!env.sallaTriggerEvents.includes(event)) {
    return NextResponse.json({ ok: true, ignored: true, event });
  }

  const status = getStatusSlug(order);
  if (env.sallaSkipStatuses.includes(status)) {
    return NextResponse.json({ ok: true, skipped: true, status });
  }

  // 3) منع التكرار
  const store = getStore();
  const key = `salla:${order.id}`;
  const fresh = await store.markOrderProcessed(key, { event, ref: getOrderRef(order), status });
  if (!fresh) return NextResponse.json({ ok: true, duplicate: true });

  // 4) الإشعارات
  const ref = getOrderRef(order);
  const email = getCustomerEmail(order);
  const name = getCustomerName(order);
  const mobile = getCustomerMobile(order);
  const successUrl = `${site.brand.url}/success?order=${encodeURIComponent(ref)}`;
  const lead = email ? await store.findLeadByEmail(email).catch(() => null) : null;

  const tasks: Array<Promise<unknown>> = [];
  if (email) tasks.push(sendEmail({ to: email, ...orderThankYouEmail(order, successUrl) }));
  if (configured.adminEmail) tasks.push(sendEmail({ to: env.adminEmail, replyTo: email ?? undefined, ...orderAdminEmail(order, lead, event) }));
  if (mobile) tasks.push(sendWhatsAppOrderNotice(mobile, name, ref));

  const results = await Promise.allSettled(tasks);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  failures.forEach((f) => console.error("[salla] notification failed:", f.reason));

  // إذا فشل بريد المشتري تحديدًا نُلغي علامة المعالجة ليعيد سلة المحاولة
  if (email && results[0]?.status === "rejected") {
    await store.unmarkOrder(key).catch(() => {});
    return NextResponse.json({ ok: false, error: "customer email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, order: ref, notified: { email: Boolean(email), admin: configured.adminEmail, whatsapp: Boolean(mobile && configured.whatsapp) }, leadMatched: Boolean(lead) });
}

/** فحص سريع أن المسار يعمل (لا يكشف أسرارًا) */
export async function GET() {
  return NextResponse.json({ ok: true, service: "salla-webhook", configured: configured.sallaWebhook });
}
