// components/programmatic/templates/HeizungTauschenTemplate.tsx
// heizung-tauschen — vollständig standalone
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=75';

/* WANN_PFLICHT moved inside component */

/* TAUSCH_ABLAUF moved inside component */

/* HEIZUNG_VERGLEICH moved inside component */

export default function HeizungTauschenTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);



  const HEIZUNG_VERGLEICH = [
    { typ: 'Wärmepumpe ⭐', kosten: fmtEuro(18000)+'–'+fmtEuro(28000), kfw: `${foerd.gesamtSatz}%`, betrieb: `${fmtEuro(calc.wpKosten)}/J. in ${city.name}`, geg: '✅ Ja', empfehlung: 'Beste Wahl 2026+' },
    { typ: 'Gas-Hybridheizung', kosten: fmtEuro(8000)+'–'+fmtEuro(15000), kfw: '30%', betrieb: `${fmtEuro(Math.round((calc.wpKosten + calc.ersparnis) * 0.7))}/J.`, geg: '⚠️ Eingeschränkt', empfehlung: 'Übergangslösung' },
    { typ: 'Pelletheizung', kosten: fmtEuro(15000)+'–'+fmtEuro(25000), kfw: '45%', betrieb: `ca. ${fmtEuro(Math.round(calc.wpKosten * 1.3))}/J.`, geg: '✅ Ja', empfehlung: `Falls kein Platz für WP in ${city.name}` },
    { typ: 'Fernwärme', kosten: fmtEuro(3000)+'–'+fmtEuro(8000), kfw: '30%', betrieb: `Variabel — ${city.fernwaermeQuote}% in ${city.name}`, geg: '✅ Bedingt', empfehlung: `Nur wenn Netz in ${city.name}` },
    { typ: 'Neue Gasheizung', kosten: fmtEuro(5000)+'–'+fmtEuro(10000), kfw: '0%', betrieb: `${fmtEuro(calc.wpKosten + calc.ersparnis)}/J.`, geg: '❌ Nein', empfehlung: 'Nicht empfohlen 2026+' },
  ];

  const WANN_PFLICHT = [
    { trigger: 'Gasheizung > 30 Jahre alt', pflicht: true, detail: `GEG §72: Konstanttemperatur-Heizkessel vor 1994 müssen ausgetauscht werden — gilt auch in ${city.name}.` },
    { trigger: 'Heizung defekt — Notfall', pflicht: true, detail: `Notfallregelung: Gasheizung darf max. 3 Jahre nach GEG-Frist weiter betrieben werden. Frist in ${city.name}: ${city.gegFrist.split('-').reverse().join('.')}.` },
    { trigger: 'Gebäudeverkauf (ab 2025)', pflicht: true, detail: `Bei Eigentümerwechsel in ${city.name}: Neuer Eigentümer hat 2 Jahre Zeit zur GEG-konformen Umrüstung auf 65%-EE.` },
    { trigger: 'GEG-Frist überschritten', pflicht: true, detail: `In ${city.name} gilt die GEG-Frist ab ${city.gegFrist.split('-').reverse().join('.')} — danach ist der Einbau fossiler Heizungen ohne EE-Anteil nicht mehr zulässig.` },
    { trigger: 'Neuer freiwilliger Tausch', pflicht: false, detail: `Freiwilliger Tausch in ${city.name}: sofort 65%-EE-Pflicht. WP erfüllt das immer. Gasheizung nur noch mit Hybrid-Lösung GEG-konform.` },
  ];

  const TAUSCH_ABLAUF = [
    { step: 'Energieberatung & Heizlast', dauer: '1–2 Wochen', detail: `KfW-Pflicht in ${city.name}: Basis für korrekte WP-Dimensionierung. BAFA-geförderte Beratung (80% der Kosten, Eigenanteil ~€60–140).` },
    { step: 'KfW-Antrag stellen', dauer: 'Vor Auftrag!', detail: `Antrag MUSS vor Auftragserteilung gestellt werden — gilt ohne Ausnahme in ${city.name}. Wir begleiten kostenlos.` },
    { step: 'Installateur-Auswahl', dauer: '1–2 Wochen', detail: `Mind. 3 Angebote vergleichen — in ${city.name} typischerweise 20–40% Preisunterschied. Wir holen die Vergleichsangebote für Sie ein.` },
    { step: 'Installation & Montage', dauer: '2–3 Tage', detail: `Alte Heizung aus, WP ein. Hydraulischer Abgleich und Inbetriebnahme durch F-Gas-zertifizierten Betrieb in ${city.name}.` },
    { step: 'Förderabrechnung', dauer: '4–8 Wochen', detail: `Rechnung + Inbetriebnahmeprotokoll einreichen. KfW zahlt ${fmtEuro(foerd.zuschuss)} direkt auf Ihr Konto.` },
    { step: 'Betrieb & Optimierung', dauer: 'Laufend', detail: `Heizkurve nach dem ersten Winter in ${city.name} optimieren — JAZ ${jaz} ist der Zielwert bei ${city.avgTemp}°C Jahresmittel.` },
    { step: 'WP-Wartung (empfohlen)', dauer: 'Jährlich', detail: `Kältemittelkreislauf, Filter, Drücke — Wartungskosten Ø €200–400/Jahr. Hersteller-Garantie in ${city.bundesland} oft an Wartungsvertrag gebunden.` },
  ];

  const intros = [
    `Heizung tauschen ${city.name}: Seit 2024 gilt die 65%-EE-Pflicht — Gas-Brennwert allein nicht mehr GEG-konform. WP-Eigenanteil nach ${foerd.gesamtSatz}% KfW: ${fmtEuro(foerd.eigenanteil)}. Ersparnis vs. altem Gas: ${fmtEuro(calc.ersparnis)}/Jahr.`,
    `${city.name} (${city.bundesland}): GEG-Frist ${city.gegFrist.split('-').reverse().join('.')}. Jetzt Heizung tauschen sichert volle Förderung (${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)}) + Klima-Speed-Bonus. Amortisation: ${calc.amortisationJahre} Jahre.`,
    `Heizung tauschen ${city.name}: Schritt 1 KfW-Antrag VOR Auftrag, Schritt 2 LuL-Betrieb beauftragen, Schritt 3 hydraulischer Abgleich. Ohne diese Reihenfolge: Förderung weg. Wir begleiten kostenlos.`,
    `Gasheizung tauschen ${city.name}: CO₂-Preis steigt auf €200/t bis 2035 (ETS2) → Gas-Betriebskosten ${fmtEuro(calc.altKosten)}/Jahr steigen auf ${fmtEuro(Math.round(calc.altKosten * 1.45))}/Jahr. WP jetzt: ${fmtEuro(calc.wpKosten)}/Jahr, stabil.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/90 via-wp-dark/70 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          {city.einwohner >= 100000 && (
            <div className="inline-block bg-wp-amber text-wp-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              GEG-Frist {city.name}: {city.gegFrist.split('-').reverse().join('.')}
            </div>
          )}
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
              { val: foerd.gesamtSatz+'%', label: 'KfW-Förderung', sub: 'Eigennutzer' },
              { val: fmtEuro(foerd.zuschuss), label: 'Zuschuss', sub: 'Nicht rückzahlbar' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'Nach Förderung' },
              { val: fmtEuro(calc.ersparnis)+'/J.', label: 'Ersparnis', sub: 'vs. Gas' },
            ].map((s,i) => (
              <div key={i}><div className="text-xl font-extrabold text-white">{s.val}</div>
              <div className="text-white/50 text-xs">{s.label}</div><div className="text-white/30 text-xs">{s.sub}</div></div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Kostenloses Angebot →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Wann muss ich die Heizung in {stadt} tauschen?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              In <strong>{city.name}</strong> gilt seit 01.01.2024: Jede neue Heizung muss 65% erneuerbare Energie nutzen. Gas-Brennwert allein ist damit nicht mehr zulässig. Für Bestandsgebäude in {city.name} greift die Pflicht ab {city.gegFrist.split('-').reverse().join('.')} (kommunale Wärmeplanung). Wer jetzt freiwillig tauscht, sichert vollen KfW-Zuschuss: {foerd.gesamtSatz}% = {fmtEuro(foerd.zuschuss)}.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              {[`Wann ist der Heizungstausch in ${city.name} Pflicht?`,`GEG-Pflicht ${city.name}: Wann müssen Sie handeln?`,`Ab wann gilt die Tauschpflicht für Heizungen in ${city.name}?`,`Heizungstausch ${city.name}: Diese Fristen gelten`][cityHash(city,4,320)]}
            </h2>
            <div className="space-y-3">
              {WANN_PFLICHT.map((w,i)=>(
                <div key={i} className={`flex gap-3 p-4 rounded-xl border ${w.pflicht?'bg-white border-wp-border':'bg-wp-bg border-wp-border opacity-80'}`}>
                  <span className="text-lg shrink-0">{w.pflicht?'⚠️':'ℹ️'}</span>
                  <div>
                    <div className="font-heading font-bold text-wp-text text-sm">{w.trigger}</div>
                    <p className="text-wp-text2 text-xs mt-0.5 leading-relaxed">{w.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Wie läuft der Heizungstausch in {city.name} — 6 Schritte
            ?</h2>
            <div className="space-y-3">
              {TAUSCH_ABLAUF.map((s,i)=>(
                <div key={i} className="flex gap-4 p-4 bg-white border border-wp-border rounded-xl">
                  <div className="w-8 h-8 bg-wp-green rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{i+1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <div className="font-heading font-bold text-wp-text text-sm">{s.step}</div>
                      <span className="text-xs text-wp-text3 shrink-0">{s.dauer}</span>
                    </div>
                    <p className="text-wp-text2 text-xs mt-0.5 leading-relaxed">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Welche Heizung lohnt sich beim Tausch in {city.name}
            ?</h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-x-auto shadow-wp-sm">
              <table className="w-full text-sm min-w-[500px]">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Heizung','Investition','KfW','Betrieb','GEG','Fazit'].map(h=>(
                    <th key={h} className="px-3 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {HEIZUNG_VERGLEICH.map((r,i)=>(
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${i===0?'bg-wp-greenxlt':''}`}>
                      <td className="px-3 py-3 font-semibold text-wp-text text-sm">{r.typ}</td>
                      <td className="px-3 py-3 font-mono text-xs text-wp-text2">{r.kosten}</td>
                      <td className="px-3 py-3 text-xs text-wp-green font-bold">{r.kfw}</td>
                      <td className="px-3 py-3 text-xs text-wp-text2">{r.betrieb}</td>
                      <td className="px-3 py-3 text-sm">{r.geg}</td>
                      <td className={`px-3 py-3 text-xs font-semibold ${i===0?'text-wp-green':'text-wp-text3'}`}>{r.empfehlung}</td>
                    </tr>
                  ))}
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
          <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Tausch-Kennzahlen</div>
          {[['KfW-Zuschuss',fmtEuro(foerd.zuschuss)],['Förderquote',foerd.gesamtSatz+'%'],
            ['Eigenanteil',fmtEuro(foerd.eigenanteil)],['Ersparnis/Jahr',fmtEuro(calc.ersparnis)],
            ['Amortisation',calc.amortisationJahre+' J.'],['GEG-Frist',city.gegFrist.split('-').reverse().join('.')],
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
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  
      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-heading font-bold text-wp-text text-xl mb-6">
          Was sich 2026 geändert hat — und was das für {city.name} bedeutet
        </h2>
        <div className="space-y-4">

          {/* GEG-Reform */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-wp-text text-sm leading-relaxed">{act.gegReform}</p>
          </div>

          {/* Neue Lärmvorschrift */}
          {['luft-wasser-waermepumpe','luftwaermepumpe','waermepumpe','waermepumpe-kosten','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-kaufen','waermepumpe-nachruesten','heizung-tauschen','waermepumpe-altbau'].includes(keyword.slug) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Neue Lärmvorschrift ab 01.01.2026</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.laerm10db}</p>
            </div>
          )}

          {/* Steuerliche Absetzbarkeit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-installateur','waermepumpe-preise','waermepumpe-installation','heizung-tauschen'].includes(keyword.slug) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.steuerAbsetz}</p>
            </div>
          )}

          {/* KfW-Ergänzungskredit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-preise','erdwaermepumpe','waermepumpe-neubau'].includes(keyword.slug) && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergänzungskredit</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.kfwKredit}</p>
            </div>
          )}

          {/* Wartungskosten */}
          {['waermepumpe-kosten','waermepumpe','waermepumpe-preise','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-fachbetrieb','waermepumpe-kaufen'].includes(keyword.slug) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Wartungs- &amp; Langzeitkosten</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.wartungskosten}</p>
            </div>
          )}

          {/* Finanzierung */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-wp-text text-sm leading-relaxed">{act.finanzierung}</p>
          </div>

        </div>
      </div>
      <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">GEG BMWSB 2024 · KfW BEG 458 · BDEW 2026 · Stand März 2026</div>
      </div>
    </div>
  );
}
