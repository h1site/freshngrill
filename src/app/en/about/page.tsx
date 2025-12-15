import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Heart, Users, BookOpen, MapPin, Calendar, Facebook } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Sébastien Ross | Menucochon',
  description:
    'Meet Sébastien Ross, founder of Menucochon. Passionate about cooking since age 8, he shares his tested and approved recipes from Vaudreuil-Dorion, Quebec.',
  alternates: {
    canonical: '/en/about/',
    languages: {
      'fr-CA': '/a-propos/',
      'en-CA': '/en/about/',
    },
  },
  authors: [{ name: 'Sébastien Ross' }],
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-[#F77313] text-sm font-medium uppercase tracking-widest">
              The creator behind the recipes
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6 mt-4">
              Sébastien Ross
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Passionate about cooking for over 30 years, I share my tested and
              approved recipes for the joy of discovery and sharing.
            </p>
            <div className="flex items-center gap-4 mt-6 text-neutral-500 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Vaudreuil-Dorion, Quebec</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Since 2022</span>
              </div>
            </div>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* About me */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative">
              <Image
                src="/images/auteurs/seb.jpg"
                alt="Sébastien Ross - Founder of Menucochon"
                width={500}
                height={500}
                className="object-cover rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#F77313] text-white p-4 rounded-lg shadow-lg">
                <p className="font-display text-2xl">+30 years</p>
                <p className="text-sm text-white/80">of culinary passion</p>
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-black mb-6">
                My Story
              </h2>
              <div className="prose prose-lg text-neutral-600 space-y-4">
                <p>
                  I&apos;ve been cooking since I was 8 years old. My mother always thought I
                  would become a chef! Even though I chose a different professional path,
                  my passion for cooking has never diminished.
                </p>
                <p>
                  I have a lot of respect for professional chefs. For me,
                  the pleasure is in trying things, discovering new flavors.
                  My mother taught me the basics, but I also learned a lot by
                  watching videos and especially by tasting. When I taste something
                  that inspires me, I try to recreate it my own way.
                </p>
                <p>
                  I also inherited the Bilodeau family recipe book
                  that I&apos;m trying to replicate and preserve. This family culinary heritage
                  is a constant source of inspiration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My signature */}
      <section className="bg-neutral-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              Why &quot;Menucochon&quot;?
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              The name &quot;Menucochon&quot; reflects my cooking philosophy: I love hearty,
              generous meals! No small portions here. Whether it&apos;s a well-stuffed tourtière,
              a family roast, or ribs overflowing with sauce, I cook to satisfy big appetites.
              In French, &quot;manger comme un cochon&quot; means to eat heartily!
            </p>
            <div className="text-6xl">🍽️</div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-black mb-4">
              My Values
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              What guides me every day in creating my recipes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Simplicity</h3>
              <p className="text-neutral-600 text-sm">
                Accessible recipes with ingredients you already have.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Passion</h3>
              <p className="text-neutral-600 text-sm">
                Each recipe is created with love and tested with care.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Sharing</h3>
              <p className="text-neutral-600 text-sm">
                Food is better when we share it together.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#F77313] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-black mb-2">Authenticity</h3>
              <p className="text-neutral-600 text-sm">
                Honest recipes, without artifice, that have proven themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* My other projects */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-black mb-8 text-center">
              My Other Projects
            </h2>
            <p className="text-neutral-600 text-center mb-10">
              In addition to Menucochon, I also own several other web projects
              and work as a Technology Manager at Rennaï, a beauty boutique.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="https://kracradio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 p-4 rounded-lg hover:bg-neutral-200 transition-colors text-center"
              >
                <p className="font-bold text-black">KracRadio</p>
                <p className="text-sm text-neutral-500">Online Radio</p>
              </a>
              <a
                href="https://appgratuit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 p-4 rounded-lg hover:bg-neutral-200 transition-colors text-center"
              >
                <p className="font-bold text-black">AppGratuit</p>
                <p className="text-sm text-neutral-500">Free Apps</p>
              </a>
              <a
                href="https://kemp3.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 p-4 rounded-lg hover:bg-neutral-200 transition-colors text-center"
              >
                <p className="font-bold text-black">Kemp3</p>
                <p className="text-sm text-neutral-500">Music</p>
              </a>
              <a
                href="https://h1site.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 p-4 rounded-lg hover:bg-neutral-200 transition-colors text-center"
              >
                <p className="font-bold text-black">H1Site</p>
                <p className="text-sm text-neutral-500">Web Creation</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="bg-black text-white p-8 md:p-12 max-w-3xl mx-auto">
            <div className="text-center">
              <h2 className="font-display text-3xl mb-4">
                Want to cook with me?
              </h2>
              <p className="text-neutral-400 mb-8">
                Explore my recipes and find your next culinary inspiration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/en/recipe"
                  className="inline-flex items-center justify-center gap-2 bg-[#F77313] text-white px-6 py-3 font-medium hover:bg-[#e56610] transition-colors"
                >
                  View recipes
                </Link>
                <a
                  href="https://www.facebook.com/sebastien.ross"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white text-white px-6 py-3 font-medium hover:bg-white hover:text-black transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  Follow me on Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
