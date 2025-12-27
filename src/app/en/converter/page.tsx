import { Metadata } from 'next';
import Link from 'next/link';
import {
  Thermometer,
  Ruler,
  Scale,
  Timer,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';

export const metadata: Metadata = {
  title: 'Kitchen Measurement Converter | Menucochon',
  description:
    'Free conversion tools for cooking: temperature (Celsius/Fahrenheit), lengths (meters, feet, inches, centimeters) and online timer.',
  keywords: [
    'kitchen converter',
    'measurement conversion',
    'celsius fahrenheit',
    'meter feet',
    'inch centimeter',
    'cooking timer',
    'conversion table',
    'menucochon',
  ],
  alternates: {
    canonical: '/en/converter/',
    languages: {
      'fr-CA': '/convertisseur/',
      'en-CA': '/en/converter/',
    },
  },
  openGraph: {
    title: 'Kitchen Measurement Converter | Menucochon',
    description:
      'Free conversion tools: temperature, lengths and online timer.',
    siteName: 'Menucochon',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kitchen Measurement Converter | Menucochon',
    description:
      'Free conversion tools for cooking: temperature, lengths and timer.',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

const converters = [
  {
    title: 'Celsius to Fahrenheit',
    description: 'Convert temperatures between Celsius and Fahrenheit for your recipes.',
    href: '/en/converter/celsius-fahrenheit',
    icon: Thermometer,
    color: 'bg-red-500',
  },
  {
    title: 'Meters to Feet',
    description: 'Easily convert meters to feet and vice versa.',
    href: '/en/converter/meter-feet',
    icon: Ruler,
    color: 'bg-blue-500',
  },
  {
    title: 'Inches to Feet',
    description: 'Quick conversion between inches and feet for all your measurements.',
    href: '/en/converter/inch-feet',
    icon: Ruler,
    color: 'bg-green-500',
  },
  {
    title: 'Centimeters to Feet',
    description: 'Switch from metric to imperial system in one click.',
    href: '/en/converter/centimeter-feet',
    icon: Ruler,
    color: 'bg-purple-500',
  },
  {
    title: 'Online Timer',
    description: 'A convenient timer to time your cooking with precision.',
    href: '/en/converter/timer',
    icon: Timer,
    color: 'bg-orange-500',
  },
];

// Quick conversion tables
const temperatureTable = [
  { f: '210°F', c: '100°C' },
  { f: '250°F', c: '120°C' },
  { f: '275°F', c: '140°C' },
  { f: '300°F', c: '150°C' },
  { f: '325°F', c: '160°C' },
  { f: '350°F', c: '180°C' },
  { f: '375°F', c: '190°C' },
  { f: '400°F', c: '200°C' },
  { f: '425°F', c: '220°C' },
  { f: '450°F', c: '230°C' },
  { f: '475°F', c: '245°C' },
  { f: '500°F', c: '260°C' },
];

const massTable = [
  { metric: '15 g', imperial: '½ oz' },
  { metric: '30 g', imperial: '1 oz' },
  { metric: '55 g', imperial: '2 oz' },
  { metric: '85 g', imperial: '3 oz' },
  { metric: '115 g', imperial: '4 oz (¼ lb)' },
  { metric: '140 g', imperial: '5 oz' },
  { metric: '170 g', imperial: '6 oz' },
  { metric: '200 g', imperial: '7 oz' },
  { metric: '225 g', imperial: '8 oz (½ lb)' },
  { metric: '340 g', imperial: '12 oz (¾ lb)' },
  { metric: '450 g', imperial: '16 oz (1 lb)' },
  { metric: '900 g', imperial: '2 lb' },
  { metric: '1.35 kg', imperial: '3 lb' },
  { metric: '1.8 kg', imperial: '4 lb' },
  { metric: '2.27 kg', imperial: '5 lb' },
];

const liquidTable = [
  { tsp: '1', tbsp: '⅓', cup: '-', oz: '-', ml: '5' },
  { tsp: '3', tbsp: '1', cup: '1/16', oz: '½', ml: '15' },
  { tsp: '6', tbsp: '2', cup: '⅛', oz: '1', ml: '30' },
  { tsp: '12', tbsp: '4', cup: '¼', oz: '2', ml: '60' },
  { tsp: '24', tbsp: '8', cup: '½', oz: '4', ml: '125' },
  { tsp: '36', tbsp: '12', cup: '¾', oz: '6', ml: '180' },
  { tsp: '48', tbsp: '16', cup: '1', oz: '8', ml: '250' },
];

export default function ConverterPageEN() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-[#F77313]" />
              <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                Practical Tools
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Measurement Converter
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Knowledge at your fingertips. Precise measurements are essential for recipe success.
              Discover our conversion tables for temperature, mass, and liquid measurements.
            </p>
          </div>
        </div>
      </section>

      {/* Ad after hero */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Converters */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="font-display text-3xl text-black mb-8">
          Our Free Conversion Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {converters.map((converter) => (
            <Link
              key={converter.href}
              href={converter.href}
              className="group block border border-neutral-200 hover:border-[#F77313] transition-all"
            >
              <div className="p-6">
                <div className={`w-12 h-12 ${converter.color} text-white flex items-center justify-center mb-4`}>
                  <converter.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-black group-hover:text-[#F77313] transition-colors mb-2">
                  {converter.title}
                </h3>
                <p className="text-neutral-600 text-sm mb-4">
                  {converter.description}
                </p>
                <span className="inline-flex items-center gap-2 text-[#F77313] text-sm font-medium">
                  Use tool
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Conversion Tables */}
      <section className="bg-neutral-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-black mb-8 text-center">
            Quick Conversion Tables
          </h2>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Temperatures */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-red-500 text-white px-6 py-4 flex items-center gap-3">
                <Thermometer className="w-5 h-5" />
                <h3 className="font-display text-lg">Temperatures</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Fahrenheit</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Celsius</th>
                    </tr>
                  </thead>
                  <tbody>
                    {temperatureTable.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-neutral-50' : ''}>
                        <td className="px-4 py-2 text-sm">{row.f}</td>
                        <td className="px-4 py-2 text-sm">{row.c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mass */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-blue-500 text-white px-6 py-4 flex items-center gap-3">
                <Scale className="w-5 h-5" />
                <h3 className="font-display text-lg">Weight</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Metric</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Imperial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {massTable.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-neutral-50' : ''}>
                        <td className="px-4 py-2 text-sm">{row.metric}</td>
                        <td className="px-4 py-2 text-sm">{row.imperial}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Liquids */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-cyan-500 text-white px-6 py-4 flex items-center gap-3">
                <Scale className="w-5 h-5" />
                <h3 className="font-display text-lg">Liquid Measures</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-2 py-3 text-left font-semibold text-neutral-700">tsp</th>
                      <th className="px-2 py-3 text-left font-semibold text-neutral-700">tbsp</th>
                      <th className="px-2 py-3 text-left font-semibold text-neutral-700">Cup</th>
                      <th className="px-2 py-3 text-left font-semibold text-neutral-700">fl oz</th>
                      <th className="px-2 py-3 text-left font-semibold text-neutral-700">ml</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liquidTable.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-neutral-50' : ''}>
                        <td className="px-2 py-2">{row.tsp}</td>
                        <td className="px-2 py-2">{row.tbsp}</td>
                        <td className="px-2 py-2">{row.cup}</td>
                        <td className="px-2 py-2">{row.oz}</td>
                        <td className="px-2 py-2">{row.ml}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad before CTA */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* CTA Timer */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="bg-[#F77313] text-white p-8 md:p-12 text-center">
          <Timer className="w-12 h-12 mx-auto mb-4" />
          <h2 className="font-display text-3xl mb-4">
            Need a timer?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Use our free online timer to time your cooking with precision.
            Simple interface, automatic sound alert.
          </p>
          <Link
            href="/en/converter/timer"
            className="inline-flex items-center gap-2 bg-white text-[#F77313] px-6 py-3 font-medium hover:bg-neutral-100 transition-colors"
          >
            Start timer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
