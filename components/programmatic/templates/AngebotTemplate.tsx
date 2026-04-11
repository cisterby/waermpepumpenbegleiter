// components/programmatic/templates/AngebotTemplate.tsx
// waermepumpe-angebot — vollständig standalone
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import {cityHash, getActualityBlock, getBundeslandParagraph, getCaseStudy, getComparisonTable, getCrossKeywordLinks, getDynamicH2s, getEnergieParagraph, getEnhancedCTA, getFinanzierungsOptionen, getGEGCountdown, getGarantieInfo, getGebaeudeParagraph, getHeizkoerperCheck, getInlineLinkedParagraph, getKeywordDeepContent, getLaermschutzInfo, getLocalTestimonial, getLokaleTiefenanalyse, getNachbarschaftsvergleich, getNearbyLinkContext, getPVWPKombination, getROITimeline, getRotatingFAQs, getSeasonalAdvice, getSectionIntros, getSocialProofData, getStromtarifOptimierung, getUniqueLocalParagraph, getVideoPlaceholder, getWartungsInfo} from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';
import TableOfContents from '@/components/programmatic/TableOfContents';
import VideoPlaceholder from '@/components/programmatic/VideoPlaceholder';
import SocialProofBar from '@/components/programmatic/SocialProofBar';
import EnhancedCTASidebar from '@/components/programmatic/EnhancedCTASidebar';
import InlineCalculator from '@/components/programmatic/InlineCalculator';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1920&q=85', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=85', 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* ANGEBOT_MUSS moved inside component */

/* ROTE_FLAGGEN moved inside component */
/* orphaned ROTE_FLAGGEN body removed */

/* ANGEBOTSVERGLEICH moved inside component */

