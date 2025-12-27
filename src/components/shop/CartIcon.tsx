'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Props {
  locale?: 'fr' | 'en';
  className?: string;
}

export default function CartIcon({ locale = 'fr', className = '' }: Props) {
  const { itemCount, isLoading } = useCart();
  const isEN = locale === 'en';

  return (
    <Link
      href={isEN ? '/en/store/cart' : '/boutique/panier'}
      className={`relative inline-flex items-center justify-center p-2 text-gray-700 hover:text-[#F77313] transition-colors ${className}`}
      aria-label={isEN ? 'Shopping cart' : 'Panier'}
    >
      <ShoppingCart className="w-6 h-6" />
      {!isLoading && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#F77313] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
