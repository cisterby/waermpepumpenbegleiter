// app/faq/page.tsx — Dedizierte FAQ-Seite mit FAQPage-Schema
import type { Metadata } from 'next';
import Link from 'next/link';
import { BASE } from '@/lib/constants';

const FAQ_ITEMS = [
  // Kosten & Förderung
  {
    category: 'Kosten & Förderung',
    items: [
      {
        q: 'Was kostet eine Wärmepumpe komplett installiert?',
        a: 'Eine Luft-Wasser-Wärmepumpe kostet inklusive Installation zwischen 18.000 und 35.000 €. Der Preis hängt von der Heizlast (Gebäudegröße, Dämmzustand), dem Wärmepumpentyp und regionalen Installateurspreisen ab. Erdwärmepumpen liegen mit 25.000–45.000 € höher, sind aber effizienter.',
      },
      {
        q: 'Wie hoch ist die KfW-Förderung 2026?',
        a: 'Die KfW-Förderung beträgt 30 % Grundförderung + bis zu 20 % Klimageschwindigkeitsbonus (bei Austausch einer fossilen Heizung) + 30 % Einkommensbonus (bei max. 40.000 € Haushaltseinkommen). Maximal sind 70 % Förderung auf eine förderfähige Basis von 30.000 € möglich — also bis zu 21.000 € Zuschuss.',
      },
      {
        q: 'Lohnt sich eine Wärmepumpe finanziell?',
        a: 'In den meisten Fällen ja. Typische Einsparungen liegen bei 500–1.500 €/Jahr gegenüber Gas und 1.000–2.500 €/Jahr gegenüber Öl. Die Amortisation dauert nach Abzug der Förderung zwischen 5 und 10 Jahren. Mit einem Wärmepumpenstromtarif und PV-Anlage verkürzt sich die Amortisation weiter.',
      },
      {
        q: 'Gibt es zusätzliche Landes-Förderung?',
        a: 'Ja, einige Bundesländer bieten zusätzliche Förderungen: z. B. Baden-Württemberg (Wohnraumförderung BW), NRW (progres.nrw) oder Thüringen (GreenInvest). Diese lassen sich teilweise mit der KfW-Förderung kombinieren. Prüfen Sie die aktuellen Programme über unsere Stadtseiten.',
      },
    ],
  },
  // Technik & Installation
  {
    category: 'Technik & Installation',
    items: [
      {
        q: 'Welche Wärmepumpe ist die beste für mein Haus?',
        a: 'Für Einfamilienhäuser ist die Luft-Wasser-Wärmepumpe in 90 % der Fälle die wirtschaftlichste Wahl. Erdwärmepumpen sind effizienter (JAZ 4,5–5,0 vs. 3,0–4,0), aber teurer in der Anschaffung. Für Altbauten mit hohen Vorlauftemperaturen (>55 °C) eignen sich Hochtemperatur-Wärmepumpen mit R290-Kältemittel.',
      },
      {
        q: 'Funktioniert eine Wärmepumpe im Altbau?',
        a: 'Ja, moderne Wärmepumpen arbeiten auch bei Vorlauftemperaturen bis 75 °C effizient. Im Altbau empfiehlt sich eine fachgerechte Heizlastberechnung nach DIN EN 12831. Oft genügt ein Heizkörper-Upgrade (größere Radiatoren oder Niedertemperatur-Heizkörper) statt einer Komplettsanierung. Die JAZ liegt im Altbau typisch zwischen 2,8 und 3,5.',
      },
      {
        q: 'Wie lange dauert die Installation?',
        a: 'Eine Luft-Wasser-Wärmepumpe wird in der Regel innerhalb von 2–5 Arbeitstagen installiert. Die Vorbereitungsphase (Planung, Genehmigung, Bestellung) dauert 4–12 Wochen. Von der ersten Anfrage bis zur Inbetriebnahme vergehen typischerweise 2–4 Monate.',
      },
      {
        q: 'Wie laut ist eine Wärmepumpe?',
        a: 'Moderne Luft-Wasser-Wärmepumpen erzeugen im Betrieb 35–50 dB(A) in 3 Metern Entfernung — vergleichbar mit einem leisen Kühlschrank. Gesetzlich müssen die Grenzwerte der TA Lärm eingehalten werden: 35 dB(A) nachts in reinen Wohngebieten. Durch Nachtabsenkung und schalloptimierte Aufstellung ist das kein Problem.',
      },
      {
        q: 'Was ist die Jahresarbeitszahl (JAZ)?',
        a: 'Die JAZ gibt das Verhältnis von erzeugter Wärme zu eingesetztem Strom über ein ganzes Jahr an. Eine JAZ von 3,5 bedeutet: Aus 1 kWh Strom werden 3,5 kWh Wärme. Für die KfW-Förderung muss die rechnerische JAZ mindestens 2,7 betragen. Typische Werte: Luft-Wasser 3,0–4,0, Erdwärme 4,0–5,0.',
      },
    ],
  },
  // GEG & Rechtliches
  {
    category: 'GEG & Rechtliches',
    items: [
      {
        q: 'Muss ich meine Gasheizung jetzt tauschen?',
        a: 'Nicht sofort, aber das Gebäudeenergiegesetz (GEG) schreibt vor, dass ab 2024 in Neubaugebieten nur noch Heizungen mit min. 65 % erneuerbaren Energien eingebaut werden dürfen. Für Bestandsgebäude greift die Pflicht spätestens mit der kommunalen Wärmeplanung — in Großstädten (>100.000 EW) ab Mitte 2026, in kleineren Kommunen ab Mitte 2028.',
      },
      {
        q: 'Was passiert wenn die kommunale Wärmeplanung vorliegt?',
        a: 'Sobald die kommunale Wärmeplanung veröffentlicht ist, müssen neue Heizungsanlagen die 65-%-EE-Vorgabe erfüllen. Bestehende Gas-/Ölheizungen dürfen weiter betrieben und repariert werden, aber bei einem Austausch muss das neue System GEG-konform sein. Übergangsfrist: bis zu 5 Jahre nach Vorliegen des Plans.',
      },
      {
        q: 'Brauche ich eine Genehmigung für die Wärmepumpe?',
        a: 'Luft-Wasser-Wärmepumpen sind in den meisten Bundesländern genehmigungsfrei, solange Abstands- und Lärmschutzvorschriften eingehalten werden. Erdwärmesonden erfordern eine wasserrechtliche Genehmigung (Untere Wasserbehörde) und in Wasserschutzgebieten eine Sondergenehmigung. Ihr Installateur kümmert sich in der Regel um die Anträge.',
      },
    ],
  },
  // Betrieb & Wartung
  {
    category: 'Betrieb & Wartung',
    items: [
      {
        q: 'Was kostet der Strom für eine Wärmepumpe?',
        a: 'Bei einem Verbrauch von ca. 4.500–6.000 kWh/Jahr und einem WP-Stromtarif von 22–28 ct/kWh liegen die jährlichen Stromkosten bei 1.000–1.700 €. Das ist 30–50 % günstiger als Gas oder Öl. Mit einer PV-Anlage (Eigenverbrauch) sinken die Kosten um weitere 20–40 %.',
      },
      {
        q: 'Wie oft muss eine Wärmepumpe gewartet werden?',
        a: 'Eine jährliche Inspektion wird empfohlen und kostet ca. 150–300 €. Der F-Gas-Check (bei Kältemittelmenge >3 kg) ist gesetzlich vorgeschrieben. Wärmepumpen haben eine Lebensdauer von 15–25 Jahren und deutlich geringere Wartungskosten als Gas-/Ölheizungen (kein Schornsteinfeger, keine Brennerwartung).',
      },
      {
        q: 'Kann ich eine Wärmepumpe mit PV kombinieren?',
        a: 'Ja, und das ist sehr empfehlenswert. Mit einer 8–10 kWp PV-Anlage können 20–40 % des WP-Stroms selbst erzeugt werden. Mit Batteriespeicher steigt der Eigenverbrauchsanteil auf 40–60 %. Die Kombination reduziert die Heizkosten um 300–600 €/Jahr zusätzlich und verbessert die Gesamtbilanz erheblich.',
      },
    ],
  },
  // Service & Vermittlung
  {
    category: 'Unser Service',
    items: [
      {
        q: 'Ist die Vermittlung wirklich kostenlos?',
        a: 'Ja, unser Service ist für Sie zu 100 % kostenlos und unverbindlich. Wir finanzieren uns durch eine Vermittlungsprovision der Partnerbetriebe. Sie erhalten bis zu 3 Angebote geprüfter Fachbetriebe aus Ihrer Region und entscheiden frei, ob Sie eines davon annehmen.',
      },
      {
        q: 'Wie werden die Fachbetriebe ausgewählt?',
        a: 'Alle Partnerbetriebe werden anhand von 7 Qualitätskriterien geprüft: HWK-Eintragung, KfW-Registrierung, F-Gas-Zertifikat (EU 517/2014), mindestens 5 dokumentierte WP-Installationen, Haftpflichtversicherung min. 1,5 Mio. €, Reaktionszeit unter 48h und Kundenbewertung min. 4,0/5,0.',
      },
      {
        q: 'Wie schnell erhalte ich Angebote?',
        a: 'In der Regel melden sich geprüfte Fachbetriebe innerhalb von 48 Stunden direkt bei Ihnen. In Ballungsgebieten kann es schneller gehen (oft bereits am gleichen Tag), in ländlichen Regionen kann die Vermittlung 3–5 Werktage dauern.',
      },
    ],
  },
];

