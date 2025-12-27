'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types/shop';

interface Props {
  product: Product;
  quantity?: number;
  locale?: 'fr' | 'en';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AddToCartButton({
  product,
  quantity = 1,
  locale = 'fr',
  className = '',
  size = 'md',
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isEN = locale === 'en';

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Vérifier inventaire
  const outOfStock =
    product.trackInventory &&
    product.inventoryQuantity <= 0 &&
    !product.allowBackorder;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 gap-2',
    lg: 'px-6 py-3 text-lg gap-2',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (outOfStock) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center ${sizeClasses[size]} bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium ${className}`}
      >
        {isEN ? 'Out of stock' : 'Rupture de stock'}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center justify-center ${sizeClasses[size]} font-semibold rounded-lg transition-all ${
        added
          ? 'bg-green-600 hover:bg-green-600 text-white'
          : 'bg-[#F77313] hover:bg-[#e56200] text-white'
      } ${className}`}
    >
      {added ? (
        <>
          <Check className={iconSize[size]} />
          {isEN ? 'Added!' : 'Ajouté!'}
        </>
      ) : (
        <>
          <ShoppingCart className={iconSize[size]} />
          {isEN ? 'Add to cart' : 'Ajouter au panier'}
        </>
      )}
    </button>
  );
}
