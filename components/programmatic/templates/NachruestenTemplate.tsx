// components/programmatic/templates/NachruestenTemplate.tsx
// waermepumpe-nachruesten — vollständig standalone
// Fokus: Nachrüstung in bestehende Heizanlage — Anpassungen, Kosten, Ablauf, Eignung
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920&q=85', 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1920&q=85', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85', 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85', 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* arrays moved inside component */

export default function NachruestenTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const EIGNUNG_NACHRUESTEN = [
    { punkt: 'Vorlauftemperatur ≤ 55°C', geeignet: true, detail: `Standard Luft-WP ausreichend für ${city.name}. Heizlast nach DIN EN 12831 prüfen.` },
    { punkt: 'Vorlauftemperatur 55–70°C', geeignet: true, detail: `Hochtemperatur-WP (+€2.000–3.000) oder Hydraulischer Abgleich (€500–1.500) senkt VL oft auf unter 55°C — in ${city.bundesland} beides KfW-förderfähig.` },
    { punkt: 'Kellerraum > 1 m² vorhanden', geeignet: true, detail: `Für Pufferspeicher 200–500 l nötig — Standard in ${city.name}: ${['300 l Pufferspeicher bei 120 m² EFH', '400 l empfohlen für beste Taktschutzwirkung', '200–300 l für kleine Heizlasten ausreichend'][cityHash(city, 3, 210)]}.` },
    { punkt: 'Starkstromanschluss 3×16A', geeignet: true, detail: `Falls nicht vorhanden: €500–1.500 Elektriker-Aufwand in ${city.name}. Netzbetreiber-Anmeldung ca. 4 Wochen Vorlauf einplanen.` },
    { punkt: 'Dachgeschoss mit Heizkörpern', geeignet: true, detail: `Hydraulischer Abgleich nötig — DG hat oft den niedrigsten Druckverlust. Besonders in Altbauten in ${city.bundesland} häufig anzutreffen.` },
    { punkt: 'Alte undichte Rohrleitungen', geeignet: false, detail: `Erst Druckprobe und Sanierung, dann WP nachrüsten. In ${city.name} übernehmen lokale Betriebe beides aus einer Hand.` },
    { punkt: 'Elektrische Fußbodenheizung', geeignet: false, detail: `Kein Hydrauliksystem vorhanden — WP ohne Umbau nicht nachrüstbar. Alternativ: Infrarotheizung oder Umrüstung auf Wassersystem.` },
  ];

  const ANPASSUNGEN_KOSTEN = [
    { pos: 'Hydraulischer Abgleich (Pflicht)', von: 500, bis: 1500, wann: `Immer — KfW-Pflicht in ${city.name}` },
    { pos: 'Pufferspeicher 200–500 l', von: 600, bis: 2000, wann: 'Fast immer — Taktschutz' },
    { pos: 'Heizkörpertausch (falls nötig)', von: 200, bis: 500, wann: 'Pro HK bei VL > 55°C' },
    { pos: 'Elektroanschluss Starkstrom', von: 500, bis: 1500, wann: 'Wenn nicht vorhanden' },
    { pos: 'WW-Speicher (falls kein Kombi)', von: 800, bis: 2500, wann: 'Je nach System' },
    { pos: 'Alte Heizung demontieren', von: 200, bis: 500, wann: `Immer — Entsorgung ${city.bundesland}` },
  ];

  const ABLAUF_NACHRUESTEN = [
    { step: 'Vor-Ort-Begehung & Heizlast', what: `Vorlauftemperatur messen, Heizkreis prüfen, Kellermaße, Elektro-Check. ${['Kostenlos bei unseren Partnerbetrieben in ' + city.name, 'Dauer ca. 60–90 Minuten — kostenlos und unverbindlich', 'Unsere geprüften Betriebe in ' + city.name + ' kommen zu Ihnen'][cityHash(city, 3, 211)]}.` },
    { step: 'KfW-Antrag stellen (vor Auftrag!)', what: `Antrag MUSS vor Auftragserteilung bei KfW gestellt werden — gilt auch in ${city.name}. Wir begleiten kostenlos: Formular, LuL-Auswahl, Einreichung.` },
    { step: 'Anpassungen vornehmen', what: `Hydraulischer Abgleich, ggf. Heizkörpertausch, Elektro in ${city.name}. Diese Anpassungskosten sind vollständig KfW-förderfähig.` },
    { step: 'WP-Montage & Inbetriebnahme', what: `2–3 Tage in ${city.name}: Pufferspeicher, Kältemittelkreis, Hydraulik, Elektro. Inbetriebnahme durch F-Gas-zertifizierten Betrieb — Pflicht für KfW.` },
    { step: 'KfW-Abrechnung', what: `Rechnungen + Inbetriebnahmeprotokoll einreichen. KfW zahlt ${fmtEuro(foerd.zuschuss)} innerhalb von 4–8 Wochen direkt auf Ihr Konto.` },
  ];

  const anpassungMin = ANPASSUNGEN_KOSTEN.slice(0,3).reduce((s,p)=>s+p.von,0);
  const anpassungMax = ANPASSUNGEN_KOSTEN.slice(0,4).reduce((s,p)=>s+p.bis,0);

  const intros = [
    `WP nachrüsten ${city.name}: 70–80% aller Bestandsgebäude in ${city.bundesland} geeignet. Entscheidend: Vorlauftemperatur und Pufferspeicher-Platz im Keller. Typische Nachrüst-Anpassungskosten: ${fmtEuro(anpassungMin)}–${fmtEuro(anpassungMax)} (KfW-förderfähig).`,
    `Nachrüstung ${city.name}: GEG-Frist ${city.gegFrist.split('-').reverse().join('.')}. Wer jetzt nachrüstet bekommt ${foerd.gesamtSatz}% KfW (${fmtEuro(foerd.zuschuss)}) und spart ${fmtEuro(calc.ersparnis)}/Jahr vs. altem Gas. Amortisation: ${calc.amortisationJahre} Jahre.`,
    `WP nachrüsten ${city.name}: Hochtemperatur-WP bis 70°C Vorlauf für Altbauten — kein teurer Heizkörpertausch nötig. Hydraulischer Abgleich (€500–1.500) reicht oft aus um Effizienz auf JAZ ${jaz} zu heben.`,
    `${city.name} (${city.bundesland}): Bei ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und ${city.avgTemp}°C Jahresmittel ist die Nachrüstung wirtschaftlich. Eigenanteil nach ${foerd.gesamtSatz}% KfW: ${fmtEuro(foerd.eigenanteil)}. Betriebskosten: ${fmtEuro(calc.wpKosten)}/Jahr.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          className="absolute inset-0 w-full h-full object-cover" loading="eager" decoding="async" />
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
          <h1 className="font-bold font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
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
              { val: '70–80%', label: 'Häuser geeignet', sub: 'Quelle: BWP 2024' },
              { val: fmtEuro(foerd.zuschuss), label: 'KfW-Zuschuss', sub: foerd.gesamtSatz+'%' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'Nach Förderung' },
              { val: fmtEuro(calc.ersparnis)+'/J.', label: 'Ersparnis', sub: 'vs. Gasheizung' },
            ].map((s,i) => (
              <div key={i}><div className="text-xl font-extrabold text-white">{s.val}</div>
              <div className="text-white/50 text-xs">{s.label}</div><div className="text-white/75 text-xs">{s.sub}</div></div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Eignung prüfen — kostenlos →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Kann ich in {stadt} eine WP nachrüsten? — Eignungscheck', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              70–80% aller Bestandsgebäude in <strong>{city.name}</strong> sind für die WP-Nachrüstung geeignet. Das entscheidende Kriterium ist nicht das Baujahr sondern die Vorlauftemperatur. Moderne Hochtemperatur-WP arbeiten bis 70°C — damit passen sie in fast jeden Altbau. Bei {city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen in {city.name} ergibt sich JAZ {jaz} → Betriebskosten {fmtEuro(calc.wpKosten)}/Jahr.
            </p>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">
              Ist mein Haus in {city.name} — 7 Kriterien
            ?</h2>
            <div className="space-y-2">
              {EIGNUNG_NACHRUESTEN.map((e,i)=>(
                <div key={i} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                  {e.geeignet ? <CheckCircle size={16} className="text-[#1A4731] shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />}
                  <div>
                    <div className="font-semibold text-[#1C2B2B] text-sm">{e.punkt}</div>
                    <div className="text-[#4A6358] text-xs mt-0.5">{e.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Was kostet die Nachrüstung in {city.name}
            ?</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#F8F9FA] border-b border-gray-200">
                  {['Anpassung','Kosten von','Kosten bis','Wann nötig'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {ANPASSUNGEN_KOSTEN.map((a,i)=>(
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{a.pos}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(a.von)}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(a.bis)}</td>
                      <td className="px-4 py-3 text-xs text-[#7A9E8E]">{a.wann}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#D97706]lt border-t-2 border-amber-200">
                    <td className="px-4 py-3 font-bold text-[#1C2B2B]">Typische Anpassungskosten</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#D97706]">{fmtEuro(anpassungMin)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#D97706]">{fmtEuro(anpassungMax)}</td>
                    <td className="px-4 py-3 text-xs text-[#7A9E8E]">KfW-förderfähig</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">
              Wie läuft die WP-Nachrüstung in {city.name} — in 5 Schritten?
            </h2>
            <div className="space-y-3">
              {ABLAUF_NACHRUESTEN.map((s,i)=>(
                <div key={i} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="w-8 h-8 bg-[#1A4731] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{i+1}</div>
                  <div>
                    <div className="font-bold font-bold text-[#1C2B2B] text-sm mb-1">{s.step}</div>
                    <p className="text-[#4A6358] text-xs leading-relaxed">{s.what}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {faqs.length > 0 && (
            <div className="p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md mb-10">
              {faqs.map((faq,i)=>(
                <details key={i} className="group border-b border-gray-200 last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                    <span className="font-bold font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-gray-200"><p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p></div>
                </details>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div><h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">{nearby.map(n=>(
                <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">{n.name}</Link>
              ))}</div>
            </div>
            <div><h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">{(keyword.crossLinks??[]).map((slug:string)=>(
                <Link key={slug} href={`/${slug}/${city.slug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                  {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                </Link>
              ))}</div>
            </div>
          </div>
        </div>

        <div><div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-6">
          <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Nachrüstung</div>
          {[['Anpassungskosten',fmtEuro(anpassungMin)+'–'+fmtEuro(anpassungMax)],
            ['KfW-Zuschuss',fmtEuro(foerd.zuschuss)],['Förderquote',foerd.gesamtSatz+'%'],
            ['Eigenanteil',fmtEuro(foerd.eigenanteil)],['JAZ',String(jaz)],
            ['GEG-Frist',city.gegFrist.split('-').reverse().join('.')],
          ].map(([l,v],i)=>(
            <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0 text-sm">
              <span className="text-[#4A6358]">{l}</span><span className="font-bold text-[#1C2B2B]">{v}</span>
            </div>
          ))}
          <a href="#angebot" className="block mt-4 text-center bg-[#1A4731] text-white font-bold py-3 rounded-xl hover:bg-[#2D7A52] transition-colors text-sm">Eignung prüfen →</a>
        </div></div>
      </div>

      <div id="angebot" className="bg-[#1A4731] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bold font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

      {/* ── NACHRÜSTEN CONTENT ──────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-5">
          Wie läuft die WP-Nachrüstung in {city.name} konkret ab?
        </h2>
        <div className="prose prose-sm max-w-none text-[#4A6358] space-y-4 leading-relaxed">
          <p>
            <strong>Eignungscheck in {city.name}:</strong> 80% aller Bestandsgebäude in {city.bundesland} sind nachrüstbar. Die 3 wichtigsten Prüfpunkte: (1) Vorlauftemperatur — messbar über Heizkörper-Thermostat bei -10°C Außentemperatur. Über 65°C → Hochtemperatur-WP nötig. (2) Außeneinheit-Standort — Abstand zur Nachbargrenze, TA-Lärm. (3) Kellerplatz für Pufferspeicher 200–300 l.
          </p>
          <p>
            <strong>Ablauf der Nachrüstung in {city.name} — 5 Schritte:</strong> (1) KfW-Antrag vor Auftragserteilung stellen. (2) Hydraulischen Abgleich durchführen lassen — senkt Vorlauftemperatur um 5–10°C, verbessert JAZ von ca. {(jaz-0.4).toFixed(1)} auf {jaz}. (3) Elektro-Upgrade falls nötig: Starkstromanschluss 3×16A. (4) Pufferspeicher installieren. (5) WP-Montage + Inbetriebnahme (2–3 Tage).
          </p>
          <p>
            <strong>GEG-Fristen für {city.name}:</strong> Städte mit mehr als 100.000 Einwohnern: kommunale Wärmeplanung bis 30.06.2026. Kleinere Gemeinden in {city.bundesland}: bis 30.06.2028. Nach Veröffentlichung des Wärmeplans gilt eine Übergangsfrist. Wichtig: Die KfW-Förderung ist unabhängig von der GEG-Frist und gilt sofort.
          </p>
          <p>
            <strong>Kosten der Nachrüstung in {city.name}:</strong> WP-System: {fmtEuro(foerd.eigenanteil)} Eigenanteil nach {foerd.gesamtSatz}% KfW. Anpassungsarbeiten: Hydraulischer Abgleich €500–1.500 (KfW-Pflicht), ggf. Heizkörpertausch €200–500/Stück, Pufferspeicher €600–2.000, Elektro-Upgrade €500–1.500. Jährliche Ersparnis danach: ca. {fmtEuro(calc.ersparnis)}.
          </p>
        </div>
      </div>

      {/* ── VERWANDTE THEMEN ─────────────────────────── */}
      {crossKeywords.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-8">
          <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">
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
        <img
          src={pickImg(SEC1_IMGS, city.lat, city.lng, 5)}
          alt={`${keyword.keyword.replace('[Stadt]', city.name)} Übersicht`}
          className="w-full h-full object-cover"
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
      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-6">
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
        <div className="mt-6 text-xs text-[#7A9E8E]">BWP Marktdaten 2024 · KfW BEG 458 · GEG BMWSB · Stand März 2026</div>
      </div>
    </div>
  );
}
