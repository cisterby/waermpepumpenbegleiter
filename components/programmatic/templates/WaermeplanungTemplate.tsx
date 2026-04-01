// components/programmatic/templates/WaermeplanungTemplate.tsx
// kommunale-waermeplanung — vollständig standalone, keyword-spezifisch
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=1200&q=75';

/* FRISTEN_PLAN moved inside component */

/* WAS_BEDEUTET moved inside component */

/* GEG_STADTTYPEN moved inside component */

export default function WaermeplanungTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const FRISTEN_PLAN = [
    { frist: city.gegFrist.split('-').reverse().join('.'), gruppe: `GEG-Pflicht ${city.name}`, status: `Ab diesem Datum keine fossile Heizung ohne 65% EE-Anteil in ${city.name}` },
    { frist: 'Jetzt', gruppe: 'Optimal: WP planen', status: `8–12 Wochen Vorlauf für KfW-Antrag + Installateur in ${city.name}` },
    { frist: '4 Wo. vor Auftrag', gruppe: 'KfW-Antrag stellen', status: 'Zwingend vor Auftragserteilung — kein Nachantrag möglich' },
    { frist: '2026–2030', gruppe: 'CO₂-Preis steigt', status: 'ETS2: von €55/t (2026) auf voraussichtlich €100+/t (2030)' },
    { frist: 'Ab 2030', gruppe: 'Förderlage unsicher', status: 'KfW-Konditionen können sich ändern — jetzt sichern' },
  ];
  const WAS_BEDEUTET = [
    { frage: `Was bedeutet Wärmeplanung für ${city.name}?`, antwort: `Die kommunale Wärmeplanung zeigt, welche Gebiete in ${city.name} zukünftig Fernwärme bekommen. In ${100 - city.fernwaermeQuote}% der Gebäude ist die WP dauerhaft die richtige Lösung.` },
    { frage: 'Muss ich auf den Plan warten?', antwort: `Nein — die KfW-Förderung gilt unabhängig vom kommunalen Wärmeplan. In ${city.name} können Sie jetzt fördergerecht installieren.` },
    { frage: 'Was wenn mein Haus im Fernwärmegebiet liegt?', antwort: `Fernwärmequote ${city.name}: ${city.fernwaermeQuote}%. Für die restlichen ${100 - city.fernwaermeQuote}% gilt: WP ist die klare Empfehlung.` },
  ];
  const GEG_STADTTYPEN = [
    { typ: 'Großstadt > 100.000 EW', action: city.einwohner >= 100000 ? `⚠️ Gilt für ${city.name}` : '✅ Nicht betroffen', wann: '30.06.2026' },
    { typ: 'Mittelstadt 10.000–100.000', action: city.einwohner >= 10000 && city.einwohner < 100000 ? `⚠️ Gilt für ${city.name}` : city.einwohner >= 100000 ? '✅ Frühere Frist' : '✅ Nicht betroffen', wann: '30.06.2028' },
    { typ: 'Kleinstadt / Gemeinde', action: city.einwohner < 10000 ? `⚠️ Gilt für ${city.name}` : '✅ Nicht betroffen', wann: '30.06.2028' },
    { typ: 'Neubau bundesweit', action: '⚠️ Gilt überall', wann: 'Seit 01.01.2024' },
    { typ: 'Defekte Heizung', action: '⚠️ 3 Jahre Übergangsfrist', wann: 'Ab GEG-Frist' },
  ];
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
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
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
              Welche Fristen gelten für die Wärmeplanung in {city.bundesland}
            ?</h2>
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
              Was müssen Eigentümer zur Wärmeplanung in {city.name}
            ?</h2>
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
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">{h2s.foerderung}</h2>
            <p className="text-wp-text2 text-base leading-relaxed mb-4">{si.foerderung}</p>
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
            <p className="text-wp-text2 text-sm leading-relaxed mb-4">
                {[
                  `Die KfW-Förderung gilt in ${city.name} unabhängig vom kommunalen Wärmeplan. Nach Vorliegen des Plans könnten KfW-Konditionen angepasst werden — wer jetzt handelt, sichert sich die aktuell attraktiven Fördersätze.`,
                  `In ${city.name} gilt: KfW-Förderung beantragen und WP installieren ist heute möglich — ohne auf den kommunalen Wärmeplan warten zu müssen. Bei Vorliegen des Plans könnten sich Bedingungen ändern.`,
                  `Für Hausbesitzer in ${city.name}: Die aktuelle KfW-Förderung (bis 70%) gilt sofort und unabhängig vom Wärmeplan. Frühzeitig handeln sichert die besten Konditionen.`,
                  `Der kommunale Wärmeplan von ${city.name} ändert nichts an Ihrer KfW-Berechtigung heute. Experten empfehlen, nicht zu warten — Förderkonditionen können sich ab 2026 ändern.`,
                ][cityHash(city, 4, 340)]}
              </p>
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
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
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
