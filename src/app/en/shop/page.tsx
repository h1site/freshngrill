import { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { transformProduct } from '@/types/shop';
import ProductCard from '@/components/shop/ProductCard';
import { ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shop | Menucochon',
  description:
    'Discover our products: recipe books, spices, kitchen accessories and more.',
  openGraph: {
    title: 'Shop | Menucochon',
    description: 'Discover our culinary products',
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
      {/* Test Mode Warning */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-3">
        <div className="container mx-auto px-4 flex items-center justify-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm text-yellow-800">
            <strong>Test mode</strong> - Do not use for real purchases. / <strong>Mode test</strong> - Ne pas utiliser pour de vrais achats.
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#F77313] to-[#ff9a4d] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Recipe books, spices, kitchen accessories and more
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Shop coming soon
            </h2>
            <p className="text-gray-500">
              Our products will be available soon. Come back later!
            </p>
          </div>
        ) : (
          <>
            {/* Featured products */}
            {products.some((p) => p.featured) && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Featured Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products
                    .filter((p) => p.featured)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} locale="en" />
                    ))}
                </div>
              </section>
            )}

            {/* All products */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                All Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products
                  .filter((p) => !p.featured)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} locale="en" />
                  ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
