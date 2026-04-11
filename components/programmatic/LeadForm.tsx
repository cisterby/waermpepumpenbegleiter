// components/programmatic/LeadForm.tsx
// Formspree Multi-Step Lead-Formular — geteilt von allen 22 Templates
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import type { City } from '@/lib/city-utils';

const FORMSPREE_ID = 'mgopkvpk';

interface Props {
  city: City;
  keywordSlug?: string;
  citySlug?: string;
}

type Step = 1 | 2 | 3;

const BAUJAHR = [
  { v: 'vor_1978',   l: 'vor 1978',       sub: 'Vor Wärmeschutzverordnung' },
  { v: '1979_1994',  l: '1979 – 1994',    sub: 'Nach 1. WSchVO' },
  { v: '1995_2009',  l: '1995 – 2009',    sub: 'Nach EnEV' },
  { v: '2010_plus',  l: '2010 oder neuer', sub: 'Moderner Standard' },
];

const HEIZUNG = [
  { v: 'erdgas',        l: 'Erdgas',        icon: '🔥' },
  { v: 'heizoel',       l: 'Heizöl',        icon: '🛢️' },
  { v: 'nachtspeicher', l: 'Nachtspeicher', icon: '⚡' },
  { v: 'pellets',       l: 'Pellets',       icon: '🪵' },
  { v: 'fernwaerme',    l: 'Fernwärme',     icon: '🏭' },
  { v: 'andere',        l: 'Andere',        icon: '❓' },
];

