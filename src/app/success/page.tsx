import type { Metadata } from "next";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "تم استلام طلبك",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({ searchParams }: PageProps<"/success">) {
  const params = await searchParams;
  const raw = Array.isArray(params.order) ? params.order[0] : params.order;
  const order = (raw ?? "").replace(/[^0-9A-Za-z_-]/g, "").slice(0, 32);

  return (
    <main className="flex min-h-[100svh] items-center pt-28 pb-16">
      <Container>
        <div className="glass mx-auto max-w-xl rounded-[2.5rem] p-8 text-center md:p-12">
          <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-snap text-ink shadow-glow">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <h1 className="text-balance mt-6 text-3xl font-bold md:text-4xl">{site.success.title}</h1>
          <p className="mt-4 text-lg text-fog/90">{site.success.text}</p>
          <p className="mt-2 leading-relaxed text-mist">{site.success.detail}</p>

          {order && (
            <p className="mt-8 inline-flex flex-col items-center rounded-2xl border border-snap/30 bg-snap/10 px-6 py-3">
              <span className="text-xs text-mist">{site.success.orderLabel}</span>
              <span className="nums text-2xl font-bold text-snap" dir="ltr">
                #{order}
              </span>
            </p>
          )}

          <ul className="mt-8 grid gap-3 text-sm text-mist sm:grid-cols-2">
            <li className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
              <Mail className="h-4 w-4 text-snap" /> النتيجة على بريدك
            </li>
            <li className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
              <MessageCircle className="h-4 w-4 text-snap" /> إشعار عبر WhatsApp
            </li>
          </ul>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/" variant="secondary" size="lg">
              {site.success.back}
            </Button>
            <Button href={waLink(site.brand.whatsapp, `مرحبًا، أنا صاحب الطلب رقم ${order || ""}`)} size="lg">
              تواصل عبر WhatsApp
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
