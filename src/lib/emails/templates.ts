import { site } from "@/content/site";
import { getPackage } from "@/lib/packages";
import { formatPrice } from "@/lib/utils";
import type { LeadRecord } from "@/lib/store";
import type { SallaOrder } from "@/lib/salla";
import { getCustomerEmail, getCustomerName, getCustomerMobile, getOrderRef, getOrderTotal } from "@/lib/salla";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

/** قالب HTML عربي RTL بسيط ومتوافق مع عملاء البريد */
function shell(title: string, body: string, footer = "") {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:#f4f4f5;font-family:'IBM Plex Sans Arabic','Segoe UI',Tahoma,Arial,sans-serif;color:#0a0a0c;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e4e4e7;">
        <tr><td style="background:#0a0a0c;padding:20px 24px;">
          <span style="display:inline-block;background:#fffc00;color:#0a0a0c;font-weight:700;border-radius:999px;padding:6px 14px;font-size:14px;">${esc(site.brand.name)}</span>
          <span style="color:#a1a1aa;font-size:13px;margin-inline-start:10px;">${esc(site.brand.nameAr)}</span>
        </td></tr>
        <tr><td style="padding:28px 24px;font-size:16px;line-height:1.9;">${body}</td></tr>
        <tr><td style="padding:16px 24px;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a;line-height:1.7;">
          ${footer}
          <div style="margin-top:8px;">${esc(site.footer.disclaimer)}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function row(label: string, value: string) {
  return `<tr><td style="padding:8px 0;color:#71717a;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(label)}</td><td style="padding:8px 12px;font-weight:600;font-size:14px;">${esc(value)}</td></tr>`;
}

/* ---------- 1) للإدارة: نموذج جديد قبل الدفع ---------- */
export function leadAdminEmail(lead: LeadRecord) {
  const pkg = getPackage(lead.packageId);
  const subject = `طلب جديد (قبل الدفع): ${lead.fullName} — ${pkg.name}`;
  const text = [
    `طلب جديد من نموذج الموقع (لم يُدفع بعد):`,
    `الاسم: ${lead.fullName}`,
    `البريد: ${lead.email}`,
    `Snapchat: @${lead.snapUsername}`,
    `الباقة: ${pkg.number} — ${pkg.name} (${formatPrice(pkg.price)} ${pkg.currency})`,
    `سبق التقديم؟ ${lead.appliedBefore === "yes" ? "نعم" : "لا"}`,
    lead.appliedNote ? `ملاحظة: ${lead.appliedNote}` : "",
    `الوقت: ${lead.createdAt}`,
    `المعرّف: ${lead.id}`,
  ]
    .filter(Boolean)
    .join("\n");
  const html = shell(
    subject,
    `<h1 style="font-size:20px;margin:0 0 12px;">طلب جديد من الموقع</h1>
     <p style="margin:0 0 16px;color:#52525b;">أرسل العميل بياناته وتم تحويله إلى سلة لإتمام الدفع. سيصلك بريد آخر عند تأكيد الشراء.</p>
     <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-top:1px solid #e4e4e7;">
       ${row("الاسم", lead.fullName)}
       ${row("البريد", lead.email)}
       ${row("Snapchat", `@${lead.snapUsername}`)}
       ${row("الباقة", `${pkg.number} — ${pkg.name} (${formatPrice(pkg.price)} ${pkg.currency})`)}
       ${row("سبق التقديم؟", lead.appliedBefore === "yes" ? "نعم" : "لا")}
       ${lead.appliedNote ? row("ملاحظة", lead.appliedNote) : ""}
       ${row("الوقت", lead.createdAt)}
     </table>`,
    `المعرّف: ${esc(lead.id)}`,
  );
  return { subject, html, text };
}

/* ---------- 2) للمشتري: شكرًا لشرائك ---------- */
export function orderThankYouEmail(order: SallaOrder, successUrl: string) {
  const name = getCustomerName(order) || "عميلنا العزيز";
  const ref = getOrderRef(order);
  const subject = `${site.success.title} — رقم الطلب #${ref}`;
  const text = [
    `مرحبًا ${name}،`,
    ``,
    `شكرًا لشرائك من ${site.brand.name}.`,
    site.success.text,
    site.success.detail,
    ``,
    `${site.success.orderLabel}: #${ref}`,
    ``,
    `سنتواصل معك خلال 24 ساعة.`,
    `تفاصيل الطلب: ${successUrl}`,
  ].join("\n");
  const html = shell(
    subject,
    `<h1 style="font-size:22px;margin:0 0 8px;">${esc(site.success.title)}</h1>
     <p style="margin:0 0 6px;">مرحبًا <strong>${esc(name)}</strong>، شكرًا لشرائك من ${esc(site.brand.name)}.</p>
     <p style="margin:0 0 6px;">${esc(site.success.text)}</p>
     <p style="margin:0 0 18px;color:#52525b;">${esc(site.success.detail)}</p>
     <div style="background:#fffc00;border-radius:14px;padding:14px 18px;display:inline-block;">
       <span style="font-size:13px;color:#3f3f46;">${esc(site.success.orderLabel)}</span><br>
       <span style="font-size:22px;font-weight:700;letter-spacing:.5px;direction:ltr;unicode-bidi:embed;">#${esc(ref)}</span>
     </div>
     <p style="margin:22px 0 0;"><a href="${esc(successUrl)}" style="display:inline-block;background:#0a0a0c;color:#fffc00;text-decoration:none;font-weight:700;border-radius:999px;padding:12px 22px;">عرض تفاصيل الطلب</a></p>`,
    `هذه الرسالة أُرسلت تلقائيًا بعد تأكيد الطلب. للاستفسار ردّ على هذا البريد أو راسلنا عبر WhatsApp.`,
  );
  return { subject, html, text };
}

/* ---------- 3) للإدارة: تم الدفع ---------- */
export function orderAdminEmail(order: SallaOrder, lead: LeadRecord | null, event: string) {
  const ref = getOrderRef(order);
  const name = getCustomerName(order);
  const email = getCustomerEmail(order) ?? "—";
  const mobile = getCustomerMobile(order) ?? "—";
  const total = getOrderTotal(order);
  const items = (order.items ?? []).map((i) => `${i.name ?? i.product?.name ?? "منتج"} ×${i.quantity ?? 1}`).join("، ") || "—";
  const pkg = lead ? getPackage(lead.packageId) : null;
  const subject = `✅ طلب مدفوع #${ref} — ${name || email}`;
  const text = [
    `طلب جديد مدفوع من سلة (${event})`,
    `رقم الطلب: #${ref}`,
    `العميل: ${name || "—"}`,
    `البريد: ${email}`,
    `الجوال: ${mobile}`,
    `المنتجات: ${items}`,
    `الإجمالي: ${total ?? "—"}`,
    `الحالة: ${order.status?.slug ?? order.status?.name ?? "—"}`,
    ``,
    lead
      ? [
          `بيانات النموذج المطابقة:`,
          `Snapchat: @${lead.snapUsername}`,
          `الباقة المختارة في النموذج: ${pkg?.name ?? lead.packageId}`,
          `سبق التقديم؟ ${lead.appliedBefore === "yes" ? "نعم" : "لا"}`,
          lead.appliedNote ? `ملاحظة: ${lead.appliedNote}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      : `لم يُعثر على نموذج بنفس البريد — تواصل مع العميل للحصول على اسم مستخدم Snapchat.`,
    order.urls?.admin ? `\nفتح الطلب في لوحة سلة: ${order.urls.admin}` : "",
  ].join("\n");
  const html = shell(
    subject,
    `<h1 style="font-size:20px;margin:0 0 12px;">طلب مدفوع جديد من سلة</h1>
     <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-top:1px solid #e4e4e7;">
       ${row("رقم الطلب", `#${ref}`)}
       ${row("العميل", name || "—")}
       ${row("البريد", email)}
       ${row("الجوال", mobile)}
       ${row("المنتجات", items)}
       ${row("الإجمالي", total ?? "—")}
       ${row("الحالة", order.status?.slug ?? order.status?.name ?? "—")}
       ${row("الحدث", event)}
     </table>
     <h2 style="font-size:16px;margin:20px 0 8px;">بيانات النموذج</h2>
     ${
       lead
         ? `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-top:1px solid #e4e4e7;">
             ${row("Snapchat", `@${lead.snapUsername}`)}
             ${row("الباقة في النموذج", pkg?.name ?? lead.packageId)}
             ${row("سبق التقديم؟", lead.appliedBefore === "yes" ? "نعم" : "لا")}
             ${lead.appliedNote ? row("ملاحظة", lead.appliedNote) : ""}
             ${row("وقت النموذج", lead.createdAt)}
           </table>`
         : `<p style="margin:0;color:#b45309;background:#fef3c7;border-radius:12px;padding:10px 14px;">لم يُعثر على نموذج بنفس البريد الإلكتروني. تواصل مع العميل للحصول على اسم مستخدم Snapchat.</p>`
     }
     ${order.urls?.admin ? `<p style="margin:20px 0 0;"><a href="${esc(order.urls.admin)}" style="display:inline-block;background:#0a0a0c;color:#fffc00;text-decoration:none;font-weight:700;border-radius:999px;padding:10px 20px;">فتح الطلب في لوحة سلة</a></p>` : ""}`,
  );
  return { subject, html, text };
}
