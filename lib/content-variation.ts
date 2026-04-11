// lib/content-variation.ts
// Deterministisches Content-Variation-System für WärmepumpenBegleiter
// Variation-Achsen: Stadtgröße × Klimazone × Preisregion × Bundesland × Keyword-Kategorie × Hash
// Ziel: >95% einzigartiger Fließtext pro Seite — kein Thin Content

import type { City } from './city-utils';
import type { Keyword } from './keywords';

// ── Typen ────────────────────────────────────────────────────────────────────

export type CitySize    = 'metropole' | 'grossstadt' | 'mittelstadt' | 'kleinstadt';
export type KlimaZone   = 'warm' | 'mittel' | 'kalt' | 'sehr_kalt';
export type PreisRegion = 'guenstig' | 'mittel' | 'teuer';
export type KwCategory  = 'kosten' | 'foerderung' | 'installateur' | 'technik' | 'vergleich' | 'allgemein';

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────

/** Deterministischer Hash — gleiche Stadt = immer gleiche Variante (SSG-sicher) */
export function cityHash(city: City, mod: number, salt = 0): number {
  const v = Math.abs(Math.sin((city.lat + salt) * 12.9898 + (city.lng + salt) * 78.233) * 43758.5453);
  return Math.floor((v - Math.floor(v)) * mod);
}

export function getCitySize(city: City): CitySize {
  if (city.einwohner >= 500_000) return 'metropole';
  if (city.einwohner >= 100_000) return 'grossstadt';
  if (city.einwohner >= 20_000)  return 'mittelstadt';
  return 'kleinstadt';
}

export function getKlimaZone(city: City): KlimaZone {
  if (city.avgTemp >= 10.5) return 'warm';
  if (city.avgTemp >= 9.0)  return 'mittel';
  if (city.avgTemp >= 7.5)  return 'kalt';
  return 'sehr_kalt';
}

export function getPreisRegion(city: City): PreisRegion {
  if (city.strompreis < 29.5) return 'guenstig';
  if (city.strompreis < 31.0) return 'mittel';
  return 'teuer';
}

export function getKwCategory(keyword: Keyword): KwCategory {
  const s = keyword.slug;
  if (s.includes('kosten') || s.includes('preise')) return 'kosten';
  if (s.includes('foerderung')) return 'foerderung';
  if (s.includes('installateur') || s.includes('fachbetrieb') || s.includes('anbieter') || s.includes('montage')) return 'installateur';
  if (s.includes('luft') || s.includes('erd') || s.includes('stromverbrauch') || s.includes('neubau')) return 'technik';
  if (s.includes('gas') || s.includes('heizung-tauschen') || s.includes('nachruesten') || s.includes('altbau')) return 'vergleich';
  return 'allgemein';
}

function pick<T>(arr: T[], city: City, salt = 0): T {
  return arr[cityHash(city, arr.length, salt)];
}

function fmtEuro(n: number): string {
  return n.toLocaleString('de-DE') + ' €';
}

// ── 1. INTRO-PARAGRAPHEN (8 Varianten × 4 Stadtgrößen × 6 Kategorien) ────────

export function getIntroParagraphs(city: City, keyword: Keyword, jaz: number, wpKosten: number, ersparnis: number): string[] {

  const sz  = getCitySize(city);
  const kl  = getKlimaZone(city);
  const pr  = getPreisRegion(city);
  const cat = getKwCategory(keyword);

  // ── Paragraph 1: Lage & Wirtschaftlichkeit (8 Varianten) ──────────────────
  const p1Pool: string[] = [
    `${city.name} in ${city.bundesland} ist mit ${city.avgTemp}°C Jahresmitteltemperatur und ${city.heizgradtage} Heizgradtagen ein ${kl === 'warm' ? 'besonders milder' : kl === 'kalt' ? 'klimatisch anspruchsvoller' : 'typisch deutscher'} Wärmepumpen-Standort. Bei ${city.strompreis} ct/kWh lokalem Strompreis und einer erreichbaren JAZ von ${jaz} sinken Ihre Heizkosten auf ${fmtEuro(wpKosten)} pro Jahr — das sind ${fmtEuro(ersparnis)} weniger als mit Erdgas.`,
    `In ${city.name} lohnt sich eine Wärmepumpe aus mehreren Gründen: Der lokale Strompreis von ${city.strompreis} ct/kWh ist ${pr === 'teuer' ? 'überdurchschnittlich hoch — was jede eingesparte Kilowattstunde besonders wertvoll macht' : pr === 'guenstig' ? 'erfreulich niedrig und macht den WP-Betrieb günstig' : 'marktüblich'}. Mit einer JAZ von ${jaz} bei ${city.avgTemp}°C Jahresmittel sparen Sie ${fmtEuro(ersparnis)} gegenüber Erdgas jährlich.`,
    `Hausbesitzer in ${city.name} können mit einer Wärmepumpe ihre Heizkosten um bis zu ${Math.round(ersparnis / (wpKosten + ersparnis) * 100)} % senken. Grundlage: ${city.avgTemp}°C Durchschnittstemperatur, ${city.heizgradtage} Heizgradtage, ${city.strompreis} ct/kWh Strom. Die JAZ ${jaz} bedeutet: Aus 1 kWh Strom werden ${jaz} kWh Wärme — effizienter als jede andere Heiztechnik.`,
    `${city.name} (${city.bundesland}) hat ${city.heizgradtage} Heizgradtage pro Jahr — ${city.heizgradtage > 3400 ? 'ein hoher Wert, der die Amortisation einer gut dimensionierten WP beschleunigt' : city.heizgradtage < 3000 ? 'ein moderater Wert, der zusammen mit dem günstigen Strompreis für attraktive Betriebskosten sorgt' : 'ein typisch deutscher Wert'}. Betriebskosten Ihrer Wärmepumpe: ${fmtEuro(wpKosten)} pro Jahr — verglichen mit ${fmtEuro(wpKosten + ersparnis)} für Erdgas.`,
    `Für Eigenheimbesitzer in ${city.name} ist eine Wärmepumpe 2026 eine der sichersten Investitionen: keine CO₂-Preis-Abhängigkeit wie bei Gas, dafür ${fmtEuro(ersparnis)} Jahresersparnis, 20–25 Jahre Lebensdauer und bis zu ${fmtEuro(Math.round(ersparnis * 20))} Gesamtersparnis über die Nutzungsdauer.`,
    `${city.bundesland} ist 2026 ein attraktiver Wärmepumpen-Markt — und ${city.name} mittendrin. Heizgradtage ${city.heizgradtage} Kd/a, Jahrestemperatur ${city.avgTemp}°C, Strompreis ${city.strompreis} ct/kWh, JAZ ${jaz}. Das ergibt ${fmtEuro(ersparnis)} Ersparnis pro Jahr gegenüber Erdgas. Wir vermitteln kostenlos an geprüfte Fachbetriebe direkt in ${city.name}.`,
    `In ${city.name} produziert eine richtig dimensionierte Wärmepumpe bei ${city.avgTemp}°C Außentemperatur-Jahresmittel eine JAZ von ${jaz}. Das bedeutet: Ihr Jahresstromverbrauch der WP beträgt nur ${fmtEuro(wpKosten)} — Gas kostet ${fmtEuro(wpKosten + ersparnis)}. Die Differenz von ${fmtEuro(ersparnis)} bleibt bei Ihnen.`,
    `Warum ${city.name} für eine Wärmepumpe? ${city.avgTemp}°C Jahresmittel erlauben JAZ ${jaz}, ${city.heizgradtage} Heizgradtage definieren den Bedarf, ${city.strompreis} ct/kWh bestimmen die Kosten.${city.bundeslandFoerderung ? ` Dazu kommt die ${city.bundesland}-Förderung „${city.bundeslandFoerderung}".` : ''} Ergebnis: ${fmtEuro(ersparnis)} Jahresersparnis, überschaubare Amortisation.`,
  ];

  // ── Paragraph 2: Stadtgröße-Kontext (6 Varianten × 4 Größen) ───────────────
  const p2BySize: Record<CitySize, string[]> = {
    metropole: [
      `Als Metropole bietet ${city.name} optimale Voraussetzungen für eine Wärmepumpen-Installation: Dutzende zertifizierter Fachbetriebe, etablierte Genehmigungswege für Luft-WP-Aufstellungen und ein eingespielter Markt mit fairem Wettbewerb unter Anbietern.`,
      `${city.name} ist eine der bevölkerungsreichsten Städte Deutschlands — das Solar- und WP-Handwerk ist hier entsprechend gut entwickelt. Kurze Terminwartezeiten, erfahrene Betriebe mit vielen WP-Referenzen und durchdachte Prozesse bei Genehmigung und KfW-Antrag.`,
      `In einer Metropole wie ${city.name} sind komplexe Situationen der Normalfall: dichte Bebauung, Flachdächer, Denkmalschutz in bestimmten Quartieren. Unsere Partnerbetriebe in ${city.name} haben damit Erfahrung — und kennen die lokalen Auflagen zum Lärmschutz der Außeneinheit.`,
      `${city.name}: Großstadtvorteil bei der Wärmepumpe — hohe Installateurdichte, etablierte Prozesse, verfügbare Speziallösungen. Fernwärmequote in ${city.name}: ${city.fernwaermeQuote}% — in ${100 - city.fernwaermeQuote}% der Gebäude ist eine WP die naheliegende Alternative.`,
      `Die Fachbetriebs-Dichte in ${city.name} ist hoch — das bedeutet für Sie: echte Vergleichsangebote, Wettbewerbspreise, kurze Wartezeiten. Wir matchen Sie mit dem Betrieb, der Ihre Situation in ${city.name} kennt.`,
      `${city.name} als Metropole hat ${city.efhQuote}% Einfamilienhäuser — der ideale Markt für Luft-Wasser-WP. Die verbleibenden Mehrfamilienhäuser haben spezialisierte Lösungen. Unabhängig von Ihrer Gebäudesituation: Wir haben den richtigen Partner.`,
    ],
    grossstadt: [
      `${city.name} als Großstadt bietet gut entwickelte WP-Infrastruktur: Erfahrene lokale Fachbetriebe, bekannte Genehmigungsprozesse und ein aktiver Markt. Die GEG-Frist für ${city.name}: ${city.gegFrist.replace('-', '.').replace('-', '.')} — handeln Sie jetzt, um die besten Betriebe zu sichern.`,
      `In ${city.name} wächst die Zahl installierter Wärmepumpen schnell. Das sorgt für gut ausgebildete Handwerker, eingespielte KfW-Antragsprozesse und realistische Angebote — ohne die Überhitzung des Markts, die in Metropolen manchmal Preise treibt.`,
      `Großstadtvorteil ${city.name}: Mehrere qualifizierte Fachbetriebe konkurrieren um Aufträge — das hält Preise fair. Wir selektieren für Sie den Betrieb mit der besten Kombination aus Preis, WP-Referenzen und Reaktionszeit.`,
      `${city.name} hat in den letzten Jahren stark auf Wärmepumpen gesetzt. Lokale Betriebe kennen die Eigenheiten des ${city.bundesland}-Gebäudebestands — Altbau-Anteil, typische Vorlauftemperaturen, GEG-Fristen.`,
      `In ${city.name} und Umgebung sind mehrere geprüfte Fachbetriebe verfügbar: kurze Anfahrtswege, regionale Marktkenntnis, persönlicher Service. Der Vorteil gegenüber bundesweiten Anbietern: Bei Störungen sind sie schnell vor Ort.`,
      `Die WP-Infrastruktur in ${city.name} ist gut entwickelt. Fernwärmequote ${city.fernwaermeQuote}% — das bedeutet: In ${100 - city.fernwaermeQuote}% der Gebäude ist eine Wärmepumpe die ideale GEG-konforme Lösung.`,
    ],
    mittelstadt: [
      `${city.name} als Mittelstadt bietet oft die beste Kombination: Lokale Fachbetriebe mit persönlichem Service, keine Großstadt-Aufschläge, und häufig schnellere Genehmigungsverfahren als in Ballungsräumen.`,
      `In ${city.name} arbeiten regionale SHK-Betriebe, die den lokalen Gebäudebestand, die Netzbetreiber und die Besonderheiten in ${city.bundesland} kennen. Das spart Zeit und Missverständnisse — von der Planung bis zur Inbetriebnahme.`,
      `Mittelstädte wie ${city.name} sind oft unterschätzte Wärmepumpen-Standorte: Die Fachbetriebs-Dichte ist ausreichend, die Preise fair, und persönlicher Kundenkontakt ist Standard. Kein anonymes Callcenter — ein lokaler Meisterbetrieb.`,
      `${city.name} (${city.bundesland}) hat ${city.efhQuote}% Einfamilienhäuser — der klassische Wärmepumpen-Markt. Wir vermitteln kostenlos an den passenden lokalen Betrieb, der Ihr Projekt von der Planung bis zur KfW-Abrechnung begleitet.`,
      `Für ${city.name}: Regionale Betriebe kennen lokale Besonderheiten bei Bebauungsplänen, Lärm-Auflagen und den Erwartungen des Netzbetreibers an die Elektroinstallation. Das erspart Überraschungen.`,
      `${city.name} hat ${city.einwohner.toLocaleString('de-DE')} Einwohner und einen Fernwärme-Anteil von ${city.fernwaermeQuote}%. Für die restlichen ${100 - city.fernwaermeQuote}% der Gebäude ist eine Wärmepumpe die wirtschaftlichste GEG-konforme Lösung.`,
    ],
    kleinstadt: [
      `In ${city.name} und der Region ${city.bundesland} gibt es spezialisierte Installateure, die ländliche Gegebenheiten kennen: größere Grundstücke für optimale WP-Außeneinheit-Positionierung, weniger Lärm-Konflikte mit Nachbarn, oft einfachere Genehmigungsverfahren.`,
      `${city.name} bietet als kleinere Stadt Vorteile bei der WP-Installation: ${city.efhQuote}% Einfamilienhäuser mit typischerweise gutem Aufstellplatz für die Außeneinheit, persönlicher Service lokaler Handwerker, und manchmal kommunale Förderprogramme zusätzlich zu KfW und ${city.bundesland}.`,
      `Kleinstädte wie ${city.name} haben bei Wärmepumpen einen unterschätzten Vorteil: Weniger Nachbarn-Konflikte durch Lärm, mehr Platz für optimale Aufstellung, oft sogar günstigere Installationspreise als in Ballungsräumen.`,
      `In ${city.name} (${city.bundesland}) mit ${city.einwohner.toLocaleString('de-DE')} Einwohnern gibt es regionaltypische WP-Expertise. ${city.fernwaermeQuote < 10 ? 'Fernwärme spielt kaum eine Rolle — die Wärmepumpe ist die klare Lösung.' : `Fernwärmequote ${city.fernwaermeQuote}% — für die übrigen Gebäude ist die WP erste Wahl.`}`,
      `${city.name}: Ländlicher WP-Standort mit Vorteilen. Heizgradtage ${city.heizgradtage} Kd/a, Jahrestemperatur ${city.avgTemp}°C, JAZ ${jaz} — die Zahlen stimmen. Lokale Betriebe kennen die Region und die kommunalen Gegebenheiten.`,
      `Für Eigenheimbesitzer in ${city.name}: Weniger Konkurrenz um Installateurkapazitäten als in Großstädten, persönlicher Kontakt, oft kürzere Reaktionszeiten. Der lokale Fachbetrieb kennt Ihr Viertel.`,
    ],
  };

  // ── Paragraph 3: Keyword-Kategorie-spezifisch (6 Kategorien × 6 Varianten) ──
  const p3ByCat: Record<KwCategory, string[]> = {
    kosten: [
      `${keyword.keyword.replace('[Stadt]', city.name)}: Die vollständigen Kosten in ${city.name} — Gerät (€10.000–18.000), Montage (€3.000–5.000), Hydraulik (€1.200), Elektrik (€1.000) — ergeben €15.000–25.000 brutto. Nach KfW-Förderung (50–70%) zahlen Sie ab ${fmtEuro(Math.round(15000 * 0.45))} Eigenanteil. Auf 20 Jahre gerechnet sparen Sie ${fmtEuro(ersparnis * 20)} gegenüber Gas.`,
      `Was kostet eine Wärmepumpe in ${city.name} wirklich? Entscheidend ist nicht der Listenpreis des Geräts, sondern die Vollkosten: Gerät + Montage + Hydraulik + Elektrik + optional Pufferspeicher. Und dann die Gegenrechnung: ${fmtEuro(ersparnis)} Jahresersparnis × 20 Jahre Lebensdauer = ${fmtEuro(ersparnis * 20)} Gesamtgewinn nach Amortisation.`,
      `Strompreis ${city.name}: ${city.strompreis} ct/kWh. Gaspreis: ${city.gaspreis} ct/kWh. Diese stadtspezifischen Werte fließen in alle unsere Berechnungen ein — deshalb zeigen wir Ihnen keine Pauschalzahlen, sondern Ihre individuelle Wirtschaftlichkeit in ${city.name}.`,
      `${city.name} hat ${city.strompreis} ct/kWh Strompreis — ${city.strompreis < 29 ? 'günstig, was den WP-Betrieb besonders attraktiv macht' : city.strompreis > 31 ? 'ein Anreiz, die WP möglichst effizient zu betreiben (JAZ optimieren, WP-Sondertarif nutzen)' : 'marktüblich'}. Bei JAZ ${jaz} kostet die Wärme ${(city.strompreis / jaz).toFixed(1)} ct/kWh — deutlich günstiger als Gas mit ${city.gaspreis} ct/kWh.`,
      `Alle Kostenkomponenten für ${city.name} auf einen Blick: Investition (nach Förderung ab ${fmtEuro(Math.round(18000 * 0.45))}), Betrieb (${fmtEuro(wpKosten)}/Jahr), Wartung (Ø €200–400/Jahr), Amortisation (7–12 Jahre mit 55% KfW). Danach läuft die WP auf Ihren Gewinn.`,
      `Warum unterscheiden sich WP-Angebote in ${city.name} um 20–40%? Nicht am Gerät (ähnliche Marktpreise), sondern an Montage, Hydraulik und versteckten Posten wie hydraulischem Abgleich (KfW-Pflicht!) oder Fundamentarbeiten. Wir stellen sicher, dass alle 3 Angebote vollständig und vergleichbar sind.`,
    ],
    foerderung: [
      `KfW-Förderung in ${city.name}: ${city.einwohner >= 100000 ? `Als Großstadt über 100.000 Einwohner gilt die GEG-65%-EE-Pflicht in ${city.name} bereits ab 30. Juni 2026. Wer jetzt handelt, sichert sich die volle Förderung und die besten Installateure.` : `Die GEG-Pflicht in ${city.name} gilt ab 30. Juni 2028 — aber wer früher handelt, erhält höhere Förderquoten und bessere Verfügbarkeit bei Fachbetrieben.`}${city.bundeslandFoerderung ? ` Zusätzlich gibt es in ${city.bundesland}: ${city.bundeslandFoerderung} (${city.bundeslandFoerderungBetrag}).` : ''}`,
      `Förder-Maximierung in ${city.name}: 30% Grundförderung + 20% Klima-Speed-Bonus (bei Ersatz fossiler Heizung, Eigennutzer) + bis 30% Einkommensbonus (unter €40.000 netto/Jahr) + 5% Kältemittelbonus (R290 oder Erdwärme) = max. 70%. Alle Boni sind kumulierbar — aber nur wenn der KfW-Antrag VOR Baubeginn gestellt wird.`,
      `In ${city.name} erhalten Eigennutzer, die eine Gas- oder Ölheizung ersetzen, mindestens 50% KfW-Förderung. Aus €25.000 Investitionskosten werden nach Förderung €12.500 Eigenanteil. Die jährliche Ersparnis von ${fmtEuro(ersparnis)} amortisiert das in ca. ${Math.round(12500 / ersparnis * 10) / 10} Jahren. Ab dann: reiner Gewinn.`,
      `${city.bundesland}-spezifisch: ${city.bundeslandFoerderung ? `Das Programm „${city.bundeslandFoerderung}" (${city.bundeslandFoerderungBetrag}) lässt sich ${city.bundeslandFoerderungUrl ? 'bei bestimmten Konstellationen mit der KfW-Bundesförderung kombinieren' : 'als Ergänzung nutzen'}. Wir prüfen welche Kombination für Ihr Haus in ${city.name} maximal ist.` : `${city.bundesland} setzt auf KfW-Bundesprogramme. Der BEG-Zuschuss (Programm 458) gilt in ${city.name} genauso wie bundesweit — kein Extra-Aufwand für Landesförderung.`}`,
      `Förder-Timing in ${city.name}: Der KfW-Antrag muss ZWINGEND vor dem ersten Spatenstich gestellt werden. Nachträgliche Förderung ist ausgeschlossen. Unser Service: Wir verbinden Sie mit einem Betrieb in ${city.name}, der diesen Prozess kennt und Sie durch den Antrag begleitet.`,
      `Typische Förderquoten in ${city.name} für Eigennutzer mit alter Gasheizung: 50% Basis-Kombination (30+20%). Mit Einkommensbonus: 70% (Eigenanteil dann nur ${fmtEuro(Math.round(25000 * 0.30))} bei €25.000 Investition). Mit Kältemittelbonus (R290-WP): 55%. Wir berechnen Ihren individuellen Satz kostenlos.`,
    ],
    installateur: [
      `Geprüfte Fachbetriebe in ${city.name}: Für die KfW-Förderung brauchen Sie einen im KfW-Portal registrierten Lieferanten- und Leistungserbringer (LuL). Nicht jeder SHK-Betrieb ist das. Alle unsere Partnerbetriebe in ${city.name} erfüllen diese Voraussetzung.`,
      `Was macht einen guten WP-Installateur in ${city.name} aus? Mindestens 5 dokumentierte WP-Installationen, HWK-Eintragung, gültige Haftpflichtversicherung, KfW-Antrags-Erfahrung, vollständige Angebote ohne versteckte Positionen. Unsere Partnerbetriebe in ${city.name} erfüllen alle Kriterien.`,
      `Installateur-Vergleich in ${city.name}: Preisunterschiede von 20–40% bei gleicher Leistung sind keine Seltenheit. Deshalb empfiehlt die Verbraucherzentrale mindestens 3 Vergleichsangebote. Wir holen sie für Sie — kostenlos, innerhalb von 48 Stunden, von lokalen Betrieben in ${city.name}.`,
      `Warum lokale Installateure in ${city.name} statt bundesweiter Anbieter? Bei Störungen oder Rückfragen ist der lokale Betrieb schnell vor Ort. Er kennt den lokalen Netzbetreiber, die Auflagen in ${city.bundesland} und die typischen Gebäude in ${city.name}.`,
      `Installationsablauf in ${city.name}: Anfrage → 3 Angebote in 48h → Vor-Ort-Termin → KfW-Antrag (VOR Baubeginn!) → Installation (1–3 Tage) → Inbetriebnahme → Verwendungsnachweis → KfW zahlt. Wir begleiten Sie von Schritt 1 bis zum Zahlungseingang.`,
      `In ${city.name} gilt: Die Wartezeit für gute Fachbetriebe steigt. Wer jetzt anfrägt, sichert sich Kapazität für die kommende Heizsaison. ${city.gegFrist <= '2026-12-31' ? `Besonders wichtig: Die GEG-Frist in ${city.name} ist der ${city.gegFrist.split('-').reverse().join('.')}` : 'Handeln Sie frühzeitig — die besten Betriebe sind oft 8–12 Wochen ausgebucht.'}.`,
    ],
    technik: [
      `Luft-Wasser-Wärmepumpen in ${city.name}: Bei ${city.avgTemp}°C Jahresmitteltemperatur und ${city.normAussentemp}°C Norm-Außentemperatur (DIN EN 12831) ist eine moderne Hochtemperatur-Luft-WP in ${city.name} auch für Altbauten mit höherer Vorlauftemperatur geeignet. JAZ ${jaz} ist das Ergebnis für diese Klimabedingungen.`,
      `Technische Einzigartigkeit von ${city.name}: ${city.heizgradtage} Heizgradtage bestimmen die jährliche Energiemenge, die Ihre WP liefern muss. Norm-Außentemperatur ${city.normAussentemp}°C (DIN EN 12831) definiert die maximale Heizlast. Auf dieser Basis wird die WP korrekt dimensioniert — nicht zu groß, nicht zu klein.`,
      `COP vs. JAZ in ${city.name}: Der COP ist der Momentan-Wirkungsgrad bei einer bestimmten Außentemperatur. Die JAZ ist der Jahresdurchschnitt — die für ${city.name} relevante Zahl. Bei ${city.avgTemp}°C Jahresmittel und unserer Klimaverteilung ergibt sich JAZ ${jaz}. Das bedeutet: 1 kWh Strom wird zu ${jaz} kWh Wärme.`,
      `${city.name} im Klimavergleich: ${city.avgTemp}°C Jahrestemperatur, ${city.normAussentemp}°C Auslegungstemperatur. ${city.avgTemp >= 10 ? 'Das milde Klima begünstigt die Effizienz der Luft-WP deutlich.' : city.avgTemp < 8 ? 'Das rauere Klima erfordert eine sorgfältige Dimensionierung — bei uns selbstverständlich.' : 'Typisch deutsches Klima — alle gängigen Luft-WP sind problemlos geeignet.'}`,
      `WP-Typen für ${city.name}: Luft-Wasser (92% Marktanteil, JAZ ${jaz}, kein Erdreich nötig), Sole-Wasser (JAZ ~4.3, Bohrung nötig, +5% KfW), Wasser-Wasser (JAZ ~5.0, Grundwasserrecht prüfen). Für die meisten Häuser in ${city.name} ist die Luft-WP die beste Kosten-Nutzen-Entscheidung.`,
      `PV + Wärmepumpe in ${city.name}: Mit ${city.avgSunHours} Sonnenstunden/Jahr erzeugt eine 8-kWp-PV-Anlage ca. ${Math.round(city.avgSunHours * 8 * 0.85).toLocaleString('de-DE')} kWh/Jahr. Davon kann ein Großteil direkt für die WP genutzt werden — das senkt die Betriebskosten auf unter ${Math.round(wpKosten * 0.6).toLocaleString('de-DE')} €/Jahr.`,
    ],
    vergleich: [
      `Wärmepumpe vs. Gas in ${city.name}: Gaspreis ${city.gaspreis} ct/kWh + steigender CO₂-Preis (2026: 55 €/t, 2030: voraussichtlich 100 €/t) vs. Strom ${city.strompreis} ct/kWh mit WP-JAZ ${jaz}. Die WP kostet heute ${fmtEuro(wpKosten)}/Jahr, Gas ${fmtEuro(wpKosten + ersparnis)}/Jahr. Bis 2030 wächst die Differenz durch den CO₂-Preis weiter.`,
      `Heizung tauschen in ${city.name}: Welche Option ist GEG-konform? Wärmepumpe (✅ immer), Gasheizung (⚠️ nur mit 65% erneuerbarem Anteil), Pellets (✅ mit Einschränkungen), Fernwärme (abhängig von der Zusammensetzung in ${city.name}, Fernwärmequote: ${city.fernwaermeQuote}%). Die WP ist die einzige Option ohne „Wenn und Aber".`,
      `Altbau-Eignung in ${city.name}: Die größte Sorge beim Heizungstausch ist die Vorlauftemperatur. Moderne Luft-WP arbeiten bis 70°C — damit sind sie mit fast allen bestehenden Heizkörpern in ${city.name} kompatibel. Ein hydraulischer Abgleich (€500–1.500, KfW-Pflicht) senkt den nötigen Vorlauf oft um 5–10°C und verbessert die JAZ auf ${(jaz + 0.2).toFixed(1)}.`,
      `Nachrüsten in ${city.name}: Die häufigsten Fragen vor dem WP-Einbau — 1) Reicht mein Dach/Grundstück? (Fast immer ja, Außeneinheit braucht ~1 m²) 2) Sind meine Heizkörper geeignet? (In ${city.name} typisch ja, Vorlauf oft unter 60°C) 3) Wie lange dauert es? (6–12 Wochen von Anfrage bis fertig) 4) Was kostet es? (Nach Förderung ab ${fmtEuro(Math.round(18000 * 0.45))}).`,
      `GEG-Kontext ${city.name}: ${city.einwohner >= 100000 ? `Als Großstadt über 100.000 Einwohner gilt in ${city.name} die 65%-EE-Pflicht ab 30. Juni 2026. Wer jetzt mit der Planung beginnt, ist rechtzeitig fertig — und sichert sich die volle KfW-Förderung.` : `Die 65%-EE-Pflicht gilt in ${city.name} ab 30. Juni 2028. Trotzdem lohnt sich frühzeitiges Handeln: Bessere Installateursverfügbarkeit, volle Förderung, GEG-Sicherheit.`}`,
      `Hybrid-Heizung als Alternative in ${city.name}: Eine Kombination aus Wärmepumpe + Gaskessel ist technisch möglich, aber fördertechnisch weniger attraktiv als eine reine WP. Und: Der Gaskessel verursacht weiterhin CO₂-Kosten. Unser Rat für ${city.name}: Reine WP ist langfristig die bessere Lösung.`,
    ],
    allgemein: [
      `Wärmepumpe in ${city.name}: Die Entscheidung für eine Wärmepumpe ist in ${city.name} 2026 leichter als je zuvor. KfW-Förderung bis 70%, bewährte Technologie, JAZ ${jaz} bei Ihrem Klima, und lokale Fachbetriebe, die den Prozess kennen. Wir verbinden Sie kostenlos mit dem richtigen Betrieb.`,
      `${city.name} im WP-Vergleich: ${city.avgTemp}°C Jahrestemperatur, ${city.heizgradtage} HGT, ${city.strompreis} ct/kWh Strom. Das ergibt ${fmtEuro(ersparnis)} Jahresersparnis gegenüber Erdgas und eine Amortisation — je nach Förderquote — in 7–12 Jahren. Danach läuft die WP 10–15 Jahre auf Ihren Gewinn.`,
      `Was ${city.name} besonders macht: ${city.bundeslandFoerderung ? `Die ${city.bundesland}-Förderung „${city.bundeslandFoerderung}" (${city.bundeslandFoerderungBetrag}) gibt es on top zur KfW.` : `${city.bundesland} setzt voll auf KfW-Bundesförderung — unkompliziert und gut kombinierbar.`} Dazu ${city.avgSunHours} Sonnenstunden/Jahr für attraktive WP+PV-Kombinationen.`,
      `Wärmepumpen-Beratung in ${city.name}: Unser Service ist 100% kostenlos für Hausbesitzer. Wir sind herstellerunabhängig, erhalten keine Provision von Geräteherstellern — nur von den Installationsbetrieben, wenn ein Auftrag zustande kommt. Ihr Interesse ist unser Interesse.`,
      `${city.name} und der Wärmepumpenmarkt: 299.000 WP wurden 2025 in Deutschland verkauft (+55% ggü. 2024). In ${city.bundesland} ist die Nachfrage überdurchschnittlich hoch. Die besten lokalen Betriebe in ${city.name} sind 8–12 Wochen ausgebucht — jetzt anfragen lohnt sich.`,
      `Für Eigenheimbesitzer in ${city.name}: Die Wärmepumpe ist die einzige Heiztechnologie, die GEG-konform ist, KfW-gefördert wird, CO₂-Kosten eliminiert und die Immobilie langfristig wertstabil hält. Alle anderen Optionen haben mindestens einen dieser Nachteile.`,
    ],
  };

  const p1 = p1Pool[cityHash(city, p1Pool.length, 0)];
  const p2 = pick(p2BySize[sz], city, 1);
  const p3 = pick(p3ByCat[cat], city, 2);

  return [p1, p2, p3];
}

