import Link from 'next/link';
import { Leaf } from 'lucide-react';

const navigation = [
  { label: 'Wie es funktioniert', href: '/wie-es-funktioniert' },
  { label: 'Rechner', href: '/rechner' },
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
  { label: 'Cookie-Einstellungen', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F1F16] text-wp-text-on-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-wp-primary-mid" strokeWidth={2} />
              <span className="font-body font-semibold text-[15px] text-wp-text-on-dark">
                Wärmepumpenbegleiter
              </span>
            </Link>
            <p className="font-body text-sm leading-relaxed text-wp-text-on-dark/60 mb-6">
              Ihr unabhängiger Begleiter für die Heizungswende.
            </p>
            <div className="flex gap-4">
              {[
                { label: 'LinkedIn', href: 'https://www.linkedin.com/company/waermepumpenbegleiter' },
                { label: 'Instagram', href: 'https://www.instagram.com/waermepumpenbegleiter' },
                { label: 'Facebook', href: 'https://www.facebook.com/waermepumpenbegleiter' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs text-wp-primary-mid hover:text-wp-primary-light transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm text-wp-text-on-dark mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-wp-text-on-dark/60 hover:text-wp-text-on-dark transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm text-wp-text-on-dark mb-4">
              Städte
            </h4>
            <ul className="space-y-3">
              {staedte.map((stadt) => (
                <li key={stadt.slug}>
                  <Link
                    href={`/waermepumpe/${stadt.slug}`}
                    className="font-body text-sm text-wp-text-on-dark/60 hover:text-wp-primary-mid transition-colors"
                  >
                    {stadt.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-sm text-wp-text-on-dark mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-3">
              {rechtliches.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-wp-text-on-dark/60 hover:text-wp-text-on-dark transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-wp-text-on-dark/50">
            &copy; 2026 Wärmepumpenbegleiter.de
          </p>
          <p className="font-body text-xs text-wp-text-on-dark/40 text-center max-w-xl">
            Wir erhalten eine Vermittlungsprovision von Installateuren. Für Sie ist unser Service kostenlos.
          </p>
        </div>
      </div>
    </footer>
  );
}
