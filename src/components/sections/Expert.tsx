import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";

/** العنصر 3 — هوية الكاتب: شخص حقيقي بصورة وخبرة واضحة خلف الصفحة */
export function Expert() {
  return (
    <section id="expert" className="section-pad scroll-mt-24">
      <Container>
        <Reveal>
          <article className="glass grid items-center gap-8 overflow-hidden rounded-[2rem] p-6 md:grid-cols-[220px_1fr] md:p-10">
            <div className="relative mx-auto w-44 md:w-full">
              <div className="absolute -inset-3 rounded-[2rem] bg-snap/20 blur-2xl" aria-hidden="true" />
              <Image
                src={site.expert.image}
                alt={site.expert.imageAlt}
                width={440}
                height={440}
                className="relative aspect-square w-full rounded-[1.75rem] object-cover ring-1 ring-white/10"
              />
            </div>
            <div className="text-center md:text-start">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <Badge tone="snap">
                  <BadgeCheck className="h-3.5 w-3.5" /> من يقف خلف التحليل؟
                </Badge>
                {site.expert.isPlaceholder && <Badge tone="warn">بيانات توضيحية — تُستبدل ببيانات الخبير</Badge>}
              </div>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">{site.expert.name}</h2>
              <p className="mt-1 text-snap">{site.expert.role}</p>
              <p className="mt-4 max-w-2xl leading-relaxed text-mist">{site.expert.bio}</p>
              <dl className="mt-6 grid grid-cols-3 gap-3">
                {site.expert.stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                    <dt className="order-2 text-[11px] text-mist md:text-xs">{s.label}</dt>
                    <dd className="nums text-xl font-bold text-fog md:text-2xl">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
