import { Metadata } from 'next';
import Link from 'next/link';
import { getTermsByLetter, getAvailableLetters, countTerms } from '@/lib/lexique';
import { Book, Search, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lexique Culinaire | Menucochon',
  description:
    'Découvrez notre lexique culinaire complet avec plus de 280 termes de cuisine expliqués. De A à Z, maîtrisez le vocabulaire gastronomique.',
  alternates: {
    canonical: '/lexique/',
  },
};

export default async function LexiquePage() {
  const termsByLetter = await getTermsByLetter();
  const availableLetters = await getAvailableLetters();
  const totalTerms = await countTerms();

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
                Référence
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Lexique Culinaire
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Découvrez notre dictionnaire de cuisine avec{' '}
              <span className="text-white font-semibold">{totalTerms} termes</span>{' '}
              expliqués clairement. Un outil indispensable pour maîtriser le
              vocabulaire gastronomique.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation alphabétique */}
      <section className="sticky top-16 md:top-20 z-40 bg-neutral-50 border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-1 md:gap-2">
            {alphabet.map((letter) => {
              const isAvailable = availableLetters.includes(letter);
              return (
                <a
                  key={letter}
                  href={isAvailable ? `#lettre-${letter}` : undefined}
                  className={`w-9 h-9 flex items-center justify-center font-display text-lg transition-all ${
                    isAvailable
                      ? 'text-black hover:bg-[#F77313] hover:text-white'
                      : 'text-neutral-300 cursor-not-allowed'
                  }`}
                >
                  {letter}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {termsByLetter.map(({ letter, terms }) => (
            <div key={letter} id={`lettre-${letter}`} className="mb-12 scroll-mt-32">
              {/* Lettre */}
              <div className="flex items-center gap-4 mb-6">
                <span className="w-16 h-16 bg-[#F77313] text-white font-display text-3xl flex items-center justify-center">
                  {letter}
                </span>
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-sm text-neutral-500">
                  {terms.length} terme{terms.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Termes */}
              <div className="space-y-3">
                {terms.map((term) => (
                  <Link
                    key={term.id}
                    href={`/lexique/${term.slug}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-4 p-4 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-all">
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-black group-hover:text-[#F77313] transition-colors">
                          {term.term}
                        </h3>
                        <p className="text-neutral-600 text-sm mt-1 line-clamp-2">
                          {term.definition}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313] transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Retour en haut */}
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
