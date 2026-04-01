// components/programmatic/templates/GenericTemplate.tsx
// Vollwertiges Template für alle Tier 2-4 Keywords (17 Keywords × 733 Städte)
// Unique Content durch: city-hash Textvarianten + rotierende Blöcke + keyword-spezifische Sektionen
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, CheckCircle, TrendingDown, Shield, Sun } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, getIntroParagraphs, getCTAVariation, getKwCategory, cityHash, getDynamicH2s, getSectionIntros } from '@/lib/content-variation';
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
      color: isUrgent ? 'border-amber-300 bg-amber-50' : 'border-wp-border bg-white',
      content: (
        <div className="space-y-2 text-sm text-wp-text2">
          <p>{isUrgent ? `⚠️ Als Großstadt über 100.000 Einwohner gilt in ${city.name} die 65%-EE-Pflicht ab ${gegFristFormatted}.` : `In ${city.name} gilt die 65%-EE-Pflicht ab ${gegFristFormatted}. Frühzeitiges Handeln sichert volle Förderung.`}</p>
          <p>Eine Wärmepumpe ist die einzige Heiztechnologie, die GEG-konform ist, bis 70% KfW-gefördert wird und keine weiteren Auflagen erfordert.</p>
        </div>
      ),
    },
    // Block 1: PV + WP
    {
      title: `WP + PV in ${city.name}: ${pvErtrag.toLocaleString('de-DE')} kWh/Jahr`,
      icon: '☀️',
      color: 'border-wp-border bg-white',
      content: (
        <div className="space-y-2 text-sm text-wp-text2">
          <p>Mit {city.avgSunHours} Sonnenstunden/Jahr und 8 kWp PV produzieren Sie in {city.name} ca. {pvErtrag.toLocaleString('de-DE')} kWh Strom/Jahr — genug um die WP tagsüber direkt zu betreiben.</p>
          <p>Zusatzersparnis durch PV+WP-Kombination: <strong className="text-wp-green">{pvErsparnis.toLocaleString('de-DE')} €/Jahr</strong> — weil PV-Strom die Wärme auf unter 10 ct/kWh senkt.</p>
        </div>
      ),
    },
    // Block 2: iSFP
    {
      title: `iSFP: +5% KfW-Bonus für ${city.name}`,
      icon: '📑',
      color: 'border-wp-border bg-white',
      content: (
        <div className="space-y-2 text-sm text-wp-text2">
          <p>Mit einem Individuellen Sanierungsfahrplan (iSFP) erhalten Sie +5% zusätzliche KfW-Förderung. Bei €25.000 WP-Investition = +{Math.round(25000 * 0.05).toLocaleString('de-DE')} € mehr Zuschuss.</p>
          <p>Der iSFP selbst kostet €300–700 — und wird zu 80% von BAFA gefördert. Eigenanteil: ca. €60–140. Damit finanziert er sich von selbst.</p>
        </div>
      ),
    },
    // Block 3: Hersteller
    {
      title: 'Bewährte WP-Hersteller',
      icon: '🏆',
      color: 'border-wp-border bg-white',
      content: (
        <div className="space-y-1.5 text-sm">
          {[
            { n: 'Viessmann Vitocal', v: 'Testsieger Stiftung Warentest 2024/25' },
            { n: 'Vaillant aroTHERM', v: 'R290 Propan-WP, +5% KfW-Kältemittelbonus' },
            { n: 'Bosch / Buderus', v: 'Gutes Preis-Leistungs-Verhältnis' },
            { n: 'Stiebel Eltron', v: 'Deutsche Qualität, lange Garantie' },
          ].map((h, i) => (
            <div key={i} className="flex justify-between text-xs border-b border-wp-border pb-1.5">
              <span className="font-semibold text-wp-text">{h.n}</span>
              <span className="text-wp-text3">{h.v}</span>
            </div>
          ))}
          <p className="text-wp-text3 text-xs pt-1">Herstellerunabhängig — wir empfehlen das für Ihr Haus passende Gerät.</p>
        </div>
      ),
    },
    // Block 4: Bundesland
    {
      title: `${city.bundesland}-Förderung`,
      icon: '🏛️',
      color: city.bundeslandFoerderung ? 'border-wp-green3/30 bg-wp-greenlt' : 'border-wp-border bg-white',
      content: city.bundeslandFoerderung ? (
        <div className="space-y-2 text-sm text-wp-text2">
          <p><strong>{city.bundeslandFoerderung}</strong>: {city.bundeslandFoerderungBetrag}</p>
          {city.bundeslandFoerderungUrl && (
            <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer" className="text-wp-green text-xs font-semibold hover:underline">Mehr Infos ↗</a>
          )}
        </div>
      ) : (
        <p className="text-sm text-wp-text2">{city.bundesland} setzt auf KfW-Bundesprogramme. Die volle Bundesförderung (bis 70%) gilt in {city.name} uneingeschränkt.</p>
      ),
    },
    // Block 5: CO₂
    {
      title: `CO₂-Einsparung in ${city.name}`,
      icon: '🌿',
      color: 'border-wp-border bg-white',
      content: (
        <div className="space-y-2 text-sm text-wp-text2">
          <p>Ein 120 m² EFH in {city.name} spart mit einer WP ca. <strong className="text-wp-green">{Math.round(120 * 160 * 0.0002 * 10) / 10} Tonnen CO₂/Jahr</strong> gegenüber einer Gasheizung.</p>
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


  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      {/* HERO */}
      <div className="bg-wp-dark pt-20 pb-14 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-5 text-white/40 flex-wrap">
            <Link href="/" className="hover:text-white/70 transition-colors">Startseite</Link>
            <span className="text-white/25">›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white/70 transition-colors">{kw}</Link>
            <span className="text-white/25">›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>

          <h1 className="font-heading font-extrabold text-white mb-4 leading-tight" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
            {h1}
          </h1>

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
                <div className="text-wp-green3 text-xs font-semibold">{s.label}</div>
                <div className="text-white/35 text-xs">{s.sub}</div>
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
            <div className="bg-white border border-wp-border border-l-4 border-l-wp-green rounded-xl p-6 mb-8 shadow-wp-sm">
              <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
                {fillTemplate(keyword.featuredSnippetQuestions[0], city, jaz)}
              </h2>
              <p className="text-wp-text2 text-base leading-relaxed">
                {kwMainContent}
              </p>
            </div>
          )}

          {/* Keyword-spezifischer Hauptinhalt (2. Paragraph aus content-variation) */}
          <h2 className="font-heading font-bold text-wp-text mb-4" style={{ fontSize: 'clamp(22px,2.5vw,34px)' }}>
            {fillTemplate(keyword.featuredSnippetQuestions[1] ?? `${kw} in ${city.name} — was Sie wissen müssen`, city, jaz)}
          </h2>
          <div className="space-y-4 mb-8">
            <p className="text-wp-text2 text-base leading-relaxed">{introParagraphs[1]}</p>
            <p className="text-wp-text2 text-base leading-relaxed">{introParagraphs[2]}</p>
          </div>

          {/* Stadtspezifische Klimafakten */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '🌡️', label: 'Jahresmitteltemperatur', val: city.avgTemp + '°C', sub: 'Quelle: DWD' },
              { icon: '📊', label: 'Heizgradtage', val: city.heizgradtage.toLocaleString('de-DE') + ' Kd/a', sub: 'IWU GTZ20/15' },
              { icon: '⚡', label: 'Lokaler Strompreis', val: city.strompreis + ' ct/kWh', sub: 'BDEW Regional' },
            ].map((d, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-wp-border shadow-wp-sm">
                <div className="text-2xl mb-2">{d.icon}</div>
                <div className="font-mono font-bold text-wp-green text-lg leading-none mb-0.5">{d.val}</div>
                <div className="font-semibold text-wp-text text-xs mb-0.5">{d.label}</div>
                <div className="text-wp-text3 text-xs">{d.sub}</div>
              </div>
            ))}
          </div>

          {/* 2 rotierende Zusatzblöcke (city-hash basiert) */}
          <div className="space-y-4 mb-8">
            {rotatingBlocks.map((block, i) => (
              <div key={i} className={`rounded-xl border p-5 ${block.color}`}>
                <h3 className="font-heading font-semibold text-wp-text text-base mb-3 flex items-center gap-2">
                  <span>{block.icon}</span> {block.title}
                </h3>
                {block.content}
              </div>
            ))}
          </div>

          {/* Weitere Featured Snippet Fragen */}
          {keyword.featuredSnippetQuestions.slice(2).map((q, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-heading font-semibold text-wp-text text-lg mb-2">
                {fillTemplate(q, city, jaz)}
              </h3>
              <p className="text-wp-text2 text-sm leading-relaxed">
                {faqs[i + 2]?.a ?? `Erfahren Sie mehr von unseren geprüften Fachbetrieben in ${city.name}.`}
              </p>
            </div>
          ))}

          {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="mb-6 p-5 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
              <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}
          {/* FAQ */}
          <h2 className="font-heading font-bold text-wp-text mb-5 mt-10" style={{ fontSize: 'clamp(20px,2.5vw,30px)' }}>
            {h2s.faq}
          </h2>
          <div className="border border-wp-border rounded-xl overflow-hidden bg-white shadow-sm mb-8">
            {faqs.map((faq, i) => (
              <details key={i} className="group border-b border-wp-border last:border-0">
                <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-wp-bg/50 transition-colors">
                  <span className="font-heading font-semibold text-wp-text text-sm leading-snug">{faq.q}</span>
                  <ChevronDown size={16} className="text-wp-text3 shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="border-t border-wp-border">
                  <p className="px-5 py-4 text-wp-text2 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          {/* Nachbarstädte + Cross-Links */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw2 => kw2 && (
                  <Link key={kw2.slug} href={`/${kw2.slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                    {kw2.keyword.replace('[Stadt]', city.name)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Sticky */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-wp-dark rounded-2xl p-6 shadow-wp-xl">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">{ctaVariation.headline}</p>
            <p className="font-mono font-bold text-white text-4xl leading-none mb-0.5">{fmtEuro(calc.ersparnis)}</p>
            <p className="text-white/35 text-xs mb-5">jährliche Ersparnis in {city.name} vs. Erdgas</p>
            <div className="space-y-2 mb-5">
              {[
                { l: 'Heizkosten heute', v: fmtEuro(calc.altKosten) + '/J', c: 'text-wp-amber' },
                { l: 'Mit Wärmepumpe', v: fmtEuro(calc.wpKosten) + '/J', c: 'text-wp-green3' },
                { l: 'KfW-Zuschuss', v: fmtEuro(foerd.zuschuss), c: 'text-white' },
                { l: 'Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-white' },
                { l: 'Amortisation', v: calc.amortisationJahre + ' Jahre', c: 'text-wp-amber' },
              ].map(r => (
                <div key={r.l} className="flex justify-between py-1.5 border-b border-white/8">
                  <span className="text-white/45 text-xs">{r.l}</span>
                  <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                </div>
              ))}
            </div>
            <a href="/rechner"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-wp-amber text-white rounded-xl font-heading font-bold text-sm hover:bg-amber-700 transition-colors mb-2">
              Kostenloses Angebot <ArrowRight size={15} />
            </a>
            <p className="text-white/25 text-xs text-center">Kostenlos · Unverbindlich · Kein Spam</p>
          </div>

          <AuthorBox keywordSlug={keyword.slug} />

          <div className="bg-white border border-wp-border rounded-xl p-4 shadow-wp-sm">
            <p className="text-xs font-bold text-wp-text3 uppercase tracking-wider mb-3">Warum Wärmepumpenbegleiter?</p>
            {['Herstellerunabhängig', 'HWK-geprüfte Betriebe', 'KfW-Begleitung inklusive', `Lokal in ${city.name}`, '100% kostenlos'].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-wp-border last:border-0 text-xs text-wp-text2">
                <CheckCircle size={12} className="text-wp-green shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
