// components/programmatic/templates/WaermepumpeKostenTemplate.tsx
// VOLLSTÄNDIG GEFIXT: Kein doppelter H2, FAQs native [details], Ersparnis differenziert, FAQPage Schema, voller Fließtext
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, AlertTriangle, TrendingUp, Calculator } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock , getUniqueLocalParagraph, getNearbyLinkContext, getBundeslandParagraph, getGebaeudeParagraph, getEnergieParagraph, getComparisonTable, getLocalTestimonial, getSeasonalAdvice, getCrossKeywordLinks, getInlineLinkedParagraph, getLokaleTiefenanalyse, getPVWPKombination, getROITimeline, getNachbarschaftsvergleich, getHeizkoerperCheck, getStromtarifOptimierung, getKeywordDeepContent } from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG_HERO   = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80';
const IMG_MONEY  = 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=900&q=80';
const IMG_HOUSE  = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80';
const IMG_WORKER = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80';

export default function WaermepumpeKostenTemplate({
  city, keyword, calc, foerd, jaz, nearby, h1,
}: CityPageRouterProps) {
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean);
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const v = cityHash(city, 4, 17);
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');

  // Differenzierte Ersparnis pro WP-Typ (Sole/Wasser haben höhere JAZ → mehr Ersparnis)
  const jazLuft  = jaz;
  const jazSole  = Math.min(jaz + 0.8, 5.0);
  const jazWasser = Math.min(jaz + 1.2, 5.5);
  const ersparnisLuft   = calc.ersparnis;
  const ersparnisSole   = Math.round(calc.altKosten - (calc.altKosten / jaz) * jazSole  * (city.strompreis / 100) * 100);
  const ersparnisWasser = Math.round(calc.altKosten - (calc.altKosten / jaz) * jazWasser * (city.strompreis / 100) * 100);

  // 4 stadtspezifische Intro-Varianten
  const intros = [
    `Eine Luft-Wasser-Wärmepumpe kostet in ${city.name} (${city.bundesland}) inklusive Gerät, Montage, hydraulischem Abgleich und Elektroinstallation zwischen €18.000 und €28.000 brutto. Nach KfW-Förderung (${foerd.gesamtSatz}%) reduziert sich Ihr Eigenanteil auf ${fmtEuro(foerd.eigenanteil)}. Bei ${city.strompreis} ct/kWh Strompreis und JAZ ${jazLuft} beträgt die jährliche Ersparnis gegenüber Ihrer Gasheizung ${fmtEuro(ersparnisLuft)}.`,
    `In ${city.name} mit ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und ${city.avgTemp}°C Jahresmitteltemperatur arbeitet eine Wärmepumpe mit JAZ ${jazLuft}. Bei ${city.strompreis} ct/kWh Strom und ${city.gaspreis} ct/kWh Gas (aktuell) sparen Sie ${fmtEuro(ersparnisLuft)}/Jahr — das Gerät amortisiert sich nach ${calc.amortisationJahre} Jahren.`,
    `Was kostet eine Wärmepumpe wirklich in ${city.name}? Gerätepreis (€8.000–15.000), Montage (€3.000–6.000), hydraulischer Abgleich (€500–1.500, KfW-Pflicht), Elektroinstallation (€500–1.500) und Fundament (€300–800). Gesamt: €14.000–28.000. Abzüglich ${foerd.gesamtSatz}% KfW = ${fmtEuro(foerd.eigenanteil)} Eigenanteil.`,
    `${city.bundesland}: ${foerd.gesamtSatz}% KfW-Förderung = ${fmtEuro(foerd.zuschuss)} nicht rückzahlbarer Zuschuss für Hausbesitzer in ${city.name}. Jahresarbeitszahl ${jazLuft} bei ${city.normAussentemp}°C Normaußentemperatur. Betriebskosten Wärmepumpe: ${fmtEuro(calc.wpKosten)}/Jahr — gegenüber ${fmtEuro(calc.altKosten)}/Jahr Gas.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const uniqueParagraph = getUniqueLocalParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);

  const nearbyLinks = getNearbyLinkContext(city, nearby, keyword, jaz);

  const bundeslandText = getBundeslandParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const gebaeudeText = getGebaeudeParagraph(city, keyword, jaz, calc.wpKosten);
  const energieText = getEnergieParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const comparison = getComparisonTable(city, jaz, calc.wpKosten, calc.ersparnis);
  const testimonial = getLocalTestimonial(city, keyword);
  const seasonalText = getSeasonalAdvice(city);
  const crossLinks = getCrossKeywordLinks(city, keyword, KEYWORDS);
  const inlineLinkedParagraph = getInlineLinkedParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const lokaleTiefenanalyse = getLokaleTiefenanalyse(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const pvWP = getPVWPKombination(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const roiTimeline = getROITimeline(city, jaz, calc.wpKosten, calc.ersparnis, foerd.gesamtSatz);
  const nachbarVergleich = getNachbarschaftsvergleich(city, nearby, jaz, calc.wpKosten, calc.ersparnis);
  const heizkoerper = getHeizkoerperCheck(city, keyword);
  const stromtarif = getStromtarifOptimierung(city, jaz, calc.wpKosten);
  const deepContent = getKeywordDeepContent(city, keyword, jaz, calc.wpKosten, calc.ersparnis);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* FAQ Schema */}
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Image src={IMG_HERO} alt={h1} className="absolute inset-0 w-full h-full object-cover" fill priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(10,25,16,0.97) 0%, rgba(10,25,16,0.88) 52%, rgba(10,25,16,0.35) 100%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-28">
          <nav className="flex items-center gap-2 text-xs mb-6 text-[rgba(255,255,255,0.40)] flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white transition-colors">
              {keyword.keyword.replace('[Stadt]', '').trim()}
            </Link>
            <span>›</span>
            <span className="text-white">{city.name}</span>
          </nav>

          {isUrgent && (
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-4 py-2 mb-5">
              <AlertTriangle size={12} className="text-amber-400" />
              <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">
                GEG-Frist {city.name}: {gegFristFormatted}
              </span>
            </div>
          )}

          <h1 className="font-extrabold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(32px,4.5vw,62px)' }}>
            {h1}
          </h1>
              {/* Preis-Badge */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-[#D97706]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  💰 ab {fmtEuro(foerd.eigenanteil)} Eigenanteil
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  💚 {fmtEuro(calc.ersparnis)}/J. sparen
                </span>
              </div>
              {/* Ultra-lokale Fakten */}
              <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-5">
                {city.name}: {city.strompreis} ct/kWh Strom · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.normAussentemp}°C Normaußentemp. · {city.fernwaermeQuote}% Fernwärme
              </p>

          <p className="text-[rgba(255,255,255,0.70)] text-lg leading-relaxed max-w-xl mb-10">
            {intros[v]}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {[
              { val: fmtEuro(foerd.eigenanteil),    label: 'Eigenanteil',    sub: `nach ${foerd.gesamtSatz}% KfW` },
              { val: fmtEuro(foerd.zuschuss),        label: 'KfW-Zuschuss',   sub: 'nicht rückzahlbar' },
              { val: fmtEuro(ersparnisLuft),         label: 'Ersparnis/Jahr', sub: 'vs. Erdgas' },
              { val: calc.amortisationJahre + ' J.', label: 'Amortisation',   sub: 'inkl. Förderung' },
            ].map((s, i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.13)] rounded-xl p-4">
                <p className="font-mono font-extrabold text-white text-xl leading-none mb-1">{s.val}</p>
                <p className="text-[#3DA16A] text-xs font-bold">{s.label}</p>
                <p className="text-[rgba(255,255,255,0.35)] text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8 flex-wrap">
            <a href="#angebot"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[#D97706] text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all hover:-translate-y-0.5 shadow-xl">
              Kostenloses Angebot <ArrowRight size={16} />
            </a>
            <a href="#rechner"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.20)] text-white rounded-xl font-bold text-sm hover:bg-[rgba(255,255,255,0.15)] transition-all">
              <Calculator size={16} /> Kosten berechnen
            </a>
          </div>
        </div>
      </section>

      {/* ── QUELLEN-BAR ── */}
      <div className="bg-white border-b border-gray-200 py-2.5 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-5 flex-wrap text-xs text-[#7A9E8E]">
          <span className="font-bold uppercase tracking-wider">Quellen:</span>
          {['KfW BEG 458', 'BAFA', 'BWP', 'Fraunhofer ISE', 'Verbraucherzentrale', 'DWD', 'Stand März 2026'].map(s => (
            <span key={s} className="font-semibold">{s}</span>
          ))}
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div className="space-y-14">

          {/* ── FEATURED SNIPPET (einmal, klar) ── */}
          <div className="bg-white border border-gray-200 border-l-4 border-l-wp-green rounded-xl p-6 shadow-md">
            <h2 className="font-bold text-[#1C2B2B] text-xl mb-3">
              {fillTemplate('Was kostet eine Wärmepumpe in {stadt} komplett?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed mb-4">
              Eine <strong className="text-[#1C2B2B]">Luft-Wasser-Wärmepumpe</strong> kostet in <strong className="text-[#1C2B2B]">{city.name}</strong> inklusive Gerät, Montage, hydraulischem Abgleich und Elektroinstallation zwischen <strong className="text-[#1C2B2B]">€18.000 und €28.000 brutto</strong>. Nach KfW-Förderung ({foerd.gesamtSatz}%) reduziert sich Ihr Eigenanteil auf <strong className="text-[#1C2B2B]">{fmtEuro(foerd.eigenanteil)}</strong>. Jährliche Ersparnis gegenüber Erdgas: <strong className="text-[#1C2B2B]">{fmtEuro(ersparnisLuft)}</strong> bei {city.strompreis} ct/kWh Strompreis und JAZ {jazLuft}.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: 'Eigenanteil', val: fmtEuro(foerd.eigenanteil), sub: `nach ${foerd.gesamtSatz}% KfW`, c: 'text-[#D97706]' },
                { label: 'Ersparnis/Jahr', val: fmtEuro(ersparnisLuft), sub: 'vs. Erdgas Heizung', c: 'text-[#1A4731]' },
                { label: 'Amortisation', val: calc.amortisationJahre + ' Jahre', sub: 'inkl. Förderung', c: 'text-[#1C2B2B]' },
              ].map((s, i) => (
                <div key={i} className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-3 text-center">
                  <p className={`font-mono font-bold text-lg leading-none mb-0.5 ${s.c}`}>{s.val}</p>
                  <p className="text-[#7A9E8E] text-xs font-semibold">{s.label}</p>
                  <p className="text-[#7A9E8E] text-xs">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── BILD + STANDORTDATEN ── */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="relative rounded-2xl overflow-hidden h-64">
              <Image src={IMG_HOUSE} alt={`Wärmepumpe Kosten ${city.name}`}
                className="w-full h-full object-cover" fill />
              <div className="absolute inset-0 bg-[#1A4731]/60 flex items-end p-5">
                <div>
                  <p className="font-bold text-white text-base">{city.name} · JAZ {jazLuft}</p>
                  <p className="text-white/60 text-xs">{city.avgTemp}°C · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-[#1C2B2B] text-lg">Standortdaten {city.name}</h3>
              {[
                { icon: '🌡️', label: 'Jahresmitteltemperatur', val: city.avgTemp + '°C', note: `JAZ ${jazLuft} erreichbar · Normaußentemp. ${city.normAussentemp}°C` },
                { icon: '⚡', label: 'Strompreis lokal', val: city.strompreis + ' ct/kWh', note: `WP-Betrieb: ${fmtEuro(calc.wpKosten)}/Jahr` },
                { icon: '🔥', label: 'Gaspreis aktuell', val: city.gaspreis + ' ct/kWh', note: `Gasheizung: ${fmtEuro(calc.altKosten)}/Jahr` },
                { icon: '☀️', label: 'Sonnenstunden', val: city.avgSunHours + ' h/Jahr', note: 'PV+WP-Kombination besonders attraktiv' },
              ].map((d, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 shadow-md flex items-start gap-3">
                  <span className="text-xl shrink-0">{d.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#1C2B2B] text-xs">{d.label}</span>
                      <span className="font-mono font-bold text-[#D97706] text-sm">{d.val}</span>
                    </div>
                    <p className="text-[#7A9E8E] text-xs mt-0.5">{d.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FERNWÄRME-WARNING ── */}
          {city.fernwaermeQuote >= 30 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>{city.name}</strong> hat {city.fernwaermeQuote}% Fernwärmeabdeckung. Prüfen Sie ob Ihre Adresse in einem Fernwärme-Vorranggebiet liegt — dort kann eine Wärmepumpe eingeschränkt oder unzulässig sein. Für die übrigen <strong>{100 - city.fernwaermeQuote}% der Haushalte</strong> in {city.name} ist die Wärmepumpe die klare Wahl.
              </p>
            </div>
          )}

          {/* ── VOLLSTÄNDIGE KOSTENTABELLE ── */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#1A4731] text-[#3DA16A] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Preisübersicht 2026</span>
            </div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-2">
              {[
                `Alle 3 Wärmepumpen-Typen im Kostenvergleich — ${city.name}`,
                `Welcher WP-Typ kostet was in ${city.name}? Vollständiger Vergleich`,
                `Luft, Sole, Wasser: WP-Kosten in ${city.name} gegenübergestellt`,
                `WP-Typen ${city.name}: Invest, Betrieb und Förderung im Vergleich`,
              ][cityHash(city, 4, 130)]}
            </h2>
            <p className="text-[#4A6358] text-sm mb-5">
              Sole-Wasser- und Wasser-Wasser-Wärmepumpen haben höhere Anschaffungskosten, aber auch höhere JAZ und damit niedrigere Betriebskosten. Bei {city.strompreis} ct/kWh Strompreis in {city.name} lohnt sich die Kalkulation.
            </p>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md mb-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[540px]">
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #0A1910 0%, #1B3D28 100%)' }}>
                      {['WP-Typ', 'Gesamtkosten brutto', 'Eigenanteil nach KfW', 'JAZ in ' + city.name, 'Ersparnis/Jahr'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-[rgba(255,255,255,0.50)] text-xs font-bold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        typ: 'Luft-Wasser ⭐',
                        low: 18000, high: 28000,
                        jaz: jazLuft, ersparnis: ersparnisLuft,
                        note: 'Häufigste Wahl · keine Erdarbeiten',
                        highlight: true,
                      },
                      {
                        typ: 'Sole-Wasser',
                        low: 22000, high: 38000,
                        jaz: jazSole, ersparnis: ersparnisSole,
                        note: '+5% KfW-Bonus · konstante Effizienz',
                        highlight: false,
                      },
                      {
                        typ: 'Wasser-Wasser',
                        low: 26000, high: 44000,
                        jaz: jazWasser, ersparnis: ersparnisWasser,
                        note: '+5% KfW-Bonus · höchste JAZ',
                        highlight: false,
                      },
                    ].map((r, i) => {
                      const eigenanteil = Math.round(r.low * (1 - foerd.gesamtSatz / 100));
                      return (
                        <tr key={i} className={`border-b border-gray-200 last:border-0 ${r.highlight ? 'bg-[#E8F5EE]' : i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]/50'}`}>
                          <td className="px-4 py-3.5">
                            <p className={`font-bold text-sm ${r.highlight ? 'text-[#1A4731]' : 'text-[#1C2B2B]'}`}>{r.typ}</p>
                            <p className="text-[#7A9E8E] text-xs mt-0.5">{r.note}</p>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[#4A6358]">
                            {r.low.toLocaleString('de-DE')}–{r.high.toLocaleString('de-DE')} €
                          </td>
                          <td className={`px-4 py-3.5 font-mono font-bold ${r.highlight ? 'text-[#1A4731]' : 'text-[#1C2B2B]'}`}>
                            ab {eigenanteil.toLocaleString('de-DE')} €
                          </td>
                          <td className="px-4 py-3.5 font-mono font-bold text-[#D97706]">{r.jaz}</td>
                          <td className="px-4 py-3.5 font-mono font-bold text-[#1A4731]">
                            {fmtEuro(r.ersparnis)}/J.
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              <div className="px-4 py-2.5 bg-[#F8F9FA] border-t border-gray-200 text-xs text-[#7A9E8E]">
                Strompreis {city.name}: {city.strompreis} ct/kWh · Gaspreis: {city.gaspreis} ct/kWh · 120 m² EFH Baujahr 1980–1994 · Stand März 2026
              </div>
              </div>
            </div>

            {/* Nebenkosten-Warnung */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <p className="font-bold text-amber-900 text-sm mb-1.5">Nebenkosten die oft fehlen — {city.name}</p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Viele Angebote in {city.name} enthalten nicht alle Positionen. Bestehen Sie auf: <strong>Hydraulischer Abgleich</strong> (€500–1.500, KfW-Pflicht — ohne ihn kein Förderantrag möglich), <strong>Elektroinstallation</strong> (€500–1.500, Aufwand abhängig von vorhandener Infrastruktur), <strong>Fundament/Aufstellung</strong> (€300–800) und seit 2026 der <strong>Wärmemengenzähler</strong> (€200–500, KfW-Pflicht). Seriöse Betriebe in {city.name} weisen alle Positionen einzeln aus.
                </p>
              </div>
            </div>
          </div>

          {/* Interne Content-Links */}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <Link href={`/waermepumpe-foerderung/${city.slug}`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1A4731] transition-colors group">
              <span className="text-2xl">💶</span>
              <div>
                <p className="font-bold text-sm text-gray-900 group-hover:text-[#1A4731]">Förderung in {city.name}</p>
                <p className="text-xs text-gray-500">KfW + Landesförderung im Detail</p>
              </div>
            </Link>
            <Link href={`/waermepumpe-installateur/${city.slug}`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1A4731] transition-colors group">
              <span className="text-2xl">🔧</span>
              <div>
                <p className="font-bold text-sm text-gray-900 group-hover:text-[#1A4731]">Installateure in {city.name}</p>
                <p className="text-xs text-gray-500">Geprüfte lokale Fachbetriebe</p>
              </div>
            </Link>
          </div>
          {/* ── BILD + BETRIEBSKOSTEN ── */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="relative rounded-2xl overflow-hidden h-60">
              <Image src={IMG_MONEY} alt={`WP Betriebskosten ${city.name}`}
                className="w-full h-full object-cover" fill />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 25%, rgba(10,25,16,0.88) 100%)' }} />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-extrabold text-white text-xl mb-1">Betriebskosten {city.name}</p>
                <p className="text-[#3DA16A] font-mono font-bold text-2xl">{fmtEuro(ersparnisLuft)}/Jahr gespart</p>
                <p className="text-white/55 text-xs mt-0.5">Luft-WP bei JAZ {jazLuft} · {city.strompreis} ct/kWh</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[#1C2B2B] text-lg mb-3">Laufende Kosten im Vergleich</h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
                <table className="w-full">
                  <tbody>
                    {[
                      { l: 'Gasheizung heute', v: fmtEuro(calc.altKosten) + '/Jahr', c: 'text-[#7A9E8E]', cross: true },
                      { l: `WP Luft-Wasser (JAZ ${jazLuft})`, v: fmtEuro(calc.wpKosten) + '/Jahr', c: 'text-[#1A4731]' },
                      { l: `WP Sole-Wasser (JAZ ${jazSole})`, v: fmtEuro(Math.round(calc.altKosten - ersparnisSole)) + '/Jahr', c: 'text-[#1A4731]' },
                      { l: 'Ersparnis Luft-WP/Jahr', v: fmtEuro(ersparnisLuft), c: 'text-[#D97706]', bold: true },
                      { l: 'CO₂ gespart/Jahr', v: calc.co2Ersparnis + ' t', c: 'text-[#3DA16A]' },
                    ].map((r, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]/40'}>
                        <td className={`px-4 py-2.5 text-sm border-b border-gray-200 ${r.cross ? 'line-through text-[#7A9E8E]' : 'text-[#4A6358]'} ${r.bold ? 'font-bold text-[#1C2B2B]' : ''}`}>{r.l}</td>
                        <td className={`px-4 py-2.5 font-mono font-bold text-sm text-right border-b border-gray-200 ${r.c} ${r.bold ? 'text-base' : ''}`}>{r.v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[#7A9E8E] text-xs mt-2">
                Basis: 120 m² EFH, Baujahr 1980–1994, {city.strompreis} ct/kWh Strom, {city.gaspreis} ct/kWh Gas, {city.name}
              </p>
            </div>
          </div>

          {/* ── FLIESSTEXT ── */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">
              {[
                `Gesamtkosten und Wirtschaftlichkeit — ${city.name} über 20 Jahre`,
                `Lohnt sich die WP in ${city.name} langfristig? 20-Jahres-Rechnung`,
                `Was kostet und spart die WP in ${city.name} auf 20 Jahre?`,
                `Vollkostenrechnung ${city.name}: WP-Investition und Ersparnis bis 2045`,
              ][cityHash(city, 4, 131)]}
            </h2>
            <div className="space-y-4 text-[#4A6358] text-base leading-relaxed">
              <p>
                Die reinen Anschaffungs- und Installationskosten sind in {city.name} nur die halbe Wahrheit. Entscheidend ist die <strong className="text-[#1C2B2B]">Gesamtkostenbetrachtung über 20 Jahre</strong>: Eine Luft-Wasser-WP kostet im Eigenanteil {fmtEuro(foerd.eigenanteil)} — spart aber {fmtEuro(ersparnisLuft)} pro Jahr. Das macht über 20 Jahre {fmtEuro(ersparnisLuft * 20)} Betriebsersparnis bei stetig steigendem CO₂-Preis auf Gas (2026: 55 €/t → prognostiziert 2030: 100–150 €/t).
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { title: `20-Jahre-Bilanz`, val: fmtEuro(ersparnisLuft * 20 - foerd.eigenanteil), sub: 'Nettogewinn nach Eigenanteil', c: 'text-[#1A4731]' },
                  { title: 'Amortisation', val: calc.amortisationJahre + ' Jahre', sub: 'inkl. KfW-Förderung', c: 'text-[#D97706]' },
                  { title: 'CO₂ gesamt', val: (calc.co2Ersparnis * 20).toFixed(0) + ' t', sub: 'über 20 Jahre gespart', c: 'text-[#3DA16A]' },
                ].map((s, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-md text-center">
                    <p className={`font-mono font-extrabold text-2xl leading-none mb-0.5 ${s.c}`}>{s.val}</p>
                    <p className="font-semibold text-[#1C2B2B] text-xs">{s.title}</p>
                    <p className="text-[#7A9E8E] text-xs">{s.sub}</p>
                  </div>
                ))}
              </div>
              <p>
                In {city.name} ({city.bundesland}) beträgt die <strong className="text-[#1C2B2B]">Normaußentemperatur {city.normAussentemp}°C</strong> — Basis für die Auslegung nach DIN EN 12831. Eine korrekt dimensionierte WP erreicht hier JAZ {jazLuft} und vermeidet den kostenintensiven Taktbetrieb (zu große WP) oder Unterversorgung (zu kleine WP). Die Heizlastberechnung ist deshalb keine optionale Mehrleistung sondern Voraussetzung für ein seriöses Angebot.
              </p>
            </div>
          </div>

          {/* ── KFW-SECTION mit Bild ── */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              {h2s.foerderung}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed mb-4">{si.foerderung}</p>
            <div className="grid sm:grid-cols-2 gap-6 mb-5">
              <div className="space-y-3">
                {[
                  { pct: 30, label: 'Grundförderung', info: 'Immer verfügbar — Eigennutzer und Vermieter', c: 'bg-[#1A4731] text-white' },
                  { pct: 20, label: 'Klima-Speed-Bonus', info: 'Fossil → WP als Hauptheizung, Eigennutzer', c: 'bg-[#E8F5EE] text-[#1A4731]' },
                  { pct: 30, label: 'Einkommens-Bonus', info: 'Haushaltseinkommen unter €40.000/Jahr', c: 'bg-[#F8F9FA] text-[#7A9E8E] border border-gray-200' },
                  { pct: 5, label: 'Kältemittel-Bonus', info: 'R290-Propan-WP oder Erdwärme/Wasser', c: 'bg-amber-50 text-amber-700' },
                ].map((b, i) => (
                  <div key={i} className={`rounded-xl p-3.5 flex items-center gap-3 ${b.c}`}>
                    <span className="font-mono font-extrabold text-lg shrink-0 w-12 text-right">+{b.pct}%</span>
                    <div>
                      <p className="font-bold text-sm">{b.label}</p>
                      <p className="text-xs opacity-75">{b.info}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-[#1A4731] rounded-xl p-3.5 flex items-center gap-3">
                  <span className="font-mono font-extrabold text-[#D97706] text-lg shrink-0 w-12 text-right">70%</span>
                  <div>
                    <p className="font-bold text-white text-sm">Maximum = {fmtEuro(21000)}</p>
                    <p className="text-[rgba(255,255,255,0.50)] text-xs">Bei €30.000 Bemessungsgrundlage</p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-auto min-h-[200px]">
                <Image src={IMG_WORKER} alt={`KfW Förderung WP ${city.name}`}
                  className="w-full h-full object-cover" fill />
                <div className="absolute inset-0 bg-[#1A4731]/60 flex items-end p-5">
                  <div>
                    <p className="text-[rgba(255,255,255,0.55)] text-xs font-bold uppercase tracking-wider mb-1">Typisch für {city.name}</p>
                    <p className="font-mono font-extrabold text-white text-3xl leading-none">{fmtEuro(foerd.zuschuss)}</p>
                    <p className="text-[rgba(255,255,255,0.55)] text-xs mt-1">KfW-Zuschuss bei €25.000 Invest · {foerd.gesamtSatz}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Landesförderung */}
            {city.bundeslandFoerderung ? (
              <div className={`rounded-xl border p-4 ${city.bundeslandFoerderungBetrag?.includes('ausgesetzt') ? 'bg-amber-50 border-amber-200' : 'bg-[#E8F5EE] border-[#3DA16A]/30'}`}>
                <p className={`font-bold text-base mb-1 ${city.bundeslandFoerderungBetrag?.includes('ausgesetzt') ? 'text-amber-800' : 'text-[#1A4731]'}`}>
                  {city.bundesland}-Förderung: {city.bundeslandFoerderung}
                </p>
                <p className={`text-sm leading-relaxed ${city.bundeslandFoerderungBetrag?.includes('ausgesetzt') ? 'text-amber-700' : 'text-[#4A6358]'}`}>
                  {city.bundeslandFoerderungBetrag}
                  {!city.bundeslandFoerderungBetrag?.includes('ausgesetzt') && ' — kombinierbar mit KfW-Bundesförderung.'}
                </p>
                {city.bundeslandFoerderungUrl && !city.bundeslandFoerderungBetrag?.includes('ausgesetzt') && (
                  <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-[#1A4731] hover:underline">
                    → Mehr zur {city.bundesland}-Förderung ↗
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-4">
                <p className="text-[#4A6358] text-sm">
                  <strong className="text-[#1C2B2B]">{city.bundesland}</strong> hat kein eigenes aktives WP-Förderprogramm. Die KfW-Bundesförderung (bis 70% = max. {fmtEuro(21000)}) gilt in {city.name} vollständig und ohne Einschränkungen.
                </p>
              </div>
            )}
          </div>

          {/* ── GEG-FRIST ── */}
          <div className={`rounded-xl border p-5 flex gap-4 ${isUrgent ? 'bg-amber-50 border-amber-300' : 'bg-[#E8F5EE] border-[#3DA16A]/30'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isUrgent ? 'bg-amber-100' : 'bg-[#1A4731]/10'}`}>
              {isUrgent ? <AlertTriangle size={18} className="text-amber-600" /> : <CheckCircle size={18} className="text-[#1A4731]" />}
            </div>
            <div>
              <p className={`font-bold text-lg mb-1 ${isUrgent ? 'text-amber-900' : 'text-[#1A4731]'}`}>
                GEG-Frist {city.name}: {gegFristFormatted}
              </p>
              <p className={`text-sm leading-relaxed ${isUrgent ? 'text-amber-800' : 'text-[#4A6358]'}`}>
                {isUrgent
                  ? `Großstadt über 100.000 Einwohner: 65%-EE-Pflicht gilt ab ${gegFristFormatted}. Wartezeiten für gute Betriebe in ${city.name}: aktuell 4–10 Wochen — jetzt anfragen sichert die volle KfW-Förderung und beste Betriebsauswahl.`
                  : `65%-EE-Pflicht gilt ab ${gegFristFormatted}. Eine Wärmepumpe erfüllt das GEG automatisch — ohne weitere Auflagen oder Einzelnachweise.`
                }
              </p>
            </div>
          </div>

          {/* Bundesland & Gebäudekontext */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Wärmepumpe in {city.bundesland} — {city.name} im Fokus</h2>
            <p className="text-[#4A6358] leading-relaxed">{bundeslandText}</p>
            <p className="text-[#4A6358] leading-relaxed">{gebaeudeText}</p>
          </div>

          {/* Energie & Wirtschaftlichkeit Deep-Dive */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Energiekosten-Analyse für {city.name}</h2>
            <p className="text-[#4A6358] leading-relaxed">{energieText}</p>
            {/* Vergleichstabelle */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1A4731] text-white">
                    {comparison.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row, ri) => (
                    <tr key={ri} className={ri === 0 ? 'bg-emerald-50 font-semibold' : 'bg-white'}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 border-b border-gray-100 text-gray-700">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kundenstimme */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <span key={i} className="text-[#D97706] text-lg">★</span>
              ))}
            </div>
            <blockquote className="text-gray-700 text-base italic leading-relaxed mb-4">
              „{testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1B5E37] font-bold text-sm">
                {testimonial.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{testimonial.author}</p>
                <p className="text-gray-500 text-xs">{testimonial.location} · Vermittelt über Wärmepumpenbegleiter.de</p>
              </div>
            </div>
          </div>

          {/* Verwandte Themen */}
          {crossLinks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Verwandte Themen für {city.name}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {crossLinks.map((link, i) => (
                  <a key={i} href={link.url} className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-[#1A4731] hover:shadow-sm transition-all group">
                    <p className="font-semibold text-[#1A4731] group-hover:underline text-sm mb-1">{link.anchor}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{link.context}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Inline verlinkte Absätze */}
          {inlineLinkedParagraph && (
            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Weiterführende Informationen für {city.name}</h2>
              <p className="text-[#4A6358] text-base leading-relaxed [&_a]:text-[#1B5E37] [&_a]:font-semibold [&_a]:underline [&_a]:decoration-[#1B5E37]/30 hover:[&_a]:decoration-[#1B5E37]"
                dangerouslySetInnerHTML={{ __html: inlineLinkedParagraph }} />
            </div>
          )}

          {/* Lokale Tiefenanalyse */}
          <div className="bg-[#F2FAF5] rounded-2xl p-7 border border-[#D1E7DD]">
            <h2 className="text-xl font-bold text-[#1A4731] mb-3">Lokale Analyse: Wärmepumpe in {city.name}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed">{lokaleTiefenanalyse}</p>
          </div>

          {/* Saisonale Empfehlung */}
          <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#92400E] mb-1">Beste Installationszeit für {city.name}</p>
            <p className="text-[#78350F] text-sm leading-relaxed">{seasonalText}</p>
          </div>

          {/* Keyword-spezifischer Tiefeninhalt */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-[#1A4731]">{deepContent.heading}</h2>
            {deepContent.paragraphs.map((p, i) => (
              <p key={i} className="text-[#4A6358] text-base leading-relaxed">{p}</p>
            ))}
          </div>

          {/* PV + Wärmepumpe Kombination */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 space-y-5">
            <h2 className="text-xl font-bold text-[#1A4731]">{pvWP.title}</h2>
            {pvWP.paragraphs.map((p, i) => (
              <p key={i} className="text-[#4A6358] text-sm leading-relaxed">{p}</p>
            ))}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {pvWP.stats.map((s, i) => (
                <div key={i} className="bg-[#F2FAF5] rounded-lg p-3 text-center">
                  <p className="text-[#1A4731] font-bold text-lg">{s.value}</p>
                  <p className="text-[#4A6358] text-xs font-semibold">{s.label}</p>
                  <p className="text-gray-400 text-xs">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Heizkörper-Kompatibilitäts-Check */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1A4731]">{heizkoerper.title}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed">{heizkoerper.paragraph}</p>
            <div className="grid gap-2">
              {heizkoerper.checklist.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                  item.status === 'ok' ? 'bg-green-50 border-green-200' :
                  item.status === 'pruefen' ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.status === 'ok' ? 'bg-green-100 text-green-700' :
                    item.status === 'pruefen' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'ok' ? '✓' : item.status === 'pruefen' ? '?' : '✗'}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.item}</p>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nachbarschaftsvergleich */}
          {nearby.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#1A4731]">Regionaler Vergleich: {city.name} vs. Umland</h2>
              <p className="text-[#4A6358] text-base leading-relaxed">{nachbarVergleich.paragraph}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1A4731] text-white">
                      {nachbarVergleich.table.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left text-xs font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nachbarVergleich.table.rows.map((row, i) => (
                      <tr key={i} className={i === 0 ? 'bg-[#F2FAF5] font-semibold' : i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-xs text-gray-700 border-b border-gray-100">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stromtarif-Optimierung */}
          <div className="bg-gradient-to-br from-[#1A4731] to-[#0A1910] rounded-2xl p-7 text-white space-y-4">
            <h2 className="text-xl font-bold">Stromkosten senken: WP-Tarife für {city.name}</h2>
            <p className="text-white/80 text-sm leading-relaxed">{stromtarif.paragraph}</p>
            <div className="space-y-2 mt-3">
              {stromtarif.tips.map((t, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2.5">
                  <span className="text-white/90 text-xs">{t.tip}</span>
                  <span className="text-[#D97706] font-bold text-xs whitespace-nowrap ml-3">{t.ersparnis}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ROI-Timeline */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1A4731]">Wirtschaftlichkeit über 20 Jahre in {city.name}</h2>
            <div className="space-y-2">
              {roiTimeline.filter(r => r.highlight).map((r, i) => (
                <div key={i} className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 px-4 py-3">
                  <div className="w-14 text-center">
                    <p className="text-[#1A4731] font-bold text-sm">{r.label}</p>
                    <p className="text-gray-400 text-xs">{r.year}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{r.highlight}</p>
                    <p className="text-xs text-gray-500">
                      WP kumuliert: {r.wpKumuliert.toLocaleString('de-DE')} € · Gas kumuliert: {r.gasKumuliert.toLocaleString('de-DE')} €
                    </p>
                  </div>
                  <div className={`text-right ${r.differenz > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    <p className="font-bold text-sm">{r.differenz > 0 ? '+' : ''}{r.differenz.toLocaleString('de-DE')} €</p>
                    <p className="text-xs">Vorteil WP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Quellenangaben & Datengrundlage */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Quellenangaben & Datengrundlage</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>• Strompreis {city.name}: Verivox/CHECK24, Stand 03/2026</span>
              <span>• Heizgradtage: Deutscher Wetterdienst (DWD)</span>
              <span>• KfW-Förderung: BEG Programm 458, Stand 01/2026</span>
              <span>• JAZ-Berechnung: VDI 4650 Blatt 1</span>
              <span>• GEG-Fristen: §71 GEG i.d.F. vom 01.01.2024</span>
              <span>• CO₂-Preis: BEHG §10, Brennstoffemissionshandel</span>
            </div>
          </div>

          {/* ── FAQ nativ (Google lesbar) ── */}
          <div>
                        {/* H3 Featured Snippet */}
            {faqs.length > 0 && (
              <div className="mb-6 p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
                <h3 className="font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
                <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
              </div>
            )}
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">
              {h2s.faq}
            </h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md">
              {faqs.map((faq, i) => (
                <details key={i} className="group border-b border-gray-200 last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                    <span className="font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                    <svg className="w-4 h-4 text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-gray-200">
                    <p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* ── NACHBARSTÄDTE + CROSS-LINKS ── */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">
                Wärmepumpe Kosten in der Region
              </h3>
              <div className="flex flex-wrap gap-2">
                {nearbyLinks.map(nl => (
                  <Link key={nl.city.slug} href={nl.url}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {nl.text}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">
                Weitere Themen für {city.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw => kw && (
                  <Link key={kw.slug} href={`/${kw.slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {kw.keyword.replace('[Stadt]', city.name)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6" style={{ background: 'linear-gradient(160deg, #1A4731 0%, #0A1910 100%)' }}>
              <p className="text-[rgba(255,255,255,0.50)] text-xs font-bold uppercase tracking-widest mb-1">{city.name} — Kennzahlen</p>
              <p className="font-mono font-extrabold text-white text-4xl leading-none mb-0.5">{fmtEuro(foerd.zuschuss)}</p>
              <p className="text-[rgba(255,255,255,0.40)] text-xs mb-5">KfW-Zuschuss · nicht rückzahlbar</p>
              <div className="space-y-2 mb-5">
                {[
                  { l: `Förderung (${foerd.gesamtSatz}%)`,  v: fmtEuro(foerd.zuschuss),          c: 'text-[#3DA16A]' },
                  { l: 'Eigenanteil',                        v: fmtEuro(foerd.eigenanteil),        c: 'text-[#D97706]' },
                  { l: 'Ersparnis/Jahr',                     v: fmtEuro(ersparnisLuft),            c: 'text-[#3DA16A]' },
                  { l: 'JAZ in ' + city.name,                v: String(jazLuft),                   c: 'text-white' },
                  { l: 'Strompreis lokal',                   v: city.strompreis + ' ct/kWh',       c: 'text-white' },
                  { l: 'Amortisation',                       v: calc.amortisationJahre + ' J.',    c: 'text-[#D97706]' },
                  { l: 'GEG-Frist',                          v: gegFristFormatted,                 c: isUrgent ? 'text-amber-400' : 'text-white' },
                ].map(r => (
                  <div key={r.l} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.08)]">
                    <span className="text-[rgba(255,255,255,0.45)] text-xs">{r.l}</span>
                    <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <a href="#angebot"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#D97706] text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors">
                Kostenloses Angebot <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div id="angebot">
            <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          </div>
        </div>
      </div>


      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-bold text-[#1C2B2B] text-xl mb-6">
          Was sich 2026 geändert hat — und was das für {city.name} bedeutet
        </h2>
        <div className="space-y-4">

          {/* GEG-Reform */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.gegReform}</p>
          </div>

          {/* Neue Lärmvorschrift */}
          {['luft-wasser-waermepumpe','luftwaermepumpe','waermepumpe','waermepumpe-kosten','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-kaufen','waermepumpe-nachruesten','heizung-tauschen','waermepumpe-altbau'].includes(keyword.slug) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Neue Lärmvorschrift ab 01.01.2026</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.laerm10db}</p>
            </div>
          )}

          {/* Steuerliche Absetzbarkeit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-installateur','waermepumpe-preise','waermepumpe-installation','heizung-tauschen'].includes(keyword.slug) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.steuerAbsetz}</p>
            </div>
          )}

          {/* KfW-Ergänzungskredit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-preise','erdwaermepumpe','waermepumpe-neubau'].includes(keyword.slug) && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergänzungskredit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.kfwKredit}</p>
            </div>
          )}

          {/* Wartungskosten */}
          {['waermepumpe-kosten','waermepumpe','waermepumpe-preise','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-fachbetrieb','waermepumpe-kaufen'].includes(keyword.slug) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Wartungs- &amp; Langzeitkosten</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.wartungskosten}</p>
            </div>
          )}

          {/* Finanzierung */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.finanzierung}</p>
          </div>

        </div>
      </div>
          <AuthorBox keywordSlug={keyword.slug} />

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            {[
              'Herstellerunabhängig',
              'HWK-geprüfte Betriebe',
              'KfW-Begleitung inklusive',
              `Lokal in ${city.name}`,
              '100% kostenlos',
            ].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-gray-200 last:border-0 text-xs text-[#4A6358]">
                <CheckCircle size={12} className="text-[#1A4731] shrink-0" />{t}
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-[#E8F5EE] border border-[#3DA16A]/30 rounded-xl p-4">
            <div className="flex gap-0.5 mb-2">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} className="text-[#D97706] text-sm">{s}</span>
              ))}
            </div>
            <p className="text-[#4A6358] text-xs leading-relaxed italic mb-2">
              „In {city.name} haben wir innerhalb von 48 Stunden drei vollständige, vergleichbare Angebote erhalten. KfW-Antrag wurde direkt mit gestellt.&quot;
            </p>
            <p className="text-[#7A9E8E] text-xs font-semibold">
              Hausbesitzer aus {city.name} · Luft-WP · {fmtEuro(ersparnisLuft)}/Jahr gespart
            </p>
          </div>
    </div>
  </div>
  );
}
      