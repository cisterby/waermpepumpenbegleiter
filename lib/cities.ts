// lib/cities.ts
// Städtedaten als JSON (wie DeinSolarBegleiter) — keine Escape-Probleme mit Umlauten
import citiesData from './cities.json';

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

export const CITIES = citiesData as City[];

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find(c => c.slug === slug)
}

export function getCitiesByBundesland(bl: string): City[] {
  return CITIES.filter(c => c.bundeslandSlug === bl)
}

export function getNearbyCity(city: City, count = 6): City[] {
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

export function estimateJAZ(city: City, type: 'luft' | 'sole' | 'wasser' = 'luft', vorlauf = 35): number {
  const base = { luft: 3.5, sole: 4.3, wasser: 5.0 }[type]
  let jaz = base
  if (type === 'luft') jaz += (city.avgTemp - 9.0) * 0.1
  jaz -= (vorlauf - 35) * 0.03
  return Math.round(Math.max(jaz, 2.0) * 10) / 10
}

export function calcCityBetriebskosten(flaeche: number, baujahr: string, city: City, jaz: number) {
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

export function calcPVKombiErsparnis(city: City, kWp = 8): number {
  const prod = city.avgSunHours * kWp * 0.85
  return Math.round(Math.min(prod * 0.65, 3500) * (city.strompreis / 100))
}

export function getVariantIndex(citySlug: string, keywordSlug: string, n: number): number {
  let h = 0
  const s = citySlug + '|' + keywordSlug
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0 }
  return Math.abs(h) % n
}

export function getKlimazone(city: City): 'warm' | 'mittel' | 'kalt' {
  if (city.avgTemp >= 10.5) return 'warm'
  if (city.avgTemp >= 9.0)  return 'mittel'
  return 'kalt'
}

export function getSitemapPriority(city: City, kp: number): number {
  let b = 0
  if (city.einwohner > 500000)      b = 0.05
  else if (city.einwohner > 200000) b = 0.03
  else if (city.einwohner > 100000) b = 0.01
  return Math.min(Math.round((kp + b) * 100) / 100, 1.0)
}

export function calcCO2Ersparnis(bedarf: number): number {
  return Math.round((bedarf * 0.0002 - bedarf / 3.5 * 0.00007) * 10) / 10
}
