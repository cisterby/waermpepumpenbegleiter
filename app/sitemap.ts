// app/sitemap.ts
// Haupt-Sitemap: NUR statische Seiten + 22 Pillar Pages
// Keine Duplikate — Bundesland-Hubs → /bundesland-sitemap.xml
// Stadtseiten → 22 Keyword-Sub-Sitemaps
import { MetadataRoute } from 'next';
import { KEYWORDS } from '@/lib/keywords';

const BASE = 'https://xn--wrmepumpenbegleiter-gwb.de';
const MOD  = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,                              lastModified: MOD, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/rechner`,                 lastModified: MOD, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/wie-es-funktioniert`,     lastModified: MOD, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/ueber-uns`,               lastModified: MOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/ratgeber`,                lastModified: MOD, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/kontakt`,                 lastModified: MOD, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // 22 Pillar Pages
  const pillar_pages: MetadataRoute.Sitemap = KEYWORDS.map(kw => ({
    url: `${BASE}/${kw.slug}`,
    lastModified: MOD,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  return [...static_pages, ...pillar_pages];
}