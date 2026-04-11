'use client';

import Link from 'next/link';
import { AlertTriangle, Home, BookOpen } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#F8F9FA' }}>
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: '#1A4731' }}>
          <AlertTriangle size={40} style={{ color: '#D97706' }} />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1A4731' }}>
          Etwas ist schiefgelaufen
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Entschuldigung! Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut oder navigieren Sie zurück zur Startseite.
        </p>

        {/* Error Details (if available in development) */}
        {error.message && (
          <div className="mb-8 p-4 rounded-lg bg-gray-100 text-left">
            <p className="text-sm text-gray-700 font-mono">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {/* Retry Button */}
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: '#1A4731' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Erneut versuchen
          </button>

          {/* Home Link */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: '#D97706' }}
          >
            <Home size={18} />
            Zur Startseite
          </Link>
        </div>

        {/* Additional Help Link */}
        <Link
          href="/ratgeber"
          className="inline-flex items-center justify-center gap-2 text-base font-semibold transition-colors"
          style={{ color: '#1A4731' }}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
        >
          <BookOpen size={18} />
          Zum Ratgeber
        </Link>
      </div>
    </div>
  );
}
