// components/programmatic/templates/WaermepumpeTemplate.tsx
// Waermepumpe Haupttemplate - vollstaendig, 1500+ Woerter unique content
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, CheckCircle, XCircle, ArrowRight, Thermometer, Zap, Euro, Leaf, Clock, Shield, TrendingDown, Home, Wrench, AlertTriangle, BarChart2 } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { getKlimazone, estimateJAZ } from '@/lib/city-utils';
import { calcBetriebskosten, calcFoerderung, fmtEuro, fmtKwh } from '@/lib/calculations';
import {cityHash, getActualityBlock, getBundeslandParagraph, getCaseStudy, getComparisonTable, getCrossKeywordLinks, getDynamicH2s, getEnergieParagraph, getEnhancedCTA, getFinanzierungsOptionen, getGEGCountdown, getGarantieInfo, getGebaeudeParagraph, getHeizkoerperCheck, getInlineLinkedParagraph, getIntroParagraphs, getKeywordDeepContent, getLaermschutzInfo, getLocalTestimonial, getLokaleTiefenanalyse, getNachbarschaftsvergleich, getNearbyLinkContext, getPVWPKombination, getROITimeline, getRotatingFAQs, getSeasonalAdvice, getSectionIntros, getSocialProofData, getStromtarifOptimierung, getUniqueLocalParagraph, getVideoPlaceholder, getWartungsInfo, getSectionTimestamps, getMethodologyExplainer} from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';

// Image pools
const HERO_IMGS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=85', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=85', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1920&q=85', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85', 'https://images.unsplash.com/photo-1416331108676-a22ccbe8c3f1?auto=format&fit=crop&w=1920&q=85'];
const SIDE_IMGS = ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=85', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=85', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=85', 'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=800&q=85'];
const STRIP_IMGS = ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1540188757-e5be54c62e4b?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1509391111902-de5d52b3f785?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80'];
const IMG_FOERDERUNG = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80';
const IMG_TEAM = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80';
const IMG_KOSTEN = 'https://images.unsplash.com/photo-1611117775350-ac3950990985?auto=format&fit=crop&w=800&q=80';
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) => arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

