import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Menucochon',
  description: 'Contact us for any questions, suggestions or partnerships. We are here to help.',
  alternates: {
    canonical: '/en/contact/',
    languages: {
      'fr-CA': '/contact/',
      'en-CA': '/en/contact/',
    },
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
