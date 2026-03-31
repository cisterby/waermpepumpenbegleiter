// components/programmatic/templates/InstallateurTemplate.tsx
'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, AlertTriangle, Clock, Shield } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import { AdditionalContentBlocks } from '@/components/programmatic/AdditionalContentBlocks';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

function getMarketData(einwohner: number) {
  if (einwohner >= 1000000) return { wartezeit: '8–14 Wochen', kosten: '€22.000–€32.000', note: 'Sehr hohe Nachfrage' };
  if (einwohner >= 500000)  return { wartezeit: '6–12 Wochen', kosten: '€20.000–€29.000', note: 'Hohe Nachfrage' };
  if (einwohner >= 200000)  return { wartezeit: '5–10 Wochen', kosten: '€18.000–€27.000', note: 'Gute Verfügbarkeit' };
  return                          { wartezeit: '4–8 Wochen',  kosten: '€17.000–€26.000', note: 'Gute Verfügbarkeit' };
}

const CHECKLIST = [
  { item: 'Heizlastberechnung nach DIN EN 12831', crit: true,  note: 'Grundlage für korrekte Dimensionierung — Pflicht' },
  { item: 'Gerät (Fabrikat, Modell, Leistung)', crit: true,  note: 'Einzeln ausgewiesen, keine Pauschalpreise' },
  { item: 'Montage & Installation (Stunden)', crit: true,  note: 'Transparente Kalkulation' },
  { item: 'Hydraulischer Abgleich', crit: true,  note: 'KfW-Pflicht — fehlt in >60% aller Angebote!' },
  { item: 'Elektroinstallation & Zählerinfrastruktur', crit: false, note: 'Oft vergessen: €500–1.500' },
  { item: 'Fundament & Aufstellung Außeneinheit', crit: false, note: 'Ca. €300–800, oft separat abgerechnet' },
  { item: 'KfW-Antragsbegleitung inklusive', crit: true,  note: 'Betrieb muss als LuL registriert sein' },
  { item: 'Gewährleistung mind. 2 Jahre (besser: 5)', crit: false, note: 'Gesetzlich 2 Jahre — gute Betriebe: 5+ Jahre' },
];

