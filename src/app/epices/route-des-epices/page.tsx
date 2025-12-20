'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Beef, Fish, Drumstick, PiggyBank, Carrot, Wheat, Cake, Search } from 'lucide-react';

// Données des associations épices/aliments
const FOOD_CATEGORIES = [
  {
    id: 'boeuf',
    name: 'Bœuf',
    nameEn: 'Beef',
    icon: Beef,
    emoji: '🥩',
    spices: [
      { slug: 'cumin', name: 'Cumin', match: 5, note: 'Parfait pour les steaks et ragoûts' },
      { slug: 'paprika', name: 'Paprika', match: 5, note: 'Idéal pour colorer et parfumer' },
      { slug: 'poivre-noir', name: 'Poivre noir', match: 5, note: 'Le classique indémodable' },
      { slug: 'thym', name: 'Thym', match: 4, note: 'Excellent en marinade' },
      { slug: 'romarin', name: 'Romarin', match: 4, note: 'Pour les rôtis' },
      { slug: 'coriandre', name: 'Coriandre', match: 3, note: 'Dans les plats mijotés' },
    ],
  },
  {
    id: 'poulet',
    name: 'Poulet',
    nameEn: 'Chicken',
    icon: Drumstick,
    emoji: '🍗',
    spices: [
      { slug: 'paprika', name: 'Paprika', match: 5, note: 'Poulet paprika hongrois' },
      { slug: 'curcuma', name: 'Curcuma', match: 5, note: 'Pour les currys' },
      { slug: 'gingembre', name: 'Gingembre', match: 5, note: 'Cuisine asiatique' },
      { slug: 'cumin', name: 'Cumin', match: 4, note: 'Poulet épicé' },
      { slug: 'thym', name: 'Thym', match: 4, note: 'Poulet rôti classique' },
      { slug: 'cannelle', name: 'Cannelle', match: 3, note: 'Tajines marocains' },
    ],
  },
  {
    id: 'porc',
    name: 'Porc',
    nameEn: 'Pork',
    icon: PiggyBank,
    emoji: '🐷',
    spices: [
      { slug: 'gingembre', name: 'Gingembre', match: 5, note: 'Porc sauté asiatique' },
      { slug: 'cannelle', name: 'Cannelle', match: 4, note: 'Côtelettes de porc' },
      { slug: 'cumin', name: 'Cumin', match: 4, note: 'Carnitas mexicaines' },
      { slug: 'paprika', name: 'Paprika fumé', match: 5, note: 'Côtes levées BBQ' },
      { slug: 'coriandre', name: 'Coriandre', match: 3, note: 'En marinade' },
      { slug: 'muscade', name: 'Muscade', match: 3, note: 'Charcuterie' },
    ],
  },
  {
    id: 'agneau',
    name: 'Agneau',
    nameEn: 'Lamb',
    icon: Beef,
    emoji: '🐑',
    spices: [
      { slug: 'cumin', name: 'Cumin', match: 5, note: 'L\'accord parfait!' },
      { slug: 'coriandre', name: 'Coriandre', match: 5, note: 'Cuisine méditerranéenne' },
      { slug: 'romarin', name: 'Romarin', match: 5, note: 'Gigot rôti' },
      { slug: 'menthe', name: 'Menthe', match: 4, note: 'Tradition britannique' },
      { slug: 'paprika', name: 'Paprika', match: 4, note: 'Ragoûts' },
      { slug: 'cannelle', name: 'Cannelle', match: 3, note: 'Tajines' },
    ],
  },
  {
    id: 'poisson',
    name: 'Poisson',
    nameEn: 'Fish',
    icon: Fish,
    emoji: '🐟',
    spices: [
      { slug: 'curcuma', name: 'Curcuma', match: 5, note: 'Curry de poisson' },
      { slug: 'gingembre', name: 'Gingembre', match: 5, note: 'Poisson vapeur' },
      { slug: 'paprika', name: 'Paprika', match: 4, note: 'Poisson grillé' },
      { slug: 'coriandre', name: 'Coriandre', match: 4, note: 'Ceviche' },
      { slug: 'aneth', name: 'Aneth', match: 5, note: 'Saumon nordique' },
      { slug: 'fenouil', name: 'Fenouil', match: 4, note: 'Loup de mer' },
    ],
  },
  {
    id: 'fruits-mer',
    name: 'Fruits de mer',
    nameEn: 'Seafood',
    icon: Fish,
    emoji: '🦐',
    spices: [
      { slug: 'gingembre', name: 'Gingembre', match: 5, note: 'Crevettes sautées' },
      { slug: 'piment-cayenne', name: 'Piment de Cayenne', match: 5, note: 'Cajun' },
      { slug: 'paprika', name: 'Paprika fumé', match: 4, note: 'Paella' },
      { slug: 'curcuma', name: 'Curcuma', match: 4, note: 'Curry de crevettes' },
      { slug: 'ail', name: 'Ail', match: 5, note: 'Crevettes à l\'ail' },
      { slug: 'coriandre', name: 'Coriandre', match: 3, note: 'Fruits de mer thai' },
    ],
  },
  {
    id: 'legumes',
    name: 'Légumes',
    nameEn: 'Vegetables',
    icon: Carrot,
    emoji: '🥕',
    spices: [
      { slug: 'cumin', name: 'Cumin', match: 5, note: 'Légumes rôtis' },
      { slug: 'curcuma', name: 'Curcuma', match: 5, note: 'Chou-fleur doré' },
      { slug: 'paprika', name: 'Paprika', match: 4, note: 'Pommes de terre' },
      { slug: 'coriandre', name: 'Coriandre', match: 4, note: 'Carottes rôties' },
      { slug: 'gingembre', name: 'Gingembre', match: 3, note: 'Légumes sautés' },
      { slug: 'cannelle', name: 'Cannelle', match: 3, note: 'Courges' },
    ],
  },
  {
    id: 'riz-cereales',
    name: 'Riz & Céréales',
    nameEn: 'Rice & Grains',
    icon: Wheat,
    emoji: '🍚',
    spices: [
      { slug: 'curcuma', name: 'Curcuma', match: 5, note: 'Riz doré' },
      { slug: 'cumin', name: 'Cumin', match: 5, note: 'Riz pilaf' },
      { slug: 'cannelle', name: 'Cannelle', match: 4, note: 'Riz au lait' },
      { slug: 'cardamome', name: 'Cardamome', match: 5, note: 'Biryani' },
      { slug: 'safran', name: 'Safran', match: 5, note: 'Paella, risotto' },
      { slug: 'coriandre', name: 'Coriandre', match: 3, note: 'Couscous' },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    nameEn: 'Desserts',
    icon: Cake,
    emoji: '🍰',
    spices: [
      { slug: 'cannelle', name: 'Cannelle', match: 5, note: 'Tartes aux pommes' },
      { slug: 'gingembre', name: 'Gingembre', match: 5, note: 'Pain d\'épices' },
      { slug: 'muscade', name: 'Muscade', match: 4, note: 'Crèmes et flans' },
      { slug: 'cardamome', name: 'Cardamome', match: 5, note: 'Pâtisseries orientales' },
      { slug: 'vanille', name: 'Vanille', match: 5, note: 'Le classique universel' },
      { slug: 'anis-etoile', name: 'Anis étoilé', match: 3, note: 'Compotes' },
    ],
  },
];

function MatchIndicator({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${
            i <= level ? 'bg-[#F77313]' : 'bg-neutral-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function SpiceGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedFood = FOOD_CATEGORIES.find((cat) => cat.id === selectedCategory);

  // Filtrer les catégories par recherche
  const filteredCategories = searchQuery
    ? FOOD_CATEGORIES.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FOOD_CATEGORIES;

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
            <span className="text-black">La Route des Épices</span>
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
              Quelle épice avec quelle viande?
            </h1>
            <p className="text-neutral-400 text-lg">
              Sélectionnez un aliment pour découvrir les meilleures épices à utiliser.
              Un guide pratique pour des accords parfaits en cuisine.
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Selector */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un aliment..."
              className="w-full pl-12 pr-4 py-3 border border-neutral-200 text-lg focus:outline-none focus:border-[#F77313]"
            />
          </div>
        </div>

        {/* Food Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-12">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                className={`flex flex-col items-center justify-center p-4 border transition-all duration-200 ${
                  isSelected
                    ? 'border-[#F77313] bg-[#F77313]/5 text-[#F77313]'
                    : 'border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50'
                }`}
              >
                <span className="text-3xl mb-2">{category.emoji}</span>
                <span className="text-sm font-medium text-center">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        {selectedFood ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-50 border border-neutral-200 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{selectedFood.emoji}</span>
                <div>
                  <h2 className="font-display text-3xl text-black">
                    Épices pour {selectedFood.name}
                  </h2>
                  <p className="text-neutral-600">
                    Les meilleures épices à associer avec {selectedFood.name.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {selectedFood.spices.map((spice) => (
                  <Link
                    key={spice.slug}
                    href={`/epices/${spice.slug}/`}
                    className="flex items-center justify-between p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🌶️</span>
                      <div>
                        <h3 className="font-medium text-black group-hover:text-[#F77313] transition-colors">
                          {spice.name}
                        </h3>
                        <p className="text-sm text-neutral-500">{spice.note}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-neutral-500 block mb-1">Accord</span>
                        <MatchIndicator level={spice.match} />
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313]" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="font-medium text-black mb-3">💡 Conseil de chef</h3>
                <p className="text-neutral-600">
                  {selectedFood.id === 'boeuf' &&
                    'Pour le bœuf, commencez par du poivre noir et du sel. Ajoutez du cumin pour un côté terreux ou du paprika fumé pour une touche BBQ.'}
                  {selectedFood.id === 'poulet' &&
                    'Le poulet est une toile vierge! Il absorbe bien les épices. N\'hésitez pas à mariner avec du curcuma et du gingembre pour un poulet doré parfumé.'}
                  {selectedFood.id === 'porc' &&
                    'Le porc aime le sucré-salé. La cannelle et le gingembre créent des accords surprenants et délicieux.'}
                  {selectedFood.id === 'agneau' &&
                    'Le cumin est le partenaire naturel de l\'agneau. Associez-le avec de la coriandre pour une touche méditerranéenne.'}
                  {selectedFood.id === 'poisson' &&
                    'Les épices douces comme le curcuma et les herbes fraîches complètent sans masquer le goût délicat du poisson.'}
                  {selectedFood.id === 'fruits-mer' &&
                    'Les fruits de mer adorent le piquant! Cayenne, paprika fumé et gingembre frais sont vos alliés.'}
                  {selectedFood.id === 'legumes' &&
                    'Les légumes rôtis révèlent leur saveur avec le cumin et le curcuma. Essayez la cannelle sur les courges!'}
                  {selectedFood.id === 'riz-cereales' &&
                    'Une pincée de curcuma transforme un simple riz en accompagnement festif. Le safran reste le roi du risotto.'}
                  {selectedFood.id === 'desserts' &&
                    'La cannelle et la cardamome sont les reines de la pâtisserie. N\'ayez pas peur d\'expérimenter avec le gingembre!'}
                </p>
              </div>
            </div>
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

      {/* SEO Content */}
      <section className="bg-neutral-50 py-16">
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
      <section className="py-12">
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
