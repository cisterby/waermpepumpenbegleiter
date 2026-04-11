// app/robots.ts
// Crawl-Budget-Optimierung: nur wertvolle Seiten crawlen lassen
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          // Interne Suchergebnisse & Filter verhindern
          '*?*',
        ],
      },
      {
        // GPTBot und andere AI-Crawler: crawl budget schonen
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://xn--wrmepumpenbegleiter-gwb.de/sitemap-index.xml',
  };
}
