// lib/cities.ts
// Städtedaten — nur server-side verwenden (page.tsx, generateStaticParams, sitemap)
// 'use client' Komponenten → @/lib/city-utils importieren (keine CITIES-Daten!)
// Pattern: exakt wie DeinSolarBegleiter (lib/cities.json + server-only import)

import citiesData from './cities.json';
export type { City, Stadttyp } from './city-utils';
import type { City } from './city-utils';

export const CITIES = citiesData as City[];

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find(c => c.slug === slug)
}

export function getCitiesByBundesland(bl: string): City[] {
  return CITIES.filter(c => c.bundeslandSlug === bl)
}

export function getNearbyCity(city: City, count = 6): City[] {
  // Erst aus vorberechneten nearbyCities-Slugs
  const fromNearby = city.nearbyCities
    .slice(0, count)
    .map(s => CITIES.find(c => c.slug === s))
    .filter(Boolean) as City[]
  if (fromNearby.length >= count) return fromNearby
  // Fallback: Distanzberechnung
  return CITIES
    .filter(c => c.id !== city.id)
    .map(c => ({ city: c, dist: Math.sqrt(Math.pow(c.lat - city.lat, 2) + Math.pow(c.lng - city.lng, 2)) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
    .map(x => x.city)
}

// Re-exports from city-utils for convenience (server-side use only)
export {
  estimateJAZ,
  calcCityBetriebskosten,
  calcPVKombiErsparnis,
  getVariantIndex,
  getKlimazone,
  getSitemapPriority,
  calcCO2Ersparnis,
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
} from './city-utils'
