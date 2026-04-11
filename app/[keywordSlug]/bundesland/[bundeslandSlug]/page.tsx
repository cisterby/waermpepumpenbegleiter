// app/[keywordSlug]/[bundeslandSlug]/page.tsx
// 16 Bundesland-Hub-Seiten pro Keyword = 352 Hub-Seiten gesamt
// Zweck: Internes Linking, Bundesland-spezifische Förderinfo, GSC-Coverage

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { KEYWORDS, getKeywordBySlug } from '@/lib/keywords';
import citiesData from '@/lib/cities.json';
import type { City } from '@/lib/city-utils';

const BUNDESLAENDER: Record<string, { name: string; slug: string; foerderung: string | null; foerderungBetrag: string | null; foerderungUrl: string | null }> = {
  'berlin':                  { name: 'Berlin',                  slug: 'berlin',                  foerderung: 'Effiziente Gebäude PLUS', foerderungBetrag: 'Aktuell ausgesetzt', foerderungUrl: 'https://www.ibb.de' },
  'hamburg':                 { name: 'Hamburg',                  slug: 'hamburg',                  foerderung: 'IFB Erneuerbare Wärme',    foerderungBetrag: 'Luft-WP: €90/kW (min. €3.500)', foerderungUrl: 'https://www.ifbhh.de' },
  'bayern':                  { name: 'Bayern',                   slug: 'bayern',                   foerderung: null,                        foerderungBetrag: '10.000-Häuser-Programm eingestellt', foerderungUrl: null },
  'nordrhein-westfalen':     { name: 'Nordrhein-Westfalen',      slug: 'nordrhein-westfalen',      foerderung: 'progres.nrw',              foerderungBetrag: 'Erdwärme: €50/m Bohrung', foerderungUrl: 'https://www.progres.nrw.de' },
  'baden-wuerttemberg':      { name: 'Baden-Württemberg',        slug: 'baden-wuerttemberg',       foerderung: 'L-Bank Kombi-Darlehen',    foerderungBetrag: 'Zinsverbilligung bis €200.000', foerderungUrl: 'https://www.l-bank.de' },
  'niedersachsen':           { name: 'Niedersachsen',            slug: 'niedersachsen',            foerderung: 'Quartiersprogramm NBank',   foerderungBetrag: 'bis €7.250 WP + €2.500 Messung', foerderungUrl: 'https://www.nbank.de' },
  'hessen':                  { name: 'Hessen',                   slug: 'hessen',                   foerderung: 'Klimaschutzprogramm Hessen', foerderungBetrag: 'Beratungsförderung', foerderungUrl: 'https://www.energieland.hessen.de' },
  'rheinland-pfalz':         { name: 'Rheinland-Pfalz',         slug: 'rheinland-pfalz',          foerderung: 'ISB Energieeffizienzprogramm', foerderungBetrag: 'Ergänzungskredit', foerderungUrl: 'https://www.isb.rlp.de' },
  'sachsen':                 { name: 'Sachsen',                  slug: 'sachsen',                  foerderung: 'SAB Klimaschutzprogramm',   foerderungBetrag: 'Zuschuss bis €5.000', foerderungUrl: 'https://www.sab.de' },
  'thueringen':              { name: 'Thüringen',                slug: 'thueringen',               foerderung: 'Thüringer Aufbaubank',      foerderungBetrag: 'Zinsgünstige Darlehen', foerderungUrl: 'https://www.aufbaubank.de' },
  'sachsen-anhalt':          { name: 'Sachsen-Anhalt',           slug: 'sachsen-anhalt',           foerderung: 'IB Sachsen-Anhalt',         foerderungBetrag: 'Ergänzungsfinanzierung', foerderungUrl: 'https://www.ib-sachsen-anhalt.de' },
  'mecklenburg-vorpommern':  { name: 'Mecklenburg-Vorpommern',   slug: 'mecklenburg-vorpommern',   foerderung: 'Landesförderinstitut MV',   foerderungBetrag: 'Energiesparförderung', foerderungUrl: 'https://www.lfi-mv.de' },
  'brandenburg':             { name: 'Brandenburg',              slug: 'brandenburg',                  foerderung: 'ILB Brandenburg',           foerderungBetrag: 'RENplus Programm', foerderungUrl: 'https://www.ilb.de' },
  'schleswig-holstein':      { name: 'Schleswig-Holstein',       slug: 'schleswig-holstein',       foerderung: 'IB.SH Energieeffizienz',   foerderungBetrag: 'Ergänzungsförderung', foerderungUrl: 'https://www.ib-sh.de' },
  'saarland':                { name: 'Saarland',                 slug: 'saarland',                 foerderung: 'SIKB Saarland',             foerderungBetrag: 'Zinsgünstige Darlehen', foerderungUrl: 'https://www.sikb.de' },
  'bremen':                  { name: 'Bremen',                   slug: 'bremen',                   foerderung: 'Bremer Aufbaubank BAB',     foerderungBetrag: 'Klimaförderung', foerderungUrl: 'https://www.bab-bremen.de' },
};

