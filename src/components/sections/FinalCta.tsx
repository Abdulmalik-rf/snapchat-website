"use client";

import { ArrowLeft, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { waLink } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useOrder } from "@/components/order/OrderProvider";

export function FinalCta() {
  const { open } = useOrder();
  return (
    <section id="cta" className="section-pad">
      <Container>
        <Reveal>
          <div className="noise relative overflow-hidden rounded-[2.5rem] border border-snap/40 bg-gradient-to-br from-snap/20 via-ink/70 to-ink/90 p-8 text-center shadow-glow backdrop-blur-xl md:p-14">
            <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-snap/30 blur-3xl" aria-hidden="true" />
            <h2 className="text-balance relative text-3xl font-bold md:text-5xl">{site.finalCta.title}</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-mist">{site.finalCta.text}</p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => open("analysis")}>
                {site.finalCta.cta} <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                href={waLink(site.brand.whatsapp, "مرحبًا، أريد الاستفسار قبل طلب تحليل حسابي")}
              >
                <MessageCircle className="h-5 w-5 text-snap" /> استفسر عبر WhatsApp
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
