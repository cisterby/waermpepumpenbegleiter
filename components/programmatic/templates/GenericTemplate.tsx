// components/programmatic/templates/GenericTemplate.tsx
// Vollwertiges Template für alle Tier 2-4 Keywords (17 Keywords × 733 Städte)
// Unique Content durch: city-hash Textvarianten + rotierende Blöcke + keyword-spezifische Sektionen
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, CheckCircle, TrendingDown, Shield, Sun } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, getIntroParagraphs, getCTAVariation, getKwCategory, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock, getBundeslandParagraph, getGebaeudeParagraph, getEnergieParagraph, getComparisonTable, getLocalTestimonial, getSeasonalAdvice, getCrossKeywordLinks, getInlineLinkedParagraph, getLokaleTiefenanalyse } from '@/lib/content-variation';
import { KEYWORDS } from '@/lib/keywords';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

// ── Keyword-Kategorien → spezifischer Hauptinhalt ────────────────────────────

function getKwMainContent(city: CityPageRouterProps['city'], keyword: CityPageRouterProps['keyword'], jaz: number, calc: CityPageRouterProps['calc'], foerd: CityPageRouterProps['foerd']) {
  const cat = getKwCategory(keyword);
  const fmtK = (n: number) => n.toLocaleString('de-DE') + ' €';
  const pvErtrag = Math.round(city.avgSunHours * 8 * 0.85);
  const pvErsparnis = Math.round(Math.min(pvErtrag * 0.65, Math.round(120 * 160 / jaz)) * (city.strompreis / 100));
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const isUrgent = city.einwohner >= 100000;

  // 5 Hash-Varianten pro Kategorie für den Einleitungsabsatz
  const introsByCategory: Record<string, string[]> = {
    kosten: [
      `Eine Wärmepumpe kostet in ${city.name} komplett (Gerät + Montage + Hydraulik + Elektrik) zwischen €18.000 und €28.000 brutto. Bei ${city.strompreis} ct/kWh lokalem Strompreis und JAZ ${jaz} sinken die jährlichen Heizkosten auf ${fmtK(calc.wpKosten)} — das sind ${fmtK(calc.ersparnis)} weniger als mit Erdgas.`,
      `Der Eigenanteil nach KfW-Förderung (${foerd.gesamtSatz}%) beträgt in ${city.name} ab ${fmtK(foerd.eigenanteil)}. Was viele Angebote weglassen: Hydraulischer Abgleich (€500–1.500, KfW-Pflicht), Fundament (€300–800) und Elektroinstallation (€500–1.500). Wir stellen sicher, dass alle 3 Angebote vollständig sind.`,
      `Preis für die häufigste Wärmepumpe in ${city.name}: Luft-Wasser-WP 10 kW — ca. €22.000 brutto, nach 50% KfW-Förderung: ab ${fmtK(Math.round(22000 * 0.50))} Eigenanteil. Amortisation bei ${fmtK(calc.ersparnis)}/Jahr Ersparnis: ca. ${calc.amortisationJahre} Jahre.`,
      `Die versteckten Kostenunterschiede zwischen Angeboten in ${city.name} liegen nicht am Gerät, sondern an der Installation: Montageaufwand, hydraulischer Abgleich und Elektrik können je nach Betrieb um 20–40% variieren. Wir vergleichen kostenlos.`,
      `Beim Strompreis ${city.strompreis} ct/kWh in ${city.name} und JAZ ${jaz} kostet eine kWh WP-Wärme nur ${(city.strompreis / jaz).toFixed(1)} ct — günstiger als jede andere Heizoption. Über 20 Jahre Laufzeit summiert sich das auf ${fmtK(calc.ersparnis * 20)} Gesamtersparnis.`,
    ],
    foerderung: [
      `In ${city.name} (${city.bundesland}) beträgt die KfW-Bundesförderung ${foerd.gesamtSatz}% = ${fmtK(foerd.zuschuss)} nicht rückzahlbarer Zuschuss. Dieser Antrag muss zwingend VOR Baubeginn gestellt werden — eine nachträgliche Förderung ist ausgeschlossen.`,
      `Die häufigste Förderkombination für ${city.name}: 30% Grundförderung + 20% Klima-Speed-Bonus (bei Ersatz einer Gasheizung als Eigennutzer) = 50% = ${fmtK(Math.round(25000 * 0.50))} bei €25.000 Investition.${city.bundeslandFoerderung ? ` Dazu kommt in ${city.bundesland}: ${city.bundeslandFoerderung} (${city.bundeslandFoerderungBetrag}).` : ''}`,
      `Wenige kennen den iSFP-Bonus: Wer vor der WP-Beantragung einen Individuellen Sanierungsfahrplan (iSFP) erstellen lässt, erhält +5% zusätzliche KfW-Förderung. Der iSFP selbst wird zu 80% von BAFA gefördert — Eigenanteil ca. €60–140. In ${city.name} = +${fmtK(Math.round(25000 * 0.05))} mehr Zuschuss.`,
      `Der Einkommensbonus (30%) für Haushalte unter €40.000 Nettoeinkommen/Jahr macht in ${city.name} den Unterschied: ${foerd.gesamtSatz + 30 > 70 ? 70 : foerd.gesamtSatz + 30}% = bis zu ${fmtK(Math.round(Math.min(25000, 30000) * Math.min((foerd.gesamtSatz + 30) / 100, 0.70)))} Zuschuss. Kombinierbar mit Klima-Speed-Bonus.`,
      `${city.bundesland} hat ${city.bundeslandFoerderung ? `zusätzlich das Programm "${city.bundeslandFoerderung}": ${city.bundeslandFoerderungBetrag}. Das` : 'kein eigenes WP-Förderprogramm. Dafür'} gilt die KfW-Bundesförderung in ${city.name} uneingeschränkt — ohne Landesantrag, ohne Wartezeit, direkt online.`,
    ],
    installateur: [
      `In ${city.name} gibt es sowohl lokale SHK-Meisterbetriebe als auch bundesweite Anbieter wie Thermondo oder Enpal. Der entscheidende Unterschied: Lokale Betriebe kennen die Netzbetreiber, die Auflagen in ${city.bundesland} und sind bei Störungen schnell vor Ort. Wir vermitteln nur lokal ansässige, HWK-geprüfte Betriebe.`,
      `Für die KfW-Förderung brauchen Sie einen im KfW-Portal registrierten Lieferanten- und Leistungserbringer (LuL). Nicht jeder SHK-Betrieb in ${city.name} ist das — alle unsere Partner schon. Ohne LuL-Registrierung: kein KfW-Antrag, keine Förderung.`,
      `Die Wartezeit bei guten Fachbetrieben in ${city.name} liegt aktuell bei 4–10 Wochen. Wer jetzt anfrägt, sichert sich Kapazität für die nächste Heizsaison — und das zum richtigen Zeitpunkt vor der GEG-Frist ${gegFristFormatted}.`,
      `Was ein gutes Installateur-Angebot in ${city.name} enthält: Heizlastberechnung nach DIN EN 12831, alle Positionen einzeln (Gerät, Montage, Hydraulik, Elektrik), hydraulischen Abgleich (KfW-Pflicht) und KfW-Antragsbegleitung. Wir prüfen das für Sie.`,
      `Preisunterschiede von 20–40% bei identischer Leistung sind in ${city.name} keine Seltenheit. Deshalb empfiehlt die Verbraucherzentrale mindestens 3 Vergleichsangebote. Wir holen sie in 48 Stunden ein — kostenlos, von geprüften lokalen Betrieben.`,
    ],
    vergleich: [
      `Wärmepumpe vs. Gasheizung in ${city.name}: Gaspreis ${city.gaspreis} ct/kWh + steigender CO₂-Preis (2026: 55 €/t) vs. WP-Strom ${city.strompreis} ct/kWh × JAZ ${jaz}. Heute: ${fmtK(calc.ersparnis)}/Jahr Vorteil WP. Ab 2030 mit CO₂-Preis 100 €/t: Abstand wächst auf ca. ${fmtK(calc.ersparnis + 350)}/Jahr.`,
      `Das GEG 2024 macht in ${city.name} die Entscheidung einfach: Ab ${gegFristFormatted} muss jede neue Heizung 65% erneuerbare Energie nutzen. Eine Wärmepumpe erfüllt das automatisch — eine Gasheizung allein nicht mehr. ${isUrgent ? 'Als Großstadt trifft Sie die Frist zuerst.' : 'Sie haben noch Zeit, aber die besten Betriebe sind schnell ausgebucht.'}`,
      `Heizung tauschen in ${city.name}: Alle GEG-konformen Optionen im Vergleich — Wärmepumpe (günstigste Betriebskosten ${fmtK(calc.wpKosten)}/J, bis 70% KfW), Pellets (GEG-konform, aber Wartung + Lagerung), Fernwärme (${city.fernwaermeQuote}% Abdeckung in ${city.name}, Preise variieren). Unsere Empfehlung: WP für die meisten Häuser.`,
      `Altbau in ${city.name}: Der häufigste Einwand — "Mein Haus ist für eine WP nicht geeignet." In der Praxis sind über 80% der Bestandsgebäude mit moderner Luft-WP (bis 70°C Vorlauf) kompatibel. Bei ${city.normAussentemp}°C Norm-Außentemperatur und JAZ ${jaz} rechnet sich die WP auch im Altbau.`,
      `Hybridheizung (WP + Gas) als Kompromiss: Günstiger Einstieg, aber: Gas-Abhängigkeit bleibt, CO₂-Preise steigen, GEG-Konformität ist eingeschränkt. Für ${city.name} mit ${city.gaspreis} ct/kWh Gaspreis empfehlen wir die reine Wärmepumpe — die Vollkosten sind langfristig günstiger.`,
    ],
    technik: [
      `Bei ${city.avgTemp}°C Jahresmitteltemperatur und ${city.normAussentemp}°C Norm-Außentemperatur (DIN EN 12831) in ${city.name} erreicht eine Luft-Wasser-WP eine JAZ von ${jaz}. Das bedeutet: Aus 1 kWh Strom werden ${jaz} kWh Wärme. Mit Fußbodenheizung (35°C Vorlauf) steigt die JAZ auf ${(jaz + 0.3).toFixed(1)}.`,
      `Die Heizlastberechnung nach DIN EN 12831 ist der entscheidende erste Schritt in ${city.name}: Sie verhindert Über- und Unterdimensionierung. Eine zu große WP "taktet" häufig — das senkt die JAZ und verkürzt die Lebensdauer. Unsere Partner führen die Berechnung vor jedem Angebot durch.`,
      `Luft-WP in ${city.name} und PV: Mit ${city.avgSunHours} Sonnenstunden/Jahr erzeugt eine 8-kWp-Anlage ca. ${pvErtrag.toLocaleString('de-DE')} kWh/Jahr. Davon direkt für die WP genutzt: ca. ${Math.round(pvErtrag * 0.65 / Math.max(pvErtrag * 0.65, 1) * Math.min(pvErtrag * 0.65, Math.round(120 * 160 / jaz))).toLocaleString('de-DE')} kWh — Zusatzersparnis: ${fmtK(pvErsparnis)}/Jahr.`,
      `Sole-Wasser vs. Luft-Wasser in ${city.name}: Sole-WP (Erdwärme) erreicht JAZ 4,3–5,0, braucht aber Erdbohrung (100–150m, ca. €6.000–12.000 Mehrkosten) und Genehmigung. Luft-WP: JAZ ${jaz}, keine Bohrung, schnell installiert, 92% Marktanteil. Für die meisten Häuser in ${city.name}: Luft-WP.`,
      `Vorlauftemperatur in ${city.name}: Mit dem hydraulischen Abgleich (€500–1.500, KfW-Pflicht) sinkt die nötige Vorlauftemperatur um oft 5–10°C — das verbessert die JAZ von ${jaz} auf ${(jaz + 0.2).toFixed(1)}. Ältere Heizkörper sind in den meisten Häusern in ${city.bundesland} kompatibel.`,
    ],
    allgemein: [
      `In ${city.name} setzen immer mehr Hausbesitzer auf Wärmepumpen: 299.000 Anlagen wurden 2025 in Deutschland installiert (+55% ggü. 2024). Bei ${city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und ${city.strompreis} ct/kWh Strompreis macht die WP in ${city.name} besonderen Sinn — JAZ ${jaz}, Ersparnis ${fmtK(calc.ersparnis)}/Jahr.`,
      `${city.name} (${city.bundesland}) hat ${city.efhQuote}% Einfamilienhäuser — das ist der klassische Wärmepumpen-Markt. Dazu ${city.fernwaermeQuote}% Fernwärmeabdeckung — für die übrigen ${100 - city.fernwaermeQuote}% der Gebäude ist die WP die klare GEG-konforme Alternative.`,
      `Die GEG-Frist für ${city.name}: ${gegFristFormatted}. ${isUrgent ? 'Als Großstadt über 100.000 Einwohner handeln Sie jetzt — gute Betriebe sind 8–12 Wochen ausgebucht.' : 'Handeln Sie frühzeitig: Die besten lokalen Betriebe in ' + city.name + ' haben lange Wartelisten.'} Wir vermitteln kostenlos.`,
      `Was ${city.name} besonders macht: ${city.avgTemp}°C Jahresmittel erlaubt JAZ ${jaz}, ${city.avgSunHours} Sonnenstunden ermöglichen attraktive WP+PV-Kombination (${fmtK(pvErsparnis)}/Jahr Zusatzersparnis mit 8 kWp).${city.bundeslandFoerderung ? ` Dazu ${city.bundeslandFoerderung} in ${city.bundesland}.` : ''}`,
      `Unser Service in ${city.name}: Kostenlose Vermittlung an HWK-geprüfte Meisterbetriebe, KfW-Antragsbegleitung inklusive, bis zu 3 vollständige Vergleichsangebote — herstellerunabhängig, ohne Druckverkäufe. 100% kostenlos für Hausbesitzer.`,
    ],
  };

  const variants = introsByCategory[cat] ?? introsByCategory.allgemein;
  const introIdx = cityHash(city, variants.length, 5);
  return variants[introIdx];
}

