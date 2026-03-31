// components/programmatic/templates/FoerderungTemplate.tsx
// "waermepumpe-foerderung" — vollständig, stadtspezifisch, 800+ Wörter
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs } from '@/lib/content-variation';
import { AdditionalContentBlocks } from '@/components/programmatic/AdditionalContentBlocks';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG_HERO = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80';

// Stadtspezifische Hinweise (Fernwärme, Schall, Grundwasser etc.)
function getCityWarnings(city: CityPageRouterProps['city']) {
  const warnings: { type: 'warning' | 'info'; text: string }[] = [];
  if (city.fernwaermeQuote >= 50) {
    warnings.push({ type: 'warning', text: `${city.name} hat ${city.fernwaermeQuote}% Fernwärmeabdeckung. Prüfen Sie vor der Planung ob Ihre Straße in einem Fernwärmegebiet liegt — dort kann der Anschluss vorgeschrieben sein und eine WP unzulässig werden.` });
  }
  if (city.einwohner >= 500000) {
    warnings.push({ type: 'info', text: `Als Großstadt über 500.000 Einwohner gilt in ${city.name} oft ein Mindestabstand der Außeneinheit zur Grundstücksgrenze. Lokale Bebauungspläne können abweichen — unser Partnerbetrieb prüft das vor Ort.` });
  }
  if (city.bundesland === 'Bayern') {
    warnings.push({ type: 'info', text: `Bayern: Das 10.000-Häuser-Programm ist eingestellt. Für ${city.name} gilt ausschließlich die KfW-Bundesförderung — diese ist weiterhin vollständig verfügbar.` });
  }
  if (city.bundeslandFoerderung && city.bundeslandFoerderungBetrag?.includes('ausgesetzt')) {
    warnings.push({ type: 'warning', text: `${city.bundesland}: Das Landesprogramm "${city.bundeslandFoerderung}" ist derzeit ausgesetzt. Die KfW-Bundesförderung (bis 70%) gilt uneingeschränkt.` });
  }
  return warnings;
}