// ── 2. FAQ-ROTATION (20–25 FAQs pro Kategorie, 6–8 pro Seite) ─────────────────

interface FAQItem { q: string; a: string; }

export function getRotatingFAQs(city: City, keyword: Keyword, jaz: number, wpKosten: number, ersparnis: number, count = 6): FAQItem[] {

  const cat = getKwCategory(keyword);

  // Gemeinsame FAQs (für alle Templates)
  const sharedFAQs: FAQItem[] = [
    {
      q: `Was kostet eine Wärmepumpe in ${city.name} komplett?`,
      a: `Eine Luft-Wasser-WP kostet in ${city.name} inklusive Gerät, Montage, Hydraulik und Elektrik zwischen €18.000 und €28.000 brutto. Nach KfW-Förderung (50–70%) reduziert sich der Eigenanteil auf €9.000–€14.000. Laufende Kosten: ${fmtEuro(wpKosten)}/Jahr bei ${city.strompreis} ct/kWh lokalem Strompreis.`,
    },
    {
      q: `Wie hoch ist die KfW-Förderung für eine WP in ${city.name}?`,
      a: `Als Eigennutzer mit alter Gasheizung erhalten Sie in ${city.name} mindestens 50% KfW-Zuschuss (30% Grundförderung + 20% Klima-Speed-Bonus). Mit Einkommensbonus (unter €40k/Jahr) bis zu 70%. Der Antrag muss VOR Baubeginn gestellt werden.${city.bundeslandFoerderung ? ` Dazu gibt es in ${city.bundesland}: ${city.bundeslandFoerderung} (${city.bundeslandFoerderungBetrag}).` : ''}`,
    },
    {
      q: `Welche JAZ erreicht eine Wärmepumpe in ${city.name}?`,
      a: `Bei ${city.avgTemp}°C Jahresmitteltemperatur in ${city.name} und einer Vorlauftemperatur von 35°C erreicht eine Luft-Wasser-WP eine JAZ von ${jaz}. Das bedeutet: Aus 1 kWh Strom werden ${jaz} kWh Wärme. Mit Fußbodenheizung kann die JAZ auf ${(jaz + 0.3).toFixed(1)} steigen, bei höherer Vorlauftemperatur (Altbau) auf ${(jaz - 0.3).toFixed(1)} sinken.`,
    },
    {
      q: `Lohnt sich eine Wärmepumpe in ${city.name} finanziell?`,
      a: `Ja — die jährliche Ersparnis gegenüber Erdgas beträgt in ${city.name} ${fmtEuro(ersparnis)} (bei ${city.strompreis} ct/kWh Strom, ${city.gaspreis} ct/kWh Gas, JAZ ${jaz}). Nach Förderung amortisiert sich die WP in 7–12 Jahren. Dann läuft sie 10–15 weitere Jahre auf Ihren Gewinn. Gesamtersparnis über 20 Jahre: ca. ${fmtEuro(ersparnis * 20)}.`,
    },
    {
      q: `Bis wann muss ich in ${city.name} auf eine neue Heizung umstellen?`,
      a: `${city.einwohner >= 100000 ? `In ${city.name} als Großstadt über 100.000 Einwohner gilt die GEG-65%-EE-Pflicht für Bestandsgebäude ab dem 30. Juni 2026. Eine Wärmepumpe ist die GEG-konforme Lösung ohne Einschränkungen.` : `In ${city.name} gilt die GEG-65%-EE-Pflicht für Bestandsgebäude ab dem 30. Juni 2028. Frühzeitiges Handeln empfiehlt sich, um die volle KfW-Förderung zu sichern und gute Fachbetriebe zu bekommen.`}`,
    },
    {
      q: `Wie lange dauert eine WP-Installation in ${city.name}?`,
      a: `Die eigentliche Montage dauert 1–3 Tage. Der Gesamtprozess von der Anfrage bis zur fertigen Anlage beträgt 6–12 Wochen: Angebote einholen (1 Woche), KfW-Antrag vor Baubeginn stellen (2–4 Wochen), Installation (1–3 Tage), Verwendungsnachweis und Auszahlung (4–8 Wochen nach Fertigstellung).`,
    },
    {
      q: `Ist mein Haus in ${city.name} für eine Wärmepumpe geeignet?`,
      a: `Die meisten Häuser in ${city.name} sind geeignet. Entscheidend ist die Vorlauftemperatur: Unter 55°C → Standard-WP; unter 70°C → Hochtemperatur-WP. Ein hydraulischer Abgleich (€500–1.500, KfW-Pflicht) senkt die nötige Vorlauftemperatur oft erheblich. Wir klären die Eignung Ihres Hauses im kostenlosen Erstgespräch.`,
    },
    {
      q: `Gibt es in ${city.bundesland} zusätzliche Förderung zur KfW?`,
      a: city.bundeslandFoerderung
        ? `Ja: ${city.bundeslandFoerderung} — ${city.bundeslandFoerderungBetrag}. ${city.bundeslandFoerderungUrl ? `Mehr Infos: ${city.bundeslandFoerderungUrl}` : 'Informationen beim zuständigen Landesförderinstitut.'}`
        : `${city.bundesland} hat kein eigenes aktives WP-Förderprogramm. Die KfW-Bundesförderung (bis 70% Zuschuss, max. €21.000) gilt jedoch in ${city.name} genauso wie überall in Deutschland.`,
    },
    {
      q: `Lohnt sich der individuelle Sanierungsfahrplan (iSFP) in ${city.name}?`,
      a: `Ja — für die meisten Hausbesitzer in ${city.name}. Der iSFP kostet €300–700 (80% BAFA-gefördert, Eigenanteil ca. €60–140) und bringt +5% KfW-Bonus auf alle Maßnahmen. Bei €25.000 WP-Investition = +\${fmtEuro(Math.round(25000 * 0.05))} = der iSFP finanziert sich selbst.`,
    },
    {
      q: `Wie viel spare ich mit Wärmepumpe + PV in ${city.name}?`,
      a: `Mit ${city.avgSunHours} Sonnenstunden/Jahr erzeugt eine 8-kWp-PV-Anlage ca. ${Math.round(city.avgSunHours * 8 * 0.85).toLocaleString('de-DE')} kWh/Jahr. Davon kann ein Großteil direkt die WP (JAZ ${jaz}) betreiben — das reduziert die effektiven WP-Kosten auf unter 10 ct/kWh. Zusatzersparnis: ca. ${fmtEuro(Math.round(Math.min(Math.round(city.avgSunHours * 8 * 0.85) * 0.65, Math.round(120 * 160 / jaz)) * (city.strompreis / 100)))}/Jahr.`,
    },
  ];

  // Kategorie-spezifische FAQs
  const catFAQs: Record<KwCategory, FAQItem[]> = {
    kosten: [
      { q: `Wann lohnt sich eine Wärmepumpe in ${city.name} besonders?`, a: `Ja. Bei JAZ ${jaz} kostet die Wärme ${(city.strompreis / jaz).toFixed(1)} ct/kWh — günstiger als Gas mit ${city.gaspreis} ct/kWh. Jahresersparnis: ${fmtEuro(ersparnis)}. Amortisation mit 55% KfW: ca. ${Math.round(12500 / Math.max(ersparnis, 1))} Jahre. Die WP läuft danach 10–15 Jahre kostenlos.` },
      { q: `Was kostet eine Erdwärmepumpe in ${city.name}?`, a: `Eine Sole-Wasser-WP mit Tiefenbohrung kostet in ${city.bundesland} €22.000–35.000 (Gerät + Bohrung à ca. €100/m + Installation). Die höhere JAZ (~4,3) und der zusätzliche KfW-Bonus (+5%) amortisieren die Mehrinvestition. Gesamtkosten nach 50% Förderung: ab €11.000.` },
      { q: `Welche Nebenkosten gibt es bei der WP-Installation in ${city.name}?`, a: `Zusätzlich zu Gerät und Montage kommen: Hydraulischer Abgleich (€500–1.500, KfW-Pflicht), Elektroinstallation/Zähler-Upgrade (€500–1.500), Fundament/Aufstellung (€300–800), optional Pufferspeicher (€800–2.000). Seriöse Angebote in ${city.name} weisen alle Positionen einzeln aus.` },
      { q: `Wie viel Strom verbraucht eine WP in ${city.name} pro Jahr?`, a: `Bei 120 m² EFH (Baujahr 1980–1994) und JAZ ${jaz} in ${city.name} ca. ${Math.round(120 * 160 / jaz).toLocaleString('de-DE')} kWh/Jahr. Bei ${city.strompreis} ct/kWh entspricht das ${fmtEuro(wpKosten)} Jahresstromkosten für die Heizung.` },
      { q: `Was kostet der Betrieb einer Wärmepumpe im Vergleich zu Gas in ${city.name}?`, a: `WP in ${city.name}: ${fmtEuro(wpKosten)}/Jahr (${city.strompreis} ct/kWh × ${Math.round(120 * 160 / jaz).toLocaleString('de-DE')} kWh ÷ JAZ ${jaz}). Gas: ${fmtEuro(wpKosten + ersparnis)}/Jahr (${city.gaspreis} ct/kWh, Wirkungsgrad 92%). Differenz: ${fmtEuro(ersparnis)}/Jahr zugunsten der WP.` },
    ],
    foerderung: [
      { q: `Was ist der Klima-Speed-Bonus?`, a: `Der Klima-Speed-Bonus von 20% gibt es zusätzlich zur Grundförderung (30%) für Eigennutzer, die eine Gas-/Öl-/Kohleheizung ersetzen. Ergibt 50% Gesamt-KfW für die meisten Hausbesitzer in ${city.name} — ohne Einkommensgrenze.` },
      { q: `Wann muss der KfW-Antrag in ${city.name} gestellt werden?`, a: `Der KfW-Antrag (Programm 458) muss ZWINGEND vor Beauftragung des Installateurs und vor Baubeginn gestellt werden. Eine Nachförderung ist ausgeschlossen. Ihr Fachbetrieb in ${city.name} muss dafür als Lieferanten- und Leistungserbringer (LuL) im KfW-Portal registriert sein.` },
      { q: `Können KfW und ${city.bundesland}-Förderung kombiniert werden?`, a: city.bundeslandFoerderung ? `${city.bundeslandFoerderung} in ${city.bundesland}: Je nach Programmbedingungen ist eine Kombination möglich oder das Landesprogramm ist alternativ. Wir klären das für Ihren konkreten Fall in ${city.name} — kostenlos.` : `In ${city.bundesland} gibt es kein eigenes WP-Programm, das mit KfW kombiniert werden könnte. Die volle KfW-Förderung (bis 70%) steht Ihnen in ${city.name} uneingeschränkt zur Verfügung.` },
      { q: `Wie lange dauert die KfW-Auszahlung nach der Installation in ${city.name}?`, a: `Nach Abschluss der Installation reichen Sie Rechnung und Fachunternehmer-Bestätigung im KfW-Portal ein. Die Auszahlung erfolgt typischerweise 4–8 Wochen nach vollständigem Verwendungsnachweis direkt auf Ihr Konto.` },
    ],
    installateur: [
      { q: `Wie finde ich einen guten WP-Installateur in ${city.name}?`, a: `Achten Sie auf: HWK-Eintragung, Meisterbetrieb, mindestens 5 WP-Installationen nachweisbar, KfW-LuL-Registrierung, vollständiges Angebot mit allen Positionen. Wir prüfen alle diese Kriterien für unsere Partnerbetriebe in ${city.name} vorab.` },
      { q: `Wie lange ist die Wartezeit bei Installaturen in ${city.name}?`, a: `Erfahrungsgemäß 4–12 Wochen je nach Saison und Auslastung. Wer jetzt anfrägt, sichert sich Kapazität für die nächste Heizsaison. Wir stellen Ihnen innerhalb von 48 Stunden bis zu 3 Angebote geprüfter Betriebe in ${city.name} zusammen.` },
    ],
    technik: [
      { q: `Welche JAZ gilt als gut für ${city.name}?`, a: `Bei ${city.avgTemp}°C Jahresmittel in ${city.name} ist JAZ ${jaz} gut für eine Luft-WP. Ab JAZ 3,0 ist die BEG-Förderung möglich. Fußbodenheizung erhöht die JAZ auf ${(jaz + 0.3).toFixed(1)}, hohe Vorlauftemperatur (Altbau ohne Sanierung) senkt sie auf ${(jaz - 0.3).toFixed(1)}.` },
      { q: `Wie laut ist eine Wärmepumpe in ${city.name}?`, a: `Moderne Luft-WP erzeugen 45–55 dB auf 1 Meter Abstand — vergleichbar mit einem ruhigen Gespräch. In ${city.bundesland} gilt in der Regel der Mindestabstand zur Grundstücksgrenze von 3 Metern. Mit Lärmschutzmaßnahmen (€100–800) kann der Pegel weiter reduziert werden.` },
      { q: `Kann eine WP auch zum Kühlen genutzt werden in ${city.name}?`, a: `Ja — viele moderne Luft-WP bieten aktive oder passive Kühlung. Passive Kühlung (Sole-WP) ist besonders effizient. Bei ${city.avgTemp}°C Jahresmittel in ${city.name} ist Kühlung ein attraktiver Zusatznutzen, besonders in wärmeren Sommern.` },
    ],
    vergleich: [
      { q: `Ist eine Wärmepumpe auch für Altbauten in ${city.name} geeignet?`, a: `Ja — moderne Hochtemperatur-WP arbeiten bis 70°C Vorlauf und sind damit mit fast allen Bestandsheizköpern kompatibel. Ein hydraulischer Abgleich (€500–1.500) verbessert die Effizienz zusätzlich. Bei ${city.normAussentemp}°C Norm-Außentemperatur in ${city.name} ist eine sorgfältige Dimensionierung entscheidend.` },
      { q: `Wärmepumpe oder Pellets in ${city.name}?`, a: `Beide sind GEG-konform. WP-Vorteile: Wartungsarm, kein Brennstofflager nötig, JAZ ${jaz} in ${city.name}. Pellets-Vorteile: Unabhängig vom Stromnetz. WP-Kosten: ${fmtEuro(wpKosten)}/Jahr. Pellets: ca. €1.200–1.800/Jahr. KfW fördert beide — WP etwas attraktiver (bis 70% vs. 45%).` },
    ],
    allgemein: [
      { q: `Wie lange dauert eine WP-Installation in ${city.name}?`, a: `Montage: 1–3 Tage. Gesamtprojekt: 6–12 Wochen (Angebote → KfW-Antrag VOR Baubeginn → Installation → Förderauszahlung). Die Wartezeit bei guten Betrieben in ${city.name} beträgt derzeit 4–10 Wochen — frühzeitig anfragen lohnt sich.` },
      { q: `Wie funktioniert die kostenlose Vermittlung von Wärmepumpenbegleiter.de?`, a: `Sie füllen unser Formular aus (2 Minuten). Wir prüfen Ihre Angaben und vermitteln Sie an bis zu 3 geprüfte Fachbetriebe in ${city.name}. Diese melden sich innerhalb von 48 Stunden mit Angeboten. Für Sie ist der Service 100% kostenlos. Wir erhalten eine Provision vom beauftragten Installateur.` },
      { q: `Ist Wärmepumpenbegleiter.de unabhängig von Herstellern?`, a: `Ja — wir empfehlen keinen bestimmten Wärmepumpen-Hersteller und erhalten keine Provision von Herstellern. Unsere Partnerbetriebe in ${city.name} arbeiten mit verschiedenen Marken (Viessmann, Vaillant, Bosch, Stiebel Eltron, Nibe u.a.) und empfehlen das für Ihr Haus passende Gerät.` },
    ],
  };

  // FAQs zusammenführen und rotieren
  const allFAQs = [...sharedFAQs, ...(catFAQs[cat] || [])];

  // Shuffle basierend auf Stadt-Hash
  const shuffled = allFAQs
    .map((faq, i) => ({ faq, sort: cityHash(city, 1000, i) }))
    .sort((a, b) => a.sort - b.sort)
    .map(x => x.faq);

  return shuffled.slice(0, count);
}

// ── 3. USP-LEISTE (3 stadtspezifische USPs) ───────────────────────────────────

export function getUSPBar(city: City, keyword: Keyword, jaz: number, ersparnis: number): Array<{ icon: string; title: string; text: string }> {
  const cat = getKwCategory(keyword);

  const allUSPs = [
    { icon: '⚡', title: `JAZ ${jaz} in ${city.name}`, text: `Bei ${city.avgTemp}°C Jahresmittel — ${jaz} kWh Wärme pro kWh Strom.` },
    { icon: '💶', title: `${fmtEuro(ersparnis)} Jahresersparnis`, text: `Vs. Erdgas bei ${city.strompreis} ct/kWh lokalem Strompreis.` },
    { icon: '🌡️', title: `${city.heizgradtage} Heizgradtage`, text: `DWD-Klimadaten für ${city.name} — präzise Dimensionierung.` },
    { icon: '🏛️', title: `GEG-Frist beachten`, text: `${city.einwohner >= 100000 ? `${city.name}: 30.06.2026` : `${city.name}: 30.06.2028`} — jetzt planen.` },
    { icon: '✅', title: 'KfW-Antrag inklusive', text: 'Unser Partnerbetrieb begleitet Sie durch den Antrag.' },
    { icon: '📍', title: `Lokal in ${city.name}`, text: 'HWK-geprüfte Betriebe — schnell vor Ort bei Rückfragen.' },
    { icon: '🌿', title: `${city.bundeslandFoerderung ? city.bundesland + '-Förderung' : 'Bis 70% KfW'}`, text: city.bundeslandFoerderung ? `${city.bundeslandFoerderung}: ${city.bundeslandFoerderungBetrag}` : 'Max. €21.000 nicht rückzahlbarer Zuschuss.' },
    { icon: '☀️', title: `WP + PV in ${city.name}`, text: `${city.avgSunHours} h/Jahr: Solarstrom für die WP senkt Kosten auf unter 10 ct/kWh.` },
  ];

  // 3 stadtspezifisch auswählen
  return [
    allUSPs[cityHash(city, allUSPs.length, 10)],
    allUSPs[cityHash(city, allUSPs.length, 11)],
    allUSPs[cityHash(city, allUSPs.length, 12)],
  ];
}

// ── 4. CTA-VARIATION ─────────────────────────────────────────────────────────

export function getCTAVariation(city: City, keyword: Keyword, ersparnis: number): { headline: string; subline: string; button: string } {
  const ctaPool = [
    { headline: `Jetzt ${fmtEuro(ersparnis)}/Jahr sparen — kostenlos anfragen`, subline: `Bis zu 3 Angebote geprüfter Fachbetriebe in ${city.name} — in 48 Stunden.`, button: 'Kostenloses Angebot anfordern' },
    { headline: `Ihre Wärmepumpe in ${city.name} — wir übernehmen den Rest`, subline: `Installateur-Matching, KfW-Antrag, Angebotsvergleich — alles kostenlos.`, button: `Jetzt in ${city.name} anfragen` },
    { headline: `GEG-konform heizen in ${city.name} — mit voller Förderung`, subline: `Bis zu 70% KfW-Zuschuss${city.bundeslandFoerderung ? ` + ${city.bundeslandFoerderung}` : ''} — wir begleiten Sie durch den Antrag.`, button: 'Förderung berechnen lassen' },
    { headline: `${city.name}: Wärmepumpe vom Profi — kostenlos vermittelt`, subline: `Herstellerunabhängig, HWK-geprüfte Betriebe, transparente Angebote.`, button: 'Kostenlos vergleichen' },
  ];
  return ctaPool[cityHash(city, ctaPool.length, 20)];
}

// ── Haupt-Export ──────────────────────────────────────────────────────────────

export interface CityVariationData {
  introParagraphs: string[];
  rotatingFAQs: FAQItem[];
  uspBar: Array<{ icon: string; title: string; text: string }>;
  ctaVariation: { headline: string; subline: string; button: string };
}

export function getCityVariationData(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
  faqCount = 6
): CityVariationData {
  return {
    introParagraphs: getIntroParagraphs(city, keyword, jaz, wpKosten, ersparnis),
    rotatingFAQs:    getRotatingFAQs(city, keyword, jaz, wpKosten, ersparnis, faqCount),
    uspBar:          getUSPBar(city, keyword, jaz, ersparnis),
    ctaVariation:    getCTAVariation(city, keyword, ersparnis),
  };
}

// ── 5. DYNAMIC H2s (pro Stadt / Keyword deterministisch variiert) ─────────────
//    Ziel: Gleiche semantische Sektion bekommt je Stadt eine andere H2-Formulierung
//    → Google-Signal: kein seitenübergreifendes Duplicate-H2-Muster

export interface DynamicH2s {
  faq:                 string;
  foerderung:          string;
  foerderungBausteine: string;
  foerderungProzess:   string;
  klimadaten:          string;
  kosten:              string;
  vergleich:           string;
  typen:               string;
  installateur:        string;
  eignung:             string;
  prozess:             string;
  wirtschaftlichkeit:  string;
}

export function getDynamicH2s(city: City, keyword: Keyword, jaz: number): DynamicH2s {
  const cat = getKwCategory(keyword);
  const p = <T>(arr: T[], salt: number): T => arr[cityHash(city, arr.length, salt)];

  const faqByCat: Record<KwCategory, string[]> = {
    kosten: [
      `Häufige Fragen zu WP-Kosten in ${city.name}`,
      `Das fragen Eigentümer aus ${city.name} zu Wärmepumpen-Preisen`,
      `WP-Kosten ${city.name}: Wichtige Antworten im Überblick`,
      `FAQ: Wärmepumpe kaufen in ${city.name} — Preise und Kosten`,
    ],
    foerderung: [
      `Häufige Fragen zur WP-Förderung in ${city.name}`,
      `Das fragen Hausbesitzer aus ${city.name} zur KfW-Förderung`,
      `Förder-FAQ für ${city.name} — alle Antworten`,
      `FAQ: KfW + ${city.bundesland}-Förderung für ${city.name}`,
    ],
    installateur: [
      `Häufige Fragen zum WP-Installateur in ${city.name}`,
      `Das fragen Eigentümer aus ${city.name} zum Fachbetrieb`,
      `FAQ: WP-Installation und Betriebe in ${city.name}`,
      `Installateur ${city.name}: Die wichtigsten Fragen beantwortet`,
    ],
    technik: [
      `Häufige Fragen zur WP-Technik in ${city.name}`,
      `FAQ: Wärmepumpen-Technik für ${city.name}`,
      `Das fragen Eigentümer aus ${city.name} zur WP-Funktion`,
      `Technische FAQ zur Wärmepumpe in ${city.name}`,
    ],
    vergleich: [
      `Häufige Fragen — Wärmepumpe oder Gas in ${city.name}`,
      `FAQ: Heizung tauschen in ${city.name} — Optionen im Vergleich`,
      `Das fragen Hausbesitzer aus ${city.name} zum Heizungsvergleich`,
      `Vergleichs-FAQ für ${city.name}: WP vs. Gas und mehr`,
    ],
    allgemein: [
      `Häufige Fragen zur Wärmepumpe in ${city.name}`,
      `Das fragen Hausbesitzer aus ${city.name}`,
      `Ihre Fragen zur WP in ${city.name} — beantwortet`,
      `FAQ: Wärmepumpe ${city.name} — alle wichtigen Themen`,
    ],
  };

  return {
    faq: p(faqByCat[cat], 30),

    foerderung: p([
      `KfW-Förderung für Ihre WP in ${city.name} — bis zu 70%`,
      `Wie viel Förderung bekommen Sie in ${city.name}?`,
      `Maximale Förderung für Wärmepumpen in ${city.name}`,
      `Wärmepumpe ${city.name}: KfW-Zuschuss und ${city.bundesland}-Programme`,
    ], 31),

    foerderungBausteine: p([
      `Alle Förder-Bausteine für ${city.name} im Überblick`,
      `Welche KfW-Boni gelten in ${city.name}?`,
      `Förderquoten für Hausbesitzer in ${city.name}`,
      `KfW BEG in ${city.name}: Grundförderung, Boni und Kombinationen`,
    ], 32),

    foerderungProzess: p([
      `Schritt für Schritt zur Förderung in ${city.name}`,
      `So beantragen Sie die KfW-Förderung in ${city.name} richtig`,
      `Der richtige Ablauf — Förderung in ${city.name} nicht verpassen`,
      `KfW-Antrag in ${city.name}: Was Sie beachten müssen`,
    ], 33),

    klimadaten: p([
      `Klimadaten ${city.name}: JAZ ${jaz} und Effizienzwerte`,
      `Wärmepumpe ${city.name} — stadtspezifische Jahresarbeitszahl`,
      `Wie effizient läuft eine WP in ${city.name}? Die Zahlen`,
      `Standortanalyse ${city.name}: Was die Klimadaten für Ihre WP bedeuten`,
    ], 34),

    kosten: p([
      `Was kostet eine Wärmepumpe in ${city.name} wirklich?`,
      `Vollständige Kostenaufstellung: WP in ${city.name}`,
      `Investition und Betrieb — Ihre Wärmepumpe in ${city.name}`,
      `Wärmepumpen-Kosten ${city.name}: Gesamtrechnung 2026`,
    ], 35),

    vergleich: p([
      `WP vs. Gasheizung in ${city.name}: Was rechnet sich?`,
      `Heizung tauschen in ${city.name}: Welche Option ist besser?`,
      `Wärmepumpe oder weiter Gas in ${city.name}?`,
      `Kostenvergleich: WP vs. Gas in ${city.name} bis 2035`,
    ], 36),

    typen: p([
      `Welche Wärmepumpe passt zu ${city.name}?`,
      `Die drei WP-Typen für ${city.name} im Vergleich`,
      `Luft-, Sole- oder Wasser-WP — was ist richtig für ${city.name}?`,
      `WP-Typen ${city.name}: Vor- und Nachteile im Überblick`,
    ], 37),

    installateur: p([
      `Geprüfte WP-Betriebe in ${city.name} finden`,
      `Worauf kommt es beim Installateur in ${city.name} an?`,
      `Der richtige Fachbetrieb für Ihre WP in ${city.name}`,
      `WP-Installateur ${city.name}: Qualität erkennen und vergleichen`,
    ], 38),

    eignung: p([
      `Ist Ihr Haus in ${city.name} für eine Wärmepumpe geeignet?`,
      `WP-Eignung in ${city.name}: Die entscheidenden Faktoren`,
      `Eignungscheck für Ihre Immobilie in ${city.name}`,
      `Für welche Gebäude in ${city.name} eignet sich eine WP?`,
    ], 39),

    prozess: p([
      `So läuft die WP-Installation in ${city.name} ab`,
      `Von der Anfrage zur fertigen WP in ${city.name}: Der Ablauf`,
      `Schritt für Schritt zur Wärmepumpe in ${city.name}`,
      `WP-Einbau in ${city.name}: Prozess und Zeitplan`,
    ], 40),

    wirtschaftlichkeit: p([
      `Lohnt sich eine Wärmepumpe in ${city.name} finanziell?`,
      `Wirtschaftlichkeit der WP in ${city.name} über 20 Jahre`,
      `Amortisation und Ersparnis: WP in ${city.name} rechnet sich`,
      `So viel sparen Sie mit einer Wärmepumpe in ${city.name}`,
    ], 41),
  };
}

// ── 6. SECTION INTROS (variierende Einstiegssätze nach H2s) ──────────────────
//    Erhöht inhaltliche Uniqueness der Fließtext-Abschnitte deutlich.

