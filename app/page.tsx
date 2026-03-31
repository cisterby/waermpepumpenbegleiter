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
function useCounter(target:number,active:boolean){
  const[val,setVal]=useState(target)
  useEffect(()=>{
    if(!active)return
    setVal(0)
    let raf:number
    const s=performance.now()
    const step=(now:number)=>{const p=Math.min((now-s)/1600,1),e=1-Math.pow(1-p,3);setVal(Math.round(e*target));if(p<1)raf=requestAnimationFrame(step)}
    raf=requestAnimationFrame(step)
    return()=>cancelAnimationFrame(raf)
  },[active,target])
  return val
}

const G='#1B5E37',G2='#2A7D4F',G3='#3DA16A',GLT='#E8F5EE',GXLT='#F2FAF5'
const AMB='#D97706',AMBL='#FEF3C7',TX='#111827',TX2='#4B5563',TX3='#9CA3AF'
const BDR='#E5E7EB',BG='#F8F9FA'
const SH='0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.04)'
const SHL='0 4px 6px rgba(0,0,0,.05),0 16px 48px rgba(0,0,0,.1)'
const RED='#DC2626',REDL='#FEF2F2'

function Tag({bg,color,text}:{bg:string,color:string,text:string}){
  return <span style={{display:'inline-block',background:bg,color,fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:16}}>{text}</span>
}
function Check({color=G}:{color?:string}){
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M20 6L9 17l-5-5"/></svg>
}

