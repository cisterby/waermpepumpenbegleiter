// components/programmatic/templates/AngebotTemplate.tsx
// waermepumpe-angebot — vollständig standalone
'use client';
import Link from 'next/link';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
import { getRotatingFAQs, cityHash } from '@/lib/content-variation';
import LeadForm from '@/components/programmatic/LeadForm';
import AuthorBox from '@/components/programmatic/AuthorBox';

const IMG = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80';

const ANGEBOT_MUSS = [
  { pos: 'Heizlastberechnung DIN EN 12831', pflicht: true, note: 'KfW-Pflicht — ohne diese sofort ablehnen' },
  { pos: 'WP-Gerät: Fabrikat, Modell, Leistung kW', pflicht: true, note: 'Keine Pauschalposition "Wärmepumpe"' },
  { pos: 'Hydraulischer Abgleich Verfahren B', pflicht: true, note: 'KfW-Pflicht — in >60% aller Angebote fehlend' },
  { pos: 'Wärmemengenzähler (neu 2026)', pflicht: true, note: 'KfW-Pflicht ab 2026' },
  { pos: 'KfW-LuL Antragsbegleitung', pflicht: true, note: 'Betrieb muss LuL-registriert sein' },
  { pos: 'Montage & Installation (Stunden)', pflicht: true, note: 'Transparente Kalkulation, nicht Pauschal' },
  { pos: 'Elektroinstallation', pflicht: false, note: 'Oft separat — nachfragen: €500–1.500' },
  { pos: 'Schallschutzgutachten', pflicht: false, note: '+5% KfW wenn 10 dB unter EU-Grenzwert' },
  { pos: 'Gewährleistung & Wartungsvertrag', pflicht: false, note: 'Gesetzl. 2 Jahre — gute Betriebe: 5 Jahre' },
];

const ROTE_FLAGGEN = [
  { signal: 'Kein Heizlastnachweis im Angebot', risiko: 'WP falsch dimensioniert — JAZ 10–20% schlechter, KfW-Antrag abgelehnt' },
  { signal: 'Pauschalpreis ohne Positionsaufschlüsselung', risiko: 'Intransparenz — Vergleich unmöglich, Nachtragsrisiko hoch' },
  { signal: 'Kein hydraulischer Abgleich erwähnt', risiko: 'KfW-Pflicht verletzt — Förderantrag abgelehnt' },
  { signal: 'Betrieb nicht KfW-LuL-registriert', risiko: 'KfW-Antrag nicht möglich — voller Förderverlust bis €21.000' },
  { signal: 'Sehr kurze Gewährleistung (< 2 Jahre)', risiko: 'Gesetzliches Minimum — deutet auf Qualitätsprobleme hin' },
];

const ANGEBOTSVERGLEICH = [
  { frage: 'Wie viele Angebote einholen?', antwort: 'Mind. 3 Angebote für echten Vergleich. Preisunterschiede von 20–40% bei identischer Leistung sind normal.' },
  { frage: 'Was ist eine realistische Lieferzeit?', antwort: 'Kleinstadt: 4–8 Wochen. Großstadt: 6–12 Wochen (höhere Nachfrage). Frühzeitig anfragen!' },
  { frage: 'Wann KfW-Antrag stellen?', antwort: 'Zwingend VOR Auftragserteilung. Antrag nach Baubeginn = keine Förderung. Wir übernehmen das für Sie.' },
  { frage: 'Festpreis oder Kostenvoranschlag?', antwort: 'Für WP-Projekte immer Festpreis verlangen. Kostenvoranschlag ist nicht bindend und kann 15% überschritten werden.' },
];

