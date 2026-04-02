// components/programmatic/templates/FoerderungTemplate.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, AlertTriangle, Info, TrendingDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';


// ── Bildpool ─────────────────────────────────────────────
const HERO_IMGS = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85",
  "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85",
];
const SEC1_IMGS = ["https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85", "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85"];
const SEC2_IMGS = ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85", "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85", "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85"];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

export default function FoerderungTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 6);
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const isUrgent = city.einwohner >= 100000;
  const hasLandFoerderung = !!city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.includes('ausgesetzt');
  const isFernwaerme = city.fernwaermeQuote >= 50;
  // IBB Berlin: Effiziente GebäudePLUS vergibt 2026 keine Zuschüsse mehr; ENEO ausgelaufen
  const berlinNote = city.bundesland === 'Berlin'
    ? 'Hinweis für Berlin 2026: Das Programm Effiziente GebäudePLUS vergibt aktuell keine Direktzuschüsse mehr. ENEO ist ausgelaufen. Die IBB bietet über „IBB Wohnraum modernisieren" zinsgünstige Kredite bis €100.000/WE. Kombinierbar mit der KfW-Förderung.'
    : null;

  const boni = [
    { pct: 30, label: 'Grundförderung', info: 'Für alle Eigennutzer und Vermieter — immer verfügbar', badge: 'Immer', badgeColor: 'bg-[#1A4731] text-white' },
    { pct: 20, label: 'Klima-Speed-Bonus', info: 'Bei Ersatz fossiler Heizung (Gas, Öl) durch Eigennutzer', badge: 'Typisch', badgeColor: 'bg-[#E8F5EE] text-[#1A4731]' },
    { pct: 30, label: 'Einkommens-Bonus', info: 'Haushaltseinkommen unter €40.000 netto/Jahr', badge: 'Optional', badgeColor: 'bg-[#F8F9FA] text-[#7A9E8E] border border-gray-200' },
    { pct: 5,  label: 'Kältemittel-Bonus', info: 'R290-Propan-WP (z.B. Vaillant aroTHERM, Viessmann Vitocal 250-A) oder Erdwärme', badge: '+5%', badgeColor: 'bg-[#D97706]lt text-[#D97706]' },
    { pct: 5,  label: 'iSFP-Bonus', info: `Individueller Sanierungsfahrplan → +${fmtEuro(Math.round(25000 * 0.05))} bei €25.000 Invest · Eigenanteil ca. €60–140 nach BAFA-Förderung`, badge: '+5%', badgeColor: 'bg-[#D97706]lt text-[#D97706]' },
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
            {/* ── HERO ─────────────────────────────────────── */}
      <div className="relative min-h-[55vh] flex items-end overflow-hidden">
        <img
          src={pickImg(HERO_IMGS, city.lat, city.lng, 0)}
          alt={`Wärmepumpe Förderung ${city.name}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager" decoding="async"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,25,16,0.95) 0%, rgba(10,25,16,0.80) 50%, rgba(10,25,16,0.30) 100%)' }} />
        <div className="relative z-10 w-full pt-28 pb-14 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-6 text-[rgba(255,255,255,0.40)] flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white transition-colors">{keyword.keyword.replace('[Stadt]', '').trim()}</Link>
            <span>›</span>
            <span className="text-white">{city.name}</span>
          </nav>

          {isUrgent && (
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-4 py-2 mb-5">
              <AlertTriangle size={13} className="text-amber-400" />
              <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">GEG-Frist {city.name}: {gegFristFormatted}</span>
            </div>
          )}

          <h1 className="font-bold font-extrabold text-white mb-5 leading-tight" style={{ fontSize: 'clamp(30px,4.5vw,58px)' }}>
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
          <p className="text-[rgba(255,255,255,0.65)] text-lg leading-relaxed max-w-2xl mb-10">
            In {city.name} ({city.bundesland}) beträgt die KfW-Förderung typisch {foerd.gesamtSatz}% — das sind{' '}
            <strong className="text-white">{fmtEuro(foerd.zuschuss)}</strong> nicht rückzahlbarer Zuschuss.
            {hasLandFoerderung ? ` Dazu kommt in ${city.bundesland}: ${city.bundeslandFoerderung}.` : ''}
            {berlinNote && (
              <span className="block mt-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                ⚠ {berlinNote}
              </span>
            )}
          </p>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { val: `${foerd.gesamtSatz}%`, label: 'KfW-Förderquote', sub: 'typisch in ' + city.name },
              { val: fmtEuro(foerd.zuschuss), label: 'Zuschuss', sub: 'nicht rückzahlbar' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Ihr Eigenanteil', sub: 'bei €25.000 Invest' },
              { val: calc.amortisationJahre + ' J.', label: 'Amortisation', sub: 'Ø inkl. Förderung' },
            ].map((s, i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-xl p-4">
                <p className="font-mono font-extrabold text-white text-xl leading-none mb-1">{s.val}</p>
                <p className="text-[#3DA16A] text-xs font-bold">{s.label}</p>
                <p className="text-[rgba(255,255,255,0.35)] text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOURCE BAR ── */}
      <div className="bg-white border-b border-gray-200 py-2.5 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4 flex-wrap text-xs text-[#7A9E8E]">
          <span className="font-bold uppercase tracking-wider">Quellen:</span>
          {['KfW BEG Programm 458', 'BAFA', 'Stand März 2026'].map(s => (
            <span key={s} className="font-semibold">{s}</span>
          ))}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-10 items-start">
        <div className="space-y-10">

          {/* Warnings */}
          {(isFernwaerme || city.bundeslandFoerderungBetrag?.includes('ausgesetzt')) && (
            <div className="space-y-3">
              {isFernwaerme && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm leading-relaxed">
                    <strong>{city.name}</strong> hat {city.fernwaermeQuote}% Fernwärmeabdeckung. Prüfen Sie ob Ihre Straße in einem Fernwärmegebiet liegt — dort kann eine Wärmepumpe unzulässig sein.
                  </p>
                </div>
              )}
              {city.bundeslandFoerderungBetrag?.includes('ausgesetzt') && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-blue-800 text-sm leading-relaxed">
                    <strong>{city.bundesland}:</strong> {city.bundeslandFoerderung} ist derzeit ausgesetzt. Die KfW-Bundesförderung gilt vollständig und ohne Einschränkung.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Featured Snippet */}
          <div className="bg-white border border-gray-200 border-l-4 border-l-wp-green rounded-xl p-6 shadow-md">
            <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] ?? 'Wie hoch ist die Wärmepumpe Förderung in {stadt}?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              In <strong className="text-[#1C2B2B]">{city.name}</strong> erhalten Eigennutzer die eine fossile Heizung ersetzen{' '}
              <strong className="text-[#1C2B2B]">{foerd.gesamtSatz}% KfW-Förderung</strong> = <strong className="text-[#1C2B2B]">{fmtEuro(foerd.zuschuss)}</strong> Zuschuss
              (bei €25.000 Invest). Eigenanteil ab <strong className="text-[#1C2B2B]">{fmtEuro(foerd.eigenanteil)}</strong>.
              {hasLandFoerderung ? ` Zusätzlich: ${city.bundesland}-Programm "${city.bundeslandFoerderung}" (${city.bundeslandFoerderungBetrag}).` : ''}
              Antrag <strong className="text-[#1C2B2B]">zwingend vor Vertragsabschluss</strong>.
            </p>
          </div>

          {/* Alle Förder-Bausteine */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block bg-[#1A4731] text-[#3DA16A] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">KfW Programm 458</span>
              <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl">{h2s.foerderungBausteine}</h2>
            </div>
            <div className="space-y-3">
              {boni.map((b, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.badgeColor}`}>{b.badge}</span>
                      <span className="font-bold font-bold text-[#1C2B2B]">{b.label}</span>
                    </div>
                    <span className="font-mono font-extrabold text-[#D97706] text-lg">+{b.pct}%</span>
                  </div>
                  <div className="h-2 bg-[#F8F9FA] rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: `${b.pct / 70 * 100}%`, background: i < 2 ? '#1B5E37' : '#D97706' }} />
                  </div>
                  <p className="text-[#4A6358] text-xs leading-relaxed">{b.info}</p>
                </div>
              ))}
            </div>

            {/* Gesamtergebnis */}
            <div className="mt-4 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A4731 0%, #0A1910 100%)' }}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[rgba(255,255,255,0.60)] text-sm font-semibold">Typisch für {city.name} (Eigennutzer, fossile Heizung → WP)</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Gesamtinvestition', val: fmtEuro(25000), color: 'text-white' },
                    { label: `KfW −${foerd.gesamtSatz}%`, val: `−${fmtEuro(foerd.zuschuss)}`, color: 'text-[#3DA16A]' },
                    { label: 'Ihr Eigenanteil', val: fmtEuro(foerd.eigenanteil), color: 'text-[#D97706]' },
                  ].map((r, i) => (
                    <div key={i} className="bg-[rgba(255,255,255,0.08)] rounded-lg p-3 text-center">
                      <p className={`font-mono font-bold text-base leading-none mb-1 ${r.color}`}>{r.val}</p>
                      <p className="text-[rgba(255,255,255,0.45)] text-xs">{r.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[rgba(255,255,255,0.30)] text-xs mt-3">Quelle: KfW BEG Programm 458, Stand März 2026. Eigennutzer + Klima-Speed-Bonus.</p>
              </div>
            </div>
          </div>

          {/* Landesförderung */}
          {city.bundeslandFoerderung && (
            <div>
              <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-4">{city.bundesland}-Landesförderung: Was gibt es zusätzlich zur KfW?</h2>
              <div className={`rounded-xl border p-5 ${hasLandFoerderung ? 'bg-[#E8F5EE] border-[#3DA16A]/30' : 'bg-amber-50 border-amber-200'}`}>
                <p className={`font-bold font-bold text-lg mb-2 ${hasLandFoerderung ? 'text-[#1A4731]' : 'text-amber-800'}`}>
                  {city.bundeslandFoerderung}
                </p>
                <p className={`text-sm leading-relaxed ${hasLandFoerderung ? 'text-[#4A6358]' : 'text-amber-700'}`}>
                  {city.bundeslandFoerderungBetrag}
                  {!hasLandFoerderung ? ' Die KfW-Bundesförderung gilt vollständig und ohne Einschränkung.' : ''}
                </p>
                {city.bundeslandFoerderungUrl && hasLandFoerderung && (
                  <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 text-[#1A4731] text-sm font-semibold hover:underline">
                    Mehr Infos ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Schritt für Schritt */}
          <div>
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.foerderungProzess}</h2>
            <div className="space-y-3">
              {[
                { n: '01', title: 'KfW-Antrag VOR Baubeginn', text: `Zwingend: Der Antrag muss vor dem Vertragsabschluss mit dem Installateur im KfW-Portal gestellt werden. Kein nachträglicher Antrag möglich. Gilt ohne Ausnahme in ${city.name}.`, urgent: true },
                { n: '02', title: `${city.bundesland}-Landesförderung: Was gibt es zusätzlich zur KfW? prüfen`, text: hasLandFoerderung ? `"${city.bundeslandFoerderung}": ${city.bundeslandFoerderungBetrag}. Ggf. separaten Antrag vor Baubeginn stellen.` : `${city.bundesland} hat kein aktives Landesprogramm. KfW gilt vollständig — ohne Wartezeit.`, urgent: false },
                { n: '03', title: 'iSFP-Bonus: +5% extra', text: `Mit Individuellem Sanierungsfahrplan (BAFA-gefördert, Eigenanteil ~€60–140) erhalten Sie +5% Bonus = +${fmtEuro(Math.round(25000 * 0.05))} bei €25.000. Fast immer lohnenswert.`, urgent: false },
                { n: '04', title: 'Installation & Nachweis', text: `Nach Installation: Rechnung + Fachunternehmer-Bestätigung einreichen. Frist: 6 Monate. Auszahlung: ${fmtEuro(foerd.zuschuss)} in 4–8 Wochen.`, urgent: false },
              ].map((s, i) => (
                <div key={i} className={`bg-white rounded-xl border p-5 flex gap-4 shadow-md ${s.urgent ? 'border-l-4 border-l-red-500 border-r-wp-border border-t-wp-border border-b-wp-border' : 'border-gray-200'}`}>
                  <div className="w-9 h-9 bg-[#1A4731] rounded-xl flex items-center justify-center font-mono font-bold text-[#3DA16A] text-sm shrink-0">{s.n}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold font-bold text-[#1C2B2B]">{s.title}</p>
                      {s.urgent && <span className="bg-red-50 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">⚠️ Pflicht</span>}
                    </div>
                    <p className="text-[#4A6358] text-sm leading-relaxed">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GEG Box */}
          <div className={`rounded-xl border p-5 ${isUrgent ? 'bg-amber-50 border-amber-300' : 'bg-[#E8F5EE] border-[#3DA16A]/30'}`}>
            <p className={`font-bold font-bold text-lg mb-2 ${isUrgent ? 'text-amber-900' : 'text-[#1A4731]'}`}>
              {isUrgent ? '⚠️ ' : '✓ '}GEG-Frist {city.name}: {gegFristFormatted}
            </p>
            <p className={`text-sm leading-relaxed ${isUrgent ? 'text-amber-800' : 'text-[#4A6358]'}`}>
              {isUrgent
                ? `Als Großstadt gilt die 65%-EE-Pflicht in ${city.name} ab ${gegFristFormatted}. Bei aktuellen Wartezeiten von 4–12 Wochen: jetzt handeln sichert volle Förderung.`
                : `In ${city.name} gilt die 65%-EE-Pflicht ab ${gegFristFormatted}. Eine Wärmepumpe erfüllt das GEG automatisch — ohne weitere Auflagen.`}
            </p>
          </div>

          {/* FAQ */}
          <div>
                        {/* H3 Featured Snippet */}
            {faqs.length > 0 && (
              <div className="mb-6 p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
                <h3 className="font-bold font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
                <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
              </div>
            )}
            <h2 className="font-bold font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md">
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
              <h3 className="font-bold font-semibold text-[#1C2B2B] text-base mb-3">Förderung in der Region</h3>
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

        {/* SIDEBAR */}
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #1A4731 0%, #0A1910 100%)' }}>
            <div className="p-6">
              <p className="text-[rgba(255,255,255,0.50)] text-xs font-bold uppercase tracking-widest mb-1">{city.name} — Förderung</p>
              <p className="font-mono font-extrabold text-white text-4xl leading-none mb-0.5">{fmtEuro(foerd.zuschuss)}</p>
              <p className="text-[rgba(255,255,255,0.40)] text-xs mb-5">KfW-Zuschuss · nicht rückzahlbar</p>
              <div className="space-y-2 mb-5">
                {[
                  { l: `Förderquote (${foerd.gesamtSatz}%)`, v: `${foerd.gesamtSatz}%`, c: 'text-[#3DA16A]' },
                  { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-[#D97706]' },
                  { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-[#3DA16A]' },
                  { l: 'Amortisation', v: calc.amortisationJahre + ' Jahre', c: 'text-white' },
                  { l: 'GEG-Frist', v: gegFristFormatted, c: isUrgent ? 'text-amber-400' : 'text-white' },
                ].map(r => (
                  <div key={r.l} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.08)]">
                    <span className="text-[rgba(255,255,255,0.45)] text-xs">{r.l}</span>
                    <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <a href="#angebot" className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#D97706] text-white rounded-xl font-bold font-bold text-sm hover:bg-amber-700 transition-colors">
                Förderung berechnen <ArrowRight size={14} />
              </a>
              <p className="text-[rgba(255,255,255,0.25)] text-xs text-center mt-2">Kostenlos · Unverbindlich</p>
            </div>
          </div>
          <div id="angebot">
            <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          </div>


      {/* ── FÖRDERUNG DETAIL ────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-8">
        <h2 className="font-bold font-bold text-[#1C2B2B] text-xl mb-5">
          Wie beantrage ich die Förderung in {city.name} — Schritt für Schritt?
        </h2>
        <div className="prose prose-sm max-w-none text-[#4A6358] space-y-4 leading-relaxed">
          <p>
            <strong>Reihenfolge ist bindend:</strong> Der KfW-Antrag muss zwingend VOR der Auftragserteilung gestellt werden. Kein Nachantrag möglich. Ausnahme: Vertrag mit aufschiebender Bedingung (Förderklausel). Wir unterstützen bei der korrekten Vertragsgestaltung.
          </p>
          <p>
            <strong>Was Sie für den KfW-Antrag in {city.name} brauchen:</strong> (1) KfW-Lieferanten- und Leistungserbringer (LuL)-Nummer des Installateurbetriebs — prüfbar auf kdnr.kfw.de. (2) Bestätigung zum Antrag (BzA) vom Fachbetrieb. (3) Registrierung im KfW-Portal „Meine KfW". (4) IBAN für Auszahlung. Bearbeitungszeit: meist 1–5 Werktage.
          </p>
          <p>
            <strong>Maximale Förderung für {city.name} berechnet:</strong> Brutto-Investition {fmtEuro(foerd.foerderfaehigeBasis)} × {foerd.gesamtSatz}% KfW-Förderquote = {fmtEuro(foerd.zuschuss)} Zuschuss. Eigenanteil: {fmtEuro(foerd.eigenanteil)}. Dazu §35a-Steuerbonus: bis €1.200 im Installationsjahr. Gesamtersparnis gegenüber Listenpreis: {fmtEuro(foerd.zuschuss + 1200)}.
          </p>
          <p>
            <strong>Verwendungsnachweis in {city.name}:</strong> Nach Installation müssen eingereicht werden: Rechnung mit allen Positionen, Inbetriebnahmeprotokoll (F-Gas-Pflicht), Nachweis Hydraulischer Abgleich (KfW-Pflicht), Wärmemengenzähler-Einbaubestätigung. Auszahlung danach: 4–8 Wochen. Wir helfen bei der Dokumentation kostenlos.
          </p>
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
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            {['KfW-Antrag inklusive', 'LuL-registrierte Betriebe', 'Herstellerunabhängig', `Lokal in ${city.name}`, '100% kostenlos'].map(t => (
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
