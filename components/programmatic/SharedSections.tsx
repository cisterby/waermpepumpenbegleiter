// components/programmatic/SharedSections.tsx
// Shared, reusable template sections using content-variation system
// Eliminates boilerplate across all programmatic templates
// All components are server-side (no 'use client')

import Link from 'next/link';
import { BarChart3, Calendar, CheckCircle, Clock, Euro, Home, Shield, Star, Thermometer, TrendingDown, Wrench, Zap, AlertTriangle } from 'lucide-react';
import type { City } from '@/lib/city-utils';
import type { Keyword } from '@/lib/keywords';
import { calcCO2Ersparnis, estimateJAZ } from '@/lib/city-utils';
import { fmtEuro, fmtKwh } from '@/lib/calculations';
import {
  getDynamicH2s,
  getSectionIntros,
  getActualityBlock,
  getUniqueLocalParagraph,
  getNearbyLinkContext,
  cityHash,
  getIntroParagraphs,
} from '@/lib/content-variation';

// ── Type Definitions ──────────────────────────────────────────────────────────

export interface SharedProps {
  city: City;
  keyword: Keyword;
  jaz: number;
  wpKosten: number;
  ersparnis: number;
}

interface FoerderungSectionProps extends SharedProps {
  eigenanteil: number;
}

interface InternalLinkingSectionProps extends SharedProps {
  nearby: City[];
  allKeywords: Keyword[];
}

interface ProcessTimelineStep {
  number: number;
  title: string;
  details: string;
  duration: string;
}

interface CTASectionProps extends SharedProps {
  variant: 'hero' | 'mid' | 'bottom' | 'sticky';
  foerdQuote?: number;
  foerdZuschuss?: number;
}

// ── 1. KLIMADATEN SECTION ─────────────────────────────────────────────────────
// Dynamic climate data display with 4-cell grid

