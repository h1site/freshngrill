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
            <strong>Mode démo</strong> - Ceci est une commande de démonstration. / <strong>Demo mode</strong> - This is a demo order.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Merci pour votre commande!
          </h1>

          <p className="text-gray-600 mb-8">
            Votre paiement a été traité avec succès. Vous recevrez un email de
            confirmation sous peu.
          </p>

          {/* Order info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Confirmation par email
                </h3>
                <p className="text-sm text-gray-600">
                  Un email de confirmation avec les détails de votre commande
                  vous sera envoyé.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Produits numériques
                </h3>
                <p className="text-sm text-gray-600">
                  Si vous avez commandé des produits numériques, les liens de
                  téléchargement seront inclus dans l&apos;email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Produits physiques
                </h3>
                <p className="text-sm text-gray-600">
                  Les produits physiques seront expédiés sous 2-5 jours
                  ouvrables. Vous recevrez un email avec le numéro de suivi.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boutique"
              className="inline-flex items-center justify-center gap-2 bg-[#F77313] hover:bg-[#e56200] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Continuer vos achats
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>

          {/* Session ID for reference */}
          {sessionId && (
            <p className="text-xs text-gray-400 mt-8">
              Référence: {sessionId.substring(0, 20)}...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
