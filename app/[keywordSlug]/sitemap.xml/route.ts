// app/[keywordSlug]/sitemap.xml/route.ts
// Eine Sub-Sitemap pro Keyword — nur indexierbare Seiten!
// Tier 4 Keywords × Kleinstädte (<20k) werden ausgelassen (noindex)

import { NextRequest, NextResponse } from 'next/server';
import { KEYWORDS, getKeywordBySlug } from '@/lib/keywords';
import { getSitemapPriority } from '@/lib/city-utils';
import citiesData from '@/lib/cities.json';
import type { City } from '@/lib/city-utils';

const BUNDESLAENDER_SLUGS = [
  'berlin',
  'hamburg',
  'bayern',
  'nordrhein-westfalen',
  'baden-wuerttemberg',
  'niedersachsen',
  'hessen',
  'rheinland-pfalz',
  'sachsen',
  'thueringen',
  'sachsen-anhalt',
  'mecklenburg-vorpommern',
  'brandenburg',
  'schleswig-holstein',
  'saarland',
  'bremen',
];

export const revalidate = 86400;

export async function GET(
  _req: NextRequest,
  { params }: { params: { keywordSlug: string } }
) {
  const keyword = getKeywordBySlug(params.keywordSlug);
  if (!keyword) return new NextResponse('Not found', { status: 404 });

  const cities = citiesData as City[];
  const base = 'https://xn--wrmepumpenbegleiter-gwb.de';
  // Dynamisches lastmod: aktuelles Datum bei Generierung (ISR revalidiert täglich)
  const lastmod = new Date().toISOString().split('T')[0];

  // Nur indexierbare Seiten in die Sitemap aufnehmen
  // Muss synchron mit der noindex-Logik in [citySlug]/page.tsx sein
  const indexableCities = cities.filter(city => {
    // Tier 4 Keywords für kleine Städte (<20k) → noindex → nicht in Sitemap
    if (keyword.tier >= 4 && city.einwohner < 20000) return false;
    return true;
  });

  const cityUrls = indexableCities.map((city, index) => {
    // Tier-based priority: Top 50 cities (tier 1) = 0.9, next 100 (tier 2) = 0.7, rest = 0.5
    let basePriority = 0.5; // Default for rest
    if (index < 50) basePriority = 0.9;
    else if (index < 150) basePriority = 0.7;

    const priority = Math.min(basePriority, 1.0);
    return `  <url>
    <loc>${base}/${keyword.slug}/${city.slug}</loc>
    <lastmod>2026-04-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  // Add Bundesland hub page URLs
  const bundeslandUrls = BUNDESLAENDER_SLUGS.map(bundeslandSlug => {
    return `  <url>
    <loc>${base}/${keyword.slug}/bundesland/${bundeslandSlug}</loc>
    <lastmod>2026-04-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const urls = [...cityUrls, ...bundeslandUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

export async function generateStaticParams() {
  return KEYWORDS.map(kw => ({ keywordSlug: kw.slug }));
}