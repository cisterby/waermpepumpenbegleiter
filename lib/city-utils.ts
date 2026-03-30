// lib/city-utils.ts
// Pure utility functions for WP calculations — NO cities array import
// Safe to use in 'use client' components — won't bundle 733 cities into client JS
// Pattern: same as DeinSolarBegleiter's lib/city-utils.ts

export type Stadttyp = 'Grossstadt' | 'Mittelstadt' | 'Kleinstadt';

export type City = {
  id: number; name: string; slug: string; plz: string
  bundesland: string; bundeslandSlug: string; einwohner: number
  lat: number; lng: number
  heizgradtage: number; avgTemp: number; normAussentemp: number; klimafaktor: number
  strompreis: number; gaspreis: number; oelpreis: number; avgSunHours: number
  stadttyp: Stadttyp; efhQuote: number; fernwaermeQuote: number; gegFrist: string
  nearbyCities: string[]
  bundeslandFoerderung: string | null
  bundeslandFoerderungBetrag: string | null
  bundeslandFoerderungUrl: string | null
}

/** Jahresarbeitszahl schätzen — stadtspezifisch (BWP-Feldtests, Fraunhofer ISE) */
export function estimateJAZ(
  city: City,
  type: 'luft' | 'sole' | 'wasser' = 'luft',
  vorlauf = 35
): number {
  const base = { luft: 3.5, sole: 4.3, wasser: 5.0 }[type]
  let jaz = base
  if (type === 'luft') jaz += (city.avgTemp - 9.0) * 0.1
  jaz -= (vorlauf - 35) * 0.03
  return Math.round(Math.max(jaz, 2.0) * 10) / 10
}

/** Stadtspezifische Betriebskosten */
export function calcCityBetriebskosten(
  flaeche: number,
  baujahr: string,
  city: City,
  jaz: number
) {
  const B: Record<string, number> = {
    'vor_1918': 250, '1919_1948': 194, '1949_1957': 223, '1958_1968': 198,
    '1969_1978': 182, '1979_1994': 148, '1995_2009': 101, '2010_plus': 72,
    'kfw_55': 41, 'passivhaus': 21,
  }
  const bedarf = flaeche * ((B[baujahr] ?? 160) + 12.5)
  const wpKosten  = Math.round(bedarf / jaz * (city.strompreis / 100))
  const gasKosten = Math.round(bedarf / 0.92 * (city.gaspreis / 100))
  const oelKosten = Math.round(bedarf / 0.90 * (city.oelpreis / 100))
  return { wpKosten, gasKosten, oelKosten, ersparnis: gasKosten - wpKosten, bedarf: Math.round(bedarf) }
}

/** Zusatzersparnis durch WP+PV Kombination */
export function calcPVKombiErsparnis(city: City, kWp = 8): number {
  const prod = city.avgSunHours * kWp * 0.85
  return Math.round(Math.min(prod * 0.65, 3500) * (city.strompreis / 100))
}

/** Deterministischer Varianten-Index für Content-Rotation (SSG-sicher) */
export function getVariantIndex(citySlug: string, keywordSlug: string, n: number): number {
  let h = 0
  const s = citySlug + '|' + keywordSlug
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0 }
  return Math.abs(h) % n
}

/** Klimazone der Stadt */
export function getKlimazone(city: City): 'warm' | 'mittel' | 'kalt' {
  if (city.avgTemp >= 10.5) return 'warm'
  if (city.avgTemp >= 9.0)  return 'mittel'
  return 'kalt'
}

/** Sitemap-Priorität basierend auf Einwohnerzahl */
export function getSitemapPriority(city: City, kp: number): number {
  let b = 0
  if (city.einwohner > 500000)      b = 0.05
  else if (city.einwohner > 200000) b = 0.03
  else if (city.einwohner > 100000) b = 0.01
  return Math.min(Math.round((kp + b) * 100) / 100, 1.0)
}

/** CO₂-Ersparnis gegenüber Gasheizung (t/Jahr) */
export function calcCO2Ersparnis(bedarf: number): number {
  return Math.round((bedarf * 0.0002 - bedarf / 3.5 * 0.00007) * 10) / 10
}

/** JSON-LD BreadcrumbList Schema */
export function buildBreadcrumbSchema(
  keywordSlug: string,
  keywordLabel: string,
  city: City
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://waermepumpenbegleiter.de' },
      { '@type': 'ListItem', position: 2, name: keywordLabel, item: `https://waermepumpenbegleiter.de/${keywordSlug}` },
      { '@type': 'ListItem', position: 3, name: city.name,    item: `https://waermepumpenbegleiter.de/${keywordSlug}/${city.slug}` },
    ],
  }
}

/** JSON-LD LocalBusiness Schema */
export function buildLocalBusinessSchema(keywordSlug: string, city: City) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Wärmepumpen-Beratung ${city.name}`,
    url: `https://waermepumpenbegleiter.de/${keywordSlug}/${city.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.bundesland,
      postalCode: city.plz,
      addressCountry: 'DE',
    },
    geo: { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng },
    openingHours: 'Mo-Fr 08:00-18:00',
    priceRange: 'Kostenlos',
  }
}

/** Nachbarstädte aus nearbyCities-Slugs auflösen (braucht CITIES — nur server-side) */
export function getNearbyFromSlugs(slugs: string[], allCities: City[], count = 6): City[] {
  const result = slugs.slice(0, count)
    .map(s => allCities.find(c => c.slug === s))
    .filter(Boolean) as City[]
  return result
}
