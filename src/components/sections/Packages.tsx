"use client";

import { Check, Crown } from "lucide-react";
import { site } from "@/content/site";
import { cn, formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Button } from "@/components/ui/Button";
import { useOrder } from "@/components/order/OrderProvider";

/** العنصر 10 — الأسعار وزر إجراء واحد بكلمات بسيطة */
export function Packages() {
  const { open } = useOrder();

  return (
    <section id="packages" className="section-pad scroll-mt-24">
      <Container>
        <SectionHeading
          id="packages-title"
          eyebrow="الباقات"
          title={site.packagesSection.title}
          subtitle={site.packagesSection.subtitle}
        />

        <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {site.packages.map((p) => (
            <RevealItem key={p.id} className={cn(p.highlight && "lg:-mt-4 lg:mb-4")}>
              <TiltCard className="h-full">
                <article
                  aria-labelledby={`pkg-${p.id}`}
                  className={cn(
                    "relative flex h-full flex-col rounded-[2rem] p-6 md:p-7",
                    p.highlight
                      ? "border border-snap/50 bg-gradient-to-b from-snap/15 to-ink/60 shadow-glow backdrop-blur-xl"
                      : "glass",
                  )}
                >
                  {p.badge && (
                    <span className="absolute -top-3.5 start-6 inline-flex items-center gap-1 rounded-full bg-snap px-3 py-1 text-xs font-bold text-ink">
                      <Crown className="h-3.5 w-3.5" /> {p.badge}
                    </span>
                  )}
                  <span className="nums text-sm font-semibold text-mist">{p.number}</span>
                  <h3 id={`pkg-${p.id}`} className="mt-1 text-xl font-bold leading-snug md:text-2xl">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-mist">{p.tagline}</p>

                  <p className="mt-6 flex items-baseline gap-1.5">
                    <span className="nums text-5xl font-bold tracking-tight text-fog">{formatPrice(p.price)}</span>
                    <span className="text-base font-semibold text-mist">{p.currency}</span>
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-fog/90">
                        <span
                          className={cn(
                            "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            p.highlight ? "bg-snap text-ink" : "bg-white/10 text-snap",
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    variant={p.highlight ? "primary" : "secondary"}
                    className="mt-8 w-full"
                    onClick={() => open(p.id)}
                    aria-label={`${p.cta} — ${p.name} بسعر ${formatPrice(p.price)} ${p.currency}`}
                  >
                    {p.cta}
                  </Button>
                </article>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-6 text-center text-xs text-mist-700">{site.packagesSection.note}</p>
      </Container>
    </section>
  );
}
