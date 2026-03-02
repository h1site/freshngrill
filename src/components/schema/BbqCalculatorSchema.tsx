import { siteConfig } from '@/lib/config';

export default function BbqCalculatorSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BBQ Cooking Calculator',
    description: 'Calculate exact grilling times for steak, ribs, chicken, burgers and more. Interactive timer with flip alerts and doneness guide.',
    url: `${siteConfig.url}/tools/bbq-calculator/`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: "Fresh N' Grill",
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
