import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inches to Feet Conversion - Easy in 1 Click | Menucochon',
  description:
    'Easily convert inches to feet. 1 foot = 12 inches. Free online calculator for heights, furniture, and distances.',
  keywords: [
    'inches to feet',
    'inch feet conversion',
    'convert inches',
    'feet inches calculator',
    'height converter',
  ],
  alternates: {
    canonical: '/en/converter/inch-feet/',
    languages: {
      'fr-CA': '/convertisseur/pouce-pied/',
      'en-CA': '/en/converter/inch-feet/',
    },
  },
  openGraph: {
    title: 'Inches to Feet Conversion | Menucochon',
    description:
      'Easily convert inches to feet. 1 foot = 12 inches.',
    siteName: 'Menucochon',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Inches to Feet Conversion | Menucochon',
    description: 'Free tool to convert inches to feet.',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
