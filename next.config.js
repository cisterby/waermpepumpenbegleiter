/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Brotli/Gzip compression
  compress: true,

  // Modern image formats
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Unsplash-Bilder über Next.js Image Proxy optimieren
    minimumCacheTTL: 2592000, // 30 Tage
  },

  // Trailing Slash konsistent halten (kein Duplicate Content)
  trailingSlash: false,

  // Powered-by Header entfernen (Security + weniger Bytes)
  poweredByHeader: false,

  // HTTP headers: caching, security, X-Robots, crawl budget
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache city pages with ISR-aware caching
        source: '/:keywordSlug/:citySlug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        // Sitemaps cachen
        source: '/sitemap:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
        ],
      },
      {
        // Security headers on all pages
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Strict-Transport-Security für HTTPS
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },

  // Redirects: URL-Normalisierung gegen Duplicate Content
  async redirects() {
    return [
      // Trailing-Slash Redirect (Duplicate Content vermeiden)
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
