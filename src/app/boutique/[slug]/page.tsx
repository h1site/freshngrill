import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase';
import { transformProduct } from '@/types/shop';
import AddToCartButton from '@/components/shop/AddToCartButton';
import { ArrowLeft, Package, Download, Truck, Shield } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  return data ? transformProduct(data) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Produit non trouvé' };
  }

  return {
    title: product.seoTitle || `${product.name} | Boutique Menucochon`,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.featuredImage ? [product.featuredImage] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: product.currency,
    }).format(price);
  };

  const isOnSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = isOnSale
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Coming Soon Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-center justify-center gap-3">
          <span className="text-xl">🚧</span>
          <p className="text-sm text-amber-800">
            <strong>Bientôt disponible</strong> - Ce produit n'est pas encore en vente. / <strong>Coming soon</strong> - This product is not yet for sale.
          </p>
        </div>

        {/* Breadcrumb */}
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#F77313] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la boutique
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Images */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}
                {isOnSale && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Gallery */}
              {product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-3">
                {product.productType === 'digital' ? (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
                    <Download className="w-4 h-4" />
                    Produit numérique
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                    <Truck className="w-4 h-4" />
                    Livraison disponible
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-[#F77313]">
                  {formatPrice(product.price)}
                </span>
                {isOnSale && product.compareAtPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-gray mb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Stock status */}
              {product.trackInventory && (
                <div className="mb-6">
                  {product.inventoryQuantity > 10 ? (
                    <span className="text-green-600 font-medium">
                      ✓ En stock
                    </span>
                  ) : product.inventoryQuantity > 0 ? (
                    <span className="text-amber-600 font-medium">
                      ⚠ Plus que {product.inventoryQuantity} en stock
                    </span>
                  ) : product.allowBackorder ? (
                    <span className="text-blue-600 font-medium">
                      📦 Disponible en précommande
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ✗ Rupture de stock
                    </span>
                  )}
                </div>
              )}

              {/* Add to cart */}
              <AddToCartButton
                product={product}
                size="lg"
                className="w-full md:w-auto mb-6"
              />

              {/* Features */}
              <div className="border-t pt-6 mt-auto space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Paiement sécurisé par Stripe</span>
                </div>
                {product.productType === 'digital' ? (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Download className="w-5 h-5 text-purple-600" />
                    <span>Téléchargement immédiat après paiement</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Livraison au Canada et États-Unis</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
