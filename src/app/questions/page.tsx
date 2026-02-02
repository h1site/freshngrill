import { Metadata } from 'next';
import Link from 'next/link';
import { questions, getQuestionsByCategory, CulinaryQuestion } from '@/lib/questions';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import { Clock, BookOpen, ChefHat, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Questions Culinaires | Réponses d\'Experts MenuCochon',
  description: 'Trouvez les réponses à vos questions de cuisine: temps de cuisson, conservation, techniques culinaires. Conseils d\'experts québécois.',
  alternates: {
    canonical: '/questions/',
  },
  openGraph: {
    title: 'Questions Culinaires | MenuCochon',
    description: 'Réponses d\'experts à vos questions de cuisine québécoise.',
    type: 'website',
    url: '/questions/',
    siteName: 'MenuCochon',
    locale: 'fr_CA',
  },
};

const categories = [
  { key: 'cuisson' as const, label: 'Temps de cuisson', icon: Clock, description: 'Combien de temps cuire vos aliments?' },
  { key: 'conservation' as const, label: 'Conservation', icon: BookOpen, description: 'Comment conserver vos aliments?' },
  { key: 'technique' as const, label: 'Techniques', icon: ChefHat, description: 'Maîtrisez les techniques culinaires' },
  { key: 'substitution' as const, label: 'Substitutions', icon: HelpCircle, description: 'Remplacer un ingrédient?' },
  { key: 'nutrition' as const, label: 'Nutrition', icon: BookOpen, description: 'Questions nutritionnelles' },
];

export default function QuestionsPage() {
  const breadcrumbs = [
    { name: 'Accueil', url: '/' },
    { name: 'Questions', url: '/questions/' },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <main className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-black text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <span className="text-[#F77313] text-sm font-bold uppercase tracking-wider">
              Aide culinaire
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mt-4">
              Questions Culinaires
            </h1>
            <p className="text-neutral-400 text-lg mt-4 max-w-2xl mx-auto">
              Réponses d&apos;experts MenuCochon à vos questions de cuisine québécoise
            </p>
          </div>
        </header>

        {/* Categories */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryQuestions = getQuestionsByCategory(category.key);
              const Icon = category.icon;

              if (categoryQuestions.length === 0) return null;

              return (
                <div
                  key={category.key}
                  className="bg-neutral-50 border border-neutral-200 rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#F77313]/10 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#F77313]" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl">{category.label}</h2>
                      <p className="text-sm text-neutral-500">{category.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {categoryQuestions.map((q) => (
                      <li key={q.slug}>
                        <Link
                          href={`/questions/${q.slug}/`}
                          className="block text-neutral-600 hover:text-[#F77313] transition-colors py-1"
                        >
                          → {q.question}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* All Questions */}
        <section className="bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl mb-8 text-center">
              Toutes les questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-4">
              {questions.map((q) => (
                <Link
                  key={q.slug}
                  href={`/questions/${q.slug}/`}
                  className="block bg-white border border-neutral-200 rounded-lg p-6 hover:border-[#F77313] transition-colors group"
                >
                  <h3 className="font-display text-xl group-hover:text-[#F77313] transition-colors">
                    {q.question}
                  </h3>
                  <p className="text-neutral-500 mt-2 line-clamp-2">
                    {q.shortAnswer}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h2 className="font-display text-2xl mb-4">
            Vous avez une autre question?
          </h2>
          <p className="text-neutral-500 mb-6">
            Notre équipe ajoute régulièrement de nouvelles réponses.
          </p>
          <Link
            href="/recette"
            className="inline-flex items-center gap-2 bg-[#F77313] text-white px-6 py-3 font-medium hover:bg-[#e56610] transition-colors rounded"
          >
            Découvrir nos recettes
          </Link>
        </section>
      </main>
    </>
  );
}
