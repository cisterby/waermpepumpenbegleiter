// app/[keywordSlug]/page.tsx
// 22 Pillar Pages — Keyword-Übersichtsseiten mit Top-50-Städten
// Zweck: Internes Linking-Hub, Keyword-Autorität, GSC-Coverage

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, MapPin, TrendingUp, CheckCircle } from 'lucide-react';
import { KEYWORDS, getKeywordBySlug } from '@/lib/keywords';
import citiesData from '@/lib/cities.json';
import type { City } from '@/lib/city-utils';

interface Props {
  params: { keywordSlug: string };
}

export async function generateStaticParams() {
  return KEYWORDS.map(kw => ({ keywordSlug: kw.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const keyword = getKeywordBySlug(params.keywordSlug);
  if (!keyword) return {};

  const title = `${keyword.keyword.replace('[Stadt]', '').trim()} 2026 — Alle Städte im Überblick | Wärmepumpenbegleiter`;
  const desc  = `${keyword.keyword.replace('[Stadt]', '').trim()} in Ihrer Stadt — ${(citiesData as City[]).length} Städte, aktuelle Preise 2026, bis zu 70% KfW-Förderung. Geprüfte Fachbetriebe kostenlos vergleichen.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `https://waermepumpenbegleiter.de/${keyword.slug}` },
    openGraph: { title, description: desc, type: 'website', locale: 'de_DE' },
    robots: { index: true, follow: true },
  };
}

// Keyword-spezifische Inhalte für jede Pillar Page
const PILLAR_CONTENT: Record<string, {
  headline: string;
  intro: string;
  sections: Array<{ title: string; text: string }>;
  stats: Array<{ val: string; label: string }>;
}> = {
  'waermepumpe': {
    headline: 'Wärmepumpe in Deutschland 2026 — Alle Städte',
    intro: 'Eine Wärmepumpe ist 2026 die klügste Heizungsentscheidung: bis zu 70% KfW-Förderung, GEG-konform, 3× effizienter als eine Gasheizung. Wir vermitteln kostenlos an geprüfte Fachbetriebe in 733 deutschen Städten.',
    stats: [{ val: '733', label: 'Städte' }, { val: '70%', label: 'Max. KfW' }, { val: '€21.000', label: 'Max. Zuschuss' }, { val: 'Kostenlos', label: 'Unser Service' }],
    sections: [
      { title: 'Warum 2026 der richtige Zeitpunkt ist', text: 'Das GEG 2024 macht erneuerbare Energie bei Heizungsersatz verpflichtend. Die KfW-Förderung ist so attraktiv wie nie — bis 70% Zuschuss für Eigennutzer. Gleichzeitig sind die Anlagenpreise nach dem Boom 2022/23 wieder gesunken. Wer jetzt handelt, kombiniert maximale Förderung mit stabilen Preisen.' },
      { title: 'KfW-Förderung 2026 auf einen Blick', text: '30% Grundförderung + 20% Klima-Speed-Bonus (Ersatz fossiler Heizung) + bis 30% Einkommensbonus + 5% Kältemittelbonus = max. 70% auf bis zu €30.000 förderfähige Kosten = max. €21.000 nicht rückzahlbarer Zuschuss. Der Antrag muss vor Baubeginn gestellt werden.' },
      { title: 'Welche Wärmepumpe passt zu Ihrem Haus?', text: 'Für 92% der Häuser ist die Luft-Wasser-Wärmepumpe die richtige Wahl: keine Bohrung nötig, JAZ 3,2–4,0, GEG-konform, KfW-förderungsfähig. Für Häuser mit Erdreich: Sole-Wasser-WP (JAZ 4,3+, +5% KfW-Bonus). Für Grundwasserzugang: Wasser-Wasser-WP (JAZ 5,0+, höchste Effizienz).' },
    ],
  },
  'waermepumpe-kosten': {
    headline: 'Wärmepumpe Kosten 2026 — Alle Städte im Vergleich',
    intro: 'Die Kosten einer Wärmepumpe variieren je nach Stadt, Gebäude und Typ. Wir zeigen die vollständigen Kosten — Gerät, Installation, Nebenkosten — und was nach KfW-Förderung übrig bleibt. Für jede der 733 deutschen Städte individuell berechnet.',
    stats: [{ val: '€18–28k', label: 'Luft-WP gesamt' }, { val: '50–70%', label: 'KfW-Förderung' }, { val: '7–12 J.', label: 'Amortisation' }, { val: '20–25 J.', label: 'Lebensdauer' }],
    sections: [
      { title: 'Was kostet eine Wärmepumpe komplett?', text: 'Luft-Wasser-WP: €18.000–28.000 brutto (Gerät €10.000–18.000 + Montage €3.000–5.000 + Hydraulik €1.200 + Elektrik €1.000). Sole-Wasser mit Bohrung: €22.000–35.000. Wasser-Wasser: €25.000–40.000. Nach 50% KfW-Förderung: ab €9.000 Eigenanteil für eine Luft-WP.' },
      { title: 'Versteckte Kosten — was Angebote oft weglassen', text: 'Hydraulischer Abgleich (€500–1.500, KfW-Pflicht!), Fundament/Aufstellung (€300–800), Zähler-Upgrade für WP-Tarif (€500–1.500), optional Pufferspeicher (€800–2.000). Seriöse Angebote weisen alle Positionen einzeln aus. Wir stellen sicher, dass alle 3 Vergleichsangebote vollständig sind.' },
      { title: 'Stadtspezifische Betriebskosten', text: 'Die laufenden Kosten hängen vom lokalen Strompreis ab (26–32 ct/kWh je nach Region) und von der erreichbaren JAZ Ihrer Stadt. In wärmeren Städten (JAZ 3,8+) liegen die Jahreskosten unter €1.200, in kälteren Regionen höher. Wählen Sie Ihre Stadt für die genaue Berechnung.' },
    ],
  },
  'waermepumpe-foerderung': {
    headline: 'Wärmepumpe Förderung 2026 — Alle Bundesländer & Städte',
    intro: 'Bis zu 70% KfW-Zuschuss für Wärmepumpen — nicht rückzahlbar, direkt ausgezahlt. Dazu kommen in vielen Bundesländern eigene Förderprogramme. Alle Förderungen 2026 für 733 Städte erklärt.',
    stats: [{ val: '70%', label: 'Max. KfW-Satz' }, { val: '€21.000', label: 'Max. Zuschuss' }, { val: '16', label: 'Bundesländer' }, { val: 'Vor Baubeginn', label: 'Antrag stellen' }],
    sections: [
      { title: 'KfW BEG Programm 458 — die Hauptförderung', text: '30% Grundförderung für alle + 20% Klima-Speed-Bonus (Eigennutzer, Ersatz fossiler Heizung) + 30% Einkommensbonus (unter €40.000 Haushaltseinkommen) + 5% Kältemittelbonus (R290 oder Erdwärme/Grundwasser). Maximale Förderung: 70% auf bis zu €30.000 = €21.000 Zuschuss.' },
      { title: 'Bundesland-Förderungen zusätzlich zur KfW', text: 'Hamburg (IFB: €90/kW), NRW (progres.nrw: €50/m Bohrung), Baden-Württemberg (L-Bank Kombi-Darlehen), Niedersachsen (NBank: bis €7.250), Hessen (Klimaschutzprogramm). Bayern: 10.000-Häuser-Programm eingestellt. Berlin: aktuell ausgesetzt. Wählen Sie Ihre Stadt für die aktuellen Landesförderungen.' },
      { title: 'Antragsprozess — Schritt für Schritt', text: '1. Fachbetrieb mit KfW-LuL-Registrierung beauftragen. 2. KfW-Antrag im Online-Portal stellen (ZWINGEND VOR Baubeginn). 3. Genehmigung abwarten. 4. Installation durchführen. 5. Verwendungsnachweis einreichen. 6. Auszahlung (4–8 Wochen). Wir begleiten Sie durch jeden Schritt.' },
    ],
  },
  'waermepumpe-installateur': {
    headline: 'Wärmepumpe Installateur — Geprüfte Betriebe in 733 Städten',
    intro: 'Nicht jeder SHK-Betrieb ist ein WP-Fachbetrieb. Für die KfW-Förderung brauchen Sie einen registrierten Lieferanten- und Leistungserbringer. Alle unsere Partnerbetriebe sind HWK-geprüft und KfW-registriert.',
    stats: [{ val: '3', label: 'Angebote kostenlos' }, { val: '48h', label: 'Reaktionszeit' }, { val: 'HWK', label: 'Alle geprüft' }, { val: '733', label: 'Städte abgedeckt' }],
    sections: [
      { title: 'Was einen WP-Fachbetrieb ausmacht', text: 'HWK-eingetragener Meisterbetrieb, mindestens 5 dokumentierte WP-Installationen, KfW-Lieferanten- und Leistungserbringer (LuL) Registrierung, gültige Haftpflichtversicherung, vollständige Angebote mit allen Positionen. Alle unsere Partnerbetriebe erfüllen diese Kriterien — vorab von uns geprüft.' },
      { title: 'Lokal vs. bundesweit — was ist besser?', text: 'Lokale Betriebe kennen den Netzbetreiber, die lokalen Auflagen und sind bei Störungen schnell vor Ort. Bundesweite Anbieter setzen oft auf Subunternehmer. Wir vermitteln ausschließlich an lokale, ansässige Meisterbetriebe — in 733 deutschen Städten.' },
      { title: 'Warum mindestens 3 Angebote?', text: 'Die Verbraucherzentrale empfiehlt mindestens 3 Vergleichsangebote. Preisunterschiede von 20–40% bei gleicher Leistung sind keine Seltenheit. Entscheidend: Alle Angebote müssen vollständig und vergleichbar sein — inklusive hydraulischem Abgleich und KfW-Antragsbegleitung.' },
    ],
  },
  'luft-wasser-waermepumpe': {
    headline: 'Luft-Wasser-Wärmepumpe — 733 Städte, Effizienz, Kosten 2026',
    intro: 'Die Luft-Wasser-Wärmepumpe ist mit 92% Marktanteil die meistgekaufte Wärmepumpenart in Deutschland. Sie braucht keine Erdbohrung, ist in fast jedem Haus nachrüstbar und erreicht eine JAZ von 3,2–4,2 je nach Standort.',
    stats: [{ val: '92%', label: 'Marktanteil' }, { val: '3,2–4,2', label: 'JAZ je Standort' }, { val: '70°C', label: 'Max. Vorlauf' }, { val: '1–3 Tage', label: 'Installation' }],
    sections: [
      { title: 'Wie funktioniert eine Luft-Wasser-WP?', text: 'Die Luft-Wasser-WP entzieht der Außenluft Wärme und überträgt sie auf das Heizwasser. Der Kälteprozess (Verdampfer → Kompressor → Verflüssiger → Expansionsventil) erzeugt dabei 3–4 kWh Wärme aus 1 kWh Strom. Auch bei -20°C Außentemperatur arbeitet eine moderne Hochtemperatur-WP zuverlässig.' },
      { title: 'Für welche Häuser ist die Luft-WP geeignet?', text: 'Fast alle Einfamilienhäuser in Deutschland sind geeignet. Wichtig: Vorlauftemperatur unter 70°C (Standard) oder unter 55°C (optimal). Ein hydraulischer Abgleich verbessert die Effizienz. Platzbedarf: ca. 1 m² für die Außeneinheit + Abstand zur Grundstücksgrenze (je nach Bundesland 2–3 m).' },
      { title: 'Luft-Wasser vs. Erdwärme — wann was?', text: 'Luft-WP: Keine Genehmigung, keine Bohrung, JAZ 3,2–4,2, 92% günstiger. Erdwärme: Höhere JAZ (4,3+), +5% KfW-Bonus, konstante Effizienz, aber Bohrung (€6.000–12.000) und Genehmigung nötig. Faustregel: Gut gedämmtes Haus mit Fußbodenheizung → Erdwärme prüfen. Sonst: Luft-WP.' },
    ],
  },
};

// Generischen Content für alle anderen Keywords
function getDefaultContent(keyword: { keyword: string; slug: string; baseVolume: number; intent: string }) {
  const kw = keyword.keyword.replace('[Stadt]', '').trim();
  return {
    headline: `${kw} 2026 — Alle deutschen Städte`,
    intro: `${kw} in Ihrer Stadt: Stadtspezifische Berechnungen, aktuelle Preise 2026, bis zu 70% KfW-Förderung. Geprüfte Fachbetriebe in 733 deutschen Städten kostenlos vergleichen.`,
    stats: [
      { val: '733', label: 'Städte' },
      { val: '70%', label: 'Max. KfW' },
      { val: '€21.000', label: 'Max. Zuschuss' },
      { val: 'Kostenlos', label: 'Unser Service' },
    ],
    sections: [
      {
        title: `${kw} — was Sie wissen müssen`,
        text: `${kw} ist 2026 eine der gefragtesten Leistungen rund um die Wärmepumpe. Das GEG verpflichtet seit 2024 zu 65% erneuerbarer Energie beim Heizungsersatz. Die KfW-Förderung macht Wärmepumpen mit bis zu 70% Zuschuss attraktiv wie nie. Wählen Sie Ihre Stadt für stadtspezifische Berechnungen.`,
      },
      {
        title: 'KfW-Förderung nutzen',
        text: 'Bis zu 70% KfW-Zuschuss (max. €21.000) für Wärmepumpen — nicht rückzahlbar. Antrag zwingend VOR Baubeginn stellen. Unser Service: Wir verbinden Sie mit einem Fachbetrieb, der den KfW-Antrag für Sie übernimmt.',
      },
      {
        title: 'Kostenloser Vergleich in Ihrer Stadt',
        text: 'Wählen Sie Ihre Stadt aus der Liste unten — Sie erhalten eine stadtspezifische Seite mit lokalen Preisen, erreichbarer JAZ, regionaler Förderung und bis zu 3 kostenlosen Angeboten geprüfter Fachbetriebe.',
      },
    ],
  };
}

export default function PillarPage({ params }: Props) {
  const keyword = getKeywordBySlug(params.keywordSlug);
  if (!keyword) notFound();

  const cities = citiesData as City[];
  const content = PILLAR_CONTENT[keyword.slug] ?? getDefaultContent(keyword);

  // Top-Städte nach Einwohnerzahl für die prominente Anzeige
  const topCities = [...cities]
    .sort((a, b) => b.einwohner - a.einwohner)
    .slice(0, 30);

  // Alle Städte alphabetisch für die vollständige Liste
  const allCitiesByState = cities.reduce((acc, city) => {
    if (!acc[city.bundesland]) acc[city.bundesland] = [];
    acc[city.bundesland].push(city);
    return acc;
  }, {} as Record<string, City[]>);

  // Cross-Links zu anderen Keyword-Seiten
  const crossKeywords = keyword.crossLinks
    .map(s => getKeywordBySlug(s))
    .filter(Boolean)
    .slice(0, 6);

  const kw = keyword.keyword.replace('[Stadt]', '').trim();

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      {/* HERO */}
      <div className="bg-wp-dark py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-6 text-white/40">
            <a href="/" className="hover:text-white/70 transition-colors">Startseite</a>
            <span>›</span>
            <span className="text-white/80">{kw}</span>
          </nav>
          <h1 className="font-heading font-extrabold text-white mb-4" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
            {content.headline}
          </h1>
          <p className="text-white/65 text-lg leading-relaxed max-w-3xl mb-8">
            {content.intro}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {content.stats.map((s, i) => (
              <div key={i} className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
                <div className="font-mono font-extrabold text-wp-amber text-xl leading-none mb-1">{s.val}</div>
                <div className="text-white/45 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Inhalt-Sektionen */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {content.sections.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-wp-border shadow-wp-sm">
              <h2 className="font-heading font-bold text-wp-text text-base mb-3">{s.title}</h2>
              <p className="text-wp-text2 text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Top-Städte prominent */}
        <div className="mb-14">
          <h2 className="font-heading font-bold text-wp-text text-2xl mb-2">
            {kw} — Großstädte
          </h2>
          <p className="text-wp-text2 text-sm mb-6">
            {topCities.length} größte Städte mit den meisten Suchanfragen — direkt zur stadtspezifischen Seite mit Preisen, JAZ und Förderung.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {topCities.map(city => (
              <a key={city.slug} href={`/${keyword.slug}/${city.slug}`}
                className="group bg-white rounded-xl p-3 border border-wp-border hover:border-wp-green hover:shadow-wp-sm transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} className="text-wp-green shrink-0" />
                  <span className="font-semibold text-wp-text text-xs group-hover:text-wp-green transition-colors truncate">{city.name}</span>
                </div>
                <p className="text-wp-text3 text-xs">{(city.einwohner / 1000).toFixed(0)}k EW</p>
              </a>
            ))}
          </div>
        </div>

        {/* Cross-Keywords */}
        {crossKeywords.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-wp-border shadow-wp-sm mb-14">
            <h2 className="font-heading font-bold text-wp-text text-lg mb-4">Verwandte Themen</h2>
            <div className="flex flex-wrap gap-3">
              {crossKeywords.map(kw2 => kw2 && (
                <a key={kw2.slug} href={`/${kw2.slug}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-wp-bg border border-wp-border rounded-xl text-sm font-semibold text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                  {kw2.keyword.replace('[Stadt]', '').trim()}
                  <ArrowRight size={13} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Alle Städte nach Bundesland */}
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-2">
          {kw} — Alle 733 Städte
        </h2>
        <p className="text-wp-text2 text-sm mb-8">
          Wählen Sie Ihre Stadt für stadtspezifische Preise, erreichbare JAZ, regionale Förderung und kostenlose Angebote.
        </p>

        <div className="space-y-8">
          {Object.entries(allCitiesByState)
            .sort(([a], [b]) => a.localeCompare(b, 'de'))
            .map(([state, stateCities]) => (
              <div key={state}>
                <h3 className="font-heading font-semibold text-wp-text text-base mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-wp-green rounded-full shrink-0" />
                  {state}
                  <span className="text-wp-text3 font-normal text-sm">({stateCities.length} Städte)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {stateCities
                    .sort((a, b) => b.einwohner - a.einwohner)
                    .map(city => (
                      <a key={city.slug} href={`/${keyword.slug}/${city.slug}`}
                        className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                        {city.name}
                      </a>
                    ))}
                </div>
              </div>
            ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 bg-wp-dark rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-white text-2xl mb-2">
            Ihre Stadt nicht gefunden?
          </h2>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Wir sind in ganz Deutschland aktiv. Senden Sie uns eine Anfrage — wir finden geprüfte Fachbetriebe auch in Ihrer Nähe.
          </p>
          <a href="/kontakt"
            className="inline-flex items-center gap-2 px-7 py-4 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-all hover:-translate-y-0.5">
            Kostenlos anfragen <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
