import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Celsius to Fahrenheit Conversion - Free Tool | Menucochon',
  description:
    'Easily convert temperatures between Celsius and Fahrenheit. Formulas, conversion tables, and free interactive tool.',
  keywords: [
    'celsius fahrenheit',
    'convert temperature',
    'celsius conversion',
    'fahrenheit celsius',
    'oven temperature',
    'temperature calculator',
  ],
  alternates: {
    canonical: '/en/converter/celsius-fahrenheit/',
    languages: {
      'fr-CA': '/convertisseur/celsius-fahrenheit/',
      'en-CA': '/en/converter/celsius-fahrenheit/',
      'x-default': '/convertisseur/celsius-fahrenheit/',
    },
  },
  openGraph: {
    title: 'Celsius to Fahrenheit Conversion - Free Tool | Menucochon',
    description:
      'Easily convert temperatures between Celsius and Fahrenheit.',
    siteName: 'Menucochon',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Celsius to Fahrenheit Conversion | Menucochon',
    description: 'Free tool to convert temperatures.',
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
