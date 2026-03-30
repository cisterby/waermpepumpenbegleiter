// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    // Sitemap-Index verweist auf alle 22 Sub-Sitemaps
    sitemap: 'https://waermepumpenbegleiter.de/sitemap-index.xml',
    host: 'https://waermepumpenbegleiter.de',
  };
}
