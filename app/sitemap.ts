// app/sitemap.ts
import { MetadataRoute } from 'next';
import { KEYWORDS } from '@/lib/keywords';
import { getSitemapPriority } from '@/lib/city-utils';
import citiesData from '@/lib/cities.json';
import type { City } from '@/lib/city-utils';

const BASE = 'https://waermepumpenbegleiter.de';
const CORE_LAST_MOD = new Date('2026-03-25');
const PAGE_LAST_MOD = new Date('2026-03-25');

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = citiesData as City[];

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: CORE_LAST_MOD, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/rechner`,     lastModified: CORE_LAST_MOD, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/ueber-uns`,   lastModified: CORE_LAST_MOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/kontakt`,     lastModified: CORE_LAST_MOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/ratgeber`,    lastModified: CORE_LAST_MOD, changeFrequency: 'weekly',  priority: 0.8 },
  ];

  const pillarPages: MetadataRoute.Sitemap = KEYWORDS.map((kw) => ({
    url: `${BASE}/${kw.slug}`,
    lastModified: CORE_LAST_MOD,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const programmaticPages: MetadataRoute.Sitemap = KEYWORDS.flatMap((kw) =>
    cities.map((city) => ({
      url: `${BASE}/${kw.slug}/${city.slug}`,
      lastModified: PAGE_LAST_MOD,
      changeFrequency: 'monthly' as const,
      priority: getSitemapPriority(city, kw.sitemapPriority),
    }))
  );

  return [...staticPages, ...pillarPages, ...programmaticPages];
}
