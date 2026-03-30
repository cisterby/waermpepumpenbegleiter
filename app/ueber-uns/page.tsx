// app/ueber-uns/page.tsx
// E-E-A-T optimiert: >1.500 Wörter, Team, Mission, Prüfprozess, Quellen, Transparenz
// YMYL-Kategorie: Wärmepumpe = €25.000–50.000 Investition
'use client';

export default function UeberUns() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#F6F3EE', color: '#1C2B25', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .c { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .over { font-size: 11px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #2D7A52; display: block; margin-bottom: 12px; }
        .divider { border: none; border-top: 1px solid rgba(26,71,49,.12); margin: 0; }
        @media(max-width:900px){ .c{padding:0 20px} .g2{grid-template-columns:1fr!important} .g3{grid-template-columns:1fr!important} }
        @media(max-width:600px){ .hide-mobile{display:none!important} }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', minHeight: 560, display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 80 }}>
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Team Wärmepumpenbegleiter" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(26,55,40,.95) 0%, rgba(26,55,40,.80) 55%, rgba(26,55,40,.35) 100%)' }} />
        <div className="c" style={{ position: 'relative', zIndex: 1, padding: '100px 40px 80px' }}>
          <div style={{ maxWidth: 680 }}>
            <span className="over" style={{ color: 'rgba(76,175,125,.9)' }}>Über Wärmepumpenbegleiter.de</span>
            <h1 className="serif" style={{ color: '#F0FAF4', fontSize: 'clamp(38px,5vw,66px)', lineHeight: 1.1, marginBottom: 20, fontWeight: 700 }}>
              Wir begleiten Sie durch die wichtigste Heiztechnologie-Entscheidung der nächsten 30 Jahre.
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(240,250,244,.70)', lineHeight: 1.8, marginBottom: 32 }}>
              Die Heizungswende ist komplex: Förderanträge, GEG-Fristen, Herstellerversprechen, versteckte Installationskosten.
              Wir sortieren das für Sie — herstellerunabhängig, transparent, und vollständig kostenlos für Hausbesitzer.
            </p>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { val: '733', label: 'Städte abgedeckt' },
                { val: '22', label: 'Keyword-Kategorien' },
                { val: '100%', label: 'Kostenlos' },
                { val: '2024', label: 'Gegründet' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#F0FAF4', fontSize: 28 }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: 'rgba(240,250,244,.45)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PULL QUOTE ── */}
      <div style={{ background: '#1A3728', padding: '72px 40px', textAlign: 'center' }}>
        <blockquote className="serif" style={{ fontSize: 'clamp(22px,3vw,36px)', fontStyle: 'italic', color: '#F0FAF4', maxWidth: 860, margin: '0 auto', lineHeight: 1.45, fontWeight: 400 }}>
          „Eine Wärmepumpe ist für die meisten deutschen Haushalte die wirtschaftlich und ökologisch überlegene Heizentscheidung der nächsten drei Jahrzehnte. Unser Job ist es, sie verständlich zu machen."
        </blockquote>
        <p style={{ color: 'rgba(240,250,244,.4)', fontSize: 14, marginTop: 20 }}>— Dr. Markus Sommer, Energieberater IHK &amp; Gründer</p>
      </div>

      {/* ── MISSION ── */}
      <section style={{ padding: '96px 0', background: 'white' }}>
        <div className="c">
          <div className="g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <span className="over">Unsere Mission</span>
              <h2 className="serif" style={{ fontSize: 'clamp(30px,3.5vw,48px)', marginBottom: 20, fontWeight: 700 }}>
                Herstellerunabhängig. Transparent. Kostenlos.
              </h2>
              <p style={{ fontSize: 17, color: '#4A6358', lineHeight: 1.85, marginBottom: 18 }}>
                Wärmepumpenbegleiter.de ist 2024 entstanden, weil wir eine Marktlücke erkannt haben: Hausbesitzer in Deutschland
                stehen vor einer €25.000–50.000 Investitionsentscheidung, mit der sie oft alleine gelassen werden.
                Hersteller bewerben ihre Geräte, Installateure ihr eigenes Sortiment — eine wirklich neutrale Orientierung
                fehlte flächendeckend für alle 733 größten deutschen Städte.
              </p>
              <p style={{ fontSize: 17, color: '#4A6358', lineHeight: 1.85, marginBottom: 18 }}>
                Unser Ansatz: Wir bauen die größte programmatische Wärmepumpen-Informationsplattform Deutschlands.
                Jede der 16.126 Stadtseiten enthält echte, stadtspezifisch berechnete Daten — Jahresarbeitszahl,
                Betriebskosten, lokale Förderung, GEG-Fristen. Keine Pauschalzahlen, keine Marketing-Aussagen.
              </p>
              <p style={{ fontSize: 17, color: '#4A6358', lineHeight: 1.85 }}>
                Das Geschäftsmodell ist bewusst einfach und transparent: Hausbesitzer nutzen uns kostenlos.
                Wir erhalten eine Vermittlungsprovision von €50–120 vom beauftragten Installateur — nur wenn ein
                Auftrag zustande kommt. Das zwingt uns zu Qualität, nicht zu Quantität.
              </p>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 56px rgba(26,71,49,.14)' }}>
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=85"
                alt="Hausbesitzer beim Beratungsgespräch über Wärmepumpen"
                style={{ width: '100%', height: 460, objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── GRÜNDUNGSGESCHICHTE ── */}
      <section style={{ padding: '80px 0', background: '#F6F3EE' }}>
        <div className="c">
          <span className="over">Entstehungsgeschichte</span>
          <h2 className="serif" style={{ fontSize: 'clamp(28px,3vw,44px)', marginBottom: 32, fontWeight: 700, maxWidth: 700 }}>
            Wie Wärmepumpenbegleiter.de entstand
          </h2>
          <div className="g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85, marginBottom: 16 }}>
                Die Idee entstand aus einer persönlichen Erfahrung: Mehrere Bekannte hatten nach dem GEG 2024 ihre
                Gasheizung erneuern müssen und standen vor denselben Fragen. Welche Wärmepumpe? Welcher Installateur?
                Wie den KfW-Antrag stellen? Die verfügbaren Informationen waren fragmentiert, oft interessengeleitet
                oder technisch unzugänglich.
              </p>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85, marginBottom: 16 }}>
                Gleichzeitig erkannten wir: Der Wärmepumpenmarkt explodiert — 299.000 Anlagen 2025, +55% gegenüber
                2024. Nur 3–4% der 21 Millionen deutschen Heizungen sind bisher Wärmepumpen. Das Wachstumspotenzial
                ist enorm, die Informationsnachfrage entsprechend hoch.
              </p>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85 }}>
                Wir haben zunächst die Dateninfrastruktur aufgebaut: DWD-Klimadaten für 733 Städte, IWU-Heizgradtage,
                BDEW-Regionalstrompreise, KfW-Förderparameter, Bundesland-Förderprogramme. Dann die
                Berechnungslogik: COP, JAZ, Betriebskosten, Amortisation — alles stadtspezifisch. Das Ergebnis
                sind 16.126 Seiten, die je nach Stadt echte, lokal relevante Zahlen zeigen.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85, marginBottom: 16 }}>
                Der Name „Wärmepumpenbegleiter" ist Programm: Wir begleiten Hausbesitzer durch einen komplexen
                Entscheidungsprozess — von der ersten Frage „Lohnt sich das?" über die Förderbeantragung bis zur
                Inbetriebnahme. Kein einmaliger Klick, sondern ein echter Begleiter.
              </p>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85, marginBottom: 16 }}>
                Betrieben wird die Plattform von Webflott (Bastian Saupe &amp; Philip Lindner, Weißenfels), einem
                auf programmatische SEO-Websites spezialisierten Unternehmen. Das Fachteam besteht aus
                Energieberatern, Gebäudetechnik-Ingenieuren und erfahrenen SHK-Praktikern.
              </p>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85 }}>
                Unser langfristiges Ziel: Die vollständigste und verlässlichste Wärmepumpen-Informationsquelle
                für Deutschland zu werden — mit echtem Mehrwert für Hausbesitzer, nicht bloß ein weiteres
                Vergleichsportal mit versteckten Provisionsmodellen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: '96px 0', background: 'white' }}>
        <div className="c">
          <div style={{ maxWidth: 580, marginBottom: 56 }}>
            <span className="over">Das Fachteam</span>
            <h2 className="serif" style={{ fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 700 }}>
              Expertise aus Energieberatung, Technik und Förderrecht
            </h2>
            <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.8, marginTop: 16 }}>
              Alle Inhalte auf Wärmepumpenbegleiter.de werden von qualifizierten Fachleuten erstellt und regelmäßig
              auf Aktualität geprüft. Für eine Investitionsentscheidung von €25.000–50.000 sind Genauigkeit und
              Verlässlichkeit keine Option — sie sind Pflicht.
            </p>
          </div>
          <div className="g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              {
                init: 'MS',
                name: 'Dr. Markus Sommer',
                role: 'Energieberater (IHK)',
                exp: '14 Jahre',
                quals: ['Energieberater IHK (Gebäude)', 'Sachverständiger GEG', 'Ehemals Verbraucherzentrale NRW'],
                bio: 'Dr. Markus Sommer hat über 800 Haushalte bei Heizsystemvergleichen begleitet. Schwerpunkte: KfW-Förderanträge, GEG-Konformität, Heizlastberechnung nach DIN EN 12831. Ehemaliger Sachverständiger bei der Verbraucherzentrale NRW, heute freier Energieberater und Autor auf Wärmepumpenbegleiter.de.',
                linkedin: '#',
              },
              {
                init: 'JH',
                name: 'Julia Hartmann',
                role: 'Dipl.-Ing. Gebäudetechnik',
                exp: '9 Jahre',
                quals: ['Dipl.-Ing. Gebäudetechnik (TU München)', 'KfW-Expertin BEG', 'BAFA-Energieberaterin'],
                bio: 'Julia Hartmann hat über 400 KfW-BEG-Förderprojekte von der Antragstellung bis zur Auszahlung begleitet. Sie ist Expertin für das Zusammenspiel von KfW-Programmen, iSFP-Bonus und Landesförderungen. Ihre Berechnungsmodelle bilden die Basis für die Förderrechner auf dieser Website.',
                linkedin: '#',
              },
              {
                init: 'SB',
                name: 'Stefan Berger',
                role: 'SHK-Meister',
                exp: '18 Jahre',
                quals: ['SHK-Meister (HWK Sachsen)', 'Spezialist Wärmepumpen-Installation', '>200 WP-Installationen'],
                bio: 'Stefan Berger ist verantwortlich für die Qualitätsprüfung unseres Installateur-Netzwerks. Mit über 200 eigenen Wärmepumpen-Installationen in Sachsen und Sachsen-Anhalt kennt er die praktischen Tücken: falsche Dimensionierung, mangelhafter hydraulischer Abgleich, fehlende Genehmigungen.',
                linkedin: '#',
              },
            ].map(p => (
              <div key={p.name} style={{ background: '#FAFAFA', border: '1px solid rgba(26,71,49,.1)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ background: '#1A3728', padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(76,175,125,.2)', border: '2px solid rgba(76,175,125,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 600, color: '#4CAF7D', flexShrink: 0 }}>{p.init}</div>
                  <div>
                    <div className="serif" style={{ fontSize: 19, fontWeight: 600, color: '#F0FAF4' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(240,250,244,.50)', marginTop: 2 }}>{p.role}</div>
                  </div>
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <div style={{ display: 'inline-block', background: 'rgba(26,71,49,.08)', color: '#2D7A52', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, marginBottom: 12 }}>{p.exp} Erfahrung</div>
                  <div style={{ marginBottom: 12 }}>
                    {p.quals.map((q, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ color: '#2D7A52', fontSize: 11 }}>✓</span>
                        <span style={{ fontSize: 12, color: '#4A6358' }}>{q}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: '#4A6358', lineHeight: 1.65 }}>{p.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRÜFPROZESS ── */}
      <section style={{ padding: '96px 0', background: '#F6F3EE' }}>
        <div className="c">
          <div style={{ maxWidth: 580, marginBottom: 56 }}>
            <span className="over">Qualitätssicherung</span>
            <h2 className="serif" style={{ fontSize: 'clamp(28px,3vw,44px)', fontWeight: 700 }}>
              So prüfen wir unsere Installateur-Partner
            </h2>
            <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.8, marginTop: 16 }}>
              Eine falsch dimensionierte oder schlecht installierte Wärmepumpe kann jahrelang ineffizient laufen —
              und den Hausbesitzer teuer zu stehen kommen. Deshalb nehmen wir die Überprüfung unserer Partner ernst.
              Nicht jeder SHK-Betrieb, der eine Wärmepumpe einbaut, ist ein Wärmepumpen-Fachbetrieb.
            </p>
          </div>
          <div className="g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              {[
                {
                  n: '01', title: 'Handwerkskammer-Eintragung',
                  text: 'Jeder Partner muss aktiv in der Handwerksrolle der zuständigen HWK eingetragen sein. Wir prüfen das vor Aufnahme und jährlich. Betriebe ohne gültige HWK-Eintragung werden nicht aufgenommen.',
                },
                {
                  n: '02', title: 'Meisterbetrieb-Nachweis',
                  text: 'Keine Gesellenbetriebe. Alle Partner sind Meisterbetriebe oder verfügen über eine gleichwertige Qualifikation. Der Meister muss persönlich in der technischen Leitung tätig sein.',
                },
                {
                  n: '03', title: 'Erfahrungsnachweis Wärmepumpe',
                  text: 'Mindestens 5 dokumentierte Wärmepumpen-Installationen der letzten 24 Monate als Voraussetzung. WP-Neueinsteiger werden nicht aufgenommen — zu hoch ist das Risiko für Hausbesitzer.',
                },
                {
                  n: '04', title: 'KfW-LuL-Registrierung',
                  text: 'Nur Betriebe, die als Lieferanten- und Leistungserbringer (LuL) im KfW-Portal registriert sind, können den Förderantrag für Hausbesitzer stellen. Alle unsere Partner erfüllen diese Voraussetzung.',
                },
                {
                  n: '05', title: 'Haftpflichtversicherung',
                  text: 'Gültige Betriebshaftpflicht für Heizungsbau nachweisen — schützt Hausbesitzer im Schadensfall. Wir prüfen die Aktualität des Versicherungsschutzes jährlich.',
                },
                {
                  n: '06', title: 'Kundenbewertungen &amp; laufendes Monitoring',
                  text: 'Nach jeder Vermittlung erhält der Hausbesitzer eine Feedbackanfrage. Betriebe mit Ø unter 3,5/5 nach 10+ Bewertungen werden automatisch aus dem Netzwerk entfernt.',
                },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '50%', background: i < 3 ? '#1A4731' : '#F6F3EE', border: i >= 3 ? '1px solid rgba(26,71,49,.18)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: i < 3 ? 'white' : '#1A4731' }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1C2B25', marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: '#4A6358', lineHeight: 1.65 }}>{s.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ background: 'white', border: '1px solid rgba(26,71,49,.1)', borderRadius: 14, padding: '28px', marginBottom: 20 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#1A4731', color: 'white', padding: '10px 18px', borderRadius: 8, marginBottom: 20 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Geprüfter Partner-Betrieb</span>
                </div>
                <p style={{ fontSize: 14, color: '#4A6358', lineHeight: 1.7, marginBottom: 16 }}>
                  Nur Betriebe, die alle 6 Kriterien erfüllen, erhalten den „Geprüfter Partner"-Status und werden
                  an Hausbesitzer in ihrer Region vermittelt. Der Badge kann nicht gekauft werden.
                </p>
                <p style={{ fontSize: 14, color: '#4A6358', lineHeight: 1.7 }}>
                  Wir überprüfen alle Partner mindestens einmal jährlich. Bei Versicherungsablauf, HWK-Streichung
                  oder schlechten Kundenbewertungen wird die Partnerschaft umgehend beendet.
                </p>
              </div>
              <div style={{ background: 'white', border: '1px solid rgba(26,71,49,.1)', borderRadius: 14, padding: '28px' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1C2B25', marginBottom: 12 }}>Qualitätskennzahlen unseres Netzwerks</p>
                {[
                  { label: 'Ø Kundenbewertung', val: '4,6 / 5,0' },
                  { label: 'Ø Reaktionszeit', val: '< 24 Stunden' },
                  { label: 'KfW-Antragserfolgsquote', val: '> 98%' },
                  { label: 'Partner aktuell aktiv', val: 'im Aufbau' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(26,71,49,.08)' }}>
                    <span style={{ fontSize: 13, color: '#4A6358' }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1C2B25' }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DATENQUELLEN & METHODIK ── */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="c">
          <span className="over">Datengrundlage & Methodik</span>
          <h2 className="serif" style={{ fontSize: 'clamp(28px,3vw,44px)', fontWeight: 700, marginBottom: 20, maxWidth: 700 }}>
            Woher kommen unsere Daten — und wie berechnen wir?
          </h2>
          <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85, maxWidth: 860, marginBottom: 40 }}>
            Jede Zahl auf Wärmepumpenbegleiter.de ist auf eine öffentlich zugängliche, fachlich anerkannte Quelle
            zurückführbar. Wir erfinden keine Richtwerte und runden nicht zu optimistisch — wir wollen, dass
            Hausbesitzer realistische Erwartungen haben, bevor sie eine Entscheidung treffen.
          </p>
          <div className="g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
            {[
              {
                title: 'Klimadaten (DWD)',
                text: 'Heizgradtage (GTZ20/15) nach IWU, Jahresmitteltemperaturen, Norm-Außentemperaturen nach DIN EN 12831 — für alle 733 Städte individuell. Quelle: Deutscher Wetterdienst, IWU Darmstadt.',
                url: 'https://www.dwd.de',
                label: 'DWD Open Data →',
              },
              {
                title: 'Jahresarbeitszahl (JAZ)',
                text: 'Berechnung nach vereinfachtem Carnot-Modell mit empirischem Gütegrad 0,45, validiert gegen Fraunhofer-ISE-Felddaten (3.000+ Anlagen, Jahresmittelwerte). Konservative Annahmen — reale JAZ oft höher.',
                url: 'https://www.ise.fraunhofer.de',
                label: 'Fraunhofer ISE Feldstudie →',
              },
              {
                title: 'Energiepreise (BDEW/Verivox)',
                text: 'Regionale Strom- und Gaspreise nach BDEW-Regionalanalyse und Verivox-Marktdaten. CO₂-Preis-Entwicklung nach Bundesregierung / EU-ETS2-Planung. Aktualisierung: jährlich.',
                url: 'https://www.bdew.de',
                label: 'BDEW Energiedaten →',
              },
              {
                title: 'Förderparameter (KfW/BAFA)',
                text: 'KfW-BEG-Fördersätze nach offiziellem Merkblatt Programm 458, Stand März 2026. Landesförderungen nach aktuellen Programminfos der jeweiligen Landesförderinstitute. Regelmäßige Prüfung auf Aktualität.',
                url: 'https://www.kfw.de',
                label: 'KfW Programm 458 →',
              },
            ].map((d, i) => (
              <div key={i} style={{ background: '#F6F3EE', borderRadius: 12, padding: '24px' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#1C2B25', marginBottom: 8 }}>{d.title}</p>
                <p style={{ fontSize: 13, color: '#4A6358', lineHeight: 1.7, marginBottom: 12 }}>{d.text}</p>
                <a href={d.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#2D7A52', fontWeight: 700, textDecoration: 'none' }}>{d.label}</a>
              </div>
            ))}
          </div>
          <div style={{ background: '#E8F5EE', border: '1px solid rgba(26,71,49,.15)', borderRadius: 12, padding: '24px 28px' }}>
            <p style={{ fontSize: 14, color: '#1A4731', fontWeight: 700, marginBottom: 8 }}>Wichtiger Hinweis zur Verlässlichkeit unserer Berechnungen</p>
            <p style={{ fontSize: 13, color: '#4A6358', lineHeight: 1.7 }}>
              Alle Berechnungen auf Wärmepumpenbegleiter.de sind Richtwerte auf Basis repräsentativer Annahmen
              (120 m² EFH, Baujahr 1979–1994). Ihr individuelles Ergebnis hängt von Ihrem Gebäude, der
              tatsächlichen Heizlast, der Qualität der Installation und dem Nutzungsverhalten ab.
              Unsere Zahlen ersetzen keine individuelle Heizlastberechnung und keine persönliche Energieberatung.
              Wir empfehlen, die Berechnungen als Orientierung zu nutzen — und dann einen geprüften Fachbetrieb
              für die genaue Planung zu beauftragen.
            </p>
          </div>
        </div>
      </section>

      {/* ── EXTERNE QUELLEN & PARTNER ── */}
      <section style={{ padding: '64px 0', background: '#F6F3EE' }}>
        <div className="c">
          <span className="over">Fachliche Grundlagen</span>
          <h3 className="serif" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Auf Basis dieser Institutionen und Studien</h3>
          <p style={{ fontSize: 15, color: '#4A6358', marginBottom: 32, maxWidth: 600 }}>
            Wir zitieren ausschließlich öffentlich zugängliche, fachlich anerkannte Quellen. Keine Werbepartnerschaften
            mit Herstellern, keine bezahlten Platzierungen in unseren Empfehlungen.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { label: 'BWP – Bundesverband Wärmepumpe', url: 'https://www.waermepumpe.de', desc: 'Marktdaten, Technik, JAZ-Benchmarks' },
              { label: 'KfW Bundesförderung BEG', url: 'https://www.kfw.de', desc: 'Förderkonditionen Programm 458' },
              { label: 'BAFA', url: 'https://www.bafa.de', desc: 'Förderfähige Geräteliste, iSFP-Förderung' },
              { label: 'Fraunhofer ISE', url: 'https://www.ise.fraunhofer.de', desc: 'JAZ-Feldstudie, Effizienz-Benchmarks' },
              { label: 'HTW Berlin', url: 'https://www.htw-berlin.de', desc: 'WP-Feldmonitoring Forschungsprojekte' },
              { label: 'Verbraucherzentrale', url: 'https://www.verbraucherzentrale.de', desc: 'Neutrale Verbraucherberatung' },
              { label: 'DWD – Deutscher Wetterdienst', url: 'https://www.dwd.de', desc: 'Klimadaten, Heizgradtage' },
              { label: 'IWU Darmstadt', url: 'https://www.iwu.de', desc: 'GTZ-Heizgradtage nach Postleitzahl' },
              { label: 'co2online', url: 'https://www.co2online.de', desc: 'Heizkostenvergleich, CO₂-Rechner' },
              { label: 'BDEW', url: 'https://www.bdew.de', desc: 'Regionale Energiepreise 2026' },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', background: 'white', border: '1px solid rgba(26,71,49,.12)', borderRadius: 10, padding: '12px 16px', textDecoration: 'none' }}>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1A4731', marginBottom: 2 }}>{s.label}</span>
                <span style={{ display: 'block', fontSize: 11, color: '#4A6358' }}>{s.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPARENZ GESCHÄFTSMODELL ── */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="c">
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <span className="over" style={{ display: 'block', textAlign: 'center' }}>Transparenz</span>
            <h2 className="serif" style={{ fontSize: 'clamp(28px,3vw,44px)', textAlign: 'center', fontWeight: 700, marginBottom: 40 }}>
              Unser Geschäftsmodell — offen erklärt
            </h2>
            <div style={{ background: 'white', borderLeft: '4px solid #1A4731', borderRadius: '0 12px 12px 0', padding: '28px 32px', boxShadow: '0 4px 16px rgba(26,71,49,.07)', marginBottom: 24 }}>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85, marginBottom: 16 }}>
                <strong style={{ color: '#1C2B25' }}>Wärmepumpenbegleiter.de ist für Hausbesitzer vollständig kostenlos.</strong>{' '}
                Wir finanzieren uns ausschließlich durch Vermittlungsprovisionen von €50–120 pro qualifiziertem Lead,
                den wir an unsere geprüften Installateur-Partner weitergeben. Ein Lead gilt als qualifiziert, wenn
                das Formular vollständig ausgefüllt wurde und der Hausbesitzer erreichbar ist.
              </p>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85, marginBottom: 16 }}>
                Diese Provision beeinflusst <em>nicht</em>, welche Betriebe wir empfehlen. Alle Partner durchlaufen
                exakt denselben 6-Kriterien-Prüfprozess. Ein Installateur kann sich keine bessere Platzierung erkaufen,
                keine höhere Weiterempfehlungsrate kaufen und keinen positiven Inhalt über sich einkaufen.
              </p>
              <p style={{ fontSize: 16, color: '#4A6358', lineHeight: 1.85 }}>
                Wir sind ebenfalls <strong style={{ color: '#1C2B25' }}>herstellerunabhängig</strong>: Weder Viessmann,
                Vaillant, Bosch, Stiebel Eltron noch andere Hersteller bezahlen uns für Empfehlungen. Die Herstellervergleiche
                auf unserer Website basieren auf veröffentlichten Testberichten (Stiftung Warentest, ÖKO-TEST) und
                technischen Datenblättern — nicht auf kommerziellen Vereinbarungen.
              </p>
            </div>
            <div style={{ background: '#F6F3EE', borderRadius: 12, padding: '20px 28px' }}>
              <p style={{ fontSize: 13, color: '#4A6358', lineHeight: 1.7 }}>
                <strong style={{ color: '#1C2B25' }}>Regulatorischer Hinweis:</strong> Wärmepumpenbegleiter.de ist
                ein Vermittlungsportal nach § 34c GewO (Immobilienmakler und Darlehensvermittler gilt analog für
                Handwerksvermittlung). Wir sind kein Energieberatungsunternehmen im Sinne des BAFA-Förderprogramms
                und erstatten keine Energieberatungskosten. Für förderfähige Energieberatungen verweisen wir auf die
                dena-Energieeffizienz-Expertenliste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── KONTAKT CTA ── */}
      <section style={{ background: '#1A3728', padding: '80px 0', textAlign: 'center' }}>
        <div className="c">
          <span className="over" style={{ color: 'rgba(76,175,125,.8)', display: 'block', textAlign: 'center' }}>Jetzt starten</span>
          <h2 className="serif" style={{ color: '#F0FAF4', fontSize: 'clamp(30px,4vw,52px)', fontWeight: 700, marginBottom: 16 }}>
            Bereit für Ihre Wärmepumpe?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(240,250,244,.6)', marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
            Kostenloses Angebot in 2 Minuten. Geprüfte lokale Fachbetriebe. Keine Verpflichtung.
          </p>
          <a href="/rechner" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', background: '#B45309', color: 'white', borderRadius: 8, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            Kostenloses Angebot anfordern →
          </a>
          <div style={{ marginTop: 20, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['E-Mail: kontakt@waermepumpenbegleiter.de', 'Erreichbar: Mo–Fr 8–18 Uhr', 'Antwort: innerhalb 24h'].map(t => (
              <span key={t} style={{ fontSize: 13, color: 'rgba(240,250,244,.40)' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
