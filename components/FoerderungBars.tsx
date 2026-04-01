'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const bars = [
  { label: 'Grundförderung', value: 30, color: '#4CAF7D' },
  { label: '+ Klima-Speed-Bonus (alte Gasheizung ersetzen)', value: 20, color: '#B45309' },
  { label: '+ Einkommens-Bonus (Haushalt unter €40.000/Jahr)', value: 30, color: '#F59E0B' },
  { label: '+ Bonus Natürliches Kältemittel (R290)', value: 5, color: '#2D7A52' },
];

export default function FoerderungBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="space-y-6">
      {bars.map((bar, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-sm text-wp-text-on-dark/80">{bar.label}</span>
            <span className="font-mono text-sm font-bold text-wp-text-on-dark">{bar.value}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${(bar.value / 70) * 100}%` } : { width: 0 }}
              transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color }}
            />
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-white/10">
        <p className="font-display text-5xl md:text-7xl font-bold text-wp-accent leading-none">
          = bis zu 70%
        </p>
        <p className="font-body text-base text-wp-text-on-dark/70 mt-3">
          = bis zu €21.000 Zuschuss (nicht rückzahlbar)
        </p>
      </div>
    </div>
  );
}
