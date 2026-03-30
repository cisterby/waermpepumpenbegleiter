// app/sitemap-index.xml/route.ts
// Sitemap-Index der auf alle 22 Sub-Sitemaps verweist
// Google empfiehlt Sub-Sitemaps bei >10k URLs
import { NextResponse } from 'next/server';
import { KEYWORDS } from '@/lib/keywords';

export const revalidate = 86400; // 24h

export async function GET() {
  const base = 'https://waermepumpenbegleiter.de';
  const lastmod = new Date('2026-03-25').toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap-core.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
${KEYWORDS.map(kw => `  <sitemap>
    <loc>${base}/sitemap-${kw.slug}.xml</loc>
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
