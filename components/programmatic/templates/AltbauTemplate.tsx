// components/programmatic/templates/AltbauTemplate.tsx
// waermepumpe-altbau — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80';

const EIGNUNG_TEST = [
  { frage: 'Vorlauftemperatur des Heizkreises', ja: '≤ 55°C → Standard-WP', nein: '55–70°C → Hochtemperatur-WP (+€2.000)', detail: 'Messung am Heizkessel bei -5°C Außentemperatur. Der lokale Fachbetrieb prüft das vor Ort.' },
  { frage: 'Heizkörpergröße', ja: 'Alte, große Heizkörper → oft 55°C ausreichend', nein: 'Kleine moderne Heizkörper → höhere VL-Temp nötig', detail: 'Größere Heizkörper = mehr Fläche = niedrigere Vorlauftemperatur möglich.' },
  { frage: 'Dämmzustand Außenwände', ja: 'WDVS oder Kerndämmung vorhanden', nein: 'Ungedämmtes Mauerwerk → WP immer noch möglich', detail: 'WP funktioniert in ungedämmten Altbauten — nur die JAZ und Betriebskosten sind etwas höher.' },
  { frage: 'Baujahr Gebäude', ja: 'Kein Ausschlusskriterium für WP', nein: 'Kein Ausschlusskriterium', detail: 'Auch Altbauten von 1900 können problemlos mit WP beheizt werden — entscheidend ist die VL-Temperatur.' },
];

const SANIERUNGS_REIHENFOLGE = [
  { schritt: '1. Hydraulischer Abgleich', kosten: '€500–€1.500', effekt: 'VL-Temp um 5–10°C senken — KfW-Pflicht', kfw: true },
  { schritt: '2. Heizkörpertausch (falls nötig)', kosten: '€200–€500 pro Heizkörper', effekt: 'VL-Temp von 70°C auf 55°C senken', kfw: false },
  { schritt: '3. WP-Installation', kosten: `${fmtEuro(18000)} – ${fmtEuro(28000)}`, effekt: 'Hauptinvestition — KfW 50–70% Förderung', kfw: true },
  { schritt: '4. Fußbodenheizung (optional)', kosten: '€5.000–€15.000', effekt: 'VL-Temp auf 35°C senken, JAZ +0,5–1,0', kfw: false },
];

const JAZ_ALTBAU = [
  { typ: 'Unsaniert, alte Heizkörper (70°C VL)', jaz: '2,5–3,2', betrieb: 'Hochtemperatur-WP nötig' },
  { typ: 'Standard-Altbau (55°C VL)', jaz: '3,0–3,8', betrieb: 'Standard Luft-WP, gute Wirtschaftlichkeit' },
  { typ: 'Teilsaniert mit Hydr. Abgleich (50°C)', jaz: '3,4–4,0', betrieb: 'Gute JAZ, empfohlen' },
  { typ: 'Vollsaniert mit FBH (35°C VL)', jaz: '4,0–5,0', betrieb: 'Maximale Effizienz' },
];

