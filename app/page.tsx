'use client'

import { useState, useEffect, useRef } from 'react'

const BEDARF: Record<string, number> = {
  vor_1978: 215, '1979_1994': 165, '1995_2009': 101, '2010_plus': 72,
}
function calc(fl: number, hz: string, bj: string) {
  const pr: Record<string,number> = { erdgas:0.12, heizoel:0.11, nachtspeicher:0.32 }
  const wg: Record<string,number> = { erdgas:0.92, heizoel:0.90, nachtspeicher:0.98 }
  const bedarf = fl * ((BEDARF[bj]||160) + 12.5)
  const alt = Math.round(bedarf / wg[hz] * pr[hz])
  const wp  = Math.round(bedarf / 3.5 * 0.27)
  const ers = alt - wp
  const amort = Math.round((25000*0.45)/(ers+200)*10)/10
  return { alt, wp, ers, amort }
}
function fmt(n:number){ return '€\u202F'+Math.round(n).toLocaleString('de-DE') }

function useInView(threshold=0.18){
  const ref = useRef<HTMLDivElement>(null)
  const [v,setV] = useState(false)
  useEffect(()=>{
    const el = ref.current; if(!el) return
    const io = new IntersectionObserver(([e])=>{ if(e.isIntersecting){setV(true);io.disconnect()} },{threshold})
    io.observe(el); return ()=>io.disconnect()
  },[threshold])
  return {ref,v}
}

