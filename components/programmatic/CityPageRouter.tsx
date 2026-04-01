// components/programmatic/CityPageRouter.tsx
// Dynamische Imports: jeder Client bekommt nur das Template für seine Route
// → kein Monobundle, bessere Core Web Vitals
'use client';
import dynamic from 'next/dynamic';
import type { City }    from '@/lib/city-utils';
import type { Keyword } from '@/lib/keywords';
import type { BerechnungsErgebnis, FoerderErgebnis } from '@/lib/calculations';

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

// Jedes Template wird lazy geladen — nur das aktive kommt in den Client-Bundle
const WaermepumpeTemplate       = dynamic(() => import('./templates/WaermepumpeTemplate'));
const WaermepumpeKostenTemplate = dynamic(() => import('./templates/WaermepumpeKostenTemplate'));
const InstallateurTemplate      = dynamic(() => import('./templates/InstallateurTemplate'));
const FoerderungTemplate        = dynamic(() => import('./templates/FoerderungTemplate'));
const LuftWasserTemplate        = dynamic(() => import('./templates/LuftWasserTemplate'));
const KaufenTemplate            = dynamic(() => import('./templates/KaufenTemplate'));
const AltbauTemplate            = dynamic(() => import('./templates/AltbauTemplate'));
const NachruestenTemplate       = dynamic(() => import('./templates/NachruestenTemplate'));
const HeizungTauschenTemplate   = dynamic(() => import('./templates/HeizungTauschenTemplate'));
const InstallationTemplate      = dynamic(() => import('./templates/InstallationTemplate'));
const WaermeplanungTemplate     = dynamic(() => import('./templates/WaermeplanungTemplate'));
const ErdwaermeTemplate         = dynamic(() => import('./templates/ErdwaermeTemplate'));
const AngebotTemplate           = dynamic(() => import('./templates/AngebotTemplate'));
const PreiseTemplate            = dynamic(() => import('./templates/PreiseTemplate'));
const AnbieterTemplate          = dynamic(() => import('./templates/AnbieterTemplate'));
const LuftwaermepumpeTemplate   = dynamic(() => import('./templates/LuftwaermepumpeTemplate'));
const NeubauTemplate            = dynamic(() => import('./templates/NeubauTemplate'));
const BeratungTemplate          = dynamic(() => import('./templates/BeratungTemplate'));
const FachbetriebTemplate       = dynamic(() => import('./templates/FachbetriebTemplate'));
const MontageTemplate           = dynamic(() => import('./templates/MontageTemplate'));
const VergleichTemplate         = dynamic(() => import('./templates/VergleichTemplate'));
const StromverbrauchTemplate    = dynamic(() => import('./templates/StromverbrauchTemplate'));

export default function CityPageRouter(props: CityPageRouterProps) {
  switch (props.keyword.slug) {
    case 'waermepumpe':               return <WaermepumpeTemplate       {...props} />;
    case 'waermepumpe-kosten':        return <WaermepumpeKostenTemplate {...props} />;
    case 'waermepumpe-installateur':  return <InstallateurTemplate      {...props} />;
    case 'waermepumpe-foerderung':    return <FoerderungTemplate        {...props} />;
    case 'luft-wasser-waermepumpe':   return <LuftWasserTemplate        {...props} />;
    case 'waermepumpe-kaufen':        return <KaufenTemplate            {...props} />;
    case 'waermepumpe-altbau':        return <AltbauTemplate            {...props} />;
    case 'waermepumpe-nachruesten':   return <NachruestenTemplate       {...props} />;
    case 'heizung-tauschen':          return <HeizungTauschenTemplate   {...props} />;
    case 'waermepumpe-installation':  return <InstallationTemplate      {...props} />;
    case 'kommunale-waermeplanung':   return <WaermeplanungTemplate     {...props} />;
    case 'erdwaermepumpe':            return <ErdwaermeTemplate         {...props} />;
    case 'waermepumpe-angebot':       return <AngebotTemplate           {...props} />;
    case 'waermepumpe-preise':        return <PreiseTemplate            {...props} />;
    case 'waermepumpe-anbieter':      return <AnbieterTemplate          {...props} />;
    case 'luftwaermepumpe':           return <LuftwaermepumpeTemplate   {...props} />;
    case 'waermepumpe-neubau':        return <NeubauTemplate            {...props} />;
    case 'waermepumpe-beratung':      return <BeratungTemplate          {...props} />;
    case 'waermepumpe-fachbetrieb':   return <FachbetriebTemplate       {...props} />;
    case 'waermepumpe-montage':       return <MontageTemplate           {...props} />;
    case 'waermepumpe-oder-gas':      return <VergleichTemplate         {...props} />;
    case 'waermepumpe-stromverbrauch': return <StromverbrauchTemplate   {...props} />;
    default:                           return <WaermepumpeTemplate      {...props} />;
  }
}
