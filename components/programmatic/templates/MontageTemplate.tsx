// components/programmatic/templates/MontageTemplate.tsx
// waermepumpe-montage — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80';

const MONTAGE_ABLAUF = [
  { tag: 'Tag 1 (Vorbereitung)', icon: '📦', schritte: [
    'Außeneinheit angeliefert und Fundament vorbereitet (Betonplatte oder Gummifüße)',
    'Kältemittelleitungen durch Außenwand verlegt — Kernbohrung ca. 60–80 mm',
    'Hydraulische Einbindung: Pufferspeicher, Heizkreisverteiler, Sicherheitsgruppe',
    'Stromanschluss vorbereitet: eigener Starkstromkreis (Sicherungsautomat 3×16A+)',
  ]},
  { tag: 'Tag 2 (Hauptmontage)', icon: '🔧', schritte: [
    'Außeneinheit aufgestellt und fixiert — Schallschutzmatte, Abstandshalter zur Wand',
    'Kältemittelkreislauf befüllt und auf Dichtheit geprüft (Kältemittellizenz F-Gas)',
    'Pufferspeicher angeschlossen — Volumen 30–50 l/kW WP-Nennleistung',
    'Warmwasserspeicher optional integriert oder Trinkwasser-WP installiert',
  ]},
  { tag: 'Tag 3 (Inbetriebnahme)', icon: '⚙️', schritte: [
    'Inbetriebnahme durch Kälteanlagenbauer (F-Gas-zertifiziert — Pflicht)',
    'Hydraulischer Abgleich Verfahren B: Heizkörperventile werden eingestellt',
    'Heizungsprogrammierung: Heizkurve, Absenkzeiten, Smart-Grid-Eingang',
    'KfW-Inbetriebnahmeprotokoll ausgestellt und Anlagendaten für Antrag erfasst',
  ]},
];

const KOSTEN_POSITIONEN = [
  { pos: 'WP-Gerät (Außen- + Inneneinheit)', von: 9000, bis: 18000, note: 'Je nach Hersteller, kW, Kältemittel' },
  { pos: 'Montage & Installation', von: 3000, bis: 6000, note: 'Kernbohrung, Kältemittel, Hydraulik' },
  { pos: 'Hydraulischer Abgleich', von: 500, bis: 1500, note: 'KfW-Pflicht — separat ausweisen' },
  { pos: 'Pufferspeicher 200–500 l', von: 600, bis: 2000, note: 'Inkl. Montage und Dämmung' },
  { pos: 'Elektroinstallation', von: 500, bis: 1500, note: 'Starkstromanschluss + Zähler' },
  { pos: 'Warmwasserspeicher (optional)', von: 800, bis: 2500, note: 'Wenn kein Kombispeicher' },
  { pos: 'Wärmemengenzähler (KfW 2026)', von: 300, bis: 600, note: 'KfW-Pflicht ab 2026' },
];

const MONTAGE_FEHLER = [
  { fehler: 'Außeneinheit zu nah an Grundstücksgrenze', folge: 'Schallschutz-Problem — Abstand ≥ 3 m empfohlen, lokal prüfen' },
  { fehler: 'Pufferspeicher zu klein', folge: 'WP startet zu häufig — Lebensdauer sinkt, JAZ schlechter' },
  { fehler: 'Kein hydraulischer Abgleich', folge: 'KfW-Antrag abgelehnt, Heizkreis ungleichmäßig versorgt' },
  { fehler: 'Falscher Aufstellort (Wärmefalle)', folge: 'WP zieht eigene Abluft an — COP sinkt 15–25%' },
  { fehler: 'Kein Schallschutzfundament', folge: 'Körperschall im Haus — Reklamationen, teure Nachrüstung' },
];

