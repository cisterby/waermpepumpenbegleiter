// StromverbrauchTemplate — waermepumpe-stromverbrauch — maximale Uniqueness
'use client';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { cityHash } from '@/lib/content-variation';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import RichTemplateBase from '@/components/programmatic/RichTemplateBase';

export default function StromverbrauchTemplate({ city, keyword, calc, foerd, jaz, nearby, h1, allCities }: CityPageRouterProps) {
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const v = cityHash(city, 4, 41);

  const intros = [
    `WP-Stromverbrauch {city.name}: JAZ {jaz} bei {city.avgTemp}°C → {Math.round(20000 / jaz).toLocaleString('de-DE')} kWh/Jahr. Bei {city.strompreis} ct/kWh: {fmtEuro(Math.round(20000 / jaz * city.strompreis / 100))}/Jahr — {fmtEuro(calc.ersparnis)}/Jahr weniger als Gas.`,
    `WP-Sondertarif {city.name}: Strom auf ca. {Math.round(city.strompreis - 5)} ct/kWh senken = {fmtEuro(Math.round(20000 / jaz * 0.05))}/Jahr zusätzliche Ersparnis. PV-Kombination: 40–60% Eigendeckung möglich — effektive Wärmekosten unter 2 ct/kWh in {city.name}.`,
    `Smart-Grid {city.name}: {city.avgSunHours > 1500 ? city.avgSunHours + ' Sonnenstunden' : 'Die Solarstrahlung in ' + city.bundesland} ermöglicht PV-Eigenverbrauch. WP nutzt Eigenstrom für thermische Speicherung. Netzbezug sinkt auf ca. {Math.round(20000 / jaz * 0.4).toLocaleString('de-DE')} kWh/Jahr.`,
    `{city.name}: JAZ {jaz} → {Math.round(15000/jaz).toLocaleString('de-DE')} kWh Heiz-Strom + {Math.round(1500/jaz*0.7).toLocaleString('de-DE')} kWh WW = {Math.round(15000/jaz + 1500/jaz*0.7).toLocaleString('de-DE')} kWh/Jahr. Bei {city.strompreis} ct: {fmtEuro(Math.round((15000/jaz + 1500/jaz*0.7) * city.strompreis/100))}/Jahr. Mit WP-Tarif ({Math.round(city.strompreis-5)} ct): {fmtEuro(Math.round((15000/jaz + 1500/jaz*0.7) * (city.strompreis-5)/100))}/Jahr.`,
  ];

  const heroStats = [
    { val: `${foerd.gesamtSatz}%`, label: 'KfW-Förderung', sub: 'Eigennutzer' },
    { val: fmtEuro(foerd.zuschuss), label: 'Zuschuss', sub: 'nicht rückzahlbar' },
    { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'nach Förderung' },
    { val: fmtEuro(calc.ersparnis), label: 'Ersparnis/Jahr', sub: 'vs. Erdgas' },
  ];

  const sections = (
    <>
      {/* Featured Snippet mit cityHash-rotierendem Intro */}
      <div className="bg-white border border-wp-border border-l-4 border-l-wp-green rounded-xl p-6 shadow-wp-sm">
        <h2 className="font-heading font-bold text-wp-text text-xl mb-3">
          {fillTemplate(keyword.featuredSnippetQuestions[0] ?? '', city, jaz)}
        </h2>
        <p className="text-wp-text2 text-base leading-relaxed">{intros[v]}</p>
      </div>

      {/* Bild + stadtspezifische Kennzahlen */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden h-64">
          <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80" alt={h1} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-wp-dark/60 flex items-end p-5">
            <div>
              <p className="font-heading font-bold text-white text-base">{city.name} · JAZ {jaz}</p>
              <p className="text-white/60 text-xs">{city.avgTemp}°C · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.strompreis} ct/kWh</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-wp-text text-lg">WP Stromverbrauch in {city.name}</h3>
          {[
            { icon: '🌡️', label: 'Jahresmitteltemperatur', val: `${city.avgTemp}°C`, note: city.avgTemp > 10 ? `Milder Standort — JAZ ${jaz} gut erreichbar` : `Kühlerer Standort — JAZ ${jaz}, ggf. HT-WP prüfen` },
            { icon: '⚡', label: `Strompreis ${city.name}`, val: `${city.strompreis} ct/kWh`, note: `WP-Betrieb: ${fmtEuro(calc.wpKosten)}/Jahr (JAZ ${jaz})` },
            { icon: '🔥', label: 'Heizgradtage', val: `${city.heizgradtage.toLocaleString('de-DE')} Kd/a`, note: city.heizgradtage > 3200 ? 'Überdurchschnittlicher Wärmebedarf' : 'Günstiger Wärmebedarf' },
            { icon: '💶', label: `KfW ${foerd.gesamtSatz}% in ${city.name}`, val: fmtEuro(foerd.zuschuss), note: `Eigenanteil: ${fmtEuro(foerd.eigenanteil)}` },
          ].map((d, i) => (
            <div key={i} className="bg-white border border-wp-border rounded-xl p-3 shadow-wp-sm flex items-start gap-3">
              <span className="text-xl shrink-0">{d.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-heading font-bold text-wp-text text-xs">{d.label}</p>
                  <span className="font-mono font-bold text-wp-amber text-sm">{d.val}</span>
                </div>
                <p className="text-wp-text3 text-xs mt-0.5">{d.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {city.fernwaermeQuote >= 40 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>{city.name}</strong> hat {city.fernwaermeQuote}% Fernwärmeabdeckung. Prüfen Sie ob Ihre Adresse in einem Fernwärmegebiet liegt — dort kann eine WP unzulässig sein. Für {100 - city.fernwaermeQuote}% der Haushalte in {city.name} ist die Wärmepumpe die klare Lösung.
          </p>
        </div>
      )}

      {/* Stromverbrauch berechnen — volles Fließtext */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">Stromverbrauch berechnen in {city.name} — was wichtig ist</h2>
        <div className="space-y-4 text-wp-text2 leading-relaxed">
          <p>
            In <strong className="text-wp-text">{city.name}</strong> ({city.bundesland}) liegt der lokale Strompreis bei <strong className="text-wp-text">{city.strompreis} ct/kWh</strong>. Mit JAZ <strong className="text-wp-text">{jaz}</strong> — dem erwarteten Wert für {city.avgTemp}°C Jahresmitteltemperatur — entstehen WP-Betriebskosten von <strong className="text-wp-text">{fmtEuro(calc.wpKosten)}</strong>/Jahr. Die Gasheizung kostet {fmtEuro(calc.altKosten)}/Jahr — die WP spart <strong className="text-wp-text">{fmtEuro(calc.ersparnis)}/Jahr</strong>.
          </p>
          <div className="bg-wp-greenlt border border-wp-green3/30 rounded-xl p-5">
            <h3 className="font-heading font-semibold text-wp-green text-base mb-2">Optimierung & WP-Sondertarif in {city.name}</h3>
            <p className="text-wp-text2 text-sm leading-relaxed">
              {city.bundeslandFoerderung && !city.bundeslandFoerderungBetrag?.includes('ausgesetzt')
                ? `In ${city.bundesland} gibt es zusätzlich zur KfW-Bundesförderung das Programm "${city.bundeslandFoerderung}": ${city.bundeslandFoerderungBetrag}. Kombiniert mit ${foerd.gesamtSatz}% KfW (${fmtEuro(foerd.zuschuss)}) ergibt das eine überdurchschnittliche Gesamtförderung für Hausbesitzer in ${city.name}.`
                : `In ${city.bundesland} gilt die KfW-Bundesförderung (Programm 458) mit ${foerd.gesamtSatz}% = ${fmtEuro(foerd.zuschuss)} Zuschuss. Eigenanteil für Hausbesitzer in ${city.name}: ${fmtEuro(foerd.eigenanteil)}.`
              }
            </p>
          </div>
          <p>
            Bei {city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen pro Jahr und {city.normAussentemp}°C Normaußentemperatur in {city.name} ist eine <strong className="text-wp-text">Heizlastberechnung nach DIN EN 12831</strong> die Basis für die richtige WP-Dimensionierung. Eine Über- oder Unterdimensionierung würde die JAZ {jaz} verschlechtern und die Wirtschaftlichkeit mindern. Amortisation bei korrekter Planung: <strong className="text-wp-text">{calc.amortisationJahre} Jahre</strong>.
          </p>
        </div>
      </div>

      {/* Zweites Bild mit City-Zahlen */}
      <div className="relative rounded-2xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=900&q=80" alt={`${keyword.keyword.replace('[Stadt]', city.name)}`} className="w-full h-52 object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,25,16,0.92) 0%, rgba(10,25,16,0.35) 100%)' }} />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <p className="font-heading font-extrabold text-white text-xl mb-2">{city.name} — Ihre Zahlen</p>
            <p className="text-white text-sm">Ersparnis: <strong>{fmtEuro(calc.ersparnis)}/Jahr</strong></p>
            <p className="text-white/70 text-sm">KfW {foerd.gesamtSatz}%: {fmtEuro(foerd.zuschuss)} · Eigenanteil: {fmtEuro(foerd.eigenanteil)}</p>
            <p className="text-white/70 text-sm">Amortisation: {calc.amortisationJahre} Jahre · JAZ {jaz} · {city.avgTemp}°C</p>
          </div>
        </div>
      </div>

      {/* Vollständige Datentabellen — macht jede Seite unique */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">Alle Kennzahlen für {city.name} 2026</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-wp-border overflow-hidden shadow-wp-sm">
            <div className="px-4 py-3 border-b border-wp-border" style={{ background: 'linear-gradient(135deg, #1A4731 0%, #0A1910 100%)' }}>
              <p className="text-[rgba(255,255,255,0.60)] text-xs font-bold uppercase tracking-wider">{city.name} — Standort & Klima</p>
            </div>
            <div className="p-4 space-y-2">
              {[
                ['Jahresmitteltemperatur', city.avgTemp + '°C'],
                ['Normaußentemperatur', city.normAussentemp + '°C'],
                ['Heizgradtage', city.heizgradtage.toLocaleString('de-DE') + ' Kd/a'],
                ['Sonnenstunden/Jahr', city.avgSunHours.toLocaleString('de-DE') + ' h'],
                ['Fernwärmequote', city.fernwaermeQuote + '%'],
                ['JAZ Luft-WP', String(jaz)],
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
              <p className="text-[rgba(255,255,255,0.60)] text-xs font-bold uppercase tracking-wider">Energie & Wirtschaftlichkeit</p>
            </div>
            <div className="p-4 space-y-2">
              {[
                ['Strompreis ' + city.name, city.strompreis + ' ct/kWh'],
                ['Gaspreis ' + city.name, city.gaspreis + ' ct/kWh'],
                ['Gas-Betriebskosten heute', fmtEuro(calc.altKosten) + '/Jahr'],
                ['WP-Betriebskosten', fmtEuro(calc.wpKosten) + '/Jahr'],
                ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
                ['Amortisation', calc.amortisationJahre + ' Jahre'],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between py-1 border-b border-wp-border last:border-0">
                  <span className="text-wp-text2 text-xs">{l}</span>
                  <span className={`font-mono font-bold text-xs ${i === 4 ? 'text-wp-amber' : i === 3 ? 'text-wp-green' : 'text-wp-text'}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prozessschritte */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">Kostenlos anfragen in {city.name}</h2>
        <div className="space-y-3">
          {[
            { n: '01', title: 'Anfrage (2 Min.)', text: `PLZ und Gebäudedaten eingeben. Wir finden geprüfte Betriebe in ${city.name} (${city.bundesland}) — kostenlos, 48h.` },
            { n: '02', title: 'Bis zu 3 vollständige Angebote', text: `Alle mit Heizlastberechnung für ${city.normAussentemp}°C, hydraulischem Abgleich und KfW-Antrag inklusive.` },
            { n: '03', title: 'KfW-Antrag vor Vertragsabschluss', text: `${foerd.gesamtSatz}% KfW = ${fmtEuro(foerd.zuschuss)}. LuL-Betrieb stellt Antrag VOR Unterschrift.` },
            { n: '04', title: `Auszahlung: ${fmtEuro(foerd.zuschuss)}`, text: `Verwendungsnachweis → ${fmtEuro(foerd.zuschuss)} in 4–8 Wochen auf Ihr Konto. Eigenanteil: ${fmtEuro(foerd.eigenanteil)}.` },
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
    </>
  );

  return (
    <RichTemplateBase
      city={city} keyword={keyword} calc={calc} foerd={foerd} jaz={jaz} nearby={nearby} h1={h1} allCities={allCities}
      heroImg="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80"
      heroStats={heroStats}
      {...(isUrgent ? { urgencyBadge: `GEG-Frist ${city.name}: ${gegFristFormatted}` } : {})}
      sections={sections}
    />
  );
}
