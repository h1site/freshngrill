import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Guide des Accords Épices-Aliments | La Route des Épices - Menucochon',
  description: 'Découvrez les meilleures épices pour chaque aliment: bœuf, poulet, agneau, poisson, légumes et desserts. Guide pratique des accords parfaits.',
  alternates: {
    canonical: '/epices/route-des-epices/',
  },
};

const DEFAULT_SPICE_IMAGE = '/images/default-epice.avif';

// Catégories d'aliments avec leurs mots-clés pour matcher les épices
const FOOD_CATEGORIES = [
  {
    id: 'boeuf',
    name: 'Bœuf',
    emoji: '🥩',
    description: 'Steaks, rôtis, ragoûts et burgers',
    keywords: ['viandes', 'viandes grillées', 'steaks', 'rôtis', 'ragoûts'],
    tip: 'Le bœuf aime les épices terreuses et robustes. Le cumin, le paprika fumé et le poivre noir sont des classiques. Pour les ragoûts, ajoutez de la cannelle ou du clou de girofle.',
  },
  {
    id: 'poulet',
    name: 'Poulet',
    emoji: '🍗',
    description: 'Rôti, grillé, sauté ou en curry',
    keywords: ['volailles', 'volaille', 'poulet', 'viandes blanches'],
    tip: 'Le poulet est une toile vierge qui absorbe bien les épices. Le curcuma et le gingembre créent un poulet doré parfumé. Le paprika et le thym sont parfaits pour un poulet rôti.',
  },
  {
    id: 'agneau',
    name: 'Agneau',
    emoji: '🐑',
    description: 'Gigot, côtelettes et tajines',
    keywords: ['agneau', 'viandes', 'ragoûts'],
    preferOrigins: ['Moyen-Orient', 'Méditerranée', 'Afrique'],
    tip: 'Le cumin est le partenaire naturel de l\'agneau. Associez-le avec de la coriandre et de la menthe pour une touche méditerranéenne. Le ras-el-hanout est idéal pour les tajines.',
  },
  {
    id: 'porc',
    name: 'Porc',
    emoji: '🐷',
    description: 'Côtelettes, rôti et charcuterie',
    keywords: ['porc', 'viandes', 'charcuteries', 'saucisses'],
    tip: 'Le porc aime le sucré-salé. La cannelle, le gingembre et la muscade créent des accords surprenants. Le fenouil est traditionnel dans les saucisses italiennes.',
  },
  {
    id: 'poisson',
    name: 'Poisson',
    emoji: '🐟',
    description: 'Saumon, cabillaud, thon et plus',
    keywords: ['poissons', 'poisson', 'saumon'],
    tip: 'Les épices douces complètent sans masquer le goût délicat du poisson. Le curcuma, l\'aneth et le fenouil sont excellents. Évitez les épices trop fortes.',
  },
  {
    id: 'fruits-mer',
    name: 'Fruits de mer',
    emoji: '🦐',
    description: 'Crevettes, moules et crustacés',
    keywords: ['fruits de mer', 'poissons', 'plats asiatiques'],
    tip: 'Les fruits de mer adorent le piquant! Le piment de Cayenne, le paprika fumé et le gingembre frais sont vos alliés pour des crevettes parfaites.',
  },
  {
    id: 'legumes',
    name: 'Légumes',
    emoji: '🥕',
    description: 'Rôtis, sautés ou en soupe',
    keywords: ['légumes', 'légumes rôtis', 'légumineuses', 'pommes de terre', 'plats végétariens'],
    tip: 'Les légumes rôtis révèlent leur saveur avec le cumin et le curcuma. La cannelle sur les courges et le paprika sur les pommes de terre sont délicieux.',
  },
  {
    id: 'riz',
    name: 'Riz & Céréales',
    emoji: '🍚',
    description: 'Pilaf, risotto et couscous',
    keywords: ['riz', 'pâtes', 'céréales'],
    tip: 'Une pincée de curcuma transforme un simple riz en accompagnement festif. Le safran reste le roi du risotto et de la paella.',
  },
  {
    id: 'soupes',
    name: 'Soupes & Mijotés',
    emoji: '🍲',
    description: 'Bouillons, potages et ragoûts',
    keywords: ['soupes', 'bouillons', 'ragoûts', 'plats mijotés', 'currys'],
    tip: 'Les épices entières infusent merveilleusement dans les soupes. Ajoutez les épices moulues en fin de cuisson pour préserver leurs arômes.',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    emoji: '🍰',
    description: 'Gâteaux, tartes et crèmes',
    keywords: ['desserts', 'pâtisseries', 'biscuits', 'compotes', 'plats sucrés-salés'],
    tip: 'La cannelle et la cardamome sont les reines de la pâtisserie. La vanille est universelle. N\'ayez pas peur d\'expérimenter avec le gingembre et l\'anis!',
  },
];

