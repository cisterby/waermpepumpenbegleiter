// app/ratgeber/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wärmepumpen-Ratgeber 2026 — Technik, Kosten, Förderung',
  description: 'Fundierte Ratgeber-Artikel zu Wärmepumpen: GEG 2026, KfW 458 Schritt für Schritt, Luft-Wasser-WP ehrlich erklärt, Altbau-Eignung, CO₂-Preis-Entwicklung. Von Energieberatern und SHK-Meistern.',
  alternates: { canonical: 'https://waermepumpenbegleiter.de/ratgeber' },
  openGraph: {
    title: 'Wärmepumpen-Ratgeber 2026 | Wärmepumpenbegleiter.de',
    description: 'GEG 2026, KfW 458, Luft-WP, Altbau, CO₂-Preis — fundierte Artikel von Experten.',
    type: 'website',
  },
};

export default function RatgeberLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
