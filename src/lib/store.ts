import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";
import type { Lead } from "@/lib/validation";

export interface LeadRecord extends Lead {
  id: string;
  createdAt: string;
  ip?: string;
  userAgent?: string;
}

export interface Store {
  saveLead(lead: LeadRecord): Promise<void>;
  /** آخر نموذج أُرسل بهذا البريد */
  findLeadByEmail(email: string): Promise<LeadRecord | null>;
  /** يعيد true إذا كان الطلب جديدًا (لم يُعالج من قبل) */
  markOrderProcessed(key: string, meta: Record<string, unknown>): Promise<boolean>;
  unmarkOrder(key: string): Promise<void>;
  /** عدّاد بسيط لحدّ الطلبات: يعيد العدد الحالي داخل النافذة */
  incrementCounter(key: string, windowSeconds: number): Promise<number>;
}

const LEAD_TTL = 60 * 60 * 24 * 90; // 90 يومًا
const ORDER_TTL = 60 * 60 * 24 * 365;

/* ---------- Upstash Redis ---------- */
function createRedisStore(redis: Redis): Store {
  return {
    async saveLead(lead) {
      const email = lead.email.toLowerCase();
      await Promise.all([
        redis.set(`lead:${lead.id}`, lead, { ex: LEAD_TTL }),
        redis.set(`lead:email:${email}`, lead.id, { ex: LEAD_TTL }),
        redis.lpush("leads", lead.id),
      ]);
    },
    async findLeadByEmail(email) {
      const id = await redis.get<string>(`lead:email:${email.toLowerCase()}`);
      if (!id) return null;
      return (await redis.get<LeadRecord>(`lead:${id}`)) ?? null;
    },
    async markOrderProcessed(key, meta) {
      const res = await redis.set(`order:${key}`, { ...meta, processedAt: new Date().toISOString() }, { nx: true, ex: ORDER_TTL });
      return res === "OK";
    },
    async unmarkOrder(key) {
      await redis.del(`order:${key}`);
    },
    async incrementCounter(key, windowSeconds) {
      const n = await redis.incr(`rl:${key}`);
      if (n === 1) await redis.expire(`rl:${key}`, windowSeconds);
      return n;
    },
  };
}

/* ---------- ذاكرة (تطوير محلي / بدون Upstash) ---------- */
type MemoryState = {
  leads: Map<string, LeadRecord>;
  byEmail: Map<string, string>;
  orders: Map<string, Record<string, unknown>>;
  counters: Map<string, { n: number; exp: number }>;
};

const g = globalThis as unknown as { __snapreadyStore?: MemoryState };
function memoryState(): MemoryState {
  if (!g.__snapreadyStore) {
    g.__snapreadyStore = { leads: new Map(), byEmail: new Map(), orders: new Map(), counters: new Map() };
  }
  return g.__snapreadyStore;
}

function createMemoryStore(): Store {
  const s = memoryState();
  return {
    async saveLead(lead) {
      s.leads.set(lead.id, lead);
      s.byEmail.set(lead.email.toLowerCase(), lead.id);
    },
    async findLeadByEmail(email) {
      const id = s.byEmail.get(email.toLowerCase());
      return id ? (s.leads.get(id) ?? null) : null;
    },
    async markOrderProcessed(key, meta) {
      if (s.orders.has(key)) return false;
      s.orders.set(key, { ...meta, processedAt: new Date().toISOString() });
      return true;
    },
    async unmarkOrder(key) {
      s.orders.delete(key);
    },
    async incrementCounter(key, windowSeconds) {
      const now = Date.now();
      const cur = s.counters.get(key);
      if (!cur || cur.exp < now) {
        s.counters.set(key, { n: 1, exp: now + windowSeconds * 1000 });
        return 1;
      }
      cur.n += 1;
      return cur.n;
    },
  };
}

let cached: Store | null = null;
export function getStore(): Store {
  if (cached) return cached;
  if (env.upstashUrl && env.upstashToken) {
    cached = createRedisStore(new Redis({ url: env.upstashUrl, token: env.upstashToken }));
  } else {
    if (env.isProd) {
      console.warn("[store] UPSTASH_REDIS_REST_URL غير مضبوط — يُستخدم تخزين مؤقت في الذاكرة (لا يدوم بين الطلبات على Serverless).");
    }
    cached = createMemoryStore();
  }
  return cached;
}
