// LuftwaermepumpeTemplate — luftwaermepumpe
'use client';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { CheckCircle, ArrowRight } from 'lucide-react';
import RichTemplateBase from '@/components/programmatic/RichTemplateBase';

export default function LuftwaermepumpeTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');

  const heroStats = [
    { val: `${foerd.gesamtSatz}%`, label: 'KfW-Förderung', sub: 'Eigennutzer' },
    { val: fmtEuro(foerd.zuschuss), label: 'Zuschuss', sub: 'nicht rückzahlbar' },
    { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'nach Förderung' },
    { val: fmtEuro(calc.ersparnis), label: 'Ersparnis/Jahr', sub: 'vs. Erdgas' },
  ];

  const sections = (
    <>
      {/* Featured Snippet */}
      <div className="bg-white border border-wp-border border-l-4 border-l-wp-green rounded-xl p-6 shadow-wp-sm">
        <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
          {fillTemplate(keyword.featuredSnippetQuestions[0] ?? '', city, jaz)}
        </h2>
        <p className="text-wp-text2 text-base leading-relaxed">
          In <strong className="text-wp-text">{city.name}</strong> ({city.bundesland}) mit {city.avgTemp}°C Jahresmitteltemperatur
          und {city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen erreicht eine Wärmepumpe eine JAZ von <strong className="text-wp-text">{jaz}</strong>.
          Jährliche Ersparnis gegenüber Erdgas: <strong className="text-wp-text">{fmtEuro(calc.ersparnis)}</strong>.
          KfW-Förderung: {foerd.gesamtSatz}% = {fmtEuro(foerd.zuschuss)} · Eigenanteil: {fmtEuro(foerd.eigenanteil)}.
        </p>
      </div>

      {/* Hero-Bild + Infokarten */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden h-64">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" alt={h1} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-wp-dark/60 flex items-end p-5">
            <div>
              <p className="font-heading font-bold text-white text-base">{city.name} · JAZ {jaz}</p>
              <p className="text-white/60 text-xs">{city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.avgTemp}°C · {city.strompreis}ct/kWh</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-wp-text text-lg">Luftwärmepumpe in {city.name}</h3>
          {[
            { icon: '💶', title: 'KfW-Förderung', text: `${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)} Zuschuss · Eigenanteil: ${fmtEuro(foerd.eigenanteil)}` },
            { icon: '⚡', title: `JAZ ${jaz} in ${city.name}`, text: `Aus 1 kWh Strom → ${jaz} kWh Wärme · Betrieb: ${fmtEuro(calc.wpKosten)}/Jahr` },
            { icon: '🛡️', title: 'Geprüfte Meisterbetriebe', text: `HWK + KfW-LuL-registriert in ${city.name} · 48h · kostenlos` },
            { icon: '🌿', title: 'CO₂ gespart', text: `${calc.co2Ersparnis} t CO₂/Jahr weniger als Gasheizung` },
          ].map((c, i) => (
            <div key={i} className="bg-white border border-wp-border rounded-xl p-3 shadow-wp-sm flex items-start gap-3">
              <span className="text-xl shrink-0">{c.icon}</span>
              <div>
                <p className="font-heading font-bold text-wp-text text-sm mb-0.5">{c.title}</p>
                <p className="text-wp-text2 text-xs leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Luftwärmepumpe — Tabellen */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">Luftwärmepumpe in {city.name} — Zahlen 2026</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
            <div className="px-4 py-3 border-b border-wp-border" style={{ background: 'linear-gradient(135deg, #1A4731 0%, #0A1910 100%)' }}>
              <p className="text-[rgba(255,255,255,0.60)] text-xs font-bold uppercase tracking-wider">{city.name} — Standort</p>
            </div>
            <div className="p-4 space-y-2">
              {[
                ['Jahresmitteltemperatur', city.avgTemp + '°C'],
                ['Heizgradtage', city.heizgradtage.toLocaleString('de-DE') + ' Kd/a'],
                ['Strompreis lokal', city.strompreis + ' ct/kWh'],
                ['JAZ Erwartung', String(jaz)],
                ['CO₂ gespart/Jahr', calc.co2Ersparnis + ' t'],
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
              <p className="text-[rgba(255,255,255,0.60)] text-xs font-bold uppercase tracking-wider">Förderung & Wirtschaftlichkeit</p>
            </div>
            <div className="p-4 space-y-2">
              {[
                ['KfW-Förderung', foerd.gesamtSatz + '%'],
                ['Zuschuss', fmtEuro(foerd.zuschuss)],
                ['Eigenanteil', fmtEuro(foerd.eigenanteil)],
                ['Gas heute', fmtEuro(calc.altKosten) + '/Jahr'],
                ['WP-Betrieb', fmtEuro(calc.wpKosten) + '/Jahr'],
                ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
                ['Amortisation', calc.amortisationJahre + ' Jahre'],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between py-1 border-b border-wp-border last:border-0">
                  <span className="text-wp-text2 text-xs">{l}</span>
                  <span className={`font-mono font-bold text-xs ${i === 1 ? 'text-wp-green' : i === 2 ? 'text-wp-amber' : i === 5 ? 'text-wp-amber' : 'text-wp-text'}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prozessschritte */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">Wie wir vorgehen in {city.name}</h2>
        <div className="space-y-3">
          {[
            { n: '01', title: 'Kostenlose Anfrage (2 Min.)', text: `PLZ und Gebäudedaten eingeben. Wir finden geprüfte Betriebe in ${city.name} — kostenlos, 48h Rückmeldung.` },
            { n: '02', title: 'Bis zu 3 vollständige Angebote', text: 'Alle mit Heizlastberechnung, hydraulischem Abgleich und KfW-Antrag inklusive. Vergleichbar.' },
            { n: '03', title: 'KfW-Antrag vor Vertragsabschluss', text: `LuL-registrierter Betrieb stellt Antrag. Erst nach Bestätigung unterschreiben. ${fmtEuro(foerd.zuschuss)} Zuschuss.` },
            { n: '04', title: 'Installation & Auszahlung', text: `Montage 1–3 Tage. Verwendungsnachweis → ${fmtEuro(foerd.zuschuss)} in 4–8 Wochen auf Ihr Konto.` },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-wp-border p-4 flex gap-4 shadow-wp-sm">
              <div className="w-9 h-9 bg-wp-dark rounded-xl flex items-center justify-center font-mono font-bold text-wp-green3 text-sm shrink-0">{s.n}</div>
              <div>
                <p className="font-heading font-bold text-wp-text mb-1">{s.title}</p>
                <p className="text-wp-text2 text-sm leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Abschluss-Bild */}
      <div className="relative rounded-2xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80"
          alt={`${keyword.keyword.replace('[Stadt]', city.name)}`} className="w-full h-52 object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,25,16,0.92) 0%, rgba(10,25,16,0.35) 100%)' }} />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <p className="font-heading font-extrabold text-white text-xl mb-2">Kostenlos anfragen in {city.name}</p>
            <p className="text-white/70 text-sm mb-1">3 Angebote · 48h · HWK-geprüft · KfW-LuL-registriert</p>
            <p className="font-bold text-wp-amber text-2xl">Eigenanteil ab {fmtEuro(foerd.eigenanteil)}</p>
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