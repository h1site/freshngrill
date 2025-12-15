import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Timer | Menucochon',
  description:
    'Free online timer for cooking. Time your cooking with precision. Simple interface, automatic sound alert, preset times.',
  alternates: {
    canonical: '/en/converter/timer/',
    languages: {
      'fr-CA': '/convertisseur/minuterie/',
      'en-CA': '/en/converter/timer/',
    },
  },
  openGraph: {
    title: 'Online Timer',
    description: 'Free timer to time your cooking',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
