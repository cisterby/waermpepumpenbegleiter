// app/wie-es-funktioniert/page.tsx
// Vollständige E-E-A-T-optimierte Seite mit Animationen + visueller Tiefe
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, ArrowRight, Shield, Clock, Euro, Star, Users, Zap, Award, TrendingUp } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } }) };

function AnimSection({ children, className = '', custom = 0 }: { children: React.ReactNode; className?: string; custom?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={custom} className={className}>
      {children}
    </motion.div>
  );
}

const STEPS = [
  {
    n: '01', icon: '📋', emoji: '✍️',
    title: '2 Minuten: Ihre Anfrage',
    subtitle: 'Einfaches Formular — keine Verpflichtung',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80',
    highlight: 'Ø 1:47 min Ausfüllzeit',
    text: 'Sie beantworten 6 kurze Fragen zu Ihrem Haus: PLZ, Gebäudetyp, Baujahr, aktuelle Heizung, Wohnfläche, und ob Sie Eigennutzer sind. Keine Registrierung, keine E-Mail-Bestätigung, kein Druck.',
    details: ['PLZ → wir finden geprüfte Betriebe in Ihrer Region', 'Gebäudedaten → korrekte Dimensionierung der WP', 'Eigennutzer → bestimmt Ihre maximale KfW-Förderquote', 'Keine Kreditkarte, kein Vertrag, keine Vorauszahlung'],
  },
  {
    n: '02', icon: '🔍', emoji: '🏗️',
    title: '48 Stunden: Wir matchen',
    subtitle: 'Manuelle Prüfung + KfW-Registrierungscheck',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
    highlight: '94% in < 4h weitergeleitet',
    text: 'Unser System gleicht Ihre PLZ mit unserem Netzwerk geprüfter Partnerbetriebe ab. Wir übermitteln Ihre Anfrage an bis zu 3 Betriebe die in Ihrer Region tätig sind, Kapazitäten haben und alle unsere Qualitätskriterien erfüllen.',
    details: ['HWK-Eintragung geprüft — kein Betrieb ohne gültige Handwerksrolle', 'KfW-LuL-Registrierung bestätigt — Voraussetzung für Förderung', 'Mindestens 5 WP-Installationen in den letzten 24 Monaten', 'Aktuelle Haftpflichtversicherung für Heizungsbau nachgewiesen'],
  },
  {
    n: '03', icon: '📞', emoji: '🤝',
    title: 'Fachbetriebe melden sich',
    subtitle: 'Persönlich, kostenlos & unverbindlich',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
    highlight: 'Ø Bewertung: 4,6 / 5,0',
    text: 'Die vermittelten Betriebe kontaktieren Sie direkt. Im kostenlosen Erstgespräch besprechen sie Ihre Situation, prüfen die Eignung Ihres Hauses und vereinbaren den nächsten Schritt: die Vor-Ort-Begehung mit Heizlastberechnung.',
    details: ['SLA: Betriebe müssen sich innerhalb von 48h melden', 'Bei Nicht-Erreichbarkeit: automatische Eskalation an uns', 'Vollständige Angebote mit allen Positionen — kein Kleingedrucktes', 'KfW-Antrag wird vom Betrieb als LuL gestellt'],
  },
  {
    n: '04', icon: '✅', emoji: '🏆',
    title: 'Entscheiden & KfW kassieren',
    subtitle: 'Bis zu €21.000 auf Ihr Konto',
    img: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=900&q=80',
    highlight: 'Ø Preisunterschied: 24%',
    text: 'Sie erhalten bis zu 3 vollständige Angebote. Prüfen Sie ob alle Positionen aufgeführt sind: hydraulischer Abgleich, Elektrik, Fundament. Nach der Installation: KfW-Verwendungsnachweis einreichen, €21.000 warten.',
    details: ['KfW-Antrag zwingend VOR Vertragsabschluss — nie danach', 'Verwendungsnachweis = Rechnung + Bestätigung des Fachbetriebs', 'Auszahlung durch KfW: 4–8 Wochen nach Einreichung', 'Kein Auftrag zustande? Keine Kosten — für niemanden'],
  },
];

const QUALITY = [
  { icon: '🏛️', title: 'HWK-Eintragung', text: 'Aktive Eintragung in der Handwerksrolle — jährlich geprüft.' },
  { icon: '👨‍🔧', title: 'Meisterbetrieb', text: 'Persönliche technische Leitung durch einen Meister.' },
  { icon: '📊', title: '5+ WP-Installationen', text: 'Dokumentierte Erfahrung in den letzten 24 Monaten.' },
  { icon: '🏦', title: 'KfW-LuL-Registrierung', text: 'Ohne das kein KfW-Antrag — alle Partner registriert.' },
  { icon: '🛡️', title: 'Haftpflicht', text: 'Gültige Betriebshaftpflicht für Heizungsbau.' },
  { icon: '⭐', title: 'Kundenbewertung', text: 'Unter 3,5/5 nach 10+ Bewertungen → Ausschluss.' },
];