export interface SectionIntros {
  klimadaten:         string;
  foerderung:         string;
  kosten:             string;
  vergleich:          string;
  installateur:       string;
  typen:              string;
  eignung:            string;
  wirtschaftlichkeit: string;
}

export function getSectionIntros(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): SectionIntros {
  const e = (n: number) => n.toLocaleString('de-DE') + '\u00a0€';
  const p = <T>(arr: T[], salt: number): T => arr[cityHash(city, arr.length, salt + 50)];

  return {
    klimadaten: p([
      `In ${city.name} bestimmen ${city.heizgradtage} Heizgradtage und ${city.avgTemp}°C Jahresmitteltemperatur die Effizienz Ihrer Wärmepumpe. Bei diesen Bedingungen erreicht eine Luft-WP eine JAZ von ${jaz} — das bedeutet: ${jaz} kWh Wärme aus jeder eingesetzten kWh Strom.`,
      `Die Klimadaten für ${city.name} im Detail: ${city.avgTemp}°C Jahrestemperatur, ${city.normAussentemp}°C Norm-Außentemperatur (DIN EN 12831) und ${city.strompreis} ct/kWh Strompreis. Damit ist ${city.name} ein ${city.avgTemp >= 10 ? 'mild-temperierter' : city.avgTemp >= 8 ? 'typisch mitteleuropäischer' : 'etwas kälterer'} Standort — JAZ ${jaz} ist das Ergebnis für diese konkreten Bedingungen.`,
      `Was macht ${city.name} als WP-Standort aus? ${city.heizgradtage} Heizgradtage definieren den Jahres-Wärmebedarf, ${city.avgTemp}°C Jahresmittel bestimmt die erreichbare Effizienz. JAZ ${jaz} bedeutet: Aus 1 kWh Strom werden ${jaz} kWh Wärme — günstiger als jede Verbrennung.`,
      `Stadtspezifische Klimadaten für ${city.name} (${city.bundesland}): Jahresmittel ${city.avgTemp}°C, ${city.heizgradtage} Heizgradtage, Normaußentemperatur ${city.normAussentemp}°C. Die JAZ von ${jaz} ergibt sich direkt aus diesen lokalen Werten — kein pauschaler Bundesschnitt, sondern die reale Effizienz an Ihrem Standort.`,
    ], 0),

    foerderung: p([
      `Die KfW-Bundesförderung (Programm 458) gilt ohne Ausnahme in ganz Deutschland — also auch in ${city.name}. Entscheidend: Der Antrag muss zwingend vor Beauftragung des Betriebs und vor Baubeginn gestellt werden, sonst entfällt der Zuschuss vollständig.`,
      `In ${city.name} stehen Ihnen als selbstnutzender Eigenheimbesitzer bis zu 70% KfW-Zuschuss zu. Bei typischen Vollkosten von 25.000\u00a0€ bedeutet das bis zu 17.500\u00a0€ vom Staat — aber nur, wenn der KfW-Antrag vor dem ersten Spatenstich gestellt wurde.${city.bundeslandFoerderung ? ` Zusätzlich gibt es in ${city.bundesland}: ${city.bundeslandFoerderung}.` : ''}`,
      `KfW-Förderung in ${city.name}: Grundförderung 30% plus Klima-Speed-Bonus 20% (für Eigennutzer, die eine fossile Heizung ersetzen) ergibt 50% Basisförderung für die meisten Hausbesitzer. Mit Einkommensbonus (unter 40.000\u00a0€ netto/Jahr) steigt die Quote auf bis zu 70%.`,
      `${city.bundesland} und KfW: In ${city.name} gilt die Bundesförderung für effiziente Gebäude (BEG) uneingeschränkt. Für Eigennutzer, die eine Gas- oder Ölheizung durch eine WP ersetzen, sind 50–70% Zuschuss realistisch — der Eigenanteil startet bei rund ${e(Math.round(25000 * 0.30))}.`,
    ], 1),

    kosten: p([
      `Was kostet eine Wärmepumpe in ${city.name} wirklich? Die Vollkosten setzen sich aus Gerät, Montage, Hydraulik und Elektrik zusammen. Stadtspezifisch: ${city.strompreis} ct/kWh Strom und JAZ ${jaz} ergeben ${e(wpKosten)} Jahresbetriebskosten — deutlich weniger als die ${e(wpKosten + ersparnis)} mit Erdgas.`,
      `Für ${city.name}: Betriebskosten der WP sind direkt vom lokalen Strompreis (${city.strompreis} ct/kWh) und der erreichbaren JAZ (${jaz}) abhängig. Das ergibt ${e(wpKosten)} pro Jahr — gegenüber ${e(wpKosten + ersparnis)} mit Erdgas. Die Jahresersparnis: ${e(ersparnis)}.`,
      `Alle WP-Kosten für ${city.name} im Überblick: Die Investition amortisiert sich durch die jährliche Ersparnis von ${e(ersparnis)} gegenüber Gas. Nach der KfW-Förderung (bis 70%) ist der Eigenanteil bei den meisten Hausbesitzern in ${city.name} in 7–12 Jahren wieder eingespielt.`,
      `Stadtspezifische Kalkulation für ${city.name}: Strompreis ${city.strompreis} ct/kWh, JAZ ${jaz}, Gaspreis ${city.gaspreis} ct/kWh. Ergibt ${e(ersparnis)} Jahresersparnis — die Grundlage für alle unsere Kostenberechnungen, speziell für ${city.name} ermittelt.`,
    ], 2),

    vergleich: p([
      `Der direkte Vergleich für ${city.name}: WP vs. Gasheizung. Bei ${city.strompreis} ct/kWh Strom, JAZ ${jaz} und ${city.gaspreis} ct/kWh Gas liegt die WP mit ${e(ersparnis)} Jahresersparnis vorne — und der Vorsprung wächst jährlich durch den steigenden CO₂-Preis auf Gas.`,
      `In ${city.name} kostet Heizen mit WP ${e(wpKosten)}/Jahr, mit Gas ${e(wpKosten + ersparnis)}/Jahr. Die Differenz von ${e(ersparnis)} wird durch jährlich steigende CO₂-Kosten auf Gas weiter zunehmen — das Umweltbundesamt rechnet bis 2030 mit über 100\u00a0€/t CO₂.`,
      `Für Hausbesitzer in ${city.name}: Eine Gasheizung ist kurzfristig günstiger installiert, aber langfristig teurer im Betrieb. Die WP kehrt dieses Verhältnis um — stabile Betriebskosten von ${e(wpKosten)}/Jahr, kein CO₂-Risiko, GEG-konform ohne Einschränkungen.`,
      `Die Zahlen für ${city.name}: Gaspreis ${city.gaspreis} ct/kWh plus steigender CO₂-Aufschlag, WP-Betriebskosten stabil bei ${e(wpKosten)}/Jahr. Der Wechsel zur Wärmepumpe rechnet sich — zumal das GEG ohnehin eine Entscheidung erzwingt.`,
    ], 3),

    installateur: p([
      `In ${city.name} und Umgebung gibt es geprüfte Fachbetriebe, die alle KfW-Voraussetzungen erfüllen. Wichtig: Nur im KfW-Portal registrierte Lieferanten- und Leistungserbringer (LuL) berechtigen zur BEG-Förderung — nicht jeder SHK-Betrieb hat diese Zulassung.`,
      `Für ${city.name}: Wir vermitteln ausschließlich HWK-eingetragene Meisterbetriebe mit nachweisbarer WP-Erfahrung. Jeder Betrieb ist als KfW-LuL registriert — die Pflichtvoraussetzung dafür, dass Sie Ihre Förderung auch erhalten.`,
      `Installateure in ${city.name}: Preisunterschiede von 20–40% zwischen Betrieben bei gleicher Leistung sind die Regel. Deshalb holen wir Ihnen bis zu 3 vollständige, direkt vergleichbare Angebote — kostenlos, von lokalen Betrieben in ${city.name}, innerhalb von 48 Stunden.`,
      `Lokale Fachbetriebe in ${city.name} kennen die Besonderheiten Ihrer Region: Anforderungen des Netzbetreibers, Lärmschutz-Auflagen in ${city.bundesland} und typische Gebäudesituationen. Das spart Zeit und vermeidet teure Überraschungen bei der Installation.`,
    ], 4),

    typen: p([
      `Drei Wärmepumpentypen stehen in ${city.name} zur Wahl: Luft-Wasser (92% Marktanteil, kein Erdreich nötig), Sole-Wasser (Erdwärme, höhere Effizienz, +5% KfW-Bonus) und Wasser-Wasser (höchste JAZ, Grundwasserrecht nötig). Für die meisten Häuser in ${city.name} ist die Luft-WP die beste Kosten-Nutzen-Entscheidung.`,
      `Welcher WP-Typ ist der richtige für ${city.name}? Bei ${city.avgTemp}°C Jahresmittel erreicht eine Luft-WP eine JAZ von ${jaz}. Die Sole-WP käme auf JAZ ${(jaz + 0.8).toFixed(1)} — höhere Effizienz, aber auch höhere Investitionskosten durch die Tiefenbohrung.`,
      `In ${city.name} (${city.bundesland}) ist die Luft-Wasser-Wärmepumpe für die meisten Einfamilienhäuser die wirtschaftlichste Wahl: keine Erdarbeiten, schnelle Montage (1–2 Tage), JAZ ${jaz} bei Ihrem Klima, und Förderung genauso attraktiv wie bei Erdwärmepumpen.`,
      `Die Wahl des WP-Typs in ${city.name} hängt von Grundstück, Budget und gewünschter Effizienz ab. Luft-WP startet nach 50% KfW unter ${e(Math.round(15000 * 0.50))}, Sole-WP unter ${e(Math.round(32000 * 0.50))} — dafür mit JAZ ${(jaz + 0.8).toFixed(1)} statt ${jaz}. Wir helfen Ihnen, die richtige Entscheidung zu treffen.`,
    ], 5),

    eignung: p([
      `Die meisten Häuser in ${city.name} sind für eine Wärmepumpe geeignet. Entscheidend ist die benötigte Vorlauftemperatur: Unter 55°C → Standard-WP, bis 70°C → Hochtemperatur-WP. Ein hydraulischer Abgleich (KfW-Pflicht, €500–1.500) senkt die nötige Vorlauftemperatur häufig um 5–10°C.`,
      `WP-Eignung in ${city.name}: BWP-Daten zeigen, dass 70–80% aller Bestandsgebäude ohne große Umbaumaßnahmen für eine Wärmepumpe geeignet sind. Die häufigste Voraussetzung: ausreichend Platz für die Außeneinheit (ca. 1 m²) und ein Aufstellort mit ${city.bundesland}-konformem Lärmabstand.`,
      `Für Ihren Haustyp in ${city.name}: Einfamilienhäuser mit Garten haben im Regelfall optimale Bedingungen — viel Platz, weniger Lärmkonflikte mit Nachbarn. In dichter Bebauung prüfen wir die Aufstellsituation vorab, damit es keine Überraschungen gibt.`,
      `Ist Ihr Haus in ${city.name} geeignet? Die zwei häufigsten Hindernisse sind eine zu hohe Vorlauftemperatur (lösbar mit Hochtemperatur-WP) und zu wenig Platz für die Außeneinheit (selten ein Problem). Wir klären beides im kostenlosen Erstgespräch.`,
    ], 6),

    wirtschaftlichkeit: p([
      `Die Zahlen für ${city.name} sprechen eine eindeutige Sprache: ${e(ersparnis)} Jahresersparnis gegenüber Erdgas, KfW-Förderung bis 70% und eine Lebensdauer von 20–25 Jahren. Nach der Amortisation läuft die WP auf Ihren Gewinn — jedes Jahr ${e(ersparnis)} mehr in der Tasche.`,
      `Wirtschaftlichkeit in ${city.name}: Bei ${city.strompreis} ct/kWh Strom, JAZ ${jaz} und ${city.gaspreis} ct/kWh Gas ergibt sich eine jährliche Ersparnis von ${e(ersparnis)}. Nach Förderung amortisiert sich die Investition in typischerweise 7–12 Jahren. Gesamtgewinn über 20 Jahre: ca. ${e(ersparnis * 20)}.`,
      `Für ${city.name} gilt: Die WP ist eine sichere Investition — keine CO₂-Preis-Abhängigkeit wie bei Gas, stabile Betriebskosten von ${e(wpKosten)}/Jahr und eine Wertsteigerung der Immobilie durch GEG-Konformität. Gesamtgewinn nach 20 Jahren Nutzung: ${e(Math.round(ersparnis * 20 - 25000 * 0.45))}.`,
      `Die Wirtschaftlichkeit der WP in ${city.name} auf 20 Jahre: Ersparnis ${e(ersparnis * 20)} minus Eigenanteil nach 55% KfW (${e(Math.round(25000 * 0.45))}) ergibt ${e(Math.round(ersparnis * 20 - 25000 * 0.45))} Nettogewinn. Steigende Gaspreise durch den CO₂-Preis sind dabei noch nicht eingerechnet.`,
    ], 7),
  };
}

// ── AKTUALITÄTSBLOCK 2026 ─────────────────────────────────────────────────
// Injiziert 6 kritische 2026-Facts pro Stadtseite, vollständig city-variiert.
// Verhindert Duplicate Content: cityHash(salt=99) → andere Variante pro Stadt.

export function getActualityBlock(
  city: City,
  keyword: { slug: string },
  jaz: number,
  wpKosten: number,
  eigenanteil: number,
): {
  gegReform: string;
  laerm10db: string;
  steuerAbsetz: string;
  kfwKredit: string;
  wartungskosten: string;
  finanzierung: string;
} {
  const e = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const h = (s: number) => cityHash(city, 4, s);

  const gegReformPool = [
    `GEG-Reform 2026 in ${city.name}: Die neue Bundesregierung plant, die 65%-EE-Pflicht ab Juli 2026 zu streichen. Für Sie ändert sich trotzdem nichts — die KfW-Förderung (bis 70%, bis 2029 gesichert) läuft unabhängig davon weiter. Wer jetzt handelt, sichert sich die aktuell historisch hohen Fördersätze.`,
    `Was die GEG-Reform für ${city.name} bedeutet: Die 65%-Erneuerbare-Pflicht entfällt voraussichtlich Mitte 2026. Das ändert aber nichts an der Wirtschaftlichkeit der Wärmepumpe — Betriebskosten ${e(wpKosten)}/Jahr vs. Gas mit jährlich steigendem CO₂-Preis. Die KfW-Förderung bleibt mindestens bis 2029 stabil.`,
    `GEG-Änderung 2026: Der neue Koalitionsvertrag sieht vor, die Einbaupflicht für 65% erneuerbare Energien zu lockern. Die KfW-Förderung für Wärmepumpen in ${city.name} bleibt davon unberührt und ist bis 2029 gesichert. Für Eigentümer, die jetzt wechseln, ist das eine Gelegenheit — der Klima-Speed-Bonus von 20% gilt nur beim Ersatz noch funktionierender fossiler Heizungen.`,
    `Reform des Heizungsgesetzes 2026: Die 65%-EE-Regel für neue Heizungen wird voraussichtlich ab Juli 2026 gestrichen. Für ${city.name} ändert das die Förderlage nicht: KfW-Programm 458 läuft weiter, Eigenanteil ab ${e(Math.round(eigenanteil))} nach Förderung. Wer wartet, riskiert steigende CO₂-Aufschläge auf Gas von aktuell €55/t Richtung €100/t bis 2030.`,
  ];

  const laerm10dbPool = [
    `Neue Lärmvorschrift ab 01.01.2026 in ${city.name}: Luft-Wasser-Wärmepumpen sind nur noch KfW-förderfähig, wenn das Außengerät mindestens 10 dB unter dem gesetzlichen Grenzwert liegt (vorher: 5 dB). Moderne Geräte wie Vaillant aroTHERM Plus, Stiebel Eltron WPL oder Viessmann Vitocal erfüllen das problemlos. Ältere Modelle nicht mehr — achten Sie auf den KEYMARK-Zertifizierungsnachweis.`,
    `Lärmregel 2026 für Wärmepumpen in ${city.name}: Seit 1. Januar 2026 schreibt das KfW-Förderprogramm vor, dass Luft-WP-Außengeräte 10 dB (statt bisher 5 dB) unter dem gesetzlichen Grenzwert liegen müssen. Je nach Leistungsklasse gilt: max. 55–78 dB(A). In ${city.bundesland} gilt zusätzlich die TA-Lärm: 45 dB(A) tags / 35 dB(A) nachts an der Grundstücksgrenze.`,
    `Schallschutz 2026 in ${city.name}: Neue KfW-Anforderung — nur Geräte mit ≥10 dB Unterschreitung des gesetzlichen Lärmgrenzwerts werden noch gefördert. Praktisch bedeutet das: Alle aktuellen Markengeräte (Vaillant, Stiebel, Bosch, Viessmann) erfüllen die Anforderung. Aufstellort trotzdem prüfen: Mindestabstand zur Nachbargrenze in ${city.bundesland} beachten.`,
    `WP-Lärmschutz neu 2026: Das KfW-Programm 458 verlangt seit Jahresbeginn 10 dB Sicherheitsabstand zum Grenzwert — der Wert wurde gegenüber 2025 verdoppelt. In ${city.name} gilt: Aufstellung in Hausnähe bevorzugen, Außeneinheit mit Schallschutzelementen abschirmen, TA-Lärm-Nachweis für Grenzlage-Installationen bereithalten. Wir prüfen Ihren Aufstellort vorab kostenlos.`,
  ];

  const steuerAbsetzPool = [
    `Steuerliche Absetzbarkeit in ${city.name}: Unabhängig von KfW können Sie 20% der Arbeitskosten der WP-Installation direkt von der Steuerschuld abziehen — maximal €1.200 pro Jahr (§35a EStG). Bei typischen Arbeitskosten von €4.000–6.000 bedeutet das €800–1.200 weniger Steuer im Jahr der Installation. Kumuliert mit KfW-Förderung der größten legale Spareffekt.`,
    `§35a EStG für ${city.name}: Haushaltsnahe Handwerkerleistungen (inkl. WP-Montage) → 20% der Lohnkosten, max. €1.200/Jahr von der Steuerschuld abziehbar. Das Gebäude muss älter als 10 Jahre sein. Kombinierbar mit dem KfW-Zuschuss — die steuerliche Abschreibung und die KfW-Förderung können gleichzeitig genutzt werden.`,
    `Heizung steuerlich absetzen in ${city.name}: Handwerkerarbeiten bei der WP-Installation sind zu 20% (max. €1.200/J.) direkt von der Steuerschuld absetzbar — nicht nur als Werbungskosten, sondern direkt von der Zahllast. Bei energetischer Sanierung (§35c) sogar 20% der Gesamtkosten über 3 Jahre, max. €40.000 Steuerersparnis bei Gebäuden ≥10 Jahre alt.`,
    `Steuervorteil WP ${city.name}: Neben KfW gibt es §35a-Steuerbonus für Handwerkerleistungen: 20% der Montagekosten (max. €1.200/Jahr). Zusätzlich §35c für energetische Sanierung: 20% der Gesamtkosten über 3 Jahre, max. €40.000. Wichtig: §35a und §35c können nicht gleichzeitig für dieselbe Maßnahme genutzt werden — wir beraten kostenlos zur optimalen Kombination.`,
  ];

  const kfwKreditPool = [
    `KfW-Ergänzungskredit für ${city.name}: Zusätzlich zum Zuschuss (bis €21.000) gibt es den KfW-Ergänzungskredit mit effektiv 2,8–4,5% p.a. (Stand 2026), bis zu €150.000 je Wohneinheit. Der Kredit deckt Kosten ab, die über das Förderlimit hinausgehen — ideal bei Erdwärme-Systemen oder umfangreichen Sanierungsbegleitmaßnahmen in ${city.name}.`,
    `Günstige Finanzierung in ${city.name}: KfW-Programm 358/359 „Bundesförderung für effiziente Gebäude – Kredit" ergänzt den Zuschuss. Effektivzins aktuell 2,8–4,5%, bis €150.000 Kredithöhe, kombinierbar mit dem BEG-Zuschuss. Für die meisten Haushalte in ${city.bundesland} reicht der Zuschuss — bei größeren Projekten rechnen wir beides durch.`,
    `WP-Finanzierung über KfW in ${city.name}: Wer den Eigenanteil (ab ${e(Math.round(eigenanteil))}) nicht sofort aufbringen kann, nutzt den KfW-Ergänzungskredit: Zinsbindung 5–10 Jahre, bis €150.000, tilgungsfreie Anlaufjahre möglich. In Kombination mit dem KfW-Zuschuss ist das die günstigste Finanzierungslösung für Wärmepumpen in ${city.bundesland}.`,
    `Zinskredit KfW + Zuschuss für ${city.name}: Das KfW-System funktioniert zweigleisig — Zuschuss (bis 70% = max. €21.000) PLUS Kredit zu 2,8–4,5% für den Restkostenbetrag. Vorteil: Beide können kombiniert werden. Die Kreditzusage läuft parallel zum Zuschussantrag. Wir helfen beim KfW-Antrag in ${city.name} kostenlos.`,
  ];

  const wartungsPool = [
    `Betriebskosten nach Einbau in ${city.name}: Wartung €150–300/Jahr (jährliche Inspektion empfohlen). Verdichtertausch nach 10–15 Jahren: €2.000–5.000. Seit 01.01.2026 gesetzliche Dichtheitsprüfung für Anlagen mit >3 kg Kältemittel. Gesamtbetriebskosten über 20 Jahre inkl. Strom (${e(wpKosten)}/J.) und Wartung: ca. ${e(Math.round((wpKosten + 250) * 20))}.`,
    `Was eine WP in ${city.name} wirklich kostet (20 Jahre): Strom ${e(wpKosten)}/Jahr, Wartung ca. €200/Jahr, Verdichter nach 12–15 Jahren ca. €3.500 → Gesamtbetriebskosten ca. ${e(Math.round((wpKosten + 200) * 20 + 3500))} über 20 Jahre. Zum Vergleich: Gasheizung ca. ${e(Math.round((wpKosten + 800) * 20))} (ohne CO₂-Preissteigerung). Ersparnis: ca. ${e(Math.round(800 * 20))}.`,
    `Langzeitkosten WP in ${city.name}: Wartungsvertrag €150–400/J., Verdichter-Reserve nach Jahr 12–15: €2.000–5.000. Wichtig: Seit 2026 jährliche Dichtheitsprüfung bei Anlagen mit mehr als 3 kg Kältemittel gesetzlich vorgeschrieben. Eine Betriebsversicherung (€100–200/Jahr) sichert gegen Ausfälle nach Herstellergarantie ab.`,
    `Wartungskosten WP ${city.name}: €150–300/Jahr für Jahresinspektion (Kältemittelstand, Ventile, Steuerung, hydraulischer Abgleich-Check). Verdichter: 10–15 Jahre Laufzeit → Austausch €2.000–5.000. Nennleistung-Überprüfung alle 5 Jahre sinnvoll. Wer einen Wartungsvertrag ab Installation abschließt, erhält oft vergünstigte Konditionen und bevorzugte Termine in ${city.bundesland}.`,
  ];

  const finanzierungPool = [
    `Wärmepumpe finanzieren in ${city.name}: Keine Sofort-Eigenkapital nötig. KfW-Ergänzungskredit zu 2,8–4,5%, ab ca. €89/Monat auf 10 Jahre bei ${e(Math.round(eigenanteil))} Eigenanteil. Alternative: Ratenkauf über Installateur. Faustregel: Wer aktuell €150+/Monat für Gas zahlt, heizt mit WP günstiger — auch ohne Eigenkapital.`,
    `WP-Finanzierung für ${city.name}: Der KfW-Ergänzungskredit ermöglicht monatliche Raten ab ca. €100 auf ${e(Math.round(eigenanteil))} Eigenanteil (10 Jahre Laufzeit, 2,8–4,5% Effektivzins). Viele Installateure in ${city.bundesland} bieten eigene Finanzierungsmodelle. Wichtig: Die monatliche Finanzierungsrate liegt oft unter der aktuellen Gasrechnung.`,
    `Heizung tauschen ohne Eigenkapital in ${city.name}: KfW-Kombination macht's möglich. Zuschuss: bis €21.000 sofort abziehen. Restbetrag: KfW-Kredit zu günstigen Konditionen. Bei ${e(Math.round(eigenanteil))} Eigenanteil und 10 Jahren Laufzeit: ca. €100–120/Monat. Aktuelle Gaskosten in ${city.name} bei ${city.gaspreis} ct/kWh oft höher — WP lohnt sich ab Tag 1.`,
    `Finanzierungsoptionen in ${city.name}: (1) KfW-Ergänzungskredit: bis €150.000, 2,8–4,5%, bis 30 Jahre Laufzeit. (2) Installateurfinanzierung: oft 0%-Finanzierung im ersten Jahr. (3) Eigenkapital + maximaler Zuschuss: schnellste Amortisation. Unser kostenloser Finanzierungs-Check zeigt, welche Option für Ihr Budget in ${city.bundesland} am sinnvollsten ist.`,
  ];

  return {
    gegReform:      gegReformPool[h(99)],
    laerm10db:      laerm10dbPool[h(100)],
    steuerAbsetz:   steuerAbsetzPool[h(101)],
    kfwKredit:      kfwKreditPool[h(102)],
    wartungskosten: wartungsPool[h(103)],
    finanzierung:   finanzierungPool[h(104)],
  };
}


// ── 7. UNIQUE LOCAL PARAGRAPH — gegen Duplicate Content ──────────────────────
// Generiert einen EINZIGARTIGEN Absatz pro Stadt, der nicht woanders vorkommt.
// Nutzt 6+ stadtspezifische Datenpunkte → nahezu unmöglich zu duplizieren.

export function getUniqueLocalParagraph(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): string {
  const sz = getCitySize(city);
  const kl = getKlimaZone(city);
  const pr = getPreisRegion(city);
  const e = (n: number) => n.toLocaleString('de-DE') + '\u00a0€';

  // Einleitungssatz variiert nach Stadtgröße
  const intros: Record<CitySize, string> = {
    metropole: `${city.name} gehört mit ${city.einwohner.toLocaleString('de-DE')} Einwohnern zu den größten Städten in ${city.bundesland}`,
    grossstadt: `${city.name} ist mit ${city.einwohner.toLocaleString('de-DE')} Einwohnern eine wichtige Großstadt in ${city.bundesland}`,
    mittelstadt: `${city.name} (${city.einwohner.toLocaleString('de-DE')} Einwohner) liegt im Herzen von ${city.bundesland}`,
    kleinstadt: `Die Gemeinde ${city.name} (${city.einwohner.toLocaleString('de-DE')} Einwohner) in ${city.bundesland}`,
  };

  // Klimacharakter
  const klimaChar: Record<KlimaZone, string> = {
    warm: `mit mildem Klima (${city.avgTemp}°C Jahresmittel) und nur ${city.heizgradtage} Heizgradtagen — ideale Bedingungen für eine hocheffiziente Wärmepumpe`,
    mittel: `mit gemäßigtem Klima (${city.avgTemp}°C Jahresmittel) und ${city.heizgradtage} Heizgradtagen — sehr gute Voraussetzungen für eine Wärmepumpe`,
    kalt: `mit kühleren Wintern (${city.avgTemp}°C Jahresmittel, ${city.heizgradtage} HGT) — eine fachgerecht dimensionierte Wärmepumpe arbeitet hier zuverlässig`,
    sehr_kalt: `mit kälterem Klima (${city.avgTemp}°C Jahresmittel, ${city.heizgradtage} HGT) — eine leistungsstarke Wärmepumpe braucht hier präzise Dimensionierung`,
  };

  // Preiskontext
  const preisCtx: Record<PreisRegion, string> = {
    guenstig: `Der lokale Strompreis von ${city.strompreis}\u00a0ct/kWh liegt unter dem Bundesdurchschnitt, was die WP-Betriebskosten auf nur ${e(wpKosten)} pro Jahr drückt`,
    mittel: `Beim Strompreis von ${city.strompreis}\u00a0ct/kWh liegen die WP-Betriebskosten bei ${e(wpKosten)} pro Jahr`,
    teuer: `Trotz des höheren Strompreises von ${city.strompreis}\u00a0ct/kWh sind die WP-Betriebskosten mit ${e(wpKosten)} pro Jahr deutlich unter Gas (${e(wpKosten + ersparnis)})`,
  };

  // Gebäudekontext
  const gebaeude = city.efhQuote >= 60
    ? `Mit einem Einfamilienhausanteil von ${city.efhQuote}% bietet ${city.name} optimale Voraussetzungen — EFH sind der Hauptmarkt für Luft-Wasser-Wärmepumpen.`
    : `In ${city.name} liegt der EFH-Anteil bei ${city.efhQuote}% — sowohl für Ein- als auch Mehrfamilienhäuser gibt es passende WP-Lösungen.`;

  // Sonnenstunden-Kontext
  const solar = city.avgSunHours >= 1700
    ? `Mit ${city.avgSunHours} Sonnenstunden pro Jahr ist ${city.name} zudem ein attraktiver Standort für die Kombination WP + Photovoltaik.`
    : city.avgSunHours >= 1500
      ? `${city.avgSunHours} Sonnenstunden/Jahr machen eine WP+PV-Kombination in ${city.name} wirtschaftlich sinnvoll.`
      : `Auch bei ${city.avgSunHours} Sonnenstunden/Jahr kann eine PV-Anlage in ${city.name} die WP-Betriebskosten spürbar senken.`;

  // Förderkontext Bundesland
  const foerder = city.bundeslandFoerderung
    ? `Neben der KfW-Bundesförderung bietet ${city.bundesland} mit dem Programm „${city.bundeslandFoerderung}" (${city.bundeslandFoerderungBetrag}) eine zusätzliche Fördermöglichkeit.`
    : `In ${city.bundesland} gilt die KfW-Bundesförderung (bis 70%) ohne weitere Landesauflagen — unkompliziert und planbar.`;

  return `${intros[sz]} — ${klimaChar[kl]}. ${preisCtx[pr]}. ${gebaeude} ${solar} ${foerder}`;
}


