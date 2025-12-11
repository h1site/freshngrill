import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Heart, Users, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos | Menu Cochon',
  description:
    'Découvrez Menu Cochon, votre source de recettes gourmandes et faciles à réaliser. Notre mission : rendre la cuisine accessible à tous.',
  alternates: {
    canonical: '/a-propos/',
  },
};

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6">
              À propos de Menu Cochon
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Des recettes gourmandes, simples et savoureuses pour le quotidien.
              Bienvenue dans notre univers culinaire!
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-black mb-6">
                Notre histoire
              </h2>
              <div className="prose prose-lg text-neutral-600">
                <p>
                  Menu Cochon est né d&apos;une passion simple : partager le plaisir de cuisiner
                  avec le plus grand nombre. Depuis nos débuts, nous croyons que la bonne
                  cuisine n&apos;a pas besoin d&apos;être compliquée.
                </p>
                <p>
                  Chaque recette est testée et approuvée pour vous garantir des résultats
                  délicieux à chaque fois. Que vous soyez débutant ou cuisinier expérimenté,
                  vous trouverez ici des idées pour régaler votre famille et vos amis.
                </p>
                <p>
                  Basés au Québec, nous mettons un point d&apos;honneur à proposer des recettes
                  qui célèbrent notre patrimoine culinaire tout en explorant les saveurs
                  du monde entier.
                </p>
              </div>
            </div>
            <div className="relative aspect-square">
              <Image
                src="/images/about-cooking.jpg"
                alt="Cuisine"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-black mb-4">
              Nos valeurs
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Ce qui nous guide au quotidien dans la création de nos recettes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Simplicité</h3>
              <p className="text-neutral-600 text-sm">
                Des recettes accessibles avec des ingrédients que vous avez déjà.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Passion</h3>
              <p className="text-neutral-600 text-sm">
                Chaque recette est créée avec amour et testée avec soin.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Partage</h3>
              <p className="text-neutral-600 text-sm">
                La cuisine est meilleure quand on la partage ensemble.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Authenticité</h3>
              <p className="text-neutral-600 text-sm">
                Des recettes honnêtes, sans artifice, qui ont fait leurs preuves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-black text-white p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl mb-4">
              Envie de cuisiner avec nous?
            </h2>
            <p className="text-neutral-400 mb-8">
              Explorez nos recettes et trouvez votre prochaine inspiration culinaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/recette"
                className="inline-flex items-center justify-center gap-2 bg-[#F77313] text-white px-6 py-3 font-medium hover:bg-[#e56610] transition-colors"
              >
                Voir les recettes
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white text-white px-6 py-3 font-medium hover:bg-white hover:text-black transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
