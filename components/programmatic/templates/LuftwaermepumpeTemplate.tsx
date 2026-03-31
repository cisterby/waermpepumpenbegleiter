// components/programmatic/templates/LuftwaermepumpeTemplate.tsx
// luftwaermepumpe — Technik, JAZ, stadtspezifische Klimazone, Hersteller, PV
'use client';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { cityHash } from '@/lib/content-variation';
import { CheckCircle, Zap } from 'lucide-react';
import RichTemplateBase from '@/components/programmatic/RichTemplateBase';

export default function LuftwaermepumpeTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const v = cityHash(city, 4, 88);
  const isMild = city.avgTemp >= 10.0;
  const isKalt = city.avgTemp < 8.5;

  const jazMild = Math.min(parseFloat((jaz + 0.2).toFixed(1)), 4.5);
  const jazKalt = Math.max(parseFloat((jaz - 0.2).toFixed(1)), 2.8);
  const jazFBH = Math.min(parseFloat((jaz + 0.5).toFixed(1)), 4.8);

  const klimaNote = isMild
    ? `${city.name} mit ${city.avgTemp}°C Jahresmittel ist ideal für Luftwärmepumpen. Die JAZ von ${jaz} liegt über dem Bundesdurchschnitt — im Winter sinkt sie auf ${jazKalt}, im milden Frühjahr/Herbst steigt sie auf ${jazMild}+.`
    : isKalt
    ? `${city.name} mit ${city.avgTemp}°C Jahresmittel ist klimatisch anspruchsvoller für Luft-WP. JAZ ${jaz} ist trotzdem wirtschaftlich — moderne Geräte arbeiten bis -20°C zuverlässig. Hochtemperatur-WP empfohlen für ältere Heizkörper.`
    : `${city.name} (${city.avgTemp}°C Jahresmittel) bietet gute Bedingungen für Luftwärmepumpen. JAZ ${jaz} entspricht dem Bundesdurchschnitt. Optimierung durch hydraulischen Abgleich und WP-Sondertarif bringt weitere ${fmtEuro(Math.round(calc.ersparnis * 0.15))}/Jahr.`;

  const intros = [
    `Eine Luftwärmepumpe (Luft-Wasser-WP) ist die häufigste WP-Art in ${city.name} — 92% Marktanteil 2025. Sie entzieht der Außenluft Wärme, auch bei −20°C. In ${city.name} mit ${city.avgTemp}°C Jahresmitteltemperatur erreicht sie eine JAZ von ${jaz} — ${fmtEuro(calc.ersparnis)}/Jahr Ersparnis gegenüber Erdgas.`,
    `Luftwärmepumpe in ${city.name}: ${klimaNote} Betriebskosten: ${fmtEuro(calc.wpKosten)}/Jahr bei ${city.strompreis} ct/kWh. Mit KfW-Förderung ${foerd.gesamtSatz}%: Eigenanteil ab ${fmtEuro(foerd.eigenanteil)}.`,
    `Warum sind Luft-WP so dominant in ${city.name}? Keine Erdarbeiten nötig, keine Genehmigung, Montage in 1–3 Tagen. Hochtemperatur-Varianten bis 70°C Vorlauf sind für die meisten Bestandsgebäude in ${city.bundesland} geeignet. JAZ ${jaz} → ${fmtEuro(calc.ersparnis)}/Jahr Ersparnis.`,
    `Luftwärmepumpe ${city.name}: COP ${(jaz * 1.1).toFixed(1)} (Prüfbedingung A7/W35) klingt besser als die reale JAZ ${jaz} — aber beide sind gut. Der Unterschied liegt in der Jahresbetrachtung unter echten ${city.bundesland}-Klimabedingungen. Entscheidend für Sie: ${fmtEuro(calc.wpKosten)}/Jahr Betriebskosten statt ${fmtEuro(calc.altKosten)}/Jahr Gas.`,
  ];

  const heroStats = [
    { val: `JAZ ${jaz}`, label: 'in ' + city.name, sub: city.avgTemp + '°C Jahresmittel' },
    { val: fmtEuro(calc.wpKosten), label: 'Betriebskosten/Jahr', sub: city.strompreis + ' ct/kWh' },
    { val: `${foerd.gesamtSatz}%`, label: 'KfW-Förderung', sub: fmtEuro(foerd.zuschuss) + ' Zuschuss' },
    { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'nach Förderung' },
  ];

  const sections = (
    <>
      <div className="bg-white border border-wp-border border-l-4 border-l-wp-green rounded-xl p-6 shadow-wp-sm">
        <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
          {fillTemplate('Luftwärmepumpe in {stadt} — Kosten, Effizienz und Eignung', city, jaz)}
        </h2>
        <p className="text-wp-text2 text-base leading-relaxed">{intros[v]}</p>
      </div>

      {/* Klimazone + Bild */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden h-64">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
            alt={`Luftwärmepumpe ${city.name}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-wp-dark/60 flex items-end p-5">
            <div>
              <p className="font-heading font-bold text-white text-base">{isMild ? '☀️ Mildes Klima' : isKalt ? '❄️ Kühles Klima' : '🌡️ Gemäßigtes Klima'} — {city.name}</p>
              <p className="text-white/60 text-xs">{city.avgTemp}°C · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · JAZ {jaz}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-heading font-bold text-wp-text text-lg mb-3">JAZ-Szenarien in {city.name}</h3>
          <div className="space-y-2">
            {[
              { label: 'Heizkörper (Vorlauf 55°C)', jaz_val: jaz, note: 'Standard in ' + city.name },
              { label: 'Fußbodenheizung (Vorlauf 35°C)', jaz_val: jazFBH, note: 'Optimal — höchste Effizienz' },
              { label: 'Altbau Hochtemperatur (70°C)', jaz_val: jazKalt, note: 'Hochtemperatur-WP nötig' },
              { label: 'Mit PV-Eigenverbrauch', jaz_val: jaz, note: 'Effektivkosten <2 ct/kWh Wärme' },
            ].map(({ label, jaz_val, note }, i) => (
              <div key={i} className={`rounded-xl border p-3 ${i === 1 ? 'bg-wp-greenlt border-wp-green3/30' : 'bg-white border-wp-border'} shadow-wp-sm`}>
                <div className="flex justify-between">
                  <span className="text-wp-text2 text-xs">{label}</span>
                  <span className={`font-mono font-bold text-sm ${i === 1 ? 'text-wp-green' : i === 2 ? 'text-wp-text3' : 'text-wp-text'}`}>JAZ {jaz_val}</span>
                </div>
                <p className="text-wp-text3 text-xs">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Klimazone Text + Kosten */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
          Klima {city.name} — Auswirkung auf die Luftwärmepumpe
        </h2>
        <div className="bg-white border border-wp-border rounded-xl p-5 shadow-wp-sm mb-4">
          <p className="text-wp-text2 text-base leading-relaxed mb-4">{klimaNote}</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'Jahresmitteltemperatur', val: city.avgTemp + '°C', sub: 'Basis für JAZ-Berechnung' },
              { label: 'Heizgradtage', val: city.heizgradtage.toLocaleString('de-DE'), sub: 'Jährlicher Wärmebedarf' },
              { label: 'Normaussentemperatur', val: (city.normAussentemp || -12) + '°C', sub: 'Auslegungspunkt Heizlast' },
            ].map(({ label, val, sub }, i) => (
              <div key={i} className="bg-wp-bg rounded-xl p-3 text-center">
                <p className="font-mono font-bold text-wp-text text-lg">{val}</p>
                <p className="text-wp-text3 text-xs font-semibold">{label}</p>
                <p className="text-wp-text3 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hersteller-Vergleich */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
          Luftwärmepumpen für {city.name} — Hersteller im Vergleich 2026
        </h2>
        <div className="overflow-x-auto rounded-xl border border-wp-border shadow-wp-sm">
          <table className="w-full bg-white min-w-[560px]">
            <thead>
              <tr className="bg-wp-dark">
                {['Modell', 'COP A7/W35', 'Max. Vorlauf', 'Kältemittel', 'KfW-Bonus', 'Schallpegel'].map((h, i) => (
                  <th key={i} className={`px-3 py-3 text-xs font-bold uppercase ${i === 0 ? 'text-left text-white' : 'text-right ' + (i === 4 ? 'text-wp-green3' : 'text-[rgba(255,255,255,0.40)]')}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Viessmann Vitocal 250-A', '4,0', '65°C', 'R290', '✓ +5%', '48 dB'],
                ['Vaillant aroTHERM plus', '3,8', '65°C', 'R290', '✓ +5%', '52 dB'],
                ['Buderus Logatherm WLW', '3,9', '70°C', 'R454B', '—', '28,5 dB'],
                ['Stiebel Eltron WPL 19+', '3,9', '70°C', 'R454B', '—', '50 dB'],
                ['Nibe Fighter 2040', '3,8', '65°C', 'R32', '—', '45 dB'],
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-wp-bg/40'}>
                  <td className="px-3 py-2.5 font-semibold text-wp-text text-xs border-b border-wp-border">{row[0]}</td>
                  {row.slice(1).map((cell, j) => (
                    <td key={j} className={`px-3 py-2.5 text-xs text-right border-b border-wp-border ${j === 3 ? (cell.includes('✓') ? 'text-wp-green font-semibold' : 'text-wp-text3') : 'text-wp-text2'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80"
          alt={`Luft-WP ${city.name} Einfamilienhaus`} className="w-full h-48 object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,25,16,0.93) 0%, rgba(10,25,16,0.4) 100%)' }} />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <p className="font-heading font-extrabold text-white text-xl mb-2">Luftwärmepumpe in {city.name}</p>
            <div className="space-y-1">
              {[`JAZ ${jaz} · ${fmtEuro(calc.wpKosten)}/Jahr Betriebskosten`, `KfW ${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)} · Eigenanteil ${fmtEuro(foerd.eigenanteil)}`, `${fmtEuro(calc.ersparnis)}/Jahr Ersparnis vs. Gasheizung`].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-white text-sm">
                  <CheckCircle size={12} className="text-wp-green3 shrink-0" />{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <RichTemplateBase
      city={city} keyword={keyword} calc={calc} foerd={foerd} jaz={jaz} nearby={nearby} h1={h1}
      heroImg="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
      heroStats={heroStats}
      {...(isUrgent ? { urgencyBadge: `GEG-Frist ${city.name}: ${gegFristFormatted}` } : {})}
      sections={sections}
    />
  );
}
