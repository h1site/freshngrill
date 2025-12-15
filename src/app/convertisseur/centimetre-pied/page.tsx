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

export default function CentimetrePiedPage() {
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
            <Link href="/" className="text-neutral-500 hover:text-black">
              Accueil
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/convertisseur" className="text-neutral-500 hover:text-black">
              Convertisseur
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-medium">Centimètre - Pied</span>
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
            <div className="w-14 h-14 bg-purple-500 text-white flex items-center justify-center">
              <Ruler className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Conversion Centimètre en Pieds
              </h1>
              <p className="text-neutral-400 mt-1">Outil gratuit et rapide (2025)</p>
            </div>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl">
            Convertissez facilement entre le système métrique (centimètres) et le système
            impérial (pieds), particulièrement utile au Canada.
          </p>
        </div>
      </section>

      {/* Équivalences */}
      <section className="bg-neutral-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="bg-white px-4 py-2 border border-neutral-200">
              <strong>1 pied</strong> = 30,48 cm
            </div>
            <div className="bg-white px-4 py-2 border border-neutral-200">
              <strong>1 cm</strong> ≈ 0,032808 pied
            </div>
          </div>
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
              Convertisseur cm / pied
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Centimètres */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Centimètres (cm)
                </label>
                <input
                  type="number"
                  value={cm}
                  onChange={(e) => handleCmChange(e.target.value)}
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

            {/* Résultat en pieds et pouces */}
            {feetInches && (
              <div className="mt-6 bg-[#F77313] text-white p-4 text-center">
                <span className="text-sm opacity-80">En pieds et pouces :</span>
                <p className="font-display text-2xl">{feetInches}</p>
              </div>
            )}

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
              {/* Formule 1 */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Formule 1 (multiplication)
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  pieds = cm × 0,032808
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Exemple :</strong> 175 cm × 0,032808 = 5,74 pieds
                </p>
              </div>

              {/* Formule 2 */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  Formule 2 (division)
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center text-lg mb-4">
                  pieds = cm ÷ 30,48
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Exemple :</strong> 175 cm ÷ 30,48 = 5,74 pieds
                </p>
              </div>
            </div>

            {/* Conversion en pieds et pouces */}
            <div className="mt-8 bg-white border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-4">
                Conversion en pieds et pouces
              </h3>
              <p className="text-neutral-600 text-sm mb-4">
                Pour exprimer une mesure en pieds et pouces (format américain) :
              </p>
              <div className="bg-neutral-50 p-4 text-sm">
                <p className="mb-2"><strong>Exemple : 175 cm</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                  <li>175 × 0,3937 = 68,90 pouces</li>
                  <li>68,90 ÷ 12 = 5 pieds et 8,9 pouces</li>
                  <li>Résultat : <strong>5&apos;9&quot;</strong> (environ)</li>
                </ol>
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
            {/* Tableau cm en pieds */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-purple-500 text-white px-6 py-4">
                <h3 className="font-display text-lg">Centimètres en Pieds</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">cm</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Pieds</th>
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

            {/* Tableau tailles */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="bg-[#F77313] text-white px-6 py-4">
                <h3 className="font-display text-lg">Tailles humaines</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">cm</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Pieds &amp; pouces</th>
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
                  <strong>Exprimer sa taille en système impérial</strong> - Format américain (5&apos;9&quot;)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Lire des plans nord-américains</strong> - Construction, rénovation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Commander des meubles</strong> - Dimensions impériales
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">
                  <strong>Comparaisons internationales</strong> - Sports, santé, voyage
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Définition du pied */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-50 border border-neutral-200 p-6">
            <h2 className="font-display text-xl text-black mb-4">
              Qu&apos;est-ce qu&apos;un pied ?
            </h2>
            <p className="text-neutral-600">
              Un pied équivaut à <strong>12 pouces</strong> ou <strong>30,48 centimètres</strong>.
              C&apos;est une unité impériale utilisée principalement aux États-Unis, au Canada
              (parfois) et dans certains domaines techniques comme la construction et l&apos;aviation.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-8">
              Questions fréquentes
            </h2>
            <div className="space-y-6">
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-3">
                  Combien fait 170 cm en pieds?
                </h3>
                <p className="text-neutral-600">
                  <strong>170 cm = 5&apos;7&quot;</strong> (5 pieds et 7 pouces), soit environ 5,58 pieds.
                  C&apos;est une taille moyenne pour un adulte. Notre convertisseur vous donne le résultat
                  exact en pieds décimaux ET en pieds et pouces.
                </p>
              </div>
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-3">
                  Combien fait 180 cm en pieds?
                </h3>
                <p className="text-neutral-600">
                  <strong>180 cm = 5&apos;11&quot;</strong> (5 pieds et 11 pouces), soit environ 5,91 pieds.
                  C&apos;est souvent considéré comme une &quot;grande taille&quot; pour un homme.
                </p>
              </div>
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-3">
                  Comment convertir sa taille en pieds et pouces?
                </h3>
                <p className="text-neutral-600">
                  Pour convertir votre taille de centimètres en pieds et pouces : 1) Divisez les cm par 2,54 pour obtenir les pouces totaux.
                  2) Divisez ce résultat par 12 pour avoir les pieds. 3) Le reste représente les pouces.
                  Ou utilisez simplement notre calculateur ci-dessus!
                </p>
              </div>
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-3">
                  Pourquoi les Américains utilisent les pieds?
                </h3>
                <p className="text-neutral-600">
                  Les États-Unis n&apos;ont jamais officiellement adopté le système métrique, contrairement à presque tous les autres pays.
                  Le système impérial (pieds, pouces, livres) reste donc la norme au quotidien, ce qui explique pourquoi
                  les Canadiens doivent souvent convertir entre les deux systèmes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu SEO additionnel */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-neutral">
          <h2 className="font-display text-2xl text-black mb-6">
            Guide complet : convertir les centimètres en pieds
          </h2>
          <p className="text-neutral-600 mb-4">
            La conversion de centimètres en pieds est particulièrement utile pour exprimer sa taille dans le format
            nord-américain. Aux États-Unis et souvent au Canada, on exprime la taille d&apos;une personne en pieds et pouces
            (par exemple 5&apos;10&quot; plutôt que 178 cm).
          </p>
          <h3 className="font-display text-xl text-black mb-4 mt-8">Tableau des tailles les plus recherchées</h3>
          <p className="text-neutral-600 mb-4">
            Voici les conversions les plus demandées pour les tailles humaines :
          </p>
          <ul className="text-neutral-600 space-y-2 mb-6">
            <li>• <strong>160 cm</strong> = 5&apos;3&quot; (petite taille)</li>
            <li>• <strong>165 cm</strong> = 5&apos;5&quot; (taille moyenne femme)</li>
            <li>• <strong>170 cm</strong> = 5&apos;7&quot; (taille moyenne)</li>
            <li>• <strong>175 cm</strong> = 5&apos;9&quot; (taille moyenne homme)</li>
            <li>• <strong>180 cm</strong> = 5&apos;11&quot; (grande taille)</li>
            <li>• <strong>185 cm</strong> = 6&apos;1&quot; (très grand)</li>
            <li>• <strong>190 cm</strong> = 6&apos;3&quot; (très grand)</li>
          </ul>
          <p className="text-neutral-600">
            Notre convertisseur calcule automatiquement votre taille en pieds décimaux ET en format pieds-pouces,
            ce qui est idéal pour remplir des formulaires américains ou comparer votre taille avec des personnes
            utilisant le système impérial.
          </p>
        </div>
      </section>

      {/* Schema FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Combien fait 170 cm en pieds?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "170 cm = 5'7\" (5 pieds et 7 pouces), soit environ 5,58 pieds."
                }
              },
              {
                "@type": "Question",
                "name": "Combien fait 180 cm en pieds?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "180 cm = 5'11\" (5 pieds et 11 pouces), soit environ 5,91 pieds."
                }
              },
              {
                "@type": "Question",
                "name": "Comment convertir sa taille en pieds et pouces?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Divisez les cm par 2,54 pour obtenir les pouces totaux, puis divisez par 12 pour avoir les pieds. Le reste représente les pouces."
                }
              },
              {
                "@type": "Question",
                "name": "Combien de cm dans un pied?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Un pied équivaut exactement à 30,48 centimètres."
                }
              }
            ]
          })
        }}
      />

      {/* CTA Recettes */}
      <section className="bg-[#F77313] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
              Découvrez nos recettes québécoises
            </h2>
            <p className="text-white/90 mb-6">
              Maintenant que vos conversions sont faites, pourquoi ne pas essayer une de nos délicieuses recettes traditionnelles?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/recette"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#F77313] font-semibold hover:bg-neutral-100 transition-colors"
              >
                Voir toutes les recettes
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/convertisseur"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Tous les convertisseurs
              </Link>
            </div>
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
            className="group p-4 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-colors"
          >
            <span className="font-display text-black group-hover:text-[#F77313]">Celsius - Fahrenheit</span>
            <p className="text-xs text-neutral-500 mt-1">Température</p>
          </Link>
          <Link
            href="/convertisseur/metre-pied"
            className="group p-4 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-colors"
          >
            <span className="font-display text-black group-hover:text-[#F77313]">Mètre en Pieds</span>
            <p className="text-xs text-neutral-500 mt-1">Longueur</p>
          </Link>
          <Link
            href="/convertisseur/pouce-pied"
            className="group p-4 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-colors"
          >
            <span className="font-display text-black group-hover:text-[#F77313]">Pouce en Pieds</span>
            <p className="text-xs text-neutral-500 mt-1">Longueur</p>
          </Link>
          <Link
            href="/convertisseur/minuterie"
            className="group p-4 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-colors"
          >
            <span className="font-display text-black group-hover:text-[#F77313]">Minuterie en ligne</span>
            <p className="text-xs text-neutral-500 mt-1">Temps</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
