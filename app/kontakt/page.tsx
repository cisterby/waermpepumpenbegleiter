'use client'
import { useState } from 'react'

export default function Kontakt() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [tel, setTel]         = useState('')
  const [plz, setPlz]         = useState('')
  const [betreff, setBetreff] = useState('allgemein')
  const [msg, setMsg]         = useState('')
  const [dsgvo, setDsgvo]     = useState(false)
  const [sent, setSent]       = useState(false)
  const [open, setOpen]       = useState<number|null>(null)

  const faqs = [
    ['Ist die Nutzung wirklich kostenlos?', 'Ja, vollständig. Wir werden von unseren Installateur-Partnern vergütet, nicht von Ihnen. Für Hausbesitzer entstehen keinerlei Kosten.'],
    ['Wie schnell erhalte ich Rückmeldung?', 'In der Regel innerhalb von 48 Stunden nach Ihrer Anfrage. Geprüfte Fachbetriebe aus Ihrer PLZ melden sich direkt bei Ihnen.'],
    ['Für welche Gebäude eignet sich eine Wärmepumpe?', 'Für die meisten Bestandsgebäude. Luft-Wasser-Wärmepumpen funktionieren auch ohne Fußbodenheizung — entscheidend ist der hydraulische Abgleich.'],
    ['Was passiert nach meiner Anfrage?', 'Bis zu 3 geprüfte Fachbetriebe aus Ihrer PLZ erhalten Ihre Anfrage und melden sich innerhalb von 48h bei Ihnen für ein kostenloses Erstgespräch.'],
    ['Bin ich zur Auftragserteilung verpflichtet?', 'Nein. Anfrage, Beratung und Angebote sind vollständig unverbindlich. Kein Vertrag, kein Druck.'],
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#F6F3EE;color:#1C2B25}
        h1,h2,h3{font-family:'Cormorant Garamond',serif;line-height:1.15}
        .c{max-width:1200px;margin:0 auto;padding:0 40px}
        .over{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#2D7A52;display:block;margin-bottom:12px}
        input,select,textarea{width:100%;padding:11px 16px;border:1px solid #DDD8CF;border-radius:8px;background:white;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;color:#1C2B25;outline:none;transition:border-color .2s;resize:vertical}
        input:focus,select:focus,textarea:focus{border-color:#1A4731}
        select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234A6358' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
        .lbl{display:block;font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#7A9E8E;margin-bottom:7px}
        .fg{margin-bottom:18px}
        @media(max-width:900px){.c{padding:0 20px}.g2{grid-template-columns:1fr!important}}
      `}</style>

      {/* HEADER */}
      <div style={{position:'relative',overflow:'hidden',minHeight:380,display:'flex',alignItems:'flex-end'}}>
        <img src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80"
          alt="Kontakt" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(26,55,40,.5) 0%, rgba(26,55,40,.92) 100%)'}}/>
        <div className="c" style={{position:'relative',zIndex:1,padding:'130px 40px 60px'}}>
          <span className="over" style={{color:'rgba(76,175,125,.9)'}}>Kontakt</span>
          <h1 style={{color:'#F0FAF4',fontSize:'clamp(38px,5vw,64px)',marginBottom:14}}>Wie können wir helfen?</h1>
          <p style={{fontSize:18,color:'rgba(240,250,244,.65)',maxWidth:500}}>Fragen zur Förderung, zur Technik oder zu Ihrem Gebäude — wir sind für Sie da.</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="c" style={{padding:'72px 40px 96px'}}>
        <div className="g2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'start'}}>

          {/* LEFT */}
          <div>
            {/* Contact info */}
            <div style={{background:'white',border:'1px solid rgba(26,71,49,.1)',borderRadius:14,padding:28,marginBottom:24}}>
              <h3 style={{fontSize:22,marginBottom:20,borderBottom:'1px solid #EEE9E2',paddingBottom:14}}>Kontaktdaten</h3>
              {[
                {icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label:'E-Mail', val:'info@waermepumpenbegleiter.de'},
                {icon:'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label:'Telefon', val:'Wird bald bekannt gegeben'},
                {icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label:'Erreichbarkeit', val:'Mo–Fr, 08:00–18:00 Uhr'},
              ].map(c => (
                <div key={c.label} style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:16}}>
                  <div style={{width:36,height:36,background:'rgba(26,71,49,.07)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A4731" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon}/></svg>
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:'#7A9E8E',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:2}}>{c.label}</div>
                    <div style={{fontSize:15,color:'#1C2B25'}}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div style={{background:'white',border:'1px solid rgba(26,71,49,.1)',borderRadius:14,padding:28}}>
              <h3 style={{fontSize:22,marginBottom:20,borderBottom:'1px solid #EEE9E2',paddingBottom:14}}>Häufige Fragen</h3>
              {faqs.map((f,i) => (
                <div key={i} style={{borderBottom: i < faqs.length-1 ? '1px solid #EEE9E2' : 'none'}}>
                  <button onClick={() => setOpen(open===i ? null : i)}
                    style={{width:'100%',background:'none',border:'none',padding:'14px 0',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',textAlign:'left',gap:12}}>
                    <span style={{fontSize:15,fontWeight:500,color:'#1C2B25'}}>{f[0]}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A6358" strokeWidth="2" style={{flexShrink:0,transform:open===i?'rotate(180deg)':'',transition:'transform .2s'}}>
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {open===i && <p style={{fontSize:14,color:'#4A6358',lineHeight:1.65,paddingBottom:14}}>{f[1]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{background:'white',border:'1px solid rgba(26,71,49,.1)',borderRadius:14,padding:32,boxShadow:'0 8px 32px rgba(26,71,49,.08)'}}>
            {sent ? (
              <div style={{textAlign:'center',padding:'48px 0'}}>
                <div style={{width:64,height:64,background:'rgba(26,71,49,.08)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A4731" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{fontSize:26,marginBottom:10}}>Vielen Dank!</h3>
                <p style={{fontSize:16,color:'#4A6358'}}>Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
              </div>
            ) : (
              <>
                <h3 style={{fontSize:24,marginBottom:22,borderBottom:'1px solid #EEE9E2',paddingBottom:14}}>Schreiben Sie uns</h3>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:18}}>
                  <div><label className="lbl">Name *</label><input placeholder="Max Mustermann" value={name} onChange={e=>setName(e.target.value)}/></div>
                  <div><label className="lbl">E-Mail *</label><input type="email" placeholder="ihre@email.de" value={email} onChange={e=>setEmail(e.target.value)}/></div>
                  <div><label className="lbl">Telefon</label><input placeholder="+49 30 123456" value={tel} onChange={e=>setTel(e.target.value)}/></div>
                  <div><label className="lbl">PLZ</label><input placeholder="10115" maxLength={5} value={plz} onChange={e=>setPlz(e.target.value.replace(/\D/g,''))}/></div>
                </div>
                <div className="fg">
                  <label className="lbl">Betreff</label>
                  <select value={betreff} onChange={e=>setBetreff(e.target.value)}>
                    <option value="allgemein">Allgemeine Anfrage</option>
                    <option value="technik">Technische Frage</option>
                    <option value="partner">Partner werden (Installateur)</option>
                    <option value="presse">Presseanfrage</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">Nachricht</label>
                  <textarea rows={5} placeholder="Ihre Nachricht..." value={msg} onChange={e=>setMsg(e.target.value)}/>
                </div>
                <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:22,cursor:'pointer'}} onClick={()=>setDsgvo(!dsgvo)}>
                  <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${dsgvo?'#1A4731':'#DDD8CF'}`,background:dsgvo?'#1A4731':'white',flexShrink:0,marginTop:2,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}>
                    {dsgvo && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{fontSize:13,color:'#4A6358',lineHeight:1.5}}>Ich stimme der Verarbeitung meiner Daten gemäß <a href="/datenschutz" style={{color:'#1A4731'}}>Datenschutzerklärung</a> zu. *</span>
                </div>
                <button
                  onClick={() => { if(name&&email&&dsgvo){ setTimeout(()=>setSent(true),600) } }}
                  style={{width:'100%',padding:'15px 20px',background: name&&email&&dsgvo ? '#1A4731' : '#DDD8CF',color:'white',border:'none',borderRadius:8,fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:15,fontWeight:600,cursor: name&&email&&dsgvo ? 'pointer':'not-allowed',transition:'background .2s',boxShadow: name&&email&&dsgvo ? '0 4px 16px rgba(26,71,49,.25)':'none'}}>
                  Nachricht senden →
                </button>
                <p style={{fontSize:12,color:'#7A9E8E',textAlign:'center',marginTop:12}}>* Pflichtfelder. Keine Weitergabe ohne Ihre Zustimmung.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
