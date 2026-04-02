// components/programmatic/templates/PreiseTemplate.tsx
// waermepumpe-preise — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85', 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85', 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* WP_TYPEN_PREISE moved inside component */

/* PREIS_FAKTOREN moved inside component */

/* VERSTECKTE_KOSTEN moved inside component */

export default function PreiseTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const PREIS_FAKTOREN = [
    { faktor: 'Heizlast / Gebäudegröße', einfluss: 'Hoch', detail: `Jedes kW mehr Heizleistung = ca. €800–1.200 Mehrkosten. Heizlastberechnung nach DIN EN 12831 Pflicht in ${city.name}.` },
    { faktor: 'Vorlauftemperatur (VL)', einfluss: 'Mittel', detail: `Hochtemperatur-WP (bis 70°C) kostet €1.500–3.000 mehr. ${city.avgTemp < 9 ? `In ${city.name} mit ${city.avgTemp}°C relevant für Altbau.` : `In ${city.name} reicht oft Standard-WP.`}` },
    { faktor: 'Kältemittel R290 (Propan)', einfluss: 'Niedrig', detail: `R290 kostet €200–500 mehr, bringt +5% KfW-Bonus — bei €25.000 Invest = €${Math.round(25000*0.05)} extra Förderung. Lohnt sich fast immer in ${city.name}.` },
    { faktor: 'Pufferspeicher', einfluss: 'Mittel', detail: `200–500 l Pufferspeicher: €600–2.000. In ${city.name} Standard für Taktschutz — mind. 30 l/kW.` },
    { faktor: 'Elektroanschluss', einfluss: 'Variabel', detail: `Neuer Starkstromkreis 3×16A + Zweitarif-Zähler: €500–1.500. Netzbetreiber ${city.name} meldet ca. 4 Wochen Vorlauf.` },
    { faktor: 'Region & Wettbewerb', einfluss: 'Mittel', detail: `In ${city.bundesland} liegen Installateurpreise ${city.strompreis > 30 ? 'etwas über dem Bundesschnitt' : 'im Bundesschnitt'}. Mind. 3 Angebote in ${city.name} einholen.` },
  ];

  const WP_TYPEN_PREISE = [
    { typ: 'Luft-Wasser-WP (Standard)', gerät: '€9.000–€18.000', montage: '€3.000–€6.000', gesamt: '€12.000–€28.000', kfw: true, note: `92% aller WP in ${city.name} — JAZ ${jaz}` },
    { typ: 'Luft-Wasser-WP (Hochtemperatur)', gerät: '€11.000–€20.000', montage: '€3.500–€6.500', gesamt: '€14.500–€30.000', kfw: true, note: `Altbau in ${city.name} mit VL 55–70°C` },
    { typ: 'Sole-Wasser-WP (Erdwärme)', gerät: '€10.000–€18.000', montage: '€8.000–€18.000', gesamt: '€22.000–€38.000', kfw: true, note: `+5% KfW-Bonus, JAZ ${(jaz + 0.8).toFixed(1)} in ${city.name}` },
    { typ: 'Wasser-Wasser-WP (Grundwasser)', gerät: '€10.000–€17.000', montage: '€10.000–€20.000', gesamt: '€22.000–€40.000', kfw: true, note: `Selten — Grundwasserrecht ${city.bundesland} nötig` },
  ];

  const VERSTECKTE_KOSTEN = [
    { pos: 'Elektroinstallation & Starkstrom', kosten: '€500–1.500', note: `Eigener Kreis 3×16A — Netzbetreiber ${city.name} oft nicht im Angebot` },
    { pos: 'Hydraulischer Abgleich', kosten: '€500–1.500', note: `KfW-Pflicht in ${city.name} — muss separat ausgewiesen sein` },
    { pos: 'Wärmemengenzähler (KfW-Pflicht 2026)', kosten: '€300–600', note: 'Neu ab 2026' },
    { pos: 'Kernbohrung Außenwand', kosten: '€150–400', note: 'Kältemittelleitungen in ${city.name}' },
    { pos: 'Schallschutzfundament', kosten: '€200–600', note: `In dicht besiedelten Lagen in ${city.name} empfohlen` },
    { pos: 'WW-Speicher (falls nicht enthalten)', kosten: '€800–2.500', note: 'Warmwasserbereitung separat' },
    { pos: 'Alte Heizung entsorgen', kosten: '€200–500', note: `Demontage + Entsorgungskosten in ${city.bundesland}` },
  ];
  const eigenanteilMin = Math.round(12000 * (1 - foerd.gesamtSatz / 100));
  const eigenanteilMax = Math.round(30000 * (1 - foerd.gesamtSatz / 100));

  const intros = [
    `WP-Preise ${city.name} 2026: Luft-WP €12.000–€28.000, nach ${foerd.gesamtSatz}% KfW (${fmtEuro(foerd.zuschuss)}) noch €${eigenanteilMin.toLocaleString('de-DE')}–€${eigenanteilMax.toLocaleString('de-DE')} Eigenanteil. Versteckte Kosten (Elektro, Puffer, Entsorgung) machen oft 15–25% der Gesamtrechnung aus.`,
    `Wärmepumpe ${city.name}: Gesamtkosten Luft-WP inkl. aller Nebenkosten: ${fmtEuro(foerd.eigenanteil)} Eigenanteil nach KfW. JAZ ${jaz} → Betriebskosten ${fmtEuro(calc.wpKosten)}/Jahr. Amortisation: ${calc.amortisationJahre} Jahre.`,
    `Preisvergleich ${city.name} (${city.bundesland}): Luft-WP ab €12.000, Sole-WP €22.000+. Nach ${foerd.gesamtSatz}% KfW = Eigenanteil ${fmtEuro(foerd.eigenanteil)}. Achtung: Angebote ohne Heizlastberechnung immer ablehnen.`,
    `Was kostet eine WP in ${city.name}? Gerät + Montage + Nebenkosten (Elektro, Puffer, Entsorgung) = €15.000–€32.000 vor Förderung. ${foerd.gesamtSatz}% KfW deckt ${fmtEuro(foerd.zuschuss)} ab. Eigenanteil: ${fmtEuro(foerd.eigenanteil)}.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        <img src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          className="absolute inset-0 w-full h-full object-cover" loading="eager" decoding="async" {...({fetchPriority:"high"} as object)} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1910]/90 via-[#0A1910]/70 to-[#0A1910]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
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
              { val: '€12.000+', label: 'Luft-WP ab', sub: 'Inkl. Montage' },
              { val: fmtEuro(foerd.zuschuss), label: 'KfW-Abzug', sub: foerd.gesamtSatz + '% Förderung' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Ihr Eigenanteil', sub: 'Nach Förderung' },
              { val: calc.amortisationJahre + ' J.', label: 'Amortisation', sub: 'Bei JAZ ' + jaz },
            ].map((s,i) => (
              <div key={i}><div className="text-xl font-extrabold text-white">{s.val}</div>
              <div className="text-white/50 text-xs">{s.label}</div><div className="text-white/75 text-xs">{s.sub}</div></div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Preise vergleichen — kostenlos →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Was kostet eine Wärmepumpe in {stadt}? — Preisübersicht 2026', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Eine Luft-Wasser-WP in <strong>{city.name}</strong> kostet inklusive Montage und Nebenkosten €12.000–€28.000. Nach {foerd.gesamtSatz}% KfW-Förderung ({fmtEuro(foerd.zuschuss)}) verbleibt ein Eigenanteil von {fmtEuro(foerd.eigenanteil)}. Sole-WP (Erdwärme) kostet €22.000–€38.000, hat aber höhere Effizienz (JAZ {(jaz + 1.0).toFixed(1)}) und immer +5% KfW-Bonus.
            </p>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              {[
                `Preisvergleich nach WP-Typ in ${city.name} — inkl. Montage 2026`,
                `Was kosten die drei WP-Typen in ${city.name}? Vollständiger Vergleich`,
                `WP-Kosten ${city.name}: Gerätepreis + Montage + Nebenkosten`,
                `Luft-, Sole- und Wasser-WP in ${city.name}: Preisübersicht 2026`,
              ][cityHash(city, 4, 110)]}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-md">
              <table className="w-full text-sm min-w-[500px]">
                <thead><tr className="bg-[#F8F9FA] border-b border-gray-200">
                  {['WP-Typ','Gerät','Montage','Gesamt','KfW','Hinweis'].map(h=>(
                    <th key={h} className="px-3 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {WP_TYPEN_PREISE.map((r,i)=>(
                    <tr key={i} className={`border-b border-gray-200 last:border-0 ${i===0?'bg-[#F2FAF5]':''}`}>
                      <td className="px-3 py-3 font-semibold text-[#1C2B2B] text-sm">{r.typ}</td>
                      <td className="px-3 py-3 font-mono text-xs text-[#4A6358]">{r.gerät}</td>
                      <td className="px-3 py-3 font-mono text-xs text-[#4A6358]">{r.montage}</td>
                      <td className="px-3 py-3 font-mono font-bold text-[#1A4731] text-sm">{r.gesamt}</td>
                      <td className="px-3 py-3 text-sm">{r.kfw?'✅':''}</td>
                      <td className="px-3 py-3 text-xs text-[#7A9E8E]">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#7A9E8E] mt-2">Marktpreise {city.name} 2026 — Endpreis nach KfW: {fmtEuro(eigenanteilMin)}–{fmtEuro(eigenanteilMax)}</p>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">
              {[
                `5 Faktoren, die den WP-Preis in ${city.name} beeinflussen`,
                `Was bestimmt den Endpreis Ihrer Wärmepumpe in ${city.name}?`,
                `Warum unterscheiden sich WP-Angebote in ${city.name} so stark?`,
                `Diese 5 Punkte treiben die WP-Kosten in ${city.name}`,
              ][cityHash(city, 4, 111)]}
            </h2>
            <div className="space-y-3">
              {PREIS_FAKTOREN.map((f,i)=>(
                <div key={i} className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                  <div className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold h-fit mt-0.5 ${f.einfluss==='Hoch'?'bg-red-100 text-red-700':f.einfluss==='Mittel'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'}`}>{f.einfluss}</div>
                  <div><div className="font-bold font-bold text-[#1C2B2B] text-sm mb-1">{f.faktor}</div>
                  <p className="text-[#4A6358] text-xs leading-relaxed">{f.detail}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              {[
                `Versteckte Kosten — was viele Angebote weglassen`,
                `Was fehlt oft im WP-Angebot? Unterschätzte Posten im Überblick`,
                `Nebenkosten bei der WP-Installation: Diese Positionen fehlen häufig`,
                `Worauf beim WP-Angebot achten? Versteckte Positionen`,
              ][cityHash(city, 4, 112)]}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#F8F9FA] border-b border-gray-200">
                  {['Position','Kosten','Hinweis'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {VERSTECKTE_KOSTEN.map((r,i)=>(
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{r.pos}</td>
                      <td className="px-4 py-3 font-mono text-[#D97706] font-bold text-sm">{r.kosten}</td>
                      <td className="px-4 py-3 text-xs text-[#4A6358]">{r.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#D97706]lt">
                    <td className="px-4 py-3 font-bold text-[#1C2B2B]">Mögliche Zusatzkosten gesamt</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#D97706]">€2.650–7.100</td>
                    <td className="px-4 py-3 text-xs text-[#7A9E8E]">Nicht im Hauptangebot enthalten</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
            <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-4">{h2s.kosten}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed mb-4">{si.kosten}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                ['€12.000–€28.000','Luft-WP gesamt'],
                [fmtEuro(foerd.zuschuss),'KfW-Zuschuss (' + foerd.gesamtSatz + '%)'],
                [fmtEuro(foerd.eigenanteil),'Eigenanteil'],
                [fmtEuro(calc.wpKosten)+'/J.','Betriebskosten'],
                [fmtEuro(calc.ersparnis)+'/J.','Ersparnis vs. Gas'],
                [calc.amortisationJahre + ' J.','Amortisation'],
              ].map(([v,l],i)=>(
                <div key={i}><div className="text-[#7A9E8E] text-xs">{l}</div><div className="font-bold text-[#1C2B2B]">{v}</div></div>
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
            <div>
              <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">{nearby.map(n=>(
                <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">{n.name}</Link>
              ))}</div>
            </div>
            <div>
              <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">{(keyword.crossLinks??[]).map((slug:string)=>(
                <Link key={slug} href={`/${slug}/${city.slug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                  {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                </Link>
              ))}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-6">
            <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Preisübersicht</div>
            {[
              ['Luft-WP gesamt','€12k–€28k'],['Sole-WP gesamt','€22k–€38k'],
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Förderquote', foerd.gesamtSatz+'%'],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
              ['Amortisation', calc.amortisationJahre+' J.'],
              ['Versteckte Kosten','€2.650–€7.100'],
            ].map(([l,v],i)=>(
              <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="text-[#4A6358]">{l}</span><span className="font-bold text-[#1C2B2B]">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-[#1A4731] text-white font-bold py-3 rounded-xl hover:bg-[#2D7A52] transition-colors text-sm">Kostenloses Angebot →</a>
          </div>
        </div>
      </div>

      <div id="angebot" className="bg-[#1A4731] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bold font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

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
        <div className="mt-6 text-xs text-[#7A9E8E]">BWP Preismonitor 2026 · KfW BEG 458 · BDEW Energiepreise · Stand März 2026</div>
      </div>
    </div>
  );
}
