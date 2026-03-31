// components/programmatic/templates/WaermeplanungTemplate.tsx
// kommunale-waermeplanung — vollständig standalone, keyword-spezifisch
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=1920&q=80';

const FRISTEN_PLAN = [
  { gruppe: 'Großstädte > 100.000 EW', frist: '30.06.2026', status: 'Läuft — Wärmepläne müssen vorliegen' },
  { gruppe: 'Mittelstädte 10.000–100.000 EW', frist: '30.06.2028', status: 'Planung läuft' },
  { gruppe: 'Kleinstädte < 10.000 EW', frist: '30.06.2028', status: 'Bundesland-abhängig' },
  { gruppe: 'Für Hausbesitzer: GEG-Pflicht', frist: 'Nach kommunalem Wärmeplan', status: '65% EE-Pflicht greift nach Vorliegen des Plans' },
];

const WAS_BEDEUTET = [
  { frage: 'Was ist ein kommunaler Wärmeplan?', antwort: 'Eine Pflichtanalyse der Wärmeversorgung der Gemeinde: Wo liegt Fernwärme-Netz, wo dezentrale WP, wo Biomethan? Basis für die GEG-Anwendung im Bestand.' },
  { frage: 'Was ändert sich für Hausbesitzer?', antwort: 'Sobald der Wärmeplan vorliegt, greift die 65%-EE-Pflicht auch für den Bestand. Eine neue Heizung muss dann zu 65% aus erneuerbaren Energien betrieben werden — Gas-Brennwert allein nicht mehr GEG-konform.' },
  { frage: 'Lohnt es sich jetzt zu warten?', antwort: 'Nein — wer jetzt freiwillig auf WP umstellt erhält volle KfW-Förderung und sichert sich niedrige Betriebskosten. Wer wartet riskiert höhere CO₂-Preise und mögliche Warteschlangen.' },
  { frage: 'Was wenn Fernwärme kommt?', antwort: 'Liegt Ihr Haus im geplanten Fernwärme-Ausbaugebiet: abwarten kann sinnvoll sein. Liegt keine Fernwärme-Planung vor: WP ist die sichere Wahl.' },
];

const GEG_STADTTYPEN = [
  { typ: 'Fernwärme-Vorranggebiet', action: 'Anschluss an Fernwärme wenn verfügbar', wann: 'Nach Ausbau (oft 2028–2035)' },
  { typ: 'WP-Eignungsgebiet (dezentral)', action: 'Wärmepumpe — beste Wahl jetzt', wann: 'Sofort möglich und gefördert' },
  { typ: 'Biomethan/H₂-Vorbehaltsnetz', action: 'Gas-Hybrid als Übergang ggf. möglich', wann: 'Risiko: H₂-Versorgung unsicher bis 2035' },
  { typ: 'Ländliche Gebiete ohne Plan', action: 'WP oder Pellets — GEG-konform', wann: 'Sofort — kein Fernwärme-Risiko' },
];

