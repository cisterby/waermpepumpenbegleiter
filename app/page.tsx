'use client'

import { useState, useEffect, useRef } from 'react'

/* ─── CALC LOGIC ─── */
const BEDARF: Record<string, number> = {
  vor_1978: 215, '1979_1994': 165, '1995_2009': 101, '2010_plus': 72,
}
const PREIS = { erdgas: 0.12, heizoel: 0.11, nachtspeicher: 0.32 }
const WG    = { erdgas: 0.92, heizoel: 0.90, nachtspeicher: 0.98 }

function calcKosten(fl: number, hz: keyof typeof PREIS, bj: string) {
  const kw     = (BEDARF[bj] || 160) + 12.5
  const bedarf = fl * kw
  const alt    = Math.round(bedarf / WG[hz] * PREIS[hz])
  const wp     = Math.round(bedarf / 3.5 * 0.27)
  const ers    = alt - wp
  const amort  = ((25000 * 0.45) / (ers + 200))
  return { alt, wp, ers, amort: Math.round(amort * 10) / 10 }
}

function fmt(n: number) {
  return '€\u202F' + Math.round(n).toLocaleString('de-DE')
}

/* ─── COUNTER HOOK ─── */
function useCounter(target: number, active: boolean, duration = 1800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const step = (now: number) => {
      const p    = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return val
}

/* ─── INTERSECTION HOOK ─── */
function useInView(threshold = 0.15) {
  const ref  = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ─── CHART DATA ─── */
const chartData = [
  { year: '2020', v: 97000 },
  { year: '2021', v: 154000 },
  { year: '2022', v: 236000 },
  { year: '2023', v: 193000 },
  { year: '2024', v: 193000 },
  { year: '2025', v: 299000, hi: true },
]
const maxV = Math.max(...chartData.map(d => d.v))

/* ═══════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════ */
export default function Home() {

  /* nav scroll */
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* calculator */
  const [flaeche,  setFlaeche]  = useState(120)
  const [heizung,  setHeizung]  = useState<'erdgas'|'heizoel'|'nachtspeicher'>('erdgas')
  const [baujahr,  setBaujahr]  = useState('1979_1994')
  const result = calcKosten(flaeche, heizung, baujahr)

  /* section visibility */
  const statsRef  = useInView()
  const foerdRef  = useInView()
  const heroRef   = useInView(0.05)
  const stepsRef  = useInView()
  const calcRef   = useInView()
  const trendsRef = useInView()
  const testiRef  = useInView()

  /* counters */
  const c1 = useCounter(299000, statsRef.visible)
  const c2 = useCounter(70,     statsRef.visible)
  const c3 = useCounter(21000,  statsRef.visible)
  const c4 = useCounter(25,     statsRef.visible)

  /* bar animation */
  const [barsGo, setBarsGo] = useState(false)
  useEffect(() => { if (trendsRef.visible) setBarsGo(true) }, [trendsRef.visible])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:       #F6F3EE;
          --dark:     #1A3728;
          --dark2:    #102218;
          --green:    #1A4731;
          --gm:       #2D7A52;
          --gl:       #4CAF7D;
          --amber:    #B45309;
          --amberlt:  #F59E0B;
          --text:     #1C2B25;
          --text2:    #4A6358;
          --text3:    #7A9E8E;
          --inv:      #F0FAF4;
          --border:   #DDD8CF;
          --bg:       rgba(26,71,49,.10);
        }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #F6F3EE;
          color: #1C2B25;
          line-height: 1.7;
          font-size: 16px;
          overflow-x: hidden;
        }
        h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; line-height: 1.1; }
        h1 { font-size: clamp(44px,6vw,76px); font-weight: 700; }
        h2 { font-size: clamp(34px,4vw,56px); font-weight: 600; }
        h3 { font-size: clamp(20px,2vw,28px); font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .over {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: .14em; text-transform: uppercase;
          color: #2D7A52; margin-bottom: 14px; display: block;
        }
        .c   { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        .sec { padding: 100px 0; }
        .fu  { opacity: 0; transform: translateY(30px); transition: opacity .7s ease, transform .7s ease; }
        .fv  { opacity: 1 !important; transform: translateY(0) !important; }
        .btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 600; border-radius: 8px;
          cursor: pointer; text-decoration: none;
          transition: all .2s ease; border: none;
        }
        .bp  { background: #1A4731; color: #fff; box-shadow: 0 3px 12px rgba(26,71,49,.25); }
        .bp:hover { background: #1f5239; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,71,49,.32); }
        .bg  { background: transparent; color: #1A4731; border: 1.5px solid rgba(26,71,49,.22); }
        .bg:hover { background: rgba(26,71,49,.06); border-color: #1A4731; }
        .ba  { background: #B45309; color: #fff; box-shadow: 0 3px 12px rgba(180,83,9,.25); }
        .ba:hover { background: #9a4508; transform: translateY(-2px); }
        .blg { padding: 16px 34px; font-size: 16px; }
        input[type=range] {
          flex: 1; -webkit-appearance: none; height: 4px;
          background: #DDD8CF; border-radius: 4px; outline: none; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px;
          background: #1A4731; border-radius: 50%; cursor: pointer;
          box-shadow: 0 2px 8px rgba(26,71,49,.35);
        }
        select {
          width: 100%; padding: 11px 16px; border: 1px solid #DDD8CF;
          border-radius: 8px; background: white; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; color: #1C2B25; -webkit-appearance: none; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234A6358' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          outline: none; cursor: pointer; transition: border-color .2s;
        }
        select:focus { border-color: #1A4731; }
        @media(max-width:900px){
          .c { padding: 0 20px; }
          .hero-grid, .calc-grid, .foerd-grid, .trends-grid,
          .testi-grid, .steps-grid, .why-grid { grid-template-columns: 1fr !important; }
          .hero-img-col { display: none !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .si { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,.07); }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-links { display: none !important; }
          .nav-ghost { display: none !important; }
        }
      `}</style>

      {/* ══ NAV ══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        transition: 'all .35s ease',
        ...(scrolled ? {
          background: 'rgba(246,243,238,.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #DDD8CF',
        } : {}),
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, background: '#1A4731', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path d="M11 2C11 2 5 7 5 13a6 6 0 0012 0c0-6-6-11-6-11z" fill="white" opacity=".9"/>
                <path d="M11 10c0 0-3 3-3 5a3 3 0 006 0c0-2-3-5-3-5z" fill="white" opacity=".5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#1C2B25', lineHeight: 1.2 }}>Wärmepumpenbegleiter</div>
              <div style={{ fontWeight: 400, fontSize: 12, color: '#7A9E8E' }}>.de</div>
            </div>
          </a>

          {/* Links */}
          <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28, listStyle: 'none' }}>
            {['Wie es funktioniert', 'Rechner', 'Förderung', 'Ratgeber', 'Über uns'].map(l => (
              <li key={l}><a href="#" style={{ textDecoration: 'none', fontSize: 14, fontWeight: 500, color: '#4A6358', transition: 'color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A4731')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4A6358')}>{l}</a></li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: 10 }}>
            <a href="#" className="btn bg nav-ghost" style={{ padding: '10px 18px', fontSize: 14 }}>Einloggen</a>
            <a href="#calculator" className="btn bp" style={{ padding: '10px 22px', fontSize: 14 }}>Kostenloses Angebot →</a>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 74 }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}/>
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(105deg, rgba(246,243,238,.97) 0%, rgba(246,243,238,.92) 45%, rgba(246,243,238,.4) 75%, rgba(26,55,40,.15) 100%)' }}/>

        <div className="c" style={{ position: 'relative', zIndex: 2, width: '100%', padding: '80px 40px 80px' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: 60, alignItems: 'center' }}>

            {/* Left */}
            <div ref={heroRef.ref} className={`fu ${heroRef.visible ? 'fv' : ''}`}>
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,71,49,.08)', border: '1px solid rgba(26,71,49,.15)', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 500, color: '#1A4731', marginBottom: 22 }}>
                <span style={{ width: 7, height: 7, background: '#4CAF7D', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }}/>
                GEG 2026 — Jetzt informieren
              </div>

              <h1 style={{ marginBottom: 20, color: '#1C2B25' }}>
                Ihre alte Heizung<br/>
                kostet Sie jährlich<br/>
                <em style={{ color: '#B45309', fontStyle: 'normal', display: 'block' }}>€ 2.400 zu viel.</em>
              </h1>

              <p style={{ fontSize: 18, color: '#4A6358', maxWidth: 500, marginBottom: 36, lineHeight: 1.75 }}>
                Wir begleiten Hausbesitzer durch die Wärmepumpen-Entscheidung — kostenlos, herstellerunabhängig, mit geprüften Fachbetrieben in Ihrer Region.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 44, flexWrap: 'wrap' }}>
                <a href="#calculator" className="btn bp blg">Kosten jetzt berechnen →</a>
                <a href="#foerderung" className="btn bg blg">Wie viel spare ich?</a>
              </div>

              {/* Trust strip */}
              <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', borderTop: '1px solid #DDD8CF', paddingTop: 24 }}>
                {[
                  ['733 Städte abgedeckt', '✓'],
                  ['Geprüfte Fachbetriebe', '✓'],
                  ['Bis 70% KfW-Förderung', '✓'],
                  ['100% kostenlos', '✓'],
                ].map(([t, i]) => (
                  <div key={t} style={{ fontSize: 13, color: '#7A9E8E', display: 'flex', alignItems: 'center', gap: 6, paddingRight: 20, marginRight: 20, borderRight: '1px solid #DDD8CF' }}>
                    <span style={{ color: '#2D7A52', fontWeight: 700 }}>{i}</span> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating image card */}
            <div className="hero-img-col" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(26,55,40,.22)',
                width: '100%', maxWidth: 440,
                animation: 'float 7s ease-in-out infinite',
                border: '3px solid rgba(255,255,255,.8)',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=880&q=85"
                  alt="Modernes Einfamilienhaus mit Wärmepumpe"
                  style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }}
                />
                {/* Overlay badge on image */}
                <div style={{
                  position: 'absolute', bottom: 20, left: 20, right: 20,
                  background: 'rgba(26,55,40,.88)', backdropFilter: 'blur(8px)',
                  borderRadius: 12, padding: '14px 18px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(240,250,244,.6)', marginBottom: 2 }}>Jährliche Ersparnis</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700, color: '#F59E0B' }}>€ 1.100</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: 'rgba(240,250,244,.6)', marginBottom: 2 }}>Amortisation</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700, color: '#4CAF7D' }}>9,2 Jahre</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.8)} }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        `}</style>
      </section>

      {/* ══ STATS BAR ══ */}
      <div ref={statsRef.ref} style={{ background: '#1A3728', padding: '60px 0' }}>
        <div className="c">
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[
              { val: c1.toLocaleString('de-DE'), suf: '', label: 'Wärmepumpen installiert in Deutschland 2025' },
              { val: c2,                         suf: '%', label: 'Maximale KfW-Förderung auf Anschaffungskosten' },
              { val: '€\u202F' + c3.toLocaleString('de-DE'), suf: '', label: 'Maximaler Förderbetrag für ein Einfamilienhaus' },
              { val: c4,                         suf: '+', label: 'Jahre durchschnittliche Lebensdauer einer Wärmepumpe' },
            ].map((s, i) => (
              <div key={i} className="si" style={{ textAlign: 'center', padding: '16px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 46, fontWeight: 700, color: '#F59E0B', display: 'block', lineHeight: 1, marginBottom: 8 }}>
                  {s.val}{s.suf}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(240,250,244,.5)', lineHeight: 1.5 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ WHY NOW — image section ══ */}
      <section className="sec" style={{ background: '#fff' }}>
        <div className="c">
          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            {/* Image */}
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 56px rgba(26,71,49,.14)' }}>
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85"
                alt="Modernes Haus Heizungstausch"
                style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block' }}
              />
              {/* Floating info card */}
              <div style={{
                position: 'absolute', bottom: 24, right: 24,
                background: 'white', borderRadius: 12, padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,.15)',
                minWidth: 200,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#7A9E8E', marginBottom: 4 }}>GEG Frist</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: '#B45309' }}>30.06.2026</div>
                <div style={{ fontSize: 13, color: '#4A6358', marginTop: 4 }}>Großstädte: 65%-EE-Pflicht</div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="over">Warum jetzt?</span>
              <h2 style={{ marginBottom: 20, color: '#1C2B25' }}>Das GEG 2024 macht die Entscheidung unausweichlich</h2>
              <p style={{ fontSize: 17, color: '#4A6358', lineHeight: 1.75, marginBottom: 32 }}>
                Seit dem 1. Januar 2024 gilt: Jede neu eingebaute Heizung muss mindestens 65% erneuerbare Energie nutzen. Für Bestandsgebäude in Großstädten wird das ab dem 30. Juni 2026 verpflichtend — das sind rund 80 Städte bundesweit.
              </p>

              {/* Timeline */}
              {[
                { year: '2024',       text: 'GEG in Kraft — 65%-Pflicht für alle Neubauten', color: '#1A4731' },
                { year: '30.06.2026', text: 'Bestandsgebäude in Städten >100.000 Einwohner', color: '#B45309', urgent: true },
                { year: '30.06.2028', text: 'Alle übrigen Kommunen — flächendeckende Pflicht', color: '#4A6358' },
                { year: '2045',       text: 'Vollständiges Verbot fossiler Heizungen', color: '#7A9E8E' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 10, height: 10, marginTop: 6, background: t.color, borderRadius: '50%', boxShadow: `0 0 0 4px ${t.color}22` }}/>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: t.color, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {t.year}
                      {t.urgent && <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>In 15 Monaten!</span>}
                    </div>
                    <div style={{ fontSize: 15, color: '#4A6358', lineHeight: 1.5 }}>{t.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STEPS ══ */}
      <section ref={stepsRef.ref} className="sec" style={{ background: '#F6F3EE' }}>
        <div className="c">
          <div className={`fu ${stepsRef.visible ? 'fv' : ''}`} style={{ maxWidth: 560 }}>
            <span className="over">In 3 Schritten zur Wärmepumpe</span>
            <h2>So einfach funktioniert es</h2>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 56 }}>
            {[
              { n: '01', title: 'Daten eingeben', text: 'Gebäudetyp, Baujahr und PLZ eingeben — dauert unter 2 Minuten. Kein technisches Wissen nötig.', tag: '2 Minuten',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A4731" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg> },
              { n: '02', title: 'Angebote erhalten', text: 'Bis zu 3 geprüfte Fachbetriebe aus Ihrer Region melden sich innerhalb von 48 Stunden — unverbindlich.', tag: 'Kostenlos',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A4731" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
              { n: '03', title: 'Förderung sichern', text: 'Wir begleiten Sie durch den KfW-Antragsprozess — bis zu €21.000 Zuschuss, Schritt für Schritt erklärt.', tag: 'Bis €21.000',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A4731" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
            ].map((s, i) => (
              <div key={i} className={`fu ${stepsRef.visible ? 'fv' : ''}`}
                style={{ background: 'white', border: '1px solid rgba(26,71,49,.1)', borderRadius: 14, padding: '36px 28px', transition: `all .25s ease, opacity .7s ease ${i * .1 + .1}s, transform .7s ease ${i * .1 + .1}s`, cursor: 'default', overflow: 'hidden', position: 'relative' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(26,71,49,.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}>
                <span style={{ position: 'absolute', top: -12, right: 12, fontFamily: 'Cormorant Garamond, serif', fontSize: 96, fontWeight: 700, color: '#1A4731', opacity: .055, lineHeight: 1, userSelect: 'none' }}>{s.n}</span>
                <div style={{ width: 48, height: 48, background: 'rgba(26,71,49,.07)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>{s.icon}</div>
                <h3 style={{ fontSize: 22, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: '#4A6358', lineHeight: 1.65 }}>{s.text}</p>
                <span style={{ display: 'inline-block', background: '#1A4731', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100, marginTop: 16 }}>{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CALCULATOR ══ */}
      <section ref={calcRef.ref} id="calculator" className="sec" style={{ background: 'white' }}>
        <div className="c">
          <div className="calc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 72, alignItems: 'start' }}>
            {/* Intro */}
            <div className={`fu ${calcRef.visible ? 'fv' : ''}`}>
              <span className="over">Kostenrechner</span>
              <h2 style={{ marginBottom: 18 }}>Was kostet Sie Ihre alte Heizung wirklich?</h2>
              <p style={{ fontSize: 17, color: '#4A6358', lineHeight: 1.75, marginBottom: 24 }}>
                Geben Sie Ihre Gebäudedaten ein — der Rechner zeigt Ihnen sofort, wie viel Sie mit einer Wärmepumpe im Jahr sparen, wie hoch Ihre KfW-Förderung ausfallen kann und wann sich die Investition amortisiert.
              </p>
              {/* Image in calc section */}
              <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(26,71,49,.1)' }}>
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80"
                  alt="Wärmepumpen-Installation durch Fachbetrieb"
                  style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                />
                <div style={{ background: '#F6F3EE', padding: '16px 20px' }}>
                  <p style={{ fontSize: 13, color: '#7A9E8E' }}>🔒 Keine Datenweitergabe. Kein Spam. 100% kostenlos.</p>
                </div>
              </div>
            </div>

            {/* Card */}
            <div className={`fu ${calcRef.visible ? 'fv' : ''}`} style={{ transitionDelay: '.15s', background: '#F6F3EE', border: '1px solid rgba(26,71,49,.1)', borderRadius: 18, padding: 36, boxShadow: '0 8px 40px rgba(26,71,49,.1)' }}>
              {/* Inputs */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#7A9E8E', marginBottom: 8 }}>Wohnfläche</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <input type="range" min={60} max={350} step={5} value={flaeche} onChange={e => setFlaeche(+e.target.value)} style={{ flex: 1 }}/>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 700, color: '#1A4731', minWidth: 62, textAlign: 'right' }}>{flaeche} m²</span>
                </div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#7A9E8E', marginBottom: 8 }}>Aktuelle Heizung</label>
                <select value={heizung} onChange={e => setHeizung(e.target.value as any)}>
                  <option value="erdgas">Erdgas</option>
                  <option value="heizoel">Heizöl</option>
                  <option value="nachtspeicher">Nachtspeicher</option>
                </select>
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#7A9E8E', marginBottom: 8 }}>Baujahr Gebäude</label>
                <select value={baujahr} onChange={e => setBaujahr(e.target.value)}>
                  <option value="vor_1978">vor 1978</option>
                  <option value="1979_1994">1979 – 1994</option>
                  <option value="1995_2009">1995 – 2009</option>
                  <option value="2010_plus">2010 und neuer</option>
                </select>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #DDD8CF', marginBottom: 24 }}/>

              {/* Results */}
              {[
                { label: 'Jährl. Heizkosten heute', val: fmt(result.alt) + ' / Jahr', color: '#B45309' },
                { label: 'Mit Wärmepumpe', val: fmt(result.wp) + ' / Jahr', color: '#1A4731' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(26,71,49,.06)' }}>
                  <span style={{ fontSize: 14, color: '#4A6358' }}>{r.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: r.color }}>{r.val}</span>
                </div>
              ))}

              {/* Savings */}
              <div style={{ background: '#1A4731', borderRadius: 10, padding: '16px 20px', margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 14 }}>Jährliche Ersparnis</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700, color: '#F59E0B' }}>{fmt(result.ers)} / Jahr</span>
              </div>

              <p style={{ fontSize: 13, color: '#7A9E8E', marginBottom: 20, textAlign: 'center' }}>
                Amortisation mit 55% Förderung: ca. <strong style={{ color: '#1A4731' }}>{result.amort} Jahre</strong>
              </p>

              <a href="/rechner" className="btn bp" style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}>
                Genaues Angebot für meine Stadt →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FÖRDERUNG ══ */}
      <section ref={foerdRef.ref} id="foerderung" className="sec" style={{ background: '#1A3728', overflow: 'hidden' }}>
        <div className="c">
          <div className="foerd-grid" style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: 80, alignItems: 'center' }}>
            <div className={`fu ${foerdRef.visible ? 'fv' : ''}`}>
              <span className="over" style={{ color: 'rgba(76,175,125,.9)' }}>KfW-Programm 458</span>
              <h2 style={{ color: '#F0FAF4', marginBottom: 18 }}>Bis zu €21.000 geschenkt — vom Staat</h2>
              <p style={{ fontSize: 17, color: 'rgba(240,250,244,.65)', lineHeight: 1.75, marginBottom: 28 }}>
                Das Bundesamt für Wirtschaft fördert den Einbau von Wärmepumpen mit bis zu 70% der förderfähigen Kosten. Die Förderung ist ein direkter Zuschuss — nicht rückzahlbar. Maximal €30.000 werden als Bemessungsgrundlage angesetzt.
              </p>
              <a href="/rechner" className="btn ba">Förderung berechnen →</a>
              <p style={{ fontSize: 13, color: 'rgba(240,250,244,.3)', marginTop: 16 }}>Förderfähige Kosten: bis €30.000 · Max. Zuschuss: €21.000</p>
            </div>

            <div className={`fu ${foerdRef.visible ? 'fv' : ''}`} style={{ transitionDelay: '.15s' }}>
              {[
                { name: 'Grundförderung', pct: 30, w: '43%', cls: '#4CAF7D' },
                { name: '+ Klima-Speed-Bonus (alte Gasheizung ersetzen)', pct: 20, w: '29%', cls: '#F59E0B' },
                { name: '+ Einkommens-Bonus (unter €40.000 netto/Jahr)', pct: 30, w: '43%', cls: '#FCD34D' },
                { name: '+ Bonus natürliches Kältemittel (R290)', pct: 5, w: '7%', cls: '#2D7A52' },
              ].map((b, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 14, color: 'rgba(240,250,244,.7)' }}>{b.name}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: '#F59E0B' }}>{b.pct > 0 ? '+' : ''}{b.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,.07)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: b.cls, borderRadius: 8, width: foerdRef.visible ? b.w : '0%', transition: `width 1.3s cubic-bezier(.16,1,.3,1) ${i * .15}s` }}/>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 28, borderTop: '1px solid rgba(255,255,255,.09)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 15, color: 'rgba(240,250,244,.55)' }}>Gesamt möglich</div>
                  <div style={{ fontSize: 13, color: 'rgba(240,250,244,.3)', marginTop: 4 }}>= bis zu €21.000 Zuschuss</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 68, fontWeight: 700, color: '#F59E0B', lineHeight: 1 }}>70%</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,250,244,.3)' }}>nicht rückzahlbar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WP TYPES — image row ══ */}
      <section className="sec" style={{ background: '#F6F3EE' }}>
        <div className="c">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }}>
            <span className="over">Welche Wärmepumpe passt zu mir?</span>
            <h2>Die drei Haupttypen im Vergleich</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              {
                img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
                type: 'Luft-Wasser',
                share: '92%',
                text: 'Am häufigsten verbaut. Funktioniert auch im Altbau, einfache Installation, kein Erdreich nötig.',
                pros: ['Geringe Installationskosten', 'Auch im Altbau geeignet', 'Schnelle Montage (1–2 Tage)'],
                color: '#1A4731',
              },
              {
                img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
                type: 'Sole-Wasser',
                share: '6%',
                text: 'Höchste Effizienz durch konstante Erdwärme. Ideal für Neubau oder großes Grundstück.',
                pros: ['Höchste Jahresarbeitszahl', 'Unabhängig von Außentemp.', '+5% KfW-Bonus'],
                color: '#2D7A52',
              },
              {
                img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&q=80',
                type: 'Wasser-Wasser',
                share: '2%',
                text: 'Nutzung von Grundwasser — höchste COP-Werte aller Typen, aber genehmigungspflichtig.',
                pros: ['COP bis 6+', '+5% KfW-Bonus', 'Ideal für Regionen mit gutem GW'],
                color: '#4A6358',
              },
            ].map((t, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(26,71,49,.1)', boxShadow: '0 4px 16px rgba(26,71,49,.07)', transition: 'all .25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(26,71,49,.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(26,71,49,.07)' }}>
                <div style={{ position: 'relative' }}>
                  <img src={t.img} alt={t.type} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}/>
                  <div style={{ position: 'absolute', top: 12, right: 12, background: t.color, color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>{t.share} Marktanteil</div>
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 8, color: t.color }}>{t.type}-Wärmepumpe</h3>
                  <p style={{ fontSize: 14, color: '#4A6358', lineHeight: 1.65, marginBottom: 16 }}>{t.text}</p>
                  {t.pros.map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1C2B25', marginBottom: 6 }}>
                      <span style={{ color: '#2D7A52', fontWeight: 700, flexShrink: 0 }}>✓</span> {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRENDS ══ */}
      <section ref={trendsRef.ref} className="sec" style={{ background: 'white' }}>
        <div className="c">
          <div className="trends-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div className={`fu ${trendsRef.visible ? 'fv' : ''}`}>
              <span className="over">Marktentwicklung</span>
              <h2 style={{ marginBottom: 16 }}>Der Markt wächst — <em style={{ fontStyle: 'normal', color: '#B45309' }}>+55%</em> allein 2025</h2>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.7, marginBottom: 24 }}>
                299.000 Wärmepumpen wurden 2025 in Deutschland installiert. Doch erst 3–4% aller rund 21 Millionen Heizungsanlagen sind Wärmepumpen — das Potenzial ist enorm.
              </p>
              <div style={{ background: 'rgba(26,71,49,.05)', border: '1px solid rgba(26,71,49,.1)', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ fontSize: 13, color: '#4A6358', lineHeight: 1.6 }}>
                  Regierungsziel: <strong style={{ color: '#1A4731' }}>6 Millionen</strong> Wärmepumpen bis 2030. Aktuell: ~1,5 Mio. installiert.
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className={`fu ${trendsRef.visible ? 'fv' : ''}`} style={{ transitionDelay: '.15s' }}>
              <div style={{ background: '#F6F3EE', border: '1px solid rgba(26,71,49,.1)', borderRadius: 14, padding: '24px 24px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#4A6358', marginBottom: 20 }}>WP-Installationen Deutschland (in Stück)</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 200, borderBottom: '1px solid #DDD8CF', borderLeft: '1px solid #DDD8CF', padding: '0 0 0 4px' }}>
                  {chartData.map((d, i) => {
                    const h = Math.round((d.v / maxV) * 180)
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                          {d.hi && barsGo && (
                            <div style={{ position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)', background: '#1A4731', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 6px', borderRadius: 4, whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>+55%</div>
                          )}
                          <div style={{
                            width: '100%',
                            height: barsGo ? h : 0,
                            background: d.hi ? '#1A4731' : 'rgba(76,175,125,.35)',
                            borderRadius: '4px 4px 0 0',
                            transition: `height 1.2s cubic-bezier(.16,1,.3,1) ${i * .1}s`,
                            minHeight: 3,
                          }}/>
                        </div>
                        <div style={{ fontSize: 10, color: '#7A9E8E', marginTop: 8, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}>{d.year}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section ref={testiRef.ref} className="sec" style={{ background: '#F6F3EE' }}>
        <div className="c">
          <div className={`fu ${testiRef.visible ? 'fv' : ''}`} style={{ maxWidth: 560, marginBottom: 56 }}>
            <span className="over">Stimmen aus der Community</span>
            <h2>Was Hausbesitzer sagen</h2>
          </div>
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {[
              { init: 'B', name: 'Familie Brehmer', city: 'Hannover', tag: 'Luft-Wasser-WP · €1.100/Jahr gespart', text: '„Nach 20 Jahren Ölheizung dachten wir, der Umstieg wäre ein riesiges Projekt. Das Team hat alles erklärt und wir haben drei Angebote bekommen — völlig unkompliziert."', delay: '.1s' },
              { init: 'M', name: 'Thomas Müller',   city: 'Freiburg', tag: 'Sole-Wasser-WP · Amortisation 8 Jahre', text: '„Endlich jemand, der das Förder-Chaos erklärt. Wir haben 65% KfW-Förderung bekommen — hätte ich alleine nie hingekriegt. Sehr empfehlenswert!"', delay: '.2s' },
              { init: 'K', name: 'Sabine Kröger',   city: 'Münster', tag: 'Luft-Wasser-WP · 3 Angebote erhalten', text: '„Als Vermieter war ich unsicher, ob sich das lohnt. Nach der Berechnung war die Entscheidung klar. Seriöse Beratung, keinerlei Druckverkäufe."', delay: '.3s' },
            ].map((t, i) => (
              <div key={i} className={`fu ${testiRef.visible ? 'fv' : ''}`}
                style={{ background: 'white', border: '1px solid rgba(26,71,49,.1)', borderRadius: 14, padding: 28, transition: `all .25s ease, opacity .7s ease ${t.delay}, transform .7s ease ${t.delay}`, cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(26,71,49,.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}>
                <div style={{ color: '#F59E0B', fontSize: 15, letterSpacing: 2, marginBottom: 14 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: '#4A6358', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 18 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(26,71,49,.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 600, color: '#1A4731', flexShrink: 0 }}>{t.init}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1C2B25' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#7A9E8E' }}>{t.city}</div>
                    <div style={{ display: 'inline-block', background: 'rgba(26,71,49,.07)', color: '#2D7A52', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100, marginTop: 4 }}>{t.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section style={{ background: '#1A3728', padding: '120px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background image with overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=60" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .15 }}/>
        </div>
        <span style={{ position: 'absolute', fontFamily: 'Cormorant Garamond, serif', fontSize: 360, fontWeight: 700, color: 'rgba(255,255,255,.025)', top: -60, left: '50%', transform: 'translateX(-50%)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap', zIndex: 0 }}>→</span>
        <div className="c" style={{ position: 'relative', zIndex: 1 }}>
          <span className="over" style={{ color: 'rgba(76,175,125,.8)', display: 'block', textAlign: 'center' }}>Bereit für den Wechsel?</span>
          <h2 style={{ color: '#F0FAF4', fontSize: 'clamp(38px,5vw,62px)', marginBottom: 18 }}>Bereit für die Heizungswende?</h2>
          <p style={{ fontSize: 18, color: 'rgba(240,250,244,.6)', marginBottom: 40 }}>Kostenlose Beratung in 2 Minuten — ohne Vertragsbindung, ohne Verpflichtung.</p>
          <a href="/rechner" className="btn ba blg">Kostenloses Angebot anfordern →</a>
          <div style={{ fontSize: 13, color: 'rgba(240,250,244,.3)', marginTop: 18 }}>
            <span style={{ margin: '0 10px' }}>✓ Kein Spam</span>
            <span style={{ margin: '0 10px' }}>✓ Keine Weitergabe ohne Ihre Zustimmung</span>
            <span style={{ margin: '0 10px' }}>✓ 100% kostenlos</span>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#0F1F16', padding: '64px 0 32px' }}>
        <div className="c">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, background: '#1A4731', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M11 2C11 2 5 7 5 13a6 6 0 0012 0c0-6-6-11-6-11z" fill="white" opacity=".9"/><path d="M11 10c0 0-3 3-3 5a3 3 0 006 0c0-2-3-5-3-5z" fill="white" opacity=".5"/></svg>
                </div>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#F0FAF4' }}>Wärmepumpenbegleiter.de</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(240,250,244,.4)', lineHeight: 1.7, maxWidth: 220 }}>Ihr unabhängiger Begleiter für die wichtigste Heizungsentscheidung der nächsten Jahrzehnte.</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                {[
                  <path key="li" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>,
                  <><rect key="ig1" x="2" y="2" width="20" height="20" rx="5"/><path key="ig2" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line key="ig3" x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
                  <path key="fb" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>,
                ].map((icon, i) => (
                  <a key={i} href="#" style={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', textDecoration: 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#4CAF7D'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(76,175,125,.1)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,.1)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(240,250,244,.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Navigation', links: ['Wie es funktioniert', 'Rechner', 'Ratgeber', 'Über uns', 'Kontakt'] },
              { title: 'Städte', links: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Hannover', 'Düsseldorf'] },
              { title: 'Rechtliches', links: ['Impressum', 'Datenschutz', 'AGB', 'Cookie-Einstellungen'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(240,250,244,.3)', marginBottom: 16 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none' }}>
                  {col.links.map(l => (
                    <li key={l} style={{ marginBottom: 10 }}>
                      <a href="#" style={{ textDecoration: 'none', fontSize: 14, color: 'rgba(240,250,244,.45)', transition: 'color .2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#F0FAF4')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,250,244,.45)')}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(240,250,244,.25)' }}>© 2026 Wärmepumpenbegleiter.de</span>
            <span style={{ fontSize: 12, color: 'rgba(240,250,244,.25)' }}>Wir erhalten eine Vermittlungsprovision von Installateuren. Für Sie ist unser Service kostenlos.</span>
          </div>
        </div>
      </footer>
    </>
  )
}
