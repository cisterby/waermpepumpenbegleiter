// app/[keywordSlug]/[bundeslandSlug]/page.tsx
// 16 Bundesland-Hub-Seiten pro Keyword = 352 Hub-Seiten gesamt
// Zweck: Internes Linking, Bundesland-spezifische Förderinfo, GSC-Coverage

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { KEYWORDS, getKeywordBySlug } from '@/lib/keywords';
import citiesData from '@/lib/cities.json';
import type { City } from '@/lib/city-utils';

const BUNDESLAENDER: Record<string, { name: string; slug: string; foerderung: string | null; foerderungBetrag: string | null; foerderungUrl: string | null }> = {
  'berlin':                  { name: 'Berlin',                  slug: 'berlin',                  foerderung: 'Effiziente Gebäude PLUS', foerderungBetrag: 'Aktuell ausgesetzt', foerderungUrl: 'https://www.ibb.de' },
  'hamburg':                 { name: 'Hamburg',                  slug: 'hamburg',                  foerderung: 'IFB Erneuerbare Wärme',    foerderungBetrag: 'Luft-WP: €90/kW (min. €3.500)', foerderungUrl: 'https://www.ifbhh.de' },
  'bayern':                  { name: 'Bayern',                   slug: 'bayern',                   foerderung: null,                        foerderungBetrag: '10.000-Häuser-Programm eingestellt', foerderungUrl: null },
  'nordrhein-westfalen':     { name: 'Nordrhein-Westfalen',      slug: 'nordrhein-westfalen',      foerderung: 'progres.nrw',              foerderungBetrag: 'Erdwärme: €50/m Bohrung', foerderungUrl: 'https://www.progres.nrw.de' },
  'baden-wuerttemberg':      { name: 'Baden-Württemberg',        slug: 'baden-wuerttemberg',       foerderung: 'L-Bank Kombi-Darlehen',    foerderungBetrag: 'Zinsverbilligung bis €200.000', foerderungUrl: 'https://www.l-bank.de' },
  'niedersachsen':           { name: 'Niedersachsen',            slug: 'niedersachsen',            foerderung: 'Quartiersprogramm NBank',   foerderungBetrag: 'bis €7.250 WP + €2.500 Messung', foerderungUrl: 'https://www.nbank.de' },
  'hessen':                  { name: 'Hessen',                   slug: 'hessen',                   foerderung: 'Klimaschutzprogramm Hessen', foerderungBetrag: 'Beratungsförderung', foerderungUrl: 'https://www.energieland.hessen.de' },
  'rheinland-pfalz':         { name: 'Rheinland-Pfalz',         slug: 'rheinland-pfalz',          foerderung: 'ISB Energieeffizienzprogramm', foerderungBetrag: 'Ergänzungskredit', foerderungUrl: 'https://www.isb.rlp.de' },
  'sachsen':                 { name: 'Sachsen',                  slug: 'sachsen',                  foerderung: 'SAB Klimaschutzprogramm',   foerderungBetrag: 'Zuschuss bis €5.000', foerderungUrl: 'https://www.sab.de' },
  'thueringen':              { name: 'Thüringen',                slug: 'thueringen',               foerderung: 'Thüringer Aufbaubank',      foerderungBetrag: 'Zinsgünstige Darlehen', foerderungUrl: 'https://www.aufbaubank.de' },
  'sachsen-anhalt':          { name: 'Sachsen-Anhalt',           slug: 'sachsen-anhalt',           foerderung: 'IB Sachsen-Anhalt',         foerderungBetrag: 'Ergänzungsfinanzierung', foerderungUrl: 'https://www.ib-sachsen-anhalt.de' },
  'mecklenburg-vorpommern':  { name: 'Mecklenburg-Vorpommern',   slug: 'mecklenburg-vorpommern',   foerderung: 'Landesförderinstitut MV',   foerderungBetrag: 'Energiesparförderung', foerderungUrl: 'https://www.lfi-mv.de' },
  'brandon':                 { name: 'Brandenburg',              slug: 'brandon',                  foerderung: 'ILB Brandenburg',           foerderungBetrag: 'RENplus Programm', foerderungUrl: 'https://www.ilb.de' },
  'schleswig-holstein':      { name: 'Schleswig-Holstein',       slug: 'schleswig-holstein',       foerderung: 'IB.SH Energieeffizienz',   foerderungBetrag: 'Ergänzungsförderung', foerderungUrl: 'https://www.ib-sh.de' },
  'saarland':                { name: 'Saarland',                 slug: 'saarland',                 foerderung: 'SIKB Saarland',             foerderungBetrag: 'Zinsgünstige Darlehen', foerderungUrl: 'https://www.sikb.de' },
  'bremen':                  { name: 'Bremen',                   slug: 'bremen',                   foerderung: 'Bremer Aufbaubank BAB',     foerderungBetrag: 'Klimaförderung', foerderungUrl: 'https://www.bab-bremen.de' },
};

