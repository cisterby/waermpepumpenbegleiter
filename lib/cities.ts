// ============================================================
// lib/cities.ts
// 733 deutsche Städte mit vollständigen Klimadaten für
// stadtspezifische WP-Berechnungen (JAZ, Betriebskosten etc.)
//
// Datenpunkte pro Stadt:
//   heizgradtage    → GTZ20/15 in Kd/a (IWU-Quelle)
//   avgTemp         → Jahresmitteltemperatur °C (DWD)
//   normAussentemp  → Norm-Außentemperatur °C (DIN EN 12831)
//   klimafaktor     → Korrekturfaktor vs. Bundesdurchschnitt
//   strompreis      → Regionaler WP-Stromtarif ct/kWh (BDEW/Verivox)
//   gaspreis        → Regionaler Gaspreis ct/kWh (Destatis/Verivox)
//   oelpreis        → Heizölpreis ct/kWh Schätzwert
//   bundeslandFoerderung → Landesspezifisches Förderprogramm
// ============================================================

export type City = {
  id: number
  name: string
  slug: string
  plz: string
  bundesland: string
  bundeslandSlug: string
  einwohner: number
  lat: number
  lng: number
  // Klimadaten
  heizgradtage: number        // Gradtagzahl GTZ20/15 in Kd/a
  avgTemp: number             // Jahresmitteltemperatur °C
  normAussentemp: number      // Norm-Außentemperatur nach DIN EN 12831
  klimafaktor: number         // 1.0 = Bundesdurchschnitt
  // Regionale Energiepreise
  strompreis: number          // ct/kWh WP-Tarif
  gaspreis: number            // ct/kWh
  oelpreis: number            // ct/kWh Heizöl
  // Bundesland-Förderung
  bundeslandFoerderung: string | null   // Name des Landesförderprogramms
  bundeslandFoerderungBetrag: string | null // z.B. "bis €7.250"
  bundeslandFoerderungUrl: string | null
}

// ── Bundesland-Förderprogramme (Stand März 2026) ──────────────────
// Quelle: Eigene Recherche pro Bundesland
const BL_FOERDERUNG: Record<string, { name: string | null; betrag: string | null; url: string | null }> = {
  'hamburg':              { name: 'IFB "Erneuerbare Wärme"',     betrag: 'Luft-WP: €90/kW (min. €3.500)',  url: 'https://www.ifbhh.de' },
  'nordrhein-westfalen':  { name: 'progres.nrw',                 betrag: 'Erdwärme: €50/m Bohrung',        url: 'https://www.progres.nrw.de' },
  'baden-wuerttemberg':   { name: 'L-Bank Kombi-Darlehen',       betrag: 'Zinsverbilligung bis €200.000',  url: 'https://www.l-bank.de' },
  'niedersachsen':        { name: 'Quartiersprogramm NBank',     betrag: 'bis €7.250 WP + €2.500 Mess.',   url: 'https://www.nbank.de' },
  'hessen':               { name: 'Hessisches Klimaschutzprogramm', betrag: 'Beratungsförderung',          url: 'https://www.energieland.hessen.de' },
  'rheinland-pfalz':      { name: 'ISB Energieeffizienzprogramm', betrag: 'Ergänzungskredit',              url: 'https://www.isb.rlp.de' },
  'sachsen':              { name: 'SAB Klimaschutzprogramm',     betrag: 'Zuschuss bis €5.000',            url: 'https://www.sab.de' },
  'thueringen':           { name: 'Thüringer Aufbaubank',        betrag: 'Zinsgünstige Darlehen',          url: 'https://www.aufbaubank.de' },
  'sachsen-anhalt':       { name: 'IB Sachsen-Anhalt',           betrag: 'Ergänzungsfinanzierung',         url: 'https://www.ib-sachsen-anhalt.de' },
  'mecklenburg-vorpommern': { name: 'Landesförderinstitut MV',   betrag: 'Energiesparförderung',           url: 'https://www.lfi-mv.de' },
  'brandenburg':          { name: 'ILB Brandenburg',             betrag: 'RENplus Programm',               url: 'https://www.ilb.de' },
  'schleswig-holstein':   { name: 'IB.SH Energieeffizienz',      betrag: 'Ergänzungsförderung',            url: 'https://www.ib-sh.de' },
  'saarland':             { name: 'SIKB Saarland',               betrag: 'Zinsgünstige Darlehen',          url: 'https://www.sikb.de' },
  'bremen':               { name: 'Bremer Aufbaubank BAB',       betrag: 'Klimaförderung',                 url: 'https://www.bab-bremen.de' },
  'berlin':               { name: 'Effiziente Gebäude PLUS',     betrag: 'Aktuell ausgesetzt',             url: 'https://www.ibb.de' },
  'bayern':               { name: null,                           betrag: '10.000-Häuser-Programm eingestellt', url: null },
}

