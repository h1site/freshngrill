'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const recipeLinks = [
    { name: 'All Recipes', href: '/recipe' },
    { name: 'Popular Recipes', href: '/recipe?sort=popular' },
    { name: 'Quick Recipes', href: '/recipe?time=30' },
    { name: 'Easy Recipes', href: '/recipe?difficulty=easy' },
  ];

  const categoryLinks = [
    { name: 'Beef', href: '/recipe?category=beef' },
    { name: 'Chicken', href: '/recipe?category=chicken' },
    { name: 'Pork', href: '/recipe?category=pork' },
    { name: 'Seafood', href: '/recipe?category=seafood' },
    { name: 'Sides', href: '/recipe?category=sides' },
    { name: 'Sauces & Rubs', href: '/recipe?category=sauces-rubs' },
  ];

  const exploreLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  return (
    <footer className="bg-black text-white pb-16 md:pb-0">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/recipe" className="inline-block mb-4">
              <Image
                src="/images/logos/logo.svg"
                alt="Fresh N' Grill"
                width={200}
                height={60}
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-xs">
              Discover our collection of BBQ recipes, grilling tips, and outdoor cooking ideas. Fire up the grill!
            </p>

            {/* Social Links */}
            <p className="text-sm text-neutral-500 mb-3">Follow Us</p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/freshngrill"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-800 hover:bg-[#1877F2] rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/freshngrill"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-800 hover:bg-[#E4405F] rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@freshngrill"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-800 hover:bg-[#FF0000] rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.pinterest.com/freshngrill/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-800 hover:bg-[#E60023] rounded-full flex items-center justify-center transition-colors"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Recipes */}
          <div>
            <h3 className="font-display text-base tracking-wide mb-4 text-[#00bf63]">
              Recipes
            </h3>
            <ul className="space-y-2">
              {recipeLinks.map((link) => (
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

          {/* Categories */}
          <div>
            <h3 className="font-display text-base tracking-wide mb-4 text-[#00bf63]">
              Categories
            </h3>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
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

          {/* Explore */}
          <div>
            <h3 className="font-display text-base tracking-wide mb-4 text-[#00bf63]">
              Explore
            </h3>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
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
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            &copy; {currentYear} Fresh N&apos; Grill. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-neutral-500 text-sm">
            <a
              href="https://menucochon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              menucochon.com
            </a>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <span className="text-[#00bf63]">&#9829;</span>
              <span>for BBQ lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
