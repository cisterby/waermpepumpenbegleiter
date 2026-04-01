// components/programmatic/templates/NachruestenTemplate.tsx
// waermepumpe-nachruesten — vollständig standalone
// Fokus: Nachrüstung in bestehende Heizanlage — Anpassungen, Kosten, Ablauf, Eignung
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=75';

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
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: '70–80%', label: 'Häuser geeignet', sub: 'Quelle: BWP 2024' },
              { val: fmtEuro(foerd.zuschuss), label: 'KfW-Zuschuss', sub: foerd.gesamtSatz+'%' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'Nach Förderung' },
              { val: fmtEuro(calc.ersparnis)+'/J.', label: 'Ersparnis', sub: 'vs. Gasheizung' },
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
              {fillTemplate('Kann ich in {stadt} eine WP nachrüsten? — Eignungscheck', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              70–80% aller Bestandsgebäude in <strong>{city.name}</strong> sind für die WP-Nachrüstung geeignet. Das entscheidende Kriterium ist nicht das Baujahr sondern die Vorlauftemperatur. Moderne Hochtemperatur-WP arbeiten bis 70°C — damit passen sie in fast jeden Altbau. Bei {city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen in {city.name} ergibt sich JAZ {jaz} → Betriebskosten {fmtEuro(calc.wpKosten)}/Jahr.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Eignungscheck Nachrüstung in {city.name} — 7 Kriterien
            </h2>
            <div className="space-y-2">
              {EIGNUNG_NACHRUESTEN.map((e,i)=>(
                <div key={i} className="flex gap-3 p-3 bg-white border border-wp-border rounded-lg">
                  {e.geeignet ? <CheckCircle size={16} className="text-wp-green shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />}
                  <div>
                    <div className="font-semibold text-wp-text text-sm">{e.punkt}</div>
                    <div className="text-wp-text2 text-xs mt-0.5">{e.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Anpassungskosten bei der Nachrüstung in {city.name}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Anpassung','Kosten von','Kosten bis','Wann nötig'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {ANPASSUNGEN_KOSTEN.map((a,i)=>(
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{a.pos}</td>
                      <td className="px-4 py-3 font-mono text-wp-text2">{fmtEuro(a.von)}</td>
                      <td className="px-4 py-3 font-mono text-wp-text2">{fmtEuro(a.bis)}</td>
                      <td className="px-4 py-3 text-xs text-wp-text3">{a.wann}</td>
                    </tr>
                  ))}
                  <tr className="bg-wp-amberlt border-t-2 border-amber-200">
                    <td className="px-4 py-3 font-bold text-wp-text">Typische Anpassungskosten</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-amber">{fmtEuro(anpassungMin)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-amber">{fmtEuro(anpassungMax)}</td>
                    <td className="px-4 py-3 text-xs text-wp-text3">KfW-förderfähig</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Ablauf: WP nachrüsten in {city.name} — 5 Schritte
            </h2>
            <div className="space-y-3">
              {ABLAUF_NACHRUESTEN.map((s,i)=>(
                <div key={i} className="flex gap-4 p-4 bg-white border border-wp-border rounded-xl">
                  <div className="w-8 h-8 bg-wp-green rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{i+1}</div>
                  <div>
                    <div className="font-heading font-bold text-wp-text text-sm mb-1">{s.step}</div>
                    <p className="text-wp-text2 text-xs leading-relaxed">{s.what}</p>
                  </div>
                </div>
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
          <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Nachrüstung</div>
          {[['Anpassungskosten',fmtEuro(anpassungMin)+'–'+fmtEuro(anpassungMax)],
            ['KfW-Zuschuss',fmtEuro(foerd.zuschuss)],['Förderquote',foerd.gesamtSatz+'%'],
            ['Eigenanteil',fmtEuro(foerd.eigenanteil)],['JAZ',String(jaz)],
            ['GEG-Frist',city.gegFrist.split('-').reverse().join('.')],
          ].map(([l,v],i)=>(
            <div key={i} className="flex justify-between py-2 border-b border-wp-border last:border-0 text-sm">
              <span className="text-wp-text2">{l}</span><span className="font-bold text-wp-text">{v}</span>
            </div>
          ))}
          <a href="#angebot" className="block mt-4 text-center bg-wp-green text-white font-bold py-3 rounded-xl hover:bg-wp-green2 transition-colors text-sm">Eignung prüfen →</a>
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
        <div className="mt-6 text-xs text-wp-text3">BWP Marktdaten 2024 · KfW BEG 458 · GEG BMWSB · Stand März 2026</div>
      </div>
    </div>
  );
}
