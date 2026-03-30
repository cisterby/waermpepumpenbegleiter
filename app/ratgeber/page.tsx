// app/ratgeber/page.tsx — Ratgeber-Index + 5 vollständige Artikel inline
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar, User } from 'lucide-react';

// ── VOLLSTÄNDIGE ARTIKEL ───────────────────────────────────────────────────
const ARTICLES = [
  {
    slug: 'geg-2026-was-hausbesitzer-wissen-muessen',
    cat: 'GEG & Recht',
    title: 'GEG 2026: Was Hausbesitzer in Großstädten ab Juli wissen müssen',
    excerpt: 'Ab dem 30. Juni 2026 gilt die 65%-EE-Pflicht für Bestandsgebäude in Kommunen mit über 100.000 Einwohnern. Was das konkret bedeutet — und was jetzt zu tun ist.',
    time: '12 Min.',
    date: 'März 2026',
    author: 'Dr. Markus Sommer',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    big: true,
    content: `
Das Gebäudeenergiegesetz (GEG) 2024 hat die Spielregeln beim Heizungsersatz grundlegend verändert. Seit dem 1. Januar 2024 gilt: Wer eine neue Heizung einbaut, muss mindestens 65% erneuerbare Energie nutzen. Für Bestandsgebäude galt eine Übergangsfrist — die läuft jetzt aus.

**Was ab 30. Juni 2026 gilt**

In Kommunen mit mehr als 100.000 Einwohnern endet die Übergangsfrist. Das betrifft direkt die 80 größten deutschen Städte: Berlin, Hamburg, München, Köln, Frankfurt, Stuttgart, Düsseldorf und alle weiteren Großstädte. Wer in diesen Städten nach dem 30. Juni 2026 eine Heizung austauscht (weil sie kaputt ist oder freiwillig), muss die 65%-EE-Anforderung erfüllen.

Für alle anderen Kommunen gilt die Frist ab 30. Juni 2028 — also noch etwas Zeit, aber nicht viel.

**Was bedeutet das konkret?**

Eine reine Gasheizung als Ersatz? Nicht mehr möglich ohne 65% erneuerbaren Anteil. Praktisch bedeutet das: Wer seine Gasheizung nach der Frist ersetzt, braucht entweder eine Wärmepumpe, eine Hybridheizung mit WP-Anteil, einen Fernwärme-Anschluss (wenn verfügbar) oder Holzpellets/Biomasse.

Die Wärmepumpe ist dabei die einzige Lösung, die das GEG automatisch und vollständig erfüllt — ohne Einschränkungen oder Auflagen.

**Das neue Gebäudemodernisierungsgesetz (GMG) — was ändert sich?**

Die neue CDU/SPD-Koalition hat Eckpunkte für ein "Gebäudemodernisierungsgesetz" vorgelegt, das die 65%-Pflicht möglicherweise aufweicht. Stand März 2026 gilt das bestehende GEG weiter. Wärmepumpen bleiben die primär geförderte Technologie unabhängig vom Ausgang der Gesetzgebung.

**Was jetzt tun?**

Wenn Sie in einer Großstadt wohnen und eine Heizung haben, die älter als 15 Jahre ist: Jetzt ist der richtige Zeitpunkt zu handeln. Die Wartezeit bei guten Installateuren liegt bei 4–12 Wochen. Die KfW-Förderung (bis 70%) läuft parallel. Wer vor der Frist handelt, hat mehr Auswahl und bessere Konditionen.

**Quellen:** GEG 2024 (Bundesrecht), Kommunale Wärmeplanung WPG, Koalitionsvertrag 2025 CDU/SPD, KfW BEG Programm 458 Stand März 2026.
    `,
  },
  {
    slug: 'kfw-458-schritt-fuer-schritt',
    cat: 'Kosten & Förderung',
    title: 'KfW 458: Schritt für Schritt zur vollen Förderung',
    excerpt: 'Der Antrag klingt komplizierter als er ist — wenn man die Reihenfolge kennt. Alles was Sie wissen müssen um keine Förderung zu verschenken.',
    time: '8 Min.',
    date: 'Feb. 2026',
    author: 'Julia Hartmann',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    content: `
Die KfW-Bundesförderung für effiziente Gebäude (BEG) ist das attraktivste Förderprogramm für Wärmepumpen in Deutschland. Bis zu 70% Zuschuss, nicht rückzahlbar, direkt auf Ihr Konto. Der Haken: Wer die Reihenfolge nicht kennt, verliert die Förderung vollständig.

**Der wichtigste Grundsatz: Antrag VOR Baubeginn**

Klingt simpel, wird aber immer wieder falsch gemacht. Baubeginn bedeutet hier: der Moment an dem Sie einen Vertrag mit dem Installateur unterschreiben. Nicht der erste Spatenstich, nicht die Lieferung des Geräts. Der Vertrag.

Wer zuerst unterschreibt und dann den KfW-Antrag stellt, bekommt keine Förderung. Ausnahmslos. Keine Ausnahmen, keine Kulanzregelungen.

**Welche Boni gibt es?**

Die Grundförderung beträgt 30% für alle förderfähigen Kosten bis €30.000 (also max. €9.000). Darauf aufbauend:

- **Klima-Speed-Bonus (+20%)**: Für Eigennutzer, die eine fossile Heizung (Gas, Öl, Kohle) ersetzen. Das macht die meisten zu 50% Grundkombination.
- **Einkommensbonus (+30%)**: Für Haushalte mit unter €40.000 Nettoeinkommen im Jahr. Kumulierbar mit allem anderen — macht max. 70% möglich.
- **Kältemittelbonus (+5%)**: Für Wärmepumpen mit natürlichem Kältemittel (R290 Propan) oder Erdwärme/Grundwasser-WP. Lohnt sich: Viessmann Vitocal 250-A und Vaillant aroTHERM plus sind R290-Geräte.

**Die Schritte im Detail**

1. Fachbetrieb mit KfW-LuL-Registrierung finden (unser Service hilft)
2. KfW-Antrag im Online-Portal stellen (mit Betrieb zusammen)
3. KfW-Bestätigung abwarten (oft nur Tage)
4. Vertrag mit Betrieb unterschreiben
5. Installation durchführen lassen
6. Verwendungsnachweis einreichen (Rechnung + Bestätigung)
7. Auszahlung: 4–8 Wochen

**Was ist förderungsfähig?**

Gerät, Montage, hydraulischer Abgleich (Pflicht!), notwendige Elektroinstallation, Wärmespeicher. Nicht förderungsfähig: reine Modernisierungsmaßnahmen ohne Heizungstausch, Kosten über €30.000.

**Quelle:** KfW Bundesförderung für effiziente Gebäude (BEG), Merkblatt Programm 458, Stand März 2026. kfw.de/458.
    `,
  },
  {
    slug: 'luft-wasser-waermepumpe-ehrlich',
    cat: 'Technik',
    title: 'Luft-Wasser-Wärmepumpe: Vor- und Nachteile ehrlich erklärt',
    excerpt: '92% aller neu installierten Wärmepumpen in Deutschland sind Luft-Wasser-Geräte. Warum — und für wen sie wirklich nicht geeignet sind.',
    time: '10 Min.',
    date: 'Jan. 2026',
    author: 'Stefan Berger',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    content: `
92% aller 2025 in Deutschland verkauften Wärmepumpen waren Luft-Wasser-Geräte. Das ist kein Zufall — aber es bedeutet auch nicht, dass sie für jeden das Richtige sind. Eine ehrliche Analyse.

**Wie funktioniert eine Luft-Wasser-Wärmepumpe?**

Das Prinzip ist der umgekehrte Kühlschrank: Die Außeneinheit entzieht der Außenluft Wärme (auch bei -20°C ist noch Energie enthalten), verdichtet das Kältemittel und überträgt die Wärme auf das Heizwasser. Der Kompressor verbraucht dabei Strom.

Der entscheidende Unterschied zur Gasheizung: Aus 1 kWh Strom werden nicht 1 kWh Wärme, sondern 3–4,5 kWh Wärme. Das nennt sich JAZ (Jahresarbeitszahl) — die wichtigste Kennzahl beim Kauf.

**Was die JAZ wirklich bedeutet**

COP und JAZ sind nicht dasselbe. Der COP ist ein Momentanwert bei Prüfbedingungen (oft A7/W35 = 7°C Außentemperatur, 35°C Vorlauf). Die JAZ ist der Jahresdurchschnitt unter realen Bedingungen — sie ist deutlich niedriger.

In Deutschland erreichen Luft-Wasser-WP im Schnitt JAZ 3,2–4,0. In Norddeutschland eher 3,0–3,5, in Süddeutschland 3,6–4,2. Fraunhofer ISE misst in Feldstudien regelmäßig reale JAZ (Quelle: ise.fraunhofer.de).

**Vorteile**

- Keine Bohrung, keine Genehmigung (nur Aufstellgenehmigung)
- Für fast alle Häuser nachrüstbar
- KfW-gefördert (bis 70%)
- Montage in 1–3 Tagen
- Auch für Altbauten mit hydraulischem Abgleich geeignet

**Nachteile — ehrlich**

- Lauter als Sole-WP (45–55 dB auf 1 Meter)
- Bei sehr kalten Außentemperaturen (<-10°C) sinkt die Effizienz stark
- Keine natürliche Kühlfunktion (nur aktiv, mit zusätzlichem Aufwand)
- Nicht für jeden Aufstellort geeignet (Mindestabstand, Schallschutzauflagen)

**Für wen sie nicht geeignet ist**

Häuser mit extrem hohem Wärmebedarf (sehr schlechte Dämmung, sehr große Fläche) und Vorlauftemperaturen über 65°C dauerhaft — hier wird die WP unwirtschaftlich. Auch in sehr engen Bebauungen mit Lärm-Sensitivität der Nachbarn kann die Außeneinheit zum Problem werden.

**Quelle:** BWP Marktdaten 2025, Fraunhofer ISE Feldmonitor Wärmepumpen 2023, Stiftung Warentest WP-Test 2024.
    `,
  },
  {
    slug: 'waermepumpe-altbau-was-wichtig-ist',
    cat: 'Altbau',
    title: 'Wärmepumpe im Altbau: Was wirklich wichtig ist',
    excerpt: 'Vorlauftemperatur, Heizkörpergröße, hydraulischer Abgleich — die drei Faktoren die über Erfolg oder Misserfolg entscheiden.',
    time: '7 Min.',
    date: 'Jan. 2026',
    author: 'Dr. Markus Sommer',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    content: `
"Wärmepumpen taugen nicht für Altbauten" — dieser Mythos hält sich hartnäckig. Die Realität ist differenzierter: Die meisten Altbauten in Deutschland sind für Wärmepumpen geeignet, wenn die Planung stimmt. Was wirklich zählt.

**Die Vorlauftemperatur ist der Schlüssel**

Jede Heizung hat eine Vorlauftemperatur — die Temperatur des Heizwassers das in die Heizkörper geht. Gasheizungen laufen oft bei 70–80°C. Wärmepumpen arbeiten am effizientesten bei 35–45°C.

Die gute Nachricht: Moderne Hochtemperatur-Wärmepumpen (z.B. Viessmann Vitocal 252-A, Stiebel Eltron WPL) arbeiten bis 70°C Vorlauf — damit sind sie mit fast allen Bestandsheizkörpern kompatibel. Die schlechte Nachricht: Je höher die nötige Vorlauftemperatur, desto schlechter die JAZ.

**Der hydraulische Abgleich als Game-Changer**

Der hydraulische Abgleich ist die wichtigste Maßnahme vor dem WP-Einbau — und KfW-Pflicht. Er stellt sicher, dass das Heizwasser gleichmäßig durch alle Heizkörper fließt. Das senkt die nötige Vorlauftemperatur oft um 5–15°C.

Ein gut durchgeführter hydraulischer Abgleich (Kosten: €500–1.500) kann die JAZ von 2,8 auf 3,5 verbessern. Das ist erheblich — sowohl für die Wirtschaftlichkeit als auch für die KfW-Förderfähigkeit (min. JAZ 3,0).

**Sanierungsmaßnahmen die sich vorher lohnen**

Nicht immer nötig, aber manchmal sinnvoll:
- Dachdämmung: Senkt den Gesamtwärmebedarf erheblich
- Austausch unterdimensionierter Heizkörper in 1–2 Zimmern (nicht alle)
- Zusätzliche Dämmung der Kellerdecke

**Welche Altbauten sind problematisch?**

Häuser vor 1920 mit sehr schlechter Bausubstanz, kaum gedämmt, kleine Heizkörper — hier kann die WP unvirtschaftlich werden wenn keine Sanierungsmaßnahmen stattfinden. Eine Heizlastberechnung nach DIN EN 12831 klärt das im Vorfeld.

**Fazit**

Für geschätzte 75–80% aller deutschen Altbauten ist eine Wärmepumpe technisch und wirtschaftlich machbar. Der entscheidende erste Schritt: Eine Heizlastberechnung durch einen geprüften Fachbetrieb — kostenlos im Rahmen unseres Vermittlungsservices.

**Quellen:** BWP Marktdaten, Fraunhofer ISE Altbaustudie 2022, DIN EN 12831 Norm, Verbraucherzentrale NRW.
    `,
  },
  {
    slug: 'co2-preis-2026-gasheizer',
    cat: 'Kosten & Förderung',
    title: 'CO₂-Preis 2026: Was Gas-Heizer jetzt zahlen',
    excerpt: 'Der CO₂-Preis steigt jährlich. Was das für Ihre Gasrechnung bedeutet — und wann sich der Wechsel zur Wärmepumpe rechnet.',
    time: '5 Min.',
    date: 'Dez. 2025',
    author: 'Julia Hartmann',
    img: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1200&q=80',
    content: `
Seit 2021 gibt es in Deutschland einen nationalen CO₂-Preis auf fossile Brennstoffe. Er steigt planmäßig jedes Jahr — und er wird sich noch deutlich erhöhen. Was bedeutet das für Hausbesitzer mit Gasheizung?

**Wie der CO₂-Preis auf Ihre Gasrechnung wirkt**

Der CO₂-Preis wird auf den Brennstoff erhoben und vom Energieversorger an Kunden weitergegeben. Erdgas verursacht ca. 200 g CO₂ pro kWh. Bei 55 €/Tonne (2026) bedeutet das 1,1 ct/kWh CO₂-Aufschlag auf den Gaspreis.

Klingt wenig? Für ein typisches EFH mit 15.000 kWh Gasverbrauch/Jahr sind das: 15.000 × 0,011 = 165 €/Jahr CO₂-Abgabe allein. Und es wird mehr.

**Die Entwicklung bis 2030**

- 2024: 45 €/t CO₂
- 2025: 55 €/t CO₂
- 2026: 55–65 €/t CO₂ (geplant)
- 2027: EU-ETS2 startet — Handelspreis, voraussichtlich 80–120 €/t
- 2030: Prognosen: 100–150 €/t CO₂

Bei 100 €/t bedeutet das: +2 ct/kWh auf Gas. Bei einem Gasverbrauch von 15.000 kWh/Jahr sind das +300 €/Jahr CO₂-Abgabe — allein durch den Preisanstieg.

**Die Wärmepumpen-Rechnung**

Eine Wärmepumpe verbraucht Strom. Strom hat zwar auch einen CO₂-Preis eingepreist — aber der Strommix wird sauberer, und die JAZ macht Strom effizienter. Bei JAZ 3,5 braucht die WP für 15.000 kWh Wärme nur 4.286 kWh Strom. Die CO₂-Belastung sinkt um 60–75% gegenüber Gas.

**Fazit: Die Wirtschaftlichkeit kippt**

Wer heute noch 12 ct/kWh für Gas zahlt, zahlt 2030 schätzungsweise 15–16 ct/kWh — allein durch CO₂. Die Wärmepumpe wird im Vergleich jedes Jahr attraktiver. Wer jetzt wechselt, sichert sich außerdem noch die volle KfW-Förderung.

**Quellen:** Brennstoffemissionshandelsgesetz (BEHG), EU-ETS2 Richtlinie, Bundesregierung CO₂-Preis-Pfad 2023, BDEW Energiepreise 2026.
    `,
  },
];

