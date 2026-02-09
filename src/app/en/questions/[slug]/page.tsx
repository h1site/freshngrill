import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getQuestionBySlug,
  getAllQuestionSlugs,
  getRelatedQuestions,
  getQuestionsByCategory,
  getLocalizedQuestion,
} from '@/lib/questions';
import { getRecipesBySlugs } from '@/lib/recipes';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import { ArrowLeft, MessageCircle, ChefHat, Clock, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllQuestionSlugs('en');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug, 'en');

  if (!question) {
    return { title: 'Question not found' };
  }

  const localized = getLocalizedQuestion(question, 'en');

  return {
    title: localized.seoTitle || localized.question,
    description: localized.seoDescription || localized.shortAnswer,
    alternates: {
      canonical: `/en/questions/${slug}/`,
      languages: {
        'fr-CA': `/questions/${question.slug}/`,
        'en-CA': `/en/questions/${slug}/`,
        'x-default': `/questions/${question.slug}/`,
      },
    },
    openGraph: {
      title: localized.question,
      description: localized.shortAnswer,
      type: 'article',
      url: `/en/questions/${slug}/`,
      siteName: 'MenuCochon',
      locale: 'en_CA',
    },
    twitter: {
      card: 'summary',
      title: localized.question,
      description: localized.shortAnswer,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
    },
  };
}

const categoryLabels = {
  cuisson: { label: 'Cooking Times', icon: Clock },
  conservation: { label: 'Storage', icon: BookOpen },
  substitution: { label: 'Substitutions', icon: ChefHat },
  technique: { label: 'Techniques', icon: ChefHat },
  nutrition: { label: 'Nutrition', icon: BookOpen },
};

export default async function QuestionPageEN({ params }: Props) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug, 'en');

  if (!question) {
    notFound();
  }

  const localized = getLocalizedQuestion(question, 'en');
  const relatedQuestions = getRelatedQuestions(slug, 'en', 3);
  const categoryQuestions = getQuestionsByCategory(question.category, 'en')
    .filter(q => q.slugEn !== slug)
    .slice(0, 3);

  // Get related recipes if any
  const relatedRecipes = question.relatedRecipes
    ? await getRecipesBySlugs(question.relatedRecipes)
    : [];

  const categoryInfo = categoryLabels[question.category];
  const CategoryIcon = categoryInfo.icon;

  const breadcrumbs = [
    { name: 'Home', url: '/en' },
    { name: 'Questions', url: '/en/questions' },
    { name: localized.question, url: `/en/questions/${slug}/` },
  ];

  // FAQPage schema for this question
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: localized.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: localized.shortAnswer,
          author: {
            '@type': 'Organization',
            name: 'MenuCochon',
            url: 'https://menucochon.com',
          },
        },
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-black text-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <Link
              href="/en/questions"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All questions
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 bg-[#F77313] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5">
                <CategoryIcon className="w-4 h-4" />
                {categoryInfo.label}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display leading-tight">
              {localized.question}
            </h1>
          </div>
        </header>

        {/* Short Answer - Featured Snippet Optimized */}
        <section className="bg-[#F77313]/5 border-b border-[#F77313]/20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F77313] rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#F77313] uppercase tracking-wider mb-2">
                    MenuCochon&apos;s Answer
                  </h2>
                  <p className="text-lg md:text-xl text-neutral-800 leading-relaxed">
                    {localized.shortAnswer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Answer */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article
                className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-black prose-h2:text-2xl prose-h3:text-xl prose-strong:text-black prose-li:marker:text-[#F77313]"
                dangerouslySetInnerHTML={{ __html: localized.fullAnswer }}
              />

              {/* Editorial Signature */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F77313] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-display text-xl">M</span>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">
                      Answer validated by
                    </p>
                    <p className="font-display text-lg text-black">
                      The MenuCochon Team
                    </p>
                    <p className="text-xs text-[#F77313]">
                      Authentic Quebec recipes since 2020
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Related Recipes */}
              {relatedRecipes.length > 0 && (
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-[#F77313]" />
                    Related Recipes
                  </h3>
                  <div className="space-y-3">
                    {relatedRecipes.map((recipe) => (
                      <Link
                        key={recipe.id}
                        href={`/en/recipe/${recipe.slug}/`}
                        className="flex items-center gap-3 group"
                      >
                        {recipe.featuredImage && (
                          <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={recipe.featuredImage}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-neutral-700 group-hover:text-[#F77313] transition-colors font-medium">
                          {recipe.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Questions */}
              {(relatedQuestions.length > 0 || categoryQuestions.length > 0) && (
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h3 className="font-display text-xl mb-4">
                    Similar Questions
                  </h3>
                  <ul className="space-y-3">
                    {[...relatedQuestions, ...categoryQuestions]
                      .slice(0, 5)
                      .map((q) => (
                        <li key={q.slugEn}>
                          <Link
                            href={`/en/questions/${q.slugEn}/`}
                            className="text-neutral-600 hover:text-[#F77313] transition-colors block"
                          >
                            → {q.questionEn}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {localized.tags && localized.tags.length > 0 && (
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h3 className="font-display text-xl mb-4">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {localized.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-white border border-neutral-200 text-neutral-600 text-sm px-3 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
