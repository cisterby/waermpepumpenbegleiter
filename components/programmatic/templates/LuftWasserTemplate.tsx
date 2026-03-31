// components/programmatic/templates/LuftWasserTemplate.tsx
// luft-wasser-waermepumpe — vollständig standalone (differenziert von LuftwaermepumpeTemplate)
// Fokus: technische Tiefen-Infos zum LW-System: Monoblock vs Split, COP bei Kälte, WW-Integration
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80';

const MONOBLOCK_SPLIT = [
  { kriterium: 'Kältemittel-Leitungen im Haus', monoblock: 'Keine — nur Wasserleitungen', split: 'Ja — Kältemittelleitungen innen', besser: 'Monoblock' },
  { kriterium: 'Frostschutz bei -20°C', monoblock: 'Nötig (Glykol-Beimischung)', split: 'Kein Problem — WW-seitig', besser: 'Split' },
  { kriterium: 'F-Gas Pflicht für Inbetriebnahme', monoblock: 'Nein — nur Klempner', split: 'Ja — F-Gas-Fachbetrieb Pflicht', besser: 'Monoblock' },
  { kriterium: 'Installationskosten', monoblock: 'Günstiger', split: 'Teurer (+€500–1.500)', besser: 'Monoblock' },
  { kriterium: 'COP bei -10°C', monoblock: 'Ca. 2,0–2,5', split: 'Ca. 2,3–2,8', besser: 'Split minimal' },
  { kriterium: 'Rohrlänge Innen-Außen', monoblock: 'Max. 15 m (Wasser)', split: 'Max. 30–60 m (Kältemittel)', besser: 'Split bei langen Wegen' },
  { kriterium: 'Marktanteil DE 2024', monoblock: '~72%', split: '~28%', besser: 'Monoblock dominiert' },
];

const COP_BEI_TEMP = [
  { aussentemp: '+20°C', cop: '6,5–8,0', note: 'Sommerbetrieb / Warmwasser' },
  { aussentemp: '+7°C', cop: '3,8–5,0', note: 'Normaler Heizbetrieb (A7/W35)' },
  { aussentemp: '0°C', cop: '3,0–3,8', note: 'Kälterer Wintertag' },
  { aussentemp: '-7°C', cop: '2,2–3,0', note: 'Kältester Standardtest (A-7/W35)' },
  { aussentemp: '-15°C', cop: '1,5–2,0', note: 'Extremkälte — WP läuft noch' },
  { aussentemp: '-20°C', cop: '1,2–1,5', note: 'Unter Betriebslimit mancher Geräte' },
];

const WW_INTEGRATION = [
  { system: 'Kombispeicher (Heizung + WW)', kosten: '€1.500–€3.500', vorteil: 'Ein Tank für alles — platzsparend', nachteil: 'WW-Temp begrenzt auf 55°C' },
  { system: 'Pufferspeicher + separater WW-Speicher', kosten: '€1.200–€4.000', vorteil: 'Optimale Temperaturen für beides', nachteil: 'Mehr Platz, mehr Installationsaufwand' },
  { system: 'Frischwasserstation (hygienisch)', kosten: '€800–€2.000', vorteil: 'Kein stehendes Warmwasser — hygienisch', nachteil: 'Geringerer Komfort bei Spitzenbedarf' },
  { system: 'Zusätzliche Trinkwasser-WP', kosten: '€1.000–€2.500', vorteil: 'Unabhängig — kann Abwärme nutzen', nachteil: 'Zweites Gerät, Kellerkühlung im Sommer' },
];