// Flatten for schema
const allFaqItems = FAQ_ITEMS.flatMap(cat => cat.items);

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqItems.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Startseite', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Häufige Fragen (FAQ)', item: `${BASE}/faq` },
  ],
};

export const metadata: Metadata = {
  title: 'Häufige Fragen zur Wärmepumpe (FAQ) 2026 | Wärmepumpenbegleiter',
  description: 'Antworten auf die 20 häufigsten Fragen zu Wärmepumpen: Kosten, KfW-Förderung 2026, Altbau-Eignung, GEG-Pflichten, JAZ-Werte, Installation und Stromverbrauch.',
  alternates: {
    canonical: `${BASE}/faq`,
  },
  openGraph: {
    title: 'Häufige Fragen zur Wärmepumpe (FAQ) 2026',
    description: 'Antworten auf die 20 häufigsten Fragen zu Wärmepumpen: Kosten, Förderung, Technik, GEG und mehr.',
    url: `${BASE}/faq`,
    type: 'website',
    locale: 'de_DE',
    siteName: 'Wärmepumpenbegleiter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Häufige Fragen zur Wärmepumpe (FAQ) 2026',
    description: 'Antworten auf die 20 häufigsten Fragen zu Wärmepumpen: Kosten, Förderung, Technik, GEG und mehr.',
  },
  robots: { index: true, follow: true },
};

