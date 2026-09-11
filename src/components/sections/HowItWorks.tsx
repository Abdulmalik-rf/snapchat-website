import { ListChecks, Send, CreditCard, ScanSearch, FileCheck2 } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const icons = [ListChecks, Send, CreditCard, ScanSearch, FileCheck2];

/** العنصر 7 — عنوان بصيغة سؤال + 5 خطوات */
export function HowItWorks() {
  return (
    <section id="how" className="section-pad scroll-mt-24">
      <Container>
        <SectionHeading id="how-title" eyebrow="الخطوات" title={site.how.title} subtitle={site.how.subtitle} />

        <RevealGroup className="relative mt-12 grid gap-4 md:grid-cols-5 md:gap-3">
          {/* خط يربط الخطوات على الشاشات الكبيرة */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[10%] top-9 hidden h-px bg-gradient-to-l from-transparent via-snap/40 to-transparent md:block"
          />
          {site.how.steps.map((s, i) => {
            const Icon = icons[i] ?? ListChecks;
            return (
              <RevealItem key={s.title} className="relative">
                <article className="glass group h-full rounded-[1.75rem] p-5 transition hover:border-snap/40">
                  <div className="flex items-center gap-3 md:flex-col md:items-start">
                    <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-700 text-snap ring-1 ring-white/10 transition group-hover:bg-snap group-hover:text-ink">
                      <Icon className="h-5 w-5" />
                      <span className="nums absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-snap text-xs font-bold text-ink">
                        {i + 1}
                      </span>
                    </span>
                    <h3 className="text-base font-bold">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{s.text}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
