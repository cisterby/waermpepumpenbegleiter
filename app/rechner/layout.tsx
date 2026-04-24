// app/rechner/layout.tsx
import type { Metadata } from 'next';

const BASE = 'https://xn--wrmepumpenbegleiter-gwb.de';
const title = 'Wärmepumpen-Rechner 2026 — Kosten, Förderung & Ersparnis berechnen';
const description =
  'Berechnen Sie in 30 Sekunden Ihre Wärmepumpen-Kosten, KfW-Förderung (bis 70 %) und jährliche Ersparnis gegenüber Gas, Öl oder Nachtspeicher. Kostenlos & unverbindlich.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${BASE}/rechner`,
    languages: { 'de-DE': `${BASE}/rechner` },
  },
  openGraph: {
    title,
    description,
    url: `${BASE}/rechner`,
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
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Startseite',
      item: BASE,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Wärmepumpen-Rechner',
      item: `${BASE}/rechner`,
    },
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Wärmepumpen-Kosten berechnen',
  description:
    'So berechnen Sie in wenigen Schritten Ihre Wärmepumpen-Kosten, Förderung und Amortisation.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Gebäudedaten eingeben',
      text: 'Geben Sie Ihre Wohnfläche, das Baujahr und die aktuelle Heizungsart (Gas, Öl oder Nachtspeicher) ein.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Förderoptionen auswählen',
      text: 'Wählen Sie zutreffende Förderoptionen: Eigennutzer, Austausch fossiler Heizung, Einkommensbonus, R290-Kältemittel.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Ergebnis ablesen',
      text: 'Lesen Sie Ihre geschätzten Kosten, die KfW-Förderung (bis 70 %), die jährliche Ersparnis und die Amortisationszeit ab.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Angebot anfordern',
      text: 'Fordern Sie kostenlos bis zu 3 Angebote geprüfter Fachbetriebe in Ihrer Region an.',
    },
  ],
};

export default function RechnerLayout({ children }: { children: React.ReactNode }) {
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
