// app/agb/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AGB | Wärmepumpenbegleiter.de',
  description: 'Allgemeine Geschäftsbedingungen von Wärmepumpenbegleiter.de.',
  robots: { index: false, follow: false },
};

export default function AGB() {
  return (
    <div className="min-h-screen bg-wp-bg pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto prose prose-sm">
        <h1 className="font-heading font-bold text-wp-text text-3xl mb-8">Allgemeine Geschäftsbedingungen</h1>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">§ 1 Geltungsbereich</h2>
        <p className="text-wp-text2 leading-relaxed">
          Diese AGB gelten für die Nutzung des kostenlosen Vermittlungsdienstes von Wärmepumpenbegleiter.de
          (Webflott GbR, Bastian Saupe & Philip Lindner, 06667 Weißenfels).
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">§ 2 Leistungsbeschreibung</h2>
        <p className="text-wp-text2 leading-relaxed">
          Wärmepumpenbegleiter.de ist ein kostenloser Informations- und Vermittlungsservice für Hausbesitzer in
          Deutschland. Wir vermitteln Kontakte zu lokalen Wärmepumpen-Fachbetrieben. Wir sind kein Installationsbetrieb
          und erbringen keine eigenen Handwerksleistungen. Der Service für Nutzer (Hausbesitzer) ist vollständig kostenlos.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">§ 3 Vermittlungsablauf</h2>
        <p className="text-wp-text2 leading-relaxed">
          Nach Eingang einer Anfrage werden diese an bis zu 3 geprüfte Partnerbetriebe in der entsprechenden Region
          weitergeleitet. Die Betriebe melden sich innerhalb von 48 Stunden beim Anfragenden. Ein Vertrag kommt
          ausschließlich zwischen dem Nutzer und dem jeweiligen Handwerksbetrieb zustande — nicht mit Wärmepumpenbegleiter.de.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">§ 4 Haftungsausschluss</h2>
        <p className="text-wp-text2 leading-relaxed">
          Wärmepumpenbegleiter.de haftet nicht für die Qualität der vermittelten Betriebe, erteilte Angebote, oder
          durchgeführte Installationsarbeiten. Die auf der Website angezeigten Berechnungen (JAZ, Betriebskosten,
          Förderbeträge) sind Richtwerte und ersetzen keine individuelle Fachberatung.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">§ 5 Finanzierungsmodell & Transparenz</h2>
        <p className="text-wp-text2 leading-relaxed">
          Wärmepumpenbegleiter.de finanziert sich durch Vermittlungsprovisionen der Partnerbetriebe von €50–120 pro
          qualifiziertem Lead. Diese Provision beeinflusst nicht die Auswahl der empfohlenen Betriebe — alle Partner
          durchlaufen denselben Prüfprozess.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">§ 6 Anwendbares Recht</h2>
        <p className="text-wp-text2 leading-relaxed">
          Es gilt deutsches Recht. Gerichtsstand ist Weißenfels, soweit gesetzlich zulässig.
        </p>

        <p className="text-wp-text3 text-xs mt-10">Stand: März 2026</p>
      </div>
    </div>
  );
}
