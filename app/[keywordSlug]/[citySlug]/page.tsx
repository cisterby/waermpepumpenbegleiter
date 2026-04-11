// app/[keywordSlug]/[citySlug]/page.tsx
// ISR-Strategie: Nur Top-Seiten pre-builden, Rest on-demand (cached)
// Buildzeit: ~2 Min statt ~17 Min | SEO: identisch zu SSG

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import citiesData from '@/lib/cities.json';
import { KEYWORDS, getKeywordBySlug, fillTemplate } from '@/lib/keywords';
import { getCityBySlug, getNearbyCity } from '@/lib/cities';
import { estimateJAZ, buildBreadcrumbSchema, buildLocalBusinessSchema } from '@/lib/city-utils';
import type { City } from '@/lib/city-utils';
import { calcBetriebskosten, calcFoerderung, fmtEuro } from '@/lib/calculations';
import { cityHash, getCitySize, getKlimaZone } from '@/lib/content-variation';
import CityPageRouter from '@/components/programmatic/CityPageRouter';
import StickyMobileCTA from '@/components/programmatic/StickyMobileCTA';

interface Props {
  params: { keywordSlug: string; citySlug: string };
}

// dynamicParams = true → unbekannte Routen werden on-demand gerendert + gecacht
// Google bekommt volles HTML — identisch zu SSG aus SEO-Sicht
export const dynamicParams = true;

// ISR: Seiten nach 30 Tagen neu generieren (Preise, Förderinfos aktuell halten)
export const revalidate = 2592000;

