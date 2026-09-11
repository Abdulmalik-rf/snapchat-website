import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { AnswerBlock } from "@/components/sections/AnswerBlock";
import { ProblemSolution } from "@/components/sections/ProblemSolution";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Packages } from "@/components/sections/Packages";
import { Deliverables } from "@/components/sections/Deliverables";
import { Expert } from "@/components/sections/Expert";
import { Proof } from "@/components/sections/Proof";
import { Comparison } from "@/components/sections/Comparison";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <main id="top">
      <JsonLd />
      <Hero />
      <AnswerBlock />
      <ProblemSolution />
      <HowItWorks />
      <Packages />
      <Deliverables />
      <Expert />
      <Proof />
      <Comparison />
      <Faq />
      <FinalCta />
    </main>
  );
}
