import { ArrowLeft } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const tierLabel: Record<string, string> = {
  analysis: "كل الباقات",
  plan: "من باقة الخطة",
  expert: "الباقة الكاملة",
};

export function Deliverables() {
  return (
    <section id="deliverables" className="section-pad">
      <Container>
        <SectionHeading
          id="deliverables-title"
          eyebrow="المخرجات"
          title={site.deliverables.title}
          subtitle={site.deliverables.subtitle}
        />

        <RevealGroup className="mt-12 flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
          {site.deliverables.chain.map((d, i) => (
            <RevealItem key={d.title} className="flex flex-1 flex-col items-stretch md:flex-row md:items-center">
              <article
                className={cn(
                  "glass flex h-full flex-1 flex-col rounded-[1.75rem] p-5",
                  d.pkg === "expert" && "border-snap/40",
                )}
              >
                <span
                  className={cn(
                    "self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    d.pkg === "analysis" && "bg-white/10 text-mist",
                    d.pkg === "plan" && "bg-snap/15 text-snap",
                    d.pkg === "expert" && "bg-snap text-ink",
                  )}
                >
                  {tierLabel[d.pkg]}
                </span>
                <h3 className="mt-3 text-lg font-bold">
                  <span className="nums me-2 text-snap">{String(i + 1).padStart(2, "0")}</span>
                  {d.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">{d.text}</p>
              </article>
              {i < site.deliverables.chain.length - 1 && (
                <span
                  aria-hidden="true"
                  className="my-1 flex items-center justify-center text-snap/70 md:mx-1 md:my-0"
                >
                  <ArrowLeft className="h-5 w-5 rotate-90 md:rotate-0" />
                </span>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
