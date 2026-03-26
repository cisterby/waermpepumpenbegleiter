// ============================================================
// lib/calculations.ts
// Alle Berechnungslogiken für das WP-Projekt
//
// Quellen:
//   - BWP Bundesverband Wärmepumpe: JAZ-Referenzwerte
//   - Fraunhofer ISE: COP-Feldtest-Korrekturfaktoren
//   - DIN EN 12831: Heizlastberechnung
//   - KfW BEG: Förderlogik (Stand März 2026)
//   - BDEW: Energiepreise
// ============================================================

// ── HEIZWÄRMEBEDARF-KENNWERTE ────────────────────────────────
// Spezifischer Heizwärmebedarf kWh/(m²·a) nach Baujahr
// Quelle: IWU, DIN V 18599, eigene Abschätzung
export const WAERMEBEDARF_KWH_PRO_M2: Record<string, number> = {
  'vor_1918':      250,   // Gründerzeit, keine Dämmung
  '1919_1948':     194,
  '1949_1957':     223,   // Nachkrieg, schlechte Baumaterialien
  '1958_1968':     198,
  '1969_1978':     182,   // Vor 1. Wärmeschutzverordnung
  '1979_1994':     148,   // Nach 1. WSchVO
  '1995_2009':     101,   // Nach 2. WSchVO / EnEV
  '2010_plus':      72,   // EnEV 2009+
  'kfw_55':         41,   // KfW-Effizienzhaus 55
  'passivhaus':     21,   // Passivhaus
  // Fallback für ältere Dropdown-Werte
  'vor_1978':      215,   // Aggregiert vor 1978
  '1979_1994':     148,
}

// ── ENERGIEPREISE (Bundesdurchschnitt als Fallback) ───────────
// Werden von stadtspezifischen Werten aus cities.ts überschrieben
export const ENERGIE_PREISE_FALLBACK = {
  strom_wp:     0.27,   // €/kWh WP-Sondertarif (günstiger als Haushaltsstrom)
  strom_normal: 0.31,   // €/kWh Haushaltsstrom
  erdgas:       0.12,   // €/kWh inkl. CO₂-Preis 2026
  heizoel:      0.11,   // €/kWh
  nachtspeicher:0.28,   // €/kWh (Haushaltsstrom nachts)
  holzpellets:  0.065,  // €/kWh
  fernwaerme:   0.14,   // €/kWh (variiert stark regional)
}

export const HEIZUNG_WIRKUNGSGRAD: Record<string, number> = {
  erdgas:       0.92,   // Brennwert
  heizoel:      0.90,
  nachtspeicher:0.98,   // elektrisch
  holzpellets:  0.87,
}

// CO₂-Emissionsfaktoren kg CO₂/kWh (Primärenergie)
export const CO2_FAKTOREN: Record<string, number> = {
  strom_2026:   0.380,   // Dt. Strommix 2026 (sinkend)
  strom_2030:   0.250,   // Prognose
  erdgas:       0.200,
  heizoel:      0.266,
  holzpellets:  0.024,   // biogen, fast CO₂-neutral
}

// ── TYPES ────────────────────────────────────────────────────
export type HeizungsTyp = 'erdgas' | 'heizoel' | 'nachtspeicher' | 'holzpellets'
export type BaujahrTyp = 'vor_1918' | '1919_1948' | '1949_1957' | '1958_1968' |
  '1969_1978' | '1979_1994' | '1995_2009' | '2010_plus' | 'kfw_55' | 'passivhaus' | 'vor_1978'
export type WPTyp = 'luft' | 'sole' | 'wasser'

export interface BerechnungsInput {
  flaeche: number          // m²
  baujahr: string          // BaujahrTyp
  heizung: HeizungsTyp
  // Optional: stadtspezifische Preise (überschreiben Fallback)
  strompreisCtKwh?: number
  gaspreisCtKwh?: number
  oelpreisCtKwh?: number
  // Vorlauftemperatur (Standard 35°C, Altbau oft 55–70°C)
  vorlaufTemp?: number
  wpTyp?: WPTyp
}

export interface BerechnungsErgebnis {
  // Energiebedarf
  heizwaermebedarf: number     // kWh/a gesamt
  spezKennwert: number         // kWh/(m²·a)
  // Betriebskosten
  altKosten: number            // €/a aktuelle Heizung
  wpKosten: number             // €/a mit WP
  ersparnis: number            // €/a
  // Effizienz
  jaz: number                  // Jahresarbeitszahl WP
  cop: number                  // COP bei Normbedingungen
  stromverbrauch: number       // kWh/a WP-Strom
  // Amortisation
  amortisationJahre: number    // Jahre bis Break-Even
  // CO₂
  co2AltHeizung: number        // t CO₂/a jetzt
  co2WP: number                // t CO₂/a mit WP
  co2Ersparnis: number         // t CO₂/a gespart
}

