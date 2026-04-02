export const revalidate = 60; // ISR

export async function generateMetadata() {
  return {
    title: "Pregled dizajna – MojTermin",
    description: "Pregled različitih dizajn šablona za vašu stranicu zakazivanja.",
    alternates: {
      canonical: "https://mojtermin.site/preview",
    },
    keywords: "pregled, dizajn, sablon, booking page",
  };
}

import PreviewContent from './PreviewContent';

export default function PreviewPage() {
  return <PreviewContent />;
}
