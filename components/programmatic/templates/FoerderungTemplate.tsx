// components/programmatic/templates/FoerderungTemplate.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, AlertTriangle, Info, TrendingDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

export default function FoerderungTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 6);
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const isUrgent = city.einwohner >= 100000;
  const hasLandFoerderung = !!city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.includes('ausgesetzt');
  const isFernwaerme = city.fernwaermeQuote >= 50;

  const boni = [
    { pct: 30, label: 'Grundförderung', info: 'Für alle Eigennutzer und Vermieter — immer verfügbar', badge: 'Immer', badgeColor: 'bg-wp-green text-white' },
    { pct: 20, label: 'Klima-Speed-Bonus', info: 'Bei Ersatz fossiler Heizung (Gas, Öl) durch Eigennutzer', badge: 'Typisch', badgeColor: 'bg-wp-greenlt text-wp-green' },
    { pct: 30, label: 'Einkommens-Bonus', info: 'Haushaltseinkommen unter €40.000 netto/Jahr', badge: 'Optional', badgeColor: 'bg-wp-bg text-wp-text3 border border-wp-border' },
    { pct: 5,  label: 'Kältemittel-Bonus', info: 'R290-Propan-WP (z.B. Vaillant aroTHERM, Viessmann Vitocal 250-A) oder Erdwärme', badge: '+5%', badgeColor: 'bg-wp-amberlt text-wp-amber' },
    { pct: 5,  label: 'iSFP-Bonus', info: `Individueller Sanierungsfahrplan → +${fmtEuro(Math.round(25000 * 0.05))} bei €25.000 Invest · Eigenanteil ca. €60–140 nach BAFA-Förderung`, badge: '+5%', badgeColor: 'bg-wp-amberlt text-wp-amber' },
  ];


  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      {/* ── HERO ─────────────────────────────────────── */}
      <div className="bg-wp-dark pt-24 pb-16 px-6" style={{ background: 'linear-gradient(135deg, #0A1910 0%, #1A4731 100%)' }}>
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

          <h1 className="font-heading font-extrabold text-white mb-5 leading-tight" style={{ fontSize: 'clamp(30px,4.5vw,58px)' }}>
            {h1}
          </h1>
              {/* Ultra-lokale Fakten */}
              <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-5">
                {city.name}: {city.strompreis} ct/kWh Strom · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.normAussentemp}°C Normaußentemp. · {city.fernwaermeQuote}% Fernwärme
              </p>
              {/* Preis-Badge — Eigenanteil nach KfW-Förderung */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-wp-amber/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
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
                <p className="text-wp-green3 text-xs font-bold">{s.label}</p>
                <p className="text-[rgba(255,255,255,0.35)] text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOURCE BAR ── */}
      <div className="bg-white border-b border-wp-border py-2.5 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4 flex-wrap text-xs text-wp-text3">
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
          <div className="bg-white border border-wp-border border-l-4 border-l-wp-green rounded-xl p-6 shadow-wp-sm">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] ?? 'Wie hoch ist die Wärmepumpe Förderung in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              In <strong className="text-wp-text">{city.name}</strong> erhalten Eigennutzer die eine fossile Heizung ersetzen{' '}
              <strong className="text-wp-text">{foerd.gesamtSatz}% KfW-Förderung</strong> = <strong className="text-wp-text">{fmtEuro(foerd.zuschuss)}</strong> Zuschuss
              (bei €25.000 Invest). Eigenanteil ab <strong className="text-wp-text">{fmtEuro(foerd.eigenanteil)}</strong>.
              {hasLandFoerderung ? ` Zusätzlich: ${city.bundesland}-Programm "${city.bundeslandFoerderung}" (${city.bundeslandFoerderungBetrag}).` : ''}
              Antrag <strong className="text-wp-text">zwingend vor Vertragsabschluss</strong>.
            </p>
          </div>

          {/* Alle Förder-Bausteine */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block bg-wp-dark text-wp-green3 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">KfW Programm 458</span>
              <h2 className="font-heading font-bold text-wp-text text-2xl">{h2s.foerderungBausteine}</h2>
            </div>
            <div className="space-y-3">
              {boni.map((b, i) => (
                <div key={i} className="bg-white border border-wp-border rounded-xl p-4 shadow-wp-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.badgeColor}`}>{b.badge}</span>
                      <span className="font-heading font-bold text-wp-text">{b.label}</span>
                    </div>
                    <span className="font-mono font-extrabold text-wp-amber text-lg">+{b.pct}%</span>
                  </div>
                  <div className="h-2 bg-wp-bg rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: `${b.pct / 70 * 100}%`, background: i < 2 ? '#1B5E37' : '#D97706' }} />
                  </div>
                  <p className="text-wp-text2 text-xs leading-relaxed">{b.info}</p>
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
                    { label: `KfW −${foerd.gesamtSatz}%`, val: `−${fmtEuro(foerd.zuschuss)}`, color: 'text-wp-green3' },
                    { label: 'Ihr Eigenanteil', val: fmtEuro(foerd.eigenanteil), color: 'text-wp-amber' },
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
              <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">{city.bundesland}-Landesförderung: Was gibt es zusätzlich zur KfW?</h2>
              <div className={`rounded-xl border p-5 ${hasLandFoerderung ? 'bg-wp-greenlt border-wp-green3/30' : 'bg-amber-50 border-amber-200'}`}>
                <p className={`font-heading font-bold text-lg mb-2 ${hasLandFoerderung ? 'text-wp-green' : 'text-amber-800'}`}>
                  {city.bundeslandFoerderung}
                </p>
                <p className={`text-sm leading-relaxed ${hasLandFoerderung ? 'text-wp-text2' : 'text-amber-700'}`}>
                  {city.bundeslandFoerderungBetrag}
                  {!hasLandFoerderung ? ' Die KfW-Bundesförderung gilt vollständig und ohne Einschränkung.' : ''}
                </p>
                {city.bundeslandFoerderungUrl && hasLandFoerderung && (
                  <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 text-wp-green text-sm font-semibold hover:underline">
                    Mehr Infos ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Schritt für Schritt */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">{h2s.foerderungProzess}</h2>
            <div className="space-y-3">
              {[
                { n: '01', title: 'KfW-Antrag VOR Baubeginn', text: `Zwingend: Der Antrag muss vor dem Vertragsabschluss mit dem Installateur im KfW-Portal gestellt werden. Kein nachträglicher Antrag möglich. Gilt ohne Ausnahme in ${city.name}.`, urgent: true },
                { n: '02', title: `${city.bundesland}-Landesförderung: Was gibt es zusätzlich zur KfW? prüfen`, text: hasLandFoerderung ? `"${city.bundeslandFoerderung}": ${city.bundeslandFoerderungBetrag}. Ggf. separaten Antrag vor Baubeginn stellen.` : `${city.bundesland} hat kein aktives Landesprogramm. KfW gilt vollständig — ohne Wartezeit.`, urgent: false },
                { n: '03', title: 'iSFP-Bonus: +5% extra', text: `Mit Individuellem Sanierungsfahrplan (BAFA-gefördert, Eigenanteil ~€60–140) erhalten Sie +5% Bonus = +${fmtEuro(Math.round(25000 * 0.05))} bei €25.000. Fast immer lohnenswert.`, urgent: false },
                { n: '04', title: 'Installation & Nachweis', text: `Nach Installation: Rechnung + Fachunternehmer-Bestätigung einreichen. Frist: 6 Monate. Auszahlung: ${fmtEuro(foerd.zuschuss)} in 4–8 Wochen.`, urgent: false },
              ].map((s, i) => (
                <div key={i} className={`bg-white rounded-xl border p-5 flex gap-4 shadow-wp-sm ${s.urgent ? 'border-l-4 border-l-red-500 border-r-wp-border border-t-wp-border border-b-wp-border' : 'border-wp-border'}`}>
                  <div className="w-9 h-9 bg-wp-dark rounded-xl flex items-center justify-center font-mono font-bold text-wp-green3 text-sm shrink-0">{s.n}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-heading font-bold text-wp-text">{s.title}</p>
                      {s.urgent && <span className="bg-red-50 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">⚠️ Pflicht</span>}
                    </div>
                    <p className="text-wp-text2 text-sm leading-relaxed">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GEG Box */}
          <div className={`rounded-xl border p-5 ${isUrgent ? 'bg-amber-50 border-amber-300' : 'bg-wp-greenlt border-wp-green3/30'}`}>
            <p className={`font-heading font-bold text-lg mb-2 ${isUrgent ? 'text-amber-900' : 'text-wp-green'}`}>
              {isUrgent ? '⚠️ ' : '✓ '}GEG-Frist {city.name}: {gegFristFormatted}
            </p>
            <p className={`text-sm leading-relaxed ${isUrgent ? 'text-amber-800' : 'text-wp-text2'}`}>
              {isUrgent
                ? `Als Großstadt gilt die 65%-EE-Pflicht in ${city.name} ab ${gegFristFormatted}. Bei aktuellen Wartezeiten von 4–12 Wochen: jetzt handeln sichert volle Förderung.`
                : `In ${city.name} gilt die 65%-EE-Pflicht ab ${gegFristFormatted}. Eine Wärmepumpe erfüllt das GEG automatisch — ohne weitere Auflagen.`}
            </p>
          </div>

          {/* FAQ */}
          <div>
                        {/* H3 Featured Snippet */}
            {faqs.length > 0 && (
              <div className="mb-6 p-5 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
                <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
                <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
              </div>
            )}
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-wp-border rounded-2xl overflow-hidden bg-white shadow-wp-sm">
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
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Förderung in der Region</h3>
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

        {/* SIDEBAR */}
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl shadow-wp-xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #1A4731 0%, #0A1910 100%)' }}>
            <div className="p-6">
              <p className="text-[rgba(255,255,255,0.50)] text-xs font-bold uppercase tracking-widest mb-1">{city.name} — Förderung</p>
              <p className="font-mono font-extrabold text-white text-4xl leading-none mb-0.5">{fmtEuro(foerd.zuschuss)}</p>
              <p className="text-[rgba(255,255,255,0.40)] text-xs mb-5">KfW-Zuschuss · nicht rückzahlbar</p>
              <div className="space-y-2 mb-5">
                {[
                  { l: `Förderquote (${foerd.gesamtSatz}%)`, v: `${foerd.gesamtSatz}%`, c: 'text-wp-green3' },
                  { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-wp-amber' },
                  { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-wp-green3' },
                  { l: 'Amortisation', v: calc.amortisationJahre + ' Jahre', c: 'text-white' },
                  { l: 'GEG-Frist', v: gegFristFormatted, c: isUrgent ? 'text-amber-400' : 'text-white' },
                ].map(r => (
                  <div key={r.l} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.08)]">
                    <span className="text-[rgba(255,255,255,0.45)] text-xs">{r.l}</span>
                    <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <a href="#angebot" className="flex items-center justify-center gap-2 w-full py-3.5 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-colors">
                Förderung berechnen <ArrowRight size={14} />
              </a>
              <p className="text-[rgba(255,255,255,0.25)] text-xs text-center mt-2">Kostenlos · Unverbindlich</p>
            </div>
          </div>
          <div id="angebot">
            <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          </div>
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
