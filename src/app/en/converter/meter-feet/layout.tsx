import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meters to Feet Conversion - Free Tool | Menu Cochon',
  description:
    'Easily convert meters to feet and vice versa. 1 meter = 3.28084 feet. Formulas, tables, and free interactive tool.',
  alternates: {
    canonical: '/en/converter/meter-feet/',
    languages: {
      'fr-CA': '/convertisseur/metre-pied/',
      'en-CA': '/en/converter/meter-feet/',
    },
  },
  openGraph: {
    title: 'Meters to Feet Conversion',
    description: 'Free tool to convert meters to feet',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
