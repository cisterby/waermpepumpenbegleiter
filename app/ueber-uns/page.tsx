'use client';

import { motion } from 'framer-motion';
import { Shield, Award, FileCheck, Umbrella } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const team = [
  {
    name: 'Dr. Markus Sommer',
    title: 'Energieberater (IHK), 14 Jahre Erfahrung in der Heizungstechnik',
    bio: 'Ehemals Sachverständiger bei der Verbraucherzentrale NRW.',
    initials: 'MS',
  },
  {
    name: 'Julia Hartmann',
    title: 'Dipl.-Ing. Gebäudetechnik, Spezialistin für KfW-Förderprogramme',
    bio: 'Hat über 400 Förderprojekte begleitet.',
    initials: 'JH',
  },
  {
    name: 'Stefan Berger',
    title: 'SHK-Meister, 18 Jahre Installationserfahrung',
    bio: 'Qualitätsprüfung unseres Installateur-Netzwerks.',
    initials: 'SB',
  },
];

const pruefschritte = [
  { icon: FileCheck, title: 'Handwerkskammer-Eintragung', text: 'Jeder Partner muss eingetragen und aktiv sein.', num: '01' },
  { icon: Award, title: 'Meisterbetrieb-Nachweis', text: 'Kein Geselle führt Wärmepumpen-Projekte durch.', num: '02' },
  { icon: Shield, title: 'Erfahrungsnachweis', text: 'Mindestens 5 dokumentierte WP-Installationen.', num: '03' },
  { icon: Umbrella, title: 'Versicherungsnachweis', text: 'Gültige Haftpflichtversicherung für Heizungsbau.', num: '04' },
];

const quellen = ['BWP', 'KfW', 'BAFA', 'Verbraucherzentrale', 'Fraunhofer ISE', 'DWD', 'HTW Berlin', 'co2online'];

export default function UeberUnsPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="bg-wp-base pt-28 pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="overline mb-4">Unsere Mission</p>
                <h1 className="font-display text-wp-text mb-6 leading-[1.1]">
                  Wir begleiten Sie durch die wichtigste Wohnentscheidung der nächsten 30 Jahre.
                </h1>
                <p className="font-body text-lg text-wp-text-secondary leading-[1.7]">
                  Die Heizungswende ist komplex. Förderanträge, Hersteller-Versprechen, GEG-Fristen — wir sortieren das für Sie und verbinden Sie mit Fachbetrieben, denen Sie vertrauen können.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="hidden lg:block"
              >
                <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
                  <line x1="50" y1="250" x2="350" y2="250" stroke="#1A4731" strokeWidth="1" opacity="0.2" />
                  <line x1="100" y1="250" x2="200" y2="100" stroke="#1A4731" strokeWidth="1.5" opacity="0.3" />
                  <line x1="200" y1="100" x2="300" y2="250" stroke="#1A4731" strokeWidth="1.5" opacity="0.3" />
                  <line x1="200" y1="100" x2="200" y2="60" stroke="#1A4731" strokeWidth="1" opacity="0.2" />
                  <rect x="130" y="160" width="140" height="90" rx="2" fill="none" stroke="#1A4731" strokeWidth="1" opacity="0.15" />
                  <rect x="165" y="190" width="30" height="60" rx="1" fill="none" stroke="#1A4731" strokeWidth="1" opacity="0.2" />
                  <rect x="210" y="175" width="40" height="30" rx="1" fill="none" stroke="#1A4731" strokeWidth="1" opacity="0.2" />
                  <circle cx="200" cy="100" r="4" fill="#4CAF7D" opacity="0.5" />
                  <line x1="50" y1="50" x2="50" y2="250" stroke="#E2DDD6" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="350" y1="50" x2="350" y2="250" stroke="#E2DDD6" strokeWidth="0.5" strokeDasharray="4 4" />
                  {[80, 120, 160, 200].map((y) => (
                    <line key={y} x1="40" y1={y} x2="360" y2={y} stroke="#E2DDD6" strokeWidth="0.3" />
                  ))}
                  <text x="55" y="48" fill="#7A9E8E" fontFamily="JetBrains Mono" fontSize="8">Schnitt A-A</text>
                  <rect x="310" y="180" width="50" height="70" rx="3" fill="none" stroke="#2D7A52" strokeWidth="1.5" />
                  <text x="335" y="220" textAnchor="middle" fill="#2D7A52" fontFamily="JetBrains Mono" fontSize="7">WP</text>
                </svg>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-wp-dark py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-2xl md:text-4xl font-medium text-white italic leading-[1.3]"
            >
              &ldquo;Wärmepumpen sind die wirtschaftlich überlegene Heizentscheidung für die nächsten drei Jahrzehnte. Wir machen sie verständlich.&rdquo;
            </motion.blockquote>
          </div>
        </section>

        <section className="bg-white section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-display text-wp-text text-center mb-16">Das Team</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="card-premium p-8 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-wp-primary/10 flex items-center justify-center mx-auto mb-5">
                    <span className="font-display text-2xl font-bold text-wp-primary">
                      {member.initials}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-medium text-wp-text mb-2">{member.name}</h3>
                  <p className="font-body text-sm font-medium text-wp-primary-mid mb-3">{member.title}</p>
                  <p className="font-body text-sm text-wp-text-secondary leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-wp-base section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-display text-wp-text text-center mb-16">
              So prüfen wir unsere Installateur-Partner
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pruefschritte.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card-premium p-6 relative overflow-hidden"
                >
                  <span className="absolute top-2 right-4 font-display text-[80px] font-bold text-wp-primary opacity-[0.05] leading-none select-none">
                    {step.num}
                  </span>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-wp-primary/5 flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-wp-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-lg font-medium text-wp-text mb-2">{step.title}</h3>
                    <p className="font-body text-sm text-wp-text-secondary leading-relaxed">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <div className="inline-flex items-center gap-3 bg-wp-primary text-white px-6 py-3 rounded-lg">
                <Shield className="w-5 h-5" />
                <span className="font-body text-sm font-medium">
                  Geprüfter Partner-Betrieb — Wärmepumpenbegleiter.de
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white section-padding">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl border-l-4 border-l-wp-primary border border-[rgba(26,71,49,0.12)] shadow-wp-md p-8"
            >
              <h3 className="font-display text-2xl font-medium text-wp-text mb-4">
                Unser Geschäftsmodell — transparent erklärt
              </h3>
              <p className="font-body text-base text-wp-text-secondary leading-[1.7]">
                Wärmepumpenbegleiter.de ist für Hausbesitzer vollständig kostenlos. Wir finanzieren uns durch Vermittlungsprovisionen von €50–120 pro qualifiziertem Lead, den wir an unsere geprüften Installateur-Partner weitergeben. Diese Provision beeinflusst nicht, welche Betriebe wir empfehlen — alle Partner durchlaufen denselben Prüfprozess.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-wp-base py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h3 className="font-display text-xl font-medium text-wp-text text-center mb-8">
              Unsere Datenquellen
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {quellen.map((q) => (
                <span
                  key={q}
                  className="inline-block px-4 py-2 rounded-full border border-[rgba(26,71,49,0.12)] bg-white font-body text-sm font-medium text-wp-primary"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
