'use client'
import { useState, useEffect, useRef } from 'react'

const BEDARF: Record<string,number> = { vor_1978:215,'1979_1994':165,'1995_2009':101,'2010_plus':72 }
function calc(fl:number,hz:string,bj:string){
  const pr:Record<string,number>={erdgas:.12,heizoel:.11,nachtspeicher:.32}
  const wg:Record<string,number>={erdgas:.92,heizoel:.90,nachtspeicher:.98}
  const b=fl*((BEDARF[bj]||160)+12.5)
  const alt=Math.round(b/wg[hz]*pr[hz]),wp=Math.round(b/3.5*.27)
  return{alt,wp,ers:alt-wp,amort:Math.round((25000*.45)/(alt-wp+200)*10)/10}
}
function fmt(n:number){return'\u20AC\u202F'+Math.round(n).toLocaleString('de-DE')}

function useInView(threshold=0.15){
  const ref=useRef<HTMLDivElement>(null)
  const [v,setV]=useState(false)
  useEffect(()=>{
    if(typeof window==='undefined')return
    const el=ref.current;if(!el)return
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect()}},{threshold})
    io.observe(el);return()=>io.disconnect()
  },[threshold])
  return{ref,v}
}
function useCounter(target:number,active:boolean,duration=1600){
  const[val,setVal]=useState(0)
  useEffect(()=>{
    if(!active)return
    let raf:number
    const start=performance.now()
    const step=(now:number)=>{
      const p=Math.min((now-start)/duration,1),e=1-Math.pow(1-p,3)
      setVal(Math.round(e*target))
      if(p<1)raf=requestAnimationFrame(step)
    }
    raf=requestAnimationFrame(step)
    return()=>cancelAnimationFrame(raf)
  },[active,target,duration])
  return val
}

// colour tokens
const G='#1B5E37',G2='#2A7D4F',G3='#3DA16A'
const GLT='#E8F5EE',GXLT='#F2FAF5'
const AMB='#D97706',AMBL='#FEF3C7'
const TX='#111827',TX2='#4B5563',TX3='#9CA3AF'
const BDR='#E5E7EB',BG='#F8F9FA'
const SH='0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.04)'
const SHL='0 4px 6px rgba(0,0,0,.05),0 16px 48px rgba(0,0,0,.1)'

function Tag({bg,color,text}:{bg:string,color:string,text:string}){
  return(
    <span style={{display:'inline-block',background:bg,color,fontSize:11,fontWeight:700,
      letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:16}}>
      {text}
    </span>
  )
}

