"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowDown, BadgeCheck, CheckCircle2, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * العنصر 1: H1 بصيغة سؤال — العنصر 2: العنوان الفرعي — العنصر 3: هوية الكاتب (Byline)
 */
export function Hero() {
  const fade = (delay: number) => ({
    "data-reveal": "",
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 md:pt-36">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-start">
            <motion.span
              {...fade(0)}
              className="inline-flex items-center gap-2 rounded-full border border-snap/30 bg-snap/10 px-3.5 py-1.5 text-xs font-semibold text-snap md:text-sm"
            >
              <Sparkles className="h-4 w-4" />
              {site.hero.eyebrow}
            </motion.span>

            <motion.h1
              {...fade(0.08)}
              className="text-balance mt-5 text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl"
            >
              {site.hero.h1.split("Snapchat").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="gradient-text">Snapchat</span>}
                </span>
              ))}
            </motion.h1>

            <motion.p
              {...fade(0.16)}
              className="text-balance mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mist md:text-xl lg:mx-0"
            >
              {site.hero.subheadline}
            </motion.p>

            {/* Byline — هوية الكاتب */}
            <motion.a
              {...fade(0.22)}
              href="#expert"
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pe-4 ps-1.5 text-start transition hover:border-snap/40 hover:bg-white/10"
            >
              <Image
                src={site.expert.image}
                alt={site.expert.imageAlt}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-snap/60"
              />
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-fog">{site.expert.name}</span>
                <span className="block text-xs text-mist">{site.expert.role}</span>
              </span>
              <BadgeCheck className="h-5 w-5 text-snap" aria-hidden="true" />
            </motion.a>

            <motion.div
              {...fade(0.3)}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button href="#packages" size="lg" className="pulse-ring relative w-full sm:w-auto">
                {site.hero.primaryCta}
              </Button>
              <Button href="#how" variant="secondary" size="lg" className="w-full sm:w-auto">
                {site.hero.secondaryCta}
              </Button>
            </motion.div>

            <motion.ul
              {...fade(0.4)}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-mist lg:justify-start"
            >
              {site.hero.trust.map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-ok" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            data-reveal=""
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm lg:max-w-md"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </Container>

      <a
        href="#answer"
        aria-label="انتقل إلى الأسفل"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-mist transition hover:text-snap md:block"
      >
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}

/** بطاقة "نتيجة التحليل" ثلاثية الأبعاد تطفو بجانب العنوان */
function HeroVisual() {
  const score = 68;
  const r = 54;
  const c = 2 * Math.PI * r;
  const items = [
    { label: "اكتمال بيانات الملف", ok: true },
    { label: "انتظام النشر", ok: true },
    { label: "وضوح الهوية البصرية", ok: false },
    { label: "معدل التفاعل", ok: false },
  ];
  return (
    <div className="relative [perspective:1200px]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-snap/20 blur-3xl" />
      <div className="glass animate-float rounded-[2rem] p-6 [transform:rotateX(6deg)_rotateY(-10deg)] md:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-mist">نتيجة التحليل — مثال</p>
            <p className="mt-1 text-lg font-bold">جاهزية الحساب</p>
          </div>
          <span className="rounded-full border border-warn/30 bg-warn/10 px-2.5 py-1 text-xs font-semibold text-warn">
            يحتاج تحسين
          </span>
        </div>

        <div className="mt-6 flex items-center gap-6">
          <div className="relative h-32 w-32 shrink-0">
            <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
              <circle cx="64" cy="64" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
              <motion.circle
                cx="64"
                cy="64"
                r={r}
                stroke="#fffc00"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: c - (c * score) / 100 }}
                transition={{ duration: 1.6, delay: 0.8, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="nums text-3xl font-bold">{score}%</span>
              <span className="text-[11px] text-mist">من 100</span>
            </div>
          </div>
          <ul className="flex-1 space-y-2.5">
            {items.map((it) => (
              <li key={it.label} className="flex items-center gap-2 text-sm">
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    it.ok ? "bg-ok/20 text-ok" : "bg-bad/20 text-bad"
                  }`}
                >
                  {it.ok ? "✓" : "!"}
                </span>
                <span className={it.ok ? "text-fog" : "text-mist"}>{it.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-snap/25 bg-snap/10 p-3 text-sm">
          <p className="font-semibold text-snap">الخطوة القادمة</p>
          <p className="mt-1 text-fog/90">توحيد الهوية البصرية خلال أسبوعين ثم إعادة قياس التفاعل.</p>
        </div>
      </div>

      <div className="glass absolute -bottom-5 -start-4 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm animate-float-slow md:flex">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-snap text-ink">
          <BadgeCheck className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-xs text-mist">التسليم</span>
          <span className="block font-semibold">خلال 24 ساعة</span>
        </span>
      </div>
    </div>
  );
}
