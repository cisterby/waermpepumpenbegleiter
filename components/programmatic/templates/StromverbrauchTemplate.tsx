// components/programmatic/templates/StromverbrauchTemplate.tsx
// "waermepumpe-stromverbrauch" — informational
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { estimateJAZ } from '@/lib/city-utils';
import { getRotatingFAQs, getIntroParagraphs, getUSPBar } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';
import { AdditionalContentBlocks } from '@/components/programmatic/AdditionalContentBlocks';

const IMG_HERO = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80';

export default function StromverbrauchTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const variant = Math.abs(Math.round(city.lat * 3 + city.lng * 7)) % 4;
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img src={IMG_HERO} alt={h1} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/96 via-wp-dark/88 to-wp-dark/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="flex items-center gap-2 text-sm mb-5 flex-wrap">
              <Link href="/" className="text-white/45 hover:text-white/70 transition-colors">Startseite</Link>
              <span className="text-white/25">›</span>
              <Link href={`/${keyword.slug}`} className="text-white/45 hover:text-white/70 transition-colors">
                {keyword.keyword.replace('[Stadt]', '').trim()}
              </Link>
              <span className="text-white/25">›</span>
              <span className="text-white/80">{city.name}</span>
            </nav>
            <h1 className="font-heading font-extrabold text-white leading-tight mb-4" style={{ fontSize: 'clamp(30px,4.5vw,56px)' }}>
              {h1}
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-8">
              {[
                `Wärmepumpe Stromverbrauch {stadt}: Berechnung mit {strompreis} ct/kWh lokalem Strompreis und JAZ {jaz}. Optimierungstipps für {bundesland}.`.replace('{avgTemp}', String(city.avgTemp)).replace('{jaz}', String(jaz)).replace('{stadttyp}', city.stadttyp).replace('{bundesland}', city.bundesland).replace('{bundeslandSlug}', city.bundeslandSlug).replace('{strompreis}', String(city.strompreis)).replace('{baujahr}', '1980–1994').replace('{gegFrist}', city.gegFrist).replace('{heizgradtage}', city.heizgradtage.toLocaleString('de-DE')).replace('{stadt}', city.name).replace('{year}', '2026'),
                `In ${city.name} mit ${city.avgTemp}°C Jahresmitteltemperatur ist die Wärmepumpe die wirtschaftlichste Heizlösung. Jährliche Ersparnis: ${fmtEuro(calc.ersparnis)}.`,
                `${city.name} (${city.bundesland}): ${city.heizgradtage} Heizgradtage · JAZ ${jaz} · Eigenanteil nach Förderung: ${fmtEuro(foerd.eigenanteil)}.`,
                `Bis zu ${foerd.gesamtSatz}% KfW-Förderung = ${fmtEuro(foerd.zuschuss)} für Hausbesitzer in ${city.name}. Wir begleiten Sie kostenlos.`,
              ][variant]}
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#angebot" className="inline-flex items-center gap-2 px-7 py-4 bg-wp-green text-white rounded-xl font-heading font-bold text-sm hover:bg-green-800 transition-all hover:-translate-y-0.5 shadow-wp-lg">
                Kostenloses Angebot <ArrowRight size={16} />
              </a>
              <div className="flex items-center gap-4 px-5 py-4 bg-white/10 border border-white/20 rounded-xl">
                <div className="text-center"><p className="font-mono font-bold text-white text-lg leading-none">{jaz}</p><p className="text-white/50 text-xs">JAZ</p></div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center"><p className="font-mono font-bold text-wp-amber text-lg leading-none">{foerd.gesamtSatz}%</p><p className="text-white/50 text-xs">KfW</p></div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center"><p className="font-mono font-bold text-wp-green3 text-lg leading-none">{fmtEuro(calc.ersparnis)}</p><p className="text-white/50 text-xs">/ Jahr</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white border-b border-wp-border py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-5 flex-wrap">
          <span className="text-xs font-bold text-wp-text3 uppercase tracking-wider shrink-0">Datenquellen</span>
          {['KfW','BAFA','BWP','Fraunhofer ISE','Verbraucherzentrale','DWD'].map(s => (
            <span key={s} className="text-sm font-semibold text-wp-text3">{s}</span>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[1fr_380px] gap-12 items-start">
        <div>
          {/* Featured Snippet Antwort */}
          <div className="bg-white border-l-4 border-wp-green rounded-xl p-6 shadow-wp-sm mb-10">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] ?? '', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              
              Wärmepumpe in <strong>{city.name}</strong>: Eigenanteil ab <strong>{fmtEuro(foerd.eigenanteil)}</strong> nach KfW-Förderung.
              Jährliche Ersparnis gegenüber Erdgas: <strong>{fmtEuro(calc.ersparnis)}</strong>.
              JAZ {jaz} bei {city.avgTemp}°C Jahresmitteltemperatur.
            </p>
          </div>

          {/* Keyword-spezifischer Hauptinhalt */}
          <h2 className="font-heading font-bold text-wp-text mb-5" style={{ fontSize: 'clamp(22px,2.5vw,36px)' }}>
            {fillTemplate('Wie viel Strom verbraucht eine Wärmepumpe in {stadt}?', city, jaz)}
          </h2>
          <p className="text-wp-text2 text-base leading-relaxed mb-5">
              Ein 120 m² EFH in <strong>{city.name}</strong> verbraucht mit einer Luft-WP (JAZ {jaz}) bei {city.heizgradtage} Heizgradtagen ca. <strong>{Math.round(120*160/jaz).toLocaleString("de-DE")} kWh Strom pro Jahr</strong>. Bei {city.strompreis} ct/kWh entspricht das <strong>{fmtEuro(calc.wpKosten)} Jahreskosten</strong> — deutlich weniger als {fmtEuro(calc.altKosten)} mit Erdgas.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                {label:"Stromverbrauch/Jahr",val:(Math.round(120*160/jaz)).toLocaleString("de-DE")+" kWh",sub:"120 m² EFH · JAZ "+String(jaz),icon:"⚡"},
                {label:"Stromkosten/Jahr",val:fmtEuro(calc.wpKosten),sub:city.strompreis+" ct/kWh lokal",icon:"💶"},
                {label:"Heizgradtage",val:city.heizgradtage.toLocaleString("de-DE"),sub:"Kd/a · "+city.name,icon:"🌡️"},
              ].map((d,i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-wp-border shadow-wp-sm text-center">
                  <div className="text-3xl mb-2">{d.icon}</div>
                  <div className="font-mono font-bold text-wp-green text-xl mb-1">{d.val}</div>
                  <div className="font-semibold text-wp-text text-sm mb-0.5">{d.label}</div>
                  <div className="text-wp-text3 text-xs">{d.sub}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3 mb-4">
              <p className="font-heading font-semibold text-wp-text">Stromverbrauch optimieren in {city.name}:</p>
              {[
                {tip:"WP-Sondertarif nutzen",save:"20–30%",text:"Spezieller WP-Stromtarif mit eigenem Zähler: ca. 22–26 ct/kWh statt "+city.strompreis+" ct. Spart "+fmtEuro(Math.round(calc.wpKosten*0.22))+"/Jahr."},
                {tip:"Nachtabsenkung aktivieren",save:"5–10%",text:"Warmwasser und Heizpuffer nachts aufladen wenn Strom günstiger ist (bei dynamischem Tarif)."},
                {tip:"PV-Anlage kombinieren",save:"30–40%",text:"Mit "+Math.round(120*city.avgSunHours*8*0.85*0.65/1000)/1 +" kWh Solarertrag/Jahr aus 8 kWp PV sinken die WP-Kosten erheblich."},
                {tip:"Hydraulischen Abgleich optimieren",save:"5–15%",text:"Korrekt eingestellte WP mit hydraulischem Abgleich arbeitet effizienter — höhere JAZ, weniger Stromverbrauch."},
              ].map((s,i) => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-wp-border shadow-wp-sm">
                  <span className="bg-wp-green text-white text-xs font-bold px-2 py-1 rounded-lg shrink-0 h-fit">−{s.save}</span>
                  <div>
                    <p className="font-heading font-semibold text-wp-text mb-1">{s.tip}</p>
                    <p className="text-wp-text2 text-sm leading-relaxed">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>

          {/* FAQ */}
          <h2 className="font-heading font-bold text-wp-text mt-12 mb-5" style={{ fontSize: 'clamp(20px,2.5vw,32px)' }}>
            Häufige Fragen — {city.name}
          </h2>
          <div className="border border-wp-border rounded-2xl overflow-hidden bg-white shadow-wp-sm mb-10">
            {faqs.map((faq, i) => (
              <div key={i} className={i < faqs.length - 1 ? 'border-b border-wp-border' : ''}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full bg-transparent border-none px-5 py-4 flex justify-between items-center cursor-pointer text-left gap-3">
                  <span className="font-heading font-semibold text-wp-text text-sm leading-snug">{faq.q}</span>
                  <ChevronDown size={16} className={`text-wp-text3 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <p className="px-5 pb-4 text-wp-text2 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Nachbarstädte + Cross-Links */}
          <AdditionalContentBlocks city={city} keyword={keyword} jaz={jaz} calc={calc} foerd={foerd} />

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw => kw && (
                  <Link key={kw.slug} href={`/${kw.slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
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
          <div className="bg-wp-dark rounded-2xl p-5 shadow-wp-xl">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">{city.name} — Auf einen Blick</p>
            {[
              {l:'Eigenanteil nach KfW', v: fmtEuro(foerd.eigenanteil), c:'text-wp-amber'},
              {l:`Förderung (${foerd.gesamtSatz}%)`, v: fmtEuro(foerd.zuschuss), c:'text-green-400'},
              {l:'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c:'text-wp-green3'},
              {l:'JAZ in '+city.name, v: String(jaz), c:'text-white'},
              {l:'Amortisation', v: calc.amortisationJahre+' Jahre', c:'text-wp-amber'},
            ].map(r => (
              <div key={r.l} className="flex justify-between py-2 border-b border-white/8">
                <span className="text-white/45 text-xs">{r.l}</span>
                <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
              </div>
            ))}
          </div>
          {/* Formspree Form */}
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          <AuthorBox keywordSlug={keyword.slug} />
          {/* Trust */}
          <div className="bg-white border border-wp-border rounded-xl p-4 shadow-wp-sm">
            {['Herstellerunabhängig', 'HWK-geprüfte Betriebe', 'KfW-Begleitung inklusive', `Lokal in ${city.name}`, '100% kostenlos'].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-wp-border last:border-0 text-xs text-wp-text2">
                <CheckCircle size={12} className="text-wp-green shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
