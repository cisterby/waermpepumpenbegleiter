// app/kontakt/page.tsx — Interaktives Multi-Step Lead-Formular
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, Flame, HelpCircle, Calendar, Zap, Home } from 'lucide-react';

const FORMSPREE = 'https://formspree.io/f/mgopkvpk';

const HEIZUNG_OPTIONS = [
  { id: 'erdgas', icon: '🔥', label: 'Erdgas', sub: 'Gasheizung / Brennwert' },
  { id: 'heizoel', icon: '🛢️', label: 'Heizöl', sub: 'Ölheizung' },
  { id: 'nachtspeicher', icon: '⚡', label: 'Nachtspeicher', sub: 'Elektrische Heizung' },
  { id: 'fernwaerme', icon: '🏙️', label: 'Fernwärme', sub: 'Stadtversorgung' },
  { id: 'waermepumpe', icon: '♻️', label: 'WP vorhanden', sub: 'Möchte tauschen' },
  { id: 'sonstiges', icon: '❓', label: 'Sonstiges', sub: 'Pellets, Kohle, etc.' },
];

const INTENT_OPTIONS = [
  { id: 'angebot', icon: '📋', label: 'Konkretes Angebot', sub: 'Preise vergleichen', badge: 'Beliebt' },
  { id: 'beratung', icon: '💬', label: 'Erstberatung', sub: 'Ob es sich lohnt', badge: null },
  { id: 'foerderung', icon: '💶', label: 'Förderinfo', sub: 'Wie viel KfW?', badge: null },
  { id: 'neugierig', icon: '🔍', label: 'Informieren', sub: 'Kein Zeitdruck', badge: null },
];

const BAUJAHR_OPTIONS = [
  { id: 'vor_1978', label: 'Vor 1978', sub: '~215 kWh/m²' },
  { id: '1979_1994', label: '1979–1994', sub: '~148 kWh/m²' },
  { id: '1995_2009', label: '1995–2009', sub: '~101 kWh/m²' },
  { id: 'ab_2010', label: 'Ab 2010', sub: '~72 kWh/m²' },
];

const FLAECHE_OPTIONS = [
  { id: 'klein', label: '< 100 m²', sub: 'Kleines Haus' },
  { id: 'mittel', label: '100–150 m²', sub: 'Typisches EFH' },
  { id: 'gross', label: '150–250 m²', sub: 'Größeres EFH' },
  { id: 'sehr_gross', label: '> 250 m²', sub: 'Große Immobilie' },
];

const ZEITPLAN_OPTIONS = [
  { id: 'sofort', icon: '🚀', label: 'So schnell wie möglich', sub: 'GEG-Frist oder Ausfall', urgent: true },
  { id: '3monate', icon: '📅', label: '1–3 Monate', sub: 'Plane aktiv' },
  { id: '6monate', icon: '🗓️', label: '3–6 Monate', sub: 'Mittelfristig' },
  { id: 'spaeter', icon: '💭', label: 'Noch unentschieden', sub: 'Informiere mich erst' },
];

const STEPS_META = [
  { label: 'Heizung', icon: Flame },
  { label: 'Ziel', icon: HelpCircle },
  { label: 'Gebäude', icon: Home },
  { label: 'Zeitplan', icon: Calendar },
  { label: 'Kontakt', icon: Zap },
];

