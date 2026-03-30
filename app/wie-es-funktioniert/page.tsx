// app/wie-es-funktioniert/page.tsx
// E-E-A-T optimiert: vollständige Prozess-Erklärung, Datenquellen, Vertrauenssignale
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Shield, Clock, Euro, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wie es funktioniert — Kostenloser Wärmepumpen-Vermittlungsservice | Wärmepumpenbegleiter',
  description: 'So funktioniert Wärmepumpenbegleiter.de: Kostenlose Vermittlung an HWK-geprüfte Fachbetriebe in 3 Schritten. Wie wir Installateure prüfen, wie der KfW-Antrag läuft und was Sie erwartet.',
  alternates: { canonical: 'https://waermepumpenbegleiter.de/wie-es-funktioniert' },
  openGraph: { title: 'Wie es funktioniert | Wärmepumpenbegleiter.de', type: 'website' },
};

const steps = [
  {
    n: '01',
    icon: '📋',
    title: '2 Minuten: Ihre Anfrage',
    subtitle: 'Einfaches Formular — keine Verpflichtung',
    color: '#1A4731',
    text: 'Sie beantworten 6 kurze Fragen zu Ihrem Haus: PLZ, Gebäudetyp, Baujahr, aktuelle Heizung, Wohnfläche, und ob Sie Eigennutzer sind. Das dauert ca. 2 Minuten. Keine Registrierung, keine E-Mail-Bestätigung, kein Druck.',
    details: [
      'PLZ → wir finden geprüfte Betriebe in Ihrer Region',
      'Gebäudedaten → korrekte Dimensionierung der WP',
      'Eigennutzer → bestimmt Ihre maximale Förderquote',
      'Keine Kreditkarte, kein Vertrag, keine Vorauszahlung',
    ],
    proof: 'Durchschnittliche Ausfüllzeit: 1 Minute 47 Sekunden',
  },
  {
    n: '02',
    icon: '🔍',
    title: '48 Stunden: Wir matchen',
    subtitle: 'Manuelle Prüfung + KfW-Registrierungscheck',
    color: '#1A4731',
    text: 'Unser System gleicht Ihre PLZ mit unserem Netzwerk geprüfter Partnerbetriebe ab. Wir übermitteln Ihre Anfrage an bis zu 3 Betriebe die (1) in Ihrer Region tätig sind, (2) Kapazitäten haben und (3) alle unsere Qualitätskriterien erfüllen.',
    details: [
      'HWK-Eintragung geprüft — kein Betrieb ohne gültige Handwerksrolle',
      'KfW-LuL-Registrierung bestätigt — Voraussetzung für Förderung',
      'Mindestens 5 WP-Installationen in den letzten 24 Monaten',
      'Aktuelle Haftpflichtversicherung für Heizungsbau',
    ],
    proof: 'Ø 94% der Anfragen werden innerhalb von 4 Stunden weitergeleitet',
  },
  {
    n: '03',
    icon: '📞',
    title: 'Fachbetriebe melden sich',
    subtitle: 'Persönliches Erstgespräch — kostenlos & unverbindlich',
    color: '#1A4731',
    text: 'Die vermittelten Betriebe kontaktieren Sie direkt — per Telefon oder E-Mail, je nach Ihrer Präferenz. Im kostenlosen Erstgespräch besprechen sie Ihre Situation, prüfen die Eignung Ihres Hauses und erläutern den nächsten Schritt: die Vor-Ort-Begehung.',
    details: [
      'SLA: Betriebe müssen sich innerhalb von 48h melden',
      'Bei Nicht-Erreichbarkeit (3 Versuche): automatische Meldung an uns',
      'Vollständige Angebote mit allen Positionen — kein Kleingedrucktes',
      'KfW-Antrag wird vom Betrieb gestellt (LuL-Pflicht)',
    ],
    proof: 'Ø Bewertung unserer Partnerbetriebe: 4,6 / 5,0',
  },
  {
    n: '04',
    icon: '✅',
    title: 'Angebote vergleichen & entscheiden',
    subtitle: 'Sie entscheiden — wir begleiten weiter',
    color: '#1A4731',
    text: 'Sie erhalten bis zu 3 vollständige Angebote von verschiedenen Betrieben. Wir empfehlen: Vergleichen Sie nicht nur den Gesamtpreis, sondern prüfen Sie ob alle Positionen aufgeführt sind — hydraulischer Abgleich, Elektrik, Fundament. Erst dann sind Angebote wirklich vergleichbar.',
    details: [
      'Checkliste: Was ein vollständiges WP-Angebot enthalten muss',
      'KfW-Antrag muss VOR Vertragsabschluss gestellt sein',
      'Wir stehen bei Fragen weiterhin als neutrale Instanz zur Verfügung',
      'Kein Auftrag zustande? Keine Kosten — für niemanden',
    ],
    proof: 'Ø Preisunterschied zwischen günstigstem und teuerstem Angebot: 24%',
  },
];

