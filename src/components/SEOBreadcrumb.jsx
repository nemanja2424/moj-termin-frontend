/**
 * SEO Helper Komponenta - Breadcrumb List za sve stranice
 * Lokacija: src/components/SEOBreadcrumb.jsx
 */

import { breadcrumbSchema } from "@/lib/seo-schemas";

export default function SEOBreadcrumb({ items }) {
  const breadcrumbSchemaData = breadcrumbSchema(items);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchemaData),
        }}
      />

      {/* HTML Breadcrumb za dobar UX */}
      <nav aria-label="Breadcrumb" className="breadcrumb-navigation">
        <ol itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <a itemProp="item" href={item.url}>
                <span itemProp="name">{item.name}</span>
              </a>
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