// ── 8. INTERNE VERLINKUNG — kontextualisierte Nachbar-Stadt-Links ────────────
// Statt generischer "Weitere Städte" → Keyword-spezifischer Ankertext

export function getNearbyLinkContext(
  city: City,
  nearby: City[],
  keyword: Keyword,
  jaz: number,
): Array<{ city: City; text: string; url: string }> {
  const kwName = keyword.keyword.replace('[Stadt]', '').trim();

  return nearby.slice(0, 6).map(nc => ({
    city: nc,
    text: `${kwName} in ${nc.name}`,
    url: `/${keyword.slug}/${nc.slug}`,
  }))
}

// ════════════════════════════════════════════════════════════════════════════════
// EXTENDED CONTENT VARIATION SYSTEM — Massive Expansion
// 8 neue Funktionen für tiefere Lokalisierung und Einzigartigkeit
// ════════════════════════════════════════════════════════════════════════════════

// ── 9. BUNDESLAND-SPEZIFISCHE TIEFENPARAGRAPHEN ──────────────────────────────────
// Jedes Bundesland 3–4 unique Varianten mit spezifischen Policies, Geographie, Geschichte

export function getBundeslandParagraph(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): string {
  const bundeslandTexts: Record<string, string[]> = {
    'Bayern': [
      `${city.name} liegt im Freistaat Bayern — einem Bundesland mit strengen Energiestandards und dem Bayerisches Klimaschutzgesetz als Rahmen. Die alpinen Regionen um ${city.name} erleben oft kältere Winter, was die Jahresarbeitszahl von ${jaz} gerade dort wertvoll macht. Mit ${city.heizgradtage} Heizgradtagen ist eine Wärmepumpe in Bayern ein stabiler Wirtschaftsfaktor für Hausbesitzer: ${fmtEuro(ersparnis)} Jahresersparnis, Fördersätze bis 70% KfW. Bayern fördert zudem Wärmepumpen in Bestandsimmobilien — Ziel sind 50% WP-Anteil bis 2030.`,
      `In Bayern profitiert ${city.name} von der strengsten Bauenergieregelwerk Deutschlands. Das bedeutet: Neubauten müssen ohnehin mit erneuerbaren Wärmequellen heizen, Altbauten bekommen Förderung für den Umstieg. Der lokale Strompreis ${city.strompreis} ct/kWh und die Voralpinen Bedingungen machen eine Wärmepumpe mit JAZ ${jaz} zur idealen Lösung. Ersparnis: ${fmtEuro(ersparnis)} pro Jahr, 15–18 Jahre Amortisationszeit.`,
      `Das Bayerische Klimaschutzgesetz schreibt vor: Heizungsanlagen in Neubauten müssen zu min. 65% aus erneuerbaren Energien versorgt werden. ${city.name} in Bayern ist deshalb ein Wärmepumpen-Hochburgland. Mit ${city.avgTemp}°C Jahresmittel und einer erreichbaren JAZ von ${jaz} sind WP-Kosten von ${fmtEuro(wpKosten)} pro Jahr sogar unter bundesweiten Durchschnitten — trotz der alpinen Klimabedingungen. Bayern zahlt bis zu 70% Zuschuss über KfW.`,
      `Bayern hat die straffeste Förderlandschaft Deutschland-weit: KfW bis 70%, dazu das Merkblatt für Wärmeerzeuger mit erneuerbaren Energien. ${city.name} nutzt diese Förderkulisse ideal: Mit ${city.einwohner} Einwohnern ist die Stadt groß genug für Installateur-Netzwerke, das lokale Stromnetz mit ${city.strompreis} ct/kWh ist stabil, die Heizlast mit ${city.heizgradtage} Kd/a moderat. WP-Kosten: ${fmtEuro(wpKosten)}. Alle drei Jahre Wartung, 20 Jahre Lebensdauer — eine sichere Anlage.`,
    ],
    'Baden-Württemberg': [
      `Baden-Württemberg, die Wiege der Wärmepumpen-Technik: Der Maschinenbauzustand und die Innovationskraft haben hier die heute besten WP-Hersteller hervorbracht. ${city.name} profitiert doppelt: Erstens von lokaler Installateure-Dichte (zahlreiche Fachbetriebe vor Ort), zweitens von L-Bank-Förderung (Baden-Württemberg zahlt oft höher als KfW). Mit ${jaz} JAZ und ${city.strompreis} ct/kWh sind die Betriebskosten von ${fmtEuro(wpKosten)} p.a. sehr effizient. Ersparnis gegenüber Gas: ${fmtEuro(ersparnis)} pro Jahr.`,
      `Die Landesbank Baden-Württemberg (L-Bank) fördert Wärmepumpen oft besser als die KfW-Mindestsätze. {{city.name} im grünen Südwesten ist damit ein Premium-Markt für WP-Investitionen. Dazu kommen: {{city.heizgradtage}} Heizgradtage (mild), {{city.avgTemp}}°C Jahresmittel, {{city.strompreis}} ct/kWh Strompreis, eine erreichte JAZ von {{jaz}}. Die Rechnung: {{fmtEuro(ersparnis)}} Jahresersparnis, Amorität in 15 Jahren, danach freie Einnahmen für 5–10 weitere Jahre. Typische WP-Lebensdauer: 20–25 Jahre.`,
      `Baden-Württemberg ist Innovationsland Nummer Eins — und das spiegelt sich in der Wärmepumpen-Branche. {{city.name}} hat Zugang zu den besten Herstellern und Fachbetrieben bundesweit. Mit {{city.strompreis}} ct/kWh lokalem Stromtarif und {{city.heizgradtage}} Heizgradtagen liegt eine {{jaz}}-JAZ-WP im Sweet Spot. Geschätzter Gesamtertrag nach 20 Jahren Betrieb: {{fmtEuro(ersparnis * 20)}}. Förderquote: bis 70% KfW + L-Bank-Bonus.`,
      `Im Südwesten Deutschlands, Baden-Württemberg, beherbergt {{city.name}} eine ideale Infrastruktur: viele zertifizierte WP-Installateure, stabile Stromnetze, milde Winter, Förderunterstützung durch Land und Bund zusammen. Die Wärmepumpen-Einbauquote ist hier höher als im deutschen Durchschnitt. Kostenbilder: {{fmtEuro(wpKosten)}} Betriebskosten jährlich (statt {{fmtEuro(wpKosten + ersparnis)}} Gas), dazu bis zu 70% Investitionszuschuss. {{city.name}} ist damit ein Referenzmarkt für wirtschaftliche WP-Lösungen.`,
    ],
    'Nordrhein-Westfalen': [
      `Nordrhein-Westfalen, Deutschlands Industrie- und Bevölkerungsschwerpunkt — und {{city.name}} ist mittendrin. Das dichte Siedlungsmuster bedeutet: viele Nachbarn in Mehrfamilienhaus-Quartieren, hohe bauliche Dichte, oft kompakter Straßenraum. Hier glänzt die Luft-Wasser-Wärmepumpe: {{city.heizgradtage}} Heizgradtage, {{city.strompreis}} ct/kWh Strom, {{jaz}} JAZ ermöglichen {{fmtEuro(ersparnis)}} Jahresersparnis. Das Programm progres.nrw unterstützt mit bis zu 70% Förderung — ideal für NRW-Hausbesitzer.`,
      `Das Ruhrgebiet und {{city.name}} in NRW durchleben aktuell einen Transformations-Schub: Weg von Kohle, hin zu erneuerbaren Energien. Die Wärmepumpe ist der zentrale Baustein. Mit {{city.einwohner}} Einwohnern ist {{city.name}} groß genug für spezialisierte Installateure und Netzanbinder, aber dicht genug für Fernwärme-Szenarien. Kostenvergleich: WP {{fmtEuro(wpKosten)}}/a vs. Gas {{fmtEuro(wpKosten + ersparnis)}}/a. progres.nrw deckt 50–70% der Investitionskosten.`,
      `In Nordrhein-Westfalen ist der Strompreis mit {{city.strompreis}} ct/kWh im deutschlandweiten Mittel — weder besonders teuer noch besonders günstig. Das macht die WP-Wirtschaftlichkeit hier zu einer detaillierten Berechnung. {{city.name}} mit {{city.avgTemp}}°C Jahresmittel und {{city.heizgradtage}} Heizgradtagen erreicht mit Luft-Wasser eine realistische JAZ von {{jaz}}. Ergebnis: {{fmtEuro(ersparnis)}} Jahresersparnis. Förderung progres.nrw + KfW senkt Investition um 50–70%.`,
      `Das bevölkerungsreichste Bundesland, Nordrhein-Westfalen, hat die meisten Wärmepumpen-Installateure und damit niedrige Montagepreise. {{city.name}} profitiert von großer Konkurrenz und schnellen Bearbeitungszeiten. Parallel: Das Förderprogramm progres.nrw ist großzügig — bis 70% Kostenzuschuss für Wechsel von Gas zu WP. Betriebskosten {{fmtEuro(wpKosten)}}/Jahr, Gesamtersparnis über 20 Jahre {{fmtEuro(ersparnis * 20)}}. Amortisation: {{Math.round(ersparnis > 0 ? 18000 / ersparnis : 99)}} Jahre (typisch).`,
    ],
    'Hessen': [
      `Im Bundesland Hessen, wo {{city.name}} liegt, gibt es das Programm „Hessische Energiewende": Kommunen müssen bis 2030 klimaneutral sein, deshalb pushes Hessen Wärmepumpen aggressiv. Mit {{city.heizgradtage}} Heizgradtagen und {{city.strompreis}} ct/kWh Strom liegt {{city.name}} in der deutschlandweiten Effizienz-Oben-Mitte. Eine JAZ von {{jaz}} ist realistisch. Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis vs. Erdgas {{fmtEuro(ersparnis)}} pro Jahr. Hessen-Förderung + KfW: bis zu 70% Investitionszuschuss.`,
      `Hessen fördert den WP-Einbau im Altbau und Neubau über KfW (bis 70%) und zusätzliche Landesmittel. {{city.name}} ist eine hessische {{getCitySize(city)}}, mit {{city.einwohner}} Einwohnern und {{city.strompreis}} ct/kWh Stromtarif. Die Wärmepumpen-Gesamtbetrachtung: Jahreskosten {{fmtEuro(wpKosten)}} statt {{fmtEuro(wpKosten + ersparnis)}} Gas = {{fmtEuro(ersparnis)}} Ersparnis. 15–18 Jahre Amortisationszeit. 20–25 Jahre Lebensdauer. Danach: kostenlose Wärmeerzeugung (nur Strompreis).`,
      `In Hessen ist die Akzeptanz erneuerbarer Energien bei Hausbesitzern hoch. {{city.name}} hat deshalb ein großes lokales Netzwerk von geprüften WP-Installateuren. Mit {{city.avgTemp}}°C Jahresmitteltemperatur erreichen Luft-Wasser-Pumpen JAZ {{jaz}}. Das bedeutet bei {{city.heizgradtage}} Heizgradtagen: Jahresstromverbrauch {{Math.round((wpKosten / (city.strompreis / 100)))}}-{{Math.round((wpKosten / (city.strompreis / 100))) + 500}} kWh, Kosten {{fmtEuro(wpKosten)}}. Förderung: 50–70% KfW.`,
      `Hessen prägt sich dadurch aus, dass viele Gemeinden Wärmepumpen in ihrer Energieplanung vorsehen. {{city.name}} ist Teil dieser Strategie. Lokale Vorteile: {{getCitySize(city)}}-Klassifizierung bedeutet {{getCitySize(city) === 'metropole' ? 'große Installateure-Auswahl und schnelle Montage' : getCitySize(city) === 'grossstadt' ? 'gutes Fachbetrieb-Netzwerk' : 'zuverlässige Handwerksbetriebe mit WP-Erfahrung'}}, {{city.strompreis}} ct/kWh Lokalstrom, {{city.heizgradtage}} Heizgradtage. JAZ {{jaz}} bei {{fmtEuro(wpKosten)}} Betriebskosten und {{fmtEuro(ersparnis)}} Jahresersparnis.`,
    ],
    'Schleswig-Holstein': [
      `Im Norden, Schleswig-Holstein, ist die Wärmepumpe ideal angepasst an das marine Klima. {{city.name}} mit {{city.avgTemp}}°C Jahresmittel und {{city.heizgradtage}} Heizgradtagen profitiert von relativ stabilen, nicht extrem kalten Wintern. Luft-Wasser-Wärmepumpen erreichen hier JAZ {{jaz}} zuverlässig. Strompreis {{city.strompreis}} ct/kWh (oft günstig wegen Windkraft-Überfluss). Betriebskosten {{fmtEuro(wpKosten)}}/a, Ersparnis {{fmtEuro(ersparnis)}}/a. KfW-Förderung bis 70%.`,
      `Schleswig-Holstein nutzt Windenergie massiv — der Strompreis ist oft unter Bundesdurchschnitt. {{city.name}} profitiert von {{city.strompreis}} ct/kWh, was Wärmepumpen besonders attraktiv macht. Mit {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C Außentemp-Jahresmittel rechnet sich eine WP-Installation schnell. Kosten: {{fmtEuro(wpKosten)}} pro Jahr (Betrieb), Gegenüber Gas {{fmtEuro(wpKosten + ersparnis)}}. Netto-Ersparnisse nach 15 Jahren: {{fmtEuro(ersparnis * 15)}}.`,
      `Die Windland Schleswig-Holstein setzt auf Elektrifizierung der Heizung — damit decken sich Wärmepumpen und lokale Stromnetzpolitik perfekt. {{city.name}} ist hier ein Vorreiter-Standort. Gegebenheiten: {{city.strompreis}} ct/kWh (Windkraft-Vorteil), {{city.heizgradtage}} Heizgradtage, JAZ {{jaz}}. Betriebswirtschaft: {{fmtEuro(wpKosten)}} statt {{fmtEuro(wpKosten + ersparnis)}}. Förderquote KfW 50–70%. Installateur-Verfügbarkeit gut.`,
      `Schleswig-Holstein ist Windkraft-Hochburg und Vorreiter beim Heizwärmewechsel zu Strom/WP. {{city.name}} hat deshalb Zugang zu hochwertigen WP-Installateuren und moderaten Stromtarifen ({{city.strompreis}} ct/kWh). Mit {{city.heizgradtage}} Heizgradtagen ergibt sich für eine {{jaz}}-JAZ-WP Betriebskosten von {{fmtEuro(wpKosten)}}/Jahr. Gegenüber {{fmtEuro(wpKosten + ersparnis)}} für Gas = {{fmtEuro(ersparnis)}} Jahresersparnis. Über 20 Jahre: {{fmtEuro(ersparnis * 20)}} Gesamtertrag.`,
    ],
    'Thüringen': [
      `Thüringen, der Osten Deutschlands — {{city.name}} hat {{city.heizgradtage}} Heizgradtage und {{city.avgTemp}}°C Jahresmittel, was relative lange Heizsaison bedeutet. Dafür ist der Strompreis mit {{city.strompreis}} ct/kWh oft günstiger als in den West-Bundesländern. Wärmepumpe mit JAZ {{jaz}} erzielt Betriebskosten von {{fmtEuro(wpKosten)}}, also {{fmtEuro(ersparnis)}} weniger als Erdgas. Förderung: KfW bis 70%, Thüringen-Ergänzung prüfen.`,
      `Im Freistaat Thüringen ist die Energiewende pragmatisch ausgerichtet: Windkraft und WP gehen Hand in Hand. {{city.name}} hat Vorteil von gutem lokalem Strompreis ({{city.strompreis}} ct/kWh) wegen Windpark-Überangebot. Mit {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C liegt eine {{jaz}}-JAZ vor. Kosten: {{fmtEuro(wpKosten)}}/a Betrieb, {{fmtEuro(ersparnis)}}/a Ersparnis vs. Gas. Investition {{Math.round(18500)}}–{{Math.round(25500)}} EUR brutto, davon {{Math.round((18500 + 25500) / 2 * 0.6)}} EUR KfW-Zuschuss.`,
      `Thüringen fördert Wärmepumpen durch KfW und Landesebene. {{city.name}} mit {{city.strompreis}} ct/kWh Strompreis und {{city.heizgradtage}} Heizgradtagen ist ein solides WP-Investitionsfeld. JAZ {{jaz}}, Jahreskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Installateure vor Ort: gut verfügbar. Montagezeit ab Antrag: 8–12 Wochen (KfW muss vorher genehmigt sein).`,
      `Der Osten Deutschlands, Thüringen, setzt auf Wärmepumpen als Hebel für schnellen Ausstieg aus Kohle und Gas. {{city.name}} profitiert: niedriger Strompreis ({{city.strompreis}} ct/kWh), gute Fördersätze (KfW 50–70%), zuverlässige Handwerksbetriebe mit WP-Erfahrung. Betriebskosten {{fmtEuro(wpKosten)}}/Jahr bei {{jaz}} JAZ und {{city.heizgradtage}} Heizgradtagen. 15–18 Jahre Amortisationszeit. Lebensdauer WP: 20–25 Jahre.`,
    ],
    'Sachsen': [
      `Sachsen, die Rohstoff-Region Ostdeutschlands, entwickelt sich zur Wärmepumpen-Hochburg. {{city.name}} mit {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C Jahresmittel ist ideal für Luft-Wasser-WP. Strompreis {{city.strompreis}} ct/kWh (oft günstig). JAZ {{jaz}}, Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. KfW-Förderung bis 70%. Sächsische Handwerksbetriebe haben großes WP-Knowhow — schnelle Montage erwartet.`,
      `Im Freistaat Sachsen ist die Heizlast durch {{city.heizgradtage}} Heizgradtage definiert — eine lange, kühle Heizperiode. Gut, dass {{city.strompreis}} ct/kWh Stromtarif günstig ist. Eine Wärmepumpe mit {{jaz}} JAZ in {{city.name}} kostet {{fmtEuro(wpKosten)}} pro Jahr zu betreiben, gegenüber {{fmtEuro(wpKosten + ersparnis)}} für Erdgas. Netto-Vorteil: {{fmtEuro(ersparnis)}} Jahresersparnis. 20 Jahre Lebensdauer = {{fmtEuro(ersparnis * 20)}} Gesamtertrag.`,
      `Sachsens Heizwärmewende ist in vollem Gange — {{city.name}} hat viele Installateure mit WP-Know-how. Mit {{city.einwohner}} Einwohnern und {{getCitySize(city)}}-Status ist Montagezeit kurz (4–6 Wochen nach KfW-OK). Kostenrechnung: {{fmtEuro(wpKosten)}} WP-Betrieb vs. {{fmtEuro(wpKosten + ersparnis)}} Gas. Investition {{Math.round(18500)}}–{{Math.round(28000)}} EUR, Förderung KfW 50–70% ({{Math.round((18500 + 28000) / 2 * 0.6)}}–{{Math.round((18500 + 28000) / 2 * 0.7)}}) EUR).`,
      `Freistaat Sachsen hat eine hohe Konzentration von Wärmepumpen-Installateuren — Branchen-Knowhow ist exzellent. {{city.name}} mit {{city.avgTemp}}°C und {{city.heizgradtage}} Heizgradtagen errechnet realistische JAZ {{jaz}}. Strompreis {{city.strompreis}} ct/kWh (konkurrenzfähig). Betriebskosten {{fmtEuro(wpKosten)}}/a. Ersparnis {{fmtEuro(ersparnis)}}/a. 15–18 Jahre Break-Even, danach freie Ersparnisse bis Lebensende der Anlage (20–25 Jahre).`,
    ],
    'Hamburg': [
      `Die Freie Hansestadt Hamburg — {{city.name}} ist urbanes Zentrum mit {{city.einwohner}} Einwohnern. Das dichte Stadtbild bedeutet oft Mehrfamilienhaus-Lösungen und Fernwärme-Konkurrenz. Dennoch: Luft-Wasser-WP erreicht JAZ {{jaz}} mit {{city.strompreis}} ct/kWh, {{city.heizgradtage}} Heizgradtagen, {{city.avgTemp}}°C Jahresmittel. Kosten {{fmtEuro(wpKosten)}}/a vs. {{fmtEuro(wpKosten + ersparnis)}} Gas = {{fmtEuro(ersparnis)}} Jahresersparnis. KfW-Förderung bis 70%.`,
      `Hamburg als Metropole ({{city.einwohner}} Einwohner) bietet große Installateure-Dichte und schnelle Montage (4–6 Wochen). Mit {{city.strompreis}} ct/kWh Hamburger Stromtarif und {{city.heizgradtage}} Heizgradtagen rechnet sich eine JAZ-{{jaz}}-Wärmepumpe gut. Betriebskosten {{fmtEuro(wpKosten)}}, Gegenüber Fernwärme oder Gas {{fmtEuro(ersparnis)}} Jahresersparnis. Aber: In Hamburg ist Fernwärme oft konkurrenzfähig — Einzelfall-Analyse empfohlen.`,
      `Hamburg, die Handels-Hansestadt, hat moderne Energieinfrastruktur. {{city.name}} mit {{city.heizgradtage}} Heizgradtagen und {{city.strompreis}} ct/kWh-Tarif ist optimaler WP-Standort. JAZ {{jaz}}, Betriebskosten {{fmtEuro(wpKosten)}}/a. Förderung: KfW 50–70%, Hamburg zahlt teilweise Zusatzförderung. Installateure: viele hochspezialisierte Betriebe. Amortisationszeit {{Math.round(ersparnis > 0 ? 18000 / ersparnis : 99)}} Jahre.`,
      `Als Metropole mit {{city.einwohner}} Einwohnern bietet Hamburg {{city.name}} alle Vorzüge: spezialisierte WP-Fachbetriebe, schnelle Verfügbarkeit, hohe Qualitätsstandards. Strompreis {{city.strompreis}} ct/kWh, Heizgradtage {{city.heizgradtage}}, JAZ {{jaz}}, Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Über 20 Jahre: {{fmtEuro(ersparnis * 20)}} Gesamtertrag, dazu 20–25 Jahre Anlagensicherheit.`,
    ],
    'Berlin': [
      `Berlin, die Hauptstadt — {{city.name}} hat {{city.heizgradtage}} Heizgradtage und {{city.avgTemp}}°C Jahresmittel mit kontinentalem Klima (kalte Winter, milde Sommer). Luft-Wasser-WP erreicht JAZ {{jaz}}. Mit {{city.strompreis}} ct/kWh Berliner Stromtarif Betriebskosten {{fmtEuro(wpKosten)}}/a, Ersparnis {{fmtEuro(ersparnis)}} vs. Gas. KfW 50–70%, Berlin-Zusatzförderung prüfen. Metropolen-Vorteile: viele Installateure, schnelle Montage.`,
      `Berlin als Megacity ({{city.einwohner}} Einwohner) hat extrem dichte Bebauung, viele Mehrfamilienhaus-Quartiere. Dennoch: moderne Luft-Wasser-WP mit {{jaz}} JAZ bei {{city.heizgradtage}} Heizgradtagen und {{city.strompreis}} ct/kWh erreicht {{fmtEuro(wpKosten)}} Betriebskosten. Gegenüber {{fmtEuro(wpKosten + ersparnis)}} Erdgas = {{fmtEuro(ersparnis)}} Ersparnis. Montagezeit: 6–8 Wochen (viele Betriebe in Berlin aktiv). KfW-Förderung bis 70%.`,
      `In Berlin ist die Wärmewende in Echtzeit sichtbar — {{city.name}} ist Zentrum der Transformation. Mit {{city.heizgradtage}} Heizgradtagen (kontinental-kalt) und {{city.strompreis}} ct/kWh Strompreis ist JAZ {{jaz}} eine realistische Prognose für Luft-Wasser-WP. Jahreskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Berlins Förderprogramme: KfW 50–70% + Senatsmittel. Installateure gut verfügbar.`,
      `Berlin, die Startup-Hauptstadt Deutschlands, treibt auch Wärmepumpen-Innovation voran. {{city.name}} mit {{city.einwohner}} Einwohnern ist Magnet für hochmoderne Fachbetriebe. Mit {{city.strompreis}} ct/kWh, {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C Jahresmittel wird {{jaz}} JAZ erreicht. Kosten: {{fmtEuro(wpKosten)}}/a, Ersparnis {{fmtEuro(ersparnis)}}/a. Über 20 Jahre: {{fmtEuro(ersparnis * 20)}} Netto-Gesamtertrag.`,
    ],
    'Niedersachsen': [
      `Niedersachsen, die Flachland-Region — {{city.name}} mit {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C Außentemp-Jahresmittel ist typisches norddeutsches Klima. Flache Geographie ermöglicht Erdwärme-Bohrungen. Mit {{city.strompreis}} ct/kWh Stromtarif (oft günstig) und JAZ {{jaz}} rechnen sich Wärmepumpen gut. Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. KfW 50–70% Förderung.`,
      `Niedersachsen ist Energie-Rohstoff-Land und Windenergier-Hochburg — {{city.name}} profitiert von günstigen Stromtarifen ({{city.strompreis}} ct/kWh). Mit {{city.heizgradtage}} Heizgradtagen und JAZ {{jaz}} sparen WP-Betreiber {{fmtEuro(ersparnis)}} pro Jahr vs. Erdgas. Flache Topologie: Erdwärme-Bohrungen sind möglich (noch höhere JAZ {{jaz + 1}} möglich). Investition {{Math.round(18500)}}–{{Math.round(35000)}} EUR (je nach Bohrtiefe), Förderung KfW 50–70%.`,
      `In Niedersachsen ist Wärmepumpen-Know-how in Handwerksbetrieben gut verankert. {{city.name}} mit {{city.strompreis}} ct/kWh Stromtarif und {{city.heizgradtage}} Heizgradtagen ist solider WP-Standort. JAZ {{jaz}}, Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Montagezeit: 6–10 Wochen ab KfW-Genehmigung. Fördersätze KfW: 50–70% (typisch {{Math.round((18500 + 28000) / 2 * 0.6)}} EUR).`,
      `Niedersachsen ist ein bevölkerungsreiches, industriell gepräges Land mit guter Infrastruktur. {{city.name}} mit {{city.einwohner}} Einwohnern hat Zugang zu zertifizierten WP-Installateuren. Kostenrechnung: {{fmtEuro(wpKosten)}} Betrieb/a vs. {{fmtEuro(wpKosten + ersparnis)}} Gas = {{fmtEuro(ersparnis)}} Ersparnis. Mit {{city.heizgradtage}} Heizgradtagen und {{city.strompreis}} ct/kWh erreicht JAZ {{jaz}}. 15–18 Jahre Amortisationszeit, 20–25 Jahre WP-Lebensdauer.`,
    ],
    'Rheinland-Pfalz': [
      `Rheinland-Pfalz, das Rotwein-und-Kultur-Land — {{city.name}} mit {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C Jahresmittel hat mildes Rheinhtal-Klima. Luft-Wasser-WP erreicht JAZ {{jaz}} zuverlässig. Mit {{city.strompreis}} ct/kWh Stromtarif betragen Betriebskosten {{fmtEuro(wpKosten)}}/a, Ersparnis {{fmtEuro(ersparnis)}}. KfW 50–70% Förderung, ggf. Landes-Zusatzförderung. Installateure: gutes lokales Netzwerk.`,
      `In Rheinland-Pfalz ist die Weinbau-Tradition und moderne Energiewende Hand in Hand. {{city.name}} mit {{city.heizgradtage}} Heizgradtagen — relativ mild für Deutschland — ist idealer WP-Standort. JAZ {{jaz}}, Strompreis {{city.strompreis}} ct/kWh, Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Montagezeit: 6–10 Wochen ab KfW-Zusage. Fördersätze KfW 50–70%, Rheinland-Pfalz prüfen.`,
      `Rheinland-Pfalz profitiert von moderater Topographie (Mittelgebirge + Tal) — viele Möglichkeiten für Wärmepumpen (Luft oder auch Erd-WP). {{city.name}} mit {{city.strompreis}} ct/kWh und {{city.heizgradtage}} Heizgradtagen ist solider Markt. JAZ {{jaz}}, Kosten {{fmtEuro(wpKosten)}}/a, Ersparnis {{fmtEuro(ersparnis)}}/a. 15–18 Jahre Break-Even, danach freie Gewinne bis Anlagen-EOL (20–25 Jahre).`,
      `Rheinland-Pfalz ist Bundesland mit hoher Wärmepumpen-Adoptionsquote unter Hausbesitzern. {{city.name}} hat deshalb viele erfahrene Handwerksbetriebe. Mit {{city.heizgradtage}} Heizgradtagen, {{city.strompreis}} ct/kWh und JAZ {{jaz}} sinken Betriebskosten auf {{fmtEuro(wpKosten)}}/a (vs. {{fmtEuro(wpKosten + ersparnis)}} Gas). Förderung KfW bis 70%, regionale Zusatzförderung möglich. 20-Jahr-Perspektive: {{fmtEuro(ersparnis * 20)}} Gesamtersparnis.`,
    ],
    'Mecklenburg-Vorpommern': [
      `In Mecklenburg-Vorpommern, dem Nordosten mit {{city.name}}, herrscht maritimes Klima — {{city.heizgradtage}} Heizgradtage und {{city.avgTemp}}°C Jahresmittel. Luft-Wasser-WP mit JAZ {{jaz}} ist ideal. Strompreis {{city.strompreis}} ct/kWh (oft günstig durch Windkraft-Überfluss). Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. KfW 50–70%, MV-Zusatzförderung. Installateure gut verfügbar.`,
      `Mecklenburg-Vorpommern ist Windenergie-Kern — {{city.name}} profitiert von niederem Strompreis {{city.strompreis}} ct/kWh. Mit {{city.heizgradtage}} Heizgradtagen und {{jaz}} JAZ rechnet sich eine WP perfekt: {{fmtEuro(wpKosten)}}/a Betrieb vs. {{fmtEuro(wpKosten + ersparnis)}} Gas. Netto-Ersparnis {{fmtEuro(ersparnis)}}/a. Montagezeit: 6–10 Wochen. Förderung KfW 50–70%, Mecklenburg-Vorpommern-Länderförderung prüfen.`,
      `In MV ist der Strompreis durch Windkraft-Überfluss unter deutschem Durchschnitt. {{city.name}} mit {{city.strompreis}} ct/kWh und {{city.heizgradtage}} Heizgradtagen ist Top-WP-Standort. JAZ {{jaz}}, Jahreskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Amortisationszeit {{Math.round(ersparnis > 0 ? 18000 / ersparnis : 99)}} Jahre (kurz!). 20 Jahre Lebensdauer bedeutet {{fmtEuro(ersparnis * 20)}} Gesamtertrag.`,
      `Mecklenburg-Vorpommern ist Energiewende-Vorreiter mit niedriger Strompreis ({{city.strompreis}} ct/kWh). {{city.name}} mit {{city.heizgradtage}} Heizgradtagen und {{city.einwohner}} Einwohnern hat aktuell steigende Installateure-Dichte. Mit JAZ {{jaz}} betragen Betriebskosten {{fmtEuro(wpKosten)}} (vs. {{fmtEuro(wpKosten + ersparnis)}} Gas). KfW-Förderung 50–70%, Landes-Zusatz möglich. Break-Even: {{Math.round(ersparnis > 0 ? 18000 / ersparnis : 99)}} Jahre.`,
    ],
    'Bremen': [
      `Bremen, das kleinste Bundesland — {{city.name}} ist urbanes Zentrum ({{city.einwohner}} Einwohner) mit maritimem Klima. {{city.heizgradtage}} Heizgradtage, {{city.avgTemp}}°C Jahresmittel. Luft-Wasser-WP mit JAZ {{jaz}} und {{city.strompreis}} ct/kWh Strompreis erreicht {{fmtEuro(wpKosten)}}/a Betriebskosten. Ersparnis vs. Gas {{fmtEuro(ersparnis)}}. KfW 50–70% Förderung. Metropolen-Vorteil: schnelle Montage.`,
      `In dem Stadtstaat Bremen ist {{city.name}} eine {{getCitySize(city)}}, mit {{city.einwohner}} Einwohnern und guter Infrastruktur. Strompreis {{city.strompreis}} ct/kWh (oft günstig), Heizlast {{city.heizgradtage}} Heizgradtage. JAZ {{jaz}}, Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Montagezeit: 4–6 Wochen (viele Betriebe). Förderung KfW 50–70%, Bremen prüfen.`,
      `Bremen hat modernste Energieinfrastruktur — {{city.name}} profitiert. Mit {{city.heizgradtage}} Heizgradtagen, {{city.strompreis}} ct/kWh und JAZ {{jaz}} ist WP ideal. Jahreskosten {{fmtEuro(wpKosten)}}, Gegenüber {{fmtEuro(wpKosten + ersparnis)}} Gas. Amortisation {{Math.round(ersparnis > 0 ? 18000 / ersparnis : 99)}} Jahre. 20-Jahr-Bilanz: {{fmtEuro(ersparnis * 20)}} Ersparnisse.`,
      `Stadtstaat Bremen mit {{city.name}} und {{city.einwohner}} Einwohnern hat top Installateure-Verfügbarkeit und schnelle Montagen. Kosten: {{fmtEuro(wpKosten)}}/a WP vs. {{fmtEuro(wpKosten + ersparnis)}} Gas = {{fmtEuro(ersparnis)}} Jahresersparnis. Mit {{city.heizgradtage}} Heizgradtagen und {{city.strompreis}} ct/kWh wird JAZ {{jaz}} erreicht. KfW 50–70% Förderung, ggf. Bremen-Zusatz.`,
    ],
    'Saarland': [
      `Saarland, das kleinste Flächenbundesland — {{city.name}} mit {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C Jahresmittel ist gemäßigte Temperaturzone. Luft-Wasser-WP erreicht JAZ {{jaz}}. Mit {{city.strompreis}} ct/kWh Strompreis betragen Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. KfW 50–70% Förderung. Saarland hat kleinen Markt, aber gute Fachbetriebe.`,
      `Im Saarland hat {{city.name}} mit {{city.einwohner}} Einwohnern Zugang zu regionalen Handwerksbetrieben mit WP-Know-how. Kostenrechnung: {{fmtEuro(wpKosten)}} WP-Betrieb vs. {{fmtEuro(wpKosten + ersparnis)}} Gas = {{fmtEuro(ersparnis)}} Ersparnis/a. Mit {{city.heizgradtage}} Heizgradtagen und {{city.strompreis}} ct/kWh wird {{jaz}} JAZ erreicht. Montagezeit: 6–10 Wochen. Förderung KfW 50–70%.`,
      `Saarland ist kleiner Markt mit hoher Fachbetrieb-Dichte — {{city.name}} hat gute Installateure. Mit {{city.strompreis}} ct/kWh Strompreis und {{city.heizgradtage}} Heizgradtagen ist {{jaz}} JAZ realistisch. Betriebskosten {{fmtEuro(wpKosten)}}/a, Ersparnis {{fmtEuro(ersparnis)}}/a. Amortisation {{Math.round(ersparnis > 0 ? 18000 / ersparnis : 99)}} Jahre. 20-Jahr-Perspektive: {{fmtEuro(ersparnis * 20)}}.`,
      `Im Saarland fördert die Landesregierung Wärmepumpen aktiv — {{city.name}} mit {{city.heizgradtage}} Heizgradtagen ist idealer Standort. JAZ {{jaz}}, Strompreis {{city.strompreis}} ct/kWh, Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. KfW 50–70% + Saarland-Zusatz. Installateure gut erreichbar (kleines Land). 20–25 Jahre Lebensdauer WP.`,
    ],
    'Sachsen-Anhalt': [
      `Sachsen-Anhalt, Ostdeutschland — {{city.name}} mit {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C Jahresmittel hat kontinental-gemäßigtes Klima. Luft-Wasser-WP mit JAZ {{jaz}} ist standard. Strompreis {{city.strompreis}} ct/kWh (oft günstig). Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. KfW 50–70% Förderung.`,
      `In Sachsen-Anhalt ist {{city.name}} mit {{city.einwohner}} Einwohnern part einer Wärmepumpen-Welle. Mit {{city.heizgradtage}} Heizgradtagen und {{city.strompreis}} ct/kWh Stromtarif rechnet sich JAZ {{jaz}} gut: {{fmtEuro(wpKosten)}}/a vs. {{fmtEuro(wpKosten + ersparnis)}} Gas = {{fmtEuro(ersparnis)}} Ersparnis. Montagezeit: 6–10 Wochen. Förderung KfW 50–70%, Landes-Zusatz prüfen.`,
      `Sachsen-Anhalt hat hohe Windkraft-Durchdringung — {{city.name}} profitiert von günstigen Stromtarifen ({{city.strompreis}} ct/kWh). Mit {{city.heizgradtage}} Heizgradtagen und JAZ {{jaz}} betragen Jahreskosten {{fmtEuro(wpKosten)}}. Gegenüber {{fmtEuro(wpKosten + ersparnis)}} Gas bedeutet das {{fmtEuro(ersparnis)}} Ersparnis. Amortisationszeit {{Math.round(ersparnis > 0 ? 18000 / ersparnis : 99)}} Jahre. Dann: 5–10 Jahre freie Wärmeerzeugung.`,
      `Sachsen-Anhalt ist dynamischer WP-Markt mit guten Installateur-Betrieben. {{city.name}} mit {{city.strompreis}} ct/kWh und {{city.heizgradtage}} Heizgradtagen hat JAZ {{jaz}}, Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. KfW-Förderung bis 70%. 20 Jahre Lebensdauer WP = {{fmtEuro(ersparnis * 20)}} Gesamtertrag über Anlagenalter.`,
    ],
  }

  const variants = bundeslandTexts[city.bundesland] || [
    `In {{city.name}}, {{city.bundesland}}, ist eine Wärmepumpe mit {{city.heizgradtage}} Heizgradtagen und {{city.strompreis}} ct/kWh Strompreis eine solide Investition. Mit JAZ {{jaz}} betragen die Betriebskosten {{fmtEuro(wpKosten)}} pro Jahr, das sind {{fmtEuro(ersparnis)}} weniger als Erdgas. KfW-Förderung bis 70% senkt die Investition erheblich.`,
  ]

  return pick(variants, city) ?? variants[0]
}

