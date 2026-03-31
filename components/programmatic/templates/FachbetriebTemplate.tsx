// FachbetriebTemplate — waermepumpe-fachbetrieb — maximale Uniqueness
'use client';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { cityHash } from '@/lib/content-variation';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import RichTemplateBase from '@/components/programmatic/RichTemplateBase';

export default function FachbetriebTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const isUrgent = city.einwohner >= 100000;
  const gegFristFormatted = city.gegFrist.split('-').reverse().join('.');
  const v = cityHash(city, 4, 71);

  const intros = [
    `WP-Fachbetrieb {city.name}: Drei Merkmale — KfW-LuL-Registrierung, min. 5 WP-Installationen in 24 Monaten, Erfahrung für {city.normAussentemp}°C Normaußentemperatur in {city.bundesland}. Nur so wird JAZ {jaz} in {city.name} erreicht.`,
    `In {city.name} mit {city.einwohner.toLocaleString('de-DE')} Einwohnern gibt es {city.einwohner >= 500000 ? 'viele Betriebe die WP anbieten, aber wenige echte Spezialisten' : 'eine überschaubare Zahl geprüfter WP-Fachbetriebe'}. Entscheidend: LuL-Registrierung und JAZ-Erfahrung für {city.avgTemp}°C. Wir prüfen 6 Kriterien.`,
    `In {city.bundesland}: Fachbetriebe müssen seit 2026 Geräte mit 10 dB Schallunterschreitung installieren. Bei {city.einwohner >= 300000 ? 'dichter Bebauung in ' + city.name : city.bundesland + '-Auflagen'} entscheidend. Eigenanteil: {fmtEuro(foerd.eigenanteil)}.`,
    `Fachbetrieb {city.name} prüfen: LuL-Nummer im KfW-Portal, HWK-Eintragung {city.bundesland}, Referenz mit {city.heizgradtage} Kd/a. Wir prüfen das für alle Partnerbetriebe vor jeder Vermittlung.`,
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
          <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80" alt={h1} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-wp-dark/60 flex items-end p-5">
            <div>
              <p className="font-heading font-bold text-white text-base">{city.name} · JAZ {jaz}</p>
              <p className="text-white/60 text-xs">{city.avgTemp}°C · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.strompreis} ct/kWh</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-wp-text text-lg">WP-Fachbetrieb in {city.name}</h3>
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

      {/* 6 Qualitätskriterien — volles Fließtext */}
      <div>
        <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">6 Qualitätskriterien in {city.name} — was wichtig ist</h2>
        <div className="space-y-4 text-wp-text2 leading-relaxed">
          <p>
            In <strong className="text-wp-text">{city.name}</strong> ({city.bundesland}) liegt der lokale Strompreis bei <strong className="text-wp-text">{city.strompreis} ct/kWh</strong>. Mit JAZ <strong className="text-wp-text">{jaz}</strong> — dem erwarteten Wert für {city.avgTemp}°C Jahresmitteltemperatur — entstehen WP-Betriebskosten von <strong className="text-wp-text">{fmtEuro(calc.wpKosten)}</strong>/Jahr. Die Gasheizung kostet {fmtEuro(calc.altKosten)}/Jahr — die WP spart <strong className="text-wp-text">{fmtEuro(calc.ersparnis)}/Jahr</strong>.
          </p>
          <div className="bg-wp-greenlt border border-wp-green3/30 rounded-xl p-5">
            <h3 className="font-heading font-semibold text-wp-green text-base mb-2">Betrieb prüfen in {city.name}</h3>
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
        <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80" alt={`${keyword.keyword.replace('[Stadt]', city.name)}`} className="w-full h-52 object-cover" />
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
      city={city} keyword={keyword} calc={calc} foerd={foerd} jaz={jaz} nearby={nearby} h1={h1}
      heroImg="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80"
      heroStats={heroStats}
      {...(isUrgent ? { urgencyBadge: `GEG-Frist ${city.name}: ${gegFristFormatted}` } : {})}
      sections={sections}
    />
  );
}
