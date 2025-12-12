import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inches to Feet Conversion - Easy in 1 Click | Menu Cochon',
  description:
    'Easily convert inches to feet. 1 foot = 12 inches. Free online calculator for heights, furniture, and distances.',
  alternates: {
    canonical: '/en/converter/inch-feet/',
    languages: {
      'fr-CA': '/convertisseur/pouce-pied/',
      'en-CA': '/en/converter/inch-feet/',
    },
  },
  openGraph: {
    title: 'Inches to Feet Conversion',
    description: 'Free tool to convert inches to feet',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
