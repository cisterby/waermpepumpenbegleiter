// app/kontakt/layout.tsx
import type { Metadata } from 'next';

const BASE = 'https://xn--wrmepumpenbegleiter-gwb.de';
const title = 'Wärmepumpe anfragen — Kostenlose Beratung & 3 Angebote';
const description = 'Kostenloses WP-Angebot anfordern: Baujahr, Heizung, Kontaktdaten eingeben — und bis zu 3 Angebote geprüfter Fachbetriebe aus Ihrer Region in 48 Stunden erhalten.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${BASE}/kontakt`,
    languages: { 'de-DE': `${BASE}/kontakt` },
  },
  openGraph: {
    title,
    description,
    url: `${BASE}/kontakt`,
    type: 'website',
    locale: 'de_DE',
    siteName: 'Wärmepumpenbegleiter',
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true },
};

const contactPointSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Wärmepumpe anfragen — Kontakt',
  description,
  url: `${BASE}/kontakt`,
  mainEntity: {
    '@type': 'Organization',
    name: 'Wärmepumpenbegleiter',
    url: BASE,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'kontakt@waermepumpenbegleiter.de',
      availableLanguage: 'German',
      areaServed: 'DE',
    },
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Startseite', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Kontakt', item: `${BASE}/kontakt` },
  ],
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPointSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}