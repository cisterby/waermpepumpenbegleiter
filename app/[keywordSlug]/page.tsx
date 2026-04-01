// app/[keywordSlug]/page.tsx
// 22 Pillar Pages — Keyword-Übersichtsseiten mit Top-50-Städten
// Zweck: Internes Linking-Hub, Keyword-Autorität, GSC-Coverage

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, MapPin, TrendingUp, CheckCircle } from 'lucide-react';
import { KEYWORDS, getKeywordBySlug } from '@/lib/keywords';
import citiesData from '@/lib/cities.json';
import type { City } from '@/lib/city-utils';

interface Props {
  params: { keywordSlug: string };
}

export async function generateStaticParams() {
  return KEYWORDS.map(kw => ({ keywordSlug: kw.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const keyword = getKeywordBySlug(params.keywordSlug);
  if (!keyword) return {};

  const title = `${keyword.keyword.replace('[Stadt]', '').trim()} 2026 — Alle Städte im Überblick | Wärmepumpenbegleiter`;
  const desc  = `${keyword.keyword.replace('[Stadt]', '').trim()} in Ihrer Stadt — ${(citiesData as City[]).length} Städte, aktuelle Preise 2026, bis zu 70% KfW-Förderung. Geprüfte Fachbetriebe kostenlos vergleichen.`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: desc,
    url: `https://waermepumpenbegleiter.de/${keyword.slug}`,
    about: {
      '@type': 'Service',
      name: keyword.keyword.replace('[Stadt]', '').trim(),
      areaServed: { '@type': 'Country', name: 'Deutschland' },
    },
  };

  return {
    title,
    description: desc,
    alternates: { canonical: `https://waermepumpenbegleiter.de/${keyword.slug}` },
    openGraph: { title, description: desc, type: 'website', locale: 'de_DE' },
    robots: { index: true, follow: true },
  };
}

// Keyword-spezifische Inhalte für jede Pillar Page
const PILLAR_CONTENT: Record<string, {
  headline: string;
  intro: string;
  sections: Array<{ title: string; text: string }>;
  stats: Array<{ val: string; label: string }>;
}> = {
  'waermepumpe': {
    headline: 'Wärmepumpe in Deutschland 2026 — Alle Städte',
    intro: 'Eine Wärmepumpe ist 2026 die klügste Heizungsentscheidung: bis zu 70% KfW-Förderung, GEG-konform, 3× effizienter als eine Gasheizung. Wir vermitteln kostenlos an geprüfte Fachbetriebe in 733 deutschen Städten.',
    stats: [{ val: '733', label: 'Städte' }, { val: '70%', label: 'Max. KfW' }, { val: '€21.000', label: 'Max. Zuschuss' }, { val: 'Kostenlos', label: 'Unser Service' }],
    sections: [
      { title: 'Warum 2026 der richtige Zeitpunkt ist', text: 'Das GEG 2024 macht erneuerbare Energie bei Heizungsersatz verpflichtend. Die KfW-Förderung ist so attraktiv wie nie — bis 70% Zuschuss für Eigennutzer. Gleichzeitig sind die Anlagenpreise nach dem Boom 2022/23 wieder gesunken. Wer jetzt handelt, kombiniert maximale Förderung mit stabilen Preisen.' },
      { title: 'KfW-Förderung 2026 auf einen Blick', text: '30% Grundförderung + 20% Klima-Speed-Bonus (Ersatz fossiler Heizung) + bis 30% Einkommensbonus + 5% Kältemittelbonus = max. 70% auf bis zu €30.000 förderfähige Kosten = max. €21.000 nicht rückzahlbarer Zuschuss. Der Antrag muss vor Baubeginn gestellt werden.' },
      { title: 'Welche Wärmepumpe passt zu Ihrem Haus?', text: 'Für 92% der Häuser ist die Luft-Wasser-Wärmepumpe die richtige Wahl: keine Bohrung nötig, JAZ 3,2–4,0, GEG-konform, KfW-förderungsfähig. Für Häuser mit Erdreich: Sole-Wasser-WP (JAZ 4,3+, +5% KfW-Bonus). Für Grundwasserzugang: Wasser-Wasser-WP (JAZ 5,0+, höchste Effizienz).' },
    ],
  },
  'waermepumpe-kosten': {
    headline: 'Wärmepumpe Kosten 2026 — Alle Städte im Vergleich',
    intro: 'Die Kosten einer Wärmepumpe variieren je nach Stadt, Gebäude und Typ. Wir zeigen die vollständigen Kosten — Gerät, Installation, Nebenkosten — und was nach KfW-Förderung übrig bleibt. Für jede der 733 deutschen Städte individuell berechnet.',
    stats: [{ val: '€18–28k', label: 'Luft-WP gesamt' }, { val: '50–70%', label: 'KfW-Förderung' }, { val: '7–12 J.', label: 'Amortisation' }, { val: '20–25 J.', label: 'Lebensdauer' }],
    sections: [
      { title: 'Was kostet eine Wärmepumpe komplett?', text: 'Luft-Wasser-WP: €18.000–28.000 brutto (Gerät €10.000–18.000 + Montage €3.000–5.000 + Hydraulik €1.200 + Elektrik €1.000). Sole-Wasser mit Bohrung: €22.000–35.000. Wasser-Wasser: €25.000–40.000. Nach 50% KfW-Förderung: ab €9.000 Eigenanteil für eine Luft-WP.' },
      { title: 'Versteckte Kosten — was Angebote oft weglassen', text: 'Hydraulischer Abgleich (€500–1.500, KfW-Pflicht!), Fundament/Aufstellung (€300–800), Zähler-Upgrade für WP-Tarif (€500–1.500), optional Pufferspeicher (€800–2.000). Seriöse Angebote weisen alle Positionen einzeln aus. Wir stellen sicher, dass alle 3 Vergleichsangebote vollständig sind.' },
      { title: 'Stadtspezifische Betriebskosten', text: 'Die laufenden Kosten hängen vom lokalen Strompreis ab (26–32 ct/kWh je nach Region) und von der erreichbaren JAZ Ihrer Stadt. In wärmeren Städten (JAZ 3,8+) liegen die Jahreskosten unter €1.200, in kälteren Regionen höher. Wählen Sie Ihre Stadt für die genaue Berechnung.' },
    ],
  },
  'waermepumpe-foerderung': {
    headline: 'Wärmepumpe Förderung 2026 — Alle Bundesländer & Städte',
    intro: 'Bis zu 70% KfW-Zuschuss für Wärmepumpen — nicht rückzahlbar, direkt ausgezahlt. Dazu kommen in vielen Bundesländern eigene Förderprogramme. Alle Förderungen 2026 für 733 Städte erklärt.',
    stats: [{ val: '70%', label: 'Max. KfW-Satz' }, { val: '€21.000', label: 'Max. Zuschuss' }, { val: '16', label: 'Bundesländer' }, { val: 'Vor Baubeginn', label: 'Antrag stellen' }],
    sections: [
      { title: 'KfW BEG Programm 458 — die Hauptförderung', text: '30% Grundförderung für alle + 20% Klima-Speed-Bonus (Eigennutzer, Ersatz fossiler Heizung) + 30% Einkommensbonus (unter €40.000 Haushaltseinkommen) + 5% Kältemittelbonus (R290 oder Erdwärme/Grundwasser). Maximale Förderung: 70% auf bis zu €30.000 = €21.000 Zuschuss.' },
      { title: 'Bundesland-Förderungen zusätzlich zur KfW', text: 'Hamburg (IFB: €90/kW), NRW (progres.nrw: €50/m Bohrung), Baden-Württemberg (L-Bank Kombi-Darlehen), Niedersachsen (NBank: bis €7.250), Hessen (Klimaschutzprogramm). Bayern: 10.000-Häuser-Programm eingestellt. Berlin: aktuell ausgesetzt. Wählen Sie Ihre Stadt für die aktuellen Landesförderungen.' },
      { title: 'Antragsprozess — Schritt für Schritt', text: '1. Fachbetrieb mit KfW-LuL-Registrierung beauftragen. 2. KfW-Antrag im Online-Portal stellen (ZWINGEND VOR Baubeginn). 3. Genehmigung abwarten. 4. Installation durchführen. 5. Verwendungsnachweis einreichen. 6. Auszahlung (4–8 Wochen). Wir begleiten Sie durch jeden Schritt.' },
    ],
  },
  'waermepumpe-installateur': {
    headline: 'Wärmepumpe Installateur — Geprüfte Betriebe in 733 Städten',
    intro: 'Nicht jeder SHK-Betrieb ist ein WP-Fachbetrieb. Für die KfW-Förderung brauchen Sie einen registrierten Lieferanten- und Leistungserbringer. Alle unsere Partnerbetriebe sind HWK-geprüft und KfW-registriert.',
    stats: [{ val: '3', label: 'Angebote kostenlos' }, { val: '48h', label: 'Reaktionszeit' }, { val: 'HWK', label: 'Alle geprüft' }, { val: '733', label: 'Städte abgedeckt' }],
    sections: [
      { title: 'Was einen WP-Fachbetrieb ausmacht', text: 'HWK-eingetragener Meisterbetrieb, mindestens 5 dokumentierte WP-Installationen, KfW-Lieferanten- und Leistungserbringer (LuL) Registrierung, gültige Haftpflichtversicherung, vollständige Angebote mit allen Positionen. Alle unsere Partnerbetriebe erfüllen diese Kriterien — vorab von uns geprüft.' },
      { title: 'Lokal vs. bundesweit — was ist besser?', text: 'Lokale Betriebe kennen den Netzbetreiber, die lokalen Auflagen und sind bei Störungen schnell vor Ort. Bundesweite Anbieter setzen oft auf Subunternehmer. Wir vermitteln ausschließlich an lokale, ansässige Meisterbetriebe — in 733 deutschen Städten.' },
      { title: 'Warum mindestens 3 Angebote?', text: 'Die Verbraucherzentrale empfiehlt mindestens 3 Vergleichsangebote. Preisunterschiede von 20–40% bei gleicher Leistung sind keine Seltenheit. Entscheidend: Alle Angebote müssen vollständig und vergleichbar sein — inklusive hydraulischem Abgleich und KfW-Antragsbegleitung.' },
    ],
  },
  'luft-wasser-waermepumpe': {
    headline: 'Luft-Wasser-Wärmepumpe — 733 Städte, Effizienz, Kosten 2026',
    intro: 'Die Luft-Wasser-Wärmepumpe ist mit 92% Marktanteil die meistgekaufte Wärmepumpenart in Deutschland. Sie braucht keine Erdbohrung, ist in fast jedem Haus nachrüstbar und erreicht eine JAZ von 3,2–4,2 je nach Standort.',
    stats: [{ val: '92%', label: 'Marktanteil' }, { val: '3,2–4,2', label: 'JAZ je Standort' }, { val: '70°C', label: 'Max. Vorlauf' }, { val: '1–3 Tage', label: 'Installation' }],
    sections: [
      { title: 'Wie funktioniert eine Luft-Wasser-WP?', text: 'Die Luft-Wasser-WP entzieht der Außenluft Wärme und überträgt sie auf das Heizwasser. Der Kälteprozess (Verdampfer → Kompressor → Verflüssiger → Expansionsventil) erzeugt dabei 3–4 kWh Wärme aus 1 kWh Strom. Auch bei -20°C Außentemperatur arbeitet eine moderne Hochtemperatur-WP zuverlässig.' },
      { title: 'Für welche Häuser ist die Luft-WP geeignet?', text: 'Fast alle Einfamilienhäuser in Deutschland sind geeignet. Wichtig: Vorlauftemperatur unter 70°C (Standard) oder unter 55°C (optimal). Ein hydraulischer Abgleich verbessert die Effizienz. Platzbedarf: ca. 1 m² für die Außeneinheit + Abstand zur Grundstücksgrenze (je nach Bundesland 2–3 m).' },
      { title: 'Luft-Wasser vs. Erdwärme — wann was?', text: 'Luft-WP: Keine Genehmigung, keine Bohrung, JAZ 3,2–4,2, 92% günstiger. Erdwärme: Höhere JAZ (4,3+), +5% KfW-Bonus, konstante Effizienz, aber Bohrung (€6.000–12.000) und Genehmigung nötig. Faustregel: Gut gedämmtes Haus mit Fußbodenheizung → Erdwärme prüfen. Sonst: Luft-WP.' },
    ],
  },
  'waermepumpe-kaufen': {
    headline: 'Wärmepumpe kaufen 2026 — Kaufberater für 733 Städte',
    intro: 'Welche Wärmepumpe kaufen? Luft-Wasser, Sole-Wasser oder Wasser-Wasser — wir erklären die Unterschiede, Kosten und worauf es beim Kauf ankommt. Für Ihre Stadt, Ihr Haus, Ihre Situation.',
    stats: [{ val: '3 Typen', label: 'WP-Arten im Vergleich' }, { val: '€18–40k', label: 'Kaufpreis-Spanne' }, { val: '70%', label: 'KfW-Kaufzuschuss' }, { val: '15–25 J.', label: 'Lebensdauer' }],
    sections: [
      { title: 'Welche Wärmepumpe soll ich kaufen?', text: 'Für 92% aller Häuser ist die Luft-Wasser-WP die richtige Wahl: keine Bohrung, schnelle Montage, JAZ 3,2–4,2. Erdwärme (Sole-WP) lohnt sich bei großem Grundstück und gut gedämmtem Haus: höhere JAZ (4,3+), +5% KfW-Bonus, aber €6.000–12.000 Mehrkosten für die Bohrung. Wasser-Wasser: höchste Effizienz, aber selten genehmigt.' },
      { title: 'Hersteller-Vergleich 2026', text: 'Stiftung Warentest 2024: Vaillant aroTHERM plus (2,0), Stiebel Eltron WPL (1,8), Viessmann Vitocal (2,1). Alle drei sind marktbewährt, KfW-förderfähig und in R290-Variante (+5% Bonus) erhältlich. Wichtiger als die Marke: korrekte Dimensionierung nach Heizlast, nicht nach Faustformel.' },
      { title: 'Was beim Kauf beachten?', text: 'Kaufen Sie nie ohne Heizlastberechnung nach DIN EN 12831. Eine überdimensionierte WP taktet zu häufig (Lebensdauer sinkt). Eine unterdimensionierte WP ist an kalten Tagen zu schwach. Bestehen Sie auf vollständiges Angebot: Gerät + Montage + Hydraulik + Elektrik + Hydraulischer Abgleich.' },
    ],
  },
  'waermepumpe-altbau': {
    headline: 'Wärmepumpe Altbau 2026 — Eignung für 733 Städte',
    intro: '70–80% aller Altbauten in Deutschland sind für eine Wärmepumpe geeignet. Das entscheidende Kriterium ist die Vorlauftemperatur — nicht das Baujahr. Wir zeigen, was Ihr Altbau braucht.',
    stats: [{ val: '70–80%', label: 'Altbauten geeignet' }, { val: '70°C', label: 'Max. Vorlauf HT-WP' }, { val: '€500–1.500', label: 'Hydraul. Abgleich' }, { val: '50–70%', label: 'KfW-Förderung' }],
    sections: [
      { title: 'Wann ist ein Altbau geeignet?', text: 'Entscheidend ist die Vorlauftemperatur des Heizkreises, gemessen bei -5°C Außentemperatur. Unter 55°C: Standard-WP. Bis 70°C: Hochtemperatur-WP (ca. €2.000 Aufpreis). Über 70°C: Hydraulischer Abgleich (€500–1.500) senkt die VL-Temp meist ausreichend ab. Das Baujahr ist kein Ausschlusskriterium — auch Häuser von 1900 sind nachrüstbar.' },
      { title: 'Hydraulischer Abgleich als Schlüssel', text: 'Der hydraulische Abgleich ist KfW-Pflicht und verbessert die JAZ um 0,2–0,5 — das spart dauerhaft Stromkosten. Er kostet €500–1.500 und ist vollständig KfW-förderfähig. Viele Betriebe lassen diese Position aus Angeboten heraus — wir stellen sicher, dass sie enthalten ist.' },
      { title: 'Richtige Dimensionierung im Altbau', text: 'Im Altbau ist die Heizlastberechnung nach DIN EN 12831 wichtiger als im Neubau: Wärmebrücken, unterschiedliche Dämmstärken und typische Altbau-Heizkörper machen die Auslegung anspruchsvoller. Ein erfahrener WP-Fachbetrieb kennt diese Fallstricke — unsere Partnerbetriebe haben nachweisbare Altbau-Referenzen.' },
    ],
  },
  'waermepumpe-nachruesten': {
    headline: 'Wärmepumpe nachrüsten 2026 — Bestandsgebäude in 733 Städten',
    intro: 'Wärmepumpe nachrüsten ohne teuren Komplettumbau — das ist bei 70–80% aller Bestandsgebäude möglich. GEG-Frist, KfW-Förderung und der richtige Ablauf für Ihr Haus.',
    stats: [{ val: '70–80%', label: 'Häuser geeignet' }, { val: '2–3 Tage', label: 'Montagezeit' }, { val: '70%', label: 'KfW-Förderung' }, { val: '5 Schritte', label: 'Klarer Ablauf' }],
    sections: [
      { title: 'Nachrüstung: Was ist nötig?', text: 'Die meisten Bestandsgebäude brauchen: 1. Hydraulischen Abgleich (KfW-Pflicht, €500–1.500). 2. Pufferspeicher 200–500 l (fast immer, €600–2.000). 3. Ggf. Starkstrom-Upgrade (€500–1.500). 4. Ggf. Heizkörpertausch (nur wenn VL > 70°C, €200–500/Stück). Das sind die Anpassungskosten — alle KfW-förderfähig.' },
      { title: 'GEG-Frist und Timing', text: 'Großstädte über 100.000 Einwohner: GEG-Pflicht ab 30. Juni 2026. Alle anderen: ab 30. Juni 2028. Wer früher nachrüstet, sichert sich volle Förderung, bessere Installateurverfügbarkeit und tiefere CO₂-Kosten-Unabhängigkeit. Der KfW-Antrag muss zwingend vor Beauftragung gestellt werden.' },
      { title: 'Ablauf der Nachrüstung', text: '1. Vor-Ort-Begehung (Heizlast, Vorlauftemperatur, Kellermaße). 2. KfW-Antrag stellen (vor Auftrag!). 3. Anpassungen vornehmen (Hydraulik, Elektro). 4. WP-Montage (2–3 Tage). 5. KfW-Abrechnung (Auszahlung in 4–8 Wochen). Wir begleiten alle 5 Schritte kostenlos.' },
    ],
  },
  'heizung-tauschen': {
    headline: 'Heizung tauschen 2026 — GEG, Kosten & Förderung',
    intro: 'Gasheizung tauschen — wann ist es Pflicht, was kostet es, welche Optionen gibt es? Das GEG 2024 macht erneuerbare Energie beim Heizungsersatz verpflichtend. Die Wärmepumpe ist die einzige Option ohne Einschränkungen.',
    stats: [{ val: '30.06.2026', label: 'Frist Großstädte' }, { val: '30.06.2028', label: 'Frist alle anderen' }, { val: '70%', label: 'Max. KfW-Förderung' }, { val: '65%', label: 'EE-Pflicht GEG' }],
    sections: [
      { title: 'Wann ist der Tausch Pflicht?', text: 'GEG §72: Konstanttemperatur-Heizkessel, die vor 1994 eingebaut wurden, müssen ausgetauscht werden. Zusätzlich: Die 65%-EE-Pflicht gilt bei Heizungsausfall oder freiwilligem Tausch sofort. Bei Eigentümerwechsel: 2 Jahre Übergangsfrist für den neuen Eigentümer. Die Wärmepumpe erfüllt die 65%-Pflicht immer und ohne Einschränkung.' },
      { title: 'Welche Heizung ist GEG-konform?', text: 'Wärmepumpe: ✅ Immer GEG-konform. Pellets: ✅ Mit Einschränkungen. Fernwärme: ✅ Je nach Netzanteil. Gas-Hybridheizung: ⚠️ Nur mit 65% EE-Anteil. Reine Gasheizung: ❌ Nicht mehr solo zulässig. Fazit: Die Wärmepumpe ist die einzige Option ohne "Wenn und Aber" — und die einzige mit bis zu 70% KfW-Förderung.' },
      { title: 'Was kostet der Heizungstausch?', text: 'Wärmepumpe: €18.000–28.000 brutto, nach 50–70% KfW ab €9.000 Eigenanteil. Gas-Hybridheizung: €8.000–15.000, nur 30% KfW. Pellets: €15.000–25.000, 45% KfW. Die Wärmepumpe ist nach Förderung oft günstiger als Pellets — und spart dauerhaft durch niedrige Betriebskosten.' },
    ],
  },
  'waermepumpe-installation': {
    headline: 'Wärmepumpe Installation 2026 — Ablauf & Anforderungen',
    intro: 'Was passiert bei der WP-Installation? Von der Planung über den KfW-Antrag bis zur Inbetriebnahme — wir erklären den vollständigen Prozess und was Ihr Haus baulich braucht.',
    stats: [{ val: '2–3 Tage', label: 'Montagedauer' }, { val: 'F-Gas', label: 'Zertifikat Pflicht' }, { val: 'Vor Baubeginn', label: 'KfW-Antrag' }, { val: '6–12 Wo.', label: 'Gesamtprozess' }],
    sections: [
      { title: 'Bauliche Voraussetzungen', text: 'Für die Installation brauchen Sie: Außenfläche mind. 0,5 m² für die Außeneinheit (+ Abstand zur Grundstücksgrenze), Kellerraum mind. 1 m² für Pufferspeicher (200–500 l), Starkstromanschluss 3×16A (ggf. Nachrüstung nötig), Kernbohrung durch Außenwand (60–80 mm). Vorlauftemperatur des Heizkreises bekannt.' },
      { title: 'Der 3-Tage-Montageplan', text: 'Tag 1: Außeneinheit aufstellen, Kernbohrung, Kältemittelleitungen verlegen, Hydraulik vorbereiten. Tag 2: Kältemittelkreis befüllen (F-Gas-Zertifikat Pflicht), Pufferspeicher anschließen, Elektroinstallation. Tag 3: Hydraulischer Abgleich (KfW-Pflicht), Heizungsprogrammierung, Inbetriebnahme, KfW-Dokumentation.' },
      { title: 'Genehmigungen je Bundesland', text: 'Luft-WP benötigt in den meisten Bundesländern keine Baugenehmigung, aber eine formlose Anzeige beim Bauamt. TA-Lärm: Max. 45 dB(A) tags / 35 dB(A) nachts an der Grundstücksgrenze. Erdwärme (Sole-WP): Wasserrechtliche Genehmigung nötig. Netzbetreiber-Anmeldung: Vorlauf ca. 4 Wochen einplanen.' },
    ],
  },
  'kommunale-waermeplanung': {
    headline: 'Kommunale Wärmeplanung 2026 — Was Eigentümer wissen müssen',
    intro: 'Die kommunale Wärmeplanung bestimmt, welche Gebiete Fernwärme bekommen — und wo die Wärmepumpe die klare Lösung ist. KfW-Förderung ist davon unabhängig. Jetzt handeln lohnt sich.',
    stats: [{ val: '30.06.2026', label: 'Pflicht Großstädte' }, { val: '70%', label: 'KfW unabhängig' }, { val: '733', label: 'Städte mit Planung' }, { val: 'Jetzt', label: 'Optimaler Zeitpunkt' }],
    sections: [
      { title: 'Was ist die kommunale Wärmeplanung?', text: 'Städte über 100.000 Einwohner mussten bis 30. Juni 2026 einen kommunalen Wärmeplan vorlegen, kleinere Gemeinden bis 2028. Der Plan zeigt: welche Gebiete Fernwärme oder Wasserstoff bekommen sollen — und wo individuelle Lösungen (= Wärmepumpe) die Zukunft sind. Für ca. 70–85% aller Gebäude gilt letzteres.' },
      { title: 'KfW-Förderung und Wärmeplanung', text: 'Wichtig: Die KfW-Förderung gilt unabhängig vom kommunalen Wärmeplan. Auch wenn Ihr Haus im "potenziellen Fernwärmegebiet" liegt, können Sie jetzt eine WP installieren und volle Förderung erhalten. Wer wartet, riskiert geänderte Förderkonditionen. Der Wärmeplan ist kein Installationsverbot.' },
      { title: 'Was tun als Eigentümer?', text: 'Prüfen Sie auf der Website Ihrer Gemeinde, ob ein Wärmeplan vorliegt und ob Ihr Haus im Fernwärmegebiet liegt. In den meisten Fällen ist das nicht der Fall. Dann gilt: WP ist die richtige Wahl — jetzt planen, KfW-Förderung sichern, GEG-konform heizen. Wir helfen kostenlos bei der Einschätzung.' },
    ],
  },
  'erdwaermepumpe': {
    headline: 'Erdwärmepumpe 2026 — Sole-WP für 733 Städte',
    intro: 'Die Erdwärmepumpe (Sole-Wasser-WP) erreicht JAZ 4,3–5,0 — deutlich effizienter als die Luft-WP. Dafür braucht sie eine Tiefenbohrung oder Flächenkollektor. Wann lohnt sich Erdwärme wirklich?',
    stats: [{ val: 'JAZ 4,3+', label: 'Jahresarbeitszahl' }, { val: '+5%', label: 'KfW-Bonus Erdwärme' }, { val: '€8–16k', label: 'Bohrungskosten' }, { val: 'Konstant', label: 'Effizienz ganzjährig' }],
    sections: [
      { title: 'Tiefenbohrung vs. Flächenkollektor', text: 'Tiefenbohrung: 80–200 m tief, ca. €80–100/m, wasserrechtliche Genehmigung nötig. Für die meisten Grundstücke geeignet. Flächenkollektor: mind. 10-fache Wohnfläche als Grundstück nötig, günstiger (€3.000–8.000), keine Genehmigung — aber in städtischen Lagen selten möglich.' },
      { title: 'Wann lohnt sich die Erdwärmepumpe?', text: 'Erdwärme lohnt sich, wenn: gut gedämmtes Haus (wenig Heizbedarf), Fußbodenheizung vorhanden (niedrige VL-Temp), ausreichend Grundstück für Bohrung, langfristige Planung (15+ Jahre). Der höhere JAZ von 4,3 vs. 3,5 bei Luft-WP spart dauerhaft ca. €200–400/Jahr Betriebskosten.' },
      { title: 'Genehmigungsprozess', text: 'Vor der Erdwärme-Bohrung: Hydrogeologisches Gutachten, wasserrechtliche Genehmigung bei der unteren Wasserbehörde (4–8 Wochen), Bohrprotokoll für die KfW. Die Genehmigung holt üblicherweise das Bohrunternehmen ein. Unser Partnerbetrieb koordiniert den gesamten Prozess.' },
    ],
  },
  'waermepumpe-angebot': {
    headline: 'Wärmepumpe Angebot 2026 — Was muss drinstehen?',
    intro: 'Ein vollständiges WP-Angebot ist die Grundlage für KfW-Förderung und seriösen Vergleich. Viele Betriebe lassen Pflichtpositionen weg. Wir erklären, was ein Angebot enthalten muss — und woran Sie schlechte Angebote erkennen.',
    stats: [{ val: '3+', label: 'Mind. Angebote einholen' }, { val: '20–40%', label: 'Preisunterschied typisch' }, { val: '48h', label: 'Unser Vergleich' }, { val: 'KfW-LuL', label: 'Pflichtnachweis' }],
    sections: [
      { title: 'Was muss im Angebot stehen?', text: 'Pflicht: Heizlastberechnung DIN EN 12831, hydraulischer Abgleich (KfW-Pflicht), WP-Modell mit kW und Kältemittel, Pufferspeicher-Volumen, Elektroinstallation separat ausgewiesen, Wärmemengenzähler (KfW-Pflicht 2026), Inbetriebnahme durch F-Gas-zertifizierten Betrieb. Fehlt eines davon: Angebot sofort ablehnen.' },
      { title: '5 rote Flaggen im WP-Angebot', text: '1. Kein Heizlastnachweis → WP falsch dimensioniert. 2. Kein hydraulischer Abgleich → KfW-Antrag abgelehnt. 3. Pauschalpreis ohne Positionsaufschlüsselung → Nachtragsrisiko. 4. Kein Kältemittel angegeben → R290-Bonus (5%) entgeht Ihnen. 5. Betrieb nicht im KfW-Portal registriert → Förderung weg.' },
      { title: 'Wie Angebote vergleichen?', text: 'Vergleichen Sie nur vollständige Angebote mit denselben Positionen. Entscheidend: Gesamtpreis inklusive Hydraulik, Elektro und Wärmemengenzähler — nicht nur der Gerätepreis. Wir erstellen innerhalb von 48h bis zu 3 vollständige, direkt vergleichbare Angebote geprüfter lokaler Betriebe.' },
    ],
  },
  'waermepumpe-preise': {
    headline: 'Wärmepumpe Preise 2026 — Vollständige Kostenübersicht',
    intro: 'Wärmepumpe Preise 2026: Luft-WP €18.000–28.000, Sole-WP €22.000–35.000 — alles inklusive. Nach KfW-Förderung (50–70%) starten die Eigenanteile ab €9.000. Alle Preisbestandteile transparent erklärt.',
    stats: [{ val: '€18–28k', label: 'Luft-WP komplett' }, { val: '€22–35k', label: 'Sole-WP komplett' }, { val: 'ab €9k', label: 'Nach KfW-Förderung' }, { val: '7–12 J.', label: 'Amortisation' }],
    sections: [
      { title: 'Preisbestandteile einer Luft-WP', text: 'Gerät: €9.000–18.000 (je nach Hersteller, kW, Kältemittel). Montage: €3.000–6.000 (Kernbohrung, Kältemittel, Hydraulik). Hydraulischer Abgleich: €500–1.500 (KfW-Pflicht). Elektroinstallation: €500–1.500 (Starkstrom). Pufferspeicher: €600–2.000. Wärmemengenzähler: €300–600. Gesamt: €14.000–28.000 vor Förderung.' },
      { title: 'Stadtspezifische Preisunterschiede', text: 'Installateurpreise variieren je nach Region um 15–25%. Metropolen tendieren zu höheren Preisen durch Auslastung. Gleichzeitig: Mehr Wettbewerb in Großstädten hält Preise in Schach. Stadtspezifischer Strompreis (26–32 ct/kWh) beeinflusst die Betriebskosten stärker als der regionale Preisunterschied beim Kauf.' },
      { title: 'Warum 3 Angebote Pflicht sind', text: 'Preisunterschiede von 20–40% bei identischer Leistung sind keine Ausnahme — sie sind die Regel. Entscheidend: Nur vollständige, vergleichbare Angebote sind echte Vergleichsangebote. Fehlt der hydraulische Abgleich im Angebot, ist das Angebot nicht vergleichbar (und die KfW-Förderung gefährdet).' },
    ],
  },
  'waermepumpe-anbieter': {
    headline: 'Wärmepumpe Anbieter 2026 — So finden Sie den Richtigen',
    intro: 'Nicht jeder Anbieter ist gleichwertig. Für die KfW-Förderung brauchen Sie einen registrierten Lieferanten- und Leistungserbringer. Lokale Meisterbetriebe schlagen bundesweite Anbieter fast immer.',
    stats: [{ val: 'KfW-LuL', label: 'Pflicht für Förderung' }, { val: 'HWK', label: 'Mindeststandard' }, { val: '5+', label: 'WP-Referenzen' }, { val: 'Lokal', label: 'Unser Fokus' }],
    sections: [
      { title: 'Lokal vs. bundesweit — was ist besser?', text: 'Lokale SHK-Meisterbetriebe kennen den lokalen Netzbetreiber, die regionalen Genehmigungsanforderungen und sind bei Störungen schnell vor Ort. Bundesweite Anbieter setzen oft auf Subunternehmer — das bedeutet weniger Verantwortung bei Problemen. Unser Netzwerk besteht ausschließlich aus ansässigen, geprüften Meisterbetrieben.' },
      { title: '7 Kriterien für einen guten WP-Anbieter', text: 'HWK-Eintragung aktiv, KfW-LuL-Registrierung vorhanden, mindestens 5 dokumentierte WP-Installationen, F-Gas-Zertifikat (EU 517/2014), Heizlastberechnung nach DIN EN 12831 inklusive, Haftpflicht min. €1,5 Mio., Reaktionszeit bei Störungen unter 48h. Alle unsere Partnerbetriebe erfüllen alle 7 Kriterien.' },
      { title: 'Woran erkenne ich unseriöse Anbieter?', text: 'Warnsignale: Angebot ohne Heizlastberechnung, kein hydraulischer Abgleich im Preis, Pauschalpreise ohne Positionsaufschlüsselung, nicht im KfW-Portal registriert, sehr kurze Gewährleistung (< 2 Jahre), kein lokaler Ansprechpartner. Bei diesen Signalen: sofort ablehnen und bei uns anfragen.' },
    ],
  },
  'luftwaermepumpe': {
    headline: 'Luftwärmepumpe 2026 — Technik, Kosten & Vergleich',
    intro: 'Luftwärmepumpe und Luft-Wasser-Wärmepumpe — oft synonym verwendet, aber mit technischen Unterschieden. 92% Marktanteil, JAZ 3,2–4,2 je Standort, keine Bohrung nötig.',
    stats: [{ val: '92%', label: 'Marktanteil Deutschland' }, { val: 'JAZ 3,2–4,2', label: 'Je nach Standort' }, { val: '45–55 dB', label: 'Schallpegel modern' }, { val: 'R290', label: 'Kältemittel-Bonus' }],
    sections: [
      { title: 'Luftwärmepumpe — Typen im Überblick', text: 'Luft-Wasser-WP (Heizung + WW): 92% Marktanteil, JAZ 3,2–4,2, Außeneinheit + Inneneinheit. Luft-Luft-WP (nur Heizung/Kühlung): Kein KfW-Anschluss fürs Warmwasser, selten in Deutschland. Abluft-WP (für Warmwasser): Nutzt Abluft, günstig, aber nur für WW — keine Heizung. Für Heizung + WW: immer Luft-Wasser-WP.' },
      { title: 'Schallthematik richtig einschätzen', text: 'Moderne Luftwärmepumpen erzeugen 45–55 dB(A) auf 1 Meter Abstand — vergleichbar mit einem normalen Gespräch. TA-Lärm schreibt max. 45 dB(A) tags / 35 dB(A) nachts am Nachbargrundstück vor. Mit korrektem Aufstellort und Abstand (3 m zur Grenze) ist das für fast alle modernen Geräte problemlos einhaltbar.' },
      { title: 'Monoblock vs. Split — was ist besser?', text: 'Monoblock: Gesamtes Kältemittelsystem außen, nur Wasserrohre ins Haus — einfachere Installation, kein F-Gas innen nötig, 70% Marktanteil bei Neuinstallationen. Split: Kältemittelleitungen ins Haus, etwas höhere Effizienz bei langen Leitungswegen. Für die meisten Häuser: Monoblock ist die einfachere und günstigere Wahl.' },
    ],
  },
  'waermepumpe-neubau': {
    headline: 'Wärmepumpe Neubau 2026 — Planung & Förderung',
    intro: 'Im Neubau ist die Wärmepumpe seit 2024 Pflicht nach GEG. Kombiniert mit Fußbodenheizung und guter Dämmung erreichen Sie JAZ 4,0–5,0 und minimale Betriebskosten. So planen Sie richtig.',
    stats: [{ val: 'GEG-Pflicht', label: 'Seit 01.01.2024' }, { val: 'JAZ 4–5', label: 'Mit FBH im Neubau' }, { val: '35°C', label: 'Optimale VL-Temp' }, { val: 'KfW 297', label: 'Neubau-Förderung' }],
    sections: [
      { title: 'GEG-Anforderungen im Neubau', text: 'Seit 01.01.2024 gilt für alle Neubauten die 65%-EE-Pflicht. Die Wärmepumpe erfüllt das automatisch. Zusätzlich: QP-Grenzwert einhalten (Primärenergiebedarf), Lüftungsanlage empfohlen ab n50 < 0,6 h⁻¹, Anlagenbuch und F-Gas-Protokoll für die Bauabnahme.' },
      { title: 'WP + Fußbodenheizung — die optimale Kombination', text: 'Fußbodenheizung ermöglicht Vorlauftemperaturen von 30–35°C — das maximiert die JAZ auf 4,0–5,0. Gegenüber Heizkörpern (55°C VL) bedeutet das 15–20% niedrigere Betriebskosten dauerhaft. Im Neubau ist FBH fast immer günstiger als im Bestand — Kosten: €3.000–8.000 für die Heizflächen.' },
      { title: 'Förderung im Neubau', text: 'KfW Klimafreundlicher Neubau (KFN, Programm 297): zinsgünstige Darlehen für Neubauten unter bestimmten Effizienzstandards. BEG WG: Förderung für Wohngebäude-Neubau. Wichtig: Im Neubau gibt es keinen Klima-Speed-Bonus (kein fossiles Altsystem zu ersetzen). Grundförderung 30% ist aber möglich.' },
    ],
  },
  'waermepumpe-beratung': {
    headline: 'Wärmepumpe Beratung 2026 — Kostenlos & unabhängig',
    intro: 'Unabhängige WP-Beratung ohne Herstellerbindung — wir klären Eignung, Kosten, Förderung und Installateur-Auswahl für Ihr Haus. Kostenlos, in 733 Städten, innerhalb von 48h.',
    stats: [{ val: 'Kostenlos', label: 'Unser Service' }, { val: 'Herstellerunabhängig', label: 'Keine Provision' }, { val: '48h', label: 'Reaktionszeit' }, { val: '6 Themen', label: 'Beratungsumfang' }],
    sections: [
      { title: 'Was deckt die Beratung ab?', text: 'Unsere kostenlose Beratung klärt: 1. WP-Eignung Ihres Hauses (Vorlauftemperatur, Platzbedarf). 2. Welcher WP-Typ passt (Luft, Sole, Wasser). 3. Realistischer Kostenrahmen für Ihr Haus. 4. Maximale Förderquote für Ihre Situation. 5. Geeignete lokale Fachbetriebe. 6. KfW-Antragsbegleitung. Alles in einem Gespräch.' },
      { title: 'Warum unabhängige Beratung?', text: 'Viele "Berater" sind Verkäufer einer bestimmten Marke oder eines bestimmten Betriebs. Wir erhalten keine Provision von Herstellern — nur wenn ein Auftrag zustande kommt, erhält der Installationsbetrieb eine Vermittlungsgebühr. Ihr Interesse ist unser Interesse: wir empfehlen, was für Ihr Haus und Budget passt.' },
      { title: 'Was Sie für die Beratung mitbringen sollten', text: 'Hilfreiche Informationen: Wohnfläche, Baujahr, aktuelle Heizung (Typ und Alter), ob Kellerraum vorhanden, ob Vorlauftemperatur bekannt. Nicht nötig: Technische Vorkenntnisse — wir erklären alles verständlich. Unsere Ersteinschätzung dauert ca. 10 Minuten.' },
    ],
  },
  'waermepumpe-fachbetrieb': {
    headline: 'Wärmepumpe Fachbetrieb 2026 — Geprüfte Betriebe finden',
    intro: 'Ein WP-Fachbetrieb ist mehr als ein normaler SHK-Betrieb. KfW-Registrierung, F-Gas-Zertifikat und dokumentierte WP-Erfahrung sind Pflicht. So finden Sie den richtigen Fachbetrieb in Ihrer Stadt.',
    stats: [{ val: 'KfW-LuL', label: 'Registrierungspflicht' }, { val: 'F-Gas', label: 'EU 517/2014' }, { val: 'HWK', label: 'Handwerksrolle' }, { val: '5+', label: 'WP-Referenzen mind.' }],
    sections: [
      { title: 'Was macht einen echten WP-Fachbetrieb aus?', text: 'HWK-Eintragung als Meisterbetrieb, KfW-Lieferanten- und Leistungserbringer (LuL) Registrierung (Pflicht für BEG-Förderung), F-Gas-Sachkundenachweis (EU 517/2014, Pflicht für Kältemittelbefüllung), mindestens 5 dokumentierte WP-Installationen, vollständige Angebote mit Heizlastberechnung und Hydraulik.' },
      { title: 'Typische Fehler bei falscher Betriebswahl', text: 'Häufige Probleme mit nicht-spezialisierten Betrieben: WP ohne Heizlastberechnung dimensioniert (über- oder unterdimensioniert), hydraulischer Abgleich nicht durchgeführt (KfW-Antrag abgelehnt), KfW-Antrag nicht gestellt (Förderung weg), Inbetriebnahme durch nicht F-Gas-zertifizierten Mitarbeiter (illegal). Kostet Sie im Worst Case €21.000 Förderung + Garantieverlust.' },
      { title: 'Unser Prüfprozess für Partnerbetriebe', text: 'Alle unsere Partnerbetriebe werden vorab geprüft: HWK-Eintragung verifiziert, KfW-Portal-Registrierung bestätigt, F-Gas-Zertifikat geprüft, Referenzinstallationen dokumentiert, Bewertungen ausgewertet. Betriebe unter 4,0/5 oder mit unvollständigen Angeboten werden aus dem Netzwerk entfernt.' },
    ],
  },
  'waermepumpe-montage': {
    headline: 'Wärmepumpe Montage 2026 — Ablauf & Kosten',
    intro: 'Eine WP-Montage dauert 2–3 Tage und kostet €3.000–6.000 für die reine Arbeitsleistung. Was passiert an jedem Tag, was sind typische Fallstricke, und was muss in der Rechnung stehen?',
    stats: [{ val: '2–3 Tage', label: 'Montagedauer' }, { val: '€3–6k', label: 'Montagekosten' }, { val: 'F-Gas', label: 'Inbetriebnahme Pflicht' }, { val: 'Tag 3', label: 'Hydraulischer Abgleich' }],
    sections: [
      { title: 'Der 3-Tage-Montageplan', text: 'Tag 1: Außeneinheit anliefern, Fundament/Gummifüße, Kernbohrung (60–80 mm) durch Außenwand, Kältemittelleitungen verlegen, Hydraulik vorbereiten. Tag 2: Außeneinheit aufstellen, Kältemittelkreis befüllen (F-Gas-Pflicht), Pufferspeicher und Warmwasserspeicher anschließen, Elektroinstallation. Tag 3: Hydraulischer Abgleich (KfW-Pflicht), Heizungsprogrammierung, Inbetriebnahme, KfW-Protokoll.' },
      { title: '5 häufige Montagefehler', text: '1. Außeneinheit zu nah an der Grundstücksgrenze (TA-Lärm-Problem). 2. Pufferspeicher zu klein (< 30 l/kW = zu viele Taktungen). 3. Kein hydraulischer Abgleich (KfW-Antrag scheitert). 4. Außeneinheit in Wärmefalle (eigene Abluft angesaugt, COP sinkt 15–25%). 5. Kein Schallschutzfundament (Körperschall ins Gebäude). Alle 5 sind vermeidbar mit erfahrenem Fachbetrieb.' },
      { title: 'Kosten der Montage im Detail', text: 'Kernbohrung: €150–400. Kältemittelbefüllung (F-Gas): im Montagepauschale enthalten. Hydraulischer Abgleich: €500–1.500 (separat ausweisen, KfW-Pflicht). Elektroinstallation: €500–1.500 (Starkstromkreis 3×16A). Wärmemengenzähler: €300–600 (KfW-Pflicht 2026). Alle Positionen müssen im Angebot einzeln stehen.' },
    ],
  },
  'waermepumpe-oder-gas': {
    headline: 'Wärmepumpe oder Gas 2026 — Kostenvergleich',
    intro: 'Wärmepumpe oder Gasheizung — welche ist günstiger? Mit steigendem CO₂-Preis wächst der Vorsprung der WP jedes Jahr. Wir rechnen es durch: für Ihre Stadt, Ihren Strompreis, Ihren Gaspreis.',
    stats: [{ val: '€55/t', label: 'CO₂-Preis 2026' }, { val: '~100€/t', label: 'CO₂-Preis 2030 prog.' }, { val: '65%', label: 'GEG-EE-Pflicht' }, { val: 'WP gewinnt', label: 'Langfristiges Ergebnis' }],
    sections: [
      { title: 'Kostenvergleich 2026', text: 'WP-Betriebskosten: Strompreis (26–32 ct/kWh je Stadt) ÷ JAZ (3,2–4,2) = 7–10 ct/kWh Wärme. Gas: Gaspreis (8–12 ct/kWh) ÷ Wirkungsgrad 92% = 9–13 ct/kWh Wärme + wachsender CO₂-Aufschlag. Bereits heute ist die WP in den meisten Städten günstiger im Betrieb — Tendenz stark zugunsten WP.' },
      { title: 'CO₂-Preis macht Gas teurer', text: 'Der CO₂-Preis auf Erdgas steigt planmäßig: 2026: €55/t CO₂ (ca. 1,2 ct/kWh Gas). 2030: EU-ETS2 prognostiziert €100–150/t (ca. 2,5 ct/kWh Gas). Jede Gasheizung, die heute eingebaut wird, wird bis 2030 deutlich teurer im Betrieb. Die WP hat kein CO₂-Preisrisiko.' },
      { title: 'Wann ist Gas noch die Wahl?', text: 'Gas als Solo-Heizung ist GEG-konform nicht mehr möglich (keine 65% EE). Hybrid (Gas + WP): Möglich, aber teurer als reine WP und weiterhin CO₂-kostenexponiert. Einziges sinnvolles Restargument für Gas: sehr kurzer Verbleib im Haus (< 3 Jahre) ohne Amortisationsziel. In allen anderen Fällen: WP rechnet sich langfristig.' },
    ],
  },
  'waermepumpe-stromverbrauch': {
    headline: 'Wärmepumpe Stromverbrauch 2026 — Stadtspezifische Berechnungen',
    intro: 'Wie viel Strom verbraucht eine Wärmepumpe pro Jahr? Das hängt direkt von Ihrer Stadt (JAZ), Ihrem Strompreis und Ihrer Wohnfläche ab. Wir rechnen es durch — für jede der 733 Städte.',
    stats: [{ val: '3.000–6.000', label: 'kWh/Jahr typisch' }, { val: 'JAZ 3,2–4,2', label: 'Effizienzbereich' }, { val: 'WP-Tarif', label: '~12% günstiger' }, { val: 'PV + WP', label: 'Optimale Kombination' }],
    sections: [
      { title: 'Wie viel Strom verbraucht die WP?', text: 'Für ein 120 m² EFH (Baujahr 1980): Jahresheizwärmebedarf ca. 18.000 kWh. Bei JAZ 3,5: Stromverbrauch ca. 5.100 kWh/Jahr. Bei Strompreis 30 ct/kWh: ca. €1.530/Jahr. Zum Vergleich Gas: 18.000 kWh × 10 ct/kWh = €1.800/Jahr + CO₂-Aufschlag. Die WP ist bereits heute günstiger — und wird es durch steigenden CO₂-Preis immer mehr.' },
      { title: 'WP-Sondertarif — bis 12% sparen', text: 'Die meisten Netzbetreiber bieten einen WP-Sondertarif (2. Zähler) mit 12–15% Rabatt. Voraussetzung: Separate Messung des WP-Stroms und Nachtabsenkung möglich (Smart-Grid-Eingang). Einmalkosten: €300–600 für den 2. Zähler. Amortisation: 1–2 Jahre. Unbedingt beim lokalen Versorger anfragen.' },
      { title: 'PV + WP — die Kombination mit maximaler Einsparung', text: 'Mit einer PV-Anlage (8 kWp) erzeugen Sie je nach Stadt 6.500–9.000 kWh/Jahr. 40–60% davon kann direkt die WP nutzen (Eigenverbrauch ca. 4 ct/kWh statt 30 ct/kWh Netzstrom). Ersparnis: €600–1.000/Jahr zusätzlich. WP + PV ist die Kombination mit der schnellsten Gesamtamortisation.' },
    ],
  },
};

// Generischen Content für alle anderen Keywords
function getDefaultContent(keyword: { keyword: string; slug: string; baseVolume: number; intent: string }) {
  const kw = keyword.keyword.replace('[Stadt]', '').trim();
  return {
    headline: `${kw} 2026 — Alle deutschen Städte`,
    intro: `${kw} in Ihrer Stadt: Stadtspezifische Berechnungen, aktuelle Preise 2026, bis zu 70% KfW-Förderung. Geprüfte Fachbetriebe in 733 deutschen Städten kostenlos vergleichen.`,
    stats: [
      { val: '733', label: 'Städte' },
      { val: '70%', label: 'Max. KfW' },
      { val: '€21.000', label: 'Max. Zuschuss' },
      { val: 'Kostenlos', label: 'Unser Service' },
    ],
    sections: [
      {
        title: `${kw} — was Sie wissen müssen`,
        text: `${kw} ist 2026 eine der gefragtesten Leistungen rund um die Wärmepumpe. Das GEG verpflichtet seit 2024 zu 65% erneuerbarer Energie beim Heizungsersatz. Die KfW-Förderung macht Wärmepumpen mit bis zu 70% Zuschuss attraktiv wie nie. Wählen Sie Ihre Stadt für stadtspezifische Berechnungen.`,
      },
      {
        title: 'KfW-Förderung nutzen',
        text: 'Bis zu 70% KfW-Zuschuss (max. €21.000) für Wärmepumpen — nicht rückzahlbar. Antrag zwingend VOR Baubeginn stellen. Unser Service: Wir verbinden Sie mit einem Fachbetrieb, der den KfW-Antrag für Sie übernimmt.',
      },
      {
        title: 'Kostenloser Vergleich in Ihrer Stadt',
        text: 'Wählen Sie Ihre Stadt aus der Liste unten — Sie erhalten eine stadtspezifische Seite mit lokalen Preisen, erreichbarer JAZ, regionaler Förderung und bis zu 3 kostenlosen Angeboten geprüfter Fachbetriebe.',
      },
    ],
  };
}

export default function PillarPage({ params }: Props) {
  const keyword = getKeywordBySlug(params.keywordSlug);
  if (!keyword) notFound();

  const cities = citiesData as City[];
  const content = PILLAR_CONTENT[keyword.slug] ?? getDefaultContent(keyword);

  // Top-Städte nach Einwohnerzahl für die prominente Anzeige
  const topCities = [...cities]
    .sort((a, b) => b.einwohner - a.einwohner)
    .slice(0, 30);

  // Alle Städte alphabetisch für die vollständige Liste
  const allCitiesByState = cities.reduce((acc, city) => {
    if (!acc[city.bundesland]) acc[city.bundesland] = [];
    acc[city.bundesland].push(city);
    return acc;
  }, {} as Record<string, City[]>);

  // Cross-Links zu anderen Keyword-Seiten
  const crossKeywords = keyword.crossLinks
    .map(s => getKeywordBySlug(s))
    .filter(Boolean)
    .slice(0, 6);

  const kw = keyword.keyword.replace('[Stadt]', '').trim();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${kw} 2026 — Alle Städte`,
    url: `https://waermepumpenbegleiter.de/${keyword.slug}`,
    about: { '@type': 'Service', name: kw, areaServed: { '@type': 'Country', name: 'Deutschland' } },
  };

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      {/* HERO */}
      <div className="bg-wp-dark py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-6 text-white/40">
            <a href="/" className="hover:text-white/70 transition-colors">Startseite</a>
            <span>›</span>
            <span className="text-white/80">{kw}</span>
          </nav>
          <h1 className="font-heading font-extrabold text-white mb-4" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
            {content.headline}
          </h1>
          <p className="text-white/65 text-lg leading-relaxed max-w-3xl mb-8">
            {content.intro}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {content.stats.map((s, i) => (
              <div key={i} className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
                <div className="font-mono font-extrabold text-wp-amber text-xl leading-none mb-1">{s.val}</div>
                <div className="text-white/45 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Inhalt-Sektionen */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {content.sections.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-wp-border shadow-wp-sm">
              <h2 className="font-heading font-bold text-wp-text text-base mb-3">{s.title}</h2>
              <p className="text-wp-text2 text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Top-Städte prominent */}
        <div className="mb-14">
          <h2 className="font-heading font-bold text-wp-text text-2xl mb-2">
            {kw} — Großstädte
          </h2>
          <p className="text-wp-text2 text-sm mb-6">
            {topCities.length} größte Städte mit den meisten Suchanfragen — direkt zur stadtspezifischen Seite mit Preisen, JAZ und Förderung.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {topCities.map(city => (
              <a key={city.slug} href={`/${keyword.slug}/${city.slug}`}
                className="group bg-white rounded-xl p-3 border border-wp-border hover:border-wp-green hover:shadow-wp-sm transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} className="text-wp-green shrink-0" />
                  <span className="font-semibold text-wp-text text-xs group-hover:text-wp-green transition-colors truncate">{city.name}</span>
                </div>
                <p className="text-wp-text3 text-xs">{(city.einwohner / 1000).toFixed(0)}k EW</p>
              </a>
            ))}
          </div>
        </div>

        {/* Cross-Keywords */}
        {crossKeywords.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-wp-border shadow-wp-sm mb-14">
            <h2 className="font-heading font-bold text-wp-text text-lg mb-4">Verwandte Themen</h2>
            <div className="flex flex-wrap gap-3">
              {crossKeywords.map(kw2 => kw2 && (
                <a key={kw2.slug} href={`/${kw2.slug}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-wp-bg border border-wp-border rounded-xl text-sm font-semibold text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                  {kw2.keyword.replace('[Stadt]', '').trim()}
                  <ArrowRight size={13} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Pillar Content + FAQ */}
        {keyword.pillarContent && (
          <div className="mb-12 bg-white rounded-2xl border border-wp-border p-7 shadow-wp-sm">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">
              {kw} in Deutschland — Was Sie wissen müssen
            </h2>
            <div className="prose prose-sm max-w-none text-wp-text2 leading-relaxed">
              <p>{keyword.pillarContent}</p>
            </div>
          </div>
        )}

        {keyword.faqPool && keyword.faqPool.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-5">
              Häufige Fragen zu {kw}
            </h2>
            <div className="space-y-3">
              {keyword.faqPool.slice(0, 5).map((faq, i) => (
                <details key={i} className="bg-white border border-wp-border rounded-xl overflow-hidden group">
                  <summary className="w-full flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-semibold text-wp-text text-sm">
                    <span>{faq.q.replace('{stadt}', 'Ihrer Stadt').replace('{bundesland}', 'Ihrem Bundesland')}</span>
                    <span className="shrink-0 text-wp-text3 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-5 pb-4 text-wp-text2 text-sm leading-relaxed border-t border-wp-border">
                    {faq.a.replace('{stadt}', 'Ihrer Stadt').replace('{bundesland}', 'Ihrem Bundesland').replace(/\{[^}]+\}/g, '—')}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Alle Städte nach Bundesland */}
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-2">
          {kw} — Alle 733 Städte
        </h2>
        <p className="text-wp-text2 text-sm mb-8">
          Wählen Sie Ihre Stadt für stadtspezifische Preise, erreichbare JAZ, regionale Förderung und kostenlose Angebote.
        </p>

        <div className="space-y-8">
          {Object.entries(allCitiesByState)
            .sort(([a], [b]) => a.localeCompare(b, 'de'))
            .map(([state, stateCities]) => (
              <div key={state}>
                <h3 className="font-heading font-semibold text-wp-text text-base mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-wp-green rounded-full shrink-0" />
                  {state}
                  <span className="text-wp-text3 font-normal text-sm">({stateCities.length} Städte)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {stateCities
                    .sort((a, b) => b.einwohner - a.einwohner)
                    .map(city => (
                      <a key={city.slug} href={`/${keyword.slug}/${city.slug}`}
                        className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                        {city.name}
                      </a>
                    ))}
                </div>
              </div>
            ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 bg-wp-dark rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-white text-2xl mb-2">
            Ihre Stadt nicht gefunden?
          </h2>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Wir sind in ganz Deutschland aktiv. Senden Sie uns eine Anfrage — wir finden geprüfte Fachbetriebe auch in Ihrer Nähe.
          </p>
          <a href="/kontakt"
            className="inline-flex items-center gap-2 px-7 py-4 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-all hover:-translate-y-0.5">
            Kostenlos anfragen <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