export default function MontageTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);
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
          {city.einwohner >= 100000 && (
            <div className="inline-block bg-wp-amber text-wp-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              GEG-Frist {city.name}: {city.gegFrist.split('-').reverse().join('.')}
            </div>
          )}
          <h1 className="font-heading font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
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
              {fillTemplate('Wie läuft eine WP-Montage in {stadt} ab und was kostet sie?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Eine Wärmepumpen-Montage in <strong>{city.name}</strong> dauert typischerweise 2–3 Tage: Tag 1 Vorbereitung und Kernbohrung, Tag 2 Aufstellung und Kältemittel, Tag 3 hydraulischer Abgleich und Inbetriebnahme. Gesamtkosten inkl. Gerät: {fmtEuro(totalMin)}–{fmtEuro(totalMax)}. Nach {foerd.gesamtSatz}% KfW-Förderung ({fmtEuro(foerd.zuschuss)}) verbleibt ein Eigenanteil von {fmtEuro(foerd.eigenanteil)}.
            </p>
          </div>

          {/* 3-Tage-Ablauf */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Montageablauf in {city.name} — 3 Tage im Detail
            </h2>
            <div className="space-y-4">
              {MONTAGE_ABLAUF.map((tag, i) => (
                <div key={i} className="bg-white border border-wp-border rounded-xl p-5 shadow-wp-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{tag.icon}</span>
                    <span className="font-heading font-bold text-wp-text">{tag.tag}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {tag.schritte.map((s, j) => (
                      <li key={j} className="flex gap-2 text-sm text-wp-text2">
                        <CheckCircle size={14} className="text-wp-green shrink-0 mt-0.5" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Kostentabelle */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Komplette Kostenübersicht WP-Montage {city.name}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    {['Position', 'Kosten von', 'Kosten bis', 'Hinweis'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KOSTEN_POSITIONEN.map((k, i) => (
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{k.pos}</td>
                      <td className="px-4 py-3 font-mono text-wp-text2">{fmtEuro(k.von)}</td>
                      <td className="px-4 py-3 font-mono text-wp-text2">{fmtEuro(k.bis)}</td>
                      <td className="px-4 py-3 text-xs text-wp-text3">{k.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-wp-greenxlt border-t-2 border-wp-borderl">
                    <td className="px-4 py-3 font-bold text-wp-text">Gesamt</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-green">{fmtEuro(totalMin)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-green">{fmtEuro(totalMax)}</td>
                    <td className="px-4 py-3 text-xs text-wp-text3">Vor KfW-Förderung</td>
                  </tr>
                  <tr className="bg-wp-greenxlt">
                    <td className="px-4 py-3 font-bold text-wp-green">{`Nach ${foerd.gesamtSatz}% KfW`}</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-green">{fmtEuro(Math.round(totalMin * (1 - foerd.gesamtSatz / 100)))}</td>
                    <td className="px-4 py-3 font-mono font-bold text-wp-green">{fmtEuro(foerd.eigenanteil)}</td>
                    <td className="px-4 py-3 text-xs text-wp-text3">Ihr tatsächlicher Eigenanteil</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Montage-Fehler */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              5 Montage-Fehler und ihre Folgen in {city.name}
            </h2>
            <div className="space-y-3">
              {MONTAGE_FEHLER.map((f, i) => (
                <div key={i} className="p-4 bg-white border border-wp-border rounded-xl">
                  <div className="font-heading font-semibold text-wp-text text-sm mb-1">❌ {f.fehler}</div>
                  <div className="text-wp-text2 text-xs">→ {f.folge}</div>
                </div>
              ))}
            </div>
          </div>

          {/* H3 + FAQ */}
          {faqs.length > 0 && (
            <div className="p-5 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
              <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">Häufige Fragen — WP Montage {city.name}</h2>
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
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-wp-border rounded-2xl p-5 shadow-wp-sm sticky top-6">
            <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Montage-Kennzahlen</div>
            {[
              ['Montagedauer', '2–3 Tage'],
              ['Gesamtkosten', fmtEuro(totalMin) + '–' + fmtEuro(totalMax)],
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
              ['JAZ in ' + city.name, String(jaz)],
              ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
              ['Amortisation', calc.amortisationJahre + ' J.'],
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
        <div className="mt-6 text-xs text-wp-text3">KfW BEG 458 · F-Gas-Verordnung · DWD Klimadaten {city.name} · Stand März 2026</div>
      </div>
    </div>
  );
}
