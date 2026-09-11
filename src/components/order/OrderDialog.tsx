"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { PackageId } from "@/content/site";
import { site } from "@/content/site";
import { OrderForm } from "./OrderForm";

export function OrderDialog({
  open,
  onClose,
  packageId,
  onPackageChange,
}: {
  open: boolean;
  onClose: () => void;
  packageId: PackageId;
  onPackageChange: (id: PackageId) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // قفل التمرير + إغلاق بزر Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input, select, textarea, button")?.focus();
    }, 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="order-overlay"
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="إغلاق"
            onClick={onClose}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-title"
            className="glass-strong relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[2rem] md:max-w-xl md:rounded-[2rem]"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20 md:hidden" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4 px-5 pt-4 md:px-7 md:pt-6">
              <div>
                <h2 id="order-title" className="text-xl font-bold md:text-2xl">
                  {site.form.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-mist">{site.form.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق النموذج"
                className="-me-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-mist hover:bg-white/10 hover:text-fog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pb-6 pt-4 md:px-7 md:pb-7">
              <OrderForm packageId={packageId} onPackageChange={onPackageChange} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
