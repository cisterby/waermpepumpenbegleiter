// components/programmatic/CityPageRouter.tsx
// Server Component — rendert Templates direkt serverseitig als HTML
// Templates sind Client Components (für Interaktivität), werden aber SSR'd
import type { City }    from '@/lib/city-utils';
import type { Keyword } from '@/lib/keywords';
import type { BerechnungsErgebnis, FoerderErgebnis } from '@/lib/calculations';

// Direct imports statt dynamic() — Server Component rendert direkt
import WaermepumpeTemplate       from './templates/WaermepumpeTemplate';
import WaermepumpeKostenTemplate from './templates/WaermepumpeKostenTemplate';
import InstallateurTemplate      from './templates/InstallateurTemplate';
import FoerderungTemplate        from './templates/FoerderungTemplate';
import LuftWasserTemplate        from './templates/LuftWasserTemplate';
import KaufenTemplate            from './templates/KaufenTemplate';
import AltbauTemplate            from './templates/AltbauTemplate';
import NachruestenTemplate       from './templates/NachruestenTemplate';
import HeizungTauschenTemplate   from './templates/HeizungTauschenTemplate';
import InstallationTemplate      from './templates/InstallationTemplate';
import WaermeplanungTemplate     from './templates/WaermeplanungTemplate';
import ErdwaermeTemplate         from './templates/ErdwaermeTemplate';
import AngebotTemplate           from './templates/AngebotTemplate';
import PreiseTemplate            from './templates/PreiseTemplate';
import AnbieterTemplate          from './templates/AnbieterTemplate';
import LuftwaermepumpeTemplate   from './templates/LuftwaermepumpeTemplate';
import NeubauTemplate            from './templates/NeubauTemplate';
import BeratungTemplate          from './templates/BeratungTemplate';
import FachbetriebTemplate       from './templates/FachbetriebTemplate';
import MontageTemplate           from './templates/MontageTemplate';
import VergleichTemplate         from './templates/VergleichTemplate';
import StromverbrauchTemplate    from './templates/StromverbrauchTemplate';

export interface CityPageRouterProps {
  city:      City;
  keyword:   Keyword;
  calc:      BerechnungsErgebnis;
  foerd:     FoerderErgebnis;
  jaz:       number;
  nearby:    City[];
  h1:        string;
}

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
