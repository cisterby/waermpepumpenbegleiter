'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CityProps {
  name: string;
  strompreis: number;
  gaspreis: number;
  avgTemp: number;
  bundesland: string;
}

interface InlineCalculatorProps {
  city: CityProps;
  jaz: number;
  foerdSatz: number;
}

export default function InlineCalculator({
  city,
  jaz,
  foerdSatz,
}: InlineCalculatorProps) {
  // State for user inputs
  const [wohnflaeche, setWohnflaeche] = useState<number>(120);
  const [gebaeudealter, setGebaeudealter] = useState<
    'vor 1978' | '1979-1994' | '1995-2009' | 'nach 2010'
  >('vor 1978');
  const [aktuelleHeizung, setAktuelleHeizung] = useState<
    'Erdgas' | 'Öl' | 'Elektro' | 'Fernwärme'
  >('Erdgas');

  // Calculate heating load factors based on building age
  const getHeizlastFactor = (alter: string): number => {
    switch (alter) {
      case 'vor 1978':
        return 160;
      case '1979-1994':
        return 130;
      case '1995-2009':
        return 100;
      case 'nach 2010':
        return 70;
      default:
        return 160;
    }
  };

  // Calculate annual heating load (kWh/year)
  const heizlast = wohnflaeche * getHeizlastFactor(gebaeudealter);

  // Calculate current heating costs (gas)
  const gasKosten = (heizlast * city.gaspreis) / 100;

  // Calculate heat pump electricity consumption
  const wpStrom = heizlast / jaz;

  // Calculate heat pump costs
  const wpKosten = (wpStrom * city.strompreis) / 100;

  // Annual savings
  const ersparnis = gasKosten - wpKosten;

  // Investment cost estimate (€/m² varies from 150-270 depending on building age)
  const getInvestitionProM2 = (alter: string): number => {
    switch (alter) {
      case 'vor 1978':
        return 270;
      case '1979-1994':
        return 230;
      case '1995-2009':
        return 180;
      case 'nach 2010':
        return 150;
      default:
        return 270;
    }
  };

  const investition = wohnflaeche * getInvestitionProM2(gebaeudealter);

  // KfW funding amount
  const foerderung = (investition * foerdSatz) / 100;

  // Own contribution
  const eigenanteil = investition - foerderung;

  // Payback period in years (avoid division by zero)
  const amortisation = ersparnis > 0 ? eigenanteil / ersparnis : 0;

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1A4731] mb-2">
          Wärmepumpen-Kosten­rechner
        </h2>
        <p className="text-gray-600">
          Für {city.name} ({city.bundesland})
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Wohnfläche Input */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-[#1A4731] mb-3">
            Wohnfläche (m²)
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="range"
              min="80"
              max="300"
              step="10"
              value={wohnflaeche}
              onChange={(e) => setWohnflaeche(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3DA16A]"
            />
            <input
              type="number"
              min="80"
              max="300"
              step="10"
              value={wohnflaeche}
              onChange={(e) => setWohnflaeche(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:border-[#3DA16A]"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">80 – 300 m²</p>
        </div>

        {/* Gebäudealter Select */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-[#1A4731] mb-3">
            Gebäudealter
          </label>
          <select
            value={gebaeudealter}
            onChange={(e) =>
              setGebaeudealter(
                e.target.value as 'vor 1978' | '1979-1994' | '1995-2009' | 'nach 2010'
              )
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3DA16A] text-gray-700"
          >
            <option value="vor 1978">vor 1978</option>
            <option value="1979-1994">1979–1994</option>
            <option value="1995-2009">1995–2009</option>
            <option value="nach 2010">nach 2010</option>
          </select>
        </div>

        {/* Aktuelle Heizung Select */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-lg font-semibold text-[#1A4731] mb-3">
            Aktuelle Heizung
          </label>
          <select
            value={aktuelleHeizung}
            onChange={(e) =>
              setAktuelleHeizung(
                e.target.value as 'Erdgas' | 'Öl' | 'Elektro' | 'Fernwärme'
              )
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3DA16A] text-gray-700"
          >
            <option value="Erdgas">Erdgas</option>
            <option value="Öl">Öl</option>
            <option value="Elektro">Elektro</option>
            <option value="Fernwärme">Fernwärme</option>
          </select>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gradient-to-br from-[#f0fdf4] to-[#f0f9ff] rounded-xl p-6 mb-8">
        <h3 className="text-2xl font-bold text-[#1A4731] mb-6">Ergebnisse</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Annual Gas Heating Cost */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Jährliche Heizkosten (aktuell)
            </p>
            <p className="text-3xl font-bold text-[#1A4731]">
              {gasKosten.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-gray-500 mt-2">{heizlast.toLocaleString('de-DE')} kWh/a</p>
          </div>

          {/* Annual Heat Pump Cost */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Jährliche Heizkosten (Wärmepumpe)
            </p>
            <p className="text-3xl font-bold text-[#3DA16A]">
              {wpKosten.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-gray-500 mt-2">{wpStrom.toLocaleString('de-DE')} kWh/a</p>
          </div>

          {/* Annual Savings */}
          <div className="bg-white rounded-lg p-5 border border-[#D97706]">
            <p className="text-sm text-gray-600 mb-2">Jährliche Ersparnis</p>
            <p className="text-3xl font-bold text-[#D97706]">
              {ersparnis.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {ersparnis > 0
                ? `${((ersparnis / gasKosten) * 100).toFixed(0)}% weniger`
                : 'Keine Ersparnis'}
            </p>
          </div>

          {/* Investment Cost */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Investitionskosten</p>
            <p className="text-3xl font-bold text-[#1A4731]">
              {investition.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {(investition / wohnflaeche).toFixed(0)} €/m²
            </p>
          </div>

          {/* KfW Funding */}
          <div className="bg-white rounded-lg p-5 border border-[#3DA16A]">
            <p className="text-sm text-gray-600 mb-2">KfW-Förderung</p>
            <p className="text-3xl font-bold text-[#3DA16A]">
              {foerderung.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-gray-500 mt-2">{foerdSatz}% Förderquote</p>
          </div>

          {/* Your Contribution */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Ihr Eigenanteil</p>
            <p className="text-3xl font-bold text-[#1A4731]">
              {eigenanteil.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-gray-500 mt-2">nach KfW-Förderung</p>
          </div>

          {/* Payback Period */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 md:col-span-2 lg:col-span-1">
            <p className="text-sm text-gray-600 mb-2">Amortisationsdauer</p>
            {amortisation > 0 ? (
              <>
                <p className="text-3xl font-bold text-[#1A4731]">
                  {amortisation.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Jahre</p>
              </>
            ) : (
              <p className="text-lg text-gray-500">Berechnung nicht möglich</p>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-[#D97706] rounded-lg p-4 mb-8">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Hinweis:</span> Alle Angaben sind
          Schätzwerte. Für ein verbindliches Angebot kontaktieren Sie einen
          Fachbetrieb.
        </p>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center">
        <Link
          href="/rechner"
          className="inline-block px-8 py-4 bg-[#3DA16A] hover:bg-[#1A4731] text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Jetzt kostenloses Angebot anfordern →
        </Link>
      </div>
    </div>
  );
}
