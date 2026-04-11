// app/wie-es-funktioniert/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wie funktioniert Wärmepumpenbegleiter.de?',
  description: 'In 3 Schritten zur kostenlosen WP-Vermittlung: Anfrage stellen, 3 Angebote erhalten, Fachbetrieb wählen. Kostenlos für Hausbesitzer, DSGVO-konform.',
  alternates: {
    canonical: 'https://xn--wrmepumpenbegleiter-gwb.de/wie-es-funktioniert',
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}