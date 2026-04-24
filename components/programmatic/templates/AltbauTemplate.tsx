// components/programmatic/templates/AltbauTemplate.tsx
// waermepumpe-altbau — vollständig standalone, 500+ Wörter unique content
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import {cityHash, getActualityBlock, getBundeslandParagraph, getCaseStudy, getComparisonTable, getCrossKeywordLinks, getDynamicH2s, getEnergieParagraph, getEnhancedCTA, getFinanzierungsOptionen, getGEGCountdown, getGarantieInfo, getGebaeudeParagraph, getHeizkoerperCheck, getInlineLinkedParagraph, getKeywordDeepContent, getLaermschutzInfo, getLokaleTiefenanalyse, getNachbarschaftsvergleich, getNearbyLinkContext, getPVWPKombination, getROITimeline, getRotatingFAQs, getSeasonalAdvice, getSectionIntros, getSocialProofData, getStromtarifOptimierung, getUniqueLocalParagraph, getVideoPlaceholder, getWartungsInfo} from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';
import TableOfContents from '@/components/programmatic/TableOfContents';
import VideoPlaceholder from '@/components/programmatic/VideoPlaceholder';
// import SocialProofBar from '@/components/programmatic/SocialProofBar';
import EnhancedCTASidebar from '@/components/programmatic/EnhancedCTASidebar';
import InlineCalculator from '@/components/programmatic/InlineCalculator';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920&q=85', 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1920&q=85', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85', 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85', 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* EIGNUNG_TEST + SANIERUNGS_REIHENFOLGE moved inside component */

/* JAZ_ALTBAU moved inside component */