const CATS = ['Alle', 'GEG & Recht', 'Kosten & Förderung', 'Technik', 'Altbau'];

function ArticleContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none">
      {content.trim().split('\n\n').map((block, i) => {
        if (block.startsWith('**') && block.endsWith('**') && !block.includes('\n')) {
          return <h3 key={i} className="font-heading font-bold text-wp-text text-lg mt-6 mb-2">{block.replace(/\*\*/g, '')}</h3>;
        }
        if (block.startsWith('- ')) {
          return (
            <ul key={i} className="space-y-1 mb-4 ml-4">
              {block.split('\n').map((item, j) => (
                <li key={j} className="text-wp-text2 text-sm leading-relaxed list-disc">
                  {item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
                </li>
              ))}
            </ul>
          );
        }
        // Bold inline
        const parts = block.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i} className="text-wp-text2 text-sm leading-relaxed mb-4">
            {parts.map((part, j) =>
              part.startsWith('**') ? <strong key={j} className="text-wp-text font-semibold">{part.replace(/\*\*/g, '')}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function Ratgeber() {
  const [activeCat, setActiveCat] = useState('Alle');
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const filtered = activeCat === 'Alle' ? ARTICLES : ARTICLES.filter(a => a.cat === activeCat);
  const [hero, ...rest] = filtered;

  if (openArticle) {
    const article = ARTICLES.find(a => a.slug === openArticle)!;
    return (
      <div className="min-h-screen bg-wp-bg font-sans">
        <div className="relative h-80 overflow-hidden">
          <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-wp-dark/70" />
          <div className="absolute inset-0 flex items-end px-6 pb-10">
            <div className="max-w-3xl">
              <span className="inline-block bg-wp-amber text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{article.cat}</span>
              <h1 className="font-heading font-bold text-white text-3xl leading-tight">{article.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-white/50 text-xs">
                <span className="flex items-center gap-1"><User size={11} /> {article.author}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> {article.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {article.time} Lesezeit</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <button onClick={() => setOpenArticle(null)}
            className="flex items-center gap-2 text-wp-green text-sm font-semibold hover:underline mb-8">
            ← Zurück zum Ratgeber
          </button>
          <ArticleContent content={article.content} />
          <div className="mt-10 bg-wp-greenlt border border-wp-green3/25 rounded-2xl p-6">
            <h3 className="font-heading font-bold text-wp-text text-lg mb-2">Jetzt kostenlos anfragen</h3>
            <p className="text-wp-text2 text-sm mb-4">Geprüfte lokale Fachbetriebe · KfW-Antrag inklusive · Kostenlos</p>
            <Link href="/kontakt"
              className="inline-flex items-center gap-2 px-5 py-3 bg-wp-green text-white font-heading font-bold text-sm rounded-xl hover:bg-wp-green2 transition-all">
              Anfrage starten <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      {/* HERO */}
      <div className="bg-wp-dark pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-wp-green3 mb-4">Ratgeber</span>
          <h1 className="font-heading font-extrabold text-white mb-4" style={{ fontSize: 'clamp(30px,4.5vw,54px)' }}>
            Wärmepumpen-Ratgeber 2026
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            Fundierte Artikel zu Technik, Förderung, GEG und Kosten — geschrieben von Energieberatern und SHK-Meistern.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATS.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCat === cat ? 'bg-wp-green text-white' : 'bg-white border border-wp-border text-wp-text2 hover:border-wp-green hover:text-wp-green'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Hero article */}
        {hero && (
          <button onClick={() => setOpenArticle(hero.slug)}
            className="w-full bg-white rounded-2xl border border-wp-border shadow-wp-sm overflow-hidden mb-6 group text-left hover:-translate-y-0.5 transition-all">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img src={hero.img} alt={hero.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-wp-amber text-white text-xs font-bold px-3 py-1.5 rounded-full">{hero.cat}</span>
                </div>
              </div>
              <div className="p-7 flex flex-col justify-center">
                <h2 className="font-heading font-bold text-wp-text text-2xl mb-3 leading-tight group-hover:text-wp-green transition-colors">
                  {hero.title}
                </h2>
                <p className="text-wp-text2 text-sm leading-relaxed mb-5">{hero.excerpt}</p>
                <div className="flex items-center gap-4 text-wp-text3 text-xs mb-5">
                  <span className="flex items-center gap-1"><User size={11} /> {hero.author}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {hero.time}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {hero.date}</span>
                </div>
                <span className="inline-flex items-center gap-2 text-wp-green font-semibold text-sm">
                  Artikel lesen <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </button>
        )}

        {/* Article grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(article => (
            <button key={article.slug} onClick={() => setOpenArticle(article.slug)}
              className="bg-white rounded-2xl border border-wp-border shadow-wp-sm overflow-hidden text-left group hover:-translate-y-0.5 transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 text-wp-text text-xs font-bold px-2.5 py-1 rounded-full">{article.cat}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-wp-text text-base leading-tight mb-2 group-hover:text-wp-green transition-colors">
                  {article.title}
                </h3>
                <p className="text-wp-text3 text-xs leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-wp-text3 text-xs">
                  <span className="flex items-center gap-1"><Clock size={10} /> {article.time}</span>
                  <span className="text-wp-green font-semibold flex items-center gap-1">Lesen <ArrowRight size={11} /></span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-12 bg-wp-dark rounded-2xl p-8 text-center">
          <h3 className="font-heading font-bold text-white text-xl mb-2">Bereit — Ihr WP-Projekt starten?</h3>
          <p className="text-white/50 text-sm mb-5">Kostenlose Anfrage · HWK-geprüfte Betriebe · KfW-Antrag inklusive</p>
          <Link href="/kontakt"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-wp-amber text-white font-heading font-bold rounded-xl hover:bg-amber-700 transition-all">
            Kostenlos anfragen <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