// ── HAUPTFUNKTION: BETRIEBSKOSTEN ────────────────────────────
/**
 * Vollständige Betriebskosten-Berechnung
 * Kann mit oder ohne stadtspezifische Preise verwendet werden
 */
export function calcBetriebskosten(
  flaeche: number,
  baujahr: string,
  heizung: HeizungsTyp,
  options?: {
    strompreisCtKwh?: number
    gaspreisCtKwh?: number
    oelpreisCtKwh?: number
    avgTemp?: number      // Jahresmitteltemp der Stadt für JAZ-Korrektur
    vorlaufTemp?: number
    wpTyp?: WPTyp
  }
): BerechnungsErgebnis {
  // Heizwärmebedarf
  const spezKennwert = WAERMEBEDARF_KWH_PRO_M2[baujahr] ?? 160
  const warmwasser = 12.5 // kWh/(m²·a) pauschaler Warmwasserzuschlag
  const heizwaermebedarf = flaeche * (spezKennwert + warmwasser)

  // JAZ berechnen
  const avgTemp = options?.avgTemp ?? 9.0
  const vorlaufTemp = options?.vorlaufTemp ?? 35
  const wpTyp = options?.wpTyp ?? 'luft'
  const jaz = _estimateJAZ(avgTemp, vorlaufTemp, wpTyp)

  // COP bei Normbedingungen A7/W35
  const cop = _estimateCOP(-3, vorlaufTemp) // Normaußentemp vereinfacht

  // Energiepreise (stadtspezifisch oder Fallback)
  const strompreis = (options?.strompreisCtKwh ?? ENERGIE_PREISE_FALLBACK.strom_wp * 100) / 100
  const altPreis = heizung === 'heizoel'
    ? (options?.oelpreisCtKwh ?? ENERGIE_PREISE_FALLBACK.heizoel * 100) / 100
    : heizung === 'nachtspeicher'
      ? ENERGIE_PREISE_FALLBACK.nachtspeicher
      : (options?.gaspreisCtKwh ?? ENERGIE_PREISE_FALLBACK.erdgas * 100) / 100

  // Kosten berechnen
  const wg = HEIZUNG_WIRKUNGSGRAD[heizung] ?? 0.92
  const altKosten = Math.round(heizwaermebedarf / wg * altPreis)
  const stromverbrauch = Math.round(heizwaermebedarf / jaz)
  const wpKosten = Math.round(stromverbrauch * strompreis)
  const ersparnis = altKosten - wpKosten

  // CO₂
  const co2AltHeizung = Math.round(heizwaermebedarf / wg * CO2_FAKTOREN[heizung === 'heizoel' ? 'heizoel' : 'erdgas'] * 10) / 10
  const co2WP = Math.round(stromverbrauch * CO2_FAKTOREN.strom_2026 * 10) / 10
  const co2Ersparnis = Math.round((co2AltHeizung - co2WP) * 10) / 10

  // Amortisation (mit 55% Förderung als Standard)
  const investition = 25000
  const foerderung = investition * 0.55
  const netto = investition - foerderung
  const wartungWP = 150    // €/a Wartung WP
  const wartungAlt = 350   // €/a Wartung alte Heizung (höher wegen Schornsteinfeger etc.)
  const jahresersparnis = ersparnis + (wartungAlt - wartungWP)
  const amortisationJahre = Math.round((netto / Math.max(jahresersparnis, 1)) * 10) / 10

  return {
    heizwaermebedarf: Math.round(heizwaermebedarf),
    spezKennwert,
    altKosten,
    wpKosten,
    ersparnis,
    jaz,
    cop,
    stromverbrauch,
    amortisationJahre,
    co2AltHeizung,
    co2WP,
    co2Ersparnis,
  }
}

// ── KFW-FÖRDERRECHNER ─────────────────────────────────────────
export interface FoerderInput {
  investitionskosten: number          // Brutto-Investitionskosten
  isSelfOccupied: boolean             // Eigennutzer (ja/nein)
  hasOldFossilHeating: boolean        // Ersetzt eine fossile Heizung
  einkommenUnter40k: boolean          // Haushaltseinkommen < €40.000 netto/Jahr
  hasNaturalRefrigerant: boolean      // R290 (Propan) oder R744 (CO₂)
  usesErdwaermeOrWasser: boolean      // Sole-Wasser oder Wasser-Wasser WP
}

