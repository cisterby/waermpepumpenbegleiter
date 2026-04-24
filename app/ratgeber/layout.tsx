// app/ratgeber/layout.tsx
import type { Metadata } from 'next';

const BASE = 'https://xn--wrmepumpenbegleiter-gwb.de';
const title = 'Wärmepumpen-Ratgeber 2026 — Kosten, Förderung, Installation';
const description =
  'Ausführlicher WP-Ratgeber 2026: Kosten (ab €9.000 nach KfW), Förderung bis 70%, Altbau-Eignung, GEG-Reform und mehr. Kostenlos & herstellerunabhängig.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${BASE}/ratgeber`,
    languages: { 'de-DE': `${BASE}/ratgeber` },
  },
  openGraph: {
    title,
    description,
    url: `${BASE}/ratgeber`,
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
    { '@type': 'ListItem', position: 2, name: 'Ratgeber', item: `${BASE}/ratgeber` },
  ],
};

// BlogPosting schema for each article — rich snippets in SERPs
const articleSchemas = [
  {
    slug: 'geg-2026-was-hausbesitzer-wissen-muessen',
    title: 'GEG 2026: Was Hausbesitzer in Großstädten ab Juli wissen müssen',
    description: 'Ab dem 30. Juni 2026 gilt die 65%-EE-Pflicht für Bestandsgebäude in Kommunen mit über 100.000 Einwohnern. Was das konkret bedeutet — und was jetzt zu tun ist.',
    author: 'Dr. Markus Sommer',
    datePublished: '2026-03-15',
    dateModified: '2026-04-01',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    wordCount: 2200,
    timeRequired: 'PT12M',
  },
  {
    slug: 'waermepumpe-altbau-praxisbericht',
    title: 'Wärmepumpe im Altbau: Funktioniert das wirklich?',
    description: 'Praxisbericht und Entscheidungshilfe: Welche Altbauten sind geeignet, was kostet die Nachrüstung, und wann lohnt sich die Investition?',
    author: 'Thomas Brenner',
    datePublished: '2026-02-20',
    dateModified: '2026-04-01',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    wordCount: 1800,
    timeRequired: 'PT9M',
  },
  {
    slug: 'kfw-foerderung-2026-maximale-zuschuesse',
    title: 'KfW-Förderung 2026: So holen Sie die maximale Förderung',
    description: 'Bis zu 70% Zuschuss für Ihre Wärmepumpe: Welche Boni gibt es, wer bekommt was, und wie stellen Sie den Antrag richtig?',
    author: 'Bastian Saupe',
    datePublished: '2026-01-10',
    dateModified: '2026-04-01',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    wordCount: 1600,
    timeRequired: 'PT8M',
  },
  {
    slug: 'waermepumpe-betriebskosten-stromkosten',
    title: 'Betriebskosten Wärmepumpe: Was kostet der Strom wirklich?',
    description: 'Stromkosten, WP-Tarife, JAZ-Einfluss — alle laufenden Kosten einer Wärmepumpe im Detail erklärt.',
    author: 'Dr. Markus Sommer',
    datePublished: '2026-02-05',
    dateModified: '2026-04-01',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    wordCount: 1400,
    timeRequired: 'PT7M',
  },
  {
    slug: 'waermepumpe-installation-zeitplan',
    title: 'Von der Planung bis zum warmen Haus: Der Installations-Zeitplan',
    description: 'Schritt-für-Schritt-Zeitplan für die Wärmepumpen-Installation: Von der Anfrage bis zur Inbetriebnahme in 8–12 Wochen.',
    author: 'Thomas Brenner',
    datePublished: '2026-03-01',
    dateModified: '2026-04-01',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    wordCount: 1500,
    timeRequired: 'PT8M',
  },
].map(article => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.description,
  url: `${BASE}/ratgeber#${article.slug}`,
  datePublished: article.datePublished,
  dateModified: article.dateModified,
  author: {
    '@type': 'Person',
    name: article.author,
  },
  publisher: {
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'Wärmepumpenbegleiter.de',
    url: BASE,
  },
  image: {
    '@type': 'ImageObject',
    url: article.image,
    width: 1200,
    height: 630,
  },
  wordCount: article.wordCount,
  timeRequired: article.timeRequired,
  inLanguage: 'de-DE',
  mainEntityOfPage: `${BASE}/ratgeber`,
}));

export default function RatgeberLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchemas) }}
      />
      {children}
    </>
  );
}
