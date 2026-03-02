import { Metadata } from 'next';
import BbqPartyCalculator from '@/components/tools/BbqPartyCalculator';

export const metadata: Metadata = {
  title: 'BBQ Calculator Per Person | How Much Meat for Your BBQ Party',
  description: 'Free BBQ calculator for your party, dinner, or event. Calculate how much meat per person in kg or lbs, plan your BBQ menu, and get a complete shopping list. Never run out of food again!',
  keywords: [
    'calculator bbq', 'free calculator bbq', 'calculator bbq menu', 'calculator bbq party',
    'bbq calculator per person', 'calculator bbq recipes', 'calculator bbq dinner',
    'calculator bbq app', 'how much meat per person for bbq in kg',
    'bbq party planner', 'bbq shopping list', 'meat calculator per person',
  ],
  alternates: {
    canonical: '/tools/bbq-party-calculator/',
  },
  openGraph: {
    title: "BBQ Party Calculator — How Much Meat Per Person | Fresh N' Grill",
    description: 'Free BBQ calculator: plan your menu, calculate meat per person in kg or lbs, and get a complete shopping list for your BBQ party.',
    url: '/tools/bbq-party-calculator/',
    siteName: "Fresh N' Grill",
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BBQ Party Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BBQ Party Calculator — How Much Meat Per Person',
    description: 'Free BBQ calculator: plan your menu, calculate meat per person, and get a shopping list.',
    images: ['/opengraph-image'],
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BBQ Party Calculator',
  description: 'Free BBQ calculator to plan how much meat per person for your BBQ party, dinner, or event. Get a complete shopping list with quantities in kg or lbs.',
  url: 'https://freshngrill.com/tools/bbq-party-calculator/',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Organization', name: "Fresh N' Grill", url: 'https://freshngrill.com' },
};

export default function BbqPartyCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-10">
          <p className="text-[#00bf63] font-bold uppercase tracking-wider text-sm mb-2">
            Free BBQ Calculator
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-neutral-900 mb-4">
            BBQ Party Calculator
          </h1>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto leading-relaxed">
            How much meat per person for your BBQ? Plan your menu, select your meats and sides,
            and get an instant shopping list with exact quantities in kg or lbs.
          </p>
        </div>

        <BbqPartyCalculator />

        {/* SEO content targeting all keyword intents */}
        <section className="mt-20 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl tracking-wide text-neutral-900 mb-6">
            How Much Meat Per Person for BBQ?
          </h2>
          <div className="text-neutral-600 space-y-4 text-base leading-relaxed">
            <p>
              Planning a BBQ party, dinner, or backyard cookout? The most common question is
              &ldquo;how much meat per person for BBQ?&rdquo; — and the answer depends on the type
              of meat, your guests&apos; appetites, and how many sides you&apos;re serving.
            </p>

            <h3 className="font-display text-xl tracking-wide text-neutral-900 pt-4">
              General BBQ Meat Guidelines Per Person
            </h3>
            <p>
              As a general rule, plan for <strong>200–250g (about ½ lb) of raw meat per person</strong> when
              serving multiple proteins with sides. For a meat-heavy BBQ with fewer sides,
              increase to <strong>300–350g (¾ lb) per person</strong>. These amounts are for raw,
              bone-free meat — bone-in cuts like ribs require more because of the bone weight.
            </p>

            <h3 className="font-display text-xl tracking-wide text-neutral-900 pt-4">
              How Much Meat Per Person for BBQ in KG?
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Burgers:</strong> 0.2–0.25 kg per person (2 patties)</li>
              <li><strong>Steaks:</strong> 0.25–0.3 kg per person (one 10 oz steak)</li>
              <li><strong>Ribs:</strong> 0.4–0.5 kg per person (half rack, bone-in weight)</li>
              <li><strong>Chicken:</strong> 0.2–0.25 kg per person (breast or thighs)</li>
              <li><strong>Sausages:</strong> 0.2 kg per person (2 links)</li>
              <li><strong>Pulled pork:</strong> 0.35 kg raw per person (shrinks 40% when cooked)</li>
            </ul>

            <h3 className="font-display text-xl tracking-wide text-neutral-900 pt-4">
              BBQ Calculator Tips for Your Party
            </h3>
            <p>
              Our free BBQ calculator does the math for you. Simply enter how many guests
              you&apos;re hosting, select your meats and sides, and get a complete shopping
              list. The calculator adjusts quantities based on appetite level — whether it&apos;s
              a light family gathering or a hearty game-day feast.
            </p>
            <p>
              <strong>Pro tip:</strong> When serving 3 or more different meats, people eat less
              of each type. Our calculator automatically reduces per-person quantities when you
              select multiple proteins, so you won&apos;t overbuy.
            </p>

            <h3 className="font-display text-xl tracking-wide text-neutral-900 pt-4">
              Planning Your BBQ Menu
            </h3>
            <p>
              A well-rounded BBQ menu includes 1–2 main proteins, 2–3 side dishes, bread or buns,
              and plenty of drinks. For a crowd-pleasing spread, pair a red meat (burgers or steaks)
              with a lighter option (chicken or salmon), add classic sides like coleslaw and corn,
              and don&apos;t forget condiments, sauces, and napkins!
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
