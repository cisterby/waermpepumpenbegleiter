// app/not-found.tsx
// Benutzerdefinierte 404-Seite — SEO: sauberer HTTP-Status, kein Soft-404
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="text-6xl font-bold text-[#1B5E37] mb-4">404</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Seite nicht gefunden
        </h1>
        <p className="text-gray-600 mb-8">
          Die gesuchte Seite existiert leider nicht oder wurde verschoben.
          Nutzen Sie unsere Startseite, um den passenden Wärmepumpen-Service in Ihrer Stadt zu finden.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1B5E37] text-white font-medium hover:bg-[#154a2c] transition-colors"
          >
            Zur Startseite
          </Link>
          <Link
            href="/waermepumpe"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#1B5E37] text-[#1B5E37] font-medium hover:bg-[#E8F5EE] transition-colors"
          >
            Alle Städte durchsuchen
          </Link>
        </div>
      </div>
    </div>
  );
}
