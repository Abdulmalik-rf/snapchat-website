import { TrendingUp } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";

/** العنصر 8 — صندوق الإثبات: دراسات حالة بأسماء وأرقام */
export function Proof() {
  return (
    <section id="proof" className="section-pad">
      <Container>
        <SectionHeading id="proof-title" eyebrow="نتائج" title={site.proof.title} subtitle={site.proof.subtitle} />
        {site.proof.isPlaceholder && (
          <p className="mt-4 text-center">
            <Badge tone="warn">أمثلة توضيحية — تُستبدل بنتائج حقيقية لعملاء فعليين</Badge>
          </p>
        )}

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {site.proof.cases.map((c) => (
            <RevealItem key={c.name}>
              <article className="glass flex h-full flex-col rounded-[2rem] p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="nums text-4xl font-bold text-snap">{c.metric}</p>
                    <p className="mt-1 text-xs text-mist">{c.metricLabel}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-ok ring-1 ring-white/10">
                    <TrendingUp className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{c.name}</h3>
                <Badge tone="neutral" className="mt-2 self-start">
                  {c.package}
                </Badge>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-ink/40 p-3">
                    <dt className="text-xs text-bad">قبل</dt>
                    <dd className="mt-0.5 text-fog/90">{c.before}</dd>
                  </div>
                  <div className="rounded-2xl border border-ok/20 bg-ok/5 p-3">
                    <dt className="text-xs text-ok">بعد</dt>
                    <dd className="mt-0.5 text-fog/90">{c.after}</dd>
                  </div>
                </dl>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