const TOP_CITIES = [
  { name: 'Berlin', slug: 'berlin' },
  { name: 'Hamburg', slug: 'hamburg' },
  { name: 'München', slug: 'muenchen' },
  { name: 'Köln', slug: 'koeln' },
  { name: 'Frankfurt', slug: 'frankfurt-am-main' },
  { name: 'Stuttgart', slug: 'stuttgart' },
  { name: 'Düsseldorf', slug: 'duesseldorf' },
  { name: 'Leipzig', slug: 'leipzig' },
  { name: 'Dortmund', slug: 'dortmund' },
  { name: 'Dresden', slug: 'dresden' },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-wp-bg font-sans pt-24 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-wp-text3 mb-8">
          <Link href="/" className="hover:text-wp-green transition-colors">Startseite</Link>
          <span>/</span>
          <span className="text-wp-text font-semibold">FAQ</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="font-heading font-extrabold text-wp-text text-3xl sm:text-4xl mb-4">
            Häufige Fragen zur Wärmepumpe
          </h1>
          <p className="text-wp-text2 text-lg leading-relaxed max-w-2xl">
            {allFaqItems.length} Antworten zu Kosten, Förderung, Technik, GEG-Pflichten und unserem kostenlosen Vermittlungsservice — verständlich erklärt.
          </p>
        </header>

        {/* Quick navigation */}
        <div className="bg-white border border-wp-border rounded-2xl p-6 mb-10">
          <p className="font-heading font-bold text-wp-text text-sm mb-3">Direkt zum Thema:</p>
          <div className="flex flex-wrap gap-2">
            {FAQ_ITEMS.map(cat => (
              <a key={cat.category} href={`#${cat.category.toLowerCase().replace(/[^a-zäöü]/g, '-')}`}
                className="inline-flex items-center px-3 py-1.5 bg-wp-greenlt text-wp-green text-xs font-semibold rounded-full hover:bg-wp-green hover:text-white transition-colors">
                {cat.category}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        {FAQ_ITEMS.map(cat => (
          <section key={cat.category} id={cat.category.toLowerCase().replace(/[^a-zäöü]/g, '-')} className="mb-12">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-wp-green rounded-lg flex items-center justify-center text-white text-xs font-bold">
                {cat.items.length}
              </span>
              {cat.category}
            </h2>

            <div className="space-y-4">
              {cat.items.map((item, i) => (
                <details key={i} className="group bg-white border border-wp-border rounded-xl hover:border-wp-green/40 transition-colors">
                  <summary className="flex items-start gap-3 cursor-pointer p-5 select-none [&::-webkit-details-marker]:hidden list-none">
                    <span className="shrink-0 w-6 h-6 bg-wp-greenlt text-wp-green rounded-full flex items-center justify-center text-xs font-bold mt-0.5 group-open:bg-wp-green group-open:text-white transition-colors">?</span>
                    <span className="font-heading font-semibold text-wp-text text-sm leading-relaxed">{item.q}</span>
                  </summary>
                  <div className="px-5 pb-5 pl-14">
                    <p className="text-wp-text2 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#1A4731] to-[#0A1910] rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-white text-xl mb-3">
            Noch Fragen? Wir helfen persönlich.
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
            Lassen Sie sich kostenlos und unverbindlich von geprüften Fachbetrieben aus Ihrer Region beraten.
          </p>
          <Link href="/kontakt"
            className="inline-flex items-center gap-2 bg-[#D97706] text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors">
            Kostenlose Beratung anfordern →
          </Link>
        </div>

        {/* Internal links to city pages */}
        <div className="mt-12 bg-white border border-wp-border rounded-2xl p-6">
          <h2 className="font-heading font-bold text-wp-text text-lg mb-4">Wärmepumpe in Ihrer Stadt</h2>
          <div className="flex flex-wrap gap-2">
            {TOP_CITIES.map(city => (
              <Link key={city.slug} href={`/waermepumpe/${city.slug}`}
                className="px-3 py-1.5 bg-wp-bg text-wp-text2 text-xs font-semibold rounded-full hover:bg-wp-greenlt hover:text-wp-green transition-colors border border-wp-border">
                Wärmepumpe {city.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
