// components/templates/GenericTemplate.tsx
// ============================================================
// Fallback-Template für alle Tier 2–4 Keywords
// Zeigt alle wichtigen Infos (Rechner, Förderung, FAQ, Nachbarstädte)
// ohne keyword-spezifische Besonderheiten.
// Wird schrittweise durch spezialisierte Templates ersetzt.
// ============================================================
'use client'

import Link from 'next/link'
import type { TemplateProps } from '@/lib/types/TemplateProps'
import { fillTemplate } from '@/lib/keywords'
import { fmtEuro } from '@/lib/calculations'
import { useState } from 'react'

export default function GenericTemplate({ city, keyword, jaz, calc, foerd, h1, nearby, variant }: TemplateProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [fl, setFl] = useState(120)

  // Breadcrumb
  const breadcrumbs = [
    { label: 'Startseite', href: '/' },
    { label: keyword.keyword.replace('[Stadt]', '').trim(), href: `/${keyword.slug}` },
    { label: city.name, href: `/${keyword.slug}/${city.slug}` },
  ]

  // Intro-Textvarianten (deterministisch per variant-Index)
  const intros = [
    `In ${city.name} setzen immer mehr Hausbesitzer auf Wärmepumpen — und das aus gutem Grund.`,
    `Sie wohnen in ${city.name} und denken über eine Wärmepumpe nach? Hier finden Sie alle wichtigen Informationen.`,
    `${city.name} (${city.bundesland}): Bei ${city.avgTemp}°C Jahresmitteltemperatur erreicht eine Luft-Wasser-WP eine JAZ von ca. ${jaz}.`,
    `Die Heizungswende ist in ${city.name} in vollem Gange. Wir begleiten Sie durch die Entscheidung — kostenlos und herstellerunabhängig.`,
  ]
  const introText = intros[variant]

  // FAQ mit stadtspezifischen Variablen
  const faqs = keyword.faqPool.slice(0, 5).map(item => ({
    q: fillTemplate(item.q, city, jaz, calc.wpKosten, calc.ersparnis),
    a: fillTemplate(item.a, city, jaz, calc.wpKosten, calc.ersparnis),
  }))

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#F8F9FA', color: '#111827' }}>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs.map((b, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: b.label,
                item: `https://waermepumpenbegleiter.de${b.href}`,
              })),
            },
            {
              '@type': 'Service',
              name: `Wärmepumpe Installation in ${city.name}`,
              description: `Kostenlose Vermittlung an geprüfte Wärmepumpen-Installateure in ${city.name}`,
              areaServed: { '@type': 'City', name: city.name },
              provider: { '@type': 'Organization', name: 'Wärmepumpenbegleiter.de' },
              serviceType: 'Wärmepumpen-Vermittlung',
            },
            {
              '@type': 'FAQPage',
              mainEntity: faqs.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            },
            {
              '@type': 'LocalBusiness',
              name: `Wärmepumpen-Beratung ${city.name}`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: city.name,
                addressRegion: city.bundesland,
                postalCode: city.plz,
                addressCountry: 'DE',
              },
              geo: { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng },
              url: `https://waermepumpenbegleiter.de/${keyword.slug}/${city.slug}`,
              openingHours: 'Mo-Fr 08:00-18:00',
            },
          ],
        })}}
      />

      {/* HEADER */}
      <div style={{ background: '#1B5E37', padding: '88px 0 56px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
            <ol style={{ display: 'flex', gap: 8, alignItems: 'center', listStyle: 'none', flexWrap: 'wrap' }}>
              {breadcrumbs.map((b, i) => (
                <li key={b.href} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {i > 0 && <span style={{ color: 'rgba(255,255,255,.35)', fontSize: 13 }}>›</span>}
                  {i < breadcrumbs.length - 1
                    ? <Link href={b.href} style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>{b.label}</Link>
                    : <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)' }}>{b.label}</span>
                  }
                </li>
              ))}
            </ol>
          </nav>

          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,.12)', color: 'rgba(255,255,255,.8)', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 100, marginBottom: 16 }}>
            {city.bundesland}
          </span>

          {/* H1 für Featured Snippets */}
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px,4vw,54px)', color: 'white', lineHeight: 1.15, marginBottom: 16 }}>
            {h1}
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,.7)', maxWidth: 600, lineHeight: 1.7, marginBottom: 28 }}>
            {introText}
          </p>

          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Jahresarbeitszahl', val: jaz.toString(), unit: 'JAZ' },
              { label: 'Heizgradtage', val: city.heizgradtage.toLocaleString('de-DE'), unit: 'Kd/a' },
              { label: 'Ø Temperatur', val: city.avgTemp + '°C', unit: 'Jahresmittel' },
              { label: 'Strompreis lokal', val: city.strompreis + ' ct', unit: 'pro kWh' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.1)', borderRadius: 10, padding: '12px 16px', minWidth: 120 }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700, color: '#4CAF7D', marginBottom: 2 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)' }}>{s.unit} · {s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

          {/* LEFT — Content */}
          <div>
            {/* Featured Snippet: Erste Frage direkt beantwortet */}
            {keyword.featuredSnippetQuestions[0] && (
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '24px 28px', marginBottom: 28, borderLeft: '4px solid #1B5E37' }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                  {fillTemplate(keyword.featuredSnippetQuestions[0], city, jaz)}
                </h2>
                <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.7 }}>
                  Eine {keyword.slug.includes('altbau') ? 'Luft-Wasser-' : ''}Wärmepumpe kostet in {city.name} inklusive Installation zwischen <strong>€18.000 und €28.000</strong>. Nach KfW-Förderung (typisch 50–55%) reduziert sich Ihr Eigenanteil auf <strong>{fmtEuro(foerd.eigenanteil)}</strong>. Die jährliche Ersparnis gegenüber Erdgas beträgt in {city.name} bei einem 120 m² EFH ca. <strong>{fmtEuro(calc.ersparnis)} pro Jahr</strong>.
                </p>
              </div>
            )}

            {/* Stadtspezifische Klimainfo */}
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
              Wärmepumpe in {city.name} — stadtspezifische Effizienz
            </h2>
            <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.75, marginBottom: 20 }}>
              {city.name} liegt in {city.bundesland} mit einer Jahresmitteltemperatur von <strong>{city.avgTemp}°C</strong> und {city.heizgradtage} Heizgradtagen pro Jahr.
              Eine Luft-Wasser-Wärmepumpe erreicht hier eine Jahresarbeitszahl (JAZ) von ca. <strong>{jaz}</strong> —
              das bedeutet: aus 1 kWh Strom werden {jaz} kWh Wärme erzeugt.
            </p>
            <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.75, marginBottom: 28 }}>
              Bei einem typischen Einfamilienhaus (120 m², Baujahr 1980–1994) fallen in {city.name} mit dem lokalen Strompreis von <strong>{city.strompreis} ct/kWh</strong> jährlich
              ca. <strong>{fmtEuro(calc.wpKosten)}</strong> Heizkosten an — gegenüber <strong>{fmtEuro(calc.altKosten)}</strong> mit einer Gasheizung.
              Das entspricht einer Ersparnis von <strong>{fmtEuro(calc.ersparnis)} pro Jahr</strong>.
            </p>

            {/* CO₂-Ersparnis */}
            <div style={{ background: '#E8F5EE', border: '1px solid #4CAF7D', borderRadius: 10, padding: '16px 20px', marginBottom: 28, display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}>🌿</span>
              <div>
                <div style={{ fontWeight: 600, color: '#1B5E37', marginBottom: 3 }}>CO₂-Ersparnis in {city.name}</div>
                <div style={{ fontSize: 14, color: '#2A7D4F' }}>
                  Sie sparen ca. <strong>{calc.co2Ersparnis} Tonnen CO₂ pro Jahr</strong> — das entspricht {Math.round(calc.co2Ersparnis * 4.5)} Autofahrten von {city.name} nach München und zurück.
                </div>
              </div>
            </div>

            {/* Weitere Featured-Snippet-Fragen als H3 */}
            {keyword.featuredSnippetQuestions.slice(1).map((q, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 19, fontWeight: 600, marginBottom: 8, color: '#111827' }}>
                  {fillTemplate(q, city, jaz)}
                </h3>
                <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.7 }}>
                  {/* Antwort aus FAQ-Pool wenn vorhanden */}
                  {faqs[i + 1]?.a ?? `Erfahren Sie mehr zu diesem Thema von unseren geprüften Fachbetrieben in ${city.name}.`}
                </p>
              </div>
            ))}

            {/* Förderung in Bundesland */}
            {city.bundeslandFoerderung && (
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '24px 28px', marginTop: 28, marginBottom: 28 }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                  Förderung in {city.bundesland}
                </h3>
                <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.7, marginBottom: 12 }}>
                  Zusätzlich zur KfW-Bundesförderung gibt es in {city.bundesland} das Programm <strong>„{city.bundeslandFoerderung}"</strong>{city.bundeslandFoerderungBetrag ? ` mit ${city.bundeslandFoerderungBetrag}` : ''}.
                </p>
                {city.bundeslandFoerderungUrl && (
                  <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 14, color: '#1B5E37', fontWeight: 600, textDecoration: 'none' }}>
                    Mehr erfahren → {city.bundeslandFoerderungUrl}
                  </a>
                )}
              </div>
            )}

            {/* FAQ */}
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 20, marginTop: 8 }}>
              Häufige Fragen zur Wärmepumpe in {city.name}
            </h2>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', background: 'white', marginBottom: 36 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>{faq.q}</span>
                    <span style={{ fontSize: 18, color: '#9CA3AF', flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : '', transition: 'transform .2s', display: 'inline-block' }}>▾</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 20px 16px', fontSize: 15, color: '#4B5563', lineHeight: 1.7 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Nachbarstädte */}
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 14 }}>
              Wärmepumpe in der Region {city.bundesland}
            </h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {nearby.map(n => (
                <Link key={n.slug}
                  href={`/${keyword.slug}/${n.slug}`}
                  style={{ padding: '8px 14px', background: '#E8F5EE', color: '#1B5E37', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(27,94,55,.15)' }}>
                  {keyword.keyword.replace('[Stadt]', n.name)}
                </Link>
              ))}
            </div>

            {/* Cross-Keyword-Links */}
            <div style={{ marginTop: 28 }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
                Weitere Themen für {city.name}
              </h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {keyword.crossLinks.map(slug => {
                  const kw = require('@/lib/keywords').getKeywordBySlug(slug)
                  if (!kw) return null
                  return (
                    <Link key={slug}
                      href={`/${slug}/${city.slug}`}
                      style={{ padding: '8px 14px', background: 'white', color: '#4B5563', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid #E5E7EB' }}>
                      {kw.keyword.replace('[Stadt]', city.name)}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — Sticky CTA */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ background: '#1B5E37', borderRadius: 16, padding: 28, boxShadow: '0 8px 40px rgba(27,94,55,.2)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 5 }}>Jährliche Ersparnis in {city.name}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 42, fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 4 }}>{fmtEuro(calc.ersparnis)}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 20 }}>gegenüber Erdgas · 120 m² EFH</div>

              <div style={{ background: 'rgba(255,255,255,.1)', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
                {[
                  { l: 'Heizkosten heute',      v: fmtEuro(calc.altKosten) + '/Jahr', c: '#F59E0B' },
                  { l: 'Mit Wärmepumpe',        v: fmtEuro(calc.wpKosten) + '/Jahr',  c: '#4CAF7D' },
                  { l: 'KfW-Zuschuss (50%)',    v: fmtEuro(foerd.zuschuss),            c: 'white'   },
                  { l: 'Ihr Eigenanteil',       v: fmtEuro(foerd.eigenanteil),         c: 'white'   },
                  { l: 'Amortisation',          v: calc.amortisationJahre + ' Jahre',  c: 'white'   },
                ].map(r => (
                  <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.55)' }}>{r.l}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>

              <a href="/rechner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', background: '#D97706', color: 'white', borderRadius: 10, fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 600, textDecoration: 'none', marginBottom: 10 }}>
                Kostenloses Angebot in {city.name} →
              </a>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', textAlign: 'center', lineHeight: 1.5 }}>
                Kostenlos & unverbindlich · Bis zu 3 lokale Fachbetriebe · Kein Spam
              </p>
            </div>

            {/* Vertrauen-Badges */}
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Warum Wärmepumpenbegleiter?</div>
              {[
                '✓ Herstellerunabhängig seit 2025',
                '✓ Alle Betriebe HWK-geprüft',
                '✓ KfW-Antrag-Begleitung inklusive',
                '✓ Lokale Meisterbetriebe in ' + city.name,
                '✓ 100% kostenlos für Hausbesitzer',
              ].map(t => (
                <div key={t} style={{ fontSize: 13, color: '#4B5563', padding: '5px 0', borderBottom: '1px solid #F3F4F6' }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
