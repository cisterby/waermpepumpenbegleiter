// components/programmatic/CityVariationBlocks.tsx
// Stadtspezifische Content-Blöcke für alle 22 Templates
// Nutzung: CityVariationBlocks city={city} keyword={keyword} jaz={jaz} calc={calc}
'use client';
import { getCityVariationData } from '@/lib/content-variation';
import type { City } from '@/lib/city-utils';
import type { Keyword } from '@/lib/keywords';
import type { BerechnungsErgebnis } from '@/lib/calculations';

interface Props {
  city: City;
  keyword: Keyword;
  jaz: number;
  calc: BerechnungsErgebnis;
}

// ── USP-Leiste ────────────────────────────────────────────────────────────────
export function USPBar({ city, keyword, jaz, calc }: Props) {
  const { uspBar } = getCityVariationData(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {uspBar.map((u, i) => (
        <div key={i} className="bg-white border border-wp-border rounded-2xl p-5 flex gap-4 items-start shadow-wp-sm">
          <span className="text-2xl shrink-0">{u.icon}</span>
          <div>
            <p className="text-wp-text font-bold text-sm leading-tight mb-1">{u.title}</p>
            <p className="text-wp-text3 text-xs leading-relaxed">{u.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Intro-Paragraphen (3 Blöcke, voll variabel pro Stadt × Keyword) ───────────
export function IntroParagraphs({ city, keyword, jaz, calc }: Props) {
  const { introParagraphs } = getCityVariationData(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  return (
    <div className="space-y-4">
      {introParagraphs.map((p, i) => (
        <p key={i} className="text-wp-text2 text-base leading-relaxed">{p}</p>
      ))}
    </div>
  );
}

// ── Rotierender FAQ-Block (6–8 aus Pool von 20+ pro Kategorie) ────────────────
export function RotatingFAQs({ city, keyword, jaz, calc, count = 6 }: Props & { count?: number }) {
  const data = getCityVariationData(city, keyword, jaz, calc.wpKosten, calc.ersparnis, count);
  return (
    <div className="space-y-3">
      {data.rotatingFAQs.map((faq, i) => (
        <details key={i} className="group border border-wp-border rounded-xl overflow-hidden bg-white">
          <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-wp-bg transition-colors list-none">
            <span className="text-wp-text font-semibold text-sm pr-4 leading-snug">{faq.q}</span>
            <span className="text-wp-green font-bold text-xl shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
          </summary>
          <div className="px-4 pb-4 pt-1 border-t border-wp-border">
            <p className="text-wp-text2 text-sm leading-relaxed">{faq.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

// ── CTA-Variation (headline + subline variieren je Stadt) ─────────────────────
export function CTABlock({ city, keyword, jaz, calc }: Props) {
  const { ctaVariation } = getCityVariationData(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  return (
    <div className="bg-wp-dark rounded-2xl p-8 text-center">
      <h3 className="font-heading font-bold text-white text-2xl mb-2 leading-tight">
        {ctaVariation.headline}
      </h3>
      <p className="text-white/50 text-sm mb-6 max-w-md mx-auto leading-relaxed">
        {ctaVariation.subline}
      </p>
      <a href="#angebot"
        className="inline-flex items-center gap-2 bg-wp-amber hover:bg-amber-700 text-white font-heading font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-wp-lg">
        {ctaVariation.button}
      </a>
    </div>
  );
}

// ── Master-Block: alle 4 Sektionen kombiniert ─────────────────────────────────
export function CityVariationMasterBlock({ city, keyword, jaz, calc }: Props) {
  return (
    <div className="space-y-10">
      <USPBar city={city} keyword={keyword} jaz={jaz} calc={calc} />
      <IntroParagraphs city={city} keyword={keyword} jaz={jaz} calc={calc} />
      <RotatingFAQs city={city} keyword={keyword} jaz={jaz} calc={calc} count={6} />
      <CTABlock city={city} keyword={keyword} jaz={jaz} calc={calc} />
    </div>
  );
}
