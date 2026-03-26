import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wärmepumpenbegleiter.de — Ihr unabhängiger Begleiter für die Heizungswende',
  description: 'Kostenlose, herstellerunabhängige Beratung für Wärmepumpen. Geprüfte Fachbetriebe, KfW-Förderung bis 70%, individuelle Kostenberechnung.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
