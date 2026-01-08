import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getTermBySlug,
  getAllTermSlugs,
  getAdjacentTerms,
  getTermsForLetter,
} from '@/lib/lexique';
import { Book, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllTermSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = await getTermBySlug(slug);

  if (!term) {
    return {
      title: 'Terme non trouvé',
    };
  }

  return {
    title: `${term.term} - Définition | Lexique Culinaire`,
    description: term.definition.substring(0, 160),
    alternates: {
      canonical: `/lexique/${slug}/`,
    },
    openGraph: {
      title: `${term.term} - Lexique Culinaire`,
      description: term.definition.substring(0, 160),
      type: 'article',
      url: `/lexique/${slug}/`,
      siteName: 'Menucochon',
      locale: 'fr_CA',
    },
    twitter: {
      card: 'summary',
      title: `${term.term} - Lexique Culinaire`,
      description: term.definition.substring(0, 160),
    },
  };
}

export default async function LexiqueTermPage({ params }: Props) {
  const { slug } = await params;
  const term = await getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const { prev, next } = await getAdjacentTerms(slug);
  const relatedTerms = await getTermsForLetter(term.letter);
  const otherTerms = relatedTerms.filter((t) => t.slug !== slug).slice(0, 6);

  // Schema.org pour le SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.definition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Lexique Culinaire Menucochon',
      url: 'https://menucochon.com/lexique/',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <nav className="bg-neutral-50 border-b border-neutral-200" aria-label="Fil d'Ariane">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-neutral-500 hover:text-black">
                Accueil
              </Link>
              <span className="text-neutral-400">/</span>
              <Link href="/lexique" className="text-neutral-500 hover:text-black">
                Lexique
              </Link>
              <span className="text-neutral-400">/</span>
              <span className="text-black font-medium">{term.term}</span>
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <article className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Retour au lexique */}
            <Link
              href="/lexique"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#F77313] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au lexique
            </Link>

            {/* Header */}
            <header className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 bg-[#F77313] text-white font-display text-4xl flex items-center justify-center flex-shrink-0">
                {term.letter}
              </div>
              <div>
                <h1 className="font-display text-4xl md:text-5xl text-black mb-2">
                  {term.term}
                </h1>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Book className="w-4 h-4" />
                  <span>Terme culinaire</span>
                </div>
              </div>
            </header>

            {/* Définition */}
            <section className="bg-neutral-50 p-8 md:p-10 mb-12">
              <h2 className="font-display text-xl text-black mb-4">Définition</h2>
              <p className="text-neutral-700 text-lg leading-relaxed">
                {term.definition}
              </p>
            </section>

            {/* Navigation précédent/suivant */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {prev ? (
                <Link
                  href={`/lexique/${prev.slug}`}
                  className="group flex items-center gap-3 p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313]" />
                  <div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">
                      Précédent
                    </span>
                    <p className="font-display text-black group-hover:text-[#F77313] transition-colors">
                      {prev.term}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/lexique/${next.slug}`}
                  className="group flex items-center justify-end gap-3 p-4 border border-neutral-200 hover:border-[#F77313] transition-colors text-right"
                >
                  <div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">
                      Suivant
                    </span>
                    <p className="font-display text-black group-hover:text-[#F77313] transition-colors">
                      {next.term}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313]" />
                </Link>
              ) : (
                <div />
              )}
            </div>

          </div>
        </article>

        {/* Autres termes en {letter} */}
        {otherTerms.length > 0 && (
          <aside className="container mx-auto px-4 pb-12 md:pb-16">
            <div className="max-w-3xl mx-auto border-t border-neutral-200 pt-12">
              <h2 className="font-display text-2xl text-black mb-6">
                Autres termes en {term.letter}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {otherTerms.map((t) => (
                  <Link
                    key={t.id}
                    href={`/lexique/${t.slug}`}
                    className="p-3 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-all"
                  >
                    <span className="font-display text-black hover:text-[#F77313]">
                      {t.term}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href={`/lexique#lettre-${term.letter}`}
                className="inline-flex items-center gap-2 mt-6 text-[#F77313] hover:text-black transition-colors text-sm font-medium"
              >
                Voir tous les termes en {term.letter}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        )}
      </main>
    </>
  );
}
