'use client'
import { useState } from 'react'

const articles = [
  { cat:'GEG & Recht', title:'GEG 2026: Was sich für Hausbesitzer in Großstädten ab Juli ändert', excerpt:'Ab dem 30. Juni 2026 gilt die 65%-EE-Pflicht für alle Bestandsgebäude in Kommunen mit über 100.000 Einwohnern. Was das konkret bedeutet.', time:'12 Min.', date:'März 2026', img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80', big:true },
  { cat:'Kosten & Förderung', title:'KfW 458: Schritt für Schritt zur Förderung', excerpt:'Der Antrag klingt komplizierter als er ist — wenn man die Reihenfolge kennt.', time:'8 Min.', date:'Feb. 2026', img:'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80' },
  { cat:'Technik', title:'Luft-Wasser-Wärmepumpe: Vor- und Nachteile ehrlich erklärt', excerpt:'92% aller neu installierten Wärmepumpen in Deutschland sind Luft-Wasser-Geräte. Warum — und für wen sie nicht geeignet sind.', time:'10 Min.', date:'Jan. 2026', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80' },
  { cat:'Altbau', title:'Wärmepumpe im Altbau: Was wirklich wichtig ist', excerpt:'Vorlauftemperatur, Heizkörpergröße, hydraulischer Abgleich — die drei Faktoren die über Erfolg oder Misserfolg entscheiden.', time:'7 Min.', date:'Jan. 2026', img:'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  { cat:'Kosten & Förderung', title:'CO₂-Preis 2026: Was Gas-Heizer jetzt zahlen', excerpt:'Der CO₂-Preis steigt jährlich. Was das für Ihre Gasrechnung bedeutet und wann sich der Wechsel rechnet.', time:'5 Min.', date:'Dez. 2025', img:'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800&q=80' },
  { cat:'Technik', title:'Jahresarbeitszahl (JAZ): Der wichtigste Kenner beim WP-Kauf', excerpt:'Der COP sagt wenig — die JAZ alles. Wie sie berechnet wird und welcher Wert wirklich gut ist.', time:'6 Min.', date:'Nov. 2025', img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80' },
]

const cats = ['Alle', 'GEG & Recht', 'Kosten & Förderung', 'Technik', 'Altbau']

export default function Ratgeber() {
  const [active, setActive] = useState('Alle')
  const [email, setEmail]   = useState('')

  const filtered = active === 'Alle' ? articles : articles.filter(a => a.cat === active)
  const [hero, ...rest] = filtered

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#F6F3EE;color:#1C2B25}
        h1,h2,h3{font-family:'Cormorant Garamond',serif;line-height:1.15}
        .c{max-width:1200px;margin:0 auto;padding:0 40px}
        .over{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#2D7A52;display:block;margin-bottom:12px}
        @media(max-width:900px){.c{padding:0 20px}.grid-sm{grid-template-columns:1fr!important}}
      `}</style>

      {/* HEADER */}
      <div style={{background:'#1A3728',padding:'90px 0 56px'}}>
        <div className="c">
          <span className="over" style={{color:'rgba(76,175,125,.9)'}}>Wissen für Hausbesitzer</span>
          <h1 style={{color:'#F0FAF4',fontSize:'clamp(38px,5vw,62px)',marginBottom:14}}>Ratgeber Wärmepumpe</h1>
          <p style={{fontSize:18,color:'rgba(240,250,244,.6)',maxWidth:520}}>Verständliche Erklärungen zu Technik, Kosten, Förderung und dem Gebäudeenergiegesetz.</p>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{background:'white',borderBottom:'1px solid #DDD8CF',padding:'16px 0',position:'sticky',top:0,zIndex:50}}>
        <div className="c" style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {cats.map(c => (
            <button key={c} onClick={()=>setActive(c)}
              style={{padding:'8px 16px',borderRadius:100,border:`1px solid ${active===c?'#1A4731':'#DDD8CF'}`,background:active===c?'#1A4731':'white',color:active===c?'white':'#4A6358',fontSize:13,fontWeight:600,cursor:'pointer',transition:'all .2s'}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="c" style={{padding:'48px 40px 96px'}}>
        {/* HERO CARD */}
        {hero && (
          <div style={{borderRadius:16,overflow:'hidden',marginBottom:28,cursor:'pointer',position:'relative',height:420,boxShadow:'0 8px 32px rgba(26,71,49,.12)'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='scale(1.005)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform=''}}>
            <img src={hero.img} alt={hero.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .4s'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(16,34,24,.92) 0%, rgba(16,34,24,.4) 60%, transparent 100%)'}}/>
            <div style={{position:'absolute',bottom:0,left:0,right:0,padding:36}}>
              <span style={{display:'inline-block',background:'#1A4731',color:'white',fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:100,marginBottom:12}}>{hero.cat}</span>
              <h2 style={{color:'#F0FAF4',fontSize:'clamp(24px,3vw,38px)',marginBottom:12,maxWidth:700}}>{hero.title}</h2>
              <p style={{fontSize:16,color:'rgba(240,250,244,.7)',maxWidth:600,marginBottom:14,lineHeight:1.6}}>{hero.excerpt}</p>
              <span style={{fontSize:13,color:'rgba(240,250,244,.5)'}}>{hero.time} Lesezeit · {hero.date}</span>
            </div>
          </div>
        )}

        {/* ARTICLE GRID */}
        <div className="grid-sm" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:22}}>
          {rest.map((a,i) => (
            <div key={i} style={{background:'white',border:'1px solid rgba(26,71,49,.1)',borderRadius:14,overflow:'hidden',cursor:'pointer',transition:'all .25s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLDivElement).style.boxShadow='0 16px 40px rgba(26,71,49,.1)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='';(e.currentTarget as HTMLDivElement).style.boxShadow=''}}>
              <div style={{height:180,overflow:'hidden'}}>
                <img src={a.img} alt={a.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .4s'}}/>
              </div>
              <div style={{padding:22}}>
                <span style={{display:'inline-block',background:'rgba(26,71,49,.07)',color:'#1A4731',fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:100,marginBottom:10}}>{a.cat}</span>
                <h3 style={{fontSize:19,marginBottom:8,lineHeight:1.25}}>{a.title}</h3>
                <p style={{fontSize:14,color:'#4A6358',lineHeight:1.6,marginBottom:14}}>{a.excerpt}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,color:'#7A9E8E'}}>{a.time} · {a.date}</span>
                  <span style={{fontSize:13,fontWeight:600,color:'#1A4731'}}>Weiterlesen →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEWSLETTER */}
      <div style={{background:'#1A3728',padding:'72px 0'}}>
        <div className="c" style={{textAlign:'center'}}>
          <span className="over" style={{color:'rgba(76,175,125,.8)',display:'block',textAlign:'center'}}>Newsletter</span>
          <h2 style={{color:'#F0FAF4',fontSize:'clamp(26px,3vw,42px)',marginBottom:12}}>Immer informiert: GEG-Updates, Förderänderungen, Preise</h2>
          <p style={{fontSize:16,color:'rgba(240,250,244,.55)',marginBottom:32}}>Kein Spam. Abmeldung jederzeit möglich.</p>
          <div style={{display:'flex',gap:10,maxWidth:480,margin:'0 auto',flexWrap:'wrap',justifyContent:'center'}}>
            <input type="email" placeholder="Ihre E-Mail-Adresse" value={email} onChange={e=>setEmail(e.target.value)}
              style={{flex:1,minWidth:220,padding:'12px 16px',borderRadius:8,border:'1px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.08)',color:'white',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:15,outline:'none'}}/>
            <button style={{padding:'12px 22px',background:'#B45309',color:'white',border:'none',borderRadius:8,fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:15,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>
              Anmelden →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
