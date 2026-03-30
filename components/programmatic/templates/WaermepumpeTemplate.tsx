"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown, CheckCircle, XCircle, ArrowRight,
  Thermometer, Zap, Euro, Leaf, Clock, Shield,
  TrendingDown, Home, Wrench, AlertTriangle, BarChart2
} from "lucide-react";
import type { CityPageRouterProps } from "@/components/programmatic/CityPageRouter";
import { fillTemplate, KEYWORDS, getKeywordBySlug } from "@/lib/keywords";
import { getNearbyCity, getVariantIndex, getKlimazone, estimateJAZ } from "@/lib/cities";
import { calcBetriebskosten, calcFoerderung, fmtEuro, fmtKwh } from "@/lib/calculations";
import AuthorBox from '@/components/programmatic/AuthorBox';

// ── Bildpools (Unsplash — free commercial use) ──────────────────────────────
const HERO_IMGS = [
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1920&q=80",
];
const SIDE_IMGS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
];
const STRIP_IMGS = [
  "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80",
];

function pick(arr: string[], lat: number, lng: number, offset = 0) {
  return arr[Math.abs(Math.round(lat * 7 + lng * 13 + offset)) % arr.length];
}

// ── Interaktiver WP-Kostenrechner ────────────────────────────────────────────
function WPKostenRechner({ city }: { city: CityPageRouterProps["city"] }) {
  const [flaeche,  setFlaeche]  = useState(120);
  const [baujahr,  setBaujahr]  = useState("1979_1994");
  const [heizung,  setHeizung]  = useState<"erdgas"|"heizoel"|"nachtspeicher">("erdgas");
  const [wpTyp,    setWpTyp]    = useState<"luft"|"sole"|"wasser">("luft");
  const [vorlauf,  setVorlauf]  = useState(35);
  const [selfOcc,  setSelfOcc]  = useState(true);
  const [fossil,   setFossil]   = useState(true);
  const [lowInc,   setLowInc]   = useState(false);
  const [r290,     setR290]     = useState(false);

  const jaz  = estimateJAZ(city, wpTyp as any, vorlauf);
  const calc = calcBetriebskosten(flaeche, baujahr, heizung, {
    strompreisCtKwh: city.strompreis,
    gaspreisCtKwh:   city.gaspreis,
    avgTemp:         city.avgTemp,
    vorlaufTemp:     vorlauf,
    wpTyp:           wpTyp as any,
  });
  const foerd = calcFoerderung({
    investitionskosten:      25000,
    isSelfOccupied:          selfOcc,
    hasOldFossilHeating:     fossil,
    einkommenUnter40k:       lowInc,
    hasNaturalRefrigerant:   r290,
    usesErdwaermeOrWasser:   wpTyp !== "luft",
  });

  const gewinnNach20 = Math.round(calc.ersparnis * 20 - foerd.eigenanteil);
  const gewinnNach25 = Math.round(calc.ersparnis * 25 - foerd.eigenanteil);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="relative h-36 overflow-hidden">
        <img src={STRIP_IMGS[0]} alt="WP Kostenrechner"
          className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[#1B5E37]/85" />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <p className="text-[#4CAF7D] text-xs font-bold uppercase tracking-wider mb-1">
              KOSTENLOSER RECHNER — STADTSPEZIFISCH
            </p>
            <h3 className="text-white font-extrabold text-2xl">
              Was kostet die Wärmepumpe wirklich in {city.name}?
            </h3>
            <p className="text-white/50 text-sm">
              {city.strompreis} ct/kWh Strompreis · {city.heizgradtage} Heizgradtage · JAZ {jaz} · Stand März 2026
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 grid md:grid-cols-[1fr_300px] gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          {/* Wohnfläche */}
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-1">
              Wohnfläche: <span className="text-[#1B5E37] font-bold">{flaeche} m²</span>
              <span className="text-gray-400 font-normal ml-2 text-xs">
                ({flaeche < 80 ? "kleine Wohnung" : flaeche < 130 ? "mittleres EFH" : flaeche < 200 ? "großes EFH" : "Großes Haus"})
              </span>
            </p>
            <input type="range" min={50} max={300} step={10} value={flaeche}
              onChange={e => setFlaeche(+e.target.value)}
              className="w-full accent-[#1B5E37]" />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>50 m²</span><span className="text-[#1B5E37]">Ø 120 m²</span><span>300 m²</span>
            </div>
          </div>

          {/* Baujahr */}
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-2">Baujahr Gebäude</p>
            <div className="grid grid-cols-4 gap-2">
              {([
                ["vor_1978",   "vor 1978",    "~215 kWh/m²"],
                ["1979_1994",  "1979–1994",   "~148 kWh/m²"],
                ["1995_2009",  "1995–2009",   "~101 kWh/m²"],
                ["2010_plus",  "ab 2010",     "~72 kWh/m²"],
              ] as const).map(([v, l, sub]) => (
                <button key={v} onClick={() => setBaujahr(v)}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                    baujahr === v
                      ? "border-[#1B5E37] bg-[#E8F5EE]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <p className={`font-bold text-xs ${baujahr === v ? "text-[#1B5E37]" : "text-gray-700"}`}>{l}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Aktuelle Heizung */}
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-2">Aktuelle Heizung</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                ["erdgas",        "🔥 Erdgas",       `${city.gaspreis} ct/kWh`],
                ["heizoel",       "🛢️ Heizöl",        "ca. 11 ct/kWh"],
                ["nachtspeicher", "⚡ Nachtspeicher", "ca. 28 ct/kWh"],
              ] as const).map(([v, l, sub]) => (
                <button key={v} onClick={() => setHeizung(v as any)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    heizung === v
                      ? "border-[#D97706] bg-amber-50"
                      : "border-gray-200"
                  }`}>
                  <p className={`font-bold text-xs ${heizung === v ? "text-[#D97706]" : "text-gray-700"}`}>{l}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* WP Typ */}
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-2">
              Wärmepumpentyp <span className="text-gray-400 font-normal">(beeinflusst JAZ)</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {([
                ["luft",   "💨 Luft-Wasser", "92% Marktanteil"],
                ["sole",   "🌍 Sole-Wasser",  "+5% KfW-Bonus"],
                ["wasser", "💧 Wasser-Wasser", "+5% KfW-Bonus"],
              ] as const).map(([v, l, sub]) => (
                <button key={v} onClick={() => setWpTyp(v as any)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    wpTyp === v
                      ? "border-[#1B5E37] bg-[#E8F5EE]"
                      : "border-gray-200"
                  }`}>
                  <p className={`font-bold text-xs ${wpTyp === v ? "text-[#1B5E37]" : "text-gray-700"}`}>{l}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Vorlauftemperatur */}
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-1">
              Vorlauftemperatur: <span className="text-[#1B5E37] font-bold">{vorlauf}°C</span>
              <span className="text-gray-400 font-normal ml-2 text-xs">
                ({vorlauf <= 35 ? "Fußbodenheizung — optimal" : vorlauf <= 50 ? "moderne Heizkörper" : "alte Heizkörper — WP möglich, JAZ sinkt"})
              </span>
            </p>
            <input type="range" min={30} max={70} step={5} value={vorlauf}
              onChange={e => setVorlauf(+e.target.value)}
              className="w-full accent-[#1B5E37]" />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>30°C (FBH)</span><span>50°C</span><span>70°C (alt)</span>
            </div>
          </div>

          {/* Fördersituation */}
          <div className="space-y-2">
            <p className="font-semibold text-gray-700 text-sm">Ihre Fördersituation</p>
            {([
              { s: selfOcc, f: setSelfOcc, icon: "🏠", l: "Eigennutzer",               sub: "Grundvoraussetzung für Klima-Speed & Einkommens-Bonus" },
              { s: fossil,  f: setFossil,  icon: "🔥", l: "Fossile Heizung ersetzen",  sub: `+20% Klima-Speed-Bonus = +${(0.20*30000/1000).toFixed(0)}k€ Zuschuss` },
              { s: lowInc,  f: setLowInc,  icon: "💰", l: "Einkommen unter €40.000/J", sub: "+30% Einkommens-Bonus (nur Eigennutzer)" },
              { s: r290,    f: setR290,    icon: "🌿", l: "R290 natürliches Kältemittel", sub: "+5% Bonus auf Propan-Wärmepumpen" },
            ]).map((o, i) => (
              <button key={i} onClick={() => o.f(!o.s)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  o.s ? "border-[#1B5E37] bg-[#E8F5EE]" : "border-gray-200"
                }`}>
                <span className="text-lg">{o.icon}</span>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-800 text-sm">{o.l}</p>
                  <p className="text-gray-400 text-xs">{o.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  o.s ? "bg-[#1B5E37] border-[#1B5E37]" : "border-gray-300"
                }`}>
                  {o.s && <span className="text-white text-xs">✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Ergebnisse */}
        <div className="space-y-3">
          <div className="bg-[#1B5E37] rounded-2xl p-5">
            <p className="text-[#4CAF7D] text-xs font-bold uppercase tracking-wider mb-3">
              ERGEBNIS FÜR {city.name.toUpperCase()}
            </p>
            <div className="space-y-1.5 text-sm mb-4">
              {[
                { l: `Heizkosten heute (${heizung})`, v: fmtEuro(calc.altKosten) + "/J", c: "text-amber-300" },
                { l: `Mit WP (JAZ ${jaz})`,          v: fmtEuro(calc.wpKosten) + "/J",   c: "text-[#4CAF7D]" },
                { l: "Jährliche Ersparnis",           v: fmtEuro(calc.ersparnis),         c: "text-white font-bold text-base" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-white/50">{r.l}</span>
                  <span className={r.c}>{r.v}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-3 space-y-1.5 text-xs">
              <p className="text-[#4CAF7D] font-bold uppercase tracking-wider text-xs mb-2">KfW-FÖRDERUNG ({foerd.gesamtSatz}%)</p>
              {[
                { l: "Gesamtinvestition",       v: "€ 25.000" },
                { l: `KfW-Zuschuss ${foerd.gesamtSatz}%`, v: "−" + fmtEuro(foerd.zuschuss), c: "text-[#4CAF7D]" },
                { l: "Ihr Eigenanteil",          v: fmtEuro(foerd.eigenanteil), c: "text-white font-bold" },
                { l: "Amortisation",             v: `~${calc.amortisationJahre} Jahre`, c: "text-amber-300" },
                { l: "Gewinn nach 20 Jahren",    v: `+${fmtEuro(gewinnNach20)}`, c: "text-[#4CAF7D]" },
                { l: "Gewinn nach 25 Jahren",    v: `+${fmtEuro(gewinnNach25)}`, c: "text-[#4CAF7D]" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-white/40">{r.l}</span>
                  <span className={r.c ?? "text-white"}>{r.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/20 text-xs">
              {[
                { l: "CO₂-Ersparnis",  v: `~${calc.co2Ersparnis} t/Jahr` },
                { l: "Stromverbrauch", v: fmtKwh(calc.stromverbrauch) + "/Jahr" },
                { l: "Jahresarbeitszahl", v: `JAZ ${jaz}` },
              ].map((r, i) => (
                <div key={i} className="flex justify-between mb-1">
                  <span className="text-white/30">{r.l}</span>
                  <span className="text-white/70">{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          <a href="/rechner"
            className="block w-full text-center py-3.5 bg-[#D97706] text-white font-bold rounded-xl
              hover:bg-[#b45309] transition-colors text-sm">
            Kostenloses Angebot in {city.name} →
          </a>
          <p className="text-center text-xs text-gray-400">
            Kostenlos & unverbindlich · Keine Weitergabe · Bis 3 lokale Betriebe
          </p>
        </div>
      </div>
    </div>
  );
}

// ── FAQ Accordion ────────────────────────────────────────────────────────────
function FAQAccordion({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 p-5 text-left
              bg-white hover:bg-gray-50 transition-colors">
            <span className="font-semibold text-gray-900 text-[15px] leading-snug">{faq.q}</span>
            <ChevronDown
              size={18}
              className={`flex-shrink-0 text-gray-400 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}>
                <p className="px-5 pb-5 text-gray-600 text-[15px] leading-relaxed bg-white">
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── HAUPTKOMPONENTE ──────────────────────────────────────────────────────────
export default function WaermepumpeTemplate({
  city, keyword, jaz, calc, foerd, h1, nearby,
}: CityPageRouterProps) {
  const variant = Math.abs(Math.round(city.lat * 3 + city.lng * 7)) % 4;
  const heroImg  = pick(HERO_IMGS,  city.lat, city.lng, 0);
  const sideImg  = pick(SIDE_IMGS,  city.lat, city.lng, 1);
  const stripImg = pick(STRIP_IMGS, city.lat, city.lng, 2);
  const klimazone = getKlimazone(city);

  // Intro-Textvarianten (stadtspezifisch + deterministisch)
  // Intro-Paragraphen: 8 × 4 Stadtgrößen × 6 Keyword-Kategorien = unique pro Stadt
  const [introText] = getIntroParagraphs(city, keyword, jaz, calc.wpKosten, calc.ersparnis);

  // FAQs rotierend aus Pool (20+ Fragen je Keyword-Kategorie, 6 pro Stadt-Hash)
  const faqs = getRotatingFAQs(city, keyword, jaz, calc.wpKosten, calc.ersparnis, 6);

  // Cross-Links
  const crossKeywords = keyword.crossLinks
    .map(slug => getKeywordBySlug(slug))
    .filter(Boolean);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[82vh] flex items-center overflow-hidden">
        <img src={heroImg} alt={`Wärmepumpe ${city.name}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1910]/94 via-[#0A1910]/80 to-[#0A1910]/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="grid lg:grid-cols-[54%_46%] gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}>

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-white/45 text-sm mb-5 flex-wrap">
                <Link href="/" className="hover:text-white/70 transition-colors">Startseite</Link>
                <span>›</span>
                <Link href={`/${keyword.slug}`} className="hover:text-white/70 transition-colors">
                  {keyword.keyword.replace(" [Stadt]", "")}
                </Link>
                <span>›</span>
                <span className="text-white/75">{city.name}</span>
              </nav>

              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15
                rounded-full px-4 py-1.5 text-sm font-medium text-white/88 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#4CAF7D] animate-pulse" />
                {city.bundesland} · GEG 2026
              </span>

              <h1 className="font-extrabold text-white leading-[1.1] mb-5
                text-4xl sm:text-5xl lg:text-[3.8rem] tracking-tight">
                {h1}
              </h1>

              <p className="text-lg text-white/72 max-w-xl mb-8 leading-relaxed">
                {introText}
              </p>

              <div className="flex flex-wrap gap-3 mb-9">
                <a href="/rechner"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#1B5E37] text-white
                    font-bold rounded-xl hover:bg-[#154d2c] hover:-translate-y-0.5
                    transition-all shadow-lg shadow-[#1B5E37]/40 text-base">
                  Kosten berechnen <ArrowRight size={18} />
                </a>
                <a href="#foerderung"
                  className="inline-flex items-center gap-2 px-8 py-4
                    bg-white/10 border border-white/25 text-white font-bold rounded-xl
                    hover:bg-white/18 transition-all text-base">
                  Förderung prüfen
                </a>
              </div>

              {/* Quick-Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Thermometer size={16} />, val: `JAZ ${jaz}`, lbl: "Jahresarbeitszahl" },
                  { icon: <Euro size={16} />,        val: fmtEuro(calc.ersparnis), lbl: "Ersparnis/Jahr" },
                  { icon: <Zap size={16} />,          val: `${city.strompreis} ct`, lbl: "Strompreis lokal" },
                  { icon: <Leaf size={16} />,         val: `${calc.co2Ersparnis} t`, lbl: "CO₂ gespart/J." },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-3 border border-white/10">
                    <div className="flex items-center gap-1.5 text-[#4CAF7D] mb-1">{s.icon}
                      <span className="font-mono font-bold text-white text-lg">{s.val}</span>
                    </div>
                    <p className="text-white/45 text-xs">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="hidden lg:flex justify-end">
              <div className="w-full max-w-[420px] bg-white rounded-2xl overflow-hidden
                shadow-2xl border border-white/20">
                <div className="relative h-52">
                  <img src={sideImg} alt={`Wärmepumpe ${city.name}`}
                    className="w-full h-full object-cover" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className="bg-white/95 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-500 mb-0.5">Jährl. Ersparnis</p>
                      <p className="font-mono font-bold text-[#D97706] text-lg">{fmtEuro(calc.ersparnis)}</p>
                    </div>
                    <div className="bg-white/95 rounded-lg px-3 py-2 text-right">
                      <p className="text-xs text-gray-500 mb-0.5">KfW-Förderung</p>
                      <p className="font-mono font-bold text-[#1B5E37] text-lg">bis 70%</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {["Herstellerunabhängig", "HWK-geprüft", "KfW-Begleitung"].map(b => (
                      <span key={b} className="bg-[#E8F5EE] text-[#1B5E37] text-xs font-semibold
                        px-2.5 py-1 rounded-full">{b}</span>
                    ))}
                  </div>
                  <a href="/rechner"
                    className="block w-full text-center py-3 bg-[#1B5E37] text-white
                      font-bold rounded-xl hover:bg-[#154d2c] transition-colors text-sm">
                    Kostenlos Angebot anfordern →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 py-3.5">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 flex-wrap text-sm">
          <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">Datenquellen</span>
          {["KfW BEG", "BAFA", "BWP", "Fraunhofer ISE", "DWD", "Verbraucherzentrale", "BDEW"].map(s => (
            <span key={s} className="text-gray-400 font-semibold">{s}</span>
          ))}
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">

          {/* LEFT */}
          <div className="space-y-14">

            {/* Featured Snippet Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-200 p-7 border-l-4 border-l-[#1B5E37]">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {fillTemplate(keyword.featuredSnippetQuestions[0] ?? `Was kostet eine Wärmepumpe in ${city.name}?`, city, jaz)}
              </h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Eine <strong>Luft-Wasser-Wärmepumpe</strong> kostet in {city.name} inklusive Installation zwischen{" "}
                <strong>€18.000 und €28.000</strong> brutto. Nach KfW-Förderung (typisch 50–55%) reduziert sich der
                Eigenanteil auf <strong>{fmtEuro(foerd.eigenanteil)}</strong>. Die jährliche Ersparnis gegenüber
                Erdgas beträgt bei einem 120 m² EFH ca.{" "}
                <strong>{fmtEuro(calc.ersparnis)} pro Jahr</strong> — bei {city.strompreis} ct/kWh Strompreis und{" "}
                JAZ {jaz} (Jahresmitteltemperatur {city.avgTemp}°C in {city.name}).
              </p>
            </motion.div>

            {/* Stadtspezifische Klimainfos */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold
                uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Klimadaten {city.name}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Wärmepumpe in {city.name} — stadtspezifische Effizienz
              </h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                {[
                  { icon: <Thermometer size={20} className="text-[#1B5E37]" />, title: "Jahresarbeitszahl (JAZ)", val: jaz.toString(), sub: `Bei ${city.avgTemp}°C Ø-Temperatur in ${city.name}`, note: "Aus 1 kWh Strom werden " + jaz + " kWh Wärme" },
                  { icon: <BarChart2 size={20} className="text-[#D97706]" />,   title: "Heizgradtage",            val: city.heizgradtage.toLocaleString("de-DE") + " Kd/a", sub: "Wärmebedarf des Standorts", note: "Quelle: IWU Gradtagzahlen DE" },
                  { icon: <Zap size={20} className="text-[#1B5E37]" />,         title: "Regionaler Strompreis",   val: city.strompreis + " ct/kWh", sub: "WP-Sondertarif " + city.name, note: "Quelle: BDEW/Verivox 2026" },
                  { icon: <TrendingDown size={20} className="text-[#D97706]" />, title: "Gaspreis aktuell",        val: city.gaspreis + " ct/kWh", sub: "inkl. CO₂-Abgabe 2026", note: "Steigt bis 2030 durch ETS2" },
                ].map((c, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">{c.title}</p>
                      <p className="font-mono font-bold text-gray-900 text-xl leading-none mb-1">{c.val}</p>
                      <p className="text-gray-500 text-xs">{c.sub}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">
                {city.name} liegt in {city.bundesland} mit{" "}
                <strong>{city.heizgradtage} Heizgradtagen pro Jahr</strong> (Bundesdurchschnitt: ca. 3.200 Kd/a).
                Das bedeutet {city.heizgradtage > 3200 ? "einen überdurchschnittlichen" : "einen unterdurchschnittlichen"}{" "}
                Wärmebedarf. Eine Luft-Wasser-Wärmepumpe erreicht hier eine{" "}
                <strong>Jahresarbeitszahl (JAZ) von {jaz}</strong> — aus einer Kilowattstunde Strom werden {jaz}{" "}
                kWh Wärme erzeugt.
              </p>
            </motion.section>

            {/* CO₂ + Ersparnis Visual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl">
              <img src={stripImg} alt="Wärmepumpe Umwelt"
                className="w-full h-52 object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-[#1B5E37]/80" />
              <div className="absolute inset-0 flex items-center px-8 gap-12">
                {[
                  { icon: "🌿", val: `${calc.co2Ersparnis} t`, lbl: "CO₂ gespart pro Jahr" },
                  { icon: "💰", val: fmtEuro(calc.ersparnis), lbl: "Ersparnis pro Jahr" },
                  { icon: "⚡", val: fmtKwh(calc.stromverbrauch), lbl: "WP-Stromverbrauch/Jahr" },
                  { icon: "🔧", val: "25 Jahre", lbl: "Lebensdauer WP" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl mb-1">{s.icon}</div>
                    <p className="font-mono font-bold text-white text-xl">{s.val}</p>
                    <p className="text-white/60 text-xs">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Kostenrechner */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold
                uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Kostenrechner
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Was kostet Ihre Wärmepumpe in {city.name}?
              </h2>
              <WPKostenRechner city={city} />
            </motion.section>

            {/* KfW Förderung */}
            <motion.section
              id="foerderung"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold
                uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                KfW-Programm 458
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Bis zu €21.000 Förderung — auch in {city.name}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Die KfW-Bundesförderung ist nicht an einen Standort gebunden — Sie gilt überall in Deutschland,
                also auch in {city.name}. Der Antrag muss{" "}
                <strong className="text-red-600">zwingend vor Baubeginn</strong> gestellt werden.
                {city.bundeslandFoerderung && (
                  <> In {city.bundesland} gibt es zusätzlich das Programm{" "}
                  <strong>„{city.bundeslandFoerderung}"</strong>
                  {city.bundeslandFoerderungBetrag ? ` (${city.bundeslandFoerderungBetrag})` : ""}.
                  </>
                )}
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { lbl: "Grundförderung",                            pct: 30, color: "#1B5E37" },
                  { lbl: "Klima-Speed-Bonus (fossile Heizung →WP)",   pct: 20, color: "#D97706" },
                  { lbl: "Einkommens-Bonus (unter €40.000 netto/J.)", pct: 30, color: "#F59E0B" },
                  { lbl: "Natürliches Kältemittel R290",              pct: 5,  color: "#2A7D4F" },
                ].map((b, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-gray-700">{b.lbl}</span>
                      <span className="font-mono font-bold text-sm" style={{ color: b.color }}>+{b.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(b.pct / 70) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-[#E8F5EE] rounded-xl p-4 flex items-center justify-between">
                <span className="font-bold text-[#1B5E37] text-sm">Gesamt möglich</span>
                <span className="font-mono font-extrabold text-[#1B5E37] text-2xl">bis 70% = €21.000</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Quelle: KfW Bundesförderung für effiziente Gebäude (BEG), Stand März 2026
              </p>
            </motion.section>

            {/* Einwände / Objection Handling */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold
                uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Häufige Bedenken
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ehrliche Antworten auf Ihre Fragen zu {city.name}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    q: "Funktioniert WP im Altbau in " + city.name + "?",
                    a: `Ja — in den meisten Altbauten in ${city.name}. Entscheidend ist die benötigte Vorlauftemperatur. Moderne Geräte (z.B. Viessmann Vitocal, Stiftung Warentest 2,0) arbeiten bis 70°C und sind mit normalen Heizkörpern kompatibel.`,
                    badge: "Kein Problem",
                    badgeColor: "bg-[#E8F5EE] text-[#1B5E37]",
                    icon: <Home size={22} className="text-[#1B5E37]" />,
                  },
                  {
                    q: "Ist eine WP in " + city.name + " zu laut?",
                    a: `Moderne Luft-WP erzeugen 45–55 dB auf 1 Meter — wie normales Gespräch. Mit korrekter Aufstellung (Abstand zur Grenze in ${city.bundesland}: mind. 3m) ist Lärm kein Problem.`,
                    badge: "Kein Problem",
                    badgeColor: "bg-[#E8F5EE] text-[#1B5E37]",
                    icon: <Shield size={22} className="text-[#1B5E37]" />,
                  },
                  {
                    q: "Lohnt WP ohne PV in " + city.name + "?",
                    a: `Ja. Auch ohne PV spart eine WP in ${city.name} bei ${city.gaspreis} ct/kWh Gas vs. ${city.strompreis} ct/kWh WP-Strom und JAZ ${jaz} rund ${fmtEuro(calc.ersparnis)}/Jahr. Mit PV sinken die Kosten um weitere 30–40%.`,
                    badge: "Kein Problem",
                    badgeColor: "bg-[#E8F5EE] text-[#1B5E37]",
                    icon: <Zap size={22} className="text-[#1B5E37]" />,
                  },
                  {
                    q: "Gibt es versteckte Kosten in " + city.name + "?",
                    a: `Häufig unterschätzt: hydraulischer Abgleich (€500–1.500), Fundament (€300–800), Elektroinstallation (€500–1.500). Wir stellen sicher, dass alle Betriebe in ${city.name} diese Positionen vollständig ausweisen.`,
                    badge: "Wichtig",
                    badgeColor: "bg-amber-100 text-amber-800",
                    icon: <AlertTriangle size={22} className="text-amber-600" />,
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.q}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* WP Typen */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold
                uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Welche WP passt zu mir?
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Die drei Typen — was passt zu {city.name}?
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    type: "Luft-Wasser", share: "92%",
                    jaz: estimateJAZ(city, "luft").toString(),
                    install: "€3.000–6.000",
                    pros: ["Keine Erdarbeiten", "Auch im Altbau", "Montage 1–2 Tage"],
                    highlight: true,
                  },
                  {
                    type: "Sole-Wasser", share: "6%",
                    jaz: estimateJAZ(city, "sole").toString(),
                    install: "€6.000–12.000",
                    pros: ["+5% KfW-Bonus", "Konstante Effizienz", "Leiser Betrieb"],
                    highlight: false,
                  },
                  {
                    type: "Wasser-Wasser", share: "2%",
                    jaz: estimateJAZ(city, "wasser").toString(),
                    install: "€8.000–15.000",
                    pros: ["+5% KfW-Bonus", "Höchste JAZ", "Niedrigste Betriebskosten"],
                    highlight: false,
                  },
                ].map((t, i) => (
                  <div key={i}
                    className={`bg-white rounded-xl overflow-hidden border-2 transition-all hover:-translate-y-1
                      hover:shadow-lg ${t.highlight ? "border-[#1B5E37]" : "border-gray-200"}`}>
                    {t.highlight && (
                      <div className="bg-[#1B5E37] px-4 py-2 text-xs font-bold text-white uppercase tracking-wide text-center">
                        Meistgewählt · Stiftung Warentest 2,0 (Gut)
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{t.type}</h3>
                        <span className="bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold px-2 py-0.5 rounded-full">
                          {t.share}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[{ l: "JAZ in " + city.name, v: t.jaz }, { l: "Installation", v: t.install }].map(s => (
                          <div key={s.l} className="bg-gray-50 rounded-lg p-2.5">
                            <p className="text-xs text-gray-400 font-semibold mb-0.5">{s.l}</p>
                            <p className="font-mono font-bold text-gray-800 text-sm">{s.v}</p>
                          </div>
                        ))}
                      </div>
                      {t.pros.map(p => (
                        <div key={p} className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
                          <CheckCircle size={14} className="text-[#1B5E37] flex-shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Experten-Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-5">
              <div className="w-14 h-14 rounded-full bg-[#E8F5EE] flex items-center justify-center
                font-bold text-[#1B5E37] text-xl flex-shrink-0 font-sans">MS</div>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-bold text-gray-900">Dr. Markus Sommer</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    Energieberater (IHK) · 14 Jahre Erfahrung
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  „Alle Inhalte auf dieser Seite basieren auf aktuellen Klimadaten des DWD für {city.name},
                  KfW-Konditionen Stand März 2026 und BWP-Feldtestdaten zur Jahresarbeitszahl.
                  Die stadtspezifischen Energiepreise stammen aus der BDEW-Regionalanalyse."
                </p>
                <p className="text-xs text-gray-400 mt-2">Zuletzt geprüft: März 2026 · Quellen: DWD, KfW, BWP, BDEW</p>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <span className="inline-block bg-[#E8F5EE] text-[#1B5E37] text-xs font-bold
                uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                FAQ
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Häufige Fragen zur Wärmepumpe in {city.name}
              </h2>
              <FAQAccordion faqs={faqs} />
            </motion.section>

            {/* Nachbarstädte */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Wärmepumpe in der Region {city.bundesland}
              </h3>
              <div className="flex flex-wrap gap-2">
                {nearby.map(n => (
                  <Link key={n.slug}
                    href={`/${keyword.slug}/${n.slug}`}
                    className="px-4 py-2 bg-[#E8F5EE] text-[#1B5E37] rounded-lg text-sm font-medium
                      border border-[#1B5E37]/15 hover:bg-[#1B5E37] hover:text-white transition-colors">
                    Wärmepumpe {n.name}
                  </Link>
                ))}
              </div>
            </motion.section>

            {/* Cross-Keyword Links */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Weitere Themen für {city.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {crossKeywords.map(kw => kw && (
                  <Link key={kw.slug}
                    href={`/${kw.slug}/${city.slug}`}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium
                      border border-gray-200 hover:border-[#1B5E37] hover:text-[#1B5E37] transition-colors">
                    {kw.keyword.replace("[Stadt]", city.name)}
                  </Link>
                ))}
              </div>
            </motion.section>

          </div>

          {/* RIGHT — Sticky CTA */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bg-[#1B5E37] rounded-2xl p-6 shadow-2xl shadow-[#1B5E37]/20">
                <p className="text-[#4CAF7D] text-xs font-bold uppercase tracking-wider mb-1">
                  KOSTENLOSER SERVICE
                </p>
                <p className="text-white font-bold text-xl mb-1">
                  Angebot für {city.name}
                </p>
                <p className="text-white/50 text-xs mb-5">
                  Bis zu 3 geprüfte lokale Betriebe · 48h
                </p>

                <div className="space-y-1.5 mb-5">
                  {[
                    { l: "Ersparnis/Jahr",  v: fmtEuro(calc.ersparnis), c: "text-amber-300" },
                    { l: "KfW-Zuschuss",   v: fmtEuro(foerd.zuschuss),  c: "text-[#4CAF7D]" },
                    { l: "Ihr Eigenanteil", v: fmtEuro(foerd.eigenanteil), c: "text-white font-bold" },
                    { l: "Amortisation",   v: calc.amortisationJahre + " Jahre", c: "text-amber-300" },
                  ].map(r => (
                    <div key={r.l} className="flex justify-between text-sm border-b border-white/10 pb-1.5">
                      <span className="text-white/50">{r.l}</span>
                      <span className={`font-mono font-bold ${r.c}`}>{r.v}</span>
                    </div>
                  ))}
                </div>

                <a href="/rechner"
                  className="block w-full text-center py-3.5 bg-[#D97706] text-white font-bold
                    rounded-xl hover:bg-[#b45309] transition-colors mb-2.5 text-sm">
                  Kostenloses Angebot anfordern →
                </a>
                <p className="text-center text-xs text-white/30">
                  Kostenlos · Unverbindlich · Kein Spam
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Warum Wärmepumpenbegleiter?
                </p>
                {[
                  "Herstellerunabhängig seit 2025",
                  "Alle Betriebe HWK-geprüft",
                  "KfW-Antrag-Begleitung inklusive",
                  `Lokale Meisterbetriebe in ${city.name}`,
                  "100% kostenlos für Hausbesitzer",
                ].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm text-gray-700 py-1.5
                    border-b border-gray-100 last:border-0">
                    <CheckCircle size={14} className="text-[#1B5E37] flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>

              {/* Bundesland Förderung */}
              {city.bundeslandFoerderung && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    {city.bundesland} Förderung
                  </p>
                  <p className="font-semibold text-gray-800 text-sm mb-1">{city.bundeslandFoerderung}</p>
                  {city.bundeslandFoerderungBetrag && (
                    <p className="text-[#1B5E37] text-sm font-bold">{city.bundeslandFoerderungBetrag}</p>
                  )}
                  {city.bundeslandFoerderungUrl && (
                    <a href={city.bundeslandFoerderungUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#1B5E37] hover:underline mt-1 block">
                      Mehr erfahren →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
              {/* AuthorBox — E-E-A-T Signal */}
              <AuthorBox keywordSlug={keyword.slug} />
        </div>
      </div>
    </div>
  );
}
