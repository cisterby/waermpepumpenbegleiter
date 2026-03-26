const WAERMEBEDARF: Record<string, number> = {
  'vor_1978': 215,
  '1979_1994': 165,
  '1995_2009': 101,
  '2010_plus': 72,
};

const PREISE = {
  strom_wp: 0.27,
  erdgas: 0.12,
  heizoel: 0.11,
  nachtspeicher: 0.32,
};

const HEIZUNG_WIRKUNGSGRAD: Record<string, number> = {
  erdgas: 0.92,
  heizoel: 0.90,
  nachtspeicher: 0.98,
};

export type HeizungsTyp = 'erdgas' | 'heizoel' | 'nachtspeicher';
export type BaujahrTyp = 'vor_1978' | '1979_1994' | '1995_2009' | '2010_plus';

export function calcBetriebskosten(
  flaeche: number,
  baujahr: string,
  heizung: HeizungsTyp
) {
  const kennwert = WAERMEBEDARF[baujahr] || 160;
  const bedarf = flaeche * (kennwert + 12.5);
  const jaz = 3.5;

  const altKosten = Math.round((bedarf / HEIZUNG_WIRKUNGSGRAD[heizung]) * PREISE[heizung]);
  const wpKosten = Math.round((bedarf / jaz) * PREISE.strom_wp);
  const ersparnis = altKosten - wpKosten;

  const investition = 25000;
  const foerderung = investition * 0.55;
  const netto = investition - foerderung;
  const amortisation = Math.round((netto / (ersparnis + 200)) * 10) / 10;

  return { altKosten, wpKosten, ersparnis, amortisation };
}

export function calcFoerderung(
  eigennutzung: boolean,
  fossilErsatz: boolean,
  niedrigEinkommen: boolean,
  natuerlichesKaeltemittel: boolean
) {
  let satz = 30;
  if (fossilErsatz) satz += 20;
  if (niedrigEinkommen) satz += 30;
  if (natuerlichesKaeltemittel) satz += 5;

  const maxSatz = 70;
  const effektivSatz = Math.min(satz, maxSatz);
  const bemessungsgrundlage = 30000;
  const zuschuss = Math.round(bemessungsgrundlage * (effektivSatz / 100));

  return {
    grundfoerderung: 30,
    klimaBonus: fossilErsatz ? 20 : 0,
    einkommensBonus: niedrigEinkommen ? 30 : 0,
    kaeltemittelBonus: natuerlichesKaeltemittel ? 5 : 0,
    gesamtSatz: effektivSatz,
    zuschuss,
    eigenanteil: bemessungsgrundlage - zuschuss,
  };
}
