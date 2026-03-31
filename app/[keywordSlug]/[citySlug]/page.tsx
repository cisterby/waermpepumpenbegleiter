// app/[keywordSlug]/[citySlug]/page.tsx
// ISR-Strategie: Nur Top-Seiten pre-builden, Rest on-demand (cached)
// Buildzeit: ~2 Min statt ~17 Min | SEO: identisch zu SSG

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import citiesData from '@/lib/cities.json';
import { KEYWORDS, getKeywordBySlug, fillTemplate } from '@/lib/keywords';
import { getCityBySlug, getNearbyCity, estimateJAZ, buildBreadcrumbSchema, buildLocalBusinessSchema } from '@/lib/cities';
import type { City } from '@/lib/city-utils';
import { calcBetriebskosten, calcFoerderung } from '@/lib/calculations';
import CityPageRouter from '@/components/programmatic/CityPageRouter';

interface Props {
  params: { keywordSlug: string; citySlug: string };
}

// DEV-MODUS: Jede Anfrage wird frisch gerendert — kein Caching
// → Änderungen sofort sichtbar ohne Cache-Probleme
// Nach Abschluss der Entwicklung auf ISR umstellen:
//   export const revalidate = 3600; (1 Stunde)
export const dynamic = 'force-dynamic';

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
  const title = fillTemplate(keyword.titleTemplate, city, jaz, calc.wpKosten, calc.ersparnis);
  const desc  = fillTemplate(keyword.metaTemplate,  city, jaz, calc.wpKosten, calc.ersparnis);
  const url   = `https://waermepumpenbegleiter.de/${keyword.slug}/${city.slug}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title, description: desc, url,
      type: 'website', locale: 'de_DE',
      images: [{ url: 'https://waermepumpenbegleiter.de/opengraph-image.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description: desc },
    robots: { index: true, follow: true },
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
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: keyword.faqPool.slice(0, 4).map(item => ({
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
    '@id': `https://waermepumpenbegleiter.de/\${keyword.slug}/\${city.slug}#service`,
    name: `\${keyword.keyword.replace('[Stadt]', city.name).trim()}`,
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
      '@id': 'https://waermepumpenbegleiter.de/#organization',
      name: 'Wärmepumpenbegleiter.de',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Kostenlose Vermittlung an geprüfte Wärmepumpen-Fachbetriebe',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <CityPageRouter
        city={city}
        keyword={keyword}
        calc={calc}
        foerd={foerd}
        jaz={jaz}
        nearby={nearby}
        h1={h1}
        allCities={citiesData as City[]}
      />
    </>
  );
}
