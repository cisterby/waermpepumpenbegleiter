// components/programmatic/CityPageRouter.tsx
'use client';

import type { City }              from '@/lib/cities';
import type { Keyword }           from '@/lib/keywords';
import type { BerechnungsErgebnis, FoerderErgebnis } from '@/lib/calculations';

// Tier 1 — spezialisierte Templates
import WaermepumpeTemplate       from './templates/WaermepumpeTemplate';
// import WaermepumpeKostenTemplate from './templates/WaermepumpeKostenTemplate';
// import InstallateurTemplate      from './templates/InstallateurTemplate';
// import FoerderungTemplate        from './templates/FoerderungTemplate';
// import LuftWasserTemplate        from './templates/LuftWasserTemplate';

// Tier 2–4 Fallback bis spezialisierte Templates fertig
import GenericTemplate           from './templates/GenericTemplate';

export interface CityPageRouterProps {
  city:      City;
  keyword:   Keyword;
  calc:      BerechnungsErgebnis;
  foerd:     FoerderErgebnis;
  jaz:       number;
  nearby:    City[];
  h1:        string;
  allCities: City[];
}

export default function CityPageRouter(props: CityPageRouterProps) {
  const { keyword } = props;

  // ── REGEL: Slug-Checks immer vor Category-Checks ─────────────────────────

  // ── Tier 1: Haupt-Keywords ────────────────────────────────────────────────
  if (keyword.slug === 'waermepumpe')
    return <WaermepumpeTemplate {...props} />;

  // Tier 1 — folgen nach und nach:
  // if (keyword.slug === 'waermepumpe-kosten')
  //   return <WaermepumpeKostenTemplate {...props} />;
  // if (keyword.slug === 'waermepumpe-installateur')
  //   return <InstallateurTemplate {...props} />;
  // if (keyword.slug === 'waermepumpe-foerderung')
  //   return <FoerderungTemplate {...props} />;
  // if (keyword.slug === 'luft-wasser-waermepumpe')
  //   return <LuftWasserTemplate {...props} />;

  // ── Tier 2–4: GenericTemplate als Fallback ────────────────────────────────
  return <GenericTemplate {...props} />;
}
