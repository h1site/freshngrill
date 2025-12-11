'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Thermometer, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';

// Metadata doit être dans un fichier séparé pour les client components
// export const metadata est dans layout.tsx

const conversionTable = [
  { c: -20, f: -4 },
  { c: -10, f: 14 },
  { c: 0, f: 32 },
  { c: 10, f: 50 },
  { c: 20, f: 68 },
  { c: 25, f: 77 },
  { c: 30, f: 86 },
  { c: 37, f: 98.6 },
  { c: 40, f: 104 },
  { c: 100, f: 212 },
  { c: 120, f: 248 },
  { c: 140, f: 284 },
  { c: 160, f: 320 },
  { c: 180, f: 356 },
  { c: 200, f: 392 },
  { c: 220, f: 428 },
  { c: 240, f: 464 },
  { c: 260, f: 500 },
];

const ovenTemps = [
  { c: 100, f: 210, desc: 'Très doux' },
  { c: 120, f: 250, desc: 'Doux' },
  { c: 150, f: 300, desc: 'Modéré-doux' },
  { c: 180, f: 350, desc: 'Modéré' },
  { c: 190, f: 375, desc: 'Modéré-chaud' },
  { c: 200, f: 400, desc: 'Chaud' },
  { c: 220, f: 425, desc: 'Très chaud' },
  { c: 240, f: 475, desc: 'Très très chaud' },
  { c: 260, f: 500, desc: 'Gril / Broil' },
];

export default function CelsiusFahrenheitPage() {
  const [celsius, setCelsius] = useState<string>('');
  const [fahrenheit, setFahrenheit] = useState<string>('');

  const celsiusToFahrenheit = (c: number) => (c * 9) / 5 + 32;
  const fahrenheitToCelsius = (f: number) => ((f - 32) * 5) / 9;

  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    if (value === '') {
      setFahrenheit('');
    } else {
      const c = parseFloat(value);
      if (!isNaN(c)) {
        setFahrenheit(celsiusToFahrenheit(c).toFixed(2));
      }
    }
  };

  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    if (value === '') {
      setCelsius('');
    } else {
      const f = parseFloat(value);
      if (!isNaN(f)) {
        setCelsius(fahrenheitToCelsius(f).toFixed(2));
      }
    }
  };

  const reset = () => {
    setCelsius('');
    setFahrenheit('');
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
            <span className="text-black font-medium">Celsius - Fahrenheit</span>
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
            <div className="w-14 h-14 bg-red-500 text-white flex items-center justify-center">
              <Thermometer className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Conversion Celsius en Fahrenheit
              </h1>
              <p className="text-neutral-400 mt-1">Outil gratuit et rapide (2025)</p>
            </div>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl">
            Au Canada et ailleurs, il est courant de devoir convertir les températures entre
            Celsius et Fahrenheit. Le Celsius prédomine mondialement tandis que le Fahrenheit
            reste utilisé aux États-Unis.
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
              Convertisseur de température
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Celsius */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Celsius (°C)
                </label>
                <input
                  type="number"
                  value={celsius}
                  onChange={(e) => handleCelsiusChange(e.target.value)}
                  placeholder="Entrez une valeur"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#F77313] focus:ring-1 focus:ring-[#F77313] outline-none text-lg"
                />
              </div>

              {/* Fahrenheit */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Fahrenheit (°F)
                </label>
                <input
                  type="number"
                  value={fahrenheit}
                  onChange={(e) => handleFahrenheitChange(e.target.value)}
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
              {/* Celsius vers Fahrenheit */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Celsius vers Fahrenheit
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  °F = (°C × 9/5) + 32
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Exemple :</strong> 20°C = (20 × 9/5) + 32 = 68°F
                </p>
              </div>

              {/* Fahrenheit vers Celsius */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Fahrenheit vers Celsius
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  °C = (°F - 32) × 5/9
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Exemple :</strong> 98,6°F = (98,6 - 32) × 5/9 = 37°C
                </p>
              </div>
            </div>

            {/* Points de référence */}
            <div className="mt-8 bg-white border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-4">
                Différences entre les échelles
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-600">
                    <strong>Échelle Celsius :</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-neutral-600">
                    <li>• L&apos;eau gèle à <strong>0°C</strong></li>
                    <li>• L&apos;eau bout à <strong>100°C</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="text-neutral-600">
                    <strong>Échelle Fahrenheit :</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-neutral-600">
                    <li>• L&apos;eau gèle à <strong>32°F</strong></li>
                    <li>• L&apos;eau bout à <strong>212°F</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tableaux */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-black mb-8 text-center">
            Tableaux de conversion rapide
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tableau général */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-red-500 text-white px-6 py-4">
                <h3 className="font-display text-lg">Conversion générale</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Celsius</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Fahrenheit</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionTable.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-neutral-50'}>
                      <td className="px-4 py-2 text-sm">{row.c}°C</td>
                      <td className="px-4 py-2 text-sm">{row.f}°F</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Températures de four */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-orange-500 text-white px-6 py-4">
                <h3 className="font-display text-lg">Températures de four</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">°C</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">°F</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ovenTemps.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-neutral-50'}>
                      <td className="px-4 py-2 text-sm">{row.c}°</td>
                      <td className="px-4 py-2 text-sm">{row.f}°</td>
                      <td className="px-4 py-2 text-sm text-neutral-600">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Ad avant cas d'usage */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Cas d'usage */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              Quand utiliser ce convertisseur ?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Consulter la météo américaine</strong> - Les prévisions aux États-Unis sont en Fahrenheit
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Comprendre les températures de four</strong> - Les recettes américaines utilisent le Fahrenheit
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Régler un thermostat en voyage</strong> - Évitez les surprises de température
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Comparer des données scientifiques</strong> - Certaines publications utilisent le Fahrenheit
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
            href="/convertisseur/metre-pied"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Mètre en Pieds</span>
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
