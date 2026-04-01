// components/programmatic/templates/PreiseTemplate.tsx
// waermepumpe-preise — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=75';

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


  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/90 via-wp-dark/70 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          <h1 className="font-heading font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
              {/* Preis-Badge — Eigenanteil nach KfW-Förderung */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-wp-amber/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
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
              <div className="text-white/50 text-xs">{s.label}</div><div className="text-white/30 text-xs">{s.sub}</div></div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Preise vergleichen — kostenlos →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Was kostet eine Wärmepumpe in {stadt}? — Preisübersicht 2026', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Eine Luft-Wasser-WP in <strong>{city.name}</strong> kostet inklusive Montage und Nebenkosten €12.000–€28.000. Nach {foerd.gesamtSatz}% KfW-Förderung ({fmtEuro(foerd.zuschuss)}) verbleibt ein Eigenanteil von {fmtEuro(foerd.eigenanteil)}. Sole-WP (Erdwärme) kostet €22.000–€38.000, hat aber höhere Effizienz (JAZ {(jaz + 1.0).toFixed(1)}) und immer +5% KfW-Bonus.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              {[
                `Preisvergleich nach WP-Typ in ${city.name} — inkl. Montage 2026`,
                `Was kosten die drei WP-Typen in ${city.name}? Vollständiger Vergleich`,
                `WP-Kosten ${city.name}: Gerätepreis + Montage + Nebenkosten`,
                `Luft-, Sole- und Wasser-WP in ${city.name}: Preisübersicht 2026`,
              ][cityHash(city, 4, 110)]}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-x-auto shadow-wp-sm">
              <table className="w-full text-sm min-w-[500px]">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['WP-Typ','Gerät','Montage','Gesamt','KfW','Hinweis'].map(h=>(
                    <th key={h} className="px-3 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {WP_TYPEN_PREISE.map((r,i)=>(
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${i===0?'bg-wp-greenxlt':''}`}>
                      <td className="px-3 py-3 font-semibold text-wp-text text-sm">{r.typ}</td>
                      <td className="px-3 py-3 font-mono text-xs text-wp-text2">{r.gerät}</td>
                      <td className="px-3 py-3 font-mono text-xs text-wp-text2">{r.montage}</td>
                      <td className="px-3 py-3 font-mono font-bold text-wp-green text-sm">{r.gesamt}</td>
                      <td className="px-3 py-3 text-sm">{r.kfw?'✅':''}</td>
                      <td className="px-3 py-3 text-xs text-wp-text3">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-wp-text3 mt-2">Marktpreise {city.name} 2026 — Endpreis nach KfW: {fmtEuro(eigenanteilMin)}–{fmtEuro(eigenanteilMax)}</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              {[
                `5 Faktoren, die den WP-Preis in ${city.name} beeinflussen`,
                `Was bestimmt den Endpreis Ihrer Wärmepumpe in ${city.name}?`,
                `Warum unterscheiden sich WP-Angebote in ${city.name} so stark?`,
                `Diese 5 Punkte treiben die WP-Kosten in ${city.name}`,
              ][cityHash(city, 4, 111)]}
            </h2>
            <div className="space-y-3">
              {PREIS_FAKTOREN.map((f,i)=>(
                <div key={i} className="flex gap-3 p-4 bg-white border border-wp-border rounded-xl">
                  <div className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold h-fit mt-0.5 ${f.einfluss==='Hoch'?'bg-red-100 text-red-700':f.einfluss==='Mittel'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'}`}>{f.einfluss}</div>
                  <div><div className="font-heading font-bold text-wp-text text-sm mb-1">{f.faktor}</div>
                  <p className="text-wp-text2 text-xs leading-relaxed">{f.detail}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              {[
                `Versteckte Kosten — was viele Angebote weglassen`,
                `Was fehlt oft im WP-Angebot? Unterschätzte Posten im Überblick`,
                `Nebenkosten bei der WP-Installation: Diese Positionen fehlen häufig`,
                `Worauf beim WP-Angebot achten? Versteckte Positionen`,
              ][cityHash(city, 4, 112)]}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Position','Kosten','Hinweis'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {VERSTECKTE_KOSTEN.map((r,i)=>(
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{r.pos}</td>
                      <td className="px-4 py-3 font-mono text-wp-amber font-bold text-sm">{r.kosten}</td>
                      <td className="px-4 py-3 text-xs text-wp-text2">{r.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-wp-amberlt">
                    <td className="px-4 py-3 font-bold text-wp-text">Mögliche Zusatzkosten gesamt</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-amber">€2.650–7.100</td>
                    <td className="px-4 py-3 text-xs text-wp-text3">Nicht im Hauptangebot enthalten</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">{h2s.kosten}</h2>
            <p className="text-wp-text2 text-base leading-relaxed mb-4">{si.kosten}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                ['€12.000–€28.000','Luft-WP gesamt'],
                [fmtEuro(foerd.zuschuss),'KfW-Zuschuss (' + foerd.gesamtSatz + '%)'],
                [fmtEuro(foerd.eigenanteil),'Eigenanteil'],
                [fmtEuro(calc.wpKosten)+'/J.','Betriebskosten'],
                [fmtEuro(calc.ersparnis)+'/J.','Ersparnis vs. Gas'],
                [calc.amortisationJahre + ' J.','Amortisation'],
              ].map(([v,l],i)=>(
                <div key={i}><div className="text-wp-text3 text-xs">{l}</div><div className="font-bold text-wp-text">{v}</div></div>
              ))}
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
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">{nearby.map(n=>(
                <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`} className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">{n.name}</Link>
              ))}</div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">{(keyword.crossLinks??[]).map((slug:string)=>(
                <Link key={slug} href={`/${slug}/${city.slug}`} className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                  {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                </Link>
              ))}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-wp-border rounded-2xl p-5 shadow-wp-sm sticky top-6">
            <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Preisübersicht</div>
            {[
              ['Luft-WP gesamt','€12k–€28k'],['Sole-WP gesamt','€22k–€38k'],
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Förderquote', foerd.gesamtSatz+'%'],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
              ['Amortisation', calc.amortisationJahre+' J.'],
              ['Versteckte Kosten','€2.650–€7.100'],
            ].map(([l,v],i)=>(
              <div key={i} className="flex justify-between py-2 border-b border-wp-border last:border-0 text-sm">
                <span className="text-wp-text2">{l}</span><span className="font-bold text-wp-text">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-wp-green text-white font-bold py-3 rounded-xl hover:bg-wp-green2 transition-colors text-sm">Kostenloses Angebot →</a>
          </div>
        </div>
      </div>

      <div id="angebot" className="bg-wp-dark py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">BWP Preismonitor 2026 · KfW BEG 458 · BDEW Energiepreise · Stand März 2026</div>
      </div>
    </div>
  );
}
