// components/Footer.tsx
import Link from 'next/link';
import { Leaf, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const navLinks = [
  { href: '/wie-es-funktioniert', label: 'Wie es funktioniert' },
  { href: '/rechner', label: 'Rechner' },
  { href: '/ratgeber', label: 'Ratgeber' },
  { href: '/ueber-uns', label: 'Über uns' },
  { href: '/kontakt', label: 'Kontakt' },
];

const topCities = [
  { name: 'Berlin', slug: 'berlin' },
  { name: 'Hamburg', slug: 'hamburg' },
  { name: 'München', slug: 'muenchen' },
  { name: 'Köln', slug: 'koeln' },
  { name: 'Frankfurt', slug: 'frankfurt-am-main' },
  { name: 'Stuttgart', slug: 'stuttgart' },
  { name: 'Düsseldorf', slug: 'duesseldorf' },
  { name: 'Leipzig', slug: 'leipzig' },
];

const rechtliches = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
  { href: '/agb', label: 'AGB' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #0F1F16 0%, #0A1510 100%)' }}>

      {/* Top CTA strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-semibold text-lg leading-tight">
              Bereit für Ihre Wärmepumpe?
            </p>
            <p className="text-white/60 text-sm mt-1">
              Kostenlos · HWK-geprüfte Betriebe · KfW-Antrag inklusive
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="tel:+4915563566199"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all">
              <Phone size={15} />
              +49 15563 566199
            </a>
            <Link href="/kontakt"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#D97706', color: 'white' }}>
              Kostenloses Angebot →
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand col — 2 cols wide */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(76,175,125,0.2)', border: '1px solid rgba(76,175,125,0.3)' }}>
                <Leaf size={18} className="text-[#4CAF7D]" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-semibold text-[15px] text-white block leading-none">Wärmepumpenbegleiter</span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-white/50 mt-0.5 block">kostenlose Vermittlung</span>
              </div>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs mb-6">
              Ihr unabhängiger Begleiter für die Heizungswende. Wir verbinden Hausbesitzer kostenlos mit geprüften WP-Fachbetrieben — ohne Verkaufsdruck.
            </p>
            <div className="space-y-2.5">
              <a href="tel:+4915563566199"
                className="flex items-center gap-2.5 text-sm text-white/70 hover:text-[#4CAF7D] transition-colors">
                <Phone size={14} className="text-[#4CAF7D] shrink-0" />
                +49 15563 566199
              </a>
              <a href="mailto:info@waermepumpenbegleiter.de"
                className="flex items-center gap-2.5 text-sm text-white/70 hover:text-[#4CAF7D] transition-colors">
                <Mail size={14} className="text-[#4CAF7D] shrink-0" />
                info@waermepumpenbegleiter.de
              </a>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <MapPin size={14} className="text-[#4CAF7D] shrink-0" />
                Weißenfels, Sachsen-Anhalt
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-white/55 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top cities */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Große Städte
            </h4>
            <ul className="space-y-2.5">
              {topCities.map(city => (
                <li key={city.slug}>
                  <Link href={`/waermepumpe/${city.slug}`}
                    className="text-white/55 hover:text-[#4CAF7D] text-sm transition-colors">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + trust */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Rechtliches
            </h4>
            <ul className="space-y-2.5 mb-7">
              {rechtliches.map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-white/55 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[#4CAF7D] text-lg">🔒</span>
                <span className="text-white/60 text-xs">DSGVO-konform</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[#D97706] text-lg">✓</span>
                <span className="text-white/60 text-xs">Kostenloser Service</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs">
            © 2026 Wärmepumpenbegleiter.de — Webflott GbR, Weißenfels
          </p>
          <p className="text-white/30 text-xs text-center max-w-md">
            Wir erhalten eine Vermittlungsprovision von Installateuren. Für Hausbesitzer ist unser Service kostenlos.
          </p>
        </div>
      </div>
    </footer>
  );
}