// ── 10. GEBÄUDE-CHARAKTERISTISCHE PARAGRAPHEN ──────────────────────────────────────

export function getGebaeudeParagraph(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
): string {
  const sz = getCitySize(city)
  const efhShare = city.efhQuote
  const fwShare = city.fernwaermeQuote

  // 4 Größenklassen × 3 Gebäudetyp-Varianten = 12 Texte
  type BuildingProfile = 'efh_dominant' | 'mfh_dominant' | 'gemischt'

  const buildingProfile: BuildingProfile = efhShare > 0.6 ? 'efh_dominant'
    : efhShare < 0.4 ? 'mfh_dominant'
    : 'gemischt'

  const texts: Record<CitySize, Record<BuildingProfile, string>> = {
    metropole: {
      efh_dominant: `In der Metropole {{city.name}} dominieren dennoch {{Math.round(efhShare * 100)}}% Einfamilienhäuser — ein Vorteil für Wärmepumpen. Diese EFH-Quartiere sind meist älter (Baujahr 1950–1980), mit hohem Wärmedurchgangskoeff. Eine WP-Dimensionierung auf {{jaz}} JAZ und {{fmtEuro(wpKosten)}} Betriebskosten passt perfekt zu den typischen 120–150 m² Heizflächen. Retrofit-Potenzial: Sanierung + WP erzielt Einsparungen bis 60%.`,
      mfh_dominant: `{{city.name}} als Metropole ist geprägt durch {{Math.round(mfhShare * 100)}}% Mehrfamilienhäuser — dicht, energieintensiv, oft mit Zentral-Heizzentrale. Eine zentralisierte Luft-Wasser-WP oder Erdwärme-Einheit mit {{jaz}} JAZ versorgt mehrere Wohnungen parallel. Betriebskosten {{fmtEuro(wpKosten)}} pro Wohneinheit/Jahr. Zusatz: Viele MFH-Quartiere in {{city.name}} haben Fernwärme-Konkurrenz ({{Math.round(fwShare * 100)}}% Quote) — Einzelfallprüfung notwendig.`,
      gemischt: `{{city.name}} als Metropole hat gemischte Bebauung: {{Math.round(efhShare * 100)}}% EFH, {{Math.round((1 - efhShare - mfhShare) * 100)}}% MFH/andere. Wärmepumpen-Strategie muss differenziert sein — EFH bekommen Luft-Wasser oder Erd-WP, MFH bekommen Zentral-WP + Fernwärme-Alternative. JAZ {{jaz}}, Durchschnitt {{fmtEuro(wpKosten)}} Betriebskosten. {{Math.round(fwShare * 100)}}% Fernwärme-Quote ist Konkurrenzfaktor.`,
    },
    grossstadt: {
      efh_dominant: `{{city.name}} als Großstadt hat überraschend hohen EFH-Anteil ({{Math.round(efhShare * 100)}}%) — oft in Außenbezirken und Vororten. Diese Häuser (typisch Baujahr 1960–1985) sind ideal für Luft-Wasser-WP mit {{jaz}} JAZ. Betriebskosten {{fmtEuro(wpKosten)}}/a. Dachflächen-Potenzial für Solar-Ergänzung: +{{Math.round(ersparnis * 0.15)}} EUR zusätzliche Ersparnis.`,
      mfh_dominant: `Die Großstadt {{city.name}} ist geprägt durch {{Math.round(mfhShare * 100)}}% Mehrfamilienhaus-Bestände — Wohnblocks aus den 1970er Jahren, teilweise unsaniert. Zentrale Wärmepumpen-Lösungen (Groß-WP {{jaz}} JAZ + Pufferspeicher) senken Betriebskosten auf {{fmtEuro(wpKosten)}}/Wohneinheit. Sanierungsquote in {{city.name}}: mittel — Retrofit+WP bringt 40–50% Einsparung.`,
      gemischt: `{{city.name}} als Großstadt hat ausgewogene EFH/MFH-Mischung ({{Math.round(efhShare * 100)}}% EFH, {{Math.round((1 - efhShare - mfhShare) * 100)}}% MFH). Für Einzelhausbesitzer: Luft-Wasser-WP {{jaz}} JAZ, {{fmtEuro(wpKosten)}} Betriebskosten. Für MFH-Bewohner: Verhandlung mit Hausverwalter über Zentral-WP. Fernwärme-Quote {{Math.round(fwShare * 100)}}% — Check vor Entscheidung.`,
    },
    mittelstadt: {
      efh_dominant: `In der Mittelstadt {{city.name}} dominieren {{Math.round(efhShare * 100)}}% Einfamilienhäuser — Villenbereiche und Wohnquartiere. Diese Häuser sind meist 50–60 Jahre alt, mit sanierungsfähigen Hüllen. Luft-Wasser-WP mit {{jaz}} JAZ ist de-facto-Standard, Betriebskosten {{fmtEuro(wpKosten)}}/a. Ortsbild-Aspekt: moderne WP-Außengeräte sind kompakt und ästhetisch — passen sich Einfamilienhäusern an.`,
      mfh_dominant: `{{city.name}} als Mittelstadt hat {{Math.round(mfhShare * 100)}}% MFH-Bestand — kompakte Innenstädte mit 4–6-Geschosser-Blocks. Zentrale Wärmepumpen mit {{jaz}} JAZ + Speicher senken Betriebskosten auf {{fmtEuro(wpKosten)}}/Wohneinheit/Jahr. Vorteil: Größere Amortisationsquoten durch Skaleneffekt. Fernwärme-Quote {{Math.round(fwShare * 100)}}% — in vielen Mittelstädten Konkurrenzfaktor.`,
      gemischt: `{{city.name}} ist typische Mittelstadt-Mischung: {{Math.round(efhShare * 100)}}% EFH in Außenbezirken, {{Math.round((1 - efhShare - mfhShare) * 100)}}% MFH in Innenstadt. WP-Strategie: EFH→Luft-WP, MFH→Zentral-WP oder Fernwärme. JAZ {{jaz}}, Betriebskosten {{fmtEuro(wpKosten)}} (Durchschnitt). Fernwärme-Konkurrenz {{Math.round(fwShare * 100)}}% — relevant, aber nicht dominant.`,
    },
    kleinstadt: {
      efh_dominant: `Die kleine Gemeinde {{city.name}} mit {{city.einwohner}} Einwohnern ist EFH-Domäne ({{Math.round(efhShare * 100)}}%) — dörfliches Ambiente, Einfamilienhäuser mit Gärten. Wärmepumpen sind hier Standard geworden. Luft-Wasser {{jaz}} JAZ, {{fmtEuro(wpKosten)}} Betriebskosten. Installateure: Handwerksbetriebe aus Nachbarstädten. Amortisationszeit typisch 16–18 Jahre.`,
      mfh_dominant: `Die kleine Ortschaft {{city.name}} mit {{city.einwohner}} Einwohnern hat überraschend {{Math.round(mfhShare * 100)}}% MFH — vermutlich Neubau-Siedlungen oder Senioren-Wohnanlagen. Zentrale WP-Lösung spart Betriebskosten: {{fmtEuro(wpKosten)}}/Wohneinheit bei {{jaz}} JAZ. Dörfliche Infrastruktur: Installateure pendelnd aus der Region, Montagezeit 8–12 Wochen.`,
      gemischt: `Die Kleinstadt {{city.name}} mit {{city.einwohner}} Einwohnern hat EFH/MFH-Mix ({{Math.round(efhShare * 100)}}% EFH) — typischer ländlicher Raum mit Wohnvielfalt. WP-Ansätze: Einzelne EFH→Luft-WP {{jaz}}, Mehrfamilien→ggf. Fernwärme oder Zentral-WP. Betriebskosten {{fmtEuro(wpKosten)}}. Fachbetriebe aus umliegenden Städten. 16–18 Jahre Amortisation.`,
    },
  }

  return texts[sz]?.[buildingProfile] ?? texts['mittelstadt']['gemischt']
}

// ── 11. ENERGIE-WIRTSCHAFTS-TIEFENPARAGRAPHEN ─────────────────────────────────────

export function getEnergieParagraph(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): string {
  const pr = getPreisRegion(city)
  const kl = getKlimaZone(city)

  // 3 Preisregionen × 4 Klimazonen = 12 Kombos
  type EnergyCombo = `${PreisRegion}_${KlimaZone}`

  const combo: EnergyCombo = `${pr}_${kl}`

  const texts: Record<EnergyCombo, string> = {
    'guenstig_warm': `{{city.name}} ist Energiewirtschafts-Hotspot: Strompreis {{city.strompreis}} ct/kWh (deutlich unter 30 ct), Jahresmittel {{city.avgTemp}}°C (warm), {{city.heizgradtage}} Heizgradtage (niedrig). Diese Kombination ist WP-Paradies. Mit {{jaz}} JAZ betragen Heizkosten nur {{fmtEuro(wpKosten)}}/a — der niedrigste Wert Deutschlands. Gegenüber Erdgas {{fmtEuro(ersparnis)}} Ersparnis. Amortisationszeit: 12–14 Jahre (kurz!). Zusatzoption: PV-Anlage hebt Eigenversorgung auf 40–60%.`,
    'guenstig_mittel': `{{city.name}} mit {{city.strompreis}} ct/kWh (günstig) und {{city.avgTemp}}°C Jahresmittel (mittel) ist lukrativer WP-Standort. {{city.heizgradtage}} Heizgradtage sind typisch deutsch — nicht zu extrem kalt, nicht zu mild. JAZ {{jaz}} führt zu Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}} vs. Gas. Langzeitrechnung: {{fmtEuro(ersparnis * 20)}} über 20 Jahre Lebensdauer. Investition {{Math.round(20000)}}–{{Math.round(28000)}} EUR mit 50–70% KfW-Förderung.`,
    'guenstig_kalt': `In {{city.name}} mit {{city.strompreis}} ct/kWh günstigen Stromtarifen und {{city.heizgradtage}} Heizgradtagen (kalt, {{city.avgTemp}}°C) wird eine WP arbeitsreicher — aber mit JAZ {{jaz}} immer noch rentabel. Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}/a. Kalte Standorte benötigen oft Zusatz-Heating (Elektro-Heizstab) in extremen Dips — das erhöht Betriebskosten um ca. 5–10%. Netto-Vorteil bleibt aber {{fmtEuro(ersparnis * 0.9)}}.`,
    'guenstig_sehr_kalt': `{{city.name}} ist extreme Kaltklimazone: {{city.heizgradtage}} Heizgradtage, {{city.avgTemp}}°C, typische Winter bis -15°C. Aber: Strompreis {{city.strompreis}} ct/kWh ist günstig. JAZ {{jaz}} wird mit modernem Inverter-Kompressor erreicht. Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Hybrid-WP (WP + Gas-Spitzenlast) ist Überlegung für {{Math.round(ersparnis * 0.1)}} EUR zusätzliche Flexible. 20-Jahr-Bilanz: {{fmtEuro(ersparnis * 19)}} (mit Hybrid-Anpassung).`,
    'mittel_warm': `{{city.name}} hat mittlere Strompreise ({{city.strompreis}} ct/kWh) und warmes Klima ({{city.avgTemp}}°C, {{city.heizgradtage}} Heizgradtage). WP mit {{jaz}} JAZ ist hocheffizient — wenig Heizlast, hohe COP. Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Zusatz: Warme Standorte erlauben niedrigere Vorlauftemperaturen (28–35°C), was JAZ um {{Math.round(jaz * 0.1)}} erhöht. 20-Jahr-Ersparnisse: {{fmtEuro(ersparnis * 20)}} netto.`,
    'mittel_mittel': `{{city.name}} ist typisch-deutsches Energie-Profil: Strompreis {{city.strompreis}} ct/kWh (mittel), {{city.avgTemp}}°C Jahresmittel, {{city.heizgradtage}} Heizgradtage. JAZ {{jaz}} ist Regelfall. Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Investitions-Rechnung: {{Math.round(22000)}} EUR Kosten brutto, {{Math.round(22000 * 0.6)}} EUR Förderung (KfW 50–70%), Eigenanteil {{Math.round(22000 * 0.4)}} EUR. Amortisationszeit {{Math.round(ersparnis > 0 ? 18000 / ersparnis : 25)}} Jahre.`,
    'mittel_kalt': `{{city.name}} mit {{city.strompreis}} ct/kWh (mittel) und {{city.heizgradtage}} Heizgradtagen (kalt, {{city.avgTemp}}°C) erfordert leistungsstarke WP. JAZ {{jaz}} ist Standard mit modernem Split-System. Betriebskosten {{fmtEuro(wpKosten)}}, Ersparnis {{fmtEuro(ersparnis)}}. Spitzenlast-Hybrid mit Gaskessel (20–30% der Zeit) ist Überlegung — erhöht Investition um ~{{Math.round(5000)}} EUR, senkt aber Betriebsrisiko. 20 Jahre: {{fmtEuro(ersparnis * 19)}} Netto.`,
    'mittel_sehr_kalt': `{{city.name}} mit {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C ist sehr kalte Zone. Strompreis {{city.strompreis}} ct/kWh (mittel). JAZ {{jaz}} ist mit Luftwärmetauscher mit Abtau-Automation erreichbar. Betriebskosten {{fmtEuro(wpKosten)}}. Hybrid-WP wird häufig empfohlen: WP deckt 70–80% (Winter-Durchschnitt), Gas-Spitzenkessel 20–30% (extreme Kälte). Gesamtersparnis {{fmtEuro(ersparnis * 0.75)}} netto (wegen Gasanteils). 20 Jahre: {{fmtEuro(ersparnis * 15)}} (Hybrid-Szenario).`,
    'teuer_warm': `{{city.name}} mit hohem Strompreis ({{city.strompreis}} ct/kWh, über 31 ct) aber warmem Klima ({{city.avgTemp}}°C, {{city.heizgradtage}} Heizgradtage) braucht effiziente WP. JAZ {{jaz}} ist Minimum. Betriebskosten {{fmtEuro(wpKosten)}} sind höher als im Süden, aber Heizlast ist niedrig. Ersparnis {{fmtEuro(ersparnis)}} bleibt attraktiv. PV-Kombination senkt Strompreis effektiv auf ~{{Math.round(city.strompreis * 0.6)}} ct/kWh (Eigenversorgung). 20-Jahr-Bilanz: {{fmtEuro(ersparnis * 21)}} (mit PV).`,
    'teuer_mittel': `{{city.name}} mit teuerem Strom ({{city.strompreis}} ct/kWh) und mittlerem Klima ({{city.avgTemp}}°C, {{city.heizgradtage}} Heizgradtage) wird WP-Rentabilität zur Detailrechnung. JAZ {{jaz}} wird eng kalkuliert. Betriebskosten {{fmtEuro(wpKosten)}}, aber hochpreisig im deutschen Vergleich. Ersparnis {{fmtEuro(ersparnis)}} ist vorhanden, amortisiert sich in ~{{Math.round(ersparnis > 0 ? 22000 / ersparnis : 25)}} Jahren. PV-Ergänzung (6–8 kWp) ist dringend empfohlen: senkt effektive Stromkosten um 30–40%.`,
    'teuer_kalt': `{{city.name}} mit {{city.strompreis}} ct/kWh (teuer!) und {{city.heizgradtage}} Heizgradtagen (kalt) ist WP-Grenzstandort. JAZ {{jaz}} wird mit Optimierung erreicht (Tiefenbohrung für Sole-WP empfohlen). Betriebskosten {{fmtEuro(wpKosten)}} sind nordlastend, aber immer noch besser als Ölheizung. Ersparnis {{fmtEuro(ersparnis)}} ist fragil. Erdwärme (JAZ +0,5) ist Überlegung (+{{Math.round(8000)}} EUR Kosten). 20-Jahr-Bilanz: {{fmtEuro(ersparnis * 20)}} (mit Erd-Investition).`,
    'teuer_sehr_kalt': `{{city.name}} ist Worst-Case-Szenario: Teurer Strom ({{city.strompreis}} ct/kWh), extreme Kälte ({{city.heizgradtage}} Heizgradtage, {{city.avgTemp}}°C). JAZ {{jaz}} wird schwer. Pure Luft-Wasser-WP ist nicht wirtschaftlich — Erdwärme (Sole-WP, JAZ {{Math.round(jaz + 0.8)}}) oder Hybrid-Lösung ist nötig. Sole-WP Kosten {{Math.round(30000)}} EUR, Förderung {{Math.round(30000 * 0.7)}} EUR. Hybrid-Option: WP 70% ({{fmtEuro(ersparnis * 0.7)}}) + Gas 30%. 20 Jahre: {{fmtEuro(ersparnis * 14)}} netto (Sole-Variante).`,
  }

  return texts[combo] ?? texts['mittel_mittel']
}

// ── 12. PROZESS-TIMELINE — Stadt- und Keyword-spezifisch ──────────────────────────

export function getProcessTimeline(
  city: City,
  keyword: Keyword,
): Array<{ step: string; detail: string; duration: string }> {
  const sz = getCitySize(city)

  // Metropolen sind schneller, Kleinstädte langsamer
  const baseWeeks = sz === 'metropole' ? 8 : sz === 'grossstadt' ? 10 : sz === 'mittelstadt' ? 12 : 14

  const cat = getKwCategory(keyword)
  const isErdwaerme = keyword.slug.includes('erd')

  const timeline: Array<{ step: string; detail: string; duration: string }> = [
    {
      step: '1. Kostenloser Vor-Ort-Termin',
      detail: `Ein zertifizierter Energieberater besucht Ihre Immobilie in ${city.name} und beurteilt Heizlast, Gebäudezustand, Rohrleitungen. Dauer: 60–90 Minuten. In ${sz === 'metropole' ? 'der Metropole' : sz === 'grossstadt' ? 'der Großstadt' : 'der Stadt'} ${city.name} sind Termine oft innerhalb 1–2 Wochen verfügbar.`,
      duration: 'Woche 1–2',
    },
    {
      step: '2. Angebote erhalten',
      detail: `Basierend auf der Bestandsaufnahme erstellen bis zu 3 Fachbetriebe detaillierte Angebote (Luft-Wasser, Erdwärme, Hybrid). Vergleich: Kosten, JAZ-Prognose, Förderquote. In ${city.name} dauert dieser Prozess wegen guter Installateure-Dichte üblicherweise 1–2 Wochen.`,
      duration: 'Woche 2–4',
    },
    {
      step: '3. KfW-Antrag stellen',
      detail: `Ihr gewählter Fachbetrieb oder Energieberater stellt den KfW-Antrag (Programm 261/262) vor Baubeginn. Obligatorisch! In ${city.bundesland} ist der Netzbetreiber (${city.name} gehört zu ${city.bundesland}-Netzgebiet) auch einzubeziehen bei Stromtarifoptionen. Genehmigungsdauer: 3–4 Wochen.`,
      duration: 'Woche 4–8',
    },
    {
      step: `4. ${isErdwaerme ? 'Bohrung & Bohrgenehmigung' : 'Montage-Vorbereitung'}`,
      detail: isErdwaerme
        ? `Für Erdwärmepumpen in ${city.name} muss die Bohrung (Tiefe ${Math.round(city.heizgradtage / 10)}–150 m) genehmigt werden. ${city.bundesland}-Geologisches Landesamt prüft. Bohrung dauert 3–5 Tage. Total: 2–4 Wochen Genehmigung + Durchführung.`
        : `Installateur bereitet Montage vor: Außengerät-Platz, Hydraulik, Stromleitungen. In ${sz === 'metropole' ? 'dieser Metropole' : sz === 'grossstadt' ? 'dieser Großstadt' : city.name} sind Montage-Kapazitäten oft knapp — 2–4 Wochen Vorlauf ist realistisch.`,
      duration: isErdwaerme ? 'Woche 8–12' : 'Woche 8–10',
    },
    {
      step: '5. Installation & Inbetriebnahme',
      detail: `Montage der Wärmepumpe: 2–3 Tage für Luft-Wasser (Außengerät, Inneneinheit, Leitungen). Hydraulischer Abgleich und Einstellung: 1 Tag. In ${city.name} muss der lokale Netzbetreiber für Stromtarif-Freigabe informed werden. Inbetriebnahme: 2–3 Tage.`,
      duration: 'Woche ${baseWeeks}–${baseWeeks + 1}',
    },
    {
      step: '6. Förderbestätigung & Abschlag',
      detail: `Nach Inbetriebnahme wird der Nachweis an KfW eingereicht. Förderbestätigung erfolgt innerhalb 4–6 Wochen. Abschlagszahlung (oft 80% des Zuschusses) wird dann überwiesen. In ${city.name} ist dieser Prozess standardisiert — keine unerwarteten Verzögerungen.`,
      duration: `Woche ${baseWeeks + 1}–${baseWeeks + 6}`,
    },
    {
      step: '7. Wartung & Monitoring starten',
      detail: `Jährliche Wartung (Filter, Kältemittel-Check) sollte etabliert werden. Moderne WP haben Fernüberwachung — online einsehbar in ${city.name} über App/Portal. Kosten: ca. 150–250 EUR/Jahr. Garantie: typisch 5 Jahre ab Inbetriebnahme, Lebensdauer 20–25 Jahre.`,
      duration: 'Ab Woche ${baseWeeks + 7}',
    },
  ]

  return timeline
}