export default function LuftWasserTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);
  const coldDays = city.normAussentemp <= -12 ? '15–25' : city.normAussentemp <= -8 ? '8–15' : '3–8';

  const intros = [
    `Luft-Wasser-WP ${city.name}: COP 3,8–5,0 bei 7°C Außentemperatur (A7/W35 Norm). Bei ${city.normAussentemp}°C Normaußentemperatur in ${city.bundesland}: ${coldDays} Tage/Jahr unter -7°C. WP läuft bis -20°C — Effizienz sinkt, aber Heizen ist immer möglich.`,
    `Monoblock vs. Split ${city.name}: Monoblock (72% Marktanteil) — keine Kältemittelleitungen im Haus, einfachere Installation. Split — mehr Flexibilität bei Abständen bis 60m. Bei ${city.avgTemp}°C Jahresmittel: beide Typen wirtschaftlich.`,
    `Luft-Wasser-WP ${city.name}: WW-Integration entscheidend für Gesamteffizienz. Kombispeicher oder separater Speicher? Frischwasserstation hygienisch, aber €800–2.000 Mehrkosten. JAZ ${jaz} → ${fmtEuro(calc.wpKosten)}/Jahr.`,
    `LW-WP ${city.name} (${city.bundesland}): JAZ ${jaz} Jahresarbeitszahl — das ist der Durchschnitt über alle Außentemperaturen. Im Sommer COP 6–8 (Warmwasser), im Winter COP 2–3 (${city.normAussentemp}°C). KfW: ${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)}.`,
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
          <h1 className="font-heading font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: `JAZ ${jaz}`, label: 'Jahresarbeitszahl', sub: city.avgTemp+'°C Jahresmittel' },
              { val: city.normAussentemp+'°C', label: 'Normaußentemp.', sub: city.name },
              { val: coldDays+' Tage', label: 'Unter -7°C/J.', sub: 'WP läuft bis -20°C' },
              { val: fmtEuro(calc.ersparnis)+'/J.', label: 'Ersparnis', sub: 'vs. Gasheizung' },
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
              {fillTemplate('Wie effizient ist eine Luft-Wasser-WP in {stadt} wirklich?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              In <strong>{city.name}</strong> ({city.avgTemp}°C Jahresmittel, {city.normAussentemp}°C Normaußentemperatur) erreicht eine Luft-Wasser-WP JAZ {jaz}. Das bedeutet: pro 1 kWh Strom erzeugt die WP {jaz} kWh Wärme — im Jahresdurchschnitt. Im Sommer COP 6–8 (Warmwasser), im tiefsten Winter COP 2–3. Selbst bei {city.normAussentemp}°C heizt die WP effizient.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              COP-Kurve bei verschiedenen Außentemperaturen — {city.name}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Außentemperatur','COP (Leistungszahl)','Situation in '+city.name].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {COP_BEI_TEMP.map((r,i)=>(
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${r.aussentemp==='+7°C'?'bg-wp-greenxlt':r.aussentemp.includes('-15')||r.aussentemp.includes('-20')?'opacity-80':''}`}>
                      <td className="px-4 py-3 font-mono font-bold text-wp-text">{r.aussentemp}</td>
                      <td className="px-4 py-3 font-mono text-wp-green font-bold">{r.cop}</td>
                      <td className="px-4 py-3 text-xs text-wp-text2">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-wp-text3 mt-2">Vorlauftemperatur 35°C · {city.name}: {coldDays} Tage/Jahr unter -7°C</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Monoblock vs. Split — welche Bauart für {city.name}?
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Kriterium','Monoblock','Split','Empfehlung'].map(h=>(
                    <th key={h} className="px-3 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {MONOBLOCK_SPLIT.map((r,i)=>(
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-3 py-3 font-semibold text-wp-text text-sm">{r.kriterium}</td>
                      <td className={`px-3 py-3 text-sm ${r.besser==='Monoblock'?'text-wp-green font-bold':'text-wp-text2'}`}>{r.monoblock}</td>
                      <td className={`px-3 py-3 text-sm ${r.besser==='Split'?'text-wp-green font-bold':'text-wp-text2'}`}>{r.split}</td>
                      <td className="px-3 py-3 text-xs text-wp-text3">{r.besser}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Warmwasser-Integration — 4 Optionen in {city.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {WW_INTEGRATION.map((w,i)=>(
                <div key={i} className={`p-4 rounded-xl border ${i===0?'bg-wp-greenxlt border-wp-borderl':'bg-white border-wp-border'}`}>
                  <div className="font-heading font-bold text-wp-text text-sm mb-1">{w.system}</div>
                  <div className="font-mono text-wp-green text-xs mb-2">{w.kosten}</div>
                  <div className="text-xs text-wp-green mb-1">✅ {w.vorteil}</div>
                  <div className="text-xs text-wp-text3">⚠️ {w.nachteil}</div>
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
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">Häufige Fragen — Luft-Wasser-WP {city.name}</h2>
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
          <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — LW-WP Kennzahlen</div>
          {[['JAZ',String(jaz)],['Normaußentemp.',city.normAussentemp+'°C'],
            ['Jahresmittel',city.avgTemp+'°C'],['Tage unter -7°C',coldDays+'/Jahr'],
            ['KfW-Zuschuss',fmtEuro(foerd.zuschuss)],['Eigenanteil',fmtEuro(foerd.eigenanteil)],
            ['Betriebskosten',fmtEuro(calc.wpKosten)+'/J.'],
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
        <div className="mt-6 text-xs text-wp-text3">DIN EN 14511 (COP-Norm) · BWP Marktdaten 2024 · DWD Klimadaten {city.name} · Stand März 2026</div>
      </div>
    </div>
  );
}
