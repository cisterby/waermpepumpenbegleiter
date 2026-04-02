// ============================================================
// lib/keywords.ts
// 22 Keywords für das programmatische SEO-System
//
// Template-Platzhalter:
//   {stadt}        → city.name
//   {stadtSlug}    → city.slug
//   {bundesland}   → city.bundesland
//   {year}         → aktuelles Jahr (2026)
//   {plz}          → city.plz
//   {jaz}          → estimateJAZ(city)
//   {strompreis}   → city.strompreis
//   {gaspreis}     → city.gaspreis
//   {heizgradtage} → city.heizgradtage
//   {preisVon}     → Einstiegspreisangabe
//   {normT}        → city.normAussentemp
// ============================================================

export type KeywordIntent = 'mixed' | 'commercial' | 'transactional' | 'info_commercial' | 'informational'
export type KeywordTier = 1 | 2 | 3 | 4

export type Keyword = {
  id: number
  tier: KeywordTier
  keyword: string           // Rohes Keyword mit [Stadt] Platzhalter
  slug: string              // URL-Slug (ohne /)
  baseVolume: number        // Geschätztes monatliches Suchvolumen DE gesamt
  competition: string       // 'niedrig' | 'mittel' | 'hoch' etc.
  intent: KeywordIntent
  template: string          // React-Komponenten-Name
  // SEO-Templates mit Platzhaltern
  titleTemplate: string     // ≤60 Zeichen nach Befüllung
  metaTemplate: string      // 140–160 Zeichen nach Befüllung
  h1Template: string
  // H2-Fragen für Featured Snippets
  featuredSnippetQuestions: string[]
  // FAQ-Pool (rotierend, 6-8 pro Seite)
  faqPool: Array<{ q: string; a: string }>
  // Sitemap-Priorität (0.5–0.9)
  sitemapPriority: number
  // Interne Cross-Links (Keyword-Slugs der verwandten Seiten)
  crossLinks: string[]
  // Langer Einleitungstext für Keyword-Index-Seite (optional)
  pillarContent?: string
}

