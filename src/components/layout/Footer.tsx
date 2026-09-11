import { MessageCircle, CalendarCheck2 } from "lucide-react";
import { site } from "@/content/site";
import { formatDateAr, waLink } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="container-x py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">{site.brand.tagline}</p>
            <a
              href={waLink(site.brand.whatsapp, "مرحبًا، لدي استفسار عن خدمة تحليل حساب Snapchat")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-fog transition hover:border-snap/40 hover:bg-snap/10"
            >
              <MessageCircle className="h-4 w-4 text-snap" />
              تواصل عبر WhatsApp
            </a>
          </div>

          <nav aria-label="روابط الفوتر">
            <h3 className="text-sm font-semibold text-fog">روابط سريعة</h3>
            <ul className="mt-3 space-y-2">
              {site.nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-mist transition hover:text-fog">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.brand.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-mist transition hover:text-fog"
                >
                  متجرنا في سلة
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold text-fog">ختم التحديث</h3>
            <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-snap/25 bg-snap/10 px-3 py-2 text-sm text-snap">
              <CalendarCheck2 className="h-4 w-4" />
              <span>
                آخر تحديث:{" "}
                <time dateTime={site.lastUpdated} className="nums font-semibold">
                  {formatDateAr(site.lastUpdated)}
                </time>
              </span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-mist-700">
              نراجع المحتوى والأسعار دوريًا لتبقى الصفحة دقيقة.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-mist-700">
          <p>{site.footer.disclaimer}</p>
          <p className="mt-2 nums">
            © {new Date().getFullYear()} {site.brand.name}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
