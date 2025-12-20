'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Beef, Fish, Drumstick, PiggyBank, Carrot, Wheat, Cake, Search } from 'lucide-react';

const FOOD_CATEGORIES = [
  {
    id: 'beef',
    name: 'Beef',
    icon: Beef,
    emoji: '🥩',
    spices: [
      { slug: 'cumin', name: 'Cumin', match: 5, note: 'Perfect for steaks and stews' },
      { slug: 'paprika', name: 'Paprika', match: 5, note: 'Ideal for color and flavor' },
      { slug: 'black-pepper', name: 'Black Pepper', match: 5, note: 'The timeless classic' },
      { slug: 'thyme', name: 'Thyme', match: 4, note: 'Excellent in marinades' },
      { slug: 'rosemary', name: 'Rosemary', match: 4, note: 'For roasts' },
      { slug: 'coriander', name: 'Coriander', match: 3, note: 'In slow-cooked dishes' },
    ],
  },
  {
    id: 'chicken',
    name: 'Chicken',
    icon: Drumstick,
    emoji: '🍗',
    spices: [
      { slug: 'paprika', name: 'Paprika', match: 5, note: 'Hungarian chicken paprikash' },
      { slug: 'turmeric', name: 'Turmeric', match: 5, note: 'For curries' },
      { slug: 'ginger', name: 'Ginger', match: 5, note: 'Asian cuisine' },
      { slug: 'cumin', name: 'Cumin', match: 4, note: 'Spiced chicken' },
      { slug: 'thyme', name: 'Thyme', match: 4, note: 'Classic roast chicken' },
      { slug: 'cinnamon', name: 'Cinnamon', match: 3, note: 'Moroccan tagines' },
    ],
  },
  {
    id: 'pork',
    name: 'Pork',
    icon: PiggyBank,
    emoji: '🐷',
    spices: [
      { slug: 'ginger', name: 'Ginger', match: 5, note: 'Asian stir-fried pork' },
      { slug: 'cinnamon', name: 'Cinnamon', match: 4, note: 'Pork chops' },
      { slug: 'cumin', name: 'Cumin', match: 4, note: 'Mexican carnitas' },
      { slug: 'paprika', name: 'Smoked Paprika', match: 5, note: 'BBQ ribs' },
      { slug: 'coriander', name: 'Coriander', match: 3, note: 'In marinades' },
      { slug: 'nutmeg', name: 'Nutmeg', match: 3, note: 'Charcuterie' },
    ],
  },
  {
    id: 'lamb',
    name: 'Lamb',
    icon: Beef,
    emoji: '🐑',
    spices: [
      { slug: 'cumin', name: 'Cumin', match: 5, note: 'The perfect match!' },
      { slug: 'coriander', name: 'Coriander', match: 5, note: 'Mediterranean cuisine' },
      { slug: 'rosemary', name: 'Rosemary', match: 5, note: 'Roast leg of lamb' },
      { slug: 'mint', name: 'Mint', match: 4, note: 'British tradition' },
      { slug: 'paprika', name: 'Paprika', match: 4, note: 'Stews' },
      { slug: 'cinnamon', name: 'Cinnamon', match: 3, note: 'Tagines' },
    ],
  },
  {
    id: 'fish',
    name: 'Fish',
    icon: Fish,
    emoji: '🐟',
    spices: [
      { slug: 'turmeric', name: 'Turmeric', match: 5, note: 'Fish curry' },
      { slug: 'ginger', name: 'Ginger', match: 5, note: 'Steamed fish' },
      { slug: 'paprika', name: 'Paprika', match: 4, note: 'Grilled fish' },
      { slug: 'coriander', name: 'Coriander', match: 4, note: 'Ceviche' },
      { slug: 'dill', name: 'Dill', match: 5, note: 'Nordic salmon' },
      { slug: 'fennel', name: 'Fennel', match: 4, note: 'Sea bass' },
    ],
  },
  {
    id: 'seafood',
    name: 'Seafood',
    icon: Fish,
    emoji: '🦐',
    spices: [
      { slug: 'ginger', name: 'Ginger', match: 5, note: 'Stir-fried shrimp' },
      { slug: 'cayenne', name: 'Cayenne Pepper', match: 5, note: 'Cajun style' },
      { slug: 'paprika', name: 'Smoked Paprika', match: 4, note: 'Paella' },
      { slug: 'turmeric', name: 'Turmeric', match: 4, note: 'Shrimp curry' },
      { slug: 'garlic', name: 'Garlic', match: 5, note: 'Garlic shrimp' },
      { slug: 'coriander', name: 'Coriander', match: 3, note: 'Thai seafood' },
    ],
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    icon: Carrot,
    emoji: '🥕',
    spices: [
      { slug: 'cumin', name: 'Cumin', match: 5, note: 'Roasted vegetables' },
      { slug: 'turmeric', name: 'Turmeric', match: 5, note: 'Golden cauliflower' },
      { slug: 'paprika', name: 'Paprika', match: 4, note: 'Potatoes' },
      { slug: 'coriander', name: 'Coriander', match: 4, note: 'Roasted carrots' },
      { slug: 'ginger', name: 'Ginger', match: 3, note: 'Stir-fried vegetables' },
      { slug: 'cinnamon', name: 'Cinnamon', match: 3, note: 'Squash' },
    ],
  },
  {
    id: 'rice-grains',
    name: 'Rice & Grains',
    icon: Wheat,
    emoji: '🍚',
    spices: [
      { slug: 'turmeric', name: 'Turmeric', match: 5, note: 'Golden rice' },
      { slug: 'cumin', name: 'Cumin', match: 5, note: 'Pilaf rice' },
      { slug: 'cinnamon', name: 'Cinnamon', match: 4, note: 'Rice pudding' },
      { slug: 'cardamom', name: 'Cardamom', match: 5, note: 'Biryani' },
      { slug: 'saffron', name: 'Saffron', match: 5, note: 'Paella, risotto' },
      { slug: 'coriander', name: 'Coriander', match: 3, note: 'Couscous' },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    icon: Cake,
    emoji: '🍰',
    spices: [
      { slug: 'cinnamon', name: 'Cinnamon', match: 5, note: 'Apple pies' },
      { slug: 'ginger', name: 'Ginger', match: 5, note: 'Gingerbread' },
      { slug: 'nutmeg', name: 'Nutmeg', match: 4, note: 'Custards and flans' },
      { slug: 'cardamom', name: 'Cardamom', match: 5, note: 'Middle Eastern pastries' },
      { slug: 'vanilla', name: 'Vanilla', match: 5, note: 'The universal classic' },
      { slug: 'star-anise', name: 'Star Anise', match: 3, note: 'Compotes' },
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

  const filteredCategories = searchQuery
    ? FOOD_CATEGORIES.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FOOD_CATEGORIES;

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/en/" className="hover:text-[#F77313]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/en/spices/" className="hover:text-[#F77313]">
              Spices
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">Pairing Guide</span>
          </nav>
        </div>
      </div>

      <section className="bg-black text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              Interactive Guide
            </span>
            <h1 className="text-4xl md:text-6xl font-display mt-3 mb-6">
              Which Spice with Which Meat?
            </h1>
            <p className="text-neutral-400 text-lg">
              Select a food to discover the best spices to use.
              A practical guide for perfect pairings in the kitchen.
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a food..."
              className="w-full pl-12 pr-4 py-3 border border-neutral-200 text-lg focus:outline-none focus:border-[#F77313]"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-12">
          {filteredCategories.map((category) => {
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

        {selectedFood ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-50 border border-neutral-200 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{selectedFood.emoji}</span>
                <div>
                  <h2 className="font-display text-3xl text-black">
                    Spices for {selectedFood.name}
                  </h2>
                  <p className="text-neutral-600">
                    The best spices to pair with {selectedFood.name.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {selectedFood.spices.map((spice) => (
                  <Link
                    key={spice.slug}
                    href={`/en/spices/${spice.slug}/`}
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
                        <span className="text-xs text-neutral-500 block mb-1">Match</span>
                        <MatchIndicator level={spice.match} />
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313]" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="font-medium text-black mb-3">💡 Chef&apos;s Tip</h3>
                <p className="text-neutral-600">
                  {selectedFood.id === 'beef' &&
                    'For beef, start with black pepper and salt. Add cumin for an earthy note or smoked paprika for a BBQ touch.'}
                  {selectedFood.id === 'chicken' &&
                    'Chicken is a blank canvas! It absorbs spices well. Don\'t hesitate to marinate with turmeric and ginger for a fragrant golden chicken.'}
                  {selectedFood.id === 'pork' &&
                    'Pork loves sweet and savory. Cinnamon and ginger create surprising and delicious pairings.'}
                  {selectedFood.id === 'lamb' &&
                    'Cumin is the natural partner for lamb. Combine it with coriander for a Mediterranean touch.'}
                  {selectedFood.id === 'fish' &&
                    'Mild spices like turmeric and fresh herbs complement without masking the delicate taste of fish.'}
                  {selectedFood.id === 'seafood' &&
                    'Seafood loves heat! Cayenne, smoked paprika and fresh ginger are your allies.'}
                  {selectedFood.id === 'vegetables' &&
                    'Roasted vegetables reveal their flavor with cumin and turmeric. Try cinnamon on squash!'}
                  {selectedFood.id === 'rice-grains' &&
                    'A pinch of turmeric transforms simple rice into a festive side dish. Saffron remains the king of risotto.'}
                  {selectedFood.id === 'desserts' &&
                    'Cinnamon and cardamom are the queens of baking. Don\'t be afraid to experiment with ginger!'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">👆</p>
            <h2 className="text-2xl font-display text-black mb-2">
              Select a Food
            </h2>
            <p className="text-neutral-600">
              Click on a category above to see recommended spices
            </p>
          </div>
        )}
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-neutral">
            <h2 className="font-display text-3xl text-black">
              How to Pair Spices Properly?
            </h2>
            <p>
              The art of spice-food pairings is essential for successful dishes.
              Each meat, fish or vegetable has its preferred spices that enhance
              its natural taste without masking it.
            </p>
            <h3>Golden Rules</h3>
            <ul>
              <li>
                <strong>Start slowly:</strong> It&apos;s easier to add spices
                than to remove them
              </li>
              <li>
                <strong>Respect classic pairings:</strong> Cumin + lamb, ginger +
                chicken, paprika + beef are sure values
              </li>
              <li>
                <strong>Dare to mix:</strong> Cumin and coriander, cinnamon and ginger
                work very well together
              </li>
              <li>
                <strong>Adapt to cooking:</strong> Some spices are added at the beginning
                of cooking (cumin), others at the end (fresh herbs)
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/en/spices/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium hover:bg-[#F77313] transition-colors"
          >
            ← View all spices
          </Link>
        </div>
      </section>
    </main>
  );
}
