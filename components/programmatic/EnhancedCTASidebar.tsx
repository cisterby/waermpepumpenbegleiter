// components/programmatic/EnhancedCTASidebar.tsx
// Enhanced CTA with urgency badge — Server Component

import { ArrowRight } from 'lucide-react';

interface EnhancedCTASidebarProps {
  headline: string;
  subline: string;
  button: string;
  urgencyBadge?: string;
  ersparnis: number;
  altKosten: number;
  wpKosten: number;
  zuschuss: number;
  eigenanteil: number;
  amortisationJahre: number;
  cityName: string;
  fmtEuro: (n: number) => string;
}

export default function EnhancedCTASidebar({
  headline, subline, button, urgencyBadge,
  ersparnis, altKosten, wpKosten, zuschuss, eigenanteil, amortisationJahre,
  cityName, fmtEuro,
}: EnhancedCTASidebarProps) {
  return (
    <div className="bg-[#1A4731] rounded-2xl p-6 shadow-2xl">
      {urgencyBadge && (
        <span className="inline-block bg-[#D97706] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{urgencyBadge}</span>
      )}
      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">{headline}</p>
      <p className="font-mono font-bold text-white text-4xl leading-none mb-0.5">{fmtEuro(ersparnis)}</p>
      <p className="text-white/75 text-xs mb-5">{subline}</p>
      <div className="space-y-2 mb-5">
        {[
          { l: 'Heizkosten heute', v: fmtEuro(altKosten) + '/J', c: 'text-[#D97706]' },
          { l: 'Mit Wärmepumpe', v: fmtEuro(wpKosten) + '/J', c: 'text-[#3DA16A]' },
          { l: 'KfW-Zuschuss', v: fmtEuro(zuschuss), c: 'text-white' },
          { l: 'Eigenanteil', v: fmtEuro(eigenanteil), c: 'text-white' },
          { l: 'Amortisation', v: amortisationJahre + ' Jahre', c: 'text-[#D97706]' },
        ].map(r => (
          <div key={r.l} className="flex justify-between py-1.5 border-b border-white/8">
            <span className="text-white/80 text-xs">{r.l}</span>
            <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
          </div>
        ))}
      </div>
      <a href="/rechner"
        className="flex items-center justify-center gap-2 w-full min-h-[48px] py-3.5 bg-[#D97706] text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors mb-2">
        {button} <ArrowRight size={15} />
      </a>
      <p className="text-white/70 text-xs text-center">Kostenlos · Unverbindlich · Kein Spam</p>
    </div>
  );
}
