// components/programmatic/templates/NeubauTemplate.tsx
// waermepumpe-neubau — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1920&q=80';

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
  ];, note: `WP erfüllt das in ${city.name} immer — JAZ ${jaz} → weit über 65% EE-Anteil` },
    { req: 'GEG §71 Neubau', note: 'Seit 2024 gilt 65%-EE-Pflicht für alle neuen Heizungen' },
    { req: 'QP-Grenzwert', note: `Wärmepumpe senkt Primärenergiebedarf in ${city.name} deutlich unter GEG-Grenzwert` },
    { req: 'Lüftungsanlage bei guter Dämmung', note: 'Ab Luftdichtigkeit n50 < 0,6 empfohlen' },
    { req: 'Anlagenbuch & Protokolle', note: 'F-Gas, Hydraulik, Inbetriebnahme für Bauabnahme' },
  ];
  const NEUBAU_PLANUNG = [
    { phase: 'Bauplanung (vor Baugenehmigung)', items: [`WP-Typ und Leistung in Haustechnikplanung für ${city.name}`, 'Fußbodenheizung mit Verteiler einplanen', 'Außeneinheit-Position und Schallabstand festlegen'] },
    { phase: 'KfW-Antrag (vor Baubeginn!)', items: [`BEG WG Programm 297 für Neubau — bis ${foerd.gesamtSatz}% in ${city.name}`, 'Antrag zwingend vor Baubeginn stellen', 'Fachunternehmen muss KfW-LuL-registriert sein'] },
    { phase: 'Einbau (Rohbauphase)', items: ['Fußbodenheizung + Verteilsystem parallel zur Betondecke', 'Kältemittelleitungen vorinstallieren', 'Starkstromkreis 3×16A vorbereiten'] },
    { phase: `WP-Montage (Ausbauphase)`, items: [`Außeneinheit aufstellen in ${city.name} — Schallabstand prüfen`, 'Inneneinheit / Pufferspeicher installieren', 'Inbetriebnahme + KfW-Protokoll'] },
  ];, was: `WP-Typ und Leistung in Haustechnikplanung — in ${city.name} empfehlen wir Luft-WP mit FBH` },
    { phase: 'KfW-Antrag (vor Baubeginn!)', was: `BEG WG Programm 297 für Neubau — in ${city.name} bis ${foerd.gesamtSatz}% gefördert` },
    { phase: 'Einbau (Rohbauphase)', was: 'Fußbodenheizung + Verteilsystem — parallel zur Betondecke' },
    { phase: 'WP-Montage (Ausbau)', was: `Außeneinheit aufstellen in ${city.name} — Schallabstand prüfen` },
  ];
  const VERGLEICH_HEIZUNG = [
    { typ: 'Wärmepumpe (Luft/Sole)', kosten: fmtEuro(18000)+'–'+fmtEuro(28000), kfw: `${foerd.gesamtSatz}%`, betrieb: fmtEuro(calc.wpKosten)+'/J.', langfrist: 'Zukunftssicher' },
    { typ: 'Gas-WP-Hybrid', kosten: fmtEuro(8000)+'–'+fmtEuro(15000), kfw: '30%', betrieb: fmtEuro(Math.round(calc.wpKosten*1.3))+'/J.', langfrist: 'CO₂-Risiko' },
    { typ: 'Pellets', kosten: fmtEuro(15000)+'–'+fmtEuro(25000), kfw: '45%', betrieb: fmtEuro(Math.round(calc.wpKosten*1.35))+'/J.', langfrist: 'Lagerung nötig' },
    { typ: 'Reine Gasheizung', kosten: fmtEuro(5000)+'–'+fmtEuro(10000), kfw: '0%', betrieb: fmtEuro(calc.wpKosten+calc.ersparnis)+'/J.', langfrist: `Nicht empfohlen in ${city.name}` },
    { typ: 'Fernwärme', kosten: fmtEuro(3000)+'–'+fmtEuro(8000), kfw: '30%', betrieb: `Variabel — ${city.fernwaermeQuote}% in ${city.name}`, langfrist: `Nur wenn Netz in ${city.name}` },
  ];, geg: '✅ Ja', kfw: `${foerd.gesamtSatz}%`, betrieb: fmtEuro(calc.wpKosten)+'/J.', future: 'Zukunftssicher' },
    { typ: 'Gas-WP-Hybrid', geg: '✅ Bedingt', kfw: '30%', betrieb: fmtEuro(Math.round(calc.wpKosten * 1.3))+'/J.', future: 'CO₂-Risiko' },
    { typ: 'Pellets', geg: '✅ Ja', kfw: '45%', betrieb: `ca. ${fmtEuro(Math.round(calc.wpKosten * 1.35))}/J.`, future: 'Lagerung nötig' },
    { typ: 'Reine Gasheizung', geg: '❌ Nein', kfw: '0%', betrieb: fmtEuro(calc.wpKosten + calc.ersparnis)+'/J.', future: `Nicht empfohlen in ${city.name}` },
    { typ: 'Fernwärme', geg: '✅ Bedingt', kfw: '30%', betrieb: `Variabel — ${city.fernwaermeQuote}% in ${city.name}`, future: `Nur wenn Netz in ${city.name}` },
  ];
  const jazNeubau = Math.min(jaz + 0.5, 4.8).toFixed(1);

  const intros = [
    `Neubau in ${city.name} (${city.bundesland}): Seit 01.01.2024 muss jede neue Heizung 65% erneuerbare Energie nutzen. Mit Fußbodenheizung (Vorlauf 30–40°C) erreicht eine WP in ${city.name} JAZ ${jazNeubau}. Betriebskosten: ${fmtEuro(Math.round(calc.wpKosten * 0.75))}/Jahr — ${fmtEuro(Math.round(calc.ersparnis * 1.2))}/Jahr besser als Gas.`,
    `Neubau ${city.name}: Mit ${city.avgSunHours} Sonnenstunden/Jahr lohnt PV+WP. Eine 8-kWp-PV-Anlage deckt bis zu ${Math.round(Math.min(city.avgSunHours * 8 * 0.85 * 0.65, 4000))} kWh des WP-Strombedarfs — effektive Wärmekosten unter 2 ct/kWh.`,
    `KfW-Förderung Neubau ${city.name}: Programm 297/298 als Kredit bis €150.000 für Effizienzhaus 40. Im Neubau gilt ${city.bundeslandFoerderung ? `in ${city.bundesland} zusätzlich: ${city.bundeslandFoerderung}` : `die KfW-Bundesförderung`}. WP + Effizienzhaus 40 = beste Kombination.`,
    `Neubau ${city.name} 2026: ${city.normAussentemp}°C Normaußentemperatur, ${city.avgTemp}°C Jahresmittel, ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtage. Fußbodenheizung + WP → JAZ ${jazNeubau}. Betriebskosten: ${fmtEuro(Math.round(calc.wpKosten * 0.75))}/Jahr.`,
  ];


  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/90 via-wp-dark/70 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white transition-colors">{keyword.keyword.replace(' [Stadt]','')}</Link>
            <span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          <div className="inline-block bg-wp-green text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            GEG-Pflicht: 65% EE seit 01.01.2024
          </div>
          <h1 className="font-heading font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: `JAZ ${jazNeubau}`, label: 'Mit Fußbodenheizung', sub: city.name },
              { val: `${fmtEuro(Math.round(calc.wpKosten * 0.75))}/J.`, label: 'WP-Betriebskosten', sub: 'Neubau-optimiert' },
              { val: city.avgSunHours + ' h/J.', label: 'Sonnenstunden', sub: 'PV+WP ideal' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/30 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Kostenloses Angebot →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Welche Wärmepumpe für den Neubau in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Im Neubau in <strong>{city.name}</strong> ist die Luft-Wasser-Wärmepumpe mit Fußbodenheizung die Standardlösung: JAZ {jazNeubau} bei {city.avgTemp}°C Jahresmittel, Betriebskosten {fmtEuro(Math.round(calc.wpKosten * 0.75))}/Jahr. Seit 01.01.2024 ist 65% erneuerbare Energie gesetzlich Pflicht — eine WP erfüllt das automatisch. Mit KfW-297/298 (Effizienzhaus 40) sind zinsgünstige Kredite bis €150.000 möglich.
            </p>
          </div>

          {/* GEG-Anforderungen */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              GEG-Anforderungen im Neubau {city.name} — was gilt
            </h2>
            <div className="space-y-3">
              {GEG_ANFORDERUNGEN.map((a, i) => (
                <div key={i} className={`p-4 rounded-xl border ${a.nr === 'i' ? 'bg-wp-amberlt border-amber-200' : 'bg-white border-wp-border'}`}>
                  <div className="font-heading font-bold text-wp-text text-sm mb-1">{a.titel}</div>
                  <p className="text-wp-text2 text-sm leading-relaxed">{a.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Heizungsvergleich Neubau */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Heizungsvergleich Neubau {city.name} 2026
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-x-auto shadow-wp-sm">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    {['Heizung', 'Kosten', 'KfW-Förderung', 'Betrieb', 'Langfrist'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VERGLEICH_HEIZUNG.map((r, i) => (
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${i === 0 ? 'bg-wp-greenxlt' : ''}`}>
                      <td className="px-3 py-3 font-semibold text-wp-text">{r.typ}</td>
                      <td className="px-3 py-3 font-mono text-xs text-wp-text2">{r.kosten}</td>
                      <td className="px-3 py-3 text-xs">{r.kfw}</td>
                      <td className="px-3 py-3 text-xs text-wp-text2">{r.betrieb}</td>
                      <td className={`px-3 py-3 text-xs font-semibold ${i === 0 ? 'text-wp-green' : 'text-wp-text3'}`}>{r.langfrist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Planungs-Checkliste */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Planungs-Checkliste WP-Neubau {city.name}
            </h2>
            <div className="space-y-4">
              {NEUBAU_PLANUNG.map((p, i) => (
                <div key={i} className="bg-white border border-wp-border rounded-xl p-5">
                  <div className="font-heading font-bold text-wp-text text-base mb-3">{p.phase}</div>
                  <ul className="space-y-2">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex gap-2 text-sm text-wp-text2">
                        <CheckCircle size={15} className="text-wp-green shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Stadtdaten */}
          <div className="p-6 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">{h2s.klimadaten}</h2>
            <p className="text-wp-text2 text-base leading-relaxed mb-4">{si.klimadaten}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                [`${city.avgTemp}°C`, 'Jahresmittel'],
                [`${city.normAussentemp}°C`, 'Normaußentemperatur'],
                [String(jazNeubau), 'JAZ mit FBH'],
                [city.heizgradtage.toLocaleString('de-DE') + ' Kd/a', 'Heizgradtage'],
                [city.avgSunHours + ' h/J.', 'Sonnenstunden PV'],
                [fmtEuro(Math.round(calc.wpKosten * 0.75)) + '/J.', 'WP-Betriebskosten'],
              ].map(([v, l], i) => (
                <div key={i}><div className="text-wp-text3 text-xs">{l}</div><div className="font-bold text-wp-text">{v}</div></div>
              ))}
            </div>
          </div>

          {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="p-5 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
              <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          {/* FAQ */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-wp-border rounded-2xl overflow-hidden bg-white shadow-wp-sm mb-10">
              {faqs.map((faq, i) => (
                <details key={i} className="group border-b border-wp-border last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-wp-bg/50 transition-colors">
                    <span className="font-heading font-semibold text-wp-text text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-wp-text3 shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-wp-border">
                    <p className="px-5 py-4 text-wp-text2 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">{n.name}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {(keyword.crossLinks ?? []).map((slug: string) => (
                  <Link key={slug} href={`/${slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ').replace('foerderung','Förderung')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-wp-border rounded-2xl p-5 shadow-wp-sm sticky top-6">
            <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Neubau-Kennzahlen</div>
            {[
              ['JAZ mit Fußbodenheizung', jazNeubau],
              ['Betriebskosten/Jahr', fmtEuro(Math.round(calc.wpKosten * 0.75))],
              ['Sonnenstunden/Jahr', city.avgSunHours + ' h'],
              ['Normtemp.', city.normAussentemp + '°C'],
              ['Jahresmittel', city.avgTemp + '°C'],
              ['Heizgradtage', city.heizgradtage.toLocaleString('de-DE')],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-wp-border last:border-0 text-sm">
                <span className="text-wp-text2">{l}</span>
                <span className="font-bold text-wp-text">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-wp-green text-white font-bold py-3 rounded-xl hover:bg-wp-green2 transition-colors text-sm">Kostenloses Angebot →</a>
          </div>
        </div>
      </div>

      <div id="angebot" className="bg-wp-dark py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Bis zu 3 Angebote für {city.name} — in 2 Minuten</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">GEG: BMWSB 2024 · KfW 297/298 · DWD Klimadaten · Stand März 2026</div>
      </div>
    </div>
  );
}
