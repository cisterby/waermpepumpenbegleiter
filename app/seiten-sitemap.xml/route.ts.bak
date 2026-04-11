// app/seiten-sitemap.xml/route.ts
// Sub-Sitemap für statische Seiten + 22 Keyword-Pillar-Pages
import { NextResponse } from 'next/server';
import { KEYWORDS } from '@/lib/keywords';

export const revalidate = 86400;

export async function GET() {
  const base = 'https://xn--wrmepumpenbegleiter-gwb.de';
  const lastmod = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: base,                              changefreq: 'weekly',  priority: 1.0 },
    { loc: `${base}/rechner`,                 changefreq: 'monthly', priority: 0.9 },
    { loc: `${base}/wie-es-funktioniert`,     changefreq: 'monthly', priority: 0.9 },
    { loc: `${base}/ratgeber`,                changefreq: 'weekly',  priority: 0.8 },
    { loc: `${base}/ueber-uns`,               changefreq: 'monthly', priority: 0.8 },
    { loc: `${base}/kontakt`,                 changefreq: 'monthly', priority: 0.7 },
  ];

  const pillarPages = KEYWORDS.map(kw => ({
    loc: `${base}/${kw.slug}`,
    changefreq: 'monthly',
    priority: 0.85,
  }));

  const urls = [...staticPages, ...pillarPages].map(p => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);

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
