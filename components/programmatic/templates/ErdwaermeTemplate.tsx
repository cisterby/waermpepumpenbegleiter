// components/programmatic/templates/ErdwaermeTemplate.tsx
// erdwaermepumpe — vollständig standalone
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=85', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=85', 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=85', 'https://images.unsplash.com/photo-1509391111902-de5d52b3f785?w=1920&q=85', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* BOHRUNG_VS_KOLLEKTOR moved inside component */

/* GENEHMIGUNG moved inside component */

/* KOSTEN_ERDWAERME moved inside component */

export default function ErdwaermeTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const BOHRUNG_VS_KOLLEKTOR = [
    { kriterium: 'Grundstücksgröße', bohrung: 'Ab 100 m² — 1 Bohrung ca. 2 m²', kollektor: `Mind. ${Math.round(calc.wpKosten / 10 * 8)} m² Grundstück`, besser: 'Bohrung' },
    { kriterium: 'Investitionskosten', bohrung: '€6.000–€15.000', kollektor: '€3.000–€8.000', besser: 'Kollektor' },
    { kriterium: `JAZ in ${city.name}`, bohrung: `${(jaz + 0.8).toFixed(1)}–${(jaz + 1.2).toFixed(1)}`, kollektor: `${(jaz + 0.5).toFixed(1)}–${(jaz + 0.9).toFixed(1)}`, besser: 'Bohrung' },
    { kriterium: `Genehmigung ${city.bundesland}`, bohrung: `Wasserrechtliche Genehmigung ${city.bundesland}`, kollektor: 'Meist genehmigungsfrei', besser: 'Kollektor' },
    { kriterium: 'KfW-Bonus', bohrung: '+5% (Erdwärme)', kollektor: '+5% (Erdwärme)', besser: 'gleich' },
    { kriterium: 'Betrieb', bohrung: 'Wartungsarm, konstant', kollektor: 'Witterungsabhängig im Winter', besser: 'Bohrung' },
  ];
  const GENEHMIGUNG = [
    { step: 'Hydrogeologisches Gutachten', beschreibung: `In ${city.bundesland} vor jeder Tiefenbohrung Pflicht — Dauer 2–4 Wochen` },
    { step: 'Wasserrechtliche Genehmigung', beschreibung: `Untere Wasserbehörde ${city.bundesland} — typisch 4–8 Wochen` },
    { step: 'Bohrprotokoll', beschreibung: `Für KfW-Nachweis und Behörde in ${city.bundesland} erforderlich` },
    { step: 'Grundstücksgrenzen prüfen', beschreibung: `Abstand zur Grenze in ${city.bundesland}: meist mind. 3 m` },
    { step: 'Denkmalschutz prüfen', beschreibung: `In Altstadtlagen von ${city.name} relevant` },
  ];
  const KOSTEN_ERDWAERME = [
    { pos: 'WP-Gerät Sole-Wasser', von: 10000, bis: 18000, note: `Preis in ${city.bundesland} 2026` },
    { pos: 'Tiefenbohrung (100–200 m)', von: 8000, bis: 16000, note: `Ca. €80–100/m in ${city.bundesland}` },
    { pos: 'Hydraulik & Montage', von: 3000, bis: 6000, note: 'Inklusive Sole-Befüllung' },
    { pos: 'Genehmigungen', von: 1000, bis: 3000, note: `Wasserrecht ${city.bundesland}` },
    { pos: 'Hydraulischer Abgleich', von: 500, bis: 1500, note: 'KfW-Pflicht' },
    { pos: 'Elektroinstallation', von: 500, bis: 1500, note: `Netzbetreiber ${city.name}` },
  ];
  const jazSole = Math.min(jaz + 1.0, 5.5).toFixed(1);
  const kostenSole = Math.round(calc.wpKosten * (jaz / (jaz + 1.0)));
  const gesamtMin = KOSTEN_ERDWAERME.reduce((s,p) => s+p.von, 0);
  const gesamtMax = KOSTEN_ERDWAERME.reduce((s,p) => s+p.bis, 0);

  const intros = [
    `Erdwärmepumpe ${city.name}: JAZ ${jazSole} bei konstant 10–12°C Erdtemperatur — ${(Number(jazSole) - jaz).toFixed(1)} mehr als Luft-WP. Betriebskosten: ${fmtEuro(kostenSole)}/Jahr. Nachteil: Tiefenbohrung (€6.000–€14.000) und Genehmigung bei ${city.bundesland}.`,
    `Sole-WP ${city.name} (${city.bundesland}): KfW-Bonus +5% immer aktiv (auch ohne Propan). Nach ${foerd.gesamtSatz + 5}% KfW = ${fmtEuro(Math.round(foerd.zuschuss * 1.12))} Zuschuss. Gesamtkosten ${fmtEuro(gesamtMin)}–${fmtEuro(gesamtMax)}, höher als Luft-WP aber niedrigste Betriebskosten.`,
    `Erdwärme ${city.name}: Grundwassergutachten und Bergamt-Genehmigung erforderlich (4–12 Wochen). Bei ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und JAZ ${jazSole} spart die Sole-WP ${fmtEuro(Math.round((Number(jazSole) - jaz) / jaz * calc.wpKosten))}/Jahr mehr als Luft-WP.`,
    `Erdwärmepumpe ${city.name}: Tiefenbohrung 100–150m, konstante Quelltemperatur 10–12°C, JAZ ${jazSole}, kein Schall, +5% KfW immer. Mehrinvestition vs. Luft-WP: €8.000–€15.000. Amortisiert sich durch niedrigere Betriebskosten in ${Math.round(10000 / (calc.wpKosten - kostenSole))} Jahren.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          src={ className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1910]/90 via-[#0A1910]/70 to-[#0A1910]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          <div className="inline-block bg-[#1A4731] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            KfW +5% Bonus — immer aktiv bei Sole-WP
          </div>
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
              { val: `JAZ ${jazSole}`, label: 'Sole-WP Effizienz', sub: '10–12°C konstant' },
              { val: fmtEuro(kostenSole)+'/J.', label: 'Betriebskosten', sub: city.name },
              { val: fmtEuro(gesamtMin)+'+', label: 'Gesamtkosten', sub: 'Vor KfW' },
              { val: '+5%', label: 'KfW-Bonus', sub: 'Immer bei Sole-WP' },
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
              {fillTemplate('Lohnt sich eine Erdwärmepumpe in {stadt}?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Eine Erdwärmepumpe (Sole-WP) in <strong>{city.name}</strong> erreicht JAZ {jazSole} — die konstante Erdtemperatur von 10–12°C macht sie unabhängig von Außentemperaturspitzen. Betriebskosten: {fmtEuro(kostenSole)}/Jahr vs. {fmtEuro(calc.wpKosten)}/Jahr Luft-WP. Nachteile: Tiefenbohrung (€6.000–€14.000) und Genehmigung in {city.bundesland}. KfW: +5% Effizienzbonus immer aktiv.
            </p>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Tiefenbohrung oder Flächenkollektor — was passt wirklich für Ihr Haus in {city.name}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#F8F9FA] border-b border-gray-200">
                  {['Kriterium','Tiefenbohrung','Flächenkollektor','Vorteil'].map(h=>(
                    <th key={h} className="px-3 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {BOHRUNG_VS_KOLLEKTOR.map((r,i)=>(
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-3 py-3 font-semibold text-[#1C2B2B] text-sm">{r.kriterium}</td>
                      <td className={`px-3 py-3 text-sm ${r.besser==='Bohrung'?'text-[#1A4731] font-bold':'text-[#4A6358]'}`}>{r.bohrung}</td>
                      <td className={`px-3 py-3 text-sm ${r.besser==='Kollektor'?'text-[#1A4731] font-bold':'text-[#4A6358]'}`}>{r.kollektor}</td>
                      <td className="px-3 py-3 text-xs text-[#7A9E8E]">{r.besser}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">
              Welche Genehmigungen brauche ich für Erdwärme in {city.bundesland}
            ?</h2>
            <div className="space-y-3">
              {GENEHMIGUNG.map((g,i)=>(
                <div key={i} className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="w-6 h-6 bg-[#1A4731] rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">{i+1}</div>
                  <div>
                    <div className="font-bold font-bold text-[#1C2B2B] text-sm mb-1">{g.step}</div>
                    <p className="text-[#4A6358] text-xs leading-relaxed">{g.beschreibung}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Was kostet eine Erdwärmepumpe komplett? {city.name}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#F8F9FA] border-b border-gray-200">
                  {['Position','Kosten von','Kosten bis','Hinweis'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {KOSTEN_ERDWAERME.map((k,i)=>(
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{k.pos}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(k.von)}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(k.bis)}</td>
                      <td className="px-4 py-3 text-xs text-[#7A9E8E]">{k.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#F2FAF5] border-t-2 border-gray-200l">
                    <td className="px-4 py-3 font-bold text-[#1C2B2B]">Gesamt</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(gesamtMin)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(gesamtMax)}</td>
                    <td className="px-4 py-3 text-xs text-[#7A9E8E]">Vor KfW-Förderung</td>
                  </tr>
                </tbody>
              </table>
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
          <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Erdwärme-Kennzahlen</div>
          {[['JAZ Sole-WP',jazSole],['JAZ Luft-WP',String(jaz)],['Betriebskosten',fmtEuro(kostenSole)+'/J.'],
            ['KfW-Bonus','+5% immer'],['Gesamtkosten',fmtEuro(gesamtMin)+'–'+fmtEuro(gesamtMax)],
            ['Genehmigung',city.bundesland+': nötig'],
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
        <div className="mt-6 text-xs text-[#7A9E8E]">Fraunhofer ISE · LIAG Geothermie-Atlas · KfW BEG 458 · Stand März 2026</div>
      </div>
    </div>
  );
}