// ── Rotierende Zusatzblöcke (2 von 4 je Stadt) ───────────────────────────────
function getRotatingBlocks(city: CityPageRouterProps['city'], foerd: CityPageRouterProps['foerd'], jaz: number, calc: CityPageRouterProps['calc']) {
  const pvErtrag = Math.round(city.avgSunHours * 8 * 0.85);
  const pvErsparnis = Math.round(Math.min(pvErtrag * 0.65, Math.round(120 * 160 / jaz)) * (city.strompreis / 100));
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const isUrgent = city.einwohner >= 100000;

  const allBlocks = [
    // Block 0: GEG
    {
      title: `GEG-Status ${city.name}: Frist ${gegFristFormatted}`,
      icon: '📋',
      color: isUrgent ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white',
      content: (
        <div className="space-y-2 text-sm text-[#4A6358]">
          <p>{isUrgent ? `⚠️ Als Großstadt über 100.000 Einwohner gilt in ${city.name} die 65%-EE-Pflicht ab ${gegFristFormatted}.` : `In ${city.name} gilt die 65%-EE-Pflicht ab ${gegFristFormatted}. Frühzeitiges Handeln sichert volle Förderung.`}</p>
          <p className="text-[#4A6358] text-base leading-relaxed">
                {[
                  `In ${city.name} ist die Wärmepumpe die einzige Heiztechnologie, die GEG-konform ist, bis 70% KfW-gefördert wird, CO₂-Kosten eliminiert und die Immobilie langfristig wertstabil hält.`,
                  `Für Hausbesitzer in ${city.name}: Die WP ist GEG-konform ohne Einschränkungen, bis 70% KfW-gefördert, unabhängig von steigenden CO₂-Preisen und wertsteigernd für Ihre Immobilie.`,
                  `Die WP ist in ${city.name} die einzige Heiztechnologie ohne Wenn und Aber: GEG-konform, KfW-gefördert bis 70%, kein CO₂-Aufschlag, langfristig sichere Investition.`,
                  `In ${city.name} kombiniert die Wärmepumpe alle Vorteile: volle GEG-Konformität, KfW-Förderung bis 70% (max. €21.000), keine CO₂-Preis-Abhängigkeit und ${fmtEuro(calc.ersparnis)}/Jahr Betriebsersparnis.`,
                ][cityHash(city, 4, 350)]}
              </p>
        </div>
      ),
    },
    // Block 1: PV + WP
    {
      title: `WP + PV in ${city.name}: ${pvErtrag.toLocaleString('de-DE')} kWh/Jahr`,
      icon: '☀️',
      color: 'border-gray-200 bg-white',
      content: (
        <div className="space-y-2 text-sm text-[#4A6358]">
          <p>Mit {city.avgSunHours} Sonnenstunden/Jahr und 8 kWp PV produzieren Sie in {city.name} ca. {pvErtrag.toLocaleString('de-DE')} kWh Strom/Jahr — genug um die WP tagsüber direkt zu betreiben.</p>
          <p>Zusatzersparnis durch PV+WP-Kombination: <strong className="text-[#1A4731]">{pvErsparnis.toLocaleString('de-DE')} €/Jahr</strong> — weil PV-Strom die Wärme auf unter 10 ct/kWh senkt.</p>
        </div>
      ),
    },
    // Block 2: iSFP
    {
      title: `iSFP: +5% KfW-Bonus für ${city.name}`,
      icon: '📑',
      color: 'border-gray-200 bg-white',
      content: (
        <div className="space-y-2 text-sm text-[#4A6358]">
          <p>Mit einem Individuellen Sanierungsfahrplan (iSFP) erhalten Sie +5% zusätzliche KfW-Förderung. Bei €25.000 WP-Investition = +{Math.round(25000 * 0.05).toLocaleString('de-DE')} € mehr Zuschuss.</p>
          <p className="text-[#4A6358] text-base leading-relaxed">
                {[
                  `Der iSFP kostet in ${city.name} €300–700 — und wird zu 80% von BAFA gefördert (Eigenanteil ca. €60–140). Mit iSFP gibt es +5% KfW-Bonus: bei €25.000 Invest = +€1.250 extra Förderung. Lohnt sich fast immer.`,
                  `iSFP in ${city.name}: Eigenanteil nur ca. €60–140 (80% BAFA-gefördert). Der +5% iSFP-Bonus bringt bei typischen Vollkosten von €20.000–25.000 eine Zusatzförderung von €1.000–1.250 — der iSFP finanziert sich selbst.`,
                  `Mit iSFP erhalten Eigenheimbesitzer in ${city.name} +5% KfW-Bonus zusätzlich. Bei ${fmtEuro(Math.round(25000 * 0.05))} Mehrförderung auf €25.000 Invest ist der iSFP-Eigenanteil von ~€120 klar rentabel.`,
                  `BAFA-Energieberatung mit iSFP in ${city.name}: Kosten €300–700, davon 80% BAFA-gefördert. Ergebnis: +5% KfW-Bonus auf alle WP-Maßnahmen. Gültig 15 Jahre — auch für spätere Sanierungsschritte nutzbar.`,
                ][cityHash(city, 4, 351)]}
              </p>
        </div>
      ),
    },
    // Block 3: Hersteller
    {
      title: 'Bewährte WP-Hersteller',
      icon: '🏆',
      color: 'border-gray-200 bg-white',
      content: (
        <div className="space-y-1.5 text-sm">
          {[
            { n: 'Viessmann Vitocal', v: 'Testsieger Stiftung Warentest 2024/25' },
            { n: 'Vaillant aroTHERM', v: 'R290 Propan-WP, +5% KfW-Kältemittelbonus' },
            { n: 'Bosch / Buderus', v: 'Gutes Preis-Leistungs-Verhältnis' },
            { n: 'Stiebel Eltron', v: 'Deutsche Qualität, lange Garantie' },
          ].map((h, i) => (
            <div key={i} className="flex justify-between text-xs border-b border-gray-200 pb-1.5">
              <span className="font-semibold text-[#1C2B2B]">{h.n}</span>
              <span className="text-[#7A9E8E]">{h.v}</span>
            </div>
          ))}
          <p className="text-[#7A9E8E] text-xs pt-1">Herstellerunabhängig — wir empfehlen das für Ihr Haus passende Gerät.</p>
        </div>
      ),
    },
    // Block 4: Bundesland
    {
      title: `${city.bundesland}-Förderung`,
      icon: '🏛️',
      color: city.bundeslandFoerderung ? 'border-[#3DA16A]/30 bg-[#E8F5EE]' : 'border-gray-200 bg-white',
      content: city.bundeslandFoerderung ? (
        <div className="space-y-2 text-sm text-[#4A6358]">
          <p><strong>{city.bundeslandFoerderung}</strong>: {city.bundeslandFoerderungBetrag}</p>
          {city.bundeslandFoerderungUrl && (
            <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer" className="text-[#1A4731] text-xs font-semibold hover:underline">Mehr Infos ↗</a>
          )}
        </div>
      ) : (
        <p className="text-sm text-[#4A6358]">{city.bundesland} setzt auf KfW-Bundesprogramme. Die volle Bundesförderung (bis 70%) gilt in {city.name} uneingeschränkt.</p>
      ),
    },
    // Block 5: CO₂
    {
      title: `CO₂-Einsparung in ${city.name}`,
      icon: '🌿',
      color: 'border-gray-200 bg-white',
      content: (
        <div className="space-y-2 text-sm text-[#4A6358]">
          <p>Ein 120 m² EFH in {city.name} spart mit einer WP ca. <strong className="text-[#1A4731]">{Math.round(120 * 160 * 0.0002 * 10) / 10} Tonnen CO₂/Jahr</strong> gegenüber einer Gasheizung.</p>
          <p>Entspricht {Math.round(120 * 160 * 0.0002 * 10000)} km weniger mit einem Diesel-PKW. Über 20 Jahre: {Math.round(120 * 160 * 0.0002 * 20 * 10) / 10} Tonnen CO₂ gespart.</p>
        </div>
      ),
    },
  ];

  // 2 von 6 Blöcken city-hash-basiert auswählen
  const idx1 = cityHash(city, allBlocks.length, 30);
  const idx2 = (idx1 + 2 + cityHash(city, 3, 31)) % allBlocks.length;
  return [allBlocks[idx1], allBlocks[idx2]];
}

// ══ HAUPTKOMPONENTE ═══════════════════════════════════════════════════════════

// ── Bildpool ─────────────────────────────────────────────
const HERO_IMGS = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=85",
  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85",
];
const SEC1_IMGS = ["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=85", "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85"];
const SEC2_IMGS = ["https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=85", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85", "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=85"];
const pickImg = (arr: string[], lat: number, lng: number, salt = 0) =>
  arr[Math.abs(Math.round(lat * 7 + lng * 13 + salt)) % arr.length];

export default function GenericTemplate({
  city, keyword, calc, foerd, jaz, nearby, h1,
}: CityPageRouterProps) {

  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);
  const introParagraphs = getIntroParagraphs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const kwMainContent = getKwMainContent(city, keyword, jaz, calc, foerd);
  const ctaVariation = getCTAVariation(city, keyword, calc.ersparnis);
  const rotatingBlocks = getRotatingBlocks(city, foerd, jaz, calc);

  const crossKeywords = keyword.crossLinks.map(s => getKeywordBySlug(s)).filter(Boolean);
  const kw = keyword.keyword.replace('[Stadt]', '').trim();


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  const bundeslandText = getBundeslandParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const gebaeudeText = getGebaeudeParagraph(city, keyword, jaz, calc.wpKosten);
  const energieText = getEnergieParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const comparison = getComparisonTable(city, jaz, calc.wpKosten, calc.ersparnis);
  const testimonial = getLocalTestimonial(city, keyword);
  const seasonalText = getSeasonalAdvice(city);
  const crossLinks = getCrossKeywordLinks(city, keyword, KEYWORDS);
  const inlineLinkedParagraph = getInlineLinkedParagraph(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const lokaleTiefenanalyse = getLokaleTiefenanalyse(city, keyword, jaz, calc.wpKosten, calc.ersparnis);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* HERO */}
      <div className="relative min-h-[52vh] flex items-end overflow-hidden">
        <Image
          src={pickImg(HERO_IMGS, city.lat, city.lng, 0)}
          alt={h1}
          className="absolute inset-0 w-full h-full object-cover"
          fill priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,25,16,0.95) 0%, rgba(10,25,16,0.80) 50%, rgba(10,25,16,0.25) 100%)' }} />
        <div className="relative z-10 w-full pt-28 pb-14 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-5 text-white/80 flex-wrap">
            <Link href="/" className="hover:text-white/70 transition-colors">Startseite</Link>
            <span className="text-white/70">›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white/70 transition-colors">{kw}</Link>
            <span className="text-white/70">›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>

          <h1 className="font-extrabold text-white mb-4 leading-tight" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
            {h1}
          </h1>
              {/* Ultra-lokale Fakten */}
              <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-5">
                {city.name}: {city.strompreis} ct/kWh Strom · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.normAussentemp}°C Normaußentemp. · {city.fernwaermeQuote}% Fernwärme
              </p>
              {/* Preis-Badge — Eigenanteil nach KfW-Förderung */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-[#D97706]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  💰 ab {fmtEuro(foerd.eigenanteil)} Eigenanteil
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  💚 {fmtEuro(calc.ersparnis)}/J. sparen
                </span>
              </div>

          {/* Intro — variiert per cityHash × Keyword-Kategorie */}
          <p className="text-white/65 text-base leading-relaxed max-w-2xl mb-8">
            {introParagraphs[0]}
          </p>

          {/* Stats — immer stadtspezifisch */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {[
              { label: 'JAZ in ' + city.name, val: String(jaz), sub: city.avgTemp + '°C Jahresmittel' },
              { label: 'Ersparnis/Jahr', val: fmtEuro(calc.ersparnis), sub: 'vs. Erdgas' },
              { label: 'KfW-Förderung', val: foerd.gesamtSatz + '%', sub: fmtEuro(foerd.zuschuss) + ' Zuschuss' },
              { label: 'GEG-Frist', val: city.einwohner >= 100000 ? '30.06.2026' : '30.06.2028', sub: city.einwohner >= 100000 ? '⚠️ Dringend' : 'Frühzeitig planen' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="font-mono font-bold text-white text-lg leading-none mb-0.5">{s.val}</div>
                <div className="text-[#3DA16A] text-xs font-semibold">{s.label}</div>
                <div className="text-white/75 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-5xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_340px] gap-10 items-start">

        {/* LEFT */}
        <div>
          {/* Featured Snippet Antwort */}
          {keyword.featuredSnippetQuestions[0] && (
            <div className="bg-white border border-gray-200 border-l-4 border-l-wp-green rounded-xl p-6 mb-8 shadow-md">
              <h2 className="font-bold text-[#1C2B2B] text-xl mb-3">
                {fillTemplate(keyword.featuredSnippetQuestions[0], city, jaz)}
              </h2>
              <p className="text-[#4A6358] text-base leading-relaxed">
                {kwMainContent}
              </p>
            </div>
          )}

          {/* Keyword-spezifischer Hauptinhalt (2. Paragraph aus content-variation) */}
          <h2 className="font-bold text-[#1C2B2B] mb-4" style={{ fontSize: 'clamp(22px,2.5vw,34px)' }}>
            {fillTemplate(keyword.featuredSnippetQuestions[1] ?? `${kw} in ${city.name} — was Sie wissen müssen`, city, jaz)}
          </h2>
          <div className="space-y-4 mb-8">
            <p className="text-[#4A6358] text-base leading-relaxed">{introParagraphs[1]}</p>
            <p className="text-[#4A6358] text-base leading-relaxed">{introParagraphs[2]}</p>
          </div>

          {/* Stadtspezifische Klimafakten */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '🌡️', label: 'Jahresmitteltemperatur', val: city.avgTemp + '°C', sub: 'Quelle: DWD' },
              { icon: '📊', label: 'Heizgradtage', val: city.heizgradtage.toLocaleString('de-DE') + ' Kd/a', sub: 'IWU GTZ20/15' },
              { icon: '⚡', label: 'Lokaler Strompreis', val: city.strompreis + ' ct/kWh', sub: 'BDEW Regional' },
            ].map((d, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
                <div className="text-2xl mb-2">{d.icon}</div>
                <div className="font-mono font-bold text-[#1A4731] text-lg leading-none mb-0.5">{d.val}</div>
                <div className="font-semibold text-[#1C2B2B] text-xs mb-0.5">{d.label}</div>
                <div className="text-[#7A9E8E] text-xs">{d.sub}</div>
              </div>
            ))}
          </div>

          {/* 2 rotierende Zusatzblöcke (city-hash basiert) */}
          <div className="space-y-4 mb-8">
            {rotatingBlocks.map((block, i) => (
              <div key={i} className={`rounded-xl border p-5 ${block.color}`}>
                <h3 className="font-semibold text-[#1C2B2B] text-base mb-3 flex items-center gap-2">
                  <span>{block.icon}</span> {block.title}
                </h3>
                {block.content}
              </div>
            ))}
          </div>

          {/* Weitere Featured Snippet Fragen */}
          {keyword.featuredSnippetQuestions.slice(2).map((q, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-semibold text-[#1C2B2B] text-lg mb-2">
                {fillTemplate(q, city, jaz)}
              </h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">
                {faqs[i + 2]?.a ?? `Erfahren Sie mehr von unseren geprüften Fachbetrieben in ${city.name}.`}
              </p>
            </div>
          ))}
                    {/* Bundesland & Gebäudekontext */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Wärmepumpe in {city.bundesland} — {city.name} im Fokus</h2>
            <p className="text-[#4A6358] leading-relaxed">{bundeslandText}</p>
            <p className="text-[#4A6358] leading-relaxed">{gebaeudeText}</p>
          </div>

          {/* Energie & Wirtschaftlichkeit Deep-Dive */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Energiekosten-Analyse für {city.name}</h2>
            <p className="text-[#4A6358] leading-relaxed">{energieText}</p>
            {/* Vergleichstabelle */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1A4731] text-white">
                    {comparison.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row, ri) => (
                    <tr key={ri} className={ri === 0 ? 'bg-emerald-50 font-semibold' : 'bg-white'}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 border-b border-gray-100 text-gray-700">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kundenstimme */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <span key={i} className="text-[#D97706] text-lg">★</span>
              ))}
            </div>
            <blockquote className="text-gray-700 text-base italic leading-relaxed mb-4">
              „{testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1B5E37] font-bold text-sm">
                {testimonial.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{testimonial.author}</p>
                <p className="text-gray-500 text-xs">{testimonial.location} · Vermittelt über Wärmepumpenbegleiter.de</p>
              </div>
            </div>
          </div>

          {/* Verwandte Themen */}
          {crossLinks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Verwandte Themen für {city.name}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {crossLinks.map((link, i) => (
                  <a key={i} href={link.url} className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-[#1A4731] hover:shadow-sm transition-all group">
                    <p className="font-semibold text-[#1A4731] group-hover:underline text-sm mb-1">{link.anchor}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{link.context}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Inline verlinkte Absätze — natürliche Links im Fließtext */}
          {inlineLinkedParagraph && (
            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Weiterführende Informationen für {city.name}</h2>
              <p className="text-[#4A6358] text-base leading-relaxed [&_a]:text-[#1B5E37] [&_a]:font-semibold [&_a]:underline [&_a]:decoration-[#1B5E37]/30 hover:[&_a]:decoration-[#1B5E37]"
                dangerouslySetInnerHTML={{ __html: inlineLinkedParagraph }} />
            </div>
          )}

          {/* Lokale Tiefenanalyse — einzigartiger datenreicher Absatz */}
          <div className="bg-[#F2FAF5] rounded-2xl p-7 border border-[#D1E7DD]">
            <h2 className="text-xl font-bold text-[#1A4731] mb-3">Lokale Analyse: Wärmepumpe in {city.name}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed">{lokaleTiefenanalyse}</p>
          </div>

          {/* Saisonale Empfehlung */}
          <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#92400E] mb-1">Beste Installationszeit für {city.name}</p>
            <p className="text-[#78350F] text-sm leading-relaxed">{seasonalText}</p>
          </div>

          
          {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="mb-6 p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}
          {/* FAQ */}
          <h2 className="font-bold text-[#1C2B2B] mb-5 mt-10" style={{ fontSize: 'clamp(20px,2.5vw,30px)' }}>
            {h2s.faq}
          </h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-8">
            {faqs.map((faq, i) => (
              <details key={i} className="group border-b border-gray-200 last:border-0">
                <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                  <span className="font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                  <ChevronDown size={16} className="text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="border-t border-gray-200">
                  <p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          {/* Nachbarstädte + Cross-Links */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw2 => kw2 && (
                  <Link key={kw2.slug} href={`/${kw2.slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {kw2.keyword.replace('[Stadt]', city.name)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Sticky */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-[#1A4731] rounded-2xl p-6 shadow-2xl">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">{ctaVariation.headline}</p>
            <p className="font-mono font-bold text-white text-4xl leading-none mb-0.5">{fmtEuro(calc.ersparnis)}</p>
            <p className="text-white/75 text-xs mb-5">jährliche Ersparnis in {city.name} vs. Erdgas</p>
            <div className="space-y-2 mb-5">
              {[
                { l: 'Heizkosten heute', v: fmtEuro(calc.altKosten) + '/J', c: 'text-[#D97706]' },
                { l: 'Mit Wärmepumpe', v: fmtEuro(calc.wpKosten) + '/J', c: 'text-[#3DA16A]' },
                { l: 'KfW-Zuschuss', v: fmtEuro(foerd.zuschuss), c: 'text-white' },
                { l: 'Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-white' },
                { l: 'Amortisation', v: calc.amortisationJahre + ' Jahre', c: 'text-[#D97706]' },
              ].map(r => (
                <div key={r.l} className="flex justify-between py-1.5 border-b border-white/8">
                  <span className="text-white/80 text-xs">{r.l}</span>
                  <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                </div>
              ))}
            </div>
            <a href="/rechner"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#D97706] text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors mb-2">
              Kostenloses Angebot <ArrowRight size={15} />
            </a>
            <p className="text-white/70 text-xs text-center">Kostenlos · Unverbindlich · Kein Spam</p>
          </div>

          <div className="px-6 pb-8">
            <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          </div>

      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-bold text-[#1C2B2B] text-xl mb-6">
          Was sich 2026 geändert hat — und was das für {city.name} bedeutet
        </h2>
        <div className="space-y-4">

          {/* GEG-Reform */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.gegReform}</p>
          </div>

          {/* Neue Lärmvorschrift */}
          {['luft-wasser-waermepumpe','luftwaermepumpe','waermepumpe','waermepumpe-kosten','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-kaufen','waermepumpe-nachruesten','heizung-tauschen','waermepumpe-altbau'].includes(keyword.slug) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Neue Lärmvorschrift ab 01.01.2026</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.laerm10db}</p>
            </div>
          )}

          {/* Steuerliche Absetzbarkeit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-installateur','waermepumpe-preise','waermepumpe-installation','heizung-tauschen'].includes(keyword.slug) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.steuerAbsetz}</p>
            </div>
          )}

          {/* KfW-Ergänzungskredit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-preise','erdwaermepumpe','waermepumpe-neubau'].includes(keyword.slug) && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergänzungskredit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.kfwKredit}</p>
            </div>
          )}

          {/* Wartungskosten */}
          {['waermepumpe-kosten','waermepumpe','waermepumpe-preise','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-fachbetrieb','waermepumpe-kaufen'].includes(keyword.slug) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Wartungs- &amp; Langzeitkosten</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.wartungskosten}</p>
            </div>
          )}

          {/* Finanzierung */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.finanzierung}</p>
          </div>

        </div>
      </div>
          <AuthorBox keywordSlug={keyword.slug} />

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            <p className="text-xs font-bold text-[#7A9E8E] uppercase tracking-wider mb-3">Warum Wärmepumpenbegleiter?</p>
            {['Herstellerunabhängig', 'HWK-geprüfte Betriebe', 'KfW-Begleitung inklusive', `Lokal in ${city.name}`, '100% kostenlos'].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-gray-200 last:border-0 text-xs text-[#4A6358]">
                <CheckCircle size={12} className="text-[#1A4731] shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