interface UsedWith {
  meat?: string[];
  fish?: string[];
  vegetables?: string[];
  grains?: string[];
  bread?: string[];
  desserts?: string[];
  cheese?: string[];
  soups?: string[];
  eggs?: string[];
  sauces?: string[];
  drinks?: string[];
}

interface Spice {
  id: number;
  slug: string;
  name_fr: string;
  definition_fr: string | null;
  featured_image: string | null;
  origin: string[] | null;
  taste_profile: {
    intensity?: number;
    spicy?: number;
  } | null;
  utilisation_aliments_fr: string[] | null;
  used_with: UsedWith | null;
}

function matchSpiceToCategory(spice: Spice, category: typeof FOOD_CATEGORIES[0]): number {
  let score = 0;
  const aliments = spice.utilisation_aliments_fr || [];
  const alimentsLower = aliments.map(a => a.toLowerCase());

  // Match par mots-clés
  for (const keyword of category.keywords) {
    if (alimentsLower.some(a => a.includes(keyword) || keyword.includes(a))) {
      score += 2;
    }
  }

  // Bonus pour origine préférée
  if (category.preferOrigins && spice.origin) {
    for (const origin of category.preferOrigins) {
      if (spice.origin.includes(origin)) {
        score += 1;
      }
    }
  }

  return score;
}

