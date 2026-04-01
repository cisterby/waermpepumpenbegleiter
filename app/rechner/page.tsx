'use client'


import { useState } from 'react'

const BEDARF: Record<string, number> = {
  vor_1918: 250, '1919_1948': 194, '1949_1968': 210,
  '1969_1978': 190, '1979_1994': 148, '1995_2009': 101, '2010_plus': 72,
}
const PREIS  = { erdgas: 0.12, heizoel: 0.11, nachtspeicher: 0.32 }
const WG     = { erdgas: 0.92, heizoel: 0.90, nachtspeicher: 0.98 }

function calcAll(fl: number, hz: keyof typeof PREIS, bj: string, opts: {
  eigennutzer: boolean, altFossil: boolean, einkommenBonus: boolean, r290: boolean
}) {
  const bedarf = fl * ((BEDARF[bj] || 160) + 12.5)
  const alt    = Math.round(bedarf / WG[hz] * PREIS[hz])
  const wp     = Math.round(bedarf / 3.5 * 0.27)
  const ers    = alt - wp
  let rate = 0.30
  if (opts.r290) rate += 0.05
  if (opts.altFossil && opts.eigennutzer) rate += 0.20
  if (opts.einkommenBonus && opts.eigennutzer) rate += 0.30
  rate = Math.min(rate, 0.70)
  const zuschuss   = Math.round(Math.min(25000, 30000) * rate)
  const eigenanteil = Math.round(25000 - zuschuss)
  const amort      = Math.round((eigenanteil / (ers + 200)) * 10) / 10
  return { alt, wp, ers, rate: Math.round(rate * 100), zuschuss, eigenanteil, amort }
}

function fmt(n: number) { return '\u20AC\u202F' + Math.round(n).toLocaleString('de-DE') }

function Toggle({ label, sub, value, onChange }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #EEE9E2', cursor: 'pointer' }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 500, color: '#1C2B25' }}>{label}</div>
        {sub && <div style={{ fontSize: 13, color: '#7A9E8E', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0, marginLeft: 16,
        background: value ? '#1A4731' : '#DDD8CF', transition: 'background .2s', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18,
          background: 'white', borderRadius: '50%', transition: 'left .2s',
          boxShadow: '0 1px 4px rgba(0,0,0,.2)',
        }}/>
      </div>
    </div>
  )
}