export default function WaermeplanungTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);
  const fristText = city.einwohner >= 100000 ? '30.06.2026' : '30.06.2028';
  const hatGrosstadtFrist = city.einwohner >= 100000;

  const intros = [
    `Kommunale Wärmeplanung ${city.name}: Frist ${fristText}. Sobald der Plan vorliegt, gilt die 65%-EE-Pflicht auch im Bestand. Wer jetzt auf WP umstellt sichert volle KfW-Förderung (${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)}) vor der Frist.`,
    `${city.name} (${city.bundesland}): GEG-Wärmeplanung Frist ${fristText}. Liegt kein Fernwärme-Netz in Ihrer Straße: WP ist die sichere Wahl. JAZ ${jaz} → ${fmtEuro(calc.wpKosten)}/Jahr Betriebskosten.`,
    `Was bedeutet die kommunale Wärmeplanung für Hausbesitzer in ${city.name}? Die 65%-EE-Pflicht greift nach Vorliegen des kommunalen Plans. Gas-Brennwert allein dann nicht mehr GEG-konform.`,
    `Kommunale Wärmeplanung ${city.name}: ${hatGrosstadtFrist ? 'Großstadt-Frist 30.06.2026 — Plan muss vorliegen' : 'Frist 30.06.2028'}. WP-Anteil in ${city.bundesland}: soll auf 80% bis 2030. KfW-Förderung ${foerd.gesamtSatz}% weiterhin aktiv.`,
  ];


  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/90 via-wp-dark/70 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          <div className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${hatGrosstadtFrist ? 'bg-wp-amber text-wp-dark' : 'bg-wp-green text-white'}`}>
            Wärmeplan-Frist {city.name}: {fristText}
          </div>
          <h1 className="font-heading font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: fristText, label: 'Wärmeplan-Frist', sub: city.name },
              { val: foerd.gesamtSatz+'%', label: 'KfW jetzt', sub: 'Vor Plan-Pflicht' },
              { val: fmtEuro(foerd.zuschuss), label: 'Zuschuss', sub: 'Nicht rückzahlbar' },
              { val: fmtEuro(calc.ersparnis)+'/J.', label: 'Ersparnis WP', sub: 'vs. Gas' },
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
              {fillTemplate('Was bedeutet die kommunale Wärmeplanung für {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              <strong>{city.name}</strong> ({city.bundesland}) muss bis {fristText} einen kommunalen Wärmeplan vorlegen. Dieser Plan definiert, ob in Ihrer Straße Fernwärme geplant ist, ob dezentrale WP die Lösung ist oder ob Biomethan möglich wird. Für Hausbesitzer gilt: Nach Vorliegen des Plans greift die GEG-65%-EE-Pflicht — Gas-Brennwert allein wird nicht mehr akzeptiert. Wer jetzt auf WP umstellt bekommt {foerd.gesamtSatz}% KfW und sichert sich niedrige Betriebskosten von {fmtEuro(calc.wpKosten)}/Jahr.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Fristen der kommunalen Wärmeplanung in {city.bundesland}
            </h2>
            <div className="space-y-3">
              {FRISTEN_PLAN.map((f,i)=>(
                <div key={i} className={`flex gap-3 p-4 rounded-xl border ${i===0&&hatGrosstadtFrist?'bg-wp-amberlt border-amber-200':i===1&&!hatGrosstadtFrist?'bg-wp-amberlt border-amber-200':'bg-white border-wp-border'}`}>
                  <div className="font-mono font-bold text-wp-green text-sm shrink-0 mt-0.5">{f.frist}</div>
                  <div>
                    <div className="font-heading font-bold text-wp-text text-sm">{f.gruppe}</div>
                    <div className="text-wp-text2 text-xs mt-0.5">{f.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              4 wichtige Fragen zur Wärmeplanung in {city.name}
            </h2>
            <div className="space-y-4">
              {WAS_BEDEUTET.map((w,i)=>(
                <div key={i} className="p-4 bg-white border border-wp-border rounded-xl">
                  <div className="font-heading font-bold text-wp-text text-sm mb-2">❓ {w.frage}</div>
                  <p className="text-wp-text2 text-sm leading-relaxed">{w.antwort}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Was tun? — Je nach Stadttyp in {city.name}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Ihr Gebiet','Empfehlung','Zeitplan'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {GEG_STADTTYPEN.map((r,i)=>(
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${i===1?'bg-wp-greenxlt':''}`}>
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{r.typ}</td>
                      <td className={`px-4 py-3 text-sm ${i===1?'text-wp-green font-bold':'text-wp-text2'}`}>{r.action}</td>
                      <td className="px-4 py-3 text-xs text-wp-text3">{r.wann}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-wp-text3 mt-2">WP-Eignungsgebiet trifft auf die meisten Wohnlagen in {city.name} zu. Im Zweifel: Anfrage beim Stadtplanungsamt.</p>
          </div>

          <div className="p-6 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">{city.name} — Jetzt WP-Förderung sichern</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
              {[
                [foerd.gesamtSatz+'%','KfW-Förderquote (aktiv)'],
                [fmtEuro(foerd.zuschuss),'Zuschuss'],
                [fmtEuro(foerd.eigenanteil),'Eigenanteil'],
                [fmtEuro(calc.wpKosten)+'/J.','WP-Betriebskosten'],
                [fmtEuro(calc.ersparnis)+'/J.','Ersparnis vs. Gas'],
                [fristText,'Wärmeplan-Frist'],
              ].map(([v,l],i)=>(
                <div key={i}><div className="text-wp-text3 text-xs">{l}</div><div className="font-bold text-wp-text">{v}</div></div>
              ))}
            </div>
            <p className="text-sm text-wp-text2">Die KfW-Förderung gilt jetzt unabhängig vom kommunalen Wärmeplan. Nach Vorliegen des Plans könnten Konditionen angepasst werden — wer jetzt handelt ist auf der sicheren Seite.</p>
          </div>

          {faqs.length > 0 && (
            <div className="p-5 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
              <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">Häufige Fragen — Kommunale Wärmeplanung {city.name}</h2>
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
          <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Wärmeplanung</div>
          {[['Wärmeplan-Frist',fristText],['Stadtgröße',city.einwohner.toLocaleString('de-DE')+' EW'],
            ['KfW-Zuschuss jetzt',fmtEuro(foerd.zuschuss)],['Förderquote',foerd.gesamtSatz+'%'],
            ['Eigenanteil',fmtEuro(foerd.eigenanteil)],['Ersparnis/Jahr',fmtEuro(calc.ersparnis)],
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
        <div className="mt-6 text-xs text-wp-text3">WPG 2023 · GEG BMWSB 2024 · KfW BEG 458 · Stand März 2026</div>
      </div>
    </div>
  );
}