function IntensityIndicator({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= level ? 'bg-[#F77313]' : 'bg-neutral-200'
          }`}
        />
      ))}
    </div>
  );
}

export default async function SpiceGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ aliment?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Récupérer toutes les épices
  const { data: spices } = await supabase
    .from('spices')
    .select('id, slug, name_fr, definition_fr, featured_image, origin, taste_profile, utilisation_aliments_fr, used_with')
    .eq('is_published', true)
    .order('name_fr');

  const allSpices = (spices || []) as Spice[];

  // Catégorie sélectionnée
  const selectedCategoryId = params.aliment || null;
  const selectedCategory = FOOD_CATEGORIES.find(c => c.id === selectedCategoryId);

  // Trouver les épices pour la catégorie sélectionnée
  let matchedSpices: { spice: Spice; score: number }[] = [];

  if (selectedCategory) {
    matchedSpices = allSpices
      .map(spice => ({
        spice,
        score: matchSpiceToCategory(spice, selectedCategory),
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-[#F77313]">
              Accueil
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/epices/" className="hover:text-[#F77313]">
              Épices
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">Guide des Accords</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-black text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              La Route des Épices
            </span>
            <h1 className="text-4xl md:text-6xl font-display mt-3 mb-6">
              Quelle épice avec quel aliment?
            </h1>
            <p className="text-neutral-400 text-lg">
              Sélectionnez un aliment pour découvrir les meilleures épices à utiliser.
              Un guide pratique pour des accords parfaits en cuisine.
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Food Categories Grid */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
          {FOOD_CATEGORIES.map((category) => {
            const isSelected = selectedCategoryId === category.id;

            return (
              <Link
                key={category.id}
                href={isSelected ? '/epices/route-des-epices/' : `/epices/route-des-epices/?aliment=${category.id}`}
                className={`flex flex-col items-center justify-center p-6 border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#F77313] bg-[#F77313]/5'
                    : 'border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50'
                }`}
              >
                <span className="text-4xl mb-3">{category.emoji}</span>
                <span className={`font-medium text-center ${isSelected ? 'text-[#F77313]' : 'text-black'}`}>
                  {category.name}
                </span>
                <span className="text-xs text-neutral-500 text-center mt-1">
                  {category.description}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Results */}
        {selectedCategory ? (
          <div className="max-w-5xl mx-auto">
            {/* Category Header */}
            <div className="bg-neutral-50 border border-neutral-200 p-6 md:p-8 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{selectedCategory.emoji}</span>
                <div>
                  <h2 className="font-display text-3xl text-black">
                    Épices pour {selectedCategory.name}
                  </h2>
                  <p className="text-neutral-600">
                    {matchedSpices.length} épices recommandées
                  </p>
                </div>
              </div>

              {/* Chef tip */}
              <div className="bg-white border border-neutral-200 p-4 mt-4">
                <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                  <span>💡</span> Conseil de chef
                </h3>
                <p className="text-neutral-600 text-sm">
                  {selectedCategory.tip}
                </p>
              </div>
            </div>

            {/* Spices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedSpices.map(({ spice, score }) => (
                <Link
                  key={spice.id}
                  href={`/epices/${spice.slug}/`}
                  className="flex items-start gap-4 p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors group"
                >
                  {/* Image */}
                  <div className="w-16 h-16 flex-shrink-0 relative bg-neutral-100 overflow-hidden">
                    <Image
                      src={spice.featured_image || DEFAULT_SPICE_IMAGE}
                      alt={spice.name_fr}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="64px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-black group-hover:text-[#F77313] transition-colors">
                        {spice.name_fr}
                      </h3>
                      <IntensityIndicator level={spice.taste_profile?.intensity || 3} />
                    </div>
                    {spice.definition_fr && (
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                        {spice.definition_fr}
                      </p>
                    )}
                    {spice.origin && spice.origin.length > 0 && (
                      <p className="text-xs text-neutral-400 mt-2">
                        Origine: {spice.origin.slice(0, 2).join(', ')}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {matchedSpices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500">
                  Aucune épice trouvée pour cette catégorie.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">👆</p>
            <h2 className="text-2xl font-display text-black mb-2">
              Sélectionnez un aliment
            </h2>
            <p className="text-neutral-600">
              Cliquez sur une catégorie ci-dessus pour voir les épices recommandées
            </p>
          </div>
        )}
      </section>

      {/* All Categories Overview */}
      {!selectedCategory && (
        <section className="bg-neutral-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl text-black text-center mb-12">
              Accords classiques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {FOOD_CATEGORIES.slice(0, 6).map((category) => (
                <div key={category.id} className="bg-white p-6 border border-neutral-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{category.emoji}</span>
                    <h3 className="font-display text-xl text-black">{category.name}</h3>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    {category.tip}
                  </p>
                  <Link
                    href={`/epices/route-des-epices/?aliment=${category.id}`}
                    className="text-[#F77313] text-sm font-medium hover:text-[#e56200] inline-flex items-center gap-1"
                  >
                    Voir les épices <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-neutral">
            <h2 className="font-display text-3xl text-black">
              Comment bien associer les épices?
            </h2>
            <p>
              L&apos;art des accords épices-aliments est essentiel pour réussir vos plats.
              Chaque viande, poisson ou légume a ses épices de prédilection qui rehaussent
              son goût naturel sans le masquer.
            </p>
            <h3>Les règles d&apos;or</h3>
            <ul>
              <li>
                <strong>Commencez doucement:</strong> Il est plus facile d&apos;ajouter des épices
                que d&apos;en enlever
              </li>
              <li>
                <strong>Respectez les accords classiques:</strong> Cumin + agneau, gingembre +
                poulet, paprika + bœuf sont des valeurs sûres
              </li>
              <li>
                <strong>Osez les mélanges:</strong> Cumin et coriandre, cannelle et gingembre
                fonctionnent très bien ensemble
              </li>
              <li>
                <strong>Adaptez à la cuisson:</strong> Certaines épices s&apos;ajoutent en début
                de cuisson (cumin), d&apos;autres à la fin (herbes fraîches)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Back to spices */}
      <section className="pb-16">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/epices/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium hover:bg-[#F77313] transition-colors"
          >
            ← Voir toutes les épices
          </Link>
        </div>
      </section>
    </main>
  );
}
