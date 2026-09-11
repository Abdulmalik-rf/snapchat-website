import { AlertTriangle, CheckCircle2, CircleAlert, MoveLeft } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/** العنصر 5 — صندوق المشكلة، العنصر 6 — صندوق الحل */
export function ProblemSolution() {
  return (
    <section id="problem" className="section-pad">
      <Container>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <article className="glass relative h-full overflow-hidden rounded-[2rem] p-6 md:p-8">
              <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-bad/10 blur-3xl" aria-hidden="true" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-bad/30 bg-bad/10 text-bad">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-bad">المشكلة</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold md:text-3xl">{site.problem.title}</h2>
              <p className="mt-3 leading-relaxed text-mist">{site.problem.text}</p>
              <ul className="mt-5 space-y-2.5">
                {site.problem.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-fog/90">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-bad" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="relative h-full overflow-hidden rounded-[2rem] border border-snap/30 bg-snap/[0.07] p-6 shadow-glow backdrop-blur-xl md:p-8">
              <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-snap/20 blur-3xl" aria-hidden="true" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-snap text-ink">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-snap">الحل</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold md:text-3xl">{site.solution.title}</h2>
              <p className="mt-3 leading-relaxed text-fog/90">{site.solution.text}</p>
              <p className="mt-5 flex items-start gap-2.5 rounded-2xl border border-snap/30 bg-ink/40 p-4 text-sm font-semibold">
                <MoveLeft className="mt-0.5 h-4 w-4 shrink-0 text-snap" aria-hidden="true" />
                {site.solution.step}
              </p>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
