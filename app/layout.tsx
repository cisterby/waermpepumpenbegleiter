// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Outfit, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Font-Optimierung: nur tatsächlich genutzte Weights laden
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'], // 800 entfernt — wird nicht genutzt
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
  weight: ['500', '700'], // 600 entfernt — nur für Preise/Zahlen gebraucht
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  themeColor: '#1B5E37',
};

export const metadata: Metadata = {
  title: {
    default: 'Wärmepumpenbegleiter.de – Kostenlose WP-Vermittlung in Deutschland',
    template: '%s | Wärmepumpenbegleiter.de',
  },
  description:
    'Wir finden den besten Wärmepumpen-Installateur in Ihrer Region – kostenlos, herstellerunabhängig, ohne Verkaufsdruck. Bis zu 3 Angebote vergleichen.',
  keywords: ['Wärmepumpe', 'Wärmepumpe installieren', 'Wärmepumpe Kosten', 'Wärmepumpe Förderung', 'KfW Wärmepumpe', 'Wärmepumpe Installateur', 'Heizung tauschen'],
  metadataBase: new URL('https://xn--wrmepumpenbegleiter-gwb.de'),
  alternates: { canonical: 'https://xn--wrmepumpenbegleiter-gwb.de' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://xn--wrmepumpenbegleiter-gwb.de',
    siteName: 'Wärmepumpenbegleiter.de',
    title: 'Wärmepumpenbegleiter.de – Kostenlose WP-Vermittlung',
    description:
      'Wir finden den besten Wärmepumpen-Installateur in Ihrer Region – kostenlos, herstellerunabhängig, ohne Verkaufsdruck.',
    images: [{
      url: 'https://xn--wrmepumpenbegleiter-gwb.de/opengraph-image.png',
      width: 1200,
      height: 630,
      alt: 'Wärmepumpenbegleiter.de',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://xn--wrmepumpenbegleiter-gwb.de/opengraph-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
  '@id': 'https://xn--wrmepumpenbegleiter-gwb.de/#organization',
  name: 'Wärmepumpenbegleiter.de',
  url: 'https://xn--wrmepumpenbegleiter-gwb.de',
  logo: {
    '@type': 'ImageObject',
    url: 'https://xn--wrmepumpenbegleiter-gwb.de/logo.png',
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
  email: 'info@xn--wrmepumpenbegleiter-gwb.de',
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
    url: 'https://xn--wrmepumpenbegleiter-gwb.de/ueber-uns',
    sameAs: 'https://www.webflott.de',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Kundenservice',
    availableLanguage: 'German',
    telephone: '+49-176-32987455',
    email: 'info@xn--wrmepumpenbegleiter-gwb.de',
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
  '@id': 'https://xn--wrmepumpenbegleiter-gwb.de/ueber-uns#bastian-saupe',
  name: 'Bastian Saupe',
  jobTitle: 'Gründer & Geschäftsführer',
  description: 'Gründer von Wärmepumpenbegleiter.de und Webflott. Spezialist für programmatische SEO-Portale und digitale Lead-Generierung in der Energiebranche.',
  knowsAbout: ['Wärmepumpen', 'KfW-Förderung BEG', 'GEG', 'Energiewende', 'Digitale Vermittlungsportale'],
  worksFor: { '@type': 'Organization', name: 'Wärmepumpenbegleiter.de', url: 'https://xn--wrmepumpenbegleiter-gwb.de' },
  sameAs: ['https://www.webflott.de'],
  url: 'https://xn--wrmepumpenbegleiter-gwb.de/ueber-uns',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://xn--wrmepumpenbegleiter-gwb.de/#website',
  url: 'https://xn--wrmepumpenbegleiter-gwb.de',
  name: 'Wärmepumpenbegleiter.de',
  description: 'Unabhängiges Wärmepumpen-Vermittlungsportal für Deutschland',
  publisher: { '@id': 'https://xn--wrmepumpenbegleiter-gwb.de/#organization' },
  inLanguage: 'de-DE',
  copyrightYear: 2026,
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://xn--wrmepumpenbegleiter-gwb.de/rechner?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${outfit.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />

        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />

        {/* Prefetch critical navigation destinations */}
        <link rel="prefetch" href="/rechner" />
        <link rel="prefetch" href="/ratgeber" />

        {/* Schema.org structured data */}
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
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#1A4731] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold">Zum Hauptinhalt springen</a>
        <Navigation />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}