import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Mail, TrendingUp, Users, Eye, Link2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Advertising & Partnerships | Menucochon',
  description:
    'Promote your business on Menucochon. Banner ads at $100/month or sponsored article with permanent dofollow link at $150.',
  keywords: [
    'advertising',
    'partnership',
    'sponsoring',
    'menucochon',
    'promotion',
    'backlink',
    'dofollow',
  ],
  alternates: {
    canonical: '/en/advertising/',
    languages: {
      'fr-CA': '/publicite/',
      'en-CA': '/en/advertising/',
      'x-default': '/publicite/',
    },
  },
  openGraph: {
    title: 'Advertising & Partnerships | Menucochon',
    description:
      'Promote your business on Menucochon. Banner ads or sponsored articles.',
    siteName: 'Menucochon',
    locale: 'en_CA',
    type: 'website',
  },
};

export default function AdvertisingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              Partnerships
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6 mt-4">
              Advertise on Menucochon
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Reach a passionate community of Quebec cuisine enthusiasts and introduce
              your business to thousands of foodies every month.
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-black mb-4">
              Why advertise on Menucochon?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Your support helps us continue creating quality content
              and grow this exciting project.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Targeted Audience</h3>
              <p className="text-neutral-600 text-sm">
                Quebec cuisine enthusiasts looking for quality products and services.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Optimal Visibility</h3>
              <p className="text-neutral-600 text-sm">
                Strategic placement on the most visited pages of the site.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Mutual Growth</h3>
              <p className="text-neutral-600 text-sm">
                Your contributions help us develop more content and features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-black mb-4">
              Our Advertising Options
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Two simple and effective options to promote your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Option 1 - Banner */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-neutral-200">
              <div className="text-center mb-6">
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                  Option 1
                </span>
                <h3 className="font-display text-2xl text-black mt-2">Banner Ad</h3>
                <div className="mt-4">
                  <span className="font-display text-5xl text-black">$100</span>
                  <span className="text-neutral-500">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Banner displayed on <strong>every recipe page</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Premium placement in sidebar or content</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Link to your website</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Option to change banner each month</span>
                </li>
              </ul>

              <Link
                href="/en/contact"
                className="block w-full bg-neutral-900 text-white text-center py-3 font-medium hover:bg-neutral-800 transition-colors"
              >
                Book my banner
              </Link>
            </div>

            {/* Option 2 - Article */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#F77313] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F77313] text-white text-xs font-medium px-3 py-1 rounded-full">
                Popular
              </div>
              <div className="text-center mb-6">
                <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                  Option 2
                </span>
                <h3 className="font-display text-2xl text-black mt-2">Guest Post</h3>
                <div className="mt-4">
                  <span className="font-display text-5xl text-black">$150</span>
                  <span className="text-neutral-500">/lifetime</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Dedicated article about your business/product</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600"><strong>Permanent dofollow link</strong> to your site</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">SEO optimized</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Stays online forever</span>
                </li>
                <li className="flex items-start gap-3">
                  <Link2 className="w-5 h-5 text-[#F77313] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600">Excellent for your Google ranking</span>
                </li>
              </ul>

              <Link
                href="/en/contact"
                className="block w-full bg-[#F77313] text-white text-center py-3 font-medium hover:bg-[#e56610] transition-colors"
              >
                Order my article
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Help us */}
      <section className="bg-neutral-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              Help Us Grow
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              Menucochon is a passion project. Every partnership allows us to invest
              in better photos, videos, and recipes for our community. By choosing
              to advertise with us, you directly support the creation of quality
              Quebec culinary content.
            </p>
            <div className="text-6xl mb-8">🙏</div>
          </div>
        </div>
      </section>

      {/* CTA Contact */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-black text-white p-8 md:p-12 max-w-3xl mx-auto text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-[#F77313]" />
            <h2 className="font-display text-3xl mb-4">
              Ready to get started?
            </h2>
            <p className="text-neutral-400 mb-8">
              Contact us to discuss your advertising project.
              We typically respond within 24 hours.
            </p>
            <Link
              href="/en/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#F77313] text-white px-8 py-4 font-medium hover:bg-[#e56610] transition-colors text-lg"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
