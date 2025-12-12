'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Ruler, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';

const conversionTable = [
  { cm: 1, ft: 0.0328 },
  { cm: 10, ft: 0.3281 },
  { cm: 50, ft: 1.6404 },
  { cm: 100, ft: 3.2808 },
  { cm: 150, ft: 4.9213 },
  { cm: 160, ft: 5.2493 },
  { cm: 170, ft: 5.5774 },
  { cm: 180, ft: 5.9055 },
  { cm: 190, ft: 6.2336 },
  { cm: 200, ft: 6.5617 },
];

const heightTable = [
  { cm: 150, ftIn: '4\' 11"' },
  { cm: 155, ftIn: '5\' 1"' },
  { cm: 160, ftIn: '5\' 3"' },
  { cm: 165, ftIn: '5\' 5"' },
  { cm: 170, ftIn: '5\' 7"' },
  { cm: 175, ftIn: '5\' 9"' },
  { cm: 180, ftIn: '5\' 11"' },
  { cm: 185, ftIn: '6\' 1"' },
  { cm: 190, ftIn: '6\' 3"' },
  { cm: 195, ftIn: '6\' 5"' },
  { cm: 200, ftIn: '6\' 7"' },
];

export default function CentimeterFeetPageEN() {
  const [cm, setCm] = useState<string>('');
  const [feet, setFeet] = useState<string>('');
  const [feetInches, setFeetInches] = useState<string>('');

  const cmToFeet = (centimeters: number) => centimeters * 0.032808;
  const feetToCm = (ft: number) => ft / 0.032808;

  const cmToFeetInches = (centimeters: number) => {
    const totalInches = centimeters * 0.3937;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${ft}' ${inches}"`;
  };

  const handleCmChange = (value: string) => {
    setCm(value);
    if (value === '') {
      setFeet('');
      setFeetInches('');
    } else {
      const centimeters = parseFloat(value);
      if (!isNaN(centimeters)) {
        setFeet(cmToFeet(centimeters).toFixed(4));
        setFeetInches(cmToFeetInches(centimeters));
      }
    }
  };

  const handleFeetChange = (value: string) => {
    setFeet(value);
    if (value === '') {
      setCm('');
      setFeetInches('');
    } else {
      const ft = parseFloat(value);
      if (!isNaN(ft)) {
        const centimeters = feetToCm(ft);
        setCm(centimeters.toFixed(2));
        setFeetInches(cmToFeetInches(centimeters));
      }
    }
  };

  const reset = () => {
    setCm('');
    setFeet('');
    setFeetInches('');
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
            <span className="text-black font-medium">Centimeters - Feet</span>
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
            <div className="w-14 h-14 bg-purple-500 text-white flex items-center justify-center">
              <Ruler className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Centimeters to Feet Conversion
              </h1>
              <p className="text-neutral-400 mt-1">Free and fast tool (2025)</p>
            </div>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl">
            Easily convert between the metric system (centimeters) and the
            imperial system (feet), particularly useful in Canada.
          </p>
        </div>
      </section>

      {/* Equivalences */}
      <section className="bg-neutral-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="bg-white px-4 py-2 border border-neutral-200">
              <strong>1 foot</strong> = 30.48 cm
            </div>
            <div className="bg-white px-4 py-2 border border-neutral-200">
              <strong>1 cm</strong> ≈ 0.032808 foot
            </div>
          </div>
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
              cm / feet Converter
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Centimeters */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Centimeters (cm)
                </label>
                <input
                  type="number"
                  value={cm}
                  onChange={(e) => handleCmChange(e.target.value)}
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

            {/* Result in feet and inches */}
            {feetInches && (
              <div className="mt-6 bg-[#F77313] text-white p-4 text-center">
                <span className="text-sm opacity-80">In feet and inches:</span>
                <p className="font-display text-2xl">{feetInches}</p>
              </div>
            )}

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
              {/* Formula 1 */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Formula 1 (multiplication)
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  feet = cm × 0.032808
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Example:</strong> 175 cm × 0.032808 = 5.74 feet
                </p>
              </div>

              {/* Formula 2 */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Formula 2 (division)
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  feet = cm ÷ 30.48
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Example:</strong> 175 cm ÷ 30.48 = 5.74 feet
                </p>
              </div>
            </div>

            {/* Conversion to feet and inches */}
            <div className="mt-8 bg-white border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-4">
                Conversion to Feet and Inches
              </h3>
              <p className="text-neutral-600 text-sm mb-4">
                To express a measurement in feet and inches (American format):
              </p>
              <div className="bg-neutral-50 p-4 text-sm">
                <p className="mb-2"><strong>Example: 175 cm</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                  <li>175 × 0.3937 = 68.90 inches</li>
                  <li>68.90 ÷ 12 = 5 feet and 8.9 inches</li>
                  <li>Result: <strong>5&apos;9&quot;</strong> (approximately)</li>
                </ol>
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
            {/* cm to feet table */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-purple-500 text-white px-6 py-4">
                <h3 className="font-display text-lg">Centimeters to Feet</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">cm</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Feet</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionTable.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-neutral-50'}>
                      <td className="px-4 py-2 text-sm">{row.cm}</td>
                      <td className="px-4 py-2 text-sm">{row.ft}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Heights table */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-[#F77313] text-white px-6 py-4">
                <h3 className="font-display text-lg">Human Heights</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">cm</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Feet &amp; inches</th>
                  </tr>
                </thead>
                <tbody>
                  {heightTable.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-neutral-50'}>
                      <td className="px-4 py-2 text-sm">{row.cm} cm</td>
                      <td className="px-4 py-2 text-sm font-medium">{row.ftIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

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
                  <strong>Express your height in imperial system</strong> - American format (5&apos;9&quot;)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Read North American plans</strong> - Construction, renovation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Order furniture</strong> - Imperial dimensions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>International comparisons</strong> - Sports, health, travel
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Foot definition */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-50 border border-neutral-200 p-6">
            <h2 className="font-display text-xl text-black mb-4">
              What is a Foot?
            </h2>
            <p className="text-neutral-600">
              A foot equals <strong>12 inches</strong> or <strong>30.48 centimeters</strong>.
              It&apos;s an imperial unit used mainly in the United States, Canada
              (sometimes), and in certain technical fields like construction and aviation.
            </p>
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
