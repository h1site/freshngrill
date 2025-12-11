'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="py-16 md:py-24 bg-[#F77313]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Mail className="w-10 h-10 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            Restez Inspiré
          </h2>
          <p className="text-white/80 mb-8">
            Recevez nos meilleures recettes et conseils culinaires directement dans votre boîte mail.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white font-medium uppercase tracking-wide text-sm hover:bg-neutral-900 transition-colors"
            >
              S&apos;inscrire
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-white/50 text-xs mt-4">
            Pas de spam. Désabonnement en un clic.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
