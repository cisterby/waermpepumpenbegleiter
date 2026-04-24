// app/wie-es-funktioniert/layout.tsx
import type { Metadata } from 'next';
import { BASE } from '@/lib/constants';
const title = 'Wie funktioniert Wärmepumpenbegleiter.de? — In 3 Schritten zum Angebot';
const description =
  'In 3 Schritten zur kostenlosen WP-Vermittlung: Anfrage stellen, 3 Angebote erhalten, Fachbetrieb wählen. Kostenlos für Hausbesitzer, DSGVO-konform.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${BASE}/wie-es-funktioniert`,
  },
  openGraph: {
    title,
    description,
    url: `${BASE}/wie-es-funktioniert`,
    type: 'website',
    locale: 'de_DE',
    siteName: 'Wärmepumpenbegleiter',
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Startseite', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Wie es funktioniert', item: `${BASE}/wie-es-funktioniert` },
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Kostenlose Wärmepumpen-Angebote über Wärmepumpenbegleiter erhalten',
  description: 'So erhalten Sie in 3 Schritten kostenlos bis zu 3 Wärmepumpen-Angebote geprüfter Fachbetriebe.',
  totalTime: 'PT5M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Anfrage stellen',
      text: 'Füllen Sie das kostenlose Formular aus: Baujahr, Heizungsart, Wohnfläche und Ihre Kontaktdaten. Dauert unter 2 Minuten.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: '3 Angebote erhalten',
      text: 'Innerhalb von 48 Stunden erhalten Sie bis zu 3 Angebote von geprüften, HWK-registrierten Wärmepumpen-Fachbetrieben aus Ihrer Region.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Fachbetrieb wählen',
      text: 'Vergleichen Sie die Angebote in Ruhe und entscheiden Sie sich für den besten Fachbetrieb. Ohne Verkaufsdruck, ohne Verpflichtung.',
    },
  ],
};

export default function WieEsFunktioniertLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {children}
    </>
  );
}
