// components/programmatic/templates/LuftwaermepumpeTemplate.tsx
// luftwaermepumpe — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75';

/* HERSTELLER moved inside component */

/* JAZ_SZENARIEN moved inside component */
/* JAZ_SZENARIEN_PLACEHOLDER removed */

/* LW_VS_SW moved inside component */

export default function LuftwaermepumpeTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const HERSTELLER = [
    { name: 'Viessmann Vitocal 250-A', cop: '4,0', maxVL: '65°C', kaeltemittel: 'R290', kfwBonus: true, schall: '48 dB', preis: '€11–18k', note: `In ${city.bundesland} beliebt` },
    { name: 'Vaillant aroTHERM plus', cop: '4,2', maxVL: '70°C', kaeltemittel: 'R290', kfwBonus: true, schall: '49 dB', preis: '€12–19k', note: 'Stiftung Warentest 2,0' },
    { name: 'Stiebel Eltron WPL-A', cop: '3,9', maxVL: '65°C', kaeltemittel: 'R410A', kfwBonus: false, schall: '47 dB', preis: '€10–16k', note: `Marktführer in ${city.bundesland}` },
    { name: 'Bosch CS7000i AW', cop: '4,0', maxVL: '65°C', kaeltemittel: 'R32', kfwBonus: false, schall: '50 dB', preis: '€11–17k', note: `${city.avgTemp >= 10 ? 'Für mildes Klima gut geeignet' : 'Auch für kühlere Standorte geeignet'}` },
    { name: 'Nibe S2125', cop: '4,1', maxVL: '65°C', kaeltemittel: 'R290', kfwBonus: true, schall: '46 dB', preis: '€13–20k', note: 'Sehr leise' },
    { name: 'Daikin Altherma 3 HT', cop: '3,8', maxVL: '80°C', kaeltemittel: 'R32', kfwBonus: false, schall: '52 dB', preis: '€14–22k', note: `Hochtemperatur-Profi für Altbau in ${city.name}` },
  ];
  const LW_VS_SW = [
    { kriterium: 'Investitionskosten', lw: '€18.000–€28.000', sw: '€22.000–€35.000', besser: 'LW' },
    { kriterium: `JAZ in ${city.name}`, lw: jaz.toFixed(1), sw: (jaz + 0.8).toFixed(1), besser: 'SW' },
    { kriterium: 'Betriebskosten', lw: fmtEuro(calc.wpKosten) + '/J.', sw: fmtEuro(Math.round(calc.wpKosten * 0.82)) + '/J.', besser: 'SW' },
    { kriterium: 'KfW-Bonus', lw: 'Standard', sw: '+5% extra', besser: 'SW' },
    { kriterium: 'Grundstück nötig', lw: 'Nein (nur 0,5 m²)', sw: `Ja — Tiefenbohrung oder Flächenkollektor in ${city.name}`, besser: 'LW' },
    { kriterium: 'Genehmigung', lw: 'Keine / Anzeige', sw: `Wasserrecht ${city.bundesland}`, besser: 'LW' },
    { kriterium: 'Montagezeit', lw: '2–3 Tage', sw: '5–10 Tage (inkl. Bohrung)', besser: 'LW' },
    { kriterium: 'Schall', lw: '45–55 dB', sw: 'Fast lautlos', besser: 'SW' },
    { kriterium: 'Empfehlung ' + city.name, lw: city.avgTemp >= 9 ? '✅ Empfohlen' : '✅ Gut geeignet', sw: '✅ Wenn Grundstück vorhanden', besser: 'equal' },
  ];

  const JAZ_SZENARIEN = [
    { system: 'Fußbodenheizung (35°C Vorlauf)', jaz: (jaz + 0.5).toFixed(1), note: `Optimal für ${city.name} — ${city.avgTemp >= 10 ? 'mildes Klima begünstigt FBH-Betrieb' : 'FBH maximiert JAZ auch im kühleren Klima'}` },
    { system: 'Moderne Heizkörper (45°C)', jaz: jaz.toFixed(1), note: `Standard für ${city.name} bei ${city.avgTemp}°C Jahresmittel` },
    { system: 'Altbau Heizkörper (55°C)', jaz: (jaz - 0.4).toFixed(1), note: `Noch wirtschaftlich — ${fmtEuro(Math.round(calc.ersparnis * 0.85))}/Jahr Ersparnis in ${city.name}` },
    { system: 'Hochtemperatur (65°C)', jaz: (jaz - 0.8).toFixed(1), note: `Hochtemperatur-WP nötig — trotzdem ${fmtEuro(Math.round(calc.ersparnis * 0.7))}/Jahr günstiger als Gas` },
    { system: 'Altbau ohne Sanierung (70°C)', jaz: (jaz - 1.0).toFixed(1), note: `Grenzbereich — hydraulischer Abgleich in ${city.name} oft ausreichend für Verbesserung` },
  ];
  const jazFBH = Math.min(jaz + 0.5, 4.8).toFixed(1);
  const jazHT  = Math.max(jaz - 0.5, 2.5).toFixed(1);

  const intros = [
    `Warum sind Luft-WP so dominant in ${city.name}? Keine Erdarbeiten nötig, keine Genehmigung, Montage in 1–3 Tagen. Hochtemperatur-Varianten bis 70°C Vorlauf sind für die meisten Bestandsgebäude in ${city.bundesland} geeignet. JAZ ${jaz} → ${fmtEuro(calc.ersparnis)}/Jahr Ersparnis in ${city.name}.`,
    `Luft-Wasser-WP ${city.name}: JAZ ${jazHT}–${jazFBH} je nach Vorlauftemperatur. Bei ${city.avgTemp}°C Jahresmittel ist die Luft-WP die wirtschaftlichste und am schnellsten installierbare Heizlösung. 92% Marktanteil in Deutschland 2024.`,
    `${city.name} (${city.bundesland}): Mit ${city.normAussentemp}°C Normaußentemperatur und ${city.avgTemp}°C Jahresmittel erreicht eine Luft-WP JAZ ${jaz}. Betriebskosten ${fmtEuro(calc.wpKosten)}/Jahr — ${fmtEuro(calc.ersparnis)} günstiger als Gas. Propan-Geräte (R290) liefern +5% KfW-Bonus.`,
    `Luft-WP vs. Sole-WP ${city.name}: Luft-WP: günstiger (${fmtEuro(18000)}–${fmtEuro(28000)}), schnelle Montage, JAZ ${jaz}. Sole-WP: teurer (€22–35k), JAZ ${Math.min(jaz + 1.0, 5.5).toFixed(1)}, aber +5% KfW immer. Für die meisten in ${city.name}: Luft-WP optimal.`,
  ];


  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
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
              {/* Preis-Badge — Eigenanteil nach KfW-Förderung */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-wp-amber/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  💰 ab {fmtEuro(foerd.eigenanteil)} Eigenanteil
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  💚 {fmtEuro(calc.ersparnis)}/J. sparen
                </span>
              </div>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
              {/* Ultra-lokale Fakten */}
              <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-6">
                {city.name}: {city.strompreis} ct/kWh Strom · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.normAussentemp}°C Normaußentemp. · {city.fernwaermeQuote}% Fernwärme
              </p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: `JAZ ${jazHT}–${jazFBH}`, label: 'Effizienzspanne', sub: city.avgTemp + '°C Jahresmittel' },
              { val: '92%', label: 'Marktanteil DE', sub: 'BWP 2024' },
              { val: '1–3 Tage', label: 'Montagezeit', sub: 'Inkl. Inbetriebnahme' },
              { val: fmtEuro(calc.ersparnis) + '/J.', label: 'Ersparnis', sub: 'vs. Gasheizung' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/30 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Kostenloses Angebot →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Luftwärmepumpe in {stadt} — Kosten, Effizienz und Eignung', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Eine Luftwärmepumpe in <strong>{city.name}</strong> ({city.bundesland}) erreicht bei {city.avgTemp}°C Jahresmitteltemperatur eine JAZ von {jaz}. Das entspricht Heizkosten von {fmtEuro(calc.wpKosten)}/Jahr für ein 120 m² EFH — statt {fmtEuro(calc.altKosten)}/Jahr mit Gas. 92% aller neu installierten WP in Deutschland sind Luft-Wasser-WP: günstiger, schneller und ohne Erdarbeiten.
            </p>
          </div>

          {/* JAZ-Szenarien */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Welche JAZ erreiche ich mit der Luftwärmepumpe in {city.name} nach Heizsystem
            ?</h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    {['Heizsystem', 'JAZ in ' + city.name, 'Jahreskosten', 'Hinweis'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { jaz: Number(jazFBH), note: JAZ_SZENARIEN[0].note },
                    { jaz: Number((jaz + 0.2).toFixed(1)), note: JAZ_SZENARIEN[1].note },
                    { jaz: jaz, note: JAZ_SZENARIEN[2].note },
                    { jaz: Number(jazHT), note: JAZ_SZENARIEN[3].note },
                  ].map((r, i) => (
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${i === 2 ? 'bg-wp-greenxlt' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{JAZ_SZENARIEN[i].system}</td>
                      <td className="px-4 py-3 font-mono font-bold text-wp-green">{r.jaz.toFixed(1)}</td>
                      <td className="px-4 py-3 font-mono text-wp-text2">{fmtEuro(Math.round(15000 / r.jaz * city.strompreis / 100))}/J.</td>
                      <td className="px-4 py-3 text-xs text-wp-text3">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hersteller */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Welcher Luftwärmepumpen-Hersteller passt für {city.name} — Vergleich 2026
            ?</h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-x-auto shadow-wp-sm">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    {['Modell', 'COP A7/W35', 'Max. VL', 'Kältemittel', 'KfW+5%', 'Schall', 'Preis'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HERSTELLER.map((h, i) => (
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-3 py-3 font-semibold text-wp-text text-sm">{h.name}</td>
                      <td className="px-3 py-3 font-mono text-wp-green font-bold">{h.cop}</td>
                      <td className="px-3 py-3 font-mono text-wp-text2">{h.maxVL}</td>
                      <td className="px-3 py-3 text-xs text-wp-text2">{h.kaeltemittel}</td>
                      <td className="px-3 py-3 text-sm">{h.kfwBonus ? '✅ +5%' : '—'}</td>
                      <td className="px-3 py-3 font-mono text-xs">{h.schall}</td>
                      <td className="px-3 py-3 font-mono text-xs text-wp-text3">{h.preis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-wp-text3 mt-2">Herstellerunabhängig — wir empfehlen das für Ihr Haus in {city.name} passende Gerät.</p>
          </div>

          {/* LW vs SW Vergleich */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Luft-WP vs. Sole-WP (Erdwärme) in {city.name}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    {['Kriterium', 'Luft-WP', 'Sole-WP', 'Vorteil'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LW_VS_SW.map((r, i) => (
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{r.kriterium}</td>
                      <td className={`px-4 py-3 text-sm ${r.besser === 'LW' ? 'text-wp-green font-bold' : 'text-wp-text2'}`}>{r.lw}</td>
                      <td className={`px-4 py-3 text-sm ${r.besser === 'SW' ? 'text-wp-green font-bold' : 'text-wp-text2'}`}>{r.sw}</td>
                      <td className="px-4 py-3 text-xs font-bold text-wp-text3">{r.besser === 'LW' ? '🌬️ Luft' : '🌍 Sole'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-wp-border rounded-2xl p-5 shadow-wp-sm sticky top-6">
            <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Luft-WP Kennzahlen</div>
            {[
              ['JAZ in ' + city.name, String(jaz)],
              ['JAZ mit FBH', jazFBH],
              ['Betriebskosten', fmtEuro(calc.wpKosten) + '/J.'],
              ['Ersparnis vs. Gas', fmtEuro(calc.ersparnis) + '/J.'],
              ['Montagezeit', '1–3 Tage'],
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
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
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">JAZ: Fraunhofer ISE · BWP Marktdaten 2024 · DWD Klimadaten · Stand März 2026</div>
      </div>
    </div>
  );
}
