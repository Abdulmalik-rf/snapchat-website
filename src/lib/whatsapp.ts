import { env, configured } from "@/lib/env";

/**
 * إشعار WhatsApp عبر Meta Cloud API برسالة قالب (Template) معتمدة.
 * يعمل فقط عند ضبط WHATSAPP_TOKEN و WHATSAPP_PHONE_ID و WHATSAPP_TEMPLATE_NAME.
 * القالب المتوقع يحتوي متغيرين في النص: {{1}} = اسم العميل، {{2}} = رقم الطلب.
 */
export async function sendWhatsAppOrderNotice(to: string, name: string, orderRef: string): Promise<boolean> {
  if (!configured.whatsapp) {
    console.info(`[whatsapp:dry-run] to=${to} name=${name} order=${orderRef}`);
    return false;
  }
  const res = await fetch(`https://graph.facebook.com/v21.0/${env.waPhoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.waToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: env.waTemplate,
        language: { code: env.waTemplateLang },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: name || "عميلنا" },
              { type: "text", text: orderRef },
            ],
          },
        ],
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`[whatsapp] ${res.status}: ${body.slice(0, 300)}`);
  }
  return true;
}
