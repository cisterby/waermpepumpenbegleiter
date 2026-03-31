// components/programmatic/templates/MontageTemplate.tsx
// waermepumpe-montage — Ablauf, Kosten, was passiert an welchem Tag, stadtspezifisch
'use client';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { cityHash } from '@/lib/content-variation';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import RichTemplateBase from '@/components/programmatic/RichTemplateBase';

export default function MontageTemplate({ city, keyword, calc, foerd, jaz, nearby, h1, allCities }: CityPageRouterProps) {
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const v = cityHash(city, 4, 66);
  const isLargeCity = city.einwohner >= 500000;

  // Schallschutz nach Stadtgröße
  const schallschutzNote = isLargeCity
    ? `In ${city.name} mit dichter Bebauung ist die Außeneinheit sorgfältig zu platzieren. Mindestabstand zur Grundstücksgrenze: 3m (ggf. mehr je nach Bebauungsplan). Neue KfW-Lärmregel 2026: WP muss 10 dB unter EU-Grenzwert liegen.`
    : `In ${city.name} sind Schallschutzprobleme weniger häufig als in Großstädten. Trotzdem: Abstand zur Grundstücksgrenze und zu Fenstern des Nachbarn beachten. KfW 2026: 10 dB unter EU-Grenzwert Pflicht.`;

  const intros = [
    `Die Wärmepumpen-Montage in ${city.name} dauert typisch 1–3 Tage — von der Anlieferung der Außeneinheit bis zur ersten Warmwasserbereitung. Der gesamte Prozess von Anfrage bis fertiger Anlage beträgt 6–12 Wochen. KfW-Antrag muss zwingend vor dem ersten Baubeginn gestellt sein.`,
    `Was passiert bei der WP-Montage in ${city.name}? Tag 1: Fundament, Kernbohrung, Außeneinheit aufstellen. Tag 1–2: Hydraulik-Anbindung, Rohrleitungen. Tag 2–3: Elektroinstallation, Wärmemengenzähler, Inbetriebnahme, hydraulischer Abgleich, Einweisung. Total: 1–3 Tage für ${fmtEuro(foerd.zuschuss)} KfW-Förderung.`,
    `Montagekosten in ${city.name}: Die Installation einer Luft-Wasser-WP kostet typisch €4.000–€8.000 für Montage und Installation — ohne Gerät. Hydraulischer Abgleich (KfW-Pflicht): €500–1.500. Elektroinstallation: €500–1.500. KfW-Förderung ${foerd.gesamtSatz}% gilt für alle förderfähigen Positionen.`,
    `Für die Montage in ${city.name} gilt: Hydraulischer Abgleich und Wärmemengenzähler sind seit 2024 KfW-Pflicht. Ohne beides: keine Förderung. Unser Partnerbetrieb in ${city.name} führt beides standardmäßig aus — inklusive im Angebot.`,
  ];

  const heroStats = [
    { val: '1–3 Tage', label: 'Montagezeit', sub: 'Luft-WP in ' + city.name },
    { val: fmtEuro(foerd.zuschuss), label: 'KfW-Zuschuss', sub: 'nach Montage & Nachweis' },
    { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'nach Förderung' },
    { val: `${foerd.gesamtSatz}%`, label: 'KfW-Förderung', sub: 'Eigennutzer ' + city.name },
  ];

  const sections = (
    <>
      <div className="bg-white border border-wp-border border-l-4 border-l-wp-green rounded-xl p-6 shadow-wp-sm">
        <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
          {fillTemplate('Wie läuft die Wärmepumpen-Montage in {stadt} ab?', city, jaz)}
        </h2>
        <p className="text-wp-text2 text-base leading-relaxed">{intros[v]}</p>
      </div>

      {/* Montage-Tagesablauf */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
          Montage-Ablauf in {city.name} — Tag für Tag
        </h2>
        <div className="space-y-3">
          {[
            { tag: 'Tag 1', title: 'Außeneinheit & Fundament', items: ['Fundament/Betonsockel für Außeneinheit', 'Kernbohrung durch Außenwand für Kältemittelleitung', 'Außeneinheit aufstellen und verankern', 'Kältemittelleitung verlegen & anschließen'], color: 'text-wp-green3' },
            { tag: 'Tag 1–2', title: 'Hydraulik & Heizkreis', items: ['Inneneinheit / Wärmepumpe aufstellen (Keller/HWR)', 'Anbindung an Heizkreis (Vor- und Rücklauf)', 'Pufferspeicher und/oder Warmwasserspeicher', 'Hydraulischer Abgleich nach Verfahren B (KfW-Pflicht)'], color: 'text-wp-amber' },
            { tag: 'Tag 2–3', title: 'Elektrik, Steuerung & Inbetriebnahme', items: ['Elektroanschluss WP-Einheit (Starkstrom)', 'Wärmemengenzähler einbauen (KfW-Pflicht 2026)', 'Regelung und Smart-Home-Schnittstelle', 'Erstbefüllung Kältemittel, Druckprüfung', 'Einregulierung und Testlauf', 'Einweisung Hausbesitzer'], color: 'text-wp-green' },
          ].map((day, i) => (
            <div key={i} className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-wp-border bg-wp-bg">
                <span className="bg-wp-dark text-wp-green3 text-xs font-bold px-3 py-1 rounded-full">{day.tag}</span>
                <p className="font-heading font-semibold text-wp-text">{day.title}</p>
              </div>
              <div className="p-4 grid sm:grid-cols-2 gap-2">
                {day.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-wp-text2">
                    <CheckCircle size={11} className="text-wp-green shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bild + Kosten */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden h-60">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80"
            alt={`WP Montage ${city.name}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-wp-dark/60 flex items-end p-5">
            <div>
              <p className="font-heading font-bold text-white text-base">1–3 Tage Montage in {city.name}</p>
              <p className="text-white/60 text-xs">Inkl. hydraulischer Abgleich · Wärmemengenzähler · Einregulierung</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-heading font-bold text-wp-text text-lg mb-3">Montagekosten in {city.name}</h3>
          <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
            <table className="w-full">
              <tbody>
                {[
                  ['Außeneinheit aufstellen', '€800–€1.500'],
                  ['Hydraulik-Anbindung', '€1.500–€3.500'],
                  ['Hydraulischer Abgleich', '€500–€1.500'],
                  ['Elektroinstallation', '€500–€1.500'],
                  ['Wärmemengenzähler', '€200–€500'],
                  ['Montage gesamt', '€3.500–€8.500'],
                  ['KfW-förderfähig', 'Ja — alle Positionen'],
                ].map(([pos, kosten], i) => (
                  <tr key={i} className={i === 5 ? 'bg-wp-dark' : i === 6 ? 'bg-wp-greenlt' : i % 2 === 0 ? 'bg-white' : 'bg-wp-bg/40'}>
                    <td className={`px-4 py-2.5 text-xs border-b border-wp-border ${i === 5 ? 'font-bold text-white' : i === 6 ? 'text-wp-green font-semibold' : 'text-wp-text2'}`}>{pos}</td>
                    <td className={`px-4 py-2.5 text-xs font-mono text-right border-b border-wp-border ${i === 5 ? 'font-bold text-wp-amber' : i === 6 ? 'text-wp-green' : 'text-wp-text'}`}>{kosten}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Schallschutz */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
          Schallschutz bei der Montage in {city.name} 2026
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="font-semibold text-amber-900 text-sm mb-2">Neue KfW-Lärmregel ab 01.01.2026</h3>
            <p className="text-amber-800 text-xs leading-relaxed mb-3">{schallschutzNote}</p>
            <div className="space-y-1">
              {['Viessmann Vitocal 250-A: ✓ förderfähig', 'Vaillant aroTHERM plus: ✓ förderfähig', 'Buderus Logatherm: ✓ 28,5 dB', 'Standard SHK-Betriebe prüfen das nicht immer'].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-amber-800">
                  {i === 3 ? <AlertTriangle size={10} /> : <CheckCircle size={10} />}{t}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-wp-border rounded-xl p-5 shadow-wp-sm">
            <h3 className="font-semibold text-wp-text text-sm mb-2">KfW-Pflicht 2026 bei Montage</h3>
            <div className="space-y-2">
              {[
                { item: 'Heizlastberechnung DIN EN 12831', new2026: false },
                { item: 'Hydraulischer Abgleich Verfahren B', new2026: false },
                { item: 'Wärmemengenzähler (neu 2024)', new2026: true },
                { item: 'JAZ-Mindestanforderung 3,0', new2026: false },
                { item: 'Lärmschutz 10 dB unter EU-Grenzwert', new2026: true },
              ].map(({ item, new2026 }, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-wp-border last:border-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={12} className="text-wp-green shrink-0" />
                    <span className="text-xs text-wp-text2">{item}</span>
                  </div>
                  {new2026 && <span className="bg-wp-amberlt text-wp-amber text-xs font-bold px-2 py-0.5 rounded-full">Neu 2026</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80"
          alt={`WP Montage ${city.name} KfW`} className="w-full h-48 object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,25,16,0.93) 0%, rgba(10,25,16,0.4) 100%)' }} />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <p className="font-heading font-extrabold text-white text-xl mb-2">Nach der Montage: {fmtEuro(foerd.zuschuss)} KfW</p>
            <p className="text-white/70 text-sm">Verwendungsnachweis einreichen → 4–8 Wochen → Auszahlung direkt auf Ihr Konto</p>
            <p className="font-bold text-wp-amber text-xl mt-1">Ihr Eigenanteil: {fmtEuro(foerd.eigenanteil)}</p>
          </div>
        </div>
      </div>
      {/* Stadtspezifische Daten — Uniqueness */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
          <div className="px-4 py-3 border-b border-wp-border" style={{ background: 'linear-gradient(135deg, #1A4731 0%, #0A1910 100%)' }}>
            <p className="text-[rgba(255,255,255,0.60)] text-xs font-bold uppercase tracking-wider">{city.name} — Montage-Kennzahlen</p>
          </div>
          <div className="p-4 space-y-2">
            {[
              ['Jahresmitteltemperatur', city.avgTemp + '°C'],
              ['Normaußentemperatur', city.normAussentemp + '°C'],
              ['Heizgradtage', city.heizgradtage.toLocaleString('de-DE') + ' Kd/a'],
              ['Empf. Montagezeitraum', city.normAussentemp < -12 ? 'Frühjahr/Sommer' : 'Ganzjährig möglich'],
              ['JAZ nach Montage', String(jaz)],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-1 border-b border-wp-border last:border-0">
                <span className="text-wp-text2 text-xs">{l}</span>
                <span className="font-mono font-bold text-wp-text text-xs">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
          <div className="px-4 py-3 border-b border-wp-border bg-wp-dark">
            <p className="text-[rgba(255,255,255,0.60)] text-xs font-bold uppercase tracking-wider">Kosten nach Montage in {city.name}</p>
          </div>
          <div className="p-4 space-y-2">
            {[
              ['Strompreis ' + city.name, city.strompreis + ' ct/kWh'],
              ['WP-Betriebskosten', fmtEuro(calc.wpKosten) + '/Jahr'],
              ['Gas vorher', fmtEuro(calc.altKosten) + '/Jahr'],
              ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
              ['KfW-Zuschuss', fmtEuro(foerd.zuschuss)],
              ['Amortisation', calc.amortisationJahre + ' Jahre'],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-1 border-b border-wp-border last:border-0">
                <span className="text-wp-text2 text-xs">{l}</span>
                <span className={`font-mono font-bold text-xs ${i === 3 ? 'text-wp-amber' : i === 4 ? 'text-wp-green' : 'text-wp-text'}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );

  return (
    <RichTemplateBase
      city={city} keyword={keyword} calc={calc} foerd={foerd} jaz={jaz} nearby={nearby} h1={h1} allCities={allCities}
      heroImg="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
      heroStats={heroStats}
      {...(isUrgent ? { urgencyBadge: `GEG-Frist ${city.name}: ${gegFristFormatted}` } : {})}
      sections={sections}
    />
  );
}
