// app/sitemap-[keywordSlug].xml/route.ts
// Eine Sub-Sitemap pro Keyword (22 × 733 = 16.126 URLs aufgeteilt)
// Datei liegt unter: app/sitemap-[slug].xml/route.ts (nicht direkt möglich)
// Stattdessen: app/[keywordSlug]/sitemap.xml/route.ts

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
  const base = 'https://waermepumpenbegleiter.de';
  const lastmod = new Date('2026-03-25').toISOString();

  const urls = cities.map(city => {
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
