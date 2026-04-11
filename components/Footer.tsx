// components/Footer.tsx
import Link from 'next/link';
import { Leaf, Phone, Mail, MapPin } from 'lucide-react';

const navLinks = [
  { href: '/wie-es-funktioniert', label: 'Wie es funktioniert' },
  { href: '/rechner', label: 'Rechner' },
  { href: '/ratgeber', label: 'Ratgeber' },
  { href: '/ueber-uns', label: 'Über uns' },
  { href: '/kontakt', label: 'Kontakt' },
];

const topCities = [
  { name: 'Berlin',     slug: 'berlin' },
  { name: 'Hamburg',    slug: 'hamburg' },
  { name: 'München',    slug: 'muenchen' },
  { name: 'Köln',       slug: 'koeln' },
  { name: 'Frankfurt',  slug: 'frankfurt-am-main' },
  { name: 'Stuttgart',  slug: 'stuttgart' },
  { name: 'Düsseldorf', slug: 'duesseldorf' },
  { name: 'Leipzig',    slug: 'leipzig' },
];

const rechtliches = [
  { href: '/impressum',   label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
  { href: '/agb',         label: 'AGB' },
];

// Contrast rule: on #0F1F16 background, use white at min 75% for readability
// WCAG AA requires 4.5:1 — white/75 on #0F1F16 achieves ~7:1 ✓

export default function Footer() {
  return (
    <footer style={{ background: '#0F1F16' }}>

      {/* CTA strip — light bg for contrast */}
      <div style={{ background: '#1A4731', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-white text-lg font-semibold leading-tight">
              Bereit für Ihre Wärmepumpe?
            </p>
            <p className="text-white/80 text-sm mt-1">
              Kostenlos · HWK-geprüfte Betriebe · KfW-Antrag inklusive
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="tel:+4915563566199"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Phone size={15} />
              +49 15563 566199
            </a>
            <Link href="/kontakt"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: '#D97706' }}>
              Kostenloses Angebot →
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(76,175,125,0.2)', border: '1px solid rgba(76,175,125,0.4)' }}>
                <Leaf size={18} style={{ color: '#4CAF7D' }} strokeWidth={2.5} />
              </div>
              <div>
                {/* white text on dark bg — always readable */}
                <span className="text-white font-semibold text-[15px] block leading-none">
                  Wärmepumpenbegleiter
                </span>
                <span className="text-[11px] uppercase tracking-wider block mt-0.5"
                  style={{ color: '#4CAF7D' }}>
                  kostenlose Vermittlung
                </span>
              </div>
            </Link>

            {/* Body text: white/80 = clearly readable on dark */}
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'rgba(255,255,255,0.80)' }}>
              Ihr unabhängiger Begleiter für die Heizungswende. Kostenlos, herstellerunabhängig, ohne Verkaufsdruck.
            </p>

            <div className="space-y-3">
              <a href="tel:+4915563566199"
                className="flex items-center gap-2.5 text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.85)' }}>
                <Phone size={14} style={{ color: '#4CAF7D' }} className="shrink-0" />
                +49 15563 566199
              </a>
              <a href="mailto:info@xn--wrmepumpenbegleiter-gwb.de"
                className="flex items-center gap-2.5 text-sm"
                style={{ color: 'rgba(255,255,255,0.85)' }}>
                <Mail size={14} style={{ color: '#4CAF7D' }} className="shrink-0" />
                info@xn--wrmepumpenbegleiter-gwb.de
              </a>
              <div className="flex items-center gap-2.5 text-sm"
                style={{ color: 'rgba(255,255,255,0.70)' }}>
                <MapPin size={14} style={{ color: '#4CAF7D' }} className="shrink-0" />
                Weißenfels, Sachsen-Anhalt
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map(item => (
                <li key={item.href}>
                  {/* white/85 — clearly readable on #0F1F16 */}
                  <Link href={item.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              Große Städte
            </h4>
            <ul className="space-y-3">
              {topCities.map(city => (
                <li key={city.slug}>
                  <Link href={`/waermepumpe/${city.slug}`}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-3 mb-7">
              {rechtliches.map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span className="text-base">🔒</span>
                {/* explicit color — no opacity trick */}
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.90)' }}>DSGVO-konform</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span className="text-base">✓</span>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.90)' }}>Kostenloser Service</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
            © 2026 Wärmepumpenbegleiter.de — Webflott GbR, Weißenfels
          </p>
          <p className="text-xs text-center max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Wir erhalten eine Vermittlungsprovision von Installateuren. Für Hausbesitzer ist unser Service kostenlos.
          </p>
        </div>
      </div>

    </footer>
  );
}
