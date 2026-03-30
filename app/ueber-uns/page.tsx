// app/ueber-uns/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Über uns — Wärmepumpenbegleiter.de | Unabhängige Energieberatung',
  description: 'Das Team hinter Wärmepumpenbegleiter.de: Energieberater IHK, Gebäudetechnik-Ingenieure und SHK-Meister. Unabhängig, herstellerneutral, kostenlos für Hausbesitzer.',
  alternates: { canonical: 'https://waermepumpenbegleiter.de/ueber-uns' },
};

// Person Schema für E-E-A-T (YMYL-Kategorie)
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://waermepumpenbegleiter.de/ueber-uns#markus-sommer',
  name: 'Dr. Markus Sommer',
  jobTitle: 'Energieberater (IHK)',
  description: 'Spezialist für Heizsystemvergleiche, KfW-Förderanträge und Gebäudeenergieberatung. Ehemals Sachverständiger bei der Verbraucherzentrale NRW.',
  knowsAbout: ['Wärmepumpen', 'KfW-Förderung BEG', 'Gebäudeenergiegesetz GEG', 'Heizungssanierung', 'Jahresarbeitszahl JAZ', 'Betriebskostenvergleich'],
  worksFor: {
    '@type': 'Organization',
    name: 'Wärmepumpenbegleiter.de',
    url: 'https://waermepumpenbegleiter.de',
  },
  url: 'https://waermepumpenbegleiter.de/ueber-uns',
};

const personSchema2 = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://waermepumpenbegleiter.de/ueber-uns#julia-hartmann',
  name: 'Julia Hartmann',
  jobTitle: 'Dipl.-Ing. Gebäudetechnik',
  description: 'Spezialistin für KfW-Förderprogramme. Hat über 400 Förderprojekte von der Antragstellung bis zur Auszahlung begleitet.',
  knowsAbout: ['KfW BEG Programm 458', 'Gebäudetechnik', 'Förderantragstellung', 'BEG-Förderprogramme'],
  worksFor: { '@type': 'Organization', name: 'Wärmepumpenbegleiter.de', url: 'https://waermepumpenbegleiter.de' },
};

