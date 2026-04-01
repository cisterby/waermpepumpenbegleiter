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
