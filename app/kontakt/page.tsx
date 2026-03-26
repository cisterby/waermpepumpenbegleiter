'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import FAQAccordion from '@/components/FAQAccordion';
import type { FAQItem } from '@/lib/types';

const contactInfo = [
  { icon: Mail, label: 'info@waermepumpenbegleiter.de' },
  { icon: Phone, label: 'Wird bald bekannt gegeben' },
  { icon: Clock, label: 'Mo–Fr, 08:00–18:00 Uhr' },
  { icon: MapPin, label: 'Deutschland' },
];

const faqItems: FAQItem[] = [
  {
    question: 'Ist die Nutzung wirklich kostenlos?',
    answer: 'Ja, vollständig. Wir werden von unseren Installateur-Partnern vergütet, nicht von Ihnen.',
  },
  {
    question: 'Wie schnell erhalte ich Rückmeldung?',
    answer: 'In der Regel innerhalb von 48 Stunden nach Ihrer Anfrage.',
  },
  {
    question: 'Für welche Gebäude eignet sich eine Wärmepumpe?',
    answer: 'Für die meisten Bestandsgebäude. Luft-Wasser-Wärmepumpen funktionieren auch ohne Fußbodenheizung.',
  },
  {
    question: 'Was passiert nach meiner Anfrage?',
    answer: 'Bis zu 3 geprüfte Fachbetriebe aus Ihrer PLZ melden sich direkt bei Ihnen.',
  },
  {
    question: 'Bin ich zur Auftragserteilung verpflichtet?',
    answer: 'Nein. Anfrage, Beratung und Angebote sind vollständig unverbindlich.',
  },
];

export default function KontaktPage() {
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
              <h1 className="font-display text-white mb-4">Kontakt</h1>
              <p className="font-body text-base text-wp-text-on-dark/70 max-w-xl leading-relaxed">
                Haben Sie Fragen? Wir helfen Ihnen gerne weiter — schnell, persönlich und unverbindlich.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-wp-base section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="card-premium p-6 md:p-8"
                >
                  <div className="space-y-5">
                    {contactInfo.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-wp-primary/5 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-wp-primary" strokeWidth={1.5} />
                        </div>
                        <span className="font-body text-sm text-wp-text">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-wp-border">
                    <div className="flex gap-4">
                      {['LinkedIn', 'Instagram', 'Facebook'].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="font-body text-sm text-wp-primary-mid hover:text-wp-primary transition-colors"
                        >
                          {social}
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="font-display text-xl font-medium text-wp-text mb-6">
                    Häufige Fragen
                  </h3>
                  <FAQAccordion items={faqItems} />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
