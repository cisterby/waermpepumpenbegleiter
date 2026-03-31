// components/programmatic/templates/VergleichTemplate.tsx
// waermepumpe-oder-gas — vollständig standalone, 500+ Wörter unique content
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1920&q=80';

export default function VergleichTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const faqs = getRotatingFAQs(keyword.slug, city, calc, foerd, jaz);
  const v = cityHash(city.slug) % 4;

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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.slice(0, 5).map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        <img src={IMG} alt={h1} className="absolute inset-0 w-full h-full object-cover" />
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
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
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
              Kostenvergleich Wärmepumpe vs. Gas in {city.name} — 2026 bis 2035
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
              GEG 2024 — Was für {city.name} gilt
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
              Wann lohnt sich WP oder Gas in {city.name}?
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
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">Häufige Fragen — Wärmepumpe oder Gas {city.name}</h2>
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
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Bis zu 3 Angebote für {city.name} — in 2 Minuten</h2>
          <LeadForm city={city} keyword={keyword} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <AuthorBox city={city} />
        <div className="mt-6 text-xs text-wp-text3">Gaspreise: BDEW 2026 · CO₂-Prognose: EU-ETS2 · JAZ: Fraunhofer ISE · Stand März 2026</div>
      </div>
    </div>
  );
}
