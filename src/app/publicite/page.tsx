import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Mail, TrendingUp, Users, Eye, Link2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Publicité et Partenariats | Menucochon',
  description:
    'Faites la promotion de votre entreprise sur Menucochon. Bannières publicitaires à 100$/mois ou article sponsorisé avec lien dofollow permanent à 150$.',
  keywords: [
    'publicité',
    'partenariat',
    'sponsoring',
    'menucochon',
    'annonce',
    'promotion',
    'backlink',
    'dofollow',
  ],
  alternates: {
    canonical: '/publicite/',
    languages: {
      'fr-CA': '/publicite/',
      'en-CA': '/en/advertising/',
      'x-default': '/publicite/',
    },
  },
  openGraph: {
    title: 'Publicité et Partenariats | Menucochon',
    description:
      'Faites la promotion de votre entreprise sur Menucochon. Bannières publicitaires ou articles sponsorisés.',
    siteName: 'Menucochon',
    locale: 'fr_CA',
    type: 'website',
  },
};

export default function PublicitePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              Partenariats
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6 mt-4">
              Publicité sur Menucochon
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Rejoignez une communauté passionnée de cuisine québécoise et faites
              découvrir votre entreprise à des milliers de gourmands chaque mois.
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Pourquoi nous */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-black mb-4">
              Pourquoi annoncer sur Menucochon?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Votre soutien nous aide à continuer de créer du contenu de qualité
              et à faire grandir ce projet passionnant.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Audience ciblée</h3>
              <p className="text-neutral-600 text-sm">
                Des passionnés de cuisine québécoise, à la recherche de produits et services de qualité.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Visibilité optimale</h3>
              <p className="text-neutral-600 text-sm">
                Placement stratégique sur les pages les plus visitées du site.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Croissance mutuelle</h3>
              <p className="text-neutral-600 text-sm">
                Vos contributions nous aident à développer plus de contenu et fonctionnalités.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offres */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-black mb-4">
              Nos offres publicitaires
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Deux options simples et efficaces pour promouvoir votre entreprise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Option 1 - Bannière */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-neutral-200">
              <div className="text-center mb-6">
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                  Option 1
                </span>
                <h3 className="font-display text-2xl text-black mt-2">Bannière publicitaire</h3>
                <div className="mt-4">
                  <span className="font-display text-5xl text-black">100$</span>
                  <span className="text-neutral-500">/mois</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Bannière affichée sur <strong>chaque fiche de recette</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Placement premium dans la sidebar ou le contenu</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Lien vers votre site web</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Possibilité de changer la bannière chaque mois</span>
                </li>
              </ul>

              <Link
                href="/contact"
                className="block w-full bg-neutral-900 text-white text-center py-3 font-medium hover:bg-neutral-800 transition-colors"
              >
                Réserver ma bannière
              </Link>
            </div>

            {/* Option 2 - Article */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#F77313] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F77313] text-white text-xs font-medium px-3 py-1 rounded-full">
                Populaire
              </div>
              <div className="text-center mb-6">
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                  Option 2
                </span>
                <h3 className="font-display text-2xl text-black mt-2">Guest Post</h3>
                <div className="mt-4">
                  <span className="font-display text-5xl text-black">150$</span>
                  <span className="text-neutral-500">/à vie</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Article dédié à votre entreprise/produit</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Lien <strong>dofollow permanent</strong> vers votre site</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Optimisé pour le SEO</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Reste en ligne pour toujours</span>
                </li>
                <li className="flex items-start gap-3">
                  <Link2 className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Excellent pour votre référencement Google</span>
                </li>
              </ul>

              <Link
                href="/contact"
                className="block w-full bg-[#F77313] text-white text-center py-3 font-medium hover:bg-[#e56610] transition-colors"
              >
                Commander mon article
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Aidez-nous */}
      <section className="bg-neutral-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              Aidez-nous à grandir
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              Menucochon est un projet passionné. Chaque partenariat nous permet d&apos;investir
              dans de meilleures photos, vidéos et recettes pour notre communauté. En choisissant
              d&apos;annoncer chez nous, vous soutenez directement la création de contenu culinaire
              québécois de qualité.
            </p>
            <div className="text-6xl mb-8">🙏</div>
          </div>
        </div>
      </section>

      {/* CTA Contact */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-black text-white p-8 md:p-12 max-w-3xl mx-auto text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-[#F77313]" />
            <h2 className="font-display text-3xl mb-4">
              Prêt à commencer?
            </h2>
            <p className="text-neutral-400 mb-8">
              Contactez-nous pour discuter de votre projet publicitaire.
              Nous répondons généralement dans les 24 heures.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#F77313] text-white px-8 py-4 font-medium hover:bg-[#e56610] transition-colors text-lg"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
