// components/programmatic/templates/InstallateurTemplate.tsx
// waermepumpe-installateur
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, CheckCircle, AlertTriangle, Clock, Shield, Star } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock, getUniqueLocalParagraph, getNearbyLinkContext, getBundeslandParagraph, getGebaeudeParagraph, getEnergieParagraph, getComparisonTable, getLocalTestimonial, getSeasonalAdvice, getCrossKeywordLinks, getInlineLinkedParagraph, getLokaleTiefenanalyse } from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMGS = {
  hero:    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80',
  worker:  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
  pump:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  house:   'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
  outdoor: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
};

const getMarketData = (einwohner: number): { wartezeit: string; kosten: string; note: string; urgent: boolean } => {
  if (einwohner >= 1000000) return { wartezeit: '8–14 Wochen', kosten: '€22.000–€32.000', note: 'Sehr hohe Nachfrage — früh anfragen', urgent: true };
  if (einwohner >= 500000)  return { wartezeit: '6–12 Wochen', kosten: '€20.000–€29.000', note: 'Hohe Nachfrage', urgent: true };
  if (einwohner >= 200000)  return { wartezeit: '5–10 Wochen', kosten: '€18.000–€27.000', note: 'Gute Verfügbarkeit', urgent: false };
  return { wartezeit: '4–8 Wochen', kosten: '€17.000–€26.000', note: 'Gute lokale Auswahl', urgent: false };
};

