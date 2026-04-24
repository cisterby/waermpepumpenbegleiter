// components/programmatic/templates/InstallationTemplate.tsx
// waermepumpe-installation — vollständig standalone
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import {cityHash, getActualityBlock, getBundeslandParagraph, getCaseStudy, getComparisonTable, getCrossKeywordLinks, getDynamicH2s, getEnergieParagraph, getEnhancedCTA, getFinanzierungsOptionen, getGEGCountdown, getGarantieInfo, getGebaeudeParagraph, getHeizkoerperCheck, getInlineLinkedParagraph, getKeywordDeepContent, getLaermschutzInfo, getLokaleTiefenanalyse, getNachbarschaftsvergleich, getNearbyLinkContext, getPVWPKombination, getROITimeline, getRotatingFAQs, getSeasonalAdvice, getSectionIntros, getSocialProofData, getStromtarifOptimierung, getUniqueLocalParagraph, getVideoPlaceholder, getWartungsInfo, getImageAltTexts} from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';
import TableOfContents from '@/components/programmatic/TableOfContents';
import VideoPlaceholder from '@/components/programmatic/VideoPlaceholder';
// import SocialProofBar from '@/components/programmatic/SocialProofBar';
import EnhancedCTASidebar from '@/components/programmatic/EnhancedCTASidebar';
import InlineCalculator from '@/components/programmatic/InlineCalculator';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=85', 'https://images.unsplash.com/photo-1509391111902-de5d52b3f785?w=1920&q=85', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* VORAUSSETZUNGEN moved inside component */

/* INSTALLATIONS_KOSTEN moved inside component */

/* GENEHMIGUNG_BUNDESLAND moved inside component */