interface Props {
  params: { keywordSlug: string; bundeslandSlug: string };
}

export async function generateStaticParams() {
  return KEYWORDS.flatMap(kw =>
    Object.keys(BUNDESLAENDER).map(bl => ({
      keywordSlug: kw.slug,
      bundeslandSlug: bl,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const keyword = getKeywordBySlug(params.keywordSlug);
  const bl = BUNDESLAENDER[params.bundeslandSlug];
  if (!keyword || !bl) return {};

  const kw = keyword.keyword.replace('[Stadt]', '').trim();
  const title = `${kw} ${bl.name} 2026 — Alle ${bl.name}-Städte | Wärmepumpenbegleiter`;
  const desc = `${kw} in ${bl.name}: Alle Städte, ${bl.foerderung ? bl.foerderung + ' Landesförderung' : 'KfW-Förderung bis 70%'}, geprüfte Fachbetriebe. Kostenlos vergleichen.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `https://waermepumpenbegleiter.de/${keyword.slug}/${params.bundeslandSlug}` },
    robots: { index: true, follow: true },
  };
}

export default function BundeslandPage({ params }: Props) {
  const keyword = getKeywordBySlug(params.keywordSlug);
  const bl = BUNDESLAENDER[params.bundeslandSlug];
  if (!keyword || !bl) notFound();

  const cities = (citiesData as City[]).filter(c => c.bundeslandSlug === params.bundeslandSlug);
  const kw = keyword.keyword.replace('[Stadt]', '').trim();

  const topCities = [...cities].sort((a, b) => b.einwohner - a.einwohner);

  return (
    <div className="min-h-screen bg-wp-bg font-sans">
      {/* HERO */}
      <div className="bg-wp-dark py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-5 text-white/40 flex-wrap">
            <Link href="/" className="hover:text-white/70 transition-colors">Startseite</Link>
            <span>›</span>
            <Link href={`/${keyword.slug}`} className="hover:text-white/70 transition-colors">{kw}</Link>
            <span>›</span>
            <span className="text-white/80">{bl.name}</span>
          </nav>
          <h1 className="font-heading font-extrabold text-white mb-3" style={{ fontSize: 'clamp(26px,3.5vw,46px)' }}>
            {kw} {bl.name} 2026 — {cities.length} Städte
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl mb-6">
            Alle {cities.length} {bl.name}-Städte mit stadtspezifischen Preisen, JAZ-Berechnungen und{' '}
            {bl.foerderung ? `${bl.foerderung} Landesförderung` : 'KfW-Bundesförderung bis 70%'}.
            Geprüfte Fachbetriebe kostenlos vergleichen.
          </p>
          {/* Bundesland-Förderung */}
          {bl.foerderung && (
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-3">
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">{bl.name}-Förderung</p>
                <p className="text-white font-semibold text-sm">{bl.foerderung}</p>
                <p className="text-wp-amber text-xs">{bl.foerderungBetrag}</p>
              </div>
              {bl.foerderungUrl && (
                <a href={bl.foerderungUrl} target="_blank" rel="noopener noreferrer"
                  className="text-wp-green text-xs hover:underline shrink-0">
                  Mehr Infos →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Alle Städte */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-wp-text text-xl">
            {kw} — Alle {bl.name}-Städte
          </h2>
          <span className="text-wp-text3 text-sm">{cities.length} Städte</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-10">
          {topCities.map(city => (
            <Link key={city.slug} href={`/${keyword.slug}/${city.slug}`}
              className="group flex items-center gap-2 bg-white rounded-xl p-3 border border-wp-border hover:border-wp-green hover:shadow-wp-sm transition-all">
              <MapPin size={12} className="text-wp-green shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-wp-text text-xs group-hover:text-wp-green transition-colors truncate">{city.name}</p>
                <p className="text-wp-text3 text-xs">{(city.einwohner/1000).toFixed(0)}k EW</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Cross-Links andere Bundesländer */}
        <div className="bg-white rounded-2xl p-5 border border-wp-border shadow-wp-sm mb-8">
          <h3 className="font-heading font-semibold text-wp-text text-base mb-4">Andere Bundesländer</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(BUNDESLAENDER)
              .filter(([slug]) => slug !== params.bundeslandSlug)
              .map(([slug, info]) => (
                <Link key={slug} href={`/${keyword.slug}/${slug}`}
                  className="px-3 py-1.5 bg-wp-bg border border-wp-border rounded-lg text-sm text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
                  {info.name}
                </Link>
              ))}
          </div>
        </div>

        {/* Back to pillar */}
        <Link href={`/${keyword.slug}`}
          className="inline-flex items-center gap-2 text-wp-green font-semibold text-sm hover:underline">
          ← Alle Städte: {kw}
        </Link>
      </div>
    </div>
  );
}
