import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Heart, Users, BookOpen, MapPin, Calendar, Facebook } from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos de Sébastien Ross | Menucochon',
  description:
    'Découvrez Sébastien Ross, fondateur de Menucochon. Passionné de cuisine depuis l\'âge de 8 ans, il partage ses recettes testées et approuvées depuis Vaudreuil-Dorion, Québec.',
  alternates: {
    canonical: '/a-propos/',
    languages: {
      'fr-CA': '/a-propos/',
      'en-CA': '/en/about/',
    },
  },
  authors: [{ name: 'Sébastien Ross' }],
};

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              Le créateur derrière les recettes
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6 mt-4">
              Sébastien Ross
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Passionné de cuisine depuis plus de 30 ans, je partage mes recettes
              testées et approuvées pour le plaisir de découvrir et de faire découvrir.
            </p>
            <div className="flex items-center gap-4 mt-6 text-neutral-500 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Vaudreuil-Dorion, Québec</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Depuis 2022</span>
              </div>
            </div>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* À propos de moi */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative">
              <Image
                src="/images/auteurs/seb.jpg"
                alt="Sébastien Ross - Fondateur de Menucochon"
                width={500}
                height={500}
                className="object-cover rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#F77313] text-white p-4 rounded-lg shadow-lg">
                <p className="font-display text-2xl">+30 ans</p>
                <p className="text-sm text-white/80">de passion culinaire</p>
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-black mb-6">
                Mon histoire
              </h2>
              <div className="prose prose-lg text-neutral-600 space-y-4">
                <p>
                  Je cuisine depuis l&apos;âge de 8 ans. Ma mère a toujours pensé que je
                  deviendrais cuisinier! Même si j&apos;ai choisi un autre chemin professionnel,
                  ma passion pour la cuisine n&apos;a jamais diminué.
                </p>
                <p>
                  J&apos;ai beaucoup de respect pour les chefs professionnels. Pour moi,
                  le plaisir est d&apos;essayer des choses, de découvrir de nouvelles saveurs.
                  Ma mère m&apos;a montré les bases, mais je me suis aussi beaucoup formé en
                  regardant des vidéos et surtout en goûtant. Quand je goûte quelque chose
                  qui m&apos;inspire, j&apos;essaie de le recréer à ma façon.
                </p>
                <p>
                  J&apos;ai aussi hérité du livre de recettes de la famille Bilodeau
                  que j&apos;essaie de répliquer et de préserver. Ce patrimoine culinaire
                  familial est une source d&apos;inspiration constante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ma signature */}
      <section className="bg-neutral-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              Ma signature? Le cochon.
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              Le nom &quot;Menucochon&quot; n&apos;est pas un hasard. Je préfère cuisiner le salé
              plutôt que le sucré, et le porc est clairement mon ingrédient de prédilection.
              Que ce soit une tourtière, un rôti ou des côtes levées, j&apos;adore travailler
              cette viande sous toutes ses formes.
            </p>
            <div className="text-6xl">🐷</div>
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

      {/* Mes autres projets */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-black mb-8 text-center">
              Mes autres projets
            </h2>
            <p className="text-neutral-600 text-center mb-10">
              En plus de Menucochon, je suis également propriétaire de plusieurs autres projets web
              et je travaille comme responsable technologie chez Rennaï, une boutique beauté.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="https://kracradio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 p-4 rounded-lg hover:bg-neutral-200 transition-colors text-center"
              >
                <p className="font-bold text-black">KracRadio</p>
                <p className="text-sm text-neutral-500">Radio en ligne</p>
              </a>
              <a
                href="https://appgratuit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 p-4 rounded-lg hover:bg-neutral-200 transition-colors text-center"
              >
                <p className="font-bold text-black">AppGratuit</p>
                <p className="text-sm text-neutral-500">Apps gratuites</p>
              </a>
              <a
                href="https://kemp3.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 p-4 rounded-lg hover:bg-neutral-200 transition-colors text-center"
              >
                <p className="font-bold text-black">Kemp3</p>
                <p className="text-sm text-neutral-500">Musique</p>
              </a>
              <a
                href="https://h1site.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 p-4 rounded-lg hover:bg-neutral-200 transition-colors text-center"
              >
                <p className="font-bold text-black">H1Site</p>
                <p className="text-sm text-neutral-500">Création web</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="bg-black text-white p-8 md:p-12 max-w-3xl mx-auto">
            <div className="text-center">
              <h2 className="font-display text-3xl mb-4">
                Envie de cuisiner avec moi?
              </h2>
              <p className="text-neutral-400 mb-8">
                Explorez mes recettes et trouvez votre prochaine inspiration culinaire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/recette"
                  className="inline-flex items-center justify-center gap-2 bg-[#F77313] text-white px-6 py-3 font-medium hover:bg-[#e56610] transition-colors"
                >
                  Voir les recettes
                </Link>
                <a
                  href="https://www.facebook.com/sebastien.ross"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white text-white px-6 py-3 font-medium hover:bg-white hover:text-black transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  Me suivre sur Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