export function KlimadatenSection({ city, keyword, jaz, wpKosten, ersparnis }: SharedProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si = getSectionIntros(city, keyword, jaz, wpKosten, ersparnis);
  const uniquePara = getUniqueLocalParagraph(city, keyword, jaz, wpKosten, ersparnis);

  return (
    <section className="space-y-6">
      <div>
        <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Klimadaten {city.name}
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{h2s.klimadaten}</h2>
        <p className="text-[#4A6358] text-base leading-relaxed mb-6">{si.klimadaten}</p>
      </div>

      {/* 4-Cell Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <BarChart3 size={20} className="text-[#1B5E37]" />, label: 'Heizgradtage/Jahr', value: city.heizgradtage.toLocaleString('de-DE'), unit: 'Kd/a' },
          { icon: <Thermometer size={20} className="text-[#1B5E37]" />, label: 'Normaußentemp.', value: city.normAussentemp.toString(), unit: '°C' },
          { icon: <Zap size={20} className="text-[#D97706]" />, label: 'JAZ erreichbar', value: jaz.toString(), unit: 'x kWh/kWh' },
          { icon: <Euro size={20} className="text-[#D97706]" />, label: 'Strompreis lokal', value: city.strompreis.toString(), unit: 'ct/kWh' },
        ].map((cell, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">{cell.icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">{cell.label}</p>
              <p className="font-mono font-bold text-gray-900 text-lg leading-none">{cell.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cell.unit}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Unique Local Paragraph */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <p className="text-[#4A6358] text-sm leading-relaxed">{uniquePara}</p>
      </div>

      {/* Data Source Citation */}
      <div className="text-xs text-gray-500 text-center pt-2">
        Datenquellen: DWD, BDEW 2025/2026
      </div>
    </section>
  );
}

// ── 2. FOERDERUNG SECTION ─────────────────────────────────────────────────────
// KfW funding breakdown with visual bar chart

export function FoerderungSection({ city, keyword, jaz, wpKosten, ersparnis, eigenanteil }: FoerderungSectionProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si = getSectionIntros(city, keyword, jaz, wpKosten, ersparnis);
  const act = getActualityBlock(city, keyword, jaz, wpKosten, eigenanteil);

  const foerderBoni = [
    { label: 'Grundförderung', pct: 30, color: '#1B5E37' },
    { label: 'Klima-Speed-Bonus (fossile → WP)', pct: 20, color: '#D97706' },
    { label: 'Einkommens-Bonus (< €40.000 netto)', pct: 30, color: '#F59E0B' },
    { label: 'Natürliches Kältemittel R290', pct: 5, color: '#2A7D4F' },
  ];

  return (
    <section id="foerderung" className="space-y-6">
      <div>
        <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          KfW-Programm 458
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{h2s.foerderung}</h2>
        <p className="text-[#4A6358] text-base leading-relaxed mb-6">{si.foerderung}</p>
      </div>

      {/* Förder-Boni Bar Chart */}
      <div className="space-y-3 bg-white rounded-xl p-6 border border-gray-200">
        {foerderBoni.map((bonus, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700">{bonus.label}</span>
              <span className="font-mono font-bold text-sm" style={{ color: bonus.color }}>
                +{bonus.pct}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div
                className="h-full rounded-full transition-all"
                style={{ backgroundColor: bonus.color, width: (bonus.pct / 70 * 100) + '%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total Possible */}
      <div className="bg-[#E8F5EE] rounded-xl p-5 flex items-center justify-between border border-[#D5F0E4]">
        <span className="font-bold text-[#1B5E37] text-sm">Gesamt möglich (Eigennutzer)</span>
        <span className="font-mono font-extrabold text-[#1B5E37] text-xl">bis 70%</span>
      </div>

      {/* Bundesland-Specific Funding Note */}
      {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>{city.bundesland}-Förderung:</strong> {city.bundeslandFoerderung}
            {city.bundeslandFoerderungBetrag && <span> — {city.bundeslandFoerderungBetrag}</span>}
          </p>
        </div>
      )}

      {/* Actuality Block — gegReform */}
      {act.gegReform && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-sm text-amber-800">{act.gegReform}</p>
        </div>
      )}

      {/* CTA Link */}
      <Link
        href={`/waermepumpe-foerderung/${city.slug}`}
        className="block w-full text-center py-3 bg-[#1B5E37] text-white font-bold rounded-xl hover:bg-[#154d2c] transition-colors text-sm"
      >
        Förderung für {city.name} berechnen →
      </Link>
    </section>
  );
}

// ── 3. KOSTEN VERGLEICH SECTION ───────────────────────────────────────────────
// Cost comparison: WP vs Gas with visual difference

export function KostenVergleichSection({ city, keyword, jaz, wpKosten, ersparnis }: SharedProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const gaspreis = (wpKosten + ersparnis);

  return (
    <section className="space-y-6">
      <div>
        <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Kostenvergleich
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{h2s.vergleich}</h2>
      </div>

      {/* Cost Comparison Cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Wärmepumpe */}
        <div className="bg-white rounded-xl border-2 border-[#1B5E37] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#1B5E37]/5 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#E8F5EE] flex items-center justify-center flex-shrink-0">
              <Zap size={20} className="text-[#1B5E37]" />
            </div>
            <h3 className="font-bold text-gray-900">Wärmepumpe</h3>
          </div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">Jährliche Betriebskosten</p>
          <p className="font-mono font-extrabold text-[#1B5E37] text-3xl mb-2">{fmtEuro(wpKosten)}</p>
          <p className="text-xs text-gray-500 mb-4">bei JAZ {jaz} & {city.strompreis} ct/kWh</p>
          <div className="bg-[#E8F5EE] rounded-lg p-3">
            <p className="text-xs text-[#1B5E37] font-semibold mb-0.5">20-Jahre Kosten</p>
            <p className="font-mono font-bold text-[#1B5E37] text-lg">{fmtEuro(wpKosten * 20)}</p>
          </div>
        </div>

        {/* Gasheizung */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 relative overflow-hidden opacity-75">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <TrendingDown size={20} className="text-gray-500" />
            </div>
            <h3 className="font-bold text-gray-900">Erdgasheizung</h3>
          </div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">Jährliche Betriebskosten</p>
          <p className="font-mono font-extrabold text-gray-600 text-3xl mb-2">{fmtEuro(gaspreis)}</p>
          <p className="text-xs text-gray-500 mb-4">bei {city.gaspreis} ct/kWh</p>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-600 font-semibold mb-0.5">20-Jahre Kosten</p>
            <p className="font-mono font-bold text-gray-600 text-lg">{fmtEuro(gaspreis * 20)}</p>
          </div>
        </div>
      </div>

      {/* Savings Highlight */}
      <div className="bg-gradient-to-r from-[#E8F5EE] to-[#F8F9FA] rounded-xl p-6 border border-[#D5F0E4] text-center">
        <p className="text-xs text-[#4A6358] font-semibold uppercase mb-2">Jährliche Ersparnis mit Wärmepumpe</p>
        <p className="font-mono font-extrabold text-[#1B5E37] text-4xl mb-1">{fmtEuro(ersparnis)}</p>
        <p className="text-sm text-[#4A6358]">
          = <strong>{fmtEuro(ersparnis * 20)}</strong> über 20 Jahre
        </p>
      </div>

      {/* CTA */}
      <Link
        href={`/rechner`}
        className="block w-full text-center py-3 bg-[#1B5E37] text-white font-bold rounded-xl hover:bg-[#154d2c] transition-colors text-sm"
      >
        Individuelle Berechnung für {city.name} →
      </Link>
    </section>
  );
}

// ── 4. AUTHOR BOX SECTION ─────────────────────────────────────────────────────
// E-E-A-T author credibility box

export function AuthorBoxSection({ city }: { city: City }) {
  const dataSources = ['DWD', 'KfW', 'BAFA', 'BWP', 'BDEW', 'Fraunhofer ISE', 'Stiftung Warentest'];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-5">
      {/* Photo Placeholder */}
      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#E8F5EE] bg-[#1B5E37] flex items-center justify-center text-white font-bold text-xl">
        BS
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Bastian Saupe</h3>
            <p className="text-sm text-gray-600">Gründer Wärmepumpenbegleiter.de</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Seit 2025 vermittle ich unabhängig zwischen Hausbesitzern und lokalen WP-Fachbetrieben. Mein Fokus liegt auf transparenter
          Kostenberechnung, KfW-Antrags-Begleitung und der Auswahl qualifizierter Installateure. Alle Inhalte basieren auf aktuellen
          Klimadaten, amtlichen Förderrichtlinien und praktischer Feldtest-Erfahrung.
        </p>

        {/* Data Sources */}
        <div className="mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Datenbasis</p>
          <div className="flex flex-wrap gap-1.5">
            {dataSources.map((source) => (
              <span key={source} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                {source}
              </span>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-gray-400">
          Letzte Aktualisierung: April 2026 für {city.name} · Schema.org Person
        </p>
      </div>
    </div>
  );
}

// ── 5. INTERNAL LINKING SECTION ───────────────────────────────────────────────
// Cross-keyword + nearby city links with enriched context text

export function InternalLinkingSection({
  city,
  keyword,
  jaz,
  nearby,
  allKeywords,
}: InternalLinkingSectionProps) {
  // Get cross-keyword links
  const crossKeywords = keyword.crossLinks
    .map((slug) => allKeywords.find((k) => k.slug === slug))
    .filter((k) => k != null);

  // Get nearby city links
  const nearbyLinks = getNearbyLinkContext(city, nearby, keyword, jaz);

  return (
    <section className="space-y-8">
      {/* Cross-Keywords */}
      {crossKeywords.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Verwandte Themen in {city.name}</h3>
          <div className="flex flex-wrap gap-2">
            {crossKeywords.map((kw) =>
              kw ? (
                <Link
                  key={kw.slug}
                  href={`/${kw.slug}/${city.slug}`}
                  className="px-4 py-2.5 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-[#1B5E37] hover:text-[#1B5E37] transition-colors"
                >
                  {kw.keyword.replace('[Stadt]', city.name)}
                </Link>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Nearby Cities */}
      {nearbyLinks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Wärmepumpe in der Nähe</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {nearbyLinks.map((nl) => (
              <Link
                key={nl.city.slug}
                href={nl.url}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl text-sm font-medium border border-gray-200 hover:border-[#1B5E37] hover:text-[#1B5E37] transition-all group"
              >
                <span className="w-2 h-2 rounded-full bg-[#4CAF7D] shrink-0 group-hover:scale-125 transition-transform" />
                {nl.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ── 6. PROCESS TIMELINE SECTION ───────────────────────────────────────────────
// Installation timeline with steps and durations

export function ProcessTimelineSection({ city, keyword, jaz, wpKosten, ersparnis }: SharedProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);

  const steps: ProcessTimelineStep[] = [
    {
      number: 1,
      title: 'Kostenlose Anfrage',
      details: 'Teilen Sie uns Ihre Situation mit — Gebäudetyp, Heizungsalter, Wünsche.',
      duration: '5 Min.',
    },
    {
      number: 2,
      title: '3 Angebote in 48h',
      details: `Wir vermitteln geprüfte Fachbetriebe in ${city.name}. Sie erhalten vollständige Vergleichsangebote.`,
      duration: '48 Std.',
    },
    {
      number: 3,
      title: 'KfW-Antrag vor Baubeginn',
      details: `Der Betrieb stellt mit Ihnen den KfW-Antrag — zwingend VOR erste Arbeiten. ${city.gegFrist ? `GEG-Frist in ${city.name}: ${city.gegFrist}` : 'GEG-Konformität ab 2028.'}`,
      duration: '1-2 Wo.',
    },
    {
      number: 4,
      title: 'Installation & Inbetriebnahme',
      details: 'Montage der WP, hydraulische Integration, Systemtest und Einweisung.',
      duration: '1-3 Tage',
    },
    {
      number: 5,
      title: 'KfW-Verwendungsnachweis',
      details: 'Der Betrieb reicht die Abschlussdokumentation ein — Sie erhalten Ihren Zuschuss.',
      duration: '2-4 Wo.',
    },
    {
      number: 6,
      title: 'Fernwärme-Überprüfung (ggf.)',
      details: `${city.fernwaermeQuote > 50 ? `In ${city.name} sind ${city.fernwaermeQuote}% ans Fernwärmenetz. Ihre Liegenschaft muss fernwärmefrei sein.` : `Nur relevant, wenn Ihr Gebäude noch nicht ans Fernwärmenetz angeschlossen ist.`}`,
      duration: 'Vorab',
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Ablauf
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{h2s.prozess}</h2>
      </div>

      {/* Timeline */}
      <div className="space-y-6 relative">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-6 relative">
            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-20 bg-gradient-to-b from-[#1B5E37]/30 to-transparent" />
            )}

            {/* Badge */}
            <div className="flex-shrink-0 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#1B5E37] text-white flex items-center justify-center font-bold text-sm shadow-md">
                {step.number}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 flex-1">
              <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                <h3 className="font-bold text-gray-900">{step.title}</h3>
                <span className="text-xs bg-[#E8F5EE] text-[#1B5E37] font-semibold px-2.5 py-1 rounded-full shrink-0">
                  {step.duration}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{step.details}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 7. TESTIMONIAL SECTION ────────────────────────────────────────────────────
// Social proof with star rating and quote

export function TestimonialSection({ city, keyword, jaz, wpKosten, ersparnis }: SharedProps) {
  // Placeholder testimonial (in production: fetch from database or CMS)
  const testimonial = {
    name: 'Klaus W.',
    location: city.name,
    rating: 5,
    quote: `Die ganze Begleitung von Anfrage bis KfW-Auszahlung war reibungslos. Der Betrieb in ${city.name} war zuverlässig, und wir sparen jetzt ${fmtEuro(ersparnis)} pro Jahr. Super Service!`,
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
      {/* Stars */}
      <div className="flex justify-center gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={20} className="fill-[#D97706] text-[#D97706]" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-lg text-gray-700 font-medium mb-4 italic leading-relaxed">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="mb-2">
        <p className="font-semibold text-gray-900">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.location}</p>
      </div>

      {/* Attribution */}
      <p className="text-xs text-gray-400">Vermittelt über Wärmepumpenbegleiter.de</p>
    </div>
  );
}

// ── 8. TRUST BAR SECTION ──────────────────────────────────────────────────────
// Data sources trust bar with two variants

export function TrustBarSection({ variant = 'full' }: { variant?: 'compact' | 'full' }) {
  const sources = [
    { name: 'DWD', icon: '🌡️' },
    { name: 'KfW', icon: '🏛️' },
    { name: 'BAFA', icon: '📋' },
    { name: 'BWP', icon: '⚙️' },
    { name: 'BDEW', icon: '⚡' },
    { name: 'Fraunhofer ISE', icon: '🔬' },
    { name: 'Stiftung Warentest', icon: '✓' },
  ];

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Datenquellen</p>
        <div className="flex flex-wrap justify-center gap-2">
          {sources.slice(0, 4).map((src) => (
            <span key={src.name} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">
              {src.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Alle Daten basieren auf offiziellen Quellen</p>
        <div className="flex flex-wrap gap-3">
          {sources.map((src) => (
            <div key={src.name} className="flex items-center gap-2">
              <span className="text-lg">{src.icon}</span>
              <span className="text-sm font-semibold text-gray-700">{src.name}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
        Datenschutz DSGVO-konform · HWK-Partnerbetriebe geprüft · Kostenloser Service
      </p>
    </div>
  );
}

// ── 9. SEASONAL ADVICE SECTION ────────────────────────────────────────────────
// When to install with visual month calendar

export function SeasonalAdviceSection({ city, keyword, jaz, wpKosten, ersparnis }: SharedProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const optimalMonths = [3, 4, 8, 9]; // April-May, September-October

  return (
    <section className="space-y-6">
      <div>
        <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Timing
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{h2s.wirtschaftlichkeit}</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-700 text-sm font-semibold mb-4">Optimale Installationsmonate für {city.name}</p>

        {/* Calendar Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
          {months.map((month, idx) => {
            const isOptimal = optimalMonths.includes(idx);
            return (
              <div
                key={month}
                className={`p-4 rounded-lg text-center font-semibold text-sm transition-all ${
                  isOptimal
                    ? 'bg-[#1B5E37] text-white border-2 border-[#1B5E37]'
                    : 'bg-gray-50 text-gray-700 border-2 border-gray-200'
                }`}
              >
                {month}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1B5E37] flex items-center justify-center flex-shrink-0">
              <CheckCircle size={16} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Beste Zeit: April-Mai & September-Oktober</p>
              <p className="text-gray-600 text-xs">Mild-temperierte Jahreszeiten ermöglichen schnelle Installation und vollständiges Funktions-Testen.</p>
            </div>
          </div>

          {city.gegFrist && city.gegFrist <= '2026-12-31' && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">GEG-Frist dringlich</p>
                <p className="text-gray-600 text-xs">
                  Die Heizungsaustausch-Frist für {city.name} läuft bis {city.gegFrist.split('-').reverse().join('.')}. Handeln Sie jetzt, um keine Gelegenheit zu versäumen.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── 10. CTA SECTION ───────────────────────────────────────────────────────────
// Call to action with 4 visual variants

export function CTASection({
  city,
  keyword,
  ersparnis,
  variant = 'mid',
  foerdQuote = 55,
  foerdZuschuss = 13750,
}: CTASectionProps) {
  const variants = {
    hero: {
      bg: 'bg-[#1B5E37]',
      textColor: 'text-white',
      buttonBg: 'bg-[#D97706] hover:bg-[#b45309]',
      shadow: 'shadow-2xl shadow-[#1B5E37]/20',
    },
    mid: {
      bg: 'bg-gradient-to-r from-[#1B5E37] to-[#154d2c]',
      textColor: 'text-white',
      buttonBg: 'bg-[#D97706] hover:bg-[#b45309]',
      shadow: 'shadow-lg shadow-[#1B5E37]/15',
    },
    bottom: {
      bg: 'bg-white',
      textColor: 'text-gray-900',
      buttonBg: 'bg-[#1B5E37] hover:bg-[#154d2c]',
      shadow: 'shadow-md border border-gray-200',
    },
    sticky: {
      bg: 'bg-[#1B5E37]',
      textColor: 'text-white',
      buttonBg: 'bg-[#D97706] hover:bg-[#b45309]',
      shadow: 'shadow-2xl shadow-[#1B5E37]/30',
    },
  };

  const v = variants[variant];

  return (
    <div className={`${v.bg} rounded-2xl p-6 md:p-8 ${v.shadow} relative overflow-hidden`}>
      {variant !== 'bottom' && <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />}

      <div className="relative z-10">
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${variant === 'bottom' ? 'text-gray-500' : 'text-[#4CAF7D]'}`}>
          {variant === 'sticky' ? 'Ihre Vorteile' : 'Kostenloser Service'}
        </p>

        <h2 className={`text-2xl md:text-3xl font-bold ${v.textColor} mb-2`}>
          {variant === 'sticky'
            ? `Wärmepumpe für ${city.name}`
            : `Angebot für ${city.name} anfordern`}
        </h2>

        <p className={`text-sm mb-6 ${variant === 'bottom' ? 'text-gray-600' : 'text-white/85'}`}>
          Bis zu 3 geprüfte Fachbetriebe aus Ihrer Region · 48h Angebote · Kostenlos & unverbindlich
        </p>

        {/* Key Metrics */}
        {variant === 'sticky' && (
          <div className="space-y-2 mb-6 text-sm">
            {[
              { label: 'Jahresersparnis', value: fmtEuro(ersparnis), color: 'text-amber-300' },
              { label: 'KfW-Zuschuss', value: `bis ${foerdQuote}%`, color: 'text-[#4CAF7D]' },
              { label: 'Amortisation', value: '7-12 Jahre', color: 'text-white' },
            ].map((metric) => (
              <div key={metric.label} className="flex justify-between">
                <span className="text-white/80">{metric.label}</span>
                <span className={`font-mono font-bold ${metric.color}`}>{metric.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <a
          href="/rechner"
          className={`block w-full text-center py-3.5 ${v.buttonBg} ${v.textColor} font-bold rounded-xl transition-colors text-sm mb-3`}
        >
          Kostenlos Angebot anfordern →
        </a>

        {/* Trust Text */}
        <p className={`text-xs text-center ${variant === 'bottom' ? 'text-gray-500' : 'text-white/65'}`}>
          DSGVO-konform · HWK-geprüfte Betriebe · Kein Spam
        </p>
      </div>
    </div>
  );
}
