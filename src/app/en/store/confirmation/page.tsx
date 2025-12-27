'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Mail, ArrowRight, Download } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  // Clear cart after successful purchase
  useEffect(() => {
    if (sessionId && !cleared) {
      clearCart();
      setCleared(true);
    }
  }, [sessionId, cleared, clearCart]);

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Demo Mode Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-center justify-center gap-3">
          <span className="text-xl">🚧</span>
          <p className="text-sm text-amber-800">
            <strong>Demo mode</strong> - This is a demo order. / <strong>Mode démo</strong> - Ceci est une commande de démonstration.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank you for your order!
          </h1>

          <p className="text-gray-600 mb-8">
            Your payment has been processed successfully. You will receive a
            confirmation email shortly.
          </p>

          {/* Order info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Email confirmation
                </h3>
                <p className="text-sm text-gray-600">
                  A confirmation email with your order details will be sent to
                  you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Digital products
                </h3>
                <p className="text-sm text-gray-600">
                  If you ordered digital products, download links will be
                  included in the email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Physical products
                </h3>
                <p className="text-sm text-gray-600">
                  Physical products will be shipped within 2-5 business days.
                  You will receive an email with the tracking number.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/en/store"
              className="inline-flex items-center justify-center gap-2 bg-[#F77313] hover:bg-[#e56200] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Continue shopping
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/en"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Back to home
            </Link>
          </div>

          {/* Session ID for reference */}
          {sessionId && (
            <p className="text-xs text-gray-400 mt-8">
              Reference: {sessionId.substring(0, 20)}...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