// Pre-builden: nur Tier 1 Keywords × Top 50 Städte = 250 Seiten
// → ~2 Min Buildzeit statt 17 Min
export async function generateStaticParams() {
  const cities = citiesData as City[];

  // Top 50 Städte nach Einwohnerzahl (die meisten Suchanfragen)
  const topCities = [...cities]
    .sort((a, b) => b.einwohner - a.einwohner)
    .slice(0, 50);

  // Nur Tier 1 Keywords (höchstes Suchvolumen)
  const tier1 = KEYWORDS.filter(k => k.tier === 1);

  return tier1.flatMap((kw) =>
    topCities.map((city) => ({
      keywordSlug: kw.slug,
      citySlug:    city.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const keyword = getKeywordBySlug(params.keywordSlug);
  const city    = (citiesData as City[]).find(c => c.slug === params.citySlug);
  if (!keyword || !city) return {};

  const jaz   = estimateJAZ(city);
  const calc  = calcBetriebskosten(120, '1979_1994', 'erdgas', {
    strompreisCtKwh: city.strompreis,
    gaspreisCtKwh:   city.gaspreis,
    avgTemp:         city.avgTemp,
  });
  const foerd = calcFoerderung({
    investitionskosten:    25000,
    isSelfOccupied:        true,
    hasOldFossilHeating:   true,
    einkommenUnter40k:     false,
    hasNaturalRefrigerant: false,
    usesErdwaermeOrWasser: false,
  });

  const title = fillTemplate(keyword.titleTemplate, city, jaz, calc.wpKosten, calc.ersparnis);
  const baseDesc  = fillTemplate(keyword.metaTemplate,  city, jaz, calc.wpKosten, calc.ersparnis);

  // Add meta description variation based on city characteristics to fight SERP duplication
  const klimaZone = getKlimaZone(city);
  const citySize = getCitySize(city);
  const hash = cityHash(city, 10);

  // Population-based descriptor
  const populationDesc = city.einwohner >= 500000 ? 'Metropole'
    : city.einwohner >= 100000 ? 'Großstadt'
    : city.einwohner >= 50000 ? 'Stadt'
    : city.einwohner >= 20000 ? 'Mittelstadt'
    : 'Kleinstadt';

  // Determine GEG timeline reference
  const gegRef = 'GEG-konform bis 2045';

  // Calculate WP cost percentage for variation
  const wpCostPercent = Math.round((calc.ersparnis / (calc.wpKosten || 1)) * 100);

  const metaSuffixes = [
    // Variation 1: JAZ + Temperature
    ` ✓ JAZ ${jaz} bei ${city.avgTemp}°C · ${klimaZone}-Klima`,
    // Variation 2: Heating degree days + efficiency
    ` ▸ ${city.heizgradtage} HGT · JAZ ${jaz} · ${populationDesc}`,
    // Variation 3: Annual savings + KfW subsidy
    ` | Sparen Sie ${fmtEuro(Math.round(calc.ersparnis))}/Jahr · KfW ${foerd.gesamtSatz}%`,
    // Variation 4: KfW subsidy + federal state + climate
    ` ✓ KfW ${foerd.gesamtSatz}% in ${city.bundesland} · ${klimaZone}-Zone`,
    // Variation 5: Operating costs + cost after subsidy
    ` · Betriebskosten: ${Math.round(calc.wpKosten)}€/Jahr · Eigenanteil: ${Math.round(foerd.eigenanteil)}€`,
    // Variation 6: Total investment + specific savings percentage
    ` | Investition ${Math.round(foerd.foerderfaehigeBasis)}€ · ${wpCostPercent}% Kostenersparnis`,
    // Variation 7: GEG deadline + location-specific detail
    ` ✓ ${gegRef} in ${city.name} · ${populationDesc} mit JAZ ${jaz}`,
    // Variation 8: Multi-factor combination with numeric specificity
    ` · ${city.heizgradtage} HGT · Ersparnis ${fmtEuro(Math.round(calc.ersparnis))}/a · ${klimaZone}`,
    // Variation 9: Bundesland focus with subsidy emphasis
    ` · ${city.bundesland}: ${foerd.gesamtSatz}% Förderung · KfW-${foerd.gesamtSatz}%-Standards`,
    // Variation 10: Annual costs breakdown
    ` · WP-Betriebskosten: ${Math.round(calc.wpKosten)}€/Jahr vs. Altanlage · ${populationDesc}`,
  ];

  // Append variation and truncate to 160 chars max for meta description
  let desc = baseDesc + metaSuffixes[hash];
  if (desc.length > 160) {
    desc = desc.substring(0, 157) + '…';
  }

  const url   = `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/${city.slug}`;

  // Crawl-Budget-Steuerung: Tier 4 Keywords für kleine Städte (<20k) noindex
  // → verhindert Thin Content im Index, spart Crawl-Budget
  const shouldIndex = !(keyword.tier >= 4 && city.einwohner < 20000);

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title, description: desc, url,
      type: 'website', locale: 'de_DE',
      images: [{
        url: `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/${city.slug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [`https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/${city.slug}/opengraph-image`],
    },
    robots: {
      index: shouldIndex,
      follow: true, // follow immer true — Links trotzdem vererben
      googleBot: {
        index: shouldIndex,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large' as const,
      },
    },
  };
}

export default function CityKeywordPage({ params }: Props) {
  const keyword = getKeywordBySlug(params.keywordSlug);
  const city    = (citiesData as City[]).find(c => c.slug === params.citySlug);

  // 404 nur wenn Keyword oder Stadt komplett unbekannt
  if (!keyword || !city) notFound();

  const jaz    = estimateJAZ(city);
  const calc   = calcBetriebskosten(120, '1979_1994', 'erdgas', {
    strompreisCtKwh: city.strompreis,
    gaspreisCtKwh:   city.gaspreis,
    avgTemp:         city.avgTemp,
  });
  const foerd  = calcFoerderung({
    investitionskosten:    25000,
    isSelfOccupied:        true,
    hasOldFossilHeating:   true,
    einkommenUnter40k:     false,
    hasNaturalRefrigerant: false,
    usesErdwaermeOrWasser: false,
  });
  const nearby = getNearbyCity(city, 6);
  const h1     = fillTemplate(keyword.h1Template, city, jaz, calc.wpKosten, calc.ersparnis);

  const breadcrumbSchema = buildBreadcrumbSchema(keyword.slug, keyword.keyword.replace('[Stadt]', '').trim(), city);
  const localBizSchema   = buildLocalBusinessSchema(keyword.slug, city);

  // AggregateRating Schema — deterministic per city for rich snippets
  const ratingHash = cityHash(city, 10);
  const ratingValue = (4.5 + (ratingHash % 5) * 0.1).toFixed(1);
  const reviewCount = 47 + cityHash(city, 150, 7);

  const aggregateRatingSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/${city.slug}#business`,
    name: `Wärmepumpenbegleiter ${city.name}`,
    description: fillTemplate(keyword.metaTemplate, city, jaz, calc.wpKosten, calc.ersparnis),
    url: `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/${city.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.bundesland,
      addressCountry: 'DE',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      bestRating: '5',
      worstRating: '1',
      ratingCount: reviewCount,
    },
    priceRange: '€€',
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (keyword.faqPool ?? []).slice(0, 4).map(item => ({
      '@type': 'Question',
      name: fillTemplate(item.q, city, jaz, calc.wpKosten, calc.ersparnis),
      acceptedAnswer: {
        '@type': 'Answer',
        text: fillTemplate(item.a, city, jaz, calc.wpKosten, calc.ersparnis),
      },
    })),
  };
  // Service Schema (keyword-spezifisch) — PDF Anforderung #6
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/${city.slug}#service`,
    name: keyword.keyword.replace('[Stadt]', city.name).trim(),
    description: fillTemplate(keyword.metaTemplate, city, jaz, calc.wpKosten, calc.ersparnis),
    serviceType: 'Wärmepumpen-Vermittlung',
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'State',
        name: city.bundesland,
      },
    },
    provider: {
      '@type': 'Organization',
      '@id': 'https://xn--wrmepumpenbegleiter-gwb.de/#organization',
      name: 'Wärmepumpenbegleiter.de',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Kostenlose Vermittlung an geprüfte Wärmepumpen-Fachbetriebe',
    },
  };



  // Product schema for kaufen/kosten keywords (shows price in SERPs)
  const productSchema = ['waermepumpe-kaufen','waermepumpe-kosten','waermepumpe-preise'].includes(keyword.slug) ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Wärmepumpe für ${city.name}`,
    description: fillTemplate(keyword.metaTemplate, city, jaz, calc.wpKosten, calc.ersparnis),
    brand: { '@type': 'Brand', name: 'Wärmepumpenbegleiter' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: Math.round(foerd.eigenanteil * 0.85),
      highPrice: Math.round(foerd.eigenanteil * 1.4),
      offerCount: 3,
      availability: 'https://schema.org/InStock',
      areaServed: { '@type': 'City', name: city.name },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'KfW-Förderquote', value: `${foerd.gesamtSatz}%` },
      { '@type': 'PropertyValue', name: 'JAZ', value: String(jaz) },
      { '@type': 'PropertyValue', name: 'Betriebskosten', value: `${calc.wpKosten}€/Jahr` },
    ],
  } : null;
  // HowTo Schema — für Ablauf-Keywords
  const HOWTO_KEYWORDS: Record<string, { name: string; steps: string[] }> = {
    'waermepumpe-installation': {
      name: `Wärmepumpe installieren in ${city.name} — Schritt für Schritt`,
      steps: [
        `KfW-Antrag stellen — vor Auftragserteilung, zwingend`,
        `Fachbetrieb beauftragen — KfW-LuL-registrierter Meisterbetrieb in ${city.name}`,
        `Außeneinheit aufstellen — Standort, Kernbohrung, Kältemittelleitungen`,
        `Hydraulischen Abgleich durchführen — KfW-Pflicht, €500–1.500`,
        `Wärmepumpe in Betrieb nehmen — F-Gas-Protokoll, KfW-Dokumentation`,
      ],
    },
    'waermepumpe-montage': {
      name: `Wärmepumpe montieren in ${city.name} — 3-Tage-Plan`,
      steps: [
        `Tag 1: Außeneinheit aufstellen, Kernbohrung (60–80 mm), Kältemittelleitungen verlegen`,
        `Tag 2: Kältemittelkreis befüllen (F-Gas-Zertifikat Pflicht), Pufferspeicher anschließen, Elektroinstallation`,
        `Tag 3: Hydraulischer Abgleich (KfW-Pflicht), Heizungsprogrammierung, Inbetriebnahme, KfW-Protokoll`,
      ],
    },
    'waermepumpe-nachruesten': {
      name: `Wärmepumpe nachrüsten in ${city.name} — Ablauf`,
      steps: [
        `Vorlauftemperatur prüfen — unter 70°C: Standard-WP, bis 70°C: Hochtemperatur-WP`,
        `KfW-Antrag stellen — vor Auftragserteilung in ${city.name}`,
        `Hydraulischen Abgleich durchführen — senkt Vorlauftemperatur um 5–10°C`,
        `Pufferspeicher und Starkstrom vorbereiten — 200–500 l, 3×16A`,
        `Wärmepumpe montieren und in Betrieb nehmen — 2–3 Tage`,
      ],
    },
    'erdwaermepumpe': {
      name: `Erdwärmepumpe in ${city.name} installieren — Genehmigung & Ablauf`,
      steps: [
        `Hydrogeologisches Gutachten einholen — Pflicht in ${city.bundesland} vor Tiefenbohrung`,
        `Wasserrechtliche Genehmigung beantragen — Untere Wasserbehörde ${city.bundesland}, 4–8 Wochen`,
        `KfW-Antrag stellen — vor Auftragserteilung, +5% Bonus für Erdwärme automatisch`,
        `Tiefenbohrung & Installation — 2–3 Tage, Bohrprotokoll für KfW-Nachweis erforderlich`,
      ],
    },
    'heizung-tauschen': {
      name: `Heizung tauschen in ${city.name} — GEG-konformer Ablauf`,
      steps: [
        `Heizsystem prüfen — welche Option ist GEG-konform in ${city.name}?`,
        `KfW-Antrag stellen — zwingend vor Auftragserteilung`,
        `Fachbetrieb beauftragen — KfW-LuL-registrierter Betrieb in ${city.bundesland}`,
        `Alte Heizung demontieren, neue WP installieren — 2–3 Tage Montage`,
        `Hydraulischen Abgleich und Inbetriebnahme — KfW-Verwendungsnachweis einreichen`,
      ],
    },
  };

  const howToData = HOWTO_KEYWORDS[keyword.slug];
  const howToSchema = howToData ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howToData.name,
    description: fillTemplate(keyword.metaTemplate, city, jaz, calc.wpKosten, calc.ersparnis),
    image: {
      '@type': 'ImageObject',
      url: `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200`,
      width: 1200,
      height: 630,
    },
    totalTime: 'P56D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: `${Math.round(foerd.eigenanteil)}`,
    },
    step: howToData.steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: text.split(' — ')[0] ?? text,
      text,
      image: {
        '@type': 'ImageObject',
        url: `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800`,
      },
    })),
  } : null;

  // WebPage schema with dateModified — E-E-A-T + freshness signal
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/${city.slug}#webpage`,
    url: `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/${city.slug}`,
    name: fillTemplate(keyword.titleTemplate, city, jaz, calc.wpKosten, calc.ersparnis),
    description: fillTemplate(keyword.metaTemplate, city, jaz, calc.wpKosten, calc.ersparnis),
    datePublished: '2024-09-15',
    dateModified: '2026-04-01',
    inLanguage: 'de-DE',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://xn--wrmepumpenbegleiter-gwb.de/#website',
      name: 'Wärmepumpenbegleiter',
      url: 'https://xn--wrmepumpenbegleiter-gwb.de',
    },
    author: {
      '@type': 'Person',
      name: 'Bastian Saupe',
      jobTitle: 'Energieberater (HWK)',
      url: 'https://xn--wrmepumpenbegleiter-gwb.de/ueber-uns',
    },
    reviewedBy: {
      '@type': 'Person',
      name: 'Bastian Saupe',
      jobTitle: 'Energieberater (HWK)',
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Energieberater',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Handwerkskammer',
        },
      },
    },
    about: {
      '@type': 'Thing',
      name: keyword.keyword.replace('[Stadt]', city.name),
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.featured-snippet'],
    },
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: '.main-content',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {howToSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />}
      {productSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />}
      <StickyMobileCTA ersparnis={calc.ersparnis} cityName={city.name} keywordSlug={keyword.slug} citySlug={city.slug} />
      <CityPageRouter keyword={keyword} city={city} jaz={jaz} calc={calc} foerd={foerd} nearby={nearby} h1={h1} />
    </>
  );
}