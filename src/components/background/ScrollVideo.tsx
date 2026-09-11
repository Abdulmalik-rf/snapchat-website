"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  /** مسار MP4 (H.264). اتركه فارغًا لعرض الخلفية البديلة */
  src?: string;
  /** مسار WebM اختياري (أخف حجمًا) */
  webmSrc?: string;
  poster?: string;
  /** scrub: يتقدّم الفيديو مع التمرير — autoplay: تشغيل تلقائي صامت */
  mode?: "scrub" | "autoplay";
};

/**
 * خلفية فيديو ثابتة خلف كل الصفحة.
 * في وضع scrub يُربط currentTime بنسبة التمرير مع تنعيم (lerp) لحركة سلسة.
 * لتحسين السلاسة: صدّر الفيديو بمفاتيح إطارات متكرّرة (انظر docs/VIDEO.md).
 */
export function ScrollVideo({ src, webmSrc, poster, mode = "scrub" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const hasVideo = Boolean(src || webmSrc);

  useEffect(() => {
    const video = ref.current;
    if (!video || !hasVideo) return;

    if (mode === "autoplay" || reduced) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    // وضع Scrub
    video.pause();
    let raf = 0;
    let target = 0;
    let current = 0;
    let running = false;

    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      current += (target - current) * 0.1;
      const d = video.duration;
      if (Number.isFinite(d) && d > 0) {
        const t = current * (d - 0.05);
        if (Math.abs(video.currentTime - t) > 0.005) video.currentTime = t;
      }
      if (Math.abs(target - current) > 0.0005) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    // Safari/iOS يحتاج أحيانًا load() صريحًا قبل السماح بالـ seek
    video.load();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    measure();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [hasVideo, mode, reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {hasVideo ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: ready ? 1 : 0 }}
          muted
          playsInline
          preload="auto"
          poster={poster || undefined}
          onLoadedData={() => setReady(true)}
          autoPlay={mode === "autoplay"}
          loop={mode === "autoplay"}
        >
          {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
          {src ? <source src={src} type="video/mp4" /> : null}
        </video>
      ) : (
        <FallbackBackdrop />
      )}

      {/* طبقة تعتيم متدرّجة لضمان قراءة النص فوق الفيديو */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(10,10,12,0.35),rgba(10,10,12,0.85)_60%,#0a0a0c_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
    </div>
  );
}

/** خلفية متحركة بديلة حتى يصل فيديو العميل: بقع ضوء صفراء تتحرّك ببطء + نسيج خفيف */
function FallbackBackdrop() {
  return (
    <div className="noise absolute inset-0">
      <div className="absolute -top-40 -end-40 h-[60vh] w-[60vh] rounded-full bg-snap/20 blur-[120px] animate-blob" />
      <div
        className="absolute top-1/3 -start-40 h-[50vh] w-[50vh] rounded-full bg-snap/10 blur-[110px] animate-blob"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="absolute -bottom-40 end-1/4 h-[55vh] w-[55vh] rounded-full bg-white/5 blur-[120px] animate-blob"
        style={{ animationDelay: "-15s" }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