export default function InstallateurTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean).slice(0, 6);
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const CRITERIA = [
    { icon: '[HWK]', title: 'HWK-Eintragung aktiv', text: `Gültige Eintragung in der Handwerksrolle ${city.bundesland} — Pflicht für jeden Betrieb in ${city.name}.` },
    { icon: '[KfW]', title: 'KfW-LuL-Registrierung', text: `Im KfW-Portal registrierter Lieferanten- und Leistungserbringer — ohne diese: keine BEG-Förderung für ${city.name}.` },
    { icon: '[REF]', title: 'Min. 5 WP-Referenzen', text: `Dokumentierte WP-Installationen — davon ${['mindestens 2 im Altbau', 'mit JAZ-Protokollen', 'in ' + city.bundesland + ' und Umgebung'][cityHash(city, 3, 270)]}.` },
    { icon: '[GAS]', title: 'F-Gas-Zertifikat', text: `EU 517/2014 Sachkundenachweis — Pflicht für Kältemittelbefüllung in ${city.name}.` },
    { icon: '[DIN]', title: 'Heizlastberechnung', text: `DIN EN 12831 für ${city.normAussentemp}°C Normaußentemperatur ${city.name} — Pflicht und Grundlage für Dimensionierung.` },
    { icon: '[HPF]', title: 'Betriebshaftpflicht ≥ €1,5 Mio.', text: `Aktive Haftpflicht — Pflicht für alle unsere Partnerbetriebe in ${city.name}.` },
    { icon: '[48H]', title: 'Reaktionszeit ≤ 48h', text: `Lokaler Betrieb in ${city.name} — kein bundesweites Callcenter, schnell vor Ort.` },
  ];
  const CHECKLIST = [
    { item: 'Heizlastberechnung DIN EN 12831', crit: true, note: `Für ${city.normAussentemp}°C Normaußentemperatur ${city.name} — Pflicht` },
    { item: 'Hydraulischer Abgleich', crit: true, note: `KfW-Pflicht — ohne diesen: Förderung weg` },
    { item: 'WP-Modell + kW-Angabe', crit: true, note: 'Vollständige Spezifikation mit COP' },
    { item: 'Kältemittelangabe', crit: true, note: '+5% KfW-Bonus für R290 — muss explizit stehen' },
    { item: 'Pufferspeicher-Volumen', crit: true, note: `Mind. 30 l/kW — für ${city.name} relevant` },
    { item: 'Elektroinstallation separat', crit: true, note: `Starkstromkreis + Netzbetreiber ${city.name}` },
    { item: 'Wärmemengenzähler', crit: true, note: 'KfW-Pflicht 2026' },
    { item: 'Inbetriebnahme F-Gas-Betrieb', crit: true, note: 'EU 517/2014' },
    { item: 'Garantiezeiten', crit: false, note: `Herstellergarantie in ${city.bundesland}` },
    { item: 'KfW-Begleitung inklusive', crit: false, note: `Seriöse Betriebe in ${city.name} bieten das an` },
    { item: 'Wartungsvertrag-Angebot', crit: false, note: '€200–400/Jahr — optional' },
  ];

  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const market = getMarketData(city.einwohner);
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const v = cityHash(city, 4, 60);

  const intros = [
    `In ${city.name} gibt es sowohl lokale SHK-Meisterbetriebe als auch bundesweite Anbieter wie Thermondo oder Enpal. Der entscheidende Unterschied: Lokale Betriebe kennen die Auflagen in ${city.bundesland}, die Netzbetreiber für den WP-Sondertarif und sind bei Störungen innerhalb von Stunden vor Ort — nicht in Tagen.`,
    `Nicht jeder SHK-Betrieb in ${city.name} der 'Wärmepumpen' anbietet ist auch ein KfW-tauglicher Fachbetrieb. Entscheidend: KfW-LuL-Registrierung (ohne die kein Antrag möglich), mindestens 5 dokumentierte WP-Installationen in 24 Monaten und ein aktiver Meisterbetrieb. Alle unsere Partner erfüllen das — und haben Kapazitäten in ${city.name}.`,
    `Die Wartezeit für qualifizierte Wärmepumpen-Installateure in ${city.name} beträgt aktuell ${market.wartezeit}. Wer jetzt anfrägt sichert Kapazität für die nächste Heizsaison — und handelt rechtzeitig vor der GEG-Frist am ${gegFristFormatted}. Unser Service vermittelt in 48 Stunden bis zu 3 vollständige Angebote.`,
    `Die Verbraucherzentrale empfiehlt: Mindestens 3 Vergleichsangebote einholen, alle Positionen einzeln ausweisen lassen und nur KfW-LuL-registrierte Betriebe beauftragen. In ${city.name} holen wir diese Angebote für Sie kostenlos ein — in 48 Stunden, vollständig vergleichbar.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* ══ HERO ══════════════════════════════════════════════ */}
      <div className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Image src={IMGS.hero} alt={`Wärmepumpe Installateur ${city.name}`}
          className="absolute inset-0 w-full h-full object-cover" fill priority />
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

          <h1 className="font-extrabold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(32px,4.5vw,62px)' }}>
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
            Kostenlos bis zu 3 Angebote von <strong className="text-white">HWK-geprüften lokalen Meisterbetrieben</strong> in {city.name} vergleichen.
            Alle Partner sind KfW-LuL-registriert — das ist Voraussetzung für Ihre{' '}
            <strong className="text-[#3DA16A]">{fmtEuro(foerd.zuschuss)}</strong> KfW-Förderung.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a href="#angebot"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A4731] text-white font-bold rounded-xl hover:bg-[#2D7A52] transition-all hover:-translate-y-0.5 shadow-lg shadow-green-900/30">
              3 Angebote anfordern <ArrowRight size={16} />
            </a>
            <a href="#checkliste"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.20)] text-white font-semibold rounded-xl hover:bg-[rgba(255,255,255,0.15)] transition-all">
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
                <p className="text-[#3DA16A] text-xs font-bold mb-0.5">{s.label}</p>
                <p className="text-[rgba(255,255,255,0.35)] text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qualitäts-Bar */}
      <div className="bg-[#1A4731] border-b border-[rgba(255,255,255,0.08)] py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-5 flex-wrap">
          <span className="text-[#3DA16A] text-xs font-bold uppercase tracking-widest shrink-0 flex items-center gap-1.5">
            <Shield size={12} />6 Qualitätskriterien
          </span>
          {['HWK-Eintragung', 'Meisterbetrieb', 'KfW-LuL', '5+ WP-Inst.', 'Haftpflicht', 'Ø 4,6/5 Bewertung'].map(s => (
            <span key={s} className="text-[rgba(255,255,255,0.50)] text-xs font-semibold flex items-center gap-1">
              <CheckCircle size={10} className="text-[#3DA16A] shrink-0" />{s}
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
              { icon: <Clock size={20} className="text-[#D97706]" />, label: 'Wartezeit in ' + city.name, val: market.wartezeit, sub: market.note, bg: 'bg-white border-gray-200' },
              { icon: '💶', label: 'Ø Investitionskosten', val: market.kosten, sub: 'Brutto inkl. Installation & Zubehör', bg: 'bg-white border-gray-200' },
              { icon: '📋', label: 'KfW-Zuschuss', val: fmtEuro(foerd.zuschuss), sub: `${foerd.gesamtSatz}% Eigennutzer + Klima-Speed`, bg: 'bg-[#E8F5EE] border-[#3DA16A]/30' },
            ].map((d, i) => (
              <div key={i} className={`bg-white border ${d.bg} rounded-xl p-5 shadow-md`}>
                <div className="mb-3">{typeof d.icon === 'string' ? <span className="text-2xl">{d.icon}</span> : d.icon}</div>
                <p className="font-bold text-[#1C2B2B] text-lg leading-tight mb-0.5">{d.val}</p>
                <p className="text-[#7A9E8E] text-xs font-semibold mb-0.5">{d.label}</p>
                <p className="text-[#7A9E8E] text-xs">{d.sub}</p>
              </div>
            ))}
          </div>

          {/* Featured Snippet */}
          <div className="bg-white rounded-2xl border border-gray-200 border-l-4 border-l-wp-green p-6 shadow-md">
            <p className="text-[#1A4731] text-xs font-bold uppercase tracking-widest mb-2">Direkte Antwort</p>
            <h2 className="font-bold text-[#1C2B2B] text-xl mb-3">
              {fillTemplate(keyword.featuredSnippetQuestions[0] ?? 'Wie finde ich einen guten WP-Installateur in {stadt}?', city, jaz)}
            </h2>
            <p className="text-[#4A6358] text-base leading-relaxed">{intros[v]}</p>
          </div>

          {/* Qualitätskriterien Grid mit Bild */}
          <div>
            <p className="text-[#1A4731] text-xs font-bold uppercase tracking-widest mb-2">Unsere Partnerbetriebe</p>
            <h2 className="font-bold text-[#1C2B2B] mb-6" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              {[
                `6 Kriterien — wie wir Betriebe in ${city.name} prüfen`,
                `So wählen wir die richtigen Fachbetriebe für ${city.name} aus`,
                `Warum sind unsere Partner in ${city.name} besser als Zufallsangebote?`,
                `Unser Prüfprozess für WP-Installateure in ${city.name}`,
              ][cityHash(city, 4, 140)]}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="relative rounded-2xl overflow-hidden h-56">
                <Image src={IMGS.worker} alt={`Wärmepumpe Installateur in ${city.name}`} className="w-full h-full object-cover" fill />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,16,.85) 0%, transparent 55%)' }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-sm mb-1">Geprüfter Fachbetrieb</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-[#D97706] fill-wp-amber" />)}
                    <span className="text-white text-xs ml-1">Ø 4,6 / 5,0</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {CRITERIA.map((c, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <span className="text-xl block mb-1.5">{c.icon}</span>
                    <p className="font-semibold text-[#1C2B2B] text-xs mb-1 leading-tight">{c.title}</p>
                    <p className="text-[#7A9E8E] text-xs leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#E8F5EE] border border-[#3DA16A]/30 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle size={16} className="text-[#1A4731] shrink-0 mt-0.5" />
              <p className="text-[#4A6358] text-sm leading-relaxed">
                <strong className="text-[#1C2B2B]">Laufendes Monitoring:</strong> Nach jeder Vermittlung → Kundenfeedback. Unter Ø 3,5/5 nach 10+ Bewertungen → automatisch entfernt. Kein Betrieb kann sich eine bessere Bewertung erkaufen.
              </p>
            </div>
          </div>

          {/* Haupttext: Worauf achten */}
          <div>
            <p className="text-[#1A4731] text-xs font-bold uppercase tracking-widest mb-2">Worauf achten</p>
            <h2 className="font-bold text-[#1C2B2B] mb-5" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              {[
                `Die häufigsten Fehler bei der Installateur-Wahl in ${city.name}`,
                `Was geht schief, wenn man den falschen Betrieb in ${city.name} wählt?`,
                `Diese Fehler bei der Betriebswahl kosten Eigentümer in ${city.name} teuer`,
                `Warnsignale: So erkennen Sie schlechte Angebote in ${city.name}`,
              ][cityHash(city, 4, 141)]}
            </h2>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <p className="font-bold text-red-800 mb-2">⚠️ Fehler 1: Betrieb ohne KfW-LuL-Registrierung</p>
                <p className="text-red-700 text-sm leading-relaxed">
                  Nur Betriebe die als Lieferant und Leistungserbringer (LuL) im KfW-Energieeffizienz-Portal registriert sind
                  können den Förderantrag stellen. Kein LuL = kein Antrag = keine {fmtEuro(foerd.zuschuss)} Förderung.
                  In {city.name} haben nicht alle SHK-Betriebe diese Registrierung — alle unsere Partner schon.
                  Fragen Sie immer nach der LuL-Registrierungsnummer.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="font-bold text-amber-800 mb-2">⚠️ Fehler 2: Unvollständige Angebote</p>
                <p className="text-[#4A6358] text-sm leading-relaxed mb-3">
                {[
                  `Hydraulischer Abgleich (€500–1.500, KfW-Pflicht), Wärmemengenzähler (ab 2026 KfW-Pflicht), Elektroinstallation (€500–1.500) — diese Positionen fehlen in vielen Angeboten in ${city.name} und werden nachträglich extra berechnet.`,
                  `In ${city.name} oft vergessen: Hydraulischer Abgleich (€500–1.500, KfW-Pflicht), Starkstrom-Kreis (€500–1.500) und Wärmemengenzähler (€300–600, ab 2026 KfW-Pflicht). Auf vollständige Ausweisungen im Angebot bestehen.`,
                  `KfW-Pflichtpositionen die viele Betriebe in ${city.name} weglassen: Hydraulischer Abgleich (€500–1.500) und Wärmemengenzähler (€300–600 neu 2026). Beide sind Voraussetzung für den BEG-Verwendungsnachweis.`,
                  `Für ${city.name}: Ohne Hydraulischen Abgleich (€500–1.500) und Wärmemengenzähler (€300–600) wird der KfW-Verwendungsnachweis abgelehnt. Diese Positionen müssen im Angebot ausgewiesen sein.`,
                ][cityHash(city, 4, 360)]}
              </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="font-bold text-amber-800 mb-2">⚠️ Fehler 3: Keine Heizlastberechnung</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Ohne Heizlastberechnung nach DIN EN 12831 ist eine korrekte Auslegung nicht möglich.
                  Zu große WP taktet häufig — das senkt die JAZ auf {(jaz - 0.5).toFixed(1)} oder schlechter
                  und verkürzt die Lebensdauer erheblich. Zu kleine WP reicht bei Kälte nicht aus.
                  Jedes seriöse Angebot in {city.name} enthält diese Berechnung.
                </p>
              </div>
              <div className="bg-[#E8F5EE] border border-[#3DA16A]/30 rounded-xl p-5">
                <p className="font-bold text-[#1A4731] mb-2">✓ Richtig: Lokaler Fachbetrieb + 3 Angebote vergleichen</p>
                <p className="text-[#4A6358] text-sm leading-relaxed">
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
            <p className="text-[#1A4731] text-xs font-bold uppercase tracking-widest mb-2">Vollständiges Angebot</p>
            <h2 className="font-bold text-[#1C2B2B] mb-6" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              {[`Checkliste: Was ein WP-Angebot in ${city.name} enthalten muss`,`Vollständiges Angebot in ${city.name} — diese Punkte prüfen`,`WP-Angebotscheck für ${city.name} — darauf achten`,`Was muss drinstehen? Prüfliste für Angebote in ${city.name}`][cityHash(city,4,330)]}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden h-48 sm:h-full min-h-48">
                <Image src={IMGS.pump} alt="Wärmepumpe Installation" className="w-full h-full object-cover" fill />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,16,.80) 0%, transparent 55%)' }} />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-sm">Vollständige Angebote</p>
                  <p className="text-[rgba(255,255,255,0.65)] text-xs">&gt;60% der Angebote sind unvollständig (VZ)</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
                {CHECKLIST.map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i < CHECKLIST.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <CheckCircle size={13} className={`mt-0.5 shrink-0 ${item.crit ? 'text-[#1A4731]' : 'text-[#7A9E8E]'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1C2B2B] text-xs leading-tight">{item.item}</p>
                      <p className="text-[#7A9E8E] text-xs mt-0.5">{item.note}</p>
                    </div>
                    {item.crit && <span className="bg-[#E8F5EE] text-[#1A4731] text-xs font-bold px-2 py-0.5 rounded-full shrink-0">Pflicht</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lokal vs. Bundesweit */}
          <div>
            <p className="text-[#1A4731] text-xs font-bold uppercase tracking-widest mb-2">Vergleich</p>
            <h2 className="font-bold text-[#1C2B2B] mb-5" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              {[
                `Lokaler Betrieb vs. bundesweiter Anbieter in ${city.name}`,
                `Warum lohnt sich ein regionaler Installateur in ${city.name}?`,
                `National oder lokal? WP-Installateur in ${city.name} richtig wählen`,
                `Vor-Ort-Betrieb oder bundesweiter Anbieter: Was ist besser für ${city.name}?`,
              ][cityHash(city, 4, 142)]}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
              <table className="w-full bg-white min-w-[500px]">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #0A1910 0%, #1B3D28 100%)' }}>
                    <th className="px-5 py-4 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider">Kriterium</th>
                    <th className="px-5 py-4 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider">Bundesweite Anbieter</th>
                    <th className="px-5 py-4 text-left text-[#3DA16A] text-xs font-bold uppercase tracking-wider">Lokal in {city.name} ✓</th>
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
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]/40'}>
                      <td className="px-5 py-3.5 font-semibold text-[#1C2B2B] text-sm border-b border-gray-200">{label}</td>
                      <td className="px-5 py-3.5 text-[#7A9E8E] text-sm border-b border-gray-200">{them}</td>
                      <td className="px-5 py-3.5 text-[#1A4731] font-medium text-sm border-b border-gray-200">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* So läuft es ab — Prozess mit Bild */}
          <div>
            <p className="text-[#1A4731] text-xs font-bold uppercase tracking-widest mb-2">Der Prozess</p>
            <h2 className="font-bold text-[#1C2B2B] mb-6" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              {h2s.prozess}
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
                      <span className="text-[#7A9E8E] text-xs font-bold">{s.t}</span>
                      <p className="font-bold text-[#1C2B2B] text-sm mt-0.5 mb-1">{s.title}</p>
                      <p className="text-[#4A6358] text-xs leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={IMGS.outdoor} alt={`Luft-Wasser-Wärmepumpe Installation ${city.name}`} className="w-full h-full object-cover" fill style={{ minHeight: 280 }} />
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
                <p className="font-bold text-amber-900 text-xl mb-2">GEG-Frist {city.name}: {gegFristFormatted}</p>
                <p className="text-amber-800 text-sm leading-relaxed mb-3">
                  Als Großstadt über 100.000 Einwohner gilt in {city.name} die 65%-EE-Pflicht für Bestandsgebäude
                  ab {gegFristFormatted}. Bei aktuellen Wartezeiten von {market.wartezeit} müssen Sie jetzt handeln
                  um rechtzeitig fertig zu werden — und sichern sich die volle KfW-Förderung.
                </p>
                <a href="#angebot"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition-colors">
                  Jetzt Angebot anfordern <ArrowRight size={14} />
                </a>
              </div>
            </div>
          )}

          {/* Stadtspezifische Standortdaten — macht jede Seite unique */}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
              <div className="px-4 py-3 border-b border-gray-200" style={{ background: 'linear-gradient(135deg, #1A4731 0%, #0A1910 100%)' }}>
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
                  <div key={i} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                    <span className="text-[#4A6358] text-xs">{l}</span>
                    <span className="font-mono font-bold text-[#1C2B2B] text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
              <div className="px-4 py-3 border-b border-gray-200 bg-[#1A4731]">
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
                  <div key={i} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                    <span className="text-[#4A6358] text-xs">{l}</span>
                    <span className={`font-mono font-bold text-xs ${i === 4 ? 'text-[#D97706]' : i === 3 ? 'text-[#1A4731]' : 'text-[#1C2B2B]'}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

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

          {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="mb-6 p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}
          {/* FAQ */}
          <div>
            <p className="text-[#1A4731] text-xs font-bold uppercase tracking-widest mb-2">Häufige Fragen</p>
            <h2 className="font-bold text-[#1C2B2B] mb-5" style={{ fontSize: 'clamp(22px,2.8vw,36px)' }}>
              {h2s.faq}
            </h2>
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

          {/* Unique lokaler Absatz */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Installateur-Markt in {city.name} — lokale Besonderheiten</h3>
            <p className="text-[#4A6358] text-sm leading-relaxed">{uniqueParagraph}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Installateure in der Region</h3>
              <div className="flex flex-wrap gap-2">
                {nearbyLinks.map(nl => (
                  <Link key={nl.city.slug} href={nl.url}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {nl.text}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen für {city.name}</h3>
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

        {/* ══ SIDEBAR ══════════════════════════════════════════ */}
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #1B3D28 0%, #0A1910 100%)' }}>
            <div className="p-6">
              <p className="text-[rgba(255,255,255,0.50)] text-xs font-bold uppercase tracking-widest mb-1">Markt {city.name}</p>
              <p className="font-mono font-extrabold text-white leading-none mb-0.5" style={{ fontSize: 34 }}>{market.wartezeit}</p>
              <p className="text-[rgba(255,255,255,0.40)] text-xs mb-5">Ø Wartezeit gute Betriebe</p>
              <div className="space-y-2 mb-5">
                {[
                  { l: 'Ø Investitionskosten', v: market.kosten, c: 'text-[#D97706]' },
                  { l: `KfW-Zuschuss (${foerd.gesamtSatz}%)`, v: fmtEuro(foerd.zuschuss), c: 'text-[#3DA16A]' },
                  { l: 'Ihr Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-white' },
                  { l: 'Ersparnis/Jahr', v: fmtEuro(calc.ersparnis), c: 'text-[#3DA16A]' },
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
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#1A4731] text-white rounded-xl font-bold text-sm hover:bg-[#2D7A52] transition-colors">
                3 Angebote anfordern <ArrowRight size={14} />
              </a>
              <p className="text-[rgba(255,255,255,0.25)] text-xs text-center mt-2">Kostenlos · Unverbindlich · 48h</p>
            </div>
          </div>
          <div id="angebot">
            <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          </div>

          <AuthorBox keywordSlug={keyword.slug} />
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            {['HWK-geprüfte Meisterbetriebe', 'KfW-LuL-Registrierung', 'Heizlastberechnung inklusive', `Lokal in ${city.name}`, '100% kostenlos für Sie'].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-gray-200 last:border-0 text-xs text-[#4A6358]">
                <CheckCircle size={12} className="text-[#1A4731] shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-bold text-[#1C2B2B] text-xl mb-6">
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
    </div>
  );
}
