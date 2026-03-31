// components/programmatic/templates/BeratungTemplate.tsx
// waermepumpe-beratung — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle, AlertTriangle, Calculator, FileText } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1920&q=80';

const SCHRITTE = [
  { icon: '📞', nr: '1', title: 'Erstkontakt & Gebäudecheck (kostenlos)', text: 'Wohnfläche, Baujahr, aktuelle Heizung, Vorlauftemperatur und Dämmzustand. Dauer ca. 10 Minuten. Ergebnis: erste Einschätzung ob WP sinnvoll ist.' },
  { icon: '🏠', nr: '2', title: 'Vor-Ort-Begehung durch Fachbetrieb', text: 'Aufstellort, Heizkreis, Pufferspeicher, Elektroanschluss. Basis für die Heizlastberechnung nach DIN EN 12831. Dauer: 1–2 Stunden.' },
  { icon: '📊', nr: '3', title: 'Heizlastberechnung & Dimensionierung', text: 'Ohne korrekte Heizlast kein richtiges Gerät. Über- oder Unterdimensionierung senkt JAZ und Wirtschaftlichkeit. KfW verlangt diesen Nachweis seit 2024 zwingend.' },
  { icon: '💶', nr: '4', title: 'Förderberechnung & KfW-Antragsbegleitung', text: 'KfW 458: 30% Grundförderung + 20% Klima-Speed-Bonus + ggf. 30% Einkommensbonus + 5% Effizienzbonus. Antrag muss zwingend VOR Baubeginn gestellt werden.' },
  { icon: '📋', nr: '5', title: 'Angebotsvergleich (mind. 3 Betriebe)', text: 'Vollständige Angebote mit Heizlast, Hydraulik, Elektrik und KfW-Begleitung. Preisunterschiede von 20–40% bei identischer Leistung sind in der Praxis häufig.' },
];

const THEMEN = [
  { icon: '🔧', title: 'Geräteauswahl & Hersteller', text: 'Luft-Wasser vs. Sole-Wasser, Hochtemperatur vs. Standard, Propan (R290) für +5% KfW-Bonus. Kein Hersteller passt für jedes Haus.' },
  { icon: '💰', title: 'Wirtschaftlichkeitsberechnung', text: 'Amortisation abhängig von lokalem Strompreis, JAZ, Gasersatz und KfW-Quote. Wir rechnen mit Ihren stadtspezifischen Werten durch.' },
  { icon: '📜', title: 'GEG-Compliance & Fristen', text: 'In Großstädten ab 30.06.2026 gilt die 65%-EE-Pflicht. Eine Wärmepumpe erfüllt das GEG automatisch — ohne Einschränkungen und ohne Risiko.' },
  { icon: '⚠️', title: 'Häufige Fehler vermeiden', text: 'Fehlende Heizlastberechnung, KfW-Antrag nach Baubeginn gestellt, falsche Dimensionierung. Durch strukturierte Beratung alle drei vermeidbar.' },
];

const CHECKLISTE = [
  { item: 'Vorlauftemperatur des aktuellen Heizkreises', why: 'Entscheidet ob Standard- oder Hochtemperatur-WP' },
  { item: 'Baujahr und Dämmzustand des Gebäudes', why: 'Basis für Heizlastberechnung' },
  { item: 'Aktuelle Jahres-Heizkostenabrechnung', why: 'Verbrauchsdaten für Wirtschaftlichkeitsberechnung' },
  { item: 'Grundriss / Wohnfläche je Etage', why: 'Für Heizkreisplanung und Gerätedimensionierung' },
  { item: 'Keller: Nutzung, Größe, Zugangsmöglichkeiten', why: 'Aufstellort Inneneinheit und Pufferspeicher' },
  { item: 'Außenwand: Abstände zur Grundstücksgrenze', why: 'Schallschutz-Anforderungen, ggf. Genehmigungspflicht' },
  { item: 'Stromanschluss: Hauptsicherung, Platz im Verteiler', why: 'WP braucht eigenen Starkstrom-Kreis, ca. €500–1.500 extra' },
];

