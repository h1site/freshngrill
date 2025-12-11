'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Check, Link2, Mail } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
  image?: string;
  compact?: boolean;
}

export default function ShareButton({ title, description, image, compact = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      onClick: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`;
        window.open(url, '_blank', 'width=600,height=400');
      },
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'bg-black hover:bg-neutral-800',
      onClick: () => {
        const text = `${title}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getUrl())}`;
        window.open(url, '_blank', 'width=600,height=400');
      },
    },
    {
      name: 'Pinterest',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
        </svg>
      ),
      color: 'bg-[#E60023] hover:bg-[#D50C22]',
      onClick: () => {
        const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(getUrl())}&media=${encodeURIComponent(image || '')}&description=${encodeURIComponent(title)}`;
        window.open(url, '_blank', 'width=600,height=400');
      },
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: 'bg-[#25D366] hover:bg-[#20BD5A]',
      onClick: () => {
        const text = `${title} - ${getUrl()}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-neutral-600 hover:bg-neutral-700',
      onClick: () => {
        const subject = encodeURIComponent(title);
        const body = encodeURIComponent(`Je voulais partager cette recette avec toi:\n\n${title}\n${getUrl()}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      },
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur copie:', err);
    }
  };

  const handleShare = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-full transition-colors ${
          compact ? 'p-2 md:px-4 md:py-2' : 'px-5 py-2.5'
        }`}
        title="Partager"
      >
        <Share2 className={compact ? 'w-4 h-4 md:w-5 md:h-5' : 'w-5 h-5'} />
        <span className={compact ? 'hidden md:inline text-sm' : ''}>Partager</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[99]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden z-[100] w-[300px]"
            >
              {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <span className="font-medium text-neutral-900">Partager</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* Options de partage */}
            <div className="p-3">
              <div className="grid grid-cols-5 gap-2 mb-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => {
                      option.onClick();
                      setIsOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${option.color} text-white`}
                    title={option.name}
                  >
                    {option.icon}
                    <span className="text-[10px] font-medium truncate w-full text-center">
                      {option.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Copier le lien */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Link2 className="w-5 h-5 text-neutral-600" />
                )}
                <span className="text-sm font-medium text-neutral-700">
                  {copied ? 'Lien copié!' : 'Copier le lien'}
                </span>
              </button>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