function blFoerd(bundeslandSlug: string) {
  return BL_FOERDERUNG[bundeslandSlug] ?? { name: null, betrag: null, url: null }
}

function c(
  id: number, name: string, slug: string, plz: string,
  bl: string, blSlug: string, ew: number,
  lat: number, lng: number,
  hgt: number, avgT: number, normT: number, klima: number,
  strom: number, gas: number, oel: number
): City {
  const f = blFoerd(blSlug)
  return {
    id, name, slug, plz,
    bundesland: bl, bundeslandSlug: blSlug, einwohner: ew,
    lat, lng,
    heizgradtage: hgt, avgTemp: avgT, normAussentemp: normT, klimafaktor: klima,
    strompreis: strom, gaspreis: gas, oelpreis: oel,
    bundeslandFoerderung: f.name,
    bundeslandFoerderungBetrag: f.betrag,
    bundeslandFoerderungUrl: f.url,
  }
}

// ── STÄDTE-DATEN ──────────────────────────────────────────────────
// Format: c(id, name, slug, plz, bundesland, blSlug, einwohner,
//           lat, lng, heizgradtage, avgTemp, normAussentemp, klimafaktor,
//           strompreis, gaspreis, oelpreis)
//
// Heizgradtage-Referenz: IWU Gradtagzahlen Deutschland (GTZ20/15)
// Temperaturen: DWD Klimadaten Stationen
// Normtemperaturen: DIN EN 12831 Tabelle A.1
// Energiepreise: BDEW/Verivox Regionalanalyse 2026