export default function FoerderungTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 6);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const warnings = getCityWarnings(city);

  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const isUrgent = city.einwohner >= 100000;

  // Förder-Schritte stadtspezifisch
  const steps = [
    {
      n: '01', title: 'KfW-Antrag VOR Baubeginn stellen',
      text: `Zwingend: Der Antrag muss vor dem ersten Spatenstich — und vor dem Vertragsabschluss mit dem Installateur — im KfW-Portal gestellt werden. Für ${city.name}: gilt ohne Ausnahme. Kein nachträglicher Antrag möglich.`,
      tag: '⚠️ Pflicht', tagColor: 'bg-red-50 text-red-700',
    },
    {
      n: '02', title: `${city.bundesland}-Landesförderung prüfen`,
      text: city.bundeslandFoerderung
        ? `In ${city.bundesland} gibt es zusätzlich "${city.bundeslandFoerderung}": ${city.bundeslandFoerderungBetrag}. ${city.bundeslandFoerderungBetrag?.includes('ausgesetzt') ? 'Aktuell ausgesetzt — aber KfW läuft vollständig.' : 'Kombinierbar mit KfW. Antrag ggf. separat stellen.'}`
        : `${city.bundesland} hat kein eigenes WP-Förderprogramm. Die KfW-Bundesförderung gilt vollständig — ohne Landes-Antrag, ohne Wartezeit.`,
      tag: city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.includes('ausgesetzt') ? '✓ Verfügbar' : 'ℹ️ Info',
      tagColor: city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.includes('ausgesetzt') ? 'bg-wp-greenlt text-wp-green' : 'bg-wp-bg text-wp-text3',
    },
    {
      n: '03', title: 'iSFP-Bonus: +5% mit Sanierungsfahrplan',
      text: `Mit einem Individuellen Sanierungsfahrplan (iSFP) erhalten Sie 5% Bonus auf alle KfW-Maßnahmen. Bei €25.000 Investition = +${fmtEuro(Math.round(25000 * 0.05))} mehr Zuschuss. Der iSFP selbst wird zu 80% von BAFA gefördert — Eigenanteil ca. €60–140.`,
      tag: `+${fmtEuro(Math.round(25000 * 0.05))} Bonus`, tagColor: 'bg-wp-greenlt text-wp-green',
    },
    {
      n: '04', title: 'Installation & Verwendungsnachweis',
      text: `Nach Installation: Rechnung + Fachunternehmer-Bestätigung im KfW-Portal einreichen. Frist: 6 Monate nach Abschluss. Auszahlung: ${fmtEuro(foerd.zuschuss)} direkt auf Ihr Konto in 4–8 Wochen.`,
      tag: `${fmtEuro(foerd.zuschuss)} Auszahlung`, tagColor: 'bg-wp-amberlt text-wp-amber',
    },
  ];

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img src={IMG_HERO} alt={h1} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/96 via-wp-dark/88 to-wp-dark/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="flex items-center gap-2 text-sm mb-5 flex-wrap">
              <Link href="/" className="text-[rgba(255,255,255,0.45)] hover:text-white transition-colors">Startseite</Link>
              <span className="text-[rgba(255,255,255,0.25)]">›</span>
              <Link href={`/${keyword.slug}`} className="text-[rgba(255,255,255,0.45)] hover:text-white transition-colors">
                {keyword.keyword.replace('[Stadt]', '').trim()}
              </Link>
              <span className="text-[rgba(255,255,255,0.25)]">›</span>
              <span className="text-[rgba(255,255,255,0.80)]">{city.name}</span>
            </nav>
            <h1 className="font-heading font-extrabold text-white leading-tight mb-4" style={{ fontSize: 'clamp(30px,4.5vw,56px)' }}>
              {h1}
            </h1>
            <p className="text-[rgba(255,255,255,0.70)] text-lg leading-relaxed max-w-2xl mb-8">
              In {city.name} beträgt die KfW-Förderung typisch {foerd.gesamtSatz}% = {fmtEuro(foerd.zuschuss)} nicht rückzahlbarer Zuschuss.
              {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.includes('ausgesetzt')
                ? ` Dazu kommt in ${city.bundesland}: ${city.bundeslandFoerderung} (${city.bundeslandFoerderungBetrag}).`
                : ''} Wir begleiten Sie kostenlos durch jeden Schritt.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#angebot" className="inline-flex items-center gap-2 px-7 py-4 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-all hover:-translate-y-0.5 shadow-wp-lg">
                Förderung berechnen <ArrowRight size={16} />
              </a>
              <div className="flex items-center gap-4 px-5 py-4 bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.20)] rounded-xl">
                <div className="text-center"><p className="font-mono font-bold text-white text-lg leading-none">{foerd.gesamtSatz}%</p><p className="text-[rgba(255,255,255,0.50)] text-xs">KfW-Förderung</p></div>
                <div className="w-px h-8 bg-[rgba(255,255,255,0.20)]" />
                <div className="text-center"><p className="font-mono font-bold text-wp-amber text-lg leading-none">{fmtEuro(foerd.zuschuss)}</p><p className="text-[rgba(255,255,255,0.50)] text-xs">Zuschuss</p></div>
                <div className="w-px h-8 bg-[rgba(255,255,255,0.20)]" />
                <div className="text-center"><p className="font-mono font-bold text-wp-green3 text-lg leading-none">{fmtEuro(foerd.eigenanteil)}</p><p className="text-[rgba(255,255,255,0.50)] text-xs">Eigenanteil</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white border-b border-wp-border py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-5 flex-wrap">
          <span className="text-xs font-bold text-wp-text3 uppercase tracking-wider shrink-0">Quellen</span>
          {['KfW BEG Programm 458','BAFA','BWP','Fraunhofer ISE','Stand März 2026'].map(s => (
            <span key={s} className="text-sm font-semibold text-wp-text3">{s}</span>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[1fr_380px] gap-12 items-start">
        <div className="space-y-10">

          {/* Stadtspezifische Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-3">
              {warnings.map((w, i) => (
                <div key={i} className={`rounded-xl border p-4 flex items-start gap-3 ${w.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                  {w.type === 'warning'
                    ? <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    : <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />}
                  <p className={`text-sm leading-relaxed ${w.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>{w.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Featured Snippet — Direktantwort */}
          <div className="bg-white border-l-4 border-wp-green rounded-xl p-6 shadow-wp-sm">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] ?? `Wie hoch ist die Wärmepumpe Förderung in {stadt}?`, city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed mb-4">
              In <strong>{city.name}</strong> beträgt die KfW-Bundesförderung typisch <strong>{foerd.gesamtSatz}%</strong> = <strong>{fmtEuro(foerd.zuschuss)}</strong> nicht rückzahlbarer Zuschuss
              (bei €25.000 Investition, Eigennutzer, fossile Heizung ersetzt). Der Eigenanteil beträgt ab <strong>{fmtEuro(foerd.eigenanteil)}</strong>.
              {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.includes('ausgesetzt')
                ? ` Zusätzlich gibt es in ${city.bundesland} das Programm "${city.bundeslandFoerderung}": ${city.bundeslandFoerderungBetrag}.`
                : ''}
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: 'Zuschuss', val: fmtEuro(foerd.zuschuss), color: 'text-wp-green' },
                { label: 'Ihr Eigenanteil', val: fmtEuro(foerd.eigenanteil), color: 'text-wp-amber' },
                { label: 'Amortisation', val: calc.amortisationJahre + ' Jahre', color: 'text-wp-text' },
              ].map((s, i) => (
                <div key={i} className="bg-wp-bg rounded-xl p-3 text-center border border-wp-border">
                  <p className={`font-mono font-bold text-lg leading-none mb-0.5 ${s.color}`}>{s.val}</p>
                  <p className="text-wp-text3 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alle Förder-Bausteine */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-2">
              KfW-Förderung {city.name} — alle Bausteine 2026
            </h2>
            <p className="text-wp-text2 text-sm mb-5">
              Die Bausteine sind kumulierbar, aber auf 70% gedeckelt. Bemessungsgrundlage: max. €30.000 = max. €21.000 Zuschuss.
            </p>
            <div className="space-y-3 mb-5">
              {[
                { pct: 30, label: 'Grundförderung', info: 'Für alle — Eigennutzer und Vermieter. Immer verfügbar.', active: true, always: true },
                { pct: 20, label: 'Klima-Speed-Bonus', info: `Eigennutzer die fossile Heizung (Gas, Öl, Kohle) ersetzen. Standard in ${city.name}: +20% = 50% gesamt.`, active: true, always: false },
                { pct: 30, label: 'Einkommens-Bonus', info: 'Haushaltseinkommen unter €40.000 netto/Jahr. Nicht kombinierbar mit Klima-Speed auf mehr als 70%.', active: false, always: false },
                { pct: 5, label: 'Kältemittel-Bonus', info: 'Natürliches Kältemittel R290 (Propan) oder Erdwärme-/Grundwasser-WP. Viessmann Vitocal 250-A + Vaillant aroTHERM plus qualifizieren sich.', active: false, always: false },
                { pct: 5, label: 'iSFP-Bonus', info: 'Individueller Sanierungsfahrplan vorliegend. BAFA-gefördert zu 80%, Eigenanteil ~€60–140. Empfehlenswert!', active: false, always: false },
              ].map((b, i) => (
                <div key={i} className={`p-4 rounded-xl border ${b.active ? 'border-wp-green bg-wp-greenlt' : 'border-wp-border bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.always ? 'bg-wp-green text-white' : b.active ? 'bg-wp-greenlt text-wp-green border border-wp-green3/30' : 'bg-wp-bg text-wp-text3 border border-wp-border'}`}>
                        {b.always ? 'Immer' : b.active ? 'Typisch' : 'Optional'}
                      </span>
                      <p className="font-heading font-bold text-wp-text text-sm">{b.label}</p>
                    </div>
                    <span className="font-mono font-bold text-wp-amber text-sm">+{b.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-wp-border rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-wp-green rounded-full transition-all" style={{ width: `${b.pct / 70 * 100}%` }} />
                  </div>
                  <p className="text-wp-text3 text-xs leading-relaxed">{b.info}</p>
                </div>
              ))}
            </div>

            {/* Ergebnis-Box */}
            <div className="bg-wp-dark rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">Typisch für {city.name}</span>
                <span className="font-mono font-bold text-wp-amber text-xl">{foerd.gesamtSatz}% = {fmtEuro(foerd.zuschuss)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[rgba(255,255,255,0.08)] rounded-lg p-2">
                  <p className="text-[rgba(255,255,255,0.45)] mb-0.5">Gesamtinvestition</p>
                  <p className="font-mono font-bold text-white">{fmtEuro(25000)}</p>
                </div>
                <div className="bg-[rgba(255,255,255,0.08)] rounded-lg p-2">
                  <p className="text-[rgba(255,255,255,0.45)] mb-0.5">KfW-Zuschuss</p>
                  <p className="font-mono font-bold text-wp-green3">−{fmtEuro(foerd.zuschuss)}</p>
                </div>
                <div className="bg-[rgba(255,255,255,0.08)] rounded-lg p-2">
                  <p className="text-[rgba(255,255,255,0.45)] mb-0.5">Ihr Eigenanteil</p>
                  <p className="font-mono font-bold text-wp-amber">{fmtEuro(foerd.eigenanteil)}</p>
                </div>
                <div className="bg-[rgba(255,255,255,0.08)] rounded-lg p-2">
                  <p className="text-[rgba(255,255,255,0.45)] mb-0.5">Ersparnis/Jahr</p>
                  <p className="font-mono font-bold text-wp-green3">{fmtEuro(calc.ersparnis)}</p>
                </div>
              </div>
              <p className="text-[rgba(255,255,255,0.30)] text-xs mt-3">
                * Eigennutzer, fossile Heizung ersetzt, JAZ {jaz}, {city.avgTemp}°C in {city.name}. Quelle: KfW BEG Programm 458, März 2026.
              </p>
            </div>
          </div>

          {/* Landesförderung */}
          {city.bundeslandFoerderung && (
            <div>
              <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
                {city.bundesland}-Förderung zusätzlich zur KfW
              </h2>
              <div className={`rounded-xl border p-5 ${city.bundeslandFoerderungBetrag?.includes('ausgesetzt') ? 'bg-amber-50 border-amber-200' : 'bg-wp-greenlt border-wp-green3/30'}`}>
                <p className={`font-heading font-bold text-lg mb-2 ${city.bundeslandFoerderungBetrag?.includes('ausgesetzt') ? 'text-amber-800' : 'text-wp-green'}`}>
                  {city.bundeslandFoerderung}
                </p>
                <p className={`text-sm leading-relaxed mb-3 ${city.bundeslandFoerderungBetrag?.includes('ausgesetzt') ? 'text-amber-700' : 'text-wp-text2'}`}>
                  {city.bundeslandFoerderungBetrag}
                  {city.bundeslandFoerderungBetrag?.includes('ausgesetzt')
                    ? ' Die KfW-Bundesförderung gilt uneingeschränkt — keine Wartezeit, keine Einschränkung.'
                    : ` Diese Förderung ist kombinierbar mit der KfW-Bundesförderung. Antrag bei der ${city.bundesland === 'Hamburg' ? 'IFB Hamburg' : city.bundesland === 'Nordrhein-Westfalen' ? 'NRW.BANK' : 'zuständigen Landesförderinstitution'} vor Baubeginn stellen.`}
                </p>
                {city.bundeslandFoerderungUrl && (
                  <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer"
                    className="text-wp-green text-sm font-semibold hover:underline">
                    Mehr Infos zum {city.bundesland}-Programm ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {/* GEG-Frist */}
          <div className={`rounded-xl border p-5 ${isUrgent ? 'bg-amber-50 border-amber-300' : 'bg-white border-wp-border'}`}>
            <div className="flex items-center gap-3 mb-3">
              {isUrgent && <AlertTriangle size={18} className="text-amber-600 shrink-0" />}
              <h3 className="font-heading font-bold text-wp-text text-lg">
                GEG-Frist {city.name}: {gegFristFormatted}
              </h3>
              {isUrgent && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">Dringend</span>}
            </div>
            <p className="text-wp-text2 text-sm leading-relaxed mb-3">
              {isUrgent
                ? `Als Großstadt über 100.000 Einwohner gilt in ${city.name} die 65%-EE-Pflicht für Bestandsgebäude ab ${gegFristFormatted}. Wer jetzt handelt, sichert sich die volle KfW-Förderung und die besten lokalen Installateure — Wartezeit aktuell 4–12 Wochen.`
                : `In ${city.name} gilt die 65%-EE-Pflicht für Bestandsgebäude ab ${gegFristFormatted}. Frühzeitiges Handeln sichert volle Förderung und beste Betriebsverfügbarkeit.`}
            </p>
            <div className="text-sm font-semibold text-wp-green">
              ✓ Eine Wärmepumpe erfüllt das GEG automatisch — ohne weitere Auflagen.
            </div>
          </div>

          {/* Schritt-für-Schritt Förderung */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Schritt für Schritt zur Förderung in {city.name}
            </h2>
            <div className="space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-wp-border p-5 flex gap-4">
                  <div className="w-9 h-9 bg-wp-dark rounded-xl flex items-center justify-center font-mono font-bold text-wp-green3 text-sm shrink-0">{s.n}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-heading font-bold text-wp-text">{s.title}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.tagColor}`}>{s.tag}</span>
                    </div>
                    <p className="text-wp-text2 text-sm leading-relaxed">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AdditionalContentBlocks */}
          <AdditionalContentBlocks city={city} keyword={keyword} jaz={jaz} calc={calc} foerd={foerd} />

          {/* FAQ */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Häufige Fragen zur Förderung in {city.name}
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

          {/* Nachbarstädte + Cross-Links */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Förderung in der Region {city.bundesland}</h3>
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
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Weitere Themen für {city.name}</h3>
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
          <div className="bg-wp-dark rounded-2xl p-5 shadow-wp-xl">
            <p className="text-[rgba(255,255,255,0.50)] text-xs font-semibold uppercase tracking-wider mb-3">{city.name} — Förderung Überblick</p>
            {[
              { l: 'KfW-Zuschuss', v: fmtEuro(foerd.zuschuss), c: 'text-wp-green3' },
              { l: `Förderquote (${foerd.gesamtSatz}%)`, v: `${foerd.gesamtSatz}%`, c: 'text-white' },
              { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-wp-amber' },
              { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-wp-green3' },
              { l: 'Amortisation', v: calc.amortisationJahre + ' Jahre', c: 'text-wp-amber' },
              { l: 'GEG-Frist', v: gegFristFormatted, c: isUrgent ? 'text-red-400' : 'text-white' },
            ].map(r => (
              <div key={r.l} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
                <span className="text-[rgba(255,255,255,0.45)] text-xs">{r.l}</span>
                <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
              </div>
            ))}
          </div>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          <AuthorBox keywordSlug={keyword.slug} />
          <div className="bg-white border border-wp-border rounded-xl p-4 shadow-wp-sm">
            {['KfW-Antrag inklusive', 'LuL-registrierte Betriebe', 'Herstellerunabhängig', `Lokal in ${city.name}`, '100% kostenlos'].map(t => (
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