export default function LeadForm({ city, keywordSlug, citySlug }: Props) {
  const [step, setStep]         = useState<Step>(1);
  const [submitting, setSub]    = useState(false);
  const [submitted, setDone]    = useState(false);
  const [error, setError]       = useState('');

  // Schritt 1: Gebäude
  const [flaeche, setFlaeche]   = useState(120);
  const [baujahr, setBaujahr]   = useState('');
  const [heizung, setHeizung]   = useState('');

  // Schritt 2: Kontakt
  const [vorname, setVorname]   = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail]       = useState('');
  const [telefon, setTelefon]   = useState('');
  const [plz, setPlz]           = useState(city.plz);

  const canStep1 = baujahr !== '' && heizung !== '';
  const canStep2 = vorname.trim() && nachname.trim() && email.includes('@') && plz.length === 5;

  async function submit() {
    setSub(true);
    setError('');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          // Formspree-Felder
          _subject: `Neuer WP-Lead: ${vorname} ${nachname} aus ${city.name}`,
          vorname, nachname, email, telefon,
          plz, stadt: city.name,
          flaeche: `${flaeche} m²`,
          baujahr, heizung,
          // Meta
          keyword: keywordSlug ?? '',
          city_slug: citySlug ?? city.slug,
          source: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError('Fehler beim Senden. Bitte versuche es erneut.');
      }
    } catch {
      setError('Netzwerkfehler. Bitte versuche es erneut.');
    } finally {
      setSub(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-[#E8F5EE] border border-[#3DA16A]/40 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#1A4731] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h3 className="font-bold font-bold text-[#1C2B2B] text-xl mb-2">
            Anfrage erhalten!
          </h3>
          <p className="text-[#4A6358] text-base leading-relaxed max-w-md mx-auto">
            Vielen Dank, <strong>{vorname}</strong>. Sie erhalten innerhalb von <strong>48 Stunden</strong> bis zu 3 Angebote von geprüften Fachbetrieben aus {city.name}.
          </p>
          <p className="text-[#7A9E8E] text-sm mt-4">
            Eine Bestätigung wurde an <strong>{email}</strong> gesendet.
          </p>
        </div>

        {/* Was passiert jetzt? Timeline */}
        <div className="mt-8 pt-6 border-t border-[#3DA16A]/30">
          <h4 className="font-semibold text-[#1C2B2B] text-sm mb-4 text-center">
            Was passiert jetzt?
          </h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A4731] text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1C2B2B]">Prüfung</p>
                <p className="text-xs text-[#7A9E8E]">Ihre Anfrage wird von unserem Team geprüft</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A4731] text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1C2B2B]">Vermittlung</p>
                <p className="text-xs text-[#7A9E8E]">Wir verbinden Sie mit geprüften Fachbetrieben</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A4731] text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1C2B2B]">Angebote</p>
                <p className="text-xs text-[#7A9E8E]">Sie erhalten bis zu 3 konkrete Angebote</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A4731] px-6 py-5">
        <p className="text-[#D97706] text-xs font-bold uppercase tracking-wider mb-1">
          KOSTENLOSES ANGEBOT
        </p>
        <h3 className="font-bold font-bold text-white text-lg leading-snug">
          Bis zu 3 Angebote für {city.name} — in 2 Minuten
        </h3>
        {/* Fortschritt */}
        <div className="flex gap-2 mt-4">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                step > s ? 'bg-[#1A4731] text-white' :
                step === s ? 'bg-[#D97706] text-white' :
                'bg-white/20 text-white/50'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <div className={`h-0.5 flex-1 rounded-full transition-colors ${
                s < 3 ? (step > s ? 'bg-[#1A4731]' : 'bg-white/15') : 'hidden'
              }`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-white/40 mt-1.5">
          <span>Gebäude</span><span>Kontakt</span><span>Fertig</span>
        </div>
      </div>

      <div className="p-6">
        {/* Urgency Banner */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <p className="text-sm font-semibold text-amber-900">
            Aktuell hohe Nachfrage in {city.name} — Wartezeit bei Fachbetrieben: 4-10 Wochen
          </p>
        </div>

        {/* Social Proof */}
        <p className="text-xs text-[#7A9E8E] text-center mb-6">
          Bereits über 12.000 Anfragen bundesweit · Letzte Anfrage vor 3 Stunden
        </p>

        <AnimatePresence mode="wait">

          {/* SCHRITT 1: Gebäude */}
          {step === 1 && (
            <motion.div key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

              {/* Wohnfläche */}
              <div className="mb-5">
                <label className="block font-semibold text-[#1C2B2B] text-sm mb-2">
                  Wohnfläche: <span className="text-[#1A4731] font-mono">{flaeche} m²</span>
                </label>
                <input type="range" min={60} max={350} step={10} value={flaeche}
                  onChange={e => setFlaeche(+e.target.value)}
                  className="w-full accent-wp-green" />
                <div className="flex justify-between text-xs text-[#7A9E8E] mt-1">
                  <span>60 m²</span><span className="text-[#1A4731]">Ø 120 m²</span><span>350 m²</span>
                </div>
              </div>

              {/* Baujahr */}
              <div className="mb-5">
                <label className="block font-semibold text-[#1C2B2B] text-sm mb-2">Baujahr Gebäude</label>
                <div className="grid grid-cols-2 gap-2">
                  {BAUJAHR.map(o => (
                    <button key={o.v} type="button" onClick={() => setBaujahr(o.v)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        baujahr === o.v ? 'border-[#1A4731] bg-[#E8F5EE]' : 'border-gray-200 hover:border-[#1A4731]/40'
                      }`}>
                      <p className={`font-semibold text-sm ${baujahr === o.v ? 'text-[#1A4731]' : 'text-[#1C2B2B]'}`}>{o.l}</p>
                      <p className="text-[#7A9E8E] text-xs mt-0.5">{o.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aktuelle Heizung */}
              <div className="mb-6">
                <label className="block font-semibold text-[#1C2B2B] text-sm mb-2">Aktuelle Heizung</label>
                <div className="grid grid-cols-3 gap-2">
                  {HEIZUNG.map(o => (
                    <button key={o.v} type="button" onClick={() => setHeizung(o.v)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        heizung === o.v ? 'border-[#1A4731] bg-[#E8F5EE]' : 'border-gray-200 hover:border-[#1A4731]/40'
                      }`}>
                      <div className="text-lg mb-0.5">{o.icon}</div>
                      <p className={`font-semibold text-xs ${heizung === o.v ? 'text-[#1A4731]' : 'text-[#1C2B2B]'}`}>{o.l}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => canStep1 && setStep(2)} disabled={!canStep1}
                className={`w-full min-h-[48px] py-3.5 rounded-xl font-bold font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  canStep1 ? 'bg-[#1A4731] text-white hover:bg-green-800' : 'bg-gray-200 text-[#7A9E8E] cursor-not-allowed'
                }`}>
                Weiter <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* SCHRITT 2: Kontakt */}
          {step === 2 && (
            <motion.div key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#1C2B2B] mb-1.5">Vorname *</label>
                    <input type="text" value={vorname} onChange={e => setVorname(e.target.value)}
                      placeholder="Max" autoComplete="given-name"
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-[#1C2B2B] focus:border-[#1A4731] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1C2B2B] mb-1.5">Nachname *</label>
                    <input type="text" value={nachname} onChange={e => setNachname(e.target.value)}
                      placeholder="Mustermann" autoComplete="family-name"
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-[#1C2B2B] focus:border-[#1A4731] focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1C2B2B] mb-1.5">E-Mail-Adresse *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="max@beispiel.de" autoComplete="email"
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-[#1C2B2B] focus:border-[#1A4731] focus:outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#1C2B2B] mb-1.5">Telefon <span className="font-normal text-[#7A9E8E]">(optional)</span></label>
                    <input type="tel" value={telefon} onChange={e => setTelefon(e.target.value)}
                      placeholder="0176 12345678" autoComplete="tel"
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-[#1C2B2B] focus:border-[#1A4731] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1C2B2B] mb-1.5">PLZ *</label>
                    <input type="text" value={plz} onChange={e => setPlz(e.target.value.slice(0, 5))}
                      placeholder="10115" maxLength={5} inputMode="numeric"
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-[#1C2B2B] focus:border-[#1A4731] focus:outline-none transition-colors" />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} type="button"
                  className="px-5 py-3.5 rounded-xl border-2 border-gray-200 text-[#4A6358] font-semibold text-sm hover:border-[#1A4731] transition-colors">
                  Zurück
                </button>
                <button onClick={() => canStep2 && submit()} disabled={!canStep2 || submitting}
                  className={`flex-1 min-h-[48px] py-3.5 rounded-xl font-bold font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    canStep2 && !submitting ? 'bg-[#D97706] text-white hover:bg-amber-700' : 'bg-gray-200 text-[#7A9E8E] cursor-not-allowed'
                  }`}>
                  {submitting
                    ? <><Loader2 size={16} className="animate-spin" /> Wird gesendet...</>
                    : <>Jetzt kostenlos anfragen <ArrowRight size={16} /></>
                  }
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="text-xs text-[#7A9E8E]">
                    <p className="mb-1">✓ 100% kostenlos</p>
                    <p>✓ Unverbindlich</p>
                  </div>
                  <div className="text-xs text-[#7A9E8E]">
                    <p className="mb-1">✓ DSGVO-konform</p>
                    <p>✓ Keine Spam-Anrufe</p>
                  </div>
                </div>
              </div>

              <p className="text-[#7A9E8E] text-xs text-center mt-3">
                🔒 Ihre Daten werden nicht ohne Zustimmung weitergegeben · DSGVO-konform
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                <p className="text-[#7A9E8E] text-xs mb-1.5">Oder direkt anrufen:</p>
                <a href="tel:+4915563566199" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A4731] hover:text-green-800 transition-colors">📞 +49 15563 566199</a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
