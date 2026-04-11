// components/programmatic/templates/NeubauTemplate.tsx
// waermepumpe-neubau — vollständig standalone, 500+ Wörter unique content
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import {cityHash, getActualityBlock, getBundeslandParagraph, getComparisonTable, getCrossKeywordLinks, getDynamicH2s, getEnergieParagraph, getEnhancedCTA, getGebaeudeParagraph, getHeizkoerperCheck, getInlineLinkedParagraph, getKeywordDeepContent, getLocalTestimonial, getLokaleTiefenanalyse, getNachbarschaftsvergleich, getNearbyLinkContext, getPVWPKombination, getROITimeline, getRotatingFAQs, getSeasonalAdvice, getSectionIntros, getSocialProofData, getStromtarifOptimierung, getUniqueLocalParagraph, getVideoPlaceholder} from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';
import TableOfContents from '@/components/programmatic/TableOfContents';
import VideoPlaceholder from '@/components/programmatic/VideoPlaceholder';
import SocialProofBar from '@/components/programmatic/SocialProofBar';
import EnhancedCTASidebar from '@/components/programmatic/EnhancedCTASidebar';
import InlineCalculator from '@/components/programmatic/InlineCalculator';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=85', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=85', 'https://images.unsplash.com/photo-1509391111902-de5d52b3f785?w=1920&q=85', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* GEG_ANFORDERUNGEN moved inside component */

/* NEUBAU_PLANUNG moved inside component */

/* VERGLEICH_HEIZUNG moved inside component */