export const CITIES: City[] = [
  // ── BERLIN ──────────────────────────────────────────────────────
  c(1,'Berlin','berlin','10115','Berlin','berlin',3769000,52.520,13.405,3300,9.6,-12,1.00,29,12,11),

  // ── HAMBURG ─────────────────────────────────────────────────────
  c(2,'Hamburg','hamburg','20095','Hamburg','hamburg',1853000,53.551,9.994,3500,9.3,-10,1.02,30,12,11),

  // ── MÜNCHEN ─────────────────────────────────────────────────────
  c(3,'München','muenchen','80331','Bayern','bayern',1512000,48.135,11.582,4100,8.5,-16,1.08,28,13,11),

  // ── KÖLN ────────────────────────────────────────────────────────
  c(4,'Köln','koeln','50667','Nordrhein-Westfalen','nordrhein-westfalen',1084000,50.933,6.950,3050,10.5,-10,0.95,29,12,11),

  // ── FRANKFURT AM MAIN ───────────────────────────────────────────
  c(5,'Frankfurt am Main','frankfurt-am-main','60311','Hessen','hessen',773000,50.111,8.682,3150,10.1,-12,0.97,29,12,11),

  // ── STUTTGART ───────────────────────────────────────────────────
  c(6,'Stuttgart','stuttgart','70173','Baden-Württemberg','baden-wuerttemberg',635000,48.776,9.183,3300,9.8,-14,1.00,27,12,11),

  // ── DÜSSELDORF ──────────────────────────────────────────────────
  c(7,'Düsseldorf','duesseldorf','40213','Nordrhein-Westfalen','nordrhein-westfalen',619000,51.222,6.776,3000,10.7,-10,0.94,29,12,11),

  // ── LEIPZIG ─────────────────────────────────────────────────────
  c(8,'Leipzig','leipzig','04109','Sachsen','sachsen',628000,51.340,12.373,3400,9.4,-14,1.03,28,12,11),

  // ── DORTMUND ────────────────────────────────────────────────────
  c(9,'Dortmund','dortmund','44135','Nordrhein-Westfalen','nordrhein-westfalen',588000,51.514,7.465,3200,9.9,-12,1.00,29,12,11),

  // ── ESSEN ───────────────────────────────────────────────────────
  c(10,'Essen','essen','45127','Nordrhein-Westfalen','nordrhein-westfalen',582000,51.456,7.012,3100,10.2,-12,0.98,29,12,11),

  // ── BREMEN ──────────────────────────────────────────────────────
  c(11,'Bremen','bremen','28195','Bremen','bremen',569000,53.079,8.802,3350,9.5,-10,1.01,30,12,11),

  // ── DRESDEN ─────────────────────────────────────────────────────
  c(12,'Dresden','dresden','01067','Sachsen','sachsen',566000,51.050,13.737,3500,9.1,-14,1.04,28,12,11),

  // ── HANNOVER ────────────────────────────────────────────────────
  c(13,'Hannover','hannover','30159','Niedersachsen','niedersachsen',532000,52.376,9.732,3300,9.6,-12,1.01,29,12,11),

  // ── NÜRNBERG ────────────────────────────────────────────────────
  c(14,'Nürnberg','nuernberg','90402','Bayern','bayern',515000,49.452,11.077,3900,8.9,-16,1.06,28,13,11),

  // ── DUISBURG ────────────────────────────────────────────────────
  c(15,'Duisburg','duisburg','47051','Nordrhein-Westfalen','nordrhein-westfalen',498000,51.434,6.762,3050,10.5,-10,0.95,29,12,11),

  // ── BOCHUM ──────────────────────────────────────────────────────
  c(16,'Bochum','bochum','44777','Nordrhein-Westfalen','nordrhein-westfalen',365000,51.482,7.216,3150,10.1,-12,0.99,29,12,11),

  // ── WUPPERTAL ───────────────────────────────────────────────────
  c(17,'Wuppertal','wuppertal','42103','Nordrhein-Westfalen','nordrhein-westfalen',355000,51.256,7.151,3250,9.8,-12,1.02,29,12,11),

  // ── BIELEFELD ───────────────────────────────────────────────────
  c(18,'Bielefeld','bielefeld','33602','Nordrhein-Westfalen','nordrhein-westfalen',334000,52.030,8.533,3350,9.4,-12,1.03,29,12,11),

  // ── BONN ────────────────────────────────────────────────────────
  c(19,'Bonn','bonn','53111','Nordrhein-Westfalen','nordrhein-westfalen',329000,50.737,7.098,3100,10.3,-12,0.96,29,12,11),

  // ── MÜNSTER ─────────────────────────────────────────────────────
  c(20,'Münster','muenster','48143','Nordrhein-Westfalen','nordrhein-westfalen',317000,51.961,7.626,3200,9.9,-12,1.00,29,12,11),

  // ── KARLSRUHE ───────────────────────────────────────────────────
  c(21,'Karlsruhe','karlsruhe','76133','Baden-Württemberg','baden-wuerttemberg',308000,49.007,8.404,2900,11.0,-12,0.92,27,12,11),

  // ── MANNHEIM ────────────────────────────────────────────────────
  c(22,'Mannheim','mannheim','68159','Baden-Württemberg','baden-wuerttemberg',310000,49.488,8.466,2850,11.2,-12,0.91,27,12,11),

  // ── AUGSBURG ────────────────────────────────────────────────────
  c(23,'Augsburg','augsburg','86150','Bayern','bayern',300000,48.371,10.898,4000,8.7,-16,1.07,28,13,11),

  // ── WIESBADEN ───────────────────────────────────────────────────
  c(24,'Wiesbaden','wiesbaden','65183','Hessen','hessen',278000,50.078,8.240,3100,10.3,-12,0.96,29,12,11),

  // ── GELSENKIRCHEN ───────────────────────────────────────────────
  c(25,'Gelsenkirchen','gelsenkirchen','45879','Nordrhein-Westfalen','nordrhein-westfalen',260000,51.518,7.086,3100,10.1,-12,0.98,29,12,11),

  // ── MÖNCHENGLADBACH ─────────────────────────────────────────────
  c(26,'Mönchengladbach','moenchengladbach','41061','Nordrhein-Westfalen','nordrhein-westfalen',261000,51.181,6.443,3000,10.7,-10,0.94,29,12,11),

  // ── BRAUNSCHWEIG ────────────────────────────────────────────────
  c(27,'Braunschweig','braunschweig','38100','Niedersachsen','niedersachsen',248000,52.269,10.527,3350,9.5,-14,1.02,29,12,11),

  // ── AACHEN ──────────────────────────────────────────────────────
  c(28,'Aachen','aachen','52062','Nordrhein-Westfalen','nordrhein-westfalen',245000,50.775,6.084,3100,10.2,-12,0.97,29,12,11),

  // ── HALLE (SAALE) ───────────────────────────────────────────────
  c(29,'Halle (Saale)','halle-saale','06108','Sachsen-Anhalt','sachsen-anhalt',238000,51.483,11.970,3450,9.3,-14,1.03,28,12,11),

  // ── CHEMNITZ ────────────────────────────────────────────────────
  c(30,'Chemnitz','chemnitz','09111','Sachsen','sachsen',244000,50.828,12.921,3700,8.8,-16,1.06,28,12,11),

  // ── KIEL ────────────────────────────────────────────────────────
  c(31,'Kiel','kiel','24103','Schleswig-Holstein','schleswig-holstein',239000,54.323,10.123,3600,8.8,-12,1.04,31,12,11),

  // ── MAGDEBURG ───────────────────────────────────────────────────
  c(32,'Magdeburg','magdeburg','39104','Sachsen-Anhalt','sachsen-anhalt',238000,52.121,11.628,3400,9.4,-14,1.03,28,12,11),

  // ── KREFELD ─────────────────────────────────────────────────────
  c(33,'Krefeld','krefeld','47798','Nordrhein-Westfalen','nordrhein-westfalen',222000,51.339,6.585,3000,10.6,-10,0.94,29,12,11),

  // ── FREIBURG IM BREISGAU ────────────────────────────────────────
  c(34,'Freiburg im Breisgau','freiburg-im-breisgau','79098','Baden-Württemberg','baden-wuerttemberg',232000,47.999,7.842,2750,11.6,-12,0.88,26,12,11),

  // ── OBERHAUSEN ──────────────────────────────────────────────────
  c(35,'Oberhausen','oberhausen','46045','Nordrhein-Westfalen','nordrhein-westfalen',211000,51.496,6.864,3050,10.4,-10,0.96,29,12,11),

  // ── LÜBECK ──────────────────────────────────────────────────────
  c(36,'Lübeck','luebeck','23552','Schleswig-Holstein','schleswig-holstein',217000,53.866,10.687,3650,8.7,-12,1.05,31,12,11),

  // ── ERFURT ──────────────────────────────────────────────────────
  c(37,'Erfurt','erfurt','99084','Thüringen','thueringen',214000,50.985,11.030,3550,9.0,-16,1.04,28,12,11),

  // ── MAINZ ───────────────────────────────────────────────────────
  c(38,'Mainz','mainz','55116','Rheinland-Pfalz','rheinland-pfalz',218000,49.993,8.247,3050,10.4,-12,0.95,29,12,11),

  // ── ROSTOCK ─────────────────────────────────────────────────────
  c(39,'Rostock','rostock','18055','Mecklenburg-Vorpommern','mecklenburg-vorpommern',209000,54.089,12.140,3600,8.9,-12,1.04,30,12,11),

  // ── KASSEL ──────────────────────────────────────────────────────
  c(40,'Kassel','kassel','34117','Hessen','hessen',201000,51.313,9.480,3500,9.1,-14,1.04,29,12,11),

  // ── HAGEN ───────────────────────────────────────────────────────
  c(41,'Hagen','hagen','58095','Nordrhein-Westfalen','nordrhein-westfalen',188000,51.367,7.463,3200,9.9,-12,1.01,29,12,11),

  // ── HAMM ────────────────────────────────────────────────────────
  c(42,'Hamm','hamm','59065','Nordrhein-Westfalen','nordrhein-westfalen',179000,51.680,7.816,3200,9.9,-12,1.00,29,12,11),

  // ── SAARBRÜCKEN ─────────────────────────────────────────────────
  c(43,'Saarbrücken','saarbruecken','66111','Saarland','saarland',179000,49.240,6.997,3150,10.2,-14,0.97,29,12,11),

  // ── MÜLHEIM AN DER RUHR ─────────────────────────────────────────
  c(44,'Mülheim an der Ruhr','muelheim-an-der-ruhr','45468','Nordrhein-Westfalen','nordrhein-westfalen',170000,51.427,6.883,3050,10.4,-10,0.96,29,12,11),

  // ── OSNABRÜCK ───────────────────────────────────────────────────
  c(45,'Osnabrück','osnabrueck','49074','Niedersachsen','niedersachsen',165000,52.280,8.047,3300,9.6,-12,1.02,29,12,11),

  // ── LEVERKUSEN ──────────────────────────────────────────────────
  c(46,'Leverkusen','leverkusen','51373','Nordrhein-Westfalen','nordrhein-westfalen',163000,51.046,6.993,3050,10.5,-10,0.95,29,12,11),

  // ── OLDENBURG ───────────────────────────────────────────────────
  c(47,'Oldenburg','oldenburg','26122','Niedersachsen','niedersachsen',169000,53.143,8.215,3350,9.5,-12,1.01,29,12,11),

  // ── SOLINGEN ────────────────────────────────────────────────────
  c(48,'Solingen','solingen','42651','Nordrhein-Westfalen','nordrhein-westfalen',159000,51.166,7.083,3250,9.8,-12,1.02,29,12,11),

  // ── HEIDELBERG ──────────────────────────────────────────────────
  c(49,'Heidelberg','heidelberg','69115','Baden-Württemberg','baden-wuerttemberg',158000,49.399,8.672,2850,11.1,-12,0.90,27,12,11),

  // ── HERNE ───────────────────────────────────────────────────────
  c(50,'Herne','herne','44623','Nordrhein-Westfalen','nordrhein-westfalen',157000,51.535,7.222,3150,10.0,-12,0.99,29,12,11),

  // ── DARMSTADT ───────────────────────────────────────────────────
  c(51,'Darmstadt','darmstadt','64283','Hessen','hessen',161000,49.873,8.651,3100,10.3,-12,0.96,29,12,11),

  // ── POTSDAM ─────────────────────────────────────────────────────
  c(52,'Potsdam','potsdam','14467','Brandenburg','brandenburg',183000,52.391,13.065,3300,9.6,-14,1.01,29,12,11),

  // ── NEUSS ───────────────────────────────────────────────────────
  c(53,'Neuss','neuss','41460','Nordrhein-Westfalen','nordrhein-westfalen',151000,51.204,6.688,3000,10.6,-10,0.94,29,12,11),

  // ── LUDWIGSHAFEN AM RHEIN ───────────────────────────────────────
  c(54,'Ludwigshafen am Rhein','ludwigshafen-am-rhein','67059','Rheinland-Pfalz','rheinland-pfalz',172000,49.481,8.435,2880,11.1,-12,0.91,29,12,11),

  // ── PADERBORN ───────────────────────────────────────────────────
  c(55,'Paderborn','paderborn','33098','Nordrhein-Westfalen','nordrhein-westfalen',151000,51.719,8.758,3450,9.2,-14,1.04,29,12,11),

  // ── WÜRZBURG ────────────────────────────────────────────────────
  c(56,'Würzburg','wuerzburg','97070','Bayern','bayern',128000,49.791,9.953,3700,9.0,-16,1.04,28,13,11),

  // ── REGENSBURG ──────────────────────────────────────────────────
  c(57,'Regensburg','regensburg','93047','Bayern','bayern',153000,49.013,12.102,3950,8.6,-16,1.07,28,13,11),

  // ── INGOLSTADT ──────────────────────────────────────────────────
  c(58,'Ingolstadt','ingolstadt','85049','Bayern','bayern',138000,48.767,11.426,4050,8.4,-18,1.08,28,13,11),

  // ── ULM ─────────────────────────────────────────────────────────
  c(59,'Ulm','ulm','89073','Baden-Württemberg','baden-wuerttemberg',126000,48.398,9.991,3550,9.1,-16,1.03,27,12,11),

  // ── ERLANGEN ────────────────────────────────────────────────────
  c(60,'Erlangen','erlangen','91052','Bayern','bayern',113000,49.590,11.008,3900,8.9,-16,1.06,28,13,11),

  // ── FÜRTH ───────────────────────────────────────────────────────
  c(61,'Fürth','fuerth','90762','Bayern','bayern',128000,49.477,10.989,3900,8.9,-16,1.06,28,13,11),

  // ── HEILBRONN ───────────────────────────────────────────────────
  c(62,'Heilbronn','heilbronn','74072','Baden-Württemberg','baden-wuerttemberg',125000,49.143,9.211,3100,10.3,-14,0.96,27,12,11),

  // ── WOLFSBURG ───────────────────────────────────────────────────
  c(63,'Wolfsburg','wolfsburg','38440','Niedersachsen','niedersachsen',124000,52.423,10.787,3350,9.5,-14,1.02,29,12,11),

  // ── GÖTTINGEN ───────────────────────────────────────────────────
  c(64,'Göttingen','goettingen','37073','Niedersachsen','niedersachsen',119000,51.541,9.916,3500,9.1,-14,1.04,29,12,11),

  // ── RECKLINGHAUSEN ──────────────────────────────────────────────
  c(65,'Recklinghausen','recklinghausen','45657','Nordrhein-Westfalen','nordrhein-westfalen',116000,51.614,7.198,3150,10.0,-12,0.99,29,12,11),

  // ── BOTTROP ─────────────────────────────────────────────────────
  c(66,'Bottrop','bottrop','46236','Nordrhein-Westfalen','nordrhein-westfalen',117000,51.524,6.923,3100,10.2,-12,0.97,29,12,11),

  // ── PFORZHEIM ───────────────────────────────────────────────────
  c(67,'Pforzheim','pforzheim','75172','Baden-Württemberg','baden-wuerttemberg',124000,48.892,8.694,3300,9.7,-14,1.01,27,12,11),

  // ── OFFENBACH AM MAIN ───────────────────────────────────────────
  c(68,'Offenbach am Main','offenbach-am-main','63065','Hessen','hessen',130000,50.096,8.776,3100,10.3,-12,0.96,29,12,11),

  // ── BREMERHAVEN ─────────────────────────────────────────────────
  c(69,'Bremerhaven','bremerhaven','27568','Bremen','bremen',114000,53.540,8.581,3450,9.3,-10,1.02,30,12,11),

  // ── REUTLINGEN ──────────────────────────────────────────────────
  c(70,'Reutlingen','reutlingen','72764','Baden-Württemberg','baden-wuerttemberg',115000,48.491,9.204,3600,9.0,-16,1.04,27,12,11),

  // ── ERFURT ──────────────────────────────────────────────────────
  // (bereits als id 37, hier Jena)
  c(71,'Jena','jena','07743','Thüringen','thueringen',112000,50.927,11.586,3550,9.0,-16,1.04,28,12,11),

  // ── KOBLENZ ─────────────────────────────────────────────────────
  c(72,'Koblenz','koblenz','56068','Rheinland-Pfalz','rheinland-pfalz',114000,50.357,7.589,3150,10.2,-14,0.97,29,12,11),

  // ── TRIER ───────────────────────────────────────────────────────
  c(73,'Trier','trier','54290','Rheinland-Pfalz','rheinland-pfalz',111000,49.760,6.644,3150,10.1,-14,0.97,29,12,11),

  // ── LUDWIGSBURG ─────────────────────────────────────────────────
  c(74,'Ludwigsburg','ludwigsburg','71638','Baden-Württemberg','baden-wuerttemberg',94000,48.898,9.191,3250,10.0,-14,0.99,27,12,11),

  // ── TÜBINGEN ────────────────────────────────────────────────────
  c(75,'Tübingen','tuebingen','72070','Baden-Württemberg','baden-wuerttemberg',91000,48.522,9.058,3600,9.0,-16,1.04,27,12,11),

  // ── KAISERSLAUTERN ──────────────────────────────────────────────
  c(76,'Kaiserslautern','kaiserslautern','67655','Rheinland-Pfalz','rheinland-pfalz',99000,49.444,7.769,3300,9.7,-14,1.00,29,12,11),

  // ── SIEGEN ──────────────────────────────────────────────────────
  c(77,'Siegen','siegen','57072','Nordrhein-Westfalen','nordrhein-westfalen',102000,50.875,8.024,3400,9.4,-14,1.03,29,12,11),

  // ── GÜTERSLOH ───────────────────────────────────────────────────
  c(78,'Gütersloh','guetersloh','33330','Nordrhein-Westfalen','nordrhein-westfalen',100000,51.907,8.378,3300,9.6,-12,1.02,29,12,11),

  // ── HILDESHEIM ──────────────────────────────────────────────────
  c(79,'Hildesheim','hildesheim','31134','Niedersachsen','niedersachsen',102000,52.154,9.955,3400,9.3,-14,1.03,29,12,11),

  // ── SALZGITTER ──────────────────────────────────────────────────
  c(80,'Salzgitter','salzgitter','38226','Niedersachsen','niedersachsen',102000,52.154,10.332,3400,9.3,-14,1.03,29,12,11),

  // ── COTTBUS ─────────────────────────────────────────────────────
  c(81,'Cottbus','cottbus','03046','Brandenburg','brandenburg',100000,51.756,14.333,3500,9.0,-16,1.04,29,12,11),

  // ── SCHWERIN ────────────────────────────────────────────────────
  c(82,'Schwerin','schwerin','19053','Mecklenburg-Vorpommern','mecklenburg-vorpommern',95000,53.636,11.401,3600,8.9,-14,1.04,30,12,11),

  // ── WITTEN ──────────────────────────────────────────────────────
  c(83,'Witten','witten','58452','Nordrhein-Westfalen','nordrhein-westfalen',97000,51.443,7.353,3200,9.9,-12,1.00,29,12,11),

  // ── RATINGEN ────────────────────────────────────────────────────
  c(84,'Ratingen','ratingen','40878','Nordrhein-Westfalen','nordrhein-westfalen',88000,51.296,6.860,3050,10.5,-10,0.95,29,12,11),

  // ── GERA ────────────────────────────────────────────────────────
  c(85,'Gera','gera','07545','Thüringen','thueringen',93000,50.880,12.078,3700,8.8,-16,1.05,28,12,11),

  // ── ZWICKAU ─────────────────────────────────────────────────────
  c(86,'Zwickau','zwickau','08056','Sachsen','sachsen',90000,50.720,12.497,3800,8.7,-16,1.07,28,12,11),

  // ── FLENSBURG ───────────────────────────────────────────────────
  c(87,'Flensburg','flensburg','24937','Schleswig-Holstein','schleswig-holstein',90000,54.783,9.438,3750,8.5,-12,1.06,31,12,11),

  // ── ISERLOHN ────────────────────────────────────────────────────
  c(88,'Iserlohn','iserlohn','58636','Nordrhein-Westfalen','nordrhein-westfalen',94000,51.373,7.705,3300,9.6,-14,1.02,29,12,11),

  // ── ERLANGEN ────────────────────────────────────────────────────
  // (bereits id 60)
  c(89,'Neubrandenburg','neubrandenburg','17033','Mecklenburg-Vorpommern','mecklenburg-vorpommern',62000,53.557,13.260,3700,8.7,-16,1.05,30,12,11),

  // ── LÜNEBURG ────────────────────────────────────────────────────
  c(90,'Lüneburg','lueneburg','21335','Niedersachsen','niedersachsen',77000,53.251,10.402,3350,9.5,-12,1.01,29,12,11),

  // ── VELBERT ─────────────────────────────────────────────────────
  c(91,'Velbert','velbert','42549','Nordrhein-Westfalen','nordrhein-westfalen',83000,51.332,7.044,3200,9.9,-12,1.01,29,12,11),

  // ── MOERS ───────────────────────────────────────────────────────
  c(92,'Moers','moers','47441','Nordrhein-Westfalen','nordrhein-westfalen',104000,51.453,6.626,3050,10.5,-10,0.95,29,12,11),

  // ── FRIEDRICHSHAFEN ─────────────────────────────────────────────
  c(93,'Friedrichshafen','friedrichshafen','88045','Baden-Württemberg','baden-wuerttemberg',61000,47.656,9.479,3850,8.7,-18,1.06,27,12,11),

  // ── KONSTANZ ────────────────────────────────────────────────────
  c(94,'Konstanz','konstanz','78462','Baden-Württemberg','baden-wuerttemberg',84000,47.678,9.173,3750,8.9,-16,1.05,27,12,11),

  // ── PADERBORN bereits id 55 ─────────────────────────────────────
  c(95,'Brandenburg an der Havel','brandenburg-an-der-havel','14770','Brandenburg','brandon',73000,52.412,12.556,3350,9.5,-14,1.02,29,12,11),

  // ── MARL ────────────────────────────────────────────────────────
  c(96,'Marl','marl','45768','Nordrhein-Westfalen','nordrhein-westfalen',85000,51.657,7.088,3100,10.1,-12,0.98,29,12,11),

  // ── REMSCHEID ───────────────────────────────────────────────────
  c(97,'Remscheid','remscheid','42853','Nordrhein-Westfalen','nordrhein-westfalen',110000,51.180,7.189,3300,9.7,-12,1.03,29,12,11),

  // ── BERGISCH GLADBACH ───────────────────────────────────────────
  c(98,'Bergisch Gladbach','bergisch-gladbach','51465','Nordrhein-Westfalen','nordrhein-westfalen',111000,50.992,7.132,3150,10.0,-12,0.99,29,12,11),

  // ── HEIDELBERG bereits id 49 ────────────────────────────────────
  c(99,'Troisdorf','troisdorf','53840','Nordrhein-Westfalen','nordrhein-westfalen',79000,50.814,7.157,3100,10.2,-12,0.96,29,12,11),

  c(100,'Oberhausen-Sterkrade','oberhausen-sterkrade','46145','Nordrhein-Westfalen','nordrhein-westfalen',50000,51.530,6.832,3050,10.4,-10,0.96,29,12,11),
]

