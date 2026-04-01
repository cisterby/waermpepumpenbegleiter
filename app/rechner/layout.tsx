import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wärmepumpen-Kostenrechner 2026 — Stadtspezifisch & kostenlos',
  description: 'Berechnen Sie die Kosten, Ersparnis und Förderung für Ihre Wärmepumpe — mit lokalem Strompreis, JAZ und KfW-Simulation. Kostenlos, in Sekunden, ohne Anmeldung.',
  alternates: { canonical: 'https://waermepumpenbegleiter.de/rechner' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Wärmepumpen-Kostenrechner 2026',
    description: 'Stadtspezifische WP-Kostenrechnung: Betriebskosten, KfW-Förderung, Amortisation — kostenlos.',
    url: 'https://waermepumpenbegleiter.de/rechner',
    type: 'website',
    locale: 'de_DE',
  },
};

export default function RechnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
