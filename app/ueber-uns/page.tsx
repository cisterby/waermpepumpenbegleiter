// app/ueber-uns/page.tsx
'use client';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Users, Award, MapPin, Phone } from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80';
const TEAM_IMG  = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80';
const OFFICE_IMG= 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80';

const WERTE = [
  { icon: '🏠', title: 'Hausbesitzer-zuerst', text: 'Unser Service ist für Hausbesitzer immer kostenlos. Wir verdienen nur, wenn Sie einen Auftrag erteilen — kein Interessenkonflikt.' },
  { icon: '🔍', title: 'Herstellerunabhängig', text: 'Wir sind an keinen Hersteller gebunden. Wir empfehlen was zu Ihrem Haus und Budget passt — nicht was die höchste Provision bringt.' },
  { icon: '✓', title: 'Geprüfte Betriebe', text: 'Alle Partnerbetriebe sind HWK-eingetragen, KfW-LuL-registriert und haben mindestens 5 WP-Referenzen. Wir prüfen vorab — Sie profitieren.' },
  { icon: '📋', title: 'KfW-Begleitung', text: 'Wir helfen beim KfW-Antrag kostenlos. Viele Hausbesitzer scheitern am Papierkram — wir nicht. Bis zu 70% Förderung sichern.' },
];

const STATS = [
  { value: '16.126', label: 'Stadtseiten', sub: '733 Städte × 22 Keywords' },
  { value: '3', label: 'Angebote', sub: 'je Anfrage, in 48 Stunden' },
  { value: '70%', label: 'KfW-Förderung', sub: 'max. €21.000 Zuschuss' },
  { value: '100%', label: 'Kostenlos', sub: 'für Hausbesitzer' },
];

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <img src={HERO_IMG} alt="Das Wärmepumpenbegleiter-Team"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,21,16,0.92) 40%, rgba(10,21,16,0.4) 100%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16 pt-32 w-full">
          <span className="inline-block px-4 py-1.5 bg-[#4CAF7D]/20 border border-[#4CAF7D]/40 rounded-full text-[#4CAF7D] text-xs font-semibold uppercase tracking-wider mb-5">
            Über uns
          </span>
          <h1 className="font-display text-white text-4xl sm:text-5xl font-bold leading-tight max-w-2xl mb-5">
            Unabhängige WP-Vermittlung — aus Weißenfels für ganz Deutschland
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-xl">
            Wärmepumpenbegleiter.de ist ein Projekt von Webflott, gegründet von Bastian Saupe und Philip Lindner. Wir glauben: die Energiewende funktioniert nur, wenn der Weg zur Wärmepumpe einfach und transparent ist.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#1A4731]">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.value} className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
                <div className="text-[#4CAF7D] font-semibold text-sm mt-0.5">{s.label}</div>
                <div className="text-white/50 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* Mission */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#1A4731] font-semibold text-xs uppercase tracking-widest mb-3 block">Unsere Mission</span>
            <h2 className="text-[#1C2B2B] text-3xl font-bold font-display leading-tight mb-5">
              Die Heizungswende einfacher machen
            </h2>
            <div className="space-y-4 text-[#4A6358] leading-relaxed">
              <p>
                Die Wärmepumpe ist die beste Antwort auf steigende Energiepreise, CO₂-Kosten und GEG-Anforderungen. Aber der Weg dahin ist kompliziert: KfW-Anträge, Installateur-Auswahl, Heizlastberechnung, Förderrichtlinien.
              </p>
              <p>
                Wir nehmen Hausbesitzern genau diese Komplexität ab. Kostenlos. Herstellerunabhängig. Mit lokalem Wissen für 733 Städte in ganz Deutschland.
              </p>
            </div>
            <div className="mt-7 space-y-3">
              {['Kostenloser Service für Hausbesitzer', 'Herstellerunabhängige Empfehlungen', 'KfW-Antragsbegleitung inklusive', 'Nur geprüfte HWK-Meisterbetriebe'].map(t => (
                <div key={t} className="flex items-center gap-2.5 text-[#1C2B2B] text-sm font-medium">
                  <CheckCircle size={16} className="text-[#1A4731] shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img src={TEAM_IMG} alt="Bastian Saupe und Philip Lindner" className="w-full h-80 object-cover" />
            <div className="absolute bottom-0 inset-x-0 p-5" style={{ background: 'linear-gradient(to top, rgba(10,21,16,0.88), transparent)' }}>
              <p className="text-white font-semibold">Bastian Saupe & Philip Lindner</p>
              <p className="text-white/65 text-sm">Gründer — Webflott, Weißenfels</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-10">
            <span className="text-[#1A4731] font-semibold text-xs uppercase tracking-widest mb-3 block">Was uns ausmacht</span>
            <h2 className="text-[#1C2B2B] text-3xl font-bold font-display">Unsere Werte</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WERTE.map(w => (
              <div key={w.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl mb-4 block">{w.icon}</span>
                <h3 className="text-[#1C2B2B] font-bold text-base mb-2">{w.title}</h3>
                <p className="text-[#4A6358] text-sm leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Office image + contact */}
        <section className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <img src={OFFICE_IMG} alt="Webflott Office Weißenfels" className="w-full h-72 lg:h-full object-cover" />
          <div className="p-8">
            <span className="text-[#1A4731] font-semibold text-xs uppercase tracking-widest mb-3 block">Kontakt</span>
            <h2 className="text-[#1C2B2B] text-2xl font-bold font-display mb-5">Sprechen Sie uns an</h2>
            <div className="space-y-4 mb-7">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#1A4731]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} className="text-[#1A4731]" />
                </div>
                <div>
                  <p className="text-[#1C2B2B] font-semibold text-sm">Adresse</p>
                  <p className="text-[#4A6358] text-sm">Weißenfels, Sachsen-Anhalt</p>
                </div>
              </div>
              <a href="tel:+4915563566199" className="flex items-start gap-3 group">
                <div className="w-9 h-9 bg-[#1A4731]/10 group-hover:bg-[#1A4731]/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                  <Phone size={16} className="text-[#1A4731]" />
                </div>
                <div>
                  <p className="text-[#1C2B2B] font-semibold text-sm">Telefon</p>
                  <p className="text-[#1A4731] text-sm font-medium group-hover:underline">+49 15563 566199</p>
                </div>
              </a>
              <a href="mailto:info@xn--wrmepumpenbegleiter-gwb.de" className="flex items-start gap-3 group">
                <div className="w-9 h-9 bg-[#1A4731]/10 group-hover:bg-[#1A4731]/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                  <Users size={16} className="text-[#1A4731]" />
                </div>
                <div>
                  <p className="text-[#1C2B2B] font-semibold text-sm">E-Mail</p>
                  <p className="text-[#1A4731] text-sm font-medium group-hover:underline">info@xn--wrmepumpenbegleiter-gwb.de</p>
                </div>
              </a>
            </div>
            <Link href="/kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all"
              style={{ background: '#1A4731' }}>
              Kostenlos anfragen
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Vermittlungshinweis */}
        <div className="bg-[#1A4731]/8 border border-[#1A4731]/20 rounded-2xl p-6 text-center">
          <p className="text-[#1C2B2B] text-sm leading-relaxed max-w-2xl mx-auto">
            <strong className="text-[#1A4731]">Transparenzhinweis:</strong> Wärmepumpenbegleiter.de ist ein Vermittlungsportal. Wir erhalten eine Vermittlungsprovision von Installateueren.
          </p>
        </div>
      </div>
    </div>
  );
}