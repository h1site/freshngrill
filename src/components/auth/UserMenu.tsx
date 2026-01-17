'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { User, LogOut, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

const ADMIN_EMAIL = 'info@h1site.com';

export default function UserMenu() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
          avatar_url: session.user.user_metadata?.avatar_url || null,
          user_metadata: session.user.user_metadata,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      // Check if click is outside both the button and the menu
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser({
        id: user.id,
        email: user.email || '',
        display_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        user_metadata: user.user_metadata,
      });
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-full bg-neutral-700 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:text-[#F77313] transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="hidden sm:inline">Connexion</span>
      </Link>
    );
  }

  const displayName = user.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.avatar_url || user.user_metadata?.avatar_url;
  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
              top: rect.bottom + 8,
              right: window.innerWidth - rect.right,
            });
          }
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 focus:outline-none"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-[#F77313] transition-colors"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#F77313] flex items-center justify-center text-white font-bold text-sm hover:bg-[#e56610] transition-colors">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && typeof document !== 'undefined' && createPortal(
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ top: menuPosition.top, right: menuPosition.right }}
            className="fixed w-56 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-[9999]"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-neutral-100">
              <p className="font-medium text-neutral-900 truncate">{displayName}</p>
              <p className="text-sm text-neutral-500 truncate">{user.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-2">
              <Link
                href="/profil"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Mon profil
              </Link>
              <Link
                href="/profil/favoris"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Mes favoris
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-[#F77313] hover:bg-orange-50 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Administration
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-neutral-100 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}
