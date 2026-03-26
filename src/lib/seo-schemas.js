/**
 * SEO Schemas - JSON-LD Strukturirani podaci
 * Koristi se za bogato prikazivanje u Google pretrazi
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MojTermin",
  url: "https://test.mojtermin.site",
  logo: "https://test.mojtermin.site/Images/logo3.png",
  description:
    "MojTermin je moderan sistem za digitalno zakazivanje termina. Platform za lekarske preglede, salone, i sve vrste usluga sa mogućnostima upravljanja za preduzeca.",
  sameAs: [
    "https://facebook.com/mojtermin",
    "https://instagram.com/mojtermin",
    "https://linkedin.com/company/mojtermin",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "info@mojtermin.site",
    telephone: "+381",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "RS",
    addressRegion: "Serbia",
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "MojTermin",
  description:
    "Online platforma za zakazivanje termina i pregleda u Srbiji",
  url: "https://test.mojtermin.site",
  logo: "https://test.mojtermin.site/Images/logo3.png",
  telephone: "+381",
  areaServed: "RS",
  serviceType: [
    "Online zakazivanje termina",
    "Upravljanje lekarskim ordinacijama",
    "Upravljanje salonima",
    "Digitalni kalendar termina",
  ],
  image: "https://test.mojtermin.site/Images/og-image.jpg",
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MojTermin",
  description:
    "Aplikacija za zakazivanje termina i upravljanje poslovanjem. Dostupna za web, iOS i Android.",
  url: "https://test.mojtermin.site",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Besplatna registracija",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
  image: "https://test.mojtermin.site/Images/logo3.png",
  author: {
    "@type": "Organization",
    name: "MojTermin",
  },
};

export const serviceSchema = (name, description, benefits) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: name,
  description: description,
  provider: {
    "@type": "Organization",
    name: "MojTermin",
    url: "https://test.mojtermin.site",
  },
  areaServed: "RS",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "MojTermin Usluge",
    itemListElement: benefits,
  },
});

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const faqSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const articleSchema = (
  title,
  description,
  image,
  datePublished,
  author = "MojTermin"
) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: title,
  description: description,
  image: image,
  datePublished: datePublished,
  author: {
    "@type": "Organization",
    name: author,
  },
  publisher: {
    "@type": "Organization",
    name: "MojTermin",
    logo: {
      "@type": "ImageObject",
      url: "https://test.mojtermin.site/Images/logo3.png",
    },
  },
});

// Schema za sve glavne usluge
export const mainServicesSchema = [
  {
    "@context": "https://schema.org",
    "@type": "MedicalService",
    name: "Online zakazivanje lekarskih pregleda",
    description:
      "Brzo i jednostavno zakazivanje termina kod doktora. Bez čekanja i telefonskih poziva.",
    url: "https://test.mojtermin.site",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Upravljanje terminima za preduzeća",
    description:
      "Kompletna platforma za upravljanje radnim vremenima, zaposlenima, i terminima.",
    url: "https://test.mojtermin.site/panel",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Statistika i analitika poslovanja",
    description:
      "Detaljne statistike, grafici i pregled performansi vašeg poslovanja.",
    url: "https://test.mojtermin.site/panel",
  },
];
