import { getStore } from "@/lib/store";

/** حدّ بسيط: `limit` طلبات لكل `windowSeconds` لكل مفتاح (عادةً IP) */
export async function rateLimit(key: string, limit = 6, windowSeconds = 600): Promise<boolean> {
  try {
    const n = await getStore().incrementCounter(key, windowSeconds);
    return n <= limit;
  } catch (err) {
    console.error("[rate-limit] failed, allowing request", err);
    return true;
  }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
