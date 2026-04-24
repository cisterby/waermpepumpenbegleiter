import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { EXPERIMENTS } from './lib/ab-testing';
import { CITY_SLUGS } from './lib/valid-slugs';

// Gültige Keyword-Slugs (22 Stück) — statisch, ändert sich selten
const KEYWORD_SLUGS = new Set([
  'waermepumpe', 'waermepumpe-kosten', 'waermepumpe-installateur',
  'waermepumpe-foerderung', 'luft-wasser-waermepumpe', 'waermepumpe-kaufen',
  'waermepumpe-altbau', 'waermepumpe-nachruesten', 'heizung-tauschen',
  'waermepumpe-installation', 'kommunale-waermeplanung', 'erdwaermepumpe',
  'waermepumpe-angebot', 'waermepumpe-preise', 'waermepumpe-anbieter',
  'luftwaermepumpe', 'waermepumpe-neubau', 'waermepumpe-beratung',
  'waermepumpe-fachbetrieb', 'waermepumpe-montage', 'waermepumpe-oder-gas',
  'waermepumpe-stromverbrauch',
]);

// Statische Routen, die nicht validiert werden müssen
const STATIC_ROUTES = new Set([
  '', 'rechner', 'ratgeber', 'faq', 'kontakt', 'ueber-uns',
  'wie-es-funktioniert', 'impressum', 'datenschutz', 'agb',
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);

  // Bereits geprüft (Rewrite-Loop verhindern)
  if (request.nextUrl.searchParams.has('_mw')) {
    return NextResponse.next();
  }

  // 2-Segment-Routen: /[keywordSlug]/[citySlug] — Stadt validieren
  if (segments.length === 2 && !segments[0].startsWith('_')) {
    const [kwSlug, citySlug] = segments;

    // Bundesland-Segment oder opengraph-image durchlassen
    if (citySlug !== 'bundesland' && citySlug !== 'opengraph-image') {
      if (!KEYWORD_SLUGS.has(kwSlug) || !CITY_SLUGS.has(citySlug)) {
        // Rewrite auf ungültigen Slug → Pillar Page (dynamicParams=false) → 404
        const url = request.nextUrl.clone();
        url.pathname = '/__invalid_slug__';
        url.searchParams.set('_mw', '1');
        return NextResponse.rewrite(url);
      }
    }
  }

  // 3-Segment-Routen: /keyword/bundesland/slug — Keyword validieren
  if (segments.length === 3 && segments[1] === 'bundesland') {
    if (!KEYWORD_SLUGS.has(segments[0])) {
      const url = request.nextUrl.clone();
      url.pathname = '/__invalid_slug__';
      url.searchParams.set('_mw', '1');
      return NextResponse.rewrite(url);
    }
  }

  const response = NextResponse.next();

  // Set A/B test cookies for new visitors
  for (const [id, experiment] of Object.entries(EXPERIMENTS)) {
    const cookieName = `ab_${id}`;
    if (!request.cookies.get(cookieName)) {
      const variant = experiment.variants[Math.floor(Math.random() * experiment.variants.length)];
      response.cookies.set(cookieName, variant, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: false, // Allow JS read for analytics
        sameSite: 'lax',
        path: '/',
      });
    }
  }

  return response;
}

// Only run on page routes, not API/static
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon|icon|apple-icon|robots|sitemap).*)'],
};
