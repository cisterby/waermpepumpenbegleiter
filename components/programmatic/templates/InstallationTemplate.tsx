// components/programmatic/templates/InstallationTemplate.tsx
// waermepumpe-installation — vollständig standalone
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=75';

/* VORAUSSETZUNGEN moved inside component */

/* INSTALLATIONS_KOSTEN moved inside component */

/* GENEHMIGUNG_BUNDESLAND moved inside component */

export default function InstallationTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const INSTALLATIONS_KOSTEN = [
    { pos: 'Nur Installation (ohne Gerät)', von: 3000, bis: 6000, note: `Kernbohrung, Kältemittel, Hydraulik, Elektro — ${city.name} Marktpreis 2026` },
    { pos: 'WP-Gerät Luft-Wasser', von: 9000, bis: 18000, note: `Je nach Hersteller, kW, Kältemittel in ${city.bundesland}` },
    { pos: 'Hydraulischer Abgleich', von: 500, bis: 1500, note: `KfW-Pflicht in ${city.name}` },
    { pos: 'Pufferspeicher 200–500 l', von: 600, bis: 2000, note: 'Taktschutz, mind. 30 l/kW' },
    { pos: 'Wärmemengenzähler', von: 300, bis: 600, note: 'KfW-Pflicht 2026' },
    { pos: 'Gesamt inkl. Gerät', von: 15000, bis: 28000, note: `Vollkosten in ${city.name} vor KfW` },
  ];

  const GENEHMIGUNG_BUNDESLAND = [
    { regel: 'Außenanlage Lärmschutz', detail: `TA Lärm in ${city.bundesland}: Max. 45 dB(A) tags / 35 dB(A) nachts. Moderne WP in ${city.name} liegen darunter.` },
    { regel: `Abstandsregelung ${city.bundesland}`, detail: `In ${city.bundesland} mind. 3 m zur Nachbargrenze empfohlen — lokal beim Bauamt ${city.name} prüfen.` },
    { regel: 'Baugenehmigung', detail: `In ${city.bundesland} meist ${['keine Genehmigung nötig — Anzeige beim Bauamt reicht', 'formlose Anzeige beim Bauamt', 'Baugenehmigung bei denkmalgeschützten Gebäuden'][Math.abs(Math.round(city.lat * 7)) % 3]}.` },
    { regel: 'F-Gas EU 517/2014', detail: 'Kältemittelbefüllung durch F-Gas-zertifizierten Betrieb Pflicht — gilt überall.' },
    { regel: 'Netzbetreiber-Anmeldung', detail: `Starkstromkreis 3×16A beim Netzbetreiber ${city.name} anmelden — Vorlauf ca. 4 Wochen.` },
  ];

  const VORAUSSETZUNGEN = [
    { kategorie: 'Elektro', check: '3-phasiger Starkstromanschluss (3×16A)', note: `Nachrüstung in ${city.name}: Elektriker prüfen — Anmeldung beim Netzbetreiber ca. 4 Wochen Vorlauf` },
    { kategorie: 'Hydraulik', check: 'Platz für Pufferspeicher (mind. 1 m² Keller)', note: `200–500 l Pufferspeicher — in ${city.name} oft Vertikallösung möglich bei engem Keller` },
    { kategorie: 'Aufstellung', check: 'Außenfläche ≥ 0,5 m² für Außeneinheit', note: `Mindestabstand Grundstücksgrenze in ${city.bundesland} prüfen — 3 m Abstand empfohlen` },
    { kategorie: 'Heizkreis', check: 'Vorlauftemperatur bekannt', note: `Messung bei ${city.normAussentemp}°C nötig (Normaußentemperatur ${city.name}) — Fachbetrieb prüft vor Ort` },
    { kategorie: 'Keller', check: 'Zugang für Kernbohrung (60–80 mm)', note: 'Wand zwischen innen/außen durchgängig — Fachbetrieb prüft vorab' },
    { kategorie: 'Schall', check: 'Abstand zu Schlafzimmerfenstern ≥ 3 m', note: `TA Lärm in ${city.bundesland}: Max. 45 dB(A) tags — die meisten modernen WP liegen darunter` },
    { kategorie: 'Genehmigung', check: `Baugenehmigung in ${city.bundesland} prüfen`, note: `In ${city.bundesland} ${['ist keine Baugenehmigung nötig, Anzeige beim Bauamt reicht', 'ggf. Baugenehmigung je nach Gemeinde', 'ist eine formlose Anzeige beim Bauamt ausreichend'][cityHash(city, 3, 220)]}` },
    { kategorie: 'Boden', check: 'Kein Gefälle > 10° am Aufstellort', note: 'Anti-Vibrations-Untergestell nivelliert leichte Unebenheiten' },
  ];
  const installMin = INSTALLATIONS_KOSTEN.reduce((s,p) => s+p.von, 0);
  const installMax = INSTALLATIONS_KOSTEN.reduce((s,p) => s+p.bis, 0);

  const intros = [
    `WP-Installation ${city.name}: Reine Installationskosten (ohne Gerät) ${fmtEuro(installMin)}–${fmtEuro(installMax)}. Dauer: 2–3 Tage. Voraussetzung: 3-phasiger Starkstromanschluss und Aufstellort Außeneinheit ≥ 2 m vom Nachbargrundstück.`,
    `Installation ${city.name} (${city.bundesland}): F-Gas-zertifizierter Kälteanlagenbauer Pflicht für Kältemittelarbeiten. Hydraulischer Abgleich (KfW-Pflicht): ${fmtEuro(500)}–${fmtEuro(1500)} extra. Gesamtinstallation ohne Gerät: ${fmtEuro(installMin)}–${fmtEuro(installMax)}.`,
    `WP ${city.name}: 7 Voraussetzungen vor der Installation prüfen — Elektro, Aufstellort, Schall, Heizkreis, Genehmigung. Unsere Parterbetriebe prüfen das bei der Vor-Ort-Begehung. JAZ ${jaz} → ${fmtEuro(calc.wpKosten)}/Jahr.`,
    `${city.name}: Installationsdauer 2–3 Tage, Kernbohrung Ø 80mm durch Außenwand, Starkstromanschluss 3×16A. KfW-Förderung ${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)}. Eigenanteil nach Förderung: ${fmtEuro(foerd.eigenanteil)}.`,
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
              { val: '2–3 Tage', label: 'Installationsdauer', sub: 'Inkl. Inbetriebnahme' },
              { val: fmtEuro(installMin)+'+', label: 'Installationskosten', sub: 'Ohne Gerät' },
              { val: fmtEuro(foerd.zuschuss), label: 'KfW-Zuschuss', sub: foerd.gesamtSatz+'%' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'Nach Förderung' },
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
              {fillTemplate('Was kostet die WP-Installation in {stadt}? — Vollständige Übersicht', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Die Installationskosten (ohne Gerät) für eine WP in <strong>{city.name}</strong> liegen bei {fmtEuro(installMin)}–{fmtEuro(installMax)}. Hinzu kommen Gerät (€9.000–€18.000) und Nebenkosten (Elektro, Puffer, Entsorgung: €1.500–€5.000). Gesamtkosten vor KfW: €15.000–€30.000. Nach {foerd.gesamtSatz}% KfW: {fmtEuro(foerd.eigenanteil)}.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Welche 7 Voraussetzungen brauche ich für eine WP in {city.name}
            ?</h2>
            <div className="space-y-2">
              {VORAUSSETZUNGEN.map((v,i)=>(
                <div key={i} className="flex gap-3 p-3 bg-white border border-wp-border rounded-lg">
                  <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 h-fit mt-0.5 ${v.kategorie==='Elektro'?'bg-blue-100 text-blue-700':v.kategorie==='Schall'?'bg-amber-100 text-amber-700':v.kategorie==='Genehmigung'?'bg-red-100 text-red-700':'bg-wp-greenxlt text-wp-green'}`}>{v.kategorie}</span>
                  <div>
                    <div className="font-semibold text-wp-text text-sm">{v.check}</div>
                    <div className="text-wp-text2 text-xs mt-0.5">{v.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Was kostet die WP-Installation komplett in — {city.name}
            ?</h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Position','Kosten von','Kosten bis','Hinweis'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {INSTALLATIONS_KOSTEN.map((k,i)=>(
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${i===0?'bg-wp-greenxlt':''}`}>
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{k.pos}</td>
                      <td className="px-4 py-3 font-mono text-wp-text2">{fmtEuro(k.von)}</td>
                      <td className="px-4 py-3 font-mono text-wp-text2">{fmtEuro(k.bis)}</td>
                      <td className="px-4 py-3 text-xs text-wp-text3">{k.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-wp-greenxlt border-t-2 border-wp-borderl">
                    <td className="px-4 py-3 font-bold text-wp-text">Gesamt Installation</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-green">{fmtEuro(installMin)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-green">{fmtEuro(installMax)}</td>
                    <td className="px-4 py-3 text-xs text-wp-text3">Ohne Gerät (€9–18k)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Genehmigungen & Vorschriften in {city.bundesland}
            </h2>
            <div className="space-y-3">
              {GENEHMIGUNG_BUNDESLAND.map((g,i)=>(
                <div key={i} className="p-4 bg-white border border-wp-border rounded-xl">
                  <div className="font-heading font-bold text-wp-text text-sm mb-1">{g.regel}</div>
                  <p className="text-wp-text2 text-xs leading-relaxed">{g.detail}</p>
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
          <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Installations-Kennzahlen</div>
          {[['Installationsdauer','2–3 Tage'],['Installation ohne Gerät',fmtEuro(installMin)+'–'+fmtEuro(installMax)],
            ['KfW-Zuschuss',fmtEuro(foerd.zuschuss)],['Eigenanteil',fmtEuro(foerd.eigenanteil)],
            ['JAZ in '+city.name,String(jaz)],['Betriebskosten',fmtEuro(calc.wpKosten)+'/J.'],
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
        <div className="mt-6 text-xs text-wp-text3">F-Gas-Verordnung · KfW BEG 458 · TA Lärm · Stand März 2026</div>
      </div>
    </div>
  );
}
