// components/programmatic/DataSourceBox.tsx
// E-E-A-T für Vermittlungsportale: Datenquellen + Aktualität + Transparenz
// Kein Fake-Experte — ehrliches Trust-Signal wie CHECK24 / Verivox
'use client';
import { ExternalLink, RefreshCw, Shield } from 'lucide-react';

// Keyword-spezifische Quellen
const SOURCES: Record<string, Array<{ label: string; url: string; org: string }>> = {
  kosten: [
    { label: 'Marktbericht 2025',        url: 'https://www.waermepumpe.de/presse/pressemitteilungen/', org: 'BWP' },
    { label: 'KfW BEG Programm 458',     url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestandsimmobilien/', org: 'KfW' },
    { label: 'JAZ-Feldtest 2024',        url: 'https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/waermepumpen-effizienz.html', org: 'Fraunhofer ISE' },
    { label: 'Heizkostenvergleich 2026', url: 'https://www.co2online.de/energie-sparen/heizung/heizkosten/', org: 'co2online' },
  ],
  foerderung: [
    { label: 'BEG Programm 458 Details', url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestandsimmobilien/', org: 'KfW' },
    { label: 'Förderfähige Geräteliste', url: 'https://www.bafa.de/DE/Energie/Heizen_mit_Erneuerbaren_Energien/Waermepumpen/', org: 'BAFA' },
    { label: 'Förderübersicht Hausbesitzer', url: 'https://www.verbraucherzentrale.de/wissen/energie/foerderprogramme/foerderung-fuer-waermepumpen-das-muessen-sie-wissen-70936', org: 'Verbraucherzentrale' },
  ],
  default: [
    { label: 'Wärmepumpen-Marktdaten',   url: 'https://www.waermepumpe.de/presse/pressemitteilungen/', org: 'BWP' },
    { label: 'JAZ-Feldtest Deutschland', url: 'https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/waermepumpen-effizienz.html', org: 'Fraunhofer ISE' },
    { label: 'GEG & Förderung 2026',     url: 'https://www.verbraucherzentrale.de/wissen/energie/heizen-und-warmwasser/waermepumpe-lohnt-sich-das-15897', org: 'Verbraucherzentrale' },
    { label: 'Klimadaten Deutschland',   url: 'https://www.dwd.de/DE/klimaumwelt/klimadaten/klimadaten_node.html', org: 'DWD' },
  ],
};

function getSources(slug: string) {
  if (slug.includes('kosten') || slug.includes('preise') || slug.includes('stromverbrauch')) return SOURCES.kosten;
  if (slug.includes('foerderung')) return SOURCES.foerderung;
  return SOURCES.default;
}

interface Props {
  keywordSlug?: string;
  cityName?: string;
  className?: string;
}

export default function DataSourceBox({ keywordSlug = '', cityName = '', className = '' }: Props) {
  const sources = getSources(keywordSlug);

  return (
    <div className={`bg-wp-bg border border-wp-border rounded-xl p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-wp-green shrink-0" />
          <p className="font-heading font-semibold text-wp-text text-sm">
            Redaktioneller Hinweis
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-wp-text3 text-xs">
          <RefreshCw size={11} />
          <span>März 2026</span>
        </div>
      </div>

      {/* Hinweis-Text */}
      <p className="text-wp-text2 text-xs leading-relaxed mb-4">
        Die Berechnungen{cityName ? ` für ${cityName}` : ''} basieren auf verifizierten Klimadaten (DWD), 
        aktuellen KfW-Konditionen (Stand März 2026), BWP-Feldtestdaten zur Jahresarbeitszahl 
        und BDEW-Energiepreisen. Wir sind ein unabhängiges Vermittlungsportal — 
        wir erhalten keine Provision von Geräteherstellern.{' '}
        <a href="/ueber-uns" className="text-wp-green hover:underline font-medium">
          Mehr über uns →
        </a>
      </p>

      {/* Quellen-Links */}
      <div className="flex flex-wrap gap-2">
        {sources.map((src, i) => (
          <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-wp-border rounded-lg text-xs text-wp-text2 hover:text-wp-green hover:border-wp-green transition-colors">
            <span className="font-semibold text-wp-green text-xs">{src.org}</span>
            <span className="text-wp-text3">·</span>
            {src.label}
            <ExternalLink size={10} className="text-wp-text3 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
