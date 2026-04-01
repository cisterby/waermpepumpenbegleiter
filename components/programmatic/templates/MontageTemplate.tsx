// components/programmatic/templates/MontageTemplate.tsx
// waermepumpe-montage — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1920&q=85', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=85', 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* Static arrays moved inside component — see below */

export default function MontageTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const MONTAGE_ABLAUF = [
    { tag: 'Tag 1 (Vorbereitung)', icon: '📦', schritte: [
      `Außeneinheit in ${city.name} angeliefert, Fundament vorbereitet (Betonplatte oder Anti-Vibrations-Gummifüße)`,
      `Kältemittelleitungen durch Außenwand: Kernbohrung 60–80 mm, typischer Abstand Außeneinheit zu Technikraum in ${city.bundesland}: 5–15 m`,
      'Hydraulische Einbindung: Pufferspeicher, Heizkreisverteiler, Sicherheitsgruppe — Vorlauf/Rücklauf nach Heizlastplan',
      `Starkstromkreis 3×16A+ vorbereitet — ${['Netzbetreiber-Anmeldung rechtzeitig stellen', 'WP-Sondertarif beim Versorger anfragen', 'Zählerfeld-Erweiterung falls nötig'][cityHash(city, 3, 200)]}`,
    ]},
    { tag: 'Tag 2 (Hauptmontage)', icon: '🔧', schritte: [
      `Außeneinheit aufgestellt: Schallschutzmatte, Abstandshalter — Mindestabstand Grundstücksgrenze in ${city.bundesland} prüfen`,
      'Kältemittelkreislauf befüllt und auf Dichtheit geprüft — F-Gas-zertifizierter Kälteanlagenbauer Pflicht (EU 517/2014)',
      `Pufferspeicher angeschlossen: ${['200–300 l bei kleiner Heizlast', '300–500 l Standardgröße für Einfamilienhaus', '400–500 l für optimalen Taktschutz'][cityHash(city, 3, 201)]} — mind. 30 l/kW WP-Nennleistung`,
      'Warmwasserspeicher integriert oder Trinkwasser-WP parallel — Legionellenschutzprogramm eingestellt',
    ]},
    { tag: 'Tag 3 (Inbetriebnahme)', icon: '⚙️', schritte: [
      'Inbetriebnahme durch F-Gas-zertifizierten Kälteanlagenbauer — Inbetriebnahmeprotokoll für KfW',
      `Hydraulischer Abgleich Verfahren B: Heizkörperventile eingestellt auf ${city.normAussentemp}°C Auslegungstemperatur`,
      `Heizungsprogrammierung: Heizkurve für ${city.avgTemp}°C Jahresmittel optimiert, Absenkzeiten, Smart-Grid-Eingang`,
      'KfW-Dokumentation vollständig: Inbetriebnahmeprotokoll, Heizlastberechnung, Hydraulischer Abgleich',
    ]},
  ];

  const KOSTEN_POSITIONEN = [
    { pos: 'WP-Gerät (Außen- + Inneneinheit)', von: 9000, bis: 18000, note: `Je nach Hersteller, kW, Kältemittel — marktüblich in ${city.bundesland}` },
    { pos: 'Montage & Installation', von: 3000, bis: 6000, note: `Kernbohrung, Kältemittelbefüllung, Hydraulik — ${city.name} Marktpreis 2026` },
    { pos: 'Hydraulischer Abgleich', von: 500, bis: 1500, note: 'KfW-Pflicht — muss separat ausgewiesen sein' },
    { pos: 'Pufferspeicher 200–500 l', von: 600, bis: 2000, note: 'Inkl. Montage, Dämmung, Einbindung' },
    { pos: 'Elektroinstallation', von: 500, bis: 1500, note: `Starkstromkreis 3×16A, WP-Zähler — ${city.name} Elektriker-Marktpreis` },
    { pos: 'Warmwasserspeicher (optional)', von: 800, bis: 2500, note: 'Wenn kein Kombispeicher vorhanden' },
    { pos: 'Wärmemengenzähler (KfW-Pflicht 2026)', von: 300, bis: 600, note: 'Ab 2026 KfW-Pflichtnachweis' },
  ];

  const MONTAGE_FEHLER = [
    { fehler: 'Außeneinheit zu nah an Grundstücksgrenze', folge: `Schallschutz-Problem: In ${city.bundesland} gelten TA-Lärm-Vorgaben — mindestens 3 m Abstand empfohlen, lokal prüfen` },
    { fehler: 'Pufferspeicher zu klein', folge: `WP taktet zu häufig: Bei ${city.heizgradtage} Heizgradtagen in ${city.name} sinkt die Lebensdauer erheblich — mind. 30 l/kW einplanen` },
    { fehler: 'Kein hydraulischer Abgleich', folge: `KfW-Antrag abgelehnt + ungleichmäßige Versorgung: ${['Häufigster Ablehnungsgrund beim KfW-Verwendungsnachweis', 'Führt zu 15–20% schlechterer JAZ und Reklamationen', 'Betrifft ca. 30% aller abgelehnten BEG-Anträge'][cityHash(city, 3, 202)]}` },
    { fehler: 'Falscher Aufstellort (Wärmefalle)', folge: `WP zieht eigene Abluft an: COP sinkt 15–25% — besonders relevant in ${city.name} bei engen Grundstücksverhältnissen` },
    { fehler: 'Kein Schallschutzfundament', folge: `Körperschall überträgt sich ins Gebäude: In dicht bebauten Lagen in ${city.name} führt das zu Nachbarkonflikten — Anti-Vibrations-Matte (€100–300) pflicht` },
  ];

  const gesamtMin = KOSTEN_POSITIONEN.reduce((s, p) => s + p.von, 0);
  const gesamtMax = KOSTEN_POSITIONEN.reduce((s, p) => s + p.bis, 0);

  const intros = [
    `WP-Montage ${city.name}: Typischerweise 2–3 Tage von Lieferung bis Inbetriebnahme. Gesamtkosten inkl. Gerät: ${fmtEuro(gesamtMin)}–${fmtEuro(gesamtMax)} vor KfW. Nach ${foerd.gesamtSatz}% Förderung: ${fmtEuro(foerd.eigenanteil)}. JAZ ${jaz} → ${fmtEuro(calc.ersparnis)}/Jahr Ersparnis in ${city.name}.`,
    `Montage ${city.name} (${city.bundesland}): Der hydraulische Abgleich ist KfW-Pflicht und wird von >60% aller Angebote weggelassen. Ohne ihn: KfW-Antrag abgelehnt, JAZ dauerhaft schlechter. Alle unsere Partnerbetriebe in ${city.name} führen ihn standardmäßig durch.`,
    `Ablauf WP-Montage ${city.name}: Tag 1 Vorbereitung und Kernbohrung, Tag 2 Aufstellung und Kältemittel, Tag 3 Hydraulischer Abgleich und Inbetriebnahme. Kosten vor Förderung: ${fmtEuro(gesamtMin)}–${fmtEuro(gesamtMax)}. KfW-Zuschuss: ${fmtEuro(foerd.zuschuss)}.`,
    `${city.name}: Außeneinheit-Aufstellung bei ${city.normAussentemp}°C Normaußentemperatur. Schallschutz: mind. 3 m Abstand zur Grundstücksgrenze empfohlen. Inbetriebnahme durch F-Gas-zertifizierten Kälteanlagenbauer Pflicht.`,
  ];

  const totalMin = KOSTEN_POSITIONEN.reduce((s, p) => s + p.von, 0);
  const totalMax = KOSTEN_POSITIONEN.reduce((s, p) => s + p.bis, 0);


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1910]/90 via-[#0A1910]/70 to-[#0A1910]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          {city.einwohner >= 100000 && (
            <div className="inline-block bg-[#D97706] text-[#1A4731] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              GEG-Frist {city.name}: {city.gegFrist.split('-').reverse().join('.')}
            </div>
          )}
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
              { val: '2–3 Tage', label: 'Montagedauer', sub: 'Inkl. Inbetriebnahme' },
              { val: fmtEuro(totalMin) + '+', label: 'Gesamtkosten', sub: 'Vor KfW-Förderung' },
              { val: fmtEuro(foerd.zuschuss), label: 'KfW-Zuschuss', sub: foerd.gesamtSatz + '%' },
              { val: fmtEuro(calc.ersparnis) + '/J.', label: 'Ersparnis', sub: 'vs. Gasheizung' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/75 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Kostenloses Angebot →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Wie läuft eine WP-Montage in {stadt} ab und was kostet sie?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Eine Wärmepumpen-Montage in <strong>{city.name}</strong> dauert typischerweise 2–3 Tage: Tag 1 Vorbereitung und Kernbohrung, Tag 2 Aufstellung und Kältemittel, Tag 3 hydraulischer Abgleich und Inbetriebnahme. Gesamtkosten inkl. Gerät: {fmtEuro(totalMin)}–{fmtEuro(totalMax)}. Nach {foerd.gesamtSatz}% KfW-Förderung ({fmtEuro(foerd.zuschuss)}) verbleibt ein Eigenanteil von {fmtEuro(foerd.eigenanteil)}.
            </p>
          </div>

          {/* 3-Tage-Ablauf */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">
              Wie läuft die Montage in {city.name} — 3 Tage im Detail
            ?</h2>
            <div className="space-y-4">
              {MONTAGE_ABLAUF.map((tag, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{tag.icon}</span>
                    <span className="font-bold font-bold text-[#1C2B2B]">{tag.tag}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {tag.schritte.map((s, j) => (
                      <li key={j} className="flex gap-2 text-sm text-[#4A6358]">
                        <CheckCircle size={14} className="text-[#1A4731] shrink-0 mt-0.5" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Kostentabelle */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Was kostet die WP-Montage komplett in {city.name}
            ?</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    {['Position', 'Kosten von', 'Kosten bis', 'Hinweis'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KOSTEN_POSITIONEN.map((k, i) => (
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{k.pos}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(k.von)}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{fmtEuro(k.bis)}</td>
                      <td className="px-4 py-3 text-xs text-[#7A9E8E]">{k.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#F2FAF5] border-t-2 border-gray-200l">
                    <td className="px-4 py-3 font-bold text-[#1C2B2B]">Gesamt</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(totalMin)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(totalMax)}</td>
                    <td className="px-4 py-3 text-xs text-[#7A9E8E]">Vor KfW-Förderung</td>
                  </tr>
                  <tr className="bg-[#F2FAF5]">
                    <td className="px-4 py-3 font-bold text-[#1A4731]">{`Nach ${foerd.gesamtSatz}% KfW`}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(Math.round(totalMin * (1 - foerd.gesamtSatz / 100)))}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1A4731]">{fmtEuro(foerd.eigenanteil)}</td>
                    <td className="px-4 py-3 text-xs text-[#7A9E8E]">Ihr tatsächlicher Eigenanteil</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Montage-Fehler */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Welche 5 Montagefehler passieren in {city.name}
            ?</h2>
            <div className="space-y-3">
              {MONTAGE_FEHLER.map((f, i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="font-bold font-semibold text-[#1C2B2B] text-sm mb-1">❌ {f.fehler}</div>
                  <div className="text-[#4A6358] text-xs">→ {f.folge}</div>
                </div>
              ))}
            </div>
          </div>

          {/* H3 + FAQ */}
          {faqs.length > 0 && (
            <div className="p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md mb-10">
              {faqs.map((faq, i) => (
                <details key={i} className="group border-b border-gray-200 last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                    <span className="font-bold font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-gray-200">
                    <p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">{n.name}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {(keyword.crossLinks ?? []).map((slug: string) => (
                  <Link key={slug} href={`/${slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-6">
            <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Montage-Kennzahlen</div>
            {[
              ['Montagedauer', '2–3 Tage'],
              ['Gesamtkosten', fmtEuro(totalMin) + '–' + fmtEuro(totalMax)],
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
              ['JAZ in ' + city.name, String(jaz)],
              ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
              ['Amortisation', calc.amortisationJahre + ' J.'],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="text-[#4A6358]">{l}</span>
                <span className="font-bold text-[#1C2B2B]">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-[#1A4731] text-white font-bold py-3 rounded-xl hover:bg-[#2D7A52] transition-colors text-sm">Kostenloses Angebot →</a>
          </div>
        </div>
      </div>

      <div id="angebot" className="bg-[#1A4731] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bold font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

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

      {/* ── VISUELLER TRENNER ─────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden my-8" style={{ height: '180px' }}>
        <img
          src={pickImg(SEC1_IMGS, city.lat, city.lng, 5)}
          alt={`${keyword.keyword.replace('[Stadt]', city.name)} Übersicht`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,25,16,0.88) 0%, rgba(10,25,16,0.45) 60%, rgba(10,25,16,0.15) 100%)' }} />
        <div className="absolute inset-y-0 left-0 flex items-center px-8">
          <div>
            <p className="text-white font-bold text-lg leading-tight">{keyword.keyword.replace('[Stadt]', city.name)}</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {fmtEuro(foerd.eigenanteil)} Eigenanteil · JAZ {jaz} · {foerd.gesamtSatz}% KfW-Förderung
            </p>
          </div>
        </div>
      </div>
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
        <div className="mt-6 text-xs text-[#7A9E8E]">KfW BEG 458 · F-Gas-Verordnung · DWD Klimadaten {city.name} · Stand März 2026</div>
      </div>
    </div>
  );
}
