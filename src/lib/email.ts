import { Resend } from "resend";
import { env, configured } from "@/lib/env";

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

let client: Resend | null = null;
function resend() {
  if (!client) client = new Resend(env.resendApiKey);
  return client;
}

/**
 * يرسل عبر Resend عند ضبط RESEND_API_KEY، وإلا يطبع الرسالة في السجل (وضع التطوير).
 * يعيد معرّف الرسالة أو null.
 */
export async function sendEmail(msg: EmailMessage): Promise<string | null> {
  if (!configured.email) {
    console.info(`[email:dry-run] to=${Array.isArray(msg.to) ? msg.to.join(",") : msg.to} subject="${msg.subject}"\n${msg.text}`);
    return null;
  }
  const { data, error } = await resend().emails.send({
    from: env.emailFrom,
    to: msg.to,
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
    replyTo: msg.replyTo,
  });
  if (error) throw new Error(`[email] ${error.name}: ${error.message}`);
  return data?.id ?? null;
}
