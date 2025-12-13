'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface NewsletterSectionProps {
  locale?: Locale;
}

export function NewsletterSection({ locale = 'fr' }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const t = locale === 'en' ? {
    title: 'Stay Inspired',
    subtitle: 'Receive our best recipes and cooking tips directly in your inbox.',
    placeholder: 'Your email address',
    subscribe: 'Subscribe',
    noSpam: 'No spam. Unsubscribe with one click.',
    invalidEmail: 'Please enter a valid email address.',
    errorGeneric: 'An error occurred. Please try again.',
  } : {
    title: 'Restez Inspiré',
    subtitle: 'Recevez nos meilleures recettes et conseils culinaires directement dans votre boîte mail.',
    placeholder: 'Votre adresse email',
    subscribe: "S'inscrire",
    noSpam: 'Pas de spam. Désabonnement en un clic.',
    invalidEmail: 'Veuillez entrer une adresse email valide.',
    errorGeneric: 'Une erreur est survenue. Veuillez réessayer.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('error');
      setMessage(t.invalidEmail);
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || t.errorGeneric);
      }
    } catch {
      setStatus('error');
      setMessage(t.errorGeneric);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#faf8f5]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-[#F77313]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-[#F77313]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display text-black mb-4">
            {t.title}
          </h2>
          <p className="text-neutral-600 mb-8">
            {t.subtitle}
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 bg-green-50 border border-green-200 px-6 py-4 rounded-lg max-w-md mx-auto"
            >
              <Check className="w-6 h-6 text-green-600" />
              <span className="text-green-700 font-medium">{message}</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder={t.placeholder}
                  disabled={status === 'loading'}
                  className="flex-1 px-5 py-3.5 bg-white border border-neutral-200 text-black placeholder:text-neutral-400 focus:outline-none focus:border-[#F77313] transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#F77313] text-white font-medium uppercase tracking-wide text-sm hover:bg-[#d45f0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {t.subscribe}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{message}</span>
                </motion.div>
              )}
            </form>
          )}

          <p className="text-neutral-400 text-xs mt-4">
            {t.noSpam}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
