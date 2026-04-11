// components/programmatic/templates/GenericTemplate.tsx
// Vollwertiges Template für alle Tier 2-4 Keywords (17 Keywords × 733 Städte)
// Unique Content durch: city-hash Textvarianten + rotierende Blöcke + keyword-spezifische Sektionen
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, CheckCircle, TrendingDown, Shield, Sun } from 'lucide-react';
import type { CityPageRouterProps } from '@/components/programmatic/CityPageRouter';
import { fillTemplate, getKeywordBySlug } from '@/lib/keywords';
import { fmtEuro } from '@/lib/calculations';
          <div className="space-y-4 cv-auto">
            <div className="flex items-start justify-between gap-4">
              <h2 id="bundesland" className="text-2xl font-bold text-gray-900">Wärmepumpe in {city.bundesland} — {city.name} im Fokus</h2>
              {extendedData?.sectionTimestamps?.bundesland && (
                <span className="inline-flex items-center gap-1 text-xs text-[#3DA16A] bg-[#E8F5E9] px-2 py-0.5 rounded-full whitespace-nowrap">
                  ✓ Aktualisiert: {extendedData.sectionTimestamps.bundesland}
                </span>
              )}
            </div>
            <p className="text-[#4A6358] leading-relaxed">{bundeslandText}</p>
            <p className="text-[#4A6358] leading-relaxed">{gebaeudeText}</p>
          </div>

          {/* Energie & Wirtschaftlichkeit Deep-Dive */}
          <div className="space-y-4 cv-auto">
            <div className="flex items-start justify-between gap-4">
              <h2 id="energiekosten" className="text-2xl font-bold text-gray-900">Energiekosten-Analyse für {city.name}</h2>
              {extendedData?.sectionTimestamps?.energiekosten && (
                <span className="inline-flex items-center gap-1 text-xs text-[#3DA16A] bg-[#E8F5E9] px-2 py-0.5 rounded-full whitespace-nowrap">
                  ✓ Aktualisiert: {extendedData.sectionTimestamps.energiekosten}
                </span>
              )}
            </div>
            <p className="text-[#4A6358] leading-relaxed">{energieText}</p>
            {/* Vergleichstabelle */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1A4731] text-white">
                    {comparison.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row, ri) => (
                    <tr key={ri} className={ri === 0 ? 'bg-emerald-50 font-semibold' : 'bg-white'}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 border-b border-gray-100 text-gray-700">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Inline Rechner — interaktives Widget ── */}
          <div className="my-10">
            <h2 id="rechner" className="text-2xl font-bold text-[#1A4731] mb-4">Wärmepumpen-Rechner für {city.name}</h2>
            <InlineCalculator city={city} jaz={jaz} foerdSatz={foerd.gesamtSatz} />
          </div>

          {/* Kundenstimme */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <span key={i} className="text-[#D97706] text-lg">★</span>
              ))}
            </div>
            <blockquote className="text-gray-700 text-base italic leading-relaxed mb-4">
              „{testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1B5E37] font-bold text-sm">
                {testimonial.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{testimonial.author}</p>
                <p className="text-gray-500 text-xs">{testimonial.location} · Vermittelt über Wärmepumpenbegleiter.de</p>
              </div>
            </div>
          </div>

          {/* Verwandte Themen */}
          {crossLinks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Verwandte Themen für {city.name}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {crossLinks.map((link, i) => (
                  <a key={i} href={link.url} className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-[#1A4731] hover:shadow-sm transition-all group">
                    <p className="font-semibold text-[#1A4731] group-hover:underline text-sm mb-1">{link.anchor}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{link.context}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Inline verlinkte Absätze — natürliche Links im Fließtext */}
          {inlineLinkedParagraph && (
            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Weiterführende Informationen für {city.name}</h2>
              <p className="text-[#4A6358] text-base leading-relaxed [&_a]:text-[#1B5E37] [&_a]:font-semibold [&_a]:underline [&_a]:decoration-[#1B5E37]/30 hover:[&_a]:decoration-[#1B5E37]"
                dangerouslySetInnerHTML={{ __html: inlineLinkedParagraph }} />
            </div>
          )}

          {/* Lokale Tiefenanalyse — einzigartiger datenreicher Absatz */}
          <div className="bg-[#F2FAF5] rounded-2xl p-7 border border-[#D1E7DD]">
            <h2 className="text-xl font-bold text-[#1A4731] mb-3">Lokale Analyse: Wärmepumpe in {city.name}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed">{lokaleTiefenanalyse}</p>
          </div>

          {/* Saisonale Empfehlung */}
          <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#92400E] mb-1">Beste Installationszeit für {city.name}</p>
            <p className="text-[#78350F] text-sm leading-relaxed">{seasonalText}</p>
          </div>

          {/* ── Video-Empfehlung — Engagement-Signal ── */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="relative bg-gradient-to-br from-[#1A4731] to-[#0A1910] aspect-video flex items-center justify-center cursor-pointer group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <p className="text-white font-bold text-sm">{videoData.title}</p>
                <p className="text-white/60 text-xs mt-1">{videoData.duration} Min.</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-[#4A6358] text-sm leading-relaxed">{videoData.description}</p>
            </div>
          </div>

          {/* ── Social Proof Counter — Vertrauenssignal ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-[#1A4731] font-bold text-2xl">{socialProof.anfragenGesamt.toLocaleString('de-DE')}+</p>
                <p className="text-gray-500 text-xs">Anfragen bundesweit</p>
              </div>
              <div>
                <p className="text-[#1A4731] font-bold text-2xl">{socialProof.anfragenStadt}+</p>
                <p className="text-gray-500 text-xs">Anfragen in {city.name}</p>
              </div>
              <div>
                <p className="text-[#D97706] font-bold text-2xl">{socialProof.zufriedenheit}%</p>
                <p className="text-gray-500 text-xs">Zufriedenheit</p>
              </div>
              <div>
                <p className="text-[#3DA16A] font-bold text-2xl">{socialProof.letzteAnfrage}</p>
                <p className="text-gray-500 text-xs">Letzte Anfrage</p>
              </div>
            </div>
          </div>

          {/* ── Keyword-spezifischer Tiefeninhalt ── */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-[#1A4731]">{deepContent.heading}</h2>
            {deepContent.paragraphs.map((p, i) => (
              <p key={i} className="text-[#4A6358] text-base leading-relaxed">{p}</p>
            ))}
          </div>

          {/* ── PV + Wärmepumpe Kombination ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 space-y-5 cv-auto">
            <div className="flex items-start justify-between gap-4">
              <h2 id="pv-kombination" className="text-xl font-bold text-[#1A4731]">{pvWP.title}</h2>
              {extendedData?.sectionTimestamps?.pvKombination && (
                <span className="inline-flex items-center gap-1 text-xs text-[#3DA16A] bg-[#E8F5E9] px-2 py-0.5 rounded-full whitespace-nowrap">
                  ✓ Aktualisiert: {extendedData.sectionTimestamps.pvKombination}
                </span>
              )}
            </div>
            {pvWP.paragraphs.map((p, i) => (
              <p key={i} className="text-[#4A6358] text-sm leading-relaxed">{p}</p>
            ))}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {pvWP.stats.map((s, i) => (
                <div key={i} className="bg-[#F2FAF5] rounded-lg p-3 text-center">
                  <p className="text-[#1A4731] font-bold text-lg">{s.value}</p>
                  <p className="text-[#4A6358] text-xs font-semibold">{s.label}</p>
                  <p className="text-gray-400 text-xs">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Heizkörper-Kompatibilitäts-Check ── */}
          <div className="space-y-4 cv-auto">
            <div className="flex items-start justify-between gap-4">
              <h2 id="heizkoerper" className="text-xl font-bold text-[#1A4731]">{heizkoerper.title}</h2>
              {extendedData?.sectionTimestamps?.heizkoerper && (
                <span className="inline-flex items-center gap-1 text-xs text-[#3DA16A] bg-[#E8F5E9] px-2 py-0.5 rounded-full whitespace-nowrap">
                  ✓ Aktualisiert: {extendedData.sectionTimestamps.heizkoerper}
                </span>
              )}
            </div>
            <p className="text-[#4A6358] text-base leading-relaxed">{heizkoerper.paragraph}</p>
            <div className="grid gap-2">
              {heizkoerper.checklist.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                  item.status === 'ok' ? 'bg-green-50 border-green-200' :
                  item.status === 'pruefen' ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.status === 'ok' ? 'bg-green-100 text-green-700' :
                    item.status === 'pruefen' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'ok' ? '✓' : item.status === 'pruefen' ? '?' : '✗'}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.item}</p>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Nachbarschaftsvergleich ── */}
          {nearby.length > 0 && (
            <div className="space-y-4 cv-auto">
              <div className="flex items-start justify-between gap-4">
                <h2 id="vergleich" className="text-xl font-bold text-[#1A4731]">Regionaler Vergleich: {city.name} vs. Umland</h2>
                {extendedData?.sectionTimestamps?.vergleich && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#3DA16A] bg-[#E8F5E9] px-2 py-0.5 rounded-full whitespace-nowrap">
                    ✓ Aktualisiert: {extendedData.sectionTimestamps.vergleich}
                  </span>
                )}
              </div>
              <p className="text-[#4A6358] text-base leading-relaxed">{nachbarVergleich.paragraph}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1A4731] text-white">
                      {nachbarVergleich.table.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left text-xs font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nachbarVergleich.table.rows.map((row, i) => (
                      <tr key={i} className={i === 0 ? 'bg-[#F2FAF5] font-semibold' : i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-xs text-gray-700 border-b border-gray-100">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Stromtarif-Optimierung ── */}
          <div className="bg-gradient-to-br from-[#1A4731] to-[#0A1910] rounded-2xl p-7 text-white space-y-4 cv-auto">
            <h2 className="text-xl font-bold">Stromkosten senken: WP-Tarife für {city.name}</h2>
            <p className="text-white/80 text-sm leading-relaxed">{stromtarif.paragraph}</p>
            <div className="space-y-2 mt-3">
              {stromtarif.tips.map((t, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2.5">
                  <span className="text-white/90 text-xs">{t.tip}</span>
                  <span className="text-[#D97706] font-bold text-xs whitespace-nowrap ml-3">{t.ersparnis}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── ROI-Timeline (Auszug: 5 Meilensteine) ── */}
          <div className="space-y-4 cv-auto">
            <h2 className="text-xl font-bold text-[#1A4731]">Wirtschaftlichkeit über 20 Jahre in {city.name}</h2>
            <div className="space-y-2">
              {roiTimeline.filter(r => r.highlight).map((r, i) => (
                <div key={i} className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 px-4 py-3">
                  <div className="w-14 text-center">
                    <p className="text-[#1A4731] font-bold text-sm">{r.label}</p>
                    <p className="text-gray-400 text-xs">{r.year}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{r.highlight}</p>
                    <p className="text-xs text-gray-500">
                      WP kumuliert: {fmtEuro(r.wpKumuliert)} · Gas kumuliert: {fmtEuro(r.gasKumuliert)}
                    </p>
                  </div>
                  <div className={`text-right ${r.differenz > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    <p className="font-bold text-sm">{r.differenz > 0 ? '+' : ''}{fmtEuro(r.differenz)}</p>
                    <p className="text-xs">Vorteil WP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── GEG-Countdown — Urgency Signal ── */}
          <div className={`rounded-2xl p-6 border cv-auto ${
            gegCountdown.urgencyLevel === 'kritisch' ? 'bg-red-50 border-red-300' :
            gegCountdown.urgencyLevel === 'dringend' ? 'bg-amber-50 border-amber-300' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                gegCountdown.urgencyLevel === 'kritisch' ? 'bg-red-600 text-white' :
                gegCountdown.urgencyLevel === 'dringend' ? 'bg-amber-600 text-white' :
                'bg-blue-600 text-white'
              }`}>{gegCountdown.badge}</span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed">{gegCountdown.message}</p>
          </div>

          {/* ── Praxisbeispiel / Case Study ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 space-y-4 cv-auto">
            <h2 className="text-xl font-bold text-[#1A4731]">{caseStudy.title}</h2>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{caseStudy.building}</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-[#7A9E8E] uppercase tracking-wider mb-1">Ausgangslage</p>
                <p className="text-[#4A6358] text-sm leading-relaxed">{caseStudy.situation}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#7A9E8E] uppercase tracking-wider mb-1">Lösung</p>
                <p className="text-[#4A6358] text-sm leading-relaxed">{caseStudy.solution}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#7A9E8E] uppercase tracking-wider mb-1">Ergebnis</p>
                <p className="text-[#4A6358] text-sm leading-relaxed">{caseStudy.result}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
              {caseStudy.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-[#1A4731] font-bold text-lg">{s.value}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Finanzierungsoptionen ── */}
          <div className="space-y-4 cv-auto">
            <h2 className="text-xl font-bold text-[#1A4731]">{finanzierung.title}</h2>
            <div className="grid gap-3">
              {finanzierung.options.map((opt, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-[#3DA16A]/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#1C2B2B] text-sm">{opt.name}</h3>
                    <span className="text-[#D97706] font-bold text-sm whitespace-nowrap">{opt.monatlich}</span>
                  </div>
                  <p className="text-[#4A6358] text-xs leading-relaxed mb-1">{opt.detail}</p>
                  <p className="text-gray-400 text-xs">Geeignet für: {opt.geeignet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Wartung & Langzeitkosten ── */}
          <div className="space-y-4 cv-auto">
            <h2 className="text-xl font-bold text-[#1A4731]">{wartung.title}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed">{wartung.paragraph}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1A4731] text-white">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold">Posten</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold">Intervall</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold">Kosten</th>
                  </tr>
                </thead>
                <tbody>
                  {wartung.kostenTabelle.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-2.5 text-gray-700 text-xs">{row.posten}</td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs">{row.intervall}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700 text-xs font-semibold">{row.kosten}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Garantie-Vergleich ── */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1A4731]">{garantie.title}</h2>
            <p className="text-[#4A6358] text-base leading-relaxed">{garantie.paragraph}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1A4731] text-white">
                    <th className="px-3 py-2.5 text-left text-xs font-semibold">Hersteller</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold">Gerät</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold">Verdichter</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold">Tipp</th>
                  </tr>
                </thead>
                <tbody>
                  {garantie.vergleich.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-3 py-2.5 text-gray-900 text-xs font-semibold">{row.hersteller}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700 text-xs">{row.geraet}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700 text-xs">{row.verdichter}</td>
                      <td className="px-3 py-2.5 text-gray-500 text-xs">{row.tipp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Lärmschutz ── */}
          <div className="bg-[#F0F7FF] rounded-2xl p-6 border border-blue-200 space-y-3">
            <h2 className="text-xl font-bold text-[#1A4731]">{laermschutz.title}</h2>
            <p className="text-[#4A6358] text-sm leading-relaxed">{laermschutz.paragraph}</p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/80 text-gray-700 text-xs px-3 py-1.5 rounded-lg border border-blue-100">📏 {laermschutz.abstand}</span>
              <span className="bg-white/80 text-gray-700 text-xs px-3 py-1.5 rounded-lg border border-blue-100">💡 {laermschutz.tipp}</span>
            </div>
          </div>

          {/* Quellenangaben & Datengrundlage — E-E-A-T Trust Signal */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-8">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Quellenangaben & Datengrundlage</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-500">
              <span>• Strompreis {city.name}: Verivox/CHECK24, Stand 03/2026</span>
              <span>• Heizgradtage: Deutscher Wetterdienst (DWD)</span>
              <span>• KfW-Förderung: BEG Programm 458, Stand 01/2026</span>
              <span>• JAZ-Berechnung: VDI 4650 Blatt 1</span>
              <span>• GEG-Fristen: §71 GEG i.d.F. vom 01.01.2024</span>
              <span>• CO₂-Preis: BEHG §10, Brennstoffemissionshandel</span>
            </div>
          </div>

          {/* H3 Featured Snippet */}
          {faqs.length > 0 && (
            <div className="mb-6 p-5 bg-[#F2FAF5] border border-gray-200l rounded-2xl">
              <h3 className="font-bold text-[#1C2B2B] text-lg mb-2">{faqs[0].q}</h3>
              <p className="text-[#4A6358] text-sm leading-relaxed">{faqs[0].a}</p>
            </div>
          )}

          {/* ── Methodik & Datenquellen ── */}
          {extendedData?.methodologyExplainer && (
            <section className="bg-gradient-to-br from-[#F0FDF4] to-white rounded-2xl border border-[#BBF7D0] p-6 lg:p-8 mb-8">
              <h2 id="methodik" className="font-heading font-bold text-[#1C2B2B] text-xl lg:text-2xl mb-4">
                {extendedData.methodologyExplainer.heading}
              </h2>
              {extendedData.methodologyExplainer.paragraphs.map((p, i) => (
                <p key={i} className="text-[#4A6358] text-sm leading-relaxed mb-3">{p}</p>
              ))}
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {extendedData.methodologyExplainer.standards.map((s, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="font-semibold text-[#1C2B2B] text-xs mb-1">{s.name}</div>
                    <div className="text-[#7A9E8E] text-xs">{s.description}</div>
                  </div>
                ))}
              </div>
              <p className="text-[#7A9E8E] text-xs mt-4 italic">{extendedData.methodologyExplainer.disclaimer}</p>
            </section>
          )}

          {/* FAQ */}
          <h2 id="faq" className="font-bold text-[#1C2B2B] mb-5 mt-10" style={{ fontSize: 'clamp(20px,2.5vw,30px)' }}>
            {h2s.faq}
          </h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-8">
            {faqs.map((faq, i) => (
              <details key={i} className="group border-b border-gray-200 last:border-0">
                <summary className="w-full flex items-center justify-between gap-3 px-5 py-4 min-h-[48px] cursor-pointer list-none hover:bg-[#F8F9FA]/50 transition-colors">
                  <span className="font-semibold text-[#1C2B2B] text-sm leading-snug">{faq.q}</span>
                  <ChevronDown size={16} className="text-[#7A9E8E] shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="border-t border-gray-200">
                  <p className="px-5 py-4 text-[#4A6358] text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          {/* Nachbarstädte + Cross-Links */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Region {city.bundesland}</h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug} href={`/${keyword.slug}/${n.slug}`}
                    className="px-4 py-2.5 min-h-[44px] flex items-center bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#1C2B2B] text-base mb-3">Weitere Themen</h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw2 => kw2 && (
                  <Link key={kw2.slug} href={`/${kw2.slug}/${city.slug}`}
                    className="px-4 py-2.5 min-h-[44px] flex items-center bg-white border border-gray-200 rounded-lg text-sm text-[#4A6358] hover:text-[#1A4731] hover:border-[#1A4731] transition-colors">
                    {kw2.keyword.replace('[Stadt]', city.name)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Sticky */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-[#1A4731] rounded-2xl p-6 shadow-2xl">
            {enhancedCta.urgencyBadge && (
              <span className="inline-block bg-[#D97706] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{enhancedCta.urgencyBadge}</span>
            )}
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">{enhancedCta.headline}</p>
            <p className="font-mono font-bold text-white text-4xl leading-none mb-0.5">{fmtEuro(calc.ersparnis)}</p>
            <p className="text-white/75 text-xs mb-5">{enhancedCta.subline}</p>
            <div className="space-y-2 mb-5">
              {[
                { l: 'Heizkosten heute', v: fmtEuro(calc.altKosten) + '/J', c: 'text-[#D97706]' },
                { l: 'Mit Wärmepumpe', v: fmtEuro(calc.wpKosten) + '/J', c: 'text-[#3DA16A]' },
                { l: 'KfW-Zuschuss', v: fmtEuro(foerd.zuschuss), c: 'text-white' },
                { l: 'Eigenanteil', v: fmtEuro(foerd.eigenanteil), c: 'text-white' },
                { l: 'Amortisation', v: calc.amortisationJahre + ' Jahre', c: 'text-[#D97706]' },
              ].map(r => (
                <div key={r.l} className="flex justify-between py-1.5 border-b border-white/8">
                  <span className="text-white/80 text-xs">{r.l}</span>
                  <span className={`font-mono font-bold text-xs ${r.c}`}>{r.v}</span>
                </div>
              ))}
            </div>
            <a href="/rechner"
              className="flex items-center justify-center gap-2 w-full min-h-[48px] py-3.5 bg-[#D97706] text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors mb-2">
              {enhancedCta.button} <ArrowRight size={15} />
            </a>
            <p className="text-white/70 text-xs text-center">Kostenlos · Unverbindlich · Kein Spam</p>
          </div>

          <div className="px-6 pb-8">
            <LeadForm city={city} keywordSlug={keyword.slug} citySlug={city.slug} />
          </div>

      {/* ── AKTUALITÄTSBLOCK 2026 ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-bold text-[#1C2B2B] text-xl mb-6">
          Was sich 2026 geändert hat — und was das für {city.name} bedeutet
        </h2>
        <div className="space-y-4">

          {/* GEG-Reform */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">GEG-Reform 2026</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.gegReform}</p>
          </div>

          {/* Neue Lärmvorschrift */}
          {['luft-wasser-waermepumpe','luftwaermepumpe','waermepumpe','waermepumpe-kosten','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-kaufen','waermepumpe-nachruesten','heizung-tauschen','waermepumpe-altbau'].includes(keyword.slug) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Neue Lärmvorschrift ab 01.01.2026</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.laerm10db}</p>
            </div>
          )}

          {/* Steuerliche Absetzbarkeit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-installateur','waermepumpe-preise','waermepumpe-installation','heizung-tauschen'].includes(keyword.slug) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Steuerliche Absetzbarkeit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.steuerAbsetz}</p>
            </div>
          )}

          {/* KfW-Ergänzungskredit */}
          {['waermepumpe-foerderung','waermepumpe-kosten','waermepumpe','waermepumpe-preise','erdwaermepumpe','waermepumpe-neubau'].includes(keyword.slug) && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">KfW-Ergänzungskredit</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.kfwKredit}</p>
            </div>
          )}

          {/* Wartungskosten */}
          {['waermepumpe-kosten','waermepumpe','waermepumpe-preise','waermepumpe-installateur','waermepumpe-installation','waermepumpe-montage','waermepumpe-fachbetrieb','waermepumpe-kaufen'].includes(keyword.slug) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Wartungs- &amp; Langzeitkosten</p>
              <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.wartungskosten}</p>
            </div>
          )}

          {/* Finanzierung */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Finanzierungsoptionen</p>
            <p className="text-[#1C2B2B] text-sm leading-relaxed">{act.finanzierung}</p>
          </div>

        </div>
      </div>
          <AuthorBox keywordSlug={keyword.slug} />

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            <p className="text-xs font-bold text-[#7A9E8E] uppercase tracking-wider mb-3">Warum Wärmepumpenbegleiter?</p>
            {['Herstellerunabhängig', 'HWK-geprüfte Betriebe', 'KfW-Begleitung inklusive', `Lokal in ${city.name}`, '100% kostenlos'].map(t => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-gray-200 last:border-0 text-xs text-[#4A6358]">
                <CheckCircle size={12} className="text-[#1A4731] shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