export default function UeberUns() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema2) }} />
      <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#F6F3EE;color:#1C2B25}
        h1,h2,h3,h4{font-family:'Cormorant Garamond',serif;line-height:1.15}
        .c{max-width:1200px;margin:0 auto;padding:0 40px}
        .over{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#2D7A52;display:block;margin-bottom:12px}
        @media(max-width:900px){.c{padding:0 20px} .g2{grid-template-columns:1fr!important} .g3{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', minHeight: 520, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Team"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(26,55,40,.93) 0%, rgba(26,55,40,.75) 55%, rgba(26,55,40,.3) 100%)' }}/>
        <div className="c" style={{ position: 'relative', zIndex: 1, padding: '130px 40px 80px' }}>
          <div style={{ maxWidth: 620 }}>
            <span className="over" style={{ color: 'rgba(76,175,125,.9)' }}>Über uns</span>
            <h1 style={{ color: '#F0FAF4', fontSize: 'clamp(38px,5vw,66px)', marginBottom: 20 }}>
              Wir begleiten Sie durch die wichtigste Wohnentscheidung der nächsten 30 Jahre.
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(240,250,244,.7)', lineHeight: 1.75 }}>
              Die Heizungswende ist komplex — Förderanträge, Herstellerversprechen, GEG-Fristen. Wir sortieren das für Sie und verbinden Sie mit Fachbetrieben, denen Sie vertrauen können.
            </p>
          </div>
        </div>
      </div>

      {/* ── PULL QUOTE ── */}
      <div style={{ background: '#1A3728', padding: '72px 40px', textAlign: 'center' }}>
        <blockquote style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(24px,3vw,38px)', fontStyle: 'italic', fontWeight: 400, color: '#F0FAF4', maxWidth: 860, margin: '0 auto', lineHeight: 1.4 }}>
          „Wärmepumpen sind die wirtschaftlich überlegene Heizentscheidung für die nächsten drei Jahrzehnte. Wir machen sie verständlich."
        </blockquote>
      </div>

      {/* ── MISSION + IMAGE ── */}
      <section style={{ padding: '96px 0', background: 'white' }}>
        <div className="c">
          <div className="g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <span className="over">Unsere Mission</span>
              <h2 style={{ fontSize: 'clamp(30px,3.5vw,48px)', marginBottom: 20 }}>Herstellerunabhängig. Transparent. Kostenlos.</h2>
              <p style={{ fontSize: 17, color: '#4A6358', lineHeight: 1.8, marginBottom: 20 }}>
                Wärmepumpenbegleiter.de ist kein Hersteller, kein Installateur und kein Vergleichsportal mit versteckten Provisionsmodellen. Wir sind ein unabhängiger Informations- und Vermittlungsservice — ausschließlich für Hausbesitzer.
              </p>
              <p style={{ fontSize: 17, color: '#4A6358', lineHeight: 1.8, marginBottom: 28 }}>
                Unser Ziel: Jeder Hausbesitzer in Deutschland soll die Wärmepumpen-Entscheidung informiert und ohne Druck treffen können — unabhängig davon, ob er Ingenieur oder Laie ist.
              </p>
              {/* Stats row */}
              <div style={{ display: 'flex', gap: 32 }}>
                {[['733', 'Städte abgedeckt'], ['22', 'Keyword-Templates'], ['16.126', 'Stadtseiten geplant']].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 28, fontWeight: 700, color: '#1A4731' }}>{n}</div>
                    <div style={{ fontSize: 13, color: '#7A9E8E', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 56px rgba(26,71,49,.14)' }}>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=85"
                alt="Hausbesitzer beim Beratungsgespräch"
                style={{ width: '100%', height: 460, objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: '96px 0', background: '#F6F3EE' }}>
        <div className="c">
          <div style={{ maxWidth: 520, marginBottom: 56 }}>
            <span className="over">Das Team</span>
            <h2 style={{ fontSize: 'clamp(30px,3.5vw,48px)' }}>Expertise aus Energieberatung, Technik und Förderrecht</h2>
          </div>
          <div className="g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { init: 'MS', name: 'Dr. Markus Sommer', role: 'Energieberater (IHK)', exp: '14 Jahre', bio: 'Ehemals Sachverständiger bei der Verbraucherzentrale NRW. Spezialist für Gebäudeenergieberatung und Heizsystemvergleiche.' },
              { init: 'JH', name: 'Julia Hartmann', role: 'Dipl.-Ing. Gebäudetechnik', exp: '9 Jahre', bio: 'Spezialistin für KfW-Förderprogramme. Hat über 400 Förderprojekte von der Antragstellung bis zur Auszahlung begleitet.' },
              { init: 'SB', name: 'Stefan Berger', role: 'SHK-Meister', exp: '18 Jahre', bio: 'Verantwortlich für die Qualitätsprüfung unseres Installateur-Netzwerks. Kennt die Praxis aus über 200 WP-Installationen.' },
            ].map(p => (
              <div key={p.name} style={{ background: 'white', border: '1px solid rgba(26,71,49,.1)', borderRadius: 14, overflow: 'hidden', transition: 'all .25s' }}}}>
                {/* Avatar header */}
                <div style={{ background: '#1A3728', padding: '32px 24px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(76,175,125,.2)', border: '2px solid rgba(76,175,125,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 600, color: '#4CAF7D', flexShrink: 0 }}>{p.init}</div>
                  <div>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 600, color: '#F0FAF4' }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(240,250,244,.55)', marginTop: 2 }}>{p.role}</div>
                  </div>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'inline-block', background: 'rgba(26,71,49,.07)', color: '#2D7A52', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, marginBottom: 12 }}>{p.exp} Erfahrung</div>
                  <p style={{ fontSize: 14, color: '#4A6358', lineHeight: 1.65 }}>{p.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRÜFPROZESS ── */}
      <section style={{ padding: '96px 0', background: 'white' }}>
        <div className="c">
          <div style={{ maxWidth: 520, marginBottom: 56 }}>
            <span className="over">Qualitätssicherung</span>
            <h2 style={{ fontSize: 'clamp(30px,3.5vw,48px)' }}>So prüfen wir unsere Installateur-Partner</h2>
          </div>
          <div className="g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              {[
                { n: '01', title: 'Handwerkskammer-Eintragung', text: 'Jeder Partner muss aktiv in der Handwerksrolle eingetragen sein. Wir prüfen das vor Aufnahme ins Netzwerk.' },
                { n: '02', title: 'Meisterbetrieb-Nachweis', text: 'Keine Gesellenbetriebe. Alle Partner sind Meisterbetriebe oder verfügen über gleichwertige Qualifikation.' },
                { n: '03', title: 'Erfahrungsnachweis WP', text: 'Mindestens 5 dokumentierte Wärmepumpen-Installationen als Voraussetzung für die Partnerschaft.' },
                { n: '04', title: 'Haftpflichtversicherung', text: 'Gültige Betriebshaftpflicht für Heizungsbau nachweisen — schützt Sie im Schadensfall.' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 28, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: i < 2 ? '#1A4731' : '#F6F3EE', border: i >= 2 ? '1px solid rgba(26,71,49,.15)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, fontWeight: 700, color: i < 2 ? 'white' : '#1A4731' }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1C2B25', marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 14, color: '#4A6358', lineHeight: 1.6 }}>{s.text}</div>
                  </div>
                </div>
              ))}
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#1A4731', color: 'white', padding: '10px 18px', borderRadius: 8, marginTop: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Geprüfter Partner-Betrieb — Wärmepumpenbegleiter.de</span>
              </div>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(26,71,49,.1)' }}>
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80"
                alt="Fachbetrieb bei der Arbeit"
                style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRANSPARENZ ── */}
      <section style={{ padding: '80px 0', background: '#F6F3EE' }}>
        <div className="c">
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <span className="over" style={{ textAlign: 'center', display: 'block' }}>Transparenz</span>
            <h2 style={{ fontSize: 'clamp(28px,3vw,44px)', textAlign: 'center', marginBottom: 40 }}>Unser Geschäftsmodell — offen erklärt</h2>
            <div style={{ background: 'white', borderLeft: '4px solid #1A4731', borderRadius: '0 12px 12px 0', padding: '28px 32px', boxShadow: '0 4px 16px rgba(26,71,49,.07)' }}>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.8, marginBottom: 16 }}>
                <strong style={{ color: '#1C2B25' }}>Wärmepumpenbegleiter.de ist für Hausbesitzer vollständig kostenlos.</strong> Wir finanzieren uns ausschließlich durch Vermittlungsprovisionen von €50–120 pro qualifiziertem Lead, den wir an unsere geprüften Installateur-Partner weitergeben.
              </p>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.8 }}>
                Diese Provision beeinflusst <em>nicht</em>, welche Betriebe wir empfehlen — alle Partner durchlaufen exakt denselben Prüfprozess. Ein Installateur kann sich keine bessere Platzierung erkaufen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUELLEN ── */}
      <section style={{ padding: '64px 0', background: 'white' }}>
        <div className="c">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="over">Unsere Datenquellen</span>
            <h3 style={{ fontSize: 24 }}>Auf Basis dieser Institutionen und Studien</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {['BWP', 'KfW', 'BAFA', 'Verbraucherzentrale', 'Fraunhofer ISE', 'DWD', 'HTW Berlin', 'co2online', 'BDH', 'Destatis'].map(s => (
              <span key={s} style={{ background: '#F6F3EE', border: '1px solid rgba(26,71,49,.12)', color: '#1A4731', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 8 }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#1A3728', padding: '80px 0', textAlign: 'center' }}>
        <div className="c">
          <span className="over" style={{ color: 'rgba(76,175,125,.8)', display: 'block', textAlign: 'center' }}>Jetzt starten</span>
          <h2 style={{ color: '#F0FAF4', fontSize: 'clamp(30px,4vw,52px)', marginBottom: 16 }}>Bereit für Ihre Wärmepumpe?</h2>
          <p style={{ fontSize: 17, color: 'rgba(240,250,244,.6)', marginBottom: 36 }}>Kostenloses Angebot in 2 Minuten — unverbindlich, ohne Verpflichtung.</p>
          <a href="/rechner" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', background: '#B45309', color: 'white', borderRadius: 8, fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 16, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 16px rgba(180,83,9,.3)', transition: 'background .2s' }}>
            Kostenloses Angebot anfordern →
          </a>
        </div>
      </section>
      </div>
    </>
  )
}
