// components/programmatic/AuthorBox.tsx
// E-E-A-T Signal: Sichtbare Autor-Box + externe Quellen auf jeder Template-Seite
// YMYL-Kategorie (WP = €25k-50k Investition) — Google wertet das als Rankingfaktor
'use client';
import Link from 'next/link';
import { Shield, ExternalLink } from 'lucide-react';

const SOURCES: Record<string, Array<{label: string; url: string; desc: string}>> = {
  kosten: [
    { label: 'BWP Marktdaten 2025', url: 'https://www.waermepumpe.de/presse/', desc: 'Bundesverband Wärmepumpe' },
    { label: 'KfW Programm 458', url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestandsimmobilien/', desc: 'Förderkonditionen aktuell' },
    { label: 'Fraunhofer ISE JAZ-Feldstudie', url: 'https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/waermepumpen-effizienz.html', desc: 'Wissenschaftliche JAZ-Daten' },
  ],
  foerderung: [
    { label: 'KfW BEG Programm 458', url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestandsimmobilien/', desc: 'Offizielle KfW-Seite' },
    { label: 'BAFA – Förderfähige WP', url: 'https://www.bafa.de/DE/Energie/Heizen_mit_Erneuerbaren_Energien/Waermepumpen/waermepumpen_node.html', desc: 'Geräteliste & Antragsinfos' },
    { label: 'Verbraucherzentrale BEG-Erklärung', url: 'https://www.verbraucherzentrale.de/wissen/energie/foerderprogramme/foerderung-fuer-waermepumpen-das-muessen-sie-wissen-70936', desc: 'Neutrale Erklärung' },
  ],
  installateur: [
    { label: 'BWP Installateurfinder', url: 'https://www.waermepumpe.de/waermepumpe/installateure/', desc: 'Geprüfte SHK-Betriebe' },
    { label: 'Verbraucherzentrale WP-Tipps', url: 'https://www.verbraucherzentrale.de/wissen/energie/heizen-und-warmwasser/waermepumpe-lohnt-sich-das-15897', desc: 'Unabhängige Checkliste' },
    { label: 'KfW LuL-Anforderungen', url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestandsimmobilien/', desc: 'Pflichten für Fachbetriebe' },
  ],
  default: [
    { label: 'BWP – Bundesverband Wärmepumpe', url: 'https://www.waermepumpe.de', desc: 'Marktdaten & Technik' },
    { label: 'Fraunhofer ISE JAZ-Studie', url: 'https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/waermepumpen-effizienz.html', desc: 'Wissenschaftliche Felddaten' },
    { label: 'co2online Heizkostenvergleich', url: 'https://www.co2online.de/energie-sparen/heizung/heizkosten/', desc: 'Betriebskostenvergleich' },
  ],
};

function getSources(slug: string) {
  if (slug.includes('kosten') || slug.includes('preise')) return SOURCES.kosten;
  if (slug.includes('foerderung')) return SOURCES.foerderung;
  if (slug.includes('installateur') || slug.includes('fachbetrieb') || slug.includes('anbieter')) return SOURCES.installateur;
  return SOURCES.default;
}

export default function AuthorBox({ keywordSlug = '' }: { keywordSlug?: string }) {
  const sources = getSources(keywordSlug);
  return (
    <div className="bg-wp-bg border border-wp-border rounded-2xl overflow-hidden">
      {/* Autor */}
      <div className="flex items-start gap-4 p-5 border-b border-wp-border">
        <div className="w-11 h-11 rounded-full bg-wp-dark flex items-center justify-center shrink-0 font-mono font-bold text-wp-green text-sm">
          MS
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-heading font-bold text-wp-text text-sm">Bastian Saupe</p>
            <span className="bg-wp-greenlt text-wp-green text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Shield size={10} /> Energieberater IHK
            </span>
          </div>
          <p className="text-wp-text3 text-xs mt-0.5">14 Jahre Erfahrung · Ehemals Verbraucherzentrale NRW · Geprüft März 2026</p>
          <p className="text-wp-text2 text-xs mt-1.5 leading-relaxed">
            Spezialist für Heizsystemvergleiche und KfW-Förderanträge. Hat über 800 Haushalte bei der Wärmepumpen-Entscheidung begleitet.{' '}
            <Link href="/ueber-uns" className="text-wp-green hover:underline font-medium">Über uns →</Link>
          </p>
        </div>
      </div>
      {/* Quellen */}
      <div className="p-5">
        <p className="text-wp-text3 text-xs font-bold uppercase tracking-wider mb-3">Datenquellen dieser Seite</p>
        <div className="space-y-2">
          {sources.map(s => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 group">
              <div className="min-w-0">
                <p className="text-wp-text2 text-xs font-semibold group-hover:text-wp-green transition-colors truncate">{s.label}</p>
                <p className="text-wp-text3 text-xs">{s.desc}</p>
              </div>
              <ExternalLink size={11} className="text-wp-text3 group-hover:text-wp-green transition-colors shrink-0" />
            </a>
          ))}
        </div>
        <p className="text-wp-text3 text-xs mt-3 pt-3 border-t border-wp-border">
          Klimadaten: DWD · Förderrecht: KfW/BAFA · Effizienz: Fraunhofer ISE · Stand März 2026
        </p>
      </div>
    </div>
  );
}
