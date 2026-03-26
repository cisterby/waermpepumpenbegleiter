'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 299000, suffix: '', prefix: '', label: 'Wärmepumpen\ninstalliert in 2025' },
  { value: 70, suffix: '%', label: 'Max. KfW-\nFörderung' },
  { value: 21000, suffix: '', prefix: '€', label: 'Förderbetrag\n(EFH)' },
  { value: 20, suffix: '+ Jahre', label: 'Lebensdauer\neiner WP' },
];

function formatNumber(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString('de-DE');
  }
  return n.toString();
}

function AnimatedNumber({ item, inView }: { item: StatItem; inView: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * item.value));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, item.value]);

  return (
    <span className="font-mono text-3xl md:text-5xl font-bold text-wp-accent">
      {item.prefix}{formatNumber(current)}{item.suffix}
    </span>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-wp-dark py-12 md:py-16">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((item, i) => (
            <div
              key={i}
              className={`text-center ${
                i < stats.length - 1 ? 'lg:border-r lg:border-white/10' : ''
              }`}
            >
              <AnimatedNumber item={item} inView={inView} />
              <p className="font-body text-xs md:text-sm text-wp-text-on-dark/60 mt-2 whitespace-pre-line">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
