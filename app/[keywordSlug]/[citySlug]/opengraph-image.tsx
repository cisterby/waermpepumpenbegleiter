// app/[keywordSlug]/[citySlug]/opengraph-image.tsx
// Stadtspezifisches og:image mit Keyword + Stadt als Overlay
// Next.js 13 ImageResponse — kein Canvas, kein CDN nötig

import { ImageResponse } from 'next/server';
import { getKeywordBySlug } from '@/lib/keywords';
import citiesData from '@/lib/cities.json';
import type { City } from '@/lib/city-utils';

export const runtime = 'edge';
export const alt = 'Wärmepumpenbegleiter';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: { keywordSlug: string; citySlug: string };
}) {
  const keyword = getKeywordBySlug(params.keywordSlug);
  const city = (citiesData as City[]).find(c => c.slug === params.citySlug);

  const kwLabel = keyword
    ? keyword.keyword.replace('[Stadt]', '').trim()
    : 'Wärmepumpe';
  const cityName = city?.name ?? params.citySlug;
  const jaz = city ? (3.5 + (city.avgTemp - 9.0) * 0.1).toFixed(1) : '3.5';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0A1F14 0%, #1B5E37 60%, #0A2E1A 100%)',
          padding: '60px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF7D' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Wärmepumpenbegleiter.de
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Keyword badge */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(76,175,125,0.2)',
            border: '1px solid rgba(76,175,125,0.4)',
            borderRadius: 8,
            padding: '8px 20px',
            width: 'fit-content',
          }}>
            <span style={{ color: '#4CAF7D', fontSize: 22, fontWeight: 600 }}>
              {kwLabel}
            </span>
          </div>

          {/* City name - big */}
          <div style={{ color: '#FFFFFF', fontSize: 86, fontWeight: 800, lineHeight: 1.0, letterSpacing: '-2px' }}>
            {cityName}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32, marginTop: 8 }}>
            {[
              { label: 'KfW-Förderung', value: 'Bis 70%' },
              { label: 'JAZ in ' + cityName, value: jaz },
              { label: 'Unser Service', value: 'Kostenlos' },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>{stat.label}</span>
                <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.3)',
          fontSize: 15,
        }}>
          Geprüfte lokale Fachbetriebe · KfW-Antragsbegleitung · Herstellerunabhängig
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
