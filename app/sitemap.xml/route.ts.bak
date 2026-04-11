// app/sitemap.xml/route.ts
// HAUPT-SITEMAP-INDEX — verweist auf alle Sub-Sitemaps
// Google und alle Crawler erwarten den Index unter /sitemap.xml
import { NextResponse } from 'next/server';
import { KEYWORDS } from '@/lib/keywords';

export const revalidate = 86400;

export async function GET() {
  const base = 'https://xn--wrmepumpenbegleiter-gwb.de';
  const lastmod = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/seiten-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/bundesland-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/video-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
${KEYWORDS.map(kw => `  <sitemap>
    <loc>${base}/${kw.slug}/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
