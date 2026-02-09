import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Which Spice with Which Meat? | Pairing Guide',
  description:
    'Interactive guide: find the best spices for beef, chicken, pork, lamb, fish and vegetables. Perfect spice-food pairings.',
  alternates: {
    canonical: '/en/spices/spice-pairing/',
    languages: {
      'fr-CA': '/epices/route-des-epices/',
      'en-CA': '/en/spices/spice-pairing/',
      'x-default': '/epices/route-des-epices/',
    },
  },
  openGraph: {
    title: 'Which Spice with Which Meat? | Interactive Guide',
    description:
      'Select a meat or food and discover the best spices to use. Practical cooking guide.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Spice-Meat Pairing Guide',
    description: 'Find the perfect spices for each meat and food.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
