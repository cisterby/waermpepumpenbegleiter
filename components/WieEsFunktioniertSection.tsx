'use client';

import { motion } from 'framer-motion';
import { ClipboardList, Users, PiggyBank } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: ClipboardList,
    title: 'Daten eingeben',
    text: 'Gebäudetyp, Baujahr, PLZ — dauert unter 2 Minuten. Kein Fachwissen nötig.',
    badge: '2 Minuten',
  },
  {
    num: '02',
    icon: Users,
    title: 'Angebote erhalten',
    text: 'Bis zu 3 geprüfte Fachbetriebe aus Ihrer Region melden sich innerhalb von 48 Stunden.',
    badge: 'Kostenlos',
  },
  {
    num: '03',
    icon: PiggyBank,
    title: 'Förderung sichern',
    text: 'Wir zeigen Ihnen genau, wie Sie bis zu €21.000 KfW-Förderung beantragen.',
    badge: 'Bis €21.000',
  },
];

export default function WieEsFunktioniertSection() {
  return (
    <section id="wie-es-funktioniert" className="bg-white section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="overline mb-4">In 3 Schritten zur Wärmepumpe</p>
          <h2 className="font-display text-wp-text">So einfach funktioniert es</h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-[16%] right-[16%] h-px border-t-2 border-dashed border-wp-primary/20 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="card-premium p-8 relative overflow-hidden text-center"
              >
                <span className="absolute top-4 left-6 font-display text-[120px] font-bold text-wp-primary opacity-[0.06] leading-none select-none">
                  {step.num}
                </span>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-wp-primary/5 flex items-center justify-center mx-auto mb-5">
                    <step.icon className="w-7 h-7 text-wp-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl font-medium text-wp-text mb-3">{step.title}</h3>
                  <p className="font-body text-sm text-wp-text-secondary leading-relaxed mb-4">
                    {step.text}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full bg-wp-primary text-white font-body text-xs font-medium">
                    {step.badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
