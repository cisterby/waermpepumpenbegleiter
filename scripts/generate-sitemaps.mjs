#!/usr/bin/env node
// scripts/generate-sitemaps.mjs
// Generiert statische XML-Sitemaps in /public/ vor dem Next.js Build.
// Statische Dateien in /public/ werden DIREKT serviert und können nicht
// von Dynamic Routes ([keywordSlug]) abgefangen werden → GSC-kompatibel.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

// ─── Config ────────────────────────────────────────────────────────
const DOMAIN = 'https://xn--wrmepumpenbegleiter-gwb.de';
const TODAY = new Date().toISOString().split('T')[0];

// ─── Daten laden ───────────────────────────────────────────────────
const cities = JSON.parse(readFileSync(join(ROOT, 'lib/cities.json'), 'utf8'));

// Keywords aus TypeScript extrahieren (kein TS-Compiler nötig)
const kwSource = readFileSync(join(ROOT, 'lib/keywords.ts'), 'utf8');
const kwRegex = /id:\s*(\d+),\s*tier:\s*(\d+),[\s\S]*?keyword:\s*'([^']+)',[\s\S]*?slug:\s*'([^']+)'/g;
const keywords = [];
let match;
while ((match = kwRegex.exec(kwSource)) !== null) {
  keywords.push({ id: +match[1], tier: +match[2], keyword: match[3], slug: match[4] });
}

const BUNDESLAENDER = [
  'berlin', 'hamburg', 'bayern', 'nordrhein-westfalen', 'baden-wuerttemberg',
  'niedersachsen', 'hessen', 'rheinland-pfalz', 'sachsen', 'thueringen',
  'sachsen-anhalt', 'mecklenburg-vorpommern', 'brandenburg', 'schleswig-holstein',
  'saarland', 'bremen',
];

console.log(`[sitemaps] ${keywords.length} Keywords, ${cities.length} Städte, ${BUNDESLAENDER.length} Bundesländer`);

// ─── Helpers ───────────────────────────────────────────────────────
function xmlHeader() {
  return '<?xml version="1.0" encoding="UTF-8"?>\n';
}

function urlEntry(loc, priority = 0.5, changefreq = 'monthly') {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function wrapUrlset(entries) {
  return xmlHeader() +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join('\n') + '\n</urlset>';
}

function wrapSitemapIndex(refs) {
  return xmlHeader() +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    refs.map(r => `  <sitemap>\n    <loc>${r}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`).join('\n') + '\n</sitemapindex>';
}

// ─── sitemap-0.xml: Statische Seiten + Pillar Pages ───────────────
const staticUrls = [
  urlEntry(DOMAIN, 1.0, 'weekly'),
  urlEntry(`${DOMAIN}/rechner`, 0.9, 'monthly'),
  urlEntry(`${DOMAIN}/wie-es-funktioniert`, 0.9, 'monthly'),
  urlEntry(`${DOMAIN}/ratgeber`, 0.8, 'weekly'),
  urlEntry(`${DOMAIN}/ueber-uns`, 0.8, 'monthly'),
  urlEntry(`${DOMAIN}/kontakt`, 0.7, 'monthly'),
];

// 22 Pillar Pages
for (const kw of keywords) {
  staticUrls.push(urlEntry(`${DOMAIN}/${kw.slug}`, 0.85, 'monthly'));
}

writeFileSync(join(PUBLIC, 'sitemap-0.xml'), wrapUrlset(staticUrls));
console.log(`[sitemaps] sitemap-0.xml → ${staticUrls.length} URLs (statisch + Pillar)`);

// ─── sitemap-bl.xml: Bundesland-Hub-Seiten ────────────────────────
const blUrls = [];
for (const kw of keywords) {
  for (const bl of BUNDESLAENDER) {
    blUrls.push(urlEntry(`${DOMAIN}/${kw.slug}/bundesland/${bl}`, 0.8, 'monthly'));
  }
}
writeFileSync(join(PUBLIC, 'sitemap-bl.xml'), wrapUrlset(blUrls));
console.log(`[sitemaps] sitemap-bl.xml → ${blUrls.length} URLs (Bundesland-Hubs)`);

// ─── sitemap-1.xml bis sitemap-N.xml: Je ein Keyword × alle Städte ──
const subSitemapFiles = ['sitemap-0.xml', 'sitemap-bl.xml'];
const sortedCities = [...cities].sort((a, b) => b.einwohner - a.einwohner);

for (let i = 0; i < keywords.length; i++) {
  const kw = keywords[i];
  const filename = `sitemap-${i + 1}.xml`;
  const urls = [];

  for (const city of sortedCities) {
    // Tier 4 Keywords × Kleinstädte (<20k) → noindex → nicht in Sitemap
    if (kw.tier >= 4 && city.einwohner < 20000) continue;

    let priority, changefreq;
    if (city.einwohner > 100000) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (city.einwohner > 50000) {
      priority = 0.7;
      changefreq = 'monthly';
    } else {
      priority = 0.5;
      changefreq = 'monthly';
    }

    urls.push(urlEntry(`${DOMAIN}/${kw.slug}/${city.slug}`, priority, changefreq));
  }

  writeFileSync(join(PUBLIC, filename), wrapUrlset(urls));
  subSitemapFiles.push(filename);
  console.log(`[sitemaps] ${filename} → ${urls.length} URLs (${kw.slug})`);
}

// ─── sitemap.xml: Sitemap-Index ───────────────────────────────────
const indexRefs = subSitemapFiles.map(f => `${DOMAIN}/${f}`);
writeFileSync(join(PUBLIC, 'sitemap.xml'), wrapSitemapIndex(indexRefs));
console.log(`[sitemaps] sitemap.xml → Sitemap-Index mit ${indexRefs.length} Sub-Sitemaps`);

// ─── robots.txt ───────────────────────────────────────────────────
const robotsTxt = `# robots.txt — wärmepumpenbegleiter.de
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: *?*

User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;
writeFileSync(join(PUBLIC, 'robots.txt'), robotsTxt);
console.log('[sitemaps] robots.txt generiert');

// ─── Zusammenfassung ──────────────────────────────────────────────
const totalUrls = staticUrls.length + blUrls.length +
  subSitemapFiles.filter(f => f.startsWith('sitemap-') && f !== 'sitemap-0.xml' && f !== 'sitemap-bl.xml')
    .length; // placeholder
console.log(`\n[sitemaps] Fertig! ${subSitemapFiles.length + 1} Dateien generiert (inkl. Index + robots.txt)`);