// ── 13. CROSS-KEYWORD KONTEXTUELLE LINKS ───────────────────────────────────────────

export function getCrossKeywordLinks(
  city: City,
  keyword: Keyword,
  allKeywords: Keyword[],
): Array<{ url: string; anchor: string; context: string }> {
  // Verwende keyword.crossLinks um verwandte Keywords zu identifizieren
  const crossSlugs = keyword.crossLinks || []
  const related = allKeywords.filter(k => crossSlugs.includes(k.slug)).slice(0, 6)

  if (related.length === 0) return []

  // 3 Anchor-Varianten pro Keyword
  const anchorVariations: Record<string, string[]> = {
    'waermepumpe-kosten': ['WP-Kosten in ' + city.name, 'Kostenvergleich Wärmepumpe', 'Preise aktualisieren'],
    'waermepumpe-foerderung': ['KfW-Förderung für ' + city.name, 'Fördermöglichkeiten', 'Zuschüsse nutzen'],
    'waermepumpe-installateur': ['Installer in ' + city.name, 'Zertifizierte Fachbetriebe', 'lokale Handwerker'],
    'luft-wasser-waermepumpe': ['Luft-Wasser-Technik', 'Split-Systeme für ' + city.name, 'Luftwärmepumpen'],
    'waermepumpe-altbau': ['Altbau-Lösung', 'Nachrüstung im Bestand', 'Retrofit in ' + city.name],
    'heizung-tauschen': ['Heizungswechsel', 'Gas-Ausstieg für ' + city.name, 'erneuernde Heiztechnik'],
    'waermepumpe-nachruesten': ['Nachträglicher Einbau', 'Umbau für ' + city.name, 'Ertüchtigung von Bestandsanlage'],
    'erd-waermepumpe': ['Erdwärmepumpe in ' + city.name, 'Sole-Wasser-Systeme', 'Tiefenbohrungen'],
    'stromverbrauch-waermepumpe': ['Strom-Effizienz', 'kWh-Verbrauch in ' + city.name, 'Stromtarif-Optimierung'],
    'waermepumpe-neubau': ['Neubau-Standards', 'GEG-Konformität in ' + city.name, 'EnEV-Einhaltung'],
  }

  const hash = cityHash(city, 3)

  return related.map(k => {
    const anchors = anchorVariations[k.slug] || [k.keyword, 'mehr erfahren', 'Detailinformationen']
    const selectedAnchor = anchors[hash % anchors.length]

    const contexts = [
      `Erfahren Sie mehr über die ${selectedAnchor.toLowerCase()} — mit stadtspezifischen Daten für ${city.name}.`,
      `Weitere Informationen zur ${selectedAnchor.toLowerCase()} sind wichtig für Ihre Entscheidung in ${city.name}.`,
      `Vertiefen Sie Ihr Wissen zum Thema ${selectedAnchor.toLowerCase()} speziell für ${city.name}.`,
    ]

    return {
      url: `/${k.slug}/${city.slug}`,
      anchor: selectedAnchor,
      context: contexts[hash % contexts.length],
    }
  })
}

// ── 14. VERGLEICHSTABELLE — Stadt-spezifische Heizalternativen ─────────────────────

export function getComparisonTable(
  city: City,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): { headers: string[]; rows: string[][] } {
  const gasKosten = wpKosten + ersparnis
  const pelletKosten = Math.round(gasKosten * 1.1) // Pellets typisch ~10% teurer
  const oelKosten = Math.round(gasKosten * 1.15)

  // Fernwärme-Kosten (wenn verfügbar) — typisch 70–80% von Gas
  const fernwaermeKosten = Math.round(gasKosten * 0.75)

  // CO2-Ausstoß pro Heizmodus (kg/a für 120m² EFH)
  const wpCO2 = 800 // ~6,7 kg CO2/kWh * 120 kWh/m² mittel
  const gasCO2 = 2400 // 0,235 kg CO2/kWh
  const oelCO2 = 3100
  const pelletCO2 = 300 // quasi CO2-neutral
  const fernwaermeCO2 = 1500

  const headers = [
    'Heizart',
    'Jahreskosten',
    'CO₂-Ausstoß',
    'GEG-Konformität',
    'KfW-Förderquote',
    'Amortisation (J.)',
  ]

  const rows = [
    ['Luft-Wasser-WP', `${fmtEuro(wpKosten)}`, `~${wpCO2} kg`, '✓ 100%', 'bis 70%', '15–18'],
    ['Erdwärmepumpe', `${fmtEuro(Math.round(wpKosten * 0.85))}`, `~${Math.round(wpCO2 * 0.7)} kg`, '✓ 100%', 'bis 70% + 5%', '14–16'],
    ['Gasheizung', `${fmtEuro(gasKosten)}`, `~${gasCO2} kg`, '✗ nur mit 65% EE', 'bis 20%', 'n.a.'],
    ['Pelletsheizung', `${fmtEuro(pelletKosten)}`, `~${pelletCO2} kg`, '✓ 100%', 'bis 50%', '20–22'],
    ['Ölheizung', `${fmtEuro(oelKosten)}`, `~${oelCO2} kg`, '✗ 2024 verboten', '0%', 'n.a.'],
    ['Fernwärme*', `${fmtEuro(fernwaermeKosten)}`, `~${fernwaermeCO2} kg`, '✓ oft 100%', 'variabel', '–'],
  ]

  return { headers, rows }
}

// ── 15. LOKALES DETERMINISTISCHES PSEUDO-TESTIMONIAL ────────────────────────────────

export function getLocalTestimonial(
  city: City,
  keyword: Keyword,
): { quote: string; author: string; location: string; rating: number } {
  const quotes = [
    `Die Wärmepumpe in ${city.name} hat unsere Heizkosten um über {{ersparnis}}€ pro Jahr gesenkt. Das war eine der besten Investitionen im Haus.`,
    `Nach der Installation der WP in ${city.name} läuft das Heizen komplett automatisch. Keine CO2-Gedanken mehr — nur Effizienz.`,
    `Der Prozess war schneller als erwartet. Dank KfW-Förderung in ${city.name} lag mein Eigenanteil unter {{Math.round(22000 * 0.4)}}€. Sehr zufrieden!`,
    `Mit der Wärmepumpe in ${city.name} bin ich unabhängig von Gas-Preisen. Das gibt Sicherheit für die nächsten 20 Jahre.`,
    `Mein Installateur in ${city.name} war top — professionell, schnell, zuverlässig. Die WP läuft jetzt 3 Jahre ohne Probleme.`,
    `Beeindruckend, wie sparsam die WP ist. ${city.name} mit seinem Klima war ideal für die Installation.`,
    `Der Wechsel von Gas zu WP war die beste Sanierungsentscheidung. In ${city.name} zahlt sich das schnell aus.`,
    `Keine Lärm-Probleme, keine Vibrationen — die WP in ${city.name} ist unauffällig und zuverlässig.`,
    `Mit PV auf dem Dach und WP im Keller bin ich in {{city.name}} energieautark zu 40%. Sensationell!`,
    `Förderung war unkompliziert, Installation war schnell — alles in allem eine gelungene Heiztechnik-Modernisierung in {{city.name}}.`,
    `Wer in {{city.name}} noch mit Gas heizt, sollte sich diesen Vergleich ansehen. Die Kostenersparnis ist enorm.`,
    `Die Wärmepumpe ist modern, zuverlässig und wirtschaftlich. In {{city.name}} die beste Heizlösung aktuell.`,
    `Nach der Montage in {{city.name}} laufen die Heizkosten auf Autopilot. Komfortable Temperatur, niedrige Rechnungen — ideal!`,
    `Mein Fachbetrieb in {{city.name}} hat die WP fehlerfrei installiert. 3 Jahre später: 0 Ausfälle, 0 Probleme.`,
    `Die KfW-Förderung in {{city.name}} hat das Projekt realistisch gemacht. Vorher schien es finanziell unmöglich.`,
    `Heizen ohne Angst vor CO2-Abgaben — das ist mit WP in {{city.name}} möglich. Modernes Heizen eben.`,
    `Unsere Nachbarn haben gesehen, wie sparsam die WP ist. Jetzt wollen sie auch eine in {{city.name}}.`,
    `Mit der WP bin ich endlich unabhängig von Gas-Monopolisten. {{city.name}} zeigt: Energiewende funktioniert!`,
    `Der Energieberater in {{city.name}} war sehr hilfreich. Am Ende hatte ich ein perfekt dimensioniertes System.`,
    `Jede kWh Strom wird in 3–4 kWh Wärme umgewandelt. So effizient ist in {{city.name}} keine andere Heizart.`,
  ]

  const authors = [
    'Thomas M.', 'Petra K.', 'Martin S.', 'Claudia W.', 'Stefan G.',
    'Renate L.', 'Jürgen P.', 'Brigitte H.', 'Klaus F.', 'Andrea V.',
    'Wolfgang Z.', 'Elisabeth N.', 'Frank U.', 'Monika D.', 'Werner B.',
    'Sylvia J.', 'Dieter R.', 'Ursula C.', 'Helmut E.', 'Ingrid A.',
    'Peter M.', 'Heike T.', 'Hermann S.', 'Sonja K.', 'Gerhard W.',
    'Anja B.', 'Rolf H.', 'Margarete L.', 'Uwe G.', 'Christel F.',
  ]

  const locations = [
    city.name,
    `Nähe ${city.name}`,
    `${city.name}-${['West', 'Ost', 'Nord', 'Süd', 'Zentrum'][cityHash(city, 5)]}`,
    `Vorstadt ${city.name}`,
    `${city.name} (Stadtrand)`,
  ]

  const quoteHash = cityHash(city, quotes.length, 10)
  const authorHash = cityHash(city, authors.length, 20)
  const locationHash = cityHash(city, locations.length, 30)

  const rating = 4 + (cityHash(city, 2, 40) === 0 ? 1 : 0) // 4 oder 5 Sterne

  return {
    quote: quotes[quoteHash].replace(/{{city\.name}}/g, city.name),
    author: authors[authorHash],
    location: locations[locationHash],
    rating,
  }
}

// ── 16. SAISONALE RATSCHLÄGE — Installationszeitpunkt ─────────────────────────────────

export function getSeasonalAdvice(city: City): string {
  const kl = getKlimaZone(city)
  const sz = getCitySize(city)

  const advices: Record<KlimaZone, string> = {
    warm: `In {{city.name}} mit {{city.avgTemp}}°C Jahresmittel und {{city.heizgradtage}} Heizgradtagen können Sie die Wärmepumpe ganzjährig installieren — Sommer ist ideal für Planung und schnelle Montage, Winter bietet niedrige Strompreise (Off-Peak). Empfehlung: März–September für Ruhe und optimale Bedingungen, Dezember–Februar für schnellere Terminfindung bei Installateuren.`,
    mittel: `{{city.name}} mit {{city.heizgradtage}} Heizgradtagen hat ausgeprägte Heizsaison — Herbst (September–Oktober) ist der beste Installationszeitpunkt: keine extremen Temperaturen, Installateure noch nicht überbucht, Heizperiode startet Mitte Oktober. Vorteil: System läuft durch die kritischsten Monate (Dezember–Februar) ein. Vermeiden Sie Sommer (Hitze, Baubrache) und Jänner (Kälte, Frostschutz-Komplexität).`,
    kalt: `In {{city.name}} mit {{city.heizgradtage}} Heizgradtagen und {{city.avgTemp}}°C ist Installation im Sommer (Juni–August) empfohlen — lange Tage, trockenes Wetter, keine Heizausfallrisiken. Installateur-Kapazität ist hoch, Arbeitszeiten lang. Nachteil: System ist im Winter noch "grün" und wird maximal gefordert. Alternativ: März–April (Frühling) für sanfteres Laufverhalten im ersten Winter.`,
    sehr_kalt: `In dieser Extremkaltzone {{city.name}} mit {{city.heizgradtage}} Heizgradtagen muss die Installation über den Sommer erfolgen — mindestens Juni–August verfügbar, besser Mai–September. Winter-Installation in {{city.name}} ist möglich, aber risikobehaftet (Eisfernwärme, Gefrier-Gefahr, lange Ausfallzeiten). Fachbetriebe hier empfehlen Sommer-Installation + {{Math.round(4)}} Wochen Testlauf vor Heizstart. Kosten: {{Math.round(500)}} EUR extra, aber Sicherheit ist wert's.`,
  }

  return advices[kl] || advices['mittel']
}

// ── 17. EXTENDED VARIATION DATA ─────────────────────────────────────────────

export interface ExtendedVariationData extends CityVariationData {
  bundeslandParagraph: string;
  gebaeudeParagraph: string;
  energieParagraph: string;
  processTimeline: Array<{ step: string; detail: string; duration: string }>;
  crossKeywordLinks: Array<{ url: string; anchor: string; context: string }>;
  comparisonTable: { headers: string[]; rows: string[][] };
  localTestimonial: { quote: string; author: string; location: string; rating: number };
  seasonalAdvice: string;
  inlineLinkedParagraph: string;
  lokaleTiefenanalyse: string;
  pvWPKombination: ReturnType<typeof getPVWPKombination>;
  roiTimeline: ReturnType<typeof getROITimeline>;
  nachbarschaftsvergleich: ReturnType<typeof getNachbarschaftsvergleich>;
  heizkoerperCheck: ReturnType<typeof getHeizkoerperCheck>;
  stromtarifOptimierung: ReturnType<typeof getStromtarifOptimierung>;
  keywordDeepContent: ReturnType<typeof getKeywordDeepContent>;
  enhancedCTA: ReturnType<typeof getEnhancedCTA>;
  videoPlaceholder: ReturnType<typeof getVideoPlaceholder>;
  socialProofData: ReturnType<typeof getSocialProofData>;
}

// ── 18. INLINE-CONTEXTUAL-LINKS — natürliche Links im Fließtext ────────────────
// Google bewertet Links im Fließtext deutlich höher als Links in dedizierten Sektionen.
// Diese Funktion erzeugt HTML-Strings mit <a>-Tags, die in Absätze eingebaut werden.

export function getInlineLinkedParagraph(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): string {
  const crossSlugs = keyword.crossLinks || [];
  const hash = cityHash(city, 100);
  const base = `https://xn--wrmepumpenbegleiter-gwb.de`;

  // Kontextuelle Sätze mit eingebetteten Links — 12 Varianten
  const linkedSentences: string[] = [];

  if (crossSlugs.includes('waermepumpe-kosten')) {
    const anchors = [
      `aktuelle Wärmepumpen-Kosten in ${city.name}`,
      `Kosten einer Wärmepumpe in ${city.name}`,
      `Preisübersicht für ${city.name}`,
    ];
    const a = anchors[hash % anchors.length];
    linkedSentences.push(
      `Wer sich für die <a href="/${crossSlugs.includes('waermepumpe-kosten') ? 'waermepumpe-kosten' : 'waermepumpe-preise'}/${city.slug}">${a}</a> interessiert, findet bei JAZ ${jaz} und ${city.strompreis} ct/kWh Strompreis attraktive Betriebskosten von nur ${fmtEuro(wpKosten)} pro Jahr.`
    );
  }

  if (crossSlugs.includes('waermepumpe-foerderung')) {
    const anchors = [
      `KfW-Förderung für Wärmepumpen in ${city.name}`,
      `Fördermöglichkeiten in ${city.name}`,
      `staatliche Zuschüsse in ${city.name}`,
    ];
    const a = anchors[(hash + 1) % anchors.length];
    linkedSentences.push(
      `Die <a href="/waermepumpe-foerderung/${city.slug}">${a}</a> decken bis zu 70 % der Investitionskosten — bei korrektem KfW-Antrag vor Baubeginn.`
    );
  }

  if (crossSlugs.includes('waermepumpe-installateur') || crossSlugs.includes('waermepumpe-fachbetrieb')) {
    const slug = crossSlugs.includes('waermepumpe-installateur') ? 'waermepumpe-installateur' : 'waermepumpe-fachbetrieb';
    const anchors = [
      `zertifizierte Installateure in ${city.name}`,
      `lokale Fachbetriebe in ${city.name}`,
      `HWK-geprüfte Betriebe in ${city.name}`,
    ];
    const a = anchors[(hash + 2) % anchors.length];
    linkedSentences.push(
      `Entscheidend ist die Wahl des richtigen Betriebs: <a href="/${slug}/${city.slug}">${a}</a> garantieren fachgerechte Installation und reibungslose KfW-Abwicklung.`
    );
  }

  if (crossSlugs.includes('luft-wasser-waermepumpe')) {
    linkedSentences.push(
      `Die <a href="/luft-wasser-waermepumpe/${city.slug}">Luft-Wasser-Wärmepumpe in ${city.name}</a> ist mit über 90 % Marktanteil die beliebteste Technologie — kein Erdreich nötig, keine Bohrung, schnelle Installation.`
    );
  }

  if (crossSlugs.includes('heizung-tauschen')) {
    linkedSentences.push(
      `Wer seine <a href="/heizung-tauschen/${city.slug}">alte Heizung in ${city.name} tauschen</a> möchte, profitiert vom Klima-Speed-Bonus: +20 % KfW-Zuschuss beim Ersatz fossiler Heizsysteme.`
    );
  }

  if (crossSlugs.includes('waermepumpe-altbau') || crossSlugs.includes('waermepumpe-nachruesten')) {
    const slug = crossSlugs.includes('waermepumpe-altbau') ? 'waermepumpe-altbau' : 'waermepumpe-nachruesten';
    linkedSentences.push(
      `Auch im Bestandsbau lohnt sich der Umstieg: Eine <a href="/${slug}/${city.slug}">Wärmepumpe im Altbau in ${city.name}</a> arbeitet dank moderner Hochtemperatur-Technik effizient bis 70 °C Vorlauf.`
    );
  }

  if (crossSlugs.includes('erdwaermepumpe')) {
    linkedSentences.push(
      `Wer maximale Effizienz sucht, sollte die <a href="/erdwaermepumpe/${city.slug}">Erdwärmepumpe für ${city.name}</a> prüfen — JAZ bis 4,5 und zusätzlich 5 % KfW-Bonus.`
    );
  }

  if (crossSlugs.includes('waermepumpe-neubau')) {
    linkedSentences.push(
      `Im <a href="/waermepumpe-neubau/${city.slug}">Neubau in ${city.name}</a> ist die Wärmepumpe ohnehin Standard: GEG-konform, förderfähig und mit Fußbodenheizung besonders effizient.`
    );
  }

  // Wähle 2-3 Sätze deterministisch aus
  const count = Math.min(linkedSentences.length, hash % 2 === 0 ? 3 : 2);
  const selected: string[] = [];
  for (let i = 0; i < count && i < linkedSentences.length; i++) {
    selected.push(linkedSentences[(hash + i * 3) % linkedSentences.length]);
  }

  return selected.join(' ');
}

// ── 19. LOKALE TIEFENANALYSE — einzigartiger Absatz pro Stadt ─────────────────
// Generiert einen tiefen, datenreichen Absatz, der rein aus lokalen Daten besteht.
// Ziel: Jede Seite hat mindestens 150 Wörter einzigartigen Inhalt aus Stadtdaten.

export function getLokaleTiefenanalyse(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): string {
  const sz = getCitySize(city);
  const kl = getKlimaZone(city);
  const hash = cityHash(city, 6);
  const gasKosten = wpKosten + ersparnis;
  const co2Ersparnis = Math.round((gasKosten / (city.gaspreis / 100)) * 0.235 - (wpKosten / (city.strompreis / 100)) * 0.420);
  const pvErtrag = Math.round(city.avgSunHours * 8 * 0.85);
  const wpStrom = Math.round(wpKosten / (city.strompreis / 100));
  const pvAnteil = Math.min(Math.round(pvErtrag * 0.35 / wpStrom * 100), 65);
  const wpMitPV = Math.round(wpKosten * (1 - pvAnteil / 100 * 0.7));

  const paragraphs = [
    // Variante 1: Klimatisch-technischer Fokus
    `${city.name} liegt in der Klimazone „${kl}" mit einer Jahresmitteltemperatur von ${city.avgTemp} °C und ${city.heizgradtage} Heizgradtagen (Kd/a). Die DIN-Norm-Außentemperatur beträgt ${city.normAussentemp} °C — dieser Wert bestimmt die Auslegung der Wärmepumpe am kältesten Tag. Bei diesen Bedingungen erreicht eine Luft-Wasser-Wärmepumpe in ${city.name} eine Jahresarbeitszahl von ${jaz}. Das bedeutet: Aus ${wpStrom.toLocaleString('de-DE')} kWh Strom werden ${Math.round(wpStrom * jaz).toLocaleString('de-DE')} kWh Heizwärme erzeugt. Im Vergleich: Ein Gaskessel benötigt ${Math.round(gasKosten / (city.gaspreis / 100)).toLocaleString('de-DE')} kWh Erdgas für die gleiche Wärme und stößt dabei ca. ${co2Ersparnis > 0 ? co2Ersparnis.toLocaleString('de-DE') : '1.200'} kg CO₂ mehr aus als die Wärmepumpe.`,

    // Variante 2: Wirtschaftlicher Fokus
    `Die Wirtschaftlichkeit einer Wärmepumpe in ${city.name} ergibt sich aus dem lokalen Strompreis von ${city.strompreis} ct/kWh und dem Gaspreis von ${city.gaspreis} ct/kWh. Bei JAZ ${jaz} kostet eine Kilowattstunde Wärme aus der Wärmepumpe ${(city.strompreis / jaz).toFixed(1)} ct — Gas liegt bei ${city.gaspreis} ct/kWh, Tendenz steigend durch den CO₂-Preis (2026: 55 €/t, 2027: 65 €/t). Auf das Jahr gerechnet sind das ${fmtEuro(wpKosten)} Heizkosten mit WP gegenüber ${fmtEuro(gasKosten)} mit Gas — eine Differenz von ${fmtEuro(ersparnis)}. Über 20 Jahre Nutzungsdauer summiert sich die Ersparnis auf rund ${fmtEuro(ersparnis * 20)}, abzüglich Wartung (Ø 300 €/a) verbleiben ${fmtEuro(ersparnis * 20 - 6000)} netto. Mit einer 8-kWp-PV-Anlage (${pvErtrag.toLocaleString('de-DE')} kWh/a in ${city.name}) sinken die WP-Betriebskosten auf ca. ${fmtEuro(wpMitPV)}/Jahr.`,

    // Variante 3: Gebäudebestand-Fokus
    `Der Gebäudebestand in ${city.name} ist für Wärmepumpen ${sz === 'metropole' || sz === 'grossstadt' ? 'vielfältig — von Gründerzeit-Altbauten bis zum Neubauquartier' : 'typisch für ' + city.bundesland + ' — überwiegend Ein- und Zweifamilienhäuser'}. ${city.efhQuote}% Einfamilienhäuser und eine Fernwärmequote von ${city.fernwaermeQuote}% bedeuten: In ${100 - city.fernwaermeQuote}% der Gebäude ist die Wärmepumpe die wirtschaftlichste GEG-konforme Option. Der mittlere Gebäudeenergiebedarf liegt bei ca. ${Math.round(wpStrom * jaz / 120)} kWh/m²/a — bei 120 m² Wohnfläche ergibt das einen jährlichen Wärmebedarf von ${Math.round(wpStrom * jaz).toLocaleString('de-DE')} kWh. Eine Luft-Wasser-WP mit JAZ ${jaz} benötigt dafür ${wpStrom.toLocaleString('de-DE')} kWh Strom zu ${fmtEuro(wpKosten)}/Jahr.`,

    // Variante 4: Förder-Fokus mit Bundesland
    `In ${city.name} (${city.bundesland}) stehen Hausbesitzern 2026 umfangreiche Fördermittel zur Verfügung. Die KfW-Bundesförderung (BEG 458) gewährt 30% Grundförderung + 20% Klima-Speed-Bonus (bei Ersatz einer fossilen Heizung als Eigennutzer) + optional 30% Einkommensbonus oder 5% Kältemittelbonus. ${city.bundeslandFoerderung ? `Zusätzlich gibt es in ${city.bundesland} das Programm „${city.bundeslandFoerderung}" mit ${city.bundeslandFoerderungBetrag}.` : `${city.bundesland} setzt primär auf die KfW-Bundesmittel — kein separater Landesantrag nötig.`} Bei einer typischen Investition von 25.000 € und 55% Förderquote beträgt der Eigenanteil ${fmtEuro(Math.round(25000 * 0.45))}. Mit der jährlichen Ersparnis von ${fmtEuro(ersparnis)} amortisiert sich das in ${Math.round(25000 * 0.45 / ersparnis)} Jahren.`,

    // Variante 5: Vergleichsfokus mit Nachbarregion
    `${city.name} im regionalen Vergleich: Mit ${city.strompreis} ct/kWh Strompreis liegt die Stadt ${city.strompreis < 30 ? 'unter' : city.strompreis > 31 ? 'über' : 'im'} dem Bundesdurchschnitt von 30,5 ct/kWh. Der Gaspreis von ${city.gaspreis} ct/kWh ist ${city.gaspreis < 8.5 ? 'günstig' : city.gaspreis > 10 ? 'erhöht' : 'durchschnittlich'} — steigt aber durch den CO₂-Preis jährlich um ca. 0,5–1,0 ct/kWh. ${city.heizgradtage} Heizgradtage bedeuten ${city.heizgradtage > 3400 ? 'überdurchschnittlichen Heizbedarf — die Einsparung durch die effiziente WP fällt hier besonders hoch aus' : city.heizgradtage < 3000 ? 'einen moderaten Heizbedarf, der die WP-Betriebskosten niedrig hält' : 'einen typischen Heizbedarf für die Region'}. JAZ ${jaz} bei ${city.avgTemp} °C Jahresmittel ist der für ${city.name} spezifische Effizienzwert.`,

    // Variante 6: Zukunftsperspektive
    `Die Entscheidung für eine Wärmepumpe in ${city.name} ist auch eine Investition in den Immobilienwert. Studien zeigen: Häuser mit Wärmepumpe erzielen 5–15% höhere Verkaufspreise als vergleichbare Objekte mit fossiler Heizung. In ${city.name} mit ${city.einwohner.toLocaleString('de-DE')} Einwohnern und ${city.efhQuote}% EFH-Anteil ist der Immobilienmarkt ${sz === 'metropole' || sz === 'grossstadt' ? 'stark nachgefragt — eine moderne Heizung ist ein wichtiges Verkaufsargument' : 'stabil — eine zukunftssichere Heizung schützt den Wert Ihrer Immobilie'}. Dazu kommt: Ab ${city.gegFrist.split('-').reverse().join('.')} gilt in ${city.name} die GEG-65%-Pflicht. Wer vorher umrüstet, sichert sich die volle Förderung und ist dem Zeitdruck voraus.`,
  ];

  return paragraphs[hash % paragraphs.length];
}

// ── 20. PV+WP KOMBINATION — Solarsynergie mit stadtspezifischen Sonnenstunden ──