export default function Home(){
  const[scrolled,setScrolled]=useState(false)
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>50)
    window.addEventListener('scroll',fn,{passive:true})
    return()=>window.removeEventListener('scroll',fn)
  },[])

  const[fl,setFl]=useState(130),[hz,setHz]=useState('erdgas'),[bj,setBj]=useState('1979_1994')
  const r=calc(fl,hz,bj)

  const statsRef=useInView(0.1)
  const stepsRef=useInView()
  const calcRef=useInView()
  const foerdRef=useInView(0.1)
  const testiRef=useInView()

  const c1=useCounter(299000,statsRef.v)
  const c2=useCounter(70,statsRef.v)
  const c3=useCounter(21000,statsRef.v)
  const c4=useCounter(25,statsRef.v)

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:BG,color:TX,overflowX:'hidden'}}>
      {/* fonts + resets */}
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet"/>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{-webkit-font-smoothing:antialiased}
        h1,h2,h3{font-family:'Outfit',sans-serif;line-height:1.15;color:#111827}
        h1{font-size:clamp(40px,5.5vw,68px);font-weight:800;letter-spacing:-.02em}
        h2{font-size:clamp(30px,3.5vw,48px);font-weight:700;letter-spacing:-.01em}
        h3{font-size:clamp(18px,2vw,24px);font-weight:600}
        .mono{font-family:'JetBrains Mono',monospace}
        .c{max-width:1220px;margin:0 auto;padding:0 40px}
        .sec{padding:88px 0}
        .fu{opacity:0;transform:translateY(24px);transition:opacity .65s ease,transform .65s ease}
        .fv{opacity:1!important;transform:none!important}
        input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#E5E7EB;border-radius:4px;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:#1B5E37;border-radius:50%;box-shadow:0 2px 6px rgba(27,94,55,.3);cursor:pointer}
        select{width:100%;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;background:white;font-family:'DM Sans',sans-serif;font-size:15px;color:#111827;-webkit-appearance:none;appearance:none;outline:none;cursor:pointer;transition:border-color .15s;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
        select:focus{border-color:#1B5E37}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @media(max-width:960px){
          .c{padding:0 20px!important}
          .hero-g,.g2,.g3,.g4,.foerd-g{grid-template-columns:1fr!important}
          .hero-card{display:none!important}
          .stats-g{grid-template-columns:1fr 1fr!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:999,height:68,display:'flex',alignItems:'center',
        background:scrolled?'rgba(255,255,255,.96)':'transparent',
        borderBottom:scrolled?`1px solid ${BDR}`:'none',
        backdropFilter:scrolled?'blur(14px)':'none',
        transition:'all .3s'}}>
        <div className="c" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
            <div style={{width:34,height:34,background:G,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 1s-6 5.5-6 10a6 6 0 0012 0C16 6.5 10 1 10 1z" fill="white" opacity=".95"/>
                <path d="M10 9s-3 3-3 5a3 3 0 006 0c0-2-3-5-3-5z" fill="white" opacity=".5"/>
              </svg>
            </div>
            <span style={{fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:15,color:TX}}>
              Wärmepumpenbegleiter<span style={{color:G2}}>.de</span>
            </span>
          </a>
          <div style={{display:'flex',alignItems:'center',gap:28}}>
            {['Wie es funktioniert','Rechner','Förderung','Ratgeber'].map(l=>(
              <a key={l} href="#" style={{fontSize:14,fontWeight:500,color:TX2,textDecoration:'none',transition:'color .15s'}}
                onMouseEnter={e=>(e.currentTarget.style.color=G)}
                onMouseLeave={e=>(e.currentTarget.style.color=TX2)}>{l}</a>
            ))}
          </div>
          <a href="#calculator" style={{padding:'10px 20px',background:G,color:'white',borderRadius:'10px',
            fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:600,textDecoration:'none',
            boxShadow:'0 2px 8px rgba(27,94,55,.3)',transition:'all .18s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background='#154d2c'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background=G}}>
            Kostenloses Angebot
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',overflow:'hidden',paddingTop:68}}>
        {/* background photo */}
        <img
          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80"
          alt=""
          style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}
        />
        {/* dark overlay */}
        <div style={{position:'absolute',inset:0,zIndex:1,
          background:'linear-gradient(105deg,rgba(10,25,16,.94) 0%,rgba(10,25,16,.85) 45%,rgba(10,25,16,.3) 100%)'}}/>

        <div className="c" style={{position:'relative',zIndex:2,width:'100%',padding:'96px 40px 80px'}}>
          <div className="hero-g" style={{display:'grid',gridTemplateColumns:'54% 46%',gap:60,alignItems:'center'}}>

            {/* left */}
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:7,
                background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',
                borderRadius:100,padding:'6px 14px',fontSize:13,fontWeight:500,
                color:'rgba(255,255,255,.88)',marginBottom:24}}>
                <span style={{width:7,height:7,background:G3,borderRadius:'50%',display:'inline-block',animation:'pulse 2s infinite'}}/>
                GEG 2026 — Jetzt informieren
              </div>
              <h1 style={{color:'white',marginBottom:22,lineHeight:1.1}}>
                Heizung tauschen<br/>
                <span style={{color:'#4CAF7D'}}>und bis zu<br/>€ 21.000</span><br/>
                sparen.
              </h1>
              <p style={{fontSize:18,color:'rgba(255,255,255,.72)',maxWidth:480,marginBottom:36,lineHeight:1.75,fontFamily:"'DM Sans',sans-serif"}}>
                Wir begleiten Hausbesitzer durch den Wärmepumpen-Umstieg — kostenlos, herstellerunabhängig, mit geprüften Fachbetrieben.
              </p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:40}}>
                <a href="#calculator" style={{display:'inline-flex',alignItems:'center',padding:'15px 30px',
                  background:G,color:'white',borderRadius:'10px',fontFamily:'Outfit,sans-serif',
                  fontSize:16,fontWeight:600,textDecoration:'none',
                  boxShadow:'0 2px 12px rgba(27,94,55,.45)',transition:'all .18s'}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background='#154d2c';el.style.transform='translateY(-1px)'}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background=G;el.style.transform=''}}>
                  Kosten berechnen →
                </a>
                <a href="#foerderung" style={{display:'inline-flex',alignItems:'center',padding:'15px 30px',
                  background:'rgba(255,255,255,.1)',color:'white',
                  border:'1.5px solid rgba(255,255,255,.25)',borderRadius:'10px',
                  fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:600,textDecoration:'none',transition:'all .18s'}}
                  onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,.18)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,.1)'}>
                  Förderung prüfen
                </a>
              </div>
              <div style={{display:'flex',gap:22,flexWrap:'wrap',borderTop:'1px solid rgba(255,255,255,.12)',paddingTop:24}}>
                {['733 Städte abgedeckt','Geprüfte Fachbetriebe','Bis 70% KfW-Förderung','100% kostenlos'].map(t=>(
                  <div key={t} style={{display:'flex',alignItems:'center',gap:7,fontSize:13,color:'rgba(255,255,255,.62)'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G3} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* right — card */}
            <div className="hero-card" style={{display:'flex',justifyContent:'flex-end'}}>
              <div style={{width:'100%',maxWidth:420,background:'white',borderRadius:16,
                overflow:'hidden',boxShadow:SHL,animation:'float 6s ease-in-out infinite'}}>
                <div style={{background:GXLT,padding:28,borderBottom:`1px solid ${BDR}`}}>
                  <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'auto'}}>
                    <rect x="90" y="90" width="180" height="120" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
                    <polygon points="75,90 180,20 285,90" fill="#1B5E37"/>
                    <rect x="108" y="108" width="48" height="38" fill="#E8F5EE" stroke="#E5E7EB" strokeWidth="1"/>
                    <line x1="132" y1="108" x2="132" y2="146" stroke="#E5E7EB"/>
                    <line x1="108" y1="127" x2="156" y2="127" stroke="#E5E7EB"/>
                    <rect x="204" y="108" width="48" height="38" fill="#E8F5EE" stroke="#E5E7EB" strokeWidth="1"/>
                    <line x1="228" y1="108" x2="228" y2="146" stroke="#E5E7EB"/>
                    <line x1="204" y1="127" x2="252" y2="127" stroke="#E5E7EB"/>
                    <rect x="157" y="154" width="46" height="56" fill="#F2FAF5" stroke="#E5E7EB" strokeWidth="1" rx="2"/>
                    <circle cx="197" cy="184" r="3" fill="#D97706"/>
                    <rect x="14" y="158" width="60" height="48" fill="white" stroke="#1B5E37" strokeWidth="1.5" rx="7"/>
                    <rect x="20" y="165" width="18" height="34" fill="#E8F5EE" rx="3"/>
                    <circle cx="53" cy="182" r="12" fill="#F2FAF5" stroke="#3DA16A" strokeWidth="1.5"/>
                    <path d="M53 170v24M41 182h24" stroke="#1B5E37" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M45 174l16 16M45 190l16-16" stroke="#1B5E37" strokeWidth="1" strokeLinecap="round" opacity=".35"/>
                    <rect x="10" y="210" width="68" height="15" fill="#1B5E37" rx="4"/>
                    <text x="44" y="221" fontFamily="sans-serif" fontSize="8" fontWeight="600" fill="white" textAnchor="middle">Wärmepumpe</text>
                    <path d="M74 177Q106 177 106 157Q106 137 126 137" stroke="#3DA16A" strokeWidth="2" strokeDasharray="5,4" fill="none">
                      <animate attributeName="stroke-dashoffset" values="0;-18" dur="1.5s" repeatCount="indefinite"/>
                    </path>
                    <path d="M74 173Q100 173 100 153Q100 133 120 133" stroke="#3DA16A" strokeWidth="1.2" strokeDasharray="4,5" fill="none" opacity=".4">
                      <animate attributeName="stroke-dashoffset" values="0;-18" dur="2.1s" repeatCount="indefinite"/>
                    </path>
                    <rect x="276" y="144" width="72" height="28" fill="white" stroke="#E5E7EB" rx="7"/>
                    <text x="288" y="162" fontFamily="monospace" fontSize="13" fontWeight="700" fill="#1B5E37">21°C</text>
                    <text x="325" y="162" fontFamily="sans-serif" fontSize="9" fill="#9CA3AF">innen</text>
                    <rect x="276" y="179" width="72" height="26" fill="#F2FAF5" stroke="#E5E7EB" rx="7"/>
                    <text x="288" y="196" fontFamily="monospace" fontSize="12" fontWeight="600" fill="#4B5563">-3°C</text>
                    <text x="326" y="196" fontFamily="sans-serif" fontSize="9" fill="#9CA3AF">außen</text>
                    <rect x="148" y="44" width="64" height="22" fill="#1B5E37" rx="5"/>
                    <text x="180" y="59" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#4CAF7D" textAnchor="middle">A+++</text>
                  </svg>
                </div>
                <div style={{padding:'20px 24px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
                    <div>
                      <div style={{fontSize:12,color:TX3,marginBottom:3}}>Jährl. Ersparnis</div>
                      <div className="mono" style={{fontSize:22,fontWeight:700,color:AMB}}>€ 959 / Jahr</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:12,color:TX3,marginBottom:3}}>KfW-Förderung</div>
                      <div className="mono" style={{fontSize:22,fontWeight:700,color:G}}>bis 70%</div>
                    </div>
                  </div>
                  <a href="#calculator" style={{display:'flex',alignItems:'center',justifyContent:'center',
                    padding:'12px',background:G,color:'white',borderRadius:'10px',
                    fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:600,textDecoration:'none',transition:'background .18s'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='#154d2c'}
                    onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background=G}>
                    Jetzt berechnen →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{background:'white',borderBottom:`1px solid ${BDR}`,padding:'14px 0'}}>
        <div className="c" style={{display:'flex',alignItems:'center',gap:28,flexWrap:'wrap'}}>
          <span style={{fontSize:11,fontWeight:700,color:TX3,textTransform:'uppercase',letterSpacing:'.1em',flexShrink:0}}>Datenquellen</span>
          {['KfW','BAFA','BWP','Fraunhofer ISE','Verbraucherzentrale','DWD'].map(s=>(
            <span key={s} style={{fontSize:13,fontWeight:600,color:TX3}}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div ref={statsRef.ref} style={{background:G,padding:'52px 0'}}>
        <div className="c">
          <div className="stats-g" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
            {[
              {val:c1.toLocaleString('de-DE'),suf:'',lbl:'Wärmepumpen installiert in DE (2025)'},
              {val:c2,suf:'%',lbl:'Maximale KfW-Förderung'},
              {val:'\u20AC\u202F'+c3.toLocaleString('de-DE'),suf:'',lbl:'Maximaler Förderbetrag (EFH)'},
              {val:c4,suf:'+ J.',lbl:'Lebensdauer einer Wärmepumpe'},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:'center',padding:'10px 20px',
                borderRight:i<3?'1px solid rgba(255,255,255,.14)':'none'}}>
                <div className="mono" style={{fontSize:42,fontWeight:700,color:'white',lineHeight:1,marginBottom:6}}>
                  {s.val}{s.suf}
                </div>
                <div style={{fontSize:13,color:'rgba(255,255,255,.55)',lineHeight:1.4}}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STEPS ── */}
      <section ref={stepsRef.ref} className="sec" style={{background:'white'}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:540,margin:'0 auto 52px'}}>
            <Tag bg={GLT} color={G} text="So funktioniert es"/>
            <h2>In 3 Schritten zur Wärmepumpe</h2>
          </div>
          <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {n:'01',title:'Daten eingeben',body:'Gebäudetyp, Baujahr, PLZ — in unter 2 Minuten. Kein Vorwissen nötig.',badge:'2 Minuten',accent:G,
                path:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'},
              {n:'02',title:'Angebote erhalten',body:'Bis zu 3 geprüfte Fachbetriebe melden sich innerhalb von 48 Stunden — kostenlos.',badge:'Kostenlos',accent:AMB,
                path:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0'},
              {n:'03',title:'Förderung sichern',body:'Bis zu €21.000 KfW-Zuschuss — wir begleiten Sie durch den Antragsprozess.',badge:'Bis €21.000',accent:G2,
                path:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'},
            ].map((s,i)=>(
              <div key={i} className={'fu '+(stepsRef.v?'fv':'')}
                style={{background:'white',border:`1px solid ${BDR}`,borderRadius:16,boxShadow:SH,
                  padding:28,transitionDelay:`${i*.1}s`,borderTop:`3px solid ${s.accent}`,
                  transition:'all .25s ease, opacity .65s ease, transform .65s ease'}}
                onMouseEnter={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='translateY(-3px)';d.style.boxShadow=SHL}}
                onMouseLeave={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='';d.style.boxShadow=SH}}>
                <div style={{width:44,height:44,borderRadius:10,background:GLT,
                  display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.path}/>
                  </svg>
                </div>
                <div style={{fontFamily:'Outfit,sans-serif',fontSize:12,fontWeight:700,color:TX3,letterSpacing:'.06em',marginBottom:7}}>{s.n}</div>
                <h3 style={{fontSize:20,marginBottom:9}}>{s.title}</h3>
                <p style={{fontSize:14,color:TX2,lineHeight:1.65,marginBottom:16}}>{s.body}</p>
                <span style={{display:'inline-block',background:GLT,color:G,fontSize:11,fontWeight:700,
                  letterSpacing:'.06em',textTransform:'uppercase',padding:'4px 10px',borderRadius:100}}>{s.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ── */}
      <section ref={calcRef.ref} id="calculator" className="sec" style={{background:BG}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:540,margin:'0 auto 48px'}}>
            <Tag bg={GLT} color={G} text="Kostenrechner"/>
            <h2>Was kostet Ihre alte Heizung wirklich?</h2>
            <p style={{fontSize:16,color:TX2,marginTop:12,lineHeight:1.65}}>Gebäudedaten eingeben — Ersparnis, Förderung und Amortisation auf einen Blick.</p>
          </div>
          <div className="g2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,alignItems:'start'}}>
            {/* inputs */}
            <div className={'fu '+(calcRef.v?'fv':'')}
              style={{background:'white',border:`1px solid ${BDR}`,borderRadius:16,boxShadow:SH,padding:28}}>
              {[
                {label:'Wohnfläche',content:(
                  <div style={{display:'flex',alignItems:'center',gap:14}}>
                    <input type="range" min={60} max={350} step={5} value={fl} onChange={e=>setFl(+e.target.value)}/>
                    <span className="mono" style={{fontSize:15,fontWeight:700,color:G,minWidth:62,textAlign:'right'}}>{fl} m²</span>
                  </div>
                )},
                {label:'Aktuelle Heizung',content:(
                  <select value={hz} onChange={e=>setHz(e.target.value)}>
                    <option value="erdgas">Erdgas-Brennwert</option>
                    <option value="heizoel">Heizöl</option>
                    <option value="nachtspeicher">Nachtspeicher</option>
                  </select>
                )},
                {label:'Baujahr Gebäude',content:(
                  <select value={bj} onChange={e=>setBj(e.target.value)}>
                    <option value="vor_1978">vor 1978</option>
                    <option value="1979_1994">1979 – 1994</option>
                    <option value="1995_2009">1995 – 2009</option>
                    <option value="2010_plus">2010 und neuer</option>
                  </select>
                )},
              ].map((f,i)=>(
                <div key={i} style={{marginBottom:i<2?22:0}}>
                  <label style={{display:'block',fontSize:13,fontWeight:600,color:TX2,marginBottom:9}}>{f.label}</label>
                  {f.content}
                </div>
              ))}
            </div>
            {/* results */}
            <div className={'fu '+(calcRef.v?'fv':'')} style={{transitionDelay:'.12s'}}>
              <div style={{background:G,borderRadius:16,padding:'24px 28px',marginBottom:14}}>
                <div style={{fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:5}}>Jährliche Ersparnis</div>
                <div className="mono" style={{fontSize:46,fontWeight:700,color:'white',lineHeight:1,marginBottom:3}}>{fmt(r.ers)}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,.45)'}}>pro Jahr mit Wärmepumpe</div>
              </div>
              <div style={{background:'white',border:`1px solid ${BDR}`,borderRadius:16,boxShadow:SH,padding:20,marginBottom:12}}>
                {[
                  {lbl:'Heizkosten heute',val:fmt(r.alt)+' / Jahr',c:AMB},
                  {lbl:'Mit Wärmepumpe (JAZ 3,5)',val:fmt(r.wp)+' / Jahr',c:G},
                  {lbl:'Amortisation (55% Förderung)',val:r.amort+' Jahre',c:TX},
                ].map((row,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                    padding:'10px 0',borderBottom:i<2?`1px solid ${BDR}`:'none'}}>
                    <span style={{fontSize:14,color:TX2}}>{row.lbl}</span>
                    <span className="mono" style={{fontSize:15,fontWeight:700,color:row.c}}>{row.val}</span>
                  </div>
                ))}
              </div>
              <a href="/rechner" style={{display:'flex',alignItems:'center',justifyContent:'center',
                padding:'15px',background:AMB,color:'white',borderRadius:'10px',
                fontFamily:'Outfit,sans-serif',fontSize:15,fontWeight:600,textDecoration:'none',
                boxShadow:'0 2px 8px rgba(217,119,6,.3)',transition:'background .18s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='#b45309'}
                onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background=AMB}>
                Detailliertes Angebot anfordern →
              </a>
              <p style={{fontSize:12,color:TX3,textAlign:'center',marginTop:10}}>🔒 Kostenlos &amp; unverbindlich · Kein Spam</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FÖRDERUNG ── */}
      <section ref={foerdRef.ref} id="foerderung" className="sec" style={{background:'white'}}>
        <div className="c">
          <div className="foerd-g" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
            <div className={'fu '+(foerdRef.v?'fv':'')}>
              <Tag bg={GLT} color={G} text="KfW-Programm 458"/>
              <h2 style={{marginBottom:16}}>Bis zu €21.000<br/>Zuschuss vom Staat</h2>
              <p style={{fontSize:16,color:TX2,lineHeight:1.72,marginBottom:28}}>
                Der Zuschuss ist nicht rückzahlbar und wird direkt ausgezahlt. Maximal €30.000 Investitionskosten werden bezuschusst — kumulierbar bis 70%.
              </p>
              {[
                {lbl:'Grundförderung',pct:30,w:43,c:G3},
                {lbl:'Klima-Speed-Bonus (fossile Heizung ersetzen)',pct:20,w:29,c:AMB},
                {lbl:'Einkommens-Bonus (unter €40.000 netto/Jahr)',pct:30,w:43,c:'#F59E0B'},
                {lbl:'Natürliches Kältemittel R290',pct:5,w:7,c:G2},
              ].map((b,i)=>(
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:14,color:TX2}}>{b.lbl}</span>
                    <span className="mono" style={{fontSize:14,fontWeight:700,color:b.c}}>+{b.pct}%</span>
                  </div>
                  <div style={{height:7,background:BG,borderRadius:8,overflow:'hidden',border:`1px solid ${BDR}`}}>
                    <div style={{height:'100%',background:b.c,borderRadius:8,
                      width:foerdRef.v?`${b.w}%`:'0%',
                      transition:`width 1.2s cubic-bezier(.16,1,.3,1) ${i*.12}s`}}/>
                  </div>
                </div>
              ))}
              <div style={{marginTop:20,padding:'14px 18px',background:GLT,borderRadius:10,
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:15,fontWeight:600,color:G}}>Gesamt möglich</span>
                <span className="mono" style={{fontSize:22,fontWeight:700,color:G}}>bis 70% = €21.000</span>
              </div>
            </div>
            {/* example calc */}
            <div className={'fu '+(foerdRef.v?'fv':'')} style={{transitionDelay:'.15s'}}>
              <div style={{background:'white',border:`1px solid ${BDR}`,borderRadius:16,boxShadow:SH,overflow:'hidden'}}>
                <div style={{background:G,padding:'24px 28px'}}>
                  <div style={{fontSize:13,color:'rgba(255,255,255,.55)',marginBottom:4}}>Beispielrechnung: 120 m² EFH</div>
                  <div style={{fontFamily:'Outfit,sans-serif',fontSize:26,fontWeight:700,color:'white',marginBottom:4}}>Ihr Eigenanteil nur</div>
                  <div className="mono" style={{fontSize:50,fontWeight:700,color:'#4CAF7D',lineHeight:1}}>€ 11.250</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,.45)',marginTop:4}}>statt €25.000 Gesamtinvestition</div>
                </div>
                <div style={{padding:'20px 28px'}}>
                  {[
                    {lbl:'Gesamtinvestition',val:'€ 25.000',c:TX,bold:false},
                    {lbl:'− Grundförderung (30%)',val:'− € 7.500',c:G,bold:false},
                    {lbl:'− Klima-Speed-Bonus (20%)',val:'− € 5.000',c:AMB,bold:false},
                    {lbl:'− Einkommens-Bonus (0%)*',val:'€ 0',c:TX3,bold:false},
                    {lbl:'Ihr Eigenanteil',val:'€ 11.250',c:G,bold:true},
                  ].map((row,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',
                      borderBottom:i<4?`1px solid ${BDR}`:'none'}}>
                      <span style={{fontSize:14,color:row.bold?TX:TX2,fontWeight:row.bold?600:400}}>{row.lbl}</span>
                      <span className="mono" style={{fontSize:14,fontWeight:row.bold?700:600,color:row.c}}>{row.val}</span>
                    </div>
                  ))}
                  <p style={{fontSize:12,color:TX3,marginTop:10}}>* Mit Einkommens-Bonus: Eigenanteil nur €3.750</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GEG TIMELINE ── */}
      <section className="sec" style={{background:BG}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:540,margin:'0 auto 48px'}}>
            <Tag bg={AMBL} color="#92400E" text="Regulatorischer Druck"/>
            <h2>Das GEG macht den Wechsel unausweichlich</h2>
          </div>
          <div className="g4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {year:'2024',title:'GEG in Kraft',body:'Jede neue Heizung muss 65% erneuerbare Energie nutzen.',c:G,urgent:false},
              {year:'30.06.2026',title:'Großstädte',body:'65%-Pflicht für Bestandsgebäude in Kommunen über 100.000 EW.',c:AMB,urgent:true},
              {year:'30.06.2028',title:'Alle Kommunen',body:'Die 65%-Pflicht gilt flächendeckend in ganz Deutschland.',c:G2,urgent:false},
              {year:'2045',title:'Vollverbot',body:'Fossile Heizungen werden vollständig verboten.',c:TX3,urgent:false},
            ].map((t,i)=>(
              <div key={i} style={{background:'white',border:`1px solid ${BDR}`,borderRadius:16,
                boxShadow:SH,padding:'20px 18px',borderTop:`3px solid ${t.c}`}}>
                <div className="mono" style={{fontSize:13,fontWeight:700,color:t.c,marginBottom:6,
                  display:'flex',alignItems:'center',gap:7}}>
                  {t.year}
                  {t.urgent&&<span style={{background:AMBL,color:'#92400E',fontSize:10,fontWeight:700,padding:'2px 6px',borderRadius:4}}>Bald!</span>}
                </div>
                <div style={{fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:600,marginBottom:6}}>{t.title}</div>
                <p style={{fontSize:13,color:TX2,lineHeight:1.55}}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WP TYPEN ── */}
      <section className="sec" style={{background:'white'}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:480,margin:'0 auto 48px'}}>
            <Tag bg={GLT} color={G} text="Welche WP passt zu mir?"/>
            <h2>Die drei Typen im Vergleich</h2>
          </div>
          <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {type:'Luft-Wasser',share:'92% Marktanteil',jaz:'3,2–4,0',install:'€3.000–6.000',
                pros:['Keine Erdarbeiten nötig','Auch im Altbau geeignet','Montage in 1–2 Tagen'],hi:true},
              {type:'Sole-Wasser',share:'6% Marktanteil',jaz:'4,0–5,0',install:'€6.000–12.000',
                pros:['+5% KfW-Bonus','Konstante Effizienz','Unabhängig von Außentemp.'],hi:false},
              {type:'Wasser-Wasser',share:'2% Marktanteil',jaz:'5,0–6,0+',install:'€8.000–15.000',
                pros:['+5% KfW-Bonus','Höchste Jahresarbeitszahl','Niedrigste Betriebskosten'],hi:false},
            ].map((t,i)=>(
              <div key={i} style={{background:'white',
                border:t.hi?`2px solid ${G}`:`1px solid ${BDR}`,
                borderRadius:16,boxShadow:SH,overflow:'hidden',
                transition:'all .22s'}}
                onMouseEnter={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='translateY(-3px)';d.style.boxShadow=SHL}}
                onMouseLeave={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='';d.style.boxShadow=SH}}>
                {t.hi&&<div style={{background:G,padding:'6px 16px',fontSize:11,fontWeight:700,color:'white',fontFamily:'Outfit,sans-serif',letterSpacing:'.06em',textTransform:'uppercase'}}>Meistgewählt</div>}
                <div style={{padding:22}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                    <h3 style={{fontSize:18}}>{t.type}</h3>
                    <span style={{background:GLT,color:G,fontSize:11,fontWeight:700,padding:'3px 9px',borderRadius:100,whiteSpace:'nowrap'}}>{t.share}</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
                    {[{l:'JAZ',v:t.jaz},{l:'Installation',v:t.install}].map(s=>(
                      <div key={s.l} style={{background:BG,borderRadius:8,padding:'9px 11px'}}>
                        <div style={{fontSize:11,color:TX3,fontWeight:600,marginBottom:3}}>{s.l}</div>
                        <div className="mono" style={{fontSize:12,fontWeight:700,color:TX}}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  {t.pros.map(p=>(
                    <div key={p} style={{display:'flex',gap:8,fontSize:13,color:TX2,marginBottom:7,alignItems:'center'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section ref={testiRef.ref} className="sec" style={{background:BG}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:480,margin:'0 auto 48px'}}>
            <Tag bg={GLT} color={G} text="Erfahrungen"/>
            <h2>Was Hausbesitzer berichten</h2>
          </div>
          <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {i:'B',name:'Familie Brehmer',city:'Hannover',tag:'Luft-Wasser · €1.100/Jahr gespart',
                text:'„Nach 20 Jahren Ölheizung dachten wir, der Umstieg wäre riesig. Drei Angebote bekommen — alles unkompliziert erklärt."',d:'.0s'},
              {i:'M',name:'Thomas Müller',city:'Freiburg',tag:'Sole-Wasser · 65% Förderung',
                text:'„Den KfW-Antrag hätte ich alleine nie geschafft. Hier wurde ich Schritt für Schritt begleitet. Sehr empfehlenswert."',d:'.12s'},
              {i:'K',name:'Sabine Kröger',city:'Münster',tag:'Luft-Wasser · 3 Angebote',
                text:'„Als Vermieterin war ich skeptisch. Die Berechnung hat gezeigt, dass es sich eindeutig lohnt. Keine Druckverkäufe."',d:'.24s'},
            ].map((t,i)=>(
              <div key={i} className={'fu '+(testiRef.v?'fv':'')}
                style={{background:'white',border:`1px solid ${BDR}`,borderRadius:16,boxShadow:SH,
                  padding:24,transitionDelay:t.d,transition:'all .22s ease, opacity .65s ease, transform .65s ease'}}
                onMouseEnter={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='translateY(-3px)';d.style.boxShadow=SHL}}
                onMouseLeave={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='';d.style.boxShadow=SH}}>
                <div style={{color:'#F59E0B',fontSize:14,letterSpacing:3,marginBottom:14}}>★★★★★</div>
                <p style={{fontSize:14,color:TX2,lineHeight:1.72,fontStyle:'italic',marginBottom:18}}>{t.text}</p>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:GLT,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:700,color:G,flexShrink:0}}>{t.i}</div>
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

      {/* ── CTA ── */}
      <section style={{background:G,padding:'96px 0',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:.035,
          backgroundImage:'radial-gradient(circle at 20% 50%, white 0%, transparent 55%), radial-gradient(circle at 80% 50%, white 0%, transparent 55%)'}}/>
        <div className="c" style={{position:'relative'}}>
          <Tag bg="rgba(255,255,255,.1)" color="rgba(255,255,255,.8)" text="Jetzt starten"/>
          <h2 style={{color:'white',fontSize:'clamp(32px,4vw,52px)',marginBottom:14}}>Bereit für die Heizungswende?</h2>
          <p style={{fontSize:18,color:'rgba(255,255,255,.65)',marginBottom:36}}>Kostenloses Angebot in 2 Minuten — ohne Vertragsbindung.</p>
          <a href="/rechner" style={{display:'inline-flex',alignItems:'center',gap:8,
            padding:'16px 36px',background:'white',color:G,borderRadius:'10px',
            fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:700,textDecoration:'none',
            boxShadow:'0 4px 20px rgba(0,0,0,.18)',transition:'all .18s'}}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.transform='translateY(-1px)';el.style.boxShadow='0 8px 28px rgba(0,0,0,.24)'}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.transform='';el.style.boxShadow='0 4px 20px rgba(0,0,0,.18)'}}>
            Kostenloses Angebot anfordern →
          </a>
          <div style={{fontSize:13,color:'rgba(255,255,255,.4)',marginTop:18,
            display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap'}}>
            <span>✓ Kein Spam</span>
            <span>✓ Keine Weitergabe ohne Zustimmung</span>
            <span>✓ 100% kostenlos</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:'#0A1710',padding:'56px 0 28px'}}>
        <div className="c">
          <div className="g4" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:44}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                <div style={{width:32,height:32,background:G,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 1s-6 5.5-6 10a6 6 0 0012 0C16 6.5 10 1 10 1z" fill="white" opacity=".95"/></svg>
                </div>
                <span style={{fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:14,color:'white'}}>Wärmepumpenbegleiter.de</span>
              </div>
              <p style={{fontSize:13,color:'rgba(255,255,255,.33)',lineHeight:1.65,maxWidth:210}}>Ihr unabhängiger Begleiter für die Heizungswende.</p>
            </div>
            {[
              {h:'Navigation',links:['Rechner','Ratgeber','Über uns','Kontakt']},
              {h:'Städte',links:['Berlin','Hamburg','München','Köln','Frankfurt','Stuttgart']},
              {h:'Rechtliches',links:['Impressum','Datenschutz','AGB']},
            ].map(col=>(
              <div key={col.h}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
                  color:'rgba(255,255,255,.22)',marginBottom:14}}>{col.h}</div>
                {col.links.map(l=>(
                  <a key={l} href="#" style={{display:'block',fontSize:13,color:'rgba(255,255,255,.42)',
                    textDecoration:'none',marginBottom:8,transition:'color .15s'}}
                    onMouseEnter={e=>e.currentTarget.style.color='white'}
                    onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.42)'}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:20,
            display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
            <span style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>© 2026 Wärmepumpenbegleiter.de</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>Wir erhalten eine Vermittlungsprovision. Für Sie kostenlos.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