export default function AngebotTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const ANGEBOT_MUSS = [
    { pos: 'Heizlastberechnung DIN EN 12831', pflicht: true, note: `Für ${city.normAussentemp}°C Normaußentemperatur ${city.name} — KfW-Pflicht` },
    { pos: 'Hydraulischer Abgleich (Verfahren B)', pflicht: true, note: `KfW-Pflicht in ${city.name} — ohne diesen: Förderantrag abgelehnt` },
    { pos: 'WP-Gerät mit Modell und kW-Leistung', pflicht: true, note: 'Vollständige Gerätespezifikation inkl. COP/Schallleistung' },
    { pos: 'Kältemittelangabe (R290, R410A etc.)', pflicht: true, note: '+5% KfW-Bonus für R290 — muss explizit genannt sein' },
    { pos: 'Pufferspeicher mit Volumen', pflicht: true, note: `Mind. 30 l/kW — für ${city.name} Heizlast relevant` },
    { pos: 'Elektroinstallation separat ausgewiesen', pflicht: true, note: `Starkstromkreis + Netzbetreiber-Anmeldung ${city.name}` },
    { pos: 'Wärmemengenzähler (KfW-Pflicht 2026)', pflicht: true, note: 'Neu ab 2026 für KfW-Verwendungsnachweis Pflicht' },
    { pos: 'Inbetriebnahme durch F-Gas-Betrieb', pflicht: true, note: 'EU 517/2014 — ohne F-Gas-Zertifikat illegal' },
    { pos: 'Garantiezeiten', pflicht: false, note: 'Herstellergarantie 5–7 Jahre — in ${city.bundesland} prüfen' },
    { pos: 'KfW-Begleitung inklusive', pflicht: false, note: `In ${city.name}: Betriebe ohne LuL-Erfahrung oft überfordert mit KfW-Antrag` },
  ];
  const ANGEBOTSVERGLEICH = [
    { frage: `Wie viele Angebote in ${city.name} einholen?`, antwort: `Mindestens 3 — in ${city.name} typisch 20–40% Preisunterschied. Wir holen sie in 48h ein.` },
    { frage: 'Was muss im Angebot stehen?', antwort: `Heizlastberechnung DIN EN 12831, hydraulischer Abgleich (KfW-Pflicht), alle Positionen separat ausgewiesen.` },
    { frage: `Wie lange gilt das Angebot in ${city.name}?`, antwort: `Typisch 30 Tage — Preise in ${city.bundesland} können bei Engpässen steigen. Zügig entscheiden.` },
  ];

  const ROTE_FLAGGEN = [
    { signal: 'Kein Heizlastnachweis im Angebot', risiko: `WP falsch dimensioniert — JAZ bis 20% schlechter. ${['KfW lehnt Verwendungsnachweis ab', 'Häufigster Ablehnungsgrund beim KfW-Antrag', 'In ' + city.name + ' betrifft das ca. jeden 3. Anbieter'][cityHash(city, 3, 260)]}` },
    { signal: 'Kein hydraulischer Abgleich enthalten', risiko: `KfW-Pflicht in ${city.name} — ohne Abgleich: Förderung weg + Heizkreis funktioniert ungleichmäßig` },
    { signal: 'Pauschale WP-Größe ohne Rechnung', risiko: `Überdimensionierung (= mehr Taktungen, schlechtere JAZ) oder Unterdimensionierung (= zu kalt bei ${city.normAussentemp}°C)` },
    { signal: 'Kein Pufferspeicher im Angebot', risiko: `WP taktet zu häufig: bei ${city.heizgradtage} Heizgradtagen in ${city.name} sinkt die Lebensdauer stark` },
    { signal: 'Elektroinstallation nicht aufgeführt', risiko: `Versteckte Kosten: €500–1.500 Nachforderung — in ${city.name} häufig bei günstig erscheinenden Angeboten` },
    { signal: 'Anbieter nicht im KfW-Portal registriert', risiko: `Kein BEG-Zuschuss möglich — ${fmtEuro(foerd.zuschuss)} Förderung für ${city.name} entfällt komplett` },
  ];
  const wartezeit = city.einwohner >= 500000 ? '6–12 Wochen' : city.einwohner >= 200000 ? '5–10 Wochen' : '4–8 Wochen';

  const intros = [
    `WP-Angebot ${city.name}: Wartezeit derzeit ${wartezeit}. Wichtigste Regel — KfW-Antrag muss vor Auftragserteilung gestellt sein. ${foerd.gesamtSatz}% Förderung = ${fmtEuro(foerd.zuschuss)} Zuschuss. Wir begleiten den gesamten Prozess kostenlos.`,
    `3 Angebote für ${city.name} einholen: Preisunterschied von 20–40% bei identischer Leistung keine Seltenheit. Entscheidend ist nicht der günstigste Preis, sondern Heizlastberechnung, hydraulischer Abgleich und KfW-LuL-Status im Angebot.`,
    `${city.name} (${city.bundesland}): Für ${foerd.gesamtSatz}% KfW-Förderung muss das Angebot Heizlastberechnung und hydraulischen Abgleich enthalten. Ohne diese wird der Antrag abgelehnt — und ${fmtEuro(foerd.zuschuss)} sind weg.`,
    `Wärmepumpe ${city.name}: JAZ ${jaz} → ${fmtEuro(calc.wpKosten)}/Jahr Betriebskosten. Eigenanteil nach ${foerd.gesamtSatz}% KfW: ${fmtEuro(foerd.eigenanteil)}. Wir prüfen für Sie ob das Angebot alle KfW-Pflichtpositionen enthält.`,
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
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
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
              Wartezeit {city.name}: {wartezeit} — jetzt anfragen
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
              { val: 'Bis zu 3', label: 'Angebote', sub: 'Kostenlos vergleichen' },
              { val: wartezeit, label: 'Wartezeit', sub: city.name },
              { val: fmtEuro(foerd.zuschuss), label: 'KfW-Zuschuss', sub: foerd.gesamtSatz + '%' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'Nach Förderung' },
            ].map((s,i) => (
              <div key={i}><div className="text-xl font-extrabold text-white">{s.val}</div>
              <div className="text-white/50 text-xs">{s.label}</div><div className="text-white/75 text-xs">{s.sub}</div></div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Kostenloses Angebot anfordern →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Wie bekomme ich ein gutes WP-Angebot in {stadt}?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Ein gutes WP-Angebot in <strong>{city.name}</strong> enthält zwingend: Heizlastberechnung nach DIN EN 12831, hydraulischer Abgleich Verfahren B (KfW-Pflicht) und KfW-LuL-Antragsbegleitung. Ohne diese drei Positionen wird der KfW-Antrag ({foerd.gesamtSatz}% = {fmtEuro(foerd.zuschuss)}) abgelehnt. Wartezeit derzeit {wartezeit} in {city.name} — frühzeitig anfragen.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              {[`Checkliste: Was muss im WP-Angebot in ${city.name} stehen?`,`Was gehört in jedes seriöse Angebot in ${city.name}?`,`Pflichtpunkte im WP-Angebot — Checkliste für ${city.name}`,`WP-Angebot ${city.name}: Diese Punkte müssen drinstehen`][cityHash(city,4,300)]}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#F8F9FA] border-b border-gray-200">
                  {['Position','Pflicht?','Hinweis'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {ANGEBOT_MUSS.map((r,i)=>(
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{r.pos}</td>
                      <td className="px-4 py-3">{r.pflicht?<span className="text-[#1A4731] font-bold">✅ Pflicht</span>:<span className="text-[#7A9E8E] text-sm">Optional</span>}</td>
                      <td className="px-4 py-3 text-xs text-[#4A6358]">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              {[`5 rote Flaggen beim WP-Angebot in ${city.name}`,`Welche Warnsignale zeigen ein schlechtes Angebot in ${city.name} sofort ablehnen`,`Schlechte WP-Angebote erkennen — 5 Signale in ${city.name}`,`Diese 5 Mängel im Angebot kosten Eigentümer in ${city.name} teuer`][cityHash(city,4,301)]}
            </h2>
            <div className="space-y-3">
              {ROTE_FLAGGEN.map((f,i)=>(
                <div key={i} className="flex gap-3 p-4 bg-white border border-red-200 rounded-xl">
                  <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#1C2B2B] text-sm">{f.signal}</div>
                    <div className="text-[#4A6358] text-xs mt-0.5">→ {f.risiko}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">
              Wie vergleiche ich WP-Angebote in {city.name} — häufige Fragen
            ?</h2>
            <div className="space-y-3">
              {ANGEBOTSVERGLEICH.map((a,i)=>(
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="font-semibold text-[#1C2B2B] text-sm mb-1">{a.frage}</div>
                  <p className="text-[#4A6358] text-sm leading-relaxed">{a.antwort}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
            <h2 className="font-bold text-[#1C2B2B] text-xl mb-4">{h2s.klimadaten}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed mb-4">{si.klimadaten}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                [foerd.gesamtSatz+'%','KfW-Förderquote'],
                [fmtEuro(foerd.zuschuss),'KfW-Zuschuss'],
                [fmtEuro(foerd.eigenanteil),'Eigenanteil'],
                [String(jaz),'JAZ in '+city.name],
                [fmtEuro(calc.ersparnis)+'/J.','Ersparnis vs. Gas'],
                [wartezeit,'Wartezeit '+city.name],
              ].map(([v,l],i)=>(
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
          <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Angebots-Check</div>
          {[['Wartezeit',wartezeit],['KfW-Zuschuss',fmtEuro(foerd.zuschuss)],['Förderquote',foerd.gesamtSatz+'%'],
            ['Eigenanteil',fmtEuro(foerd.eigenanteil)],['JAZ',String(jaz)],
            ['GEG-Frist',city.gegFrist.split('-').reverse().join('.')]
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

      {/* Landesförderung — besonders prominent für Angebot-Keyword */}
      {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('eingestellt') && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-[#E8F5EE] border border-[#3DA16A]/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">💶</span>
            <div>
              <p className="font-bold text-[#1A4731] text-sm mb-1">{city.bundesland}-Förderung zusätzlich zur KfW: {city.bundeslandFoerderung}</p>
              <p className="text-[#4A6358] text-xs leading-relaxed">
                <strong className="text-[#1C2B2B]">{city.bundeslandFoerderungBetrag}</strong> — achten Sie beim Angebot darauf, dass der Betrieb auch die {city.bundesland}-Förderung kennt und begleitet.
                {city.bundeslandFoerderungUrl && <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-[#1A4731] font-semibold hover:underline">Programm-Details →</a>}
              </p>
            </div>
          </div>
        </div>
      )}
      {!city.bundeslandFoerderung && city.bundeslandFoerderungBetrag && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-4">
            <p className="text-[#4A6358] text-xs"><strong className="text-[#1C2B2B]">{city.bundesland}:</strong> Kein aktives Landesprogramm — {city.bundeslandFoerderungBetrag}. KfW-Bundesförderung gilt vollständig.</p>
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
        <div className="mt-6 text-xs text-[#7A9E8E]">KfW BEG 458 · HWK · BWP 2024 · Stand März 2026</div>
      </div>
    </div>
  );
}
