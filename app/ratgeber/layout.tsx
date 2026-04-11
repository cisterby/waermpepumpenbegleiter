// app/ratgeber/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wärmepumpen-Ratgeber 2026 — Kosten, Förderung, Installation',
  description: 'Ausführlicher WP-Ratgeber 2026: Kosten (ab €9.000 nach KfW), Förderung bis 70%, Altbau-Eignung, GEG-Reform und mehr. Kostenlos & herstellerunabhängig.',
  alternates: {
    canonical: 'https://xn--wrmepumpenbegleiter-gwb.de/ratgeber',
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}