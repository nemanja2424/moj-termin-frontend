import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  organizationSchema,
  localBusinessSchema,
  softwareApplicationSchema,
} from "@/lib/seo-schemas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://test.mojtermin.site"),

  title: {
    default: "MojTermin – Online zakazivanje termina i pregleda u Srbiji",
    template: "%s | MojTermin",
  },

  description:
    "Zakazujte lekarske preglede, salone i usluge online. Brzo, jednostavno i bez čekanja. MojTermin je moderan sistem za digitalno zakazivanje termina.",

  keywords:
    "zakazivanje termina, online zakazivanje, rezervacija pregleda, doktor online, sistem za zakazivanje, upravljanje terminima, Srbija",

  applicationName: "MojTermin",

  creator: "MojTermin Team",
  publisher: "MojTermin",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    bingbot: {
      index: true,
      follow: true,
    },
  },

  alternates: {
    canonical: "https://test.mojtermin.site",
    languages: {
      "sr-RS": "https://test.mojtermin.site",
    },
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },

  icons: {
    icon: "/Images/logo.png",
    apple: "/Images/logo.png",
  },

  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: "https://test.mojtermin.site",
    siteName: "MojTermin",
    title: "MojTermin – Online zakazivanje termina i pregleda u Srbiji",
    description:
      "Jednostavno zakazivanje lekarskih pregleda, salonskih usluga i ostalih servisa online. Bez čekanja, bez poziva.",
    images: [
      {
        url: "/Images/logo3.png",
        width: 1200,
        height: 630,
        alt: "MojTermin – Online zakazivanje termina",
        type: "image/png",
      },
      {
        url: "/Images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MojTermin platform",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@mojtermin",
    creator: "@mojtermin",
    title: "MojTermin – Online zakazivanje termina",
    description:
      "Zakazivanje pregleda i usluga online. Brzo, jednostavno i moderno.",
    image: "/Images/logo3.png",
  },

  verification: {
    google: "pGX9yjiLBTSqiQgwFWp5FyekhwK_sLgudqxsZ2reDpU",
    yandex: "yandex-verification-code",
  },

  category: "Business",
};


export default function RootLayout({ children }) {
  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MojTermin",
    url: "https://test.mojtermin.site",
    logo: "https://test.mojtermin.site/Images/logo3.png",
    description:
      "Moderan sistem za digitalno zakazivanje termina i upravljanje poslovanjem",
    sameAs: [
      "https://facebook.com/mojtermin",
      "https://instagram.com/mojtermin",
      "https://linkedin.com/company/mojtermin",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "info@mojtermin.site",
      availableLanguage: "sr",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "RS",
      addressRegion: "Serbia",
    },
  };

  const jsonLdSoftwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MojTermin",
    description:
      "Aplikacija za zakazivanje termina. Dostupna za web, iOS i Android.",
    url: "https://test.mojtermin.site",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  };

  return (
    <html lang="sr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
        />
        
        {/* Preconnect za spoljne resurse */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        
        {/* DNS prefetch za analitiku i treće strane */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        <link rel="stylesheet" href="https://unicons.iconscout.com/release/v2.1.9/css/unicons.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;550;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        
        {/* Theme color za mobile browsers */}
        <meta name="theme-color" content="#008DFF" />
        
        {/* Apple specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MojTermin" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