export const KEYWORDS: Keyword[] = [
  // ── TIER 1 — Höchste Priorität ────────────────────────────────
  {
    id: 1, tier: 1,
    keyword: 'Wärmepumpe [Stadt]',
    slug: 'waermepumpe',
    baseVolume: 250000,
    competition: 'hoch',
    intent: 'mixed',
    template: 'WaermepumpeTemplate',
    titleTemplate: 'Wärmepumpe {stadt} {year}',
    metaTemplate: 'Wärmepumpe in {stadt} einbauen ✓ Kosten ab {preisVon} ✓ Bis 70% KfW-Förderung ✓ Geprüfte lokale Installateure ✓ Kostenlos bis zu 3 Angebote vergleichen.',
    h1Template: 'Wärmepumpe {stadt} — Kosten, Förderung & Installateure {year}',
    featuredSnippetQuestions: [
      'Was kostet eine Wärmepumpe in {stadt}?',
      'Wie hoch ist die KfW-Förderung für Wärmepumpen in {stadt}?',
      'Welche Wärmepumpe eignet sich für {stadt}?',
      'Lohnt sich eine Wärmepumpe in {stadt}?',
    ],
    faqPool: [
      { q: 'Was kostet eine Wärmepumpe in {stadt}?', a: 'Eine Luft-Wasser-Wärmepumpe kostet in {stadt} inklusive Installation zwischen €18.000 und €28.000 brutto. Nach KfW-Förderung (typisch 50–55%) reduziert sich der Eigenanteil auf €9.000–€14.000.' },
      { q: 'Wie hoch ist die KfW-Förderung in {bundesland}?', a: 'Die KfW-Bundesförderung beträgt bis zu 70% der förderfähigen Kosten (max. €21.000). In {bundesland} gibt es {bundeslandFoerderung} als Ergänzung.' },
      { q: 'Wie lange dauert die Installation in {stadt}?', a: 'Die eigentliche Montage dauert 1–3 Tage. Von der Anfrage bis zur fertigen Anlage sollten Sie in {stadt} 6–10 Wochen einplanen.' },
      { q: 'Funktioniert eine Wärmepumpe im Altbau in {stadt}?', a: 'Ja — moderne Luft-Wasser-WP arbeiten mit bis zu 70°C Vorlauftemperatur und sind damit auch in älteren Bestandsgebäuden in {stadt} einsetzbar.' },
      { q: 'Wie viel spare ich mit einer Wärmepumpe in {stadt}?', a: 'Bei einem 120 m² EFH sparen Hausbesitzer in {stadt} typisch €800–€1.400 pro Jahr gegenüber einer Gasheizung, basierend auf dem lokalen Strompreis von {strompreis} ct/kWh.' },
      { q: 'Muss ich den KfW-Antrag vor dem Einbau stellen?', a: 'Ja, zwingend. Der Förderantrag muss vor Beginn der Bauarbeiten gestellt werden. Eine nachträgliche Beantragung ist nicht möglich.' },
      { q: 'Wie laut ist eine Wärmepumpe in {stadt}?', a: 'Moderne Luft-Wasser-WP erzeugen ca. 45–55 dB auf einem Meter — ähnlich wie ein Gesprächston. Mit korrektem Abstand zur Grundstücksgrenze ist Lärm kein Problem.' },
      { q: 'Welche Wärmepumpe ist in {stadt} am besten geeignet?', a: 'Mit einer Jahresmitteltemperatur von {avgTemp}°C in {stadt} erreicht eine Luft-Wasser-WP eine Jahresarbeitszahl von ca. {jaz}. Das ist wirtschaftlich sehr attraktiv.' },
    ],
    sitemapPriority: 0.9,
    crossLinks: ['waermepumpe-kosten', 'waermepumpe-foerderung', 'waermepumpe-installateur', 'luft-wasser-waermepumpe', 'waermepumpe-altbau', 'heizung-tauschen', 'waermepumpe-nachruesten'],
  },
  {
    id: 2, tier: 1,
    keyword: 'Wärmepumpe Kosten [Stadt]',
    slug: 'waermepumpe-kosten',
    baseVolume: 90000,
    competition: 'hoch',
    intent: 'commercial',
    template: 'WaermepumpeKostenTemplate',
    titleTemplate: 'Wärmepumpe Kosten {stadt} {year}',
    metaTemplate: 'Was kostet eine Wärmepumpe in {stadt}? ✓ Aktuelle Preise {year} ✓ Alle Typen im Vergleich ✓ Betriebskosten {strompreis} ct/kWh ✓ Bis 70% KfW ✓ Kostenlos.',
    h1Template: 'Wärmepumpe Kosten {stadt} {year} — Aktuelle Preise & Förderung',
    featuredSnippetQuestions: [
      'Was kostet eine Wärmepumpe in {stadt} komplett?',
      'Wie hoch sind die Betriebskosten einer Wärmepumpe in {stadt}?',
      'Was kostet eine Luft-Wasser-Wärmepumpe in {stadt}?',
      'Wann amortisiert sich eine Wärmepumpe in {stadt}?',
    ],
    faqPool: [
      { q: 'Was kostet eine Luft-Wasser-Wärmepumpe in {stadt}?', a: 'In {stadt} kostet eine Luft-Wasser-Wärmepumpe inklusive Installation, Hydraulik und Elektroarbeiten zwischen €18.000 und €28.000. Nach KfW-Förderung (50–55%) reduziert sich der Eigenanteil auf ca. €9.000–€14.000.' },
      { q: 'Was kostet eine Erdwärmepumpe in {stadt}?', a: 'Sole-Wasser-Wärmepumpen kosten in {stadt} je nach Bohrtiefe €22.000–€35.000. Die Bohrkosten machen dabei €6.000–€12.000 aus. Mit dem KfW-Bonus für Erdwärme (+5%) lohnt sich die höhere Investition langfristig.' },
      { q: 'Wie hoch sind die jährlichen Betriebskosten in {stadt}?', a: 'Bei einem 120 m² EFH und dem lokalen Strompreis von {strompreis} ct/kWh fallen in {stadt} ca. {wpKosten} pro Jahr an Heizkosten an. Das sind ca. {ersparnis} weniger als mit einer Gasheizung.' },
      { q: 'Welche Nebenkosten gibt es bei der WP-Installation?', a: 'Zu den Hauptkosten kommen: hydraulischer Abgleich (€500–1.500), Fundament/Aufstellung (€300–800), Elektroinstallation (€500–1.500) und ggf. Pufferspeicher. Seriöse Anbieter weisen alle Positionen transparent aus.' },
      { q: 'Wann amortisiert sich eine Wärmepumpe in {stadt}?', a: 'Bei 55% KfW-Förderung und {ersparnis} jährlicher Ersparnis amortisiert sich eine WP in {stadt} nach ca. 8–12 Jahren. Die Lebensdauer beträgt 20–25 Jahre.' },
      { q: 'Gibt es in {bundesland} zusätzliche Förderungen?', a: '{bundeslandFoerderungInfo}. Kombiniert mit KfW lässt sich der Eigenanteil in bestimmten Fällen auf unter €5.000 senken.' },
    ],
    sitemapPriority: 0.9,
    crossLinks: ['waermepumpe', 'waermepumpe-foerderung', 'waermepumpe-installateur', 'waermepumpe-preise', 'luft-wasser-waermepumpe', 'erdwaermepumpe', 'waermepumpe-oder-gas'],
  },
  {
    id: 3, tier: 1,
    keyword: 'Wärmepumpe Installateur [Stadt]',
    slug: 'waermepumpe-installateur',
    baseVolume: 12000,
    competition: 'mittel',
    intent: 'transactional',
    template: 'InstallateurTemplate',
    titleTemplate: 'WP Installateur {stadt} {year}',
    metaTemplate: 'Geprüfte Wärmepumpen-Installateure in {stadt} ✓ Lokale Meisterbetriebe ✓ Kostenlos bis zu 3 Angebote ✓ Alle Betriebe HWK-geprüft und KfW-registriert.',
    h1Template: 'Geprüfte Wärmepumpen-Installateure in {stadt} {year}',
    featuredSnippetQuestions: [
      'Wer installiert Wärmepumpen in {stadt}?',
      'Wie finde ich einen guten Wärmepumpen-Installateur in {stadt}?',
      'Was kostet ein Wärmepumpen-Installateur in {stadt}?',
      'Worauf achten bei der Wahl des Installateurs in {stadt}?',
    ],
    faqPool: [
        { q: 'Wer installiert Wärmepumpen in {stadt}?', a: 'Zugelassene Wärmepumpen-Installateure in {stadt} sind HWK-eingetragene Meisterbetriebe mit KfW-LuL-Registrierung und F-Gas-Zertifikat. Über uns erhalten Sie bis zu 3 geprüfte Angebote lokaler Betriebe aus {stadt} kostenlos.' },
    { q: 'Wie finde ich einen guten WP-Installateur in {stadt}?', a: 'Wichtig: KfW-LuL-Registrierung prüfen, mindestens 5 WP-Referenzen anfragen, Heizlastberechnung DIN EN 12831 im Angebot verlangen. Alle unsere Partnerbetriebe in {stadt} erfüllen diese Kriterien.' },
    { q: 'Was kostet ein Wärmepumpen-Installateur in {stadt}?', a: 'Die Montagekosten in {stadt} liegen typisch bei €3.000–6.000 für die reine Arbeitsleistung. Dazu kommen Hydraulischer Abgleich (€500–1.500, KfW-Pflicht) und Elektroinstallation (€500–1.500). Alle Positionen müssen im Angebot einzeln ausgewiesen sein.' },
    { q: 'Wie lange dauert die WP-Installation in {stadt}?', a: 'Eine typische Luft-Wasser-WP wird in {stadt} in 2–3 Tagen installiert: Tag 1 Außeneinheit + Kernbohrung, Tag 2 Kältemittelkreis + Hydraulik, Tag 3 Hydraulischer Abgleich + Inbetriebnahme.' },
    { q: 'Muss der Installateur in {stadt} KfW-registriert sein?', a: 'Ja, zwingend. Ohne KfW-Lieferanten- und Leistungserbringer (LuL)-Registrierung wird kein BEG-Zuschuss ausgezahlt. Alle unsere Partnerbetriebe in {stadt} sind im KfW-Portal registriert.' },
    { q: 'Wie viele Angebote sollte ich in {stadt} einholen?', a: 'Mindestens 3 Vergleichsangebote — die Verbraucherzentrale empfiehlt das ausdrücklich. In {stadt} sind Preisunterschiede von 20–40% bei gleicher Leistung normal. Wir liefern bis zu 3 vollständige Angebote in 48 Stunden.' }
  ],
    sitemapPriority: 0.85,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-installation', 'waermepumpe-fachbetrieb', 'waermepumpe-foerderung', 'waermepumpe-angebot', 'waermepumpe-anbieter'],
  },
  {
    id: 4, tier: 1,
    keyword: 'Wärmepumpe Förderung [Stadt]',
    slug: 'waermepumpe-foerderung',
    baseVolume: 50000,
    competition: 'hoch',
    intent: 'info_commercial',
    template: 'FoerderungTemplate',
    titleTemplate: 'Wärmepumpe Förderung {stadt} {year}',
    metaTemplate: 'Wärmepumpe Förderung {stadt} {year}: Bis 70% KfW-Zuschuss = max. €21.000 + {bundesland}-Landesförderung ✓ Förderrechner ✓ Antragsprozess ✓ Jetzt anfragen.',
    h1Template: 'Wärmepumpe Förderung {stadt} {year} — KfW & {bundesland}-Programme',
    featuredSnippetQuestions: [
      'Wie hoch ist die Förderung für Wärmepumpen in {stadt}?',
      'Welche Förderung gibt es in {bundesland} für Wärmepumpen?',
      'Wie beantrage ich KfW-Förderung für meine Wärmepumpe in {stadt}?',
      'Wann muss ich den Förderantrag in {stadt} stellen?',
    ],
    faqPool: [
        { q: 'Wie hoch ist die Förderung für Wärmepumpen in {stadt}?', a: 'In {stadt} gilt die KfW-Bundesförderung: 30% Grundförderung + 20% Klima-Speed-Bonus (Ersatz fossiler Heizung) + ggf. 30% Einkommensbonus = max. 70% auf bis zu €30.000 = max. €21.000 Zuschuss. Dazu kommen ggf. {bundesland}-Landesförderungen.' },
    { q: 'Welche Förderung gibt es in {bundesland} für Wärmepumpen?', a: 'Neben der KfW-Bundesförderung bietet {bundesland} eigene Programme. Der KfW-Antrag muss zwingend VOR Baubeginn gestellt werden — kein Nachantrag möglich.' },
    { q: 'Wann muss ich den KfW-Antrag in {stadt} stellen?', a: 'Zwingend VOR der Auftragserteilung. Erst nach KfW-Genehmigung darf der Auftrag erteilt werden. Ausnahme: Vertrag unter aufschiebender Bedingung. Wir begleiten den KfW-Antrag kostenlos.' },
    { q: 'Kann ich KfW-Förderung und Landesförderung kombinieren?', a: 'Ja — KfW und {bundesland}-Programme können in den meisten Fällen kombiniert werden. Die Gesamtförderung darf 60–70% der förderfähigen Kosten nicht überschreiten.' },
    { q: 'Was ist der Klima-Speed-Bonus in {stadt}?', a: 'Der Klima-Speed-Bonus (20%) gibt es für Eigennutzer, die eine funktionstüchtige fossile Heizung ersetzen. Wichtig: Die alte Heizung muss funktionsfähig sein — nicht warten bis sie kaputt ist.' },
    { q: 'Wie lange dauert die KfW-Auszahlung in {stadt}?', a: 'Nach vollständigem Verwendungsnachweis (Rechnungen, Inbetriebnahmeprotokoll, hydraulischer Abgleich-Nachweis) dauert die Auszahlung der KfW typisch 4–8 Wochen.' }
  ],
    sitemapPriority: 0.9,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-installateur', 'waermepumpe-beratung', 'kommunale-waermeplanung', 'waermepumpe-oder-gas', 'heizung-tauschen'],
  },
  {
    id: 5, tier: 1,
    keyword: 'Luft-Wasser-Wärmepumpe [Stadt]',
    slug: 'luft-wasser-waermepumpe',
    baseVolume: 40000,
    competition: 'mittel_hoch',
    intent: 'info_commercial',
    template: 'LuftWasserTemplate',
    titleTemplate: 'Luft-Wasser-Wärmepumpe {stadt} {year}',
    metaTemplate: 'Luft-Wasser-Wärmepumpe {stadt} {year}: JAZ {jaz} bei {avgTemp}°C Jahresmittel ✓ 92% Marktanteil ✓ Kosten ab {preisVon} ✓ Kostenloser Installateur-Vergleich. Jetzt.',
    h1Template: 'Luft-Wasser-Wärmepumpe {stadt} — Effizienz, Kosten & Installateure {year}',
    featuredSnippetQuestions: [
      'Wie effizient ist eine Luft-Wasser-Wärmepumpe in {stadt}?',
      'Welche JAZ erreicht eine Luft-WP in {stadt}?',
      'Für welche Gebäude eignet sich eine Luft-Wasser-WP in {stadt}?',
    ],
    faqPool: [
        { q: 'Wie effizient ist eine Luft-Wasser-Wärmepumpe in {stadt}?', a: 'In {stadt} mit {avgTemp}°C Jahresmittel erreicht eine moderne Luft-Wasser-WP eine JAZ von {jaz}. Das bedeutet: aus 1 kWh Strom werden {jaz} kWh Wärme erzeugt — ca. 3× effizienter als eine Gasheizung.' },
    { q: 'Welche JAZ erreicht eine Luft-WP in {stadt}?', a: 'Bei {avgTemp}°C Jahresmittel in {stadt} und modernem System mit Vorlauftemperatur 45–55°C liegt die realistische JAZ bei {jaz}. Mit Fußbodenheizung (35°C VL) sind JAZ bis 4,2 möglich.' },
    { q: 'Ist eine Luft-Wasser-WP für Altbauten in {stadt} geeignet?', a: 'Ja — ca. 70–80% aller Altbauten in {bundesland} sind geeignet. Entscheidend ist die Vorlauftemperatur, nicht das Baujahr. Moderne Hochtemperatur-WP arbeiten bis 70°C VL.' },
    { q: 'Was kostet eine Luft-Wasser-Wärmepumpe in {stadt}?', a: 'Komplettkosten in {stadt}: €18.000–28.000 brutto. Nach KfW-Förderung (50–70%) ab ca. €9.000 Eigenanteil. Betriebskosten: ca. {wpKosten}€/Jahr vs. ca. {altKosten}€/Jahr mit Gas.' },
    { q: 'Brauche ich eine Genehmigung für eine Luft-WP in {stadt}?', a: 'In den meisten Fällen in {bundesland} keine Baugenehmigung nötig, aber formlose Anzeige beim Bauamt. TA-Lärm-Grenzwert: 45 dB(A) tags / 35 dB(A) nachts an der Grundstücksgrenze.' },
    { q: 'Wie viel Platz brauche ich für die Außeneinheit in {stadt}?', a: 'Mindestens 0,5 m² Aufstellfläche + Abstand zur Grundstücksgrenze (in {bundesland} typisch 2–3 m). Die Außeneinheit sollte frei anströmbar sein und nicht die eigene Abluft ansaugen.' }
  ],
    sitemapPriority: 0.85,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'erdwaermepumpe', 'luftwaermepumpe', 'waermepumpe-installateur', 'waermepumpe-neubau', 'waermepumpe-altbau'],
  },
  // ── TIER 2 ────────────────────────────────────────────────────
  {
    id: 6, tier: 2,
    keyword: 'Wärmepumpe kaufen [Stadt]',
    slug: 'waermepumpe-kaufen',
    baseVolume: 12000,
    competition: 'hoch',
    intent: 'transactional',
    template: 'KaufenTemplate',
    titleTemplate: 'Wärmepumpe kaufen {stadt} {year}',
    metaTemplate: 'Wärmepumpe kaufen in {stadt} {year} ✓ Kostenloser Kaufberater ✓ Welche WP passt? ✓ Kosten, Förderung & Hersteller-Vergleich ✓ Jetzt kostenlos anfragen.',
    h1Template: 'Wärmepumpe kaufen in {stadt} {year} — Ihr Kaufberater',
    featuredSnippetQuestions: [
      'Welche Wärmepumpe soll ich in {stadt} kaufen?',
      'Was muss ich beim Kauf einer Wärmepumpe in {stadt} beachten?',
    ],
    faqPool: [
        { q: 'Welche Wärmepumpe soll ich in {stadt} kaufen?', a: 'Für 92% aller Häuser in {bundesland} ist die Luft-Wasser-WP die richtige Wahl: keine Bohrung, JAZ {jaz}, GEG-konform. Mit großem Grundstück: Erdwärme (höhere JAZ, +5% KfW-Bonus). Entscheidend: Heizlastberechnung DIN EN 12831.' },
    { q: 'Was muss ich beim WP-Kauf in {stadt} beachten?', a: 'Kaufen Sie nie ohne Heizlastberechnung. Keine Faustformel — nur Berechnung nach DIN EN 12831. Kältemittel R290 sichert +5% KfW-Bonus. Hersteller-Garantie ≥ 5 Jahre bestehen. Alle Positionen im Angebot ausgewiesen verlangen.' },
    { q: 'Welche Hersteller sind für {stadt} empfehlenswert?', a: 'Stiftung Warentest empfohlene Hersteller: Vaillant aroTHERM plus, Stiebel Eltron WPL, Viessmann Vitocal — alle in R290-Variante erhältlich und KfW-förderfähig. Wichtiger als die Marke: korrekte Dimensionierung.' },
    { q: 'Wie hoch sind die Kaufkosten für eine WP in {stadt}?', a: 'Gerät allein: €9.000–18.000 je nach Typ und Leistung. Komplettkosten inkl. Montage: €18.000–28.000. Nach KfW-Förderung in {stadt}: ab ca. €9.000 Eigenanteil. Betriebskosten: ~{wpKosten}€/Jahr.' },
    { q: 'Wann ist der beste Zeitpunkt zum WP-Kaufen in {stadt}?', a: 'Jetzt: KfW-Förderung ist historisch hoch (bis 70%), CO₂-Preise steigen jährlich, Installateurpreise in {bundesland} sind nach dem Boom 2022/23 stabiler. GEG-Frist in {stadt} läuft — wer früher handelt, spart mehr.' },
    { q: 'Monoblock oder Split-Wärmepumpe für {stadt}?', a: 'Für die meisten Häuser in {bundesland}: Monoblock. Kein Kältemittel im Haus, einfachere Installation, 70% Marktanteil. Split nur wenn lange Leitungswege oder sehr beengter Innenraum in {stadt}.' }
  ],
    sitemapPriority: 0.8,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-nachruesten', 'luft-wasser-waermepumpe', 'waermepumpe-installateur', 'waermepumpe-foerderung', 'waermepumpe-angebot'],
  },
  {
    id: 7, tier: 2,
    keyword: 'Wärmepumpe Altbau [Stadt]',
    slug: 'waermepumpe-altbau',
    baseVolume: 18000,
    competition: 'mittel',
    intent: 'info_commercial',
    template: 'AltbauTemplate',
    titleTemplate: 'Wärmepumpe Altbau {stadt} {year}',
    metaTemplate: 'Wärmepumpe im Altbau {stadt} ✓ Eignung & Voraussetzungen {year} ✓ Heizlastberechnung ✓ Vorlauftemperatur optimieren ✓ Kostenloser Fachbetrieb-Vergleich.',
    h1Template: 'Wärmepumpe Altbau {stadt} {year} — Eignung, Kosten & Voraussetzungen',
    featuredSnippetQuestions: [
      'Funktioniert eine Wärmepumpe im Altbau in {stadt}?',
      'Was muss ich vor dem Einbau einer WP im Altbau in {stadt} beachten?',
      'Brauche ich eine Sanierung vor dem WP-Einbau in {stadt}?',
    ],
    faqPool: [
      { q: 'Kann ich im Altbau in {stadt} eine Wärmepumpe einbauen?', a: 'In den meisten Altbauten in {stadt} ja. Entscheidend ist die Vorlauftemperatur: Braucht das Haus weniger als 55°C, funktioniert eine WP problemlos. Das klärt ein kostenloser Vor-Ort-Termin.' },
      { q: 'Muss ich vor dem Einbau in {stadt} sanieren?', a: 'Nicht zwingend. Viele Altbauten in {stadt} können direkt umgestellt werden. Dämmung verbessert die Effizienz, ist aber keine Voraussetzung — das kommt auf Ihren Heizwärmebedarf an.' },
      { q: 'Was ist ein hydraulischer Abgleich und was kostet er in {stadt}?', a: 'Der hydraulische Abgleich optimiert die Wärmeverteilung im Haus. Er kostet in {stadt} ca. €500–1.500 und ist Voraussetzung für die volle KfW-Förderung.' },
    { q: 'Was kostet eine Wärmepumpe im Altbau in {stadt}?', a: 'Komplett: €18.000–28.000. Dazu Altbau-Anpassungen: Hydraulischer Abgleich €500–1.500 (KfW-Pflicht), ggf. Heizkörpertausch €200–500/Stück. Nach KfW-Förderung (50–70%): ab ca. €9.000 Eigenanteil. Betriebskosten in {stadt}: ca. {wpKosten}€/Jahr.' },
    { q: 'Welche WP-Typen eignen sich für den Altbau in {bundesland}?', a: 'Luft-Wasser-WP (Standard, JAZ {jaz} in {stadt}): für 92% aller Altbauten. Hochtemperatur-WP (bis 70°C VL): für ungedämmte Altbauten mit alten Heizkörpern. Sole-WP: beste JAZ, falls Grundstück vorhanden.' },
    { q: 'Muss ich vor der WP-Installation im Altbau in {stadt} sanieren?', a: 'Nein — Dämmung ist keine Pflicht. Aber der hydraulische Abgleich (€500–1.500, KfW-Pflicht) verbessert die JAZ um 0,2–0,5 und ist immer sinnvoll. Eine WP funktioniert auch ohne vorherige Sanierung in {bundesland}.' }],
    sitemapPriority: 0.8,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-nachruesten', 'luft-wasser-waermepumpe', 'heizung-tauschen', 'waermepumpe-installateur', 'waermepumpe-foerderung'],
  },
  {
    id: 8, tier: 2,
    keyword: 'Wärmepumpe nachrüsten [Stadt]',
    slug: 'waermepumpe-nachruesten',
    baseVolume: 12000,
    competition: 'mittel',
    intent: 'commercial',
    template: 'NachruestenTemplate',
    titleTemplate: 'Wärmepumpe nachrüsten {stadt} {year}',
    metaTemplate: 'Wärmepumpe nachrüsten in {stadt} ✓ GEG-Fristen {year} ✓ Bestandsgebäude umrüsten ✓ KfW-Förderung bis 70% = max. €21.000 ✓ Geprüfte Fachbetriebe kostenlos.',
    h1Template: 'Wärmepumpe nachrüsten {stadt} {year} — Bestandsgebäude umrüsten',
    featuredSnippetQuestions: [
      'Wie rüste ich meine Heizung in {stadt} auf Wärmepumpe um?',
      'Was kostet die Umrüstung auf Wärmepumpe in {stadt}?',
    ],
    faqPool: [
        { q: 'Kann ich in meinem Haus in {stadt} eine WP nachrüsten?', a: '70–80% aller Bestandsgebäude in {bundesland} sind nachrüstbar. Entscheidend: Vorlauftemperatur unter 70°C (Hochtemperatur-WP), ausreichend Kellerplatz für Pufferspeicher, Starkstromanschluss möglich.' },
    { q: 'Was kostet die WP-Nachrüstung in {stadt}?', a: 'Anpassungskosten in {stadt}: Hydraulischer Abgleich €500–1.500 (KfW-Pflicht), Pufferspeicher €600–2.000, Elektro-Upgrade €500–1.500, ggf. Heizkörpertausch €200–500/Stück. Gerät + Montage: €18.000–28.000 vor Förderung.' },
    { q: 'Bis wann muss ich in {stadt} nachrüsten?', a: 'GEG-Fristen in {stadt}: Großstädte über 100.000 EW bis 30.06.2026, alle anderen bis 30.06.2028. Tipp: Frühzeitig handeln sichert bessere Installateurtermine und volle KfW-Förderung.' },
    { q: 'Brauche ich vor der Nachrüstung eine Sanierung in {stadt}?', a: 'Nein — die Wärmepumpe ist keine Sanierungspflicht-Voraussetzung. Aber: Hydraulischer Abgleich (KfW-Pflicht) verbessert die JAZ um 0,2–0,5 und lohnt sich fast immer. Vollsanierung optional.' },
    { q: 'Wie lange dauert die WP-Nachrüstung in {stadt}?', a: 'Gesamtprozess: 6–12 Wochen. KfW-Antrag (1–2 Wochen Genehmigung), Vorlaufarbeiten (Elektro, Hydraulik: 1–2 Tage), WP-Montage (2–3 Tage), Inbetriebnahme + KfW-Dokumentation (1 Tag).' },
    { q: 'Muss ich für die Nachrüstung in {stadt} einziehen?', a: 'Nein — die WP-Nachrüstung kann im bewohnten Zustand durchgeführt werden. Die Heizungsunterbrechung dauert typisch 6–8 Stunden. Bei gutem Installateur in {bundesland} läuft die Heizung am Montageabend wieder.' }
  ],
    sitemapPriority: 0.78,
    crossLinks: ['waermepumpe', 'waermepumpe-altbau', 'heizung-tauschen', 'waermepumpe-foerderung', 'waermepumpe-installateur', 'waermepumpe-kosten', 'waermepumpe-installation'],
  },
  {
    id: 9, tier: 2,
    keyword: 'Heizung tauschen [Stadt]',
    slug: 'heizung-tauschen',
    baseVolume: 12000,
    competition: 'mittel_hoch',
    intent: 'commercial',
    template: 'HeizungTauschenTemplate',
    titleTemplate: 'Heizung tauschen {stadt}',
    metaTemplate: 'Heizung tauschen {stadt} {year} ✓ WP vs. Gas vs. Pellet ehrlicher Vergleich ✓ GEG-konforme Lösungen ✓ Stadtspezifische Betriebskosten ✓ Kostenlos anfragen.',
    h1Template: 'Heizung tauschen in {stadt} {year} — Alle Optionen im Vergleich',
    featuredSnippetQuestions: [
      'Welche Heizung soll ich in {stadt} einbauen?',
      'Was kostet es, die Heizung in {stadt} zu tauschen?',
      'Muss ich meine Heizung in {stadt} tauschen?',
    ],
    faqPool: [
        { q: 'Wann ist der Heizungstausch in {stadt} Pflicht?', a: 'GEG §72: Konstanttemperatur-Kessel vor 1994 müssen ausgetauscht werden. Die 65%-EE-Pflicht gilt bei Heizungsausfall oder freiwilligem Tausch sofort. In {stadt} läuft die GEG-Frist für kommunale Wärmeplanung.' },
    { q: 'Welche Heizung darf ich in {stadt} einbauen?', a: 'GEG-konforme Optionen: Wärmepumpe (immer ✓), Pellets (mit Einschränkungen), Fernwärme (je nach Netz). Gas-Hybridheizung nur mit 65% EE-Anteil. Reine Gasheizung: nicht mehr zulässig.' },
    { q: 'Was kostet der Heizungstausch in {stadt}?', a: 'WP komplett: €18.000–28.000 brutto, nach 50–70% KfW ab €9.000. Hybridheizung: €8.000–15.000, nur 30% KfW. Pellets: €15.000–25.000, 45% KfW. Die WP ist nach Förderung oft günstigster und betriebskostengünstigster Option.' },
    { q: 'Wie lange dauert der Heizungstausch in {stadt}?', a: 'Planungszeit: 4–8 Wochen (KfW-Antrag + Installateur). Montage: 2–3 Tage. Gesamtprozess: 6–12 Wochen. Früh planen — in {bundesland} sind Installateure oft auf Wochen ausgebucht.' },
    { q: 'Bekomme ich Förderung beim Heizungstausch in {stadt}?', a: 'Ja: bis zu 70% KfW-Zuschuss (max. €21.000) für Wärmepumpen. KfW-Antrag MUSS vor Auftragserteilung gestellt werden. {bundesland} bietet ggf. zusätzliche Landesförderung.' },
    { q: 'Was passiert wenn ich den Heizungstausch in {stadt} verzögere?', a: 'Bußgelder bis €50.000 (§ 108 GEG), Ordnungswidrigkeit, und: je länger Sie warten, desto teurer wird Gas durch steigende CO₂-Preise (ETS2: €100+/t ab 2030). Früh handeln spart doppelt.' }
  ],
    sitemapPriority: 0.8,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-altbau', 'waermepumpe-oder-gas', 'waermepumpe-foerderung', 'waermepumpe-nachruesten', 'kommunale-waermeplanung'],
  },
  {
    id: 10, tier: 2,
    keyword: 'Wärmepumpe Installation [Stadt]',
    slug: 'waermepumpe-installation',
    baseVolume: 8000,
    competition: 'mittel',
    intent: 'transactional',
    template: 'InstallationTemplate',
    titleTemplate: 'WP Installation {stadt} {year}',
    metaTemplate: 'Wärmepumpe Installation {stadt} ✓ Vollständiger Ablauf & Zeitplan {year} ✓ Genehmigungen {bundesland} ✓ HWK-Betriebe vor Ort ✓ KfW-Antragsbegleitung inklusive.',
    h1Template: 'Wärmepumpe Installation {stadt} {year} — Ablauf, Kosten & Genehmigungen',
    featuredSnippetQuestions: [
      'Wie läuft die Installation einer Wärmepumpe in {stadt} ab?',
      'Brauche ich eine Genehmigung für eine Wärmepumpe in {stadt}?',
      'Wie lange dauert die Installation in {stadt}?',
    ],
    faqPool: [
        { q: 'Was passiert bei der WP-Installation in {stadt}?', a: 'Tag 1: Außeneinheit aufstellen, Kernbohrung, Kältemittelleitungen. Tag 2: Kältemittelkreis befüllen (F-Gas-Pflicht), Pufferspeicher anschließen, Elektroinstallation. Tag 3: Hydraulischer Abgleich (KfW-Pflicht), Inbetriebnahme, KfW-Protokoll.' },
    { q: 'Welche Genehmigungen brauche ich für die WP-Installation in {stadt}?', a: 'Luft-WP in {bundesland}: meist keine Baugenehmigung, aber formlose Anzeige beim Bauamt. Erdwärme: wasserrechtliche Genehmigung. Netzbetreiber-Anmeldung: ca. 4 Wochen Vorlauf. TA-Lärm einhalten.' },
    { q: 'Was kostet die WP-Installation in {stadt}?', a: 'Reine Montagekosten {stadt}: €3.000–6.000. Dazu: Hydraulischer Abgleich €500–1.500 (KfW-Pflicht), Starkstrom €500–1.500, Wärmemengenzähler €300–600 (KfW-Pflicht 2026). Alle Positionen im Angebot fordern.' },
    { q: 'Was sind die baulichen Voraussetzungen für eine WP in {stadt}?', a: 'Außenfläche min. 0,5 m² für Außeneinheit + Abstand zur Grenze ({bundesland}: typisch 2–3 m), Kellerraum min. 1 m² für Pufferspeicher 200–500 l, Starkstromanschluss 3×16A, Kernbohrung 60–80 mm.' },
    { q: 'Wie viele Tage kein Heizung bei der Installation in {stadt}?', a: 'Die Heizungsunterbrechung dauert typisch 6–8 Stunden. Bei gut organisierten Betrieben in {bundesland} läuft die neue WP noch am Installationstag. Im Winter: Überbrückungsheizung leihen.' },
    { q: 'Wann muss ich den KfW-Antrag vor der Installation stellen?', a: 'Zwingend VOR der Auftragserteilung — kein Nachantrag möglich. Genehmigungsdauer: 1–2 Wochen. Erst nach KfW-Zusage Auftrag erteilen. Ausnahme: Vertrag unter aufschiebender Bedingung der Förderzusage.' }
  ],
    sitemapPriority: 0.75,
    crossLinks: ['waermepumpe-installateur', 'waermepumpe-kosten', 'waermepumpe-montage', 'waermepumpe', 'waermepumpe-foerderung', 'luft-wasser-waermepumpe', 'waermepumpe-fachbetrieb'],
  },
  {
    id: 11, tier: 2,
    keyword: 'Kommunale Wärmeplanung [Stadt]',
    slug: 'kommunale-waermeplanung',
    baseVolume: 8000,
    competition: 'niedrig',
    intent: 'informational',
    template: 'WaermeplanungTemplate',
    titleTemplate: 'Kommunale Wärmeplanung {stadt}',
    metaTemplate: 'Kommunale Wärmeplanung {stadt} {year}: Fristen, Pflichten & was das für Ihre Heizung bedeutet ✓ GEG-Kontext ✓ Wärmepumpe als sichere GEG-konforme Alternative.',
    h1Template: 'Kommunale Wärmeplanung {stadt} {year} — Was Hausbesitzer wissen müssen',
    featuredSnippetQuestions: [
      'Was bedeutet die kommunale Wärmeplanung für {stadt}?',
      'Bis wann muss {stadt} einen Wärmeplan vorlegen?',
      'Was ändert sich durch die Wärmeplanung in {stadt} für mich?',
    ],
    faqPool: [
        { q: 'Was bedeutet die kommunale Wärmeplanung für {stadt}?', a: '{stadt} muss bis 30.06.2026 einen kommunalen Wärmeplan vorlegen (Großstädte). Der Plan zeigt: welche Gebiete Fernwärme bekommen — und wo individuelle Lösungen wie die Wärmepumpe die Zukunft sind (ca. 70–85% aller Gebäude).' },
    { q: 'Darf ich trotz Wärmeplanung eine WP in {stadt} installieren?', a: 'Ja — die KfW-Förderung gilt unabhängig vom kommunalen Wärmeplan. Auch im "potenziellen Fernwärmegebiet" können Sie jetzt eine WP einbauen und volle Förderung erhalten. Kein Installationsverbot.' },
    { q: 'Liegt mein Haus in {stadt} im Fernwärmegebiet?', a: 'Prüfen Sie auf der Website von {stadt} ob ein Wärmeplan vorliegt und ob Ihre Adresse im geplanten Fernwärmegebiet liegt. In den meisten Fällen (ca. 70–85%) ist das nicht der Fall — dann ist die WP die richtige Wahl.' },
    { q: 'Bis wann muss {stadt} einen Wärmeplan vorlegen?', a: 'Städte über 100.000 Einwohner: Pflicht bis 30. Juni 2026. Alle anderen Gemeinden: bis 30. Juni 2028. Der Plan ist eine Planungsgrundlage — kein Kaufverbot für Wärmepumpen.' },
    { q: 'Ändert der Wärmeplan etwas an der KfW-Förderung in {stadt}?', a: 'Nein — die KfW-Bundesförderung (bis 70%, max. €21.000) gilt weiterhin unabhängig vom kommunalen Wärmeplan. Wer jetzt handelt, sichert die aktuell attraktiven Fördersätze.' },
    { q: 'Was tun als Hausbesitzer in {stadt} vor dem Wärmeplan?', a: 'Wenn Ihr Haus nicht im definitiven Fernwärmegebiet liegt: WP jetzt planen und KfW-Förderung sichern. Warten erhöht das Risiko geänderter Konditionen. Wir beraten kostenlos zur Situation in {stadt}.' }
  ],
    sitemapPriority: 0.72,
    crossLinks: ['waermepumpe', 'heizung-tauschen', 'waermepumpe-foerderung', 'waermepumpe-kosten', 'waermepumpe-installateur', 'waermepumpe-oder-gas', 'waermepumpe-neubau'],
  },
  // ── TIER 3 ────────────────────────────────────────────────────
  {
    id: 12, tier: 3,
    keyword: 'Erdwärmepumpe [Stadt]',
    slug: 'erdwaermepumpe',
    baseVolume: 18000,
    competition: 'mittel',
    intent: 'info_commercial',
    template: 'ErdwaermeTemplate',
    titleTemplate: 'Erdwärmepumpe {stadt} {year}',
    metaTemplate: 'Erdwärmepumpe in {stadt} {year} ✓ Geologische Eignung in {bundesland} ✓ Sole-Wasser vs. Wasser-Wasser im Vergleich ✓ +5% KfW-Bonus ✓ Kosten & Förderung.',
    h1Template: 'Erdwärmepumpe {stadt} {year} — Eignung, Kosten & Installateure',
    featuredSnippetQuestions: [
      'Eignet sich mein Grundstück in {stadt} für eine Erdwärmepumpe?',
      'Was kostet eine Erdwärmepumpe in {stadt}?',
    ],
      faqPool: [
        { q: 'Lohnt sich eine Erdwärmepumpe in {stadt}?', a: 'Erdwärme lohnt sich in {bundesland} bei: gut gedämmtem Haus (wenig Heizbedarf), Fußbodenheizung (35°C VL), ausreichend Grundstück für Bohrung, langfristiger Planung (15+ Jahre). JAZ 4,3+ vs. 3,5 bei Luft-WP = ca. €200–400/Jahr Einsparung.' },
    { q: 'Was kostet eine Erdwärmepumpe in {stadt}?', a: 'Tiefenbohrung: €80–100/m × 80–150 m = €6.400–15.000. Gerät + Montage: €16.000–25.000. Gesamt: €22.000–35.000. Nach KfW (35%+5% Kältemittelbonus=40%): Eigenanteil ab ~€13.000. Betriebskosten: ca. {wpKosten}€/Jahr.' },
    { q: 'Brauche ich eine Genehmigung für Erdwärme in {stadt}?', a: 'Ja — wasserrechtliche Genehmigung bei der unteren Wasserbehörde in {bundesland} nötig. Hydrogeologisches Gutachten, Bohrprotokoll. Dauer: 4–8 Wochen. Das Bohrunternehmen übernimmt das üblicherweise.' },
    { q: 'Wie tief muss die Bohrung in {stadt} sein?', a: 'In {bundesland} typisch 80–150 m Tiefenbohrung. Richtwert: ca. 50–60 W Entzugsleistung je Meter. Für ein 120 m² EFH mit 8 kW Heizlast: ca. 2×70 m oder 1×120 m Bohrung. Genaue Auslegung nach Heizlastberechnung.' },
    { q: 'Wie lange dauert die Erdwärme-Installation in {stadt}?', a: 'Gesamtprozess: 8–16 Wochen. Genehmigung (4–8 Wo.), Bohrung (1–3 Tage), Leitungsverlegung (1–2 Tage), WP-Montage + Inbetriebnahme (2–3 Tage). Bohrfirmen in {bundesland} teilweise auf Monate ausgebucht.' },
    { q: 'Wie viel Grundstück brauche ich für Erdwärme in {stadt}?', a: 'Tiefenbohrung: nur ca. 2 m² Aufstandsfläche — geeignet für fast alle Grundstücke. Flächenkollektor: mind. 10× Wohnfläche (für 120 m² Haus = 1.200 m²) — nur in ländlichen Lagen in {bundesland} realistisch.' }
  ],
    sitemapPriority: 0.75,
    crossLinks: ['luft-wasser-waermepumpe', 'waermepumpe-kosten', 'waermepumpe', 'luftwaermepumpe', 'waermepumpe-foerderung', 'waermepumpe-installateur', 'waermepumpe-neubau'],
  },
  {
    id: 13, tier: 3,
    keyword: 'Wärmepumpe Angebot [Stadt]',
    slug: 'waermepumpe-angebot',
    baseVolume: 6000,
    competition: 'mittel',
    intent: 'transactional',
    template: 'AngebotTemplate',
    titleTemplate: 'Wärmepumpe Angebot {stadt} {year}',
    metaTemplate: 'Kostenloses Wärmepumpe Angebot {stadt} {year} ✓ Bis zu 3 geprüfte lokale Fachbetriebe ✓ Alle Positionen transparent ausgewiesen ✓ KfW-Förderung inklusive.',
    h1Template: 'Wärmepumpe Angebot {stadt} {year} — Kostenlos bis zu 3 Angebote vergleichen',
    featuredSnippetQuestions: [
      'Wo bekomme ich kostenlose WP-Angebote in {stadt}?',
    ],
      faqPool: [
        { q: 'Was muss im WP-Angebot in {stadt} stehen?', a: 'Pflichtpositionen: Heizlastberechnung DIN EN 12831, hydraulischer Abgleich (KfW-Pflicht), WP-Modell mit Kältemittel und kW, Pufferspeicher-Volumen, Elektroinstallation separat, Wärmemengenzähler (KfW 2026), F-Gas-Inbetriebnahme.' },
    { q: 'Wie viele Angebote sollte ich in {stadt} einholen?', a: 'Mindestens 3 — die Verbraucherzentrale empfiehlt das ausdrücklich. In {bundesland} sind Preisunterschiede von 20–40% bei gleicher Leistung keine Seltenheit. Wir liefern 3 vollständige, direkt vergleichbare Angebote in 48 Stunden.' },
    { q: 'Woran erkenne ich ein unseriöses WP-Angebot in {stadt}?', a: '5 rote Flaggen: Kein Heizlastnachweis, kein hydraulischer Abgleich im Preis, Pauschalpreis ohne Positionsaufschlüsselung, Betrieb nicht im KfW-Portal, Gewährleistung unter 2 Jahren. Sofort ablehnen.' },
    { q: 'Wie lange gilt ein WP-Angebot in {bundesland}?', a: 'Typisch 30 Tage — danach können Preise steigen. In {bundesland} sind die Materialkosten derzeit stabil, aber Installateur-Auslastung variiert. Gut ausgelastete Betriebe in {stadt} geben kürzere Gültigkeiten.' },
    { q: 'Muss das Angebot die KfW-Förderung berücksichtigen?', a: 'Seriöse Betriebe in {stadt} weisen KfW-Förderquote und Eigenanteil im Angebot aus. KfW-LuL-Nummer des Betriebs muss angegeben sein. Ohne diese Angaben: KfW-Antrag gefährdet.' },
    { q: 'Kann ich WP-Angebote in {stadt} online vergleichen?', a: 'Wir holen für Sie bis zu 3 vollständige Angebote geprüfter Fachbetriebe aus {stadt} und {bundesland} ein — kostenlos, in 48 Stunden, mit allen KfW-Pflichtpositionen. Kein Verkaufsdruck.' }
  ],
    sitemapPriority: 0.72,
    crossLinks: ['waermepumpe-installateur', 'waermepumpe-kosten', 'waermepumpe', 'waermepumpe-foerderung', 'waermepumpe-anbieter', 'waermepumpe-fachbetrieb', 'luft-wasser-waermepumpe'],
  },
  {
    id: 14, tier: 3,
    keyword: 'Wärmepumpe Preise [Stadt]',
    slug: 'waermepumpe-preise',
    baseVolume: 22000,
    competition: 'mittel_hoch',
    intent: 'commercial',
    template: 'PreiseTemplate',
    titleTemplate: 'Wärmepumpe Preise {stadt} {year} – Aktuelle Kosten & Vergleich',
    metaTemplate: 'Wärmepumpe Preise {stadt} {year} ✓ Alle Typen im Vergleich ✓ Luft-Wasser ab {preisVon} ✓ Aktuelle Marktpreise ✓ KfW bis €21.000 ✓ Jetzt kostenlos anfragen.',
    h1Template: 'Wärmepumpe Preise {stadt} {year} — Aktuelle Kosten aller Typen',
    featuredSnippetQuestions: [
      'Was kostet eine Wärmepumpe in {stadt} im Jahr {year}?',
      'Wie haben sich die WP-Preise in {stadt} entwickelt?',
    ],
      faqPool: [
        { q: 'Was kostet eine Wärmepumpe in {stadt} komplett?', a: 'Luft-Wasser-WP komplett in {stadt}: €18.000–28.000 brutto (Gerät €10.000–18.000 + Montage €4.000–7.000 + Hydraulik €500–1.500 + Elektro €500–1.500 + Wärmemengenzähler €300–600). Nach 50% KfW ab ca. €9.000 Eigenanteil.' },
    { q: 'Wie hoch sind die Betriebskosten einer WP in {stadt}?', a: 'Mit {strompreis} ct/kWh Strompreis in {stadt} und JAZ {jaz}: ca. {wpKosten}€/Jahr Heizkosten für 120 m² EFH. Gegenüber Gas (ca. {altKosten}€/Jahr) = Ersparnis ca. {ersparnis}€/Jahr.' },
    { q: 'Was kosten verschiedene WP-Typen in {bundesland}?', a: 'Luft-Wasser-WP: €18.000–28.000. Sole-Wasser-WP (Erdwärme): €22.000–35.000. Wasser-Wasser-WP: €25.000–40.000. Nach KfW-Förderung (40–70%): alle Typen deutlich günstiger im Eigenanteil.' },
    { q: 'Wie viel spare ich mit einer WP gegenüber Gas in {stadt}?', a: 'Bei {strompreis} ct/kWh Strom und aktuellem Gaspreis sparen Sie in {stadt} ca. {ersparnis}€/Jahr. Plus: CO₂-Kosten auf Gas steigen jährlich (ETS2). Amortisation typisch 7–12 Jahre.' },
    { q: 'Welche versteckten Kosten gibt es bei WP-Preisen in {stadt}?', a: 'Häufig nicht im Angebot: Hydraulischer Abgleich (€500–1.500, KfW-Pflicht), Starkstromkreis-Upgrade (€500–1.500), Wärmemengenzähler (€300–600, KfW-Pflicht 2026), Pufferspeicher (€600–2.000). Auf vollständige Angebote bestehen.' },
    { q: 'Warum unterscheiden sich WP-Preise in {stadt} so stark?', a: 'Preisunterschiede von 20–40% zwischen Betrieben in {bundesland} sind normal. Ursachen: unterschiedliche Materialqualität, Overhead, Auslastung. Wichtig: nur vollständige Angebote vergleichen.' }
  ],
    sitemapPriority: 0.75,
    crossLinks: ['waermepumpe-kosten', 'waermepumpe', 'waermepumpe-foerderung', 'waermepumpe-installateur', 'luft-wasser-waermepumpe', 'erdwaermepumpe', 'waermepumpe-oder-gas'],
  },
  {
    id: 15, tier: 3,
    keyword: 'Wärmepumpe Anbieter [Stadt]',
    slug: 'waermepumpe-anbieter',
    baseVolume: 5000,
    competition: 'mittel',
    intent: 'transactional',
    template: 'AnbieterTemplate',
    titleTemplate: 'Wärmepumpe Anbieter {stadt} {year} – Geprüfte lokale Fachbetriebe',
    metaTemplate: 'Geprüfte Wärmepumpen-Anbieter {stadt} ✓ Lokale Meisterbetriebe ✓ Herstellerunabhängig ✓ Kostenlos bis zu 3 vollständige Angebote vergleichen {year}.',
    h1Template: 'Wärmepumpe Anbieter {stadt} {year} — Geprüfte lokale Fachbetriebe',
    featuredSnippetQuestions: [
      'Welche Wärmepumpen-Anbieter gibt es in {stadt}?',
    ],
      faqPool: [
        { q: 'Welche WP-Anbieter gibt es in {stadt}?', a: 'In {stadt} gibt es lokale SHK-Meisterbetriebe, Systemanbieter (Vaillant, Stiebel Eltron, Viessmann) und Vermittlungsportale. Wir empfehlen lokale Meisterbetriebe: bessere Reaktionszeit, kennen lokale Auflagen in {bundesland}.' },
    { q: 'Was unterscheidet gute von schlechten WP-Anbietern in {stadt}?', a: '7 Kriterien: HWK-Eintragung, KfW-LuL-Registrierung, F-Gas-Zertifikat, ≥5 WP-Referenzen, Heizlastberechnung inklusive, Haftpflicht ≥€1,5 Mio., lokaler Ansprechpartner. Alle unsere Partnerbetriebe erfüllen alle 7.' },
    { q: 'Lokal oder bundesweit — welcher WP-Anbieter für {stadt}?', a: 'Lokale Betriebe in {stadt} kennen Netzbetreiber, Genehmigungsbehörden und Besonderheiten in {bundesland}. Bei Störungen schnell vor Ort. Bundesweite Anbieter setzen oft auf Subunternehmer — weniger Verantwortung.' },
    { q: 'Wie prüfe ich ob ein WP-Anbieter in {stadt} seriös ist?', a: 'KfW-Portal prüfen (kdnr.kfw.de), HWK-Verzeichnis, F-Gas-Betriebsregister der EU. Warnsignale: Angebot ohne Heizlastberechnung, kein hydraulischer Abgleich, keine KfW-Registrierung.' },
    { q: 'Was kostet ein WP-Anbieter in {stadt}?', a: 'Für Sie als Hausbesitzer kostenlos — wir erhalten eine Vermittlungsprovision vom Installateur (€50–120). Sie zahlen nur den Installateur, wenn Sie sich für ein Angebot entscheiden.' },
    { q: 'Wie viele Angebote sollte ich von verschiedenen Anbietern in {stadt} einholen?', a: 'Mindestens 3 vollständige, vergleichbare Angebote. In {bundesland} sind Preisunterschiede von 20–40% normal. Wir liefern bis zu 3 geprüfte Angebote in 48 Stunden — kostenlos.' }
  ],
    sitemapPriority: 0.7,
    crossLinks: ['waermepumpe-installateur', 'waermepumpe-angebot', 'waermepumpe', 'waermepumpe-kosten', 'waermepumpe-fachbetrieb', 'luft-wasser-waermepumpe', 'waermepumpe-foerderung'],
  },
  {
    id: 16, tier: 3,
    keyword: 'Luftwärmepumpe [Stadt]',
    slug: 'luftwaermepumpe',
    baseVolume: 33000,
    competition: 'mittel',
    intent: 'info_commercial',
    template: 'LuftwaermepumpeTemplate',
    titleTemplate: 'Luftwärmepumpe {stadt} {year} – Kosten, JAZ & Installateure',
    metaTemplate: 'Luftwärmepumpe {stadt} {year}: Luft-Luft vs. Luft-Wasser ✓ JAZ {jaz} bei {avgTemp}°C ✓ Kosten & KfW-Förderung bis 70% ✓ Kostenloser Installateur-Vergleich.',
    h1Template: 'Luftwärmepumpe {stadt} {year} — Kosten, Effizienz & Installateure',
    featuredSnippetQuestions: [
      'Was ist der Unterschied zwischen Luft-Wasser und Luft-Luft in {stadt}?',
    ],
faqPool: [
        { q: 'Was ist der Unterschied zwischen Luft-WP und Luft-Wasser-WP?', a: 'Luft-Wasser-WP (häufigster Typ): Wärme aus Luft → Heizwasser. Für Heizung + Warmwasser. Luft-Luft-WP: Wärme aus Luft → Raumluft (keine Warmwasserbereitung). In {bundesland} fast immer Luft-Wasser-WP die richtige Wahl.' },
    { q: 'Wie laut ist eine Luftwärmepumpe in {stadt}?', a: 'Moderne Geräte: 45–55 dB(A) auf 1 m Abstand (wie normales Gespräch). TA-Lärm in {bundesland}: max. 45 dB(A) tags / 35 dB(A) nachts an der Grundstücksgrenze. Mit korrektem Aufstellort problemlos einhaltbar.' },
    { q: 'Welche JAZ erreicht eine Luftwärmepumpe in {stadt}?', a: 'In {stadt} mit {avgTemp}°C Jahresmittel erreicht eine moderne Luftwärmepumpe eine JAZ von ca. {jaz}. Bei Fußbodenheizung (35°C VL) bis zu JAZ 4,2 möglich. Kältester Punkt: {normAussentemp}°C.' },
    { q: 'Was kostet eine Luftwärmepumpe in {stadt}?', a: 'Gerät: €9.000–16.000. Komplett mit Montage: €18.000–26.000. Nach KfW-Förderung (50–70%): ab ca. €9.000 Eigenanteil. Betriebskosten: ca. {wpKosten}€/Jahr bei {strompreis} ct/kWh in {stadt}.' },
    { q: 'Monoblock oder Split — was ist besser für {stadt}?', a: 'Monoblock: 70% Marktanteil, nur Wasserleitungen ins Haus, einfachere Installation, kein F-Gas innen. Split: etwas effizienter bei langen Leitungswegen, aber komplexer. Für die meisten Häuser in {bundesland}: Monoblock.' },
    { q: 'Brauche ich eine Genehmigung für eine Luftwärmepumpe in {stadt}?', a: 'In {bundesland} meist keine Baugenehmigung, aber formlose Anzeige beim Bauamt. TA-Lärm-Grenzwert einhalten, Abstand zur Grundstücksgrenze (2–3 m je Bundesland). Netzbetreiber-Anmeldung ca. 4 Wochen Vorlauf.' }
  ],
    sitemapPriority: 0.75,
    crossLinks: ['luft-wasser-waermepumpe', 'waermepumpe-kosten', 'waermepumpe', 'waermepumpe-installateur', 'erdwaermepumpe', 'waermepumpe-foerderung', 'waermepumpe-altbau'],
  },
  {
    id: 17, tier: 3,
    keyword: 'Wärmepumpe Neubau [Stadt]',
    slug: 'waermepumpe-neubau',
    baseVolume: 6000,
    competition: 'mittel',
    intent: 'info_commercial',
    template: 'NeubauTemplate',
    titleTemplate: 'Wärmepumpe Neubau {stadt} {year}',
    metaTemplate: 'Wärmepumpe Neubau {stadt} {year} ✓ GEG-Pflicht seit 01.01.2024 ✓ Optimale Planung für maximale Effizienz ✓ KfW-Kredit 297/298 ✓ Geprüfte Fachbetriebe.',
    h1Template: 'Wärmepumpe Neubau {stadt} {year} — GEG-konform & optimal geplant',
    featuredSnippetQuestions: [
      'Welche Wärmepumpe für den Neubau in {stadt}?',
      'Ist eine Wärmepumpe im Neubau in {stadt} Pflicht?',
    ],
    faqPool: [
        { q: 'Welche WP ist ideal für den Neubau in {stadt}?', a: 'Im Neubau in {bundesland} mit Fußbodenheizung: Sole-Wasser-WP (JAZ 4,3–5,0) oder Luft-Wasser-WP (JAZ 3,8–4,2 mit FBH). Vorlauftemperatur 30–35°C → maximale Effizienz. GEG-konform sind beide.' },
    { q: 'Was kostet eine WP im Neubau in {stadt}?', a: 'Luft-Wasser-WP im Neubau {stadt}: €16.000–26.000. Erdwärme: €22.000–35.000. Im Neubau kein Klima-Speed-Bonus (kein fossiles Altsystem), aber KfW KFN (Klimafreundlicher Neubau) nutzbar.' },
    { q: 'Welche GEG-Anforderungen gelten im Neubau in {bundesland}?', a: 'Seit 01.01.2024: 65%-EE-Pflicht für alle Neubauten. WP erfüllt das immer. Zusätzlich: QP-Grenzwert einhalten, Lüftungsanlage ab n50 < 0,6 h⁻¹ empfohlen, Anlagenbuch für Bauabnahme.' },
    { q: 'Lohnt sich Erdwärme im Neubau in {stadt}?', a: 'Ja — im Neubau ist die Mehrkosten der Bohrung am besten amortisierbar: 15–25 Jahre Betrieb, JAZ 4,5+ mit FBH, +5% KfW-Kältemittelbonus. In {bundesland} mit ausreichend Grundstück klar zu empfehlen.' },
    { q: 'Wann sollte ich die WP im Neubau in {stadt} planen?', a: 'So früh wie möglich — idealerweise in der Entwurfsphase. Fußbodenheizung muss im Rohbau eingeplant werden. Außeneinheit-Standort in der Baugenehmigung berücksichtigen. Netzbetreiber-Anmeldung 4–6 Wochen vor Inbetriebnahme.' },
    { q: 'Wie viel Strom verbraucht eine WP im Neubau in {stadt}?', a: 'Ein KfW-55-Neubau (120 m²) benötigt ca. 8.000–10.000 kWh/Jahr Heizwärme. Bei JAZ 4,0: ca. 2.000–2.500 kWh Strom/Jahr = ca. {wpKosten}€ bei {strompreis} ct/kWh in {stadt}.' }
  ],
    sitemapPriority: 0.7,
    crossLinks: ['waermepumpe', 'luft-wasser-waermepumpe', 'waermepumpe-kosten', 'waermepumpe-installateur', 'waermepumpe-foerderung', 'erdwaermepumpe', 'kommunale-waermeplanung'],
  },
  // ── TIER 4 ────────────────────────────────────────────────────
  {
    id: 18, tier: 4,
    keyword: 'Wärmepumpe Beratung [Stadt]',
    slug: 'waermepumpe-beratung',
    baseVolume: 4000,
    competition: 'niedrig_mittel',
    intent: 'transactional',
    template: 'BeratungTemplate',
    titleTemplate: 'Wärmepumpe Beratung {stadt} {year}',
    metaTemplate: 'Kostenlose Wärmepumpen-Beratung {stadt} {year} ✓ Unabhängig & herstellerneutral ✓ Gebäudeanalyse & Heizlast ✓ Förderberechnung ✓ Geprüfte Fachbetriebe.',
    h1Template: 'Wärmepumpe Beratung {stadt} {year} — Kostenlos & unabhängig',
    featuredSnippetQuestions: ['Wo bekomme ich eine unabhängige WP-Beratung in {stadt}?'],
    faqPool: [
        { q: 'Was umfasst eine kostenlose WP-Beratung für {stadt}?', a: '6 Punkte: WP-Eignung Ihres Hauses, welcher WP-Typ (Luft/Sole/Wasser), realistischer Kostenrahmen in {stadt}, maximale Förderquote für Ihre Situation, geeignete lokale Fachbetriebe in {bundesland}, KfW-Antragsbegleitung.' },
    { q: 'Wo kann ich mich in {stadt} zur Wärmepumpe beraten lassen?', a: 'Unabhängige Optionen: Verbraucherzentrale {bundesland} (kostenpflichtig, gefördert), BAFA-Energieberater, oder unsere kostenlose Vermittlungsberatung. Herstellergebundene Berater arbeiten oft mit Verkaufsdruck.' },
    { q: 'Ist unsere WP-Beratung für {stadt} wirklich kostenlos?', a: 'Ja — vollständig kostenlos. Wir finanzieren uns über Vermittlungsprovisionen (€50–120) von Installateuren wenn ein Auftrag zustande kommt. Keine Kosten, keine Vertragspflicht, keine Weitergabe Ihrer Daten.' },
    { q: 'Was muss ich für die WP-Beratung in {stadt} mitbringen?', a: 'Hilfreich: Wohnfläche, Baujahr, aktuelle Heizung (Typ + Alter), ob Keller vorhanden, ob Vorlauftemperatur bekannt. Nicht nötig: Technikkenntnisse — wir erklären alles verständlich in ca. 10 Minuten.' },
    { q: 'Wie schnell bekomme ich eine Beratung für {stadt}?', a: 'Ersteinschätzung: sofort per Formular. Angebote von Fachbetrieben: innerhalb von 48 Stunden. Persönliches Gespräch: nach Absprache. Alles kostenlos, von lokalen Experten aus {bundesland}.' },
    { q: 'Kann mir die Beratung die falsche WP empfehlen?', a: 'Wir sind herstellerunabhängig — wir empfehlen was für Ihr Haus und Budget passt, nicht was die höchste Provision bringt. Alle Empfehlungen basieren auf Heizlastberechnung, Standortdaten und lokalen Gegebenheiten in {stadt}.' }
  ],
    sitemapPriority: 0.65,
    crossLinks: ['waermepumpe', 'waermepumpe-foerderung', 'waermepumpe-installateur', 'waermepumpe-kosten', 'waermepumpe-angebot', 'luft-wasser-waermepumpe', 'heizung-tauschen'],
  },
  {
    id: 19, tier: 4,
    keyword: 'Wärmepumpe Fachbetrieb [Stadt]',
    slug: 'waermepumpe-fachbetrieb',
    baseVolume: 3000,
    competition: 'niedrig_mittel',
    intent: 'transactional',
    template: 'FachbetriebTemplate',
    titleTemplate: 'Wärmepumpe Fachbetrieb {stadt} {year}',
    metaTemplate: 'Zertifizierte WP-Fachbetriebe {stadt} ✓ HWK-eingetragene Meisterbetriebe ✓ KfW-registriert ✓ Mindestens 5 WP-Referenzen ✓ Kostenlos bis zu 3 Angebote.',
    h1Template: 'Wärmepumpe Fachbetrieb {stadt} {year} — Zertifizierte Meisterbetriebe',
    featuredSnippetQuestions: ['Was macht einen guten WP-Fachbetrieb in {stadt} aus?'],
    faqPool: [
        { q: 'Was macht einen WP-Fachbetrieb in {stadt} aus?', a: 'HWK-Eintragung, KfW-LuL-Registrierung (Pflicht für BEG-Förderung), F-Gas-Sachkundenachweis, mind. 5 dokumentierte WP-Installationen, vollständige Angebote mit Heizlastberechnung. Alle unsere Partner in {stadt} erfüllen das.' },
    { q: 'Wie finde ich einen geprüften WP-Fachbetrieb in {stadt}?', a: 'KfW-Portal (kdnr.kfw.de), BWP-Fachpartnerliste, HWK-Verzeichnis {bundesland}. Oder: Wir vermitteln kostenlos geprüfte Fachbetriebe in {stadt} — in 48 Stunden, bis zu 3 vollständige Angebote.' },
    { q: 'Muss der Fachbetrieb in {stadt} KfW-registriert sein?', a: 'Ja — für KfW BEG-Förderung zwingend. Ohne KfW-LuL-Nummer gibt es keinen Zuschuss. Die Registrierung prüfen: kdnr.kfw.de — Name oder KfW-Nummer des Betriebs eingeben.' },
    { q: 'Was kostet ein WP-Fachbetrieb in {stadt}?', a: 'Montagekosten typisch €3.000–6.000 für reine Arbeitsleistung. Dazu KfW-Pflichtpositionen: Hydraulischer Abgleich €500–1.500, Wärmemengenzähler €300–600. Alle Positionen im Angebot einzeln verlangen.' },
    { q: 'Was passiert wenn der Fachbetrieb in {stadt} Fehler macht?', a: '5 häufige Fehler: WP ohne Heizlastberechnung dimensioniert, kein Hydraulischer Abgleich (KfW-Antrag scheitert), kein KfW-Antrag gestellt, Inbetriebnahme ohne F-Gas-Zertifikat (illegal), Standort fehlerhaft. Sorgfältige Auswahl vermeidet das.' },
    { q: 'Wie prüfe ich Referenzen eines WP-Fachbetriebs in {stadt}?', a: 'Mindestens 5 WP-Installationen in den letzten 2 Jahren verlangen. Google-Bewertungen, ProvenExpert oder Trustpilot prüfen. Referenzprojekte in {bundesland} anfragen. Unsere Partnerbetriebe sind alle vorab geprüft.' }
  ],
    sitemapPriority: 0.65,
    crossLinks: ['waermepumpe-installateur', 'waermepumpe-anbieter', 'waermepumpe', 'waermepumpe-kosten', 'waermepumpe-angebot', 'waermepumpe-foerderung', 'waermepumpe-installation'],
  },
  {
    id: 20, tier: 4,
    keyword: 'Wärmepumpe Montage [Stadt]',
    slug: 'waermepumpe-montage',
    baseVolume: 3500,
    competition: 'niedrig_mittel',
    intent: 'transactional',
    template: 'MontageTemplate',
    titleTemplate: 'Wärmepumpe Montage {stadt} {year}',
    metaTemplate: 'Wärmepumpe Montage {stadt} {year} ✓ Aufstellort & Lärmschutz {bundesland} ✓ Montagekosten transparent ✓ Genehmigungscheck ✓ Geprüfte Fachbetriebe kostenlos.',
    h1Template: 'Wärmepumpe Montage {stadt} {year} — Ablauf, Aufstellort & Kosten',
    featuredSnippetQuestions: ['Wo kann ich die Wärmepumpe in {stadt} aufstellen?'],
    faqPool: [
        { q: 'Wie läuft die WP-Montage in {stadt} ab?', a: 'Tag 1: Außeneinheit aufstellen, Fundament/Schwingungsdämpfer, Kernbohrung, Kältemittelleitungen verlegen, Hydraulik vorbereiten. Tag 2: Kältemittelkreis befüllen (F-Gas), Pufferspeicher + Warmwasserspeicher. Tag 3: Hydraulischer Abgleich (KfW-Pflicht), Inbetriebnahme, KfW-Protokoll.' },
    { q: 'Was kostet die WP-Montage in {stadt}?', a: 'Reine Montagekosten {stadt}: €3.000–6.000. KfW-Pflichtpositionen: Hydraulischer Abgleich €500–1.500, Wärmemengenzähler €300–600 (KfW 2026). Kernbohrung €150–400. Starkstrom €500–1.500. Alle Positionen einzeln im Angebot.' },
    { q: 'Wie lange dauert die WP-Montage in {stadt}?', a: '2–3 Tage für die eigentliche Montage. Gesamtprozess mit Planung und KfW: 6–12 Wochen. Während Montage: Heizungsunterbrechung ca. 6–8 Stunden. Im Winter Überbrückung einplanen.' },
    { q: 'Was sind typische Montagefehler in {bundesland}?', a: '5 häufige Fehler: Außeneinheit zu nah an Grundstücksgrenze (TA-Lärm), Pufferspeicher zu klein (Taktungsproblem), kein Hydraulischer Abgleich (KfW-Antrag scheitert), Außeneinheit in Wärmefalle (COP sinkt 15–25%), kein Schallschutzfundament.' },
    { q: 'Muss jemand bei der Montage in {stadt} dabei sein?', a: 'Nicht während der gesamten Montage, aber zu Beginn (Einweisung in Haus + Keller), für die Kernbohrung (Abstimmung Ort), und zur Abnahme am Tag 3. Ca. 2–3 Stunden insgesamt.' },
    { q: 'Wie wird die WP-Montage in {stadt} dokumentiert?', a: 'Für KfW-Verwendungsnachweis Pflicht: Inbetriebnahmeprotokoll (F-Gas), Hydraulischer Abgleich-Nachweis, Wärmemengenzähler-Einbaubestätigung, Rechnung mit allen Positionen. Seriöse Betriebe in {bundesland} liefern das automatisch.' }
  ],
    sitemapPriority: 0.65,
    crossLinks: ['waermepumpe-installation', 'waermepumpe-installateur', 'waermepumpe', 'waermepumpe-kosten', 'luft-wasser-waermepumpe', 'waermepumpe-foerderung', 'waermepumpe-fachbetrieb'],
  },
  {
    id: 21, tier: 4,
    keyword: 'Wärmepumpe oder Gas [Stadt]',
    slug: 'waermepumpe-oder-gas',
    baseVolume: 8000,
    competition: 'mittel',
    intent: 'info_commercial',
    template: 'VergleichTemplate',
    titleTemplate: 'Wärmepumpe oder Gas {stadt} {year}',
    metaTemplate: 'Wärmepumpe oder Gas in {stadt}? Ehrlicher Kostenvergleich {year} mit CO₂-Preis ✓ GEG-Konformität ✓ Stadtspezifische Zahlen ✓ Kostenloser Angebotsvergleich.',
    h1Template: 'Wärmepumpe oder Gas in {stadt} {year} — Der ehrliche Vergleich',
    featuredSnippetQuestions: [
      'Was ist günstiger: Wärmepumpe oder Gas in {stadt}?',
      'Lohnt sich die Wärmepumpe gegenüber Gas in {stadt}?',
    ],
    faqPool: [
        { q: 'Wärmepumpe oder Gas — was ist günstiger in {stadt}?', a: 'Betriebskosten in {stadt}: WP ca. {wpKosten}€/Jahr, Gas ca. {altKosten}€/Jahr. WP spart ca. {ersparnis}€/Jahr. Dazu: CO₂-Aufschlag auf Gas steigt jährlich (ETS2 2030: ~€100/t). Langfristig: WP deutlich günstiger.' },
    { q: 'Ist eine Gasheizung in {bundesland} noch erlaubt?', a: 'Reine Gasheizung ist seit 2024 nicht mehr GEG-konform (keine 65% EE). Gas-Hybridheizung nur mit 65% EE-Anteil. Wärmepumpe ist die einzige Option ohne Einschränkungen — und mit bis zu 70% KfW-Förderung.' },
    { q: 'Was passiert mit dem CO₂-Preis auf Gas in {bundesland}?', a: 'ETS2-Prognose: 2026 €55/t (ca. 1,2 ct/kWh Mehrkosten), 2030 €100–150/t (ca. 2,5 ct/kWh). Eine Gasheizung in {stadt} wird also bis 2030 ca. 20–25% teurer im Betrieb — die WP hat kein CO₂-Preisrisiko.' },
    { q: 'Wie lange amortisiert sich eine WP gegenüber Gas in {stadt}?', a: 'Mehrkosten WP über Gas: ca. €5.000–8.000 nach Förderung. Jährliche Einsparung: ca. {ersparnis}€. Amortisation: ca. 7–12 Jahre. Mit steigendem CO₂-Preis auf Gas: kürzer werdend.' },
    { q: 'Gas-Hybridheizung als Übergang in {stadt} — sinnvoll?', a: 'Nur kurzfristig sinnvoll: Falls WP kurzfristig nicht möglich. Nachteil: weiterhin CO₂-Preisrisiko, nur 30% KfW-Förderung, höhere Betriebskosten, zweifache Wartungskosten. Langfristig: reine WP überlegen.' },
    { q: 'Funktioniert eine WP bei Kälte in {stadt} besser als Gas?', a: 'Moderne WP arbeiten zuverlässig bis -25°C Außentemperatur. Bei {normAussentemp}°C Normaußentemperatur in {stadt} ist das kein Problem. Backup-Heizstab schaltet automatisch bei Extremkälte zu.' }
  ],
    sitemapPriority: 0.7,
    crossLinks: ['waermepumpe-kosten', 'waermepumpe', 'heizung-tauschen', 'waermepumpe-stromverbrauch', 'waermepumpe-foerderung', 'kommunale-waermeplanung', 'waermepumpe-altbau'],
  },
  {
    id: 22, tier: 4,
    keyword: 'Wärmepumpe Stromverbrauch [Stadt]',
    slug: 'waermepumpe-stromverbrauch',
    baseVolume: 15000,
    competition: 'mittel',
    intent: 'informational',
    template: 'StromverbrauchTemplate',
    titleTemplate: 'WP Stromverbrauch {stadt} {year}',
    metaTemplate: 'Wärmepumpe Stromverbrauch {stadt} {year}: Berechnung mit lokalem Strompreis {strompreis} ct/kWh, JAZ {jaz} ✓ Optimierungstipps ✓ WP-Sondertarif & PV-Kombination.',
    h1Template: 'Wärmepumpe Stromverbrauch {stadt} {year} — Berechnung & Optimierung',
    featuredSnippetQuestions: [
      'Wie viel Strom verbraucht eine Wärmepumpe in {stadt}?',
      'Was kostet der Betrieb einer Wärmepumpe in {stadt} pro Monat?',
    ],
    faqPool: [
        { q: 'Wie viel Strom verbraucht eine WP in {stadt}?', a: 'Für ein 120 m² EFH (Baujahr 1980) in {stadt}: Jahresheizwärmebedarf ca. 18.000 kWh. Bei JAZ {jaz}: Stromverbrauch ca. {wpKosten}€ ÷ {strompreis} ct = ca. {stromkwh} kWh/Jahr.' },
    { q: 'Was kostet der WP-Strom in {stadt} pro Jahr?', a: 'Bei {strompreis} ct/kWh und JAZ {jaz}: ca. {wpKosten}€/Jahr für 120 m² EFH (Baujahr 1980). Mit WP-Sondertarif (~12% Rabatt): ca. {wpKostenGuenstig}€/Jahr. PV-Kombination: bis zu 40% weniger Netzstrom.' },
    { q: 'Gibt es einen günstigeren Stromtarif für WP in {stadt}?', a: 'Ja — die meisten Netzbetreiber in {bundesland} bieten WP-Sondertarife mit 10–15% Rabatt. Voraussetzung: Zweiter Zähler (€300–600 einmalig), Nachtabsenkung möglich. Beim lokalen Versorger anfragen.' },
    { q: 'Wie vergleiche ich WP-Stromverbrauch mit Gasheizung in {stadt}?', a: 'Gasheizung {stadt}: ca. {altKosten}€/Jahr (bei aktuellem Gaspreis + CO₂-Aufschlag). WP: ca. {wpKosten}€/Jahr. Ersparnis: ca. {ersparnis}€/Jahr — plus jährlich wachsend durch CO₂-Preissteigerung.' },
    { q: 'Lohnt sich PV + WP in {stadt}?', a: 'Ja — optimale Kombination. 8 kWp PV erzeugen in {stadt} ca. 6.500–8.000 kWh/Jahr. 40–60% davon direkt für WP nutzbar (4 ct/kWh statt {strompreis} ct). Ersparnis: €400–700/Jahr zusätzlich.' },
    { q: 'Wie optimiere ich den WP-Stromverbrauch in {stadt}?', a: 'Smart-Grid-Eingang nutzen (günstige Stromzeiten), Pufferspeicher tagsüber vorladen (günstiger Tarif), WP-Sondertarif beantragen, Vorlauftemperatur optimieren (hydraulischer Abgleich). In {bundesland} typisch 10–20% Einsparpotenzial.' }
  ],
    sitemapPriority: 0.7,
    crossLinks: ['waermepumpe-kosten', 'waermepumpe-oder-gas', 'waermepumpe', 'waermepumpe-installateur', 'luft-wasser-waermepumpe', 'waermepumpe-foerderung', 'erdwaermepumpe'],
  },
]

