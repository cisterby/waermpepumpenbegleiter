// components/programmatic/templates/LuftWasserTemplate.tsx
// luft-wasser-waermepumpe — vollständig standalone (differenziert von LuftwaermepumpeTemplate)
// Fokus: technische Tiefen-Infos zum LW-System: Monoblock vs Split, COP bei Kälte, WW-Integration
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75';

/* MONOBLOCK_SPLIT moved inside component */

/* COP_BEI_TEMP moved inside component */

/* WW_INTEGRATION moved inside component */

export default function LuftWasserTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const MONOBLOCK_SPLIT = [
    { kriterium: 'Kältemittel draußen?', monoblock: 'Ja — nur Wasser ins Haus', split: 'Nein — Kältemittelleitungen innen', besser: 'Monoblock' },
    { kriterium: 'Installation', monoblock: `Einfacher in ${city.name} — kein F-Gas innen`, split: 'F-Gas-Kälteschlosser Pflicht', besser: 'Monoblock' },
    { kriterium: 'Leitungsverluste', monoblock: 'Leicht höher bei langen Wegen', split: 'Gering', besser: 'Split' },
    { kriterium: 'Schall', monoblock: `Alles außen — besser für dichte Bebauung in ${city.name}`, split: 'Innengerät trägt Schall', besser: 'Monoblock' },
    { kriterium: 'Marktanteil', monoblock: '70% (Trend)', split: '30% (rückläufig)', besser: 'Monoblock' },
  ];
  const COP_BEI_TEMP = [
    { aussentemp: `${city.normAussentemp}°C (Norm ${city.name})`, cop: (jaz - 1.0).toFixed(1)+'–'+(jaz - 0.5).toFixed(1), note: 'Kältester Auslegungspunkt' },
    { aussentemp: '-15°C', cop: (jaz - 0.8).toFixed(1)+'–'+(jaz - 0.3).toFixed(1), note: 'Sehr kalt' },
    { aussentemp: '-7°C', cop: (jaz - 0.4).toFixed(1)+'–'+jaz.toFixed(1), note: 'Kalt' },
    { aussentemp: '0°C', cop: jaz.toFixed(1)+'–'+(jaz + 0.4).toFixed(1), note: 'Häufig im Winter' },
    { aussentemp: '+7°C', cop: (jaz + 0.3).toFixed(1)+'–'+(jaz + 0.7).toFixed(1), note: 'DIN-Nennpunkt' },
    { aussentemp: `+${city.avgTemp}°C (Ø ${city.name})`, cop: (jaz + 0.7).toFixed(1)+'–'+(jaz + 1.2).toFixed(1), note: 'JAZ-Basis-Betriebspunkt' },
    { aussentemp: '+15°C', cop: (jaz + 1.2).toFixed(1)+'–'+(jaz + 1.8).toFixed(1), note: 'Übergangszeit — sehr effizient' },
  ];
  const WW_INTEGRATION = [
    { system: 'Integrierter WW-Speicher', kosten: '0 € extra', vorteil: `Bestes System für ${city.name} — JAZ ${(jaz-0.1).toFixed(1)} inkl. WW`, nachteil: 'Kombispeicher nötig' },
    { system: 'Externer WW-Speicher', kosten: '€800–2.500', vorteil: `Flexibel — JAZ ${jaz.toFixed(1)} separat optimierbar`, nachteil: 'Mehr Platzbedarf' },
    { system: 'Trinkwasser-WP parallel', kosten: '€800–1.500', vorteil: 'Unabhängig von Heizungs-WP', nachteil: `Zweites Gerät — nur bei hohem WW-Bedarf in ${city.name}` },
    { system: 'Elektrischer Heizstab (Backup)', kosten: '€200–400', vorteil: 'Legionellenschutz-Aufheizung', nachteil: 'Stromintensiv — nur als Backup' },
  ];
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
              Wie effizient ist die Luft-WP bei Kälte in {city.name}
            ?</h2>
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
              Monoblock oder Split — was ist besser für {city.name}?
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
              Wie funktioniert Warmwasser mit der Luft-WP in {city.name}
            ?</h2>
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
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
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
