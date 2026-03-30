// app/ueber-uns/layout.tsx
// Metadata + Person Schema für Über-uns-Seite (E-E-A-T)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Über uns — Wärmepumpenbegleiter.de',
  description: 'Das Team: Energieberater IHK, Dipl.-Ing. Gebäudetechnik und SHK-Meister. Herstellerunabhängig, transparent, kostenlos für Hausbesitzer.',
  alternates: { canonical: 'https://waermepumpenbegleiter.de/ueber-uns' },
};

export default function UeberUnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
