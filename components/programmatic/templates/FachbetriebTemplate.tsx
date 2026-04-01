// components/programmatic/templates/FachbetriebTemplate.tsx
// waermepumpe-fachbetrieb — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80';

/* KRITERIEN moved inside component */

/* ANGEBOT_CHECKLISTE moved inside component */

/* FEHLER moved inside component */

export default function FachbetriebTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const ANGEBOT_CHECKLISTE = [
    { item: 'Heizlastberechnung DIN EN 12831', muss: true, note: `Für ${city.normAussentemp}°C Normaußentemperatur ${city.name} — KfW-Pflicht` },
    { item: 'Hydraulischer Abgleich', muss: true, note: `KfW-Pflicht — ohne diesen: Förderantrag für ${city.name} abgelehnt` },
    { item: 'WP-Modell + kW-Leistung', muss: true, note: 'Vollständige Gerätespez. mit COP-Angabe' },
    { item: 'Pufferspeicher-Volumen', muss: true, note: `Mind. 30 l/kW — für ${city.name} berechnet` },
    { item: 'Elektroinstallation separat', muss: true, note: `Starkstrom + Netzbetreiber-Anmeldung ${city.name}` },
    { item: 'Wärmemengenzähler', muss: true, note: 'KfW-Pflicht 2026' },
    { item: 'Kältemittelangabe', muss: true, note: '+5% KfW-Bonus für R290' },
    { item: 'Inbetriebnahme-Protokoll', muss: true, note: `F-Gas-zertifiziert — Pflicht in ${city.bundesland}` },
    { item: 'Garantiezeiten', muss: false, note: `Herstellergarantie in ${city.bundesland}: 5–7 Jahre` },
  ];
  const FEHLER = [
    { fehler: 'WP ohne Heizlastberechnung dimensioniert', folge: `In ${city.name}: WP zu groß oder zu klein → JAZ 15–20% schlechter, KfW-Ablehnung` },
    { fehler: 'Kein hydraulischer Abgleich', folge: `Häufigster KfW-Ablehnungsgrund — gilt auch in ${city.name}` },
    { fehler: 'Kein F-Gas-Zertifikat', folge: 'Kältemittelbefüllung illegal — Anlage darf nicht in Betrieb genommen werden' },
    { fehler: 'Pufferspeicher fehlt oder zu klein', folge: `Zu viele Taktungen: Bei ${city.heizgradtage} Heizgradtagen in ${city.name} sinkt Lebensdauer stark` },
    { fehler: 'Keine KfW-LuL-Registrierung', folge: `${fmtEuro(foerd.zuschuss)} KfW-Förderung für ${city.name} entfällt komplett` },
    { fehler: 'Außeneinheit falsch positioniert', folge: `Schallproblem in ${city.name} / Wärmefalle — COP sinkt 15–25%` },
  ];

  const KRITERIEN = [
    { icon: '🏛️', title: 'HWK-Eintragung aktiv', text: `Gültige Eintragung in der Handwerksrolle ${city.bundesland} — Pflichtvoraussetzung für KfW-LuL-Status.` },
    { icon: '🔑', title: 'KfW-LuL-Registrierung', text: `Nur im KfW-Portal registrierte Betriebe berechtigen zur BEG-Förderung — nicht jeder SHK-Betrieb in ${city.name} hat diese Zulassung.` },
    { icon: '📋', title: 'WP-Referenzen nachweisbar', text: `Mind. 5 dokumentierte WP-Installationen — ${['in ' + city.bundesland + ' und Umgebung', 'davon mindestens 3 im Altbau', 'mit JAZ-Protokollen belegt'][cityHash(city, 3, 250)]}.` },
    { icon: '🛡️', title: 'Haftpflichtversicherung', text: `Aktuelle Haftpflicht ≥ €1,5 Mio. — Pflicht für alle unsere Partnerbetriebe in ${city.name}.` },
    { icon: '❄️', title: 'F-Gas-Zertifikat', text: 'F-Gas-Sachkundenachweis (EU 517/2014) — Pflicht für Kältemittelbefüllung. Ohne diesen: Inbetriebnahme illegal.' },
    { icon: '📐', title: 'Heizlastberechnung inklusive', text: `DIN EN 12831 Heizlastberechnung für ${city.name} (${city.normAussentemp}°C Normaußentemperatur) — Pflicht für KfW und korrekte Dimensionierung.` },
    { icon: '⏱️', title: 'Reaktionszeit ≤ 48h', text: `Lokaler Betrieb in ${city.name} — schnell vor Ort bei Störungen. Kein bundesweites Callcenter.` },
  ];

  const intros = [
    `WP-Fachbetrieb ${city.name}: Die KfW-LuL-Registrierung ist Pflicht — ohne sie kein Förderantrag. Bei ${city.strompreis} ct/kWh und JAZ ${jaz} in ${city.name} macht die Wahl des richtigen Fachbetriebs bis zu ${fmtEuro(Math.round(calc.ersparnis * 0.3))}/Jahr Unterschied in der tatsächlichen Effizienz.`,
    `In ${city.name} (${city.bundesland}) gibt es SHK-Betriebe und spezialisierte WP-Fachbetriebe — das ist ein großer Unterschied. Nur zertifizierte Betriebe mit KfW-LuL und WP-Erfahrung bei ${city.normAussentemp}°C Normaußentemperatur liefern JAZ ${jaz} und stellen den KfW-Antrag (${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)}) korrekt.`,
    `Fehler bei der Betriebsauswahl in ${city.name} kosten: falsche Dimensionierung bei ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen, kein hydraulischer Abgleich, KfW-Antrag zu spät. Wir prüfen alle unsere Partnerbetriebe in ${city.name} nach 6 Kriterien vorab.`,
    `Drei Merkmale eines guten WP-Fachbetriebs in ${city.name}: KfW-LuL-Registrierung aktiv, min. 5 WP-Installationen in 24 Monaten, Erfahrung für ${city.normAussentemp}°C Normaußentemperatur in ${city.bundesland}. Nur so wird JAZ ${jaz} und Eigenanteil ${fmtEuro(foerd.eigenanteil)} nach Förderung erreicht.`,
  ];


  return (
    <div className="min-h-screen bg-wp-bg font-sans">
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
              { val: `${foerd.gesamtSatz}%`, label: 'KfW-Förderung' },
              { val: fmtEuro(foerd.zuschuss), label: 'Zuschuss' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil' },
              { val: `${fmtEuro(calc.ersparnis)}/J.`, label: 'Ersparnis' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Geprüften Fachbetrieb finden →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Was macht einen guten WP-Fachbetrieb in {stadt} aus?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Ein guter WP-Fachbetrieb in <strong>{city.name}</strong> hat: aktive KfW-LuL-Registrierung (Pflicht für Förderantrag), mindestens 5 WP-Installationen in 24 Monaten, HWK-Eintragung als Meisterbetrieb und Erfahrung mit {city.normAussentemp}°C Normaußentemperatur in {city.bundesland}. Nur so werden JAZ {jaz} und {foerd.gesamtSatz}% KfW-Förderung ({fmtEuro(foerd.zuschuss)}) zuverlässig erreicht.
            </p>
          </div>

          {/* 6 Kriterien */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-6">
              6 Qualitätskriterien für WP-Fachbetriebe in {city.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {KRITERIEN.map((k, i) => (
                <div key={i} className="p-4 bg-white border border-wp-border rounded-xl shadow-wp-sm">
                  <div className="text-xl mb-2">{k.icon}</div>
                  <div className="font-heading font-bold text-wp-text text-sm mb-1">{k.title}</div>
                  <p className="text-wp-text2 text-xs leading-relaxed">{k.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Angebot-Checkliste */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Checkliste: Was muss ein WP-Angebot in {city.name} enthalten?
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    <th className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">Position</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">Pflicht?</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">Hinweis</th>
                  </tr>
                </thead>
                <tbody>
                  {ANGEBOT_CHECKLISTE.map((row, i) => (
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${row.muss ? '' : 'opacity-80'}`}>
                      <td className="px-4 py-3 font-semibold text-wp-text">{row.item}</td>
                      <td className="px-4 py-3">
                        {row.muss
                          ? <span className="text-wp-green font-bold">✅ Pflicht</span>
                          : <span className="text-wp-text3">Optional</span>}
                      </td>
                      <td className="px-4 py-3 text-wp-text2 text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Typische Fehler */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              5 typische Fehler — und ihre Konsequenzen in {city.name}
            </h2>
            <div className="space-y-3">
              {FEHLER.map((f, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white border border-wp-border rounded-xl">
                  <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-heading font-semibold text-wp-text text-sm">{f.fehler}</div>
                    <div className="text-wp-text2 text-xs mt-0.5">→ {f.folge}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stadtdaten */}
          <div className="p-6 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">{h2s.klimadaten}</h2>
            <p className="text-wp-text2 text-base leading-relaxed mb-4">{si.klimadaten}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                [`${city.avgTemp}°C`, 'Jahresmitteltemperatur'],
                [`${city.normAussentemp}°C`, 'Normaußentemperatur'],
                [city.heizgradtage.toLocaleString('de-DE') + ' Kd/a', 'Heizgradtage'],
                [String(jaz), 'Erwartete JAZ'],
                [`${city.strompreis} ct/kWh`, 'Strompreis lokal'],
                [fmtEuro(calc.ersparnis) + '/J.', 'Ersparnis vs. Gas'],
              ].map(([v, l], i) => (
                <div key={i}><div className="text-wp-text3 text-xs">{l}</div><div className="font-bold text-wp-text">{v}</div></div>
              ))}
            </div>
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
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">{h2s.faq}</h2>
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
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ').replace('foerderung','Förderung')} {city.name}
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
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">Klimadaten: DWD · Förderrecht: KfW/BAFA · Stand März 2026</div>
      </div>
    </div>
  );
}
