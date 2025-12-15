import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Centimeters to Feet Conversion - Free Tool | Menucochon',
  description:
    'Easily convert centimeters to feet. 1 foot = 30.48 cm. Human height table and free interactive tool.',
  alternates: {
    canonical: '/en/converter/centimeter-feet/',
    languages: {
      'fr-CA': '/convertisseur/centimetre-pied/',
      'en-CA': '/en/converter/centimeter-feet/',
    },
  },
  openGraph: {
    title: 'Centimeters to Feet Conversion',
    description: 'Free tool to convert centimeters to feet',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