const FAQS = [
  { q: 'Was kostet der Service?', a: 'Gar nichts für Hausbesitzer. Wir finanzieren uns durch eine Vermittlungsprovision von €50–120, die der beauftragte Installationsbetrieb zahlt — nur wenn ein Auftrag zustande kommt.' },
  { q: 'Bin ich nach der Anfrage zum Kauf verpflichtet?', a: 'Nein. Die Anfrage, alle Beratungsgespräche und alle Angebote sind vollständig unverbindlich. Keine Vertragsbindungen, keine versteckten Klauseln.' },
  { q: 'Was wenn sich kein Betrieb meldet?', a: 'Unser SLA: Betriebe müssen sich innerhalb von 48h melden. Tun sie das nicht, informieren wir Sie und suchen einen alternativen Betrieb.' },
  { q: 'Wie wählt ihr die Betriebe aus — nach Provision?', a: 'Nein. Auswahl nach PLZ-Nähe, Kapazität und Qualitätsprüfung. Kein Betrieb kann sich eine bevorzugte Vermittlung erkaufen.' },
  { q: 'Kann ich auch Erdwärme anfragen?', a: 'Ja. Im Formular können Sie den WP-Typ angeben. Wir haben spezialisierte Betriebe mit Erdbohrung-Erfahrung im Netzwerk.' },
  { q: 'Wie läuft die KfW-Beantragung ab?', a: 'Der vermittelte Betrieb stellt als KfW-LuL den Antrag für Sie. Wichtig: Antrag zwingend VOR dem Vertragsabschluss stellen. Nach Fertigstellung: Verwendungsnachweis → Auszahlung in 4–8 Wochen.' },
];

