// app/[keywordSlug]/[citySlug]/page.tsx
// Pattern: exakt wie DeinSolarBegleiter
// - citiesData direkt aus JSON importiert (nicht aus cities.ts)
// - CITIES array bleibt server-side
// - Templates erhalten city als PROP (kein cities-Import in client bundles)

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

// Exakt wie Solar: alle 16.126 Seiten pre-rendern, unbekannte → 404
export const dynamicParams = false;

export async function generateStaticParams() {
  const cities = citiesData as City[];
  return KEYWORDS.flatMap((kw) =>
    cities.map((city) => ({
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
  if (!keyword || !city) notFound();

  // Alle Berechnungen server-side — city wird als Prop an Client-Komponenten übergeben
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

  const breadcrumbSchema  = buildBreadcrumbSchema(keyword.slug, keyword.keyword.replace('[Stadt]', '').trim(), city);
  const localBizSchema    = buildLocalBusinessSchema(keyword.slug, city);
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
