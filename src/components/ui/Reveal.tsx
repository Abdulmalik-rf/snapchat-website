"use client";

import { motion, type Variants } from "motion/react";

/**
 * كشف العناصر عند دخولها الشاشة.
 * - نفس الشجرة في الخادم والمتصفح (لا فروع حسب reduced-motion) لتفادي بقاء opacity:0 بعد الـ hydration.
 * - MotionConfig reducedMotion="user" في Providers يعطّل الحركة تلقائيًا لمن فعّل "تقليل الحركة".
 * - data-reveal + CSS في globals.css يجعل المحتوى ظاهرًا بالكامل عند تعطيل JavaScript (زواحف/بوتات).
 */
const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const viewport = { once: true, margin: "0px 0px -10% 0px" } as const;

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const Comp = motion[as];
  return (
    <Comp
      data-reveal=""
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/** حاوية تُظهر أبناءها بالتتابع (stagger) */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div data-reveal="" className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
