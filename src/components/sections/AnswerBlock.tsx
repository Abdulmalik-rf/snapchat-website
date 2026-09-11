import { Quote } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/** العنصر 4 — صندوق الإجابة: 40–60 كلمة أعلى الصفحة، جاهز للاقتباس */
export function AnswerBlock() {
  return (
    <section id="answer" aria-labelledby="answer-title" className="relative py-6 md:py-10">
      <Container>
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] border-s-4 border-s-snap p-6 md:p-8">
            <Quote className="absolute -end-2 -top-2 h-24 w-24 text-snap/10" aria-hidden="true" />
            <h2 id="answer-title" className="text-sm font-semibold uppercase tracking-wide text-snap">
              {site.answer.title}
            </h2>
            <p className="mt-3 text-lg leading-[1.9] text-fog md:text-xl">{site.answer.text}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
