'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Ruler, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';

const conversionTable = [
  { m: 0.5, ft: 1.6404 },
  { m: 1, ft: 3.2808 },
  { m: 1.5, ft: 4.9212 },
  { m: 2, ft: 6.5616 },
  { m: 2.5, ft: 8.202 },
  { m: 3, ft: 9.8425 },
  { m: 4, ft: 13.123 },
  { m: 5, ft: 16.404 },
  { m: 6, ft: 19.685 },
  { m: 7, ft: 22.966 },
  { m: 8, ft: 26.247 },
  { m: 9, ft: 29.528 },
  { m: 10, ft: 32.808 },
  { m: 15, ft: 49.213 },
  { m: 20, ft: 65.617 },
  { m: 25, ft: 82.021 },
  { m: 50, ft: 164.04 },
  { m: 100, ft: 328.08 },
];

export default function MetrePiedPage() {
  const [metres, setMetres] = useState<string>('');
  const [feet, setFeet] = useState<string>('');

  const metresToFeet = (m: number) => m * 3.28084;
  const feetToMetres = (ft: number) => ft * 0.3048;

  const handleMetresChange = (value: string) => {
    setMetres(value);
    if (value === '') {
      setFeet('');
    } else {
      const m = parseFloat(value);
      if (!isNaN(m)) {
        setFeet(metresToFeet(m).toFixed(4));
      }
    }
  };

  const handleFeetChange = (value: string) => {
    setFeet(value);
    if (value === '') {
      setMetres('');
    } else {
      const ft = parseFloat(value);
      if (!isNaN(ft)) {
        setMetres(feetToMetres(ft).toFixed(4));
      }
    }
  };

  const reset = () => {
    setMetres('');
    setFeet('');
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-neutral-500 hover:text-black">
              Accueil
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/convertisseur" className="text-neutral-500 hover:text-black">
              Convertisseur
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-medium">Mètre - Pied</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/convertisseur"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Tous les convertisseurs
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center">
              <Ruler className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Conversion Mètre en Pieds
              </h1>
              <p className="text-neutral-400 mt-1">Outil gratuit et rapide (2025)</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-lg">
            <span className="bg-neutral-800 text-white px-4 py-2">
              1 mètre = <strong>3.28084 pieds</strong>
            </span>
            <span className="bg-neutral-800 text-white px-4 py-2">
              1 pied = <strong>0.3048 mètre</strong>
            </span>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl mt-6">
            Au Canada, il n&apos;est pas rare de jongler entre le système métrique et le
            système impérial pour mesurer distances, hauteurs et espaces.
          </p>
        </div>
      </section>

      {/* Ad après hero */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Convertisseur */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-neutral-50 border border-neutral-200 p-8">
            <h2 className="font-display text-2xl text-black mb-6 text-center">
              Convertisseur mètre / pied
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Mètres */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mètres (m)
                </label>
                <input
                  type="number"
                  value={metres}
                  onChange={(e) => handleMetresChange(e.target.value)}
                  placeholder="Entrez une valeur"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#F77313] focus:ring-1 focus:ring-[#F77313] outline-none text-lg"
                />
              </div>

              {/* Pieds */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Pieds (ft)
                </label>
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => handleFeetChange(e.target.value)}
                  placeholder="Entrez une valeur"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#F77313] focus:ring-1 focus:ring-[#F77313] outline-none text-lg"
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-black transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Formules */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-8 text-center">
              Formules de conversion
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Par multiplication */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Par multiplication
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  pieds = mètres × 3,2808
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Exemple :</strong> 5 m × 3,2808 = 16,404 pieds
                </p>
              </div>

              {/* Par division */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Par division
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  pieds = mètres ÷ 0,3048
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Exemple :</strong> 5 m ÷ 0,3048 = 16,404 pieds
                </p>
              </div>
            </div>

            {/* Autres conversions */}
            <div className="mt-8 bg-white border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-4">
                Autres conversions utiles
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-neutral-50 p-4">
                  <p className="font-semibold text-neutral-700 mb-2">Mètres carrés en pieds carrés</p>
                  <code className="text-[#F77313]">ft² = m² × 10,7639</code>
                </div>
                <div className="bg-neutral-50 p-4">
                  <p className="font-semibold text-neutral-700 mb-2">Centimètres en pouces</p>
                  <code className="text-[#F77313]">1 cm = 0,3937 pouce</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-black mb-8 text-center">
            Tableau de conversion rapide
          </h2>

          <div className="bg-white border border-neutral-200 overflow-hidden">
            <div className="bg-blue-500 text-white px-6 py-4">
              <h3 className="font-display text-lg">Mètres en Pieds</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mètres (m)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pieds (ft)</th>
                </tr>
              </thead>
              <tbody>
                {conversionTable.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-neutral-50'}>
                    <td className="px-4 py-2 text-sm">{row.m}</td>
                    <td className="px-4 py-2 text-sm">{row.ft}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              Avantages de cet outil
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Conversion instantanée</strong> - Résultats en temps réel
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Interface intuitive</strong> - Simple et facile à utiliser
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Conversion bidirectionnelle</strong> - Mètres vers pieds et pieds vers mètres
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Sans calcul mental</strong> - Laissez l&apos;outil faire le travail
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Autres convertisseurs */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl text-black mb-6">
          Autres convertisseurs
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link
            href="/convertisseur/celsius-fahrenheit"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Celsius - Fahrenheit</span>
          </Link>
          <Link
            href="/convertisseur/pouce-pied"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Pouce en Pieds</span>
          </Link>
          <Link
            href="/convertisseur/centimetre-pied"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Centimètre en Pieds</span>
          </Link>
          <Link
            href="/convertisseur/minuterie"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Minuterie en ligne</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