export interface FoerderErgebnis {
  grundfoerderungPct: number          // 30% immer
  klimaSpeedBonusPct: number          // 20% bei fossil→WP
  einkommensBonusPct: number          // 30% bei niedrigem Einkommen (nur Eigennutzer)
  kaeltemittelBonusPct: number        // 5% bei R290/R744
  gesamtSatz: number                  // Summe, max 70%
  foerderfaehigeBasis: number         // min(investitionskosten, 30000)
  zuschuss: number                    // €-Betrag
  eigenanteil: number                 // €-Betrag nach Förderung
  note: string                        // Hinweis
}

export function calcFoerderung(input: FoerderInput): FoerderErgebnis {
  const MAX_FOERDERFAEHIG = 30000 // EFH max. €30.000 nach BEG
  const foerderfaehigeBasis = Math.min(input.investitionskosten, MAX_FOERDERFAEHIG)

  let grundfoerderungPct = 30
  let klimaSpeedBonusPct = 0
  let einkommensBonusPct = 0
  let kaeltemittelBonusPct = 0

  // Klima-Speed-Bonus: nur wenn fossile Heizung ersetzt wird UND Eigennutzer
  if (input.hasOldFossilHeating && input.isSelfOccupied) {
    klimaSpeedBonusPct = 20
  }
  // Einkommens-Bonus: nur Eigennutzer unter €40.000 netto/Jahr
  if (input.einkommenUnter40k && input.isSelfOccupied) {
    einkommensBonusPct = 30
  }
  // Kältemittel-Bonus: natürliche Kältemittel R290 (Propan) oder R744 (CO₂)
  if (input.hasNaturalRefrigerant || input.usesErdwaermeOrWasser) {
    kaeltemittelBonusPct = 5
  }

  const gesamtSatz = Math.min(
    grundfoerderungPct + klimaSpeedBonusPct + einkommensBonusPct + kaeltemittelBonusPct,
    70
  )

  const zuschuss = Math.round(foerderfaehigeBasis * (gesamtSatz / 100))
  const eigenanteil = Math.round(input.investitionskosten - zuschuss)

  let note = 'Antrag zwingend vor Baubeginn stellen (KfW-Portal).'
  if (!input.isSelfOccupied) {
    note += ' Als Vermieter entfällt der Klima-Speed-Bonus und Einkommens-Bonus.'
  }
  if (gesamtSatz === 70) {
    note += ' Sie erhalten die maximale Förderung von 70%!'
  }

  return {
    grundfoerderungPct,
    klimaSpeedBonusPct,
    einkommensBonusPct,
    kaeltemittelBonusPct,
    gesamtSatz,
    foerderfaehigeBasis,
    zuschuss,
    eigenanteil,
    note,
  }
}

// ── INTERNE HILFSFUNKTIONEN ───────────────────────────────────

/**
 * JAZ-Schätzung nach Wärmepumpentyp und Klimadaten
 * Basis: BWP-Feldtest-Durchschnittswerte
 */
function _estimateJAZ(
  avgAnnualTemp: number,
  vorlaufTemp: number = 35,
  heatPumpType: WPTyp = 'luft'
): number {
  // Basis-JAZ aus BWP-Feldtests
  const baseJAZ: Record<WPTyp, number> = {
    luft: 3.5,   // A7/W35 Referenz, Jahresdurchschnitt
    sole: 4.3,   // B0/W35 Referenz
    wasser: 5.0, // W10/W35 Referenz
  }
  let jaz = baseJAZ[heatPumpType]

  // Temperaturkorrektur für Luft-WP: ±0.1 pro °C von Referenz (9°C)
  if (heatPumpType === 'luft') {
    jaz += (avgAnnualTemp - 9.0) * 0.1
  }
  // Vorlauftemperatur-Korrektur: -0.03 pro °C über 35°C (aus Fraunhofer ISE)
  jaz -= (vorlaufTemp - 35) * 0.03

  return Math.round(Math.max(jaz, 2.0) * 10) / 10
}

/**
 * COP-Schätzung nach Carnot-Annäherung
 * Gütegrad 0.45 entspricht typischen realen Anlagen
 */
function _estimateCOP(outsideTemp: number, vorlaufTemp: number = 35): number {
  const T_source = outsideTemp + 273.15
  const T_sink = vorlaufTemp + 273.15
  const carnotCOP = T_sink / (T_sink - T_source)
  const realFactor = 0.45 // typischer Gütegrad realer Wärmepumpen
  return Math.round(Math.max(carnotCOP * realFactor, 1.5) * 10) / 10
}

// ── FORMATIERUNGSHILFEN ───────────────────────────────────────
export function fmtEuro(n: number): string {
  return '€\u202F' + Math.round(n).toLocaleString('de-DE')
}

export function fmtKwh(n: number): string {
  return Math.round(n).toLocaleString('de-DE') + ' kWh'
}

// Re-exports für Abwärtskompatibilität
export { _estimateJAZ as estimateJAZ, _estimateCOP as estimateCOP }
