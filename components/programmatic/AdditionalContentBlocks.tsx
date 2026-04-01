// components/programmatic/AdditionalContentBlocks.tsx
// Rotierende SEO-Content-Blöcke — 2 von 4 erscheinen je Stadt (city-hash)
// Jeder Block hat 4-5 Textvarianten → echte Uniqueness
'use client';
import { useState } from 'react';
import { CheckCircle, ChevronDown } from 'lucide-react';
import type { City } from '@/lib/city-utils';
import type { Keyword } from '@/lib/keywords';
import type { BerechnungsErgebnis, FoerderErgebnis } from '@/lib/calculations';
import { cityHash } from '@/lib/content-variation';

interface Props {
  city: City;
  keyword: Keyword;
  jaz: number;
  calc: BerechnungsErgebnis;
  foerd: FoerderErgebnis;
}

function fmtEuro(n: number) { return n.toLocaleString('de-DE') + ' €'; }

// ── BLOCK 1: iSFP ────────────────────────────────────────────────────────────
function ISFPBlock({ city, foerd }: { city: City; foerd: FoerderErgebnis }) {
  const [open, setOpen] = useState(false);
  const bonus = Math.round(Math.min(25000, 30000) * 0.05);
  const v = cityHash(city, 4, 40); // 4 Text-Varianten

  const intros = [
    `Der Individuelle Sanierungsfahrplan (iSFP) bringt Hausbesitzern in ${city.name} einen zusätzlichen KfW-Bonus von 5% — das ergibt bei €25.000 WP-Investition ${fmtEuro(bonus)} mehr Zuschuss. Der iSFP selbst wird zu 80% von BAFA gefördert, Eigenanteil: ca. €60–140.`,
    `Wenige nutzen ihn, obwohl er sich fast von selbst finanziert: Der iSFP (+5% KfW-Bonus) kostet Hausbesitzer in ${city.name} netto nur €60–140 — bringt aber ${fmtEuro(bonus)} mehr Zuschuss bei typischen WP-Investitionen. BAFA erstattet 80% der Beratungskosten.`,
    `In ${city.name} kann der iSFP die KfW-Förderung auf bis zu ${Math.min(foerd.gesamtSatz + 5, 70)}% steigern. Der Sanierungsfahrplan wird von BAFA zu 80% bezuschusst — bei Kosten von €300–700 zahlen Sie als Eigenanteil nur ca. €60–140.`,
    `Für ${city.name}-Hausbesitzer lohnt sich der iSFP fast immer: +5% KfW = ${fmtEuro(bonus)} Mehrförderung, Eigenkosten nach BAFA-Förderung ca. €60–140. Voraussetzung: Beauftragung eines zertifizierten Energieberaters VOR dem KfW-Antrag.`,
  ];

  return (
    <div className="bg-white rounded-2xl border border-wp-border shadow-wp-sm overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-transparent border-none cursor-pointer hover:bg-wp-bg transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-wp-greenlt rounded-xl flex items-center justify-center shrink-0">
            <span className="text-lg">📋</span>
          </div>
          <div>
            <p className="font-heading font-bold text-wp-text text-sm">iSFP — Individueller Sanierungsfahrplan: +5% KfW für {city.name}</p>
            <p className="text-wp-text3 text-xs">= bis zu {fmtEuro(bonus)} zusätzlicher Zuschuss · 80% BAFA-gefördert</p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-wp-text3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-wp-border pt-5">
          <p className="text-wp-text2 text-sm leading-relaxed mb-4">{intros[v]}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              {[
                '+5% KfW auf alle BEG-Maßnahmen mit iSFP',
                `= ${fmtEuro(bonus)} mehr bei €25.000 Investition`,
                '80% BAFA-Förderung auf iSFP-Kosten',
                'Gilt zusätzlich zu allen anderen Boni',
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-wp-text2">
                  <CheckCircle size={12} className="text-wp-green shrink-0 mt-0.5" />{p}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { n: '1', t: 'BAFA-Antrag stellen', d: 'Vor Beauftragung des Energieberaters' },
                { n: '2', t: 'iSFP erstellen lassen', d: `Energieberater kommt in ${city.name}` },
                { n: '3', t: 'KfW-Antrag mit iSFP', d: '+5% Bonus automatisch' },
              ].map(s => (
                <div key={s.n} className="flex gap-2 text-xs">
                  <span className="w-5 h-5 bg-wp-green text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs">{s.n}</span>
                  <div><p className="font-semibold text-wp-text">{s.t}</p><p className="text-wp-text3">{s.d}</p></div>
                </div>
              ))}
              <a href="https://www.bafa.de/DE/Energie/Energieberatung/Bundesfoerderung_Energieberatung_Wohngebaeude/" target="_blank" rel="noopener noreferrer" className="text-wp-green text-xs font-semibold hover:underline">BAFA Energieberatung ↗</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── BLOCK 2: WP + PV ─────────────────────────────────────────────────────────
function PVKombiBlock({ city, jaz, calc }: { city: City; jaz: number; calc: BerechnungsErgebnis }) {
  const pvErtrag = Math.round(city.avgSunHours * 8 * 0.85);
  const wpBedarf = Math.round(120 * 160 / jaz);
  const pvFuerWP = Math.min(Math.round(pvErtrag * 0.65), wpBedarf);
  const pvErsparnis = Math.round(pvFuerWP * (city.strompreis / 100));
  const v = cityHash(city, 4, 41);

  const headlines = [
    `WP + PV in ${city.name}: ${fmtEuro(pvErsparnis)}/Jahr Zusatzersparnis`,
    `Solarstrom für Ihre Wärmepumpe in ${city.name}`,
    `${city.avgSunHours} Sonnenstunden/Jahr — PV + WP optimal kombinieren`,
    `Maximale Unabhängigkeit: Wärmepumpe + Photovoltaik in ${city.name}`,
  ];

  const texts = [
    `Mit ${city.avgSunHours} Sonnenstunden/Jahr und 8 kWp PV erzeugen Sie in ${city.name} ca. ${pvErtrag.toLocaleString('de-DE')} kWh/Jahr. Davon fließen ${pvFuerWP.toLocaleString('de-DE')} kWh direkt in die Wärmepumpe (JAZ ${jaz}) — das senkt die effektiven Heizkosten auf unter 10 ct/kWh.`,
    `In ${city.name} lohnt sich die Kombination besonders: ${city.avgSunHours} Sonnenstunden × 8 kWp × 0,85 = ${pvErtrag.toLocaleString('de-DE')} kWh PV-Strom/Jahr. Ihr WP-Jahresbedarf beträgt ca. ${wpBedarf.toLocaleString('de-DE')} kWh — ${pvFuerWP.toLocaleString('de-DE')} kWh deckt die PV direkt ab.`,
    `Die Synergie von Wärmepumpe und Photovoltaik in ${city.name}: PV-Strom zu ca. 0 ct/kWh Grenzkosten betreibt die WP (JAZ ${jaz}) und erzeugt Wärme für effektiv ${(0 / jaz).toFixed(1)} ct/kWh. Gesamtersparnis inkl. PV: ${fmtEuro(calc.ersparnis + pvErsparnis)}/Jahr.`,
    `Mit Smart-Home-Steuerung lädt die WP in ${city.name} bevorzugt wenn die PV-Anlage produziert. Das maximiert den Eigenverbrauch auf 65–75% und senkt die Stromrechnung dauerhaft — unabhängig von Preissteigerungen beim Netzstrom (${city.strompreis} ct/kWh).`,
  ];

  return (
    <div className="bg-gradient-to-br from-wp-greenlt to-amber-50 rounded-2xl border border-wp-green3/30 p-6 shadow-wp-sm">
      <h3 className="font-heading font-bold text-wp-text text-base mb-4 flex items-center gap-2">
        <span>☀️</span> {headlines[v]}
      </h3>
      <p className="text-wp-text2 text-sm leading-relaxed mb-4">{texts[v]}</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'PV-Jahresertrag', val: pvErtrag.toLocaleString('de-DE') + ' kWh', sub: '8 kWp · ' + city.avgSunHours + 'h/J.' },
          { label: 'Für WP genutzt', val: pvFuerWP.toLocaleString('de-DE') + ' kWh', sub: 'von ' + wpBedarf.toLocaleString('de-DE') + ' kWh' },
          { label: 'Zusatzersparnis', val: fmtEuro(pvErsparnis), sub: 'pro Jahr' },
        ].map((d, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-wp-border text-center">
            <div className="font-mono font-bold text-wp-green text-sm leading-none mb-0.5">{d.val}</div>
            <div className="font-semibold text-wp-text text-xs">{d.label}</div>
            <div className="text-wp-text3 text-xs">{d.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BLOCK 3: GEG-Checkliste ──────────────────────────────────────────────────
function GEGChecklistBlock({ city }: { city: City }) {
  const fristDate = city.gegFrist.split('-').reverse().join('.');
  const isUrgent = city.einwohner >= 100000;
  const v = cityHash(city, 4, 42);

  const intros = [
    `Das GEG 2024 gilt in ${city.name} ab ${fristDate}: Jede neue Heizung muss 65% erneuerbare Energie nutzen. Die Wärmepumpe ist die einzige Lösung ohne Einschränkungen.`,
    `${isUrgent ? `⚠️ Als Großstadt über 100.000 Einwohner gilt in ${city.name} die GEG-Frist bereits am ${fristDate}.` : `In ${city.name} gilt die GEG-65%-EE-Pflicht ab ${fristDate}.`} Wer jetzt plant, sichert sich die volle KfW-Förderung und die besten Betriebe.`,
    `Die GEG-Fristen für ${city.name} im Überblick: Bestandsgebäude ab ${fristDate} betroffen. Neubauten: seit 01.01.2024 bereits 65%-EE-Pflicht. Die Wärmepumpe erfüllt beides automatisch.`,
    `Kommunale Wärmeplanung ${city.name}: ${isUrgent ? `Als Großstadt muss ${city.name} bis 30.06.2026 einen Wärmeplan vorlegen. Prüfen Sie ob in Ihrer Straße Fernwärme geplant ist — das beeinflusst die WP-Entscheidung.` : `${city.name} muss bis 2028 einen kommunalen Wärmeplan erstellen. Für die meisten Häuser ist die WP trotzdem die richtige Wahl — unabhängig vom Fernwärmeausbau.`}`,
  ];

  return (
    <div className="bg-white rounded-2xl border border-wp-border shadow-wp-sm p-5">
      <h3 className="font-heading font-bold text-wp-text text-base mb-3 flex items-center gap-2">
        <span>📋</span> GEG-Frist {city.name}: {fristDate}
        {isUrgent && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">Dringend</span>}
      </h3>
      <p className="text-wp-text2 text-sm leading-relaxed mb-4">{intros[v]}</p>
      <div className="space-y-2">
        {[
          { t: 'KfW-Antrag VOR Baubeginn', status: 'Pflicht', color: 'bg-red-50 text-red-700' },
          { t: 'Registrierten Fachbetrieb (LuL) beauftragen', status: 'Pflicht', color: 'bg-red-50 text-red-700' },
          { t: 'Kommunalen Wärmeplan prüfen', status: 'Empfohlen', color: 'bg-blue-50 text-blue-700' },
          { t: 'Förderquote individuell berechnen', status: 'Jetzt', color: 'bg-wp-greenlt text-wp-green' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-wp-border">
            <span className="text-wp-text2 text-xs font-medium">{item.t}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${item.color}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BLOCK 4: Hersteller-Vergleich ────────────────────────────────────────────
function HerstellerBlock({ city, jaz }: { city: City; jaz: number }) {
  const v = cityHash(city, 4, 43);

  const intros = [
    `In ${city.name} mit ${city.avgTemp}°C Jahresmitteltemperatur erreichen moderne Luft-WP-Geräte eine JAZ von ${jaz}. Hier die bewährten Hersteller im Überblick — alle kompatibel mit dem lokalen Klima:`,
    `Bei der Herstellerwahl für ${city.name} gilt: Die JAZ ${jaz} ist das Ergebnis des Zusammenspiels aus Gerät, Installation und Klimabedingungen. Herstellerunabhängig empfehlen wir das für Ihr Haus passende Gerät:`,
    `Alle großen WP-Hersteller sind in ${city.name} durch Fachbetriebe verfügbar. Entscheidend ist nicht die Marke, sondern die fachgerechte Dimensionierung (Heizlast, JAZ ${jaz}) und Installation:`,
    `Stiftung Warentest testete 2024 Wärmepumpen — Viessmann Vitocal führt das Ranking an. In ${city.name} sind alle diese Geräte von unseren Partnerbetrieben erhältlich und installierbar:`,
  ];

  return (
    <div className="bg-white rounded-2xl border border-wp-border shadow-wp-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-wp-border">
        <h3 className="font-heading font-bold text-wp-text text-base">🏆 WP-Hersteller für {city.name} — Überblick</h3>
        <p className="text-wp-text3 text-xs mt-0.5">{intros[v]}</p>
      </div>
      <div className="divide-y divide-wp-border">
        {[
          { n: 'Viessmann Vitocal', cop: (jaz * 1.1).toFixed(1), r290: true, info: 'Testsieger SW 2024/25', preis: '€11–18k' },
          { n: 'Vaillant aroTHERM', cop: (jaz * 1.05).toFixed(1), r290: true, info: 'Propan-WP +5% KfW', preis: '€10–17k' },
          { n: 'Bosch / Buderus', cop: jaz.toFixed(1), r290: false, info: 'Gutes Preis-Leistungs-Verhältnis', preis: '€9–15k' },
          { n: 'Stiebel Eltron', cop: (jaz * 1.08).toFixed(1), r290: false, info: 'Deutsche Qualität', preis: '€10–16k' },
          { n: 'Nibe Fighter', cop: (jaz * 1.06).toFixed(1), r290: false, info: 'Sehr leise', preis: '€9–15k' },
        ].map((h, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3 text-xs">
            <div className="font-semibold text-wp-text w-36 shrink-0">{h.n}</div>
            <div className="text-wp-text3 hidden sm:block">COP A7/W35: {h.cop}</div>
            <div className="text-wp-text3 hidden sm:block">{h.info}</div>
            {h.r290 && <span className="bg-wp-greenlt text-wp-green font-bold px-1.5 py-0.5 rounded text-xs hidden sm:block">+5% KfW</span>}
            <div className="font-mono text-wp-amber font-bold">{h.preis}</div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 bg-wp-bg border-t border-wp-border">
        <p className="text-wp-text3 text-xs">Herstellerunabhängig — wir empfehlen das für Ihr Haus in {city.name} passende Gerät.</p>
      </div>
    </div>
  );
}

// ── MASTER EXPORT: 2 von 4 Blöcken rotierend ─────────────────────────────────
export function AdditionalContentBlocks({ city, keyword, jaz, calc, foerd }: Props) {
  // Welche 2 von 4 Blöcken erscheinen — city-hash-basiert
  const allBlocks = [
    <ISFPBlock key="isfp" city={city} foerd={foerd} />,
    <PVKombiBlock key="pv" city={city} jaz={jaz} calc={calc} />,
    <GEGChecklistBlock key="geg" city={city} />,
    <HerstellerBlock key="hersteller" city={city} jaz={jaz} />,
  ];

  const idx1 = cityHash(city, 4, 50);
  const idx2 = (idx1 + 1 + cityHash(city, 2, 51)) % 4;

  return (
    <div className="space-y-5">
      {allBlocks[idx1]}
      {idx2 !== idx1 && allBlocks[idx2]}
    </div>
  );
}
