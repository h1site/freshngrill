import { Metadata } from 'next';
import Link from 'next/link';
import { Book } from 'lucide-react';
import { getTermsByLetterEn } from '@/lib/lexiqueEn';

export const metadata: Metadata = {
  title: 'Culinary Glossary | Menu Cochon',
  description:
    'Discover our complete culinary glossary with cooking terms explained. From A to Z, master the gastronomic vocabulary.',
  alternates: {
    canonical: '/en/lexicon/',
    languages: {
      'fr-CA': '/lexique/',
      'en-CA': '/en/lexicon/',
    },
  },
};

export default async function LexiconPageEN() {
  const termsByLetter = await getTermsByLetterEn();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const availableLetters = termsByLetter.map((g) => g.letter);

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
            {alphabet.map((letter) => {
              const isAvailable = availableLetters.includes(letter);
              return isAvailable ? (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-9 h-9 flex items-center justify-center font-display text-lg text-black hover:bg-[#F77313] hover:text-white transition-colors"
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  className="w-9 h-9 flex items-center justify-center font-display text-lg text-neutral-300 cursor-not-allowed"
                >
                  {letter}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Terms by letter */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {termsByLetter.map((group) => (
            <div key={group.letter} id={`letter-${group.letter}`} className="mb-12">
              {/* Letter header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-200">
                <span className="w-12 h-12 bg-[#F77313] text-white font-display text-2xl flex items-center justify-center">
                  {group.letter}
                </span>
                <span className="text-neutral-500 text-sm">
                  {group.terms.length} term{group.terms.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Terms list */}
              <div className="space-y-4">
                {group.terms.map((term) => (
                  <Link
                    key={term.id}
                    href={`/en/lexicon/${term.slug}`}
                    className="group block p-4 md:p-5 border border-neutral-200 hover:border-[#F77313] transition-colors"
                  >
                    <h3 className="font-display text-xl text-black group-hover:text-[#F77313] transition-colors mb-2">
                      {term.term}
                    </h3>
                    <p className="text-neutral-600 line-clamp-2">
                      {term.definition}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
