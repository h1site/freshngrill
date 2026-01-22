import Link from 'next/link';
import { Megaphone } from 'lucide-react';

interface AdvertisingCTAProps {
  locale?: 'fr' | 'en';
}

export function AdvertisingCTA({ locale = 'fr' }: AdvertisingCTAProps) {
  const t = locale === 'en' ? {
    badge: 'Partnership',
    title: 'Advertise on Menucochon',
    methods: '2 methods: Banner Ad or Guest Post',
    helpUs: 'Help us grow this passion project!',
    cta: 'Learn more',
    href: '/en/advertising',
  } : {
    badge: 'Partenariat',
    title: 'Annoncez sur Menucochon',
    methods: '2 méthodes : Bannière publicitaire ou Guest Post',
    helpUs: 'Aidez-nous à faire grandir ce projet passion!',
    cta: 'En savoir plus',
    href: '/publicite',
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-black/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-6 md:p-10 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-[#F77313] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Megaphone className="w-10 h-10 text-white" />
            </div>

            {/* Content */}
            <span className="inline-block text-[#F77313] text-xs font-medium uppercase tracking-widest mb-2">
              {t.badge}
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
              {t.title}
            </h2>
            <p className="text-white font-medium text-lg mb-2">
              {t.methods}
            </p>
            <p className="text-neutral-500 text-sm mb-6">{t.helpUs}</p>

            <Link
              href={t.href}
              className="inline-flex items-center gap-2 bg-[#F77313] text-white px-6 py-3 font-medium hover:bg-[#e56610] transition-colors rounded-lg"
            >
              {t.cta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