export default function AngebotTemplate({ city, keyword, calc, foerd, jaz, nearby, h1 }: CityPageRouterProps) {
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);
  const v = cityHash(city, 4);
  const wartezeit = city.einwohner >= 500000 ? '6–12 Wochen' : city.einwohner >= 200000 ? '5–10 Wochen' : '4–8 Wochen';

  const intros = [
    `WP-Angebot ${city.name}: Wartezeit derzeit ${wartezeit}. Wichtigste Regel — KfW-Antrag muss vor Auftragserteilung gestellt sein. ${foerd.gesamtSatz}% Förderung = ${fmtEuro(foerd.zuschuss)} Zuschuss. Wir begleiten den gesamten Prozess kostenlos.`,
    `3 Angebote für ${city.name} einholen: Preisunterschied von 20–40% bei identischer Leistung keine Seltenheit. Entscheidend ist nicht der günstigste Preis, sondern Heizlastberechnung, hydraulischer Abgleich und KfW-LuL-Status im Angebot.`,
    `${city.name} (${city.bundesland}): Für ${foerd.gesamtSatz}% KfW-Förderung muss das Angebot Heizlastberechnung und hydraulischen Abgleich enthalten. Ohne diese wird der Antrag abgelehnt — und ${fmtEuro(foerd.zuschuss)} sind weg.`,
    `Wärmepumpe ${city.name}: JAZ ${jaz} → ${fmtEuro(calc.wpKosten)}/Jahr Betriebskosten. Eigenanteil nach ${foerd.gesamtSatz}% KfW: ${fmtEuro(foerd.eigenanteil)}. Wir prüfen für Sie ob das Angebot alle KfW-Pflichtpositionen enthält.`,
  ];


  return (
    <div className="min-h-screen bg-wp-bg font-sans">
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
              Wartezeit {city.name}: {wartezeit} — jetzt anfragen
            </div>
          )}
          <h1 className="font-heading font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>{h1}</h1>
          <p className="text-white/80 text-base max-w-xl mb-8">{intros[v]}</p>
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { val: 'Bis zu 3', label: 'Angebote', sub: 'Kostenlos vergleichen' },
              { val: wartezeit, label: 'Wartezeit', sub: city.name },
              { val: fmtEuro(foerd.zuschuss), label: 'KfW-Zuschuss', sub: foerd.gesamtSatz + '%' },
              { val: fmtEuro(foerd.eigenanteil), label: 'Eigenanteil', sub: 'Nach Förderung' },
            ].map((s,i) => (
              <div key={i}><div className="text-xl font-extrabold text-white">{s.val}</div>
              <div className="text-white/50 text-xs">{s.label}</div><div className="text-white/30 text-xs">{s.sub}</div></div>
            ))}
          </div>
          <a href="#angebot" className="inline-flex items-center gap-2 bg-wp-green text-white font-bold px-6 py-3 rounded-xl hover:bg-wp-green2 transition-colors">
            Kostenloses Angebot anfordern →
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-3">
              {fillTemplate('Wie bekomme ich ein gutes WP-Angebot in {stadt}?', city, jaz)}
            </h2>
            <p className="text-wp-text2 text-base leading-relaxed">
              Ein gutes WP-Angebot in <strong>{city.name}</strong> enthält zwingend: Heizlastberechnung nach DIN EN 12831, hydraulischer Abgleich Verfahren B (KfW-Pflicht) und KfW-LuL-Antragsbegleitung. Ohne diese drei Positionen wird der KfW-Antrag ({foerd.gesamtSatz}% = {fmtEuro(foerd.zuschuss)}) abgelehnt. Wartezeit derzeit {wartezeit} in {city.name} — frühzeitig anfragen.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              Checkliste: Was muss im WP-Angebot stehen?
            </h2>
            <div className="bg-white border border-wp-border rounded-xl overflow-hidden shadow-wp-sm">
              <table className="w-full text-sm">
                <thead><tr className="bg-wp-bg border-b border-wp-border">
                  {['Position','Pflicht?','Hinweis'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-wp-text3 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {ANGEBOT_MUSS.map((r,i)=>(
                    <tr key={i} className="border-b border-wp-border last:border-0">
                      <td className="px-4 py-3 font-semibold text-wp-text text-sm">{r.pos}</td>
                      <td className="px-4 py-3">{r.pflicht?<span className="text-wp-green font-bold">✅ Pflicht</span>:<span className="text-wp-text3 text-sm">Optional</span>}</td>
                      <td className="px-4 py-3 text-xs text-wp-text2">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-4">
              5 rote Flaggen im WP-Angebot — sofort ablehnen
            </h2>
            <div className="space-y-3">
              {ROTE_FLAGGEN.map((f,i)=>(
                <div key={i} className="flex gap-3 p-4 bg-white border border-red-200 rounded-xl">
                  <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-heading font-semibold text-wp-text text-sm">{f.signal}</div>
                    <div className="text-wp-text2 text-xs mt-0.5">→ {f.risiko}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">
              Angebotsvergleich in {city.name} — häufige Fragen
            </h2>
            <div className="space-y-3">
              {ANGEBOTSVERGLEICH.map((a,i)=>(
                <div key={i} className="p-4 bg-white border border-wp-border rounded-xl">
                  <div className="font-heading font-semibold text-wp-text text-sm mb-1">{a.frage}</div>
                  <p className="text-wp-text2 text-sm leading-relaxed">{a.antwort}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
            <h2 className="font-heading font-bold text-wp-text text-xl mb-4">{city.name} — Angebotsgrundlage</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                [foerd.gesamtSatz+'%','KfW-Förderquote'],
                [fmtEuro(foerd.zuschuss),'KfW-Zuschuss'],
                [fmtEuro(foerd.eigenanteil),'Eigenanteil'],
                [String(jaz),'JAZ in '+city.name],
                [fmtEuro(calc.ersparnis)+'/J.','Ersparnis vs. Gas'],
                [wartezeit,'Wartezeit '+city.name],
              ].map(([v,l],i)=>(
                <div key={i}><div className="text-wp-text3 text-xs">{l}</div><div className="font-bold text-wp-text">{v}</div></div>
              ))}
            </div>
          </div>

          {faqs.length > 0 && (
            <div className="p-5 bg-wp-greenxlt border border-wp-borderl rounded-2xl">
              <h3 className="font-heading font-bold text-wp-text text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-wp-text2 text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          <div>
            <h2 className="font-heading font-bold text-wp-text text-2xl mb-5">Häufige Fragen — WP Angebot {city.name}</h2>
            <div className="border border-wp-border rounded-2xl overflow-hidden bg-white shadow-wp-sm mb-10">
              {faqs.map((faq,i)=>(
                <details key={i} className="group border-b border-wp-border last:border-0">
                  <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none hover:bg-wp-bg/50 transition-colors">
                    <span className="font-heading font-semibold text-wp-text text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className="text-wp-text3 shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="border-t border-wp-border"><p className="px-5 py-4 text-wp-text2 text-sm leading-relaxed">{faq.a}</p></div>
                </details>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div><h3 className="font-heading font-semibold text-wp-text text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">{nearby.map(n=>(
                <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`} className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">{n.name}</Link>
              ))}</div>
            </div>
            <div><h3 className="font-heading font-semibold text-wp-text text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">{(keyword.crossLinks??[]).map((slug:string)=>(
                <Link key={slug} href={`/${slug}/${city.slug}`} className="px-3 py-1.5 bg-white border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                  {slug.replace('waermepumpe','Wärmepumpe').replace(/-/g,' ')} {city.name}
                </Link>
              ))}</div>
            </div>
          </div>
        </div>

        <div><div className="bg-white border border-wp-border rounded-2xl p-5 shadow-wp-sm sticky top-6">
          <div className="text-xs font-bold text-wp-green uppercase tracking-wide mb-3">{city.name} — Angebots-Check</div>
          {[['Wartezeit',wartezeit],['KfW-Zuschuss',fmtEuro(foerd.zuschuss)],['Förderquote',foerd.gesamtSatz+'%'],
            ['Eigenanteil',fmtEuro(foerd.eigenanteil)],['JAZ',String(jaz)],
            ['GEG-Frist',city.gegFrist.split('-').reverse().join('.')]
          ].map(([l,v],i)=>(
            <div key={i} className="flex justify-between py-2 border-b border-wp-border last:border-0 text-sm">
              <span className="text-wp-text2">{l}</span><span className="font-bold text-wp-text">{v}</span>
            </div>
          ))}
          <a href="#angebot" className="block mt-4 text-center bg-wp-green text-white font-bold py-3 rounded-xl hover:bg-wp-green2 transition-colors text-sm">Kostenloses Angebot →</a>
        </div></div>
      </div>

      <div id="angebot" className="bg-wp-dark py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Bis zu 3 Angebote für {city.name} — in 2 Minuten</h2>
          <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <AuthorBox keywordSlug={keyword.slug} />
        <div className="mt-6 text-xs text-wp-text3">KfW BEG 458 · HWK · BWP 2024 · Stand März 2026</div>
      </div>
    </div>
  );
}
