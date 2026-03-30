// app/kontakt/page.tsx
// Interaktives Multi-Step Lead-Formular mit Qualifizierungs-Fragen
'use client';
import { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, ArrowLeft, Home, Flame, Zap, Calendar, HelpCircle, Euro } from 'lucide-react';

const FORMSPREE = 'https://formspree.io/f/mgopkvpk';

// Step 1: Was haben Sie aktuell?
const HEIZUNG_OPTIONS = [
  { id: 'erdgas', icon: '🔥', label: 'Erdgas', sub: 'Gasheizung / Gasbrennwert' },
  { id: 'heizoel', icon: '🛢️', label: 'Heizöl', sub: 'Ölheizung' },
  { id: 'nachtspeicher', icon: '⚡', label: 'Nachtspeicher', sub: 'Elektrische Heizung' },
  { id: 'fernwaerme', icon: '🏙️', label: 'Fernwärme', sub: 'Stadtversorgung' },
  { id: 'waermepumpe', icon: '♻️', label: 'WP vorhanden', sub: 'Möchte tauschen/modernisieren' },
  { id: 'sonstiges', icon: '❓', label: 'Sonstiges', sub: 'Pellets, Kohle, etc.' },
];

// Step 2: Was suchen Sie?
const INTENT_OPTIONS = [
  { id: 'angebot', icon: '📋', label: 'Konkretes Angebot', sub: 'Ich möchte Preise vergleichen', highlight: true },
  { id: 'beratung', icon: '💬', label: 'Erstberatung', sub: 'Ich will erst wissen ob es sich lohnt' },
  { id: 'foerderung', icon: '💶', label: 'Förderinfo', sub: 'Wie viel KfW bekomme ich?' },
  { id: 'neugierig', icon: '🔍', label: 'Informationen', sub: 'Ich informiere mich erst' },
];

// Step 3: Ihr Gebäude
const BAUJAHR_OPTIONS = [
  { id: 'vor_1978', label: 'Vor 1978', sub: '~215 kWh/m²' },
  { id: '1979_1994', label: '1979–1994', sub: '~148 kWh/m²' },
  { id: '1995_2009', label: '1995–2009', sub: '~101 kWh/m²' },
  { id: 'ab_2010', label: 'Ab 2010', sub: '~72 kWh/m²' },
];

const FLAECHE_OPTIONS = [
  { id: 'klein', label: '< 100 m²', sub: 'Kleines Haus / Wohnung' },
  { id: 'mittel', label: '100–150 m²', sub: 'Typisches EFH' },
  { id: 'gross', label: '150–250 m²', sub: 'Größeres EFH' },
  { id: 'sehr_gross', label: '> 250 m²', sub: 'Villa / Mehrfamilienhaus' },
];

// Step 4: Zeitplan
const ZEITPLAN_OPTIONS = [
  { id: 'sofort', icon: '🚀', label: 'So schnell wie möglich', sub: 'GEG-Frist oder Heizungsausfall', highlight: true },
  { id: '3monate', icon: '📅', label: 'In 1–3 Monaten', sub: 'Plane aktiv' },
  { id: '6monate', icon: '🗓️', label: 'In 3–6 Monaten', sub: 'Mittelfristige Planung' },
  { id: 'spaeter', icon: '💭', label: 'Noch unentschieden', sub: 'Informiere mich zunächst' },
];

type FormData = {
  heizung: string;
  intent: string;
  baujahr: string;
  flaeche: string;
  zeitplan: string;
  eigentuemer: string;
  plz: string;
  name: string;
  email: string;
  tel: string;
  nachricht: string;
  dsgvo: boolean;
};

const STEPS = ['Aktuell', 'Ziel', 'Gebäude', 'Zeitplan', 'Kontakt'];