export default function InstallationTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const INSTALLATIONS_KOSTEN = [
    { pos: 'Nur Installation (ohne Gerät)', von: 3000, bis: 6000, note: `Kernbohrung, Kältemittel, Hydraulik, Elektro — ${city.name} Marktpreis 2026` },
    { pos: 'WP-Gerät Luft-Wasser', von: 9000, bis: 18000, note: `Je nach Hersteller, kW, Kältemittel in ${city.bundesland}` },
    { pos: 'Hydraulischer Abgleich', von: 500, bis: 1500, note: `KfW-Pflicht in ${city.name}` },
    { pos: 'Pufferspeicher 200–500 l', von: 600, bis: 2000, note: 'Taktschutz, mind. 30 l/kW' },
    { pos: 'Wärmemengenzähler', von: 300, bis: 600, note: 'KfW-Pflicht 2026' },
    { pos: 'Gesamt inkl. Gerät', von: 15000, bis: 28000, note: `Vollkosten in ${city.name} vor KfW` },
  ];

  const GENEHMIGUNG_BUNDESLAND = [
    { regel: 'Außenanlage Lärmschutz', detail: `TA Lärm in ${city.bundesland}: Max. 45 dB(A) tags / 35 dB(A) nachts. Moderne WP in ${city.name} liegen darunter.` },
    { regel: `Abstandsregelung ${city.bundesland}`, detail: `In ${city.bundesland} mind. 3 m zur Nachbargrenze empfohlen — lokal beim Bauamt ${city.name} prüfen.` },
    { regel: 'Baugenehmigung', detail: `In ${city.bundesland} meist ${['keine Genehmigung nötig — Anzeige beim Bauamt reicht', 'formlose Anzeige beim Bauamt', 'Baugenehmigung bei denkmalgeschützten Gebäuden'][Math.abs(Math.round(city.lat * 7)) % 3]}.` },
    { regel: 'F-Gas EU 517/2014', detail: 'Kältemittelbefüllung durch F-Gas-zertifizierten Betrieb Pflicht — gilt überall.' },
    { regel: 'Netzbetreiber-Anmeldung', detail: `Starkstromkreis 3×16A beim Netzbetreiber ${city.name} anmelden — Vorlauf ca. 4 Wochen.` },
  ];

  const VORAUSSETZUNGEN = [
    { kategorie: 'Elektro', check: '3-phasiger Starkstromanschluss (3×16A)', note: `Nachrüstung in ${city.name}: Elektriker prüfen — Anmeldung beim Netzbetreiber ca. 4 Wochen Vorlauf` },
    { kategorie: 'Hydraulik', check: 'Platz für Pufferspeicher (mind. 1 m² Keller)', note: `200–500 l Pufferspeicher — in ${city.name} oft Vertikallösung möglich bei engem Keller` },
    { kategorie: 'Aufstellung', check: 'Außenfläche ≥ 0,5 m² für Außeneinheit', note: `Mindestabstand Grundstücksgrenze in ${city.bundesland} prüfen — 3 m Abstand empfohlen` },
    { kategorie: 'Heizkreis', check: 'Vorlauftemperatur bekannt', note: `Messung bei ${city.normAussentemp}°C nötig (Normaußentemperatur ${city.name}) — Fachbetrieb prüft vor Ort` },
    { kategorie: 'Keller', check: 'Zugang für Kernbohrung (60–80 mm)', note: 'Wand zwischen innen/außen durchgängig — Fachbetrieb prüft vorab' },
    { kategorie: 'Schall', check: 'Abstand zu Schlafzimmerfenstern ≥ 3 m', note: `TA Lärm in ${city.bundesland}: Max. 45 dB(A) tags — die meisten modernen WP liegen darunter` },
    { kategorie: 'Genehmigung', check: `Baugenehmigung in ${city.bundesland} prüfen`, note: `In ${city.bundesland} ${['ist keine Baugenehmigung nötig, Anzeige beim Bauamt reicht', 'ggf. Baugenehmigung je nach Gemeinde', 'ist eine formlose Anzeige beim Bauamt ausreichend'][cityHash(city, 3, 220)]}` },
    { kategorie: 'Boden', check: 'Kein Gefälle > 10° am Aufstellort', note: 'Anti-Vibrations-Untergestell nivelliert leichte Unebenheiten' },
  ];
  const installMin = INSTALLATIONS_KOSTEN.reduce((s,p) => s+p.von, 0);
  const installMax = INSTALLATIONS_KOSTEN.reduce((s,p) => s+p.bis, 0);

  const intros = [
    `WP-Installation ${city.name}: Reine Installationskosten (ohne Gerät) ${fmtEuro(installMin)}–${fmtEuro(installMax)}. Dauer: 2–3 Tage. Voraussetzung: 3-phasiger Starkstromanschluss und Aufstellort Außeneinheit ≥ 2 m vom Nachbargrundstück.`,
    `Installation ${city.name} (${city.bundesland}): F-Gas-zertifizierter Kälteanlagenbauer Pflicht für Kältemittelarbeiten. Hydraulischer Abgleich (KfW-Pflicht): ${fmtEuro(500)}–${fmtEuro(1500)} extra. Gesamtinstallation ohne Gerät: ${fmtEuro(installMin)}–${fmtEuro(installMax)}.`,
    `WP ${city.name}: 7 Voraussetzungen vor der Installation prüfen — Elektro, Aufstellort, Schall, Heizkreis, Genehmigung. Unsere Parterbetriebe prüfen das bei der Vor-Ort-Begehung. JAZ ${jaz} → ${fmtEuro(calc.wpKosten)}/Jahr.`,
    `${city.name}: Installationsdauer 2–3 Tage, Kernbohrung Ø 80mm durch Außenwand, Starkstromanschluss 3×16A. KfW-Förderung ${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)}. Eigenanteil nach Förderung: ${fmtEuro(foerd.eigenanteil)}.`,
  ];

  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

  const uniqueParagraph = getUniqueLocalParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);

  const nearbyLinks = getNearbyLinkContext(city, nearby, keyword, jaz);

  const bundeslandText = getBundeslandParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const gebaeudeText = getGebaeudeParagraph(city, keyword, jaz, calc.wpKosten);
  const energieText = getEnergieParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const comparison = getComparisonTable(city, jaz, calc.wpKosten, calc.ersparnis);
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
  const finanzierung = getFinanzierungsOptionen(city, foerd.gesamtSatz);
  const wartung = getWartungsInfo(city, keyword);
  const garantie = getGarantieInfo(city);
  const caseStudy = getCaseStudy(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const gegCountdown = getGEGCountdown(city);
  const laermschutz = getLaermschutzInfo(city);
    const enhancedCta = getEnhancedCTA(city, keyword, calc.ersparnis, foerd.gesamtSatz);
    const videoData = getVideoPlaceholder(city, keyword);
    const socialProof = getSocialProofData(city, keyword);
  const altTexts = getImageAltTexts(city, keyword, jaz);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        <Image src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={altTexts.hero}
          className="absolute inset-0 w-full h-full object-cover" fill priority  sizes="100vw"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1910]/90 via-[#0A1910]/70 to-[#0A1910]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
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
              { val: '2–3 Tage', label: 'Installationsdauer', sub: 'Inkl. Inbetriebnahme' },
              { val: fmtEuro(installMin)+'+', label: 'Installationskosten', sub: 'Ohne Gerät' },
              { val: fmtEuro(foerd.zuschuss), label: 'KfW-Zuschuss', sub: foerd.gesamtSatz+'%' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'Nach Förderung' },
            ].map((s,i) => (
              <div key={i}><div className="text-xl font-extrabold text-white">{s.val}</div>
              <div className="text-white/50 text-xs">{s.label}</div><div className="text-white/75 text-xs">{s.sub}</div></div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Kostenloses Angebot →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Was kostet die WP-Installation in {stadt}? — Vollständige Übersicht', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Die Installationskosten (ohne Gerät) für eine WP in <strong>{city.name}</strong> liegen bei {fmtEuro(installMin)}–{fmtEuro(installMax)}. Hinzu kommen Gerät (€9.000–€18.000) und Nebenkosten (Elektro, Puffer, Entsorgung: €1.500–€5.000). Gesamtkosten vor KfW: €15.000–€30.000. Nach {foerd.gesamtSatz}% KfW: {fmtEuro(foerd.eigenanteil)}.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              Welche 7 Voraussetzungen brauche ich für eine WP in {city.name}
            ?</h2>
            <div className="space-y-2">
              {VORAUSSETZUNGEN.map((v,i)=>(
                <div key={i} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                  <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 h-fit mt-0.5 ${v.kategorie==='Elektro'?'bg-blue-100 text-blue-700':v.kategorie==='Schall'?'bg-amber-100 text-amber-700':v.kategorie==='Genehmigung'?'bg-red-100 text-red-700':'bg-[#F2FAF5] text-[#1A4731]'}`}>{v.kategorie}</span>
                  <div>
                    <div className="font-semibold text-[#1C2B2B] text-sm">{v.check}</div>
                    <div className="text-[#4A6358] text-xs mt-0.5">{v.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              Was kostet die WP-Installation komplett in — {city.name}
            ?</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#F8F9FA] border-b border-gray-200">
                  {['Position','Kosten von','Kosten bis','Hinweis'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {INSTALLATIONS_KOSTEN.map((k,i)=>(
                    <tr key={i} className={`border-b border-gray-200 last:border-0 ${i===0?'bg-[#F2FAF5]':''}`}>
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{k.pos}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(k.von)}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(k.bis)}</td>
                      <td className="px-4 py-3 text-xs text-[#7A9E8E]">{k.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#F2FAF5] border-t-2 border-gray-200l">
                    <td className="px-4 py-3 font-bold text-[#1C2B2B]">Gesamt Installation</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(installMin)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(installMax)}</td>
                    <td className="px-4 py-3 text-xs text-[#7A9E8E]">Ohne Gerät (€9–18k)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              Welche Genehmigungen & Vorschriften gelten für WP in {city.bundesland}
            ?</h2>
            <div className="space-y-3">
              {GENEHMIGUNG_BUNDESLAND.map((g,i)=>(
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="font-bold text-[#1C2B2B] text-sm mb-1">{g.regel}</div>
                  <p className="text-[#4A6358] text-xs leading-relaxed">{g.detail}</p>
                </div>
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

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md mb-10">
              {faqs.map((faq,i)=>(
                <details key={i} className="group border-b border-gray-200 last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                    <span className="font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-gray-200"><p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p></div>
                </details>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div><h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">{nearbyLinks.map(nl=>(
                <Link key={nl.city.slug} href={nl.url} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">{nl.text}</Link>
              ))}</div>
            </div>
            <div><h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">{(keyword.crossLinks??[]).map((slug:string)=>(
                <Link key={slug} href={`/${slug}/${city.slug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                  {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                </Link>
              ))}</div>
            </div>
          </div>
        </div>

        <div><div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-6">
          <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Installations-Kennzahlen</div>
          {[['Installationsdauer','2–3 Tage'],['Installation ohne Gerät',fmtEuro(installMin)+'–'+fmtEuro(installMax)],
            ['KfW-Zuschuss',fmtEuro(foerd.zuschuss)],['Eigenanteil',fmtEuro(foerd.eigenanteil)],
            ['JAZ in '+city.name,String(jaz)],['Betriebskosten',fmtEuro(calc.wpKosten)+'/J.'],
          ].map(([l,v],i)=>(
            <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0 text-sm">
              <span className="text-[#4A6358]">{l}</span><span className="font-bold text-[#1C2B2B]">{v}</span>
            </div>
          ))}
          <a href="#angebot" className="block mt-4 text-center bg-[#1A4731] text-white font-bold py-3 rounded-xl hover:bg-[#2D7A52] transition-colors text-sm">Kostenloses Angebot →</a>
        </div></div>
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

      {/* ── INSTALLATION CONTENT ────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <h2 className="font-bold text-[#1C2B2B] text-xl mb-5">
          WP-Installation in {city.name} — was passiert wann?
        </h2>
        <div className="prose prose-sm max-w-none text-[#4A6358] space-y-4 leading-relaxed">
          <p>
            <strong>Gesamtzeitplan für {city.name}:</strong> Planung + Angebote: 1–2 Wochen. KfW-Antrag stellen + Genehmigung abwarten: 1–2 Wochen. Netzbetreiber-Anmeldung (Pflicht): 4–6 Wochen Vorlauf. Installateur-Terminbuchung in {city.bundesland}: 4–12 Wochen Wartezeit 2026. Montage: 2–3 Tage. Inbetriebnahme + Dokumentation: 1 Tag. Gesamtprozess: 8–20 Wochen → frühzeitig planen.
          </p>
          <p>
            <strong>Genehmigungen in {city.bundesland}:</strong> Luft-Wasser-WP: in {city.bundesland} meist keine Baugenehmigung erforderlich, aber formlose Anzeige beim Bauamt. Geräuschemissionen müssen TA-Lärm einhalten: 45 dB(A) tags / 35 dB(A) nachts an der Grundstücksgrenze. Seit 01.01.2026: nur noch Geräte mit 10 dB Unterschreitung des Grenzwerts KfW-förderfähig.
          </p>
          <p>
            <strong>Bauliche Voraussetzungen in {city.name}:</strong> Außenfläche min. 0,5 m² + Abstand zur Grundstücksgrenze. Kellerraum für Pufferspeicher 200–300 l (min. 0,8 m²). Starkstromanschluss 3×16A (falls nicht vorhanden: €500–1.500 Upgrade). Kernbohrung 60–80 mm durch Außenwand. Alle diese Punkte klärt der Installateur beim Vorab-Check.
          </p>
          <p>
            <strong>Installationskosten in {city.name} aufgeschlüsselt:</strong> Außeneinheit + Montage: €2.500–4.500. Hydraulischer Abgleich (KfW-Pflicht): €500–1.500. Starkstrom-Anschluss: €500–1.500. Wärmemengenzähler (KfW 2026): €300–600. Kernbohrung: €150–400. Pufferspeicher: €600–2.000. Inbetriebnahme + F-Gas-Protokoll: €200–400. Gesamt Montage: €4.750–10.900.
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
          alt={altTexts.secondary}
          className="w-full h-full object-cover"
          fill
          loading="lazy"
          sizes="100vw"
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
                {city.bundeslandFoerderungBetrag} — kombinierbar mit KfW.
                {city.bundeslandFoerderungUrl && <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-[#1A4731] font-semibold hover:underline">Mehr Infos →</a>}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Leipzig/München Kälteschutz-Hinweis */}
      {city.normAussentemp <= -14 && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">🌡️</span>
            <div>
              <p className="font-bold text-slate-800 text-sm mb-1">{city.name}: {city.normAussentemp}°C Normaußentemperatur — Hochtemperatur-WP empfohlen</p>
              <p className="text-slate-600 text-xs leading-relaxed">Modelle die bis −20°C effizient arbeiten: Viessmann Vitocal 250-A, Vaillant aroTHERM plus. KfW-Förderung gilt unabhängig vom Modell.</p>
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
                  {/* ── Social Proof Counter ── */}
            {/* ── GEG-Countdown ── */}
            <div className={`rounded-xl p-5 border ${
              gegCountdown.urgencyLevel === 'kritisch' ? 'bg-red-50 border-red-300' :
              gegCountdown.urgencyLevel === 'dringend' ? 'bg-amber-50 border-amber-300' :
              'bg-blue-50 border-blue-200'
            }`}>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${
                gegCountdown.urgencyLevel === 'kritisch' ? 'bg-red-600 text-white' :
                gegCountdown.urgencyLevel === 'dringend' ? 'bg-amber-600 text-white' :
                'bg-blue-600 text-white'
              }`}>{gegCountdown.badge}</span>
              <p className="text-gray-800 text-sm leading-relaxed">{gegCountdown.message}</p>
            </div>

            {/* ── Praxisbeispiel ── */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <h3 className="text-lg font-bold text-[#1A4731]">{caseStudy.title}</h3>
              <p className="text-xs text-gray-400 font-semibold">{caseStudy.building}</p>
              <p className="text-[#4A6358] text-sm leading-relaxed">{caseStudy.situation}</p>
              <p className="text-[#4A6358] text-sm leading-relaxed">{caseStudy.result}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                {caseStudy.stats.slice(0, 2).map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[#1A4731] font-bold">{s.value}</p>
                    <p className="text-gray-500 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Wartung ── */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <h3 className="text-lg font-bold text-[#1A4731]">{wartung.title}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{wartung.paragraph}</p>
            </div>

            {/* ── Lärmschutz ── */}
            <div className="bg-[#F0F7FF] rounded-xl p-5 border border-blue-200 space-y-2">
              <h3 className="text-lg font-bold text-[#1A4731]">{laermschutz.title}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{laermschutz.paragraph}</p>
              <span className="inline-block bg-white/80 text-gray-700 text-xs px-3 py-1.5 rounded-lg border border-blue-100">📏 {laermschutz.abstand}</span>
            </div>

            {/* Social Proof Bar — Commented out (now uses honest data sources instead of fake metrics) */}
            {/*             <SocialProofBar */}
            {/*               anfragenGesamt={socialProof.anfragenGesamt} */}
            {/*               anfragenStadt={socialProof.anfragenStadt} */}
            {/*               letzteAnfrage={socialProof.letzteAnfrage} */}
            {/*               zufriedenheit={socialProof.zufriedenheit} */}
            {/*               cityName={city.name} */}
            {/*             /> */}
            {/* */ }

            {/* ── Video-Empfehlung ── */}
            <VideoPlaceholder
              title={videoData.title}
              description={videoData.description}
              thumbnailAlt={videoData.thumbnailAlt}
              duration={videoData.duration}
            />

<AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-[#7A9E8E]">F-Gas-Verordnung · KfW BEG 458 · TA Lärm · Stand März 2026</div>
      </div>
    </div>
  );
}
