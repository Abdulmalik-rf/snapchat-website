import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { ScrollVideo } from "@/components/background/ScrollVideo";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.brand.url),
  title: {
    default: `${site.hero.h1} | ${site.brand.name}`,
    template: `%s | ${site.brand.name}`,
  },
  description: site.hero.subheadline,
  applicationName: site.brand.name,
  keywords: ["توثيق سناب شات", "تحليل حساب سناب شات", "التوثيق في Snapchat", "خطة تسويقية سناب شات"],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: site.brand.url,
    siteName: site.brand.name,
    title: site.hero.h1,
    description: site.hero.subheadline,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.hero.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.hero.h1,
    description: site.hero.subheadline,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${arabic.variable} h-full antialiased`}>
      <head>
        {/* يضيف class="js" قبل الـ hydration حتى تُطبَّق حالات الحركة الأولية على المتصفحات التي تشغّل JavaScript فقط */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ScrollVideo
          src={site.background.src || undefined}
          webmSrc={site.background.webm || undefined}
          poster={site.background.poster || undefined}
          mode={site.background.mode}
        />
        <Providers>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