export default function BeratungTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const intros = [
    `Eine Wärmepumpen-Beratung in ${city.name} ist die Voraussetzung für eine wirtschaftliche Entscheidung. Mit ${city.strompreis} ct/kWh Strompreis und JAZ ${jaz} bei ${city.avgTemp}°C Jahresmittel liegt die Ersparnis gegenüber Erdgas bei ${fmtEuro(calc.ersparnis)}/Jahr. Wer falsch dimensioniert oder den KfW-Antrag zu spät stellt, verliert Förderung und Effizienz.`,
    `Herstellerunabhängige WP-Beratung in ${city.name}: Wir prüfen zuerst ob Ihr Haus geeignet ist — dann erst welches Gerät. Bei ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und JAZ ${jaz} amortisiert sich die Investition nach ${foerd.gesamtSatz}% KfW (${fmtEuro(foerd.zuschuss)}) in ${calc.amortisationJahre} Jahren.`,
    `Häufigste Fehler bei WP-Projekten in ${city.name}: kein Heizlastgutachten, KfW-Antrag zu spät, falsches Gerät für die Vorlauftemperatur. Unsere strukturierte Beratung verhindert alle drei — kostenlos und unabhängig.`,
    `WP-Beratung ${city.name} (${city.bundesland}): ${city.normAussentemp}°C Normaußentemperatur, ${city.avgTemp}°C Jahresmittel, JAZ-Ziel ${jaz}. Betriebskosten: ${fmtEuro(calc.wpKosten)}/Jahr. Eigenanteil nach ${foerd.gesamtSatz}% KfW: ${fmtEuro(foerd.eigenanteil)}.`,
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.slice(0, 5).map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
          {city.einwohner >= 100000 && (
            <div className="inline-block bg-wp-amber text-wp-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              GEG-Frist {city.name}: {city.gegFrist.split('-').reverse().join('.')}
            </div>
          )}
          <h1 className="font-heading font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: `${foerd.gesamtSatz}%`, label: 'KfW-Förderung', sub: 'Eigennutzer' },
              { val: fmtEuro(foerd.zuschuss), label: 'Zuschuss', sub: 'nicht rückzahlbar' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'nach Förderung' },
              { val: `${fmtEuro(calc.ersparnis)}/J.`, label: 'Ersparnis', sub: 'vs. Erdgas' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/30 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Kostenlose Beratung starten →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet H2 */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Wo bekomme ich eine unabhängige WP-Beratung in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Unabhängige WP-Beratung in <strong>{city.name}</strong> bietet Wärmepumpenbegleiter.de kostenlos an: Gebäudecheck, Heizlastberechnung, Förderberechnung ({foerd.gesamtSatz}% KfW = {fmtEuro(foerd.zuschuss)}) und Vermittlung von bis zu 3 geprüften Fachbetrieben. Herstellerneutral, 14 Jahre Erfahrung in {city.bundesland}.
            </p>
          </div>

          {/* 5-Schritte Beratungsablauf */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-6">
              {fillTemplate('Wie läuft eine WP-Beratung in {stadt} ab? — 5 Schritte', city, jaz)}
            </h2>
            <div className="space-y-3">
              {SCHRITTE.map((s, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white border border-wp-border rounded-xl shadow-wp-sm">
                  <div className="text-2xl shrink-0">{s.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-1">Schritt {s.nr}</div>
                    <div className="font-heading font-bold text-wp-text text-sm mb-1">{s.title}</div>
                    <p className="text-wp-text2 text-sm leading-relaxed">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beratungsthemen */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Was deckt die Beratung ab? — Themenübersicht
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {THEMEN.map((t, i) => (
                <div key={i} className="p-4 bg-white border border-wp-border rounded-xl">
                  <div className="text-xl mb-2">{t.icon}</div>
                  <div className="font-heading font-semibold text-wp-text text-sm mb-1">{t.title}</div>
                  <p className="text-wp-text2 text-xs leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checkliste */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Checkliste Erstgespräch — was Sie mitbringen sollten
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    <th className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">Unterlagen / Info</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">Warum wichtig</th>
                  </tr>
                </thead>
                <tbody>
                  {CHECKLISTE.map((row, i) => (
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{row.item}</td>
                      <td className="px-4 py-3 text-wp-text2 text-sm">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stadtspezifisch */}
          <div className="p-6 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">{city.name} ({city.bundesland}) — Ihre Beratungsgrundlage</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
              {[
                [`${city.avgTemp}°C`, 'Jahresmittel'],
                [jaz.toString(), 'Erwartete JAZ'],
                [`${city.strompreis} ct/kWh`, 'Strompreis'],
                [fmtEuro(calc.wpKosten) + '/J.', 'WP-Betriebskosten'],
                [fmtEuro(calc.ersparnis) + '/J.', 'Ersparnis vs. Gas'],
                [fmtEuro(foerd.zuschuss), 'KfW-Zuschuss'],
              ].map(([v, l], i) => (
                <div key={i}><div className="text-wp-text3 text-xs">{l}</div><div className="font-bold text-wp-text">{v}</div></div>
              ))}
            </div>
            {city.bundeslandFoerderung && (
              <p className="text-sm text-wp-text2 pt-3 border-t border-wp-borderl">
                <strong>{city.bundesland}:</strong> {city.bundeslandFoerderung}
              </p>
            )}
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
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Häufige Fragen — Wärmepumpe Beratung {city.name}
            </h2>
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

          {/* Links */}
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
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ').replace('foerderung','Förderung').replace('installateur','Installateur')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border border-wp-border rounded-2xl p-5 shadow-wp-sm sticky top-6">
            <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Kennzahlen</div>
            {[
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Förderquote', `${foerd.gesamtSatz}%`],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
              ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
              ['JAZ in ' + city.name, String(jaz)],
              ['Amortisation', `${calc.amortisationJahre} J.`],
              ['GEG-Frist', city.gegFrist.split('-').reverse().join('.')],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-wp-border last:border-0 text-sm">
                <span className="text-wp-text2">{l}</span>
                <span className="font-bold text-wp-text">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-wp-green text-white font-bold py-3 rounded-xl hover:bg-wp-green2 transition-colors text-sm">
              Kostenloses Angebot →
            </a>
          </div>
        </div>
      </div>

      <div id="angebot" className="bg-wp-dark py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Bis zu 3 Angebote für {city.name} — in 2 Minuten</h2>
          <p className="text-white/60 text-center text-sm mb-8">Kostenlos · Herstellerunabhängig · KfW-Begleitung inklusive</p>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">Klimadaten: DWD · Förderrecht: KfW/BAFA · Effizienz: Fraunhofer ISE · Stand März 2026</div>
      </div>
    </div>
  );
}
