"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="container-x pt-3 md:pt-4">
        <nav
          aria-label="التنقل الرئيسي"
          className={cn(
            "flex h-14 items-center justify-between rounded-full px-3 ps-4 transition-all duration-500 md:h-16 md:px-4 md:ps-5",
            scrolled || open ? "glass-strong" : "border border-transparent",
          )}
        >
          <Link href="#top" aria-label={`${site.brand.name} — الصفحة الرئيسية`} onClick={() => setOpen(false)}>
            <Logo compact />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-sm text-fog/80 transition hover:bg-white/5 hover:text-fog"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button href="#packages" size="md">
              اطلب الآن
            </Button>
            <button
              type="button"
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fog hover:bg-white/10 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="container-x mt-2 md:hidden"
          >
            <div className="glass-strong rounded-3xl p-3">
              <ul className="flex flex-col">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-base text-fog/90 hover:bg-white/5"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Button href="#packages" size="lg" className="mt-2 w-full" onClick={() => setOpen(false)}>
                اطلب الآن
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
