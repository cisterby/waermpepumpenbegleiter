// components/programmatic/templates/FachbetriebTemplate.tsx
// waermepumpe-fachbetrieb — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1920&q=85', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=85', 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

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


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          src={ className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
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
          <h1 className="font-bold font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
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
          <a href="#angebot" className="inline-flex items-center gap-2 bg-[#1A4731] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2D7A52] transition-colors">
            Geprüften Fachbetrieb finden →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-3">
              {fillTemplate('Was macht einen guten WP-Fachbetrieb in {stadt} aus?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              Ein guter WP-Fachbetrieb in <strong>{city.name}</strong> hat: aktive KfW-LuL-Registrierung (Pflicht für Förderantrag), mindestens 5 WP-Installationen in 24 Monaten, HWK-Eintragung als Meisterbetrieb und Erfahrung mit {city.normAussentemp}°C Normaußentemperatur in {city.bundesland}. Nur so werden JAZ {jaz} und {foerd.gesamtSatz}% KfW-Förderung ({fmtEuro(foerd.zuschuss)}) zuverlässig erreicht.
            </p>
          </div>

          {/* 6 Kriterien */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-6">
              Wie erkenne ich einen seriösen WP-Fachbetrieb in {city.name}
            ?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {KRITERIEN.map((k, i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl shadow-md">
                  <div className="text-xl mb-2">{k.icon}</div>
                  <div className="font-bold font-bold text-[#1C2B2B] text-sm mb-1">{k.title}</div>
                  <p className="text-[#4A6358] text-xs leading-relaxed">{k.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Angebot-Checkliste */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Checkliste: Was muss ein WP-Angebot in {city.name} enthalten?
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">Position</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">Pflicht?</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#7A9E8E] uppercase">Hinweis</th>
                  </tr>
                </thead>
                <tbody>
                  {ANGEBOT_CHECKLISTE.map((row, i) => (
                    <tr key={i} className={`border-b border-gray-200 last:border-0 ${row.muss ? '' : 'opacity-80'}`}>
                      <td className="px-4 py-3 font-semibold text-[#1C2B2B]">{row.item}</td>
                      <td className="px-4 py-3">
                        {row.muss
                          ? <span className="text-[#1A4731] font-bold">✅ Pflicht</span>
                          : <span className="text-[#7A9E8E]">Optional</span>}
                      </td>
                      <td className="px-4 py-3 text-[#4A6358] text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Typische Fehler */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">
              Welche 5 Fehler kosten Eigentümer in {city.name}
            ?</h2>
            <div className="space-y-3">
              {FEHLER.map((f, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                  <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold font-semibold text-[#1C2B2B] text-sm">{f.fehler}</div>
                    <div className="text-[#4A6358] text-xs mt-0.5">→ {f.folge}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stadtdaten */}
          <div className="p-6 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
            <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-4">{h2s.klimadaten}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed mb-4">{si.klimadaten}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                [`${city.avgTemp}°C`, 'Jahresmitteltemperatur'],
                [`${city.normAussentemp}°C`, 'Normaußentemperatur'],
                [city.heizgradtage.toLocaleString('de-DE') + ' Kd/a', 'Heizgradtage'],
                [String(jaz), 'Erwartete JAZ'],
                [`${city.strompreis} ct/kWh`, 'Strompreis lokal'],
                [fmtEuro(calc.ersparnis) + '/J.', 'Ersparnis vs. Gas'],
              ].map(([v, l], i) => (
                <div key={i}><div className="text-[#7A9E8E] text-xs">{l}</div><div className="font-bold text-[#1C2B2B]">{v}</div></div>
              ))}
            </div>
          </div>

          {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          {/* FAQ */}
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

          {/* Links */}
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
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ').replace('foerderung','Förderung')} {city.name}
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
        <div className="mt-6 text-xs text-[#7A9E8E]">Klimadaten: DWD · Förderrecht: KfW/BAFA · Stand März 2026</div>
      </div>
    </div>
  );
}