export default function AltbauTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const EIGNUNG_TEST = [
    { frage: 'Vorlauftemperatur des Heizkreises', ja: '≤ 55°C → Standard-WP', nein: '55–70°C → Hochtemperatur-WP (+€2.000)', detail: `Messung am Heizkessel bei ${city.normAussentemp}°C Außentemperatur (Normaußentemperatur ${city.name}). Lokaler Fachbetrieb prüft vor Ort.` },
    { frage: 'Heizkörpergröße', ja: 'Alte, große Heizkörper → oft 55°C ausreichend', nein: 'Kleine Heizkörper → höhere VL-Temp nötig', detail: `Größere Heizkörper = mehr Heizfläche = niedrigere VL-Temp möglich. In ${city.name}: Hydraulischen Abgleich zuerst prüfen — spart oft teuren Heizkörpertausch.` },
    { frage: 'Dämmzustand Außenwände', ja: 'WDVS oder Kerndämmung vorhanden', nein: 'Ungedämmtes Mauerwerk → WP noch möglich', detail: `WP funktioniert auch ungedämmt in ${city.name} — JAZ sinkt leicht auf ca. ${(jaz - 0.3).toFixed(1)}, Betriebskosten ca. €${Math.round(calc.wpKosten * 0.12)}/Jahr mehr.` },
    { frage: 'Baujahr Gebäude', ja: 'Kein Ausschlusskriterium', nein: 'Kein Ausschlusskriterium', detail: `Auch Häuser von 1900 können in ${city.name} mit WP beheizt werden — entscheidend ist die Vorlauftemperatur, nicht das Baujahr.` },
  ];

  const SANIERUNGS_REIHENFOLGE = [
    { schritt: '1. Hydraulischer Abgleich', kosten: '€500–€1.500', effekt: `VL-Temp um 5–10°C senken — KfW-Pflicht in ${city.name}`, kfw: true },
    { schritt: '2. Heizkörpertausch (falls nötig)', kosten: '€200–€500 pro Heizkörper', effekt: 'VL-Temp von 70°C auf 55°C senken', kfw: false },
    { schritt: '3. WP-Installation', kosten: `${fmtEuro(18000)} – ${fmtEuro(28000)}`, effekt: `Hauptinvestition — ${foerd.gesamtSatz}% KfW = ${fmtEuro(foerd.zuschuss)}`, kfw: true },
    { schritt: '4. Fußbodenheizung (optional)', kosten: '€5.000–€15.000', effekt: `VL-Temp auf 35°C, JAZ von ${(jaz-0.3).toFixed(1)} auf ${(jaz+0.3).toFixed(1)}`, kfw: false },
  ];

  const jazAltbau = Math.max(jaz - 0.3, 2.8).toFixed(1);
  const jazOptimiert = Math.min(jaz + 0.3, 4.5).toFixed(1);
  const JAZ_ALTBAU = [
    { typ: 'Unsaniert, alte Heizkörper (70°C VL)', jaz: `${Math.max(jaz - 1.0, 2.5).toFixed(1)}–${Math.max(jaz - 0.6, 3.0).toFixed(1)}`, betrieb: `Hochtemperatur-WP nötig in ${city.name}` },
    { typ: 'Standard-Altbau (55°C VL)', jaz: `${Math.max(jaz - 0.4, 2.9).toFixed(1)}–${jaz.toFixed(1)}`, betrieb: 'Standard Luft-WP, gute Wirtschaftlichkeit' },
    { typ: 'Teilsaniert mit Hydr. Abgleich (50°C)', jaz: `${jaz.toFixed(1)}–${Math.min(jaz + 0.3, 4.2).toFixed(1)}`, betrieb: `Empfohlen für ${city.name} — gute JAZ` },
    { typ: 'Vollsaniert mit FBH (35°C VL)', jaz: `${Math.min(jaz + 0.4, 4.0).toFixed(1)}–${Math.min(jaz + 0.9, 4.8).toFixed(1)}`, betrieb: `Maximale Effizienz bei ${city.avgTemp}°C Jahresmittel` },
  ];

  const intros = [
    `Wärmepumpe im Altbau ${city.name}: 70–80% aller Bestandsgebäude in ${city.bundesland} sind geeignet. Entscheidend ist nicht das Baujahr sondern die Vorlauftemperatur. Moderne Hochtemperatur-WP arbeiten bis 70°C — kompatibel mit fast allen Altbau-Heizkörpern. JAZ ${jazAltbau}–${jaz} in ${city.name} bei ${city.avgTemp}°C Jahresmittel.`,
    `Altbau ${city.name} (${city.bundesland}): Hydraulischer Abgleich (€500–1.500) senkt die Vorlauftemperatur um 5–10°C — das verbessert die JAZ von ${jazAltbau} auf ${jaz} und die Wirtschaftlichkeit um ca. ${fmtEuro(Math.round(calc.ersparnis * 0.15))}/Jahr. Mit ${foerd.gesamtSatz}% KfW = ${fmtEuro(foerd.eigenanteil)} Eigenanteil.`,
    `WP Altbau ${city.name}: Bei ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und ${city.normAussentemp}°C Normaußentemperatur. Mit Hochtemperatur-WP bis 70°C VL erreichbar. Betriebskosten: ${fmtEuro(calc.wpKosten)}/Jahr statt ${fmtEuro(calc.altKosten)}/Jahr mit Gas. Ersparnis: ${fmtEuro(calc.ersparnis)}/Jahr.`,
    `Modernisierung ${city.name}: Schritt 1 hydraulischer Abgleich, dann WP-Installation. In ${city.bundesland} gilt ab ${city.gegFrist.split('-').reverse().join('.')} die GEG-65%-EE-Pflicht. WP erfüllt diese automatisch — Gas-Brennwert nicht mehr allein GEG-konform.`,
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
              { val: '70–80%', label: 'Altbauten geeignet', sub: 'Quelle: BWP 2024' },
              { val: `JAZ ${jazAltbau}+`, label: 'Auch im Altbau', sub: city.avgTemp + '°C Jahresmittel' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: foerd.gesamtSatz + '% KfW' },
              { val: fmtEuro(calc.ersparnis) + '/J.', label: 'Ersparnis vs. Gas', sub: city.name },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/75 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Eignung prüfen — kostenlos →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Funktioniert eine Wärmepumpe im Altbau in {stadt}?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Ja — in den meisten Altbauten in <strong>{city.name}</strong>. Entscheidend ist nicht das Baujahr sondern die Vorlauftemperatur. Moderne Hochtemperatur-WP arbeiten bis 70°C Vorlauf und sind damit mit nahezu allen Bestandsheizkörpern kompatibel. In {city.name} ({city.bundesland}) mit {city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und {city.avgTemp}°C Jahresmittel erreichen WP eine JAZ von {jazAltbau}–{jaz} — jährliche Ersparnis gegenüber Gas: {fmtEuro(calc.ersparnis)}.
            </p>
          </div>

          {/* Eignungscheck */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">
              {[
                `Altbau-Schnelltest: Ist Ihr Haus in ${city.name} geeignet?`,
                `WP-Eignung im Altbau: Was zählt wirklich in ${city.name}?`,
                `Checkliste: Wärmepumpe im Altbau ${city.name} — geeignet oder nicht?`,
                `Welche Altbauten in ${city.name} sind für eine WP geeignet?`,
              ][cityHash(city, 4, 101)]}
            </h2>
            <div className="space-y-3">
              {EIGNUNG_TEST.map((t, i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="font-semibold text-[#1C2B2B] text-sm mb-2">{t.frage}</div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex gap-1.5 items-start text-[#1A4731]"><CheckCircle size={13} className="mt-0.5 shrink-0" />{t.ja}</div>
                    <div className="flex gap-1.5 items-start text-[#7A9E8E]"><XCircle size={13} className="mt-0.5 shrink-0" />{t.nein}</div>
                  </div>
                  <p className="text-xs text-[#4A6358]">{t.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* JAZ im Altbau */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              {[
                `JAZ-Vergleich nach Sanierungsstand in ${city.name}`,
                `Welche JAZ ist realistisch in ${city.name}: Was bringt jede Sanierungsstufe?`,
                `Effizienz im Altbau ${city.name}: JAZ je nach Vorlauftemperatur`,
                `So verbessert sich die JAZ in ${city.name} nach der Sanierung`,
              ][cityHash(city, 4, 102)]}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    {['Gebäudetyp & Vorlauftemperatur', 'JAZ', 'Betrieb'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {JAZ_ALTBAU.map((r, i) => (
                    <tr key={i} className={`border-b border-gray-200 last:border-0 ${i === 2 ? 'bg-[#F2FAF5]' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{r.typ}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{r.jaz}</td>
                      <td className="px-4 py-3 text-[#4A6358] text-xs">{r.betrieb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#7A9E8E] mt-2">Basiswerte für {city.avgTemp}°C Jahresmittel in {city.name} — individuelle JAZ hängt vom konkreten Gebäude ab.</p>
          </div>

          {/* Sanierungsreihenfolge */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              {[
                `Optimale Sanierungsreihenfolge für Altbauten in ${city.name}`,
                `Wie läuft die Heizungsmodernisierung in ${city.name}`,
                `In welcher Reihenfolge sanieren? Altbau ${city.name}`,
                `Sanierungsfahrplan für Ihr Haus in ${city.name}`,
              ][cityHash(city, 4, 103)]}
            </h2>
            <div className="space-y-3">
              {SANIERUNGS_REIHENFOLGE.map((s, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="w-8 h-8 bg-[#1A4731] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{i+1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <div className="font-bold text-[#1C2B2B] text-sm">{s.schritt}</div>
                      <div className="font-mono text-xs text-[#7A9E8E] shrink-0">{s.kosten}</div>
                    </div>
                    <div className="text-[#4A6358] text-xs mt-0.5">{s.effekt}</div>
                    {s.kfw && <span className="inline-block mt-1 text-xs bg-[#F2FAF5] text-[#1A4731] px-2 py-0.5 rounded-full">KfW-förderfähig</span>}
                  </div>
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
                [`${city.avgTemp}°C`, 'Jahresmitteltemperatur'],
                [`${city.normAussentemp}°C`, 'Normaußentemperatur'],
                [city.heizgradtage.toLocaleString('de-DE'), 'Heizgradtage'],
                [`${jazAltbau}–${jaz}`, 'JAZ Altbau'],
                [fmtEuro(calc.wpKosten) + '/J.', 'WP-Betriebskosten'],
                [fmtEuro(calc.ersparnis) + '/J.', 'Ersparnis vs. Gas'],
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
            <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Altbau-Kennzahlen</div>
            {[
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Förderquote', foerd.gesamtSatz + '%'],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
              ['JAZ Altbau', jazAltbau + '–' + jaz],
              ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
              ['Amortisation', calc.amortisationJahre + ' J.'],
              ['GEG-Frist', city.gegFrist.split('-').reverse().join('.')],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="text-[#4A6358]">{l}</span>
                <span className="font-bold text-[#1C2B2B]">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-[#1A4731] text-white font-bold py-3 rounded-xl hover:bg-[#2D7A52] transition-colors text-sm">Eignung prüfen →</a>
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

      {/* Bundesland-Förderung */}
      {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('eingestellt') && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-[#E8F5EE] border border-[#3DA16A]/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">💶</span>
            <div>
              <p className="font-bold text-[#1A4731] text-sm mb-1">
                {city.bundesland}-Förderung: {city.bundeslandFoerderung}
              </p>
              <p className="text-[#4A6358] text-xs leading-relaxed">
                {city.bundeslandFoerderungBetrag} — kombinierbar mit KfW-Bundesförderung.
                {city.bundeslandFoerderungUrl && (
                  <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer"
                    className="ml-1 text-[#1A4731] font-semibold hover:underline">
                    Mehr Infos →
                  </a>
                )}
              </p>
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
        <div className="mt-6 text-xs text-[#7A9E8E]">Klimadaten: DWD · KfW BEG 458 · BWP Marktdaten 2024 · Stand März 2026</div>
      </div>
    </div>
  );
}
