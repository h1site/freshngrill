'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Ruler, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';

const conversionTable = [
  { inch: 1, ft: 0.0833 },
  { inch: 2, ft: 0.1667 },
  { inch: 3, ft: 0.25 },
  { inch: 4, ft: 0.3333 },
  { inch: 5, ft: 0.4167 },
  { inch: 6, ft: 0.5 },
  { inch: 12, ft: 1 },
  { inch: 18, ft: 1.5 },
  { inch: 24, ft: 2 },
  { inch: 30, ft: 2.5 },
  { inch: 36, ft: 3 },
  { inch: 48, ft: 4 },
  { inch: 60, ft: 5 },
  { inch: 72, ft: 6 },
  { inch: 84, ft: 7 },
  { inch: 96, ft: 8 },
];

export default function InchFeetPageEN() {
  const [inches, setInches] = useState<string>('');
  const [feet, setFeet] = useState<string>('');

  const inchesToFeet = (inch: number) => inch / 12;
  const feetToInches = (ft: number) => ft * 12;

  const handleInchesChange = (value: string) => {
    setInches(value);
    if (value === '') {
      setFeet('');
    } else {
      const inch = parseFloat(value);
      if (!isNaN(inch)) {
        setFeet(inchesToFeet(inch).toFixed(4));
      }
    }
  };

  const handleFeetChange = (value: string) => {
    setFeet(value);
    if (value === '') {
      setInches('');
    } else {
      const ft = parseFloat(value);
      if (!isNaN(ft)) {
        setInches(feetToInches(ft).toFixed(2));
      }
    }
  };

  const reset = () => {
    setInches('');
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
            <span className="text-black font-medium">Inches - Feet</span>
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
            <div className="w-14 h-14 bg-green-500 text-white flex items-center justify-center">
              <Ruler className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Inches to Feet: Easy Conversion
              </h1>
              <p className="text-neutral-400 mt-1">In 1 click</p>
            </div>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl">
            Free online calculator, ideal for heights, furniture, and distances.
            In Canada, conversion between metric and imperial systems remains necessary.
          </p>
        </div>
      </section>

      {/* Equivalences */}
      <section className="bg-neutral-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="bg-white px-4 py-2 border border-neutral-200">
              <strong>1 inch</strong> = 2.54 cm = 0.083333 foot
            </div>
            <div className="bg-white px-4 py-2 border border-neutral-200">
              <strong>1 foot</strong> = 30.48 cm = 12 inches
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
              Inch / Feet Converter
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Inches */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Inches (in)
                </label>
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => handleInchesChange(e.target.value)}
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
              {/* Inches to feet */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  From Inches to Feet
                </h3>
                <div className="space-y-3">
                  <div className="bg-neutral-100 p-4 font-mono text-center">
                    feet = inches × 0.083333
                  </div>
                  <div className="bg-neutral-100 p-4 font-mono text-center">
                    feet = inches ÷ 12
                  </div>
                </div>
                <p className="text-neutral-600 text-sm mt-4">
                  <strong>Example:</strong> 36 inches ÷ 12 = 3 feet
                </p>
              </div>

              {/* Feet to inches */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  From Feet to Inches
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center mb-4">
                  inches = feet × 12
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Example:</strong> 5 feet × 12 = 60 inches
                </p>
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
            <div className="bg-green-500 text-white px-6 py-4">
              <h3 className="font-display text-lg">Inches to Feet</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Inches (in)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Feet (ft)</th>
                </tr>
              </thead>
              <tbody>
                {conversionTable.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-neutral-50'}>
                    <td className="px-4 py-2 text-sm">{row.inch}</td>
                    <td className="px-4 py-2 text-sm">{row.ft}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              Unit History
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-3">The Foot</h3>
                <p className="text-neutral-600 text-sm">
                  The foot historically comes from the average length of a human foot.
                  This unit was later standardized to ensure consistent measurements.
                </p>
              </div>
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-3">The Inch</h3>
                <p className="text-neutral-600 text-sm">
                  The inch historically represents the width of a human thumb. It was
                  standardized to exactly 2.54 centimeters in the international system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl text-black mb-6">
            When to Use This Converter?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
              <span className="text-neutral-700">
                <strong>Measuring body heights</strong> - Convert your height to feet and inches
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
              <span className="text-neutral-700">
                <strong>Converting furniture dimensions</strong> - Understand American measurements
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
              <span className="text-neutral-700">
                <strong>Understanding Anglo-Saxon documents</strong> - Plans, technical specs
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Related conversions */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              Related Conversions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-200 p-4">
                <p className="font-semibold text-neutral-700 mb-2">Square inches to square feet</p>
                <code className="text-[#F77313]">ft² = in² × 0.0069444</code>
              </div>
              <div className="bg-white border border-neutral-200 p-4">
                <p className="font-semibold text-neutral-700 mb-2">Centimeters to inches</p>
                <code className="text-[#F77313]">1 cm = 0.3937 inch</code>
              </div>
            </div>
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