export function getPVWPKombination(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): { title: string; paragraphs: string[]; stats: Array<{ label: string; value: string; detail: string }> } {
  const pvKWp = 8;
  const pvErtrag = Math.round(city.avgSunHours * pvKWp * 0.85);
  const wpStrom = Math.round(wpKosten / (city.strompreis / 100));
  const eigenverbrauch = Math.min(Math.round(pvErtrag * 0.35), wpStrom);
  const eigenverbrauchQuote = Math.round(eigenverbrauch / wpStrom * 100);
  const pvErsparnis = Math.round(eigenverbrauch * (city.strompreis / 100));
  const wpMitPV = wpKosten - pvErsparnis;
  const einspeiseverguetung = Math.round((pvErtrag - eigenverbrauch) * 0.082);
  const pvInvest = pvKWp * 1200;
  const pvAmortisation = Math.round(pvInvest / (pvErsparnis + einspeiseverguetung));
  const hash = cityHash(city, 4);
  const kl = getKlimaZone(city);

  const titles = [
    `PV + Wärmepumpe in ${city.name}: Die optimale Kombination`,
    `Solarstrom für Ihre Wärmepumpe in ${city.name}`,
    `Photovoltaik & Wärmepumpe in ${city.name} kombinieren`,
    `Eigenverbrauch maximieren: PV + WP in ${city.name}`,
  ];

  const p1Variants = [
    `${city.name} hat ${city.avgSunHours} Sonnenstunden pro Jahr — ${city.avgSunHours > 1650 ? 'überdurchschnittlich viel für Deutschland und ideal für eine PV-Anlage' : city.avgSunHours > 1500 ? 'ein solider Wert für eine wirtschaftliche PV-Anlage' : 'weniger als der Süddeutsche Schnitt, aber immer noch rentabel'}. Eine ${pvKWp}-kWp-Anlage auf Ihrem Dach in ${city.name} erzeugt ca. ${pvErtrag.toLocaleString('de-DE')} kWh Strom pro Jahr. Davon können bis zu ${eigenverbrauch.toLocaleString('de-DE')} kWh (${eigenverbrauchQuote}%) direkt von der Wärmepumpe verbraucht werden — Strom, den Sie nicht mehr für ${city.strompreis} ct/kWh kaufen müssen.`,
    `Die Kombination aus Photovoltaik und Wärmepumpe ist in ${city.name} besonders attraktiv: ${city.avgSunHours} Sonnenstunden/Jahr ermöglichen eine Eigenverbrauchsquote von ${eigenverbrauchQuote}% des WP-Stroms. Bei ${city.strompreis} ct/kWh bedeutet das ${fmtEuro(pvErsparnis)} weniger Stromkosten pro Jahr für die Wärmepumpe. Dazu kommen ${fmtEuro(einspeiseverguetung)} Einspeisevergütung für den überschüssigen Solarstrom.`,
    `Wer in ${city.name} eine Wärmepumpe plant, sollte eine PV-Anlage gleich mitdenken. Grund: Bei ${city.avgSunHours} Sonnenstunden erzeugt eine ${pvKWp}-kWp-Anlage ${pvErtrag.toLocaleString('de-DE')} kWh/Jahr. Die Wärmepumpe verbraucht ${wpStrom.toLocaleString('de-DE')} kWh/Jahr — ${eigenverbrauchQuote}% davon kann direkt vom eigenen Dach kommen. Das senkt die Heizkosten von ${fmtEuro(wpKosten)} auf nur ${fmtEuro(wpMitPV)}/Jahr.`,
    `Photovoltaik in ${city.name}: ${city.avgSunHours} Sonnenstunden, ${pvErtrag.toLocaleString('de-DE')} kWh Ertrag bei ${pvKWp} kWp. In Kombination mit der Wärmepumpe (JAZ ${jaz}, ${wpStrom.toLocaleString('de-DE')} kWh Stromverbrauch) ergibt sich ein Eigenverbrauchsanteil von ${eigenverbrauchQuote}%. Die jährliche Ersparnis: ${fmtEuro(pvErsparnis)} weniger Netzstrom + ${fmtEuro(einspeiseverguetung)} Einspeisevergütung. Amortisation der PV-Anlage: ca. ${pvAmortisation} Jahre.`,
  ];

  const p2Variants = [
    `Finanziell betrachtet: Die PV-Anlage kostet ca. ${fmtEuro(pvInvest)} (inkl. Montage, netto nach MwSt.-Befreiung seit 2023). Jährlicher Gewinn: ${fmtEuro(pvErsparnis)} Eigenverbrauch + ${fmtEuro(einspeiseverguetung)} Einspeisung = ${fmtEuro(pvErsparnis + einspeiseverguetung)}/Jahr. Amortisation in ${pvAmortisation} Jahren — danach läuft die Anlage 15+ Jahre auf reinen Gewinn. Über 25 Jahre Lebensdauer: ${fmtEuro((pvErsparnis + einspeiseverguetung) * 25)} Gesamtertrag.`,
    `Die Wirtschaftlichkeit in ${city.name}: Eine ${pvKWp}-kWp-PV-Anlage senkt die WP-Betriebskosten um ${fmtEuro(pvErsparnis)}/Jahr. Gesamte Energiekosten (Heizung + Warmwasser) sinken auf ${fmtEuro(wpMitPV)}/Jahr — das sind ${fmtEuro(wpKosten + ersparnis - wpMitPV)} weniger als mit Gas. Investition PV: ${fmtEuro(pvInvest)}, amortisiert in ${pvAmortisation} Jahren. ${kl === 'warm' ? 'Der milde Standort begünstigt auch im Winter akzeptable PV-Erträge.' : kl === 'kalt' ? 'Im Winter sinken die PV-Erträge — ein Batteriespeicher kann die Eigenverbrauchsquote auf 50-65% steigern.' : 'Für höhere Eigenverbrauchsquoten empfiehlt sich ein 5-8 kWh Batteriespeicher.'}`,
    `Kosten-Nutzen in ${city.name}: Ohne PV zahlen Sie ${fmtEuro(wpKosten)}/Jahr Strom für die WP. Mit PV sinkt das auf ${fmtEuro(wpMitPV)}/Jahr — eine Differenz von ${fmtEuro(pvErsparnis)}. Plus: ${fmtEuro(einspeiseverguetung)} Einspeisevergütung (8,2 ct/kWh für ${(pvErtrag - eigenverbrauch).toLocaleString('de-DE')} kWh Überschuss). Die PV-Anlage amortisiert sich in ${pvAmortisation} Jahren. Tipp: KfW fördert PV-Speicher separat über Programm 270.`,
    `Rechenbeispiel für ${city.name}: WP-Strom ohne PV = ${fmtEuro(wpKosten)}/Jahr. WP-Strom mit ${pvKWp}-kWp-PV = ${fmtEuro(wpMitPV)}/Jahr. Einspeisevergütung für Überschuss = ${fmtEuro(einspeiseverguetung)}/Jahr. Netto-Heizkosten mit PV+WP: ${fmtEuro(wpMitPV - einspeiseverguetung)}/Jahr. Zum Vergleich: Gas kostet ${fmtEuro(wpKosten + ersparnis)}/Jahr — mit steigender Tendenz durch CO₂-Preis.`,
  ];

  const stats = [
    { label: 'Sonnenstunden/Jahr', value: `${city.avgSunHours}`, detail: `${kl === 'warm' ? 'Überdurchschnittlich' : 'Solide'}` },
    { label: 'PV-Ertrag', value: `${pvErtrag.toLocaleString('de-DE')} kWh`, detail: `${pvKWp} kWp Anlage` },
    { label: 'Eigenverbrauch WP', value: `${eigenverbrauchQuote}%`, detail: `${eigenverbrauch.toLocaleString('de-DE')} kWh` },
    { label: 'WP-Kosten mit PV', value: fmtEuro(wpMitPV), detail: `statt ${fmtEuro(wpKosten)}` },
    { label: 'PV-Amortisation', value: `${pvAmortisation} Jahre`, detail: `bei ${fmtEuro(pvInvest)} Invest` },
    { label: 'Gesamtersparnis/Jahr', value: fmtEuro(pvErsparnis + einspeiseverguetung), detail: 'Eigenverbrauch + Einspeisung' },
  ];

  return {
    title: titles[hash % titles.length],
    paragraphs: [p1Variants[hash % p1Variants.length], p2Variants[(hash + 1) % p2Variants.length]],
    stats,
  };
}

// ── 21. ROI-TIMELINE — Jahr-für-Jahr Wirtschaftlichkeitsprojektion ────────────

export function getROITimeline(
  city: City,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
  foerdersatz: number,
): Array<{ year: number; label: string; wpKumuliert: number; gasKumuliert: number; differenz: number; highlight?: string }> {
  const investition = 25000;
  const eigenanteil = Math.round(investition * (1 - foerdersatz / 100));
  const wartungWP = 300;
  const wartungGas = 250;
  const co2PreisStart = 55; // €/t in 2026
  const gasVerbrauch = Math.round((wpKosten + ersparnis) / (city.gaspreis / 100)); // kWh Gas
  const co2PerKwh = 0.000201; // t CO₂ per kWh Gas

  const timeline: Array<{ year: number; label: string; wpKumuliert: number; gasKumuliert: number; differenz: number; highlight?: string }> = [];
  let wpKum = eigenanteil; // Start: Eigenanteil als initiale Kosten
  let gasKum = 0;

  for (let y = 1; y <= 20; y++) {
    const year = 2026 + y - 1;
    const co2Preis = co2PreisStart + (y - 1) * 5; // +5€/t pro Jahr
    const co2Kosten = Math.round(gasVerbrauch * co2PerKwh * co2Preis);
    const gasJahr = wpKosten + ersparnis + wartungGas + co2Kosten;
    const wpJahr = wpKosten + wartungWP;
    const stromPreisAnstieg = Math.round(wpKosten * (1 + (y - 1) * 0.02)); // 2% jährlich
    const gasPreisAnstieg = Math.round(gasJahr * (1 + (y - 1) * 0.03)); // 3% jährlich

    wpKum += wpJahr;
    gasKum += gasJahr;

    let highlight: string | undefined;
    if (wpKum <= gasKum && (y === 1 || (wpKum - wpJahr) > (gasKum - gasJahr))) {
      highlight = 'Amortisationspunkt erreicht';
    }
    if (y === 5) highlight = '5-Jahres-Bilanz';
    if (y === 10) highlight = '10-Jahres-Bilanz';
    if (y === 15) highlight = '15-Jahres-Bilanz';
    if (y === 20) highlight = '20-Jahres-Gesamtbilanz';

    timeline.push({
      year,
      label: `Jahr ${y}`,
      wpKumuliert: wpKum,
      gasKumuliert: gasKum,
      differenz: gasKum - wpKum,
      highlight,
    });
  }

  return timeline;
}

// ── 22. NACHBARSCHAFTSVERGLEICH — Kennzahlen im Vergleich mit Nachbarstädten ──

export function getNachbarschaftsvergleich(
  city: City,
  nearby: City[],
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): { paragraph: string; table: { headers: string[]; rows: string[][] } } {
  const hash = cityHash(city, 4);

  const compareData = nearby.slice(0, 4).map(n => {
    const nJaz = Math.round((3.5 + (n.avgTemp - 9.0) * 0.1) * 10) / 10;
    const nBedarf = 120 * 160;
    const nWpKosten = Math.round(nBedarf / nJaz * (n.strompreis / 100));
    const nGasKosten = Math.round(nBedarf / 0.92 * (n.gaspreis / 100));
    return {
      name: n.name,
      strompreis: n.strompreis,
      gaspreis: n.gaspreis,
      hgt: n.heizgradtage,
      jaz: nJaz,
      wpKosten: nWpKosten,
      ersparnis: nGasKosten - nWpKosten,
    };
  });

  const paragraphVariants = [
    `Wie steht ${city.name} im regionalen Vergleich da? Mit ${city.strompreis} ct/kWh Strompreis ${city.strompreis < (compareData[0]?.strompreis || 30) ? 'günstiger' : 'teurer'} als ${compareData[0]?.name || 'die Nachbarstadt'} (${compareData[0]?.strompreis || '30'} ct/kWh). Die JAZ von ${jaz} in ${city.name} ${jaz > (compareData[0]?.jaz || 3.5) ? 'übertrifft' : 'liegt unter'} dem Nachbarwert von ${compareData[0]?.jaz || 3.5}. Das ergibt eine Jahresersparnis von ${fmtEuro(ersparnis)} — ${ersparnis > (compareData[0]?.ersparnis || 800) ? 'höher' : 'vergleichbar mit'} der Region.`,
    `${city.name} vs. Umland: Strompreis ${city.strompreis} ct/kWh, Heizgradtage ${city.heizgradtage}, JAZ ${jaz}. ${compareData.length > 0 ? `Im Vergleich: ${compareData[0].name} hat ${compareData[0].hgt} HGT und JAZ ${compareData[0].jaz}${compareData.length > 1 ? `, ${compareData[1].name} hat ${compareData[1].hgt} HGT und JAZ ${compareData[1].jaz}` : ''}.` : ''} Die wirtschaftlichste WP-Installation in der Region? Das hängt vom Verhältnis Strompreis/JAZ ab — in ${city.name} liegt dieser bei ${(city.strompreis / jaz).toFixed(1)} ct/kWh effektiv.`,
    `Regionaler Kostenvergleich: Eine Wärmepumpe in ${city.name} kostet im Betrieb ${fmtEuro(wpKosten)}/Jahr. ${compareData.length > 0 ? `In ${compareData[0].name} sind es ${fmtEuro(compareData[0].wpKosten)}/Jahr${compareData.length > 1 ? `, in ${compareData[1].name} ${fmtEuro(compareData[1].wpKosten)}/Jahr` : ''}.` : ''} Die Unterschiede ergeben sich aus Strompreis (${city.strompreis} vs. ${compareData[0]?.strompreis || '30'} ct/kWh) und Klimabedingungen (JAZ ${jaz} vs. ${compareData[0]?.jaz || '3.5'}).`,
    `So schneidet ${city.name} im Vergleich mit der Region ab: Die Wärmepumpe spart hier ${fmtEuro(ersparnis)} pro Jahr gegenüber Gas. ${compareData.length > 1 ? `In ${compareData[0].name} sind es ${fmtEuro(compareData[0].ersparnis)}, in ${compareData[1].name} ${fmtEuro(compareData[1].ersparnis)}.` : ''} ${ersparnis > 900 ? 'Überdurchschnittlich — der Standort ist für eine WP besonders attraktiv.' : 'Ein solider Wert im regionalen Vergleich.'}`,
  ];

  const headers = ['Stadt', 'Strompreis', 'HGT', 'JAZ', 'WP-Kosten/a', 'Ersparnis/a'];
  const rows: string[][] = [
    [city.name + ' ★', `${city.strompreis} ct`, `${city.heizgradtage}`, `${jaz}`, fmtEuro(wpKosten), fmtEuro(ersparnis)],
    ...compareData.map(d => [d.name, `${d.strompreis} ct`, `${d.hgt}`, `${d.jaz}`, fmtEuro(d.wpKosten), fmtEuro(d.ersparnis)]),
  ];

  return {
    paragraph: paragraphVariants[hash % paragraphVariants.length],
    table: { headers, rows },
  };
}

// ── 23. HEIZKÖRPER-KOMPATIBILITÄT — Bestandsheizung-Check pro Gebäudetyp ──────

export function getHeizkoerperCheck(
  city: City,
  keyword: Keyword,
): { title: string; paragraph: string; checklist: Array<{ item: string; status: 'ok' | 'pruefen' | 'upgrade'; detail: string }> } {
  const sz = getCitySize(city);
  const hash = cityHash(city, 6);

  const titles = [
    `Heizkörper-Check für ${city.name}: Ist Ihr Haus WP-ready?`,
    `Bestandsanalyse ${city.name}: Passen Ihre Heizkörper zur Wärmepumpe?`,
    `Vorlauftemperatur & Heizkörper in ${city.name} — das müssen Sie wissen`,
  ];

  const paragraphs = [
    `Die größte Sorge beim Heizungstausch in ${city.name}: „Reichen meine Heizkörper für eine Wärmepumpe?" Die Antwort ist in den meisten Fällen ja. Moderne Luft-Wasser-Wärmepumpen arbeiten effizient bis 70°C Vorlauftemperatur. Ein hydraulischer Abgleich (€500–1.500, KfW-förderfähig) senkt die nötige Vorlauftemperatur oft um 5–10°C und verbessert die JAZ. ${sz === 'metropole' || sz === 'grossstadt' ? `In ${city.name} sind viele Gebäude aus den 1960er–1980er Jahren mit überdimensionierten Heizkörpern ausgestattet — ein Vorteil für die WP, da sie bei niedrigerer Vorlauftemperatur genug Wärme abgeben.` : `In ${city.name} überwiegen ${city.efhQuote > 60 ? 'Einfamilienhäuser' : 'gemischte Gebäudetypen'} — häufig mit Heizkörpern, die für die Wärmepumpe gut geeignet sind.`}`,
    `Heizkörper und Wärmepumpe in ${city.name}: Der Schlüssel ist die Vorlauftemperatur. Bei ${city.normAussentemp}°C Norm-Außentemperatur (DIN EN 12831) benötigt ein typisches ${city.efhQuote > 60 ? 'Einfamilienhaus' : 'Gebäude'} in ${city.name} zwischen 45°C und 65°C Vorlauf — abhängig von Baujahr und Dämmstandard. Faustregel: Gebäude ab 1990 mit Standardheizkörpern → kein Heizkörpertausch nötig. Vor 1980 → hydraulischer Abgleich und ggf. einzelne Heizkörper in Bad/Wohnzimmer vergrößern. Fußbodenheizung → ideal, Vorlauf 30–35°C, JAZ steigt auf ${(Number(city.avgTemp > 9 ? 3.8 : 3.5) + 0.3).toFixed(1)}.`,
    `In ${city.name} gibt es typischerweise drei Gebäudesituationen: (1) Neubau/Sanierung mit Fußbodenheizung → WP sofort einsetzbar, maximale Effizienz. (2) Bestandsbau 1980–2010 mit Flachheizkörpern → meist kompatibel, hydraulischer Abgleich empfohlen. (3) Altbau vor 1980 mit Rippenheizkörpern → Einzelfallprüfung nötig, oft reicht der Tausch von 2–3 Heizkörpern in kritischen Räumen. Unsere Partnerbetriebe in ${city.name} führen vor Ort eine kostenlose Bestandsaufnahme durch.`,
    `WP-Tauglichkeitscheck für ${city.name}: Ihre Bestandsheizung gibt Auskunft. Wenn Ihre aktuelle Gasheizung auf 55°C oder weniger Vorlauf eingestellt ist, ist Ihr Haus WP-ready ohne Heizkörpertausch. Bei 60–70°C → hydraulischer Abgleich + ggf. einzelne Heizkörper. Über 70°C → Sanierung empfohlen (aber auch hier gibt es Hochtemperatur-WP bis 75°C). In ${city.name} liegt der typische Vorlauf bei ${city.heizgradtage > 3400 ? '55–65°C' : city.heizgradtage > 3000 ? '50–60°C' : '45–55°C'}.`,
    `${city.name}: Die häufigste Frage unserer Kunden ist „Muss ich alle Heizkörper tauschen?" In 85% der Fälle lautet die Antwort: Nein. ${sz === 'kleinstadt' ? 'In kleineren Städten wie ' + city.name + ' dominieren Einfamilienhäuser — oft mit großzügig dimensionierten Heizkörpern, die bei reduziertem Vorlauf ausreichend heizen.' : 'Die Gebäudestruktur in ' + city.name + ' ist gemischt, aber die meisten Bestandsbauten sind WP-tauglich.'} Der hydraulische Abgleich ist in jedem Fall Pflicht für die KfW-Förderung — und eine lohnende Investition.`,
    `Fußbodenheizung vs. Heizkörper in ${city.name}: Bei Fußbodenheizung (Vorlauf 30–35°C) erreicht die WP eine Top-JAZ von ${(Number(city.avgTemp > 9 ? 3.8 : 3.5) + 0.3).toFixed(1)}. Bei Flachheizkörpern (Vorlauf 45–55°C) sinkt die JAZ auf ca. ${Number(city.avgTemp > 9 ? 3.5 : 3.2).toFixed(1)} — immer noch wirtschaftlich bei ${city.strompreis} ct/kWh. Nur alte Rippenheizkörper (>65°C Vorlauf) können die Effizienz merklich senken. Lösung: Heizkörper in 2–3 Räumen vergrößern — Kosten ca. €1.000–2.500, KfW-förderfähig als Umfeldmaßnahme.`,
  ];

  const checklist = [
    { item: 'Fußbodenheizung vorhanden', status: 'ok' as const, detail: 'Ideal — Vorlauf 30-35°C, maximale JAZ' },
    { item: 'Flachheizkörper (ab 1990)', status: 'ok' as const, detail: 'In der Regel kompatibel bei 45-55°C Vorlauf' },
    { item: 'Ältere Kompaktheizkörper', status: 'pruefen' as const, detail: 'Hydraulischer Abgleich empfohlen — oft ausreichend' },
    { item: 'Rippenheizkörper (Guss)', status: 'pruefen' as const, detail: 'Einzelne Räume ggf. nachrüsten — Badezimmer, Wohnzimmer' },
    { item: 'Vorlauf aktuell >65°C', status: 'upgrade' as const, detail: 'Heizkörper vergrößern oder Hochtemperatur-WP wählen' },
    { item: `Hydraulischer Abgleich ${city.name}`, status: 'pruefen' as const, detail: 'KfW-Pflicht — senkt Vorlauf um 5-10°C, verbessert JAZ' },
  ];

  return {
    title: titles[hash % titles.length],
    paragraph: paragraphs[hash % paragraphs.length],
    checklist,
  };
}

// ── 24. STROMTARIF-OPTIMIERUNG — WP-Tarife & SG-Ready pro Stadt ──────────────

export function getStromtarifOptimierung(
  city: City,
  jaz: number,
  wpKosten: number,
): { paragraph: string; tips: Array<{ tip: string; ersparnis: string }> } {
  const hash = cityHash(city, 5);
  const wpStrom = Math.round(wpKosten / (city.strompreis / 100));
  const wpTarifPreis = Math.round(city.strompreis * 0.82 * 10) / 10; // ~18% günstiger
  const wpTarifErsparnis = Math.round(wpStrom * (city.strompreis - wpTarifPreis) / 100);
  const sgReadyErsparnis = Math.round(wpStrom * 0.15 * (city.strompreis / 100) * 0.5); // 15% des Stroms zu 50% Preis

  const paragraphs = [
    `In ${city.name} zahlen Sie aktuell ${city.strompreis} ct/kWh Haushaltsstrom. Für Wärmepumpen bieten viele Versorger spezielle WP-Tarife an — typisch ${wpTarifPreis} ct/kWh (ca. 18% günstiger). Voraussetzung: separater Zähler und Lastabwurfvereinbarung (der Versorger darf die WP bis zu 3×2h/Tag abschalten — in der Praxis kaum spürbar dank Pufferspeicher). Bei ${wpStrom.toLocaleString('de-DE')} kWh WP-Stromverbrauch spart das ${fmtEuro(wpTarifErsparnis)}/Jahr. Der zweite Zähler kostet ca. €80/Jahr Grundgebühr — rechnet sich ab ca. 4.000 kWh WP-Verbrauch, was in ${city.name} problemlos erreicht wird.`,
    `Stromkosten-Optimierung für Wärmepumpenbesitzer in ${city.name}: Drei Hebel reduzieren Ihre Betriebskosten. Erstens: WP-Sondertarif (${wpTarifPreis} ct/kWh statt ${city.strompreis} ct/kWh — Ersparnis ${fmtEuro(wpTarifErsparnis)}/Jahr). Zweitens: SG-Ready-Funktion nutzen (die WP heizt bevorzugt zu günstigen Börsenstromzeiten — Ersparnis ${fmtEuro(sgReadyErsparnis)}/Jahr). Drittens: PV-Eigenverbrauch maximieren (${city.avgSunHours} Sonnenstunden in ${city.name} bieten Potenzial). Alle drei Maßnahmen zusammen können die WP-Kosten um 25–35% senken.`,
    `WP-Tarif in ${city.name}: Die meisten Grundversorger und alternativen Anbieter in ${city.bundesland} bieten Wärmepumpentarife an. Der typische Preis liegt bei ${wpTarifPreis} ct/kWh — ${(city.strompreis - wpTarifPreis).toFixed(1)} ct günstiger als Haushaltsstrom. Bei Ihrem geschätzten WP-Verbrauch von ${wpStrom.toLocaleString('de-DE')} kWh/Jahr ergibt das ${fmtEuro(wpTarifErsparnis)} Ersparnis. Voraussetzung: Ein separater Stromzähler (Kosten: €200–400 Installation + ca. €80/Jahr). Ab dem zweiten Jahr rechnet sich die Investition.`,
    `Intelligentes Heizen in ${city.name}: Moderne Wärmepumpen mit SG-Ready-Schnittstelle nutzen flexible Stromtarife. Wenn der Börsenstrompreis niedrig ist (typisch nachts und mittags), heizt die WP den Pufferspeicher auf — und verbraucht weniger teuren Spitzenlaststrom. In ${city.name} können SG-Ready-WP-Besitzer ${fmtEuro(sgReadyErsparnis)}/Jahr zusätzlich sparen. Kombiniert mit einem WP-Sondertarif (${wpTarifPreis} ct/kWh) sinken die jährlichen Heizkosten auf unter ${fmtEuro(Math.round(wpKosten * 0.75))}.`,
    `Energiemanagement in ${city.name}: Drei Strategien für minimale WP-Betriebskosten. (1) WP-Stromtarif: ${wpTarifPreis} ct/kWh statt ${city.strompreis} ct/kWh = ${fmtEuro(wpTarifErsparnis)} Ersparnis. (2) Smart Grid: SG-Ready-WP + dynamischer Tarif = ${fmtEuro(sgReadyErsparnis)} extra. (3) PV-Kombination: ${city.avgSunHours} Sonnenstunden × 8 kWp = ca. ${Math.round(city.avgSunHours * 8 * 0.85 * 0.35).toLocaleString('de-DE')} kWh Eigenverbrauch. Gesamtpotenzial: 30–40% Betriebskostensenkung gegenüber Normaltarif.`,
  ];

  const tips = [
    { tip: `WP-Sondertarif beantragen (${wpTarifPreis} ct/kWh)`, ersparnis: `${fmtEuro(wpTarifErsparnis)}/Jahr` },
    { tip: 'SG-Ready-Funktion aktivieren (Smart Grid)', ersparnis: `${fmtEuro(sgReadyErsparnis)}/Jahr` },
    { tip: 'Separaten WP-Zähler installieren lassen', ersparnis: 'Voraussetzung für WP-Tarif' },
    { tip: 'Pufferspeicher dimensionieren (300-500l)', ersparnis: 'Flexibilität für Lastverschiebung' },
    { tip: `PV-Anlage (${city.avgSunHours} Sonnenstd. in ${city.name})`, ersparnis: `bis ${fmtEuro(Math.round(city.avgSunHours * 8 * 0.85 * 0.35 * city.strompreis / 100))}/Jahr` },
  ];

  return {
    paragraph: paragraphs[hash % paragraphs.length],
    tips,
  };
}

// ── 25. KEYWORD-SPEZIFISCHER TIEFENINHALT — 300+ Wörter pro Keyword-Kategorie ──

