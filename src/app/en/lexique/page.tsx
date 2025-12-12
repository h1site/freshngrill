import { Metadata } from 'next';
import Link from 'next/link';
import { Book } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Culinary Glossary | Menu Cochon',
  description:
    'Discover our complete culinary glossary with cooking terms explained. From A to Z, master the gastronomic vocabulary.',
  alternates: {
    canonical: '/en/lexique/',
    languages: {
      'fr-CA': '/lexique/',
      'en-CA': '/en/lexique/',
    },
  },
};

export default function LexiquePageEN() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Book className="w-6 h-6 text-[#F77313]" />
              <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
                Reference
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Culinary Glossary
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Discover our cooking dictionary to master culinary vocabulary.
              An essential tool for understanding gastronomic terms.
            </p>
          </div>
        </div>
      </section>

      {/* Alphabetical navigation */}
      <section className="sticky top-16 md:top-20 z-40 bg-neutral-50 border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-1 md:gap-2">
            {alphabet.map((letter) => (
              <span
                key={letter}
                className="w-9 h-9 flex items-center justify-center font-display text-lg text-neutral-300 cursor-not-allowed"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content - Coming Soon */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Book className="w-10 h-10 text-neutral-400" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-black mb-4">
            Coming Soon
          </h2>
          <p className="text-neutral-600 text-lg mb-8 max-w-md mx-auto">
            Our English culinary glossary is currently being prepared.
            In the meantime, you can explore our French glossary.
          </p>
          <Link
            href="/lexique/"
            className="inline-flex items-center gap-2 bg-[#F77313] text-white px-6 py-3 font-medium hover:bg-[#d45f0a] transition-colors"
          >
            View French Glossary
          </Link>
        </div>
      </section>

      {/* Back to top */}
      <div className="fixed bottom-8 right-8">
        <a
          href="#"
          className="w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-[#F77313] transition-colors shadow-lg"
        >
          ↑
        </a>
      </div>
    </main>
  );
}
