// components/programmatic/templates/AnbieterTemplate.tsx
// waermepumpe-anbieter — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80';

const ANBIETER_TYPEN = [
  { icon: '🔧', typ: 'Lokaler SHK-Fachbetrieb', vorteile: 'Persönlicher Service, Ortskenntnis, Wartung inklusive, KfW-Begleitung', nachteile: 'Begrenzte Kapazität, Wartezeiten 4–12 Wochen', kfw: true },
  { icon: '🏭', typ: 'Systemanbieter (ENGIE, E.ON etc.)', vorteile: 'Komplettservice, Finanzierung, bundesweit', nachteile: 'Oft höhere Preise, weniger Flexibilität bei Gerätwahl', kfw: true },
  { icon: '🛒', typ: 'Online-WP-Portale', vorteile: 'Preisvergleich, viele Angebote', nachteile: 'Qualitätskontrolle eingeschränkt, keine direkte Verantwortung', kfw: false },
  { icon: '🏗️', typ: 'Direkthersteller-Service (Viessmann etc.)', vorteile: 'Herstellergarantie, Herstellersupport', nachteile: 'Nur eigene Geräte, teuer', kfw: true },
];

const ANBIETER_KRITERIEN = [
  { kriterium: 'KfW-LuL Registrierung aktiv', pflicht: true, warum: 'Ohne LuL kein KfW-Antrag möglich — Sie verlieren die gesamte Förderung' },
  { kriterium: 'HWK-eingetragener Meisterbetrieb', pflicht: true, warum: 'Handwerksrechtliche Pflicht für Heizungsbau in Deutschland' },
  { kriterium: '5+ WP-Installationen in 24 Monaten', pflicht: true, warum: 'WP-Erfahrung entscheidet über Dimensionierung und JAZ' },
  { kriterium: 'Heizlastberechnung im Angebot', pflicht: true, warum: 'KfW-Pflicht — und die einzige Basis für korrekte Gerätewahl' },
  { kriterium: 'Hydraulischer Abgleich inklusive', pflicht: true, warum: 'KfW-Pflicht Verfahren B — fehlt in >60% aller Angebote' },
  { kriterium: 'Schriftliche Festpreisgarantie', pflicht: false, warum: 'Verhindert Nachtragsrechnung bei Mehraufwand' },
  { kriterium: 'Kundenbewertung ≥ 3,5 auf Google', pflicht: false, warum: 'Qualitätsindikator — unter 3,5 aus unserem Netzwerk ausgeschlossen' },
];

const ANGEBOTSVERGLEICH = [
  { pos: 'Heizlastberechnung DIN EN 12831', typ: 'Pflichtposition', note: 'Ohne diese: Angebot ablehnen' },
  { pos: 'WP-Gerät: Fabrikat, Modell, kW', typ: 'Pflichtposition', note: 'Keine Pauschale "Wärmepumpe 10 kW"' },
  { pos: 'Hydraulischer Abgleich Verfahren B', typ: 'Pflichtposition', note: 'KfW-Pflicht — in Rechnung ausweisen' },
  { pos: 'Wärmemengenzähler', typ: 'Pflichtposition (neu 2026)', note: 'KfW-Pflicht ab 2026' },
  { pos: 'KfW-LuL Antragsbegleitung', typ: 'Pflichtposition', note: 'Betrieb muss LuL-registriert sein' },
  { pos: 'Elektroinstallation', typ: 'Optional prüfen', note: 'Oft separat: €500–1.500' },
  { pos: 'Schallschutzgutachten', typ: 'Optional prüfen', note: 'Ab 10 dB unter Grenzwert: KfW-Bonus' },
  { pos: 'Wartungsvertrag', typ: 'Optional prüfen', note: 'Empfohlen — schützt KfW-Förderung' },
];

