// app/impressum/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum | Wärmepumpenbegleiter.de',
  description: 'Impressum von Wärmepumpenbegleiter.de — Angaben gemäß § 5 TMG.',
  robots: { index: false, follow: false },
};

export default function Impressum() {
  return (
    <div className="min-h-screen bg-wp-bg pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto prose prose-sm">
        <h1 className="font-heading font-bold text-wp-text text-3xl mb-8">Impressum</h1>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">Angaben gemäß § 5 TMG</h2>
        <p className="text-wp-text2 leading-relaxed">
          Webflott GbR<br />
          Bastian Saupe & Philip Lindner<br />
          [Straße und Hausnummer]<br />
          06667 Weißenfels<br />
          Deutschland
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">Kontakt</h2>
        <p className="text-wp-text2 leading-relaxed">
          E-Mail: kontakt@xn--wrmepumpenbegleiter-gwb.de<br />
          Website: https://xn--wrmepumpenbegleiter-gwb.de
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p className="text-wp-text2 leading-relaxed">
          Bastian Saupe<br />
          [Anschrift wie oben]
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">Haftungsausschluss</h2>
        <p className="text-wp-text2 leading-relaxed">
          Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
          und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7
          Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">Hinweis Vermittlungsservice</h2>
        <p className="text-wp-text2 leading-relaxed">
          Wärmepumpenbegleiter.de ist ein Informations- und Vermittlungsportal. Wir sind kein Installationsbetrieb
          und übernehmen keine Gewähr für die Qualität der vermittelten Fachbetriebe. Die Berechnung von Fördersätzen
          und Betriebskosten erfolgt auf Basis öffentlich zugänglicher Daten und dient der Orientierung — sie ersetzt
          keine individuelle Fachberatung.
        </p>

        <p className="text-wp-text3 text-xs mt-10">Stand: März 2026</p>
      </div>
    </div>
  );
}
