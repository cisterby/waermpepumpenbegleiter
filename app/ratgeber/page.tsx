// app/ratgeber/page.tsx — Ratgeber-Index + 5 vollständige Artikel inline
'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar, User } from 'lucide-react';
import Head from 'next/head';

// ── VOLLSTÄNDIGE ARTIKEL ───────────────────────────────────────────────────
const ARTICLES = [
  {
    slug: 'geg-2026-was-hausbesitzer-wissen-muessen',
    cat: 'GEG & Recht',
    title: 'GEG 2026: Was Hausbesitzer in Großstädten ab Juli wissen müssen',
    excerpt: 'Ab dem 30. Juni 2026 gilt die 65%-EE-Pflicht für Bestandsgebäude in Kommunen mit über 100.000 Einwohnern. Was das konkret bedeutet — und was jetzt zu tun ist.',
    time: '12 Min.',
    date: 'März 2026',
    author: 'Dr. Markus Sommer',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    big: true,
    content: `
Das Gebäudeenergiegesetz 2024 hat die Spielregeln beim Heizungsersatz grundlegend verändert. Seit dem 1. Januar 2024 gilt: Wer eine neue Heizung einbaut, muss mindestens 65 Prozent erneuerbare Energie nutzen. Für Bestandsgebäude galt eine Übergangsfrist — die läuft jetzt aus.

**Ab 30. Juni 2026 gilt die erste große Frist**

In Kommunen mit mehr als 100.000 Einwohnern endet die Übergangsfrist am 30. Juni 2026. Das betrifft rund 80 deutsche Städte: Berlin, Hamburg, München, Köln, Frankfurt, Stuttgart, Düsseldorf, Hannover und alle weiteren Großstädte. Wer nach diesem Datum eine Heizung austauscht — wegen Defekts oder freiwillig — muss die 65-Prozent-EE-Anforderung erfüllen. Für alle anderen Kommunen gilt die Frist ab dem 30. Juni 2028.

**Was 65 Prozent erneuerbare Energie bedeutet**

Eine Wärmepumpe erfüllt das GEG automatisch und vollständig — ohne weitere Auflagen. Das ist der Hauptgrund warum sie zum Heizungstyp der Stunde geworden ist. Pellets erfüllen die Anforderung grundsätzlich, unterliegen aber Feinstaubauflagen und Lagerungsanforderungen. Fernwärme gilt als konform wenn der Netzbetreiber den erneuerbaren Anteil nachweist — was nicht überall gegeben ist. Eine reine Gasheizung ohne Solarthermie-Anteil erfüllt die Anforderung nicht mehr.

**Die kommunale Wärmeplanung als Orientierung**

Parallel zum GEG müssen Städte bis 2026 einen kommunalen Wärmeplan vorlegen. Dieser zeigt wie die lokale Wärmeversorgung künftig aussehen soll. Wichtige Frage: Plant Ihre Gemeinde Fernwärme in Ihrer Straße? Falls ja könnte kurzes Abwarten sinnvoll sein. Falls nein ist die Wärmepumpe die klare Alternative. Viele Wärmepläne sind bereits online verfügbar.

**Das Gebäudemodernisierungsgesetz und was es bedeutet**

Die neue CDU/SPD-Koalition hat Anfang 2026 Eckpunkte für ein Gebäudemodernisierungsgesetz vorgelegt das die 65-Prozent-Pflicht möglicherweise flexibilisieren könnte. Stand März 2026 gilt das GEG weiter. Entscheidend: Selbst wenn dieses Gesetz die Pflicht aufweicht bleiben Wärmepumpen die primär geförderte Technologie. Die KfW-Förderung bis 70 Prozent läuft parallel und ist davon unabhängig.

**Die Wirtschaftlichkeit: Warum jetzt der richtige Zeitpunkt ist**

Bei einem typischen Einfamilienhaus mit 120 Quadratmetern Wohnfläche und Baujahr zwischen 1979 und 1994 liegen die Betriebskosten einer Wärmepumpe bei circa 1.600 Euro pro Jahr. Eine Gasheizung kostet heute rund 2.400 Euro — und dieser Abstand wächst weil der CO₂-Preis jedes Jahr steigt. Ab 2027 greift der europäische Emissionshandel ETS2 der den Gaspreis durch Marktmechanismen weiter nach oben treiben wird. Wer heute handelt sichert sich die volle KfW-Förderung bis 70 Prozent und den Klima-Speed-Bonus für den Ersatz fossiler Heizungen.

**Förderung im Überblick**

Die KfW-Bundesförderung (Programm 458) gewährt einen nicht rückzahlbaren Zuschuss. Eigennutzer die eine fossile Heizung ersetzen erhalten: 30 Prozent Grundförderung plus 20 Prozent Klima-Speed-Bonus gleich 50 Prozent. Mit R290-Kältemittel-WP (Viessmann Vitocal, Vaillant aroTHERM) kommen weitere 5 Prozent dazu. Bei Einkommen unter 40.000 Euro netto gibt es zusätzliche 30 Prozent Einkommensbonus — insgesamt bis 70 Prozent gleich maximal 21.000 Euro Zuschuss auf 30.000 Euro Investition.

**Was jetzt konkret zu tun ist**

Erstens: Prüfen Sie ob Ihre Gemeinde Großstadt über 100.000 Einwohner ist — dann gilt GEG-Frist 30. Juni 2026. Zweitens: Planen Sie Vorlauf ein — vier bis zwölf Wochen für Installateur und KfW-Antrag. Drittens: KfW-Antrag zwingend vor Vertragsabschluss stellen. Viertens: Mindestens drei vollständige Angebote von LuL-registrierten Betrieben vergleichen. Fünftens: Prüfen Sie ob ein Individueller Sanierungsfahrplan sinnvoll ist — das bringt 5 Prozent Bonus zusätzlich bei nur 60 bis 140 Euro Eigenanteil.

**Häufige Fragen zur GEG-Frist**

Muss ich wechseln wenn meine Heizung noch funktioniert? Nein — nur beim tatsächlichen Ersatz gilt die Pflicht. Was wenn die Heizung nach dem Stichtag defekt wird? Dann greift die Pflicht sofort — eine Notreparatur ist temporär möglich aber keine vollständige Neuinstallation des gleichen Systems. Gilt das auch für Vermieter? Ja, unabhängig vom Eigennutzerstatus.

Quellen: GEG 2024 Bundesanzeiger, Kommunales Wärmeplanungsgesetz WPG, Koalitionsvertrag CDU/SPD 2025, KfW BEG Programm 458 Stand März 2026, Bundesministerium für Wohnen.
`,
  },
  {
    slug: 'kfw-458-schritt-fuer-schritt',
    cat: 'Kosten & Förderung',
    title: 'KfW 458: Schritt für Schritt zur vollen Förderung',
    excerpt: 'Der Antrag klingt komplizierter als er ist — wenn man die Reihenfolge kennt. Alles was Sie wissen müssen um keine Förderung zu verschenken.',
    time: '8 Min.',
    date: 'Feb. 2026',
    author: 'Julia Hartmann',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    content: `
Die KfW-Bundesförderung für effiziente Gebäude ist das attraktivste staatliche Förderprogramm für Wärmepumpen in Deutschland — bis zu 70 Prozent der Investition, nicht rückzahlbar, direkt auf Ihr Konto. Doch jedes Jahr verlieren tausende Hausbesitzer die gesamte Förderung durch einen einzigen Fehler.

**Die wichtigste Regel: Antrag vor Baubeginn**

Baubeginn bedeutet hier der Moment des Vertragsabschlusses mit dem Installateur. Nicht der Spatenstich, nicht die Lieferung, nicht der Einbau — der Vertrag. Wer erst unterschreibt und dann den Antrag stellt verliert alles. Keine Ausnahmen, keine Kulanzfälle, keine nachträgliche Genehmigung.

Die korrekte Reihenfolge: Erstens Fachbetrieb finden und Angebote erhalten. Zweitens KfW-Antrag stellen und Bestätigung abwarten. Drittens Vertrag mit Installateur unterschreiben. Viertens Installation durchführen lassen. Fünftens Verwendungsnachweis einreichen und Auszahlung erhalten.

**Grundförderung und alle Boni im Detail**

Die Grundförderung beträgt 30 Prozent auf förderfähige Kosten bis 30.000 Euro — maximal 9.000 Euro. Klima-Speed-Bonus: 20 Prozent zusätzlich für Eigennutzer die eine fossile Heizung durch eine Wärmepumpe ersetzen — macht 50 Prozent Standard. Einkommensbonus: 30 Prozent für Haushalte unter 40.000 Euro Jahreseinkommen, kumulierbar aber auf 70 Prozent gedeckelt. Kältemittelbonus: 5 Prozent für R290-Propan-Geräte oder Erdwärme-WP. Geräte mit Bonus: Viessmann Vitocal 250-A und Vaillant aroTHERM plus.

**Was förderfähig ist und was nicht**

Förderfähig: Gerät, Montage, hydraulischer Abgleich (Pflicht), Elektroinstallation, Pufferspeicher, Planung. Nicht förderfähig: Kosten über 30.000 Euro, reine Modernisierungsmaßnahmen. Wichtig für Vermieter: KfW-Zuschüsse sind bei Vermietung steuerpflichtig.

**LuL-Registrierung: Nicht jeder darf den Antrag stellen**

Nur Betriebe mit Lieferant-und-Leistungserbringer-Registrierung im KfW-Portal dürfen Anträge stellen. Ohne LuL: keine Förderung, egal wie gut die Arbeit ist. Immer nach der LuL-Nummer fragen. Alle unsere Partnerbetriebe sind registriert.

**iSFP-Bonus: 5 Prozent mehr mit Sanierungsfahrplan**

Mit einem Individuellen Sanierungsfahrplan vor dem KfW-Antrag erhalten Sie 5 Prozent Bonus. Der iSFP kostet 300 bis 700 Euro, wird zu 80 Prozent von BAFA gefördert — Eigenanteil nur 60 bis 140 Euro. Bei 25.000 Euro Investition: 1.250 Euro mehr Zuschuss. Fast immer lohnenswert.

**Der Verwendungsnachweis**

Nach Installation: Rechnung plus Fachunternehmer-Bestätigung im KfW-Portal einreichen. Frist: sechs Monate. Auszahlung: vier bis acht Wochen danach direkt auf Ihr Konto.

**Kombination mit Landesförderungen**

Hamburg (IFB), NRW (progres.nrw), Baden-Württemberg (L-Bank), Niedersachsen (NBank) haben kombinierbare Programme. Bayern hat das 10.000-Häuser-Programm eingestellt. Berlin derzeit ausgesetzt. Kombinierbarkeit mit dem Fachbetrieb klären.

**Die häufigsten Fehler**

(1) Vertrag vor Antrag — vollständiger Förderverlust. (2) Betrieb ohne LuL — kein Antrag möglich. (3) Verwendungsnachweis vergessen — sechs Monate Frist. (4) Eigennutzer-Status falsch — Klima-Speed-Bonus entfällt. (5) iSFP-Bonus vergessen — 1.250 Euro bei 25.000 Euro Investition verschenkt. (6) Kältemittelbonus nicht geprüft — 5 Prozent bei R290-Geräten einfach liegen lassen.

Quellen: KfW Bundesförderung BEG Merkblatt Programm 458 März 2026, BAFA Energieberatung Wohngebäude, Bundesministerium für Wirtschaft und Klimaschutz.
`,
  },
  {
    slug: 'luft-wasser-waermepumpe-ehrlich',
    cat: 'Technik',
    title: 'Luft-Wasser-Wärmepumpe: Vor- und Nachteile ehrlich erklärt',
    excerpt: '92% aller neu installierten Wärmepumpen in Deutschland sind Luft-Wasser-Geräte. Warum — und für wen sie wirklich nicht geeignet sind.',
    time: '10 Min.',
    date: 'Jan. 2026',
    author: 'Stefan Berger',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    content: `
Neunzig Prozent aller 2025 neu installierten Wärmepumpen in Deutschland waren Luft-Wasser-Geräte. Diese Technologie hat sich als pragmatische Standardlösung durchgesetzt. Aber was steckt wirklich dahinter — und für wen sind Luft-Wasser-Wärmepumpen tatsächlich geeignet?

**Das Funktionsprinzip: Der umgekehrte Kühlschrank**

Eine Luft-Wasser-Wärmepumpe entzieht der Außenluft Wärme — selbst bei minus 20 Grad enthält die Luft noch nutzbare Energie — und überträgt diese auf das Heizwasser. Der Kältekreislauf: Kältemittel (R290 oder R410A) verdampft in der Außeneinheit und nimmt Wärme auf. Verdichter erhöht Druck und Temperatur. Verflüssiger gibt Wärme ans Heizwasser ab. Expansionsventil entspannt — Kreislauf beginnt von vorn. Ergebnis: Aus 1 kWh Strom werden 3 bis 4,5 kWh Wärme.

**JAZ vs. COP: Der entscheidende Unterschied**

Der COP ist ein Momentanwert unter Prüfbedingungen (A7/W35: 7 Grad Außen, 35 Grad Vorlauf). Ein COP von 4,5 gilt nur bei diesen Bedingungen. Die JAZ ist der reale Jahresdurchschnitt — sie liegt deutlich niedriger weil: Außentemperatur fällt im Winter unter 7 Grad. Abtauprozess kostet Energie. Warmwasserbereitung braucht höhere Temperaturen. Anlaufvorgänge verbrauchen Strom.

In deutschen Feldstudien (Fraunhofer ISE, 3.000+ Anlagen): reale JAZ 2,8 bis 4,5. KfW-Mindestanforderung: JAZ 3,0. Norddeutschland: 3,0 bis 3,5. Süddeutschland und Rheinland: 3,6 bis 4,2.

**Schall und Aufstellung**

45 bis 55 Dezibel auf einem Meter — wie ein ruhiges Gespräch. In dicht bebauten Gebieten kann das beim Nachbarn ankommen. Mindestabstand zur Grenze: drei Meter meist ausreichend. Schallschutzmaßnahmen: 100 bis 800 Euro, senken Pegel um 3 bis 5 Dezibel.

**Vorlauftemperatur: Das zentrale Kriterium**

Fußbodenheizung: 30 bis 40 Grad, JAZ bis 4,0+. Sanierte Heizkörper: 45 bis 55 Grad, JAZ 3,2 bis 3,8. Altbau-Heizkörper: 60 bis 70 Grad, Hochtemperatur-WP nötig, JAZ 2,8 bis 3,2.

Hochtemperatur-WP wie Viessmann Vitocal 252-A und Stiebel Eltron WPL arbeiten bis 70 Grad Vorlauf — kompatibel mit nahezu allen Bestandsheizkörpern. Hydraulischer Abgleich (KfW-Pflicht, 500 bis 1.500 Euro) senkt die nötige Temperatur oft um 5 bis 10 Grad.

**PV-Kombination: Der Effizienz-Turbo**

Mit eigener PV: Netzstrom 30 ct + JAZ 3,5 = Wärme kostet 8,6 ct/kWh. PV-Eigenverbrauch zu Grenzkosten unter 5 ct: Wärme unter 2 ct/kWh. Smart-Grid-fähige WP verschieben Betriebszeiten automatisch auf PV-Produktionsphasen.

**Hersteller im Vergleich**

Stiftung Warentest 2024/2025: Viessmann Vitocal 250-A Testsieger Note Gut. Vaillant aroTHERM plus: R290-Kältemittel, erhält KfW-Kältemittelbonus 5 Prozent. Bosch/Buderus: gutes Preis-Leistungs-Verhältnis. Stiebel Eltron: deutsche Produktion, lange Garantie. Nibe Fighter: sehr leise, bewährt in Skandinavien.

**Für wen Luft-WP nicht geeignet ist**

Gebäude mit dauerhaft nötiger Vorlauftemperatur über 65 Grad ohne Sanierungsmöglichkeit. Grundstücke ohne Platz oder mit extremen Lärmrestriktionen. Sehr hoher Warmwasserbedarf wo Sole-WP wirtschaftlicher wäre.

**Typische Investitionskosten**

Gerät: 8.000 bis 15.000 Euro. Installation: 4.000 bis 8.000 Euro. Hydraulischer Abgleich: 500 bis 1.500 Euro. Gesamt brutto: 14.000 bis 26.000 Euro. Nach 50 Prozent KfW: 7.000 bis 13.000 Euro Eigenanteil. Betriebskosten pro Jahr (120 m², Baujahr 1980): 1.200 bis 1.900 Euro je nach Standort.

Quellen: BWP Marktdaten 2025, Fraunhofer ISE Feldmonitor 2023, Stiftung Warentest WP-Test 2024/2025, Bundesnetzagentur Monitoringbericht 2025.
`,
  },
  {
    slug: 'waermepumpe-altbau-was-wichtig-ist',
    cat: 'Altbau',
    title: 'Wärmepumpe im Altbau: Was wirklich wichtig ist',
    excerpt: 'Vorlauftemperatur, Heizkörpergröße, hydraulischer Abgleich — die drei Faktoren die über Erfolg oder Misserfolg entscheiden.',
    time: '7 Min.',
    date: 'Jan. 2026',
    author: 'Dr. Markus Sommer',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    content: `
"Wärmepumpen taugen nicht für Altbauten" — dieser Satz ist falsch. Nach Einschätzungen des Bundesverbands Wärmepumpe sind 70 bis 80 Prozent aller deutschen Bestandsgebäude technisch für eine Wärmepumpe geeignet — wenn die Planung stimmt.

**Was Altbau wirklich bedeutet**

Altbau umfasst eine enorme Bandbreite. Entscheidend ist nicht das Baujahr sondern der energetische Zustand — der Heizwärmebedarf in kWh pro m² und Jahr. Faustformel: Unter 150 kWh/m²a ist fast immer WP-tauglich. Das entspricht Häusern ab circa 1960 mit durchschnittlichem Sanierungsstand oder älteren Häusern mit teilsanierter Gebäudehülle.

**Die Vorlauftemperatur entscheidet**

Altbauheizungen laufen oft mit 65 bis 80 Grad. WP arbeiten am effizientesten bei 35 bis 45 Grad. Drei Lösungswege: (1) Hochtemperatur-WP wie Viessmann Vitocal 252-A oder Stiebel Eltron WPL arbeiten bis 70 Grad Vorlauf — kompatibel mit nahezu allen Bestandsheizkörpern. (2) Hydraulischer Abgleich senkt die nötige Vorlauftemperatur um 5 bis 15 Grad. (3) Gezielter Austausch einzelner unterdimensionierter Heizkörper — meist nur ein oder zwei im ganzen Haus.

**Hydraulischer Abgleich: KfW-Pflicht und Game-Changer**

KfW-Pflicht und wichtigste Einzelmaßnahme. Vorher: Heizwasser fließt unkontrolliert — nächste Heizkörper heiß, entfernte kalt, hohe Vorlauftemperatur nötig. Nachher: Jeder Heizkörper bekommt genau die richtige Menge. Vorlauftemperatur sinkt 5 bis 15 Grad. JAZ verbessert sich von 2,8 auf zum Beispiel 3,3. Kosten: 500 bis 1.500 Euro.

**Heizlastberechnung nach DIN EN 12831**

Vor der Planung muss die Heizlast berechnet werden — Norm DIN EN 12831. Berücksichtigt Wandaufbau, Fenster, Dach, Keller, Luftwechsel und lokale Normaußentemperatur. Zu groß dimensioniert: WP taktet — schlechtere JAZ und kürzere Lebensdauer. Zu klein: liefert bei Kälte nicht genug. Heizlastberechnung ist Kernkompetenz guter Fachbetriebe und Bestandteil jedes seriösen Angebots.

**Sanierungsreihenfolge**

In den meisten Fällen: WP jetzt, Sanierung schrittweise danach. WP funktioniert auch im unsanierten Bestand wenn die Heizlastberechnung es bestätigt. Dachdämmung und Kellerdeckendämmung vorher sind günstig (3.000 bis 8.000 Euro), werden KfW-gefördert und senken den Heizwärmebedarf um 10 bis 20 Prozent — verbessert die JAZ spürbar.

**Altbau-spezifische Herausforderungen**

Einrohrheizung: Lösbar mit speziellen Einrohrsystem-Abgleichlösungen. Sehr kleine Heizkörper in einzelnen Räumen: Nur diese tauschen, nicht alle. Asbest: Prüfen und fachgerecht entfernen (500 bis 2.000 Euro) — kein WP-Hindernis, aber Planungsfaktor.

**Reale Kosten im Altbau**

Typisches EFH Baujahr 1978 bis 1994, 120 m², Heizkörper: WP mit Installation 20.000 bis 26.000 Euro brutto. Hydraulischer Abgleich 800 bis 1.200 Euro. KfW-Förderung 50 Prozent: minus 12.000 bis 13.000 Euro. Eigenanteil: 8.000 bis 14.000 Euro. Jährliche Ersparnis gegenüber Gas: 600 bis 1.200 Euro. Amortisation: 8 bis 15 Jahre.

**Fazit**

Der Altbau ist kein Hindernis — er ist eine Planungsaufgabe. Wer mit einem erfahrenen Fachbetrieb startet, der eine Heizlastberechnung durchführt, den hydraulischen Abgleich macht und das richtige Gerät auswählt, hat sehr gute Chancen auf eine effiziente und wirtschaftliche WP-Installation.

Quellen: BWP Bundesverband Wärmepumpe, Fraunhofer ISE Altbaustudie 2022, DIN EN 12831, Verbraucherzentrale NRW, co2online Heizspiegel 2025.
`,
  },
  {
    slug: 'co2-preis-2026-gasheizer',
    cat: 'Kosten & Förderung',
    title: 'CO₂-Preis 2026: Was Gas-Heizer jetzt zahlen',
    excerpt: 'Der CO₂-Preis steigt jährlich. Was das für Ihre Gasrechnung bedeutet — und wann sich der Wechsel zur Wärmepumpe rechnet.',
    time: '5 Min.',
    date: 'Dez. 2025',
    author: 'Julia Hartmann',
    img: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1200&q=80',
    content: `
Wer heute noch eine Gasheizung betreibt zahlt jedes Jahr mehr — nicht nur wegen schwankender Gaspreise, sondern wegen eines staatlich festgelegten und planmäßig steigenden CO₂-Preises. Was viele als abstrakte Klimapolitik wahrnehmen macht sich sehr konkret auf der Heizkostenabrechnung bemerkbar.

**Was ist der CO₂-Preis?**

Seit 2021 gibt es in Deutschland einen nationalen CO₂-Preis. Gasversorger müssen für jede emittierte Tonne CO₂ ein Zertifikat kaufen und geben diese Kosten weiter. Erdgas: rund 200 Gramm CO₂ pro kWh. Bei 55 Euro pro Tonne: 1,1 Cent CO₂-Aufschlag je kWh Gas. Für ein typisches EFH mit 20.000 kWh Jahresverbrauch: 220 Euro CO₂-Abgabe pro Jahr allein.

**Die Preisentwicklung 2024 bis 2030**

2024: 45 Euro pro Tonne, 0,9 Cent je kWh. 2025: 55 Euro, 1,1 Cent. 2026: 55 bis 65 Euro nach BEHG-Planung. 2027: EU-ETS2 startet — Gebäude werden in den europäischen Emissionshandel einbezogen, marktbasierte Preise, Prognosen 80 bis 120 Euro pro Tonne. 2030: 100 bis 150 Euro pro Tonne nach Umweltbundesamt und Fraunhofer ISI.

**Was das für Ihre Gasrechnung bedeutet**

Typisches EFH, 150 m², Baujahr 1980, 20.000 kWh Gasverbrauch pro Jahr. Heute 2026: 20.000 × 0,011 Euro = 220 Euro CO₂-Abgabe. Bei 100 Euro pro Tonne (2030): 20.000 × 0,02 = 400 Euro — 180 Euro mehr allein durch CO₂. Dazu kommen ETS2-Markteffekt, Netzinfrastrukturkosten und geopolitische Preissteigerungen.

**Die Wärmepumpen-Gegenrechnung**

Eine WP verbraucht Strom. Der CO₂-Gehalt des deutschen Strommixes sinkt jedes Jahr — von 366 g/kWh in 2022 auf unter 200 g/kWh in 2030 (Prognose). Bei JAZ 3,5: Für 20.000 kWh Wärme braucht die WP nur 5.714 kWh Strom. CO₂ 2026 bei 250 g/kWh: 1,43 Tonnen. Gasheizung: 4,0 Tonnen. Die WP reduziert CO₂ um 64 Prozent — Abstand wächst jedes Jahr.

**Betriebskosten im Direktvergleich**

Heute 2026 (Gas 12 ct, Strom 30 ct, JAZ 3,5): WP 1.714 Euro/Jahr. Gas 2.609 Euro/Jahr. Vorteil WP: 895 Euro pro Jahr.

2030 Szenario (Gas 16 ct, Strom 28 ct): WP 1.600 Euro/Jahr. Gas 3.478 Euro/Jahr. Vorteil WP: fast 1.900 Euro pro Jahr — mehr als doppelt so viel wie heute.

**Opportunitätskosten des Wartens**

Wer 2 Jahre wartet verliert: 3.200 Euro Betriebsersparnis, günstigere Installationspreise (15 bis 20 Prozent Anstieg 2022 bis 2025), möglicherweise volle KfW-Förderung wenn das politische Umfeld sich ändert. Plus Risiko eines Heizungsausfalls im Winter — dann unter Zeitdruck, teurer und schlechter entscheiden.

**Amortisationsrechnung**

Bei 50 Prozent KfW und 12.500 Euro Eigenanteil: Amortisation bei 895 Euro/Jahr in circa 14 Jahren. Im 2030-Szenario bei 1.900 Euro/Jahr: unter 7 Jahre. Dazu: Immobilienwertaufschlag für GEG-konforme Heizung — Gutachter beziffern den Unterschied auf 5.000 bis 15.000 Euro Marktwert.

**Fazit: Die Wirtschaftlichkeit kippt**

Die aktuelle Rechnung ist bereits zugunsten der Wärmepumpe. Die zukünftige Rechnung kippt noch deutlicher. Wer heute handelt sichert sich hohe KfW-Förderung, stabile Installationspreise und maximalen Vorlauf vor der GEG-Frist.

Quellen: Brennstoffemissionshandelsgesetz BEHG, EU-ETS2 Richtlinie 2023/959, Bundesregierung CO₂-Preispfad, BDEW Energiepreise 2026, Fraunhofer ISI Energiemarktszenarien 2035, Umweltbundesamt CO₂-Strommix.
`,
  },
];

