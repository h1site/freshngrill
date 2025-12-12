'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Thermometer, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';

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
  { c: 100, f: 210, desc: 'Very low' },
  { c: 120, f: 250, desc: 'Low' },
  { c: 150, f: 300, desc: 'Moderate-low' },
  { c: 180, f: 350, desc: 'Moderate' },
  { c: 190, f: 375, desc: 'Moderate-high' },
  { c: 200, f: 400, desc: 'Hot' },
  { c: 220, f: 425, desc: 'Very hot' },
  { c: 240, f: 475, desc: 'Extremely hot' },
  { c: 260, f: 500, desc: 'Broil' },
];

export default function CelsiusFahrenheitPageEN() {
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
            <Link href="/en" className="text-neutral-500 hover:text-black">
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/en/converter" className="text-neutral-500 hover:text-black">
              Converter
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
            href="/en/converter"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            All converters
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-red-500 text-white flex items-center justify-center">
              <Thermometer className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Celsius to Fahrenheit Conversion
              </h1>
              <p className="text-neutral-400 mt-1">Free and fast tool (2025)</p>
            </div>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl">
            In Canada and elsewhere, it&apos;s common to convert temperatures between
            Celsius and Fahrenheit. Celsius is used worldwide while Fahrenheit
            remains standard in the United States.
          </p>
        </div>
      </section>

      {/* Ad after hero */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Converter */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-neutral-50 border border-neutral-200 p-8">
            <h2 className="font-display text-2xl text-black mb-6 text-center">
              Temperature Converter
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
                  placeholder="Enter a value"
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
                  placeholder="Enter a value"
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
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-8 text-center">
              Conversion Formulas
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Celsius to Fahrenheit */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Celsius to Fahrenheit
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  °F = (°C × 9/5) + 32
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Example:</strong> 20°C = (20 × 9/5) + 32 = 68°F
                </p>
              </div>

              {/* Fahrenheit to Celsius */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Fahrenheit to Celsius
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  °C = (°F - 32) × 5/9
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Example:</strong> 98.6°F = (98.6 - 32) × 5/9 = 37°C
                </p>
              </div>
            </div>

            {/* Reference points */}
            <div className="mt-8 bg-white border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-4">
                Differences Between Scales
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-600">
                    <strong>Celsius Scale:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-neutral-600">
                    <li>• Water freezes at <strong>0°C</strong></li>
                    <li>• Water boils at <strong>100°C</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="text-neutral-600">
                    <strong>Fahrenheit Scale:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-neutral-600">
                    <li>• Water freezes at <strong>32°F</strong></li>
                    <li>• Water boils at <strong>212°F</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tables */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-black mb-8 text-center">
            Quick Conversion Tables
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* General table */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-red-500 text-white px-6 py-4">
                <h3 className="font-display text-lg">General Conversion</h3>
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

            {/* Oven temperatures */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-orange-500 text-white px-6 py-4">
                <h3 className="font-display text-lg">Oven Temperatures</h3>
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

      {/* Ad before use cases */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Use cases */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              When to Use This Converter?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Checking American weather</strong> - Forecasts in the US are in Fahrenheit
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Understanding oven temperatures</strong> - American recipes use Fahrenheit
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Setting a thermostat while traveling</strong> - Avoid temperature surprises
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Comparing scientific data</strong> - Some publications use Fahrenheit
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Other converters */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl text-black mb-6">
          Other Converters
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link
            href="/en/converter/meter-feet"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Meters to Feet</span>
          </Link>
          <Link
            href="/en/converter/inch-feet"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Inches to Feet</span>
          </Link>
          <Link
            href="/en/converter/centimeter-feet"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Centimeters to Feet</span>
          </Link>
          <Link
            href="/en/converter/timer"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Online Timer</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