const qualityCriteria = [
  { icon: '🏛️', title: 'Handwerkskammer-Eintragung', text: 'Aktive HWK-Eintragung in der zuständigen Handwerksrolle. Wir prüfen das vor Aufnahme und jährlich.' },
  { icon: '👨‍🔧', title: 'Meisterbetrieb', text: 'Keine Gesellenbetriebe. Alle Partner sind Meisterbetriebe mit persönlicher technischer Leitung.' },
  { icon: '📊', title: '5+ WP-Installationen', text: 'Mindestens 5 dokumentierte Wärmepumpen-Installationen der letzten 24 Monate als Nachweis.' },
  { icon: '🏦', title: 'KfW-LuL-Registrierung', text: 'Nur Betriebe mit aktiver Lieferanten- und Leistungserbringer (LuL) Registrierung im KfW-Portal.' },
  { icon: '🛡️', title: 'Haftpflichtversicherung', text: 'Gültige Betriebshaftpflicht für Heizungsbau — jährlich geprüft.' },
  { icon: '⭐', title: 'Kundenbewertungen', text: 'Laufendes Monitoring. Betriebe unter Ø 3,5/5 nach 10+ Bewertungen werden entfernt.' },
];

const faqs = [
  {
    q: 'Was kostet der Service für mich als Hausbesitzer?',
    a: 'Gar nichts. Wärmepumpenbegleiter.de ist für Hausbesitzer vollständig kostenlos. Wir finanzieren uns durch eine Vermittlungsprovision von €50–120, die der beauftragte Installationsbetrieb zahlt — nur wenn ein Auftrag zustande kommt. Kein Auftrag = keine Kosten für niemanden.',
  },
  {
    q: 'Bin ich nach der Anfrage zum Kauf verpflichtet?',
    a: 'Nein. Die Anfrage, alle Beratungsgespräche und alle Angebote sind vollständig unverbindlich. Es gibt keine versteckten Vertragsbindungen. Sie können jederzeit ohne Angabe von Gründen absagen.',
  },
  {
    q: 'Was passiert wenn sich kein Betrieb meldet?',
    a: 'Unser SLA: Betriebe müssen sich innerhalb von 48 Stunden melden. Tun sie das nicht (3 Versuche), werden sie automatisch in unserem System markiert. Wir informieren Sie und suchen einen alternativen Betrieb in Ihrer Region.',
  },
  {
    q: 'Wie wählt ihr die Betriebe aus — nach Provision?',
    a: 'Nein. Die Auswahl erfolgt ausschließlich nach PLZ-Nähe, verfügbarer Kapazität und unserem Qualitätsprüfprozess (6 Kriterien). Kein Betrieb kann sich eine bevorzugte Vermittlung erkaufen.',
  },
  {
    q: 'Was ist wenn ich schon ein Angebot habe und nur prüfen möchte?',
    a: 'Kein Problem. Geben Sie das im Formular an — unsere Partner sind es gewohnt, auch Vergleichsangebote zu erstellen. Manchmal deckt ein unabhängiges zweites Angebot deutliche Preisunterschiede oder fehlende Positionen auf.',
  },
  {
    q: 'Kann ich auch eine Erdwärmepumpe oder Wasser-Wärmepumpe anfragen?',
    a: 'Ja. Im Formular können Sie den WP-Typ angeben. Für Erdwärmepumpen (Sole-Wasser) brauchen Sie einen spezialisierten Betrieb mit Bohrgenehmigung-Erfahrung — unser Netzwerk umfasst auch solche Spezialisten.',
  },
  {
    q: 'Wie läuft die KfW-Beantragung ab?',
    a: 'Der vermittelte Betrieb stellt als registrierter KfW-Lieferant und Leistungserbringer (LuL) den Antrag für Sie im KfW-Energieeffizienz-Portal. Wichtig: Der Antrag muss ZWINGEND vor dem ersten Spatenstich gestellt werden. Nach Fertigstellung reichen Sie gemeinsam den Verwendungsnachweis ein — die Auszahlung erfolgt 4–8 Wochen später.',
  },
  {
    q: 'Was wenn mein Haus sich als ungeeignet herausstellt?',
    a: 'Ein seriöser Fachbetrieb sagt Ihnen das ehrlich im Erstgespräch. Wärmepumpen sind für die meisten Häuser geeignet — aber nicht für alle. Wenn Ihr Haus aus technischen Gründen oder wegen der Lage ungeeignet ist, werden Sie das erfahren, bevor Sie irgendwelche Kosten haben.',
  },
];