export default function AnbieterTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const intros = [
    `WP-Anbieter ${city.name}: Nicht jeder Heizungsbauer ist ein WP-Spezialist. Nur KfW-LuL-registrierte Betriebe können den Förderantrag (${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)}) korrekt begleiten. Wir prüfen alle unsere Partnerbetriebe in ${city.name} nach 7 Kriterien vorab.`,
    `${city.name} (${city.bundesland}): Preisunterschiede von 20–40% bei identischer Leistung sind bei WP-Angeboten keine Seltenheit. Entscheidend sind nicht nur der Preis, sondern KfW-LuL-Status, Heizlastberechnung und hydraulischer Abgleich im Angebot.`,
    `WP-Anbietervergleich ${city.name}: Bei JAZ ${jaz} und ${city.strompreis} ct/kWh Strompreis liegt die WP-Effizienz direkt in der Hand des Anbieters. Falsche Dimensionierung kostet ${fmtEuro(Math.round(calc.ersparnis * 0.2))}/Jahr Effizienz — über 20 Jahre: ${fmtEuro(Math.round(calc.ersparnis * 4))}.`,
    `Anbietersuche ${city.name}: Wir vermitteln ausschließlich Betriebe mit aktiver KfW-LuL-Registrierung, HWK-Eintragung und WP-Spezialisierung — nicht jeden SHK-Betrieb in ${city.bundesland}. Kostenlos, herstellerunabhängig, bis zu 3 Vergleichsangebote.`,
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
              { val: 'Bis zu 3', label: 'Vergleichsangebote', sub: city.name },
              { val: '7', label: 'Prüfkriterien', sub: 'Alle Partner' },
              { val: fmtEuro(foerd.zuschuss), label: 'KfW-Zuschuss', sub: foerd.gesamtSatz + '%' },
              { val: fmtEuro(calc.ersparnis) + '/J.', label: 'Mögliche Ersparnis', sub: 'vs. Gas' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/30 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Geprüfte Anbieter finden →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Welche WP-Anbieter gibt es in {stadt} und worauf achten?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              In <strong>{city.name}</strong> gibt es lokale SHK-Fachbetriebe, Systemanbieter und Online-Portale — aber nicht alle sind für die KfW-Förderbeantragung qualifiziert. Das wichtigste Kriterium: der Betrieb muss <strong>KfW-LuL-registriert</strong> sein. Ohne diese Registrierung entfällt der {foerd.gesamtSatz}% KfW-Zuschuss ({fmtEuro(foerd.zuschuss)}) vollständig. Wir prüfen das für Sie vorab.
            </p>
          </div>

          {/* Anbieter-Typen */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Die 4 Anbieter-Typen in {city.name} im Vergleich
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {ANBIETER_TYPEN.map((a, i) => (
                <div key={i} className="p-4 bg-white border border-wp-border rounded-xl">
                  <div className="text-2xl mb-2">{a.icon}</div>
                  <div className="font-heading font-bold text-wp-text text-sm mb-2">{a.typ}</div>
                  <div className="text-xs text-wp-green mb-1">✅ {a.vorteile}</div>
                  <div className="text-xs text-wp-text3">⚠️ {a.nachteile}</div>
                  {a.kfw && <div className="mt-2 text-xs bg-wp-greenxlt text-wp-green px-2 py-0.5 rounded-full inline-block">KfW-LuL möglich</div>}
                </div>
              ))}
            </div>
          </div>

          {/* 7 Kriterien */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              7 Kriterien für die Anbieterauswahl in {city.name}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    <th className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">Kriterium</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">Pflicht?</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">Warum entscheidend</th>
                  </tr>
                </thead>
                <tbody>
                  {ANBIETER_KRITERIEN.map((k, i) => (
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{k.kriterium}</td>
                      <td className="px-4 py-3 text-sm">{k.pflicht ? <span className="text-wp-green font-bold">✅ Ja</span> : <span className="text-wp-text3">Empfohlen</span>}</td>
                      <td className="px-4 py-3 text-wp-text2 text-xs">{k.warum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Angebotsvergleich */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Angebotsvergleich: Was muss drinstehen?
            </h2>
            <div className="space-y-2">
              {ANGEBOTSVERGLEICH.map((a, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-lg border ${a.typ.includes('Pflicht') ? 'bg-white border-wp-border' : 'bg-wp-bg border-wp-border opacity-80'}`}>
                  <CheckCircle size={16} className={a.typ.includes('Pflicht') ? 'text-wp-green shrink-0 mt-0.5' : 'text-wp-text3 shrink-0 mt-0.5'} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-semibold text-wp-text text-sm">{a.pos}</span>
                      <span className={`text-xs shrink-0 ${a.typ.includes('Pflicht') ? 'text-wp-green font-bold' : 'text-wp-text3'}`}>{a.typ}</span>
                    </div>
                    <div className="text-xs text-wp-text2 mt-0.5">{a.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stadtspezifisch */}
          <div className="p-6 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">{city.name} — Förderbasis für Angebote</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
              {[
                [fmtEuro(foerd.zuschuss), 'KfW-Zuschuss'],
                [foerd.gesamtSatz + '%', 'Förderquote'],
                [fmtEuro(foerd.eigenanteil), 'Eigenanteil'],
                [fmtEuro(calc.wpKosten) + '/J.', 'WP-Betriebskosten'],
                [fmtEuro(calc.ersparnis) + '/J.', 'Ersparnis vs. Gas'],
                [calc.amortisationJahre + ' J.', 'Amortisation'],
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

          {/* H3 + FAQ */}
          {faqs.length > 0 && (
            <div className="p-5 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
              <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">Häufige Fragen — WP Anbieter {city.name}</h2>
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
            <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Angebots-Basis</div>
            {[
              ['Vergleichsangebote', 'Bis zu 3'],
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Förderquote', foerd.gesamtSatz + '%'],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
              ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
              ['Amortisation', calc.amortisationJahre + ' J.'],
              ['GEG-Frist', city.gegFrist.split('-').reverse().join('.')],
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
        <div className="mt-6 text-xs text-wp-text3">KfW BEG 458 · HWK · BWP Marktdaten 2024 · Stand März 2026</div>
      </div>
    </div>
  );
}
