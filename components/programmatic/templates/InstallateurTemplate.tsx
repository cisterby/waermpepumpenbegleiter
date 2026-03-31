// components/programmatic/templates/InstallateurTemplate.tsx
// "waermepumpe-installateur" — vollständig, 1500+ Wörter, Bilder, visuell stark
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, AlertTriangle, Clock, Shield, Star } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMGS = {
  hero:      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80',
  worker:    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
  pump:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  house:     'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
  outdoor:   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
};

function getMarketData(einwohner: number) {
  if (einwohner >= 1000000) return { wartezeit: '8–14 Wochen', kosten: '€22.000–€32.000', note: 'Sehr hohe Nachfrage — früh anfragen', urgent: true };
  if (einwohner >= 500000)  return { wartezeit: '6–12 Wochen', kosten: '€20.000–€29.000', note: 'Hohe Nachfrage', urgent: true };
  if (einwohner >= 200000)  return { wartezeit: '5–10 Wochen', kosten: '€18.000–€27.000', note: 'Gute Verfügbarkeit', urgent: false };
  return                          { wartezeit: '4–8 Wochen',  kosten: '€17.000–€26.000', note: 'Gute lokale Auswahl', urgent: false };
}

const CRITERIA = [
  { icon: '🏛️', title: 'HWK-Eintragung aktiv', text: 'Gültige Eintragung in der Handwerksrolle — jährlich geprüft.' },
  { icon: '👨‍🔧', title: 'Meisterbetrieb', text: 'Persönliche technische Leitung durch einen SHK-Meister.' },
  { icon: '📊', title: '5+ WP-Installationen', text: 'Min. 5 dokumentierte Installationen in den letzten 24 Monaten.' },
  { icon: '🏦', title: 'KfW-LuL-Registrierung', text: 'Aktive Registrierung als Lieferant und Leistungserbringer. Ohne das kein KfW-Antrag.' },
  { icon: '🛡️', title: 'Haftpflichtversicherung', text: 'Gültige Betriebshaftpflicht für Heizungsbau nachgewiesen.' },
  { icon: '⭐', title: 'Kundenbewertung', text: 'Unter Ø 3,5/5 nach 10+ Bewertungen → automatisch aus unserem Netzwerk entfernt.' },
];

const CHECKLIST = [
  { item: 'Heizlastberechnung nach DIN EN 12831', crit: true,  note: 'Grundlage für korrekte WP-Dimensionierung — Pflicht' },
  { item: 'Gerät: Fabrikat, Modell, kW-Leistung', crit: true,  note: 'Einzeln ausgewiesen — keine Pauschale' },
  { item: 'Montage & Installation (Stunden)', crit: true,  note: 'Transparente Kalkulation' },
  { item: 'Hydraulischer Abgleich (Verfahren B)', crit: true,  note: 'KfW-Pflicht — fehlt in >60% aller Angebote!' },
  { item: 'Wärmemengenzähler (neu 2026)', crit: true,  note: 'KfW-Pflicht ab 2026 — im Angebot abfragen' },
  { item: 'Elektroinstallation & Zählerinfrastruktur', crit: false, note: 'Oft separat: €500–1.500' },
  { item: 'Fundament & Aufstellung Außeneinheit', crit: false, note: 'Ca. €300–800, oft separate Position' },
  { item: 'KfW-Antragsbegleitung als LuL', crit: true,  note: 'Betrieb muss LuL-registriert sein — ohne das kein Antrag' },
  { item: 'Schallschutznachweis (neu ab 2026)', crit: false, note: '10 dB unter EU-Grenzwert für Förderfähigkeit' },
  { item: 'Gewährleistung & Wartungsvertrag', crit: false, note: 'Gesetzl. 2 Jahre — gute Betriebe bieten 5+ Jahre' },
];

