// components/programmatic/AdditionalContentBlocks.tsx
// 4 stadtspezifische SEO-Content-Blöcke für alle Templates
// Shared Component — einmal gebaut, überall eingebunden
'use client';
import { useState } from 'react';
import { CheckCircle, Sun, Leaf, ArrowRight, ChevronDown } from 'lucide-react';
import type { City } from '@/lib/city-utils';
import type { Keyword } from '@/lib/keywords';
import type { BerechnungsErgebnis, FoerderErgebnis } from '@/lib/calculations';

interface Props {
  city: City;
  keyword: Keyword;
  jaz: number;
  calc: BerechnungsErgebnis;
  foerd: FoerderErgebnis;
}

function fmtEuro(n: number) {
  return n.toLocaleString('de-DE') + ' €';
}

// ── 1. iSFP-Block ────────────────────────────────────────────────────────────
export function ISFPBlock({ city, foerd }: Pick<Props, 'city' | 'foerd'>) {
  const [open, setOpen] = useState(false);
  const isfpBonus = Math.round(Math.min(25000, 25000) * 0.05); // 5% auf max €25k

  return (
    <div className="bg-white rounded-2xl border border-wp-border shadow-wp-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-transparent border-none cursor-pointer hover:bg-wp-bg transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-wp-greenlt rounded-xl flex items-center justify-center shrink-0">
            <span className="text-lg">📋</span>
          </div>
          <div>
            <p className="font-heading font-bold text-wp-text text-sm">
              iSFP — Individueller Sanierungsfahrplan: +5% KfW-Bonus für {city.name}
            </p>
            <p className="text-wp-text3 text-xs">= bis zu {fmtEuro(isfpBonus)} zusätzlicher Zuschuss · 80% gefördert</p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-wp-text3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-wp-border">
          <div className="grid md:grid-cols-2 gap-6 pt-5">
            <div>
              <h3 className="font-heading font-semibold text-wp-text mb-3">Was ist der iSFP?</h3>
              <p className="text-wp-text2 text-sm leading-relaxed mb-3">
                Der Individuelle Sanierungsfahrplan (iSFP) ist ein staatlich geförderter Energieberatungsplan für Ihr Haus.
                Ein Energieberater analysiert Ihr Gebäude und erstellt einen Stufenplan zur energetischen Sanierung.
                Für Hausbesitzer in <strong>{city.name}</strong> kostet der iSFP ca. €300–700 — davon übernimmt der Staat 80% (max. €650).
              </p>
              <div className="space-y-2">
                {[
                  '+5% KfW-Bonus auf alle BEG-Maßnahmen mit iSFP',
                  'Gilt zusätzlich zu allen anderen Boni (bis 70% gesamt)',
                  `Erspart in ${city.name}: +${fmtEuro(isfpBonus)} bei €25.000 Investition`,
                  '80% gefördert über BAFA (Bundesamt für Wirtschaft)',
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={14} className="text-wp-green shrink-0 mt-0.5" />
                    <span className="text-wp-text2">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-wp-text mb-3">iSFP in {city.name} beantragen</h3>
              <div className="space-y-3">
                {[
                  { n: '1', t: 'Energieberater finden', d: 'BAFA-zugelassenen Berater über die Energieeffizienz-Experten-Liste (dena) suchen.' },
                  { n: '2', t: 'iSFP erstellen lassen', d: `Vor-Ort-Begehung in ${city.name}, Analyse und Stufenplan. Kosten: €300–700 brutto.` },
                  { n: '3', t: 'BAFA-Förderantrag stellen', d: '80% der Beratungskosten erstattet (max. €650) — vor der Beauftragung des Beraters.' },
                  { n: '4', t: 'iSFP bei KfW einreichen', d: '+5% Bonus gilt für alle Maßnahmen die im iSFP empfohlen werden, inkl. Wärmepumpe.' },
                ].map(s => (
                  <div key={s.n} className="flex gap-3">
                    <div className="w-6 h-6 bg-wp-green rounded-full flex items-center justify-center shrink-0 font-bold text-white text-xs">{s.n}</div>
                    <div>
                      <p className="font-semibold text-wp-text text-xs mb-0.5">{s.t}</p>
                      <p className="text-wp-text3 text-xs leading-relaxed">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="https://www.bafa.de/DE/Energie/Energieberatung/Bundesfoerderung_Energieberatung_Wohngebaeude/bundesfoerderung_energieberatung_wohngebaeude_node.html"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-wp-green text-xs font-semibold hover:underline">
                Mehr Infos: BAFA Energieberatung ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 2. WP + PV Kombinations-Block ────────────────────────────────────────────
export function PVKombiBlock({ city, jaz, calc }: Pick<Props, 'city' | 'jaz' | 'calc'>) {
  const pvProduktion = Math.round(city.avgSunHours * 8 * 0.85); // 8 kWp Anlage
  const eigenverbrauch = Math.round(pvProduktion * 0.65);
  const wpStromBedarf = Math.round(120 * 160 / jaz); // kWh/Jahr
  const pvFuerWP = Math.min(eigenverbrauch, wpStromBedarf);
  const pvErsparnis = Math.round(pvFuerWP * (city.strompreis / 100));
  const pvKosten = Math.round(8 * 1200); // €/kWp Richtwert 2026
  const pvAmort = Math.round(pvKosten / (pvErsparnis + Math.round(pvProduktion * 0.35 * 0.0778)));

  return (
    <div className="bg-gradient-to-br from-wp-greenlt to-amber-50 rounded-2xl border border-wp-green3/30 p-6 shadow-wp-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-wp-green rounded-xl flex items-center justify-center shrink-0">
          <Sun size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-wp-text text-base">
            Wärmepumpe + PV in {city.name} — die optimale Kombination
          </h3>
          <p className="text-wp-text3 text-xs">{city.avgSunHours} Sonnenstunden/Jahr · 8 kWp Beispielanlage</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        {[
          { icon: '⚡', label: 'PV-Jahresertrag', val: `${pvProduktion.toLocaleString('de-DE')} kWh`, sub: '8 kWp · 0,85 Performance' },
          { icon: '🔄', label: 'Direkt für WP genutzt', val: `${pvFuerWP.toLocaleString('de-DE')} kWh`, sub: `von ${wpStromBedarf.toLocaleString('de-DE')} kWh WP-Bedarf` },
          { icon: '💶', label: 'Zusatzersparnis/Jahr', val: fmtEuro(pvErsparnis), sub: `bei ${city.strompreis} ct/kWh` },
        ].map((d, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-wp-border shadow-wp-sm text-center">
            <div className="text-xl mb-1">{d.icon}</div>
            <div className="font-mono font-bold text-wp-green text-lg leading-none mb-0.5">{d.val}</div>
            <div className="font-semibold text-wp-text text-xs mb-0.5">{d.label}</div>
            <div className="text-wp-text3 text-xs">{d.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 border border-wp-border">
        <p className="font-heading font-semibold text-wp-text text-sm mb-2">
          Warum WP + PV in {city.name} besonders gut funktioniert:
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            `${city.avgSunHours} Sonnenstunden/Jahr — ${city.avgSunHours >= 1700 ? 'überdurchschnittlich gut' : city.avgSunHours >= 1600 ? 'solider Durchschnitt' : 'ausreichend für wirtschaftliche Anlage'}`,
            `WP-Stromverbrauch tagsüber intelligent steuern (Smart Grid)`,
            `PV senkt effektive WP-Kosten auf unter 10 ct/kWh`,
            `Amortisation PV-Anlage: ca. ${pvAmort} Jahre (allein), früher mit WP-Synergie`,
            `KfW 270 finanziert WP + PV als Kombi-Paket zinsgünstig`,
            `${city.avgSunHours} h × JAZ ${jaz} = maximale Energieunabhängigkeit`,
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-wp-text2">
              <CheckCircle size={12} className="text-wp-green shrink-0 mt-0.5" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 3. GEG-Checkliste (stadtspezifisch) ──────────────────────────────────────
export function GEGChecklistBlock({ city }: Pick<Props, 'city'>) {
  const fristDate = city.gegFrist.split('-').reverse().join('.');
  const isUrgent = city.einwohner >= 100000;

  const checklist = [
    {
      done: false,
      title: 'Aktuelle Heizung prüfen',
      text: `Ist Ihre Heizung älter als 15 Jahre? Ab 30 Jahren Nutzungszeit endet die Betriebserlaubnis in ${city.name}.`,
      tag: isUrgent ? 'Jetzt prüfen' : 'Empfohlen',
    },
    {
      done: false,
      title: 'GEG-Frist für Ihre Stadt kennen',
      text: `In ${city.name} gilt die 65%-EE-Pflicht für Bestandsgebäude ab dem ${fristDate}. ${isUrgent ? 'Handeln Sie jetzt — die Frist naht!' : 'Sie haben noch Zeit, aber gute Betriebe sind schnell ausgebucht.'}`,
      tag: isUrgent ? '⚠️ Frist naht' : 'Info',
    },
    {
      done: false,
      title: 'KfW-Antrag VOR Baubeginn stellen',
      text: 'Zwingend erforderlich: Kein Antrag = keine Förderung. Der Antrag muss vor dem ersten Spatenstich eingereicht sein.',
      tag: 'Pflicht',
    },
    {
      done: false,
      title: 'Registrierten Fachbetrieb beauftragen',
      text: `Nur KfW-registrierte LuL-Betriebe können den Förderantrag stellen. Alle unsere Partner in ${city.name} erfüllen das.`,
      tag: 'Pflicht',
    },
    {
      done: false,
      title: 'Kommunalen Wärmeplan prüfen',
      text: `${isUrgent ? `${city.name} als Großstadt muss bis 30. Juni 2026 einen kommunalen Wärmeplan vorlegen. Prüfen Sie ob Fernwärmeausbau in Ihrer Straße geplant ist.` : `${city.name} muss bis 2028 einen Wärmeplan vorstellen. Informieren Sie sich bei der Stadtverwaltung.`}`,
      tag: 'Empfohlen',
    },
    {
      done: false,
      title: 'Isnallation planen & Förderung sichern',
      text: `Nach der Bewilligung haben Sie 24 Monate Zeit für die Installation in ${city.name}. Planen Sie genug Puffer für Lieferzeiten.`,
      tag: 'Info',
    },
  ];

  const tagColors: Record<string, string> = {
    '⚠️ Frist naht': 'bg-amber-100 text-amber-800',
    'Pflicht': 'bg-red-100 text-red-700',
    'Jetzt prüfen': 'bg-wp-greenlt text-wp-green',
    'Empfohlen': 'bg-blue-50 text-blue-700',
    'Info': 'bg-wp-bg text-wp-text3',
  };

  return (
    <div className="bg-white rounded-2xl border border-wp-border shadow-wp-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-heading font-bold text-wp-text text-base">
            GEG-Checkliste für {city.name}
          </h3>
          <p className="text-wp-text3 text-xs">
            65%-EE-Pflicht ab {fristDate} · {isUrgent ? '⚠️ Großstadt — erhöhte Dringlichkeit' : 'Frühzeitig planen lohnt sich'}
          </p>
        </div>
        {isUrgent && (
          <div className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
            Frist: {fristDate}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {checklist.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-wp-border hover:bg-wp-bg transition-colors">
            <div className="w-5 h-5 rounded border-2 border-wp-border shrink-0 mt-0.5 flex items-center justify-center">
              <span className="text-wp-text3 text-xs">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-semibold text-wp-text text-sm">{item.title}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagColors[item.tag] ?? 'bg-wp-bg text-wp-text3'}`}>
                  {item.tag}
                </span>
              </div>
              <p className="text-wp-text2 text-xs leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-wp-border flex items-center justify-between">
        <p className="text-wp-text3 text-xs">
          Quellen: GEG 2024 · Kommunale Wärmeplanung MWG · KfW BEG Stand März 2026
        </p>
        <a href={`https://www.gesetze-im-internet.de/geg/`} target="_blank" rel="noopener noreferrer"
          className="text-wp-green text-xs font-semibold hover:underline shrink-0">
          GEG Volltext ↗
        </a>
      </div>
    </div>
  );
}

// ── 4. Hersteller-Vergleich ───────────────────────────────────────────────────
export function HerstellerVergleichBlock({ city, jaz }: Pick<Props, 'city' | 'jaz'>) {
  const hersteller = [
    {
      name: 'Viessmann Vitocal',
      logo: '🟦',
      cop: `A7/W35: ${(jaz * 1.1).toFixed(1)} COP`,
      preis: '€11.000–18.000',
      besonderheit: 'Testsieger Stiftung Warentest 2024/25',
      vorlauf: 'bis 65°C',
      r290: true,
      highlight: true,
    },
    {
      name: 'Vaillant aroTHERM',
      logo: '🟩',
      cop: `A7/W35: ${(jaz * 1.05).toFixed(1)} COP`,
      preis: '€10.000–17.000',
      besonderheit: 'R290 Propan-WP, +5% KfW-Bonus',
      vorlauf: 'bis 65°C',
      r290: true,
      highlight: false,
    },
    {
      name: 'Bosch / Buderus',
      logo: '🔴',
      cop: `A7/W35: ${(jaz).toFixed(1)} COP`,
      preis: '€9.000–15.000',
      besonderheit: 'Gutes Preis-Leistungs-Verhältnis',
      vorlauf: 'bis 60°C',
      r290: false,
      highlight: false,
    },
    {
      name: 'Stiebel Eltron WPL',
      logo: '🟧',
      cop: `A7/W35: ${(jaz * 1.08).toFixed(1)} COP`,
      preis: '€10.000–16.000',
      besonderheit: 'Deutsche Qualität, lange Garantie',
      vorlauf: 'bis 65°C',
      r290: false,
      highlight: false,
    },
    {
      name: 'Nibe Fighter',
      logo: '⬜',
      cop: `A7/W35: ${(jaz * 1.06).toFixed(1)} COP`,
      preis: '€9.000–15.000',
      besonderheit: 'Schwedische Qualität, sehr leise',
      vorlauf: 'bis 63°C',
      r290: false,
      highlight: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-wp-border shadow-wp-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-wp-border">
        <h3 className="font-heading font-bold text-wp-text text-base">
          Wärmepumpen-Hersteller Vergleich — {city.name} {new Date().getFullYear()}
        </h3>
        <p className="text-wp-text3 text-xs mt-1">
          Richtwerte bei {city.avgTemp}°C Jahresmitteltemperatur · A7/W35 Prüfbedingungen
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-wp-bg border-b border-wp-border">
              {['Hersteller', 'COP (A7/W35)', 'Gerätepreis', 'Max. Vorlauf', 'R290 (+5% KfW)', 'Besonderheit'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hersteller.map((h, i) => (
              <tr key={i} className={`border-b border-wp-border last:border-0 ${h.highlight ? 'bg-wp-greenxlt' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{h.logo}</span>
                    <span className={`font-semibold text-sm ${h.highlight ? 'text-wp-green' : 'text-wp-text'}`}>{h.name}</span>
                    {h.highlight && <span className="bg-wp-green text-white text-xs font-bold px-1.5 py-0.5 rounded">Top</span>}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-wp-text2 text-xs">{h.cop}</td>
                <td className="px-4 py-3 font-mono text-wp-amber text-xs">{h.preis}</td>
                <td className="px-4 py-3 text-wp-text2 text-xs">{h.vorlauf}</td>
                <td className="px-4 py-3 text-center">
                  {h.r290 ? <span className="text-wp-green font-bold">✅ +5%</span> : <span className="text-wp-text3">—</span>}
                </td>
                <td className="px-4 py-3 text-wp-text2 text-xs">{h.besonderheit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-wp-bg border-t border-wp-border">
        <p className="text-wp-text3 text-xs">
          ⚠️ Herstellerunabhängige Einschätzung · Gerätepreise netto ohne Montage · Entscheidend ist die fachgerechte Installation durch einen zertifizierten Betrieb in {city.name}.
        </p>
      </div>
    </div>
  );
}

// ── Master-Export: alle 4 Blöcke ─────────────────────────────────────────────
export function AdditionalContentBlocks({ city, keyword, jaz, calc, foerd }: Props) {
  return (
    <div className="space-y-6">
      <ISFPBlock city={city} foerd={foerd} />
      <PVKombiBlock city={city} jaz={jaz} calc={calc} />
      <GEGChecklistBlock city={city} />
      <HerstellerVergleichBlock city={city} jaz={jaz} />
    </div>
  );
}