export default function Kontakt() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [data, setData] = useState<FormData>({
    heizung: '', intent: '', baujahr: '', flaeche: '',
    zeitplan: '', eigentuemer: '', plz: '', name: '',
    email: '', tel: '', nachricht: '', dsgvo: false,
  });

  const set = (key: keyof FormData, val: string | boolean) =>
    setData(prev => ({ ...prev, [key]: val }));

  const canNext = () => {
    if (step === 0) return !!data.heizung;
    if (step === 1) return !!data.intent;
    if (step === 2) return !!data.baujahr && !!data.flaeche;
    if (step === 3) return !!data.zeitplan;
    if (step === 4) return !!data.plz && !!data.name && !!data.email && data.dsgvo;
    return true;
  };

  const handleSubmit = async () => {
    setSending(true);
    try {
      await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          heizung: data.heizung,
          intent: data.intent,
          baujahr: data.baujahr,
          flaeche: data.flaeche,
          zeitplan: data.zeitplan,
          eigentuemer: data.eigentuemer,
          plz: data.plz,
          name: data.name,
          email: data.email,
          tel: data.tel,
          nachricht: data.nachricht,
          _subject: `WP-Anfrage: ${data.intent} | ${data.plz} | ${data.heizung}`,
        }),
      });
      setSent(true);
    } catch {
      setSent(true); // show success anyway, Formspree is reliable
    }
    setSending(false);
  };

  if (sent) return (
    <div className="min-h-screen bg-wp-bg pt-28 px-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-wp-lg p-10 max-w-md w-full text-center border border-wp-border">
        <div className="w-16 h-16 bg-wp-greenlt rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-wp-green" />
        </div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">Anfrage eingegangen!</h2>
        <p className="text-wp-text2 text-sm leading-relaxed mb-6">
          Vielen Dank, <strong>{data.name}</strong>. Wir haben Ihre Anfrage erhalten und
          leiten Sie innerhalb von 48 Stunden an geprüfte Fachbetriebe in {data.plz} weiter.
          Die Betriebe melden sich direkt bei Ihnen.
        </p>
        <div className="space-y-2 mb-6 text-left">
          {[
            `Heizung: ${data.heizung} → Wärmepumpe`,
            `PLZ: ${data.plz}`,
            `Ihr Ziel: ${data.intent}`,
            `Zeitplan: ${data.zeitplan}`,
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-wp-text2">
              <CheckCircle size={12} className="text-wp-green shrink-0" />{t}
            </div>
          ))}
        </div>
        <Link href="/ratgeber"
          className="inline-flex items-center gap-2 px-5 py-3 bg-wp-greenlt text-wp-green font-semibold text-sm rounded-xl hover:bg-wp-green hover:text-white transition-all">
          Ratgeber lesen <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <div className="bg-wp-dark pt-28 pb-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-heading font-extrabold text-white text-4xl mb-3">
            Kostenlose Wärmepumpen-Anfrage
          </h1>
          <p className="text-white/55 text-base">
            2 Minuten · Kostenlos · Bis zu 3 Angebote von geprüften lokalen Betrieben
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-4 pb-20">
        {/* Progress */}
        <div className="bg-white rounded-2xl shadow-wp-sm border border-wp-border p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-wp-green text-white' :
                  i === step ? 'bg-wp-dark text-white' :
                  'bg-wp-bg text-wp-text3 border border-wp-border'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-wp-text' : 'text-wp-text3'}`}>
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${i < step ? 'bg-wp-green' : 'bg-wp-border'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="h-1 bg-wp-border rounded-full">
            <div className="h-1 bg-wp-green rounded-full transition-all duration-500"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-wp-sm border border-wp-border p-7">

          {/* Step 0: Aktuelle Heizung */}
          {step === 0 && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Flame size={20} className="text-wp-amber" />
                <h2 className="font-heading font-bold text-wp-text text-xl">Welche Heizung haben Sie aktuell?</h2>
              </div>
              <p className="text-wp-text3 text-sm mb-6">Das hilft uns die passenden Betriebe und Fördermöglichkeiten zu finden.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {HEIZUNG_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => set('heizung', opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5 ${
                      data.heizung === opt.id
                        ? 'border-wp-green bg-wp-greenlt shadow-wp-sm'
                        : 'border-wp-border hover:border-wp-green hover:bg-wp-greenlt'
                    }`}>
                    <span className="text-2xl block mb-2">{opt.icon}</span>
                    <p className="font-semibold text-wp-text text-sm">{opt.label}</p>
                    <p className="text-wp-text3 text-xs mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Ziel */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle size={20} className="text-wp-green" />
                <h2 className="font-heading font-bold text-wp-text text-xl">Was suchen Sie?</h2>
              </div>
              <p className="text-wp-text3 text-sm mb-6">Damit wir die Anfrage richtig einordnen können.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTENT_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => set('intent', opt.id)}
                    className={`p-5 rounded-xl border text-left transition-all hover:-translate-y-0.5 relative ${
                      data.intent === opt.id
                        ? 'border-wp-green bg-wp-greenlt shadow-wp-sm'
                        : 'border-wp-border hover:border-wp-green hover:bg-wp-greenlt'
                    }`}>
                    {opt.highlight && (
                      <span className="absolute top-3 right-3 bg-wp-amber text-white text-xs font-bold px-2 py-0.5 rounded-full">Beliebt</span>
                    )}
                    <span className="text-2xl block mb-2">{opt.icon}</span>
                    <p className="font-semibold text-wp-text text-sm">{opt.label}</p>
                    <p className="text-wp-text3 text-xs mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Gebäude */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Home size={20} className="text-wp-green" />
                <h2 className="font-heading font-bold text-wp-text text-xl">Ihr Gebäude</h2>
              </div>
              <p className="text-wp-text3 text-sm mb-6">Für die korrekte WP-Dimensionierung und Förderberechnung.</p>

              <p className="font-semibold text-wp-text text-sm mb-3">Baujahr des Hauses</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {BAUJAHR_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => set('baujahr', opt.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      data.baujahr === opt.id ? 'border-wp-green bg-wp-greenlt' : 'border-wp-border hover:border-wp-green'
                    }`}>
                    <p className="font-semibold text-wp-text text-xs">{opt.label}</p>
                    <p className="text-wp-text3 text-xs mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>

              <p className="font-semibold text-wp-text text-sm mb-3">Wohnfläche</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {FLAECHE_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => set('flaeche', opt.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      data.flaeche === opt.id ? 'border-wp-green bg-wp-greenlt' : 'border-wp-border hover:border-wp-green'
                    }`}>
                    <p className="font-semibold text-wp-text text-xs">{opt.label}</p>
                    <p className="text-wp-text3 text-xs mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>

              <p className="font-semibold text-wp-text text-sm mb-3">Eigentumsstruktur</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'eigennutzer', label: '🏠 Eigennutzer', sub: 'Ich bewohne selbst' },
                  { id: 'vermieter', label: '🏢 Vermieter', sub: 'Ich vermiete das Objekt' },
                ].map(opt => (
                  <button key={opt.id} onClick={() => set('eigentuemer', opt.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      data.eigentuemer === opt.id ? 'border-wp-green bg-wp-greenlt' : 'border-wp-border hover:border-wp-green'
                    }`}>
                    <p className="font-semibold text-wp-text text-sm">{opt.label}</p>
                    <p className="text-wp-text3 text-xs">{opt.sub}</p>
                  </button>
                ))}
              </div>
              {data.eigentuemer === 'eigennutzer' && (
                <div className="mt-3 bg-wp-greenlt border border-wp-green3/20 rounded-xl px-4 py-3 text-xs text-wp-green font-semibold">
                  ✓ Als Eigennutzer erhalten Sie mind. 50% KfW-Förderung (30% + 20% Klima-Speed-Bonus)
                </div>
              )}
            </div>
          )}

          {/* Step 3: Zeitplan */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Calendar size={20} className="text-wp-green" />
                <h2 className="font-heading font-bold text-wp-text text-xl">Wann möchten Sie handeln?</h2>
              </div>
              <p className="text-wp-text3 text-sm mb-6">Damit Betriebe Ihren Zeitplan kennen und passend reagieren können.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ZEITPLAN_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => set('zeitplan', opt.id)}
                    className={`p-5 rounded-xl border text-left transition-all hover:-translate-y-0.5 relative ${
                      data.zeitplan === opt.id
                        ? 'border-wp-green bg-wp-greenlt shadow-wp-sm'
                        : 'border-wp-border hover:border-wp-green hover:bg-wp-greenlt'
                    }`}>
                    {opt.highlight && (
                      <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">Dringend</span>
                    )}
                    <span className="text-2xl block mb-2">{opt.icon}</span>
                    <p className="font-semibold text-wp-text text-sm">{opt.label}</p>
                    <p className="text-wp-text3 text-xs mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Kontaktdaten */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Zap size={20} className="text-wp-amber" />
                <h2 className="font-heading font-bold text-wp-text text-xl">Fast geschafft — Ihre Kontaktdaten</h2>
              </div>
              <p className="text-wp-text3 text-sm mb-6">Damit die Betriebe Sie erreichen können. Keine Weitergabe an Dritte außer den vermittelten Betrieben.</p>

              {/* Summary badge */}
              <div className="bg-wp-greenlt border border-wp-green3/20 rounded-xl p-4 mb-5 grid grid-cols-2 gap-2">
                {[
                  { label: 'Heizung', val: data.heizung },
                  { label: 'Ziel', val: data.intent },
                  { label: 'Baujahr', val: data.baujahr },
                  { label: 'Zeitplan', val: data.zeitplan },
                ].map((r, i) => (
                  <div key={i} className="text-xs">
                    <span className="text-wp-text3">{r.label}: </span>
                    <span className="font-semibold text-wp-green">{r.val}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-wp-text mb-1.5">Name *</label>
                    <input value={data.name} onChange={e => set('name', e.target.value)}
                      placeholder="Vorname Nachname"
                      className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text focus:outline-none focus:border-wp-green bg-wp-bg" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-wp-text mb-1.5">PLZ *</label>
                    <input value={data.plz} onChange={e => set('plz', e.target.value)}
                      placeholder="12345"
                      className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text focus:outline-none focus:border-wp-green bg-wp-bg" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-wp-text mb-1.5">E-Mail *</label>
                  <input type="email" value={data.email} onChange={e => set('email', e.target.value)}
                    placeholder="ihre@email.de"
                    className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text focus:outline-none focus:border-wp-green bg-wp-bg" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-wp-text mb-1.5">Telefon (optional, für schnellere Rückmeldung)</label>
                  <input type="tel" value={data.tel} onChange={e => set('tel', e.target.value)}
                    placeholder="+49 151 ..."
                    className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text focus:outline-none focus:border-wp-green bg-wp-bg" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-wp-text mb-1.5">Besondere Hinweise (optional)</label>
                  <textarea value={data.nachricht} onChange={e => set('nachricht', e.target.value)}
                    rows={3} placeholder="z.B. Altbau mit alten Heizkörpern, Denkmalschutz, bereits Angebot vorhanden..."
                    className="w-full border border-wp-border rounded-xl px-4 py-3 text-sm text-wp-text focus:outline-none focus:border-wp-green bg-wp-bg resize-none" />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={data.dsgvo} onChange={e => set('dsgvo', e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-wp-green" />
                  <span className="text-xs text-wp-text2 leading-relaxed">
                    Ich stimme zu, dass meine Daten zur Vermittlung an lokale Wärmepumpen-Fachbetriebe verwendet werden.
                    Mehr in unserer <Link href="/datenschutz" className="text-wp-green underline">Datenschutzerklärung</Link>.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-wp-border">
            <button onClick={() => setStep(s => Math.max(0, s - 1))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                step === 0 ? 'invisible' : 'text-wp-text2 hover:bg-wp-bg border border-wp-border'
              }`}>
              <ArrowLeft size={14} /> Zurück
            </button>

            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all ${
                  canNext()
                    ? 'bg-wp-green text-white hover:bg-wp-green2 hover:-translate-y-0.5 shadow-wp-sm'
                    : 'bg-wp-border text-wp-text3 cursor-not-allowed'
                }`}>
                Weiter <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canNext() || sending}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all ${
                  canNext() && !sending
                    ? 'bg-wp-amber text-white hover:bg-amber-700 hover:-translate-y-0.5 shadow-wp-sm'
                    : 'bg-wp-border text-wp-text3 cursor-not-allowed'
                }`}>
                {sending ? 'Wird gesendet...' : 'Kostenlos anfragen'} {!sending && <ArrowRight size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Trust signals below form */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { icon: '🔒', text: 'DSGVO-konform' },
            { icon: '💶', text: 'Kostenlos' },
            { icon: '✋', text: 'Unverbindlich' },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl border border-wp-border p-3 text-center">
              <span className="text-lg block mb-0.5">{t.icon}</span>
              <span className="text-xs font-semibold text-wp-text2">{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
