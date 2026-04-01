'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { calcBetriebskosten } from '@/lib/calculations';
import type { HeizungsTyp, BaujahrTyp } from '@/lib/calculations';

export default function MiniCalculator() {
  const [flaeche, setFlaeche] = useState(120);
  const [heizung, setHeizung] = useState<HeizungsTyp>('erdgas');
  const [baujahr, setBaujahr] = useState<BaujahrTyp>('1979_1994');

  const result = useMemo(
    () => calcBetriebskosten(flaeche, baujahr, heizung),
    [flaeche, baujahr, heizung]
  );

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl border border-[rgba(26,71,49,0.12)] shadow-wp-lg p-6 md:p-8"
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-body text-sm font-medium text-wp-text">Wohnfläche</label>
            <span className="font-mono text-sm font-bold text-wp-primary">{flaeche} m²</span>
          </div>
          <input
            type="range"
            min={60}
            max={350}
            value={flaeche}
            onChange={(e) => setFlaeche(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1A4731 0%, #1A4731 ${((flaeche - 60) / 290) * 100}%, #E2DDD6 ${((flaeche - 60) / 290) * 100}%, #E2DDD6 100%)`,
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="font-body text-xs text-wp-text-light">60 m²</span>
            <span className="font-body text-xs text-wp-text-light">350 m²</span>
          </div>
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
          <label className="font-body text-sm font-medium text-wp-text mb-2 block">Baujahr Gebäude</label>
          <select
            value={baujahr}
            onChange={(e) => setBaujahr(e.target.value as BaujahrTyp)}
            className="w-full h-11 px-4 rounded-lg border border-wp-border bg-white font-body text-sm text-wp-text focus:outline-none focus:border-wp-primary-mid transition-colors"
          >
            <option value="vor_1978">vor 1978</option>
            <option value="1979_1994">1979–1994</option>
            <option value="1995_2009">1995–2009</option>
            <option value="2010_plus">2010 und neuer</option>
          </select>
        </div>

        <div className="h-px bg-wp-border" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-wp-text-secondary">Ihre aktuellen Heizkosten</span>
            <span className="font-mono text-base font-bold text-wp-accent">
              {formatCurrency(result.altKosten)} / Jahr
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-wp-text-secondary">Mit Wärmepumpe</span>
            <span className="font-mono text-base font-bold text-wp-primary">
              {formatCurrency(result.wpKosten)} / Jahr
            </span>
          </div>

          <div className="bg-wp-primary rounded-lg px-5 py-4 flex items-center justify-between">
            <span className="font-body text-sm font-medium text-white">Jährliche Ersparnis</span>
            <span className="font-mono text-lg font-bold text-white">
              {formatCurrency(result.ersparnis)}
            </span>
          </div>

          <div className="text-center">
            <span className="font-body text-xs text-wp-text-light">
              Amortisation mit 55% Förderung: ca. {result.amortisationJahre} Jahre
            </span>
          </div>
        </div>

        <Link href="/rechner" className="btn-primary w-full text-center">
          Genaues Angebot für meine Stadt anfordern
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <Lock className="w-3 h-3 text-wp-text-light" />
        <span className="font-body text-xs text-wp-text-light">Keine Datenweitergabe. Kein Spam.</span>
      </div>
    </motion.div>
  );
}