type FormData = {
  heizung: string; intent: string; baujahr: string; flaeche: string;
  zeitplan: string; eigentuemer: string; plz: string; name: string;
  email: string; tel: string; nachricht: string; dsgvo: boolean;
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2 } }),
};

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all hover:-translate-y-0.5 relative ${
        selected ? 'border-wp-green bg-wp-greenlt shadow-wp-sm' : 'border-wp-border bg-white hover:border-wp-green/40'
      }`}>
      {selected && <div className="absolute top-3 right-3 w-4 h-4 bg-wp-green rounded-full flex items-center justify-center text-white text-xs">✓</div>}
      {children}
    </button>
  );
}

export default function Kontakt() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [data, setData] = useState[FormData]({ heizung: '', intent: '', baujahr: '', flaeche: '', zeitplan: '', eigentuemer: '', plz: '', name: '', email: '', tel: '', nachricht: '', dsgvo: false });

  const set = (key: keyof FormData, val: string | boolean) => setData(p => ({ ...p, [key]: val }));

  const canNext = () => {
    if (step === 0) return !!data.heizung;
    if (step === 1) return !!data.intent;
    if (step === 2) return !!data.baujahr && !!data.flaeche;
    if (step === 3) return !!data.zeitplan;
    if (step === 4) return !!data.plz && !!data.name && !!data.email && data.dsgvo;
    return true;
  };

  const next = () => { setDir(1); setStep(s => Math.min(4, s + 1)); };
  const prev = () => { setDir(-1); setStep(s => Math.max(0, s - 1)); };

  const submit = async () => {
    setSending(true);
    try {
      await fetch(FORMSPREE, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `WP-Anfrage: ${data.intent} | ${data.plz}` }),
      });
    } finally { setSending(false); setSent(true); }
  };

  if (sent) return (
    <div className="min-h-screen bg-wp-bg font-sans flex items-center justify-center pt-20 px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}
        className="bg-white rounded-2xl shadow-wp-lg p-10 max-w-md w-full text-center border border-wp-border">
        <div className="w-20 h-20 bg-wp-greenlt rounded-full flex items-center justify-center mx-auto mb-5">
          [CheckCircle size={40} className="text-wp-green" |]
        </div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-2">Anfrage eingegangen! 🎉</h2>
        <p className="text-wp-text2 text-sm leading-relaxed mb-6">
          Hallo <strong>{data.name}</strong> — Ihre Anfrage ist bei uns. Innerhalb von 48h
          melden sich geprüfte Fachbetriebe aus <strong>{data.plz}</strong> direkt bei Ihnen.
        </p>
        <div className="bg-wp-greenlt rounded-xl p-4 mb-6 text-left space-y-1">
          {[['Heizung', data.heizung], ['Ziel', data.intent], ['PLZ', data.plz], ['Zeitplan', data.zeitplan]].map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 text-xs text-wp-text2">
              [CheckCircle size={10} className="text-wp-green shrink-0" |]
              <span className="font-semibold">{k}:</span> {v}
            </div>
          ))}
        </div>
        [Link href="|ratgeber" className="inline-flex items-center gap-2 px-5 py-3 bg-wp-green text-white font-semibold text-sm rounded-xl hover:bg-wp-green2 transition-all"]
          Ratgeber lesen [ArrowRight size={14} |]
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(160deg, #0A1910 0%, #1A3728 50%, #0f2318 100%)' }}>

      {/* Background dots */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(61,161,106,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-wp-green/20 border border-wp-green3/30 rounded-full px-4 py-2 mb-5">
              <span className="w-1.5 h-1.5 bg-wp-green3 rounded-full animate-pulse-dot" />
              <span className="text-wp-green3 text-xs font-bold uppercase tracking-wider">Kostenlose Anfrage</span>
            </div>
            <h1 className="font-heading font-extrabold text-white text-4xl mb-3">
              Wärmepumpe anfragen
            </h1>
            <p className="text-[rgba(255,255,255,0.55)] text-base">
              2 Minuten · Kostenlos · Bis zu 3 geprüfte lokale Betriebe
            </p>
          </motion.div>

          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS_META.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    i < step ? 'bg-wp-green text-white' :
                    i === step ? 'bg-white text-wp-green' :
                    'bg-[rgba(255,255,255,0.10)] text-[rgba(255,255,255,0.30)]'
                  }`}>
                    {i < step ? [CheckCircle size={16} |] : [Icon size={15} |]}
                  </div>
                  {i < STEPS_META.length - 1 && (
                    <div className={`w-8 h-0.5 transition-all ${i < step ? 'bg-wp-green' : 'bg-[rgba(255,255,255,0.15)]'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-wp-xl border border-wp-border overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-wp-bg">
              <motion.div className="h-1 bg-wp-green" animate={{ width: `${(step / 4) * 100}%` }} transition={{ duration: 0.4 }} />
            </div>

            <div className="p-8" style={{ minHeight: 360 }}>
              [AnimatePresence mode="wait" custom={dir}]
                <motion.div key={step} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">

                  {/* Step 0 */}
                  {step === 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-wp-greenlt rounded-xl flex items-center justify-center">[Flame size={18} className="text-wp-green" |]</div>
                        <div>
                          <h2 className="font-heading font-bold text-wp-text text-xl">Welche Heizung haben Sie aktuell?</h2>
                          <p className="text-wp-text3 text-xs">Schritt 1 von 5</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {HEIZUNG_OPTIONS.map(opt => (
                          [OptionCard key={opt.id} selected={data.heizung === opt.id} onClick={() =] set('heizung', opt.id)}>
                            <span className="text-2xl block mb-2">{opt.icon}</span>
                            <p className="font-semibold text-wp-text text-sm">{opt.label}</p>
                            <p className="text-wp-text3 text-xs mt-0.5">{opt.sub}</p>
                          </OptionCard>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 1 */}
                  {step === 1 && (
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-wp-greenlt rounded-xl flex items-center justify-center">[HelpCircle size={18} className="text-wp-green" |]</div>
                        <div>
                          <h2 className="font-heading font-bold text-wp-text text-xl">Was suchen Sie?</h2>
                          <p className="text-wp-text3 text-xs">Schritt 2 von 5</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {INTENT_OPTIONS.map(opt => (
                          [OptionCard key={opt.id} selected={data.intent === opt.id} onClick={() =] set('intent', opt.id)}>
                            {opt.badge && <span className="absolute top-3 right-3 bg-wp-amber text-white text-xs font-bold px-2 py-0.5 rounded-full">{opt.badge}</span>}
                            <span className="text-2xl block mb-2">{opt.icon}</span>
                            <p className="font-semibold text-wp-text text-sm">{opt.label}</p>
                            <p className="text-wp-text3 text-xs mt-0.5">{opt.sub}</p>
                          </OptionCard>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-wp-greenlt rounded-xl flex items-center justify-center">[Home size={18} className="text-wp-green" |]</div>
                        <div>
                          <h2 className="font-heading font-bold text-wp-text text-xl">Ihr Gebäude</h2>
                          <p className="text-wp-text3 text-xs">Schritt 3 von 5</p>
                        </div>
                      </div>
                      <p className="font-semibold text-wp-text text-sm mb-3">Baujahr</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                        {BAUJAHR_OPTIONS.map(opt => (
                          [OptionCard key={opt.id} selected={data.baujahr === opt.id} onClick={() =] set('baujahr', opt.id)}>
                            <p className="font-semibold text-wp-text text-xs text-center">{opt.label}</p>
                            <p className="text-wp-text3 text-xs text-center mt-0.5">{opt.sub}</p>
                          </OptionCard>
                        ))}
                      </div>
                      <p className="font-semibold text-wp-text text-sm mb-3">Wohnfläche</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                        {FLAECHE_OPTIONS.map(opt => (
                          [OptionCard key={opt.id} selected={data.flaeche === opt.id} onClick={() =] set('flaeche', opt.id)}>
                            <p className="font-semibold text-wp-text text-xs text-center">{opt.label}</p>
                            <p className="text-wp-text3 text-xs text-center mt-0.5">{opt.sub}</p>
                          </OptionCard>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ id: 'eigennutzer', e: '🏠', l: 'Eigennutzer', s: 'KfW: mind. 50%' }, { id: 'vermieter', e: '🏢', l: 'Vermieter', s: 'KfW: 30%' }].map(opt => (
                          [OptionCard key={opt.id} selected={data.eigentuemer === opt.id} onClick={() =] set('eigentuemer', opt.id)}>
                            <span className="text-xl block mb-1">{opt.e}</span>
                            <p className="font-semibold text-wp-text text-sm">{opt.l}</p>
                            <p className="text-wp-green text-xs font-semibold">{opt.s}</p>
                          </OptionCard>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-wp-greenlt rounded-xl flex items-center justify-center">[Calendar size={18} className="text-wp-green" |]</div>
                        <div>
                          <h2 className="font-heading font-bold text-wp-text text-xl">Wann möchten Sie handeln?</h2>
                          <p className="text-wp-text3 text-xs">Schritt 4 von 5</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ZEITPLAN_OPTIONS.map(opt => (
                          [OptionCard key={opt.id} selected={data.zeitplan === opt.id} onClick={() =] set('zeitplan', opt.id)}>
                            {opt.urgent && <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">Dringend</span>}
                            <span className="text-2xl block mb-2">{opt.icon}</span>
                            <p className="font-semibold text-wp-text text-sm">{opt.label}</p>
                            <p className="text-wp-text3 text-xs mt-0.5">{opt.sub}</p>
                          </OptionCard>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4 */}
                  {step === 4 && (
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-wp-amber/15 rounded-xl flex items-center justify-center">[Zap size={18} className="text-wp-amber" |]</div>
                        <div>
                          <h2 className="font-heading font-bold text-wp-text text-xl">Fast geschafft!</h2>
                          <p className="text-wp-text3 text-xs">Schritt 5 von 5</p>
                        </div>
                      </div>
                      {/* Summary */}
                      <div className="bg-wp-greenlt border border-wp-green3/20 rounded-xl p-4 mb-5 grid grid-cols-2 gap-2">
                        {[['Heizung', data.heizung], ['Ziel', data.intent], ['Baujahr', data.baujahr], ['Zeitplan', data.zeitplan]].map(([k, v]) => (
                          <div key={k} className="text-xs"><span className="text-wp-text3">{k}: </span><span className="font-semibold text-wp-green">{v}</span></div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-wp-text mb-1.5">Name *</label>
                            <input value={data.name} onChange={e => set('name', e.target.value)} placeholder="Vorname Nachname"
                              className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text bg-wp-bg focus:outline-none focus:border-wp-green" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-wp-text mb-1.5">PLZ *</label>
                            <input value={data.plz} onChange={e => set('plz', e.target.value)} placeholder="12345"
                              className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text bg-wp-bg focus:outline-none focus:border-wp-green" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-wp-text mb-1.5">E-Mail *</label>
                          <input type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder="ihre@email.de"
                            className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text bg-wp-bg focus:outline-none focus:border-wp-green" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-wp-text mb-1.5">Telefon <span className="text-wp-text3 font-normal">(optional, für schnellere Rückmeldung)</span></label>
                          <input type="tel" value={data.tel} onChange={e => set('tel', e.target.value)} placeholder="+49 151 ..."
                            className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text bg-wp-bg focus:outline-none focus:border-wp-green" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-wp-text mb-1.5">Besondere Hinweise <span className="text-wp-text3 font-normal">(optional)</span></label>
                          <textarea value={data.nachricht} onChange={e => set('nachricht', e.target.value)} rows={3}
                            placeholder="z.B. Altbau mit alten Heizkörpern, bereits Angebot vorhanden..."
                            className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text bg-wp-bg focus:outline-none focus:border-wp-green resize-none" />
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={data.dsgvo} onChange={e => set('dsgvo', e.target.checked)} className="mt-0.5 w-4 h-4 accent-wp-green" />
                          <span className="text-xs text-wp-text2 leading-relaxed">
                            Ich stimme der Weitergabe meiner Daten an lokale Fachbetriebe zur Angebotserstellung zu.{' '}
                            [Link href="|datenschutz" className="text-wp-green underline"]Datenschutz</Link>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-8 py-5 border-t border-wp-border bg-wp-bg/50">
              <button onClick={prev} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${step === 0 ? 'invisible' : 'text-wp-text2 hover:bg-white border border-wp-border'}`}>
                [ArrowLeft size={14} |] Zurück
              </button>
              {step < 4 ? (
                <button onClick={next} disabled={!canNext()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all ${canNext() ? 'bg-wp-green text-white hover:bg-wp-green2 hover:-translate-y-0.5 shadow-wp-sm' : 'bg-wp-border text-wp-text3 cursor-not-allowed'}`}>
                  Weiter [ArrowRight size={14} |]
                </button>
              ) : (
                <button onClick={submit} disabled={!canNext() || sending}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all ${canNext() && !sending ? 'bg-wp-amber text-white hover:bg-amber-700 hover:-translate-y-0.5 shadow-wp-sm' : 'bg-wp-border text-wp-text3 cursor-not-allowed'}`}>
                  {sending ? '⏳ Wird gesendet...' : <>[ArrowRight size={14} |] Kostenlos anfragen</>}
                </button>
              )}
            </div>
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[['🔒', 'DSGVO-konform'], ['💶', '100% Kostenlos'], ['✋', 'Unverbindlich']].map(([icon, text]) => (
              <div key={text} className="bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-xl p-3 text-center">
                <span className="text-lg block mb-1">{icon}</span>
                <span className="text-xs font-semibold text-[rgba(255,255,255,0.60)]">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
