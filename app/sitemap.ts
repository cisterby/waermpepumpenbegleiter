// app/sitemap.ts
import { MetadataRoute } from 'next';
import { KEYWORDS } from '@/lib/keywords';
import { CITIES, getSitemapPriority } from '@/lib/cities';

const BASE = 'https://waermepumpenbegleiter.de';

// Feste Daten statt new Date() — verhindert dass Google 16k Seiten
// bei jedem Deploy als "geändert" einstuft und Crawl-Budget verschwendet
const CORE_LAST_MOD  = new Date('2026-03-25');
const PAGE_LAST_MOD  = new Date('2026-03-25');

export default function sitemap(): MetadataRoute.Sitemap {

  // ── Statische Kernseiten ──────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: CORE_LAST_MOD, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/rechner`,         lastModified: CORE_LAST_MOD, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/ueber-uns`,       lastModified: CORE_LAST_MOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/kontakt`,         lastModified: CORE_LAST_MOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/ratgeber`,        lastModified: CORE_LAST_MOD, changeFrequency: 'weekly',  priority: 0.8 },
  ];

  // ── Pillar Pages (22 Keyword-Übersichtsseiten) ────────────────────────────
  const pillarPages: MetadataRoute.Sitemap = KEYWORDS.map((kw) => ({
    url: `${BASE}/${kw.slug}`,
    lastModified: CORE_LAST_MOD,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // ── Programmatische City × Keyword Seiten ────────────────────────────────
  // Sortierung: Tier 1 × Großstädte zuerst → wichtigste Seiten für Crawl-Budget
  const sortedKeywords = [...KEYWORDS].sort((a, b) => a.tier - b.tier);
  const sortedCities   = [...CITIES].sort((a, b) => b.einwohner - a.einwohner);

  const programmaticPages: MetadataRoute.Sitemap = sortedKeywords.flatMap((kw) =>
    sortedCities.map((city) => ({
      url: `${BASE}/${kw.slug}/${city.slug}`,
      lastModified: PAGE_LAST_MOD,
      changeFrequency: 'monthly' as const,
      priority: getSitemapPriority(city, kw.sitemapPriority),
    }))
  );

  return [...staticPages, ...pillarPages, ...programmaticPages];
}
