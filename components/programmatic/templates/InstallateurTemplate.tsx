// components/programmatic/templates/InstallateurTemplate.tsx
// "waermepumpe-installateur" — vollständig, stadtspezifisch, 800+ Wörter
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import { AdditionalContentBlocks } from '@/components/programmatic/AdditionalContentBlocks';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG_HERO = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80';

// Stadtspezifische Wartezeiten und Kosten
function getCityMarketData(city: CityPageRouterProps['city']) {
  const einw = city.einwohner;
  let wartezeit: string;
  let avgKosten: string;
  let betriebe: string;

  if (einw >= 1000000) {
    wartezeit = '8–14 Wochen';
    avgKosten = '€22.000–€32.000';
    betriebe = 'Sehr hohe Nachfrage';
  } else if (einw >= 500000) {
    wartezeit = '6–12 Wochen';
    avgKosten = '€20.000–€29.000';
    betriebe = 'Hohe Nachfrage';
  } else if (einw >= 200000) {
    wartezeit = '5–10 Wochen';
    avgKosten = '€18.000–€27.000';
    betriebe = 'Gute Verfügbarkeit';
  } else {
    wartezeit = '4–8 Wochen';
    avgKosten = '€17.000–€26.000';
    betriebe = 'Gute Verfügbarkeit';
  }
  return { wartezeit, avgKosten, betriebe };
}

