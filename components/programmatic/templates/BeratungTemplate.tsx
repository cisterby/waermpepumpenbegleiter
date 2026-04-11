// components/programmatic/templates/BeratungTemplate.tsx
// waermepumpe-beratung — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle, AlertTriangle, Calculator, FileText } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock , getUniqueLocalParagraph, getNearbyLinkContext } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1920&q=85', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=85', 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

/* SCHRITTE moved inside component */
/* orphaned SCHRITTE body removed */

/* THEMEN moved inside component */

/* CHECKLISTE moved inside component */

export default function BeratungTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const THEMEN = [
    { icon: '🔧', title: 'Geräteauswahl & Hersteller', text: `Luft-Wasser vs. Sole-Wasser, Hochtemperatur vs. Standard, R290-Bonus für +5% KfW. Für ${city.name} mit ${city.avgTemp}°C Jahresmittel empfehlen wir meist die Luft-WP.` },
    { icon: '🏛️', title: 'KfW-Förderung & Landesförderung', text: `${foerd.gesamtSatz}% KfW für Ihre Situation in ${city.name}${city.bundeslandFoerderung ? ` + ${city.bundeslandFoerderung}` : ''}. Antrag muss vor Baubeginn gestellt werden.` },
    { icon: '💶', title: 'Kostenrahmen & Wirtschaftlichkeit', text: `Betriebskosten in ${city.name}: ${fmtEuro(calc.wpKosten)}/Jahr (bei ${city.strompreis} ct/kWh, JAZ ${jaz}). Ersparnis vs. Gas: ${fmtEuro(calc.ersparnis)}/Jahr.` },
    { icon: '🏚️', title: 'Altbau-Eignung', text: `In ${city.name}: 70–80% aller Altbauten geeignet. Vorlauftemperatur entscheidet — Hochtemperatur-WP löst fast alle Fälle.` },
    { icon: '📅', title: 'GEG & Fristen', text: `GEG-Frist ${city.name}: ${city.gegFrist.split('-').reverse().join('.')}. Wer jetzt plant, sichert sich volle Förderung und Installateurkapazitäten.` },
  ];
  const CHECKLISTE = [
    { item: 'Vorlauftemperatur des aktuellen Heizkreises', why: `Entscheidet ob Standard- oder Hochtemperatur-WP für ${city.name}` },
    { item: 'Wohnfläche und Baujahr', why: `Grundlage Heizlastberechnung nach DIN EN 12831 für ${city.normAussentemp}°C Normaußentemperatur ${city.name}` },
    { item: 'Platz im Keller (mind. 1 m²)', why: 'Pufferspeicher 200–500 l — Pflicht für Taktschutz' },
    { item: 'Eigentümer oder Vermieter?', why: `Eigennutzer bekommen höhere KfW-Förderung in ${city.name} (bis 70%)` },
    { item: 'Aktuelle Heizung (Gas/Öl/Nachtspeicher?)', why: 'Bestimmt Klima-Speed-Bonus (+20%) und GEG-Frist' },
    { item: 'Stromtarif-Situation', why: `${city.strompreis} ct/kWh in ${city.name} — WP-Sondertarif kann ${fmtEuro(Math.round(calc.wpKosten * 0.12))} sparen` },
    { item: 'Fördersituation: Einkommen unter €40.000?', why: '+30% Einkommensbonus KfW' },
    { item: 'PV-Anlage vorhanden oder geplant?', why: 'PV + WP Kombination spart weitere 30–40% Betriebskosten' },
  ];

  const SCHRITTE = [
    { icon: '📞', nr: '1', title: 'Erstkontakt & Gebäudecheck (kostenlos)', text: `Wohnfläche, Baujahr, aktuelle Heizung, Vorlauftemperatur und Dämmzustand — auf Ihr Haus in ${city.name} zugeschnitten. Dauer ca. 10 Minuten. Ergebnis: erste Einschätzung ob WP sinnvoll ist.` },
    { icon: '📊', nr: '2', title: 'Wirtschaftlichkeitsanalyse', text: `Stadtspezifische Kalkulation für ${city.name}: ${city.strompreis} ct/kWh Strom, JAZ ${jaz}, ${city.gaspreis} ct/kWh Gas. Ergebnis: ${fmtEuro(calc.ersparnis)}/Jahr Ersparnis und Amortisationszeit.` },
    { icon: '🏛️', nr: '3', title: 'Fördercheck', text: `KfW-Förderquote für Ihre Situation in ${city.name}: typisch ${foerd.gesamtSatz}%. ${city.bundeslandFoerderung ? `Plus ${city.bundeslandFoerderung} (${city.bundeslandFoerderungBetrag}).` : `In ${city.bundesland} gilt die volle KfW-Bundesförderung.`}` },
    { icon: '🔧', nr: '4', title: 'Fachbetrieb-Matching', text: `Wir verbinden Sie mit bis zu 3 geprüften Betrieben in ${city.name} — HWK-eingetragen, KfW-LuL-registriert, mit WP-Erfahrung in ${city.bundesland}.` },
    { icon: '📋', nr: '5', title: 'Angebotsvergleich', text: `Alle 3 Angebote aus ${city.name} werden vollständig verglichen — Gerät, Montage, Hydraulik, Elektrik. Versteckte Posten werden aufgedeckt.` },
    { icon: '✅', nr: '6', title: 'KfW-Antragsbegleitung', text: `KfW-Antrag MUSS vor Baubeginn gestellt werden — wir stellen sicher, dass das in ${city.name} korrekt und rechtzeitig passiert.` },
  ];

  const intros = [
    `Eine Wärmepumpen-Beratung in ${city.name} ist die Voraussetzung für eine wirtschaftliche Entscheidung. Mit ${city.strompreis} ct/kWh Strompreis und JAZ ${jaz} bei ${city.avgTemp}°C Jahresmittel liegt die Ersparnis gegenüber Erdgas bei ${fmtEuro(calc.ersparnis)}/Jahr. Wer falsch dimensioniert oder den KfW-Antrag zu spät stellt, verliert Förderung und Effizienz.`,
    `Herstellerunabhängige WP-Beratung in ${city.name}: Wir prüfen zuerst ob Ihr Haus geeignet ist — dann erst welches Gerät. Bei ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und JAZ ${jaz} amortisiert sich die Investition nach ${foerd.gesamtSatz}% KfW (${fmtEuro(foerd.zuschuss)}) in ${calc.amortisationJahre} Jahren.`,
    `Häufigste Fehler bei WP-Projekten in ${city.name}: kein Heizlastgutachten, KfW-Antrag zu spät, falsches Gerät für die Vorlauftemperatur. Unsere strukturierte Beratung verhindert alle drei — kostenlos und unabhängig.`,
    `WP-Beratung ${city.name} (${city.bundesland}): ${city.normAussentemp}°C Normaußentemperatur, ${city.avgTemp}°C Jahresmittel, JAZ-Ziel ${jaz}. Betriebskosten: ${fmtEuro(calc.wpKosten)}/Jahr. Eigenanteil nach ${foerd.gesamtSatz}% KfW: ${fmtEuro(foerd.eigenanteil)}.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

  const uniqueParagraph = getUniqueLocalParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);

  const nearbyLinks = getNearbyLinkContext(city, nearby, keyword, jaz);


  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          className="absolute inset-0 w-full h-full object-cover" loading="eager" decoding="async" {...({fetchPriority:"high"} as object)} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1910]/90 via-[#0A1910]/70 to-[#0A1910]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white transition-colors">{keyword.keyword.replace(' [Stadt]','')}</Link>
            <span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          {city.einwohner >= 100000 && (
            <div className="inline-block bg-[#D97706] text-[#1A4731] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              GEG-Frist {city.name}: {city.gegFrist.split('-').reverse().join('.')}
            </div>
          )}
          <h1 className="font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
              {/* Preis-Badge — Eigenanteil nach KfW-Förderung */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-[#D97706]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
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
              { val: `${foerd.gesamtSatz}%`, label: 'KfW-Förderung', sub: 'Eigennutzer' },
              { val: fmtEuro(foerd.zuschuss), label: 'Zuschuss', sub: 'nicht rückzahlbar' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'nach Förderung' },
              { val: `${fmtEuro(calc.ersparnis)}/J.`, label: 'Ersparnis', sub: 'vs. Erdgas' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/75 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Kostenlose Beratung starten →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet H2 */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Wo bekomme ich eine unabhängige WP-Beratung in {stadt}?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Unabhängige WP-Beratung in <strong>{city.name}</strong> bietet Wärmepumpenbegleiter.de kostenlos an: Gebäudecheck, Heizlastberechnung, Förderberechnung ({foerd.gesamtSatz}% KfW = {fmtEuro(foerd.zuschuss)}) und Vermittlung von bis zu 3 geprüften Fachbetrieben. Herstellerneutral, 14 Jahre Erfahrung in {city.bundesland}.
            </p>
          </div>

          {/* 5-Schritte Beratungsablauf */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-6">
              {fillTemplate('Wie läuft eine WP-Beratung in {stadt} ab? — 5 Schritte', city, jaz)}
            </h2>
            <div className="space-y-3">
              {SCHRITTE.map((s, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow-md">
                  <div className="text-2xl shrink-0">{s.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-1">Schritt {s.nr}</div>
                    <div className="font-bold text-[#1C2B2B] text-sm mb-1">{s.title}</div>
                    <p className="text-[#4A6358] text-sm leading-relaxed">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beratungsthemen */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">
              {[`Was deckt unsere WP-Beratung für ${city.name} ab?`,`Themenübersicht: Was besprechen wir für Ihr Haus in ${city.name}?`,`Diese Themen klären wir für ${city.name} kostenlos`,`Beratungsumfang ${city.name} — alle Themen im Überblick`][cityHash(city,4,310)]}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {THEMEN.map((t, i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="text-xl mb-2">{t.icon}</div>
                  <div className="font-semibold text-[#1C2B2B] text-sm mb-1">{t.title}</div>
                  <p className="text-[#4A6358] text-xs leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checkliste */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">
              {[`Erstgespräch in ${city.name} — gut vorbereitet`,`Was hilft uns beim Erstgespräch für Ihr Haus in ${city.name}?`,`Checkliste Erstgespräch ${city.name}: Diese Infos helfen`,`Vorbereitung Erstgespräch ${city.name} — so geht es schneller`][cityHash(city,4,311)]}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">Unterlagen / Info</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">Warum wichtig</th>
                  </tr>
                </thead>
                <tbody>
                  {CHECKLISTE.map((row, i) => (
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B] text-sm">{row.item}</td>
                      <td className="px-4 py-3 text-[#4A6358] text-sm">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stadtspezifisch */}
          <div className="p-6 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
            <h2 className="font-bold text-[#1C2B2B] text-xl mb-4">{h2s.klimadaten}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed mb-4">{si.klimadaten}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
              {[
                [`${city.avgTemp}°C`, 'Jahresmittel'],
                [jaz.toString(), 'Erwartete JAZ'],
                [`${city.strompreis} ct/kWh`, 'Strompreis'],
                [fmtEuro(calc.wpKosten) + '/J.', 'WP-Betriebskosten'],
                [fmtEuro(calc.ersparnis) + '/J.', 'Ersparnis vs. Gas'],
                [fmtEuro(foerd.zuschuss), 'KfW-Zuschuss'],
              ].map(([v, l], i) => (
                <div key={i}><div className="text-[#7A9E8E] text-xs">{l}</div><div className="font-bold text-[#1C2B2B]">{v}</div></div>
              ))}
            </div>
            {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('eingestellt') && (
              <p className="text-sm text-[#4A6358] pt-3 border-t border-gray-200">
                <strong>{city.bundesland}:</strong> {city.bundeslandFoerderung} — {city.bundeslandFoerderungBetrag}
              </p>
            )}
          </div>

          {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          {/* FAQ */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md mb-10">
              {faqs.map((faq, i) => (
                <details key={i} className="group border-b border-gray-200 last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                    <span className="font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-gray-200">
                    <p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearbyLinks.map(nl => (
                  <Link key={nl.city.slug} href={nl.url}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">{nl.text}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {(keyword.crossLinks ?? []).map((slug: string) => (
                  <Link key={slug} href={`/${slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ').replace('foerderung','Förderung').replace('installateur','Installateur')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-6">
            <div className="text-xs font-bold text-[#1A4731] uppercase tracking-wide mb-3">{city.name} — Kennzahlen</div>
            {[
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Förderquote', `${foerd.gesamtSatz}%`],
              ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
              ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
              ['JAZ in ' + city.name, String(jaz)],
              ['Amortisation', `${calc.amortisationJahre} J.`],
              ['GEG-Frist', city.gegFrist.split('-').reverse().join('.')],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="text-[#4A6358]">{l}</span>
                <span className="font-bold text-[#1C2B2B]">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-[#1A4731] text-white font-bold py-3 rounded-xl hover:bg-[#2D7A52] transition-colors text-sm">
              Kostenloses Angebot →
            </a>
          </div>
        </div>
      </div>

      <div id="angebot" className="bg-[#1A4731] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <p className="text-white/60 text-center text-sm mb-8">Kostenlos · Herstellerunabhängig · KfW-Begleitung inklusive</p>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

      {/* ── VERWANDTE THEMEN ─────────────────────────── */}
      {crossKeywords.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-8">
          <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">
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

      {/* Landesförderung */}
      {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('eingestellt') && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-[#E8F5EE] border border-[#3DA16A]/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">💶</span>
            <div>
              <p className="font-bold text-[#1A4731] text-sm mb-1">{city.bundesland}-Förderung: {city.bundeslandFoerderung}</p>
              <p className="text-[#4A6358] text-xs leading-relaxed">
                {city.bundeslandFoerderungBetrag} — kombinierbar mit KfW-Bundesförderung.
                {city.bundeslandFoerderungUrl && <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-[#1A4731] font-semibold hover:underline">Mehr Infos →</a>}
              </p>
            </div>
          </div>
        </div>
      )}
      {!city.bundeslandFoerderung && city.bundeslandFoerderungBetrag && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-4">
            <p className="text-[#4A6358] text-xs"><strong className="text-[#1C2B2B]">{city.bundesland}:</strong> Kein aktives Landesprogramm — {city.bundeslandFoerderungBetrag}. KfW gilt vollständig.</p>
          </div>
        </div>
      )}

      {city.avgTemp >= 11.0 && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="bg-[#E8F5EE] border border-[#3DA16A]/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">✅</span>
            <div>
              <p className="font-bold text-[#1A4731] text-sm mb-1">{city.name}: {city.avgTemp}°C Jahresmittel — ideale Bedingungen</p>
              <p className="text-[#4A6358] text-xs leading-relaxed">{city.name} hat eine der günstigsten Klimabedingungen für Wärmepumpen in Deutschland. Bei {city.avgTemp}°C Jahresmittel erreicht eine Luft-WP JAZ {jaz} — das macht die Investition besonders wirtschaftlich.</p>
            </div>
          </div>
        </div>
      )}
      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-bold text-[#1C2B2B] text-xl mb-6">
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
        <div className="mt-6 text-xs text-[#7A9E8E]">Klimadaten: DWD · Förderrecht: KfW/BAFA · Effizienz: Fraunhofer ISE · Stand März 2026</div>
      </div>
    </div>
  );
}
