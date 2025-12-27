'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Loader2,
  CreditCard,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart, isLoading } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
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
      console.log('Checkout response:', data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data);
        alert('Payment error. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Connection error. Please try again.');
    }
    setIsCheckingOut(false);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#F77313]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Test Mode Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-800">Test mode / Mode test</p>
            <p className="text-sm text-yellow-700">
              This shop is in test mode. Do not use for real purchases.
              <br />
              <span className="text-yellow-600">Cette boutique est en mode test. Ne pas utiliser pour de vrais achats.</span>
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <Link
            href="/en/shop"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#F77313] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Discover our products and add them to your cart
            </p>
            <Link
              href="/en/shop"
              className="inline-flex items-center gap-2 bg-[#F77313] hover:bg-[#e56200] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              View shop
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
                >
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.product.featuredImage ? (
                      <Image
                        src={item.product.featuredImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/en/shop/${item.product.slug}`}
                      className="font-semibold text-gray-900 hover:text-[#F77313] transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-[#F77313] font-bold mt-1">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <span className="ml-auto font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="text-gray-500 hover:text-red-500 text-sm transition-colors"
              >
                Clear cart
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#F77313]">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Excluding shipping and taxes
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[#F77313] hover:bg-[#e56200] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Proceed to checkout
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment via Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