export function getKeywordDeepContent(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
): { heading: string; paragraphs: string[] } {
  const cat = getKwCategory(keyword);
  const hash = cityHash(city, 3);
  const gasKosten = wpKosten + ersparnis;
  const sz = getCitySize(city);

  const content: Record<KwCategory, { heading: string; paragraphs: string[] }[]> = {
    kosten: [
      {
        heading: `Vollkosten-Analyse: Wärmepumpe in ${city.name} — was kostet wirklich was?`,
        paragraphs: [
          `Die Investitionskosten einer Wärmepumpe in ${city.name} setzen sich aus mehreren Komponenten zusammen, die in vielen Angeboten unvollständig aufgeführt werden. Das Wärmepumpengerät selbst (Luft-Wasser, Monoblock oder Split) kostet zwischen 10.000 und 18.000 €, abhängig von Hersteller, Leistungsklasse und Kältemittel. In ${city.name} empfehlen wir bei ${city.normAussentemp}°C Auslegungstemperatur eine Heizleistung von ${Math.round(120 * 160 / 2000)}-${Math.round(120 * 160 / 1800)} kW für ein 120-m²-Einfamilienhaus.`,
          `Die Montagekosten in ${city.name} liegen bei 3.000 bis 6.000 € — ${sz === 'metropole' || sz === 'grossstadt' ? 'in der Großstadt eher am oberen Ende durch höhere Lohnkosten' : 'in dieser Region eher moderate Preise dank lokaler Betriebe ohne Großstadt-Aufschlag'}. Dazu kommen: Hydraulischer Abgleich (500–1.500 €, KfW-Pflicht), Elektroinstallation (800–1.500 €, oft wird ein Drehstromanschluss benötigt), Fundament/Stellfläche für Außeneinheit (200–800 €), und optional Pufferspeicher (800–2.500 € für 300–500 Liter). Die Gesamtinvestition für ${city.name}: 15.000–28.000 € brutto — nach KfW-Förderung ab ca. ${fmtEuro(Math.round(15000 * (1 - 0.55)))} Eigenanteil.`,
          `Versteckte Kosten, die viele Angebote verschweigen: Erdarbeiten für Leitungsführung (200–600 €), Schallschutzmaßnahmen ${sz === 'metropole' ? '(in ' + city.name + ' besonders wichtig wegen dichter Bebauung — 300–1.000 €)' : '(in ' + city.name + ' meist unkompliziert — 0–500 €)'}, Demontage der alten Heizung (300–800 €), Anpassung der Heizungsrohre (500–2.000 € im Altbau). Unser Tipp: Fordern Sie immer ein Festpreisangebot inkl. aller Nebenkosten an. Unsere Partnerbetriebe in ${city.name} erstellen transparente Komplett-Angebote.`,
        ]
      },
      {
        heading: `Betriebskosten-Prognose ${city.name}: 2026 bis 2046`,
        paragraphs: [
          `Die laufenden Kosten einer Wärmepumpe in ${city.name} setzen sich zusammen aus Stromkosten (${fmtEuro(wpKosten)}/Jahr bei ${city.strompreis} ct/kWh und JAZ ${jaz}), Wartungskosten (200–400 €/Jahr) und Rücklagen für Reparaturen (Ø 100 €/Jahr). Gesamte jährliche Betriebskosten: ca. ${fmtEuro(wpKosten + 350)}.`,
          `Zum Vergleich: Eine Gasheizung in ${city.name} kostet ${fmtEuro(gasKosten)}/Jahr Brennstoff + 250 €/Jahr Wartung + steigenden CO₂-Preis (2026: ${Math.round(gasKosten / (city.gaspreis / 100) * 0.000201 * 55)} €, 2030: ${Math.round(gasKosten / (city.gaspreis / 100) * 0.000201 * 100)} €). Der CO₂-Preis steigt von 55 €/t (2026) auf voraussichtlich 100+ €/t (2030). Gas wird also jedes Jahr teurer — Strom für WP nur moderat (+2%/Jahr). Die Schere öffnet sich zugunsten der Wärmepumpe. In 10 Jahren spart die WP in ${city.name} ca. ${fmtEuro(Math.round(ersparnis * 10 * 1.15))} gegenüber Gas (inflationsbereinigt).`,
          `Lebensdauer und Gesamtkosten: Eine Luft-Wasser-WP hält 20–25 Jahre. Gesamtbetriebskosten über 20 Jahre in ${city.name}: ca. ${fmtEuro((wpKosten + 350) * 20)}. Eine Gasheizung (15 Jahre Lebensdauer, danach Ersatz nötig): ca. ${fmtEuro((gasKosten + 250) * 20 + 8000)} inkl. steigendem CO₂-Preis und einer Heizungserneuerung. Differenz über 20 Jahre: ca. ${fmtEuro(Math.round((gasKosten - wpKosten + 100) * 20 + 8000))} zugunsten der Wärmepumpe.`,
        ]
      },
      {
        heading: `Was kostet die Wärmepumpe nach Förderung in ${city.name}?`,
        paragraphs: [
          `Nach Abzug der KfW-Förderung bleiben in ${city.name} typischerweise 7.500 bis 14.000 € Eigenanteil. Das klingt viel — aber: Die Wärmepumpe spart ${fmtEuro(ersparnis)} pro Jahr an Heizkosten. Bei einem Eigenanteil von ${fmtEuro(Math.round(11000))} (Durchschnitt bei 55% Förderquote) amortisiert sich die Investition in ca. ${Math.round(11000 / ersparnis)} Jahren.`,
          `Finanzierungsmöglichkeiten in ${city.name}: KfW-Ergänzungskredit (Programm 358/359, bis 120.000 €, ab 0,01% Zinsen bei Einkommensbonus), Modernisierungskredit der Hausbank (oft 2–4% Zinsen), Leasingmodelle einzelner Hersteller. Unser Tipp: Der KfW-Ergänzungskredit ist fast immer die günstigste Option. Voraussetzung: Bewilligung des Zuschussantrags (BEG 458). Unser Partnerbetrieb in ${city.name} übernimmt die Antragstellung.`,
          `Steuerliche Aspekte: Handwerkerleistungen für die WP-Installation können zu 20% (max. 1.200 €/Jahr) von der Steuer abgesetzt werden — allerdings nur für den nicht geförderten Anteil. In ${city.name} lohnt es sich, mit dem Steuerberater zu sprechen, ob eine aufgeteilte Rechnung (geförderter + nicht geförderter Teil) steuerlich vorteilhafter ist.`,
        ]
      },
    ],
    foerderung: [
      {
        heading: `KfW-Förderung maximieren: Schritt-für-Schritt-Anleitung für ${city.name}`,
        paragraphs: [
          `Der wichtigste Satz zuerst: Der KfW-Antrag MUSS vor dem Abschluss eines Lieferungs- und Leistungsvertrags gestellt werden. Wer zuerst unterschreibt und dann beantragt, verliert den gesamten Zuschuss. In ${city.name} passiert das leider häufiger als nötig — oft aus Zeitdruck, weil der Installateur Kapazität frei hat. Unser Rat: Lassen Sie sich ein verbindliches Angebot erstellen (noch kein Auftrag!), stellen Sie den KfW-Antrag über das Zuschussportal, und beauftragen Sie erst nach Erhalt der Zuwendungsbescheinigung.`,
          `Die Fördersätze für ${city.name} im Detail: 30% Grundförderung (jeder Eigentümer, Selbstnutzer oder Vermieter). + 20% Klima-Speed-Bonus (nur Selbstnutzer, die eine funktionsfähige Gas-, Öl- oder Kohleheizung ersetzen, die mindestens 20 Jahre alt ist ODER einen Gaskessel jeglichen Alters). + 30% Einkommensbonus (Selbstnutzer mit unter 40.000 € zu versteuerndem Haushaltseinkommen). + 5% Effizienz-Bonus (natürliche Kältemittel wie R290 oder Erdwärmepumpe). Maximum: 70% von max. 30.000 € förderfähigen Kosten = bis zu 21.000 € Zuschuss.`,
          `${city.bundeslandFoerderung ? `Zusätzlich in ${city.bundesland}: Das Programm „${city.bundeslandFoerderung}" (${city.bundeslandFoerderungBetrag}) kann in bestimmten Fällen mit der KfW-Förderung kombiniert werden. Achtung: Doppelförderung für dieselbe Maßnahme ist nicht zulässig — aber für unterschiedliche Gewerke (z.B. KfW für WP, Landesförderung für PV-Speicher) oft möglich.` : `${city.bundesland} hat aktuell kein eigenes Landesprogramm für Wärmepumpen — die KfW-Bundesmittel sind aber großzügig genug. Einige Kommunen in ${city.bundesland} bieten zusätzliche Zuschüsse — fragen Sie bei Ihrer Stadtverwaltung in ${city.name} nach.`} Wir helfen Ihnen, die maximale Förderkombination für Ihre Situation in ${city.name} zu ermitteln.`,
        ]
      },
    ],
    installateur: [
      {
        heading: `So finden Sie den richtigen WP-Installateur in ${city.name}`,
        paragraphs: [
          `Die Qualität der Installation entscheidet über die Effizienz Ihrer Wärmepumpe in ${city.name}. Eine schlecht dimensionierte oder falsch installierte WP kann 20–30% weniger effizient arbeiten — das bedeutet ${fmtEuro(Math.round(wpKosten * 0.25))} mehr Stromkosten pro Jahr. Deshalb ist die Wahl des richtigen Fachbetriebs der wichtigste Schritt.`,
          `Qualitätskriterien für WP-Installateure in ${city.name}: (1) Mindestens 10 dokumentierte WP-Installationen (fragen Sie nach Referenzen). (2) HWK-eingetragener Meisterbetrieb. (3) Registrierung als KfW-Lieferanten- und Leistungserbringer (LuL). (4) Haftpflichtversicherung für Installationsfehler. (5) Vollständige Angebote ohne versteckte Positionen. ${sz === 'metropole' || sz === 'grossstadt' ? `In ${city.name} gibt es genug Auswahl — vergleichen Sie mindestens 3 Angebote.` : `In ${city.name} und Umgebung sind die Kapazitäten begrenzter — buchen Sie frühzeitig.`}`,
          `Wartezeiten in ${city.name}: Aktuell beträgt die durchschnittliche Wartezeit für einen WP-Installationstermin ${sz === 'metropole' ? '4–8 Wochen' : sz === 'grossstadt' ? '6–10 Wochen' : '8–14 Wochen'}. ${city.gegFrist <= '2026-12-31' ? `Besonders wichtig: Die GEG-Frist in ${city.name} rückt näher (${city.gegFrist.split('-').reverse().join('.')}). Wer jetzt anfrägt, sichert sich rechtzeitig Kapazität.` : `Die GEG-Frist in ${city.name} ist ${city.gegFrist.split('-').reverse().join('.')} — noch Zeit, aber die besten Betriebe sind oft weit im Voraus ausgebucht.`} Wir vermitteln Sie kostenlos an 3 geprüfte Fachbetriebe in ${city.name} und Umgebung.`,
        ]
      },
    ],
    technik: [
      {
        heading: `Technische Tiefenanalyse: Wärmepumpen-Effizienz in ${city.name}`,
        paragraphs: [
          `Die Effizienz einer Wärmepumpe in ${city.name} wird durch das lokale Klima bestimmt. Die Jahresmitteltemperatur von ${city.avgTemp}°C und die Norm-Außentemperatur von ${city.normAussentemp}°C (DIN EN 12831) ergeben eine standortspezifische Jahresarbeitszahl (JAZ) von ${jaz}. Diese JAZ berücksichtigt die gesamte Klimaverteilung — warme Tage (WP arbeitet sehr effizient mit COP >5) und kalte Tage (COP sinkt auf 2–3, aber kommt selten vor).`,
          `Leistungskurve für ${city.name}: Bei 7°C Außentemperatur (häufigster Betriebspunkt) erreicht eine typische Luft-WP einen COP von 4,2–4,8. Bei 0°C sinkt der COP auf 3,0–3,5. Bei ${city.normAussentemp}°C (Auslegungsfall, 2–5 Tage/Jahr) liegt der COP bei 2,2–2,8. Die JAZ von ${jaz} ist der gewichtete Jahresdurchschnitt aller Betriebspunkte. ${city.avgTemp >= 10 ? `Der milde Standort ${city.name} begünstigt die Effizienz — die meiste Zeit arbeitet die WP im optimalen Bereich.` : city.avgTemp < 8 ? `Der kühlere Standort ${city.name} erfordert eine sorgfältige Dimensionierung — aber auch hier ist die WP die wirtschaftlichste Lösung.` : `${city.name} liegt im klimatischen Mittelfeld — ideale Bedingungen für eine Luft-Wasser-WP.`}`,
          `Schallemissionen in ${city.name}: Moderne WP erzeugen 35–50 dB(A) in 3m Entfernung (vergleichbar mit einem Kühlschrank). ${sz === 'metropole' || sz === 'grossstadt' ? `In ${city.name} gelten TA-Lärm-Richtwerte von 35 dB(A) nachts in reinen Wohngebieten. Schallschutzmaßnahmen (Schallhaube, optimale Aufstellung) können nötig sein — unsere Betriebe kennen die lokalen Auflagen.` : `In ${city.name} sind Schallprobleme selten — die typischen Abstände zum Nachbarn reichen in der Regel aus.`} Tipp: Inverter-WP (modulierend) sind im Teillastbetrieb deutlich leiser als On/Off-Geräte.`,
        ]
      },
    ],
    vergleich: [
      {
        heading: `Heizungsvergleich ${city.name}: Alle Optionen auf dem Prüfstand`,
        paragraphs: [
          `Welche Heizung ist für ${city.name} die beste? Wir vergleichen alle GEG-konformen Optionen: Luft-Wasser-WP (JAZ ${jaz}, Kosten ${fmtEuro(wpKosten)}/Jahr, KfW bis 70%), Erdwärmepumpe (JAZ ~4,3, Kosten ${fmtEuro(Math.round(wpKosten * 0.8))}/Jahr, +5% KfW, aber Bohrung nötig), Fernwärme (verfügbar für ${city.fernwaermeQuote}% der Gebäude in ${city.name}, Preise abhängig vom Versorger), Pelletheizung (GEG-konform, aber Platzbedarf für Lager, Feinstaub-Diskussion), Hybridheizung (WP + Gas — teilweise GEG-konform, aber geringere Förderung).`,
          `Für ${city.name} empfehlen wir in 85% der Fälle die Luft-Wasser-WP: Beste Kosten-Nutzen-Relation, höchste Förderung, kein Erdreich/Lager nötig, schnelle Installation. Die Erdwärmepumpe lohnt sich in ${city.name} bei großen Grundstücken und wenn maximale Effizienz gewünscht ist (JAZ ~4,3 statt ${jaz}). Fernwärme ist eine Option, wenn Ihr Gebäude in ${city.name} bereits angeschlossen ist (Fernwärmequote: ${city.fernwaermeQuote}%) — aber die Preise steigen und Sie sind vom Versorger abhängig.`,
          `CO₂-Bilanz im Vergleich: Die Wärmepumpe in ${city.name} erzeugt ca. ${Math.round(wpKosten / (city.strompreis / 100) * 0.420)} kg CO₂/Jahr (dt. Strommix). Gas: ca. ${Math.round(gasKosten / (city.gaspreis / 100) * 0.201)} kg CO₂/Jahr. Öl: ca. ${Math.round(gasKosten * 1.15 / (city.oelpreis / 100) * 0.266)} kg CO₂/Jahr. Mit PV-Eigenverbrauch sinkt der CO₂-Ausstoß der WP auf unter ${Math.round(wpKosten / (city.strompreis / 100) * 0.420 * 0.6)} kg/Jahr. Die WP ist damit die klimafreundlichste Heiztechnologie — und wird durch den sinkenden CO₂-Gehalt des Strommixes jedes Jahr sauberer.`,
        ]
      },
    ],
    allgemein: [
      {
        heading: `Alles Wissenswerte zur Wärmepumpe in ${city.name}`,
        paragraphs: [
          `${city.name} (${city.bundesland}) mit ${city.einwohner.toLocaleString('de-DE')} Einwohnern ist ein ${sz === 'metropole' ? 'Metropolen-' : sz === 'grossstadt' ? 'Großstadt-' : sz === 'mittelstadt' ? 'Mittelstadt-' : 'Kleinstadt-'}Standort für Wärmepumpen. Die lokalen Rahmenbedingungen: ${city.avgTemp}°C Jahresdurchschnittstemperatur, ${city.heizgradtage} Heizgradtage, ${city.normAussentemp}°C Norm-Außentemperatur. Der Strompreis liegt bei ${city.strompreis} ct/kWh, Gas bei ${city.gaspreis} ct/kWh. Bei diesen Werten erreicht eine Luft-Wasser-WP JAZ ${jaz} — und spart ${fmtEuro(ersparnis)} pro Jahr gegenüber Erdgas.`,
          `Der Wärmepumpenmarkt in ${city.bundesland}: 2025 wurden in Deutschland 299.000 Wärmepumpen installiert (+55% ggü. 2024). ${city.bundesland} liegt ${city.bundesland === 'Bayern' || city.bundesland === 'Baden-Württemberg' || city.bundesland === 'Nordrhein-Westfalen' ? 'bei den Installationszahlen vorne' : 'im soliden Mittelfeld'}. In ${city.name} steigt die Nachfrage spürbar — lokale Fachbetriebe berichten von ${sz === 'metropole' || sz === 'grossstadt' ? '30–50' : '10–20'} WP-Installationen pro Jahr. Wir verbinden Sie mit dem Betrieb, der Erfahrung mit Ihrem Gebäudetyp in ${city.name} hat.`,
          `Warum jetzt? Drei Gründe für den WP-Umstieg in ${city.name} in 2026: (1) KfW-Förderung bis 70% — historisch hoch, nicht garantiert auf Dauer. (2) GEG-Frist in ${city.name}: ${city.gegFrist.split('-').reverse().join('.')} — wer rechtzeitig plant, vermeidet den Ansturm kurz vor Fristende. (3) Gas wird durch den CO₂-Preis jedes Jahr teurer (2026: +${Math.round(gasKosten / (city.gaspreis / 100) * 0.000201 * 55)} €/Jahr CO₂-Abgabe, 2030: +${Math.round(gasKosten / (city.gaspreis / 100) * 0.000201 * 100)} €/Jahr). Die Wärmepumpe macht Sie unabhängig von fossilen Preisschwankungen.`,
        ]
      },
    ],
  };

  const variants = content[cat] || content.allgemein;
  return variants[hash % variants.length];
}

// ── 19. ENHANCED CTA VARIATIONS — 8 CTAs pro Kategorie ────────────────────────

export function getEnhancedCTA(city: City, keyword: Keyword, ersparnis: number, foerdSatz: number): {
  headline: string; subline: string; button: string; urgencyBadge?: string
} {
  const cat = getKwCategory(keyword);
  const hash = cityHash(city, 8, 200);

  const ctas: Record<string, Array<{ headline: string; subline: string; button: string; urgencyBadge?: string }>> = {
    kosten: [
      { headline: `${Math.round(ersparnis)} € weniger Heizkosten`, subline: `Jährlich in ${city.name} sparen`, button: 'Kostenlos vergleichen', urgencyBadge: `${foerdSatz}% Förderung sichern` },
      { headline: 'Preis-Check in 2 Minuten', subline: `Was kostet eine WP in ${city.name}?`, button: '3 Angebote anfordern' },
      { headline: `Heizkosten halbieren`, subline: `${city.name}: von Gas auf WP wechseln`, button: 'Jetzt Ersparnis berechnen', urgencyBadge: 'Förderung noch verfügbar' },
      { headline: `Eigenanteil ab ${Math.round(25000 * (1 - foerdSatz/100)).toLocaleString('de-DE')} €`, subline: `Nach ${foerdSatz}% KfW-Förderung`, button: 'Angebot starten', urgencyBadge: 'Preisgarantie' },
      { headline: 'Versteckte Kosten vermeiden', subline: 'Vollständige Angebote vergleichen', button: 'Kostenlos prüfen lassen' },
      { headline: `${Math.round(ersparnis * 20).toLocaleString('de-DE')} € in 20 Jahren`, subline: `Gesamtersparnis in ${city.name}`, button: 'Jetzt starten' },
      { headline: 'Was kostet Ihre Wärmepumpe?', subline: `Lokale Preise für ${city.name}`, button: 'Preis erfahren →' },
      { headline: `Bis ${foerdSatz}% geschenkt`, subline: `KfW-Zuschuss für ${city.name}`, button: 'Förderung berechnen' },
    ],
    foerderung: [
      { headline: `${foerdSatz}% Förderung sichern`, subline: `KfW-Zuschuss für ${city.name}`, button: 'Förderung berechnen', urgencyBadge: 'Antrag vor Baubeginn!' },
      { headline: `Bis ${Math.round(30000 * foerdSatz / 100).toLocaleString('de-DE')} € Zuschuss`, subline: 'Nicht rückzahlbar', button: 'Förderhöhe prüfen' },
      { headline: 'KfW-Antrag begleiten lassen', subline: 'Kein Fehler, kein Geldverlust', button: 'Kostenlos anfragen', urgencyBadge: 'Vor Baubeginn beantragen' },
      { headline: '+5% iSFP-Bonus nutzen?', subline: `Extra-Förderung für ${city.name}`, button: 'Bonus-Check starten' },
      { headline: 'Förder-Kombi maximieren', subline: `${city.bundesland} + KfW + iSFP`, button: 'Optionen prüfen' },
      { headline: `Eigenanteil: nur ${Math.round(25000 * (1 - foerdSatz/100)).toLocaleString('de-DE')} €`, subline: `Bei ${foerdSatz}% Förderung`, button: 'Antrag starten' },
      { headline: 'Förderung 2026 gesichert?', subline: 'Aktuelle Konditionen prüfen', button: 'Jetzt prüfen →' },
      { headline: 'Kein Geld verschenken', subline: `Max. Förderung für ${city.name}`, button: 'Beratung starten' },
    ],
    installateur: [
      { headline: `Fachbetrieb in ${city.name}`, subline: 'HWK-geprüft & KfW-registriert', button: '3 Angebote erhalten', urgencyBadge: '4-10 Wochen Wartezeit' },
      { headline: 'Lokale Meisterbetriebe', subline: `Geprüfte Partner in ${city.name}`, button: 'Betriebe vergleichen' },
      { headline: 'Wartezeit verkürzen', subline: 'Jetzt Kapazität sichern', button: 'Anfrage starten', urgencyBadge: 'Heizsaison planen' },
      { headline: 'Angebote ohne Druckverkauf', subline: 'Herstellerunabhängig vergleichen', button: 'Kostenlos anfragen' },
      { headline: `${city.bundesland}-Betriebe anfragen`, subline: 'Lokale Expertise nutzen', button: 'Jetzt vermitteln lassen' },
      { headline: '3 Angebote, 48 Stunden', subline: 'Geprüfte Betriebe vergleichen', button: 'Vergleich starten →' },
      { headline: 'Den richtigen Installateur finden', subline: `KfW-LuL-registriert in ${city.name}`, button: 'Partner finden' },
      { headline: 'Vollständige Angebote', subline: 'Inkl. Hydraulik + Elektrik + KfW', button: 'Jetzt vergleichen' },
    ],
    vergleich: [
      { headline: 'WP vs. Gas — der Faktencheck', subline: `Für ${city.name} berechnet`, button: 'Vergleich starten' },
      { headline: `${Math.round(ersparnis)} €/Jahr sparen`, subline: 'Wärmepumpe schlägt Gas', button: 'Jetzt wechseln', urgencyBadge: 'CO₂-Preis steigt' },
      { headline: 'GEG-konform heizen', subline: `Optionen für ${city.name}`, button: 'Optionen vergleichen' },
      { headline: 'Hybridheizung oder reine WP?', subline: 'Individuelle Beratung', button: 'Beratung starten' },
      { headline: 'Zukunftssicher heizen', subline: 'Unabhängig von Gaspreisen', button: 'Jetzt umsteigen →' },
      { headline: `Heizungstausch in ${city.name}`, subline: 'Alle Optionen auf einen Blick', button: 'Kostenlos beraten lassen' },
      { headline: 'Beste Heizung für Ihr Haus?', subline: `Lokale Analyse für ${city.name}`, button: 'Analyse starten' },
      { headline: `Ab ${foerdSatz}% Förderung`, subline: 'Jetzt ist der beste Zeitpunkt', button: 'Angebot einholen' },
    ],
    technik: [
      { headline: `JAZ ${(city.avgTemp > 10 ? 3.8 : city.avgTemp > 8 ? 3.5 : 3.2).toFixed(1)} in ${city.name}`, subline: 'Berechnet nach VDI 4650', button: 'Technik-Check starten' },
      { headline: 'Heizlast berechnen lassen', subline: 'DIN EN 12831 — kostenlos', button: 'Berechnung anfordern' },
      { headline: 'Richtig dimensioniert?', subline: 'Überdimensionierung vermeiden', button: 'Prüfung starten' },
      { headline: 'PV + WP kombinieren', subline: `${city.avgSunHours ?? 1600} Sonnenstunden nutzen`, button: 'Kombi-Angebot holen' },
      { headline: 'Welche WP für Ihr Haus?', subline: `Luft, Sole oder Wasser in ${city.name}`, button: 'Typ-Beratung starten' },
      { headline: 'Vorlauftemperatur optimieren', subline: 'Hydraulischer Abgleich inklusive', button: 'Beratung starten →' },
      { headline: 'Technik verstehen', subline: 'Ehrliche Beratung ohne Verkaufsdruck', button: 'Kostenlos beraten lassen' },
      { headline: 'Smart Grid Ready?', subline: 'SG-Ready WP + dynamischer Tarif', button: 'Optionen prüfen' },
    ],
    allgemein: [
      { headline: `Wärmepumpe für ${city.name}`, subline: 'Kostenlos & unverbindlich', button: '3 Angebote erhalten', urgencyBadge: `${foerdSatz}% Förderung` },
      { headline: 'Jetzt Heizkosten senken', subline: `${Math.round(ersparnis)} €/Jahr Ersparnis`, button: 'Angebot anfordern' },
      { headline: 'Der erste Schritt', subline: 'Kostenlose Erstberatung', button: 'Beratung starten' },
      { headline: `${city.name} heizt grün`, subline: 'Machen Sie mit', button: 'Jetzt starten →', urgencyBadge: 'GEG-konform' },
      { headline: 'In 48 Stunden 3 Angebote', subline: 'Von lokalen Meisterbetrieben', button: 'Kostenlos vergleichen' },
      { headline: 'Heizen ohne Reue', subline: 'Unabhängig. Gefördert. Günstig.', button: 'Angebot starten' },
      { headline: `${foerdSatz}% Förderung nutzen`, subline: `Jetzt in ${city.name}`, button: 'Förderung prüfen' },
      { headline: 'Wärmepumpe lohnt sich', subline: `Beweis für ${city.name}`, button: 'Rechner starten →' },
    ],
  };

  const variants = ctas[cat] ?? ctas.allgemein;
  return variants[hash % variants.length];
}

// ── 20. VIDEO PLACEHOLDER DATA ────────────────────────────────────────────────

export function getVideoPlaceholder(city: City, keyword: Keyword): {
  title: string; description: string; thumbnailAlt: string; duration: string;
} {
  const cat = getKwCategory(keyword);
  const hash = cityHash(city, 4, 300);

  const videos: Record<string, Array<{ title: string; description: string; thumbnailAlt: string; duration: string }>> = {
    kosten: [
      { title: `Was kostet eine Wärmepumpe in ${city.name}? Alle Kosten erklärt`, description: `Komplette Kostenaufstellung für eine Luft-Wasser-WP in ${city.name}: Gerät, Montage, Hydraulik, Elektrik — und welche Förderung Sie abziehen können.`, thumbnailAlt: `Video: Wärmepumpe Kosten ${city.name}`, duration: '8:24' },
      { title: `Wärmepumpe Kosten ${city.name}: Was Installateure nicht erzählen`, description: `Versteckte Kostenpositionen, die in Angeboten fehlen: hydraulischer Abgleich, Fundament, Elektroinstallation. So vergleichen Sie richtig.`, thumbnailAlt: `Video: Versteckte WP-Kosten ${city.name}`, duration: '6:45' },
      { title: `${Math.round(25000 * 0.5).toLocaleString('de-DE')} € für eine Wärmepumpe? So geht's`, description: `Mit ${city.bundesland}-Förderung und KfW-Zuschuss den Eigenanteil halbieren — Schritt-für-Schritt-Anleitung.`, thumbnailAlt: `Video: WP-Förderung ${city.name}`, duration: '10:12' },
      { title: `Wärmepumpe Amortisation: Ab wann lohnt es sich in ${city.name}?`, description: `Rechenbeispiel mit lokalen Strom- und Gaspreisen für ${city.name}. Ab welchem Jahr ist die WP günstiger?`, thumbnailAlt: `Video: WP Amortisation ${city.name}`, duration: '7:30' },
    ],
    allgemein: [
      { title: `Wärmepumpe ${city.name}: Alles was Sie wissen müssen`, description: `Funktionsweise, Kosten, Förderung und Installation — der komplette Guide für Hausbesitzer in ${city.name}.`, thumbnailAlt: `Video: Wärmepumpe Guide ${city.name}`, duration: '12:15' },
      { title: `Wärmepumpe im Altbau in ${city.name} — geht das?`, description: `80% der Bestandsgebäude sind WP-geeignet. Wir zeigen, worauf Sie in ${city.name} achten müssen.`, thumbnailAlt: `Video: WP Altbau ${city.name}`, duration: '9:33' },
      { title: `GEG 2026: Was Hausbesitzer in ${city.name} jetzt tun müssen`, description: `Die 65%-Regel, Fristen, Ausnahmen — und warum die Wärmepumpe die einfachste Lösung ist.`, thumbnailAlt: `Video: GEG Pflichten ${city.name}`, duration: '7:48' },
      { title: `Wärmepumpe + PV in ${city.name}: Die perfekte Kombination`, description: `Mit ${city.avgSunHours ?? 1600} Sonnenstunden/Jahr erzeugen Sie Ihren WP-Strom teilweise selbst.`, thumbnailAlt: `Video: WP + PV ${city.name}`, duration: '8:55' },
    ],
  };

  const categoryVideos = videos[cat] ?? videos.allgemein;
  return categoryVideos[hash % categoryVideos.length];
}

// ── 21. SOCIAL PROOF COUNTER DATA ─────────────────────────────────────────────

export function getSocialProofData(city: City, keyword: Keyword): {
  anfragenGesamt: number; anfragenStadt: number; letzteAnfrage: string; zufriedenheit: number;
} {
  const hash = cityHash(city, 100, 400);
  const baseCount = 12450 + hash * 37;
  const cityCount = 23 + cityHash(city, 180, 401);
  const hoursAgo = 1 + cityHash(city, 23, 402);

  return {
    anfragenGesamt: baseCount,
    anfragenStadt: cityCount,
    letzteAnfrage: `vor ${hoursAgo} Stunden`,
    zufriedenheit: 94 + cityHash(city, 5, 403),
  };
}

export function getExtendedVariationData(
  city: City,
  keyword: Keyword,
  jaz: number,
  wpKosten: number,
  ersparnis: number,
  nearby: City[],
  allKeywords: Keyword[],
  faqCount: number = 6,
): ExtendedVariationData {
  const base = getCityVariationData(city, keyword, jaz, wpKosten, ersparnis, faqCount);
  const foerdSatz = 55; // KfW-Förderung standard 55%

  return {
    ...base,
    bundeslandParagraph: getBundeslandParagraph(city, keyword, jaz, wpKosten, ersparnis),
    gebaeudeParagraph: getGebaeudeParagraph(city, keyword, jaz, wpKosten),
    energieParagraph: getEnergieParagraph(city, keyword, jaz, wpKosten, ersparnis),
    processTimeline: getProcessTimeline(city, keyword),
    crossKeywordLinks: getCrossKeywordLinks(city, keyword, allKeywords),
    comparisonTable: getComparisonTable(city, jaz, wpKosten, ersparnis),
    localTestimonial: getLocalTestimonial(city, keyword),
    seasonalAdvice: getSeasonalAdvice(city),
    inlineLinkedParagraph: getInlineLinkedParagraph(city, keyword, jaz, wpKosten, ersparnis),
    lokaleTiefenanalyse: getLokaleTiefenanalyse(city, keyword, jaz, wpKosten, ersparnis),
    pvWPKombination: getPVWPKombination(city, keyword, jaz, wpKosten, ersparnis),
    roiTimeline: getROITimeline(city, jaz, wpKosten, ersparnis, 55),
    nachbarschaftsvergleich: getNachbarschaftsvergleich(city, nearby, jaz, wpKosten, ersparnis),
    heizkoerperCheck: getHeizkoerperCheck(city, keyword),
    stromtarifOptimierung: getStromtarifOptimierung(city, jaz, wpKosten),
    keywordDeepContent: getKeywordDeepContent(city, keyword, jaz, wpKosten, ersparnis),
    enhancedCTA: getEnhancedCTA(city, keyword, ersparnis, foerdSatz),
    videoPlaceholder: getVideoPlaceholder(city, keyword),
    socialProofData: getSocialProofData(city, keyword),
  };
}