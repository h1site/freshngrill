import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meters to Feet Conversion - Free Tool | Menucochon',
  description:
    'Easily convert meters to feet and vice versa. 1 meter = 3.28084 feet. Formulas, tables, and free interactive tool.',
  keywords: [
    'meter feet',
    'convert meter',
    'meter feet conversion',
    'feet meter',
    'length calculator',
    'imperial system',
  ],
  alternates: {
    canonical: '/en/converter/meter-feet/',
    languages: {
      'fr-CA': '/convertisseur/metre-pied/',
      'en-CA': '/en/converter/meter-feet/',
    },
  },
  openGraph: {
    title: 'Meters to Feet Conversion - Free Tool | Menucochon',
    description:
      'Easily convert meters to feet. 1 meter = 3.28084 feet.',
    siteName: 'Menucochon',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Meters to Feet Conversion | Menucochon',
    description: 'Free tool to convert meters to feet.',
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
