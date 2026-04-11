// app/[keywordSlug]/sitemap.xml/route.ts
// Eine Sub-Sitemap pro Keyword — nur indexierbare Seiten!
// Tier 4 Keywords × Kleinstädte (<20k) werden ausgelassen (noindex)

import { NextRequest, NextResponse } from 'next/server';
import { KEYWORDS, getKeywordBySlug } from '@/lib/keywords';
import { getSitemapPriority } from '@/lib/city-utils';
import citiesData from '@/lib/cities.json';
import type { City } from '@/lib/city-utils';

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

  const urls = indexableCities.map(city => {
    const priority = getSitemapPriority(city, keyword.sitemapPriority);
    return `  <url>
    <loc>${base}/${keyword.slug}/${city.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

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