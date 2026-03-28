/**
 * RSS Feed generator - Odličan za SEO i distribuciju sadržaja
 * Lokacija: src/app/feed.xml/route.js
 */

export async function GET() {
  const baseUrl = "https://mojtermin.site";

  const feedContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MojTermin - Online zakazivanje termina</title>
    <link>${baseUrl}</link>
    <description>Zakazujte lekarske preglede, salone i usluge online. Brzo, jednostavno i bez čekanja.</description>
    <language>sr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <ttl>1440</ttl>
    
    <item>
      <title>MojTermin - Moderan sistem za zakazivanje termina</title>
      <link>${baseUrl}</link>
      <description>Prosto zakazivanje termina za klijente i upravljanje poslovanjem za preduzeća.</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}</guid>
      <content:encoded><![CDATA[
        <h1>Dobrodošli na MojTermin</h1>
        <p>MojTermin je moderan sistem za digitalno zakazivanje termina. Omogućava lako upravljanje terminima za:</p>
        <ul>
          <li>Lekarske ordinacije</li>
          <li>Salone lepote i wellness</li>
          <li>Sve vrste usluga</li>
        </ul>
        <p>Besplatna registracija i početak rada za preduzeća.</p>
      ]]></content:encoded>
    </item>

    <item>
      <title>Zakazivanje termina za klijente</title>
      <link>${baseUrl}/klijent</link>
      <description>Pronađi i zakaži termin kod bilo kojeg preduzeća. Bez čekanja i telefonskih poziva.</description>
      <pubDate>${new Date(Date.now() - 86400000).toUTCString()}</pubDate>
      <guid>${baseUrl}/klijent</guid>
    </item>

    <item>
      <title>Panel za preduzeća - Upravljanje terminima</title>
      <link>${baseUrl}/panel</link>
      <description>Upravljaj terminima, zaposlenima, lokacijama i prihodima. Sve na jednom mestu.</description>
      <pubDate>${new Date(Date.now() - 172800000).toUTCString()}</pubDate>
      <guid>${baseUrl}/panel</guid>
    </item>

    <item>
      <title>AI Asistent - Automatizovana analitika</title>
      <link>${baseUrl}/panel/ai</link>
      <description>Koristi AI da analizirate trendove i poboljšate vašu poslovanje.</description>
      <pubDate>${new Date(Date.now() - 259200000).toUTCString()}</pubDate>
      <guid>${baseUrl}/panel/ai</guid>
    </item>

  </channel>
</rss>`;

  return new Response(feedContent, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