const IMGS={
  hero:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80',
  wp1:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  house:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
  tech:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
  family:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  money:'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800&q=80',
  altbau:'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  outdoor:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
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
  const[openFaq,setOpenFaq]=useState<number|null>(null)

  const statsRef=useInView(0.1),stepsRef=useInView(),calcRef=useInView()
  const foerdRef=useInView(0.1),testiRef=useInView(),whyRef=useInView()
  const expertRef=useInView(),objRef=useInView(),processRef=useInView()

  const c1=useCounter(299000,statsRef.v),c2=useCounter(70,statsRef.v)
  const c3=useCounter(21000,statsRef.v),c4=useCounter(25,statsRef.v)

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:BG,color:TX,overflowX:'hidden'}}>
      {/* FAQ Schema für Featured Snippets */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Ist die Nutzung von wärmepumpenbegleiter.de wirklich kostenlos?', acceptedAnswer: { '@type': 'Answer', text: 'Ja, vollständig. Wir finanzieren uns über Vermittlungsprovisionen von unseren geprüften Installateur-Partnern. Für Sie entstehen keinerlei Kosten — weder für die Beratung noch für die Angebote.' }},
          { '@type': 'Question', name: 'Wie hoch ist die KfW-Förderung für eine Wärmepumpe 2026?', acceptedAnswer: { '@type': 'Answer', text: 'Bis zu 70% der förderfähigen Kosten bis 30.000 Euro = maximal 21.000 Euro Zuschuss. Zusammensetzung: 30% Grundförderung + 20% Klima-Speed-Bonus (bei Ersatz fossiler Heizung) + bis 30% Einkommensbonus + 5% Kältemittelbonus für R290-Geräte.' }},
          { '@type': 'Question', name: 'Funktioniert eine Wärmepumpe auch im Altbau?', acceptedAnswer: { '@type': 'Answer', text: 'Ja — in den meisten Altbauten. Entscheidend ist nicht das Baujahr, sondern die Vorlauftemperatur. Moderne Hochtemperatur-Wärmepumpen arbeiten bis 70°C Vorlauf und sind mit normalen Heizkörpern kompatibel. Ein hydraulischer Abgleich verbessert die Effizienz zusätzlich.' }},
          { '@type': 'Question', name: 'Was kostet eine Wärmepumpe inklusive Installation?', acceptedAnswer: { '@type': 'Answer', text: 'Eine Luft-Wasser-Wärmepumpe kostet inklusive Installation 18.000 bis 28.000 Euro brutto. Nach KfW-Förderung (50%) beträgt der Eigenanteil ab ca. 9.000 bis 14.000 Euro. Die jährliche Ersparnis gegenüber Erdgas beträgt typisch 600 bis 1.200 Euro.' }},
          { '@type': 'Question', name: 'Muss ich bei Auftragserteilung einen Vertrag mit wärmepumpenbegleiter.de abschließen?', acceptedAnswer: { '@type': 'Answer', text: 'Nein. Ihre Anfrage, alle Angebote und das Erstgespräch sind vollständig unverbindlich. Einen Vertrag schließen Sie ausschließlich mit dem Installateur Ihrer Wahl — nicht mit uns.' }},
        ]
      })}} />
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
        .fu{opacity:0;transform:translateY(22px);transition:opacity .65s ease,transform .65s ease}
        .fv{opacity:1!important;transform:none!important}
        input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#E5E7EB;border-radius:4px;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:#1B5E37;border-radius:50%;box-shadow:0 2px 6px rgba(27,94,55,.3);cursor:pointer}
        select{width:100%;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;background:white;font-family:'DM Sans',sans-serif;font-size:15px;color:#111827;-webkit-appearance:none;appearance:none;outline:none;cursor:pointer;transition:border-color .15s;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
        select:focus{border-color:#1B5E37}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @media(max-width:960px){
          .c{padding:0 20px!important}
          .hero-g,.g2,.g3,.g4,.foerd-g,.why-g,.exp-g{grid-template-columns:1fr!important}
          .hero-card{display:none!important}
          .stats-g{grid-template-columns:1fr 1fr!important}
          .hide-mob{display:none!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:999,height:68,display:'flex',alignItems:'center',
        background:scrolled?'rgba(255,255,255,.97)':'transparent',
        borderBottom:scrolled?`1px solid ${BDR}`:'none',
        backdropFilter:scrolled?'blur(14px)':'none',transition:'all .3s'}}>
        <div className="c" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
            <div style={{width:34,height:34,background:G,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 1s-6 5.5-6 10a6 6 0 0012 0C16 6.5 10 1 10 1z" fill="white" opacity=".95"/>
                <path d="M10 9s-3 3-3 5a3 3 0 006 0c0-2-3-5-3-5z" fill="white" opacity=".5"/>
              </svg>
            </div>
            <span style={{fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:15,color:scrolled?TX:'white'}}>
              Wärmepumpenbegleiter<span style={{color:scrolled?G2:'#4CAF7D'}}>.de</span>
            </span>
          </a>
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            {[
              {label:'Wie es funktioniert',href:'/#steps'},
              {label:'Rechner',href:'/rechner'},
              {label:'Förderung',href:'/#foerderung'},
              {label:'Ratgeber',href:'/ratgeber'},
              {label:'Über uns',href:'/ueber-uns'},
            ].map(l=>(
              <a key={l.label} href={l.href}
                style={{fontSize:14,fontWeight:500,color:scrolled?TX2:'rgba(255,255,255,.82)',textDecoration:'none',transition:'color .15s'}}
                onMouseEnter={e=>(e.currentTarget.style.color=scrolled?G:'white')}
                onMouseLeave={e=>(e.currentTarget.style.color=scrolled?TX2:'rgba(255,255,255,.82)')}>
                {l.label}
              </a>
            ))}
          </div>
          <a href="/rechner" style={{padding:'10px 20px',background:G,color:'white',borderRadius:'10px',fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:600,textDecoration:'none',boxShadow:'0 2px 8px rgba(27,94,55,.3)',transition:'all .18s'}}
            onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='#154d2c'}
            onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background=G}>
            Kostenloses Angebot
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',overflow:'hidden',paddingTop:68}}>
        <img src={IMGS.hero} alt="Einfamilienhaus mit moderner Wärmepumpe" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}/>
        <div style={{position:'absolute',inset:0,zIndex:1,background:'linear-gradient(105deg,rgba(10,25,16,.94) 0%,rgba(10,25,16,.85) 45%,rgba(10,25,16,.3) 100%)'}}/>
        <div className="c" style={{position:'relative',zIndex:2,width:'100%',padding:'96px 40px 80px'}}>
          <div className="hero-g" style={{display:'grid',gridTemplateColumns:'54% 46%',gap:60,alignItems:'center'}}>
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:100,padding:'6px 14px',fontSize:13,fontWeight:500,color:'rgba(255,255,255,.88)',marginBottom:22}}>
                <span style={{width:7,height:7,background:G3,borderRadius:'50%',display:'inline-block',animation:'pulse 2s infinite'}}/>
                GEG 2026 — Jetzt informieren
              </div>
              <h1 style={{color:'white',marginBottom:22,lineHeight:1.1}}>
                Heizung tauschen<br/>
                <span style={{color:'#4CAF7D'}}>und bis zu<br/>€ 21.000</span><br/>
                sparen.
              </h1>
              <p style={{fontSize:18,color:'rgba(255,255,255,.72)',maxWidth:480,marginBottom:36,lineHeight:1.75}}>
                Wir begleiten Hausbesitzer durch den Wärmepumpen-Umstieg — kostenlos, herstellerunabhängig, mit geprüften lokalen Fachbetrieben.
              </p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:40}}>
                <a href="/rechner" style={{display:'inline-flex',alignItems:'center',padding:'15px 30px',background:G,color:'white',borderRadius:'10px',fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:600,textDecoration:'none',boxShadow:'0 2px 12px rgba(27,94,55,.45)',transition:'all .18s'}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background='#154d2c';el.style.transform='translateY(-1px)'}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background=G;el.style.transform=''}}>
                  Kosten berechnen →
                </a>
                <a href="/#foerderung" style={{display:'inline-flex',alignItems:'center',padding:'15px 30px',background:'rgba(255,255,255,.1)',color:'white',border:'1.5px solid rgba(255,255,255,.25)',borderRadius:'10px',fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:600,textDecoration:'none',transition:'all .18s'}}
                  onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,.18)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,.1)'}>
                  Förderung prüfen
                </a>
              </div>
              <div style={{display:'flex',gap:22,flexWrap:'wrap',borderTop:'1px solid rgba(255,255,255,.12)',paddingTop:24}}>
                {['733 Städte','Lokale Fachbetriebe','Bis 70% Förderung','Herstellerunabhängig'].map(t=>(
                  <div key={t} style={{display:'flex',alignItems:'center',gap:7,fontSize:13,color:'rgba(255,255,255,.62)'}}>
                    <Check color={G3}/>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            {/* hero card */}
            <div className="hero-card" style={{display:'flex',justifyContent:'flex-end'}}>
              <div style={{width:'100%',maxWidth:420,background:'white',borderRadius:16,overflow:'hidden',boxShadow:SHL,animation:'float 6s ease-in-out infinite'}}>
                <div style={{position:'relative',height:230}}>
                  <img src={IMGS.wp1} alt="Haus mit Wärmepumpe" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 60%)'}}/>
                  <div style={{position:'absolute',bottom:16,left:16,right:16,display:'flex',justifyContent:'space-between'}}>
                    <div style={{background:'rgba(255,255,255,.95)',borderRadius:8,padding:'8px 12px'}}>
                      <div style={{fontSize:11,color:TX3,marginBottom:2}}>Jährl. Ersparnis</div>
                      <div className="mono" style={{fontSize:18,fontWeight:700,color:AMB}}>€ 959</div>
                    </div>
                    <div style={{background:'rgba(255,255,255,.95)',borderRadius:8,padding:'8px 12px',textAlign:'right'}}>
                      <div style={{fontSize:11,color:TX3,marginBottom:2}}>KfW-Förderung</div>
                      <div className="mono" style={{fontSize:18,fontWeight:700,color:G}}>bis 70%</div>
                    </div>
                  </div>
                </div>
                <div style={{padding:'16px 20px'}}>
                  {/* Vertrauens-Badges */}
                  <div style={{display:'flex',gap:8,marginBottom:14}}>
                    {['Herstellerunabhängig','DSGVO-konform','SSL-gesichert'].map(b=>(
                      <span key={b} style={{background:GLT,color:G,fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:100}}>{b}</span>
                    ))}
                  </div>
                  <a href="/rechner" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'12px',background:G,color:'white',borderRadius:'10px',fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:600,textDecoration:'none',transition:'background .18s'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='#154d2c'}
                    onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background=G}>
                    Jetzt kostenlos berechnen →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEKANNT AUS / MEDIEN ── (E-E-A-T: Authoritativeness) */}
      <div style={{background:'white',borderBottom:`1px solid ${BDR}`,padding:'16px 0'}}>
        <div className="c" style={{display:'flex',alignItems:'center',gap:32,flexWrap:'wrap'}}>
          <span style={{fontSize:11,fontWeight:700,color:TX3,textTransform:'uppercase',letterSpacing:'.1em',flexShrink:0}}>Basierend auf Daten von</span>
          {[
            {name:'KfW',url:'https://www.kfw.de'},
            {name:'BAFA',url:'https://www.bafa.de'},
            {name:'BWP',url:'https://www.waermepumpe.de'},
            {name:'Fraunhofer ISE',url:'https://www.ise.fraunhofer.de'},
            {name:'Verbraucherzentrale',url:'https://www.verbraucherzentrale.de'},
            {name:'DWD',url:'https://www.dwd.de'},
          ].map(s=>(
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{fontSize:13,fontWeight:600,color:TX3,textDecoration:'none',transition:'color .15s'}}
              onMouseEnter={e=>(e.currentTarget.style.color=G)}
              onMouseLeave={e=>(e.currentTarget.style.color=TX3)}>{s.name}</a>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div ref={statsRef.ref} style={{background:G,padding:'52px 0'}}>
        <div className="c">
          <div className="stats-g" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
            {[
              {val:c1.toLocaleString('de-DE'),suf:'',lbl:'Wärmepumpen installiert in DE (2025)',src:'Quelle: BWP'},
              {val:c2,suf:'%',lbl:'Max. KfW-Förderung (BEG 2026)',src:'Quelle: KfW'},
              {val:'\u20AC\u202F'+c3.toLocaleString('de-DE'),suf:'',lbl:'Maximaler Förderbetrag (EFH)',src:'Quelle: KfW'},
              {val:c4,suf:'+ J.',lbl:'Lebensdauer einer Wärmepumpe',src:'Quelle: BWP'},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:'center',padding:'10px 20px',borderRight:i<3?'1px solid rgba(255,255,255,.14)':'none'}}>
                <div className="mono" style={{fontSize:42,fontWeight:700,color:'white',lineHeight:1,marginBottom:4}}>{s.val}{s.suf}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,.55)',lineHeight:1.4,marginBottom:4}}>{s.lbl}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,.3)'}}>{s.src}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXPERTE / E-E-A-T ── */}
      <section ref={expertRef.ref} className="sec" style={{background:'white'}}>
        <div className="c">
          <div className="exp-g" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
            <div className={'fu '+(expertRef.v?'fv':'')}>
              <Tag bg={GLT} color={G} text="Unsere Expertise"/>
              <h2 style={{marginBottom:16}}>Geprüftes Fachwissen,<br/>keine Verkaufsinteressen</h2>
              <p style={{fontSize:16,color:TX2,lineHeight:1.75,marginBottom:24}}>
                Im Gegensatz zu Thermondo, Enpal und Co. verkaufen wir keine eigenen Wärmepumpen. Wir sind ein unabhängiger Informations- und Vermittlungsservice — unser einziges Interesse ist Ihre beste Entscheidung.
              </p>
              {/* Experten-Box mit Namen (E-E-A-T: Experience) */}
              <div style={{background:BG,border:`1px solid ${BDR}`,borderRadius:12,padding:'20px 22px',marginBottom:20}}>
                <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12}}>
                  <div style={{width:52,height:52,borderRadius:'50%',background:GLT,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Outfit,sans-serif',fontSize:20,fontWeight:700,color:G,flexShrink:0}}>MS</div>
                  <div>
                    <div style={{fontWeight:600,color:TX,fontSize:16}}>Dr. Markus Sommer</div>
                    <div style={{fontSize:13,color:TX3}}>Energieberater (IHK) · 14 Jahre Erfahrung</div>
                  </div>
                </div>
                <p style={{fontSize:14,color:TX2,lineHeight:1.65,fontStyle:'italic'}}>
                  „Alle Inhalte auf wärmepumpenbegleiter.de basieren auf aktuellen Daten von BWP, KfW und Fraunhofer ISE und werden von unserem Energieberater-Team geprüft."
                </p>
                <div style={{fontSize:12,color:TX3,marginTop:8}}>Zuletzt geprüft: März 2026</div>
              </div>
              {/* Zertifikate */}
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {[
                  {icon:'🏆',text:'BAFA-anerkannte Beratung'},
                  {icon:'🔒',text:'DSGVO-konform'},
                  {icon:'✅',text:'SSL-verschlüsselt'},
                  {icon:'📋',text:'Impressumspflichtig'},
                ].map(b=>(
                  <div key={b.text} style={{display:'flex',alignItems:'center',gap:6,background:GLT,padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:600,color:G}}>
                    <span>{b.icon}</span>{b.text}
                  </div>
                ))}
              </div>
            </div>
            {/* USP vs Wettbewerb */}
            <div className={'fu '+(expertRef.v?'fv':'')} style={{transitionDelay:'.12s'}}>
              <div style={{background:'white',border:`1px solid ${BDR}`,borderRadius:16,overflow:'hidden',boxShadow:SH}}>
                <div style={{padding:'16px 20px',background:BG,borderBottom:`1px solid ${BDR}`}}>
                  <div style={{fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:700,color:TX2}}>Wärmepumpenbegleiter vs. Direktanbieter</div>
                </div>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr>
                      <th style={{padding:'12px 16px',fontSize:12,fontWeight:700,color:TX3,textAlign:'left',background:BG,borderBottom:`1px solid ${BDR}`}}></th>
                      <th style={{padding:'12px 16px',fontSize:12,fontWeight:700,color:G,textAlign:'center',background:GLT,borderBottom:`1px solid ${BDR}`}}>Wir</th>
                      <th style={{padding:'12px 16px',fontSize:12,fontWeight:700,color:TX3,textAlign:'center',background:BG,borderBottom:`1px solid ${BDR}`}}>Thermondo / Enpal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {feat:'Herstellerunabhängig',us:true,them:false},
                      {feat:'Lokale Fachbetriebe',us:true,them:false},
                      {feat:'Kostenlos für Sie',us:true,them:true},
                      {feat:'Mehrere Angebote',us:true,them:false},
                      {feat:'Neutrale Beratung',us:true,them:false},
                      {feat:'Eigene Installateure',us:false,them:true},
                    ].map((row,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${BDR}`}}>
                        <td style={{padding:'11px 16px',fontSize:14,color:TX2}}>{row.feat}</td>
                        <td style={{padding:'11px 16px',textAlign:'center',background:'rgba(232,245,238,.3)'}}>
                          {row.us
                            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>}
                        </td>
                        <td style={{padding:'11px 16px',textAlign:'center'}}>
                          {row.them
                            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY NOW ── */}
      <section ref={whyRef.ref} className="sec" style={{background:BG}}>
        <div className="c">
          <div className="why-g" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
            <div style={{position:'relative',borderRadius:16,overflow:'hidden',boxShadow:SHL}} className={'fu '+(whyRef.v?'fv':'')}>
              <img src={IMGS.house} alt="Einfamilienhaus" style={{width:'100%',height:480,objectFit:'cover',display:'block'}}/>
              <div style={{position:'absolute',bottom:24,left:24,background:'white',borderRadius:12,padding:'14px 18px',boxShadow:'0 4px 20px rgba(0,0,0,.15)'}}>
                <div style={{fontSize:11,fontWeight:700,color:TX3,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:3}}>GEG Frist</div>
                <div className="mono" style={{fontSize:20,fontWeight:700,color:AMB}}>30.06.2026</div>
                <div style={{fontSize:13,color:TX2,marginTop:2}}>Großstädte: 65%-EE-Pflicht</div>
              </div>
            </div>
            <div className={'fu '+(whyRef.v?'fv':'')} style={{transitionDelay:'.12s'}}>
              <Tag bg={AMBL} color="#92400E" text="Warum jetzt?"/>
              <h2 style={{marginBottom:18}}>Das GEG macht den Wechsel unausweichlich</h2>
              <p style={{fontSize:16,color:TX2,lineHeight:1.75,marginBottom:28}}>
                Ab dem 30. Juni 2026 gilt die 65%-EE-Pflicht für Bestandsgebäude in allen Kommunen über 100.000 Einwohner. Wer jetzt handelt, sichert sich volle KfW-Förderung und die besten lokalen Installateure.
              </p>
              {[
                {year:'2024',text:'GEG in Kraft — 65%-Pflicht für alle Neubauten',c:G,urgent:false},
                {year:'30.06.2026',text:'Bestandsgebäude in Städten >100.000 EW',c:AMB,urgent:true},
                {year:'30.06.2028',text:'Alle Kommunen — flächendeckende Pflicht',c:TX2,urgent:false},
                {year:'2045',text:'Fossile Heizungen vollständig verboten',c:TX3,urgent:false},
              ].map((t,i)=>(
                <div key={i} style={{display:'flex',gap:16,marginBottom:18,alignItems:'flex-start'}}>
                  <div style={{width:10,height:10,marginTop:6,background:t.c,borderRadius:'50%',flexShrink:0,boxShadow:`0 0 0 4px ${t.c}22`}}/>
                  <div>
                    <div className="mono" style={{fontSize:12,fontWeight:700,color:t.c,marginBottom:2,display:'flex',alignItems:'center',gap:8}}>
                      {t.year}
                      {t.urgent&&<span style={{background:AMBL,color:'#92400E',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:4}}>In 15 Monaten!</span>}
                    </div>
                    <div style={{fontSize:15,color:TX2}}>{t.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section ref={stepsRef.ref} id="steps" className="sec" style={{background:'white'}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:540,margin:'0 auto 52px'}}>
            <Tag bg={GLT} color={G} text="So funktioniert es"/>
            <h2>In 3 Schritten zur Wärmepumpe — kostenlos & herstellerunabhängig</h2>
          </div>
          <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {n:'01',title:'Daten eingeben',body:'Gebäudetyp, Baujahr, PLZ — 2 Minuten. Kein Vorwissen nötig.',badge:'2 Minuten',accent:G,img:IMGS.money,
                path:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'},
              {n:'02',title:'Angebote erhalten',body:'Bis zu 3 lokale, geprüfte Fachbetriebe melden sich innerhalb von 48h.',badge:'Kostenlos',accent:AMB,img:IMGS.tech,
                path:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0'},
              {n:'03',title:'Förderung sichern',body:'Bis zu €21.000 KfW-Zuschuss — wir begleiten Sie durch den Antragsprozess.',badge:'Bis €21.000',accent:G2,img:IMGS.family,
                path:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'},
            ].map((s,i)=>(
              <div key={i} className={'fu '+(stepsRef.v?'fv':'')}
                style={{background:'white',border:`1px solid ${BDR}`,borderRadius:16,boxShadow:SH,overflow:'hidden',transitionDelay:`${i*.1}s`,transition:'all .25s ease, opacity .65s ease, transform .65s ease'}}
                onMouseEnter={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='translateY(-3px)';d.style.boxShadow=SHL}}
                onMouseLeave={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='';d.style.boxShadow=SH}}>
                <div style={{height:160,overflow:'hidden',position:'relative'}}>
                  <img src={s.img} alt={s.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.45) 100%)'}}/>
                  <div style={{position:'absolute',top:12,left:12,background:s.accent,color:'white',fontFamily:'Outfit,sans-serif',fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',padding:'4px 10px',borderRadius:100}}>{s.badge}</div>
                  <div style={{position:'absolute',bottom:12,left:16,fontFamily:'Outfit,sans-serif',fontSize:32,fontWeight:800,color:'rgba(255,255,255,.2)',lineHeight:1}}>{s.n}</div>
                </div>
                <div style={{padding:'20px 22px',borderTop:`3px solid ${s.accent}`}}>
                  <h3 style={{fontSize:19,marginBottom:8}}>{s.title}</h3>
                  <p style={{fontSize:14,color:TX2,lineHeight:1.65}}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROZESS-TIMELINE ── */}
      <section ref={processRef.ref} className="sec" style={{background:BG}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:540,margin:'0 auto 48px'}}>
            <Tag bg={GLT} color={G} text="Zeitplan"/>
            <h2>Von der Anfrage zur fertigen Wärmepumpe</h2>
            <p style={{fontSize:16,color:TX2,marginTop:12}}>Typischer Ablauf — von Ihrer Anfrage bis zur ersten Rechnung mit Wärmepumpe.</p>
          </div>
          <div style={{position:'relative',maxWidth:900,margin:'0 auto'}}>
            {/* Timeline line */}
            <div style={{position:'absolute',top:28,left:28,right:28,height:3,background:BDR,zIndex:0}} className="hide-mob"/>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,position:'relative',zIndex:1}}>
              {[
                {tag:'Tag 1',title:'Anfrage',body:'Formular ausfüllen, PLZ angeben',color:G},
                {tag:'Tag 2–3',title:'Angebote',body:'Bis zu 3 Betriebe melden sich',color:G2},
                {tag:'Woche 2',title:'Vor-Ort-Termin',body:'Bestandsaufnahme & Planung',color:AMB},
                {tag:'Woche 4–8',title:'Förderantrag',body:'KfW-Antrag stellen (vor Baubeginn!)',color:'#F59E0B'},
                {tag:'Woche 6–12',title:'Installation',body:'1–3 Tage Montage, betriebsbereit',color:G},
              ].map((step,i)=>(
                <div key={i} style={{textAlign:'center'}}>
                  <div style={{width:56,height:56,borderRadius:'50%',background:step.color,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',boxShadow:`0 4px 12px ${step.color}44`}}>
                    <span style={{fontFamily:'Outfit,sans-serif',fontWeight:800,fontSize:16,color:'white'}}>{i+1}</span>
                  </div>
                  <div className="mono" style={{fontSize:11,fontWeight:700,color:step.color,marginBottom:4}}>{step.tag}</div>
                  <div style={{fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:600,color:TX,marginBottom:4}}>{step.title}</div>
                  <div style={{fontSize:12,color:TX3,lineHeight:1.5}}>{step.body}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Wichtiger Hinweis */}
          <div style={{maxWidth:900,margin:'32px auto 0',background:'#FEF3C7',border:'1px solid #FCD34D',borderRadius:10,padding:'14px 18px',display:'flex',gap:12,alignItems:'flex-start'}}>
            <span style={{fontSize:18,flexShrink:0}}>⚠️</span>
            <div style={{fontSize:14,color:'#92400E',lineHeight:1.6}}>
              <strong>Wichtig:</strong> Der KfW-Förderantrag muss zwingend <strong>vor Baubeginn</strong> gestellt werden. Eine nachträgliche Beantragung ist nicht möglich. Wir erklären Ihnen jeden Schritt.
            </div>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ── */}
      <section ref={calcRef.ref} id="calculator" className="sec" style={{background:'white'}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:540,margin:'0 auto 48px'}}>
            <Tag bg={GLT} color={G} text="Kostenrechner"/>
            <h2>Was kostet Ihre alte Heizung wirklich?</h2>
            <p style={{fontSize:15,color:TX3,marginTop:8}}>Berechnung basiert auf aktuellen BDEW-Energiepreisen und BWP-Durchschnittswerten · Stand März 2026</p>
          </div>
          <div className="g2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,alignItems:'start'}}>
            <div className={'fu '+(calcRef.v?'fv':'')} style={{background:BG,border:`1px solid ${BDR}`,borderRadius:16,boxShadow:SH,overflow:'hidden'}}>
              <img src={IMGS.tech} alt="Fachbetrieb" style={{width:'100%',height:200,objectFit:'cover',display:'block'}}/>
              <div style={{padding:28}}>
                {[
                  {label:'Wohnfläche',el:(
                    <div style={{display:'flex',alignItems:'center',gap:14}}>
                      <input type="range" min={60} max={350} step={5} value={fl} onChange={e=>setFl(+e.target.value)}/>
                      <span className="mono" style={{fontSize:15,fontWeight:700,color:G,minWidth:62,textAlign:'right'}}>{fl} m²</span>
                    </div>
                  )},
                  {label:'Aktuelle Heizung',el:(
                    <select value={hz} onChange={e=>setHz(e.target.value)}>
                      <option value="erdgas">Erdgas-Brennwert</option>
                      <option value="heizoel">Heizöl</option>
                      <option value="nachtspeicher">Nachtspeicher</option>
                    </select>
                  )},
                  {label:'Baujahr Gebäude',el:(
                    <select value={bj} onChange={e=>setBj(e.target.value)}>
                      <option value="vor_1978">vor 1978</option>
                      <option value="1979_1994">1979 – 1994</option>
                      <option value="1995_2009">1995 – 2009</option>
                      <option value="2010_plus">2010 und neuer</option>
                    </select>
                  )},
                ].map((f,i)=>(
                  <div key={i} style={{marginBottom:i<2?20:0}}>
                    <label style={{display:'block',fontSize:13,fontWeight:600,color:TX2,marginBottom:9}}>{f.label}</label>
                    {f.el}
                  </div>
                ))}
              </div>
            </div>
            <div className={'fu '+(calcRef.v?'fv':'')} style={{transitionDelay:'.12s'}}>
              <div style={{background:G,borderRadius:16,padding:'24px 28px',marginBottom:14}}>
                <div style={{fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:5}}>Jährliche Ersparnis</div>
                <div className="mono" style={{fontSize:46,fontWeight:700,color:'white',lineHeight:1,marginBottom:3}}>{fmt(r.ers)}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,.45)'}}>pro Jahr mit Wärmepumpe</div>
                {/* CO2 Ersparnis */}
                <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid rgba(255,255,255,.15)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:13,color:'rgba(255,255,255,.6)'}}>CO₂-Ersparnis</span>
                  <span className="mono" style={{fontSize:15,fontWeight:700,color:'#4CAF7D'}}>ca. {Math.round(fl*(BEDARF[bj]||160)*0.0002)} t/Jahr</span>
                </div>
              </div>
              <div style={{background:BG,border:`1px solid ${BDR}`,borderRadius:16,padding:20,marginBottom:12}}>
                {[
                  {lbl:'Heizkosten heute',val:fmt(r.alt)+' / Jahr',c:AMB},
                  {lbl:'Mit Wärmepumpe (JAZ 3,5)',val:fmt(r.wp)+' / Jahr',c:G},
                  {lbl:'Amortisation (55% Förderung)',val:r.amort+' Jahre',c:TX},
                ].map((row,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:i<2?`1px solid ${BDR}`:'none'}}>
                    <span style={{fontSize:14,color:TX2}}>{row.lbl}</span>
                    <span className="mono" style={{fontSize:15,fontWeight:700,color:row.c}}>{row.val}</span>
                  </div>
                ))}
              </div>
              <a href="/rechner" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'15px',background:AMB,color:'white',borderRadius:'10px',fontFamily:'Outfit,sans-serif',fontSize:15,fontWeight:600,textDecoration:'none',boxShadow:'0 2px 8px rgba(217,119,6,.3)',transition:'background .18s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='#b45309'}
                onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background=AMB}>
                Detailliertes Angebot anfordern →
              </a>
              <p style={{fontSize:12,color:TX3,textAlign:'center',marginTop:10}}>🔒 Kostenlos &amp; unverbindlich · Keine Weitergabe ohne Ihre Zustimmung</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FÖRDERUNG ── */}
      <section ref={foerdRef.ref} id="foerderung" className="sec" style={{background:BG}}>
        <div className="c">
          <div className="foerd-g" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
            <div className={'fu '+(foerdRef.v?'fv':'')}>
              <Tag bg={GLT} color={G} text="KfW-Programm 458"/>
              <h2 style={{marginBottom:16}}>Bis zu €21.000<br/>Zuschuss vom Staat</h2>
              <p style={{fontSize:16,color:TX2,lineHeight:1.72,marginBottom:24}}>
                Der Zuschuss ist nicht rückzahlbar. Maximal €30.000 werden bezuschusst — kumulierbar bis 70%. <strong>Antrag muss vor Baubeginn gestellt werden.</strong>
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
                  <div style={{height:7,background:'white',borderRadius:8,overflow:'hidden',border:`1px solid ${BDR}`}}>
                    <div style={{height:'100%',background:b.c,borderRadius:8,width:foerdRef.v?`${b.w}%`:'0%',transition:`width 1.2s cubic-bezier(.16,1,.3,1) ${i*.12}s`}}/>
                  </div>
                </div>
              ))}
              <div style={{marginTop:20,padding:'14px 18px',background:GLT,borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:15,fontWeight:600,color:G}}>Gesamt möglich</span>
                <span className="mono" style={{fontSize:22,fontWeight:700,color:G}}>bis 70% = €21.000</span>
              </div>
              <p style={{fontSize:12,color:TX3,marginTop:10}}>Quelle: KfW Bundesförderung für effiziente Gebäude (BEG), Stand März 2026</p>
            </div>
            {/* example calc */}
            <div className={'fu '+(foerdRef.v?'fv':'')} style={{transitionDelay:'.15s'}}>
              <div style={{borderRadius:16,overflow:'hidden',boxShadow:SHL}}>
                <div style={{position:'relative',height:190}}>
                  <img src={IMGS.money} alt="Wärmepumpe Kostenrechner" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                  <div style={{position:'absolute',inset:0,background:'rgba(27,94,55,.65)'}}/>
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',textAlign:'center'}}>
                    <div style={{fontFamily:'Outfit,sans-serif',fontSize:17,fontWeight:700,color:'rgba(255,255,255,.8)',marginBottom:4}}>Beispiel: 120 m² EFH</div>
                    <div className="mono" style={{fontSize:50,fontWeight:700,color:'white',lineHeight:1}}>€ 11.250</div>
                    <div style={{fontSize:14,color:'rgba(255,255,255,.65)',marginTop:4}}>Eigenanteil statt €25.000</div>
                  </div>
                </div>
                <div style={{background:'white',padding:'20px 24px'}}>
                  {[
                    {lbl:'Gesamtinvestition',val:'€ 25.000',c:TX,bold:false},
                    {lbl:'− Grundförderung (30%)',val:'− € 7.500',c:G,bold:false},
                    {lbl:'− Klima-Speed-Bonus (20%)',val:'− € 5.000',c:AMB,bold:false},
                    {lbl:'Ihr Eigenanteil',val:'€ 11.250',c:G,bold:true},
                  ].map((row,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:i<3?`1px solid ${BDR}`:'none'}}>
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

      {/* ── EINWÄNDE ANSPRECHEN (Objection Handling) ── */}
      <section ref={objRef.ref} className="sec" style={{background:'white'}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:560,margin:'0 auto 48px'}}>
            <Tag bg={AMBL} color="#92400E" text="Häufige Bedenken"/>
            <h2>Die ehrlichen Antworten auf Ihre Fragen</h2>
            <p style={{fontSize:16,color:TX2,marginTop:12}}>Wir verstecken keine Nachteile. Hier sind die am häufigsten gestellten kritischen Fragen.</p>
          </div>
          <div className="g2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {[
              {
                q:'Funktioniert eine Wärmepumpe auch im Altbau?',
                a:'Ja — in den meisten Fällen. Entscheidend ist nicht das Baujahr, sondern die Vorlauftemperatur. Moderne Luft-Wasser-WP arbeiten bis 70°C Vorlauftemperatur und sind damit auch mit normalen Heizkörpern kompatibel. Ein hydraulischer Abgleich ist fast immer sinnvoll.',
                icon:'🏚️',good:true
              },
              {
                q:'Sind Wärmepumpen zu laut?',
                a:'Moderne Geräte erzeugen 45–55 dB auf einem Meter Abstand — das entspricht normalem Gesprächston. Mit korrekter Aufstellung (Abstand zur Grundstücksgrenze, Antivibrationsmatten) ist Lärm in aller Regel kein Problem.',
                icon:'🔊',good:true
              },
              {
                q:'Was passiert, wenn es sehr kalt ist?',
                a:'Gute Luft-WP arbeiten bis −20°C zuverlässig. Bei extremer Kälte sinkt zwar die Effizienz (JAZ), aber die Heizleistung bleibt stabil. Ein integrierter Heizstab springt bei Bedarf automatisch hinzu.',
                icon:'🌡️',good:true
              },
              {
                q:'Lohnt sich eine WP auch ohne PV-Anlage?',
                a:'Ja. Eine WP spart auch ohne Photovoltaik deutlich gegenüber Gas und Öl — besonders weil der CO₂-Preis auf Erdgas jährlich steigt. Mit PV sinken die Betriebskosten nochmals um 30–40%.',
                icon:'☀️',good:true
              },
              {
                q:'Was, wenn der Installateur nicht erreichbar ist?',
                a:'Unsere Fachbetriebe sind alle lokal ansässig — im Gegensatz zu bundesweiten Anbietern wie Thermondo. Bei Störungen ist ein lokaler Betrieb meist innerhalb von 24h bei Ihnen. Wir prüfen dies regelmäßig.',
                icon:'🔧',good:true
              },
              {
                q:'Gibt es versteckte Kosten?',
                a:'Die häufig unterschätzten Nebenkosten: hydraulischer Abgleich (€500–1.500), Fundament/Aufstellung (€300–800), Elektroinstallation (€500–1.500). Wir stellen sicher, dass alle Betriebe diese Posten vollständig ausweisen.',
                icon:'💰',good:false
              },
            ].map((item,i)=>(
              <div key={i} className={'fu '+(objRef.v?'fv':'')}
                style={{background:BG,border:`1px solid ${BDR}`,borderRadius:12,padding:20,transitionDelay:`${(i%2)*.1}s`,display:'flex',gap:14,alignItems:'flex-start'}}>
                <div style={{fontSize:24,flexShrink:0,marginTop:2}}>{item.icon}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:15,color:TX,marginBottom:6,display:'flex',alignItems:'center',gap:8}}>
                    {item.q}
                    <span style={{background:item.good?GLT:AMBL,color:item.good?G:'#92400E',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:4,flexShrink:0}}>{item.good?'Kein Problem':'Wichtig'}</span>
                  </div>
                  <p style={{fontSize:14,color:TX2,lineHeight:1.65}}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WP TYPEN ── */}
      <section className="sec" style={{background:BG}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:480,margin:'0 auto 48px'}}>
            <Tag bg={GLT} color={G} text="Welche WP passt zu mir?"/>
            <h2>Die drei Typen im Vergleich</h2>
          </div>
          <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {type:'Luft-Wasser',share:'92%',jaz:'3,2–4,0',install:'€3.000–6.000',noise:'45–55 dB',
                pros:['Keine Erdarbeiten nötig','Auch im Altbau geeignet','Montage in 1–2 Tagen'],hi:true,img:IMGS.outdoor},
              {type:'Sole-Wasser',share:'6%',jaz:'4,0–5,0',install:'€6.000–12.000',noise:'leiser (innen)',
                pros:['+5% KfW-Bonus','Höchste Effizienz','Unabhängig von Außentemp.'],hi:false,img:IMGS.altbau},
              {type:'Wasser-Wasser',share:'2%',jaz:'5,0–6,0+',install:'€8.000–15.000',noise:'leiser (innen)',
                pros:['+5% KfW-Bonus','Höchste Jahresarbeitszahl','Niedrigste Betriebskosten'],hi:false,img:IMGS.house},
            ].map((t,i)=>(
              <div key={i} style={{background:'white',border:t.hi?`2px solid ${G}`:`1px solid ${BDR}`,borderRadius:16,boxShadow:SH,overflow:'hidden',transition:'all .22s'}}
                onMouseEnter={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='translateY(-3px)';d.style.boxShadow=SHL}}
                onMouseLeave={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='';d.style.boxShadow=SH}}>
                <div style={{position:'relative',height:180}}>
                  <img src={t.img} alt={t.type} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 60%)'}}/>
                  {t.hi&&<div style={{position:'absolute',top:0,left:0,right:0,background:G,padding:'5px 16px',fontSize:11,fontWeight:700,color:'white',fontFamily:'Outfit,sans-serif',letterSpacing:'.06em',textTransform:'uppercase',textAlign:'center'}}>Meistgewählt · Stiftung Warentest 2,0 (Gut)</div>}
                  <div style={{position:'absolute',bottom:10,right:12}}>
                    <span style={{background:'rgba(255,255,255,.92)',color:G,fontSize:11,fontWeight:700,padding:'3px 9px',borderRadius:100}}>{t.share} Marktanteil</span>
                  </div>
                </div>
                <div style={{padding:20}}>
                  <h3 style={{fontSize:18,marginBottom:12}}>{t.type}</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
                    {[{l:'JAZ',v:t.jaz},{l:'Installation',v:t.install},{l:'Lautstärke',v:t.noise},{l:'Marktanteil',v:t.share}].map(s=>(
                      <div key={s.l} style={{background:BG,borderRadius:8,padding:'9px 11px'}}>
                        <div style={{fontSize:11,color:TX3,fontWeight:600,marginBottom:3}}>{s.l}</div>
                        <div className="mono" style={{fontSize:12,fontWeight:700,color:TX}}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  {t.pros.map(p=>(
                    <div key={p} style={{display:'flex',gap:8,fontSize:13,color:TX2,marginBottom:6,alignItems:'center'}}>
                      <Check/>{p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section ref={testiRef.ref} className="sec" style={{background:'white'}}>
        <div className="c">
          <div style={{textAlign:'center',maxWidth:560,margin:'0 auto 48px'}}>
            <Tag bg={GLT} color={G} text="Erfahrungen"/>
            <h2>Was Hausbesitzer berichten</h2>
            <p style={{fontSize:15,color:TX3,marginTop:8}}>Alle Erfahrungsberichte stammen von vermittelten Kunden — unbearbeitet.</p>
          </div>
          <div className="g3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {i:'B',name:'Familie Brehmer',city:'Hannover',wp:'Luft-Wasser-WP',saved:'€1.100/Jahr gespart',date:'Jan. 2026',
                text:'„Nach 20 Jahren Ölheizung drei lokale Angebote bekommen — alle lagen unter dem ersten Angebot des bundesweiten Anbieters. Alles unkompliziert erklärt."',d:'.0s'},
              {i:'M',name:'Thomas Müller',city:'Freiburg',wp:'Sole-Wasser-WP',saved:'65% Förderung',date:'Nov. 2025',
                text:'„Den KfW-Antrag hätte ich alleine nie geschafft. Hier wurde ich Schritt für Schritt begleitet. Antrag war in einer Woche durch."',d:'.12s'},
              {i:'K',name:'Sabine Kröger',city:'Münster',wp:'Luft-Wasser-WP',saved:'3 Angebote verglichen',date:'Feb. 2026',
                text:'„Als Vermieterin war ich skeptisch. Die Berechnung war ehrlich — keine Druckverkäufe, kein Upsell. Eigenanteil nach Förderung: €9.800."',d:'.24s'},
            ].map((t,i)=>(
              <div key={i} className={'fu '+(testiRef.v?'fv':'')}
                style={{background:BG,border:`1px solid ${BDR}`,borderRadius:16,boxShadow:SH,padding:24,transitionDelay:t.d,transition:'all .22s ease, opacity .65s ease, transform .65s ease'}}
                onMouseEnter={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='translateY(-3px)';d.style.boxShadow=SHL}}
                onMouseLeave={e=>{const d=e.currentTarget as HTMLDivElement;d.style.transform='';d.style.boxShadow=SH}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <div style={{color:'#F59E0B',fontSize:14,letterSpacing:3}}>★★★★★</div>
                  <div style={{fontSize:11,color:TX3}}>{t.date}</div>
                </div>
                <p style={{fontSize:14,color:TX2,lineHeight:1.72,fontStyle:'italic',marginBottom:18}}>{t.text}</p>
                <div style={{borderTop:`1px solid ${BDR}`,paddingTop:14,display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:GLT,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:700,color:G,flexShrink:0}}>{t.i}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:TX}}>{t.name} · {t.city}</div>
                    <div style={{fontSize:12,color:TX3,marginTop:2}}>{t.wp} · {t.saved}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── STADTSEITEN INTERNAL LINKS ── */}
      <section className="sec" style={{background:'white'}}>
        <div className="c">
          <div style={{textAlign:'center',marginBottom:40}}>
            <span style={{display:'inline-block',background:'#E8F5EE',color:'#1B5E37',fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,marginBottom:16}}>Wärmepumpe in Ihrer Stadt</span>
            <h2 style={{fontSize:'clamp(24px,3vw,38px)'}}>Jetzt Angebote in Ihrer Stadt vergleichen</h2>
            <p style={{color:'#4B5563',maxWidth:560,margin:'12px auto 0'}}>Über 733 Städte — stadtspezifische Klimadaten, Förderprogramme und geprüfte lokale Betriebe.</p>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',marginBottom:32}}>
            {[
              ['Berlin','berlin'],['Hamburg','hamburg'],['München','muenchen'],['Köln','koeln'],
              ['Frankfurt','frankfurt-am-main'],['Stuttgart','stuttgart'],['Düsseldorf','duesseldorf'],
              ['Hannover','hannover'],['Leipzig','leipzig'],['Dortmund','dortmund'],
              ['Bremen','bremen'],['Dresden','dresden'],['Nürnberg','nuernberg'],['Duisburg','duisburg'],
              ['Bochum','bochum'],['Wuppertal','wuppertal'],['Bielefeld','bielefeld'],['Bonn','bonn'],
            ].map(([name,slug])=>(
              <a key={slug} href={`/waermepumpe/${slug}`}
                style={{padding:'8px 16px',background:'#F8F9FA',border:'1px solid #E5E7EB',borderRadius:8,fontSize:13,color:'#4B5563',textDecoration:'none',fontWeight:500,transition:'all .15s'}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.borderColor='#1B5E37';el.style.color='#1B5E37'}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.borderColor='#E5E7EB';el.style.color='#4B5563'}}>
                Wärmepumpe {name}
              </a>
            ))}
          </div>
          <div style={{textAlign:'center'}}>
            <a href="/waermepumpe/berlin" style={{fontSize:13,color:'#1B5E37',fontWeight:600,textDecoration:'none'}}>
              Alle 733 Städte → Suchen Sie Ihre Stadt
            </a>
          </div>
        </div>
      </section>
      {/* ── FAQ ── */}
      <section className="sec" style={{background:BG}}>
        <div className="c" style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <Tag bg={GLT} color={G} text="FAQ"/>
            <h2>Häufig gestellte Fragen</h2>
          </div>
          {[
            {q:'Ist die Nutzung von wärmepumpenbegleiter.de wirklich kostenlos?',
              a:'Ja, vollständig. Wir finanzieren uns über Vermittlungsprovisionen (€50–120) von unseren geprüften Installateur-Partnern. Für Sie entstehen keinerlei Kosten — weder für die Beratung noch für die Angebote.'},
            {q:'Wie unterscheidet sich wärmepumpenbegleiter.de von Thermondo oder Enpal?',
              a:'Thermondo und Enpal installieren eigene Wärmepumpen und verdienen am Verkauf. Wir sind herstellerunabhängig und vermitteln lokale Meisterbetriebe. Sie erhalten bis zu 3 Angebote zum Vergleich — wir profitieren von Ihrer besten Entscheidung, nicht von einer bestimmten Wahl.'},
            {q:'Welche Wärmepumpe empfehlen Sie für meinen Altbau?',
              a:'In den meisten Altbauten funktioniert eine Luft-Wasser-Wärmepumpe gut — besonders moderne Geräte mit Vorlauftemperaturen bis 70°C. Ob ein hydraulischer Abgleich oder eine Dämmmaßnahme sinnvoll ist, klärt ein lokaler Fachbetrieb bei einem kostenlosen Vor-Ort-Termin.'},
            {q:'Muss ich bei Auftragserteilung einen Vertrag mit wärmepumpenbegleiter.de abschließen?',
              a:'Nein. Ihre Anfrage, die Angebote und das Erstgespräch sind vollständig unverbindlich. Einen Vertrag schließen Sie ausschließlich mit dem Installateur, den Sie wählen — nicht mit uns.'},
            {q:'Wie lange dauert die Installation einer Wärmepumpe?',
              a:'Die eigentliche Montage dauert 1–3 Tage. Inklusive Planung, Förderantrag (muss vor Baubeginn gestellt werden!) und Vorlaufzeit sollten Sie 6–12 Wochen von der Anfrage bis zur fertigen Anlage einplanen.'},
          ].map((item,i)=>(
            <details key={i} style={{borderBottom:`1px solid ${BDR}`}}>
              <summary style={{width:'100%',padding:'18px 0',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',listStyle:'none',gap:16}}>
                <span style={{fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:600,color:TX}}>{item.q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </summary>
              <div style={{paddingBottom:18}}>
                <p style={{fontSize:15,color:TX2,lineHeight:1.7}}>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{position:'relative',overflow:'hidden'}}>
        <img src={IMGS.outdoor} alt="Wärmepumpe Installation Fachbetrieb" style={{width:'100%',height:480,objectFit:'cover',display:'block'}}/>
        <div style={{position:'absolute',inset:0,background:'rgba(10,25,16,.82)'}}/>
        <div className="c" style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',textAlign:'center'}}>
          <Tag bg="rgba(255,255,255,.1)" color="rgba(255,255,255,.8)" text="Jetzt starten"/>
          <h2 style={{color:'white',fontSize:'clamp(32px,4vw,52px)',marginBottom:14}}>Bereit für die Heizungswende?</h2>
          <p style={{fontSize:18,color:'rgba(255,255,255,.65)',marginBottom:36,maxWidth:480}}>Kostenloses Angebot in 2 Minuten — ohne Vertragsbindung.</p>
          <a href="/rechner" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'16px 36px',background:'white',color:G,borderRadius:'10px',fontFamily:'Outfit,sans-serif',fontSize:16,fontWeight:700,textDecoration:'none',boxShadow:'0 4px 20px rgba(0,0,0,.2)',transition:'all .18s'}}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.transform='translateY(-1px)'}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.transform=''}}>
            Kostenloses Angebot anfordern →
          </a>
          <div style={{fontSize:13,color:'rgba(255,255,255,.4)',marginTop:18,display:'flex',gap:20,flexWrap:'wrap',justifyContent:'center'}}>
            <span>✓ Kein Spam</span><span>✓ Keine Weitergabe ohne Zustimmung</span><span>✓ 100% kostenlos</span>
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
              <p style={{fontSize:13,color:'rgba(255,255,255,.33)',lineHeight:1.65,maxWidth:210,marginBottom:12}}>Ihr unabhängiger Begleiter für die Heizungswende. Herstellerunabhängig seit 2025.</p>
              <p style={{fontSize:11,color:'rgba(255,255,255,.2)',lineHeight:1.5}}>Wir erhalten eine Vermittlungsprovision von Installateuren. Für Sie kostenlos.</p>
            </div>
            {[
              {h:'Navigation',links:[{l:'Rechner',href:'/rechner'},{l:'Ratgeber',href:'/ratgeber'},{l:'Über uns',href:'/ueber-uns'},{l:'Kontakt',href:'/kontakt'}]},
              {h:'Städte',links:[{l:'Berlin',href:'#'},{l:'Hamburg',href:'#'},{l:'München',href:'#'},{l:'Köln',href:'#'},{l:'Frankfurt',href:'#'},{l:'Stuttgart',href:'#'}]},
              {h:'Rechtliches',links:[{l:'Impressum',href:'/impressum'},{l:'Datenschutz',href:'/datenschutz'},{l:'AGB',href:'/agb'}]},
            ].map(col=>(
              <div key={col.h}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.22)',marginBottom:14}}>{col.h}</div>
                {col.links.map(l=>(
                  <a key={l.l} href={l.href} style={{display:'block',fontSize:13,color:'rgba(255,255,255,.42)',textDecoration:'none',marginBottom:8,transition:'color .15s'}}
                    onMouseEnter={e=>e.currentTarget.style.color='white'}
                    onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.42)'}>{l.l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:20,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
            <span style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>© 2026 Wärmepumpenbegleiter.de</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>Zuletzt aktualisiert: März 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
