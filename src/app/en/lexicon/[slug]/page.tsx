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
  const term = await getTermBySlug(slug, 'en');

  if (!term) {
    return {
      title: 'Term not found',
    };
  }

  return {
    title: `${term.term} - Definition | Culinary Glossary | Menu Cochon`,
    description: term.definition.substring(0, 160),
    alternates: {
      canonical: `/en/lexicon/${slug}/`,
      languages: {
        'fr-CA': `/lexique/${slug}/`,
        'en-CA': `/en/lexicon/${slug}/`,
      },
    },
    openGraph: {
      title: `${term.term} - Culinary Glossary`,
      description: term.definition.substring(0, 160),
      type: 'article',
      url: `/en/lexicon/${slug}/`,
    },
  };
}

export default async function LexiqueTermPageEN({ params }: Props) {
  const { slug } = await params;
  const term = await getTermBySlug(slug, 'en');

  if (!term) {
    notFound();
  }

  const { prev, next } = await getAdjacentTerms(slug);
  const relatedTerms = await getTermsForLetter(term.letter, 'en');
  const otherTerms = relatedTerms.filter((t) => t.slug !== slug).slice(0, 6);

  // Schema.org for SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.definition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Menu Cochon Culinary Glossary',
      url: 'https://menucochon.com/en/lexique/',
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
        <div className="bg-neutral-50 border-b border-neutral-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/en" className="text-neutral-500 hover:text-black">
                Home
              </Link>
              <span className="text-neutral-400">/</span>
              <Link href="/en/lexicon" className="text-neutral-500 hover:text-black">
                Glossary
              </Link>
              <span className="text-neutral-400">/</span>
              <span className="text-black font-medium">{term.term}</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Back to glossary */}
            <Link
              href="/en/lexicon"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#F77313] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to glossary
            </Link>

            {/* Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 bg-[#F77313] text-white font-display text-4xl flex items-center justify-center flex-shrink-0">
                {term.letter}
              </div>
              <div>
                <h1 className="font-display text-4xl md:text-5xl text-black mb-2">
                  {term.term}
                </h1>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Book className="w-4 h-4" />
                  <span>Culinary term</span>
                </div>
              </div>
            </div>

            {/* Definition */}
            <div className="bg-neutral-50 p-8 md:p-10 mb-12">
              <h2 className="font-display text-xl text-black mb-4">Definition</h2>
              <p className="text-neutral-700 text-lg leading-relaxed">
                {term.definition}
              </p>
            </div>

            {/* Previous/Next navigation */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {prev ? (
                <Link
                  href={`/en/lexicon/${prev.slug}`}
                  className="group flex items-center gap-3 p-4 border border-neutral-200 hover:border-[#F77313] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#F77313]" />
                  <div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">
                      Previous
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
                  href={`/en/lexicon/${next.slug}`}
                  className="group flex items-center justify-end gap-3 p-4 border border-neutral-200 hover:border-[#F77313] transition-colors text-right"
                >
                  <div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">
                      Next
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

            {/* Other terms starting with {letter} */}
            {otherTerms.length > 0 && (
              <div className="border-t border-neutral-200 pt-12">
                <h2 className="font-display text-2xl text-black mb-6">
                  Other terms starting with {term.letter}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {otherTerms.map((t) => (
                    <Link
                      key={t.id}
                      href={`/en/lexicon/${t.slug}`}
                      className="p-3 border border-neutral-200 hover:border-[#F77313] hover:bg-neutral-50 transition-all"
                    >
                      <span className="font-display text-black hover:text-[#F77313]">
                        {t.term}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/en/lexicon#letter-${term.letter}`}
                  className="inline-flex items-center gap-2 mt-6 text-[#F77313] hover:text-black transition-colors text-sm font-medium"
                >
                  See all terms starting with {term.letter}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