export default function WaermepumpeTemplate({ city, keyword, jaz, calc, foerd, h1, nearby }: CityPageRouterProps) {
  const heroImg = pickImg(HERO_IMGS, city.lat, city.lng, 0);
  const sideImg = pickImg(SIDE_IMGS, city.lat, city.lng, 1);
  const stripImg = pickImg(STRIP_IMGS, city.lat, city.lng, 2);
  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);
  const [introText] = getIntroParagraphs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const crossKeywords = keyword.crossLinks.map(slug => getKeywordBySlug(slug)).filter(k => k != null);
  const uniqueParagraph = getUniqueLocalParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const nearbyLinks = getNearbyLinkContext(city, nearby, keyword, jaz);
  const bundeslandText = getBundeslandParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const gebaeudeText = getGebaeudeParagraph(city, keyword, jaz, calc.wpKosten);
  const energieText = getEnergieParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const comparison = getComparisonTable(city, jaz, calc.wpKosten, calc.ersparnis);
  const testimonial = getLocalTestimonial(city, keyword);
  const seasonalText = getSeasonalAdvice(city);
  const crossLinks = getCrossKeywordLinks(city, keyword, KEYWORDS);
  const inlineLinkedParagraph = getInlineLinkedParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const lokaleTiefenanalyse = getLokaleTiefenanalyse(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const pvWP = getPVWPKombination(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const roiTimeline = getROITimeline(city, jaz, calc.wpKosten, calc.ersparnis, foerd.gesamtSatz);
  const nachbarVergleich = getNachbarschaftsvergleich(city, nearby, jaz, calc.wpKosten, calc.ersparnis);
  const heizkoerper = getHeizkoerperCheck(city, keyword);
  const stromtarif = getStromtarifOptimierung(city, jaz, calc.wpKosten);
  const deepContent = getKeywordDeepContent(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const finanzierung = getFinanzierungsOptionen(city, foerd.gesamtSatz);
  const wartung = getWartungsInfo(city, keyword);
  const garantie = getGarantieInfo(city);
  const caseStudy = getCaseStudy(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const gegCountdown = getGEGCountdown(city);
  const laermschutz = getLaermschutzInfo(city);
    const enhancedCta = getEnhancedCTA(city, keyword, calc.ersparnis, foerd.gesamtSatz);
    const videoData = getVideoPlaceholder(city, keyword);
    const socialProof = getSocialProofData(city, keyword);

  // E-E-A-T: section timestamps & methodology
  const extendedData = {
    sectionTimestamps: getSectionTimestamps(),
    methodologyExplainer: getMethodologyExplainer(city, keyword, jaz),
  };

  return (
    <div className="min-h-screen" style={{ background: '#F4F6F4' }}>

      {/* HERO */}
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: '90vh' }}>
        <Image src={heroImg} alt={'Wärmepumpe ' + city.name} className="absolute inset-0 w-full h-full object-cover" fill priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(4,14,8,0.98) 0%, rgba(4,14,8,0.95) 30%, rgba(4,14,8,0.88) 52%, rgba(4,14,8,0.50) 70%, rgba(4,14,8,0.08) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(4,14,8,0.60) 0%, rgba(4,14,8,0.30) 45%, transparent 68%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <nav className="flex items-center gap-2 text-sm mb-5 flex-wrap" style={{ color: 'rgba(255,255,255,0.90)' }}>
                <Link href="/" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.90)' }}>Startseite</Link>
                <span>›</span>
                <Link href={'/' + keyword.slug} className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.90)' }}>
                  {keyword.keyword.replace(' [Stadt]', '')}
                </Link>
                <span>›</span>
                <span style={{ color: 'rgba(255,255,255,0.95)' }}>{city.name}</span>
              </nav>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white" style={{ background: 'rgba(76,175,125,0.22)', border: '1px solid rgba(76,175,125,0.50)' }}>
                  <span className="w-2 h-2 rounded-full bg-[#4CAF7D] animate-pulse" />
                  {city.bundesland} · GEG 2026
                </span>
                {city.einwohner >= 100000 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold text-white" style={{ background: 'rgba(217,119,6,0.85)', border: '1px solid rgba(217,119,6,0.6)' }}>
                    ⏰ GEG-Frist: {city.gegFrist.split('-').reverse().join('.')}
                  </span>
                )}
              </div>
              <h1 className="font-extrabold text-white leading-tight mb-5 text-4xl sm:text-5xl tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
                {h1}
              </h1>
              <div className="flex flex-wrap gap-2 mt-3 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-[#D97706]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  ab {fmtEuro(foerd.eigenanteil)} Eigenanteil
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  {fmtEuro(calc.ersparnis)}/J. sparen
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xl mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
                {city.name}: {city.strompreis} ct/kWh Strom · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.normAussentemp}°C Normausentemp. · {city.fernwaermeQuote}% Fernwaerme
              </p>
              <p className="text-lg max-w-xl mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,1.0)', lineHeight: '1.7' }}>
                {introText}
              </p>
              <div className="flex flex-wrap gap-3 mb-9">
                <a href="/rechner" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1B5E37] text-white font-bold rounded-xl hover:bg-[#154d2c] transition-all shadow-lg text-base">
                  Kosten berechnen <ArrowRight size={18} />
                </a>
                <a href="#foerderung" className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl text-white transition-all text-base" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.45)' }}>
                  Förderung prüfen
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Thermometer size={16} />, val: 'JAZ ' + jaz, lbl: 'Jahresarbeitszahl' },
                  { icon: <Euro size={16} />, val: fmtEuro(calc.ersparnis), lbl: 'Ersparnis/Jahr' },
                  { icon: <Zap size={16} />, val: city.strompreis + ' ct', lbl: 'Strompreis lokal' },
                  { icon: <Leaf size={16} />, val: calc.co2Ersparnis + ' t', lbl: 'CO2 gespart/J.' },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl px-3 py-3 border" style={{ background: 'rgba(5,18,10,0.72)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.18)' }}>
                    <div className="flex items-center gap-1.5 mb-1" style={{ color: '#4CAF7D' }}>{s.icon}
                      <span className="font-mono font-bold text-lg" style={{ color: 'white' }}>{s.val}</span>
                    </div>
                    <p className="text-white/80 text-xs">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <div className="w-full max-w-[420px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                <div className="relative h-52">
                  <Image src={sideImg} alt={'Wärmepumpe ' + city.name} className="w-full h-full object-cover" fill priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-[#0A1910]/15" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className="bg-white/95 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-500 mb-0.5">Jährl. Ersparnis</p>
                      <p className="font-mono font-bold text-[#D97706] text-lg">{fmtEuro(calc.ersparnis)}</p>
                    </div>
                    <div className="bg-white/95 rounded-lg px-3 py-2 text-right">
                      <p className="text-xs text-gray-500 mb-0.5">KfW-Förderung</p>
                      <p className="font-mono font-bold text-[#1B5E37] text-lg">bis 70%</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {['Herstellerunabhaengig', 'HWK-geprüft', 'KfW-Begleitung'].map(b => (
                      <span key={b} className="bg-[#E8F5EE] text-[#1B5E37] text-xs font-semibold px-2.5 py-1 rounded-full">{b}</span>
                    ))}
                  </div>
                  <a href="/rechner" className="block w-full text-center py-3 bg-[#1B5E37] text-white font-bold rounded-xl hover:bg-[#154d2c] transition-colors text-sm">
                    Kostenlos Angebot anfordern →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">Datenquellen</span>
            {['KfW BEG', 'BAFA', 'BWP', 'Fraunhofer ISE', 'DWD', 'Verbraucherzentrale', 'BDEW'].map(s => (
              <span key={s} className="text-gray-500 font-semibold text-sm hover:text-[#1A4731] transition-colors cursor-default">{s}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {['DSGVO-konform', 'HWK-geprüft', 'Kostenloser Service'].map(b => (
              <span key={b} className="text-xs font-semibold text-[#1A4731] bg-[#E8F5EE] px-3 py-1.5 rounded-full hidden sm:inline">✓ {b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* BREADCRUMB NAV */}
      <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-6 pt-4 pb-2">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-[#7A9E8E]" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a itemProp="item" href="/"><span itemProp="name">Start</span></a>
            <meta itemProp="position" content="1" />
          </li>
          <li className="mx-1">›</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a itemProp="item" href={`/${keyword.slug}`} className="hover:text-[#1A4731]"><span itemProp="name">{keyword.keyword.replace(' [Stadt]', '')}</span></a>
            <meta itemProp="position" content="2" />
          </li>
          <li className="mx-1">›</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">{city.name}</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">

          {/* LEFT */}
          <div className="space-y-14">

            {/* Featured Snippet */}
            <div className="bg-white rounded-2xl border border-gray-200 p-7 border-l-4 border-l-[#1B5E37]">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {fillTemplate(keyword.featuredSnippetQuestions[0] || 'Was kostet eine Wärmepumpe in {stadt}?', city, jaz)}
              </h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Eine <strong>Luft-Wasser-Wärmepumpe</strong> kostet in {city.name} inklusive Installation zwischen{' '}
                <strong>€18.000 und €28.000</strong> brutto. Nach KfW-Förderung (typisch 50–55%) reduziert sich der
                Eigenanteil auf <strong>{fmtEuro(foerd.eigenanteil)}</strong>. Die jaehrliche Ersparnis gegenueber
                Erdgas betraegt bei einem 120 m² EFH ca.{' '}
                <strong>{fmtEuro(calc.ersparnis)} pro Jahr</strong> — bei {city.strompreis} ct/kWh Strompreis und{' '}
                JAZ {jaz} (Jahresmitteltemperatur {city.avgTemp}°C in {city.name}).
              </p>
              {city.fernwaermeQuote >= 50 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 leading-relaxed">
                  <strong>Hinweis für {city.name}:</strong> {city.fernwaermeQuote}% der Gebäude in {city.name} sind ans Fernwärmenetz angeschlossen.
                  Für Eigentümer von Einfamilienhäusern ohne Fernwärmeanschluss ist die Wärmepumpe die wirtschaftlichste und förderfähige Heizalternative.
                </div>
              )}
            </div>

            {/* Klimadaten */}
            <section>
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Klimadaten {city.name}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{h2s.klimadaten}</h2>
              <p className="text-[#4A6358] text-base leading-relaxed mb-4">{si.klimadaten}</p>
              <div className="relative rounded-2xl overflow-hidden mb-6 h-48">
                <Image src={pickImg(STRIP_IMGS, city.lat, city.lng, 10)} alt={'Klimadaten ' + city.name} className="w-full h-full object-cover" fill loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,25,16,0.78) 0%, rgba(10,25,16,0.3) 100%)' }} />
                <div className="absolute inset-0 flex items-center px-7 gap-8">
                  {[
                    { label: city.heizgradtage.toLocaleString('de-DE'), sub: 'Heizgradtage/Jahr' },
                    { label: city.normAussentemp + '°C', sub: 'Normaußentemperatur' },
                    { label: 'JAZ ' + jaz, sub: 'Erreichbare Jahresarbeitszahl' },
                    { label: city.avgTemp + '°C', sub: 'Jahresmitteltemperatur' },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="font-mono font-bold text-white text-xl leading-none">{s.label}</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                {[
                  { icon: <Thermometer size={20} className="text-[#1B5E37]" />, title: 'Jahresarbeitszahl (JAZ)', val: jaz.toString(), sub: 'Bei ' + city.avgTemp + '°C in ' + city.name, note: 'Aus 1 kWh Strom werden ' + jaz + ' kWh Waerme' },
                  { icon: <BarChart2 size={20} className="text-[#D97706]" />, title: 'Heizgradtage', val: city.heizgradtage.toLocaleString('de-DE') + ' Kd/a', sub: 'Waermebedarf des Standorts', note: 'Quelle: IWU Gradtagzahlen DE' },
                  { icon: <Zap size={20} className="text-[#1B5E37]" />, title: 'Regionaler Strompreis', val: city.strompreis + ' ct/kWh', sub: 'WP-Sondertarif ' + city.name, note: 'Quelle: BDEW/Verivox 2026' },
                  { icon: <TrendingDown size={20} className="text-[#D97706]" />, title: 'Gaspreis aktuell', val: city.gaspreis + ' ct/kWh', sub: 'inkl. CO2-Abgabe 2026', note: 'Steigt bis 2030 durch ETS2' },
                ].map((c, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">{c.icon}</div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">{c.title}</p>
                      <p className="font-mono font-bold text-gray-900 text-xl leading-none mb-1">{c.val}</p>
                      <p className="text-gray-500 text-xs">{c.sub}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">
                {city.name} ({city.bundesland}) hat mit{' '}
                <strong>{city.heizgradtage} Heizgradtagen pro Jahr</strong> (Bundesdurchschnitt: ca. 3.200 Kd/a) einen{' '}
                {city.heizgradtage > 3200 ? 'überdurchschnittlichen' : 'unterdurchschnittlichen'} Wärmebedarf.
                Eine Luft-Wasser-Wärmepumpe erreicht hier eine <strong>JAZ von {jaz}</strong>.
              </p>
            </section>

            {/* CO2 Strip */}
            <div className="relative overflow-hidden rounded-2xl">
              <Image src={stripImg} alt="Waermepumpe Umwelt" className="w-full h-64 object-cover" fill loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,60,30,0.90) 0%, rgba(26,71,49,0.82) 100%)' }} />
              <div className="absolute inset-0 flex items-center px-8 gap-12">
                {[
                  { icon: '🌿', val: calc.co2Ersparnis + ' t', lbl: 'CO2 gespart pro Jahr' },
                  { icon: '💰', val: fmtEuro(calc.ersparnis), lbl: 'Ersparnis pro Jahr' },
                  { icon: '⚡', val: fmtKwh(calc.stromverbrauch), lbl: 'WP-Stromverbrauch/Jahr' },
                  { icon: '🔧', val: '25 Jahre', lbl: 'Lebensdauer WP' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl mb-1">{s.icon}</div>
                    <p className="font-mono font-bold text-white text-xl">{s.val}</p>
                    <p className="text-white/60 text-xs">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kostenrechner */}
            <section>
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Kostenrechner
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {['Kosten berechnen für Ihr Haus in ' + city.name, 'Was kostet die WP konkret in ' + city.name + '?', 'WP-Kostenrechner für ' + city.name, 'Stadtspezifischer Rechner für ' + city.name][cityHash(city, 4, 150)]}
              </h2>
              <WPKostenRechner city={city} />
            </section>

            {/* KfW Foerderung */}
            <section id="foerderung">
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                KfW-Programm 458
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{h2s.foerderung}</h2>
              <p className="text-[#4A6358] text-base leading-relaxed mb-4">{si.foerderung}</p>
              <div className="relative rounded-xl overflow-hidden mb-5 h-36">
                <Image src={IMG_FOERDERUNG} alt="KfW Foerderung beantragen" className="w-full h-full object-cover" fill loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,25,16,0.85) 0%, rgba(10,25,16,0.45) 100%)' }} />
                <div className="absolute inset-0 flex items-center px-6 gap-8">
                  {['1. KfW-Antrag', '2. Genehmigung', '3. Installation', '4. Auszahlung'].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#4CAF7D] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="text-white text-xs font-medium hidden sm:block">{step.slice(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Die KfW-Bundesfoerderung gilt ueberall in Deutschland, also auch in {city.name}. Der Antrag muss{' '}
                <strong className="text-red-600">zwingend vor Baubeginn</strong> gestellt werden.
                {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') && (
                  <span> In {city.bundesland} gibt es zusätzlich das Programm{' '}
                    <strong>{city.bundeslandFoerderung}</strong>
                    {city.bundeslandFoerderungBetrag ? ' (' + city.bundeslandFoerderungBetrag + ')' : ''}.
                  </span>
                )}
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { lbl: 'Grundförderung', pct: 30, color: '#1B5E37' },
                  { lbl: 'Klima-Speed-Bonus (fossile Heizung → WP)', pct: 20, color: '#D97706' },
                  { lbl: 'Einkommens-Bonus (unter 40.000 Euro netto/J.)', pct: 30, color: '#F59E0B' },
                  { lbl: 'Natuerliches Kältemittel R290', pct: 5, color: '#2A7D4F' },
                ].map((b, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-gray-700">{b.lbl}</span>
                      <span className="font-mono font-bold text-sm" style={{ color: b.color }}>+{b.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div className="h-full rounded-full transition-all" style={{ backgroundColor: b.color, width: (b.pct / 70 * 100) + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#E8F5EE] rounded-xl p-4 flex items-center justify-between">
                <span className="font-bold text-[#1B5E37] text-sm">Gesamt moeglich</span>
                <span className="font-mono font-extrabold text-[#1B5E37] text-2xl">bis 70% = 21.000 Euro</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Quelle: KfW BEG, Stand März 2026</p>
            </section>

            {/* Einwaende */}
            <section>
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Häufige Bedenken
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {['Ehrliche Antworten auf Ihre Fragen zu ' + city.name, 'Was Eigentümer in ' + city.name + ' wirklich wissen wollen', 'Häufige Bedenken in ' + city.name, 'Offene Fragen zur WP in ' + city.name][cityHash(city, 4, 151)]}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { q: 'Funktioniert WP im Altbau in ' + city.name + '?', a: 'Ja — in den meisten Altbauten. Moderne Geraete arbeiten bis 70°C Vorlauf und sind mit normalen Heizkoerpern kompatibel.', badge: 'Kein Problem', badgeColor: 'bg-[#E8F5EE] text-[#1B5E37]', icon: <Home size={22} className="text-[#1B5E37]" /> },
                  { q: 'Ist eine WP in ' + city.name + ' zu laut?', a: 'Moderne Luft-WP erzeugen 45-55 dB auf 1 Meter. Mit korrekter Aufstellung (Abstand zur Grenze mind. 3m) ist Laerm kein Problem.', badge: 'Kein Problem', badgeColor: 'bg-[#E8F5EE] text-[#1B5E37]', icon: <Shield size={22} className="text-[#1B5E37]" /> },
                  { q: 'Lohnt WP ohne PV in ' + city.name + '?', a: 'Ja. Auch ohne PV spart eine WP in ' + city.name + ' bei JAZ ' + jaz + ' rund ' + fmtEuro(calc.ersparnis) + '/Jahr. Mit PV sinken die Kosten um weitere 30-40%.', badge: 'Kein Problem', badgeColor: 'bg-[#E8F5EE] text-[#1B5E37]', icon: <Zap size={22} className="text-[#1B5E37]" /> },
                  { q: 'Gibt es versteckte Kosten in ' + city.name + '?', a: 'Haeufig unterschaetzt: hydraulischer Abgleich (500-1.500 Euro), Fundament (300-800 Euro), Elektroinstallation (500-1.500 Euro).', badge: 'Wichtig', badgeColor: 'bg-amber-100 text-amber-800', icon: <AlertTriangle size={22} className="text-amber-600" /> },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.q}</h3>
                        <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ' + item.badgeColor}>{item.badge}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* WP Typen */}
            <section>
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Welche WP passt zu mir?
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{h2s.typen}</h2>
              <p className="text-[#4A6358] text-base leading-relaxed mb-5">{si.typen}</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { type: 'Luft-Wasser', share: '92%', jaz: estimateJAZ(city, 'luft').toString(), install: '3.000-6.000 Euro', pros: ['Keine Erdarbeiten', 'Auch im Altbau', 'Montage 1-2 Tage'], highlight: true },
                  { type: 'Sole-Wasser', share: '6%', jaz: estimateJAZ(city, 'sole').toString(), install: '6.000-12.000 Euro', pros: ['+5% KfW-Bonus', 'Konstante Effizienz', 'Leiser Betrieb'], highlight: false },
                  { type: 'Wasser-Wasser', share: '2%', jaz: estimateJAZ(city, 'wasser').toString(), install: '8.000-15.000 Euro', pros: ['+5% KfW-Bonus', 'Höchste JAZ', 'Niedrigste Betriebskosten'], highlight: false },
                ].map((t, i) => (
                  <div key={i} className={'bg-white rounded-xl overflow-hidden border-2 transition-all hover:-translate-y-1 hover:shadow-lg ' + (t.highlight ? 'border-[#1B5E37]' : 'border-gray-200')}>
                    {t.highlight && <div className="bg-[#1B5E37] px-4 py-2 text-xs font-bold text-white uppercase tracking-wide text-center">Meistgewaehlt</div>}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{t.type}</h3>
                        <span className="bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold px-2 py-0.5 rounded-full">{t.share}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[{ l: 'JAZ in ' + city.name, v: t.jaz }, { l: 'Installation', v: t.install }].map(s => (
                          <div key={s.l} className="bg-gray-50 rounded-lg p-2.5">
                            <p className="text-xs text-gray-400 font-semibold mb-0.5">{s.l}</p>
                            <p className="font-mono font-bold text-gray-800 text-sm">{s.v}</p>
                          </div>
                        ))}
                      </div>
                      {t.pros.map(p => (
                        <div key={p} className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
                          <CheckCircle size={14} className="text-[#1B5E37] flex-shrink-0" />{p}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experten-Box */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-5">
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#E8F5EE] relative">
                <Image src={IMG_TEAM} alt="Bastian Saupe" className="object-cover object-top" fill />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-bold text-gray-900">Bastian Saupe</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Gründer &amp; Geschäftsführer · Webflott.de</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  Alle Inhalte basieren auf aktuellen Klimadaten des DWD fuer {city.name}, KfW-Konditionen Stand März 2026 und BWP-Feldtestdaten zur Jahresarbeitszahl.
                  Die stadtspezifischen Energiepreise stammen aus der BDEW-Regionalanalyse.
                </p>
                <p className="text-xs text-gray-400 mt-2">Zuletzt geprueft: März 2026 · Quellen: DWD, KfW, BWP, BDEW</p>
              </div>
            </div>

            {/* Bundesland & Gebäudekontext */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Wärmepumpe in {city.bundesland} — {city.name} im Fokus</h2>
              <p className="text-[#4A6358] leading-relaxed">{bundeslandText}</p>
              <p className="text-[#4A6358] leading-relaxed">{gebaeudeText}</p>
            </section>

            {/* Energie & Wirtschaftlichkeit Deep-Dive */}
            <section className="space-y-4">
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
            </section>

            {/* Kundenstimme */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
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
            </section>

            {/* Verwandte Themen */}
            {crossLinks.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Verwandte Themen für {city.name}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {crossLinks.map((link, i) => (
                    <a key={i} href={link.url} className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-[#1A4731] hover:shadow-sm transition-all group">
                      <p className="font-semibold text-[#1A4731] group-hover:underline text-sm mb-1">{link.anchor}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{link.context}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Inline verlinkte Absätze */}
            {inlineLinkedParagraph && (
              <div className="prose prose-sm max-w-none">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Weiterführende Informationen für {city.name}</h2>
                <p className="text-[#4A6358] text-base leading-relaxed [&_a]:text-[#1B5E37] [&_a]:font-semibold [&_a]:underline [&_a]:decoration-[#1B5E37]/30 hover:[&_a]:decoration-[#1B5E37]"
                  dangerouslySetInnerHTML={{ __html: inlineLinkedParagraph }} />
              </div>
            )}

            {/* Lokale Tiefenanalyse */}
            <div className="bg-[#F2FAF5] rounded-2xl p-7 border border-[#D1E7DD]">
              <h2 className="text-xl font-bold text-[#1A4731] mb-3">Lokale Analyse: Wärmepumpe in {city.name}</h2>
              <p className="text-[#4A6358] text-base leading-relaxed">{lokaleTiefenanalyse}</p>
            </div>

            {/* Saisonale Empfehlung */}
            <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-xl p-5">
              <p className="text-sm font-semibold text-[#92400E] mb-1">Beste Installationszeit für {city.name}</p>
              <p className="text-[#78350F] text-sm leading-relaxed">{seasonalText}</p>
            </div>

            {/* Keyword-spezifischer Tiefeninhalt */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-[#1A4731]">{deepContent.heading}</h2>
            {deepContent.paragraphs.map((p, i) => (
              <p key={i} className="text-[#4A6358] text-base leading-relaxed">{p}</p>
            ))}
          </div>

          {/* PV + Wärmepumpe Kombination */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 space-y-5">
            <h2 className="text-xl font-bold text-[#1A4731]">{pvWP.title}</h2>
            {pvWP.paragraphs.map((p, i) => (
              <p key={i} className="text-[#4A6358] text-sm leading-relaxed">{p}</p>
            ))}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {pvWP.stats.map((s, i) => (
                <div key={i} className="bg-[#F2FAF5] rounded-lg p-3 text-center">
                  <p className="text-[#1A4731] font-bold text-lg">{s.value}</p>
                  <p className="text-[#4A6358] text-xs font-semibold">{s.label}</p>
                  <p className="text-gray-400 text-xs">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Heizkörper-Kompatibilitäts-Check */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1A4731]">{heizkoerper.title}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed">{heizkoerper.paragraph}</p>
            <div className="grid gap-2">
              {heizkoerper.checklist.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                  item.status === 'ok' ? 'bg-green-50 border-green-200' :
                  item.status === 'pruefen' ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.status === 'ok' ? 'bg-green-100 text-green-700' :
                    item.status === 'pruefen' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'ok' ? '✓' : item.status === 'pruefen' ? '?' : '✗'}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.item}</p>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nachbarschaftsvergleich */}
          {nearby.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#1A4731]">Regionaler Vergleich: {city.name} vs. Umland</h2>
              <p className="text-[#4A6358] text-base leading-relaxed">{nachbarVergleich.paragraph}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1A4731] text-white">
                      {nachbarVergleich.table.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left text-xs font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nachbarVergleich.table.rows.map((row, i) => (
                      <tr key={i} className={i === 0 ? 'bg-[#F2FAF5] font-semibold' : i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-xs text-gray-700 border-b border-gray-100">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stromtarif-Optimierung */}
          <div className="bg-gradient-to-br from-[#1A4731] to-[#0A1910] rounded-2xl p-7 text-white space-y-4">
            <h2 className="text-xl font-bold">Stromkosten senken: WP-Tarife für {city.name}</h2>
            <p className="text-white/80 text-sm leading-relaxed">{stromtarif.paragraph}</p>
            <div className="space-y-2 mt-3">
              {stromtarif.tips.map((t, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2.5">
                  <span className="text-white/90 text-xs">{t.tip}</span>
                  <span className="text-[#D97706] font-bold text-xs whitespace-nowrap ml-3">{t.ersparnis}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ROI-Timeline */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1A4731]">Wirtschaftlichkeit über 20 Jahre in {city.name}</h2>
            <div className="space-y-2">
              {roiTimeline.filter(r => r.highlight).map((r, i) => (
                <div key={i} className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 px-4 py-3">
                  <div className="w-14 text-center">
                    <p className="text-[#1A4731] font-bold text-sm">{r.label}</p>
                    <p className="text-gray-400 text-xs">{r.year}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{r.highlight}</p>
                    <p className="text-xs text-gray-500">
                      WP kumuliert: {r.wpKumuliert.toLocaleString('de-DE')} € · Gas kumuliert: {r.gasKumuliert.toLocaleString('de-DE')} €
                    </p>
                  </div>
                  <div className={`text-right ${r.differenz > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    <p className="font-bold text-sm">{r.differenz > 0 ? '+' : ''}{r.differenz.toLocaleString('de-DE')} €</p>
                    <p className="text-xs">Vorteil WP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Quellenangaben & Datengrundlage */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Quellenangaben & Datengrundlage</h3>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500">
                <span>• Strompreis {city.name}: Verivox/CHECK24, Stand 03/2026</span>
                <span>• Heizgradtage: Deutscher Wetterdienst (DWD)</span>
                <span>• KfW-Förderung: BEG Programm 458, Stand 01/2026</span>
                <span>• JAZ-Berechnung: VDI 4650 Blatt 1</span>
                <span>• GEG-Fristen: §71 GEG i.d.F. vom 01.01.2024</span>
                <span>• CO₂-Preis: BEHG §10, Brennstoffemissionshandel</span>
              </div>
            </div>

            {/* ── Methodik & Datenquellen ── */}
            {extendedData?.methodologyExplainer && (
              <section className="bg-gradient-to-br from-[#F0FDF4] to-white rounded-2xl border border-[#BBF7D0] p-6 lg:p-8 mb-8">
                <h2 id="methodik" className="font-heading font-bold text-[#1C2B2B] text-xl lg:text-2xl mb-4">
                  {extendedData.methodologyExplainer.heading}
                </h2>
                {extendedData.methodologyExplainer.paragraphs.map((p, i) => (
                  <p key={i} className="text-[#4A6358] text-sm leading-relaxed mb-3">{p}</p>
                ))}
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {extendedData.methodologyExplainer.standards.map((s, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-semibold text-[#1C2B2B] text-xs mb-1">{s.name}</div>
                      <div className="text-[#7A9E8E] text-xs">{s.description}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[#7A9E8E] text-xs mt-4 italic">{extendedData.methodologyExplainer.disclaimer}</p>
              </section>
            )}

            {/* FAQ */}
            <section>
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">FAQ</span>
              {faqs.length > 0 && (
                <div className="mb-6 p-5 bg-[#F2FAF5] border border-gray-200 rounded-2xl">
                  <h3 className="font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
                  <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
                </div>
              )}
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{h2s.faq}</h2>
              <FAQAccordion faqs={faqs} />
            </section>

            {/* Unique lokaler Absatz — macht jede Seite inhaltlich einzigartig */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Wärmepumpe in {city.name} — lokale Besonderheiten</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{uniqueParagraph}</p>
            </section>

            {/* Nachbarstaedte — mit kontextualisierten Ankertexten */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wärmepumpe in der Region {city.bundesland}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {nearbyLinks.map(nl => (
                  <Link key={nl.city.slug} href={nl.url} className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl text-sm font-medium border border-gray-200 hover:border-[#1B5E37] hover:text-[#1B5E37] transition-all group">
                    <span className="w-2 h-2 rounded-full bg-[#4CAF7D] shrink-0 group-hover:scale-125 transition-transform" />
                    {nl.text}
                  </Link>
                ))}
              </div>
            </section>

            {/* Cross-Links */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Weitere Themen für {city.name}</h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw => kw && (
                  <Link key={kw.slug} href={'/' + kw.slug + '/' + city.slug} className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-[#1B5E37] hover:text-[#1B5E37] transition-colors">
                    {kw.keyword.replace('[Stadt]', city.name)}
                  </Link>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT - Sticky CTA */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bg-[#1B5E37] rounded-2xl p-6 shadow-2xl shadow-[#1B5E37]/20">
                <p className="text-[#4CAF7D] text-xs font-bold uppercase tracking-wider mb-1">KOSTENLOSER SERVICE</p>
                <p className="text-white font-bold text-xl mb-1">Angebot für {city.name}</p>
                <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.78)' }}>Bis zu 3 geprüfte lokale Betriebe · 48h</p>
                <div className="space-y-1.5 mb-5">
                  {[
                    { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-amber-300' },
                    { l: 'KfW-Zuschuss', v: fmtEuro(foerd.zuschuss), c: 'text-[#4CAF7D]' },
                    { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-white font-bold' },
                    { l: 'Amortisation', v: calc.amortisationJahre + ' Jahre', c: 'text-amber-300' },
                  ].map(r => (
                    <div key={r.l} className="flex justify-between text-sm border-b border-white/10 pb-1.5">
                      <span style={{ color: 'rgba(255,255,255,0.80)' }}>{r.l}</span>
                      <span className={'font-mono font-bold ' + r.c}>{r.v}</span>
                    </div>
                  ))}
                </div>
                <a href="/rechner" className="block w-full text-center py-3.5 bg-[#D97706] text-white font-bold rounded-xl hover:bg-[#b45309] transition-colors mb-2.5 text-sm">
                  Kostenloses Angebot anfordern →
                </a>
                <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>Kostenlos · Unverbindlich · Kein Spam</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Warum Waermepumpenbegleiter?</p>
                {['Herstellerunabhängig seit 2025', 'Alle Betriebe HWK-geprüft', 'KfW-Antrag-Begleitung inklusive', 'Lokale Meisterbetriebe in ' + city.name, '100% kostenlos für Hausbesitzer'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm text-gray-700 py-1.5 border-b border-gray-100 last:border-0">
                    <CheckCircle size={14} className="text-[#1B5E37] flex-shrink-0" />{t}
                  </div>
                ))}
              </div>
              {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.toLowerCase().includes('ausgesetzt') && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{city.bundesland} Förderung</p>
                  <p className="font-semibold text-gray-800 text-sm mb-1">{city.bundeslandFoerderung}</p>
                  {city.bundeslandFoerderungBetrag && <p className="text-[#1B5E37] text-sm font-bold">{city.bundeslandFoerderungBetrag}</p>}
                  {city.bundeslandFoerderungUrl && (
                    <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1B5E37] hover:underline mt-1 block">Mehr erfahren →</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AKTUALITAETSBLOCK 2026 */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="relative rounded-2xl overflow-hidden mb-8 h-44">
          <Image src={pickImg(STRIP_IMGS, city.lat, city.lng, 30)} alt="Wärmepumpe 2026" className="w-full h-full object-cover" fill loading="lazy" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,25,16,0.92) 0%, rgba(10,25,16,0.55) 100%)' }} />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3" style={{ background: 'rgba(76,175,125,0.25)', color: '#4CAF7D', border: '1px solid rgba(76,175,125,0.4)' }}>
                Aktuell · 2026
              </span>
              <h2 className="text-white text-xl font-bold leading-tight">Was sich 2026 geändert hat für {city.name}</h2>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.gegReform}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Neue Laermvorschrift ab 01.01.2026</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.laerm10db}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.steuerAbsetz}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergaenzungskredit</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.kfwKredit}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Wartungs- &amp; Langzeitkosten</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.wartungskosten}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.finanzierung}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

// WP cost calculator — defined after main component
function WPKostenRechner({ city }: { city: CityPageRouterProps['city'] }) {
  const [flaeche, setFlaeche] = useState(120);
  const [baujahr, setBaujahr] = useState('1979_1994');
  const [heizung, setHeizung] = useState('erdgas');
  const [wpTyp, setWpTyp] = useState('luft');
  const [vorlauf, setVorlauf] = useState(35);
  const [selfOcc, setSelfOcc] = useState(true);
  const [fossil, setFossil] = useState(true);
  const [lowInc, setLowInc] = useState(false);
  const [r290, setR290] = useState(false);

  const jaz = estimateJAZ(city, wpTyp as any, vorlauf);
  const calc = calcBetriebskosten(flaeche, baujahr, heizung as any, { strompreisCtKwh: city.strompreis, gaspreisCtKwh: city.gaspreis, avgTemp: city.avgTemp, vorlaufTemp: vorlauf, wpTyp: wpTyp as any });
  const foerd = calcFoerderung({ investitionskosten: 25000, isSelfOccupied: selfOcc, hasOldFossilHeating: fossil, einkommenUnter40k: lowInc, hasNaturalRefrigerant: r290, usesErdwaermeOrWasser: wpTyp !== 'luft' });
  const gewinnNach20 = Math.round(calc.ersparnis * 20 - foerd.eigenanteil);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="relative h-36 overflow-hidden">
        <Image src={IMG_KOSTEN} alt="WP Kostenrechner" className="w-full h-full object-cover" fill priority />
        <div className="absolute inset-0 bg-[#1B5E37]/85" />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <p className="text-[#4CAF7D] text-xs font-bold uppercase tracking-wider mb-1">KOSTENLOSER RECHNER</p>
            <p className="text-white font-extrabold text-2xl leading-tight">Was kostet die Wärmepumpe wirklich in {city.name}?</p>
            <p className="text-white/80 text-sm">{city.strompreis} ct/kWh · {city.heizgradtage} Heizgradtage · JAZ {jaz} · Stand März 2026</p>
          </div>
        </div>
      </div>
      <div className="p-8 grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-5">
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-1">Wohnfläche: <span className="text-[#1B5E37] font-bold">{flaeche} m²</span></p>
            <input type="range" min={50} max={300} step={10} value={flaeche} onChange={e => setFlaeche(+e.target.value)} className="w-full accent-[#1B5E37]" />
            <div className="flex justify-between text-xs text-gray-300 mt-1"><span>50 m²</span><span className="text-[#1B5E37]">Ø 120 m²</span><span>300 m²</span></div>
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-2">Baujahr</p>
            <div className="grid grid-cols-4 gap-2">
              {[['vor_1978', 'vor 1978', '~215 kWh'], ['1979_1994', '1979-1994', '~148 kWh'], ['1995_2009', '1995-2009', '~101 kWh'], ['2010_plus', 'ab 2010', '~72 kWh']].map(([v, l, sub]) => (
                <button key={v} onClick={() => setBaujahr(v)} className={'p-2.5 rounded-xl border-2 text-center transition-all ' + (baujahr === v ? 'border-[#1B5E37] bg-[#E8F5EE]' : 'border-gray-200 hover:border-gray-300')}>
                  <p className={'font-bold text-xs ' + (baujahr === v ? 'text-[#1B5E37]' : 'text-gray-700')}>{l}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-2">Aktuelle Heizung</p>
            <div className="grid grid-cols-3 gap-2">
              {[['erdgas', 'Erdgas', city.gaspreis + ' ct/kWh'], ['heizoel', 'Heizoel', 'ca. 11 ct/kWh'], ['nachtspeicher', 'Nachtspeicher', 'ca. 28 ct/kWh']].map(([v, l, sub]) => (
                <button key={v} onClick={() => setHeizung(v)} className={'p-3 rounded-xl border-2 text-center transition-all ' + (heizung === v ? 'border-[#D97706] bg-amber-50' : 'border-gray-200')}>
                  <p className={'font-bold text-xs ' + (heizung === v ? 'text-[#D97706]' : 'text-gray-700')}>{l}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-2">Wärmepumpentyp</p>
            <div className="grid grid-cols-3 gap-2">
              {[['luft', 'Luft-Wasser', '92% Marktanteil'], ['sole', 'Sole-Wasser', '+5% KfW-Bonus'], ['wasser', 'Wasser-Wasser', '+5% KfW-Bonus']].map(([v, l, sub]) => (
                <button key={v} onClick={() => setWpTyp(v)} className={'p-3 rounded-xl border-2 text-center transition-all ' + (wpTyp === v ? 'border-[#1B5E37] bg-[#E8F5EE]' : 'border-gray-200')}>
                  <p className={'font-bold text-xs ' + (wpTyp === v ? 'text-[#1B5E37]' : 'text-gray-700')}>{l}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-1">Vorlauftemperatur: <span className="text-[#1B5E37] font-bold">{vorlauf}°C</span></p>
            <input type="range" min={30} max={70} step={5} value={vorlauf} onChange={e => setVorlauf(+e.target.value)} className="w-full accent-[#1B5E37]" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-700 text-sm">Ihre Fördersituation</p>
            {[
              { s: selfOcc, f: setSelfOcc, l: 'Eigennutzer', sub: 'Grundvoraussetzung fuer KfW-Bonus' },
              { s: fossil, f: setFossil, l: 'Fossile Heizung ersetzen', sub: '+20% Klima-Speed-Bonus' },
              { s: lowInc, f: setLowInc, l: 'Einkommen unter 40.000 €/J', sub: '+30% Einkommens-Bonus' },
              { s: r290, f: setR290, l: 'R290 Kältemittel', sub: '+5% Bonus' },
            ].map((o, i) => (
              <button key={i} onClick={() => o.f(!o.s)} className={'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ' + (o.s ? 'border-[#1B5E37] bg-[#E8F5EE]' : 'border-gray-200')}>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-800 text-sm">{o.l}</p>
                  <p className="text-gray-400 text-xs">{o.sub}</p>
                </div>
                <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ' + (o.s ? 'bg-[#1B5E37] border-[#1B5E37]' : 'border-gray-300')}>
                  {o.s && <span className="text-white text-xs">✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-[#1B5E37] rounded-2xl p-5">
            <p className="text-[#4CAF7D] text-xs font-bold uppercase tracking-wider mb-3">ERGEBNIS FÜR {city.name.toUpperCase()}</p>
            <div className="space-y-1.5 text-sm mb-4">
              {[
                { l: 'Heizkosten heute (Heiztyp)', v: fmtEuro(calc.altKosten) + '/J', c: 'text-amber-300' },
                { l: 'Mit WP (JAZ ' + jaz + ')', v: fmtEuro(calc.wpKosten) + '/J', c: 'text-[#4CAF7D]' },
                { l: 'Jährliche Ersparnis', v: fmtEuro(calc.ersparnis), c: 'text-white font-bold text-base' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between border-b border-white/10 pb-1.5">
                  <span style={{ color: 'rgba(255,255,255,0.80)' }}>{r.l}</span>
                  <span className={'font-mono ' + r.c}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-3 space-y-1.5 text-xs">
              <p className="text-[#4CAF7D] font-bold uppercase tracking-wider text-xs mb-2">KfW-FÖRDERUNG ({foerd.gesamtSatz}%)</p>
              {[
                { l: 'Gesamtinvestition', v: '25.000 Euro' },
                { l: 'KfW-Zuschuss ' + foerd.gesamtSatz + '%', v: '-' + fmtEuro(foerd.zuschuss), c: 'text-[#4CAF7D]' },
                { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-white font-bold' },
                { l: 'Amortisation', v: '~' + calc.amortisationJahre + ' Jahre', c: 'text-amber-300' },
                { l: 'Gewinn nach 20 Jahren', v: '+' + fmtEuro(gewinnNach20), c: 'text-[#4CAF7D]' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-white/80">{r.l}</span>
                  <span className={r.c || 'text-white'}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="/rechner" className="block w-full text-center py-3.5 bg-[#D97706] text-white font-bold rounded-xl hover:bg-[#b45309] transition-colors text-sm">
            Kostenloses Angebot in {city.name} →
          </a>
          <a href="/kontakt" className="block w-full text-center py-3 text-sm font-semibold text-[#1A4731] border border-[#1A4731] rounded-xl hover:bg-[#E8F5EE] transition-all">Kostenlose Beratung →</a>
          <p className="text-center text-xs text-gray-400">Kostenlos &amp; unverbindlich · Keine Weitergabe · Bis 3 lokale Betriebe</p>
        </div>
      </div>
    </div>
  );
}

// FAQ accordion — defined after main component
function FAQAccordion({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return (
    <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
      {faqs.map((faq, i) => (
        <details key={i} className="group">
          <summary className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-gray-50 transition-colors cursor-pointer list-none">
            <span className="font-semibold text-gray-900 text-[15px] leading-snug">{faq.q}</span>
            <ChevronDown size={18} className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="border-t border-gray-100">
            <p className="px-5 py-4 text-gray-600 text-[15px] leading-relaxed bg-white">{faq.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}