const BUNDESLAND_DEEP_CONTENT: Record<string, {
  klimaInfo: string;
  gebaeude: string;
  markt: string;
  tipps: string;
}> = {
  'baden-wuerttemberg': {
    klimaInfo: 'Baden-Württemberg bietet ideale WP-Bedingungen: Der Oberrheingraben mit Jahresmitteltemperaturen von 8–11°C und milden Wintern sowie der Schwarzwald und die Schwäbische Alb mit 6–8°C und erhöhten Heizgradtagen. Im Rheintal erreichen Luft-Wärmepumpen JAZ-Werte (Jahresarbeitszahl) von 3,8–4,2, während sie im Hochschwarzwald auf 3,2–3,5 sinken. Die Region verfügt über zwei distinkte Klimazonen, die den Wärmepumpentyp maßgeblich beeinflussen.',
    gebaeude: 'Der Gebäudebestand umfasst ca. 2,4 Millionen Wohngebäude, davon etwa 60% Einfamilienhäuser. Etwa 45% der Gebäude stammen aus der Zeit vor 1978 und profitieren daher besonders von der Umstellung auf Wärmepumpen. Typische Vorlauftemperaturen liegen im Altbau zwischen 55–65°C (Hochtemperatur-Wärmepumpen erforderlich), während Neubauten mit 35–45°C deutlich effizienter zu betreiben sind.',
    markt: 'Baden-Württemberg führt Deutschland mit einer der höchsten Wärmepumpen-Installationsraten an: Etwa 42.000 Neuinstallationen pro Jahr. Die L-Bank bietet ergänzende Finanzierungsmöglichkeiten zum KfW-Programm. Die Installateursdichte ist besonders hoch im Rhein-Neckar-Raum, während es auf der Schwäbischen Alb zu engeren Kapazitäten kommen kann.',
    tipps: 'Unser Tipp für Baden-Württemberg: Im Oberrheingraben lohnt sich eine Standard-Luft-Wärmepumpe mit JAZ 3,8+. Ab 600 Metern Höhe sollten Hochtemperatur-Modelle geprüft werden. Die Kombination aus Photovoltaik und Wärmepumpe ist besonders rentabel, da der Südwesten mit über 1.750 Sonnenstunden pro Jahr zu den sonnenreichsten Regionen Deutschlands gehört.',
  },
  'bayern': {
    klimaInfo: 'Bayern umfasst mehrere Klimazonen: Das milde Alpenvorland (7–9°C Jahresmittel, JAZ 3,5–3,9) und die höheren Alpenregionen (2–6°C, JAZ 2,8–3,2 bei Luftwärmepumpen). Die Franken bieten mit 8–10°C ähnlich gute Bedingungen wie der Süden Deutschlands. Heizgradtage variieren zwischen 2.800 und 3.500 je nach Höhenlage und geografischer Position.',
    gebaeude: 'Bayerns Wohngebäudebestand zählt etwa 2,8 Millionen Gebäude, mit einem extrem hohen Anteil an Einfamilienhäusern (über 70%). Etwa 48% der Gebäude sind älter als 1978. Die durchschnittliche Gebäudegröße ist größer als in anderen Bundesländern, was höhere Heizlasten bedeutet. Vorlauftemperaturen im Altbau liegen häufig bei 60–70°C.',
    markt: 'Bayern verzeichnet etwa 38.000 Wärmepumpen-Neuinstallationen jährlich — trotz fehlender Landesförderung eine hohe Quote. Das Bundesförderungsprogramm ist attraktiv, und private Förderer (z.B. Energieversorger) bieten Zusatzleistungen. Die Installateursdichte ist im Süden hoch, im ländlichen Osten können Wartezeiten auftreten.',
    tipps: 'Unser Tipp für Bayern: Im Alpenvorland ist die Luft-Wärmepumpe standard (JAZ 3,5–3,8). Bei höheren Lagen (ab 600m) und älteren Gebäuden überprüfen Sie Hochtemperatur-Ausführungen oder Hybrid-Lösungen (WP + Gas). Erdwärmepumpen sind in Ballungsräumen wegen Bohrkosten weniger verbreitet, lohnen sich aber in ländlichen Gebieten mit besseren Untergrundverhältnissen.',
  },
  'berlin': {
    klimaInfo: 'Berlin hat gemäßigte Kontinental-Klimate mit Jahresmitteltemperaturen von 9–10°C und etwa 3.200 Heizgradtagen (HGT). Die Winter sind moderater als in östlichen Bundesländern, die Sommer wärmer. Luft-Wärmepumpen erreichen JAZ-Werte um 3,4–3,7. Der Untergrund besteht großflächig aus Sand und Kies, ideal für flache Erdwärmesonden mit Rückkühlung.',
    gebaeude: 'Berlin hat ca. 1,1 Millionen Wohngebäude, davon etwa 35% Einfamilienhäuser und 65% Mehrfamilienhäuser (Gründerzeit, Nachkrieg, Neubau). Etwa 52% sind älter als 1978, oft mit historischen Fassaden und Denkmalschutz. Vorlauftemperaturen liegen typischerweise bei 55–65°C in Gründerzeitgebäuden und 40–50°C in modernen Mehrfamilienhäusern.',
    markt: 'Berlin verzeichnet etwa 12.000 WP-Neuinstallationen pro Jahr — hohe Quote für eine einzelne Stadtregion. Das Effiziente-Gebäude-PLUS-Programm ist derzeit ausgesetzt; die KfW-Bundesförderung bleibt Hauptanlaufstelle. Installateursdichte ist sehr hoch und konzentriert auf innerstädtische Gebiete.',
    tipps: 'Unser Tipp für Berlin: Luftwärmepumpen sind für die meisten Mehrfamilienhäuser die beste Wahl (JAZ 3,4–3,7, modulierbar). Flache Erdwärme-Sonden (40–80m) sind im Kies-Untergrund wirtschaftlich. Denkmalschutz-Gebäude brauchen diskrete Außengeräte. Multi-Zonen-Systeme für größere Liegenschaften nutzen Synergien zwischen Heizen und Kühlung.',
  },
  'brandenburg': {
    klimaInfo: 'Brandenburg zeigt kontinentales Klima mit Jahresmitteltemperaturen von 8–9°C und 3.300–3.500 Heizgradtagen. Winter sind kälter und länger als in Westdeutschland. Luft-Wärmepumpen erreichen JAZ von 3,2–3,5. Der sandige Untergrund ermöglicht kostengünstige Erdwärmesonden. Sommerkühlung ist weniger relevant als Winterwärmeerzeugung.',
    gebaeude: 'Brandenburg hat etwa 0,8 Millionen Wohngebäude, zu etwa 75% Einfamilienhäuser in ländlichen Strukturen. Etwa 55% der Gebäude stammen vor 1978. Vorlauftemperaturen liegen bei 60–70°C (bedingt durch Altbaustandard und isolationstechnische Defizite). Viele dezentralisierte Wärmeversorgungen (Ölheizungen, Gas) können relativ kostengünstig auf WP umgestellt werden.',
    markt: 'Brandenburg hat etwa 6.500 WP-Neuinstallationen pro Jahr. Das RENplus-Programm der ILB bietet ergänzende Finanzierung. Installateure konzentrieren sich auf die Berliner Peripherie und größere Städte wie Potsdam; ländliche Gebiete haben längere Anfahrtswege.',
    tipps: 'Unser Tipp für Brandenburg: Luft-WP mit Wärmespeicher ist Standard (JAZ 3,2–3,5). Wegen hoher Heizgradtage die Vorlauftemperatur genau prüfen — Hybrid-Systeme (WP + Gas/Biomasse) können für ältere Gebäude wirtschaftlich sein. Erdwärme-Sonden sind wegen des günstigen Sands attraktiv und amortisieren sich mittelfristig.',
  },
  'bremen': {
    klimaInfo: 'Bremen hat ozeanisches Klima mit milden Wintern (Jahresmittel 8–9°C) und etwa 3.400 Heizgradtagen. Wind und Feuchtigkeit sind regional erhöht. Luft-Wärmepumpen erzielen JAZ-Werte um 3,3–3,6. Erdwärme-Sonden profitieren von stabilen Untergrund-Temperaturen, sind aber wegen hoher Grundwasserstände (1–2m) kostspielig in der Umsetzung.',
    gebaeude: 'Bremen hat ca. 0,35 Millionen Wohngebäude mit hohem Anteil an Mehrfamilienhäusern (Hafenstadt, dicht besiedelt) und älteren Bestandsgebäuden. Etwa 50% sind älter als 1978. Vorlauftemperaturen liegen typischerweise bei 55–65°C. Platzprobleme für Außengeräte sind häufiger als in größeren Regionen.',
    markt: 'Bremen verzeichnet etwa 2.500 WP-Neuinstallationen pro Jahr. Die Bremer Aufbaubank (BAB) bietet Klimaförderung als Ergänzung. Installateure sind konzentriert und gut erreichbar in der Stadt und dem Umland.',
    tipps: 'Unser Tipp für Bremen: Luftwärmepumpen sind erste Wahl (JAZ 3,3–3,6). Hochtemperatur-Ausführungen für Altbauten bevorzugen. Wegen hoher Grundwasserstände: flache Sonden-Tiefe prüfen oder Hybrid-Systeme erwägen. Split-Systeme für dezentrale Wärmeerzeugung bieten Flexibilität.',
  },
  'hamburg': {
    klimaInfo: 'Hamburg hat ozeanisches, mildes Klima mit Jahresmitteltemperaturen um 9–10°C und etwa 3.200 Heizgradtagen. Die Nähe zur Nordsee moderiert Winter und Sommer. Luft-Wärmepumpen erreichen JAZ-Werte von 3,4–3,7. Erdwärme ist wegen Grundwassers (sehr hoch) und verdichteter Besiedlung selten wirtschaftlich.',
    gebaeude: 'Hamburg hat ca. 0,55 Millionen Wohngebäude mit hohem Mehrfamilienhaus-Anteil (85%+). Etwa 48% sind älter als 1978, viele mit Gründerzeit-Standard. Vorlauftemperaturen: 55–70°C typisch. Viele Fernwärme-Kunden können bei Netzaustritt auf dezentrale WP wechseln.',
    markt: 'Hamburg verzeichnet ca. 7.500 WP-Neuinstallationen pro Jahr. Das IFB-Programm „Erneuerbare Wärme" bietet durchschnittlich €3.500 Zuschuss plus Förderung von Speichern und PV. Installateursdichte ist sehr hoch und stadtkonzentriert.',
    tipps: 'Unser Tipp für Hamburg: Luftwärmepumpen sind Standard (JAZ 3,4–3,7, modulierbar für Mehrfamilienhäuser). Hochtemperatur-WP für Gründerzeitgebäude mit Originalheizungen. Zu Fernwärmeausstieg: Gebäudeteams können Wärmepumpen dezentral arrangieren. Dachanlagen für PV sind flächen-limitiert — Wärmespeicher (Pufferspeicher) maximieren Eigenstromnutzung.',
  },
  'hessen': {
    klimaInfo: 'Hessen hat zonales, gemäßigt kontinentales Klima: Das Rhein-Main-Gebiet und Rheinhessen mit 9–10°C (JAZ 3,6–3,9), höhere Lagen um Frankfurt und Westerwald mit 7–8°C (JAZ 3,2–3,6). Heizgradtage liegen zwischen 3.000 und 3.300. Regionale Unterschiede sind erheblich und erfordern standortspezifische Planung.',
    gebaeude: 'Hessen hat ca. 2,1 Millionen Wohngebäude mit Mischung aus Einfamilienhäusern (55%) und Mehrfamilienhäusern (45%), stark konzentriert um Frankfurt und Wiesbaden. Etwa 47% sind älter als 1978. Vorlauftemperaturen liegen bei 50–65°C je nach Gebäudealter und -typ.',
    markt: 'Hessen verzeichnet ca. 18.000 WP-Neuinstallationen pro Jahr. Das Klimaschutzprogramm Hessen bietet Beratungsförderung. Installateure sind besonders konzentriert um die Metropolregion Frankfurt, ländliche Gebiete haben längere Wartezeiten.',
    tipps: 'Unser Tipp für Hessen: Im Rhein-Main-Gebiet ist Standard-Luftwärmepumpe optimal (JAZ 3,6–3,9). In höheren Lagen (Taunus, Westerwald) Hochtemperatur-Modelle überprüfen. Großflächige Nutzung von Geothermie in Ballungsräumen wegen hoher Grundwasservorkommen (Oberflächenwasser, Bohrkosten). Frankfurt und Umland: PV+WP-Kombination sehr attraktiv.',
  },
  'mecklenburg-vorpommern': {
    klimaInfo: 'Mecklenburg-Vorpommern hat ozeanisch-kontinentales Klima mit Jahresmitteltemperaturen von 8–9°C und hohen Heizgradtagen (3.400–3.600). Winter sind länger und kälter. Luft-Wärmepumpen erreichen JAZ-Werte von 3,0–3,4. Windvorkommen ist hoch (Windkraft-Region), aber Effizienz von Luft-WP sinkt bei hohen Windgeschwindigkeiten.',
    gebaeude: 'Mecklenburg-Vorpommern hat ca. 0,9 Millionen Wohngebäude mit hohem Anteil an Einfamilienhäusern in ländlichen Strukturen (70%+). Etwa 58% der Gebäude sind älter als 1978, oft mit einfachen Wärmeverhältnissen. Vorlauftemperaturen liegen oft bei 65–75°C in Altbauten.',
    markt: 'Mecklenburg-Vorpommern hat ca. 4.000 WP-Neuinstallationen pro Jahr — niedrige Quote. Das Landesförderinstitut MV bietet Energiespar-Förderung. Installateure sind in Ballungsräumen (Rostock, Schwerin) konzentriert; große ländliche Gebiete unterversorgt.',
    tipps: 'Unser Tipp für Mecklenburg-Vorpommern: Luft-WP mit Wärmespeicher zur Glättung (JAZ 3,0–3,4). Wegen hoher Heizgradtage und älteren Gebäuden Hybrid-Systeme (WP + Biomasse/Gas) überprüfen. Erdwärme ist durch stabilen Untergrund attraktiv. Wind-Standorte: Lufteinlässe geschützt anordnen, um Windeintrag zu minimieren.',
  },
  'niedersachsen': {
    klimaInfo: 'Niedersachsen zeigt ozeanisches bis gemäßigt kontinentales Klima: Die Küstenregion und das Tiefland mit 8–9°C (JAZ 3,3–3,6), Bergland und südliche Gebiete mit 7–8°C (JAZ 3,1–3,5). Heizgradtage variieren von 3.300 bis 3.500. Hoch gelegene Gebiete wie der Harz haben strengere Bedingungen.',
    gebaeude: 'Niedersachsen hat ca. 3,2 Millionen Wohngebäude mit Schwerpunkt auf Einfamilienhäusern (65%+) in ländlich-dezentralen Strukturen. Etwa 50% sind älter als 1978. Vorlauftemperaturen: typisch 55–70°C in Altbauten. Dezentralisierte Energieversorgung ermöglicht schnellere WP-Umstellung als in Fernwärmegebieten.',
    markt: 'Niedersachsen verzeichnet ca. 24.000 WP-Neuinstallationen pro Jahr (hohe Quote). Das Quartiersprogramm der NBank (bis €7.250 WP + €2.500 Messung) ist attraktiv. Installateursdichte ist gut, außer in Hafengebieten und sehr ländlichen Zonen.',
    tipps: 'Unser Tipp für Niedersachsen: Standard-Luftwärmepumpe ist wirtschaftlich (JAZ 3,3–3,6). Flachland ermöglicht kostengünstige Erdwärme-Sonden. NBank-Förderung nutzen: Kombiniert mit KfW bis zu €45.000 Gesamtförderung möglich. Hybrid-Systeme für Heizzonen mit Wärmebedarf >4.000 Heizgradtagen prüfen.',
  },
  'nordrhein-westfalen': {
    klimaInfo: 'Nordrhein-Westfalen hat gemäßigtes Klima mit Jahresmitteltemperaturen von 9–10°C im Tiefland und 7–8°C in höheren Lagen (Bergisches Land, Sauerland). Heizgradtage: 3.000–3.400. Luft-Wärmepumpen erreichen JAZ von 3,4–3,8 in günstigen Lagen, 3,0–3,3 in höheren Regionen. Erdwärme ist in vielen Gebieten wegen Grundwasserverhältnisse und Bergbau-Altlasten erschwert.',
    gebaeude: 'Nordrhein-Westfalen hat ca. 4,9 Millionen Wohngebäude (bevölkerungsreichstes Bundesland) mit Mischung aus Einfamilienhaus und Mehrfamilienhaus (50/50). Etwa 49% sind älter als 1978. Vorlauftemperaturen: 55–65°C typisch in Altbauten. Besiedlungsdichte ist höher als in anderen Bundesländern.',
    markt: 'Nordrhein-Westfalen führt Deutschland mit ca. 48.000 WP-Neuinstallationen pro Jahr an. Das progres.nrw-Programm bietet €50/m für Erdwärme-Bohrungen. Installateursdichte ist sehr hoch, insbesondere im Ruhrgebiet und Rheinland.',
    tipps: 'Unser Tipp für Nordrhein-Westfalen: Im Tiefland Standard-Luftwärmepumpe (JAZ 3,4–3,8). In Bergischen Land und Sauerland Hochtemperatur-Modelle berücksichtigen. Erdwärme: progres.nrw-Förderung nutzen, aber Bohrtiefe wegen Bergbau prüfen. Große Fläche: regional spezialisierte Installateure suchen.',
  },
  'rheinland-pfalz': {
    klimaInfo: 'Rheinland-Pfalz zeigt diverse Klimazonen: Das Rheintal und die Eifel mit 9–11°C (JAZ 3,6–4,0), höhere Lagen mit 6–8°C (JAZ 3,0–3,4). Heizgradtage variieren stark (2.900–3.500). Der Oberrheingraben ist eine der wärmsten Regionen Deutschlands. Südwestliche Ausrichtung und Vulkangestein prägen regionale Bedingungen.',
    gebaeude: 'Rheinland-Pfalz hat ca. 2,0 Millionen Wohngebäude mit hohem Einfamilienhaus-Anteil (65%+), konzentriert in Tal- und Hangsiedlungen. Etwa 50% sind älter als 1978. Vorlauftemperaturen liegen bei 55–70°C je nach Talage und Gebäudealter. Viele dezentrale Gas- und Ölheizungen können schnell auf WP umgestellt werden.',
    markt: 'Rheinland-Pfalz verzeichnet ca. 13.500 WP-Neuinstallationen pro Jahr. Das ISB-Energieeffizienzprogramm bietet Ergänzungskredite. Installateure sind konzentriert im Rheintal und um größere Städte; ländliche Eifel und Hunsrück haben längere Wartezeiten.',
    tipps: 'Unser Tipp für Rheinland-Pfalz: Im Rheintal und Oberrheingraben ist Standard-Luftwärmepumpe optimal (JAZ 3,6–4,0). In höheren Lagen (Eifel, Hunsrück) Hochtemperatur-Ausführungen prüfen. Solarthermie + WP ist wegen guter Sonneneinstrahlung attraktiv. Hybrid-Systeme für dezentrale Heizungsausstattungen empfohlen.',
  },
  'saarland': {
    klimaInfo: 'Saarland hat gemäßigtes, ozeanisch beeinflusses Klima mit Jahresmitteltemperaturen von 8–9°C und etwa 3.300 Heizgradtagen. Winter sind mild, Sommer moderat. Luft-Wärmepumpen erreichen JAZ-Werte um 3,3–3,6. Die hügelige Topographie erzeugt lokale Mikroklimate.',
    gebaeude: 'Das Saarland hat ca. 0,45 Millionen Wohngebäude mit Schwerpunkt auf Einfamilienhäusern und Arbeitersiedlungen aus Bergbau-Zeiten. Etwa 52% sind älter als 1978, oft mit einfachen Wärmeverhältnissen. Vorlauftemperaturen: 60–70°C typisch. Dezentralisierte Altlastengebiete erfordern standortspezifische Planung.',
    markt: 'Das Saarland verzeichnet ca. 3.500 WP-Neuinstallationen pro Jahr. Die SIKB bietet zinsgünstige Darlehen. Installateure sind klein strukturiert, aber erreichbar in den Ballungsräumen um Saarbrücken.',
    tipps: 'Unser Tipp für Saarland: Luftwärmepumpe ist standard (JAZ 3,3–3,6). Wegen hügeliger Topographie: Standortprüfung für Zulufteinlass wichtig. Erdwärme-Sonden attraktiv, Bohrtiefe wegen geologischer Vielfalt prüfen. Hybrid-Systeme für ältere Gebäude berücksichtigen.',
  },
  'sachsen': {
    klimaInfo: 'Sachsen hat kontinentales Klima mit Jahresmitteltemperaturen von 8–9°C in Ballungsräumen, 6–7°C in höheren Lagen (Erzgebirge, Sächsisches Hochland). Heizgradtage: 3.300–3.600. Luft-Wärmepumpen erreichen JAZ von 3,1–3,5. Winter können streng werden. Untergrund mit stabilen Bedingungen für Erdwärme.',
    gebaeude: 'Sachsen hat ca. 1,85 Millionen Wohngebäude mit Mischung aus älteren Bestandsgebäuden (Gründerzeit, DDR-Plattenbau) und Neubauten. Etwa 55% sind älter als 1978. Vorlauftemperaturen: typisch 50–65°C. Fernwärme-Abhängigkeit ist hoch in Leipzig und Dresden; dezentrale Umstellung auf WP ist wirtschaftlich.',
    markt: 'Sachsen verzeichnet ca. 8.500 WP-Neuinstallationen pro Jahr. Das SAB-Klimaschutzprogramm bietet Zuschüsse bis €5.000. Installateure konzentrieren sich auf Dresden und Leipzig; ländliche Gebiete unterversorgt.',
    tipps: 'Unser Tipp für Sachsen: Standard-Luftwärmepumpe mit Wärmespeicher (JAZ 3,1–3,5). Wegen kontinentalen Winters Vorlauftemperatur-Monitoring empfohlen. Fernwärme-Ausstiegsgebiete: Dezentrale WP in Gebäudeteams ermöglichen Synergien. Erdwärme in stabilen Gebieten attraktiv.',
  },
  'sachsen-anhalt': {
    klimaInfo: 'Sachsen-Anhalt hat kontinentales Klima mit Jahresmitteltemperaturen von 8–9°C und 3.300–3.500 Heizgradtagen. Hügelige Gebiete (Harz) haben kältere Bedingungen. Luft-Wärmepumpen erreichen JAZ um 3,1–3,4. Untergrund mit Sand und Kies ermöglicht kostengünstige Erdwärmesonden.',
    gebaeude: 'Sachsen-Anhalt hat ca. 0,95 Millionen Wohngebäude mit hohem Einfamilienhaus-Anteil (70%+) in ländlichen und dezentralen Strukturen. Etwa 56% sind älter als 1978. Vorlauftemperaturen: 60–75°C typisch in Altbauten. Dezentralisierte Ölheizungen ermöglichen schnelle WP-Umstellungen.',
    markt: 'Sachsen-Anhalt verzeichnet ca. 5.000 WP-Neuinstallationen pro Jahr. Die IB Sachsen-Anhalt bietet Ergänzungsfinanzierung. Installateure sind konzentriert um Halle und Magdeburg; Harz-Region und ländliches Sachsen unterversorgt.',
    tipps: 'Unser Tipp für Sachsen-Anhalt: Luftwärmepumpe mit Speicher (JAZ 3,1–3,4). Wegen hoher Heizgradtage Hybrid-Systeme (WP + Biomasse) überprüfen. Erdwärme-Sonden im sandigen Untergrund kostengünstig. Dezentrale Heizungen ermöglichen flexible Umstellungen.',
  },
  'schleswig-holstein': {
    klimaInfo: 'Schleswig-Holstein hat stark ozeanisches Klima mit milden Wintern (Jahresmittel 8–9°C) und etwa 3.200–3.400 Heizgradtagen. Hohe Windgeschwindigkeiten (Nordsee-Einfluss) können Effizienz von Luft-Wärmepumpen senken. Luft-WP JAZ: 3,2–3,6. Geothermie ist wegen hoher Grundwasserstände erschwert.',
    gebaeude: 'Schleswig-Holstein hat ca. 1,05 Millionen Wohngebäude mit hohem Einfamilienhaus-Anteil in ländlichen und Küstenstrukturen. Etwa 48% sind älter als 1978. Vorlauftemperaturen liegen bei 55–65°C in Altbauten. Viele dezentrale Heizungen ermöglichen schnelle Umstellung.',
    markt: 'Schleswig-Holstein verzeichnet ca. 7.000 WP-Neuinstallationen pro Jahr. Das IB.SH-Energieeffizienzprogramm bietet Ergänzungsförderung. Installateure sind konzentriert auf größere Städte (Kiel, Lübeck) und entlang der Metropolregion Hamburg.',
    tipps: 'Unser Tipp für Schleswig-Holstein: Luftwärmepumpe mit Wärmespeicher (JAZ 3,2–3,6, windresistent). Hochtemperatur-Modelle für Altbauten bevorzugen. Grundwassersonden wegen hohen Grundwassers selten möglich; Sole-Wärmepumpen mit Luft-Rückkühlung überprüfen. Windschutz bei Außengeräten wichtig.',
  },
  'thueringen': {
    klimaInfo: 'Thüringen hat kontinentales Klima mit Jahresmitteltemperaturen von 7–9°C in der Ebene und 5–7°C in höheren Lagen (Thüringer Wald). Heizgradtage: 3.300–3.700. Luft-Wärmepumpen erreichen JAZ um 3,0–3,5. Winter können streng sein. Untergrund mit stabilen Bedingungen für Erdwärme.',
    gebaeude: 'Thüringen hat ca. 0,85 Millionen Wohngebäude mit hohem Einfamilienhaus-Anteil (70%+) in ländlichen Strukturen. Etwa 60% sind älter als 1978. Vorlauftemperaturen: 60–75°C typisch in Altbauten. Fernwärme-Gebiete (aus DDR-Zeit) bieten Ausstiegspotenziale für dezentrale WP.',
    markt: 'Thüringen verzeichnet ca. 4.500 WP-Neuinstallationen pro Jahr. Die Thüringer Aufbaubank bietet zinsgünstige Darlehen. Installateure konzentrieren sich auf Erfurt, Jena und Großstädte; ländliche Gebiete unterversorgt.',
    tipps: 'Unser Tipp für Thüringen: Luftwärmepumpe mit Speicher (JAZ 3,0–3,5). Wegen hoher Heizgradtage und älteren Gebäuden Hybrid-Systeme (WP + Biomasse) überprüfen. Erdwärme in stabilen Gebieten (Thüringer Becken) attraktiv. Fernwärme-Ausstiegsprogramme für Wohnquartiere nutzen.',
  },
};

