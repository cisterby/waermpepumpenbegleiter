'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { calcBetriebskosten, calcFoerderung, type HeizungsTyp, type BaujahrTyp } from '@/lib/calculations';

const baujahrOptions = [
  { value: 'vor_1978', label: 'vor 1978' },
  { value: '1979_1994', label: '1979–1994' },
  { value: '1995_2009', label: '1995–2009' },
  { value: '2010_plus', label: '2010 und neuer' },
];

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer py-3">
      <span className="font-body text-sm text-wp-text">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-wp-primary' : 'bg-wp-border'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

export default function RechnerPage() {
  const [flaeche, setFlaeche] = useState(120);
  const [gebaeudetyp, setGebaeudetyp] = useState('efh');
  const [baujahr, setBaujahr] = useState<BaujahrTyp>('1979_1994');
  const [heizung, setHeizung] = useState<HeizungsTyp>('erdgas');
  const [plz, setPlz] = useState('');

  const [eigennutzung, setEigennutzung] = useState(true);
  const [fossilErsatz, setFossilErsatz] = useState(true);
  const [niedrigEinkommen, setNiedrigEinkommen] = useState(false);
  const [kaeltemittel, setKaeltemittel] = useState(false);

  const betrieb = useMemo(
    () => calcBetriebskosten(flaeche, baujahr, heizung),
    [flaeche, baujahr, heizung]
  );

  const foerderung = useMemo(
    () => calcFoerderung(eigennutzung, fossilErsatz, niedrigEinkommen, kaeltemittel),
    [eigennutzung, fossilErsatz, niedrigEinkommen, kaeltemittel]
  );

  const investition = 25000;
  const eigenanteil = investition - foerderung.zuschuss;
  const amortisation = betrieb.ersparnis > 0
    ? Math.round((eigenanteil / (betrieb.ersparnis + 200)) * 10) / 10
    : 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <Navigation />
      <main>
        <section className="bg-wp-dark pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="overline text-wp-primary-light mb-4">Kostenloses Tool</p>
              <h1 className="font-display text-white mb-4">Wärmepumpen-Rechner</h1>
              <p className="font-body text-base text-wp-text-on-dark/70 max-w-xl leading-relaxed">
                Individuelle Berechnung für Ihr Gebäude. Geben Sie Ihre Daten ein — wir rechnen für Sie.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-wp-base section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="card-premium p-6 md:p-8"
                >
                  <h3 className="font-display text-xl font-medium text-wp-text mb-6">Ihr Gebäude</h3>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-body text-sm font-medium text-wp-text">Wohnfläche</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={60}
                            max={400}
                            value={flaeche}
                            onChange={(e) => setFlaeche(Math.min(400, Math.max(60, Number(e.target.value))))}
                            className="w-20 h-8 px-2 text-right rounded border border-wp-border font-mono text-sm font-bold text-wp-primary focus:outline-none focus:border-wp-primary-mid"
                          />
                          <span className="font-body text-sm text-wp-text-light">m²</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={60}
                        max={400}
                        value={flaeche}
                        onChange={(e) => setFlaeche(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #1A4731 0%, #1A4731 ${((flaeche - 60) / 340) * 100}%, #E2DDD6 ${((flaeche - 60) / 340) * 100}%, #E2DDD6 100%)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="font-body text-xs text-wp-text-light">60 m²</span>
                        <span className="font-body text-xs text-wp-text-light">400 m²</span>
                      </div>
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-wp-text mb-2 block">Gebäudetyp</label>
                      <select
                        value={gebaeudetyp}
                        onChange={(e) => setGebaeudetyp(e.target.value)}
                        className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text focus:outline-none focus:border-wp-primary-mid transition-colors"
                      >
                        <option value="efh">Einfamilienhaus</option>
                        <option value="rh">Reihenhaus</option>
                        <option value="dhh">Doppelhaushälfte</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-wp-text mb-2 block">Baujahr</label>
                      <select
                        value={baujahr}
                        onChange={(e) => setBaujahr(e.target.value as BaujahrTyp)}
                        className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text focus:outline-none focus:border-wp-primary-mid transition-colors"
                      >
                        {baujahrOptions.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-wp-text mb-2 block">Aktuelle Heizung</label>
                      <select
                        value={heizung}
                        onChange={(e) => setHeizung(e.target.value as HeizungsTyp)}
                        className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text focus:outline-none focus:border-wp-primary-mid transition-colors"
                      >
                        <option value="erdgas">Erdgas</option>
                        <option value="heizoel">Heizöl</option>
                        <option value="nachtspeicher">Nachtspeicher</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-wp-text mb-2 block">PLZ</label>
                      <input
                        type="text"
                        value={plz}
                        onChange={(e) => setPlz(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        placeholder="10115"
                        maxLength={5}
                        className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text placeholder:text-wp-text-light focus:outline-none focus:border-wp-primary-mid transition-colors"
                      />
                      <p className="font-body text-xs text-wp-text-light mt-1">Für die regionalen Energiepreise</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="card-premium p-6 md:p-8"
                >
                  <h3 className="font-display text-xl font-medium text-wp-text mb-6">Ihre Fördersituation</h3>

                  <div className="divide-y divide-wp-border">
                    <ToggleSwitch
                      checked={eigennutzung}
                      onChange={setEigennutzung}
                      label="Ich nutze das Gebäude selbst"
                    />
                    <ToggleSwitch
                      checked={fossilErsatz}
                      onChange={setFossilErsatz}
                      label="Ich ersetze eine fossile Heizung"
                    />
                    <ToggleSwitch
                      checked={niedrigEinkommen}
                      onChange={setNiedrigEinkommen}
                      label="Haushaltseinkommen unter €40.000 netto/Jahr"
                    />
                    <ToggleSwitch
                      checked={kaeltemittel}
                      onChange={setKaeltemittel}
                      label="Interesse an natürlichem Kältemittel (R290)"
                    />
                  </div>
                </motion.div>
              </div>

              <div className="lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl border border-[rgba(26,71,49,0.12)] shadow-wp-lg p-6 md:p-8"
                >
                  <h3 className="font-body text-lg font-semibold text-wp-text mb-6">Ihre Berechnung</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-wp-text-secondary">Jährl. Heizkosten heute</span>
                      <span className="font-mono text-base font-bold text-wp-accent">{fmt(betrieb.altKosten)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-wp-text-secondary">Jährl. Heizkosten WP</span>
                      <span className="font-mono text-base font-bold text-wp-primary">{fmt(betrieb.wpKosten)}</span>
                    </div>

                    <div className="h-px bg-wp-border" />

                    <div className="bg-wp-primary/5 rounded-lg px-4 py-3 flex items-center justify-between">
                      <span className="font-body text-sm font-medium text-wp-primary">Jährliche Ersparnis</span>
                      <span className="font-mono text-lg font-bold text-wp-accent">{fmt(betrieb.ersparnis)}/Jahr</span>
                    </div>

                    <div className="h-px bg-wp-border" />

                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-wp-text-secondary">Ihr Fördersatz</span>
                      <span className="font-mono text-base font-bold text-wp-primary">{foerderung.gesamtSatz}%</span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-wp-border/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-wp-primary transition-all duration-500 ease-out"
                        style={{ width: `${(foerderung.gesamtSatz / 70) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-wp-text-secondary">KfW-Zuschuss</span>
                      <span className="font-mono text-base font-bold text-wp-primary-mid">{fmt(foerderung.zuschuss)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-wp-text-secondary">Ihr Eigenanteil</span>
                      <span className="font-mono text-base font-bold text-wp-text">{fmt(eigenanteil)}</span>
                    </div>

                    <div className="h-px bg-wp-border" />

                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm font-medium text-wp-text">Amortisation</span>
                      <span className="font-mono text-lg font-bold text-wp-primary">{amortisation} Jahre</span>
                    </div>
                  </div>

                  <button className="btn-primary w-full mt-8">
                    Kostenloses Angebot anfordern
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="font-body text-xs text-wp-text-light text-center mt-3">
                    Wir verbinden Sie mit bis zu 3 geprüften Fachbetrieben in Ihrer PLZ
                  </p>
                </motion.div>

                <div className="flex items-start gap-2 mt-4 px-2">
                  <Info className="w-4 h-4 text-wp-text-light flex-shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-wp-text-light leading-relaxed">
                    Berechnung basiert auf Durchschnittswerten. Tatsächliche Kosten können abweichen.
                    Fördervoraussetzungen gemäß BEG/KfW Stand 2026.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
