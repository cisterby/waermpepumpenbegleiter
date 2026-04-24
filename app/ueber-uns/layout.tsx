// app/ueber-uns/layout.tsx
import type { Metadata } from 'next';
import { BASE } from '@/lib/constants';
const title = 'Über uns — Wärmepumpenbegleiter.de | Webflott GbR';
const description =
  'Wärmepumpenbegleiter.de ist ein unabhängiges Vermittlungsportal von Webflott. Wir verbinden Hausbesitzer kostenlos mit geprüften WP-Fachbetrieben in ihrer Region.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${BASE}/ueber-uns`,
  },
  openGraph: {
    title,
    description,
    url: `${BASE}/ueber-uns`,
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
    { '@type': 'ListItem', position: 2, name: 'Über uns', item: `${BASE}/ueber-uns` },
  ],
};

export default function UeberUnsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
