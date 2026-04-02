// components/programmatic/templates/StromverbrauchTemplate.tsx
// waermepumpe-stromverbrauch — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=85', 'https://images.unsplash.com/photo-1509391111902-de5d52b3f785?w=1920&q=85', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85', 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85', 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

export default function StromverbrauchTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  // Stromverbrauch-Berechnungen
  const heizStrom = Math.round(15000 / jaz);
  const wwStrom   = Math.round(1500 / jaz * 0.7);
  const gesamtStrom = heizStrom + wwStrom;
  const kostenNormal  = Math.round(gesamtStrom * city.strompreis / 100);
  const wpTarif       = Math.round(city.strompreis - 5);
  const kostenWpTarif = Math.round(gesamtStrom * wpTarif / 100);
  const pvKosten      = Math.round(gesamtStrom * 4 / 100); // ~4 ct/kWh Eigenverbrauch
  const pvStrom       = Math.round(city.avgSunHours * 8 * 0.85);
  const pvFuerWp      = Math.min(pvStrom, gesamtStrom);

  const TARIF_VERGLEICH = [
    { tarif: 'Normaler Haushaltsstrom', preis: city.strompreis + ' ct/kWh', kosten: fmtEuro(kostenNormal) + '/J.', note: 'Kein WP-Sondertarif aktiv' },
    { tarif: 'WP-Sondertarif', preis: wpTarif + ' ct/kWh', kosten: fmtEuro(kostenWpTarif) + '/J.', note: '2. Zähler + Nachtabsenkung' },
    { tarif: 'WP + PV-Eigenverbrauch', preis: '~4 ct/kWh', kosten: fmtEuro(pvKosten) + '/J.', note: `${pvFuerWp.toLocaleString('de-DE')} kWh/J. PV direkt` },
  ];

  const JAZ_TABELLE = [
    { system: 'Fußbodenheizung (35°C)', jaz: (jaz + 0.5).toFixed(1), strom: Math.round(15000 / (jaz + 0.5)) + ' kWh/J.', kosten: fmtEuro(Math.round(15000 / (jaz + 0.5) * city.strompreis / 100)) + '/J.' },
    { system: 'Heizkörper Standard (55°C)', jaz: jaz.toFixed(1), strom: heizStrom + ' kWh/J.', kosten: fmtEuro(kostenNormal) + '/J.' },
    { system: 'Altbau hoch (70°C)', jaz: Math.max(jaz - 0.5, 2.5).toFixed(1), strom: Math.round(15000 / Math.max(jaz - 0.5, 2.5)) + ' kWh/J.', kosten: fmtEuro(Math.round(15000 / Math.max(jaz - 0.5, 2.5) * city.strompreis / 100)) + '/J.' },
    { system: 'Altbau saniert (45°C)', jaz: (jaz + 0.2).toFixed(1), strom: Math.round(15000 / (jaz + 0.2)) + ' kWh/J.', kosten: fmtEuro(Math.round(15000 / (jaz + 0.2) * city.strompreis / 100)) + '/J.' },
  ];

  const OPTIMIERUNG = [
    { icon: '⚡', titel: 'WP-Sondertarif beantragen', einsparung: fmtEuro(kostenNormal - kostenWpTarif) + '/J.', text: `In ${city.name} bieten die meisten Netzbetreiber einen WP-Tarif mit ca. ${wpTarif} ct/kWh an. Erfordert einen zweiten Stromzähler (ca. €300–600 einmalig). Amortisiert sich in 1–2 Jahren.` },
    { icon: '☀️', titel: 'PV-Anlage für Eigenverbrauch', einsparung: fmtEuro(Math.round(pvFuerWp * city.strompreis / 100 * 0.8)) + '/J.', text: `Bei ${city.avgSunHours} Sonnenstunden in ${city.name} erzeugt 8 kWp ca. ${pvStrom.toLocaleString('de-DE')} kWh/Jahr. ${Math.round((pvFuerWp / gesamtStrom) * 100)}% davon kann die WP direkt nutzen.` },
    { icon: '🌙', titel: 'Smart-Nachtbetrieb', einsparung: 'bis 15%', text: `Wärmepumpen laden nachts bei günstigeren Tarifen den Pufferspeicher vor. In ${city.name} mit ${city.avgTemp}°C Jahresmittel lohnt ein Pufferspeicher von 200–300 l besonders.` },
    { icon: '🏠', titel: 'Hydraulischer Abgleich', einsparung: '5–15%', text: 'Ein korrekt durchgeführter hydraulischer Abgleich (KfW-Pflicht) verbessert die JAZ um 0,2–0,5. Bei JAZ ' + jaz + ' in ' + city.name + ' bedeutet das ' + fmtEuro(Math.round(calc.ersparnis * 0.1)) + '/Jahr mehr Ersparnis.' },
  ];

  const intros = [
    `WP-Stromverbrauch ${city.name}: JAZ ${jaz} bei ${city.avgTemp}°C → ${gesamtStrom.toLocaleString('de-DE')} kWh/Jahr für Heizung + Warmwasser. Bei ${city.strompreis} ct/kWh: ${fmtEuro(kostenNormal)}/Jahr. Mit WP-Tarif (${wpTarif} ct): ${fmtEuro(kostenWpTarif)}/Jahr. Mit PV-Eigenverbrauch: unter ${fmtEuro(pvKosten)}/Jahr.`,
    `WP-Sondertarif ${city.name}: Strom auf ca. ${wpTarif} ct/kWh senken = ${fmtEuro(kostenNormal - kostenWpTarif)}/Jahr sparen. Mit ${city.avgSunHours} Sonnenstunden PV-Anlage: ${Math.round((pvFuerWp / gesamtStrom) * 100)}% des WP-Stroms kostenlos.`,
    `Smart-Grid ${city.name}: ${city.avgSunHours > 1500 ? city.avgSunHours + ' Sonnenstunden — beste Bedingungen für PV+WP Kombination' : 'WP-Sondertarif als Optimierung empfohlen'}. JAZ ${jaz} → ${gesamtStrom.toLocaleString('de-DE')} kWh/J. → ${fmtEuro(kostenNormal)}/J. ohne Optimierung.`,
    `${city.name}: JAZ ${jaz} → Heizstrom ${heizStrom.toLocaleString('de-DE')} kWh + Warmwasserstrom ${wwStrom.toLocaleString('de-DE')} kWh = ${gesamtStrom.toLocaleString('de-DE')} kWh/Jahr. Bei ${city.strompreis} ct/kWh Strompreis: ${fmtEuro(kostenNormal)}/Jahr. Das sind ${fmtEuro(calc.ersparnis)}/Jahr weniger als Gasheizung.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        <img src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          className="absolute inset-0 w-full h-full object-cover" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1910]/90 via-[#0A1910]/70 to-[#0A1910]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          <h1 className="font-bold font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
              {/* Preis-Badge */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-[#D97706]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  💰 {fmtEuro(calc.wpKosten)}/J. Betriebskosten
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
              { val: gesamtStrom.toLocaleString('de-DE') + ' kWh', label: 'Jahresstromverbrauch', sub: `JAZ ${jaz} · 120 m² EFH` },
              { val: fmtEuro(kostenNormal), label: 'Kosten/Jahr', sub: `${city.strompreis} ct/kWh` },
              { val: fmtEuro(kostenWpTarif), label: 'Mit WP-Tarif', sub: `${wpTarif} ct/kWh` },
              { val: city.avgSunHours + ' h/J.', label: 'Sonnenstunden', sub: 'PV+WP möglich' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/75 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Kostenloses Angebot →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Wie viel Strom verbraucht eine Wärmepumpe in {stadt}?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Eine Luft-Wasser-Wärmepumpe in <strong>{city.name}</strong> (JAZ {jaz} bei {city.avgTemp}°C Jahresmittel) verbraucht für ein 120 m² EFH ca. <strong>{gesamtStrom.toLocaleString('de-DE')} kWh/Jahr</strong>: {heizStrom.toLocaleString('de-DE')} kWh Heizung + {wwStrom.toLocaleString('de-DE')} kWh Warmwasser. Bei {city.strompreis} ct/kWh Strompreis ergibt das {fmtEuro(kostenNormal)}/Jahr — mit WP-Tarif ({wpTarif} ct/kWh) nur noch {fmtEuro(kostenWpTarif)}/Jahr.
            </p>
          </div>

          {/* Berechnung transparent */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Wie berechne ich den WP-Stromverbrauch für {city.name}
            ?</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md font-mono text-sm">
              <div className="grid grid-cols-2 gap-2 text-[#4A6358]">
                <span>Heizwärmebedarf (Annahme):</span><span className="text-[#1C2B2B] font-bold">15.000 kWh/Jahr</span>
                <span>JAZ in {city.name}:</span><span className="text-[#1C2B2B] font-bold">{jaz}</span>
                <span>Heizstrom:</span><span className="text-[#1C2B2B] font-bold">15.000 ÷ {jaz} = {heizStrom.toLocaleString('de-DE')} kWh</span>
                <span>Warmwasserstrom:</span><span className="text-[#1C2B2B] font-bold">~{wwStrom.toLocaleString('de-DE')} kWh/Jahr</span>
                <span className="border-t border-gray-200 pt-2">Gesamt:</span><span className="border-t border-gray-200 pt-2 text-[#1A4731] font-bold">{gesamtStrom.toLocaleString('de-DE')} kWh/Jahr</span>
                <span>× {city.strompreis} ct/kWh:</span><span className="text-[#1C2B2B] font-bold">{fmtEuro(kostenNormal)}/Jahr</span>
              </div>
            </div>
          </div>

          {/* JAZ-Tabelle */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Wie unterscheidet sich der Stromverbrauch nach Heizsystem in {city.name}
            ?</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    {['Heizsystem', 'JAZ', 'Jahresstrom', 'Kosten/Jahr'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {JAZ_TABELLE.map((r, i) => (
                    <tr key={i} className={`border-b border-gray-200 last:border-0 ${i === 0 ? 'bg-[#F2FAF5]' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B]">{r.system}</td>
                      <td className="px-4 py-3 font-mono text-[#1C2B2B]">{r.jaz}</td>
                      <td className="px-4 py-3 font-mono text-[#4A6358]">{r.strom}</td>
                      <td className={`px-4 py-3 font-mono font-bold ${i === 0 ? 'text-[#1A4731]' : 'text-[#1C2B2B]'}`}>{r.kosten}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#7A9E8E] mt-2">Basis: 120 m² EFH, 15.000 kWh Jahresheizwärmebedarf, {city.strompreis} ct/kWh Strompreis {city.name}</p>
          </div>

          {/* Tarifvergleich */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Welcher Tarif ist optimal für die WP in {city.name}
            ?</h2>
            <div className="space-y-3">
              {TARIF_VERGLEICH.map((t, i) => (
                <div key={i} className={`p-4 rounded-xl border ${i === 2 ? 'bg-[#F2FAF5] border-gray-200l' : 'bg-white border-gray-200'}`}>
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="font-bold font-bold text-[#1C2B2B] text-sm">{t.tarif}</div>
                      <div className="text-[#4A6358] text-xs mt-0.5">{t.note}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-[#1A4731]">{t.kosten}</div>
                      <div className="text-xs text-[#7A9E8E]">{t.preis}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimierungen */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">
              Wie reduziere ich den WP-Stromverbrauch in {city.name} zu optimieren
            ?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {OPTIMIERUNG.map((o, i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl">{o.icon}</span>
                    <span className="text-xs font-bold text-[#1A4731] bg-[#F2FAF5] px-2 py-0.5 rounded-full">{o.einsparung} sparen</span>
                  </div>
                  <div className="font-bold font-semibold text-[#1C2B2B] text-sm mb-1">{o.titel}</div>
                  <p className="text-[#4A6358] text-xs leading-relaxed">{o.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* H3 + FAQ */}
          {faqs.length > 0 && (
            <div className="p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md mb-10">
              {faqs.map((faq, i) => (
                <details key={i} className="group border-b border-gray-200 last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                    <span className="font-bold font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-gray-200">
                    <p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">{n.name}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {(keyword.crossLinks ?? []).map((slug: string) => (
                  <Link key={slug} href={`/${slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-6">
            <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Strom-Kennzahlen</div>
            {[
              ['Jahresstromverbrauch', gesamtStrom.toLocaleString('de-DE') + ' kWh'],
              ['Strompreis lokal', city.strompreis + ' ct/kWh'],
              ['Kosten (Normal)', fmtEuro(kostenNormal) + '/J.'],
              ['Kosten (WP-Tarif)', fmtEuro(kostenWpTarif) + '/J.'],
              ['JAZ in ' + city.name, String(jaz)],
              ['Sonnenstunden', city.avgSunHours + ' h/J.'],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="text-[#4A6358]">{l}</span>
                <span className="font-bold text-[#1C2B2B]">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-[#1A4731] text-white font-bold py-3 rounded-xl hover:bg-[#2D7A52] transition-colors text-sm">Kostenloses Angebot →</a>
          </div>
        </div>
      </div>

      <div id="angebot" className="bg-[#1A4731] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bold font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

      {/* ── VERWANDTE THEMEN ─────────────────────────── */}
      {crossKeywords.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-8">
          <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">
            Verwandte Themen für {city.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {crossKeywords.map(kw2 => kw2 && (
              <a key={kw2.slug} href={`/${kw2.slug}/${city.slug}`}
                className="px-3 py-1.5 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:border-[#1A4731] hover:text-[#1A4731] transition-all">
                {kw2.keyword.replace('[Stadt]', city.name)}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── VISUELLER TRENNER ─────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden my-8" style={{ height: '180px' }}>
        <img
          src={pickImg(SEC1_IMGS, city.lat, city.lng, 5)}
          alt={`${keyword.keyword.replace('[Stadt]', city.name)} Übersicht`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,25,16,0.88) 0%, rgba(10,25,16,0.45) 60%, rgba(10,25,16,0.15) 100%)' }} />
        <div className="absolute inset-y-0 left-0 flex items-center px-8">
          <div>
            <p className="text-white font-bold text-lg leading-tight">{keyword.keyword.replace('[Stadt]', city.name)}</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {fmtEuro(foerd.eigenanteil)} Eigenanteil · JAZ {jaz} · {foerd.gesamtSatz}% KfW-Förderung
            </p>
          </div>
        </div>
      </div>
      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-6">
          Was sich 2026 geändert hat — und was das für {city.name} bedeutet
        </h2>
        <div className="space-y-4">

          {/* GEG-Reform */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.gegReform}</p>
          </div>

          {/* Neue Lärmvorschrift */}
          {['luft-wasser-waermepumpe','luftwaermepumpe','waermepumpe','waermepumpe-kosten','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-kaufen','waermepumpe-nachruesten','heizung-tauschen','waermepumpe-altbau'].includes(keyword.slug) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Neue Lärmvorschrift ab 01.01.2026</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.laerm10db}</p>
            </div>
          )}

          {/* Steuerliche Absetzbarkeit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-installateur','waermepumpe-preise','waermepumpe-installation','heizung-tauschen'].includes(keyword.slug) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.steuerAbsetz}</p>
            </div>
          )}

          {/* KfW-Ergänzungskredit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-preise','erdwaermepumpe','waermepumpe-neubau'].includes(keyword.slug) && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergänzungskredit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.kfwKredit}</p>
            </div>
          )}

          {/* Wartungskosten */}
          {['waermepumpe-kosten','waermepumpe','waermepumpe-preise','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-fachbetrieb','waermepumpe-kaufen'].includes(keyword.slug) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Wartungs- &amp; Langzeitkosten</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.wartungskosten}</p>
            </div>
          )}

          {/* Finanzierung */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.finanzierung}</p>
          </div>

        </div>
      </div>
      <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-[#7A9E8E]">JAZ-Daten: Fraunhofer ISE · Strompreise: BDEW 2026 · DWD Klimadaten · Stand März 2026</div>
      </div>
    </div>
  );
}
