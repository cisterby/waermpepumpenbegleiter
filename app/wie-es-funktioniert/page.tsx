// app/wie-es-funktioniert/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, Shield, Zap, Phone } from 'lucide-react';

const HERO_IMG    = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80';
const STEP1_IMG   = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80';
const STEP2_IMG   = 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80';
const STEP3_IMG   = 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80';

const STEPS = [
  {
    number: '01',
    title: 'Anfrage stellen — 2 Minuten',
    desc: 'Geben Sie Gebäudetyp, Baujahr und aktuelle Heizung ein. Das war\'s. Kein Papierkram, kein Anruf notwendig.',
    img: STEP1_IMG,
    imgAlt: 'Online Anfrage stellen',
    bullets: ['Nur 5 Angaben nötig', 'Keine persönlichen Daten im 1. Schritt', 'Sofortige Ersteinschätzung'],
    color: '#1A4731',
  },
  {
    number: '02',
    title: 'Wir finden geprüfte Fachbetriebe',
    desc: 'Unser System vergleicht verfügbare Installateure in Ihrer Region nach HWK-Eintragung, KfW-Registrierung und Referenzen.',
    img: STEP2_IMG,
    imgAlt: 'Fachbetrieb Auswahl',
    bullets: ['HWK-eingetragen', 'KfW-LuL-registriert', 'Mindestens 5 WP-Referenzen'],
    color: '#2D7A52',
  },
  {
    number: '03',
    title: 'Bis zu 3 Angebote in 48h',
    desc: 'Sie erhalten vollständige, vergleichbare Angebote mit Heizlastberechnung, KfW-Förderquote und Eigenanteil — kostenlos.',
    img: STEP3_IMG,
    imgAlt: 'Angebote vergleichen',
    bullets: ['Vollständige Kostenaufstellung', 'KfW-Förderquote ausgewiesen', 'Kein Kaufzwang'],
    color: '#D97706',
  },
];

const VORTEILE = [
  { icon: <CheckCircle size={20} className="text-[#1A4731]" />, title: '100% kostenlos', text: 'Für Hausbesitzer vollständig kostenlos. Keine versteckten Kosten.' },
  { icon: <Shield size={20} className="text-[#1A4731]" />, title: 'Herstellerunabhängig', text: 'Wir empfehlen was zu Ihnen passt, nicht was uns die höchste Provision bringt.' },
  { icon: <Clock size={20} className="text-[#1A4731]" />, title: '48-Stunden-Garantie', text: 'Erste Angebote innerhalb von 48 Stunden nach Ihrer Anfrage.' },
  { icon: <Zap size={20} className="text-[#1A4731]" />, title: 'KfW-Begleitung', text: 'Wir helfen beim KfW-Antrag — bis zu 70% Förderung, max. €21.000.' },
];

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'So funktioniert Wärmepumpenbegleiter in 3 Schritten',
  description: 'Kostenlose Wärmepumpen-Vermittlung: Anfrage stellen, Fachbetriebe finden, Angebote vergleichen',
  step: [
    {
      '@type': 'HowToStep',
      position: '1',
      name: 'Anfrage stellen — 2 Minuten',
      text: 'Geben Sie Gebäudetyp, Baujahr und aktuelle Heizung ein. Das war\'s. Kein Papierkram, kein Anruf notwendig.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    },
    {
      '@type': 'HowToStep',
      position: '2',
      name: 'Wir finden geprüfte Fachbetriebe',
      text: 'Unser System vergleicht verfügbare Installateure in Ihrer Region nach HWK-Eintragung, KfW-Registrierung und Referenzen.',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80',
    },
    {
      '@type': 'HowToStep',
      position: '3',
      name: 'Bis zu 3 Angebote in 48h',
      text: 'Sie erhalten vollständige, vergleichbare Angebote mit Heizlastberechnung, KfW-Förderquote und Eigenanteil — kostenlos.',
      image: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80',
    },
  ],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Wärmepumpen-Vermittlung & Begleitung',
  description: 'Kostenlose Wärmepumpen-Vermittlung mit Fachbetriebs-Matching und KfW-Antrag-Unterstützung',
  provider: {
    '@type': 'Organization',
    name: 'Wärmepumpenbegleiter.de',
    url: 'https://xn--wrmepumpenbegleiter-gwb.de',
  },
  areaServed: 'DE',
  serviceType: 'Heat Pump Installation & Consulting',
};

