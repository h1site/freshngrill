import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Rss } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    recettes: [
      { name: 'Toutes les recettes', href: '/recette' },
      { name: 'Recettes populaires', href: '/recette?tri=populaire' },
      { name: 'Recettes rapides', href: '/recette?temps=30' },
      { name: 'Recettes faciles', href: '/recette?difficulte=facile' },
    ],
    categories: [
      { name: 'Entrées', href: '/recette?categorie=entrees' },
      { name: 'Plats principaux', href: '/recette?categorie=plats-principaux' },
      { name: 'Desserts', href: '/recette?categorie=desserts' },
      { name: 'Végétarien', href: '/recette?categorie=vegetarien' },
    ],
    blog: [
      { name: 'Tous les articles', href: '/blog' },
      { name: 'Conseils cuisine', href: '/blog?categorie=conseils' },
      { name: 'Actualités', href: '/blog?categorie=actualites' },
    ],
    info: [
      { name: 'À propos', href: '/a-propos' },
      { name: 'Contact', href: '/contact' },
      { name: 'Confidentialité', href: '/confidentialite' },
    ],
  };

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logos/menucochon-blanc.svg"
                alt="Menu Cochon"
                width={250}
                height={56}
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Des recettes gourmandes et faciles à réaliser pour tous les jours.
              Découvrez notre collection de plats délicieux.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.facebook.com/menucochon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-[#F77313] rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/menucochon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-[#F77313] rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="/rss.xml"
                className="w-10 h-10 bg-neutral-800 hover:bg-[#F77313] rounded-full flex items-center justify-center transition-colors"
                aria-label="Flux RSS"
              >
                <Rss className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Recettes */}
          <div>
            <h3 className="font-display text-xl tracking-wide mb-6 text-[#F77313]">
              Recettes
            </h3>
            <ul className="space-y-3">
              {links.recettes.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="font-display text-xl tracking-wide mb-6 text-[#F77313]">
              Catégories
            </h3>
            <ul className="space-y-3">
              {links.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="font-display text-xl tracking-wide mb-6 text-[#F77313]">
              Blog
            </h3>
            <ul className="space-y-3">
              {links.blog.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="font-display text-xl tracking-wide mb-6 text-[#F77313]">
              Informations
            </h3>
            <ul className="space-y-3">
              {links.info.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            © {currentYear} Menu Cochon. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <span>Fait avec</span>
            <span className="text-[#F77313]">♥</span>
            <span>au Québec</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