export default function InstallateurTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 6);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const market = getMarketData(city.einwohner);
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const v = cityHash(city, 4, 60);

  const intros = [
    `In ${city.name} gibt es sowohl lokale SHK-Meisterbetriebe als auch bundesweite Anbieter wie Thermondo oder Enpal. Der entscheidende Unterschied: Lokale Betriebe kennen die Auflagen in ${city.bundesland}, die Netzbetreiber für den WP-Sondertarif und sind bei Störungen innerhalb von Stunden vor Ort — nicht in Tagen.`,
    `Nicht jeder SHK-Betrieb in ${city.name} der "Wärmepumpen" anbietet ist auch ein KfW-tauglicher Fachbetrieb. Entscheidend: KfW-LuL-Registrierung (ohne die kein Antrag möglich), mindestens 5 dokumentierte WP-Installationen in 24 Monaten und ein aktiver Meisterbetrieb. Alle unsere Partner erfüllen das — und haben Kapazitäten in ${city.name}.`,
    `Die Wartezeit für qualifizierte Wärmepumpen-Installateure in ${city.name} beträgt aktuell ${market.wartezeit}. Wer jetzt anfrägt sichert Kapazität für die nächste Heizsaison — und handelt rechtzeitig vor der GEG-Frist am ${gegFristFormatted}. Unser Service vermittelt in 48 Stunden bis zu 3 vollständige Angebote.`,
    `Die Verbraucherzentrale empfiehlt: Mindestens 3 Vergleichsangebote einholen, alle Positionen einzeln ausweisen lassen und nur KfW-LuL-registrierte Betriebe beauftragen. In ${city.name} holen wir diese Angebote für Sie kostenlos ein — in 48 Stunden, vollständig vergleichbar.`,
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.slice(0, 5).map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <div className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img src={IMGS.hero} alt={`Wärmepumpe Installateur ${city.name}`}
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(115deg,rgba(10,25,16,.97) 0%,rgba(10,25,16,.88) 55%,rgba(10,25,16,.5) 100%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-28">
          <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="text-[rgba(255,255,255,0.40)] hover:text-white transition-colors">Startseite</Link>
            <span className="text-[rgba(255,255,255,0.25)]">›</span>
            <Link href={`/${keyword.slug}`} className="text-[rgba(255,255,255,0.40)] hover:text-white transition-colors">
              {keyword.keyword.replace('[Stadt]', '').trim()}
            </Link>
            <span className="text-[rgba(255,255,255,0.25)]">›</span>
            <span className="text-white">{city.name}</span>
          </nav>

          {isUrgent && (
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/50 rounded-full px-4 py-2 mb-5">
              <Clock size={13} className="text-amber-400" />
              <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">Wartezeit in {city.name}: {market.wartezeit}</span>
            </div>
          )}

          <h1 className="font-heading font-extrabold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(32px,4.5vw,62px)' }}>
            {h1}
          </h1>
          <p className="text-[rgba(255,255,255,0.65)] text-lg leading-relaxed max-w-2xl mb-10">
            Kostenlos bis zu 3 Angebote von <strong className="text-white">HWK-geprüften lokalen Meisterbetrieben</strong> in {city.name} vergleichen.
            Alle Partner sind KfW-LuL-registriert — das ist Voraussetzung für Ihre{' '}
            <strong className="text-wp-green3">{fmtEuro(foerd.zuschuss)}</strong> KfW-Förderung.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a href="#angebot"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-wp-green text-white font-heading font-bold rounded-xl hover:bg-wp-green2 transition-all hover:-translate-y-0.5 shadow-lg shadow-green-900/30">
              3 Angebote anfordern <ArrowRight size={16} />
            </a>
            <a href="#checkliste"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.20)] text-white font-heading font-semibold rounded-xl hover:bg-[rgba(255,255,255,0.15)] transition-all">
              Checkliste ansehen
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { val: '48h', label: 'Rückmeldung', sub: 'von lokalen Betrieben' },
              { val: '3', label: 'Angebote max.', sub: 'vollständig & vergleichbar' },
              { val: '€0', label: 'Kosten für Sie', sub: '100% kostenlos' },
              { val: market.wartezeit, label: 'Wartezeit', sub: city.name + ' aktuell' },
            ].map((s, i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-xl p-4">
                <p className="font-mono font-extrabold text-white leading-none mb-1" style={{ fontSize: 'clamp(16px,2vw,22px)' }}>{s.val}</p>
                <p className="text-wp-green3 text-xs font-bold mb-0.5">{s.label}</p>
                <p className="text-[rgba(255,255,255,0.35)] text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qualitäts-Bar */}
      <div className="bg-wp-dark border-b border-[rgba(255,255,255,0.08)] py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-5 flex-wrap">
          <span className="text-wp-green3 text-xs font-bold uppercase tracking-widest shrink-0 flex items-center gap-1.5">
            <Shield size={12} />6 Qualitätskriterien
          </span>
          {['HWK-Eintragung', 'Meisterbetrieb', 'KfW-LuL', '5+ WP-Inst.', 'Haftpflicht', 'Ø 4,6/5 Bewertung'].map(s => (
            <span key={s} className="text-[rgba(255,255,255,0.50)] text-xs font-semibold flex items-center gap-1">
              <CheckCircle size={10} className="text-wp-green3 shrink-0" />{s}
            </span>
          ))}
        </div>
      </div>

      {/* ══ MAIN ══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div className="space-y-16">

          {/* Marktdaten */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <Clock size={20} className="text-wp-amber" />, label: 'Wartezeit in ' + city.name, val: market.wartezeit, sub: market.note, bg: 'bg-white border-wp-border' },
              { icon: '💶', label: 'Ø Investitionskosten', val: market.kosten, sub: 'Brutto inkl. Installation & Zubehör', bg: 'bg-white border-wp-border' },
              { icon: '📋', label: 'KfW-Zuschuss', val: fmtEuro(foerd.zuschuss), sub: `${foerd.gesamtSatz}% Eigennutzer + Klima-Speed`, bg: 'bg-wp-greenlt border-wp-green3/30' },
            ].map((d, i) => (
              <div key={i} className={`bg-white border ${d.bg} rounded-xl p-5 shadow-wp-sm`}>
                <div className="mb-3">{typeof d.icon === 'string' ? <span className="text-2xl">{d.icon}</span> : d.icon}</div>
                <p className="font-heading font-bold text-wp-text text-lg leading-tight mb-0.5">{d.val}</p>
                <p className="text-wp-text3 text-xs font-semibold mb-0.5">{d.label}</p>
                <p className="text-wp-text3 text-xs">{d.sub}</p>
              </div>
            ))}
          </div>

          {/* Featured Snippet */}
          <div className="bg-white rounded-2xl border border-wp-border border-l-4 border-l-wp-green p-6 shadow-wp-sm">
            <p className="text-wp-green text-xs font-bold uppercase tracking-widest mb-2">Direkte Antwort</p>
            <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] ?? 'Wie finde ich einen guten WP-Installateur in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">{intros[v]}</p>
          </div>

          {/* Qualitätskriterien Grid mit Bild */}
          <div>
            <p className="text-wp-green text-xs font-bold uppercase tracking-widest mb-2">Unsere Partnerbetriebe</p>
            <h2 className="font-heading font-bold text-wp-text mb-6" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              6 Kriterien — wie wir Betriebe in {city.name} prüfen
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="relative rounded-2xl overflow-hidden h-56">
                <img src={IMGS.worker} alt={`Wärmepumpe Installateur in ${city.name}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,16,.85) 0%, transparent 55%)' }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-sm mb-1">Geprüfter Fachbetrieb</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-wp-amber fill-wp-amber" />)}
                    <span className="text-white text-xs ml-1">Ø 4,6 / 5,0</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {CRITERIA.map((c, i) => (
                  <div key={i} className="bg-white border border-wp-border rounded-xl p-3 shadow-wp-sm">
                    <span className="text-xl block mb-1.5">{c.icon}</span>
                    <p className="font-semibold text-wp-text text-xs mb-1 leading-tight">{c.title}</p>
                    <p className="text-wp-text3 text-xs leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-wp-greenlt border border-wp-green3/30 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle size={16} className="text-wp-green shrink-0 mt-0.5" />
              <p className="text-wp-text2 text-sm leading-relaxed">
                <strong className="text-wp-text">Laufendes Monitoring:</strong> Nach jeder Vermittlung → Kundenfeedback. Unter Ø 3,5/5 nach 10+ Bewertungen → automatisch entfernt. Kein Betrieb kann sich eine bessere Bewertung erkaufen.
              </p>
            </div>
          </div>

          {/* Haupttext: Worauf achten */}
          <div>
            <p className="text-wp-green text-xs font-bold uppercase tracking-widest mb-2">Worauf achten</p>
            <h2 className="font-heading font-bold text-wp-text mb-5" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              Die häufigsten Fehler bei der Installateur-Wahl in {city.name}
            </h2>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <p className="font-heading font-bold text-red-800 mb-2">⚠️ Fehler 1: Betrieb ohne KfW-LuL-Registrierung</p>
                <p className="text-red-700 text-sm leading-relaxed">
                  Nur Betriebe die als Lieferant und Leistungserbringer (LuL) im KfW-Energieeffizienz-Portal registriert sind
                  können den Förderantrag stellen. Kein LuL = kein Antrag = keine {fmtEuro(foerd.zuschuss)} Förderung.
                  In {city.name} haben nicht alle SHK-Betriebe diese Registrierung — alle unsere Partner schon.
                  Fragen Sie immer nach der LuL-Registrierungsnummer.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="font-heading font-bold text-amber-800 mb-2">⚠️ Fehler 2: Unvollständige Angebote</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Hydraulischer Abgleich (€500–1.500, KfW-Pflicht), Wärmemengenzähler (neu 2026, KfW-Pflicht),
                  Elektroinstallation (€500–1.500) und Fundament/Aufstellung (€300–800) werden oft nicht ausgewiesen —
                  sind aber reale Kosten. Nur mit vollständigen Positionen sind Angebote wirklich vergleichbar.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="font-heading font-bold text-amber-800 mb-2">⚠️ Fehler 3: Keine Heizlastberechnung</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Ohne Heizlastberechnung nach DIN EN 12831 ist eine korrekte Auslegung nicht möglich.
                  Zu große WP taktet häufig — das senkt die JAZ auf {(jaz - 0.5).toFixed(1)} oder schlechter
                  und verkürzt die Lebensdauer erheblich. Zu kleine WP reicht bei Kälte nicht aus.
                  Jedes seriöse Angebot in {city.name} enthält diese Berechnung.
                </p>
              </div>
              <div className="bg-wp-greenlt border border-wp-green3/30 rounded-xl p-5">
                <p className="font-heading font-bold text-wp-green mb-2">✓ Richtig: Lokaler Fachbetrieb + 3 Angebote vergleichen</p>
                <p className="text-wp-text2 text-sm leading-relaxed">
                  Lokale Betriebe in {city.name} kennen die Netzbetreiber für den WP-Sondertarif,
                  die lokalen Auflagen in {city.bundesland} und sind im Störungsfall schnell vor Ort.
                  Mit 3 vollständigen Vergleichsangeboten sparen Sie im Schnitt {fmtEuro(Math.round(foerd.zuschuss * 0.25))} gegenüber dem ersten Angebot.
                  Wir holen diese Angebote für Sie kostenlos in 48 Stunden ein.
                </p>
              </div>
            </div>
          </div>

          {/* Checkliste mit Bild */}
          <div id="checkliste">
            <p className="text-wp-green text-xs font-bold uppercase tracking-widest mb-2">Vollständiges Angebot</p>
            <h2 className="font-heading font-bold text-wp-text mb-6" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              Checkliste: Was ein Angebot enthalten muss
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden h-48 sm:h-full min-h-48">
                <img src={IMGS.pump} alt="Wärmepumpe Installation" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,16,.80) 0%, transparent 55%)' }} />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-sm">Vollständige Angebote</p>
                  <p className="text-[rgba(255,255,255,0.65)] text-xs">&gt;60% der Angebote sind unvollständig (VZ)</p>
                </div>
              </div>
              <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
                {CHECKLIST.map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i < CHECKLIST.length - 1 ? 'border-b border-wp-border' : ''}`}>
                    <CheckCircle size={13} className={`mt-0.5 shrink-0 ${item.crit ? 'text-wp-green' : 'text-wp-text3'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-wp-text text-xs leading-tight">{item.item}</p>
                      <p className="text-wp-text3 text-xs mt-0.5">{item.note}</p>
                    </div>
                    {item.crit && <span className="bg-wp-greenlt text-wp-green text-xs font-bold px-2 py-0.5 rounded-full shrink-0">Pflicht</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lokal vs. Bundesweit */}
          <div>
            <p className="text-wp-green text-xs font-bold uppercase tracking-widest mb-2">Vergleich</p>
            <h2 className="font-heading font-bold text-wp-text mb-5" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              Lokaler Betrieb vs. bundesweiter Anbieter in {city.name}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-wp-border shadow-wp-sm">
              <table className="w-full bg-white min-w-[500px]">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #0A1910 0%, #1B3D28 100%)' }}>
                    <th className="px-5 py-4 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider">Kriterium</th>
                    <th className="px-5 py-4 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider">Bundesweite Anbieter</th>
                    <th className="px-5 py-4 text-left text-wp-green3 text-xs font-bold uppercase tracking-wider">Lokal in {city.name} ✓</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Reaktionszeit bei Störung', '24–72 Stunden', city.einwohner >= 500000 ? '< 12 Stunden' : '< 8 Stunden'],
                    ['WP-Sondertarif beantragen', 'Nicht immer möglich', `✓ Kennt lokale Netzbetreiber in ${city.name}`],
                    [`${city.bundesland}-Auflagen`, 'Standardisiert', `✓ Vollständig bekannt — Schallschutz, Abstände`],
                    ['Herstellerbindung', 'Oft an eigene Marken', '✓ Herstellerunabhängig — beste Geräte für Ihr Haus'],
                    ['KfW-LuL-Antrag', '✓ Ja', '✓ Ja — alle unsere Partner registriert'],
                    ['Preistransparenz', 'Oft Festpreismodell', '✓ Einzelne Positionen ausgewiesen'],
                    ['Wartung & Service', 'Zentral koordiniert', '✓ Direktkontakt lokaler Betrieb'],
                  ].map(([label, them, us], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-wp-bg/40'}>
                      <td className="px-5 py-3.5 font-semibold text-wp-text text-sm border-b border-wp-border">{label}</td>
                      <td className="px-5 py-3.5 text-wp-text3 text-sm border-b border-wp-border">{them}</td>
                      <td className="px-5 py-3.5 text-wp-green font-medium text-sm border-b border-wp-border">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* So läuft es ab — Prozess mit Bild */}
          <div>
            <p className="text-wp-green text-xs font-bold uppercase tracking-widest mb-2">Der Prozess</p>
            <h2 className="font-heading font-bold text-wp-text mb-6" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              Von der Anfrage zur fertigen Wärmepumpe in {city.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                {[
                  { t: 'Tag 1', title: 'Ihre kostenlose Anfrage', text: '2 Minuten Formular — PLZ, Gebäudetyp, Heizung, Zeitplan. Keine Registrierung, kein Vertrag.', color: '#1B5E37' },
                  { t: 'Tag 2–3', title: 'Betriebe melden sich', text: 'Bis zu 3 LuL-registrierte Fachbetriebe aus ' + city.name + ' kontaktieren Sie direkt. KfW-Antrag wird von ihnen gestellt.', color: '#2A7D4F' },
                  { t: 'Woche 2', title: 'Vor-Ort-Termin & Angebot', text: 'Heizlastberechnung vor Ort, Angebot mit allen Positionen. Dann KfW-Antrag VOR Vertragsabschluss stellen.', color: '#D97706' },
                  { t: 'Woche 6–12', title: 'Installation', text: '1–3 Tage Montage. Hydraulischer Abgleich. Wärmemengenzähler. Betriebsbereit.', color: '#D97706' },
                  { t: 'Woche 14–20', title: fmtEuro(foerd.zuschuss) + ' auf Ihrem Konto', text: 'Verwendungsnachweis einreichen → KfW-Auszahlung in 4–8 Wochen.', color: '#1B5E37' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ background: s.color }} />
                      {i < 4 && <div className="w-0.5 flex-1 mt-1" style={{ background: s.color + '40' }} />}
                    </div>
                    <div className="pb-4 flex-1">
                      <span className="text-wp-text3 text-xs font-bold">{s.t}</span>
                      <p className="font-heading font-bold text-wp-text text-sm mt-0.5 mb-1">{s.title}</p>
                      <p className="text-wp-text2 text-xs leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <img src={IMGS.outdoor} alt={`Luft-Wasser-Wärmepumpe Installation ${city.name}`} className="w-full h-full object-cover" style={{ minHeight: 280 }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,16,.85) 0%, transparent 50%)' }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-sm mb-1">Fertige Installation</p>
                  <p className="text-[rgba(255,255,255,0.65)] text-xs">JAZ {jaz} in {city.name} · {fmtEuro(foerd.zuschuss)} KfW</p>
                </div>
              </div>
            </div>
          </div>

          {/* GEG Urgency */}
          {isUrgent && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 flex items-start gap-4">
              <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-amber-900 text-xl mb-2">GEG-Frist {city.name}: {gegFristFormatted}</p>
                <p className="text-amber-800 text-sm leading-relaxed mb-3">
                  Als Großstadt über 100.000 Einwohner gilt in {city.name} die 65%-EE-Pflicht für Bestandsgebäude
                  ab {gegFristFormatted}. Bei aktuellen Wartezeiten von {market.wartezeit} müssen Sie jetzt handeln
                  um rechtzeitig fertig zu werden — und sichern sich die volle KfW-Förderung.
                </p>
                <a href="#angebot"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-heading font-bold text-sm rounded-xl hover:bg-amber-700 transition-colors">
                  Jetzt Angebot anfordern <ArrowRight size={14} />
                </a>
              </div>
            </div>
          )}

          {/* Stadtspezifische Standortdaten — macht jede Seite unique */}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
              <div className="px-4 py-3 border-b border-wp-border" style={{ background: 'linear-gradient(135deg, #1A4731 0%, #0A1910 100%)' }}>
                <p className="text-[rgba(255,255,255,0.60)] text-xs font-bold uppercase tracking-wider">{city.name} — Markt & Standort</p>
              </div>
              <div className="p-4 space-y-2">
                {[
                  ['Einwohner', city.einwohner.toLocaleString('de-DE')],
                  ['Jahresmitteltemperatur', city.avgTemp + '°C'],
                  ['Normaußentemperatur', city.normAussentemp + '°C'],
                  ['Heizgradtage', city.heizgradtage.toLocaleString('de-DE') + ' Kd/a'],
                  ['Bundesland', city.bundesland],
                  ['GEG-Frist', gegFristFormatted],
                ].map(([l, v], i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-wp-border last:border-0">
                    <span className="text-wp-text2 text-xs">{l}</span>
                    <span className="font-mono font-bold text-wp-text text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
              <div className="px-4 py-3 border-b border-wp-border bg-wp-dark">
                <p className="text-[rgba(255,255,255,0.60)] text-xs font-bold uppercase tracking-wider">Energie & Wirtschaftlichkeit</p>
              </div>
              <div className="p-4 space-y-2">
                {[
                  ['Strompreis ' + city.name, city.strompreis + ' ct/kWh'],
                  ['Gaspreis aktuell', city.gaspreis + ' ct/kWh'],
                  ['JAZ Luft-WP in ' + city.name, String(jaz)],
                  ['WP-Betriebskosten', fmtEuro(calc.wpKosten) + '/Jahr'],
                  ['Ersparnis vs. Gas', fmtEuro(calc.ersparnis) + '/Jahr'],
                  ['KfW-Eigenanteil', fmtEuro(foerd.eigenanteil)],
                ].map(([l, v], i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-wp-border last:border-0">
                    <span className="text-wp-text2 text-xs">{l}</span>
                    <span className={`font-mono font-bold text-xs ${i === 4 ? 'text-wp-amber' : i === 3 ? 'text-wp-green' : 'text-wp-text'}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="mb-6 p-5 bg-wp-greenxlt border border-wp-greenborder rounded-2xl">
              <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}
          {/* FAQ */}
          <div>
            <p className="text-wp-green text-xs font-bold uppercase tracking-widest mb-2">Häufige Fragen</p>
            <h2 className="font-heading font-bold text-wp-text mb-5" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              Wärmepumpe Installateur {city.name} — FAQ
            </h2>
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

        {/* ══ SIDEBAR ══════════════════════════════════════════ */}
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl shadow-wp-xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #1B3D28 0%, #0A1910 100%)' }}>
            <div className="p-6">
              <p className="text-[rgba(255,255,255,0.50)] text-xs font-bold uppercase tracking-widest mb-1">Markt {city.name}</p>
              <p className="font-mono font-extrabold text-white leading-none mb-0.5" style={{ fontSize: 34 }}>{market.wartezeit}</p>
              <p className="text-[rgba(255,255,255,0.40)] text-xs mb-5">Ø Wartezeit gute Betriebe</p>
              <div className="space-y-2 mb-5">
                {[
                  { l: 'Ø Investitionskosten', v: market.kosten, c: 'text-wp-amber' },
                  { l: `KfW-Zuschuss (${foerd.gesamtSatz}%)`, v: fmtEuro(foerd.zuschuss), c: 'text-wp-green3' },
                  { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-white' },
                  { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-wp-green3' },
                  { l: 'JAZ in ' + city.name, v: String(jaz), c: 'text-white' },
                  { l: 'GEG-Frist', v: gegFristFormatted, c: isUrgent ? 'text-amber-400' : 'text-white' },
                ].map(r => (
                  <div key={r.l} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.08)]">
                    <span className="text-[rgba(255,255,255,0.45)] text-xs">{r.l}</span>
                    <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <a href="#angebot"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-wp-green text-white rounded-xl font-heading font-bold text-sm hover:bg-wp-green2 transition-colors">
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
            {['HWK-geprüfte Meisterbetriebe', 'KfW-LuL-Registrierung', 'Heizlastberechnung inklusive', `Lokal in ${city.name}`, '100% kostenlos für Sie'].map(t => (
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