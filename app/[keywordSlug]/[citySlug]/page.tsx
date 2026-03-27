// app/[keywordSlug]/[citySlug]/page.tsx
// ============================================================
// Dynamische Route für alle 16.126 programmatischen Seiten
// Next.js 13 App Router + Static Site Generation
//
// URL-Struktur: /waermepumpe-kosten/berlin
//               /waermepumpe-installateur/muenchen
//               /luft-wasser-waermepumpe/hamburg
// ============================================================

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CITIES, getCityBySlug, getNearbyCity, estimateJAZ, calcCityBetriebskosten, getVariantIndex } from '@/lib/cities'
import { KEYWORDS, getKeywordBySlug, fillTemplate } from '@/lib/keywords'
import { calcBetriebskosten, calcFoerderung, fmtEuro } from '@/lib/calculations'

// Template-Komponenten (Tier 1 zuerst)
import WaermepumpeTemplate     from '@/components/templates/WaermepumpeTemplate'
import WaermepumpeKostenTemplate from '@/components/templates/WaermepumpeKostenTemplate'
import InstallateurTemplate    from '@/components/templates/InstallateurTemplate'
import FoerderungTemplate      from '@/components/templates/FoerderungTemplate'
import LuftWasserTemplate      from '@/components/templates/LuftWasserTemplate'
// Tier 2–4 (alle auf WaermepumpeTemplate zurückfallen bis fertig)
import GenericTemplate         from '@/components/templates/GenericTemplate'

// ── STATIC PARAMS ─────────────────────────────────────────────
// Generiert alle gültigen [keywordSlug]/[citySlug] Kombinationen
// Priorität: Tier 1 Keywords × alle Städte zuerst
export async function generateStaticParams() {
  const params: Array<{ keywordSlug: string; citySlug: string }> = []

  // Sortierung: Tier 1 zuerst, dann nach Einwohnerzahl absteigend
  // → Wichtigste Seiten werden bei Partial-Prerendering zuerst gebaut
  const sortedKeywords = [...KEYWORDS].sort((a, b) => a.tier - b.tier)
  const sortedCities   = [...CITIES].sort((a, b) => b.einwohner - a.einwohner)

  for (const keyword of sortedKeywords) {
    for (const city of sortedCities) {
      params.push({
        keywordSlug: keyword.slug,
        citySlug:    city.slug,
      })
    }
  }

  return params
}

// ── METADATA ──────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { keywordSlug: string; citySlug: string }
}): Promise<Metadata> {
  const city    = getCityBySlug(params.citySlug)
  const keyword = getKeywordBySlug(params.keywordSlug)

  if (!city || !keyword) {
    return { title: 'Seite nicht gefunden | Wärmepumpenbegleiter' }
  }

  const jaz   = estimateJAZ(city)
  const title = fillTemplate(keyword.titleTemplate, city, jaz)
  const desc  = fillTemplate(keyword.metaTemplate, city, jaz)
  const canonical = `https://waermepumpenbegleiter.de/${keyword.slug}/${city.slug}`

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      siteName: 'Wärmepumpenbegleiter.de',
      locale: 'de_DE',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1 },
    },
  }
}

// ── PAGE COMPONENT ────────────────────────────────────────────
export default function CityKeywordPage({
  params,
}: {
  params: { keywordSlug: string; citySlug: string }
}) {
  const city    = getCityBySlug(params.citySlug)
  const keyword = getKeywordBySlug(params.keywordSlug)

  if (!city || !keyword) notFound()

  // Stadtspezifische Berechnungen
  const jaz     = estimateJAZ(city)
  const calc    = calcBetriebskosten('120', '1979_1994', 'erdgas', {
    strompreisCtKwh: city.strompreis,
    gaspreisCtKwh:   city.gaspreis,
    avgTemp:         city.avgTemp,
  })
  const foerd   = calcFoerderung({
    investitionskosten:      25000,
    isSelfOccupied:          true,
    hasOldFossilHeating:     true,
    einkommenUnter40k:       false,
    hasNaturalRefrigerant:   false,
    usesErdwaermeOrWasser:   false,
  })
  const nearby  = getNearbyCity(city, 6)
  const variant = getVariantIndex(city.slug, keyword.slug, 4)

  // Gemeinsame Props für alle Templates
  const templateProps = {
    city,
    keyword,
    jaz,
    calc,
    foerd,
    nearby,
    variant,
    h1: fillTemplate(keyword.h1Template, city, jaz, calc.wpKosten, calc.ersparnis),
  }

  // Template-Router
  switch (keyword.template) {
    case 'WaermepumpeTemplate':
      return <WaermepumpeTemplate {...templateProps} />
    case 'WaermepumpeKostenTemplate':
      return <WaermepumpeKostenTemplate {...templateProps} />
    case 'InstallateurTemplate':
      return <InstallateurTemplate {...templateProps} />
    case 'FoerderungTemplate':
      return <FoerderungTemplate {...templateProps} />
    case 'LuftWasserTemplate':
      return <LuftWasserTemplate {...templateProps} />
    default:
      // Alle Tier 2–4 Templates fallen auf GenericTemplate zurück
      // bis die spezialisierten Komponenten gebaut sind
      return <GenericTemplate {...templateProps} />
  }
}
