// components/programmatic/templates/AnbieterTemplate.tsx
// waermepumpe-anbieter — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=75';

/* ANBIETER_TYPEN moved inside component */

/* ANBIETER_KRITERIEN moved inside component */

/* ANGEBOTSVERGLEICH moved inside component */

export default function AnbieterTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  const ANBIETER_TYPEN = [
    { icon: '🏘️', typ: 'Lokaler SHK-Meisterbetrieb', vorteile: `Kennt ${city.name} und ${city.bundesland} — kurze Anfahrt, persönlicher Service`, nachteile: 'Evtl. kleinere Modellauswahl', kfw: true },
    { icon: '🔧', typ: 'Regionaler WP-Spezialist', vorteile: `WP-Erfahrung in ${city.bundesland}, dediziertes Team`, nachteile: 'Höhere Auslastung in der Saison', kfw: true },
    { icon: '🌐', typ: 'Bundesweiter Online-Anbieter', vorteile: 'Oft günstige Gerätepreise', nachteile: `Kein lokaler Service in ${city.name} — bei Störungen langsam`, kfw: false },
    { icon: '🏭', typ: 'Hersteller-Direktvertrieb', vorteile: 'Maximale Herstellerunterstützung', nachteile: 'Nicht herstellerunabhängig — nur eine Marke', kfw: false },
  ];
  const ANBIETER_KRITERIEN = [
    { kriterium: 'KfW-LuL-Registrierung', pflicht: true, warum: `Pflicht für KfW-Förderung in ${city.name} — ohne diese kein BEG-Zuschuss möglich` },
    { kriterium: 'HWK-Eintragung aktiv', pflicht: true, warum: `Aktive Eintragung in der Handwerksrolle ${city.bundesland} — Pflicht für Heizungsbau` },
    { kriterium: 'F-Gas-Zertifikat', pflicht: true, warum: 'EU 517/2014 — Pflicht für Kältemittelbefüllung' },
    { kriterium: 'Mind. 5 WP-Referenzen', pflicht: true, warum: `Nachweisbare WP-Erfahrung in ${city.bundesland} und Umgebung` },
    { kriterium: 'Heizlastberechnung DIN EN 12831', pflicht: true, warum: `Für ${city.normAussentemp}°C Normaußentemperatur ${city.name} — KfW-Pflicht` },
    { kriterium: 'Reaktionszeit ≤ 48h', pflicht: false, warum: `Lokaler Betrieb in ${city.name}: schnell vor Ort bei Störungen` },
    { kriterium: 'Bewertung ≥ 4,0/5', pflicht: false, warum: `Google-Bewertung für ${city.name} prüfen — Mindeststandard` },
  ];
  const ANGEBOTSVERGLEICH = [
    { pos: 'Heizlastberechnung DIN EN 12831', typ: 'Pflicht', note: `Grundlage für korrekte Dimensionierung in ${city.name} — KfW-Pflicht` },
    { pos: 'Hydraulischer Abgleich', typ: 'Pflicht (KfW)', note: `Ohne diesen: Förderantrag für ${city.name} abgelehnt` },
    { pos: 'WP-Modell + kW-Leistung', typ: 'Pflicht', note: 'Vollständige Gerätespezifikation mit COP-Angabe' },
    { pos: 'Pufferspeicher-Volumen', typ: 'Pflicht', note: `Mind. 30 l/kW — für ${city.name} Heizlast` },
    { pos: 'Elektroinstallation separat', typ: 'Pflicht', note: `Starkstromkreis + Netzbetreiber ${city.name}` },
    { pos: 'Wärmemengenzähler', typ: 'Pflicht (2026)', note: 'KfW-Pflicht ab 2026' },
    { pos: 'Kältemittelangabe', typ: 'Empfohlen', note: '+5% KfW-Bonus für R290' },
    { pos: 'KfW-Begleitung inklusive', typ: 'Empfohlen', note: `Seriöse Betriebe in ${city.name} bieten das an` },
    { pos: 'Garantiezeiten', typ: 'Empfohlen', note: `Herstellergarantie in ${city.bundesland}: 5–7 Jahre` },
  ];

  const intros = [
    `WP-Anbieter ${city.name}: Nicht jeder Heizungsbauer ist ein WP-Spezialist. Nur KfW-LuL-registrierte Betriebe können den Förderantrag (${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)}) korrekt begleiten. Wir prüfen alle unsere Partnerbetriebe in ${city.name} nach 7 Kriterien vorab.`,
    `${city.name} (${city.bundesland}): Preisunterschiede von 20–40% bei identischer Leistung sind bei WP-Angeboten keine Seltenheit. Entscheidend sind nicht nur der Preis, sondern KfW-LuL-Status, Heizlastberechnung und hydraulischer Abgleich im Angebot.`,
    `WP-Anbietervergleich ${city.name}: Bei JAZ ${jaz} und ${city.strompreis} ct/kWh Strompreis liegt die WP-Effizienz direkt in der Hand des Anbieters. Falsche Dimensionierung kostet ${fmtEuro(Math.round(calc.ersparnis * 0.2))}/Jahr Effizienz — über 20 Jahre: ${fmtEuro(Math.round(calc.ersparnis * 4))}.`,
    `Anbietersuche ${city.name}: Wir vermitteln ausschließlich Betriebe mit aktiver KfW-LuL-Registrierung, HWK-Eintragung und WP-Spezialisierung — nicht jeden SHK-Betrieb in ${city.bundesland}. Kostenlos, herstellerunabhängig, bis zu 3 Vergleichsangebote.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

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
              Welche WP-Anbieter-Typen gibt es in {city.name} im Vergleich
            ?</h2>
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
              Wie erkenne ich einen seriösen WP-Anbieter in {city.name}
            ?</h2>
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
              {[`Angebotsvergleich: Was muss in ${city.name} drinstehen?`,`Welche Positionen gehören in jedes seriöse Angebot in ${city.name}?`,`WP-Angebot ${city.name} — Pflichtpositionen im Überblick`,`Angebotscheck ${city.name}: Das muss enthalten sein`][cityHash(city,4,302)]}
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
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">{h2s.foerderung}</h2>
            <p className="text-wp-text2 text-base leading-relaxed mb-4">{si.foerderung}</p>
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
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

      {/* ── ANBIETER CONTENT ──────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-8">
        <h2 className="font-heading font-bold text-wp-text text-xl mb-5">
          Welche WP-Anbieter-Typen gibt es in {city.name} — und welcher passt?
        </h2>
        <div className="prose prose-sm max-w-none text-wp-text2 space-y-4 leading-relaxed">
          <p>
            In {city.name} (und {city.bundesland} allgemein) gibt es drei Anbieter-Typen: <strong>Lokale SHK-Meisterbetriebe</strong> (kennen lokale Auflagen, schnell vor Ort, meist 3–10 WP/Jahr Erfahrung), <strong>Systemanbieter / Direktmonteure</strong> (Enpal, Vamo, Thermondo — bundesweite Abdeckung, standardisierte Prozesse, oft günstiger), und <strong>Hersteller-Werkspartner</strong> (Vaillant, Stiebel Eltron — zertifizierte Montage, oft höhere Preise, dafür verlängerte Herstellergarantie).
          </p>
          <p>
            <strong>7 Qualitätskriterien für {city.name}:</strong> (1) HWK-Innungseintrag {city.bundesland}. (2) KfW-LuL-Nummer (Pflicht für BEG-Förderung). (3) F-Gas-Zertifikat Kategorie I. (4) Mind. 5 WP-Referenzen in den letzten 2 Jahren. (5) Heizlastberechnung DIN EN 12831 inklusive. (6) Haftpflicht mind. €1,5 Mio. (7) Lokaler Ansprechpartner mit max. 2 Stunden Reaktionszeit.
          </p>
          <p>
            <strong>Was unterscheidet Angebote in {city.name}?</strong> Preisunterschiede von 20–40% bei gleicher Leistung sind normal. Ursachen: Overhead, Materialstrategie (Eigenmarke vs. Markengerät), Subunternehmer-Ketten. Normieren Sie Angebote: gleicher WP-Typ, gleiche kW-Leistung, alle KfW-Pflichtpositionen (Hydraulischer Abgleich, Wärmemengenzähler) enthalten.
          </p>
        </div>
      </div>

      {/* ── VERWANDTE THEMEN ─────────────────────────── */}
      {crossKeywords.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-8">
          <h3 className="font-heading font-semibold text-wp-text text-base mb-3">
            Verwandte Themen für {city.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {crossKeywords.map(kw2 => kw2 && (
              <a key={kw2.slug} href={`/${kw2.slug}/${city.slug}`}
                className="px-3 py-1.5 bg-wp-bg border border-wp-border rounded-lg text-sm text-wp-text2 hover:border-wp-green hover:text-wp-green transition-all">
                {kw2.keyword.replace('[Stadt]', city.name)}
              </a>
            ))}
          </div>
        </div>
      )}
      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-heading font-bold text-wp-text text-xl mb-6">
          Was sich 2026 geändert hat — und was das für {city.name} bedeutet
        </h2>
        <div className="space-y-4">

          {/* GEG-Reform */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-wp-text text-sm leading-relaxed">{act.gegReform}</p>
          </div>

          {/* Neue Lärmvorschrift */}
          {['luft-wasser-waermepumpe','luftwaermepumpe','waermepumpe','waermepumpe-kosten','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-kaufen','waermepumpe-nachruesten','heizung-tauschen','waermepumpe-altbau'].includes(keyword.slug) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Neue Lärmvorschrift ab 01.01.2026</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.laerm10db}</p>
            </div>
          )}

          {/* Steuerliche Absetzbarkeit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-installateur','waermepumpe-preise','waermepumpe-installation','heizung-tauschen'].includes(keyword.slug) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.steuerAbsetz}</p>
            </div>
          )}

          {/* KfW-Ergänzungskredit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-preise','erdwaermepumpe','waermepumpe-neubau'].includes(keyword.slug) && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergänzungskredit</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.kfwKredit}</p>
            </div>
          )}

          {/* Wartungskosten */}
          {['waermepumpe-kosten','waermepumpe','waermepumpe-preise','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-fachbetrieb','waermepumpe-kaufen'].includes(keyword.slug) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Wartungs- &amp; Langzeitkosten</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.wartungskosten}</p>
            </div>
          )}

          {/* Finanzierung */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-wp-text text-sm leading-relaxed">{act.finanzierung}</p>
          </div>

        </div>
      </div>
      <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">KfW BEG 458 · HWK · BWP Marktdaten 2024 · Stand März 2026</div>
      </div>
    </div>
  );
}
