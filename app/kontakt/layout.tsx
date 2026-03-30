// app/kontakt/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kostenlose Wärmepumpen-Anfrage — Jetzt starten',
  description: 'Wärmepumpe anfragen in 2 Minuten: Heizungstyp angeben, Gebäudedaten, Zeitplan. Kostenlos, unverbindlich — bis zu 3 geprüfte lokale Fachbetriebe in 48h.',
  alternates: { canonical: 'https://waermepumpenbegleiter.de/kontakt' },
  openGraph: {
    title: 'Kostenlose Wärmepumpen-Anfrage | Wärmepumpenbegleiter.de',
    description: 'In 2 Minuten anfragen — kostenlos, unverbindlich, bis zu 3 Angebote.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
