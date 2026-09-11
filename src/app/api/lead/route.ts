import { NextResponse } from "next/server";
import { site } from "@/content/site";
import { leadSchema, toFieldErrors } from "@/lib/validation";
import { getSallaUrl } from "@/lib/packages";
import { getStore, type LeadRecord } from "@/lib/store";
import { sendEmail } from "@/lib/email";
import { leadAdminEmail } from "@/lib/emails/templates";
import { env, configured } from "@/lib/env";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * POST /api/lead
 * يستقبل نموذج الطلب، يحفظه، يُبلغ الإدارة بالبريد، ثم يعيد رابط منتج سلة للتحويل.
 * الحفظ/البريد "أفضل جهد": فشلهما لا يمنع العميل من الوصول إلى الدفع.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!(await rateLimit(`lead:${ip}`))) {
    return NextResponse.json({ ok: false, error: "محاولات كثيرة. حاول مرة أخرى بعد قليل." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "تحقّق من البيانات المدخلة.", fieldErrors: toFieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  // Honeypot: بوت ملأ الحقل المخفي — نتظاهر بالنجاح دون حفظ
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, redirectUrl: site.brand.url });
  }

  const lead: LeadRecord = {
    ...parsed.data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ip,
    userAgent: req.headers.get("user-agent") ?? undefined,
  };
  const redirectUrl = getSallaUrl(lead.packageId);

  const tasks: Promise<unknown>[] = [getStore().saveLead(lead)];
  if (configured.adminEmail) {
    tasks.push(sendEmail({ to: env.adminEmail, replyTo: lead.email, ...leadAdminEmail(lead) }));
  } else if (!env.isProd) {
    console.info("[lead] ADMIN_EMAIL غير مضبوط — لن يُرسل بريد للإدارة.", leadAdminEmail(lead).text);
  }

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === "rejected") console.error("[lead] side-effect failed:", r.reason);
  }

  return NextResponse.json({ ok: true, redirectUrl, leadId: lead.id });
}