function useCounter(target:number, active:boolean){
  const [val,setVal] = useState(0)
  useEffect(()=>{
    if(!active) return
    const start = performance.now()
    const step=(now:number)=>{
      const p=Math.min((now-start)/1600,1), e=1-Math.pow(1-p,3)
      setVal(Math.round(e*target))
      if(p<1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  },[active,target])
  return val
}

const G = '#1B5E37'
const G2 = '#2A7D4F'
const G3 = '#3DA16A'
const GLT = '#E8F5EE'
const GXLT = '#F2FAF5'
const AMB = '#D97706'
const AMBL = '#FEF3C7'
const TX = '#111827'
const TX2 = '#4B5563'
const TX3 = '#9CA3AF'
const BDR = '#E5E7EB'
const BG = '#F8F9FA'
const SH = '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.04)'
const SHL = '0 4px 6px rgba(0,0,0,.05),0 16px 48px rgba(0,0,0,.08)'
const R = '10px'
const RLG = '16px'

export default function Home() {
  const [scrolled,setScrolled] = useState(false)
  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>50); window.addEventListener('scroll',fn); return ()=>window.removeEventListener('scroll',fn) },[])

  const [fl,setFl] = useState(130)
  const [hz,setHz] = useState('erdgas')
  const [bj,setBj] = useState('1979_1994')
  const r = calc(fl,hz,bj)

  const stats = useInView()
  const foerd = useInView()
  const steps = useInView()
  const calcS = useInView()
  const testi = useInView()

  const c1 = useCounter(299000, stats.v)
  const c2 = useCounter(70,     stats.v)
  const c3 = useCounter(21000,  stats.v)
  const c4 = useCounter(25,     stats.v)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans',sans-serif;background:#F8F9FA;color:#111827;line-height:1.6;font-size:16px;overflow-x:hidden;-webkit-font-smoothing:antialiased}
        h1,h2,h3{font-family:'Outfit',sans-serif;line-height:1.15;color:#111827}
        h1{font-size:clamp(40px,5.5vw,68px);font-weight:800;letter-spacing:-.02em}
        h2{font-size:clamp(30px,3.5vw,48px);font-weight:700;letter-spacing:-.01em}
        h3{font-size:clamp(18px,2vw,24px);font-weight:600}
        .mono{font-family:'JetBrains Mono',monospace}
        .c{max-width:1220px;margin:0 auto;padding:0 40px}
        .sec{padding:88px 0}
        .fu{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
        .fv{opacity:1!important;transform:none!important}
        input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#E5E7EB;border-radius:4px;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:#1B5E37;border-radius:50%;box-shadow:0 2px 6px rgba(27,94,55,.3)}
        select{width:100%;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;background:white;font-family:'DM Sans',sans-serif;font-size:15px;color:#111827;-webkit-appearance:none;appearance:none;outline:none;cursor:pointer;transition:border-color .15s;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
        select:focus{border-color:#1B5E37}
        @media(max-width:960px){
          .c{padding:0 20px}
          .g2,.g3,.g4,.hero-g,.foerd-g{grid-template-columns:1fr!important}
          .hero-card{display:none!important}
          .stats-g{grid-template-columns:1fr 1fr!important}
          .si-last{border-right:none!important}
        }
      `}</style>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:999,transition:'all .3s',background:scrolled?'rgba(255,255,255,.97)':'transparent',borderBottom:scrolled?`1px solid ${BDR}`:'none',backdropFilter:scrolled?'blur(12px)':'none'}}>
        <div style={{maxWidth:1220,margin:'0 auto',padding:'0 40px',height:68,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
            <div style={{width:34,height:34,background:G,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 1s-6 5.5-6 10a6 6 0 0012 0C16 6.5 10 1 10 1z" fill="white" opacity=".95"/><path d="M10 9s-3 3-3 5a3 3 0 006 0c0-2-3-5-3-5z" fill="white" opacity=".5"/></svg>
            </div>
            <span style={{fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:15,color:TX,letterSpacing:'-.01em'}}>
              Wärmepumpenbegleiter<span style={{color:G2}}>.de</span>
            </span>
          </a>
          <div style={{display:'flex',alignItems:'center',gap:28}}>
            {['Wie es funktioniert','Rechner','Förderung','Ratgeber'].map(l=>(
              <a key={l} href="#" style={{fontFamily:'DM Sans,sans-serif',fontSize:14,fontWeight:500,color:TX2,textDecoration:'none',transition:'color .15s'}}
                onMouseEnter={e=>(e.currentTarget.style.color=G)}
                onMouseLeave={e=>(e.currentTarget.style.color=TX2)}>{l}</a>
            ))}
          </div>
          <a href="#calculator" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',background:G,color:'white',borderRadius:R,fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:600,textDecoration:'none',boxShadow:`0 2px 8px rgba(27,94,55,.3)`,transition:'all .18s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background='#154d2c';(e.currentTarget as HTMLAnchorElement).style.transform='translateY(-1px)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background=G;(e.currentTarget as HTMLAnchorElement).style.transform=''}}>
            Kostenloses Angebot
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',overflow:'hidden',paddingTop:68}}>
        <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80"
          style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}} alt=""/>
        <div style={{position:'absolute',inset:0,zIndex:1,background:'linear-gradient(100deg,rgba(15,31,22,.93) 0%,rgba(15,31,22,.83) 45%,rgba(15,31,22,.35) 100%)'}}/>
        <div className="c" style={{position:'relative',zIndex:2,width:'100%',padding:'100px 40px 80px'}}>
          <div className="hero-g" style={{display:'grid',gridTemplateColumns:'55% 45%',gap:64,alignItems:'center'}}>
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:100,padding:'6px 14px',fontSize:13,fontWeight:500,color:'rgba(255,255,255,.85)',marginBottom:22}}>
                <span style={{width:7,height:7,background:G3,borderRadius:'50%',display:'inline-block',animation:'pulse 2s infinite'}}/>
                GEG 2026 — Jetzt informieren
              </div>
              <h1 style={{color:'white',marginBottom:20,lineHeight:1.1}}>
                Heizung tauschen<br/>
                <span style={{color:'#4CAF7D'}}>und bis zu<br/>€ 21.000</span><br/>
                sparen.
              </h1>
              <p style={{fontSize:18,color:'rgba(255,255,255,.72)',maxWidth:480,marginBottom:36,lineHeight:1.7}}>
                Wir begleiten Hausbesitzer durch den Wärmepumpen-Umstieg — kostenlos, herstellerunabhängig, mit geprüften Fachbetrieben in Ihrer Region.
              </p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:40}}>
                <a href="#calculator" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'16px 32px',background:G,color:'white',borderRadius:R,fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:600,textDecoration:'none',boxShadow:'0 2px 8px rgba(27,94,55,.4)',transition:'all .18s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background='#154d2c';(e.currentTarget as HTMLAnchorElement).style.transform='translateY(-1px)'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background=G;(e.currentTarget as HTMLAnchorElement).style.transform=''}}>
                  Kosten berechnen →
                </a>
                <a href="#foerderung" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'16px 32px',background:'rgba(255,255,255,.1)',color:'white',border:'1.5px solid rgba(255,255,255,.25)',borderRadius:R,fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:600,textDecoration:'none',transition:'all .18s'}}
                  onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,.18)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,.1)'}>
                  Förderung prüfen
                </a>
              </div>
              <div style={{display:'flex',gap:24,flexWrap:'wrap',borderTop:'1px solid rgba(255,255,255,.12)',paddingTop:24}}>
                {['733 Städte abgedeckt','Geprüfte Fachbetriebe','Bis 70% KfW-Förderung','100% kostenlos'].map(t=>(
                  <div key={t} style={{display:'flex',alignItems:'center',gap:7,fontSize:13,color:'rgba(255,255,255,.6)'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G3} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero card */}
            <div className="hero-card" style={{display:'flex',justifyContent:'flex-end'}}>
              <div style={{width:'100%',maxWidth:420,background:'white',borderRadius:RLG,overflow:'hidden',boxShadow:SHL,border:'none'}}>
                <div style={{background:GXLT,padding:28,borderBottom:`1px solid ${BDR}`}}>
                  <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'auto'}}>
                    <rect x="90" y="90" width="180" height="120" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
                    <polygon points="75,90 180,20 285,90" fill="#1B5E37"/>
                    <rect x="110" y="108" width="46" height="38" fill="#E8F5EE" stroke="#E5E7EB" strokeWidth="1"/>
                    <line x1="133" y1="108" x2="133" y2="146" stroke="#E5E7EB"/>
                    <line x1="110" y1="127" x2="156" y2="127" stroke="#E5E7EB"/>
                    <rect x="204" y="108" width="46" height="38" fill="#E8F5EE" stroke="#E5E7EB" strokeWidth="1"/>
                    <line x1="227" y1="108" x2="227" y2="146" stroke="#E5E7EB"/>
                    <line x1="204" y1="127" x2="250" y2="127" stroke="#E5E7EB"/>
                    <rect x="157" y="154" width="46" height="56" fill="#F2FAF5" stroke="#E5E7EB" strokeWidth="1" rx="2"/>
                    <circle cx="197" cy="184" r="3" fill="#D97706"/>
                    <rect x="14" y="160" width="60" height="46" fill="white" stroke="#1B5E37" strokeWidth="1.5" rx="6"/>
                    <rect x="20" y="166" width="18" height="34" fill="#E8F5EE" rx="3"/>
                    <circle cx="53" cy="183" r="12" fill="#F2FAF5" stroke="#3DA16A" strokeWidth="1.2"/>
                    <path d="M53 171v24M41 183h24" stroke="#1B5E37" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M44.5 174.5l17 17M44.5 191.5l17-17" stroke="#1B5E37" strokeWidth="1" strokeLinecap="round" opacity=".4"/>
                    <rect x="12" y="210" width="64" height="14" fill="#1B5E37" rx="3"/>
                    <text x="44" y="221" fontFamily="DM Sans" fontSize="8" fontWeight="600" fill="white" textAnchor="middle">Wärmepumpe</text>
                    <path d="M74 178 Q105 178 105 158 Q105 138 125 138" stroke="#3DA16A" strokeWidth="2" strokeDasharray="5,4" fill="none">
                      <animate attributeName="stroke-dashoffset" values="0;-18" dur="1.5s" repeatCount="indefinite"/>
                    </path>
                    <rect x="276" y="145" width="72" height="28" fill="white" stroke="#E5E7EB" strokeWidth="1" rx="7"/>
                    <text x="285" y="163" fontFamily="JetBrains Mono" fontSize="12" fontWeight="700" fill="#1B5E37">21°C</text>
                    <text x="322" y="163" fontFamily="DM Sans" fontSize="9" fill="#9CA3AF">innen</text>
                    <rect x="276" y="180" width="72" height="24" fill="#F2FAF5" stroke="#E5E7EB" strokeWidth="1" rx="7"/>
                    <text x="285" y="196" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" fill="#4B5563">−3°C</text>
                    <text x="325" y="196" fontFamily="DM Sans" fontSize="9" fill="#9CA3AF">außen</text>
                    <rect x="148" y="46" width="64" height="22" fill="#1B5E37" rx="4"/>
                    <text x="180" y="61" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" fill="#4CAF7D" textAnchor="middle">A+++</text>
                  </svg>
                </div>
                <div style={{padding:'20px 24px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
                    <div>
                      <div style={{fontSize:12,color:TX3,fontWeight:500,marginBottom:3}}>Jährl. Ersparnis</div>
                      <div className="mono" style={{fontSize:22,fontWeight:700,color:AMB}}>€ 959 / Jahr</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:12,color:TX3,fontWeight:500,marginBottom:3}}>KfW-Förderung</div>
                      <div className="mono" style={{fontSize:22,fontWeight:700,color:G}}>bis 70%</div>
                    </div>
                  </div>
                  <a href="#calculator" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'12px 20px',background:G,color:'white',borderRadius:R,fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:600,textDecoration:'none',transition:'background .18s'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='#154d2c'}
                    onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background=G}>
                    Jetzt berechnen →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      </section>

      {/* TRUST BAR */}
      <div style={{background:'white',borderBottom:`1px solid ${BDR}`,padding:'16px 0'}}>
        <div className="c" style={{display:'flex',alignItems:'center',gap:32,flexWrap:'wrap'}}>
          <span style={{fontSize:12,fontWeight:600,color:TX3,textTransform:'uppercase',letterSpacing:'.08em',flexShrink:0}}>Datenquellen</span>
          {['KfW','BAFA','BWP','Fraunhofer ISE','Verbraucherzentrale','DWD'].map(s=>(
            <span key={s} style={{fontSize:13,fontWeight:600,color:TX3}}>{s}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div ref={stats.ref} style={{background:G,padding:'56px 0'}}>
        <div className="c">
          <div className="stats-g" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
            {[
              {val:c1.toLocaleString('de-DE'),suf:'',lbl:'Wärmepumpen installiert in DE (2025)'},
              {val:c2,suf:'%',lbl:'Maximale KfW-Förderung'},
              {val:'€\u202F'+c3.toLocaleString('de-DE'),suf:'',lbl:'Maximaler Förderbetrag (EFH)'},
              {val:c4,suf:'+J',lbl:'Lebensdauer einer Wärmepumpe'},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:'center',padding:'12px 20px',borderRight:i<3?'1px solid rgba(255,255,255,.15)':'none'}}>
                <div className="mono" style={{fontSize:42,fontWeight:700,color:'white',lineHeight:1,marginBottom:6}}>{s.val}{s.suf}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,.6)',lineHeight:1.4}}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEPS */}
      <section ref={steps.ref} className="sec" style={{background:'white'}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:540,margin:'0 auto 56px'}}>
            <span style={{display:'inline-block',background:GLT,color:G,fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:14}}>So funktioniert es</span>
            <h2>In 3 Schritten zur Wärmepumpe</h2>
          </div>
          <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {n:'01',title:'Daten eingeben',body:'Gebäudetyp, Baujahr, PLZ — in unter 2 Minuten. Kein Vorwissen nötig.',tag:'2 Minuten',accent:G,
                icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'},
              {n:'02',title:'Angebote erhalten',body:'Bis zu 3 geprüfte Fachbetriebe aus Ihrer Region melden sich innerhalb von 48h.',tag:'Kostenlos',accent:AMB,
                icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0'},
              {n:'03',title:'Förderung sichern',body:'Bis zu €21.000 KfW-Zuschuss — wir erklären den Antragsprozess Schritt für Schritt.',tag:'Bis €21.000',accent:G2,
                icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'},
            ].map((s,i)=>(
              <div key={i} className={`fu ${steps.v?'fv':''}`}
                style={{background:'white',border:`1px solid ${BDR}`,borderRadius:RLG,boxShadow:SH,padding:28,transitionDelay:`${i*.1}s`,borderTop:`3px solid ${s.accent}`,cursor:'default',transition:'all .25s ease, opacity .6s ease, transform .6s ease'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)';(e.currentTarget as HTMLDivElement).style.boxShadow=SHL}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='';(e.currentTarget as HTMLDivElement).style.boxShadow=SH}}>
                <div style={{width:44,height:44,borderRadius:10,background:GLT,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}/></svg>
                </div>
                <div style={{fontFamily:'Outfit,sans-serif',fontSize:13,fontWeight:700,color:TX3,marginBottom:6}}>{s.n}</div>
                <h3 style={{fontSize:19,marginBottom:8}}>{s.title}</h3>
                <p style={{fontSize:14,color:TX2,lineHeight:1.65,marginBottom:16}}>{s.body}</p>
                <span style={{display:'inline-block',background:GLT,color:G,fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',padding:'4px 10px',borderRadius:100}}>{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section ref={calcS.ref} id="calculator" className="sec" style={{background:BG}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:560,margin:'0 auto 52px'}}>
            <span style={{display:'inline-block',background:GLT,color:G,fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:14}}>Kostenrechner</span>
            <h2>Was kostet Ihre alte Heizung wirklich?</h2>
            <p style={{fontSize:16,color:TX2,marginTop:12,lineHeight:1.65}}>Geben Sie Ihre Gebäudedaten ein — der Rechner zeigt Ihre Ersparnis, Förderung und Amortisation.</p>
          </div>
          <div className="g2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28,alignItems:'start'}}>
            <div className={`fu ${calcS.v?'fv':''}`} style={{background:'white',border:`1px solid ${BDR}`,borderRadius:RLG,boxShadow:SH,padding:28}}>
              <div style={{marginBottom:22}}>
                <label style={{display:'block',fontSize:13,fontWeight:600,color:TX2,marginBottom:10}}>Wohnfläche</label>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <input type="range" min={60} max={350} step={5} value={fl} onChange={e=>setFl(+e.target.value)}/>
                  <span className="mono" style={{fontSize:15,fontWeight:700,color:G,minWidth:60,textAlign:'right'}}>{fl} m²</span>
                </div>
              </div>
              <div style={{marginBottom:22}}>
                <label style={{display:'block',fontSize:13,fontWeight:600,color:TX2,marginBottom:10}}>Aktuelle Heizung</label>
                <select value={hz} onChange={e=>setHz(e.target.value)}>
                  <option value="erdgas">Erdgas-Brennwert</option>
                  <option value="heizoel">Heizöl</option>
                  <option value="nachtspeicher">Nachtspeicher</option>
                </select>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:600,color:TX2,marginBottom:10}}>Baujahr Gebäude</label>
                <select value={bj} onChange={e=>setBj(e.target.value)}>
                  <option value="vor_1978">vor 1978</option>
                  <option value="1979_1994">1979 – 1994</option>
                  <option value="1995_2009">1995 – 2009</option>
                  <option value="2010_plus">2010 und neuer</option>
                </select>
              </div>
            </div>

            <div className={`fu ${calcS.v?'fv':''}`} style={{transitionDelay:'.12s'}}>
              <div style={{background:G,borderRadius:RLG,padding:28,marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,.65)',marginBottom:6}}>Jährliche Ersparnis</div>
                <div className="mono" style={{fontSize:44,fontWeight:700,color:'white',lineHeight:1,marginBottom:4}}>{fmt(r.ers)}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,.5)'}}>pro Jahr mit Wärmepumpe</div>
              </div>
              <div style={{background:'white',border:`1px solid ${BDR}`,borderRadius:RLG,boxShadow:SH,padding:20,marginBottom:12}}>
                {[
                  {lbl:'Heizkosten heute',val:fmt(r.alt)+' / Jahr',c:AMB},
                  {lbl:'Mit Wärmepumpe',val:fmt(r.wp)+' / Jahr',c:G},
                  {lbl:'Amortisation (55% Förderung)',val:r.amort+' Jahre',c:TX},
                ].map(row=>(
                  <div key={row.lbl} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${BDR}`}}>
                    <span style={{fontSize:14,color:TX2}}>{row.lbl}</span>
                    <span className="mono" style={{fontSize:15,fontWeight:700,color:row.c}}>{row.val}</span>
                  </div>
                ))}
              </div>
              <a href="/rechner" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'16px 20px',background:AMB,color:'white',borderRadius:R,fontFamily:'Outfit,sans-serif',fontSize:15,fontWeight:600,textDecoration:'none',boxShadow:'0 2px 8px rgba(217,119,6,.3)',transition:'background .18s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='#b45309'}
                onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background=AMB}>
                Detailliertes Angebot anfordern →
              </a>
              <p style={{fontSize:12,color:TX3,textAlign:'center',marginTop:10}}>🔒 Kostenlos & unverbindlich. Kein Spam.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FÖRDERUNG */}
      <section ref={foerd.ref} id="foerderung" className="sec" style={{background:'white'}}>
        <div className="c">
          <div className="foerd-g" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
            <div className={`fu ${foerd.v?'fv':''}`}>
              <span style={{display:'inline-block',background:GLT,color:G,fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:16}}>KfW-Programm 458</span>
              <h2 style={{marginBottom:16}}>Bis zu €21.000<br/>Zuschuss vom Staat</h2>
              <p style={{fontSize:16,color:TX2,lineHeight:1.7,marginBottom:28}}>Der Zuschuss ist nicht rückzahlbar. Maximal €30.000 Investitionskosten werden gefördert — kumulierbar bis 70%.</p>
              {[
                {lbl:'Grundförderung',pct:30,w:43,color:G3},
                {lbl:'Klima-Speed-Bonus (fossile Heizung ersetzen)',pct:20,w:29,color:AMB},
                {lbl:'Einkommens-Bonus (unter €40k/Jahr netto)',pct:30,w:43,color:'#F59E0B'},
                {lbl:'Natürliches Kältemittel R290',pct:5,w:7,color:G2},
              ].map((b,i)=>(
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:14,color:TX2}}>{b.lbl}</span>
                    <span className="mono" style={{fontSize:14,fontWeight:700,color:b.color}}>+{b.pct}%</span>
                  </div>
                  <div style={{height:7,background:BG,borderRadius:8,overflow:'hidden',border:`1px solid ${BDR}`}}>
                    <div style={{height:'100%',background:b.color,borderRadius:8,width:foerd.v?`${b.w}%`:'0%',transition:`width 1.2s cubic-bezier(.16,1,.3,1) ${i*.12}s`}}/>
                  </div>
                </div>
              ))}
              <div style={{marginTop:24,padding:'16px 20px',background:GLT,borderRadius:R,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:15,fontWeight:600,color:G}}>Gesamt möglich</span>
                <span className="mono" style={{fontSize:24,fontWeight:700,color:G}}>bis 70% = €21.000</span>
              </div>
            </div>

            <div className={`fu ${foerd.v?'fv':''}`} style={{transitionDelay:'.15s'}}>
              <div style={{background:'white',border:`1px solid ${BDR}`,borderRadius:RLG,boxShadow:SH,overflow:'hidden'}}>
                <div style={{background:G,padding:'24px 28px'}}>
                  <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,.65)',marginBottom:4}}>Beispielrechnung: 120 m² EFH</div>
                  <div style={{fontFamily:'Outfit,sans-serif',fontSize:28,fontWeight:700,color:'white',marginBottom:4}}>Ihr Eigenanteil nur</div>
                  <div className="mono" style={{fontSize:48,fontWeight:700,color:'#4CAF7D',lineHeight:1}}>€ 11.250</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,.5)',marginTop:4}}>statt €25.000 Gesamtinvestition</div>
                </div>
                <div style={{padding:'20px 28px'}}>
                  {[
                    {lbl:'Gesamtinvestition',val:'€ 25.000',bold:false,amber:false},
                    {lbl:'Grundförderung (30%)',val:'− € 7.500',bold:false,amber:true},
                    {lbl:'Klima-Speed-Bonus (20%)',val:'− € 5.000',bold:false,amber:true},
                    {lbl:'Einkommens-Bonus (0%)*',val:'− € 0',bold:false,muted:true},
                    {lbl:'Ihr Eigenanteil',val:'€ 11.250',bold:true,amber:false},
                  ].map((row,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:i<4?`1px solid ${BDR}`:'none'}}>
                      <span style={{fontSize:14,color:row.muted?TX3:TX2}}>{row.lbl}</span>
                      <span className="mono" style={{fontSize:14,fontWeight:row.bold?700:600,color:row.amber?AMB:row.bold?G:TX}}>{row.val}</span>
                    </div>
                  ))}
                  <p style={{fontSize:12,color:TX3,marginTop:12}}>* Mit Einkommens-Bonus: Eigenanteil nur €3.750</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GEG TIMELINE */}
      <section className="sec" style={{background:BG}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:540,margin:'0 auto 52px'}}>
            <span style={{display:'inline-block',background:AMBL,color:'#92400E',fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:14}}>Regulatorischer Druck</span>
            <h2>Das GEG macht den Wechsel unausweichlich</h2>
          </div>
          <div className="g4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {year:'2024',title:'GEG in Kraft',body:'Jede neue Heizung muss 65% erneuerbare Energie nutzen.',color:G,active:true,urgent:false},
              {year:'30.06.2026',title:'Großstädte',body:'65%-Pflicht für Bestandsgebäude in Kommunen über 100.000 EW.',color:AMB,active:true,urgent:true},
              {year:'30.06.2028',title:'Alle Kommunen',body:'Die 65%-Pflicht gilt dann flächendeckend in Deutschland.',color:G2,active:false,urgent:false},
              {year:'2045',title:'Vollverbot',body:'Fossile Heizungen werden vollständig verboten.',color:TX3,active:false,urgent:false},
            ].map((t,i)=>(
              <div key={i} style={{background:'white',border:`1px solid ${BDR}`,borderRadius:RLG,boxShadow:SH,padding:'22px 20px',borderTop:`3px solid ${t.color}`,opacity:t.active?1:.75}}>
                <div className="mono" style={{fontSize:13,fontWeight:700,color:t.color,marginBottom:6,display:'flex',alignItems:'center',gap:8}}>
                  {t.year}
                  {t.urgent && <span style={{background:AMBL,color:'#92400E',fontSize:10,fontWeight:700,padding:'2px 6px',borderRadius:4}}>Bald!</span>}
                </div>
                <div style={{fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:600,marginBottom:6}}>{t.title}</div>
                <p style={{fontSize:13,color:TX2,lineHeight:1.55}}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WP TYPEN */}
      <section className="sec" style={{background:'white'}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:480,margin:'0 auto 52px'}}>
            <span style={{display:'inline-block',background:GLT,color:G,fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:14}}>Welche WP passt zu mir?</span>
            <h2>Die drei Typen im Vergleich</h2>
          </div>
          <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {type:'Luft-Wasser',share:'92%',jaz:'3,2–4,0',install:'€3.000–6.000',pros:['Keine Erdarbeiten nötig','Auch im Altbau geeignet','Installation in 1–2 Tagen'],highlight:true},
              {type:'Sole-Wasser',share:'6%',jaz:'4,0–5,0',install:'€6.000–12.000',pros:['+5% KfW-Bonus','Konstante Effizienz','Unabhängig von Außentemperatur'],highlight:false},
              {type:'Wasser-Wasser',share:'2%',jaz:'5,0–6,0+',install:'€8.000–15.000',pros:['+5% KfW-Bonus','Höchste Jahresarbeitszahl','Niedrigste Betriebskosten'],highlight:false},
            ].map((t,i)=>(
              <div key={i} style={{background:'white',border:t.highlight?`2px solid ${G}`:`1px solid ${BDR}`,borderRadius:RLG,boxShadow:SH,overflow:'hidden',transition:'all .25s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)';(e.currentTarget as HTMLDivElement).style.boxShadow=SHL}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='';(e.currentTarget as HTMLDivElement).style.boxShadow=SH}}>
                {t.highlight && <div style={{background:G,padding:'6px 16px',fontSize:11,fontWeight:700,color:'white',fontFamily:'Outfit,sans-serif',letterSpacing:'.06em',textTransform:'uppercase'}}>Meistgewählt</div>}
                <div style={{padding:22}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                    <h3 style={{fontSize:18}}>{t.type}</h3>
                    <span style={{background:GLT,color:G,fontSize:11,fontWeight:700,padding:'3px 8px',borderRadius:100,whiteSpace:'nowrap'}}>{t.share}</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
                    {[{lbl:'JAZ',val:t.jaz},{lbl:'Installation',val:t.install}].map(s=>(
                      <div key={s.lbl} style={{background:BG,borderRadius:8,padding:'10px 12px'}}>
                        <div style={{fontSize:11,color:TX3,fontWeight:600,marginBottom:3}}>{s.lbl}</div>
                        <div className="mono" style={{fontSize:12,fontWeight:700,color:TX}}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                  {t.pros.map(p=>(
                    <div key={p} style={{display:'flex',gap:8,fontSize:13,color:TX2,marginBottom:6,alignItems:'center'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testi.ref} className="sec" style={{background:BG}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:480,margin:'0 auto 52px'}}>
            <span style={{display:'inline-block',background:GLT,color:G,fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:14}}>Erfahrungen</span>
            <h2>Was Hausbesitzer berichten</h2>
          </div>
          <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {init:'B',name:'Familie Brehmer',city:'Hannover',tag:'Luft-Wasser-WP · €1.100/Jahr gespart',text:'„Nach 20 Jahren Ölheizung dachten wir, der Umstieg wäre riesig. Wir haben drei Angebote bekommen — alles unkompliziert erklärt."',delay:'.1s'},
              {init:'M',name:'Thomas Müller',city:'Freiburg',tag:'Sole-Wasser-WP · 65% Förderung',text:'„Endlich jemand, der das Förder-Chaos erklärt. Den KfW-Antrag hätte ich alleine nie geschafft — hier wurde ich Schritt für Schritt begleitet."',delay:'.2s'},
              {init:'K',name:'Sabine Kröger',city:'Münster',tag:'Luft-Wasser-WP · 3 Angebote',text:'„Als Vermieterin war ich skeptisch. Die Berechnung hat gezeigt, dass es sich eindeutig lohnt. Keine Druckverkäufe, sehr seriös."',delay:'.3s'},
            ].map((t,i)=>(
              <div key={i} className={`fu ${testi.v?'fv':''}`}
                style={{background:'white',border:`1px solid ${BDR}`,borderRadius:RLG,boxShadow:SH,padding:24,transitionDelay:t.delay,cursor:'default',transition:`all .25s ease, opacity .6s ease ${t.delay}, transform .6s ease ${t.delay}`}}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)';(e.currentTarget as HTMLDivElement).style.boxShadow=SHL}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='';(e.currentTarget as HTMLDivElement).style.boxShadow=SH}}>
                <div style={{color:'#F59E0B',fontSize:14,letterSpacing:3,marginBottom:14}}>★★★★★</div>
                <p style={{fontSize:14,color:TX2,lineHeight:1.7,fontStyle:'italic',marginBottom:18}}>{t.text}</p>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:GLT,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:700,color:G,flexShrink:0}}>{t.init}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:TX}}>{t.name} · {t.city}</div>
                    <div style={{fontSize:12,color:TX3,marginTop:2}}>{t.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:G,padding:'96px 0',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:.04,backgroundImage:'radial-gradient(circle at 25% 50%, white 0%, transparent 50%), radial-gradient(circle at 75% 50%, white 0%, transparent 50%)'}}/>
        <div className="c" style={{position:'relative'}}>
          <span style={{display:'inline-block',background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.8)',fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:16}}>Jetzt starten</span>
          <h2 style={{color:'white',fontSize:'clamp(32px,4vw,54px)',marginBottom:16}}>Bereit für die Heizungswende?</h2>
          <p style={{fontSize:18,color:'rgba(255,255,255,.7)',marginBottom:36}}>Kostenloses Angebot in 2 Minuten — ohne Vertragsbindung.</p>
          <a href="/rechner" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'16px 32px',background:'white',color:G,borderRadius:R,fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:700,textDecoration:'none',boxShadow:'0 4px 20px rgba(0,0,0,.2)',transition:'all .18s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.transform='translateY(-1px)';(e.currentTarget as HTMLAnchorElement).style.boxShadow='0 8px 28px rgba(0,0,0,.25)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.transform='';(e.currentTarget as HTMLAnchorElement).style.boxShadow='0 4px 20px rgba(0,0,0,.2)'}}>
            Kostenloses Angebot anfordern →
          </a>
          <div style={{fontSize:13,color:'rgba(255,255,255,.45)',marginTop:18,display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap'}}>
            <span>✓ Kein Spam</span><span>✓ Keine Weitergabe ohne Zustimmung</span><span>✓ 100% kostenlos</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#0A1710',padding:'60px 0 28px'}}>
        <div className="c">
          <div className="g4" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:48}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                <div style={{width:32,height:32,background:G,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 1s-6 5.5-6 10a6 6 0 0012 0C16 6.5 10 1 10 1z" fill="white" opacity=".95"/></svg>
                </div>
                <span style={{fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:14,color:'white'}}>Wärmepumpenbegleiter.de</span>
              </div>
              <p style={{fontSize:13,color:'rgba(255,255,255,.35)',lineHeight:1.65,maxWidth:210}}>Ihr unabhängiger Begleiter für die Heizungswende.</p>
            </div>
            {[
              {h:'Navigation',links:['Rechner','Ratgeber','Über uns','Kontakt']},
              {h:'Städte',links:['Berlin','Hamburg','München','Köln','Frankfurt','Stuttgart']},
              {h:'Rechtliches',links:['Impressum','Datenschutz','AGB']},
            ].map(col=>(
              <div key={col.h}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.25)',marginBottom:14}}>{col.h}</div>
                {col.links.map(l=>(
                  <a key={l} href="#" style={{display:'block',fontSize:13,color:'rgba(255,255,255,.45)',textDecoration:'none',marginBottom:8,transition:'color .15s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='white')}
                    onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.45)')}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:20,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
            <span style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>© 2026 Wärmepumpenbegleiter.de</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>Wir erhalten eine Vermittlungsprovision. Für Sie kostenlos.</span>
          </div>
        </div>
      </footer>
    </>
  )
}
