// app/kontakt/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wärmepumpe anfragen — Kostenlose Beratung & 3 Angebote',
  description: 'Kostenloses WP-Angebot anfordern: Baujahr, Heizung, Kontaktdaten eingeben — und bis zu 3 Angebote geprüfter Fachbetriebe aus Ihrer Region in 48 Stunden erhalten.',
  alternates: {
    canonical: 'https://xn--wrmepumpenbegleiter-gwb.de/kontakt',
  },
  robots: { index: true, follow: true },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
