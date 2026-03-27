// lib/types/TemplateProps.ts
// ============================================================
// Geteilte Props-Typen für alle 22 Page-Templates
// Alle Templates erhalten dieselbe Basis-Datenstruktur,
// damit der Template-Router in [keywordSlug]/[citySlug]/page.tsx
// einheitlich funktioniert.
// ============================================================

import type { City }    from '@/lib/cities'
import type { Keyword } from '@/lib/keywords'
import type { BerechnungsErgebnis, FoerderErgebnis } from '@/lib/calculations'

export interface TemplateProps {
  // Stadtdaten (aus lib/cities.ts)
  city: City

  // Keyword-Daten (aus lib/keywords.ts)
  keyword: Keyword

  // Vorberechnete stadtspezifische Werte
  jaz: number               // Jahresarbeitszahl für diese Stadt
  calc: BerechnungsErgebnis // Betriebskosten-Vergleich (120m², EFH, Erdgas)
  foerd: FoerderErgebnis    // Standard-Förderberechnung (Eigennutzer, fossil→WP)

  // SEO
  h1: string                // Fertig befüllter H1-Text

  // UX / Variation
  nearby: City[]            // 6 Nachbarstädte für internes Linking
  variant: number           // 0–3: Textvariante (deterministisch per Hash)
}
