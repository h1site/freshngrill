import { Metadata } from 'next';
import Link from 'next/link';
import { Timer, ShoppingCart } from 'lucide-react';

export const metadata: Metadata = {
  title: "BBQ Tools & Calculators | Fresh N' Grill",
  description: 'Free BBQ tools: cooking time calculator with interactive timer, party planner with shopping list. Everything you need for the perfect BBQ.',
  alternates: {
    canonical: '/tools/',
  },
  openGraph: {
    title: "BBQ Tools & Calculators | Fresh N' Grill",
    description: 'Free BBQ tools: cooking time calculator, party planner, and more.',
    url: '/tools/',
    siteName: "Fresh N' Grill",
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: "Fresh N' Grill Tools" }],
  },
};

const tools = [
  {
    href: '/tools/bbq-calculator/',
    icon: Timer,
    title: 'BBQ Cooking Calculator',
    description: 'Calculate exact grilling times for any meat. Interactive timer with flip alerts and doneness guide.',
    emoji: '🔥',
  },
  {
    href: '/tools/bbq-party-calculator/',
    icon: ShoppingCart,
    title: 'BBQ Party Calculator',
    description: 'Plan how much meat per person for your BBQ party. Get a complete shopping list with quantities in kg or lbs.',
    emoji: '🎉',
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-12">
          <p className="text-[#00bf63] font-bold uppercase tracking-wider text-sm mb-2">
            Grilling Tools
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-neutral-900 mb-4">
            BBQ Tools & Calculators
          </h1>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Free tools to help you master the grill. Calculate cooking times, plan your BBQ party,
            and never overcook or underbuy again.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-[#00bf63] hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{tool.emoji}</span>
                <tool.icon className="w-6 h-6 text-[#00bf63]" />
              </div>
              <h2 className="font-display text-2xl tracking-wide text-neutral-900 mb-2 group-hover:text-[#00bf63] transition-colors">
                {tool.title}
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