export default function InstallateurTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 6);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const market = getCityMarketData(city);
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const isUrgent = city.einwohner >= 100000;

  // Variante des Haupttexts
  const v = cityHash(city, 4, 60);
  const intros = [
    `In ${city.name} gibt es sowohl lokale SHK-Meisterbetriebe als auch bundesweite Anbieter wie Thermondo oder Enpal. Der entscheidende Unterschied: Lokale Betriebe kennen die Auflagen in ${city.bundesland}, die lokalen Netzbetreiber für den WP-Tarif und sind bei Störungen in wenigen Stunden vor Ort. Wir vermitteln ausschließlich lokal ansässige, HWK-geprüfte Betriebe — kostenlos.`,
    `Nicht jeder SHK-Betrieb in ${city.name} der eine Wärmepumpe installiert, ist ein Wärmepumpen-Fachbetrieb. Entscheidend: KfW-LuL-Registrierung (ohne die kein Förderantrag möglich), mindestens 5 dokumentierte WP-Installationen in 24 Monaten und ein aktiver Meisterbetrieb. Unsere Partnerbetriebe erfüllen das — und haben Kapazitäten in ${city.name}.`,
    `Die Wartezeit für gute Wärmepumpen-Installateure in ${city.name} beträgt aktuell ${market.wartezeit}. Wer jetzt anfrägt, sichert sich Kapazität für die nächste Heizsaison — und das zum richtigen Zeitpunkt vor der GEG-Frist am ${gegFristFormatted}. Unser Service vermittelt in 48 Stunden bis zu 3 vollständige Angebote.`,
    `Die Verbraucherzentrale empfiehlt: Mindestens 3 Vergleichsangebote einholen, alle Positionen einzeln aufführen lassen (Gerät, Montage, Hydraulik, Elektrik) und nur LuL-registrierte Betriebe beauftragen. In ${city.name} holen wir diese Angebote für Sie kostenlos ein — in 48 Stunden.`,
  ];

  // Checkliste was ein vollständiges Angebot enthält
  const checklistItems = [
    { item: 'Heizlastberechnung nach DIN EN 12831', critical: true, note: 'Grundlage für korrekte Dimensionierung' },
    { item: 'Gerät (Fabrikat, Modell, Leistung)', critical: true, note: 'Einzeln ausgewiesen, keine Pauschale' },
    { item: 'Montage & Installation (Stunden aufgeführt)', critical: true, note: 'Transparente Kalkulation' },
    { item: 'Hydraulischer Abgleich', critical: true, note: 'KfW-Pflicht — fehlt in vielen Angeboten!' },
    { item: 'Elektroinstallation & Zählerinfrastruktur', critical: false, note: 'Oft unterschätzt: €500–1.500' },
    { item: 'Fundament & Aufstellung Außeneinheit', critical: false, note: 'Ca. €300–800, oft separat' },
    { item: 'KfW-Antragsbegleitung inklusive', critical: true, note: 'Betrieb muss LuL-registriert sein' },
    { item: 'Gewährleistung (mind. 5 Jahre)', critical: false, note: 'Gesetzlich: 2 Jahre, gut: 5+ Jahre' },
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
              Geprüfte Wärmepumpen-Installateure in {city.name} — kostenlos bis zu 3 vollständige Angebote von lokalen Meisterbetrieben vergleichen. Wartezeit aktuell: {market.wartezeit}.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#angebot" className="inline-flex items-center gap-2 px-7 py-4 bg-wp-green text-white rounded-xl font-heading font-bold text-sm hover:bg-wp-green2 transition-all hover:-translate-y-0.5 shadow-wp-lg">
                3 Angebote anfordern <ArrowRight size={16} />
              </a>
              <div className="flex items-center gap-4 px-5 py-4 bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.20)] rounded-xl">
                <div className="text-center"><p className="font-mono font-bold text-white text-lg leading-none">48h</p><p className="text-[rgba(255,255,255,0.50)] text-xs">Rückmeldung</p></div>
                <div className="w-px h-8 bg-[rgba(255,255,255,0.20)]" />
                <div className="text-center"><p className="font-mono font-bold text-wp-amber text-lg leading-none">3</p><p className="text-[rgba(255,255,255,0.50)] text-xs">Angebote max.</p></div>
                <div className="w-px h-8 bg-[rgba(255,255,255,0.20)]" />
                <div className="text-center"><p className="font-mono font-bold text-wp-green3 text-lg leading-none">€0</p><p className="text-[rgba(255,255,255,0.50)] text-xs">Kosten für Sie</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white border-b border-wp-border py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-5 flex-wrap">
          <span className="text-xs font-bold text-wp-text3 uppercase tracking-wider shrink-0">Qualitätskriterien</span>
          {['HWK-Eintragung','KfW-LuL-Registrierung','Meisterbetrieb','5+ WP-Installationen','Haftpflichtversicherung'].map(s => (
            <span key={s} className="text-sm font-semibold text-wp-text3 flex items-center gap-1">
              <CheckCircle size={10} className="text-wp-green" />{s}
            </span>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[1fr_380px] gap-12 items-start">
        <div className="space-y-10">

          {/* Stadtmarkt-Daten */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <Clock size={18} className="text-wp-amber" />, label: 'Wartezeit in ' + city.name, val: market.wartezeit, sub: 'Jetzt anfragen sichert Kapazität' },
              { icon: '💶', label: 'Ø Investitionskosten', val: market.avgKosten, sub: 'Brutto, inkl. Installation' },
              { icon: '🏗️', label: 'Marktverfügbarkeit', val: market.betriebe, sub: city.einwohner >= 500000 ? 'Frühzeitig planen empfohlen' : 'Gute lokale Auswahl' },
            ].map((d, i) => (
              <div key={i} className="bg-white rounded-xl border border-wp-border p-4 shadow-wp-sm">
                <div className="mb-2">{typeof d.icon === 'string' ? <span className="text-2xl">{d.icon}</span> : d.icon}</div>
                <p className="font-heading font-bold text-wp-text text-lg leading-tight mb-0.5">{d.val}</p>
                <p className="text-wp-text3 text-xs font-semibold mb-0.5">{d.label}</p>
                <p className="text-wp-text3 text-xs">{d.sub}</p>
              </div>
            ))}
          </div>

          {/* Featured Snippet */}
          <div className="bg-white border-l-4 border-wp-green rounded-xl p-6 shadow-wp-sm">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] ?? `Wie finde ich einen guten Wärmepumpen-Installateur in {stadt}?`, city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              {intros[v]}
            </p>
          </div>

          {/* Haupttext: Was macht einen guten Installateur aus */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Worauf achten bei der Wahl des Installateurs in {city.name}?
            </h2>
            <div className="space-y-4 text-wp-text2 text-base leading-relaxed">
              <p>
                Der wichtigste Punkt: <strong className="text-wp-text">KfW-LuL-Registrierung</strong>. Nur Betriebe die als Lieferant und Leistungserbringer (LuL) im KfW-Energieeffizienz-Portal registriert sind, können den Förderantrag stellen. Kein LuL = kein KfW-Antrag = keine Förderung. In {city.name} haben nicht alle SHK-Betriebe diese Registrierung — alle unsere Partner schon.
              </p>
              <p>
                Der zweithäufigste Fehler: <strong className="text-wp-text">fehlende Positionen im Angebot</strong>. Hydraulischer Abgleich (KfW-Pflicht, €500–1.500), Elektroinstallation (€500–1.500) und Fundament/Aufstellung (€300–800) werden oft nicht ausgewiesen — sind aber reale Kosten. Erst dann sind Angebote wirklich vergleichbar.
              </p>
              <p>
                Drittens: <strong className="text-wp-text">Heizlastberechnung nach DIN EN 12831</strong>. Eine korrekte Auslegung verhindert Über- und Unterdimensionierung. Zu große WP taktet häufig — das senkt die JAZ und verkürzt die Lebensdauer. Ein seriöser Betrieb in {city.name} führt diese Berechnung vor jedem Angebot durch.
              </p>
            </div>
          </div>

          {/* Checkliste vollständiges Angebot */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Checkliste: Was ein vollständiges Angebot enthält
            </h2>
            <p className="text-wp-text2 text-sm mb-5">
              Die Verbraucherzentrale hat bei der Prüfung von 160 Wärmepumpen-Angeboten festgestellt: Über 60% enthielten nicht alle relevanten Kostenpositionen. Unsere Partnerbetriebe in {city.name} weisen alle Positionen vollständig aus.
            </p>
            <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
              {checklistItems.map((item, i) => (
                <div key={i} className={`flex items-start gap-3 px-5 py-3.5 ${i < checklistItems.length - 1 ? 'border-b border-wp-border' : ''} ${item.critical ? '' : 'bg-wp-bg/50'}`}>
                  <CheckCircle size={14} className={`mt-0.5 shrink-0 ${item.critical ? 'text-wp-green' : 'text-wp-text3'}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-wp-text text-sm">{item.item}</p>
                    <p className="text-wp-text3 text-xs">{item.note}</p>
                  </div>
                  {item.critical && (
                    <span className="bg-wp-greenlt text-wp-green text-xs font-bold px-2 py-0.5 rounded-full shrink-0">Pflicht</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lokal vs. Bundesweit Vergleich */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Lokaler Betrieb vs. bundesweiter Anbieter in {city.name}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm min-w-[500px]">
                <thead>
                  <tr className="bg-wp-dark">
                    <th className="px-4 py-3 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider">Kriterium</th>
                    <th className="px-4 py-3 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider">Thermondo / Enpal</th>
                    <th className="px-4 py-3 text-left text-wp-green3 text-xs font-bold uppercase tracking-wider">Lokaler Betrieb ({city.name}) ✓</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Reaktionszeit bei Störung', '24–72 Stunden', `Oft < ${city.einwohner >= 500000 ? '12' : '8'} Stunden`],
                    ['Kenntnis lokaler Netzbetreiber', 'Begrenzt', '✓ Vollständig — WP-Tarif beantragen'],
                    ['Kenntnis lokaler Auflagen', 'Standardisiert', `✓ ${city.bundesland}-spezifische Vorschriften bekannt`],
                    ['Herstellerbindung', 'Oft markengebunden', '✓ Herstellerunabhängig'],
                    ['KfW-Antragsbegleitung', '✓ Ja', '✓ Ja — als LuL-Betrieb'],
                    ['Wartung & Service', 'Zentralisiert', '✓ Lokal, schnell verfügbar'],
                  ].map(([label, thermondo, local], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-wp-bg/50'}>
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm border-b border-wp-border">{label}</td>
                      <td className="px-4 py-3 text-wp-text3 text-sm border-b border-wp-border">{thermondo}</td>
                      <td className="px-4 py-3 text-wp-green font-medium text-sm border-b border-wp-border">{local}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GEG-Frist Urgency */}
          {isUrgent && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-amber-900 mb-1">GEG-Frist {city.name}: {gegFristFormatted}</p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Als Großstadt über 100.000 Einwohner gilt in {city.name} die 65%-EE-Pflicht ab {gegFristFormatted}. Bei aktuellen Wartezeiten von {market.wartezeit} müssen Sie jetzt handeln um rechtzeitig fertig zu werden. Wer wartet riskiert außerdem höhere Installationspreise und schlechtere Betriebsverfügbarkeit.
                </p>
              </div>
            </div>
          )}

          {/* Additional SEO Blocks */}
          <AdditionalContentBlocks city={city} keyword={keyword} jaz={jaz} calc={calc} foerd={foerd} />

          {/* FAQ */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Häufige Fragen — Installateur in {city.name}
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
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Installateure in der Region {city.bundesland}</h3>
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
            <p className="text-[rgba(255,255,255,0.50)] text-xs font-semibold uppercase tracking-wider mb-1">Markt {city.name}</p>
            <p className="font-mono font-bold text-white text-3xl leading-none mb-0.5">{market.wartezeit}</p>
            <p className="text-[rgba(255,255,255,0.35)] text-xs mb-4">Ø Wartezeit für gute Betriebe</p>
            {[
              { l: 'Ø Investitionskosten', v: market.avgKosten, c: 'text-wp-amber' },
              { l: 'KfW-Zuschuss', v: fmtEuro(foerd.zuschuss), c: 'text-wp-green3' },
              { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-white' },
              { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-wp-green3' },
              { l: 'JAZ in ' + city.name, v: String(jaz), c: 'text-white' },
            ].map(r => (
              <div key={r.l} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
                <span className="text-[rgba(255,255,255,0.45)] text-xs">{r.l}</span>
                <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
              </div>
            ))}
            <a href="#angebot"
              className="flex items-center justify-center gap-2 w-full mt-4 py-3.5 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-colors">
              3 Angebote anfordern <ArrowRight size={15} />
            </a>
            <p className="text-[rgba(255,255,255,0.25)] text-xs text-center mt-2">Kostenlos · Unverbindlich · 48h</p>
          </div>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          <AuthorBox keywordSlug={keyword.slug} />
          <div className="bg-white border border-wp-border rounded-xl p-4 shadow-wp-sm">
            {['HWK-geprüfte Meisterbetriebe', 'KfW-LuL-Registrierung', 'Heizlastberechnung inklusive', `Lokal in ${city.name}`, '100% kostenlos'].map(t => (
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