interface Props {
  params: { keywordSlug: string; bundeslandSlug: string };
}

export async function generateStaticParams() {
  return KEYWORDS.flatMap(kw =>
    Object.keys(BUNDESLAENDER).map(bl => ({
      keywordSlug: kw.slug,
      bundeslandSlug: bl,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const keyword = getKeywordBySlug(params.keywordSlug);
  const bl = BUNDESLAENDER[params.bundeslandSlug];
  if (!keyword || !bl) return {};

  const kw = keyword.keyword.replace('[Stadt]', '').trim();
  const title = `${kw} ${bl.name} 2026 — Alle ${bl.name}-Städte | Wärmepumpenbegleiter`;
  const desc = `${kw} in ${bl.name}: Alle Städte, ${bl.foerderung ? bl.foerderung + ' Landesförderung' : 'KfW-Förderung bis 70%'}, geprüfte Fachbetriebe. Kostenlos vergleichen.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/bundesland/${params.bundeslandSlug}` },
    robots: { index: true, follow: true },
  };
}

export default function BundeslandPage({ params }: Props) {
  const keyword = getKeywordBySlug(params.keywordSlug);
  const bl = BUNDESLAENDER[params.bundeslandSlug];
  if (!keyword || !bl) notFound();

  const cities = (citiesData as City[]).filter(c => c.bundeslandSlug === params.bundeslandSlug);
  const kw = keyword.keyword.replace('[Stadt]', '').trim();

  const topCities = [...cities].sort((a, b) => b.einwohner - a.einwohner);

  const blBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://xn--wrmepumpenbegleiter-gwb.de' },
      { '@type': 'ListItem', position: 2, name: keyword.keyword.replace('[Stadt]','').trim(), item: `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}` },
      { '@type': 'ListItem', position: 3, name: `${keyword.keyword.replace('[Stadt]','').trim()} ${bl.name}`, item: `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/bundesland/${params.bundeslandSlug}` },
    ],
  };
  const blItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${keyword.keyword.replace('[Stadt]','').trim()} — alle Städte in ${bl.name}`,
    numberOfItems: cities.length,
    itemListElement: cities.slice(0, 20).map((city, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${keyword.keyword.replace('[Stadt]', city.name)}`,
      url: `https://xn--wrmepumpenbegleiter-gwb.de/${keyword.slug}/${city.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blItemList) }} />
      {/* HERO */}
      <div className="bg-[#1A4731] py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-5 text-white/40 flex-wrap">
            <Link href="/" className="hover:text-white/70 transition-colors">Startseite</Link>
            <span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white/70 transition-colors">{kw}</Link>
            <span>›</span>
            <span className="text-white/60">Bundesland</span>
            <span>›</span>
            <span className="text-white/80">{bl.name}</span>
          </nav>
          <h1 className="font-heading font-extrabold text-white mb-3" style={{ fontSize: 'clamp(26px,3.5vw,46px)' }}>
            {kw} {bl.name} 2026 — {cities.length} Städte
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl mb-6">
            {[
              `${cities.length} ${bl.name}-Städte mit stadtspezifischen JAZ-Werten, lokalen Strompreisen und ${bl.foerderung ? bl.foerderung + ' Landesförderung' : 'KfW-Bundesförderung bis 70%'}. Geprüfte Fachbetriebe kostenlos vergleichen.`,
              `In ${bl.name} gibt es ${cities.length} Städte mit Wärmepumpen-Bedarf. ${bl.foerderung ? `Zusätzlich zur KfW: ${bl.foerderung} (${bl.foerderungBetrag}).` : 'KfW-Bundesförderung bis 70% gilt hier ohne Einschränkung.'} Jetzt kostenlos Fachbetrieb finden.`,
              `${bl.name}: ${cities.length} Städte, stadtspezifische Klimadaten, lokale Installateure. ${bl.foerderung ? `${bl.foerderung}: ${bl.foerderungBetrag}.` : 'KfW-Förderung bis 70% — kein Landeseigenprogramm nötig.'} Alles kostenlos über uns.`,
              `Alle ${cities.length} Städte in ${bl.name} — mit spezifischer JAZ, Heizgradtagen und lokalem Strompreis. ${bl.foerderung ? `Landesförderung: ${bl.foerderung}.` : `In ${bl.name} gilt die volle KfW-Bundesförderung bis €21.000.`}`,
            ][Math.abs(bl.name.charCodeAt(0) + bl.name.charCodeAt(1)) % 4]}
          </p>
          {/* Bundesland-Förderung */}
          {bl.foerderung && (
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-3">
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">{bl.name}-Förderung</p>
                <p className="text-white font-semibold text-sm">{bl.foerderung}</p>
                <p className="text-[#D97706] text-xs">{bl.foerderungBetrag}</p>
              </div>
              {bl.foerderungUrl && (
                <a href={bl.foerderungUrl} target="_blank" rel="noopener noreferrer nofollow"
                  className="text-[#1A4731] text-xs hover:underline shrink-0">
                  Mehr Infos →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Deep Content Section */}
        {BUNDESLAND_DEEP_CONTENT[params.bundeslandSlug] && (
          <div className="mb-12">
            <h2 className="font-bold text-[#1C2B2B] text-xl mb-6">
              Wärmepumpen in {bl.name} — Daten & Marktanalyse
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Klima & Effizienz */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-wp-sm">
                <h3 className="font-semibold text-[#1A4731] text-sm uppercase tracking-wide mb-3">
                  Klima & JAZ-Erwartungen
                </h3>
                <p className="text-[#1C2B2B] text-sm leading-relaxed">
                  {BUNDESLAND_DEEP_CONTENT[params.bundeslandSlug].klimaInfo}
                </p>
              </div>

              {/* Gebäudebestand */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-wp-sm">
                <h3 className="font-semibold text-[#1A4731] text-sm uppercase tracking-wide mb-3">
                  Gebäudebestand & Sanierungspotenziale
                </h3>
                <p className="text-[#1C2B2B] text-sm leading-relaxed">
                  {BUNDESLAND_DEEP_CONTENT[params.bundeslandSlug].gebaeude}
                </p>
              </div>

              {/* Markt & Installateure */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-wp-sm">
                <h3 className="font-semibold text-[#1A4731] text-sm uppercase tracking-wide mb-3">
                  WP-Markt & Installateursdichte
                </h3>
                <p className="text-[#1C2B2B] text-sm leading-relaxed">
                  {BUNDESLAND_DEEP_CONTENT[params.bundeslandSlug].markt}
                </p>
              </div>

              {/* Expertenempfehlung */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-wp-sm">
                <h3 className="font-semibold text-[#1A4731] text-sm uppercase tracking-wide mb-3">
                  Unsere Empfehlung für {bl.name}
                </h3>
                <p className="text-[#1C2B2B] text-sm leading-relaxed">
                  {BUNDESLAND_DEEP_CONTENT[params.bundeslandSlug].tipps}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alle Städte */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#1C2B2B] text-xl">
            {kw} — Alle {bl.name}-Städte
          </h2>
          <span className="text-[#7A9E8E] text-sm">{cities.length} Städte</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-10">
          {topCities.map(city => (
            <Link key={city.slug} href={`/${keyword.slug}/${city.slug}`}
              className="group flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-200 hover:border-[#1A4731] hover:shadow-wp-sm transition-all">
              <MapPin size={12} className="text-[#1A4731] shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-[#1C2B2B] text-xs group-hover:text-[#1A4731] transition-colors truncate">{city.name}</p>
                <p className="text-[#7A9E8E] text-xs">{(city.einwohner/1000).toFixed(0)}k EW</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Cross-Links andere Bundesländer */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-wp-sm mb-8">
          <h3 className="font-heading font-semibold text-[#1C2B2B] text-base mb-4">Andere Bundesländer</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(BUNDESLAENDER)
              .filter(([slug]) => slug !== params.bundeslandSlug)
              .map(([slug, info]) => (
                <Link key={slug} href={`/${keyword.slug}/bundesland/${slug}`}
                  className="px-3 py-1.5 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                  {info.name}
                </Link>
              ))}
          </div>
        </div>

        {/* Back to pillar */}
        <Link href={`/${keyword.slug}`}
          className="inline-flex items-center gap-2 text-[#1A4731] font-semibold hover:underline mt-8">
          ← Alle Städte anzeigen
        </Link>
      </div>
    </div>
  );
}