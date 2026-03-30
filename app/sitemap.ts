// app/sitemap.ts
// Haupt-Sitemap: nur statische Seiten + Pillar Pages + Bundesland-Hubs
// Programmatische Stadtseiten → 22 Sub-Sitemaps (je 733 URLs)
import { MetadataRoute } from 'next';
import { KEYWORDS } from '@/lib/keywords';
import citiesData from '@/lib/cities.json';
import type { City } from '@/lib/city-utils';

const BASE = 'https://waermepumpenbegleiter.de';
const MOD  = new Date('2026-03-25');

const BUNDESLAENDER = [
  'berlin','hamburg','bayern','nordrhein-westfalen','baden-wuerttemberg',
  'niedersachsen','hessen','rheinland-pfalz','sachsen','thueringen',
  'sachsen-anhalt','mecklenburg-vorpommern','brandon','schleswig-holstein',
  'saarland','bremen',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = citiesData as City[];

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: MOD, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/rechner`,     lastModified: MOD, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/ueber-uns`,   lastModified: MOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/kontakt`,     lastModified: MOD, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/ratgeber`,    lastModified: MOD, changeFrequency: 'weekly',  priority: 0.8 },
  ];

  // 22 Pillar Pages
  const pillar_pages: MetadataRoute.Sitemap = KEYWORDS.map(kw => ({
    url: `${BASE}/${kw.slug}`,
    lastModified: MOD,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // 22 × 16 = 352 Bundesland-Hub-Seiten
  const hub_pages: MetadataRoute.Sitemap = KEYWORDS.flatMap(kw =>
    BUNDESLAENDER.map(bl => ({
      url: `${BASE}/${kw.slug}/bundesland/${bl}`,
      lastModified: MOD,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  // Top-100 Stadtseiten direkt in Haupt-Sitemap (höchste Priorität)
  const top_cities = [...cities]
    .sort((a, b) => b.einwohner - a.einwohner)
    .slice(0, 100);

  const top_city_pages: MetadataRoute.Sitemap = KEYWORDS
    .filter(kw => kw.tier === 1)
    .flatMap(kw => top_cities.map(city => ({
      url: `${BASE}/${kw.slug}/${city.slug}`,
      lastModified: MOD,
      changeFrequency: 'monthly' as const,
      priority: city.einwohner > 500000 ? 0.95 : city.einwohner > 100000 ? 0.85 : 0.75,
    })));

  return [...static_pages, ...pillar_pages, ...hub_pages, ...top_city_pages];
}
