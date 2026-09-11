"use client";

import { useState } from "react";
import { ArrowLeft, Check, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { site, type PackageId } from "@/content/site";
import { leadSchema, toFieldErrors, type FieldErrors, type LeadInput } from "@/lib/validation";
import { cn, formatPrice, waLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-fog placeholder:text-mist-700 transition focus:border-snap/60 focus:bg-white/[0.07] focus:outline-none";

export function OrderForm({
  packageId,
  onPackageChange,
}: {
  packageId: PackageId;
  onPackageChange: (id: PackageId) => void;
}) {
  const [appliedBefore, setAppliedBefore] = useState<"yes" | "no" | "">("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const raw: LeadInput = {
      fullName: String(fd.get("fullName") ?? ""),
      email: String(fd.get("email") ?? ""),
      snapUsername: String(fd.get("snapUsername") ?? ""),
      packageId: String(fd.get("packageId") ?? "") as PackageId,
      appliedBefore: String(fd.get("appliedBefore") ?? "") as "yes" | "no",
      appliedNote: String(fd.get("appliedNote") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as { ok: boolean; redirectUrl?: string; error?: string; fieldErrors?: FieldErrors };
      if (!res.ok || !json.ok || !json.redirectUrl) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        throw new Error(json.error ?? "تعذّر إرسال الطلب");
      }
      window.location.assign(json.redirectUrl);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* الباقة */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-fog">{site.form.fields.packageId}</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {site.packages.map((p) => {
            const active = p.id === packageId;
            return (
              <label
                key={p.id}
                className={cn(
                  "relative cursor-pointer rounded-2xl border p-3 text-start transition",
                  active ? "border-snap bg-snap/10 shadow-glow" : "border-white/10 bg-white/5 hover:border-white/25",
                )}
              >
                <input
                  type="radio"
                  name="packageId"
                  value={p.id}
                  checked={active}
                  onChange={() => onPackageChange(p.id)}
                  className="sr-only"
                />
                <span className="block text-xs text-mist nums">{p.number}</span>
                <span className="mt-0.5 block text-sm font-semibold leading-snug">{p.name}</span>
                <span className="mt-1 block text-sm font-bold text-snap nums">
                  {formatPrice(p.price)} {p.currency}
                </span>
                {active && (
                  <span className="absolute end-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-snap text-ink">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </label>
            );
          })}
        </div>
        {errors.packageId && <p className="mt-1 text-xs text-bad">{errors.packageId}</p>}
      </fieldset>

      <Field label={site.form.fields.fullName} error={errors.fullName} htmlFor="fullName">
        <input id="fullName" name="fullName" autoComplete="name" className={inputCls} placeholder="مثال: محمد العلي" />
      </Field>

      <Field label={site.form.fields.email} error={errors.email} htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          className={cn(inputCls, "text-start")}
          placeholder="name@example.com"
        />
      </Field>

      <Field label={site.form.fields.snapUsername} error={errors.snapUsername} htmlFor="snapUsername">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-mist">@</span>
          <input
            id="snapUsername"
            name="snapUsername"
            autoComplete="off"
            autoCapitalize="none"
            dir="ltr"
            className={cn(inputCls, "ps-9 text-start")}
            placeholder="username"
          />
        </div>
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-fog">{site.form.fields.appliedBefore}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["yes", "no"] as const).map((v) => (
            <label
              key={v}
              className={cn(
                "cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition",
                appliedBefore === v ? "border-snap bg-snap/10 text-snap" : "border-white/10 bg-white/5 hover:border-white/25",
              )}
            >
              <input
                type="radio"
                name="appliedBefore"
                value={v}
                className="sr-only"
                checked={appliedBefore === v}
                onChange={() => setAppliedBefore(v)}
              />
              {v === "yes" ? site.form.yes : site.form.no}
            </label>
          ))}
        </div>
        {errors.appliedBefore && <p className="mt-1 text-xs text-bad">{errors.appliedBefore}</p>}
      </fieldset>

      {appliedBefore === "yes" && (
        <Field label={site.form.fields.appliedNote} error={errors.appliedNote} htmlFor="appliedNote" optional>
          <textarea
            id="appliedNote"
            name="appliedNote"
            rows={3}
            maxLength={500}
            className={cn(inputCls, "resize-none")}
            placeholder="مثال: قدّمت قبل شهرين ورُفض الطلب بدون ذكر السبب"
          />
        </Field>
      )}

      {/* Honeypot لصدّ البوتات — مخفي عن البشر */}
      <div className="absolute -start-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          لا تملأ هذا الحقل
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {serverError && (
        <div className="rounded-2xl border border-bad/30 bg-bad/10 p-3 text-sm text-fog">
          <p>{serverError}</p>
          <a
            href={waLink(site.brand.whatsapp, "مرحبًا، واجهت مشكلة أثناء إرسال طلب التحليل")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-snap underline-offset-4 hover:underline"
          >
            <MessageCircle className="h-4 w-4" /> تواصل معنا عبر WhatsApp
          </a>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> {site.form.submitting}
          </>
        ) : (
          <>
            {site.form.submit} <ArrowLeft className="h-5 w-5 rtl:rotate-0 ltr:rotate-180" />
          </>
        )}
      </Button>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-mist">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
        {site.form.privacy}
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-fog">
        {label} {optional && <span className="font-normal text-mist">(اختياري)</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-bad" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