export default function InstallateurTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 6);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const market = getMarketData(city.einwohner);
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');

  const v = cityHash(city, 4, 60);
  const intros = [
    `In ${city.name} gibt es sowohl lokale SHK-Meisterbetriebe als auch bundesweite Anbieter. Lokale Betriebe kennen die Auflagen in ${city.bundesland}, die Netzbetreiber für den WP-Sondertarif und sind bei Störungen schnell vor Ort. Wir vermitteln ausschließlich HWK-geprüfte lokale Betriebe — kostenlos.`,
    `Nicht jeder SHK-Betrieb in ${city.name} der WP einbaut ist KfW-berechtigt. Entscheidend: LuL-Registrierung (ohne diese kein Förderantrag), min. 5 dokumentierte WP-Installationen und ein aktiver Meisterbetrieb. Alle unsere Partner erfüllen das.`,
    `Die Wartezeit für gute WP-Installateure in ${city.name} beträgt aktuell ${market.wartezeit}. Wer jetzt anfrägt sichert Kapazität vor der GEG-Frist am ${gegFristFormatted}. Wir vermitteln in 48h bis zu 3 vollständige Angebote — kostenlos.`,
    `Die Verbraucherzentrale empfiehlt: Mindestens 3 Vergleichsangebote einholen, alle Positionen einzeln ausweisen lassen und nur LuL-registrierte Betriebe beauftragen. Wir holen diese Angebote für Sie in ${city.name} kostenlos ein.`,
  ];

  return (
    <div className="min-h-screen bg-wp-bg font-sans">

      {/* ── HERO ─────────────────────────────────────── */}
      <div className="pt-24 pb-16 px-6" style={{ background: 'linear-gradient(135deg, #0A1910 0%, #1B3D28 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-6 text-[rgba(255,255,255,0.40)] flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white transition-colors">{keyword.keyword.replace('[Stadt]', '').trim()}</Link>
            <span>›</span>
            <span className="text-white">{city.name}</span>
          </nav>
          <h1 className="font-heading font-extrabold text-white mb-5 leading-tight" style={{ fontSize: 'clamp(30px,4.5vw,58px)' }}>
            {h1}
          </h1>
          <p className="text-[rgba(255,255,255,0.65)] text-lg leading-relaxed max-w-2xl mb-10">
            Kostenlos bis zu 3 Angebote von HWK-geprüften lokalen Meisterbetrieben in {city.name} vergleichen.
            Aktuelle Wartezeit: <strong className="text-white">{market.wartezeit}</strong>.
          </p>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { val: '48h', label: 'Rückmeldung', sub: 'von Partnerbetrieben' },
              { val: '3', label: 'Angebote max.', sub: 'vollständig & vergleichbar' },
              { val: '€0', label: 'Kosten für Sie', sub: '100% kostenlos' },
              { val: market.wartezeit, label: 'Wartezeit', sub: city.name + ' aktuell' },
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

      {/* ── QUALITÄTS-BAR ── */}
      <div className="bg-wp-dark border-b border-[rgba(255,255,255,0.08)] py-3 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-5 flex-wrap">
          <span className="text-wp-green3 text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Shield size={12} />Qualitätskriterien
          </span>
          {['HWK-eingetragen','Meisterbetrieb','KfW-LuL-registriert','5+ WP-Installationen','Haftpflicht'].map(s => (
            <span key={s} className="text-[rgba(255,255,255,0.55)] text-xs font-semibold flex items-center gap-1">
              <CheckCircle size={10} className="text-wp-green3" />{s}
            </span>
          ))}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-10 items-start">
        <div className="space-y-10">

          {/* Stadtmarkt-Daten */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <Clock size={18} className="text-wp-amber" />, label: 'Wartezeit in ' + city.name, val: market.wartezeit, sub: 'Jetzt anfragen sichert Kapazität', bg: 'bg-white' },
              { icon: '💶', label: 'Ø Investitionskosten', val: market.kosten, sub: 'Brutto inkl. Installation', bg: 'bg-white' },
              { icon: '🏗️', label: 'Markt ' + city.name, val: market.note, sub: city.einwohner >= 500000 ? 'Frühzeitig planen' : 'Gute lokale Auswahl', bg: 'bg-white' },
            ].map((d, i) => (
              <div key={i} className={`${d.bg} rounded-xl border border-wp-border p-5 shadow-wp-sm`}>
                <div className="mb-3">{typeof d.icon === 'string' ? <span className="text-2xl">{d.icon}</span> : d.icon}</div>
                <p className="font-heading font-bold text-wp-text text-lg leading-tight mb-0.5">{d.val}</p>
                <p className="text-wp-text3 text-xs font-semibold mb-0.5">{d.label}</p>
                <p className="text-wp-text3 text-xs">{d.sub}</p>
              </div>
            ))}
          </div>

          {/* Featured Snippet */}
          <div className="bg-white border border-wp-border border-l-4 border-l-wp-green rounded-xl p-6 shadow-wp-sm">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] ?? 'Wie finde ich einen guten WP-Installateur in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">{intros[v]}</p>
          </div>

          {/* Worauf achten */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Worauf achten bei der Wahl des Installateurs in {city.name}?
            </h2>
            <div className="space-y-4 text-wp-text2 leading-relaxed">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="font-semibold text-red-800 mb-1">⚠️ KfW-LuL-Registrierung — der häufigste Fehler</p>
                <p className="text-red-700 text-sm">Nur Betriebe die als Lieferant und Leistungserbringer (LuL) im KfW-Portal registriert sind können den Förderantrag stellen. Kein LuL = kein Antrag = keine Förderung. In {city.name} haben nicht alle SHK-Betriebe diese Registrierung — alle unsere Partner schon.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-semibold text-amber-800 mb-1">💡 Vollständige Angebote — Positionen einzeln ausweisen lassen</p>
                <p className="text-amber-700 text-sm">Hydraulischer Abgleich (€500–1.500, KfW-Pflicht), Elektroinstallation (€500–1.500) und Fundament/Aufstellung (€300–800) werden oft nicht ausgewiesen — sind aber reale Kosten. Erst dann sind Angebote vergleichbar.</p>
              </div>
              <div className="bg-wp-greenlt border border-wp-green3/30 rounded-xl p-4">
                <p className="font-semibold text-wp-green mb-1">✓ Heizlastberechnung nach DIN EN 12831</p>
                <p className="text-wp-text2 text-sm">Eine korrekte Auslegung verhindert Über- und Unterdimensionierung. Zu große WP taktet — das senkt die JAZ auf {(jaz - 0.5).toFixed(1)} oder schlechter und verkürzt die Lebensdauer. Seriöse Betriebe in {city.name} führen diese Berechnung vor jedem Angebot durch.</p>
              </div>
            </div>
          </div>

          {/* Checkliste */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              Checkliste: Was ein vollständiges Angebot enthält
            </h2>
            <p className="text-wp-text2 text-sm mb-4">
              Laut Verbraucherzentrale enthielten bei Prüfung von 160 WP-Angeboten über 60% nicht alle Kostenpositionen. Unsere Partner in {city.name} weisen alles vollständig aus.
            </p>
            <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
              {CHECKLIST.map((item, i) => (
                <div key={i} className={`flex items-start gap-3 px-5 py-3.5 ${i < CHECKLIST.length - 1 ? 'border-b border-wp-border' : ''}`}>
                  <CheckCircle size={14} className={`mt-0.5 shrink-0 ${item.crit ? 'text-wp-green' : 'text-wp-text3'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-wp-text text-sm">{item.item}</p>
                    <p className="text-wp-text3 text-xs mt-0.5">{item.note}</p>
                  </div>
                  {item.crit && <span className="bg-wp-greenlt text-wp-green text-xs font-bold px-2 py-0.5 rounded-full shrink-0">Pflicht</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Lokal vs. Bundesweit */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Lokaler Betrieb vs. bundesweiter Anbieter
            </h2>
            <div className="overflow-x-auto rounded-xl border border-wp-border shadow-wp-sm">
              <table className="w-full bg-white min-w-[500px]">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #0A1910 0%, #1B3D28 100%)' }}>
                    <th className="px-4 py-3.5 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider">Kriterium</th>
                    <th className="px-4 py-3.5 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider">Thermondo / Enpal</th>
                    <th className="px-4 py-3.5 text-left text-wp-green3 text-xs font-bold uppercase tracking-wider">Lokal in {city.name} ✓</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Reaktionszeit Störung', '24–72 Stunden', city.einwohner >= 500000 ? '< 12 Stunden' : '< 8 Stunden'],
                    ['WP-Sondertarif beantragen', 'Nicht immer', `✓ Kennt lokale Netzbetreiber in ${city.name}`],
                    [`${city.bundesland}-Auflagen bekannt`, 'Standardisiert', `✓ Vollständig — inkl. Schallschutz`],
                    ['Herstellerbindung', 'Oft markengebunden', '✓ Herstellerunabhängig'],
                    ['KfW-Antrag (LuL)', '✓ Ja', '✓ Ja — alle unsere Partner registriert'],
                    ['Wartung & Service', 'Zentralisiert', '✓ Lokal, schnell verfügbar'],
                  ].map(([label, them, us], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-wp-bg/40'}>
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm border-b border-wp-border">{label}</td>
                      <td className="px-4 py-3 text-wp-text3 text-sm border-b border-wp-border">{them}</td>
                      <td className="px-4 py-3 text-wp-green font-medium text-sm border-b border-wp-border">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GEG Urgency */}
          {isUrgent && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-amber-900 mb-1">GEG-Frist {city.name}: {gegFristFormatted}</p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Bei aktuellen Wartezeiten von {market.wartezeit} in {city.name} müssen Sie jetzt handeln um rechtzeitig fertig zu werden. Spätere Anfragen riskieren außerdem höhere Preise und schlechtere Betriebsverfügbarkeit.
                </p>
              </div>
            </div>
          )}

          <AdditionalContentBlocks city={city} keyword={keyword} jaz={jaz} calc={calc} foerd={foerd} />

          {/* FAQ */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">Häufige Fragen — Installateur in {city.name}</h2>
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

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Installateure in der Region</h3>
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
          <div className="rounded-2xl shadow-wp-xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #1B3D28 0%, #0A1910 100%)' }}>
            <div className="p-6">
              <p className="text-[rgba(255,255,255,0.50)] text-xs font-bold uppercase tracking-widest mb-1">Markt {city.name}</p>
              <p className="font-mono font-extrabold text-white text-3xl leading-none mb-0.5">{market.wartezeit}</p>
              <p className="text-[rgba(255,255,255,0.40)] text-xs mb-5">Ø Wartezeit gute Betriebe</p>
              <div className="space-y-2 mb-5">
                {[
                  { l: 'Ø Investitionskosten', v: market.kosten, c: 'text-wp-amber' },
                  { l: `KfW-Zuschuss (${foerd.gesamtSatz}%)`, v: fmtEuro(foerd.zuschuss), c: 'text-wp-green3' },
                  { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-white' },
                  { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-wp-green3' },
                  { l: 'JAZ in ' + city.name, v: String(jaz), c: 'text-white' },
                ].map(r => (
                  <div key={r.l} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.08)]">
                    <span className="text-[rgba(255,255,255,0.45)] text-xs">{r.l}</span>
                    <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <a href="#angebot" className="flex items-center justify-center gap-2 w-full py-3.5 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-colors">
                3 Angebote anfordern <ArrowRight size={14} />
              </a>
              <p className="text-[rgba(255,255,255,0.25)] text-xs text-center mt-2">Kostenlos · Unverbindlich · 48h</p>
            </div>
          </div>
          <div id="angebot">
            <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          </div>
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
