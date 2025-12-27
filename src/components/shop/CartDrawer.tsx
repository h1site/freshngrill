'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  locale?: 'fr' | 'en';
}

export default function CartDrawer({ isOpen, onClose, locale = 'fr' }: Props) {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const isEN = locale === 'en';

  const t = isEN
    ? {
        cart: 'Your Cart',
        empty: 'Your cart is empty',
        continueShopping: 'Continue shopping',
        subtotal: 'Subtotal',
        taxNote: 'Taxes calculated at checkout',
        checkout: 'Proceed to checkout',
        clear: 'Clear cart',
      }
    : {
        cart: 'Votre panier',
        empty: 'Votre panier est vide',
        continueShopping: 'Continuer vos achats',
        subtotal: 'Sous-total',
        taxNote: 'Taxes calculées à la caisse',
        checkout: 'Passer à la caisse',
        clear: 'Vider le panier',
      };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isEN ? 'en-CA' : 'fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(price);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert(isEN ? 'Checkout error. Please try again.' : 'Erreur de paiement. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(isEN ? 'Connection error. Please try again.' : 'Erreur de connexion. Veuillez réessayer.');
    }
    setIsCheckingOut(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{t.cart}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">{t.empty}</p>
              <Link
                href={isEN ? '/en/shop' : '/boutique'}
                onClick={onClose}
                className="text-[#F77313] hover:underline"
              >
                {t.continueShopping}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    {item.product.featuredImage ? (
                      <Image
                        src={item.product.featuredImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {isEN && item.product.nameEn
                        ? item.product.nameEn
                        : item.product.name}
                    </h3>
                    <p className="text-[#F77313] font-semibold">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-200 rounded"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-200 rounded"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 hover:bg-red-100 text-red-500 rounded ml-auto"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>{t.subtotal}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="text-sm text-gray-500">{t.taxNote}</p>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#F77313] hover:bg-[#e56200] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isEN ? 'Processing...' : 'Traitement...'}
                </>
              ) : (
                t.checkout
              )}
            </button>

            <button
              onClick={clearCart}
              className="w-full text-gray-500 hover:text-red-500 text-sm transition-colors"
            >
              {t.clear}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
