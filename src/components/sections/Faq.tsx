import { ChevronDown } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** العنصر 11 — الأسئلة الشائعة. عناصر <details> أصلية: المحتوى موجود في HTML وغير مخفي عن الزواحف */
export function Faq() {
  return (
    <section id="faq" className="section-pad scroll-mt-24">
      <Container>
        <SectionHeading id="faq-title" eyebrow="الأسئلة" title={site.faq.title} subtitle={site.faq.subtitle} />
        <RevealGroup className="mx-auto mt-12 max-w-3xl space-y-3">
          {site.faq.items.map((item, i) => (
            <RevealItem key={item.q}>
              <details
                className="glass group rounded-[1.5rem] transition open:border-snap/40"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-start font-semibold [&::-webkit-details-marker]:hidden">
                  <span className="text-base md:text-lg">{item.q}</span>
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-snap transition group-open:rotate-180 group-open:bg-snap group-open:text-ink">
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 pb-5 leading-relaxed text-mist">{item.a}</div>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
