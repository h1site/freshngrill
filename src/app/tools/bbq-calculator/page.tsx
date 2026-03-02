import { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import BbqCalculator from '@/components/tools/BbqCalculator';
import BbqCalculatorSchema from '@/components/schema/BbqCalculatorSchema';

export const metadata: Metadata = {
  title: 'BBQ Cooking Calculator | Grill Time & Temperature Guide',
  description: 'Calculate exact grilling times for steak, ribs, chicken, burgers and more. Interactive timer with flip alerts and doneness guide. Never overcook your BBQ again!',
  alternates: {
    canonical: '/tools/bbq-calculator/',
  },
  openGraph: {
    title: "BBQ Cooking Calculator | Fresh N' Grill",
    description: 'Calculate exact grilling times for steak, ribs, chicken, burgers and more. Interactive timer with flip alerts.',
    url: '/tools/bbq-calculator/',
    siteName: "Fresh N' Grill",
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BBQ Cooking Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "BBQ Cooking Calculator | Fresh N' Grill",
    description: 'Calculate exact grilling times. Interactive timer with flip alerts and doneness guide.',
    images: ['/opengraph-image'],
  },
};

export default function BbqCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <BbqCalculatorSchema />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-10">
          <p className="text-[#00bf63] font-bold uppercase tracking-wider text-sm mb-2">
            Grilling Tools
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-neutral-900 mb-4">
            BBQ Cooking Calculator
          </h1>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Select your meat, set the thickness and desired doneness, and get exact cooking times
            with an interactive timer that tells you when to flip and when it&apos;s done.
          </p>
        </div>

        <BbqCalculator />

        {/* SEO content */}
        <section className="mt-20 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl tracking-wide text-neutral-900 mb-6">
            How to Use the BBQ Cooking Calculator
          </h2>
          <div className="text-neutral-600 space-y-4 text-base leading-relaxed">
            <p>
              Our BBQ Cooking Calculator takes the guesswork out of grilling. Whether you&apos;re
              cooking a thick ribeye steak, baby back ribs, or a simple chicken breast, this tool
              calculates the precise cooking time based on the cut, thickness, doneness preference,
              and grill temperature.
            </p>
            <p>
              The interactive timer guides you step by step — with sound alerts when it&apos;s time
              to flip and when your food is ready. No more hovering over the grill wondering
              &ldquo;is it done yet?&rdquo;
            </p>
            <h3 className="font-display text-xl tracking-wide text-neutral-900 pt-4">
              Understanding Doneness Levels
            </h3>
            <p>
              <strong>Rare (125°F):</strong> Cool red center, very soft. Best for high-quality steaks and lamb.
              <br />
              <strong>Medium Rare (135°F):</strong> Warm red center, firm but yielding. The gold standard for steak.
              <br />
              <strong>Medium (145°F):</strong> Pink center, firmer texture. Great for steaks, pork, and salmon.
              <br />
              <strong>Medium Well (155°F):</strong> Slightly pink, firm. Ideal for burgers and pork chops.
              <br />
              <strong>Well Done (165°F):</strong> No pink, fully cooked through. Required for chicken and poultry.
            </p>
            <h3 className="font-display text-xl tracking-wide text-neutral-900 pt-4">
              Always Use a Meat Thermometer
            </h3>
            <p>
              While this calculator provides reliable time estimates based on typical grilling
              conditions, every grill is different. Wind, altitude, starting meat temperature, and
              grill hot spots all affect cooking time. An instant-read thermometer is the most
              reliable way to check doneness — insert it into the thickest part of the meat,
              avoiding bone.
            </p>
          </div>
        </section>

        {/* Cross-link to other tool */}
        <Link
          href="/tools/bbq-party-calculator/"
          className="mt-16 max-w-3xl mx-auto flex items-center gap-4 bg-neutral-950 text-white rounded-2xl p-6 hover:bg-neutral-900 transition-colors group"
        >
          <div className="p-3 rounded-xl bg-[#00bf63]/20 group-hover:bg-[#00bf63]/30 transition-colors">
            <ShoppingCart className="w-6 h-6 text-[#00bf63]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">BBQ Party Calculator</p>
            <p className="text-neutral-400 text-xs mt-0.5">Plan how much meat per person and get a complete shopping list</p>
          </div>
          <span className="text-neutral-500 group-hover:text-white transition-colors text-xl">→</span>
        </Link>
      </div>
    </main>
  );
}
