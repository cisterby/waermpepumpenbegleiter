// components/programmatic/templates/KaufenTemplate.tsx
// "waermepumpe-kaufen" — transactional
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { estimateJAZ } from '@/lib/city-utils';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools (city-hash varied, no duplicate content risk)
const HERO_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?w=1920&q=85'];
const SEC1_IMGS = ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85', 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85', 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=1920&q=85'];
const SEC2_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

export default function KaufenTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const variant = Math.abs(Math.round(city.lat * 3 + city.lng * 7)) % 4;
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean);
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={h1}
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/96 via-wp-dark/88 to-wp-dark/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="flex items-center gap-2 text-sm mb-5 flex-wrap">
              <Link href="/" className="text-white/80 hover:text-white/70 transition-colors">Startseite</Link>
              <span className="text-white/70">›</span>
              <Link href={`/${keyword.slug}`} className="text-white/80 hover:text-white/70 transition-colors">
                {keyword.keyword.replace('[Stadt]', '').trim()}
              </Link>
              <span className="text-white/70">›</span>
              <span className="text-white/80">{city.name}</span>
            </nav>
            <h1 className="font-bold font-extrabold text-white leading-tight mb-4" style={{ fontSize: 'clamp(30px,4.5vw,56px)' }}>
              {h1}
            </h1>
              {/* Ultra-lokale Fakten */}
              <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-5">
                {city.name}: {city.strompreis} ct/kWh Strom · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.normAussentemp}°C Normaußentemp. · {city.fernwaermeQuote}% Fernwärme
              </p>
              {/* Preis-Badge — Eigenanteil nach KfW-Förderung */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-[#D97706]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  💰 ab {fmtEuro(foerd.eigenanteil)} Eigenanteil
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  💚 {fmtEuro(calc.ersparnis)}/J. sparen
                </span>
              </div>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-8">
              {[
                `Wärmepumpe kaufen in {stadt} — welches Modell passt zu Ihrem Haus? Kaufberater für {baujahr}-Gebäude mit {avgTemp}°C Klimadaten.`.replace('{avgTemp}', String(city.avgTemp)).replace('{jaz}', String(jaz)).replace('{stadttyp}', city.stadttyp).replace('{bundesland}', city.bundesland).replace('{bundeslandSlug}', city.bundeslandSlug).replace('{strompreis}', String(city.strompreis)).replace('{baujahr}', '1980–1994').replace('{gegFrist}', city.gegFrist).replace('{heizgradtage}', city.heizgradtage.toLocaleString('de-DE')).replace('{stadt}', city.name).replace('{year}', '2026'),
                `In ${city.name} mit ${city.avgTemp}°C Jahresmitteltemperatur ist die Wärmepumpe die wirtschaftlichste Heizlösung. Jährliche Ersparnis: ${fmtEuro(calc.ersparnis)}.`,
                `${city.name} (${city.bundesland}): ${city.heizgradtage} Heizgradtage · JAZ ${jaz} · Eigenanteil nach Förderung: ${fmtEuro(foerd.eigenanteil)}.`,
                `Bis zu ${foerd.gesamtSatz}% KfW-Förderung = ${fmtEuro(foerd.zuschuss)} für Hausbesitzer in ${city.name}. Wir begleiten Sie kostenlos.`,
              ][variant]}
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#angebot" className="inline-flex items-center gap-2 px-7 py-4 bg-[#1A4731] text-white rounded-xl font-bold font-bold text-sm hover:bg-green-800 transition-all hover:-translate-y-0.5 shadow-xl">
                Kostenloses Angebot <ArrowRight size={16} />
              </a>
              <div className="flex items-center gap-4 px-5 py-4 bg-white/10 border border-white/20 rounded-xl">
                <div className="text-center"><p className="font-mono font-bold text-white text-lg leading-none">{jaz}</p><p className="text-white/50 text-xs">JAZ</p></div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center"><p className="font-mono font-bold text-[#D97706] text-lg leading-none">{foerd.gesamtSatz}%</p><p className="text-white/50 text-xs">KfW</p></div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center"><p className="font-mono font-bold text-[#3DA16A] text-lg leading-none">{fmtEuro(calc.ersparnis)}</p><p className="text-white/50 text-xs">/ Jahr</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-5 flex-wrap">
          <span className="text-xs font-bold text-[#7A9E8E] uppercase tracking-wider shrink-0">Datenquellen</span>
          {['KfW','BAFA','BWP','Fraunhofer ISE','Verbraucherzentrale','DWD'].map(s => (
            <span key={s} className="text-sm font-semibold text-[#7A9E8E]">{s}</span>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[1fr_380px] gap-12 items-start">
        <div>
          {/* Featured Snippet Antwort */}
          <div className="bg-white border-l-4 border-[#1A4731] rounded-xl p-6 shadow-md mb-10">
            <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] ?? '', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              
              Wärmepumpe in <strong>{city.name}</strong>: Eigenanteil ab <strong>{fmtEuro(foerd.eigenanteil)}</strong> nach KfW-Förderung.
              Jährliche Ersparnis gegenüber Erdgas: <strong>{fmtEuro(calc.ersparnis)}</strong>.
              JAZ {jaz} bei {city.avgTemp}°C Jahresmitteltemperatur.
            </p>
          </div>

          {/* Keyword-spezifischer Hauptinhalt — 4 Varianten per cityHash */}
          {(() => {
            const v = Math.abs(Math.round(city.lat * 7 + city.lng * 13)) % 4;
            const isAltbau = city.heizgradtage > 3300;
            const intros = [
              `Für die meisten Häuser in ${city.name} ist eine Luft-Wasser-Wärmepumpe die wirtschaftlichste Wahl: Bei ${city.avgTemp}°C Jahresmitteltemperatur und ${city.strompreis} ct/kWh Strompreis erreichen Sie JAZ ${jaz} — das entspricht ${(city.strompreis / jaz).toFixed(1)} ct/kWh Wärmekosten.`,
              `${city.name} (${city.bundesland}) hat ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtage — ${isAltbau ? 'ein hoher Wert der eine gut dimensionierte WP voraussetzt' : 'ein moderater Wert der für jede Luft-WP ideal ist'}. JAZ ${jaz}, Betriebskosten ${fmtEuro(calc.wpKosten)}/Jahr, Eigenanteil nach KfW: ab ${fmtEuro(foerd.eigenanteil)}.`,
              `In ${city.name} mit Norm-Außentemperatur ${city.normAussentemp}°C (DIN EN 12831) sind alle modernen Luft-WP einsetzbar. Hochtemperatur-WP (bis 70°C Vorlauf) sind auch für Altbauten ohne Sanierung geeignet. JAZ ${jaz} bei Ihrem lokalen Klima.`,
              `Die entscheidende Frage beim WP-Kauf in ${city.name}: Welche Heizlast hat Ihr Haus? Eine zu groß dimensionierte WP taktet unnötig und verliert Effizienz. Unsere Partnerbetriebe erstellen die Heizlastberechnung nach DIN EN 12831 vor jedem Angebot.`,
            ];
            const stepVariants = [
              [
                {n:'1',title:'Heizlastberechnung (DIN EN 12831)',text:`Ihr Fachbetrieb in ${city.name} berechnet die genaue Heizlast für Ihr Gebäude. Bei ${city.normAussentemp}°C Norm-Außentemperatur und ${city.heizgradtage.toLocaleString('de-DE')} HGT ist eine präzise Auslegung entscheidend für JAZ ${jaz}.`},
                {n:'2',title:'Vorlauftemperatur & Hydraulik',text:`Unter 55°C Vorlauf (Fußbodenheizung): Jede Luft-WP geeignet, JAZ bis ${(jaz + 0.4).toFixed(1)}. Über 55°C: Hydraulischen Abgleich (€500–1.500, KfW-Pflicht) einplanen — senkt Vorlauf um 5–10°C.`},
                {n:'3',title:'Hersteller & Modell wählen',text:`Bewährte Marken in ${city.bundesland}: Viessmann (Testsieger Stiftung Warentest 2025), Vaillant (R290-WP +5% KfW), Bosch/Buderus, Stiebel Eltron. Entscheidend ist fachgerechte Installation, nicht die Marke.`},
                {n:'4',title:'KfW-Antrag VOR Vertragsabschluss',text:`Zwingend: KfW-Antrag stellen bevor Sie unterschreiben. Unser Partnerbetrieb in ${city.name} übernimmt das — als registrierter LuL-Betrieb kann er den Antrag direkt stellen.`},
                {n:'5',title:'3 vollständige Angebote vergleichen',text:`Alle Positionen einfordern: Gerät, Montage, Hydraulik, Elektrik. Preisunterschiede von 20–35% in ${city.name} sind normal — aber nur vergleichbar wenn alle Positionen gleich sind.`},
              ],
              [
                {n:'1',title:'Gebäudeanalyse & Eignung prüfen',text:`In ${city.name} mit ${city.avgTemp}°C Jahresmittel ist fast jedes Haus WP-geeignet. Unser Partnerbetrieb prüft: Heizlast, Vorlauftemperatur, Aufstellmöglichkeit Außeneinheit, Elektroinstallation.`},
                {n:'2',title:'Förderquote maximieren',text:`Ihr Fördersatz in ${city.name}: ${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)} Zuschuss. Mit iSFP: +5% = +${fmtEuro(Math.round(25000 * 0.05))} mehr.${city.bundeslandFoerderung ? ` Dazu ${city.bundeslandFoerderung} in ${city.bundesland}.` : ''}`},
                {n:'3',title:'Gerät & Hersteller entscheiden',text:`R290-Propan-WP wählen: Viessmann Vitocal 250-A oder Vaillant aroTHERM plus → +5% KfW-Kältemittelbonus. In ${city.name} mit JAZ ${jaz} lohnt sich das — ${fmtEuro(Math.round(25000 * 0.05))} mehr Förderung.`},
                {n:'4',title:'Installation koordinieren',text:`Typische Projektdauer in ${city.name}: 6–10 Wochen von Anfrage bis Inbetriebnahme. Montage selbst: 1–2 Tage. Unsere Partner koordinieren KfW-Antrag, Lieferung und Installation in einem.`},
                {n:'5',title:'Inbetriebnahme & Optimierung',text:`Nach der Installation: Einregulierung und hydraulischer Abgleich (KfW-Pflicht). Erste Heizsaison: Betriebsdaten beobachten, WP-Stromtarif beantragen (spart 2–4 ct/kWh = ${fmtEuro(Math.round(120 * 160 / jaz * 0.03))}/Jahr).`},
              ],
              [
                {n:'1',title:'Typ festlegen: Luft, Sole oder Wasser?',text:`In ${city.name}: Luft-WP (92% Marktanteil, JAZ ${jaz}, keine Bohrung) für die meisten Häuser. Sole-WP (JAZ 4,3+, +5% KfW, Bohrung nötig) wenn Grundstück vorhanden. Wasser-WP (JAZ 5+) bei Grundwasserzugang.`},
                {n:'2',title:'Dimensionierung nach Heizlast',text:`${city.name}: ${city.normAussentemp}°C Auslegungstemperatur, ${city.heizgradtage.toLocaleString('de-DE')} HGT. Faustregel 120 m² EFH: 8–12 kW Heizlast. Korrekte Dimensionierung verhindert Taktbetrieb und sichert JAZ ${jaz}.`},
                {n:'3',title:'Markencheck: Was passt zu Ihrem Haus?',text:`Altbau (>55°C Vorlauf nötig): Viessmann Vitocal 252-A oder Stiebel Eltron WPL (bis 65°C). Neubau/Fußbodenheizung: Alle Geräte geeignet, Vaillant aroTHERM für niedrigste Betriebskosten.`},
                {n:'4',title:'KfW + ggf. Landesförderung beantragen',text:`KfW-Antrag VOR Baubeginn (sonst kein Geld).${city.bundeslandFoerderung ? ` ${city.bundeslandFoerderung} in ${city.bundesland} ggf. zusätzlich beantragen.` : ''} Unser Partner übernimmt beide Anträge.`},
                {n:'5',title:'Installation & erste Abrechnung',text:`Nach Einbau: Verwendungsnachweis für KfW einreichen (4–8 Wochen bis Auszahlung). Tipp: WP-Sondertarif beim lokalen Netzbetreiber in ${city.name} beantragen — spart ${fmtEuro(Math.round(120 * 160 / jaz * 0.03))}/Jahr.`},
              ],
              [
                {n:'1',title:'Bestandsaufnahme Ihres Hauses',text:`Welche Heizkörper? Wie alt? Baujahr des Gebäudes? In ${city.name} sind ${city.efhQuote}% der Häuser Einfamilienhäuser — bei über 80% ist eine Luft-WP ohne große Umbaumaßnahmen installierbar.`},
                {n:'2',title:'Vorlauftemperatur ist die Schlüsselfrage',text:`Unter 50°C: Standard-WP ideal, JAZ bis ${(jaz + 0.5).toFixed(1)}. 50–60°C: WP mit hydraulischem Abgleich. Über 60°C: Hochtemperatur-WP oder Sanierung der Heizkörper (dann JAZ ${jaz} möglich).`},
                {n:'3',title:'Angebote richtig vergleichen',text:`In ${city.name} auf Vollständigkeit achten: Heizlastberechnung, hydraulischer Abgleich (KfW-Pflicht), Gerät, Montage, Elektrik, KfW-Begleitung. Nur dann sind Angebote wirklich vergleichbar.`},
                {n:'4',title:'Fördermaximierung: Alle Boni nutzen',text:`${foerd.gesamtSatz}% Basis + ggf. iSFP-Bonus (5%) + ggf. Einkommensbonus (30%) = bis zu 70% = max. ${fmtEuro(21000)}.${city.bundeslandFoerderung ? ` Plus ${city.bundeslandFoerderung} in ${city.bundesland}.` : ''}`},
                {n:'5',title:'Betrieb optimieren nach Einbau',text:`WP-Stromtarif beantragen (2–4 ct/kWh günstiger), Nachtabsenkung einstellen, PV-Kombination prüfen (${city.avgSunHours} Sonnenstunden in ${city.name} = ${fmtEuro(Math.round(city.avgSunHours * 8 * 0.85 * 0.65 * (city.strompreis / 100)))}/Jahr Zusatzersparnis).`},
              ],
            ];
            return (
              <>
                <h2 className="font-bold font-bold text-[#1C2B2B] mb-5" style={{ fontSize: 'clamp(22px,2.5vw,36px)' }}>
                  {fillTemplate('Wärmepumpe kaufen in {stadt} — 5 Schritte zum richtigen Gerät', city, jaz)}
                </h2>
                <p className="text-[#4A6358] text-base leading-relaxed mb-5">{intros[v]}</p>
                <div className="space-y-3 mb-6">
                  <p className="font-bold font-semibold text-[#1C2B2B]">5 Schritte zur richtigen WP in {city.name}:</p>
                  {stepVariants[v].map((s, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-md">
                      <div className="w-8 h-8 bg-[#1A4731] rounded-full flex items-center justify-center font-bold font-bold text-white text-sm shrink-0">{s.n}</div>
                      <div>
                        <p className="font-bold font-semibold text-[#1C2B2B] mb-1">{s.title}</p>
                        <p className="text-[#4A6358] text-sm leading-relaxed">{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* FAQ */}
                    {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="mb-6 p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}
          <h2 className="font-bold font-bold text-[#1C2B2B] mt-12 mb-5" style={{ fontSize: 'clamp(20px,2.5vw,32px)' }}>{h2s.faq}</h2>
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

          {/* Nachbarstädte + Cross-Links */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw => kw && (
                  <Link key={kw.slug} href={`/${kw.slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {kw.keyword.replace('[Stadt]', city.name)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STICKY SIDEBAR */}
        <div id="angebot" className="sticky top-24 space-y-4">
          {/* Quick Stats */}
          <div className="bg-[#1A4731] rounded-2xl p-5 shadow-2xl">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">{city.name} — Auf einen Blick</p>
            {[
              {l:'Eigenanteil nach KfW', v: fmtEuro(foerd.eigenanteil), c:'text-[#D97706]'},
              {l:`Förderung (${foerd.gesamtSatz}%)`, v: fmtEuro(foerd.zuschuss), c:'text-green-400'},
              {l:'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c:'text-[#3DA16A]'},
              {l:'JAZ in '+city.name, v: String(jaz), c:'text-white'},
              {l:'Amortisation', v: calc.amortisationJahre+' Jahre', c:'text-[#D97706]'},
            ].map(r => (
              <div key={r.l} className="flex justify-between py-2 border-b border-white/8">
                <span className="text-white/80 text-xs">{r.l}</span>
                <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
              </div>
            ))}
          </div>
          {/* Formspree Form */}
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />


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
          {/* Trust */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            {['Herstellerunabhängig', 'HWK-geprüfte Betriebe', 'KfW-Begleitung inklusive', `Lokal in ${city.name}`, '100% kostenlos'].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-gray-200 last:border-0 text-xs text-[#4A6358]">
                <CheckCircle size={12} className="text-[#1A4731] shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
