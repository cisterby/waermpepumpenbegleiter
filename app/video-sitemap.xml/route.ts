// app/video-sitemap.xml/route.ts
// Video sitemap for Google Video Search - includes thumbnails and metadata

import citiesData from '@/lib/cities.json';
import { KEYWORDS } from '@/lib/keywords';
import type { City } from '@/lib/city-utils';

export const revalidate = 86400;

export async function GET() {
  const cities = (citiesData as City[]).slice(0, 100); // Top 100 cities only
  const tier1Keywords = KEYWORDS.filter(k => k.tier <= 2);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

  const base = 'https://xn--wrmepumpenbegleiter-gwb.de';

  for (const kw of tier1Keywords) {
    for (const city of cities) {
      const url = `${base}/${kw.slug}/${city.slug}`;
      const title = kw.keyword.replace('[Stadt]', city.name);
      const description = `Alles über ${kw.keyword.replace('[Stadt]', '').trim()} in ${city.name}: Kosten, Förderung, Installation.`;

      xml += `  <url>\n`;
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <video:video>\n`;
      xml += `      <video:thumbnail_loc>${base}${kw.slug}/${city.slug}/opengraph-image</video:thumbnail_loc>\n`;
      xml += `      <video:title>${escapeXml(title)} — Video-Guide</video:title>\n`;
      xml += `      <video:description>${escapeXml(description)}</video:description>\n`;
      xml += `      <video:family_friendly>yes</video:family_friendly>\n`;
      xml += `    </video:video>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}

// Helper function to escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
