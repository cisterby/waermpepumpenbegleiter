'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import HouseSVG from './HouseSVG';

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-wp-base overflow-hidden">
      <div className="absolute top-20 right-10 font-display text-[20rem] font-bold text-wp-primary opacity-[0.03] select-none pointer-events-none leading-none hidden xl:block">
        &euro;
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="overline mb-5">
              Heizungswende verstehen & richtig entscheiden
            </p>

            <h1 className="font-display text-[clamp(2.5rem,5.5vw,4rem)] font-bold text-wp-text leading-[1.1] mb-6">
              Ihre alte Heizung
              <br />
              kostet Sie jährlich
              <br />
              <span className="text-wp-accent font-mono">€2.400</span> zu viel.
            </h1>

            <p className="font-body text-lg text-wp-text-secondary leading-[1.7] mb-8 max-w-lg">
              Wir begleiten Hausbesitzer durch die Wärmepumpen-Entscheidung — kostenlos, herstellerunabhängig, mit geprüften Fachbetrieben in Ihrer Region.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/rechner" className="btn-primary text-base py-3.5 px-7">
                Kosten jetzt berechnen
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/rechner"
                className="inline-flex items-center gap-2 font-body text-sm font-medium text-wp-primary hover:text-wp-primary-mid transition-colors px-2 py-3"
              >
                Wie viel spare ich konkret?
                <ArrowDown className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-xs text-wp-text-light">
              <span>&#10003; 733 Städte abgedeckt</span>
              <span className="hidden sm:inline text-wp-border">&middot;</span>
              <span>&#10003; Geprüfte Fachbetriebe</span>
              <span className="hidden sm:inline text-wp-border">&middot;</span>
              <span>&#10003; Bis 70% KfW-Förderung</span>
              <span className="hidden sm:inline text-wp-border">&middot;</span>
              <span>&#10003; Kostenlos & unverbindlich</span>
            </div>
          </motion.div>

          <div className="hidden lg:block">
            <HouseSVG />
          </div>
        </div>
      </div>
    </section>
  );
}