// ══ HILFSFUNKTIONEN ══════════════════════════════════════════════

export function getKeywordBySlug(slug: string): Keyword | undefined {
  return KEYWORDS.find(k => k.slug === slug)
}

export function getKeywordsByTier(tier: KeywordTier): Keyword[] {
  return KEYWORDS.filter(k => k.tier === tier)
}

/**
 * Template-Variablen befüllen
 * Stadtspezifische Werte werden aus City-Objekt übernommen
 */
export function fillTemplate(
  template: string,
  city: { name: string; slug: string; bundesland: string; plz: string; avgTemp: number; strompreis: number; gaspreis: number; heizgradtage: number; bundeslandFoerderung: string | null },
  jaz: number,
  wpKosten?: number,
  ersparnis?: number,
): string {
  const stromVerbrauch = Math.round((city.heizgradtage * 0.8) / jaz)
  return template
    .replace(/\{stadt\}/gi, city.name)
    .replace(/\{stadtSlug\}/gi, city.slug)
    .replace(/\{bundesland\}/gi, city.bundesland)
    .replace(/\{year\}/gi, '2026')
    .replace(/\{plz\}/gi, city.plz)
    .replace(/\{avgTemp\}/gi, city.avgTemp.toString())
    .replace(/\{jaz\}/gi, jaz.toString())
    .replace(/\{strompreis\}/gi, city.strompreis.toString())
    .replace(/\{gaspreis\}/gi, city.gaspreis.toString())
    .replace(/\{heizgradtage\}/gi, city.heizgradtage.toString())
    .replace(/\{preisVon\}/gi, '€18.000')
    .replace(/\{bundeslandFoerderung\}/gi, city.bundeslandFoerderung ?? 'kein aktives Landesprogramm')
    .replace(/\{wpKosten\}/gi, wpKosten ? `€ ${wpKosten.toLocaleString('de-DE')}` : '—')
    .replace(/\{ersparnis\}/gi, ersparnis ? `€ ${ersparnis.toLocaleString('de-DE')}` : '—')
    .replace(/\{stromVerbrauch\}/gi, stromVerbrauch.toLocaleString('de-DE'))
    .replace(/\{normT\}/gi, '')
}

/** Alle Keyword-Slugs für generateStaticParams */
export function getAllKeywordSlugs(): string[] {
  return KEYWORDS.map(k => k.slug)
}
