// components/programmatic/RichTemplateBase.tsx
// Geteilt von allen 20 spezialisierten Templates — sorgt für einheitliche visuelle Tiefe
'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs } from '@/lib/content-variation';
import { AdditionalContentBlocks } from '@/components/programmatic/AdditionalContentBlocks';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

interface RichTemplateBaseProps extends CityPageRouterProps {
  heroImg: string;
  heroStats: { val: string; label: string; sub: string }[];
  urgencyBadge?: string;
  sections: React.ReactNode;
}

export default function RichTemplateBase({
  city, keyword, calc, foerd, jaz, nearby, h1,
  heroImg, heroStats, urgencyBadge, sections
}: RichTemplateBaseProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 6);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');

  return (
    <div className="min-h-screen bg-wp-bg font-sans">

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img src={heroImg} alt={h1} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(10,25,16,0.97) 0%, rgba(10,25,16,0.88) 52%, rgba(10,25,16,0.35) 100%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-28">
          <nav className="flex items-center gap-2 text-xs mb-6 text-[rgba(255,255,255,0.40)] flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white transition-colors">
              {keyword.keyword.replace('[Stadt]', '').trim()}
            </Link>
            <span>›</span>
            <span className="text-white">{city.name}</span>
          </nav>

          {urgencyBadge && (
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-4 py-2 mb-5">
              <AlertTriangle size={12} className="text-amber-400" />
              <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">{urgencyBadge}</span>
            </div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-heading font-extrabold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(32px,4.5vw,62px)' }}>
            {h1}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[rgba(255,255,255,0.68)] text-lg leading-relaxed max-w-xl mb-10">
            In {city.name} ({city.bundesland}): JAZ {jaz} · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage ·
            bis zu {foerd.gesamtSatz}% KfW = {fmtEuro(foerd.zuschuss)} Zuschuss.
            Jährliche Ersparnis gegenüber Gas: <strong className="text-white">{fmtEuro(calc.ersparnis)}</strong>.
          </motion.p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {heroStats.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
                className="bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.13)] rounded-xl p-4">
                <p className="font-mono font-extrabold text-white text-xl leading-none mb-1">{s.val}</p>
                <p className="text-wp-green3 text-xs font-bold">{s.label}</p>
                <p className="text-[rgba(255,255,255,0.35)] text-xs mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3 mt-8 flex-wrap">
            <a href="#angebot"
              className="inline-flex items-center gap-2 px-7 py-4 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-all hover:-translate-y-0.5 shadow-wp-lg">
              Kostenloses Angebot <ArrowRight size={16} />
            </a>
            <a href="#angebot"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.20)] text-white rounded-xl font-heading font-bold text-sm hover:bg-[rgba(255,255,255,0.15)] transition-all">
              Förderung berechnen
            </a>
          </div>
        </div>
      </section>

      {/* ── SOURCE BAR ── */}
      <div className="bg-white border-b border-wp-border py-2.5 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-5 flex-wrap text-xs text-wp-text3">
          <span className="font-bold uppercase tracking-wider">Quellen:</span>
          {['KfW BEG 458', 'BAFA', 'BWP', 'Fraunhofer ISE', 'DWD', 'Stand März 2026'].map(s => (
            <span key={s} className="font-semibold">{s}</span>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[1fr_360px] gap-12 items-start">

        {/* LEFT — keyword-specific sections */}
        <div className="space-y-14">
          {sections}

          {/* GEG-Frist */}
          <div className={`rounded-xl border p-5 flex gap-4 ${isUrgent ? 'bg-amber-50 border-amber-300' : 'bg-wp-greenlt border-wp-green3/30'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isUrgent ? 'bg-amber-100' : 'bg-wp-green/10'}`}>
              {isUrgent ? <AlertTriangle size={18} className="text-amber-600" /> : <CheckCircle size={18} className="text-wp-green" />}
            </div>
            <div>
              <p className={`font-heading font-bold text-lg mb-1 ${isUrgent ? 'text-amber-900' : 'text-wp-green'}`}>
                GEG-Frist {city.name}: {gegFristFormatted}
              </p>
              <p className={`text-sm leading-relaxed ${isUrgent ? 'text-amber-800' : 'text-wp-text2'}`}>
                {isUrgent
                  ? `Großstadt über 100.000 EW: 65%-EE-Pflicht gilt ab ${gegFristFormatted}. Eine Wärmepumpe erfüllt das GEG automatisch. Wartezeit aktuell 4–12 Wochen — jetzt handeln sichert volle Förderung.`
                  : `65%-EE-Pflicht gilt ab ${gegFristFormatted}. Eine Wärmepumpe erfüllt das GEG vollständig und automatisch — ohne weitere Auflagen.`}
              </p>
            </div>
          </div>

          {/* Additional SEO blocks */}
          <AdditionalContentBlocks city={city} keyword={keyword} jaz={jaz} calc={calc} foerd={foerd} />

          {/* FAQ */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Häufige Fragen — {keyword.keyword.replace('[Stadt]', city.name)}
            </h2>
            <div className="border border-wp-border rounded-2xl overflow-hidden bg-white shadow-wp-sm">
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
          </div>

          {/* Nearby + cross-links */}
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

        {/* RIGHT — sidebar */}
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl shadow-wp-xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #1A4731 0%, #0A1910 100%)' }}>
            <div className="p-6">
              <p className="text-[rgba(255,255,255,0.50)] text-xs font-bold uppercase tracking-widest mb-1">{city.name} — Kennzahlen</p>
              <p className="font-mono font-extrabold text-white text-4xl leading-none mb-0.5">{fmtEuro(foerd.zuschuss)}</p>
              <p className="text-[rgba(255,255,255,0.40)] text-xs mb-5">KfW-Zuschuss · nicht rückzahlbar</p>
              <div className="space-y-2 mb-5">
                {[
                  { l: 'Förderquote', v: `${foerd.gesamtSatz}%`, c: 'text-wp-green3' },
                  { l: 'Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-wp-amber' },
                  { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-wp-green3' },
                  { l: 'JAZ in ' + city.name, v: String(jaz), c: 'text-white' },
                  { l: 'Amortisation', v: calc.amortisationJahre + ' J.', c: 'text-wp-amber' },
                  { l: 'GEG-Frist', v: gegFristFormatted, c: isUrgent ? 'text-amber-400' : 'text-white' },
                ].map(r => (
                  <div key={r.l} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.08)]">
                    <span className="text-[rgba(255,255,255,0.45)] text-xs">{r.l}</span>
                    <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <a href="#angebot" className="flex items-center justify-center gap-2 w-full py-3.5 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-colors">
                Kostenloses Angebot <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div id="angebot">
            <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          </div>
          <AuthorBox keywordSlug={keyword.slug} />

          <div className="bg-white border border-wp-border rounded-xl p-4 shadow-wp-sm">
            {['Herstellerunabhängig', 'HWK-geprüfte Betriebe', 'KfW-Begleitung inklusive', `Lokal in ${city.name}`, '100% kostenlos'].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-wp-border last:border-0 text-xs text-wp-text2">
                <CheckCircle size={12} className="text-wp-green shrink-0" />{t}
              </div>
            ))}
          </div>

          {/* Trust testimonial */}
          <div className="bg-wp-greenlt border border-wp-green3/30 rounded-xl p-4">
            <div className="flex gap-1 mb-2">{'★★★★★'.split('').map((s,i) => <span key={i} className="text-wp-amber text-sm">{s}</span>)}</div>
            <p className="text-wp-text2 text-xs leading-relaxed italic mb-2">
              „Drei Angebote in 48 Stunden, alle vollständig mit hydraulischem Abgleich. KfW-Antrag hat der Betrieb direkt gestellt."
            </p>
            <p className="text-wp-text3 text-xs font-semibold">Familie aus {city.name} · Luft-WP · {fmtEuro(calc.ersparnis)}/Jahr gespart</p>
          </div>
        </div>
      </div>
    </div>
  );
}
