export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "Moj Termin - Online zakazivanje termina i usluga",
    description: "Pronađi i zakaži termin kod najboljih firmi u Srbiji. Jednostavno i brzo online zakazivanje termina za frizerske, medicinske, beauty i druge usluge.",
    keywords: "moj termin, zakazivanje termina, online termin, frizer, zdravlje, usluge, zakazivanje",
    alternates: {
      canonical: "https://mojtermin.site/",
    },
    openGraph: {
      title: "Moj Termin - Online zakazivanje termina i usluga",
      description: "Pronađi i zakaži termin kod najboljih firmi u Srbiji. Jednostavno i brzo online zakazivanje.",
      url: "https://mojtermin.site/",
      siteName: "Moj Termin",
      locale: "sr_RS",
      type: "website",
      images: [
        {
          url: "https://mojtermin.site/Images/logo3.png",
          width: 200,
          height: 50,
          alt: "Moj Termin",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Moj Termin - Online zakazivanje termina i usluga",
      description: "Pronađi i zakaži termin kod najboljih firmi u Srbiji.",
      images: ["https://mojtermin.site/Images/logo3.png"],
    },
  };
}

import { Suspense } from 'react';
import HomeContent from './HomeContent';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <HomeContent />
    </Suspense>
  );
}
