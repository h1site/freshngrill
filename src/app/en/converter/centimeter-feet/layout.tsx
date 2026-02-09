import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Centimeters to Feet Conversion - Free Tool | Menucochon',
  description:
    'Easily convert centimeters to feet. 1 foot = 30.48 cm. Human height table and free interactive tool.',
  keywords: [
    'cm to feet',
    'centimeter feet',
    '180 cm to feet',
    '170 cm to feet',
    'height conversion',
    'height chart',
  ],
  alternates: {
    canonical: '/en/converter/centimeter-feet/',
    languages: {
      'fr-CA': '/convertisseur/centimetre-pied/',
      'en-CA': '/en/converter/centimeter-feet/',
      'x-default': '/convertisseur/centimetre-pied/',
    },
  },
  openGraph: {
    title: 'Centimeters to Feet Conversion | Menucochon',
    description:
      'Easily convert cm to feet. Human height table included.',
    siteName: 'Menucochon',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CM to Feet Conversion | Menucochon',
    description: 'Free tool to convert centimeters to feet.',
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
