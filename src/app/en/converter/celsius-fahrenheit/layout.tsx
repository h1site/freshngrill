import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Celsius to Fahrenheit Conversion - Free Tool | Menu Cochon',
  description:
    'Easily convert temperatures between Celsius and Fahrenheit. Formulas, conversion tables, and free interactive tool.',
  alternates: {
    canonical: '/en/converter/celsius-fahrenheit/',
    languages: {
      'fr-CA': '/convertisseur/celsius-fahrenheit/',
      'en-CA': '/en/converter/celsius-fahrenheit/',
    },
  },
  openGraph: {
    title: 'Celsius to Fahrenheit Conversion',
    description: 'Free tool to convert Celsius/Fahrenheit temperatures',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
