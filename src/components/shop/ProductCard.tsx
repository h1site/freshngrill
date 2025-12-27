'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Package, Download } from 'lucide-react';
import type { Product } from '@/types/shop';
import AddToCartButton from './AddToCartButton';

interface Props {
  product: Product;
  locale?: 'fr' | 'en';
}

export default function ProductCard({ product, locale = 'fr' }: Props) {
  const isEN = locale === 'en';
  const name = isEN && product.nameEn ? product.nameEn : product.name;
  const description = isEN && product.descriptionEn ? product.descriptionEn : product.description;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isEN ? 'en-CA' : 'fr-CA', {
      style: 'currency',
      currency: product.currency,
    }).format(price);
  };

  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const outOfStock =
    product.trackInventory &&
    product.inventoryQuantity <= 0 &&
    !product.allowBackorder;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <Link
        href={isEN ? `/en/store/${product.slug}` : `/boutique/${product.slug}`}
        className="block relative aspect-square overflow-hidden"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOnSale && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {isEN ? 'SALE' : 'PROMO'}
            </span>
          )}
          {product.productType === 'digital' && (
            <span className="bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <Download className="w-3 h-3" />
              {isEN ? 'Digital' : 'Numérique'}
            </span>
          )}
          {product.featured && (
            <span className="bg-[#F77313] text-white text-xs font-medium px-2 py-1 rounded">
              {isEN ? 'Featured' : 'Vedette'}
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded">
              {isEN ? 'Out of stock' : 'Rupture de stock'}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link
          href={isEN ? `/en/store/${product.slug}` : `/boutique/${product.slug}`}
          className="block"
        >
          <h3 className="font-semibold text-gray-900 group-hover:text-[#F77313] transition-colors line-clamp-2 mb-1">
            {name}
          </h3>
        </Link>

        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{description}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-[#F77313]">
            {formatPrice(product.price)}
          </span>
          {isOnSale && product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <AddToCartButton product={product} locale={locale} className="w-full" />
      </div>
    </div>
  );
}
