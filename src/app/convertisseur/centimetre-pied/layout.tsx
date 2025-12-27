import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CM en Pied ⚡ Convertisseur GRATUIT | 180 cm = 5\'11"',
  description:
    '✓ Convertir cm en pied instantanément! 180 cm = 5\'11", 170 cm = 5\'7", 160 cm = 5\'3". Tableau cm en pieds et pouces + calculateur gratuit.',
  keywords: [
    'cm en pied',
    'centimètre pied',
    '180 cm en pied',
    '170 cm en pied',
    'conversion taille',
    'tableau tailles',
  ],
  alternates: {
    canonical: '/convertisseur/centimetre-pied/',
  },
  openGraph: {
    title: 'CM en Pied - Convertisseur GRATUIT | Menucochon',
    description:
      'Conversion cm ↔ pieds instantanée. 180 cm = 5\'11". Tableau tailles humaines.',
    siteName: 'Menucochon',
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Convertir CM en Pieds | Menucochon',
    description: 'Conversion cm ↔ pieds avec tableau des tailles humaines.',
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
