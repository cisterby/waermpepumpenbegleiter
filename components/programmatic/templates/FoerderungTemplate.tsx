// components/programmatic/templates/FoerderungTemplate.tsx
'use client';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock , getUniqueLocalParagraph, getNearbyLinkContext, getBundeslandParagraph, getGebaeudeParagraph, getEnergieParagraph, getComparisonTable, getLocalTestimonial, getSeasonalAdvice, getCrossKeywordLinks } from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// Image pools
const HERO_IMGS = ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=85', 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=85', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85'];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) => arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

export default function FoerderungTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 6);
  const h2s = getDynamicH2s(city, keyword, jaz);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const isUrgent = city.einwohner >= 100000;
  const hasLandFoerderung = !!city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('eingestellt');

  const berlinNote = city.bundesland === 'Berlin'
    ? 'Hinweis Berlin 2026: IBB Effiziente GebäudePLUS vergibt keine Direktzuschüsse mehr. IBB Wohnraum modernisieren (Kredit bis €100.000/WE) kombinierbar mit KfW.'
    : null;

  const boni = [
    { pct: 30, label: 'Grundförderung', info: 'Für alle Eigennutzer und Vermieter — immer verfügbar', badge: 'Immer', color: '#1A4731' },
    { pct: 20, label: 'Klima-Speed-Bonus', info: 'Ersatz fossiler Heizung (Gas, Öl) durch Eigennutzer', badge: 'Typisch', color: '#1A4731' },
    { pct: 30, label: 'Einkommens-Bonus', info: 'Haushaltseinkommen unter 40.000 Euro netto/Jahr', badge: 'Optional', color: '#D97706' },
    { pct: 5, label: 'Kältemittel-Bonus R290', info: 'Vaillant aroTHERM, Viessmann Vitocal 250-A oder Erdwärme', badge: '+5%', color: '#D97706' },
    { pct: 5, label: 'iSFP-Bonus', info: 'Individueller Sanierungsfahrplan (BAFA) → +' + fmtEuro(Math.round(25000 * 0.05)) + ' bei 25.000 Euro Invest', badge: '+5%', color: '#D97706' },
  ];

  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'KfW-Förderung beantragen in ' + city.name + ' — Schritt für Schritt',
    description: 'So beantragen Sie die KfW-Wärmepumpenförderung (Programm 458) in ' + city.name,
    step: [
      { '@type': 'HowToStep', name: 'KfW-Antrag VOR Baubeginn stellen', text: 'Zwingend vor Vertragsabschluss im KfW-Portal "Meine KfW" registrieren und Antrag stellen. Kein Nachantrag möglich.' },
      { '@type': 'HowToStep', name: 'Landesförderung ' + city.bundesland + ' prüfen', text: 'Zusätzliche Landesprogramme separat beantragen, falls verfügbar. Kombinierbar mit KfW.' },
      { '@type': 'HowToStep', name: 'iSFP-Bonus sichern', text: 'Mit individuellem Sanierungsfahrplan (BAFA) +5% Zusatzbonus = ' + fmtEuro(Math.round(25000 * 0.05)) + ' extra bei 25.000 Euro Invest.' },
      { '@type': 'HowToStep', name: 'Installation & Verwendungsnachweis', text: 'Rechnung, Inbetriebnahmeprotokoll und Hydraulischer-Abgleich-Nachweis einreichen. Auszahlung in 4–8 Wochen.' },
    ],
  };

  const uniqueParagraph = getUniqueLocalParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);

  const nearbyLinks = getNearbyLinkContext(city, nearby, keyword, jaz);

  const bundeslandText = getBundeslandParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const gebaeudeText = getGebaeudeParagraph(city, keyword, jaz, calc.wpKosten);
  const energieText = getEnergieParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const comparison = getComparisonTable(city, jaz, calc.wpKosten, calc.ersparnis);
  const testimonial = getLocalTestimonial(city, keyword);
  const seasonalText = getSeasonalAdvice(city);
  const crossLinks = getCrossKeywordLinks(city, keyword, KEYWORDS);

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
    <div className="min-h-screen bg-[#F8F9FA] font-sans">

      {/* HERO */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <img src={pickImg(HERO_IMGS, city.lat, city.lng, 0)} alt={'Wärmepumpe Förderung ' + city.name} className="absolute inset-0 w-full h-full object-cover" loading="eager" {...({fetchPriority:'high'} as any)} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,25,16,0.95) 0%, rgba(10,25,16,0.80) 50%, rgba(10,25,16,0.30) 100%)' }} />
        <div className="relative z-10 w-full pt-28 pb-14 px-6">
          <div className="max-w-5xl mx-auto">
            <nav className="flex items-center gap-2 text-sm mb-6 text-white/40 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
              <span>›</span>
              <Link href={'/' + keyword.slug} className="hover:text-white transition-colors">{keyword.keyword.replace('[Stadt]', '').trim()}</Link>
              <span>›</span>
              <span className="text-white">{city.name}</span>
            </nav>
            {isUrgent && (
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-4 py-2 mb-5">
                <AlertTriangle size={13} className="text-amber-400" />
                <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">GEG-Frist {city.name}: {gegFristFormatted}</span>
              </div>
            )}
            <h1 className="font-extrabold text-white mb-5 leading-tight" style={{ fontSize: 'clamp(30px,4.5vw,58px)' }}>
              {h1}
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-4">
              {city.name}: {city.strompreis} ct/kWh Strom · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.normAussentemp}°C Normaußentemp.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#D97706]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                ab {fmtEuro(foerd.eigenanteil)} Eigenanteil
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {fmtEuro(foerd.zuschuss)} KfW-Zuschuss
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { val: foerd.gesamtSatz + '%', label: 'KfW-Förderquote', sub: 'typisch in ' + city.name },
                { val: fmtEuro(foerd.zuschuss), label: 'Zuschuss', sub: 'nicht rückzahlbar' },
                { val: fmtEuro(foerd.eigenanteil), label: 'Ihr Eigenanteil', sub: 'bei 25.000 Euro Invest' },
                { val: calc.amortisationJahre + ' J.', label: 'Amortisation', sub: 'inkl. Förderung' },
              ].map((s, i) => (
                <div key={i} className="bg-white/8 border border-white/12 rounded-xl p-4">
                  <p className="font-mono font-extrabold text-white text-xl leading-none mb-1">{s.val}</p>
                  <p className="text-[#3DA16A] text-xs font-bold">{s.label}</p>
                  <p className="text-white/35 text-xs mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOURCE BAR */}
      <div className="bg-white border-b border-gray-200 py-2.5 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4 flex-wrap text-xs text-[#7A9E8E]">
          <span className="font-bold uppercase tracking-wider">Quellen:</span>
          {['KfW BEG Programm 458', 'BAFA', 'Stand März 2026'].map(s => (
            <span key={s} className="font-semibold">{s}</span>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-10 items-start">

        {/* LEFT COLUMN */}
        <div className="space-y-10">

          {/* Warnings */}
          {(city.fernwaermeQuote >= 50 || city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') || city.bundeslandFoerderungBetrag?.toLowerCase().includes('eingestellt')) && (
            <div className="space-y-3">
              {city.fernwaermeQuote >= 50 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm leading-relaxed">
                    <strong>{city.name}</strong> hat {city.fernwaermeQuote}% Fernwärmeabdeckung. Prüfen Sie ob Ihre Straße in einem Fernwärmegebiet liegt.
                  </p>
                </div>
              )}
              {!hasLandFoerderung && city.bundeslandFoerderungBetrag && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-blue-800 text-sm leading-relaxed">
                    <strong>{city.bundesland}:</strong> {city.bundeslandFoerderung || 'Landesprogramm'} ist derzeit nicht aktiv. Die KfW-Bundesförderung gilt vollständig.
                  </p>
                </div>
              )}
              {berlinNote && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                  <Info size={15} className="text-orange-600 shrink-0 mt-0.5" />
                  <p className="text-orange-800 text-sm leading-relaxed">{berlinNote}</p>
                </div>
              )}
            </div>
          )}

          {/* Featured Snippet */}
          <div className="bg-white border border-gray-200 border-l-4 border-l-[#1A4731] rounded-xl p-6 shadow-md">
            <h2 className="font-bold text-[#1C2B2B] text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] || 'Wie hoch ist die Wärmepumpe Förderung in {stadt}?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">
              In <strong className="text-[#1C2B2B]">{city.name}</strong> erhalten Eigennutzer die eine fossile Heizung ersetzen{' '}
              <strong className="text-[#1C2B2B]">{foerd.gesamtSatz}% KfW-Förderung</strong> = <strong className="text-[#1C2B2B]">{fmtEuro(foerd.zuschuss)}</strong> Zuschuss
              (bei 25.000 Euro Invest). Eigenanteil ab <strong className="text-[#1C2B2B]">{fmtEuro(foerd.eigenanteil)}</strong>.
              {hasLandFoerderung && city.bundeslandFoerderung ? ' Zusätzlich: ' + city.bundesland + '-Programm "' + city.bundeslandFoerderung + '" (' + city.bundeslandFoerderungBetrag + ').' : ''}
              {' '}Antrag <strong className="text-[#1C2B2B]">zwingend vor Vertragsabschluss</strong>.
            </p>
          </div>

          {/* KfW Bausteine */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block bg-[#1A4731] text-[#3DA16A] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">KfW Programm 458</span>
              <h2 className="font-bold text-[#1C2B2B] text-2xl">{h2s.foerderungBausteine}</h2>
            </div>
            <div className="space-y-3">
              {boni.map((b, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: b.color + '20', color: b.color }}>{b.badge}</span>
                      <span className="font-bold text-[#1C2B2B]">{b.label}</span>
                    </div>
                    <span className="font-mono font-extrabold text-[#D97706] text-lg">+{b.pct}%</span>
                  </div>
                  <div className="h-2 bg-[#F8F9FA] rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: (b.pct / 70 * 100) + '%', backgroundColor: b.color }} />
                  </div>
                  <p className="text-[#4A6358] text-xs leading-relaxed">{b.info}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A4731 0%, #0A1910 100%)' }}>
              <div className="p-5">
                <p className="text-white/60 text-sm font-semibold mb-4">Typisch für {city.name} (Eigennutzer, fossile Heizung → WP)</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Gesamtinvestition', val: fmtEuro(25000), color: 'text-white' },
                    { label: 'KfW −' + foerd.gesamtSatz + '%', val: '−' + fmtEuro(foerd.zuschuss), color: 'text-[#3DA16A]' },
                    { label: 'Ihr Eigenanteil', val: fmtEuro(foerd.eigenanteil), color: 'text-[#D97706]' },
                  ].map((r, i) => (
                    <div key={i} className="bg-white/8 rounded-lg p-3 text-center">
                      <p className={'font-mono font-bold text-base leading-none mb-1 ' + r.color}>{r.val}</p>
                      <p className="text-white/45 text-xs">{r.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-3">Quelle: KfW BEG Programm 458, Stand März 2026. Eigennutzer + Klima-Speed-Bonus.</p>
              </div>
            </div>
          </div>

          {/* Landesförderung */}
          {city.bundeslandFoerderung ? (
            <div>
              <h2 className="font-bold text-[#1C2B2B] text-2xl mb-4">{city.bundesland}-Landesförderung: Was gibt es zusätzlich zur KfW?</h2>
              <div className={'rounded-xl border p-5 ' + (hasLandFoerderung ? 'bg-[#E8F5EE] border-[#3DA16A]/30' : 'bg-amber-50 border-amber-200')}>
                <p className={'font-bold text-lg mb-2 ' + (hasLandFoerderung ? 'text-[#1A4731]' : 'text-amber-800')}>
                  {city.bundeslandFoerderung}
                </p>
                <p className={'text-sm leading-relaxed ' + (hasLandFoerderung ? 'text-[#4A6358]' : 'text-amber-700')}>
                  {city.bundeslandFoerderungBetrag}
                  {!hasLandFoerderung ? ' Die KfW-Bundesförderung gilt vollständig und ohne Einschränkung.' : ' — kombinierbar mit KfW-Bundesförderung.'}
                </p>
                {city.bundeslandFoerderungUrl && hasLandFoerderung && (
                  <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[#1A4731] text-sm font-semibold hover:underline">
                    Mehr Infos ↗
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-[#1C2B2B] text-xl mb-2">Landesförderung {city.bundesland}</h2>
              <p className="text-[#4A6358] text-sm leading-relaxed">
                <strong className="text-[#1C2B2B]">{city.bundesland}</strong> hat aktuell kein eigenes aktives WP-Förderprogramm. Die vollständige KfW-Bundesförderung von bis zu {foerd.gesamtSatz}% gilt uneingeschränkt.
                {city.bundeslandFoerderungBetrag && ' ' + city.bundeslandFoerderungBetrag}
              </p>
            </div>
          )}

          {/* Schritt für Schritt */}
          <div>
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.foerderungProzess}</h2>
            <div className="space-y-3">
              {[
                { n: '01', title: 'KfW-Antrag VOR Baubeginn', text: 'Zwingend: Der Antrag muss vor dem Vertragsabschluss im KfW-Portal gestellt werden. Kein nachträglicher Antrag möglich. Gilt ohne Ausnahme in ' + city.name + '.', urgent: true },
                { n: '02', title: 'Landesförderung ' + city.bundesland + ' prüfen', text: hasLandFoerderung && city.bundeslandFoerderung ? '"' + city.bundeslandFoerderung + '": ' + city.bundeslandFoerderungBetrag + '. Ggf. separaten Antrag vor Baubeginn stellen.' : city.bundesland + ' hat kein aktives Landesprogramm. KfW gilt vollständig — ohne Wartezeit.', urgent: false },
                { n: '03', title: 'iSFP-Bonus: +5% extra', text: 'Mit Individuellem Sanierungsfahrplan (BAFA-gefördert, Eigenanteil ~60–140 Euro) erhalten Sie +5% Bonus = +' + fmtEuro(Math.round(25000 * 0.05)) + ' bei 25.000 Euro. Fast immer lohnenswert.', urgent: false },
                { n: '04', title: 'Installation & Nachweis', text: 'Nach Installation: Rechnung + Fachunternehmer-Bestätigung einreichen. Frist: 6 Monate. Auszahlung: ' + fmtEuro(foerd.zuschuss) + ' in 4–8 Wochen.', urgent: false },
              ].map((s, i) => (
                <div key={i} className={'bg-white rounded-xl border p-5 flex gap-4 shadow-sm ' + (s.urgent ? 'border-l-4 border-l-red-500 border-r-gray-200 border-t-gray-200 border-b-gray-200' : 'border-gray-200')}>
                  <div className="w-9 h-9 bg-[#1A4731] rounded-xl flex items-center justify-center font-mono font-bold text-[#3DA16A] text-sm shrink-0">{s.n}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-[#1C2B2B]">{s.title}</p>
                      {s.urgent && <span className="bg-red-50 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">Pflicht</span>}
                    </div>
                    <p className="text-[#4A6358] text-sm leading-relaxed">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GEG Box */}
          <div className={'rounded-xl border p-5 ' + (isUrgent ? 'bg-amber-50 border-amber-300' : 'bg-[#E8F5EE] border-[#3DA16A]/30')}>
            <p className={'font-bold text-lg mb-2 ' + (isUrgent ? 'text-amber-900' : 'text-[#1A4731]')}>
              {isUrgent ? '⚠️ ' : '✓ '}GEG-Frist {city.name}: {gegFristFormatted}
            </p>
            <p className={'text-sm leading-relaxed ' + (isUrgent ? 'text-amber-800' : 'text-[#4A6358]')}>
              {isUrgent
                ? 'Als Großstadt gilt die 65%-EE-Pflicht in ' + city.name + ' ab ' + gegFristFormatted + '. Bei aktuellen Wartezeiten von 4–12 Wochen: jetzt handeln sichert volle Förderung.'
                : 'In ' + city.name + ' gilt die 65%-EE-Pflicht ab ' + gegFristFormatted + '. Eine Wärmepumpe erfüllt das GEG automatisch.'}
            </p>
          </div>

          {/* City-specific technical note */}
          {city.normAussentemp <= -14 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl shrink-0">🌡️</span>
              <div>
                <p className="font-bold text-slate-800 text-sm mb-1">
                  {city.name}: Normaußentemperatur {city.normAussentemp}°C — Hochtemperatur-WP empfohlen
                </p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Mit {city.normAussentemp}°C gehört {city.name} zu den kältesten deutschen Großstädten. Achten Sie auf WP-Modelle die bis −20°C effizient arbeiten (z.B. Viessmann Vitocal 250-A, Vaillant aroTHERM plus). Die KfW-Förderung gilt unabhängig vom Modell.
                </p>
              </div>
            </div>
          )}

          {/* Bundesland & Gebäudekontext */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Wärmepumpe in {city.bundesland} — {city.name} im Fokus</h2>
            <p className="text-[#4A6358] leading-relaxed">{bundeslandText}</p>
            <p className="text-[#4A6358] leading-relaxed">{gebaeudeText}</p>
          </div>

          {/* Energie & Wirtschaftlichkeit Deep-Dive */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Energiekosten-Analyse für {city.name}</h2>
            <p className="text-[#4A6358] leading-relaxed">{energieText}</p>
            {/* Vergleichstabelle */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1A4731] text-white">
                    {comparison.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row, ri) => (
                    <tr key={ri} className={ri === 0 ? 'bg-emerald-50 font-semibold' : 'bg-white'}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 border-b border-gray-100 text-gray-700">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kundenstimme */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <span key={i} className="text-[#D97706] text-lg">★</span>
              ))}
            </div>
            <blockquote className="text-gray-700 text-base italic leading-relaxed mb-4">
              „{testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1B5E37] font-bold text-sm">
                {testimonial.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{testimonial.author}</p>
                <p className="text-gray-500 text-xs">{testimonial.location} · Vermittelt über Wärmepumpenbegleiter.de</p>
              </div>
            </div>
          </div>

          {/* Verwandte Themen */}
          {crossLinks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Verwandte Themen für {city.name}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {crossLinks.map((link, i) => (
                  <a key={i} href={link.url} className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-[#1A4731] hover:shadow-sm transition-all group">
                    <p className="font-semibold text-[#1A4731] group-hover:underline text-sm mb-1">{link.anchor}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{link.context}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Saisonale Empfehlung */}
          <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#92400E] mb-1">Beste Installationszeit für {city.name}</p>
            <p className="text-[#78350F] text-sm leading-relaxed">{seasonalText}</p>
          </div>

          {/* FAQ */}
          <div>
            {faqs.length > 0 && (
              <div className="mb-6 p-5 bg-[#F2FAF5] border border-gray-200 rounded-2xl">
                <h3 className="font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
                <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
              </div>
            )}
            <h2 className="font-bold text-[#1C2B2B] text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md">
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

          {/* Regional links */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Förderung in der Region</h3>
              <div className="flex flex-wrap gap-2">
                {nearbyLinks.map(nl => (
                  <Link key={nl.city.slug} href={nl.url} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {nl.text}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw => kw && (
                  <Link key={kw.slug} href={'/' + kw.slug + '/' + city.slug} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {kw.keyword.replace('[Stadt]', city.name)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
        {/* END LEFT COLUMN */}

        {/* SIDEBAR */}
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #1A4731 0%, #0A1910 100%)' }}>
            <div className="p-6">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">{city.name} — Förderung</p>
              <p className="font-mono font-extrabold text-white text-4xl leading-none mb-0.5">{fmtEuro(foerd.zuschuss)}</p>
              <p className="text-white/40 text-xs mb-5">KfW-Zuschuss · nicht rückzahlbar</p>
              <div className="space-y-2 mb-5">
                {[
                  { l: 'Förderquote (' + foerd.gesamtSatz + '%)', v: foerd.gesamtSatz + '%', c: 'text-[#3DA16A]' },
                  { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-[#D97706]' },
                  { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-[#3DA16A]' },
                  { l: 'Amortisation', v: calc.amortisationJahre + ' Jahre', c: 'text-white' },
                  { l: 'GEG-Frist', v: gegFristFormatted, c: isUrgent ? 'text-amber-400' : 'text-white' },
                ].map(r => (
                  <div key={r.l} className="flex justify-between py-1.5 border-b border-white/8">
                    <span className="text-white/45 text-xs">{r.l}</span>
                    <span className={'font-mono font-bold text-xs ' + r.c}>{r.v}</span>
                  </div>
                ))}
              </div>
              <a href="#angebot" className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#D97706] text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors">
                Förderung berechnen <ArrowRight size={14} />
              </a>
              <p className="text-white/25 text-xs text-center mt-2">Kostenlos · Unverbindlich</p>
            </div>
          </div>
          <div id="angebot">
            <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            {['KfW-Antrag inklusive', 'LuL-registrierte Betriebe', 'Herstellerunabhängig', 'Lokal in ' + city.name, '100% kostenlos'].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-gray-200 last:border-0 text-xs text-[#4A6358]">
                <CheckCircle size={12} className="text-[#1A4731] shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
        {/* END SIDEBAR */}

      </div>
      {/* END MAIN CONTENT GRID */}

      {/* BELOW GRID: Förderung Detail */}
      <div className="max-w-3xl mx-auto px-6 pb-8">
        <h2 className="font-bold text-[#1C2B2B] text-xl mb-5">
          Wie beantrage ich die Förderung in {city.name} — Schritt für Schritt?
        </h2>
        <div className="prose prose-sm max-w-none text-[#4A6358] space-y-4 leading-relaxed">
          <p>
            <strong>Reihenfolge ist bindend:</strong> Der KfW-Antrag muss zwingend VOR der Auftragserteilung gestellt werden. Kein Nachantrag möglich. Ausnahme: Vertrag mit aufschiebender Bedingung (Förderklausel). Wir unterstützen bei der korrekten Vertragsgestaltung.
          </p>
          <p>
            <strong>Was Sie für den KfW-Antrag in {city.name} brauchen:</strong> (1) KfW-LuL-Nummer des Installateurbetriebs — prüfbar auf kdnr.kfw.de. (2) Bestätigung zum Antrag (BzA) vom Fachbetrieb. (3) Registrierung im KfW-Portal &quot;Meine KfW&quot;. (4) IBAN für Auszahlung. Bearbeitungszeit: meist 1–5 Werktage.
          </p>
          <p>
            <strong>Maximale Förderung für {city.name}:</strong> Brutto-Investition {fmtEuro(foerd.foerderfaehigeBasis)} × {foerd.gesamtSatz}% KfW = {fmtEuro(foerd.zuschuss)} Zuschuss. Eigenanteil: {fmtEuro(foerd.eigenanteil)}. Dazu §35a-Steuerbonus: bis 1.200 Euro im Installationsjahr. Gesamtersparnis: {fmtEuro(foerd.zuschuss + 1200)}.
          </p>
          <p>
            <strong>Verwendungsnachweis in {city.name}:</strong> Nach Installation einreichen: Rechnung mit allen Positionen, Inbetriebnahmeprotokoll (F-Gas-Pflicht), Nachweis Hydraulischer Abgleich (KfW-Pflicht), Wärmemengenzähler-Einbaubestätigung. Auszahlung: 4–8 Wochen.
          </p>
        </div>
      </div>

      {/* Aktualitätsblock 2026 */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-bold text-[#1C2B2B] text-xl mb-6">
          Was sich 2026 geändert hat — und was das für {city.name} bedeutet
        </h2>
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.gegReform}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.steuerAbsetz}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergänzungskredit</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.kfwKredit}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.finanzierung}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-12">
        <AuthorBox keywordSlug={keyword.slug} />
      </div>

    </div>
  </>
  );
}
