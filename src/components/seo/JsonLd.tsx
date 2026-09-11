import { site } from "@/content/site";

/**
 * العنصر 13 — البيانات المنظّمة (Schema.org JSON-LD):
 * Organization + WebSite + WebPage(dateModified) + Service مع OfferCatalog + Person + FAQPage
 */
export function JsonLd() {
  const url = site.brand.url;
  const orgId = `${url}#organization`;
  const personId = `${url}#expert`;
  const serviceId = `${url}#service`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.brand.name,
        alternateName: site.brand.nameAr,
        url,
        logo: `${url}/logo.svg`,
        email: site.brand.email,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: `+${site.brand.whatsapp}`,
          availableLanguage: ["ar"],
        },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.expert.name,
        jobTitle: site.expert.role,
        description: site.expert.bio,
        image: `${url}${site.expert.image}`,
        worksFor: { "@id": orgId },
      },
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: site.brand.name,
        inLanguage: "ar",
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: site.hero.h1,
        description: site.hero.subheadline,
        inLanguage: "ar",
        isPartOf: { "@id": `${url}#website` },
        about: { "@id": serviceId },
        author: { "@id": personId },
        dateModified: site.lastUpdated,
        datePublished: site.lastUpdated,
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: site.brand.tagline,
        serviceType: "Snapchat account verification readiness analysis",
        description: site.answer.text,
        provider: { "@id": orgId },
        areaServed: "SA",
        availableLanguage: "ar",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "الباقات",
          itemListElement: site.packages.map((p) => ({
            "@type": "Offer",
            name: p.name,
            description: p.features.join("، "),
            price: p.price,
            priceCurrency: "SAR",
            url: `${url}#packages`,
            availability: "https://schema.org/InStock",
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: site.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
