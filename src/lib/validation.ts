import { z } from "zod";
import { PACKAGE_IDS } from "@/lib/packages";

/** مخطط نموذج الطلب — يُستخدم في المتصفح والخادم معًا */
export const leadSchema = z.object({
  fullName: z
    .string({ error: "أدخل اسمك الكامل" })
    .trim()
    .min(2, { error: "الاسم قصير جدًا" })
    .max(80, { error: "الاسم طويل جدًا" }),
  email: z
    .email({ error: "أدخل بريدًا إلكترونيًا صحيحًا" })
    .trim()
    .max(120, { error: "البريد طويل جدًا" })
    .transform((v) => v.toLowerCase()),
  snapUsername: z
    .string({ error: "أدخل اسم المستخدم في Snapchat" })
    .trim()
    .transform((v) => v.replace(/^@+/, ""))
    .pipe(
      z
        .string()
        .min(3, { error: "اسم المستخدم قصير جدًا" })
        .max(30, { error: "اسم المستخدم طويل جدًا" })
        .regex(/^[a-zA-Z0-9._-]+$/, { error: "اسم المستخدم يحتوي أحرفًا غير مسموحة" }),
    ),
  packageId: z.enum(PACKAGE_IDS, { error: "اختر الباقة" }),
  appliedBefore: z.enum(["yes", "no"], { error: "حدّد هل سبق لك التقديم" }),
  appliedNote: z.string().trim().max(500, { error: "الملاحظة طويلة جدًا" }).optional().default(""),
  /** Honeypot — يجب أن يبقى فارغًا (البشر لا يرونه). يُفحص في المسار وليس هنا حتى لا يكشف الخطأ وجوده. */
  website: z.string().max(200).optional().default(""),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

export function toFieldErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path[0] as keyof LeadInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
