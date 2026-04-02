export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "Pomoć – MojTermin",
    description: "Dobijte odgovore na česta pitanja i nauči kako koristiti sve funkcije MojTermin-a.",
    alternates: {
      canonical: "https://mojtermin.site/pomoc",
    },
    keywords: "pomoc, uputstvo, faq, kako koristiti",
  };
}

import PomocContent from './PomocContent';

export default function PomocPage() {
  return <PomocContent />;
}