export default function AltbauTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);
  const jazAltbau = Math.max(jaz - 0.3, 2.8).toFixed(1);
  const jazOptimiert = Math.min(jaz + 0.3, 4.5).toFixed(1);

  const intros = [
    `Wärmepumpe im Altbau ${city.name}: 70–80% aller Bestandsgebäude in ${city.bundesland} sind geeignet. Entscheidend ist nicht das Baujahr sondern die Vorlauftemperatur. Moderne Hochtemperatur-WP arbeiten bis 70°C — kompatibel mit fast allen Altbau-Heizkörpern. JAZ ${jazAltbau}–${jaz} in ${city.name} bei ${city.avgTemp}°C Jahresmittel.`,
    `Altbau ${city.name} (${city.bundesland}): Hydraulischer Abgleich (€500–1.500) senkt die Vorlauftemperatur um 5–10°C — das verbessert die JAZ von ${jazAltbau} auf ${jaz} und die Wirtschaftlichkeit um ca. ${fmtEuro(Math.round(calc.ersparnis * 0.15))}/Jahr. Mit ${foerd.gesamtSatz}% KfW = ${fmtEuro(foerd.eigenanteil)} Eigenanteil.`,
    `WP Altbau ${city.name}: Bei ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und ${city.normAussentemp}°C Normaußentemperatur. Mit Hochtemperatur-WP bis 70°C VL erreichbar. Betriebskosten: ${fmtEuro(calc.wpKosten)}/Jahr statt ${fmtEuro(calc.altKosten)}/Jahr mit Gas. Ersparnis: ${fmtEuro(calc.ersparnis)}/Jahr.`,
    `Modernisierung ${city.name}: Schritt 1 hydraulischer Abgleich, dann WP-Installation. In ${city.bundesland} gilt ab ${city.gegFrist.split('-').reverse().join('.')} die GEG-65%-EE-Pflicht. WP erfüllt diese automatisch — Gas-Brennwert nicht mehr allein GEG-konform.`,
  ];


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
              { val: '70–80%', label: 'Altbauten geeignet', sub: 'Quelle: BWP 2024' },
              { val: `JAZ ${jazAltbau}+`, label: 'Auch im Altbau', sub: city.avgTemp + '°C Jahresmittel' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: foerd.gesamtSatz + '% KfW' },
              { val: fmtEuro(calc.ersparnis) + '/J.', label: 'Ersparnis vs. Gas', sub: city.name },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/30 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Eignung prüfen — kostenlos →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Funktioniert eine Wärmepumpe im Altbau in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Ja — in den meisten Altbauten in <strong>{city.name}</strong>. Entscheidend ist nicht das Baujahr sondern die Vorlauftemperatur. Moderne Hochtemperatur-WP arbeiten bis 70°C Vorlauf und sind damit mit nahezu allen Bestandsheizkörpern kompatibel. In {city.name} ({city.bundesland}) mit {city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und {city.avgTemp}°C Jahresmittel erreichen WP eine JAZ von {jazAltbau}–{jaz} — jährliche Ersparnis gegenüber Gas: {fmtEuro(calc.ersparnis)}.
            </p>
          </div>

          {/* Eignungscheck */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              {[
                `Altbau-Schnelltest: Ist Ihr Haus in ${city.name} geeignet?`,
                `WP-Eignung im Altbau: Was zählt wirklich in ${city.name}?`,
                `Checkliste: Wärmepumpe im Altbau ${city.name} — geeignet oder nicht?`,
                `Welche Altbauten in ${city.name} sind für eine WP geeignet?`,
              ][cityHash(city, 4, 101)]}
            </h2>
            <div className="space-y-3">
              {EIGNUNG_TEST.map((t, i) => (
                <div key={i} className="p-4 bg-white border border-wp-border rounded-xl">
                  <div className="font-heading font-semibold text-wp-text text-sm mb-2">{t.frage}</div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex gap-1.5 items-start text-wp-green"><CheckCircle size={13} className="mt-0.5 shrink-0" />{t.ja}</div>
                    <div className="flex gap-1.5 items-start text-wp-text3"><XCircle size={13} className="mt-0.5 shrink-0" />{t.nein}</div>
                  </div>
                  <p className="text-xs text-wp-text2">{t.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* JAZ im Altbau */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              {[
                `JAZ-Vergleich nach Sanierungsstand in ${city.name}`,
                `Jahresarbeitszahl in ${city.name}: Was bringt jede Sanierungsstufe?`,
                `Effizienz im Altbau ${city.name}: JAZ je nach Vorlauftemperatur`,
                `So verbessert sich die JAZ in ${city.name} nach der Sanierung`,
              ][cityHash(city, 4, 102)]}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    {['Gebäudetyp & Vorlauftemperatur', 'JAZ', 'Betrieb'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {JAZ_ALTBAU.map((r, i) => (
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${i === 2 ? 'bg-wp-greenxlt' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{r.typ}</td>
                      <td className="px-4 py-3 font-mono font-bold text-wp-green">{r.jaz}</td>
                      <td className="px-4 py-3 text-wp-text2 text-xs">{r.betrieb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-wp-text3 mt-2">Basiswerte für {city.avgTemp}°C Jahresmittel in {city.name} — individuelle JAZ hängt vom konkreten Gebäude ab.</p>
          </div>

          {/* Sanierungsreihenfolge */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              {[
                `Optimale Sanierungsreihenfolge für Altbauten in ${city.name}`,
                `Schritt für Schritt: Heizungsmodernisierung in ${city.name}`,
                `In welcher Reihenfolge sanieren? Altbau ${city.name}`,
                `Sanierungsfahrplan für Ihr Haus in ${city.name}`,
              ][cityHash(city, 4, 103)]}
            </h2>
            <div className="space-y-3">
              {SANIERUNGS_REIHENFOLGE.map((s, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white border border-wp-border rounded-xl">
                  <div className="w-8 h-8 bg-wp-green rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{i+1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <div className="font-heading font-bold text-wp-text text-sm">{s.schritt}</div>
                      <div className="font-mono text-xs text-wp-text3 shrink-0">{s.kosten}</div>
                    </div>
                    <div className="text-wp-text2 text-xs mt-0.5">{s.effekt}</div>
                    {s.kfw && <span className="inline-block mt-1 text-xs bg-wp-greenxlt text-wp-green px-2 py-0.5 rounded-full">KfW-förderfähig</span>}
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
                [city.heizgradtage.toLocaleString('de-DE'), 'Heizgradtage'],
                [`${jazAltbau}–${jaz}`, 'JAZ Altbau'],
                [fmtEuro(calc.wpKosten) + '/J.', 'WP-Betriebskosten'],
                [fmtEuro(calc.ersparnis) + '/J.', 'Ersparnis vs. Gas'],
              ].map(([v, l], i) => (
                <div key={i}><div className="text-wp-text3 text-xs">{l}</div><div className="font-bold text-wp-text">{v}</div></div>
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

        <div>
          <div className="bg-white border border-wp-border rounded-2xl p-5 shadow-wp-sm sticky top-6">
            <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Altbau-Kennzahlen</div>
            {[
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Förderquote', foerd.gesamtSatz + '%'],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
              ['JAZ Altbau', jazAltbau + '–' + jaz],
              ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
              ['Amortisation', calc.amortisationJahre + ' J.'],
              ['GEG-Frist', city.gegFrist.split('-').reverse().join('.')],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-wp-border last:border-0 text-sm">
                <span className="text-wp-text2">{l}</span>
                <span className="font-bold text-wp-text">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-wp-green text-white font-bold py-3 rounded-xl hover:bg-wp-green2 transition-colors text-sm">Eignung prüfen →</a>
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
        <div className="mt-6 text-xs text-wp-text3">Klimadaten: DWD · KfW BEG 458 · BWP Marktdaten 2024 · Stand März 2026</div>
      </div>
    </div>
  );
}
