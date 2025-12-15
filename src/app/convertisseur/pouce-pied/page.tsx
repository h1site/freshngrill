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

export default function PoucePiedPage() {
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
            <Link href="/" className="text-neutral-500 hover:text-black">
              Accueil
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/convertisseur" className="text-neutral-500 hover:text-black">
              Convertisseur
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-medium">Pouce - Pied</span>
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
            <div className="w-14 h-14 bg-green-500 text-white flex items-center justify-center">
              <Ruler className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Pouce en Pied : La Conversion Facile
              </h1>
              <p className="text-neutral-400 mt-1">En 1 clic</p>
            </div>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl">
            Calculateur en ligne gratuit, idéal pour les tailles, meubles et distances.
            Au Canada, la conversion entre systèmes métrique et impérial demeure nécessaire.
          </p>
        </div>
      </section>

      {/* Équivalences */}
      <section className="bg-neutral-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="bg-white px-4 py-2 border border-neutral-200">
              <strong>1 pouce</strong> = 2,54 cm = 0,083333 pied
            </div>
            <div className="bg-white px-4 py-2 border border-neutral-200">
              <strong>1 pied</strong> = 30,48 cm = 12 pouces
            </div>
          </div>
        </div>
      </section>

      {/* Convertisseur */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-neutral-50 border border-neutral-200 p-8">
            <h2 className="font-display text-2xl text-black mb-6 text-center">
              Convertisseur pouce / pied
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Pouces */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Pouces (in)
                </label>
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => handleInchesChange(e.target.value)}
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

      {/* Ad après convertisseur */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Formules */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-8 text-center">
              Formules de conversion
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pouces vers pieds */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  De pouces vers pieds
                </h3>
                <div className="space-y-3">
                  <div className="bg-neutral-100 p-4 font-mono text-center">
                    pieds = pouces × 0,083333
                  </div>
                  <div className="bg-neutral-100 p-4 font-mono text-center">
                    pieds = pouces ÷ 12
                  </div>
                </div>
                <p className="text-neutral-600 text-sm mt-4">
                  <strong>Exemple :</strong> 36 pouces ÷ 12 = 3 pieds
                </p>
              </div>

              {/* Pieds vers pouces */}
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-4">
                  De pieds vers pouces
                </h3>
                <div className="bg-neutral-100 p-4 font-mono text-center mb-4">
                  pouces = pieds × 12
                </div>
                <p className="text-neutral-600 text-sm">
                  <strong>Exemple :</strong> 5 pieds × 12 = 60 pouces
                </p>
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
            <div className="bg-green-500 text-white px-6 py-4">
              <h3 className="font-display text-lg">Pouces en Pieds</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pouces (in)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pieds (ft)</th>
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

      {/* Historique */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              Historique des unités
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-3">Le pied</h3>
                <p className="text-neutral-600 text-sm">
                  Le pied provient historiquement de la longueur moyenne du pied humain.
                  Cette unité a été standardisée ultérieurement pour garantir des mesures
                  cohérentes.
                </p>
              </div>
              <div className="bg-white border border-neutral-200 p-6">
                <h3 className="font-display text-lg text-black mb-3">Le pouce</h3>
                <p className="text-neutral-600 text-sm">
                  Le pouce représente historiquement la largeur du pouce humain. Il a été
                  standardisé à exactement 2,54 centimètres dans le système international.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl text-black mb-6">
            Quand utiliser ce convertisseur ?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
              <span className="text-neutral-700">
                <strong>Mesurer les tailles corporelles</strong> - Convertir sa taille en pieds et pouces
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
              <span className="text-neutral-700">
                <strong>Convertir les dimensions de mobilier</strong> - Comprendre les mesures américaines
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
              <span className="text-neutral-700">
                <strong>Comprendre les documents anglo-saxons</strong> - Plans, fiches techniques
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Conversions connexes */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              Conversions connexes
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-200 p-4">
                <p className="font-semibold text-neutral-700 mb-2">Pouces carrés en pieds carrés</p>
                <code className="text-[#F77313]">ft² = in² × 0,0069444</code>
              </div>
              <div className="bg-white border border-neutral-200 p-4">
                <p className="font-semibold text-neutral-700 mb-2">Centimètres en pouces</p>
                <code className="text-[#F77313]">1 cm = 0,3937 pouce</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl text-black mb-8">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            <div className="border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-3">
                Combien de pouces dans un pied?
              </h3>
              <p className="text-neutral-600">
                Il y a exactement <strong>12 pouces dans un pied</strong>. Cette relation est fixe dans le système impérial.
                Par exemple, 24 pouces = 2 pieds, 36 pouces = 3 pieds, et ainsi de suite.
              </p>
            </div>
            <div className="border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-3">
                Comment convertir des pouces en pieds facilement?
              </h3>
              <p className="text-neutral-600">
                Pour convertir des pouces en pieds, divisez simplement le nombre de pouces par 12.
                Par exemple : 60 pouces ÷ 12 = 5 pieds. Vous pouvez aussi utiliser notre calculateur ci-dessus pour une conversion instantanée.
              </p>
            </div>
            <div className="border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-3">
                Pourquoi utilise-t-on encore les pouces et pieds au Canada?
              </h3>
              <p className="text-neutral-600">
                Bien que le Canada utilise officiellement le système métrique, le système impérial reste courant pour les tailles personnelles,
                la construction, et les produits importés des États-Unis. C&apos;est pourquoi la conversion entre ces systèmes reste utile au quotidien.
              </p>
            </div>
            <div className="border border-neutral-200 p-6">
              <h3 className="font-display text-lg text-black mb-3">
                Quelle est la différence entre un pouce et un centimètre?
              </h3>
              <p className="text-neutral-600">
                Un pouce équivaut à <strong>2,54 centimètres</strong> exactement. Le pouce fait partie du système impérial (utilisé aux États-Unis),
                tandis que le centimètre fait partie du système métrique (utilisé dans la plupart des pays).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu SEO additionnel */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-neutral">
            <h2 className="font-display text-2xl text-black mb-6">
              Tout savoir sur la conversion pouce-pied
            </h2>
            <p className="text-neutral-600 mb-4">
              La conversion entre pouces et pieds est l&apos;une des plus utilisées dans le système impérial.
              Que vous mesuriez la taille d&apos;une personne, les dimensions d&apos;un meuble, ou que vous lisiez
              des plans de construction nord-américains, comprendre cette relation est essentiel.
            </p>
            <p className="text-neutral-600 mb-4">
              Au Canada, nous vivons avec deux systèmes de mesure : le métrique (officiel) et l&apos;impérial
              (traditionnel). Les recettes de cuisine, par exemple, utilisent souvent des tasses et cuillères,
              tandis que les emballages affichent les quantités en millilitres et grammes.
            </p>
            <p className="text-neutral-600">
              Notre convertisseur gratuit vous permet de passer instantanément d&apos;un système à l&apos;autre,
              sans calcul mental. Que vous ayez besoin de savoir combien font 72 pouces en pieds (réponse : 6 pieds)
              ou de convertir votre taille pour un formulaire américain, cet outil est fait pour vous.
            </p>
          </div>
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
                "name": "Combien de pouces dans un pied?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Il y a exactement 12 pouces dans un pied. Cette relation est fixe dans le système impérial."
                }
              },
              {
                "@type": "Question",
                "name": "Comment convertir des pouces en pieds?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pour convertir des pouces en pieds, divisez le nombre de pouces par 12. Par exemple : 60 pouces ÷ 12 = 5 pieds."
                }
              },
              {
                "@type": "Question",
                "name": "Combien de centimètres dans un pouce?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Un pouce équivaut à exactement 2,54 centimètres."
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
            href="/convertisseur/centimetre-pied"
            className="group p-4 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-colors"
          >
            <span className="font-display text-black group-hover:text-[#F77313]">Centimètre en Pieds</span>
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
