// components/programmatic/templates/InstallationTemplate.tsx
// waermepumpe-installation — vollständig standalone
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
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


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/90 via-wp-dark/70 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          <h1 className="font-bold font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
              {/* Preis-Badge — Eigenanteil nach KfW-Förderung */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-[#D97706]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
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
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Kostenloses Angebot →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Was kostet die WP-Installation in {stadt}? — Vollständige Übersicht', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Die Installationskosten (ohne Gerät) für eine WP in <strong>{city.name}</strong> liegen bei {fmtEuro(installMin)}–{fmtEuro(installMax)}. Hinzu kommen Gerät (€9.000–€18.000) und Nebenkosten (Elektro, Puffer, Entsorgung: €1.500–€5.000). Gesamtkosten vor KfW: €15.000–€30.000. Nach {foerd.gesamtSatz}% KfW: {fmtEuro(foerd.eigenanteil)}.
            </p>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Welche 7 Voraussetzungen brauche ich für eine WP in {city.name}
            ?</h2>
            <div className="space-y-2">
              {VORAUSSETZUNGEN.map((v,i)=>(
                <div key={i} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                  <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 h-fit mt-0.5 ${v.kategorie==='Elektro'?'bg-blue-100 text-blue-700':v.kategorie==='Schall'?'bg-amber-100 text-amber-700':v.kategorie==='Genehmigung'?'bg-red-100 text-red-700':'bg-[#F2FAF5] text-[#1A4731]'}`}>{v.kategorie}</span>
                  <div>
                    <div className="font-semibold text-[#1C2B2B] text-sm">{v.check}</div>
                    <div className="text-[#4A6358] text-xs mt-0.5">{v.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Was kostet die WP-Installation komplett in — {city.name}
            ?</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#F8F9FA] border-b border-gray-200">
                  {['Position','Kosten von','Kosten bis','Hinweis'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {INSTALLATIONS_KOSTEN.map((k,i)=>(
                    <tr key={i} className={`border-b border-gray-200 last:border-0 ${i===0?'bg-[#F2FAF5]':''}`}>
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{k.pos}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(k.von)}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(k.bis)}</td>
                      <td className="px-4 py-3 text-xs text-[#7A9E8E]">{k.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#F2FAF5] border-t-2 border-gray-200l">
                    <td className="px-4 py-3 font-bold text-[#1C2B2B]">Gesamt Installation</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(installMin)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(installMax)}</td>
                    <td className="px-4 py-3 text-xs text-[#7A9E8E]">Ohne Gerät (€9–18k)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Welche Genehmigungen & Vorschriften gelten für WP in {city.bundesland}
            ?</h2>
            <div className="space-y-3">
              {GENEHMIGUNG_BUNDESLAND.map((g,i)=>(
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="font-bold font-bold text-[#1C2B2B] text-sm mb-1">{g.regel}</div>
                  <p className="text-[#4A6358] text-xs leading-relaxed">{g.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {faqs.length > 0 && (
            <div className="p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md mb-10">
              {faqs.map((faq,i)=>(
                <details key={i} className="group border-b border-gray-200 last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                    <span className="font-bold font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-gray-200"><p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p></div>
                </details>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div><h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">{nearby.map(n=>(
                <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">{n.name}</Link>
              ))}</div>
            </div>
            <div><h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">{(keyword.crossLinks??[]).map((slug:string)=>(
                <Link key={slug} href={`/${slug}/${city.slug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                  {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                </Link>
              ))}</div>
            </div>
          </div>
        </div>

        <div><div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-6">
          <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Installations-Kennzahlen</div>
          {[['Installationsdauer','2–3 Tage'],['Installation ohne Gerät',fmtEuro(installMin)+'–'+fmtEuro(installMax)],
            ['KfW-Zuschuss',fmtEuro(foerd.zuschuss)],['Eigenanteil',fmtEuro(foerd.eigenanteil)],
            ['JAZ in '+city.name,String(jaz)],['Betriebskosten',fmtEuro(calc.wpKosten)+'/J.'],
          ].map(([l,v],i)=>(
            <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0 text-sm">
              <span className="text-[#4A6358]">{l}</span><span className="font-bold text-[#1C2B2B]">{v}</span>
            </div>
          ))}
          <a href="#angebot" className="block mt-4 text-center bg-[#1A4731] text-white font-bold py-3 rounded-xl hover:bg-[#2D7A52] transition-colors text-sm">Kostenloses Angebot →</a>
        </div></div>
      </div>

      <div id="angebot" className="bg-[#1A4731] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bold font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

      {/* ── INSTALLATION CONTENT ────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-5">
          WP-Installation in {city.name} — was passiert wann?
        </h2>
        <div className="prose prose-sm max-w-none text-[#4A6358] space-y-4 leading-relaxed">
          <p>
            <strong>Gesamtzeitplan für {city.name}:</strong> Planung + Angebote: 1–2 Wochen. KfW-Antrag stellen + Genehmigung abwarten: 1–2 Wochen. Netzbetreiber-Anmeldung (Pflicht): 4–6 Wochen Vorlauf. Installateur-Terminbuchung in {city.bundesland}: 4–12 Wochen Wartezeit 2026. Montage: 2–3 Tage. Inbetriebnahme + Dokumentation: 1 Tag. Gesamtprozess: 8–20 Wochen → frühzeitig planen.
          </p>
          <p>
            <strong>Genehmigungen in {city.bundesland}:</strong> Luft-Wasser-WP: in {city.bundesland} meist keine Baugenehmigung erforderlich, aber formlose Anzeige beim Bauamt. Geräuschemissionen müssen TA-Lärm einhalten: 45 dB(A) tags / 35 dB(A) nachts an der Grundstücksgrenze. Seit 01.01.2026: nur noch Geräte mit 10 dB Unterschreitung des Grenzwerts KfW-förderfähig.
          </p>
          <p>
            <strong>Bauliche Voraussetzungen in {city.name}:</strong> Außenfläche min. 0,5 m² + Abstand zur Grundstücksgrenze. Kellerraum für Pufferspeicher 200–300 l (min. 0,8 m²). Starkstromanschluss 3×16A (falls nicht vorhanden: €500–1.500 Upgrade). Kernbohrung 60–80 mm durch Außenwand. Alle diese Punkte klärt der Installateur beim Vorab-Check.
          </p>
          <p>
            <strong>Installationskosten in {city.name} aufgeschlüsselt:</strong> Außeneinheit + Montage: €2.500–4.500. Hydraulischer Abgleich (KfW-Pflicht): €500–1.500. Starkstrom-Anschluss: €500–1.500. Wärmemengenzähler (KfW 2026): €300–600. Kernbohrung: €150–400. Pufferspeicher: €600–2.000. Inbetriebnahme + F-Gas-Protokoll: €200–400. Gesamt Montage: €4.750–10.900.
          </p>
        </div>
      </div>

      {/* ── VERWANDTE THEMEN ─────────────────────────── */}
      {crossKeywords.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-8">
          <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">
            Verwandte Themen für {city.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {crossKeywords.map(kw2 => kw2 && (
              <a key={kw2.slug} href={`/${kw2.slug}/${city.slug}`}
                className="px-3 py-1.5 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:border-[#1A4731] hover:text-[#1A4731] transition-all">
                {kw2.keyword.replace('[Stadt]', city.name)}
              </a>
            ))}
          </div>
        </div>
      )}
      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-6">
          Was sich 2026 geändert hat — und was das für {city.name} bedeutet
        </h2>
        <div className="space-y-4">

          {/* GEG-Reform */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.gegReform}</p>
          </div>

          {/* Neue Lärmvorschrift */}
          {['luft-wasser-waermepumpe','luftwaermepumpe','waermepumpe','waermepumpe-kosten','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-kaufen','waermepumpe-nachruesten','heizung-tauschen','waermepumpe-altbau'].includes(keyword.slug) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Neue Lärmvorschrift ab 01.01.2026</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.laerm10db}</p>
            </div>
          )}

          {/* Steuerliche Absetzbarkeit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-installateur','waermepumpe-preise','waermepumpe-installation','heizung-tauschen'].includes(keyword.slug) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.steuerAbsetz}</p>
            </div>
          )}

          {/* KfW-Ergänzungskredit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-preise','erdwaermepumpe','waermepumpe-neubau'].includes(keyword.slug) && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergänzungskredit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.kfwKredit}</p>
            </div>
          )}

          {/* Wartungskosten */}
          {['waermepumpe-kosten','waermepumpe','waermepumpe-preise','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-fachbetrieb','waermepumpe-kaufen'].includes(keyword.slug) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Wartungs- &amp; Langzeitkosten</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.wartungskosten}</p>
            </div>
          )}

          {/* Finanzierung */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.finanzierung}</p>
          </div>

        </div>
      </div>
      <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-[#7A9E8E]">F-Gas-Verordnung · KfW BEG 458 · TA Lärm · Stand März 2026</div>
      </div>
    </div>
  );
}
