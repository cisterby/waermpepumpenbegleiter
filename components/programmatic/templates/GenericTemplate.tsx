// components/programmatic/templates/GenericTemplate.tsx
// Fallback für alle Tier 2–4 Keywords bis spezialisierte Templates fertig sind
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Shield, Zap, Euro, Clock } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';

export default function GenericTemplate({
  city, keyword, calc, foerd, jaz, nearby, h1,
}: CityPageRouterProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = keyword.faqPool.slice(0, 5).map(item => ({
    q: fillTemplate(item.q, city, jaz, calc.wpKosten, calc.ersparnis),
    a: fillTemplate(item.a, city, jaz, calc.wpKosten, calc.ersparnis),
  }));

  const crossKeywords = keyword.crossLinks
    .map(slug => getKeywordBySlug(slug))
    .filter(Boolean);

  const breadcrumbs = [
    { label: 'Startseite', href: '/' },
    { label: keyword.keyword.replace('[Stadt]', '').trim(), href: `/${keyword.slug}` },
    { label: city.name, href: `/${keyword.slug}/${city.slug}` },
  ];

  return (
    <div className="min-h-screen bg-wp-bg font-sans">

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Service',
        name: `${keyword.keyword.replace('[Stadt]', city.name)}`,
        areaServed: { '@type': 'City', name: city.name },
        provider: { '@type': 'Organization', name: 'Wärmepumpenbegleiter.de' },
      })}} />

      {/* HEADER */}
      <div className="bg-wp-dark pt-20 pb-14 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            {breadcrumbs.map((b, i) => (
              <span key={b.href} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/25">›</span>}
                {i < breadcrumbs.length - 1
                  ? <Link href={b.href} className="text-white/45 hover:text-white/70 transition-colors">{b.label}</Link>
                  : <span className="text-white/80">{b.label}</span>}
              </span>
            ))}
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs text-white/80 mb-4">
            <span className="w-1.5 h-1.5 bg-wp-green3 rounded-full animate-pulse-dot" />
            {city.bundesland}
          </div>
          <h1 className="font-heading font-extrabold text-white mb-4 leading-tight" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
            {h1}
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-2xl mb-8">
            {fillTemplate(
              `In {stadt} begleiten wir Sie durch die Wärmepumpen-Entscheidung — kostenlos, herstellerunabhängig, mit geprüften Fachbetrieben.`,
              city, jaz
            )}
          </p>
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'JAZ', val: jaz.toString(), sub: city.name },
              { label: 'Ersparnis/Jahr', val: fmtEuro(calc.ersparnis), sub: 'vs. Gas' },
              { label: 'KfW-Förderung', val: `${foerd.gesamtSatz}%`, sub: fmtEuro(foerd.zuschuss) },
              { label: 'Amortisation', val: calc.amortisationJahre + 'J', sub: '55% Förderung' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="font-mono font-bold text-white text-lg leading-none mb-0.5">{s.val}</div>
                <div className="text-wp-green3 text-xs font-semibold">{s.label}</div>
                <div className="text-white/35 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-5xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_340px] gap-10 items-start">

        {/* LEFT */}
        <div>
          {/* Featured Snippet H2 */}
          {keyword.featuredSnippetQuestions[0] && (
            <div className="bg-white border border-wp-border rounded-xl p-6 mb-8 border-l-4 border-l-wp-green shadow-wp-sm">
              <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
                {fillTemplate(keyword.featuredSnippetQuestions[0], city, jaz)}
              </h2>
              <p className="text-wp-text2 text-base leading-relaxed">
                In {city.name} kostet eine Wärmepumpe inklusive Installation zwischen <strong>€18.000 und €28.000</strong>.
                Nach KfW-Förderung ({foerd.gesamtSatz}%) beträgt Ihr Eigenanteil <strong>{fmtEuro(foerd.eigenanteil)}</strong>.
                Die jährliche Ersparnis gegenüber Erdgas liegt bei <strong>{fmtEuro(calc.ersparnis)}</strong>.
              </p>
            </div>
          )}

          {/* Stadt-Klimainfo */}
          <h2 className="font-heading font-bold text-wp-text mb-4" style={{ fontSize: 'clamp(22px,2.5vw,34px)' }}>
            Wärmepumpe in {city.name} — Stadtspezifische Fakten
          </h2>
          <p className="text-wp-text2 text-base leading-relaxed mb-5">
            {city.name} ({city.bundesland}) hat eine Jahresmitteltemperatur von <strong>{city.avgTemp}°C</strong> und{' '}
            <strong>{city.heizgradtage.toLocaleString('de-DE')} Heizgradtage</strong> pro Jahr (GTZ20/15, Quelle: IWU).
            Eine Luft-Wasser-Wärmepumpe erreicht hier eine Jahresarbeitszahl von <strong>{jaz}</strong>.
          </p>
          <p className="text-wp-text2 text-base leading-relaxed mb-8">
            Bei einem 120 m² EFH (Baujahr 1980–1994) fallen in {city.name} mit dem lokalen Strompreis von{' '}
            <strong>{city.strompreis} ct/kWh</strong> jährlich <strong>{fmtEuro(calc.wpKosten)}</strong> Heizkosten an —
            gegenüber <strong>{fmtEuro(calc.altKosten)}</strong> mit Erdgas. Das spart <strong>{fmtEuro(calc.ersparnis)} pro Jahr</strong>.
          </p>

          {/* Weitere Featured-Snippet-Fragen */}
          {keyword.featuredSnippetQuestions.slice(1).map((q, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-heading font-semibold text-wp-text text-lg mb-2">
                {fillTemplate(q, city, jaz)}
              </h3>
              <p className="text-wp-text2 text-sm leading-relaxed">
                {faqs[i + 1]?.a ?? `Erfahren Sie mehr von unseren geprüften Fachbetrieben in ${city.name}.`}
              </p>
            </div>
          ))}

          {/* Bundesland-Förderung */}
          {city.bundeslandFoerderung && (
            <div className="bg-white border border-wp-border rounded-xl p-5 mb-8 shadow-wp-sm">
              <h3 className="font-heading font-semibold text-wp-text text-lg mb-2">
                Landesförderung {city.bundesland}
              </h3>
              <p className="text-wp-text2 text-sm leading-relaxed mb-2">
                Zusätzlich zur KfW-Bundesförderung gibt es in {city.bundesland} das Programm{' '}
                <strong>{city.bundeslandFoerderung}</strong>
                {city.bundeslandFoerderungBetrag ? ` mit ${city.bundeslandFoerderungBetrag}` : ''}.
              </p>
              {city.bundeslandFoerderungUrl && (
                <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer"
                  className="text-wp-green text-sm font-semibold hover:underline">
                  → Mehr erfahren
                </a>
              )}
            </div>
          )}

          {/* FAQ */}
          <h2 className="font-heading font-bold text-wp-text mb-5" style={{ fontSize: 'clamp(22px,2.5vw,32px)' }}>
            Häufige Fragen zur Wärmepumpe in {city.name}
          </h2>
          <div className="border border-wp-border rounded-xl overflow-hidden bg-white shadow-wp-sm mb-10">
            {faqs.map((faq, i) => (
              <div key={i} className={i < faqs.length - 1 ? 'border-b border-wp-border' : ''}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full bg-transparent border-none px-5 py-4 flex justify-between items-center cursor-pointer text-left gap-3">
                  <span className="font-heading font-semibold text-wp-text text-base leading-snug">{faq.q}</span>
                  <ChevronDown size={16} className={`text-wp-text3 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <p className="px-5 pb-4 text-wp-text2 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Nachbarstädte + Cross-Links */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw => kw && (
                  <Link key={kw.slug} href={`/${kw.slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                    {kw.keyword.replace('[Stadt]', '')}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Sticky CTA */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-wp-dark rounded-2xl p-6 shadow-wp-xl">
            <p className="text-white/55 text-xs font-semibold uppercase tracking-wider mb-1">Jährl. Ersparnis in {city.name}</p>
            <p className="font-mono font-bold text-white text-4xl leading-none mb-1">{fmtEuro(calc.ersparnis)}</p>
            <p className="text-white/40 text-xs mb-5">gegenüber Erdgas · 120 m² EFH</p>
            <div className="space-y-2 mb-5">
              {[
                { l: 'Heizkosten heute',   v: fmtEuro(calc.altKosten) + '/J', c: 'text-wp-amber' },
                { l: 'Mit Wärmepumpe',     v: fmtEuro(calc.wpKosten)  + '/J', c: 'text-wp-green3' },
                { l: 'KfW-Zuschuss',       v: fmtEuro(foerd.zuschuss),         c: 'text-white' },
                { l: 'Ihr Eigenanteil',    v: fmtEuro(foerd.eigenanteil),       c: 'text-white' },
                { l: 'Amortisation',       v: calc.amortisationJahre + ' J.',   c: 'text-wp-amber' },
              ].map(r => (
                <div key={r.l} className="flex justify-between py-1.5 border-b border-white/8">
                  <span className="text-white/45 text-xs">{r.l}</span>
                  <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                </div>
              ))}
            </div>
            <a href="/rechner"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-colors mb-2">
              Kostenloses Angebot in {city.name} <ArrowRight size={15} />
            </a>
            <p className="text-white/30 text-xs text-center">Kostenlos · Unverbindlich · Kein Spam</p>
          </div>
          <div className="bg-white border border-wp-border rounded-xl p-4 shadow-wp-sm">
            <p className="text-xs font-bold text-wp-text3 uppercase tracking-wider mb-3">Warum Wärmepumpenbegleiter?</p>
            {['Herstellerunabhängig', 'HWK-geprüfte Betriebe', 'KfW-Begleitung inklusive', `Lokale Betriebe in ${city.name}`, '100% kostenlos'].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-wp-border last:border-0 text-xs text-wp-text2">
                <span className="text-wp-green font-bold">✓</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