export default function Rechner() {
  const [flaeche, setFlaeche] = useState(120)
  const [hz,      setHz]      = useState('erdgas' as 'erdgas' | 'heizoel' | 'nachtspeicher')
  const [bj,      setBj]      = useState('1979_1994')
  const [typ,     setTyp]     = useState('einfamilienhaus')
  const [plz,     setPlz]     = useState('')
  const [eigen,   setEigen]   = useState(true)
  const [altFos,  setAltFos]  = useState(true)
  const [eink,    setEink]    = useState(false)
  const [r290,    setR290]    = useState(false)

  const r = calcAll(flaeche, hz, bj, { eigennutzer: eigen, altFossil: altFos, einkommenBonus: eink, r290 })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#F6F3EE;color:#1C2B25}
        h1,h2,h3{font-family:'Cormorant Garamond',serif}
        .c{max-width:1200px;margin:0 auto;padding:0 40px}
        select,input[type=text]{width:100%;padding:11px 16px;border:1px solid #DDD8CF;border-radius:8px;background:white;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;color:#1C2B25;outline:none;transition:border-color .2s}
        select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234A6358' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
        select:focus,input[type=text]:focus{border-color:#1A4731}
        input[type=range]{flex:1;-webkit-appearance:none;height:4px;background:#DDD8CF;border-radius:4px;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:#1A4731;border-radius:50%;box-shadow:0 2px 8px rgba(26,71,49,.35)}
        .lbl{display:block;font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#7A9E8E;margin-bottom:8px}
        .card{background:white;border:1px solid rgba(26,71,49,.1);border-radius:14px;padding:28px;margin-bottom:20px}
        .card-title{font-size:18px;font-weight:600;margin-bottom:20px;color:#1C2B25;border-bottom:1px solid #EEE9E2;padding-bottom:14px;font-family:'Cormorant Garamond',serif}
        .fg{margin-bottom:20px}
        @media(max-width:900px){.mg{grid-template-columns:1fr!important}.c{padding:0 20px}}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: '#1A3728', padding: '90px 0 56px' }}>
        <div className="c">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
            <a href="/" style={{ fontSize: 13, color: 'rgba(240,250,244,.45)', textDecoration: 'none' }}>Startseite</a>
            <span style={{ color: 'rgba(240,250,244,.25)' }}>›</span>
            <span style={{ fontSize: 13, color: 'rgba(240,250,244,.7)' }}>Rechner</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#4CAF7D', display: 'block', marginBottom: 12 }}>Kostenloses Tool</span>
          <h1 style={{ color: '#F0FAF4', fontSize: 'clamp(38px,5vw,60px)', marginBottom: 14 }}>Wärmepumpen-Rechner</h1>
          <p style={{ fontSize: 18, color: 'rgba(240,250,244,.6)', maxWidth: 540 }}>Betriebskosten, KfW-Förderung und Amortisation — individuell für Ihr Gebäude berechnet.</p>
        </div>
      </div>

      {/* ── HERO IMAGE STRIP ── */}
      <div style={{ height: 260, overflow: 'hidden', position: 'relative' }}>
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80"
          alt="Modernes Haus mit Wärmepumpe"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,55,40,.15), rgba(246,243,238,1))' }}/>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="c" style={{ paddingBottom: 80, marginTop: -32 }}>
        <div className="mg" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>

          {/* LEFT — inputs */}
          <div>
            {/* Gebäude */}
            <div className="card">
              <div className="card-title">Ihr Gebäude</div>
              <div className="fg">
                <label className="lbl">Wohnfläche</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <input type="range" min={60} max={400} step={5} value={flaeche} onChange={e => setFlaeche(+e.target.value)}/>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 15, fontWeight: 700, color: '#1A4731', minWidth: 72, textAlign: 'right' }}>{flaeche} m²</span>
                </div>
              </div>
              <div className="fg">
                <label className="lbl">Gebäudetyp</label>
                <select value={typ} onChange={e => setTyp(e.target.value)}>
                  <option value="einfamilienhaus">Einfamilienhaus</option>
                  <option value="reihenhaus">Reihenhaus</option>
                  <option value="doppelhaushaelfte">Doppelhaushälfte</option>
                  <option value="mehrfamilienhaus">Mehrfamilienhaus</option>
                </select>
              </div>
              <div className="fg">
                <label className="lbl">Baujahr Gebäude</label>
                <select value={bj} onChange={e => setBj(e.target.value)}>
                  <option value="vor_1918">vor 1918 (unrenovierter Altbau)</option>
                  <option value="1919_1948">1919 – 1948</option>
                  <option value="1949_1968">1949 – 1968</option>
                  <option value="1969_1978">1969 – 1978 (vor 1. WSchVO)</option>
                  <option value="1979_1994">1979 – 1994</option>
                  <option value="1995_2009">1995 – 2009</option>
                  <option value="2010_plus">2010 und neuer</option>
                </select>
              </div>
              <div className="fg">
                <label className="lbl">Aktuelle Heizung</label>
                <select value={hz} onChange={e => setHz(e.target.value as any)}>
                  <option value="erdgas">Erdgas-Brennwert</option>
                  <option value="heizoel">Heizöl</option>
                  <option value="nachtspeicher">Nachtspeicher (Strom)</option>
                </select>
              </div>
              <div className="fg" style={{ marginBottom: 0 }}>
                <label className="lbl">PLZ (für regionale Preise)</label>
                <input type="text" maxLength={5} placeholder="z.B. 10115" value={plz} onChange={e => setPlz(e.target.value.replace(/\D/g, ''))}/>
              </div>
            </div>

            {/* Förderung */}
            <div className="card">
              <div className="card-title">Ihre Fördersituation</div>
              [Toggle label="Ich nutze das Gebäude selbst" sub="Eigennutzer erhalten höhere Boni als Vermieter" value={eigen} onChange={setEigen}|]
              [Toggle label="Ich ersetze eine fossile Heizung" sub="Öl, Gas oder Kohle → +20% Klima-Speed-Bonus" value={altFos} onChange={setAltFos}|]
              [Toggle label="Haushaltseinkommen unter €40.000 netto|Jahr" sub="Einkommens-Bonus +30% (nur für Eigennutzer)" value={eink} onChange={setEink}|]
              [Toggle label="Interesse an natürlichem Kältemittel (R290)" sub="Propan-Wärmepumpen erhalten +5% Bonus" value={r290} onChange={setR290}|]
            </div>

            {/* Info box with image */}
            <div style={{ background: 'white', border: '1px solid rgba(26,71,49,.1)', borderRadius: 14, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                alt="Wärmepumpen-Fachbetrieb"
                style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '20px 24px' }}>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>Diese Berechnung ist ein Richtwert</h3>
                <p style={{ fontSize: 14, color: '#4A6358', lineHeight: 1.65 }}>
                  Für eine exakte Kalkulation berücksichtigen geprüfte Fachbetriebe zusätzlich Heizgradtage, regionaler Energiepreise und den Sanierungszustand. Ein Fachbetrieb aus Ihrer Region erstellt Ihnen ein kostenloses, individuelles Angebot.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — sticky results */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ background: '#1A3728', borderRadius: 16, padding: 28, boxShadow: '0 16px 56px rgba(26,71,49,.22)' }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#F0FAF4', marginBottom: 22, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Ihre Berechnung</div>

              {/* Kosten */}
              {[
                { label: 'Jährl. Heizkosten heute',      val: fmt(r.alt) + ' / Jahr', color: '#F59E0B' },
                { label: 'Mit Wärmepumpe (JAZ 3,5)',     val: fmt(r.wp)  + ' / Jahr', color: '#4CAF7D' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(240,250,244,.55)' }}>{row.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 15, fontWeight: 700, color: row.color }}>{row.val}</span>
                </div>
              ))}

              {/* Savings */}
              <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 10, padding: '14px 16px', margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'rgba(240,250,244,.7)' }}>Jährliche Ersparnis</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 22, fontWeight: 700, color: '#F59E0B' }}>{fmt(r.ers)}</span>
              </div>

              {/* Förderung */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'rgba(240,250,244,.55)' }}>Ihr Fördersatz</span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 15, fontWeight: 700, color: '#F59E0B' }}>{r.rate}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ height: '100%', width: `${r.rate}%`, background: '#F59E0B', borderRadius: 6, transition: 'width .6s ease' }}/>
                </div>

                {[
                  { label: 'KfW-Zuschuss (geschätzt)', val: fmt(r.zuschuss),    color: '#4CAF7D' },
                  { label: 'Ihr Eigenanteil',           val: fmt(r.eigenanteil), color: '#F0FAF4' },
                  { label: 'Amortisation',              val: r.amort + ' Jahre', color: '#F0FAF4' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <span style={{ fontSize: 13, color: 'rgba(240,250,244,.5)' }}>{row.label}</span>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 15, fontWeight: 700, color: row.color }}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a href="#" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', padding: '15px 20px', marginTop: 20,
                background: '#B45309', color: 'white', borderRadius: 8,
                fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 15, fontWeight: 600,
                textDecoration: 'none', transition: 'background .2s',
                boxShadow: '0 4px 16px rgba(180,83,9,.3)',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#9a4508')}
                onMouseLeave={e => (e.currentTarget.style.background = '#B45309')}>
                Kostenloses Angebot anfordern →
              </a>
              <p style={{ fontSize: 12, color: 'rgba(240,250,244,.3)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                Bis zu 3 geprüfte Fachbetriebe aus Ihrer PLZ — kostenlos & unverbindlich.
              </p>
            </div>

            {/* Disclaimer */}
            <div style={{ background: 'white', border: '1px solid rgba(26,71,49,.1)', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
              <p style={{ fontSize: 12, color: '#7A9E8E', lineHeight: 1.6 }}>
                Berechnung basiert auf Bundesdurchschnittswerten. Tatsächliche Kosten können abweichen. Fördervoraussetzungen gemäß BEG/KfW Stand 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
