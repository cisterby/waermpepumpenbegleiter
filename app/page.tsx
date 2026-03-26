'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import StatsCounter from '@/components/StatsCounter';
import WieEsFunktioniertSection from '@/components/WieEsFunktioniertSection';
import MiniCalculator from '@/components/MiniCalculator';
import FoerderungBars from '@/components/FoerderungBars';
import TestimonialCard from '@/components/TestimonialCard';
import WarumJetztSection from '@/components/WarumJetztSection';
import type { Testimonial } from '@/lib/types';

const testimonials: Testimonial[] = [
  {
    quote: 'Nach 20 Jahren Ölheizung dachten wir, der Umstieg wäre ein riesiges Projekt. Das Team hat uns alles erklärt und wir haben drei Angebote bekommen — völlig unkompliziert.',
    name: 'Familie Brehmer',
    city: 'Hannover',
    tag: 'Luft-Wasser-WP · Ersparnis: €1.100/Jahr',
    rating: 5,
  },
  {
    quote: 'Endlich jemand, der das Förder-Chaos erklärt. Wir haben 65% KfW-Förderung bekommen — hätte ich alleine nie hingekriegt.',
    name: 'Thomas Müller',
    city: 'Freiburg',
    tag: 'Sole-Wasser-WP · Amortisation: 8 Jahre',
    rating: 5,
  },
  {
    quote: 'Als Vermieter war ich unsicher, ob sich das lohnt. Nach der Berechnung war die Entscheidung klar. Sehr seriöse Beratung, keine Druckverkäufe.',
    name: 'Sabine Kröger',
    city: 'Münster',
    tag: 'Luft-Wasser-WP · 3 Angebote erhalten',
    rating: 5,
  },
];

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <StatsCounter />
        <WieEsFunktioniertSection />

        <section className="bg-wp-base section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
              >
                <p className="overline mb-4">Kostenrechner</p>
                <h2 className="font-display text-wp-text mb-6">
                  Was kostet Sie Ihre alte Heizung wirklich?
                </h2>
                <p className="font-body text-base text-wp-text-secondary leading-[1.7] max-w-md">
                  Geben Sie Ihre Gebäudedaten ein und sehen Sie sofort, wie viel Sie mit einer Wärmepumpe sparen.
                </p>
              </motion.div>
              <MiniCalculator />
            </div>
          </div>
        </section>

        <section className="bg-wp-dark section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
              >
                <p className="overline text-wp-primary-light mb-4">KfW-Programm 458</p>
                <h2 className="font-display text-white mb-6">
                  Bis zu €21.000 geschenkt — vom Staat
                </h2>
                <p className="font-body text-base text-wp-text-on-dark/70 leading-[1.7] mb-6">
                  Das Bundesamt für Wirtschaft fördert den Einbau von Wärmepumpen mit bis zu 70% der förderfähigen Kosten. Maximal €30.000 werden als Bemessungsgrundlage angesetzt.
                </p>
                <div className="flex flex-col gap-2 font-body text-sm text-wp-text-on-dark/60">
                  <span>Förderfähige Kosten: bis €30.000</span>
                  <span>Maximaler Zuschuss: €21.000</span>
                </div>
              </motion.div>
              <FoerderungBars />
            </div>
          </div>
        </section>

        <WarumJetztSection />

        <section className="bg-wp-base section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="overline mb-4">Stimmen aus der Community</p>
              <h2 className="font-display text-wp-text">Was Hausbesitzer sagen</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} testimonial={t} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A3728, #122A1E)' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[300px] md:text-[400px] font-bold text-white opacity-[0.04] leading-none">
              &rarr;
            </span>
          </div>
          <div className="relative max-w-3xl mx-auto px-6 lg:px-8 py-24 md:py-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-[56px] font-bold text-white leading-[1.1] mb-6">
                Bereit für die Heizungswende?
              </h2>
              <p className="font-body text-base text-white/75 mb-10 max-w-md mx-auto leading-relaxed">
                Kostenlose Beratung in 2 Minuten — ohne Vertragsbindung, ohne Verpflichtung.
              </p>
              <Link href="/rechner" className="btn-accent text-base py-4 px-10">
                Kostenloses Angebot anfordern
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="font-body text-xs text-white/40 mt-6">
                &#10003; Kein Spam &middot; &#10003; Keine Weitergabe ohne Ihre Zustimmung &middot; &#10003; Kostenlos
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
