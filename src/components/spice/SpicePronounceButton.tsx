'use client';

import { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  text: string;
  lang?: 'fr' | 'en';
  className?: string;
}

export default function SpicePronounceButton({ text, lang = 'fr', className = '' }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Preload voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Get the best available voice for a language
  const getBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const preferredVoices = lang === 'fr' ? {
      preferred: ['Amélie', 'Thomas', 'Audrey', 'Google français'],
      langCodes: ['fr-CA', 'fr-FR', 'fr'],
    } : {
      preferred: ['Samantha', 'Karen', 'Daniel', 'Google US English'],
      langCodes: ['en-US', 'en-CA', 'en-GB', 'en'],
    };

    const langVoices = voices.filter(v =>
      preferredVoices.langCodes.some(code =>
        v.lang.startsWith(code) || v.lang.toLowerCase().includes(lang)
      )
    );

    if (langVoices.length === 0) return null;

    // Try to find a preferred voice by name
    for (const prefName of preferredVoices.preferred) {
      const match = langVoices.find(v =>
        v.name.toLowerCase().includes(prefName.toLowerCase())
      );
      if (match) return match;
    }

    // Prefer local voices over remote
    const localVoice = langVoices.find(v => v.localService);
    if (localVoice) return localVoice;

    return langVoices[0];
  }, [lang]);

  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Stop any current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'fr' ? 'fr-CA' : 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;

    const bestVoice = getBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [text, lang, getBestVoice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Don't render if speech synthesis is not supported
  if (typeof window !== 'undefined' && !window.speechSynthesis) {
    return null;
  }

  return (
    <button
      onClick={speak}
      className={`p-1.5 rounded-full transition-all ${
        isSpeaking
          ? 'bg-[#F77313] text-white'
          : 'text-neutral-400 hover:text-[#F77313] hover:bg-neutral-100'
      } ${className}`}
      title={lang === 'fr' ? 'Écouter la prononciation' : 'Listen to pronunciation'}
      aria-label={lang === 'fr' ? 'Écouter la prononciation' : 'Listen to pronunciation'}
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
}
