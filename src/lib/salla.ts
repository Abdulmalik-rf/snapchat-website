import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * أنواع مبسّطة لحمولة Webhook سلة. الحقول اختيارية لأن الشكل يختلف قليلًا بين الأحداث.
 * المرجع: https://docs.salla.dev/ (Webhooks → Orders)
 */
export interface SallaOrder {
  id: number | string;
  reference_id?: number | string;
  status?: { id?: number; name?: string; slug?: string; customized?: { name?: string } };
  payment_method?: string;
  customer?: {
    id?: number;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    email?: string;
    mobile?: string | number;
    mobile_code?: string;
  };
  items?: Array<{
    id?: number;
    name?: string;
    sku?: string;
    quantity?: number;
    product?: { id?: number; name?: string; url?: string };
  }>;
  amounts?: { total?: { amount?: number; currency?: string } };
  date?: { date?: string };
  urls?: { customer?: string; admin?: string };
  [key: string]: unknown;
}

export interface SallaWebhookPayload {
  event: string;
  merchant?: number;
  created_at?: string;
  data: SallaOrder;
}

/** يتحقق من HMAC-SHA256(rawBody, secret) بصيغة hex كما ترسلها سلة في X-Salla-Signature */
export function verifySallaSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim().toLowerCase(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** استراتيجية Token: سلة ترسل السر نفسه في ترويسة Authorization */
export function verifySallaToken(authorization: string | null, secret: string): boolean {
  if (!authorization) return false;
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  const a = Buffer.from(token, "utf8");
  const b = Buffer.from(secret, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function getOrderRef(order: SallaOrder): string {
  return String(order.reference_id ?? order.id);
}

export function getCustomerEmail(order: SallaOrder): string | null {
  const e = order.customer?.email?.trim().toLowerCase();
  return e && e.includes("@") ? e : null;
}

export function getCustomerName(order: SallaOrder): string {
  const c = order.customer;
  if (!c) return "";
  return (c.full_name ?? [c.first_name, c.last_name].filter(Boolean).join(" ")).trim();
}

/** رقم الجوال بصيغة دولية بدون + (مناسب لـ WhatsApp Cloud API) */
export function getCustomerMobile(order: SallaOrder): string | null {
  const c = order.customer;
  if (!c?.mobile) return null;
  const code = (c.mobile_code ?? "").replace(/[^0-9]/g, "");
  let mobile = String(c.mobile).replace(/[^0-9]/g, "");
  if (!mobile) return null;
  if (code && mobile.startsWith(code)) return mobile;
  if (mobile.startsWith("0")) mobile = mobile.slice(1);
  return `${code}${mobile}`;
}

export function getOrderTotal(order: SallaOrder): string | null {
  const t = order.amounts?.total;
  if (!t || typeof t.amount !== "number") return null;
  return `${t.amount} ${t.currency ?? "SAR"}`;
}

export function getStatusSlug(order: SallaOrder): string {
  return (order.status?.slug ?? order.status?.name ?? "").toLowerCase();
}
