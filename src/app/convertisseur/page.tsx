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
  title: 'Convertisseur de Mesures en Cuisine | Menucochon',
  description:
    'Outils de conversion gratuits pour la cuisine : température (Celsius/Fahrenheit), longueurs (mètres, pieds, pouces, centimètres) et minuterie en ligne.',
  keywords: [
    'convertisseur cuisine',
    'conversion mesures',
    'celsius fahrenheit',
    'mètre pied',
    'pouce centimètre',
    'minuterie cuisine',
    'tableau conversion',
    'menucochon',
  ],
  alternates: {
    canonical: '/convertisseur/',
  },
  openGraph: {
    title: 'Convertisseur de Mesures en Cuisine | Menucochon',
    description:
      'Outils de conversion gratuits : température, longueurs et minuterie en ligne.',
    siteName: 'Menucochon',
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convertisseur de Mesures en Cuisine | Menucochon',
    description:
      'Outils de conversion gratuits pour la cuisine : température, longueurs et minuterie.',
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
    title: 'Celsius en Fahrenheit',
    description: 'Convertissez les températures entre Celsius et Fahrenheit pour vos recettes.',
    href: '/convertisseur/celsius-fahrenheit',
    icon: Thermometer,
    color: 'bg-red-500',
  },
  {
    title: 'Mètre en Pieds',
    description: 'Convertissez facilement les mètres en pieds et vice-versa.',
    href: '/convertisseur/metre-pied',
    icon: Ruler,
    color: 'bg-blue-500',
  },
  {
    title: 'Pouce en Pieds',
    description: 'Conversion rapide entre pouces et pieds pour toutes vos mesures.',
    href: '/convertisseur/pouce-pied',
    icon: Ruler,
    color: 'bg-green-500',
  },
  {
    title: 'Centimètre en Pieds',
    description: 'Passez du système métrique au système impérial en un clic.',
    href: '/convertisseur/centimetre-pied',
    icon: Ruler,
    color: 'bg-purple-500',
  },
  {
    title: 'Minuterie en ligne',
    description: 'Une minuterie pratique pour chronométrer vos cuissons avec précision.',
    href: '/convertisseur/minuterie',
    icon: Timer,
    color: 'bg-orange-500',
  },
];

// Tableaux de conversion rapide
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
  { metric: '1,35 kg', imperial: '3 lb' },
  { metric: '1,8 kg', imperial: '4 lb' },
  { metric: '2,27 kg', imperial: '5 lb' },
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

export default function ConvertisseurPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-[#F77313]" />
              <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                Outils pratiques
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Convertisseur de Mesures
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              La connaissance devant votre écran. La précision des mesures est une étape
              essentielle pour garantir le succès d&apos;une recette. Découvrez nos tableaux
              de conversion pour température, masse et mesures liquides.
            </p>
          </div>
        </div>
      </section>

      {/* Ad après hero */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Convertisseurs */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="font-display text-3xl text-black mb-8">
          Nos outils de conversion gratuits
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
                  Utiliser l&apos;outil
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tableaux de conversion */}
      <section className="bg-neutral-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-black mb-8 text-center">
            Tableaux de conversion rapide
          </h2>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Températures */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-red-500 text-white px-6 py-4 flex items-center gap-3">
                <Thermometer className="w-5 h-5" />
                <h3 className="font-display text-lg">Températures</h3>
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

            {/* Masses */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-blue-500 text-white px-6 py-4 flex items-center gap-3">
                <Scale className="w-5 h-5" />
                <h3 className="font-display text-lg">Masses</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Métrique</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Impérial</th>
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

            {/* Liquides */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-cyan-500 text-white px-6 py-4 flex items-center gap-3">
                <Scale className="w-5 h-5" />
                <h3 className="font-display text-lg">Mesures liquides</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-2 py-3 text-left font-semibold text-neutral-700">c. à thé</th>
                      <th className="px-2 py-3 text-left font-semibold text-neutral-700">c. à soupe</th>
                      <th className="px-2 py-3 text-left font-semibold text-neutral-700">Tasse</th>
                      <th className="px-2 py-3 text-left font-semibold text-neutral-700">oz liq.</th>
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

      {/* Ad avant CTA */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* CTA Minuterie */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="bg-[#F77313] text-white p-8 md:p-12 text-center">
          <Timer className="w-12 h-12 mx-auto mb-4" />
          <h2 className="font-display text-3xl mb-4">
            Besoin d&apos;une minuterie ?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Utilisez notre minuterie en ligne gratuite pour chronométrer vos cuissons
            avec précision. Interface simple, alerte sonore automatique.
          </p>
          <Link
            href="/convertisseur/minuterie"
            className="inline-flex items-center gap-2 bg-white text-[#F77313] px-6 py-3 font-medium hover:bg-neutral-100 transition-colors"
          >
            Lancer la minuterie
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