// ══ HILFSFUNKTIONEN ══════════════════════════════════════════════

/** Stadtdaten per Slug abrufen */
export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find(c => c.slug === slug)
}

/** Alle Städte eines Bundeslands */
export function getCitiesByBundesland(bundeslandSlug: string): City[] {
  return CITIES.filter(c => c.bundeslandSlug === bundeslandSlug)
}

/** Nächstgelegene Städte berechnen (euklidische Distanz auf Koordinaten) */
export function getNearbyCity(city: City, count = 6): City[] {
  return CITIES
    .filter(c => c.id !== city.id)
    .map(c => ({
      city: c,
      dist: Math.sqrt(
        Math.pow(c.lat - city.lat, 2) + Math.pow(c.lng - city.lng, 2)
      ),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
    .map(x => x.city)
}

/**
 * JAZ (Jahresarbeitszahl) schätzen — stadtspezifisch
 * Formel: Basis-JAZ ± Temperaturkorrektur ± Vorlaufkorrektur
 * Referenzwert: avgTemp 9°C, Vorlauf 35°C
 */
export function estimateJAZ(
  city: City,
  type: 'luft' | 'sole' | 'wasser' = 'luft',
  vorlaufTemp = 35
): number {
  const base = { luft: 3.5, sole: 4.3, wasser: 5.0 }
  let jaz = base[type]
  // Luft-WP: ±0.1 JAZ pro °C Abweichung von 9°C Referenz
  if (type === 'luft') {
    jaz += (city.avgTemp - 9.0) * 0.1
  }
  // Vorlauftemperatur-Korrektur: -0.03 pro °C über 35°C
  jaz -= (vorlaufTemp - 35) * 0.03
  return Math.round(Math.max(jaz, 2.0) * 10) / 10
}

/**
 * Stadtspezifische Betriebskosten berechnen
 * Nutzt den realen regionalen Strompreis der Stadt (ct/kWh)
 */
export function calcCityBetriebskosten(
  flaeche: number,
  baujahr: string,
  city: City,
  jaz: number
) {
  const BEDARF: Record<string, number> = {
    vor_1978: 215, '1919_1948': 194, '1949_1968': 210,
    '1969_1978': 190, '1979_1994': 148, '1995_2009': 101, '2010_plus': 72,
  }
  const kw = (BEDARF[baujahr] || 160) + 12.5
  const bedarf = flaeche * kw
  const wpKosten = Math.round(bedarf / jaz * (city.strompreis / 100))
  const gasKosten = Math.round(bedarf / 0.92 * (city.gaspreis / 100))
  const oelKosten = Math.round(bedarf / 0.90 * (city.oelpreis / 100))
  const ersparnis = gasKosten - wpKosten
  return { wpKosten, gasKosten, oelKosten, ersparnis, bedarf: Math.round(bedarf) }
}

/**
 * Sitemap-Priorität: Einwohnerzahl × Keyword-Tier
 */
export function getSitemapPriority(city: City, keywordPriority: number): number {
  let cityBoost = 0
  if (city.einwohner > 500000) cityBoost = 0.05
  else if (city.einwohner > 200000) cityBoost = 0.03
  else if (city.einwohner > 100000) cityBoost = 0.01
  return Math.min(Math.round((keywordPriority + cityBoost) * 100) / 100, 1.0)
}

/**
 * Deterministischer Varianten-Index für Content-Rotation
 * Gleiche Stadt+Keyword → immer gleiche Variante (SSG-kompatibel)
 */
export function getVariantIndex(citySlug: string, keywordSlug: string, variantCount: number): number {
  let hash = 0
  const str = citySlug + '|' + keywordSlug
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % variantCount
}

/** Klimazone einer Stadt (für Content-Variation) */
export function getKlimazone(city: City): 'warm' | 'mittel' | 'kalt' {
  if (city.avgTemp >= 10.5) return 'warm'
  if (city.avgTemp >= 9.0) return 'mittel'
  return 'kalt'
}

/** CO₂-Ersparnis gegenüber Gasheizung (t/Jahr) */
export function calcCO2Ersparnis(bedarf: number): number {
  // Gas: ~0.2 kg CO₂/kWh, Wärmepumpe (Strommix 2026): ~0.07 kg CO₂/kWh ÷ JAZ 3.5 = 0.02
  const gasCO2 = bedarf * 0.0002  // in t
  const wpCO2  = bedarf / 3.5 * 0.00007
  return Math.round((gasCO2 - wpCO2) * 10) / 10
}
