import { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { transformProduct } from '@/types/shop';
import ProductCard from '@/components/shop/ProductCard';
import { ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Boutique | Menucochon',
  description:
    'Découvrez nos produits: livres de recettes, épices, accessoires de cuisine et plus encore.',
  openGraph: {
    title: 'Boutique | Menucochon',
    description: 'Découvrez nos produits culinaires',
    type: 'website',
  },
};

async function getProducts() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  return data?.map(transformProduct) || [];
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Coming Soon Warning */}
      <div className="bg-amber-50 border-b border-amber-200 py-3">
        <div className="container mx-auto px-4 flex items-center justify-center gap-3">
          <span className="text-xl">🚧</span>
          <p className="text-sm text-amber-800">
            <strong>Bientôt disponible</strong> - Les produits ne sont pas encore en vente. / <strong>Coming soon</strong> - Products are not yet for sale.
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#F77313] to-[#ff9a4d] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Boutique - Bientôt disponible</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Livres de recettes, épices, accessoires de cuisine et plus encore
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Boutique en préparation
            </h2>
            <p className="text-gray-500">
              Nos produits seront bientôt disponibles. Revenez nous voir!
            </p>
          </div>
        ) : (
          <>
            {/* Featured products */}
            {products.some((p) => p.featured) && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Produits vedettes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products
                    .filter((p) => p.featured)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} locale="fr" />
                    ))}
                </div>
              </section>
            )}

            {/* All products */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tous les produits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products
                  .filter((p) => !p.featured)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} locale="fr" />
                  ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