export default function WieEsFunktioniertPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <Image src={HERO_IMG} alt="Wie Wärmepumpenbegleiter funktioniert"
          className="absolute inset-0 w-full h-full object-cover"
          fill
          priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,21,16,0.9) 30%, rgba(10,21,16,0.35) 100%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-14 pt-28 w-full">
          <span className="inline-block px-4 py-1.5 bg-[#4CAF7D]/20 border border-[#4CAF7D]/40 rounded-full text-[#4CAF7D] text-xs font-semibold uppercase tracking-wider mb-5">
            Wie es funktioniert
          </span>
          <h1 className="text-white text-4xl sm:text-5xl font-bold leading-tight max-w-2xl mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            In 3 Schritten zur kostenlosen WP-Vermittlung
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            Kein Anruf, kein Papierkram, keine Kosten — nur geprüfte Angebote für Ihre Situation.
          </p>
        </div>
      </section>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {STEPS.map((step, i) => (
          <section key={step.number} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
            <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-5xl font-bold font-mono" style={{ color: step.color, opacity: 0.25 }}>{step.number}</span>
                <div className="h-px flex-1" style={{ background: step.color, opacity: 0.2 }} />
              </div>
              <h2 className="text-[#1C2B2B] text-2xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{step.title}</h2>
              <p className="text-[#4A6358] leading-relaxed mb-5">
                {i === 0 && (
                  <>
                    {step.desc} <Link href="/waermepumpe-beratung" className="text-[#1A4731] font-semibold hover:underline">Mehr zur Beratung</Link>.
                  </>
                )}
                {i === 1 && (
                  <>
                    {step.desc} <Link href="/waermepumpe-fachbetrieb" className="text-[#1A4731] font-semibold hover:underline">Unsere Fachbetriebs-Kriterien</Link>.
                  </>
                )}
                {i === 2 && (
                  <>
                    {step.desc} <Link href="/waermepumpe-foerderung" className="text-[#1A4731] font-semibold hover:underline">KfW-Förderinfo</Link>.
                  </>
                )}
              </p>
              <ul className="space-y-2.5">
                {step.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-[#1C2B2B] font-medium">
                    <CheckCircle size={15} style={{ color: step.color }} className="shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`relative rounded-3xl overflow-hidden shadow-xl ${i % 2 === 1 ? 'lg:col-start-1' : ''}`}>
              <Image src={step.img} alt={step.imgAlt} className="w-full h-72 object-cover" width={600} height={288} loading="lazy" />
              <div className="absolute inset-0 rounded-3xl" style={{ background: `linear-gradient(135deg, ${step.color}22 0%, transparent 60%)` }} />
            </div>
          </section>
        ))}
      </div>

      {/* Vorteile */}
      <section className="bg-[#1A4731]">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-white text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Warum Wärmepumpenbegleiter?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VORTEILE.map(v => (
              <div key={v.title} className="bg-white/10 border border-white/15 rounded-2xl p-5">
                <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle size={18} className="text-[#4CAF7D]" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{v.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top-Städte */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-[#1C2B2B] text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Wärmepumpen-Vermittlung in Top-Städten
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {[
            { name: 'Berlin', slug: 'berlin' },
            { name: 'München', slug: 'muenchen' },
            { name: 'Hamburg', slug: 'hamburg' },
            { name: 'Köln', slug: 'koeln' },
            { name: 'Frankfurt a.M.', slug: 'frankfurt-am-main' },
            { name: 'Stuttgart', slug: 'stuttgart' },
            { name: 'Düsseldorf', slug: 'duesseldorf' },
            { name: 'Dortmund', slug: 'dortmund' },
            { name: 'Essen', slug: 'essen' },
            { name: 'Leipzig', slug: 'leipzig' },
          ].map(city => (
            <Link key={city.slug} href={`/waermepumpe-beratung/${city.slug}`}
              className="px-4 py-3 bg-[#1A4731]/8 border border-[#1A4731]/20 rounded-lg text-[#1C2B2B] font-medium text-sm hover:bg-[#1A4731]/15 hover:border-[#1A4731]/40 transition-all text-center">
              {city.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
          <h2 className="text-[#1C2B2B] text-3xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Bereit? Kostenlose Anfrage starten
          </h2>
          <p className="text-[#4A6358] mb-8 max-w-lg mx-auto">
            In 2 Minuten ausgefüllt. Bis zu 3 Angebote geprüfter Fachbetriebe in 48 Stunden.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/kontakt"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold transition-all"
              style={{ background: '#1A4731' }}>
              Kostenlos anfragen
              <ArrowRight size={16} />
            </Link>
            <a href="tel:+4915563566199"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border-2 border-[#1A4731] text-[#1A4731] transition-all hover:bg-[#1A4731]/8">
              <Phone size={16} />
              +49 15563 566199
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
