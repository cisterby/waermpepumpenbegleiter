import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { EXPERIMENTS } from './lib/ab-testing';

export function middleware(request: NextRequest) {
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
