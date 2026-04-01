// components/programmatic/templates/ErdwaermeTemplate.tsx
// erdwaermepumpe — vollständig standalone
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1920&q=80';

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
  ];, bohrung: 'Ab 100 m² — 1 Bohrung ca. 2 m²', kollektor: `Mind. ${Math.round(calc.wpKosten / 10 * 8)} m² Grundstück (10-fache Heizfläche)` },
    { kriterium: 'Investitionskosten', bohrung: '€6.000–€15.000 (Bohrung)', kollektor: '€3.000–€8.000 (Aushub)' },
    { kriterium: 'JAZ in ' + city.name, bohrung: `${(jaz + 0.8).toFixed(1)}–${(jaz + 1.2).toFixed(1)}`, kollektor: `${(jaz + 0.5).toFixed(1)}–${(jaz + 0.9).toFixed(1)}` },
    { kriterium: 'Genehmigung ' + city.bundesland, bohrung: `Wasserrechtliche Genehmigung in ${city.bundesland} — Tiefbohrunternehmen beantragt`, kollektor: 'Meist genehmigungsfrei' },
    { kriterium: 'KfW-Bonus', bohrung: '+5% (Erdwärme)', kollektor: '+5% (Erdwärme)' },
    { kriterium: 'Betrieb', bohrung: 'Wartungsarm, konstante Effizienz', kollektor: 'Witterungsabhängige Effizienz im Winter' },
  ];
  const GENEHMIGUNG = [
    { step: 'Hydrogeologisches Gutachten', beschreibung: `In ${city.bundesland} vor jeder Tiefenbohrung Pflicht — Dauer 2–4 Wochen` },
    { step: 'Wasserrechtliche Genehmigung', beschreibung: `Untere Wasserbehörde ${city.bundesland} — typisch 4–8 Wochen` },
    { step: 'Bohrprotokoll', beschreibung: `Für KfW-Nachweis und Behörde in ${city.bundesland} erforderlich` },
    { step: 'Grundstücksgrenzen prüfen', beschreibung: `Abstand zur Grenze in ${city.bundesland}: meist mind. 3 m` },
    { step: 'Denkmalschutz prüfen', beschreibung: `In Altstadtlagen von ${city.name} relevant` },
  ];, pflicht: true, detail: `In ${city.bundesland} vor jeder Tiefenbohrung — Dauer 2–4 Wochen` },
    { schritt: 'Wasserrechtliche Genehmigung', pflicht: true, detail: `Untere Wasserbehörde ${city.bundesland} — typisch 4–8 Wochen` },
    { schritt: 'Bohrprotokoll', pflicht: true, detail: `Für KfW-Nachweis und Behörde in ${city.bundesland} erforderlich` },
    { schritt: 'Grundstücksgrenzen prüfen', pflicht: true, detail: `Abstand zur Grenze in ${city.bundesland}: meist mind. 3 m` },
    { schritt: 'Denkmalschutz prüfen', pflicht: false, detail: `In Altstadtlagen von ${city.name} relevant` },
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


  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/90 via-wp-dark/70 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          <div className="inline-block bg-wp-green text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            KfW +5% Bonus — immer aktiv bei Sole-WP
          </div>
          <h1 className="font-heading font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: `JAZ ${jazSole}`, label: 'Sole-WP Effizienz', sub: '10–12°C konstant' },
              { val: fmtEuro(kostenSole)+'/J.', label: 'Betriebskosten', sub: city.name },
              { val: fmtEuro(gesamtMin)+'+', label: 'Gesamtkosten', sub: 'Vor KfW' },
              { val: '+5%', label: 'KfW-Bonus', sub: 'Immer bei Sole-WP' },
            ].map((s,i) => (
              <div key={i}><div className="text-xl font-extrabold text-white">{s.val}</div>
              <div className="text-white/50 text-xs">{s.label}</div><div className="text-white/30 text-xs">{s.sub}</div></div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Eignung prüfen — kostenlos →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Lohnt sich eine Erdwärmepumpe in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Eine Erdwärmepumpe (Sole-WP) in <strong>{city.name}</strong> erreicht JAZ {jazSole} — die konstante Erdtemperatur von 10–12°C macht sie unabhängig von Außentemperaturspitzen. Betriebskosten: {fmtEuro(kostenSole)}/Jahr vs. {fmtEuro(calc.wpKosten)}/Jahr Luft-WP. Nachteile: Tiefenbohrung (€6.000–€14.000) und Genehmigung in {city.bundesland}. KfW: +5% Effizienzbonus immer aktiv.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Tiefenbohrung vs. Flächenkollektor in {city.name}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Kriterium','Tiefenbohrung','Flächenkollektor','Vorteil'].map(h=>(
                    <th key={h} className="px-3 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {BOHRUNG_VS_KOLLEKTOR.map((r,i)=>(
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-3 py-3 font-semibold text-wp-text text-sm">{r.kriterium}</td>
                      <td className={`px-3 py-3 text-sm ${r.besser==='Bohrung'?'text-wp-green font-bold':'text-wp-text2'}`}>{r.bohrung}</td>
                      <td className={`px-3 py-3 text-sm ${r.besser==='Kollektor'?'text-wp-green font-bold':'text-wp-text2'}`}>{r.kollektor}</td>
                      <td className="px-3 py-3 text-xs text-wp-text3">{r.besser}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Genehmigungen für Erdwärme in {city.bundesland}
            </h2>
            <div className="space-y-3">
              {GENEHMIGUNG.map((g,i)=>(
                <div key={i} className="flex gap-3 p-4 bg-white border border-wp-border rounded-xl">
                  <div className="w-6 h-6 bg-wp-green rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">{i+1}</div>
                  <div>
                    <div className="font-heading font-bold text-wp-text text-sm mb-1">{g.step}</div>
                    <p className="text-wp-text2 text-xs leading-relaxed">{g.beschreibung}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Kostenübersicht Erdwärmepumpe {city.name}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Position','Kosten von','Kosten bis','Hinweis'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {KOSTEN_ERDWAERME.map((k,i)=>(
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{k.pos}</td>
                      <td className="px-4 py-3 font-mono text-wp-text2">{fmtEuro(k.von)}</td>
                      <td className="px-4 py-3 font-mono text-wp-text2">{fmtEuro(k.bis)}</td>
                      <td className="px-4 py-3 text-xs text-wp-text3">{k.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-wp-greenxlt border-t-2 border-wp-borderl">
                    <td className="px-4 py-3 font-bold text-wp-text">Gesamt</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-green">{fmtEuro(gesamtMin)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-green">{fmtEuro(gesamtMax)}</td>
                    <td className="px-4 py-3 text-xs text-wp-text3">Vor KfW-Förderung</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {faqs.length > 0 && (
            <div className="p-5 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
              <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-wp-border rounded-2xl overflow-hidden bg-white shadow-wp-sm mb-10">
              {faqs.map((faq,i)=>(
                <details key={i} className="group border-b border-wp-border last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-wp-bg/50 transition-colors">
                    <span className="font-heading font-semibold text-wp-text text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-wp-text3 shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-wp-border"><p className="px-5 py-4 text-wp-text2 text-sm leading-relaxed">{faq.a}</p></div>
                </details>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div><h3 className="font-heading font-semibold text-wp-text text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">{nearby.map(n=>(
                <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`} className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">{n.name}</Link>
              ))}</div>
            </div>
            <div><h3 className="font-heading font-semibold text-wp-text text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">{(keyword.crossLinks??[]).map((slug:string)=>(
                <Link key={slug} href={`/${slug}/${city.slug}`} className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                  {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                </Link>
              ))}</div>
            </div>
          </div>
        </div>

        <div><div className="bg-white border border-wp-border rounded-2xl p-5 shadow-wp-sm sticky top-6">
          <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Erdwärme-Kennzahlen</div>
          {[['JAZ Sole-WP',jazSole],['JAZ Luft-WP',String(jaz)],['Betriebskosten',fmtEuro(kostenSole)+'/J.'],
            ['KfW-Bonus','+5% immer'],['Gesamtkosten',fmtEuro(gesamtMin)+'–'+fmtEuro(gesamtMax)],
            ['Genehmigung',city.bundesland+': nötig'],
          ].map(([l,v],i)=>(
            <div key={i} className="flex justify-between py-2 border-b border-wp-border last:border-0 text-sm">
              <span className="text-wp-text2">{l}</span><span className="font-bold text-wp-text">{v}</span>
            </div>
          ))}
          <a href="#angebot" className="block mt-4 text-center bg-wp-green text-white font-bold py-3 rounded-xl hover:bg-wp-green2 transition-colors text-sm">Kostenloses Angebot →</a>
        </div></div>
      </div>

      <div id="angebot" className="bg-wp-dark py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Bis zu 3 Angebote für {city.name} — in 2 Minuten</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">Fraunhofer ISE · LIAG Geothermie-Atlas · KfW BEG 458 · Stand März 2026</div>
      </div>
    </div>
  );
}
