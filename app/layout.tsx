// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Outfit, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Wärmepumpenbegleiter.de – Kostenlose WP-Vermittlung in Deutschland',
    template: '%s | Wärmepumpenbegleiter.de',
  },
  description:
    'Wir finden den besten Wärmepumpen-Installateur in Ihrer Region – kostenlos, herstellerunabhängig, ohne Verkaufsdruck. Bis zu 3 Angebote vergleichen.',
  metadataBase: new URL('https://waermepumpenbegleiter.de'),
  alternates: { canonical: 'https://waermepumpenbegleiter.de' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://waermepumpenbegleiter.de',
    siteName: 'Wärmepumpenbegleiter.de',
    title: 'Wärmepumpenbegleiter.de – Kostenlose WP-Vermittlung',
    description:
      'Wir finden den besten Wärmepumpen-Installateur in Ihrer Region – kostenlos, herstellerunabhängig, ohne Verkaufsdruck.',
    images: [{
      url: 'https://waermepumpenbegleiter.de/opengraph-image.png',
      width: 1200,
      height: 630,
      alt: 'Wärmepumpenbegleiter.de',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://waermepumpenbegleiter.de/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ── Schema: Organization (E-E-A-T) ──────────────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://waermepumpenbegleiter.de/#organization',
  name: 'Wärmepumpenbegleiter.de',
  url: 'https://waermepumpenbegleiter.de',
  logo: {
    '@type': 'ImageObject',
    url: 'https://waermepumpenbegleiter.de/logo.png',
    width: 280,
    height: 60,
  },
  description:
    'Wärmepumpenbegleiter.de ist ein unabhängiges Wärmepumpen-Vermittlungsportal. Wir verbinden Hausbesitzer kostenlos mit geprüften Wärmepumpen-Installateuren in ihrer Region.',
  foundingDate: '2025',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Zum Ried 3',
    postalCode: '06688',
    addressLocality: 'Weißenfels',
    addressCountry: 'DE',
  },
  areaServed: { '@type': 'Country', name: 'Deutschland' },
  email: 'info@waermepumpenbegleiter.de',
  telephone: '+49-176-32987455',
  sameAs: [
    'https://www.webflott.de',
    'https://www.instagram.com/waermepumpenbegleiter',
    'https://www.facebook.com/waermepumpenbegleiter',
    'https://www.linkedin.com/company/waermepumpenbegleiter',
  ],
  founder: {
    '@type': 'Person',
    name: 'Bastian Saupe',
    url: 'https://waermepumpenbegleiter.de/ueber-uns',
    sameAs: 'https://www.webflott.de',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Kundenservice',
    availableLanguage: 'German',
    telephone: '+49-176-32987455',
    email: 'info@waermepumpenbegleiter.de',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'Webflott',
    url: 'https://www.webflott.de',
  },
  knowsAbout: [
    'Wärmepumpen',
    'Luft-Wasser-Wärmepumpen',
    'KfW-Förderung BEG',
    'Gebäudeenergiegesetz GEG',
    'Heizungssanierung',
    'Energiewende',
    'Wärmepumpenvermittlung',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Wärmepumpen-Vermittlungsleistungen',
    itemListElement: [{
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Kostenlose Wärmepumpen-Vermittlung',
        description: 'Wir vermitteln kostenlos an geprüfte Wärmepumpen-Installationsbetriebe in Deutschland.',
      },
      price: '0',
      priceCurrency: 'EUR',
    }],
  },
};


const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://waermepumpenbegleiter.de/ueber-uns#markus-sommer',
  name: 'Dr. Markus Sommer',
  jobTitle: 'Energieberater (IHK)',
  description: 'Spezialist für Heizsystemvergleiche und KfW-Förderanträge. Ehemals Sachverständiger bei der Verbraucherzentrale NRW.',
  knowsAbout: ['Wärmepumpen', 'KfW-Förderung BEG', 'GEG', 'Heizungssanierung', 'JAZ'],
  worksFor: { '@type': 'Organization', name: 'Wärmepumpenbegleiter.de', url: 'https://waermepumpenbegleiter.de' },
  url: 'https://waermepumpenbegleiter.de/ueber-uns',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://waermepumpenbegleiter.de/#website',
  url: 'https://waermepumpenbegleiter.de',
  name: 'Wärmepumpenbegleiter.de',
  description: 'Unabhängiges Wärmepumpen-Vermittlungsportal für Deutschland',
  publisher: { '@id': 'https://waermepumpenbegleiter.de/#organization' },
  inLanguage: 'de-DE',
  copyrightYear: 2026,
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://waermepumpenbegleiter.de/rechner?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${outfit.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={`${dmSans.className} antialiased bg-wp-bg text-wp-text`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
