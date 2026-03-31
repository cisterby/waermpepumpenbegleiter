// waermepumpe-altbau — WP im Altbau
'use client';
import Link from 'next/link';
import { CheckCircle, ArrowRight, AlertTriangle, TrendingUp, Clock, Calculator, FileText, Zap, Home, Leaf, ThumbsUp } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { cityHash } from '@/lib/content-variation';
import RichTemplateBase from '@/components/programmatic/RichTemplateBase';

export default function AltbauTemplate({ city, keyword, calc, foerd, jaz, nearby, h1, allCities }: CityPageRouterProps) {
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');

  const heroStats = [
    { val: `JAZ ${jaz}`, label: "Jahresarbeitszahl", sub: `in ${city.name}` },
        { val: `${foerd.gesamtSatz}%`, label: "KfW-Förderung", sub: "Eigennutzer" },
        { val: `${fmtEuro(foerd.eigenanteil)}`, label: "Eigenanteil", sub: "nach Förderung" },
        { val: `${calc.amortisationJahre} J.`, label: "Amortisation", sub: "inkl. KfW" }
  ];

  const sections = (
    <>

          {/* Featured Snippet */}
          <div className="bg-white border border-wp-border border-l-4 border-l-wp-green rounded-xl p-6 shadow-wp-sm">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
              {fillTemplate('Funktioniert eine Wärmepumpe im Altbau in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Ja — in den meisten Altbauten in <strong className="text-wp-text">{city.name}</strong>. Entscheidend ist nicht das Baujahr sondern die <strong className="text-wp-text">Vorlauftemperatur</strong>. Moderne Hochtemperatur-Wärmepumpen arbeiten bis 70°C Vorlauf und sind damit mit nahezu allen Bestandsheizkörpern kompatibel. In {city.name} ({city.bundesland}) mit {city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und {city.avgTemp}°C Jahresmittel erreichen WP eine JAZ von {jaz} — jährliche Ersparnis gegenüber Gas: <strong className="text-wp-text">{fmtEuro(calc.ersparnis)}</strong>.
            </p>
          </div>

          {/* Bild + Schnelltest nebeneinander */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="relative rounded-2xl overflow-hidden h-64">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80"
                alt={`Wärmepumpe Altbau ${city.name}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-wp-dark/60 flex items-end p-5">
                <div>
                  <p className="font-heading font-bold text-white text-base">70–80% aller Altbauten geeignet</p>
                  <p className="text-white/60 text-xs">Quelle: Bundesverband Wärmepumpe BWP</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-wp-text text-lg">Altbau-Schnelltest für {city.name}</h3>
              {[
                { q: 'Heizkörper warm bis sehr warm?', ja: 'Hochtemperatur-WP bis 70°C empfohlen', nein: 'Standard-WP ideal — niedrige Vorlauftemp.' },
                { q: 'Dach oder Keller bereits gedämmt?', ja: 'Heizlast gesunken → JAZ steigt auf ' + String(Math.min(jaz + 0.3, 4.5).toFixed(1)), nein: 'Trotzdem möglich — JAZ ' + String(jaz) },
                { q: 'Fußbodenheizung vorhanden?', ja: 'Ideal — niedrigste Vorlauftemperatur, JAZ ' + String(Math.min(jaz + 0.5, 4.8).toFixed(1)), nein: 'Kein Problem mit moderner WP' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-wp-border p-3 shadow-wp-sm">
                  <p className="font-semibold text-wp-text text-xs mb-2">❓ {item.q}</p>
                  <p className="text-wp-green text-xs mb-0.5">✓ Ja: {item.ja}</p>
                  <p className="text-wp-text3 text-xs">○ Nein: {item.nein}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Haupttext */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Was beim Altbau in {city.name} wirklich entscheidet
            </h2>
            <div className="space-y-4 text-wp-text2 text-base leading-relaxed">
              <p>
                Die häufigste Falschannahme: "Mein Haus ist zu alt für eine Wärmepumpe." In der Praxis sind in {city.name} ({city.bundesland}) mit {city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen pro Jahr die meisten Häuser ab Baujahr 1960 WP-tauglich — sofern eine korrekte Heizlastberechnung nach DIN EN 12831 vorliegt.
              </p>
              <div className="bg-wp-greenlt border border-wp-green3/30 rounded-xl p-5">
                <h3 className="font-heading font-semibold text-wp-green text-base mb-3">
                  Hydraulischer Abgleich — der Schlüssel im Altbau
                </h3>
                <p className="text-wp-text2 text-sm leading-relaxed">
                  Ein hydraulischer Abgleich (KfW-Pflicht, €500–1.500) optimiert die Wärmeverteilung und senkt die nötige Vorlauftemperatur um typisch 5–15°C. Das verbessert die JAZ von {(jaz - 0.4).toFixed(1)} auf {jaz} oder besser — und ist Voraussetzung für die volle KfW-Förderung.
                </p>
              </div>
              <p>
                Hochtemperatur-Wärmepumpen wie der Viessmann Vitocal 252-A oder Stiebel Eltron WPL arbeiten bis 70°C Vorlauf — kompatibel mit nahezu allen Heizkörpern in {city.name}. Oft reicht der Austausch von einem oder zwei unterdimensionierten Heizkörpern um die Systemtemperatur deutlich zu senken.
              </p>
            </div>
          </div>

          {/* Kostentabelle Altbau */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Typische Kosten für WP im Altbau in {city.name}
            </h2>
            <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
              <table className="w-full">
                <thead><tr className="bg-wp-dark">
                  <th className="px-4 py-3 text-left text-[rgba(255,255,255,0.45)] text-xs font-bold uppercase">Position</th>
                  <th className="px-4 py-3 text-right text-[rgba(255,255,255,0.45)] text-xs font-bold uppercase">Kosten</th>
                  <th className="px-4 py-3 text-right text-wp-green3 text-xs font-bold uppercase">KfW-fähig</th>
                </tr></thead>
                <tbody>
                  {[
                    ['WP-Gerät (inkl. WW-Speicher)', '€8.000–€15.000', '✓'],
                    ['Installation & Montage', '€4.000–€8.000', '✓'],
                    ['Hydraulischer Abgleich', '€500–€1.500', '✓ Pflicht'],
                    ['Elektroinstallation', '€500–€1.500', '✓'],
                    ['Fundament Außeneinheit', '€300–€800', '✓'],
                    ['Ggf. Heizkörpertausch (1–2 St.)', '€200–€800', 'BAFA 15%'],
                    ['Gesamt brutto', '€14.000–€28.000', ''],
                    ['Abzüglich KfW (' + String(foerd.gesamtSatz) + '%)', '−' + fmtEuro(foerd.zuschuss), ''],
                  ].map(([pos, kosten, kfw], i) => (
                    <tr key={i} className={i === 7 ? 'bg-wp-greenlt border-t-2 border-wp-green' : i % 2 === 0 ? 'bg-white' : 'bg-wp-bg/40'}>
                      <td className={`px-4 py-3 text-sm border-b border-wp-border ${i === 7 ? 'font-bold text-wp-text' : 'text-wp-text2'}`}>{pos}</td>
                      <td className={`px-4 py-3 text-sm text-right font-mono border-b border-wp-border ${i === 7 ? 'font-bold text-wp-green' : 'text-wp-text'}`}>{kosten}</td>
                      <td className={`px-4 py-3 text-xs text-right border-b border-wp-border ${kfw.includes('Pflicht') ? 'text-wp-green font-bold' : 'text-wp-text3'}`}>{kfw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bild Installateur */}
          <div className="relative rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80"
              alt={`WP Installation Altbau ${city.name}`} className="w-full h-52 object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,25,16,0.92) 0%, rgba(10,25,16,0.4) 100%)' }} />
            <div className="absolute inset-0 flex items-center px-8">
              <div>
                <p className="font-heading font-extrabold text-white text-xl mb-2">Ihr Eigenanteil in {city.name}</p>
                <p className="font-mono font-bold text-wp-amber text-3xl">{fmtEuro(foerd.eigenanteil)}</p>
                <p className="text-white/55 text-sm mt-1">nach {foerd.gesamtSatz}% KfW-Förderung · nicht rückzahlbar</p>
              </div>
            </div>
          </div>

    </>
  );

  return (
    <RichTemplateBase
      city={city} keyword={keyword} calc={calc} foerd={foerd} jaz={jaz} nearby={nearby} h1={h1} allCities={allCities}
      heroImg="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80"
      heroStats={heroStats}
      {...(isUrgent ? { urgencyBadge: `GEG-Frist ${city.name}: ${gegFristFormatted}` } : {})}
      sections={sections}
    />
  );
}
