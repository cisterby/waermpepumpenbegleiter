// app/wie-es-funktioniert/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wie es funktioniert — Kostenloser Wärmepumpen-Vermittlungsservice',
  description: 'So funktioniert Wärmepumpenbegleiter: 4 Schritte von der Anfrage bis zur fertigen Wärmepumpe. Wie wir Installateure prüfen, wie der KfW-Antrag läuft und was Sie erwartet.',
  alternates: { canonical: 'https://waermepumpenbegleiter.de/wie-es-funktioniert' },
  openGraph: {
    title: 'Wie es funktioniert | Wärmepumpenbegleiter.de',
    description: '4 Schritte zur fertigen Wärmepumpe — kostenlos, geprüfte Betriebe, KfW inklusive.',
    type: 'website',
  },
};

export default function WEFLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
