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

export default function MeterFeetPageEN() {
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
            <Link href="/en" className="text-neutral-500 hover:text-black">
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/en/converter" className="text-neutral-500 hover:text-black">
              Converter
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-medium">Meters - Feet</span>
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
            <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center">
              <Ruler className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Meters to Feet Conversion
              </h1>
              <p className="text-neutral-400 mt-1">Free and fast tool (2025)</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-lg">
            <span className="bg-neutral-800 text-white px-4 py-2">
              1 meter = <strong>3.28084 feet</strong>
            </span>
            <span className="bg-neutral-800 text-white px-4 py-2">
              1 foot = <strong>0.3048 meter</strong>
            </span>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl mt-6">
            In Canada, it&apos;s common to juggle between the metric and
            imperial systems for measuring distances, heights, and spaces.
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
              Meter / Feet Converter
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Meters */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Meters (m)
                </label>
                <input
                  type="number"
                  value={metres}
                  onChange={(e) => handleMetresChange(e.target.value)}
                  placeholder="Enter a value"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#F77313] focus:ring-1 focus:ring-[#F77313] outline-none text-lg"
                />
              </div>

              {/* Feet */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Feet (ft)
                </label>
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => handleFeetChange(e.target.value)}
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
              {/* By multiplication */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  By Multiplication
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  feet = meters × 3.2808
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Example:</strong> 5 m × 3.2808 = 16.404 feet
                </p>
              </div>

              {/* By division */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  By Division
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  feet = meters ÷ 0.3048
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Example:</strong> 5 m ÷ 0.3048 = 16.404 feet
                </p>
              </div>
            </div>

            {/* Other conversions */}
            <div className="mt-8 bg-white border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-4">
                Other Useful Conversions
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-neutral-50 p-4">
                  <p className="font-semibold text-neutral-700 mb-2">Square meters to square feet</p>
                  <code className="text-[#F77313]">ft² = m² × 10.7639</code>
                </div>
                <div className="bg-neutral-50 p-4">
                  <p className="font-semibold text-neutral-700 mb-2">Centimeters to inches</p>
                  <code className="text-[#F77313]">1 cm = 0.3937 inch</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-black mb-8 text-center">
            Quick Conversion Table
          </h2>

          <div className="bg-white border border-neutral-200 overflow-hidden">
            <div className="bg-blue-500 text-white px-6 py-4">
              <h3 className="font-display text-lg">Meters to Feet</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Meters (m)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Feet (ft)</th>
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

      {/* Benefits */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              Benefits of This Tool
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Instant conversion</strong> - Real-time results
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Intuitive interface</strong> - Simple and easy to use
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Two-way conversion</strong> - Meters to feet and feet to meters
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>No mental math</strong> - Let the tool do the work
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
            href="/en/converter/celsius-fahrenheit"
            className="p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
          >
            <span className="font-display text-black">Celsius - Fahrenheit</span>
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