const CATS = ['Alle', 'GEG & Recht', 'Kosten & Förderung', 'Technik', 'Altbau'];

function ArticleContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none">
      {content.trim().split('\n\n').map((block, i) => {
        if (block.startsWith('**') && block.endsWith('**') && !block.includes('\n')) {
          return <h3 key={i} className="font-heading font-bold text-[#1C2B2B] text-lg mt-6 mb-2">{block.replace(/\*\*/g, '')}</h3>;
        }
        if (block.startsWith('- ')) {
          return (
            <ul key={i} className="space-y-1 mb-4 ml-4">
              {block.split('\n').map((item, j) => (
                <li key={j} className="text-[#4A6358] text-sm leading-relaxed list-disc">
                  {item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
                </li>
              ))}
            </ul>
          );
        }
        // Bold inline
        const parts = block.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i} className="text-[#4A6358] text-sm leading-relaxed mb-4">
            {parts.map((part, j) =>
              part.startsWith('**') ? <strong key={j} className="text-[#1C2B2B] font-semibold">{part.replace(/\*\*/g, '')}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function Ratgeber() {
  const [activeCat, setActiveCat] = useState('Alle');
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const filtered = activeCat === 'Alle' ? ARTICLES : ARTICLES.filter(a => a.cat === activeCat);
  const [hero, ...rest] = filtered;

  if (openArticle) {
    const article = ARTICLES.find(a => a.slug === openArticle)!;
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `https://xn--wrmepumpenbegleiter-gwb.de/ratgeber#${article.slug}`,
      headline: article.title,
      description: article.excerpt,
      image: article.img,
      datePublished: new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: article.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Wärmepumpenbegleiter.de',
        url: 'https://xn--wrmepumpenbegleiter-gwb.de',
      },
    };
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <div className="relative h-80 overflow-hidden">
          <Image src={article.img} alt={article.title} className="w-full h-full object-cover" fill priority />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,21,16,0.85) 0%, rgba(10,21,16,0.3) 100%)' }} />
          <div className="absolute inset-0 flex items-end px-6 pb-10">
            <div className="max-w-3xl">
              <span className="inline-block bg-[#D97706] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{article.cat}</span>
              <h1 className="font-bold text-white text-3xl leading-tight">{article.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-white/60 text-xs">
                <span className="flex items-center gap-1"><User size={11} /> {article.author}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> {article.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {article.time} Lesezeit</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <button onClick={() => setOpenArticle(null)}
            className="flex items-center gap-2 text-[#1A4731] text-sm font-semibold hover:underline mb-8">
            ← Zurück zum Ratgeber
          </button>
          <ArticleContent content={article.content} />
          <div className="mt-10 bg-[#E8F5EE] border border-[#3DA16A]/25 rounded-2xl p-6">
            <h3 className="font-heading font-bold text-[#1C2B2B] text-lg mb-2">Jetzt kostenlos anfragen</h3>
            <p className="text-[#4A6358] text-sm mb-4">Geprüfte lokale Fachbetriebe · KfW-Antrag inklusive · Kostenlos</p>
            <Link href="/kontakt"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#1A4731] text-white font-heading font-bold text-sm rounded-xl hover:bg-wp-green2 transition-all">
              Anfrage starten <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* HERO */}
      <div className="bg-[#1A4731] pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-wp-green3 mb-4">Ratgeber</span>
          <h1 className="font-heading font-extrabold text-white mb-4" style={{ fontSize: 'clamp(30px,4.5vw,54px)' }}>
            Wärmepumpen-Ratgeber 2026
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            Fundierte Artikel zu Technik, Förderung, GEG und Kosten — geschrieben von Energieberatern und SHK-Meistern.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATS.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCat === cat ? 'bg-[#1A4731] text-white' : 'bg-white border border-wp-border text-[#4A6358] hover:border-wp-green hover:text-[#1A4731]'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Hero article */}
        {hero && (
          <button onClick={() => setOpenArticle(hero.slug)}
            className="w-full bg-white rounded-2xl border border-wp-border shadow-wp-sm overflow-hidden mb-6 group text-left hover:-translate-y-0.5 transition-all">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <Image src={hero.img} alt={hero.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" width={600} height={256} loading="lazy" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#D97706] text-white text-xs font-bold px-3 py-1.5 rounded-full">{hero.cat}</span>
                </div>
              </div>
              <div className="p-7 flex flex-col justify-center">
                <h2 className="font-heading font-bold text-[#1C2B2B] text-2xl mb-3 leading-tight group-hover:text-[#1A4731] transition-colors">
                  {hero.title}
                </h2>
                <p className="text-[#4A6358] text-sm leading-relaxed mb-5">{hero.excerpt}</p>
                <div className="flex items-center gap-4 text-[#1C2B2B]3 text-xs mb-5">
                  <span className="flex items-center gap-1"><User size={11} /> {hero.author}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {hero.time}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {hero.date}</span>
                </div>
                <span className="inline-flex items-center gap-2 text-[#1A4731] font-semibold text-sm">
                  Artikel lesen <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </button>
        )}

        {/* Article grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(article => (
            <button key={article.slug} onClick={() => setOpenArticle(article.slug)}
              className="bg-white rounded-2xl border border-wp-border shadow-wp-sm overflow-hidden text-left group hover:-translate-y-0.5 transition-all">
              <div className="relative h-44 overflow-hidden">
                <Image src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={400} height={176} loading="lazy" />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 text-[#1C2B2B] text-xs font-bold px-2.5 py-1 rounded-full">{article.cat}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-[#1C2B2B] text-base leading-tight mb-2 group-hover:text-[#1A4731] transition-colors">
                  {article.title}
                </h3>
                <p className="text-[#1C2B2B]3 text-xs leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-[#1C2B2B]3 text-xs">
                  <span className="flex items-center gap-1"><Clock size={10} /> {article.time}</span>
                  <span className="text-[#1A4731] font-semibold flex items-center gap-1">Lesen <ArrowRight size={11} /></span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Keyword-Hub — Links zu allen Themen-Seiten */}
        <div className="mt-14 mb-10">
          <h2 className="font-heading font-bold text-[#1C2B2B] text-xl mb-2">
            Alle Wärmepumpen-Themen — Stadtspezifische Seiten
          </h2>
          <p className="text-[#1C2B2B]3 text-sm mb-6">
            Wählen Sie ein Thema und Ihre Stadt — alle Seiten mit lokalen Preisen, JAZ und Förderinfo.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              ['Wärmepumpe',             'waermepumpe',               '🏠'],
              ['Kosten 2026',            'waermepumpe-kosten',         '💰'],
              ['Förderung',              'waermepumpe-foerderung',     '🎁'],
              ['Installateur',           'waermepumpe-installateur',   '🔧'],
              ['Luft-Wasser-WP',         'luft-wasser-waermepumpe',   '💨'],
              ['WP kaufen',              'waermepumpe-kaufen',         '🛒'],
              ['WP Altbau',              'waermepumpe-altbau',         '🏚️'],
              ['WP nachrüsten',          'waermepumpe-nachruesten',    '⬆️'],
              ['Heizung tauschen',       'heizung-tauschen',           '🔄'],
              ['Installation',           'waermepumpe-installation',   '📋'],
              ['Kommunale Wärmeplanung', 'kommunale-waermeplanung',    '🗺️'],
              ['Erdwärmepumpe',          'erdwaermepumpe',             '🌍'],
              ['WP Angebot',             'waermepumpe-angebot',        '📄'],
              ['WP Preise',              'waermepumpe-preise',         '💵'],
              ['WP Anbieter',            'waermepumpe-anbieter',       '🏢'],
              ['Luftwärmepumpe',         'luftwaermepumpe',            '🌬️'],
              ['WP Neubau',              'waermepumpe-neubau',         '🏗️'],
              ['WP Beratung',            'waermepumpe-beratung',       '💬'],
              ['WP Fachbetrieb',         'waermepumpe-fachbetrieb',    '⭐'],
              ['WP Montage',             'waermepumpe-montage',        '🔩'],
              ['WP oder Gas',            'waermepumpe-oder-gas',       '⚖️'],
              ['Stromverbrauch',         'waermepumpe-stromverbrauch', '⚡'],
            ].map(([label, slug, icon]) => (
              <Link key={slug} href={`/${slug}`}
                className="flex items-center gap-2 p-3 bg-wp-bg border border-wp-border rounded-xl text-sm text-[#1C2B2B] hover:text-[#1A4731] hover:border-wp-green transition-all">
                <span>{icon}</span>
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-12 bg-[#1A4731] rounded-2xl p-8 text-center">
          <h3 className="font-bold text-white text-xl mb-2">Bereit — Ihr WP-Projekt starten?</h3>
          <p className="text-white/60 text-sm mb-5">Kostenlose Anfrage · HWK-geprüfte Betriebe · KfW-Antrag inklusive</p>
          <Link href="/kontakt"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#D97706] text-white font-heading font-bold rounded-xl hover:bg-amber-700 transition-all">
            Kostenlos anfragen <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
