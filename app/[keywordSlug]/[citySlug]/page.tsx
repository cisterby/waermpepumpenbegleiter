// app/[keywordSlug]/[citySlug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KEYWORDS, getKeywordBySlug, fillTemplate } from '@/lib/keywords';
import { CITIES, getCityBySlug, estimateJAZ, getNearbyCity } from '@/lib/cities';
import { calcBetriebskosten, calcFoerderung } from '@/lib/calculations';
import CityPageRouter from '@/components/programmatic/CityPageRouter';

interface Props {
  params: { keywordSlug: string; citySlug: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const sortedKeywords = [...KEYWORDS].sort((a, b) => a.tier - b.tier);
  const sortedCities   = [...CITIES].sort((a, b) => b.einwohner - a.einwohner);
  return sortedKeywords.flatMap((kw) =>
    sortedCities.map((city) => ({ keywordSlug: kw.slug, citySlug: city.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city    = getCityBySlug(params.citySlug);
  const keyword = getKeywordBySlug(params.keywordSlug);
  if (!city || !keyword) return {};

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
    robots: { index: true, follow: true },
  };
}

export default function CityKeywordPage({ params }: Props) {
  const city    = getCityBySlug(params.citySlug);
  const keyword = getKeywordBySlug(params.keywordSlug);
  if (!city || !keyword) notFound();

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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://waermepumpenbegleiter.de' },
      { '@type': 'ListItem', position: 2, name: keyword.keyword.replace('[Stadt]', '').trim(), item: `https://waermepumpenbegleiter.de/${keyword.slug}` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `https://waermepumpenbegleiter.de/${keyword.slug}/${city.slug}` },
    ],
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CityPageRouter
        city={city}
        keyword={keyword}
        calc={calc}
        foerd={foerd}
        jaz={jaz}
        nearby={nearby}
        h1={h1}
        allCities={CITIES}
      />
    </>
  );
}
