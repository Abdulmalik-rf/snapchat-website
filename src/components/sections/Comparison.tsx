import { Check, Minus } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** العنصر 9 — جدول المقارنة: سهل الاقتباس، HTML خام */
export function Comparison() {
  const highlightCol = 2; // "تحليل + خطة"
  return (
    <section id="compare" className="section-pad scroll-mt-24">
      <Container>
        <SectionHeading
          id="compare-title"
          eyebrow="المقارنة"
          title={site.comparison.title}
          subtitle={site.comparison.subtitle}
        />

        <Reveal className="mt-12">
          <div className="compare-scroll glass overflow-x-auto rounded-[2rem]">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">مقارنة الباقات الثلاث مع المحاولة الذاتية</caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="sticky start-0 bg-ink-900/90 p-4 text-start font-semibold text-mist backdrop-blur">
                    الميزة
                  </th>
                  {site.comparison.columns.map((c, i) => (
                    <th
                      key={c}
                      scope="col"
                      className={cn(
                        "p-4 text-center font-bold",
                        i === highlightCol ? "bg-snap/10 text-snap" : "text-fog",
                      )}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {site.comparison.rows.map((row, ri) => (
                  <tr key={row.label} className={cn("border-b border-white/5", ri % 2 === 1 && "bg-white/[0.02]")}>
                    <th
                      scope="row"
                      className="sticky start-0 bg-ink-900/90 p-4 text-start font-medium text-fog/90 backdrop-blur"
                    >
                      {row.label}
                    </th>
                    {row.values.map((v, ci) => (
                      <td
                        key={ci}
                        className={cn("p-4 text-center nums", ci === highlightCol && "bg-snap/[0.06]")}
                      >
                        {typeof v === "boolean" ? (
                          v ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-snap text-ink">
                              <Check className="h-4 w-4" aria-label="نعم" />
                            </span>
                          ) : (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-mist-700">
                              <Minus className="h-4 w-4" aria-label="لا" />
                            </span>
                          )
                        ) : (
                          <span className={cn(ci === 0 ? "text-mist" : "font-semibold")}>{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
