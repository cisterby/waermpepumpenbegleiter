// app/datenschutz/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz | Wärmepumpenbegleiter.de',
  description: 'Datenschutzerklärung von Wärmepumpenbegleiter.de gemäß DSGVO.',
  robots: { index: false, follow: false },
};

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-wp-bg pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto prose prose-sm">
        <h1 className="font-heading font-bold text-wp-text text-3xl mb-8">Datenschutzerklärung</h1>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">1. Verantwortlicher</h2>
        <p className="text-wp-text2 leading-relaxed">
          Webflott GbR (Bastian Saupe & Philip Lindner), 06667 Weißenfels. Kontakt: kontakt@xn--wrmepumpenbegleiter-gwb.de
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">2. Welche Daten wir erheben</h2>
        <p className="text-wp-text2 leading-relaxed">
          Beim Ausfüllen des Kontaktformulars erheben wir: Name, E-Mail-Adresse, Telefonnummer, PLZ, Angaben zum
          Gebäude (Baujahr, Fläche) und gewünschten Installationszeitraum. Diese Daten werden ausschließlich zur
          Vermittlung an lokale Wärmepumpen-Fachbetriebe verwendet.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">3. Zweck der Verarbeitung</h2>
        <p className="text-wp-text2 leading-relaxed">
          Die erhobenen Daten dienen ausschließlich der Vermittlung an geprüfte Fachbetriebe (Art. 6 Abs. 1 lit. b DSGVO — 
          Vertragserfüllung). Wir geben Ihre Daten an bis zu 3 lokale Installationsbetriebe weiter, die Sie im Rahmen
          des Vermittlungsauftrags kontaktieren dürfen.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">4. Datenübermittlung an Dritte</h2>
        <p className="text-wp-text2 leading-relaxed">
          Formularübermittlung: Wir nutzen Formspree (Formspree Inc., USA) als Formulardienstleister. Die Daten werden
          auf Servern in den USA verarbeitet. Weitere Infos: formspree.io/legal/privacy-policy. Wir übermitteln Ihre
          Anfragedaten an relevante lokale Handwerksbetriebe zur Angebotserstellung.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">5. Hosting & Server-Logs</h2>
        <p className="text-wp-text2 leading-relaxed">
          Diese Website wird bei Vercel Inc. (USA) gehostet. Bei jedem Aufruf werden automatisch Server-Logfiles
          gespeichert (IP-Adresse, Zeitstempel, aufgerufene URL). Diese Daten dienen ausschließlich der technischen
          Absicherung und werden nach 7 Tagen gelöscht.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">6. Ihre Rechte</h2>
        <p className="text-wp-text2 leading-relaxed">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit
          und Widerspruch. Kontakt: kontakt@xn--wrmepumpenbegleiter-gwb.de. Beschwerden können Sie bei der zuständigen
          Datenschutzbehörde (Landesbeauftragter für Datenschutz Sachsen-Anhalt) einreichen.
        </p>

        <h2 className="font-heading font-semibold text-wp-text text-lg mt-6 mb-2">7. Speicherdauer</h2>
        <p className="text-wp-text2 leading-relaxed">
          Formulardaten werden nach Abschluss der Vermittlung (spätestens 6 Monate) gelöscht, sofern keine gesetzlichen
          Aufbewahrungspflichten bestehen.
        </p>

        <p className="text-wp-text3 text-xs mt-10">Stand: März 2026</p>
      </div>
    </div>
  );
}
