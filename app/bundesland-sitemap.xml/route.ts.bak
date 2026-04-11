// app/bundesland-sitemap.xml/route.ts
// Eigene Sitemap für alle 352 Bundesland-Hub-Seiten (22 Keywords × 16 Bundesländer)
// Trennung von Stadtseiten für bessere Crawl-Budget-Steuerung

import { NextResponse } from 'next/server';
import { KEYWORDS } from '@/lib/keywords';

export const revalidate = 86400;

const BUNDESLAENDER_SLUGS = [
  'berlin', 'hamburg', 'bayern', 'nordrhein-westfalen', 'baden-wuerttemberg',
  'niedersachsen', 'hessen', 'rheinland-pfalz', 'sachsen', 'thueringen',
  'sachsen-anhalt', 'mecklenburg-vorpommern', 'brandenburg', 'schleswig-holstein',
  'saarland', 'bremen',
];

export async function GET() {
  const base = 'https://xn--wrmepumpenbegleiter-gwb.de';
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = KEYWORDS.flatMap(kw =>
    BUNDESLAENDER_SLUGS.map(bl => `  <url>
    <loc>${base}/${kw.slug}/bundesland/${bl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
  );

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
