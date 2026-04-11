// components/programmatic/templates/LuftwaermepumpeTemplate.tsx
// luftwaermepumpe — vollständig standalone, 500+ Wörter unique content
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock , getUniqueLocalParagraph, getNearbyLinkContext, getBundeslandParagraph, getGebaeudeParagraph, getEnergieParagraph, getComparisonTable, getLocalTestimonial, getSeasonalAdvice, getCrossKeywordLinks, getInlineLinkedParagraph, getLokaleTiefenanalyse } from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=85', 'https://images.unsplash.com/photo-1509391111902-de5d52b3f785?w=1920&q=85', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85', 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85', 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* HERSTELLER moved inside component */

/* JAZ_SZENARIEN moved inside component */
/* JAZ_SZENARIEN_PLACEHOLDER removed */

/* LW_VS_SW moved inside component */

export default function LuftwaermepumpeTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const HERSTELLER = [
    { name: 'Viessmann Vitocal 250-A', cop: '4,0', maxVL: '65°C', kaeltemittel: 'R290', kfwBonus: true, schall: '48 dB', preis: '€11–18k', note: `In ${city.bundesland} beliebt` },
    { name: 'Vaillant aroTHERM plus', cop: '4,2', maxVL: '70°C', kaeltemittel: 'R290', kfwBonus: true, schall: '49 dB', preis: '€12–19k', note: 'Stiftung Warentest 2,0' },
    { name: 'Stiebel Eltron WPL-A', cop: '3,9', maxVL: '65°C', kaeltemittel: 'R410A', kfwBonus: false, schall: '47 dB', preis: '€10–16k', note: `Marktführer in ${city.bundesland}` },
    { name: 'Bosch CS7000i AW', cop: '4,0', maxVL: '65°C', kaeltemittel: 'R32', kfwBonus: false, schall: '50 dB', preis: '€11–17k', note: `${city.avgTemp >= 10 ? 'Für mildes Klima gut geeignet' : 'Auch für kühlere Standorte geeignet'}` },
    { name: 'Nibe S2125', cop: '4,1', maxVL: '65°C', kaeltemittel: 'R290', kfwBonus: true, schall: '46 dB', preis: '€13–20k', note: 'Sehr leise' },
    { name: 'Daikin Altherma 3 HT', cop: '3,8', maxVL: '80°C', kaeltemittel: 'R32', kfwBonus: false, schall: '52 dB', preis: '€14–22k', note: `Hochtemperatur-Profi für Altbau in ${city.name}` },
  ];
  const LW_VS_SW = [
    { kriterium: 'Investitionskosten', lw: '€18.000–€28.000', sw: '€22.000–€35.000', besser: 'LW' },
    { kriterium: `JAZ in ${city.name}`, lw: jaz.toFixed(1), sw: (jaz + 0.8).toFixed(1), besser: 'SW' },
    { kriterium: 'Betriebskosten', lw: fmtEuro(calc.wpKosten) + '/J.', sw: fmtEuro(Math.round(calc.wpKosten * 0.82)) + '/J.', besser: 'SW' },
    { kriterium: 'KfW-Bonus', lw: 'Standard', sw: '+5% extra', besser: 'SW' },
    { kriterium: 'Grundstück nötig', lw: 'Nein (nur 0,5 m²)', sw: `Ja — Tiefenbohrung oder Flächenkollektor in ${city.name}`, besser: 'LW' },
    { kriterium: 'Genehmigung', lw: 'Keine / Anzeige', sw: `Wasserrecht ${city.bundesland}`, besser: 'LW' },
    { kriterium: 'Montagezeit', lw: '2–3 Tage', sw: '5–10 Tage (inkl. Bohrung)', besser: 'LW' },
    { kriterium: 'Schall', lw: '45–55 dB', sw: 'Fast lautlos', besser: 'SW' },
    { kriterium: 'Empfehlung ' + city.name, lw: city.avgTemp >= 9 ? '✅ Empfohlen' : '✅ Gut geeignet', sw: '✅ Wenn Grundstück vorhanden', besser: 'equal' },
  ];

  const JAZ_SZENARIEN = [
    { system: 'Fußbodenheizung (35°C Vorlauf)', jaz: (jaz + 0.5).toFixed(1), note: `Optimal für ${city.name} — ${city.avgTemp >= 10 ? 'mildes Klima begünstigt FBH-Betrieb' : 'FBH maximiert JAZ auch im kühleren Klima'}` },
    { system: 'Moderne Heizkörper (45°C)', jaz: jaz.toFixed(1), note: `Standard für ${city.name} bei ${city.avgTemp}°C Jahresmittel` },
    { system: 'Altbau Heizkörper (55°C)', jaz: (jaz - 0.4).toFixed(1), note: `Noch wirtschaftlich — ${fmtEuro(Math.round(calc.ersparnis * 0.85))}/Jahr Ersparnis in ${city.name}` },
    { system: 'Hochtemperatur (65°C)', jaz: (jaz - 0.8).toFixed(1), note: `Hochtemperatur-WP nötig — trotzdem ${fmtEuro(Math.round(calc.ersparnis * 0.7))}/Jahr günstiger als Gas` },
    { system: 'Altbau ohne Sanierung (70°C)', jaz: (jaz - 1.0).toFixed(1), note: `Grenzbereich — hydraulischer Abgleich in ${city.name} oft ausreichend für Verbesserung` },
  ];
  const jazFBH = Math.min(jaz + 0.5, 4.8).toFixed(1);
  const jazHT  = Math.max(jaz - 0.5, 2.5).toFixed(1);

  const intros = [
    `Warum sind Luft-WP so dominant in ${city.name}? Keine Erdarbeiten nötig, keine Genehmigung, Montage in 1–3 Tagen. Hochtemperatur-Varianten bis 70°C Vorlauf sind für die meisten Bestandsgebäude in ${city.bundesland} geeignet. JAZ ${jaz} → ${fmtEuro(calc.ersparnis)}/Jahr Ersparnis in ${city.name}.`,
    `Luft-Wasser-WP ${city.name}: JAZ ${jazHT}–${jazFBH} je nach Vorlauftemperatur. Bei ${city.avgTemp}°C Jahresmittel ist die Luft-WP die wirtschaftlichste und am schnellsten installierbare Heizlösung. 92% Marktanteil in Deutschland 2024.`,
    `${city.name} (${city.bundesland}): Mit ${city.normAussentemp}°C Normaußentemperatur und ${city.avgTemp}°C Jahresmittel erreicht eine Luft-WP JAZ ${jaz}. Betriebskosten ${fmtEuro(calc.wpKosten)}/Jahr — ${fmtEuro(calc.ersparnis)} günstiger als Gas. Propan-Geräte (R290) liefern +5% KfW-Bonus.`,
    `Luft-WP vs. Sole-WP ${city.name}: Luft-WP: günstiger (${fmtEuro(18000)}–${fmtEuro(28000)}), schnelle Montage, JAZ ${jaz}. Sole-WP: teurer (€22–35k), JAZ ${Math.min(jaz + 1.0, 5.5).toFixed(1)}, aber +5% KfW immer. Für die meisten in ${city.name}: Luft-WP optimal.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

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

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <Image src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          className="absolute inset-0 w-full h-full object-cover" fill priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1910]/90 via-[#0A1910]/70 to-[#0A1910]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          {city.einwohner >= 100000 && (
            <div className="inline-block bg-[#D97706] text-[#1A4731] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              GEG-Frist {city.name}: {city.gegFrist.split('-').reverse().join('.')}
            </div>
          )}
          <h1 className="font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
              {/* Preis-Badge — Eigenanteil nach KfW-Förderung */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-[#D97706]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  💰 ab {fmtEuro(foerd.eigenanteil)} Eigenanteil
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  💚 {fmtEuro(calc.ersparnis)}/J. sparen
                </span>
              </div>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
              {/* Ultra-lokale Fakten */}
              <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-6">
                {city.name}: {city.strompreis} ct/kWh Strom · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.normAussentemp}°C Normaußentemp. · {city.fernwaermeQuote}% Fernwärme
              </p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: `JAZ ${jazHT}–${jazFBH}`, label: 'Effizienzspanne', sub: city.avgTemp + '°C Jahresmittel' },
              { val: '92%', label: 'Marktanteil DE', sub: 'BWP 2024' },
              { val: '1–3 Tage', label: 'Montagezeit', sub: 'Inkl. Inbetriebnahme' },
              { val: fmtEuro(calc.ersparnis) + '/J.', label: 'Ersparnis', sub: 'vs. Gasheizung' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/75 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Kostenloses Angebot →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Luftwärmepumpe in {stadt} — Kosten, Effizienz und Eignung', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Eine Luftwärmepumpe in <strong>{city.name}</strong> ({city.bundesland}) erreicht bei {city.avgTemp}°C Jahresmitteltemperatur eine JAZ von {jaz}. Das entspricht Heizkosten von {fmtEuro(calc.wpKosten)}/Jahr für ein 120 m² EFH — statt {fmtEuro(calc.altKosten)}/Jahr mit Gas. 92% aller neu installierten WP in Deutschland sind Luft-Wasser-WP: günstiger, schneller und ohne Erdarbeiten.
            </p>
          </div>

          {/* JAZ-Szenarien */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              Welche JAZ erreiche ich mit der Luftwärmepumpe in {city.name} nach Heizsystem
            ?</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    {['Heizsystem', 'JAZ in ' + city.name, 'Jahreskosten', 'Hinweis'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { jaz: Number(jazFBH), note: JAZ_SZENARIEN[0].note },
                    { jaz: Number((jaz + 0.2).toFixed(1)), note: JAZ_SZENARIEN[1].note },
                    { jaz: jaz, note: JAZ_SZENARIEN[2].note },
                    { jaz: Number(jazHT), note: JAZ_SZENARIEN[3].note },
                  ].map((r, i) => (
                    <tr key={i} className={`border-b border-gray-200 last:border-0 ${i === 2 ? 'bg-[#F2FAF5]' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{JAZ_SZENARIEN[i].system}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{r.jaz.toFixed(1)}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(Math.round(15000 / r.jaz * city.strompreis / 100))}/J.</td>
                      <td className="px-4 py-3 text-xs text-[#7A9E8E]">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hersteller */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              Welcher Luftwärmepumpen-Hersteller passt für {city.name} — Vergleich 2026
            ?</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-md">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    {['Modell', 'COP A7/W35', 'Max. VL', 'Kältemittel', 'KfW+5%', 'Schall', 'Preis'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HERSTELLER.map((h, i) => (
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-3 py-3 font-semibold text-[#1C2B2B] text-sm">{h.name}</td>
                      <td className="px-3 py-3 font-mono text-[#1A4731] font-bold">{h.cop}</td>
                      <td className="px-3 py-3 font-mono text-[#4A6358]">{h.maxVL}</td>
                      <td className="px-3 py-3 text-xs text-[#4A6358]">{h.kaeltemittel}</td>
                      <td className="px-3 py-3 text-sm">{h.kfwBonus ? '✅ +5%' : '—'}</td>
                      <td className="px-3 py-3 font-mono text-xs">{h.schall}</td>
                      <td className="px-3 py-3 font-mono text-xs text-[#7A9E8E]">{h.preis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#7A9E8E] mt-2">Herstellerunabhängig — wir empfehlen das für Ihr Haus in {city.name} passende Gerät.</p>
          </div>

          {/* LW vs SW Vergleich */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              Luft-WP oder Sole-WP (Erdwärme) — was passt besser in {city.name}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    {['Kriterium', 'Luft-WP', 'Sole-WP', 'Vorteil'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LW_VS_SW.map((r, i) => (
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{r.kriterium}</td>
                      <td className={`px-4 py-3 text-sm ${r.besser === 'LW' ? 'text-[#1A4731] font-bold' : 'text-[#4A6358]'}`}>{r.lw}</td>
                      <td className={`px-4 py-3 text-sm ${r.besser === 'SW' ? 'text-[#1A4731] font-bold' : 'text-[#4A6358]'}`}>{r.sw}</td>
                      <td className="px-4 py-3 text-xs font-bold text-[#7A9E8E]">{r.besser === 'LW' ? '🌬️ Luft' : '🌍 Sole'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

          
          {/* H3 + FAQ */}
          {faqs.length > 0 && (
            <div className="p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

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

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md mb-10">
              {faqs.map((faq, i) => (
                <details key={i} className="group border-b border-gray-200 last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                    <span className="font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-gray-200">
                    <p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearbyLinks.map(nl => (
                  <Link key={nl.city.slug} href={nl.url}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">{nl.text}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {(keyword.crossLinks ?? []).map((slug: string) => (
                  <Link key={slug} href={`/${slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-6">
            <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Luft-WP Kennzahlen</div>
            {[
              ['JAZ in ' + city.name, String(jaz)],
              ['JAZ mit FBH', jazFBH],
              ['Betriebskosten', fmtEuro(calc.wpKosten) + '/J.'],
              ['Ersparnis vs. Gas', fmtEuro(calc.ersparnis) + '/J.'],
              ['Montagezeit', '1–3 Tage'],
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="text-[#4A6358]">{l}</span>
                <span className="font-bold text-[#1C2B2B]">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-[#1A4731] text-white font-bold py-3 rounded-xl hover:bg-[#2D7A52] transition-colors text-sm">Kostenloses Angebot →</a>
          </div>
        </div>
      </div>

      <div id="angebot" className="bg-[#1A4731] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

      {/* ── VERWANDTE THEMEN ─────────────────────────── */}
      {crossKeywords.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-8">
          <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">
            Verwandte Themen für {city.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {crossKeywords.map(kw2 => kw2 && (
              <a key={kw2.slug} href={`/${kw2.slug}/${city.slug}`}
                className="px-3 py-1.5 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:border-[#1A4731] hover:text-[#1A4731] transition-all">
                {kw2.keyword.replace('[Stadt]', city.name)}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── VISUELLER TRENNER ─────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden my-8" style={{ height: '180px' }}>
        <Image
          src={pickImg(SEC1_IMGS, city.lat, city.lng, 5)}
          alt={`${keyword.keyword.replace('[Stadt]', city.name)} Übersicht`}
          className="w-full h-full object-cover"
          fill
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,25,16,0.88) 0%, rgba(10,25,16,0.45) 60%, rgba(10,25,16,0.15) 100%)' }} />
        <div className="absolute inset-y-0 left-0 flex items-center px-8">
          <div>
            <p className="text-white font-bold text-lg leading-tight">{keyword.keyword.replace('[Stadt]', city.name)}</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {fmtEuro(foerd.eigenanteil)} Eigenanteil · JAZ {jaz} · {foerd.gesamtSatz}% KfW-Förderung
            </p>
          </div>
        </div>
      </div>

      {/* Landesförderung */}
      {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('eingestellt') && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-[#E8F5EE] border border-[#3DA16A]/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">💶</span>
            <div>
              <p className="font-bold text-[#1A4731] text-sm mb-1">{city.bundesland}-Förderung: {city.bundeslandFoerderung}</p>
              <p className="text-[#4A6358] text-xs leading-relaxed">
                {city.bundeslandFoerderungBetrag} — kombinierbar mit KfW-Bundesförderung.
                {city.bundeslandFoerderungUrl && <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-[#1A4731] font-semibold hover:underline">Mehr Infos →</a>}
              </p>
            </div>
          </div>
        </div>
      )}
      {!city.bundeslandFoerderung && city.bundeslandFoerderungBetrag && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-4">
            <p className="text-[#4A6358] text-xs"><strong className="text-[#1C2B2B]">{city.bundesland}:</strong> Kein aktives Landesprogramm — {city.bundeslandFoerderungBetrag}. KfW gilt vollständig.</p>
          </div>
        </div>
      )}

      {city.avgTemp >= 10.5 && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-[#E8F5EE] border border-[#3DA16A]/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">✅</span>
            <div>
              <p className="font-bold text-[#1A4731] text-sm mb-1">{city.name}: {city.avgTemp}°C — Überdurchschnittliche JAZ für Luftwärmepumpen</p>
              <p className="text-[#4A6358] text-xs leading-relaxed">Mit {city.avgTemp}°C Jahresmitteltemperatur gehört {city.name} zu den wärmsten deutschen Großstädten. Die Luftwärmepumpe erreicht hier JAZ {jaz} — über dem Bundesdurchschnitt von 3,0.</p>
            </div>
          </div>
        </div>
      )}
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
        <div className="mt-6 text-xs text-[#7A9E8E]">JAZ: Fraunhofer ISE · BWP Marktdaten 2024 · DWD Klimadaten · Stand März 2026</div>
      </div>
    </div>
  );
}
