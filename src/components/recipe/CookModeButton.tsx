'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, Check, Clock, Users, Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Speech, Mic, MicOff } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

interface Props {
  recipe: Recipe;
  compact?: boolean;
  locale?: Locale;
}

export default function CookModeButton({ recipe, compact = false, locale = 'fr' }: Props) {
  const isEN = locale === 'en';
  const t = {
    cookMode: isEN ? 'Cook Mode' : 'Mode Cuisine',
    ingredients: isEN ? 'Ingredients' : 'Ingrédients',
    step: isEN ? 'Step' : 'Étape',
    prep: isEN ? 'Prep' : 'Prép',
    cook: isEN ? 'Cook' : 'Cuisson',
    servings: isEN ? 'servings' : 'portions',
    previous: isEN ? 'Previous' : 'Précédent',
    next: isEN ? 'Next' : 'Suivant',
    done: isEN ? 'Done!' : 'Terminé!',
    navHint: isEN ? 'Use ← → or Space to navigate' : 'Utilisez ← → ou Espace pour naviguer',
    timer: isEN ? 'Timer' : 'Minuterie',
    setTimer: isEN ? 'Set Timer' : 'Régler',
    start: isEN ? 'Start' : 'Démarrer',
    pause: isEN ? 'Pause' : 'Pause',
    reset: isEN ? 'Reset' : 'Réinitialiser',
    stopAlarm: isEN ? 'Stop Alarm' : 'Arrêter',
    timerDone: isEN ? 'Timer done!' : 'Minuterie terminée!',
    readAloud: isEN ? 'Read aloud' : 'Lire à voix haute',
    stopReading: isEN ? 'Stop reading' : 'Arrêter la lecture',
    voiceControl: isEN ? 'Voice control' : 'Contrôle vocal',
    listening: isEN ? 'Listening...' : 'Écoute...',
  };
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  // Timer states
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Speech synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  // Total des étapes: 0 = ingrédients, 1+ = instructions
  const totalPages = recipe.instructions.length + 1;

  // Preload voices (they may not be available immediately)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    // Try to load immediately
    loadVoices();

    // Also listen for voiceschanged event (Chrome loads voices async)
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Bloquer le scroll du body quand le mode est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  const nextStep = () => {
    if (currentStep < totalPages - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleIngredient = (id: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIngredients(newChecked);
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
    stopAlarm();
  };

  // Timer functions
  const playAlarm = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      // Create audio context if not exists
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;

      // Create oscillator for beeping sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      oscillator.start();
      setIsAlarmPlaying(true);

      // Create beeping pattern
      const beepPattern = () => {
        if (!gainNodeRef.current || !audioContextRef.current) return;
        const now = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.setValueAtTime(0.3, now);
        gainNodeRef.current.gain.setValueAtTime(0, now + 0.2);
        gainNodeRef.current.gain.setValueAtTime(0.3, now + 0.4);
        gainNodeRef.current.gain.setValueAtTime(0, now + 0.6);
        gainNodeRef.current.gain.setValueAtTime(0.3, now + 0.8);
        gainNodeRef.current.gain.setValueAtTime(0, now + 1);
      };

      beepPattern();
      const intervalId = setInterval(beepPattern, 1500);

      // Store interval ID to clear later
      (oscillator as OscillatorNode & { intervalId: NodeJS.Timeout }).intervalId = intervalId;
    } catch (e) {
      console.error('Error playing alarm:', e);
    }
  }, []);

  const stopAlarm = useCallback(() => {
    if (oscillatorRef.current) {
      const osc = oscillatorRef.current as OscillatorNode & { intervalId?: NodeJS.Timeout };
      if (osc.intervalId) {
        clearInterval(osc.intervalId);
      }
      try {
        oscillatorRef.current.stop();
      } catch {
        // Already stopped
      }
      oscillatorRef.current = null;
    }
    setIsAlarmPlaying(false);
  }, []);

  const startTimer = () => {
    const totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    if (totalSeconds > 0) {
      setTimeRemaining(totalSeconds);
      setIsTimerRunning(true);
      setShowTimerModal(false);
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    if (timeRemaining && timeRemaining > 0) {
      setIsTimerRunning(true);
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(null);
    stopAlarm();
  };

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerRunning || timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          setIsTimerRunning(false);
          playAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, playAlarm]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAlarm();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAlarm]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Expand unit abbreviations for speech
  const expandUnitsForSpeech = useCallback((text: string): string => {
    const unitMap: Record<string, { fr: string; en: string }> = {
      // Weight
      'g': { fr: 'grammes', en: 'grams' },
      'kg': { fr: 'kilogrammes', en: 'kilograms' },
      'mg': { fr: 'milligrammes', en: 'milligrams' },
      'oz': { fr: 'onces', en: 'ounces' },
      'lb': { fr: 'livres', en: 'pounds' },
      'lbs': { fr: 'livres', en: 'pounds' },
      // Volume
      'ml': { fr: 'millilitres', en: 'milliliters' },
      'cl': { fr: 'centilitres', en: 'centiliters' },
      'dl': { fr: 'décilitres', en: 'deciliters' },
      'l': { fr: 'litres', en: 'liters' },
      'L': { fr: 'litres', en: 'liters' },
      // Spoons/cups
      'c. à soupe': { fr: 'cuillères à soupe', en: 'tablespoons' },
      'c. à café': { fr: 'cuillères à café', en: 'teaspoons' },
      'c. à thé': { fr: 'cuillères à thé', en: 'teaspoons' },
      'càs': { fr: 'cuillères à soupe', en: 'tablespoons' },
      'càc': { fr: 'cuillères à café', en: 'teaspoons' },
      'tbsp': { fr: 'cuillères à soupe', en: 'tablespoons' },
      'tsp': { fr: 'cuillères à thé', en: 'teaspoons' },
      'tasse': { fr: 'tasse', en: 'cup' },
      'tasses': { fr: 'tasses', en: 'cups' },
      // Other
      'pincée': { fr: 'pincée', en: 'pinch' },
      'pincées': { fr: 'pincées', en: 'pinches' },
      'gousse': { fr: 'gousse', en: 'clove' },
      'gousses': { fr: 'gousses', en: 'cloves' },
      'tranche': { fr: 'tranche', en: 'slice' },
      'tranches': { fr: 'tranches', en: 'slices' },
    };

    let result = text;

    // Sort by length (longest first) to avoid partial replacements
    const sortedUnits = Object.keys(unitMap).sort((a, b) => b.length - a.length);

    for (const unit of sortedUnits) {
      // Match unit with word boundaries (after a number or space, before space or end)
      const regex = new RegExp(`(\\d+\\s*)${unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s|$|,|\\))`, 'gi');
      const replacement = unitMap[unit][isEN ? 'en' : 'fr'];
      result = result.replace(regex, `$1${replacement}`);
    }

    return result;
  }, [isEN]);

  // Speech synthesis functions
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Get the best available voice for a language
  const getBestVoice = useCallback((lang: 'fr' | 'en'): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Priority keywords for natural/premium voices (in order of preference)
    const premiumKeywords = ['premium', 'neural', 'enhanced', 'natural', 'wavenet'];

    // Preferred voice names by platform
    const preferredVoices = lang === 'fr' ? {
      // French voices - prefer Canadian French, then France French
      preferred: [
        'Amélie',           // macOS Canadian French (very natural)
        'Thomas',           // macOS France French
        'Audrey',           // macOS France French
        'Google français',  // Chrome
        'Microsoft Claude', // Windows
        'Microsoft Paul',   // Windows
      ],
      langCodes: ['fr-CA', 'fr-FR', 'fr'],
    } : {
      // English voices - prefer natural sounding ones
      preferred: [
        'Samantha',         // macOS (very natural)
        'Karen',            // macOS Australian
        'Daniel',           // macOS British
        'Google US English', // Chrome
        'Microsoft Zira',   // Windows
        'Microsoft David',  // Windows
      ],
      langCodes: ['en-US', 'en-CA', 'en-GB', 'en-AU', 'en'],
    };

    // Filter voices by language
    const langVoices = voices.filter(v =>
      preferredVoices.langCodes.some(code =>
        v.lang.startsWith(code) || v.lang.toLowerCase().includes(lang)
      )
    );

    if (langVoices.length === 0) return null;

    // 1. Try to find a preferred voice by name
    for (const prefName of preferredVoices.preferred) {
      const match = langVoices.find(v =>
        v.name.toLowerCase().includes(prefName.toLowerCase())
      );
      if (match) return match;
    }

    // 2. Try to find a premium/neural voice
    for (const keyword of premiumKeywords) {
      const match = langVoices.find(v =>
        v.name.toLowerCase().includes(keyword)
      );
      if (match) return match;
    }

    // 3. Prefer local voices over remote (usually better quality)
    const localVoice = langVoices.find(v => v.localService);
    if (localVoice) return localVoice;

    // 4. Return the first available voice for this language
    return langVoices[0];
  }, []);

  // Speak a specific step (pass step number, or use current if not provided)
  const speakStep = useCallback((stepToSpeak?: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const step = stepToSpeak ?? currentStep;

    // Stop any current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    let textToSpeak = '';

    if (step === 0) {
      // Read recipe title first, then ingredients
      const ingredientsList = recipe.ingredients.flatMap(group => {
        return group.items.map(item => {
          const parts = [];
          if (item.quantity) parts.push(item.quantity);
          if (item.unit) parts.push(item.unit);
          parts.push(item.name);
          if (item.note) parts.push(`(${item.note})`);
          return parts.join(' ');
        });
      });
      textToSpeak = `${recipe.title}... ${ingredientsList.join('... ')}`;
    } else {
      // Read specified instruction
      const instruction = recipe.instructions[step - 1];
      if (instruction) {
        textToSpeak = instruction.content;
        if (instruction.tip) {
          textToSpeak += isEN ? `. Tip: ${instruction.tip}` : `. Astuce: ${instruction.tip}`;
        }
      }
    }

    if (!textToSpeak) return;

    // Expand unit abbreviations for better speech
    textToSpeak = expandUnitsForSpeech(textToSpeak);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isEN ? 'en-US' : 'fr-CA';
    utterance.rate = 0.9;  // Slightly slower for clarity
    utterance.pitch = 1;

    // Select the best available voice
    const bestVoice = getBestVoice(isEN ? 'en' : 'fr');
    if (bestVoice) {
      utterance.voice = bestVoice;
      // Adjust lang to match voice for better pronunciation
      utterance.lang = bestVoice.lang;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [currentStep, recipe.ingredients, recipe.instructions, isEN, expandUnitsForSpeech, getBestVoice]);

  // Convenience function to speak current step
  const speakCurrentStep = useCallback(() => {
    speakStep();
  }, [speakStep]);

  // Stop speaking when closing (but not when changing steps - voice command handles that)
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
    }
  }, [isOpen, stopSpeaking]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Voice recognition - process commands with intent-based matching
  // Handles: cleaning filler words, spoken numbers, implicit commands
  const processVoiceCommand = useCallback((transcript: string) => {
    let text = transcript.toLowerCase().trim();

    // ===== STEP 1: Clean filler/politeness words =====
    const fillerWords = [
      // French politeness
      'peux-tu', 'peux tu', 'pouvez-vous', 'pouvez vous',
      'est-ce que tu peux', 'est ce que tu peux',
      's\'il te plaît', 's\'il vous plaît', 'sil te plait', 'sil vous plait',
      'je veux', 'je voudrais', 'j\'aimerais', 'j aimerais',
      'merci de', 'merci', 'svp', 's.v.p.',
      // English politeness
      'can you', 'could you', 'would you', 'will you',
      'please', 'kindly', 'i want to', 'i would like to',
      'i\'d like to', 'i want you to', 'thank you',
      // Common intros
      'ok ', 'okay ', 'hey ', 'dis ', 'euh ', 'um ', 'uh ',
    ];
    for (const filler of fillerWords) {
      text = text.replace(new RegExp(filler, 'gi'), ' ');
    }
    text = text.replace(/\s+/g, ' ').trim();

    // ===== STEP 2: Convert spoken numbers to digits =====
    const spokenNumbers: Record<string, number> = {
      // French
      'un': 1, 'une': 1, 'premier': 1, 'première': 1,
      'deux': 2, 'deuxième': 2, 'second': 2, 'seconde': 2,
      'trois': 3, 'troisième': 3,
      'quatre': 4, 'quatrième': 4,
      'cinq': 5, 'cinquième': 5,
      'six': 6, 'sixième': 6,
      'sept': 7, 'septième': 7,
      'huit': 8, 'huitième': 8,
      'neuf': 9, 'neuvième': 9,
      'dix': 10, 'dixième': 10,
      'onze': 11, 'onzième': 11,
      'douze': 12, 'douzième': 12,
      // English
      'one': 1, 'first': 1,
      'two': 2, 'second': 2,
      'three': 3, 'third': 3,
      'four': 4, 'fourth': 4,
      'five': 5, 'fifth': 5,
      'six': 6, 'sixth': 6,
      'seven': 7, 'seventh': 7,
      'eight': 8, 'eighth': 8,
      'nine': 9, 'ninth': 9,
      'ten': 10, 'tenth': 10,
      'eleven': 11, 'eleventh': 11,
      'twelve': 12, 'twelfth': 12,
    };

    // Helper: check if any word in the list is found
    const matchesAny = (words: string[]) => words.some(w => text.includes(w));

    // Helper: extract step number from text (handles spoken and digit numbers)
    const extractStepNumber = (): number | null => {
      // First check for digit
      const digitMatch = text.match(/(\d+)/);
      if (digitMatch) {
        return parseInt(digitMatch[1]);
      }
      // Then check for spoken numbers
      for (const [word, num] of Object.entries(spokenNumbers)) {
        if (text.includes(word)) {
          return num;
        }
      }
      return null;
    };

    // ===== INTENT: INGREDIENTS =====
    const ingredientWords = [
      // French
      'ingrédient', 'ingredient', 'ingrédients', 'ingredients',
      'ingredien', 'ingrédi', 'ingrédian', 'ingrediant',
      'les ingrédients', 'aux ingrédients', 'voir ingrédients',
      'montre ingrédients', 'affiche ingrédients', 'liste ingrédients',
      'quels ingrédients', 'qu\'est-ce qu\'il faut', 'il faut quoi',
      'de quoi j\'ai besoin', 'besoin de quoi',
      // English
      'show ingredients', 'go to ingredients', 'ingredients please',
      'ingredient list', 'show me ingredients', 'the ingredients',
      'ingredients list', 'what ingredients', 'see ingredients',
      'what do i need', 'what\'s needed', 'shopping list',
    ];
    if (matchesAny(ingredientWords)) {
      setCurrentStep(0);
      speakStep(0);
      return;
    }

    // ===== INTENT: GO TO SPECIFIC STEP (check before next/previous) =====
    const stepTriggers = [
      'étape', 'etape', 'step', 'numéro', 'numero', 'number',
      'aller à', 'aller a', 'va à', 'va a', 'go to', 'jump to',
    ];
    if (matchesAny(stepTriggers)) {
      const stepNum = extractStepNumber();
      if (stepNum !== null && stepNum >= 1 && stepNum <= totalPages - 1) {
        setCurrentStep(stepNum);
        speakStep(stepNum);
        return;
      }
    }

    // ===== INTENT: NEXT STEP =====
    const nextWords = [
      // French
      'suivant', 'suivante', 'suivan', 'savant', 'servant', 'suivre',
      'prochain', 'prochaine', 'prochai', 'proche',
      'après', 'apres', 'ensuite', 'puis',
      'continuer', 'continue', 'continué', 'continuez',
      'avancer', 'avance', 'avancé', 'avancez',
      'passer', 'passe', 'passé',
      'étape suivante', 'prochaine étape',
      // English
      'next', 'nex', 'necks', 'nets',
      'forward', 'forwards', 'foward',
      'go on', 'move on', 'proceed',
      'next step', 'next one', 'go next', 'move forward',
      'keep going', 'carry on', 'advance',
      // Implicit confirmations (user understood, moving on)
      'c\'est bon', 'c est bon', 'compris', 'j\'ai compris',
      'd\'accord', 'd accord', 'parfait', 'super',
      'got it', 'okay next', 'alright', 'done',
      'understood', 'i got it', 'yep', 'yes',
    ];
    if (matchesAny(nextWords)) {
      if (currentStep < totalPages - 1) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        speakStep(newStep);
      }
      return;
    }

    // ===== INTENT: PREVIOUS STEP =====
    const prevWords = [
      // French
      'précédent', 'précédente', 'précéden', 'preceden', 'presidant', 'président',
      'retour', 'retourne', 'revenir', 'reviens',
      'en arrière', 'arrière', 'derrière',
      'reculer', 'recule', 'reculé',
      'étape précédente', 'étape d\'avant', 'étape avant',
      'juste avant', 'celle d\'avant',
      // English
      'previous', 'previus', 'previou', 'previews',
      'back', 'bac', 'beck',
      'go back', 'step back', 'one back',
      'backwards', 'backward', 'backword',
      'before', 'prior', 'the one before',
      'previous step', 'one before', 'go backwards',
    ];
    if (matchesAny(prevWords)) {
      if (currentStep > 0) {
        const newStep = currentStep - 1;
        setCurrentStep(newStep);
        speakStep(newStep);
      }
      return;
    }

    // ===== INTENT: READ / SPEAK =====
    const readWords = [
      // French
      'lire', 'lis', 'lit', 'lise', 'lisez',
      'parle', 'parler', 'parlé', 'parlez',
      'dis', 'dire', 'dites',
      'lecture', 'lis-moi', 'dis-moi',
      'récite', 'réciter', 'recite',
      'énonce', 'énoncer', 'annonce',
      'c\'est quoi', 'qu\'est-ce que', 'ça dit quoi',
      // English
      'read', 'reed', 'reading',
      'speak', 'speaking',
      'tell me', 'say it',
      'read out', 'read aloud', 'out loud',
      'read this', 'read it', 'speak up',
      'what does it say', 'read to me',
      'what\'s this step', 'what is this',
    ];
    if (matchesAny(readWords)) {
      speakStep();
      return;
    }

    // ===== INTENT: STOP =====
    const stopWords = [
      // French
      'stop', 'stoppe', 'stoppé', 'stopper',
      'arrête', 'arrete', 'arrêter', 'arreter', 'arrêté',
      'tais-toi', 'tais toi', 'tait toi', 'taisez-vous',
      'silence', 'silencieux',
      'pause', 'pauser', 'pausé',
      'chut', 'chuut', 'assez', 'suffit', 'ça suffit',
      'ferme-la', 'la ferme', 'ferme la',
      'taire', 'se taire', 'ok j\'ai compris',
      // English
      'stop', 'stob', 'stopp',
      'quiet', 'be quiet',
      'silence', 'silent',
      'shut up', 'hush', 'shush',
      'pause', 'paus',
      'enough', 'stop reading', 'stop talking',
      'be silent', 'stop speaking', 'that\'s enough',
      'okay i got it', 'ok i understand',
    ];
    if (matchesAny(stopWords)) {
      stopSpeaking();
      return;
    }

    // ===== INTENT: REPEAT =====
    const repeatWords = [
      // French
      'répète', 'repete', 'répéter', 'repeter', 'répété',
      'encore', 'encore une fois', 'une fois encore',
      'recommence', 'recommencer', 'recommencé',
      'redis', 'redis-moi', 'redit', 'redire',
      'refais', 'refaire', 'refait',
      'relis', 'relire', 'relu',
      'à nouveau', 'de nouveau',
      'j\'ai pas compris', 'j\'ai pas entendu',
      'tu peux répéter', 'quoi',
      // English
      'repeat', 'repea', 'repeate', 'repeated',
      'again', 'one more', 'one more time', 'once more',
      'say again', 'say that again', 'repeat that',
      'do it again', 'pardon', 'sorry', 'huh',
      'come again', 'i didn\'t catch that', 'repeat please',
      'what was that', 'didn\'t hear', 'say it again',
    ];
    if (matchesAny(repeatWords)) {
      speakStep();
      return;
    }

    // ===== INTENT: FIRST STEP =====
    const firstWords = [
      // French
      'début', 'debut', 'au début', 'le début',
      'première étape', 'premiere etape', 'étape un', 'etape un',
      'commencer', 'commence', 'on commence',
      'retour au début', 'depuis le début',
      // English
      'first step', 'step one', 'step 1',
      'beginning', 'from the start', 'from the beginning',
      'start over', 'restart', 'go to start',
      'back to the beginning',
    ];
    if (matchesAny(firstWords)) {
      setCurrentStep(1);
      speakStep(1);
      return;
    }

    // ===== INTENT: LAST STEP =====
    const lastWords = [
      // French
      'fin', 'la fin', 'à la fin',
      'dernière étape', 'derniere etape', 'dernière', 'dernier',
      'terminer', 'termine', 'étape finale',
      'aller à la fin', 'sauter à la fin',
      // English
      'last step', 'final step', 'last one',
      'the end', 'go to end', 'jump to end',
      'final', 'finale', 'last',
      'skip to end', 'go to last',
    ];
    if (matchesAny(lastWords)) {
      const lastStep = totalPages - 1;
      setCurrentStep(lastStep);
      speakStep(lastStep);
      return;
    }

    // ===== INTENT: HELP (could add in future) =====
    // For now, log unrecognized commands for debugging
    console.log('Unrecognized voice command:', text);
  }, [currentStep, totalPages, speakStep, stopSpeaking]);

  // Voice recognition - start/stop listening
  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.error('Speech recognition not supported');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = isEN ? 'en-US' : 'fr-FR';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      console.log('Voice command:', transcript);
      processVoiceCommand(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
    }
  }, [isListening, isEN, processVoiceCommand]);

  // Stop listening when closing cook mode
  useEffect(() => {
    if (!isOpen && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isOpen]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 bg-[#F77313] hover:bg-[#d45f0a] text-white font-medium rounded-full transition-colors ${
          compact ? 'p-2 md:px-4 md:py-2' : 'px-5 py-2.5'
        }`}
        title={t.cookMode}
      >
        <Maximize2 className={compact ? 'w-4 h-4 md:w-5 md:h-5' : 'w-5 h-5'} />
        <span className={compact ? 'hidden md:inline text-sm' : ''}>{t.cookMode}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black"
          >
            {/* Conteneur principal - Layout livre */}
            <div className="h-full flex flex-col lg:flex-row">
              {/* Page gauche - Image */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative h-[35vh] lg:h-full lg:w-[40%] flex-shrink-0"
              >
                {recipe.featuredImage ? (
                  <Image
                    src={recipe.featuredImage}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-800" />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Titre sur l'image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                  <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-4">
                    {recipe.title}
                  </h1>

                  {/* Infos rapides */}
                  <div className="flex flex-wrap gap-4 text-white/80">
                    {recipe.prepTime > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{t.prep}: {recipe.prepTime} min</span>
                      </div>
                    )}
                    {recipe.cookTime > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{t.cook}: {recipe.cookTime} min</span>
                      </div>
                    )}
                    {recipe.servings > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{recipe.servings} {recipe.servingsUnit || t.servings}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bouton fermer */}
                <button
                  onClick={resetAndClose}
                  className="absolute top-4 left-4 lg:top-6 lg:left-6 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </motion.div>

              {/* Page droite - Contenu */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 bg-white flex flex-col overflow-hidden"
              >
                {/* Header avec pagination */}
                <div className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-neutral-200 bg-neutral-50">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          i === currentStep
                            ? 'bg-[#F77313] scale-125'
                            : i < currentStep
                            ? 'bg-green-500'
                            : 'bg-neutral-300 hover:bg-neutral-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-neutral-500">
                    {currentStep === 0 ? t.ingredients : `${t.step} ${currentStep} / ${totalPages - 1}`}
                  </span>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {currentStep === 0 ? (
                      // Page des ingrédients
                      <motion.div
                        key="ingredients"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 lg:p-10"
                      >
                        <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                          <span className="text-3xl">🥗</span>
                          {t.ingredients}
                        </h2>

                        <div className="space-y-6">
                          {recipe.ingredients.map((group, groupIndex) => (
                            <div key={groupIndex}>
                              {group.title && (
                                <h3 className="text-lg font-semibold text-[#F77313] mb-3 uppercase tracking-wide">
                                  {group.title}
                                </h3>
                              )}
                              <ul className="space-y-2">
                                {group.items.map((item, itemIndex) => {
                                  const id = `${groupIndex}-${itemIndex}`;
                                  const isChecked = checkedIngredients.has(id);
                                  return (
                                    <li key={itemIndex}>
                                      <button
                                        onClick={() => toggleIngredient(id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                                          isChecked
                                            ? 'bg-green-50 border-2 border-green-500'
                                            : 'bg-neutral-50 hover:bg-neutral-100 border-2 border-transparent'
                                        }`}
                                      >
                                        <div
                                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                            isChecked
                                              ? 'bg-green-500 text-white'
                                              : 'bg-white border-2 border-neutral-300'
                                          }`}
                                        >
                                          {isChecked && <Check className="w-4 h-4" />}
                                        </div>
                                        <span
                                          className={`text-lg ${
                                            isChecked ? 'text-green-700 line-through' : 'text-neutral-800'
                                          }`}
                                        >
                                          {item.quantity && <strong>{item.quantity} </strong>}
                                          {item.unit && <span>{item.unit} </span>}
                                          {item.name}
                                          {item.note && (
                                            <span className="text-neutral-500 text-base"> ({item.note})</span>
                                          )}
                                        </span>
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      // Page d'instruction
                      <motion.div
                        key={`step-${currentStep}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 lg:p-10 flex flex-col justify-center min-h-full"
                      >
                        <div className="max-w-2xl mx-auto w-full">
                          {/* Numéro de l'étape */}
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#F77313] rounded-full flex items-center justify-center text-white text-3xl lg:text-4xl font-bold shadow-lg">
                              {currentStep}
                            </div>
                            <div className="flex-1 h-1 bg-gradient-to-r from-[#F77313] to-transparent rounded" />
                          </div>

                          {/* Titre de l'étape si présent */}
                          {recipe.instructions[currentStep - 1]?.title && (
                            <h3 className="text-xl lg:text-2xl font-bold text-neutral-800 mb-4">
                              {recipe.instructions[currentStep - 1].title}
                            </h3>
                          )}

                          {/* Contenu de l'étape */}
                          <p className="text-xl lg:text-2xl text-neutral-700 leading-relaxed mb-8">
                            {recipe.instructions[currentStep - 1]?.content}
                          </p>

                          {/* Astuce si présente */}
                          {recipe.instructions[currentStep - 1]?.tip && (
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
                              <p className="text-amber-800 flex items-start gap-3">
                                <span className="text-2xl">💡</span>
                                <span className="text-lg">{recipe.instructions[currentStep - 1].tip}</span>
                              </p>
                            </div>
                          )}

                          {/* Image de l'étape si présente */}
                          {recipe.instructions[currentStep - 1]?.image && (
                            <div className="mt-8 rounded-xl overflow-hidden">
                              <Image
                                src={recipe.instructions[currentStep - 1].image!}
                                alt={`${t.step} ${currentStep}`}
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation with Timer */}
                <div className="border-t border-neutral-200 bg-white">
                  {/* Timer bar - shows when timer is active or alarm is playing */}
                  {(timeRemaining !== null || isAlarmPlaying) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`px-6 lg:px-10 py-3 flex items-center justify-center gap-4 ${
                        isAlarmPlaying
                          ? 'bg-red-500'
                          : timeRemaining === 0
                          ? 'bg-green-500'
                          : 'bg-neutral-100'
                      }`}
                    >
                      {isAlarmPlaying ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                          >
                            <Volume2 className="w-6 h-6 text-white" />
                          </motion.div>
                          <span className="text-white font-bold text-lg">{t.timerDone}</span>
                          <button
                            onClick={stopAlarm}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-red-500 rounded-full font-medium hover:bg-red-50 transition-colors"
                          >
                            <VolumeX className="w-5 h-5" />
                            {t.stopAlarm}
                          </button>
                        </>
                      ) : (
                        <>
                          <Timer className={`w-5 h-5 ${timeRemaining === 0 ? 'text-white' : 'text-[#F77313]'}`} />
                          <span className={`font-mono text-2xl font-bold ${timeRemaining === 0 ? 'text-white' : 'text-neutral-800'}`}>
                            {formatTime(timeRemaining || 0)}
                          </span>
                          <div className="flex items-center gap-2">
                            {timeRemaining && timeRemaining > 0 && (
                              <button
                                onClick={isTimerRunning ? pauseTimer : resumeTimer}
                                className="p-2 bg-white rounded-full hover:bg-neutral-50 transition-colors shadow-sm"
                              >
                                {isTimerRunning ? (
                                  <Pause className="w-5 h-5 text-neutral-700" />
                                ) : (
                                  <Play className="w-5 h-5 text-[#F77313]" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={resetTimer}
                              className="p-2 bg-white rounded-full hover:bg-neutral-50 transition-colors shadow-sm"
                            >
                              <RotateCcw className="w-5 h-5 text-neutral-700" />
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Main navigation */}
                  <div className="flex items-center justify-between px-6 lg:px-10 py-4">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full font-medium transition-all ${
                        currentStep === 0
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span className="hidden sm:inline">{t.previous}</span>
                    </button>

                    {/* Center buttons: Mic + Speech + Timer */}
                    <div className="flex items-center gap-2">
                      {/* Microphone button */}
                      <button
                        onClick={toggleListening}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all ${
                          isListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                        title={isListening ? t.listening : t.voiceControl}
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>

                      {/* Speech button */}
                      <button
                        onClick={isSpeaking ? stopSpeaking : speakCurrentStep}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all ${
                          isSpeaking
                            ? 'bg-purple-500 text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                        title={isSpeaking ? t.stopReading : t.readAloud}
                      >
                        <Speech className="w-5 h-5" />
                      </button>

                      {/* Timer button */}
                      <button
                        onClick={() => setShowTimerModal(true)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all ${
                          timeRemaining !== null
                            ? 'bg-[#F77313] text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        <Timer className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={nextStep}
                      disabled={currentStep === totalPages - 1}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full font-medium transition-all ${
                        currentStep === totalPages - 1
                          ? 'bg-green-500 text-white'
                          : 'bg-[#F77313] hover:bg-[#d45f0a] text-white'
                      }`}
                    >
                      <span className="hidden sm:inline">
                        {currentStep === totalPages - 1 ? t.done : t.next}
                      </span>
                      {currentStep === totalPages - 1 ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Timer Modal */}
                <AnimatePresence>
                  {showTimerModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
                      onClick={() => setShowTimerModal(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
                          <Timer className="w-6 h-6 text-[#F77313]" />
                          {t.timer}
                        </h3>

                        <div className="flex items-center justify-center gap-2 mb-6">
                          {/* Hours */}
                          <div className="flex flex-col items-center">
                            <button
                              onClick={() => setTimerHours(prev => Math.min(23, prev + 1))}
                              className="w-14 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-t-xl flex items-center justify-center transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 text-neutral-600 rotate-90" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="23"
                              value={timerHours}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setTimerHours(Math.min(23, Math.max(0, val)));
                              }}
                              onKeyDown={(e) => e.stopPropagation()}
                              className="w-14 h-14 text-2xl font-mono font-bold text-center text-neutral-800 bg-white border-2 border-neutral-200 focus:border-[#F77313] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => setTimerHours(prev => Math.max(0, prev - 1))}
                              className="w-14 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-b-xl flex items-center justify-center transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 text-neutral-600 -rotate-90" />
                            </button>
                            <span className="text-xs text-neutral-500 mt-1">{isEN ? 'hrs' : 'h'}</span>
                          </div>

                          <span className="text-2xl font-bold text-neutral-300 mb-4">:</span>

                          {/* Minutes */}
                          <div className="flex flex-col items-center">
                            <button
                              onClick={() => setTimerMinutes(prev => Math.min(59, prev + 1))}
                              className="w-14 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-t-xl flex items-center justify-center transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 text-neutral-600 rotate-90" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={timerMinutes}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setTimerMinutes(Math.min(59, Math.max(0, val)));
                              }}
                              onKeyDown={(e) => e.stopPropagation()}
                              className="w-14 h-14 text-2xl font-mono font-bold text-center text-neutral-800 bg-white border-2 border-neutral-200 focus:border-[#F77313] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => setTimerMinutes(prev => Math.max(0, prev - 1))}
                              className="w-14 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-b-xl flex items-center justify-center transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 text-neutral-600 -rotate-90" />
                            </button>
                            <span className="text-xs text-neutral-500 mt-1">min</span>
                          </div>

                          <span className="text-2xl font-bold text-neutral-300 mb-4">:</span>

                          {/* Seconds */}
                          <div className="flex flex-col items-center">
                            <button
                              onClick={() => setTimerSeconds(prev => prev >= 55 ? 0 : prev + 5)}
                              className="w-14 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-t-xl flex items-center justify-center transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 text-neutral-600 rotate-90" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={timerSeconds}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setTimerSeconds(Math.min(59, Math.max(0, val)));
                              }}
                              onKeyDown={(e) => e.stopPropagation()}
                              className="w-14 h-14 text-2xl font-mono font-bold text-center text-neutral-800 bg-white border-2 border-neutral-200 focus:border-[#F77313] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => setTimerSeconds(prev => prev <= 0 ? 55 : prev - 5)}
                              className="w-14 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-b-xl flex items-center justify-center transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 text-neutral-600 -rotate-90" />
                            </button>
                            <span className="text-xs text-neutral-500 mt-1">sec</span>
                          </div>
                        </div>

                        {/* Quick presets */}
                        <div className="flex flex-wrap gap-2 mb-6 justify-center">
                          {[1, 5, 10, 15, 30, 60].map((mins) => (
                            <button
                              key={mins}
                              onClick={() => {
                                if (mins >= 60) {
                                  setTimerHours(Math.floor(mins / 60));
                                  setTimerMinutes(mins % 60);
                                } else {
                                  setTimerHours(0);
                                  setTimerMinutes(mins);
                                }
                                setTimerSeconds(0);
                              }}
                              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm font-medium text-neutral-700 transition-colors"
                            >
                              {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowTimerModal(false)}
                            className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium text-neutral-700 transition-colors"
                          >
                            {isEN ? 'Cancel' : 'Annuler'}
                          </button>
                          <button
                            onClick={startTimer}
                            className="flex-1 py-3 bg-[#F77313] hover:bg-[#d45f0a] rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-2"
                          >
                            <Play className="w-5 h-5" />
                            {t.start}
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
