import Link from 'next/link';
import { Leaf } from 'lucide-react';

const navigation = [
  { label: 'Wie es funktioniert', href: '/#wie-es-funktioniert' },
  { label: 'Rechner', href: '/rechner' },
  { label: 'Ratgeber', href: '/ratgeber' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Kontakt', href: '/kontakt' },
];

const staedte = [
  'Berlin', 'Hamburg', 'München', 'Köln',
  'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Hannover',
];

const rechtliches = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
  { label: 'Cookie-Einstellungen', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-wp-darker text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-wp-green3" strokeWidth={2} />
              <span className="font-sans font-semibold text-[15px] text-white">
                Wärmepumpenbegleiter
              </span>
            </Link>
            <p className="font-sans text-sm leading-relaxed text-white/55 mb-6">
              Ihr unabhängiger Begleiter für die Heizungswende.
            </p>
            <div className="flex gap-4">
              {[
                { name: 'LinkedIn', url: 'https://www.linkedin.com/company/waermepumpenbegleiter' },
                { name: 'Instagram', url: 'https://www.instagram.com/waermepumpenbegleiter' },
                { name: 'Facebook', url: 'https://www.facebook.com/waermepumpenbegleiter' },
              ].map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="font-sans text-xs text-wp-green3 hover:text-white transition-colors">
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm text-white mb-4">
              Städte
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Berlin', slug: 'berlin' }, { name: 'Hamburg', slug: 'hamburg' },
                { name: 'München', slug: 'muenchen' }, { name: 'Köln', slug: 'koeln' },
                { name: 'Frankfurt', slug: 'frankfurt-am-main' }, { name: 'Stuttgart', slug: 'stuttgart' },
                { name: 'Düsseldorf', slug: 'duesseldorf' }, { name: 'Hannover', slug: 'hannover' },
              ].map((s) => (
                <li key={s.slug}>
                  <Link href={`/waermepumpe/${s.slug}`}
                    className="font-sans text-sm text-white/55 hover:text-white transition-colors">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm text-white mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-3">
              {rechtliches.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-white/55 hover:text-white transition-colors"
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
          <p className="font-sans text-xs text-white/45">
            &copy; 2026 Wärmepumpenbegleiter.de
          </p>
          <p className="font-sans text-xs text-white/35 text-center max-w-xl">
            Wir erhalten eine Vermittlungsprovision von Installateuren. Für Sie ist unser Service kostenlos.
          </p>
        </div>
      </div>
    </footer>
  );
}
