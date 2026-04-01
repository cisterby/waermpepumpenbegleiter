// components/programmatic/templates/VergleichTemplate.tsx
// waermepumpe-oder-gas — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash, getDynamicH2s, getSectionIntros, getActualityBlock } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1200&q=75';

export default function VergleichTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const h2s = getDynamicH2s(city, keyword, jaz);
  const si   = getSectionIntros(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);

  // CO2-Preispfad (ETS2 ab 2027)
  const co2Preis2026 = 45; const co2Preis2030 = 120; const co2Preis2035 = 200;
  const gasKosten2026 = calc.altKosten;
  const gasKosten2030 = Math.round(gasKosten2026 * (1 + (co2Preis2030 - co2Preis2026) * 0.0023));
  const gasKosten2035 = Math.round(gasKosten2026 * (1 + (co2Preis2035 - co2Preis2026) * 0.0023));
  const wpWaerme = (city.strompreis / jaz).toFixed(1);

  const KOSTEN_VERGLEICH = [
    { label: 'WP Investition', wp: fmtEuro(foerd.eigenanteil) + ' (nach KfW)', gas: '€4.000–€8.000', hinweis: 'WP nach Förderung oft günstiger' },
    { label: 'Betriebskosten 2026', wp: fmtEuro(calc.wpKosten) + '/J.', gas: fmtEuro(calc.altKosten) + '/J.', hinweis: 'WP ' + fmtEuro(calc.ersparnis) + '/J. günstiger' },
    { label: 'Betriebskosten 2030*', wp: fmtEuro(Math.round(calc.wpKosten * 1.05)) + '/J.', gas: fmtEuro(gasKosten2030) + '/J.', hinweis: 'CO₂-Preis €120/t ab 2030' },
    { label: 'Betriebskosten 2035*', wp: fmtEuro(Math.round(calc.wpKosten * 1.10)) + '/J.', gas: fmtEuro(gasKosten2035) + '/J.', hinweis: 'CO₂-Preis €200/t — ETS2' },
    { label: 'Gesamtkosten 10 J.*', wp: fmtEuro(foerd.eigenanteil + calc.wpKosten * 10), gas: fmtEuro(8000 + (calc.altKosten + gasKosten2030) * 5), hinweis: 'WP klar günstiger ab 2028' },
  ];

  const GEG_FAKTEN = [
    `Seit 01.01.2024: Neue Heizungen müssen 65% erneuerbare Energie nutzen.`,
    `Gas-Brennwert allein ist nicht mehr GEG-konform — nur mit Solar-Hybridlösung.`,
    `${city.einwohner >= 100000 ? `${city.name}: GEG-Pflicht für Bestandsgebäude ab ${city.gegFrist.split('-').reverse().join('.')}` : `${city.name}: GEG-Pflicht für Bestandsgebäude ab 30.06.2028`}`,
    `CO₂-Preis steigt auf ca. €200/t bis 2035 (ETS2) — Gasheizungskosten steigen entsprechend.`,
    `Wärmepumpen erfüllen das GEG zu 100% — ohne Hybridlösung, ohne Einschränkungen.`,
  ];

  const WANN_WP_BESSER = [
    { situation: 'Vorlauftemp. ≤ 55°C', empfehlung: 'WP ideal', detail: 'Standard-WP, JAZ ' + jaz + ', sofortige Amortisation' },
    { situation: 'Altbau mit WP-geeignetem Heizkreis', empfehlung: 'WP gut', detail: 'Hydraulischer Abgleich + WP — JAZ ' + (jaz - 0.2).toFixed(1) + '+' },
    { situation: 'Gasheizung > 15 Jahre alt', empfehlung: 'WP klar', detail: 'Sowieso Ersatz fällig — GEG-konform investieren' },
    { situation: 'Fußbodenheizung vorhanden', empfehlung: 'WP optimal', detail: 'JAZ ' + (jaz + 0.5).toFixed(1) + ', niedrigste Betriebskosten' },
    { situation: 'Gasheizung < 5 Jahre, gut erhalten', empfehlung: 'Gas noch OK', detail: 'Aber: CO₂-Preisrisiko ab 2027 einkalkulieren' },
    { situation: 'Mietimmobilie ohne FBH', empfehlung: 'Abwägen', detail: 'Warmmiete-Thematik und Umlagefähigkeit prüfen' },
  ];

  const intros = [
    `WP vs. Gas ${city.name} — Langfrist: WP-Wärme kostet heute ${wpWaerme} ct/kWh (JAZ ${jaz} × ${city.strompreis} ct/kWh). Gas: ${city.gaspreis} ct/kWh + steigender CO₂-Aufschlag. Ab 2027 (ETS2) kippt die Rechnung noch deutlicher zugunsten WP in ${city.name}.`,
    `Gasheizung in ${city.name} 2026: Betriebskosten ${fmtEuro(calc.altKosten)}/Jahr. WP: ${fmtEuro(calc.wpKosten)}/Jahr — Ersparnis ${fmtEuro(calc.ersparnis)}/Jahr. CO₂-Preis steigt auf €200/t bis 2035 → Gasbetriebskosten ${fmtEuro(gasKosten2035)}/Jahr ab 2035.`,
    `${city.name}: Wärmepumpe Eigenanteil nach ${foerd.gesamtSatz}% KfW: ${fmtEuro(foerd.eigenanteil)}. Gasheizung: €4.000–€8.000. Betrieb WP: ${fmtEuro(calc.wpKosten)}/J. vs. Gas: ${fmtEuro(calc.altKosten)}/J. Amortisation: ${calc.amortisationJahre} Jahre.`,
    `WP oder Gas ${city.name} (${city.bundesland})? Mit ${city.avgTemp}°C Jahresmittel und ${city.normAussentemp}°C Normaußentemperatur erreicht die WP JAZ ${jaz} — Heizkosten ${fmtEuro(calc.wpKosten)}/Jahr statt ${fmtEuro(calc.altKosten)}/Jahr mit Gas.`,
  ];


  const act = getActualityBlock(city, keyword, jaz, calc.wpKosten, foerd.eigenanteil);

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-wp-dark/90 via-wp-dark/70 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-24">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link><span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white">{keyword.keyword.replace(' [Stadt]','')}</Link><span>›</span>
            <span className="text-white/80">{city.name}</span>
          </nav>
          {city.einwohner >= 100000 && (
            <div className="inline-block bg-wp-amber text-wp-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              GEG-Frist {city.name}: {city.gegFrist.split('-').reverse().join('.')}
            </div>
          )}
          <h1 className="font-heading font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
              {/* Preis-Badge — Eigenanteil nach KfW-Förderung */}
              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 bg-wp-amber/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  💰 ab {fmtEuro(foerd.eigenanteil)} Eigenanteil
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  💚 {fmtEuro(calc.ersparnis)}/J. sparen
                </span>
              </div>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
              {/* Ultra-lokale Fakten */}
              <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-6">
                {city.name}: {city.strompreis} ct/kWh Strom · {city.heizgradtage.toLocaleString('de-DE')} Heizgradtage · {city.normAussentemp}°C Normaußentemp. · {city.fernwaermeQuote}% Fernwärme
              </p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: `${wpWaerme} ct/kWh`, label: 'WP-Wärme', sub: 'vs. ' + city.gaspreis + ' ct Gas' },
              { val: fmtEuro(calc.ersparnis) + '/J.', label: 'Ersparnis', sub: 'WP vs. Gas' },
              { val: fmtEuro(gasKosten2030) + '/J.', label: 'Gas 2030*', sub: 'CO₂ €120/t' },
              { val: calc.amortisationJahre + ' J.', label: 'Amortisation', sub: 'WP nach Förderung' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-white">{s.val}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
                <div className="text-white/30 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Kostenloses Angebot →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Snippet */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Was ist günstiger: Wärmepumpe oder Gas in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              In <strong>{city.name}</strong> ({city.avgTemp}°C Jahresmittel) ist die Wärmepumpe heute bereits günstiger: WP-Betriebskosten {fmtEuro(calc.wpKosten)}/Jahr vs. Gas {fmtEuro(calc.altKosten)}/Jahr = <strong>{fmtEuro(calc.ersparnis)}/Jahr Ersparnis</strong>. Ab 2027 steigt der CO₂-Preis (ETS2) und macht Gas noch teurer. Die WP amortisiert sich nach KfW-Förderung ({foerd.gesamtSatz}% = {fmtEuro(foerd.zuschuss)}) in {calc.amortisationJahre} Jahren.
            </p>
          </div>

          {/* Kostenvergleich Tabelle */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              {[
                `Kostenvergleich Wärmepumpe vs. Gas in ${city.name} — 2026 bis 2035`,
                `WP vs. Gas in ${city.name}: Wie entwickeln sich die Kosten bis 2035?`,
                `10-Jahres-Rechnung: WP oder Gasheizung in ${city.name}?`,
                `Langfristvergleich ${city.name}: Wärmepumpe schlägt Gas bis 2035`,
              ][cityHash(city, 4, 120)]}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-x-auto shadow-wp-sm">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    {['Kostenposition', 'Wärmepumpe', 'Gasheizung', 'Hinweis'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KOSTEN_VERGLEICH.map((r, i) => (
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${i === 0 ? 'bg-wp-greenxlt' : ''}`}>
                      <td className="px-3 py-3 font-semibold text-wp-text text-sm">{r.label}</td>
                      <td className="px-3 py-3 font-mono text-wp-green font-bold text-sm">{r.wp}</td>
                      <td className="px-3 py-3 font-mono text-wp-text2 text-sm">{r.gas}</td>
                      <td className="px-3 py-3 text-xs text-wp-text3">{r.hinweis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-wp-text3 mt-2">*Prognose basierend auf EU-ETS2 CO₂-Preispfad. Keine Garantie für zukünftige Preise.</p>
          </div>

          {/* GEG-Fakten */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              {[
                `GEG 2024 — Was für ${city.name} gilt`,
                `Gebäudeenergiegesetz: Was Eigentümer in ${city.name} beachten müssen`,
                `GEG-Pflichten in ${city.name}: Wann und was gilt?`,
                `Heizungspflicht ${city.name}: GEG 2024 im Überblick`,
              ][cityHash(city, 4, 121)]}
            </h2>
            <div className="space-y-2">
              {GEG_FAKTEN.map((f, i) => (
                <div key={i} className="flex gap-3 p-3 bg-white border border-wp-border rounded-lg">
                  <span className="text-wp-green font-bold shrink-0">§</span>
                  <span className="text-wp-text2 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wann ist WP besser */}
          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              {[
                `Wann lohnt sich WP oder Gas in ${city.name}?`,
                `Für wen lohnt sich die Wärmepumpe in ${city.name}?`,
                `WP vs. Gas in ${city.name}: Wer profitiert mehr?`,
                `Fazit für ${city.name}: WP oder Gasheizung — wer gewinnt?`,
              ][cityHash(city, 4, 122)]}
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-wp-bg border-b border-wp-border">
                    {['Situation', 'Empfehlung', 'Detail'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WANN_WP_BESSER.map((r, i) => (
                    <tr key={i} className={`border-b border-wp-border last:border-0 ${r.empfehlung.includes('WP') ? 'bg-wp-greenxlt' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{r.situation}</td>
                      <td className={`px-4 py-3 font-bold text-sm ${r.empfehlung.includes('WP') ? 'text-wp-green' : 'text-wp-text3'}`}>{r.empfehlung}</td>
                      <td className="px-4 py-3 text-wp-text2 text-xs">{r.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* H3 + FAQ */}
          {faqs.length > 0 && (
            <div className="p-5 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
              <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">{h2s.faq}</h2>
            <div className="border border-wp-border rounded-2xl overflow-hidden bg-white shadow-wp-sm mb-10">
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
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">{n.name}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-wp-text text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {(keyword.crossLinks ?? []).map((slug: string) => (
                  <Link key={slug} href={`/${slug}/${city.slug}`}
                    className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                    {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-wp-border rounded-2xl p-5 shadow-wp-sm sticky top-6">
            <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Vergleich 2026</div>
            {[
              ['WP-Betriebskosten', fmtEuro(calc.wpKosten) + '/J.'],
              ['Gas-Betriebskosten', fmtEuro(calc.altKosten) + '/J.'],
              ['Ersparnis/Jahr', fmtEuro(calc.ersparnis)],
              ['WP-Wärme', wpWaerme + ' ct/kWh'],
              ['Gas heute', city.gaspreis + ' ct/kWh'],
              ['Gas 2030*', fmtEuro(gasKosten2030) + '/J.'],
              ['Amortisation WP', calc.amortisationJahre + ' J.'],
            ].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-wp-border last:border-0 text-sm">
                <span className="text-wp-text2">{l}</span>
                <span className="font-bold text-wp-text">{v}</span>
              </div>
            ))}
            <a href="#angebot" className="block mt-4 text-center bg-wp-green text-white font-bold py-3 rounded-xl hover:bg-wp-green2 transition-colors text-sm">Kostenloses Angebot →</a>
          </div>
        </div>
      </div>

      <div id="angebot" className="bg-wp-dark py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Wie bekomme ich 3 kostenlose Angebote für {city.name} — in 2 Minuten?</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
  

      {/* ── VERGLEICH CONTENT ──────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <h2 className="font-heading font-bold text-wp-text text-xl mb-5">
          Wärmepumpe vs. Gas in {city.name} — alle Zahlen im Vergleich
        </h2>
        <div className="prose prose-sm max-w-none text-wp-text2 space-y-4 leading-relaxed">
          <p>
            <strong>Betriebskosten {city.name} 2026:</strong> Wärmepumpe: {fmtEuro(calc.wpKosten)}/Jahr (bei {city.strompreis} ct/kWh, JAZ {jaz}). Gasheizung: {fmtEuro(calc.altKosten)}/Jahr (bei {city.gaspreis} ct/kWh inkl. CO₂-Aufschlag €55/t). Jährliche Ersparnis: {fmtEuro(calc.ersparnis)}. Bis 2030 steigt der CO₂-Preis auf ca. €100/t → weitere €200–300 Mehrkosten/Jahr für Gas.
          </p>
          <p>
            <strong>Amortisation in {city.name}:</strong> Eigenanteil nach {foerd.gesamtSatz}% KfW: {fmtEuro(foerd.eigenanteil)}. Jährliche Ersparnis: {fmtEuro(calc.ersparnis)}. Einfache Amortisation: {Math.round(foerd.eigenanteil / calc.ersparnis)} Jahre. Mit CO₂-Preisanstieg auf €100/t bis 2030: ca. {Math.max(5, Math.round(foerd.eigenanteil / (calc.ersparnis + 300)))} Jahre.
          </p>
          <p>
            <strong>Was der CO₂-Preis für {city.bundesland} bedeutet:</strong> Jede Tonne CO₂ kostet seit 2026 €55. Gasheizungen emittieren ca. 200 g CO₂/kWh → bei 20.000 kWh Jahresverbrauch ca. 4 t CO₂/Jahr. Bei €100/t (2030): ca. €400 Mehrkosten. Bei €150/t (2035): ca. €600 Mehrkosten — jedes Jahr. Eine WP in {city.name} hat kein CO₂-Preisrisiko.
          </p>
          <p>
            <strong>Restwertvergleich:</strong> Eine WP erhöht den Immobilienwert um 10–15% (energieeffizienter Gebäudestandard). Gasheizungen verlieren ab 2030 an Wert durch GEG-Nachrüstpflichten. In {city.name} mit {city.heizgradtage.toLocaleString('de-DE')} Heizgradtagen und steigende Energiepreisen: Langfristig klar für die WP.
          </p>
        </div>
      </div>
      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-heading font-bold text-wp-text text-xl mb-6">
          Was sich 2026 geändert hat — und was das für {city.name} bedeutet
        </h2>
        <div className="space-y-4">

          {/* GEG-Reform */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-wp-text text-sm leading-relaxed">{act.gegReform}</p>
          </div>

          {/* Neue Lärmvorschrift */}
          {['luft-wasser-waermepumpe','luftwaermepumpe','waermepumpe','waermepumpe-kosten','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-kaufen','waermepumpe-nachruesten','heizung-tauschen','waermepumpe-altbau'].includes(keyword.slug) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Neue Lärmvorschrift ab 01.01.2026</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.laerm10db}</p>
            </div>
          )}

          {/* Steuerliche Absetzbarkeit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-installateur','waermepumpe-preise','waermepumpe-installation','heizung-tauschen'].includes(keyword.slug) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.steuerAbsetz}</p>
            </div>
          )}

          {/* KfW-Ergänzungskredit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-preise','erdwaermepumpe','waermepumpe-neubau'].includes(keyword.slug) && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergänzungskredit</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.kfwKredit}</p>
            </div>
          )}

          {/* Wartungskosten */}
          {['waermepumpe-kosten','waermepumpe','waermepumpe-preise','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-fachbetrieb','waermepumpe-kaufen'].includes(keyword.slug) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Wartungs- &amp; Langzeitkosten</p>
              <p className="text-wp-text text-sm leading-relaxed">{act.wartungskosten}</p>
            </div>
          )}

          {/* Finanzierung */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-wp-text text-sm leading-relaxed">{act.finanzierung}</p>
          </div>

        </div>
      </div>
      <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">Gaspreise: BDEW 2026 · CO₂-Prognose: EU-ETS2 · JAZ: Fraunhofer ISE · Stand März 2026</div>
      </div>
    </div>
  );
}