export default function WieEsFunktioniert() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCounter(c => c < 733 ? c + 7 : 733), 10);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-wp-bg font-sans overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Wie es funktioniert"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(10,25,16,0.96) 0%, rgba(10,25,16,0.85) 50%, rgba(10,25,16,0.5) 100%)' }} />

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(76,175,125,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,125,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 bg-wp-green/20 border border-wp-green3/40 rounded-full px-4 py-2 mb-6">
                  <span className="w-1.5 h-1.5 bg-wp-green3 rounded-full animate-pulse-dot" />
                  <span className="text-wp-green3 text-xs font-bold uppercase tracking-wider">100% Kostenlos für Hausbesitzer</span>
                </div>
                <h1 className="font-heading font-extrabold text-white leading-tight mb-6" style={{ fontSize: 'clamp(36px,5vw,64px)' }}>
                  So funktioniert<br />
                  <span className="text-wp-green3">Wärmepumpen</span>begleiter
                </h1>
                <p className="text-[rgba(255,255,255,0.70)] text-lg leading-relaxed mb-8 max-w-lg">
                  Vom ersten Klick bis zu €21.000 KfW auf Ihrem Konto — in 4 einfachen Schritten,
                  mit geprüften lokalen Fachbetrieben in 733 deutschen Städten.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/kontakt"
                    className="flex items-center gap-2 px-7 py-4 bg-wp-amber text-white font-heading font-bold rounded-xl hover:bg-amber-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-900/30">
                    Jetzt kostenlos anfragen <ArrowRight size={16} />
                  </Link>
                  <Link href="/rechner"
                    className="flex items-center gap-2 px-7 py-4 bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.20)] text-white font-heading font-semibold rounded-xl hover:bg-[rgba(255,255,255,0.15)] transition-all">
                    Kosten berechnen
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Animated stats card */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
              <div className="bg-[rgba(255,255,255,0.08)] backdrop-blur-sm border border-[rgba(255,255,255,0.15)] rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {[
                    { val: `${counter}`, label: 'Städte abgedeckt', icon: '🗺️' },
                    { val: '€0', label: 'Kosten für Sie', icon: '💶' },
                    { val: '4,6/5', label: 'Kundenbewertung', icon: '⭐' },
                    { val: '6', label: 'Qualitätskriterien', icon: '🛡️' },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                      className="text-center">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="font-mono font-extrabold text-white text-2xl leading-none mb-1">{s.val}</div>
                      <div className="text-[rgba(255,255,255,0.45)] text-xs">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t border-[rgba(255,255,255,0.10)] pt-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Award size={16} className="text-wp-green3" />
                    <span className="text-[rgba(255,255,255,0.70)] text-sm font-semibold">Alle Partner geprüft nach 6 Kriterien</span>
                  </div>
                  {['HWK-eingetragener Meisterbetrieb', 'KfW-LuL-Registrierung aktiv', 'Haftpflicht nachgewiesen'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-[rgba(255,255,255,0.50)] text-xs py-1">
                      <CheckCircle size={11} className="text-wp-green3 shrink-0" />{t}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[rgba(255,255,255,0.30)] text-xs uppercase tracking-widest">Mehr erfahren</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 border-2 border-[rgba(255,255,255,0.20)] rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-white/40 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* ── STEPS ─────────────────────────────────────────────────────────── */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimSection className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-wp-green mb-4">Der Prozess</span>
            <h2 className="font-heading font-bold text-wp-text mb-4" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
              4 Schritte — von der Anfrage<br />zur fertigen Wärmepumpe
            </h2>
            <p className="text-wp-text2 text-base max-w-xl mx-auto">
              Typische Gesamtdauer: 6–12 Wochen. Die KfW-Auszahlung erfolgt nach Abschluss.
            </p>
          </AnimSection>

          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <AnimSection key={i} custom={i * 0.05}>
                <div className={`grid lg:grid-cols-2 gap-0 bg-white rounded-2xl border border-wp-border shadow-wp-md overflow-hidden ${i % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Image side */}
                  <div className={`relative h-64 lg:h-auto overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,25,16,0.7) 0%, rgba(10,25,16,0.2) 100%)' }} />
                    {/* Step number overlay */}
                    <div className="absolute top-6 left-6">
                      <div className="font-mono font-extrabold text-white/20" style={{ fontSize: 80, lineHeight: 1 }}>{step.n}</div>
                    </div>
                    <div className="absolute bottom-6 left-6">
                      <div className="inline-flex items-center gap-2 bg-wp-green/80 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-white text-xs font-bold">{step.highlight}</span>
                      </div>
                    </div>
                    <div className="absolute top-6 right-6 text-4xl">{step.emoji}</div>
                  </div>

                  {/* Content side */}
                  <div className={`p-8 lg:p-10 flex flex-col justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-wp-dark rounded-xl flex items-center justify-center font-mono font-bold text-wp-green3 text-sm">
                        {step.n}
                      </div>
                      <span className="text-wp-green text-sm font-bold uppercase tracking-wider">{step.subtitle}</span>
                    </div>
                    <h3 className="font-heading font-bold text-wp-text text-2xl mb-3">{step.title}</h3>
                    <p className="text-wp-text2 text-sm leading-relaxed mb-6">{step.text}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {step.details.map((d, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-wp-text2">
                          <CheckCircle size={12} className="text-wp-green shrink-0 mt-0.5" />{d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>

          {/* CTA zwischen Steps und Qualität */}
          <AnimSection className="mt-10">
            <div className="relative overflow-hidden bg-wp-dark rounded-2xl p-8 text-center">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 20% 80%, #1B5E37 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3DA16A 0%, transparent 50%)',
              }} />
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-white text-2xl mb-2">Bereit? Anfrage dauert 2 Minuten.</h3>
                <p className="text-[rgba(255,255,255,0.50)] text-sm mb-6">Kostenlos · Unverbindlich · Keine Verpflichtung</p>
                <Link href="/kontakt"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-wp-amber text-white font-heading font-bold rounded-xl hover:bg-amber-700 transition-all hover:-translate-y-0.5">
                  Jetzt kostenlos anfragen <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </AnimSection>
        </div>
      </div>

      {/* ── QUALITÄTSPRÜFUNG ─────────────────────────────────────────────── */}
      <div className="relative py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(160deg, #0A1910 0%, #1A3728 100%)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, rgba(61,161,106,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <AnimSection className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-wp-green3 mb-4">Qualitätssicherung</span>
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: 'clamp(28px,4vw,46px)' }}>
              6 Kriterien — so prüfen wir jeden Partner
            </h2>
            <p className="text-[rgba(255,255,255,0.55)] text-base max-w-xl mx-auto">
              Nicht jeder SHK-Betrieb ist ein Wärmepumpen-Fachbetrieb. Wir unterscheiden das für Sie.
            </p>
          </AnimSection>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {QUALITY.map((c, i) => (
              <AnimSection key={i} custom={i * 0.07}>
                <div className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] rounded-2xl p-6 hover:bg-[rgba(255,255,255,0.10)] transition-colors">
                  <span className="text-3xl block mb-3">{c.icon}</span>
                  <h3 className="font-heading font-bold text-white text-base mb-2">{c.title}</h3>
                  <p className="text-[rgba(255,255,255,0.55)] text-sm leading-relaxed">{c.text}</p>
                </div>
              </AnimSection>
            ))}
          </div>

          {/* Trust metric */}
          <AnimSection>
            <div className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="font-heading font-bold text-white text-lg mb-1">Laufendes Qualitätsmonitoring</p>
                <p className="text-[rgba(255,255,255,0.55)] text-sm leading-relaxed">
                  Nach jeder Vermittlung → Feedbackanfrage. Unter Ø 3,5/5 nach 10+ Bewertungen → automatisch entfernt.
                  Kein Badge kann gekauft werden.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-3 bg-wp-green/20 border border-wp-green3/30 rounded-xl px-6 py-4">
                <div className="text-3xl">⭐</div>
                <div>
                  <p className="font-mono font-extrabold text-white text-3xl leading-none">4,6</p>
                  <p className="text-[rgba(255,255,255,0.40)] text-xs">Ø Partnerbewertung / 5,0</p>
                </div>
              </div>
            </div>
          </AnimSection>
        </div>
      </div>

      {/* ── VERGLEICH ────────────────────────────────────────────────────── */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimSection className="text-center mb-12">
            <h2 className="font-heading font-bold text-wp-text mb-3" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
              Warum nicht direkt zum Installateur?
            </h2>
            <p className="text-wp-text2 text-base max-w-lg mx-auto">Die häufigsten Probleme die Hausbesitzer dabei erleben.</p>
          </AnimSection>
          <AnimSection>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] rounded-2xl border border-wp-border overflow-hidden shadow-wp-sm">
                <thead>
                  <tr className="bg-wp-dark">
                    <th className="px-5 py-4 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider w-1/3">Kriterium</th>
                    <th className="px-5 py-4 text-left text-[rgba(255,255,255,0.40)] text-xs font-bold uppercase tracking-wider w-1/3">Direkt suchen</th>
                    <th className="px-5 py-4 text-left text-wp-green3 text-xs font-bold uppercase tracking-wider w-1/3">Wärmepumpenbegleiter ✓</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['KfW-LuL-Registrierung', 'Muss selbst geprüft werden', '✅ Alle Partner registriert'],
                    ['Vergleichsangebote', 'Aufwändig einzeln anfragen', '✅ Bis zu 3 in 48h'],
                    ['Qualitätskontrolle', 'Keine unabhängige Prüfung', '✅ 6-Kriterien-Check'],
                    ['Vollständige Angebote', 'Oft fehlende Positionen', '✅ Wir prüfen Vollständigkeit'],
                    ['Kosten', 'Kostenlos', '✅ Kostenlos'],
                    ['Aufwand', 'Hoch — 5–10h Recherche', '✅ 2 Minuten Formular'],
                    ['Herstellerneutralität', 'Betriebe oft herstellergebunden', '✅ Wir sind herstellerunabhängig'],
                  ].map(([label, direct, ours], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-wp-bg/50'}>
                      <td className="px-5 py-3.5 font-semibold text-wp-text text-sm border-b border-wp-border">{label}</td>
                      <td className="px-5 py-3.5 text-wp-text3 text-sm border-b border-wp-border">{direct}</td>
                      <td className="px-5 py-3.5 text-wp-green font-medium text-sm border-b border-wp-border">{ours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimSection>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <div className="py-24 px-6 bg-wp-bg">
        <div className="max-w-3xl mx-auto">
          <AnimSection className="text-center mb-10">
            <h2 className="font-heading font-bold text-wp-text mb-3" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
              Häufige Fragen
            </h2>
          </AnimSection>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <AnimSection key={i} custom={i * 0.05}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full bg-white border border-wp-border rounded-xl overflow-hidden text-left">
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-wp-greenlt transition-colors">
                    <span className="font-heading font-semibold text-wp-text text-base pr-4 leading-snug">{faq.q}</span>
                    <span className={`text-wp-green font-bold text-xl shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </div>
                  {openFaq === i && (
                    <div className="px-5 pb-4 pt-2 border-t border-wp-border">
                      <p className="text-wp-text2 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </button>
              </AnimSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <div className="relative py-24 px-6 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A1910 0%, #1B5E37 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(61,161,106,0.6) 0%, transparent 70%)',
        }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="font-heading font-extrabold text-white text-4xl mb-4">
              In 2 Minuten starten
            </h2>
            <p className="text-[rgba(255,255,255,0.55)] mb-8 text-base">
              Kostenlos · Kein Vertrag · Keine Verpflichtung · KfW-Begleitung inklusive
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kontakt"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-wp-amber text-white font-heading font-bold rounded-xl hover:bg-amber-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-900/40">
                Jetzt kostenlos anfragen <ArrowRight size={16} />
              </Link>
              <Link href="/rechner"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[rgba(255,255,255,0.10)] text-white font-heading font-bold rounded-xl hover:bg-[rgba(255,255,255,0.15)] transition-all border border-[rgba(255,255,255,0.20)]">
                Erst Kosten berechnen
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
