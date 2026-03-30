// components/Footer.tsx
import Link from 'next/link';
import { Leaf, ArrowRight, MapPin, Phone, Mail, Shield, Zap, Users } from 'lucide-react';

const navigation = [
  { label: 'Wie es funktioniert', href: '/#wie-es-funktioniert' },
  { label: 'Kostenrechner', href: '/rechner' },
  { label: 'Ratgeber', href: '/ratgeber' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Kontakt', href: '/kontakt' },
];

const staedte = [
  { name: 'Berlin', slug: 'berlin' },
  { name: 'Hamburg', slug: 'hamburg' },
  { name: 'München', slug: 'muenchen' },
  { name: 'Köln', slug: 'koeln' },
  { name: 'Frankfurt', slug: 'frankfurt-am-main' },
  { name: 'Stuttgart', slug: 'stuttgart' },
  { name: 'Düsseldorf', slug: 'duesseldorf' },
  { name: 'Hannover', slug: 'hannover' },
];

const rechtliches = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
];

const stats = [
  { icon: MapPin, val: '733', label: 'Städte' },
  { icon: Shield, val: '100%', label: 'Kostenlos' },
  { icon: Zap, val: '48h', label: 'Antwortzeit' },
  { icon: Users, val: '3', label: 'Angebote max.' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(175deg, #0E1F16 0%, #0A1910 100%)' }}>

      {/* ── CTA-Streifen ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-heading font-extrabold text-white text-xl mb-1">
                Bereit für Ihre Wärmepumpe?
              </p>
              <p className="text-white/45 text-sm">
                Kostenlos anfragen · Geprüfte lokale Betriebe · KfW-Antrag inklusive
              </p>
            </div>
            <Link href="/rechner"
              className="flex items-center gap-2 px-6 py-3 bg-wp-amber hover:bg-amber-700 text-white font-heading font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5 shrink-0 shadow-lg shadow-amber-900/30">
              Kostenloses Angebot <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats-Leiste ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.025)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-wp-green/30 flex items-center justify-center shrink-0">
                  <s.icon size={15} className="text-wp-green3" />
                </div>
                <div>
                  <p className="font-mono font-bold text-white text-base leading-none">{s.val}</p>
                  <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Haupt-Footer ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-8">

          {/* Brand-Block */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-8 h-8 bg-wp-green rounded-lg flex items-center justify-center shadow-lg shadow-green-900/40">
                <Leaf size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-heading font-bold text-[15px] text-white group-hover:text-wp-green3 transition-colors">
                Wärmepumpenbegleiter
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-xs">
              Herstellerunabhängige Informationen und kostenlose Vermittlung an geprüfte
              Wärmepumpen-Fachbetriebe in 733 deutschen Städten.
            </p>

            {/* Trust-Badges */}
            <div className="space-y-2 mb-6">
              {[
                'HWK-geprüfte Partnerbetriebe',
                'KfW-Antragsbegleitung inklusive',
                'Herstellerunabhängig seit 2024',
              ].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-white/50">
                  <span className="text-wp-green3 font-bold">✓</span>
                  {t}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { name: 'LinkedIn', url: 'https://www.linkedin.com/company/waermepumpenbegleiter' },
                { name: 'Instagram', url: 'https://www.instagram.com/waermepumpenbegleiter' },
                { name: 'Facebook', url: 'https://www.facebook.com/waermepumpenbegleiter' },
              ].map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-lg transition-all">
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-heading font-semibold text-xs uppercase tracking-widest text-wp-green3 mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm text-white/55 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-wp-green3/50 group-hover:bg-wp-green3 transition-colors shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Städte */}
          <div>
            <p className="font-heading font-semibold text-xs uppercase tracking-widest text-wp-green3 mb-4">
              Top-Städte
            </p>
            <ul className="space-y-2.5">
              {staedte.map((s) => (
                <li key={s.slug}>
                  <Link href={`/waermepumpe/${s.slug}`}
                    className="text-sm text-white/55 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-wp-green3/50 group-hover:bg-wp-green3 transition-colors shrink-0" />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches + Kontakt */}
          <div>
            <p className="font-heading font-semibold text-xs uppercase tracking-widest text-wp-green3 mb-4">
              Rechtliches
            </p>
            <ul className="space-y-2.5 mb-8">
              {rechtliches.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}
                    className="text-sm text-white/55 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-wp-green3/50 group-hover:bg-wp-green3 transition-colors shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="font-heading font-semibold text-xs uppercase tracking-widest text-wp-green3 mb-3">
              Kontakt
            </p>
            <div className="space-y-2">
              <a href="mailto:kontakt@waermepumpenbegleiter.de"
                className="flex items-center gap-2 text-xs text-white/45 hover:text-white transition-colors">
                <Mail size={11} className="text-wp-green3 shrink-0" />
                kontakt@waermepumpenbegleiter.de
              </a>
              <p className="flex items-center gap-2 text-xs text-white/45">
                <Phone size={11} className="text-wp-green3 shrink-0" />
                Mo–Fr 8–18 Uhr
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © 2026 Wärmepumpenbegleiter.de — Webflott GbR, Weißenfels
          </p>
          <p className="text-xs text-white/25 text-center">
            Wir erhalten eine Vermittlungsprovision von Installateuren. Für Sie ist unser Service kostenlos.
          </p>
        </div>
      </div>
    </footer>
  );
}
