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
    crossLinks: ['waermepumpe-kosten', 'waermepumpe-foerderung', 'waermepumpe-installateur', 'luft-wasser-waermepumpe'],
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
    crossLinks: ['waermepumpe', 'waermepumpe-foerderung', 'waermepumpe-installateur', 'waermepumpe-preise'],
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
      { q: 'Wie finde ich einen guten Installateur in {stadt}?', a: 'Achten Sie auf: Handwerkskammer-Eintragung, Meisterbetrieb, mindestens 5 WP-Installationen nachweisbar, gültige Haftpflichtversicherung. Alle Betriebe in unserem Netzwerk erfüllen diese Kriterien.' },
      { q: 'Was kostet die Installation einer Wärmepumpe in {stadt}?', a: 'Der Installationsanteil beträgt in {stadt} typisch €3.000–€6.000 für eine Luft-Wasser-WP. Hinzu kommen Gerät, Hydraulik und Elektrik. Ein vollständiges Angebot sollte alle Positionen ausweisen.' },
      { q: 'Wie lange ist die Wartezeit bei Installateuren in {stadt}?', a: 'Die Wartezeit variiert je nach Saison. Erfahrungsgemäß sollten Sie in {stadt} 4–10 Wochen einplanen. Wir empfehlen, den KfW-Antrag frühzeitig und vor Baubeginn zu stellen.' },
      { q: 'Darf ich den Installateur selbst wählen?', a: 'Ja, bei unserem Service erhalten Sie bis zu 3 Angebote lokaler Betriebe aus {stadt} und wählen selbst. Kein Vertrag mit uns, nur mit dem Installateur Ihrer Wahl.' },
      { q: 'Haben die Installateure in {stadt} KfW-Erfahrung?', a: 'Alle unsere Partnerbetriebe in {stadt} haben bereits KfW-Förderanträge begleitet und kennen den Prozess. Sie werden beim Antrag aktiv unterstützt.' },
    ],
    sitemapPriority: 0.85,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-installation', 'waermepumpe-fachbetrieb'],
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
      { q: 'Wie viel Förderung bekomme ich in {stadt}?', a: 'Die Bundesförderung beträgt 30% Grundförderung + bis zu 40% Boni = max. 70% = €21.000. In {bundesland} gibt es zusätzlich {bundeslandFoerderung}.' },
      { q: 'Wann muss der Förderantrag gestellt werden?', a: 'Zwingend vor Beginn der Bauarbeiten. Ein nachträglicher Antrag ist nicht möglich. Wir begleiten Sie durch den Prozess.' },
      { q: 'Welche Boni erhöhen die Förderung in {stadt}?', a: 'Klima-Speed-Bonus +20% (bei Ersatz einer Gasheizung), Einkommens-Bonus +30% (Haushalt unter €40.000 netto), R290-Bonus +5% (natürliches Kältemittel).' },
      { q: 'Kann ich KfW und {bundesland}-Förderung kombinieren?', a: 'Teilweise. Die L-Bank in Baden-Württemberg ist beispielsweise kombinierbar. In Bayern ist das 10.000-Häuser-Programm eingestellt. Wir prüfen Ihre individuelle Situation.' },
      { q: 'Wie lange dauert die KfW-Auszahlung?', a: 'Nach Antragstellung und Installationsabschluss dauert die Auszahlung typisch 4–8 Wochen. Der Zuschuss wird direkt auf Ihr Konto überwiesen.' },
    ],
    sitemapPriority: 0.9,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-installateur', 'waermepumpe-beratung'],
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
      { q: 'Welche Jahresarbeitszahl erreiche ich in {stadt}?', a: 'In {stadt} mit {avgTemp}°C Jahresmitteltemperatur erreicht eine moderne Luft-Wasser-WP eine JAZ von ca. {jaz}. Das bedeutet: aus 1 kWh Strom werden {jaz} kWh Wärme erzeugt.' },
      { q: 'Brauche ich Fußbodenheizung für eine Luft-WP in {stadt}?', a: 'Nein. Moderne Geräte wie die Viessmann Vitocal 250-A (Stiftung Warentest: 2,0) erreichen 70°C Vorlauf und funktionieren mit normalen Heizkörpern.' },
      { q: 'Wie laut ist eine Luft-Wasser-WP in {stadt}?', a: 'Ca. 45–55 dB auf 1 Meter Abstand. Mit korrekter Aufstellung (Abstand Grundstücksgrenze, Antivibrationsmatten) ist die Nachbarschaft i.d.R. kein Thema.' },
    ],
    sitemapPriority: 0.85,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'erdwaermepumpe', 'luftwaermepumpe'],
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
      { q: 'Welche WP kaufen für ein Haus in {stadt}?', a: 'Für die meisten EFH in {stadt} ist eine Luft-Wasser-WP (92% Marktanteil) ideal. Bei JAZ {jaz} (klimabedingt für {stadt}) rechnet sich die Investition besonders gut.' },
      { q: 'Welche Hersteller sind in {stadt} empfehlenswert?', a: 'Bewährte Hersteller: Viessmann (Testsieger Stiftung Warentest 2025), Vaillant, Bosch/Buderus, Stiebel Eltron, Nibe. Entscheidend ist die fachgerechte Dimensionierung — kein zu großes Gerät kaufen.' },
    ],
    sitemapPriority: 0.8,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-installateur', 'luft-wasser-waermepumpe'],
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
    ],
    sitemapPriority: 0.8,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-nachruesten', 'luft-wasser-waermepumpe'],
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
      { q: 'Was kostet die Nachrüstung in {stadt}?', a: 'Die Umrüstung auf eine Luft-Wasser-WP kostet in {stadt} brutto €18.000–€28.000. Mit KfW-Förderung (typisch 50–55%) reduziert sich der Eigenanteil auf €9.000–€14.000.' },
    ],
    sitemapPriority: 0.78,
    crossLinks: ['waermepumpe', 'waermepumpe-altbau', 'heizung-tauschen', 'waermepumpe-foerderung'],
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
      { q: 'Muss ich meine Heizung in {stadt} tauschen?', a: 'Ab dem 30.06.2026 gilt in Kommunen über 100.000 Einwohnern die 65%-EE-Pflicht. {stadtGEGInfo}. Informieren Sie sich frühzeitig über Ihre Optionen.' },
      { q: 'Was ist die günstigste Alternative zur Gasheizung in {stadt}?', a: 'Die Wärmepumpe hat nach KfW-Förderung oft den geringsten Eigenanteil. Gas-Brennwert erfüllt das GEG nicht mehr ohne EE-Anteil. Pellet-Heizungen sind förderfähig, aber wartungsintensiver.' },
    ],
    sitemapPriority: 0.8,
    crossLinks: ['waermepumpe', 'waermepumpe-kosten', 'waermepumpe-altbau', 'waermepumpe-oder-gas'],
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
      { q: 'Brauche ich eine Baugenehmigung in {stadt}?', a: 'Luft-Wasser-WP sind in {bundesland} i.d.R. genehmigungsfrei. Es kann eine Immissionsschutz-Anzeige notwendig sein. Ihr Installateur kennt die lokalen Vorschriften in {stadt}.' },
      { q: 'Wie lange dauert die Installation in {stadt}?', a: 'Die eigentliche Montage dauert 1–3 Tage. Inklusive Planung, KfW-Antrag (vor Baubeginn!) und Lieferzeit sollten Sie 6–12 Wochen von der Anfrage bis zur Inbetriebnahme einplanen.' },
    ],
    sitemapPriority: 0.75,
    crossLinks: ['waermepumpe-installateur', 'waermepumpe-kosten', 'waermepumpe-montage', 'waermepumpe'],
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
      { q: 'Was ist die kommunale Wärmeplanung in {stadt}?', a: 'Alle Kommunen über 10.000 Einwohner müssen bis 2028 einen Wärmeplan vorlegen, der zeigt, wie die Wärmeversorgung bis 2045 klimaneutral wird. {stadtWaermeplanStatus}' },
    ],
    sitemapPriority: 0.72,
    crossLinks: ['waermepumpe', 'heizung-tauschen', 'waermepumpe-foerderung', 'waermepumpe-kosten', 'waermepumpe-installateur'],
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
          crossLinks: ['luft-wasser-waermepumpe', 'waermepumpe-kosten', 'waermepumpe', 'waermepumpe-installateur'],
      faqPool: [
      { q: 'Eignet sich {stadt} für Erdwärme?', a: 'In {bundesland} sind die geologischen Bedingungen überwiegend gut für Erdwärmesonden geeignet. Eine Genehmigung beim zuständigen Bergamt ist erforderlich. Ihr lokaler Fachbetrieb beantragt diese für Sie.' },
    ],
    sitemapPriority: 0.75,
    crossLinks: ['luft-wasser-waermepumpe', 'waermepumpe-kosten', 'waermepumpe', 'luftwaermepumpe'],
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
          crossLinks: ['waermepumpe-installateur', 'waermepumpe-kosten', 'waermepumpe', 'waermepumpe-foerderung'],
      faqPool: [
      { q: 'Wie viele Angebote sollte ich in {stadt} einholen?', a: 'Mindestens 3. Die Verbraucherzentrale empfiehlt ausdrücklich, mehrere Angebote zu vergleichen — Preisunterschiede von 30–50% sind keine Seltenheit.' },
    ],
    sitemapPriority: 0.72,
    crossLinks: ['waermepumpe-installateur', 'waermepumpe-kosten', 'waermepumpe'],
  },
  {
    id: 14, tier: 3,
    keyword: 'Wärmepumpe Preise [Stadt]',
    slug: 'waermepumpe-preise',
    baseVolume: 22000,
    competition: 'mittel_hoch',
    intent: 'commercial',
    template: 'PreiseTemplate',
    titleTemplate: 'Wärmepumpe Preise {stadt} {year}',
    metaTemplate: 'Wärmepumpe Preise {stadt} {year} ✓ Alle Typen im Vergleich ✓ Luft-Wasser ab {preisVon} ✓ Aktuelle Marktpreise ✓ KfW bis €21.000 ✓ Jetzt kostenlos anfragen.',
    h1Template: 'Wärmepumpe Preise {stadt} {year} — Aktuelle Kosten aller Typen',
    featuredSnippetQuestions: [
      'Was kostet eine Wärmepumpe in {stadt} im Jahr {year}?',
      'Wie haben sich die WP-Preise in {stadt} entwickelt?',
    ],
          crossLinks: ['waermepumpe-kosten', 'waermepumpe-installateur', 'waermepumpe', 'waermepumpe-foerderung'],
            crossLinks: ['waermepumpe-kosten', 'waermepumpe-installateur', 'waermepumpe', 'waermepumpe-foerderung'],
      faqPool: [
      { q: 'Was kostet eine Wärmepumpe aktuell in {stadt}?', a: 'Luft-Wasser-WP: €18.000–€28.000 komplett. Sole-Wasser: €22.000–€35.000. Wasser-Wasser: €25.000–€40.000. Die Preise sind 2025/26 nach dem Boom stabil geblieben.' },
    ],
    sitemapPriority: 0.75,
    crossLinks: ['waermepumpe-kosten', 'waermepumpe', 'waermepumpe-foerderung'],
  },
  {
    id: 15, tier: 3,
    keyword: 'Wärmepumpe Anbieter [Stadt]',
    slug: 'waermepumpe-anbieter',
    baseVolume: 5000,
    competition: 'mittel',
    intent: 'transactional',
    template: 'AnbieterTemplate',
    titleTemplate: 'Wärmepumpe Anbieter {stadt} {year}',
    metaTemplate: 'Geprüfte Wärmepumpen-Anbieter {stadt} ✓ Lokale Meisterbetriebe ✓ Herstellerunabhängig ✓ Kostenlos bis zu 3 vollständige Angebote vergleichen {year}.',
    h1Template: 'Wärmepumpe Anbieter {stadt} {year} — Geprüfte lokale Fachbetriebe',
    featuredSnippetQuestions: [
      'Welche Wärmepumpen-Anbieter gibt es in {stadt}?',
    ],
          crossLinks: ['waermepumpe-installateur', 'waermepumpe-kosten', 'waermepumpe', 'waermepumpe-fachbetrieb'],
      faqPool: [
      { q: 'Lokaler Betrieb oder bundesweiter Anbieter (Thermondo/Enpal) in {stadt}?', a: 'Lokale Betriebe kennen die örtlichen Gegebenheiten in {stadt} besser, sind bei Störungen schneller vor Ort und bieten oft flexiblere Lösungen. Bundesweite Anbieter können günstiger sein, arbeiten aber mit Subunternehmern.' },
    ],
    sitemapPriority: 0.7,
    crossLinks: ['waermepumpe-installateur', 'waermepumpe', 'waermepumpe-fachbetrieb'],
  },
  {
    id: 16, tier: 3,
    keyword: 'Luftwärmepumpe [Stadt]',
    slug: 'luftwaermepumpe',
    baseVolume: 33000,
    competition: 'mittel',
    intent: 'info_commercial',
    template: 'LuftwaermepumpeTemplate',
    titleTemplate: 'Luftwärmepumpe {stadt} {year}',
    metaTemplate: 'Luftwärmepumpe {stadt} {year}: Luft-Luft vs. Luft-Wasser ✓ JAZ {jaz} bei {avgTemp}°C ✓ Kosten & KfW-Förderung bis 70% ✓ Kostenloser Installateur-Vergleich.',
    h1Template: 'Luftwärmepumpe {stadt} {year} — Kosten, Effizienz & Installateure',
    featuredSnippetQuestions: [
      'Was ist der Unterschied zwischen Luft-Wasser und Luft-Luft in {stadt}?',
    ],
faqPool: [
      { q: 'Luft-Wasser oder Luft-Luft in {stadt}?', a: 'Luft-Wasser-WP (Heizung + Warmwasser) ist in {stadt} der Standardfall für EFH. Luft-Luft ist günstiger, hat aber keinen Warmwasserkreislauf und ist in Deutschland weniger verbreitet.' },
    ],
    sitemapPriority: 0.75,
    crossLinks: ['luft-wasser-waermepumpe', 'waermepumpe-kosten', 'waermepumpe', 'waermepumpe-installateur'],
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
      { q: 'Ist eine WP im Neubau in {stadt} Pflicht?', a: 'Seit 1.1.2024 muss jede neue Heizung 65% EE nutzen. Eine Wärmepumpe erfüllt das automatisch und ist damit die häufigste Wahl bei Neubauten in {stadt}.' },
    ],
    sitemapPriority: 0.7,
    crossLinks: ['waermepumpe', 'luft-wasser-waermepumpe', 'waermepumpe-kosten', 'waermepumpe-installateur'],
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
    faqPool: [{ q: 'Was ist der iSFP und bringt er Vorteile in {stadt}?', a: 'Der individuelle Sanierungsfahrplan (iSFP) kostet ca. €500–1.000, wird aber mit 80% gefördert. Mit iSFP erhöht sich der KfW-BEG-Zuschuss um 5 Prozentpunkte.' }],
    sitemapPriority: 0.65,
    crossLinks: ['waermepumpe', 'waermepumpe-foerderung', 'waermepumpe-installateur', 'waermepumpe-kosten'],
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
    faqPool: [{ q: 'Was unterscheidet einen WP-Fachbetrieb von einem normalen SHK-Betrieb?', a: 'Spezialisierte WP-Fachbetriebe haben mehr als 5 WP-Installationen durchgeführt, kennen die Förderprozesse und sind oft BWP-Mitglied. Das sichert Qualität und Förderkonformität.' }],
    sitemapPriority: 0.65,
    crossLinks: ['waermepumpe-installateur', 'waermepumpe-anbieter', 'waermepumpe', 'waermepumpe-kosten'],
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
    faqPool: [{ q: 'Welche Abstände muss ich beim Aufstellen in {stadt} einhalten?', a: 'In {bundesland} gelten in der Regel 3 Meter Abstand zur Grundstücksgrenze. Je nach Lärmpegel kann eine Ausnahmegenehmigung erforderlich sein. Ihr Installateur beantragt das für Sie.' }],
    sitemapPriority: 0.65,
    crossLinks: ['waermepumpe-installation', 'waermepumpe-installateur', 'waermepumpe', 'waermepumpe-kosten'],
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
      { q: 'Ist Wärmepumpe wirklich günstiger als Gas in {stadt}?', a: 'Aktuell ja, wenn man den steigenden CO₂-Preis einrechnet: 2026 kostet Gas ca. {gaspreis} ct/kWh. Bis 2030 wird Erdgas durch den EU-ETS2 deutlich teurer. Die WP wird mit steigendem EE-Anteil im Stromnetz effizienter.' },
    ],
    sitemapPriority: 0.7,
    crossLinks: ['waermepumpe-kosten', 'waermepumpe', 'heizung-tauschen', 'waermepumpe-stromverbrauch'],
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
      { q: 'Wie viel Strom verbraucht meine WP in {stadt}?', a: 'Ein 120 m² EFH in {stadt} verbraucht mit einer Luft-WP (JAZ {jaz}) bei {heizgradtage} Heizgradtagen ca. {stromVerbrauch} kWh/Jahr. Bei {strompreis} ct/kWh entspricht das ca. {wpKosten} Jahreskosten.' },
      { q: 'Lohnt sich PV für die Wärmepumpe in {stadt}?', a: 'Sehr. Mit einer PV-Anlage sinken die Betriebskosten der WP um 30–40%. Die optimale Kombination für {stadt}: 8–12 kWp PV + Wärmepumpe + optional Batteriespeicher.' },
    ],
    sitemapPriority: 0.7,
    crossLinks: ['waermepumpe-kosten', 'waermepumpe-oder-gas', 'waermepumpe'],
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