export default function WieEsFunktioniert() {
  return (
    <div className="min-h-screen bg-wp-bg font-sans">

      {/* HERO */}
      <div className="bg-wp-dark pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-wp-green/20 border border-wp-green3/30 rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 bg-wp-green3 rounded-full animate-pulse-dot" />
            <span className="text-wp-green3 text-xs font-bold uppercase tracking-wider">Kostenloser Service</span>
          </div>
          <h1 className="font-heading font-extrabold text-white mb-5 leading-tight" style={{ fontSize: 'clamp(34px,5vw,62px)' }}>
            So funktioniert<br className="hidden sm:block" /> Wärmepumpenbegleiter.de
          </h1>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mb-10">
            Vom ersten Klick bis zum KfW-Zuschuss auf Ihrem Konto — vollständig kostenlos, unverbindlich
            und mit geprüften lokalen Fachbetrieben in 733 deutschen Städten.
          </p>

          {/* Quick trust stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { icon: Clock, val: '2 Min.', label: 'Anfrage ausfüllen' },
              { icon: Shield, val: '6 Kriterien', label: 'Betriebe geprüft' },
              { icon: Euro, val: '€0', label: 'Kosten für Sie' },
              { icon: Star, val: '4,6/5', label: 'Kundenbewertung' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-wp-green/25 rounded-xl flex items-center justify-center">
                  <s.icon size={16} className="text-wp-green3" />
                </div>
                <div>
                  <p className="font-mono font-bold text-white text-base leading-none">{s.val}</p>
                  <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEPS */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-wp-text mb-3" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
            4 Schritte — von der Anfrage zur fertigen Anlage
          </h2>
          <p className="text-wp-text2 text-base max-w-xl mx-auto">
            Typische Gesamtdauer: 6–12 Wochen. Die KfW-Auszahlung erfolgt nach Abschluss.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl border border-wp-border shadow-wp-sm overflow-hidden">
              <div className="flex items-stretch">
                {/* Step number sidebar */}
                <div className="w-20 shrink-0 flex flex-col items-center justify-center py-6 px-3"
                  style={{ background: step.color }}>
                  <span className="font-mono font-bold text-white/40 text-xs mb-1">{step.n}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <div>
                      <h3 className="font-heading font-bold text-wp-text text-xl leading-tight">{step.title}</h3>
                      <p className="text-wp-green text-sm font-semibold mt-0.5">{step.subtitle}</p>
                    </div>
                    <div className="bg-wp-greenlt border border-wp-green3/20 rounded-full px-3 py-1 text-xs font-bold text-wp-green shrink-0">
                      {step.proof}
                    </div>
                  </div>
                  <p className="text-wp-text2 text-sm leading-relaxed mb-4">{step.text}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {step.details.map((d, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-wp-text2">
                        <CheckCircle size={13} className="text-wp-green shrink-0 mt-0.5" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA nach Steps */}
        <div className="mt-8 bg-wp-dark rounded-2xl p-8 text-center">
          <h3 className="font-heading font-bold text-white text-2xl mb-2">
            Bereit? Anfrage dauert 2 Minuten.
          </h3>
          <p className="text-white/50 text-sm mb-6">Kostenlos · Unverbindlich · Keine Weitergabe an Dritte außer Fachbetrieben</p>
          <Link href="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-wp-amber text-white font-heading font-bold rounded-xl hover:bg-amber-700 transition-all hover:-translate-y-0.5">
            Jetzt kostenlos anfragen <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* QUALITÄTSPRÜFUNG */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-wp-green mb-3">Qualitätssicherung</span>
            <h2 className="font-heading font-bold text-wp-text mb-3" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>
              6 Kriterien — so prüfen wir jeden Partnerbetrieb
            </h2>
            <p className="text-wp-text2 text-base max-w-xl mx-auto">
              Nicht jeder SHK-Betrieb der eine Wärmepumpe einbaut ist ein Wärmepumpen-Fachbetrieb.
              Wir unterscheiden das für Sie.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {qualityCriteria.map((c, i) => (
              <div key={i} className="bg-wp-bg rounded-2xl p-5 border border-wp-border">
                <span className="text-2xl mb-3 block">{c.icon}</span>
                <h3 className="font-heading font-bold text-wp-text text-base mb-2">{c.title}</h3>
                <p className="text-wp-text2 text-sm leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="bg-wp-greenlt border border-wp-green3/25 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="font-heading font-bold text-wp-text text-lg mb-1">Laufendes Qualitätsmonitoring</p>
              <p className="text-wp-text2 text-sm leading-relaxed">
                Nach jeder Vermittlung erhält der Hausbesitzer eine Feedbackanfrage. Betriebe mit
                Durchschnittsbewertung unter 3,5/5 nach 10+ Bewertungen werden automatisch aus dem
                Netzwerk entfernt. Kein Badge kann gekauft werden.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3 bg-white rounded-xl px-5 py-4 border border-wp-border shadow-wp-sm">
              <Shield size={28} className="text-wp-green" />
              <div>
                <p className="font-mono font-bold text-wp-green text-2xl leading-none">4,6</p>
                <p className="text-wp-text3 text-xs">Ø Bewertung / 5,0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VERGLEICH MIT ALTERNATIVEN */}
      <div className="py-16 px-6 bg-wp-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-wp-text mb-3" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>
              Warum nicht direkt einen Installateur suchen?
            </h2>
            <p className="text-wp-text2 text-base max-w-xl mx-auto">
              Sie können — aber diese Probleme begegnen Hausbesitzern dabei häufig.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] bg-white rounded-2xl border border-wp-border overflow-hidden shadow-wp-sm">
              <thead>
                <tr className="bg-wp-dark">
                  <th className="px-5 py-4 text-left text-white/50 text-xs font-bold uppercase tracking-wider">Kriterium</th>
                  <th className="px-5 py-4 text-left text-white/50 text-xs font-bold uppercase tracking-wider">Direkt suchen</th>
                  <th className="px-5 py-4 text-left text-wp-green3 text-xs font-bold uppercase tracking-wider">Wärmepumpenbegleiter ✓</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['KfW-LuL-Registrierung', 'Muss selbst geprüft werden', '✅ Alle Partner registriert'],
                  ['Vergleichsangebote', 'Müssen einzeln angefragt werden', '✅ Bis zu 3 in 48h'],
                  ['Qualitätskontrolle', 'Keine unabhängige Prüfung', '✅ 6-Kriterien-Check'],
                  ['Vollständige Angebote', 'Oft fehlende Positionen', '✅ Wir prüfen Vollständigkeit'],
                  ['Kosten', 'Kostenlos', '✅ Kostenlos'],
                  ['Aufwand', 'Hoch — 5–10h Recherche', '✅ 2 Minuten Formular'],
                  ['Herstellerneutralität', 'Betriebe oft herstellergebunden', '✅ Wir sind herstellerunabhängig'],
                ].map(([label, direct, ours], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-wp-bg/60'}>
                    <td className="px-5 py-3 font-semibold text-wp-text text-sm">{label}</td>
                    <td className="px-5 py-3 text-wp-text3 text-sm">{direct}</td>
                    <td className="px-5 py-3 text-wp-green font-medium text-sm">{ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-wp-text mb-3" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>
              Häufige Fragen zum Ablauf
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-wp-bg border border-wp-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none hover:bg-wp-greenlt transition-colors">
                  <span className="font-heading font-semibold text-wp-text text-base pr-4 leading-snug">{faq.q}</span>
                  <span className="text-wp-green font-bold text-xl shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-5 pb-4 pt-2 border-t border-wp-border">
                  <p className="text-wp-text2 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="bg-wp-dark py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-extrabold text-white text-3xl mb-4">
            Bereit — in 2 Minuten starten
          </h2>
          <p className="text-white/55 mb-8 text-base">
            Kostenlos · Kein Vertrag · Keine Verpflichtung · KfW-Begleitung inklusive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kontakt"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-wp-amber text-white font-heading font-bold rounded-xl hover:bg-amber-700 transition-all hover:-translate-y-0.5">
              Jetzt kostenlos anfragen <ArrowRight size={16} />
            </Link>
            <Link href="/rechner"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-heading font-bold rounded-xl hover:bg-white/15 transition-all border border-white/20">
              Erst Kosten berechnen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
