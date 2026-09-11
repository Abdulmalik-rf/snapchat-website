"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** بطاقة بميلان 3D خفيف يتبع المؤشر. على الجوال تبقى ثابتة. */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 20 });

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType === "touch") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 1000 }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