export default function NeubauTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const GEG_ANFORDERUNGEN = [
    { titel: 'EE-Anteil mind. 65%', text: `WP erfüllt das in ${city.name} immer — JAZ ${jaz} ergibt weit über 65% erneuerbaren Anteil` },
    { titel: 'GEG §71 Neubau', text: 'Seit 2024 gilt 65%-EE-Pflicht für alle neuen Heizungen in Deutschland' },
    { titel: 'QP-Grenzwert einhalten', text: `Wärmepumpe senkt Primärenergiebedarf in ${city.name} deutlich unter den GEG-Grenzwert` },
    { titel: 'Lüftungsanlage empfohlen', text: 'Ab Luftdichtigkeit n50 < 0,6 empfohlen — bei gut gedämmtem Neubau Standard' },
    { titel: 'Anlagenbuch & Protokolle', text: 'F-Gas, Hydraulik, Inbetriebnahme für Bauabnahme und KfW-Nachweis' },
  ];
  const NEUBAU_PLANUNG = [
    { phase: 'Bauplanung (vor Baugenehmigung)', items: [`WP-Typ und Leistung in Haustechnikplanung für ${city.name}`, 'Fußbodenheizung mit Verteiler einplanen', 'Außeneinheit-Position und Schallabstand festlegen'] },
    { phase: 'KfW-Antrag (vor Baubeginn!)', items: [`BEG WG Programm 297 für Neubau — bis ${foerd.gesamtSatz}% in ${city.name}`, 'Antrag zwingend vor Baubeginn stellen', 'Fachunternehmen muss KfW-LuL-registriert sein'] },
    { phase: 'Einbau (Rohbauphase)', items: ['Fußbodenheizung + Verteilsystem parallel zur Betondecke', 'Kältemittelleitungen vorinstallieren', 'Starkstromkreis 3×16A vorbereiten'] },
    { phase: `WP-Montage (Ausbauphase)`, items: [`Außeneinheit aufstellen in ${city.name} — Schallabstand prüfen`, 'Inneneinheit / Pufferspeicher installieren', 'Inbetriebnahme + KfW-Protokoll'] },
  ];
  const VERGLEICH_HEIZUNG = [
    { typ: 'Wärmepumpe (Luft/Sole)', kosten: fmtEuro(18000)+'–'+fmtEuro(28000), kfw: `${foerd.gesamtSatz}%`, betrieb: fmtEuro(calc.wpKosten)+'/J.', langfrist: 'Zukunftssicher' },
    { typ: 'Gas-WP-Hybrid', kosten: fmtEuro(8000)+'–'+fmtEuro(15000), kfw: '30%', betrieb: fmtEuro(Math.round(calc.wpKosten*1.3))+'/J.', langfrist: 'CO₂-Risiko' },
    { typ: 'Pellets', kosten: fmtEuro(15000)+'–'+fmtEuro(25000), kfw: '45%', betrieb: fmtEuro(Math.round(calc.wpKosten*1.35))+'/J.', langfrist: 'Lagerung nötig' },
    { typ: 'Reine Gasheizung', kosten: fmtEuro(5000)+'–'+fmtEuro(10000), kfw: '0%', betrieb: fmtEuro(calc.wpKosten+calc.ersparnis)+'/J.', langfrist: `Nicht empfohlen in ${city.name}` },
    { typ: 'Fernwärme', kosten: fmtEuro(3000)+'–'+fmtEuro(8000), kfw: '30%', betrieb: `Variabel — ${city.fernwaermeQuote}% in ${city.name}`, langfrist: `Nur wenn Netz in ${city.name}` },
  ];
  const jazNeubau = Math.min(jaz + 0.5, 4.8).toFixed(1);

  const intros = [
    `Neubau in ${city.name} (${city.bundesland}): Seit 01.01.2024 muss jede neue Heizung 65% erneuerbare Energie nutzen. Mit Fußbodenheizung (Vorlauf 30–40°C) erreicht eine WP in ${city.name} JAZ ${jazNeubau}. Betriebskosten: ${fmtEuro(Math.round(calc.wpKosten * 0.75))}/Jahr — ${fmtEuro(Math.round(calc.ersparnis * 1.2))}/Jahr besser als Gas.`,
    `Neubau ${city.name}: Mit ${city.avgSunHours} Sonnenstunden/Jahr lohnt PV+WP. Eine 8-kWp-PV-Anlage deckt bis zu ${Math.round(Math.min(city.avgSunHours * 8 * 0.85 * 0.65, 4000))} kWh des WP-Strombedarfs — effektive Wärmekosten unter 2 ct/kWh.`,
    `KfW-Welche Förderung gibt es für WP im Neubau in ${city.name}: Programm 297/298 als Kredit bis €150.000 für Effizienzhaus 40. Im Neubau gilt ${city.bundeslandFoerderung ? `in ${city.bundesland} zusätzlich: ${city.bundeslandFoerderung}` : `die KfW-Bundesförderung`}. WP + Effizienzhaus 40 = beste Kombination.`,
    `Neubau ${city.name} 2026: ${city.normAussentemp}°C Normaußentemperatur, ${city.avgTemp}°C Jahresmittel, ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtage. Fußbodenheizung + WP → JAZ ${jazNeubau}. Betriebskosten: ${fmtEuro(Math.round(calc.wpKosten * 0.75))}/Jahr.`,
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
  const pvWP = getPVWPKombination(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const roiTimeline = getROITimeline(city, jaz, calc.wpKosten, calc.ersparnis, foerd.gesamtSatz);
  const nachbarVergleich = getNachbarschaftsvergleich(city, nearby, jaz, calc.wpKosten, calc.ersparnis);
  const heizkoerper = getHeizkoerperCheck(city, keyword);
  const stromtarif = getStromtarifOptimierung(city, jaz, calc.wpKosten);
  const deepContent = getKeywordDeepContent(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
    const enhancedCta = getEnhancedCTA(city, keyword, calc.ersparnis, foerd.gesamtSatz);
    const videoData = getVideoPlaceholder(city, keyword);
    const socialProof = getSocialProofData(city, keyword);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <Image src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          className="absolute inset-0 w-full h-full object-cover" fill priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1910]/90 via-[#0A1910]/70 to-[#0A1910]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white transition-colors">{keyword.keyword.replace(' [Stadt]','')}</Link>
            <span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          <div className="inline-block bg-[#1A4731] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            GEG-Pflicht: 65% EE seit 01.01.2024
          </div>
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
              { val: `JAZ ${jazNeubau}`, label: 'Mit Fußbodenheizung', sub: city.name },
              { val: `${fmtEuro(Math.round(calc.wpKosten * 0.75))}/J.`, label: 'WP-Betriebskosten', sub: 'Neubau-optimiert' },
              { val: city.avgSunHours + ' h/J.', label: 'Sonnenstunden', sub: 'PV+WP ideal' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-white">{s.val}</div>
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
              {fillTemplate('Welche Wärmepumpe für den Neubau in {stadt}?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Im Neubau in <strong>{city.name}</strong> ist die Luft-Wasser-Wärmepumpe mit Fußbodenheizung die Standardlösung: JAZ {jazNeubau} bei {city.avgTemp}°C Jahresmittel, Betriebskosten {fmtEuro(Math.round(calc.wpKosten * 0.75))}/Jahr. Seit 01.01.2024 ist 65% erneuerbare Energie gesetzlich Pflicht — eine WP erfüllt das automatisch. Mit KfW-297/298 (Effizienzhaus 40) sind zinsgünstige Kredite bis €150.000 möglich.
            </p>
          </div>

          {/* GEG-Anforderungen */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">
              Welche GEG-Anforderungen gelten für den Neubau in {city.name} — was gilt
            ?</h2>
            <div className="space-y-3">
              {GEG_ANFORDERUNGEN.map((a, i) => (
                <div key={i} className={`p-4 rounded-xl border ${i === 0 ? 'bg-[#D97706]lt border-amber-200' : 'bg-white border-gray-200'}`}>
                  <div className="font-bold text-[#1C2B2B] text-sm mb-1">{a.titel}</div>
                  <p className="text-[#4A6358] text-sm leading-relaxed">{a.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Welche Heizung ist im Neubau in */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              Welche Heizung ist im Neubau in {city.name} 2026
            ?</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-md">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    {['Heizung', 'Kosten', 'KfW-Förderung', 'Betrieb', 'Langfrist'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VERGLEICH_HEIZUNG.map((r, i) => (
                    <tr key={i} className={`border-b border-gray-200 last:border-0 ${i === 0 ? 'bg-[#F2FAF5]' : ''}`}>
                      <td className="px-3 py-3 font-semibold text-[#1C2B2B]">{r.typ}</td>
                      <td className="px-3 py-3 font-mono text-xs text-[#4A6358]">{r.kosten}</td>
                      <td className="px-3 py-3 text-xs">{r.kfw}</td>
                      <td className="px-3 py-3 text-xs text-[#4A6358]">{r.betrieb}</td>
                      <td className={`px-3 py-3 text-xs font-semibold ${i === 0 ? 'text-[#1A4731]' : 'text-[#7A9E8E]'}`}>{r.langfrist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Planungs-Checkliste */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">
              Was muss ich für die WP-Planung im Neubau in {city.name}
            ?</h2>
            <div className="space-y-4">
              {NEUBAU_PLANUNG.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="font-bold text-[#1C2B2B] text-base mb-3">{p.phase}</div>
                  <ul className="space-y-2">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex gap-2 text-sm text-[#4A6358]">
                        <CheckCircle size={15} className="text-[#1A4731] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Stadtdaten */}
          <div className="p-6 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
            <h2 className="font-bold text-[#1C2B2B] text-xl mb-4">{h2s.klimadaten}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed mb-4">{si.klimadaten}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                [`${city.avgTemp}°C`, 'Jahresmittel'],
                [`${city.normAussentemp}°C`, 'Normaußentemperatur'],
                [String(jazNeubau), 'JAZ mit FBH'],
                [city.heizgradtage.toLocaleString('de-DE') + ' Kd/a', 'Heizgradtage'],
                [city.avgSunHours + ' h/J.', 'Sonnenstunden PV'],
                [fmtEuro(Math.round(calc.wpKosten * 0.75)) + '/J.', 'WP-Betriebskosten'],
              ].map(([v, l], i) => (
                <div key={i}><div className="text-[#7A9E8E] text-xs">{l}</div><div className="font-bold text-[#1C2B2B]">{v}</div></div>
              ))}
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

          
          {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

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

          {/* FAQ */}
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
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ').replace('foerderung','Förderung')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-6">
            <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Neubau-Kennzahlen</div>
            {[
              ['JAZ mit Fußbodenheizung', jazNeubau],
              ['Betriebskosten/Jahr', fmtEuro(Math.round(calc.wpKosten * 0.75))],
              ['Sonnenstunden/Jahr', city.avgSunHours + ' h'],
              ['Normtemp.', city.normAussentemp + '°C'],
              ['Jahresmittel', city.avgTemp + '°C'],
              ['Heizgradtage', city.heizgradtage.toLocaleString('de-DE')],
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
                      {/* ── Inline Rechner ── */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#1A4731] mb-3">Schnellrechner für {city.name}</h3>
              <InlineCalculator city={city} jaz={jaz} foerdSatz={foerd.gesamtSatz} />
            </div>

<LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

      {/* ── NEUBAU CONTENT ───────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <h2 className="font-bold text-[#1C2B2B] text-xl mb-5">
          Wärmepumpe im Neubau in {city.name} — was zählt wirklich?
        </h2>
        <div className="prose prose-sm max-w-none text-[#4A6358] space-y-4 leading-relaxed">
          <p>
            Im Neubau in {city.name} ist die Wärmepumpe das effizienteste Heizsystem — weil die Randbedingungen ideal sind: Fußbodenheizung mit 30–35°C Vorlauftemperatur, gute Dämmung (KfW-55 oder besser), JAZ-Potenzial bis {(jaz + 0.7).toFixed(1)}. Der Eigenanteil nach KfW berechnet sich anders als beim Bestandsbau: Kein Klima-Speed-Bonus (kein fossiles System zum Ersetzen), dafür KFN-Kredit (Klimafreundlicher Neubau) möglich.
          </p>
          <p>
            <strong>Planungs-Checkliste für {city.name}:</strong> (1) Fußbodenheizung bereits im Rohbauplan vorsehen — nachträglich 4× teurer. (2) Außeneinheit-Standort in der Baugenehmigung berücksichtigen. (3) Starkstromanschluss 3×16A für WP einplanen. (4) Pufferspeicher 200–300 l im Keller einkalkulieren. (5) Netzbetreiber-Anmeldung 6 Wochen vor Inbetriebnahme.
          </p>
          <p>
            <strong>Kosten Neubau {city.name} 2026:</strong> Luft-Wasser-WP: €16.000–26.000 komplett. Erdwärme: €22.000–35.000. Im Neubau Förderung über KfW KFN (§ 297 ff. GEG): zinsgünstige Kredite statt Direktzuschuss. Betriebskosten mit JAZ {(jaz + 0.5).toFixed(1)}: ca. {fmtEuro(Math.round(calc.wpKosten * 0.78))}/Jahr — dank Fußbodenheizung ca. 22% günstiger als im Bestandsbau.
          </p>
          <p>
            <strong>WP + PV im Neubau in {city.name}:</strong> Die optimale Kombination. 10 kWp PV erzeugen in {city.name} ca. 8.500–10.000 kWh/Jahr. 40–60% davon direkt für WP nutzbar — Stromkosten effektiv auf 4 ct/kWh statt {city.strompreis} ct/kWh. Amortisationszeit PV+WP zusammen: 8–12 Jahre.
          </p>
        </div>
      </div>

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
                  {/* ── Social Proof Counter ── */}
            <SocialProofBar
              anfragenGesamt={socialProof.anfragenGesamt}
              anfragenStadt={socialProof.anfragenStadt}
              letzteAnfrage={socialProof.letzteAnfrage}
              zufriedenheit={socialProof.zufriedenheit}
              cityName={city.name}
            />

            {/* ── Video-Empfehlung ── */}
            <VideoPlaceholder
              title={videoData.title}
              description={videoData.description}
              thumbnailAlt={videoData.thumbnailAlt}
              duration={videoData.duration}
            />

<AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-[#7A9E8E]">GEG: BMWSB 2024 · KfW 297/298 · DWD Klimadaten · Stand März 2026</div>
      </div>
    </div>
  );
}