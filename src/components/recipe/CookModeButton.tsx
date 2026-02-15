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
  const currentStepRef = useRef(currentStep); // Ref to avoid stale closure in voice commands
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
  const isListeningRef = useRef(isListening);

  // Refs for state values to avoid stale closures in callbacks
  const timeRemainingRef = useRef(timeRemaining);
  const isTimerRunningRef = useRef(isTimerRunning);
  const isAlarmPlayingRef = useRef(isAlarmPlaying);

  // Total des étapes: 0 = ingrédients, 1+ = instructions
  const totalPages = recipe.instructions.length + 1;

  // Keep refs in sync with state (fixes stale closures in voice commands and other callbacks)
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  useEffect(() => {
    isTimerRunningRef.current = isTimerRunning;
  }, [isTimerRunning]);

  useEffect(() => {
    isAlarmPlayingRef.current = isAlarmPlaying;
  }, [isAlarmPlaying]);

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

  // Voice recognition - BEST PRACTICES implementation
  const processVoiceCommand = useCallback((transcript: string) => {
    // ===== STEP 1: Normalize text (remove accents, lowercase, clean) =====
    const normalizeText = (str: string): string => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/['']/g, ' ')           // Replace apostrophes with space
        .replace(/[^a-z0-9\s]/g, ' ')    // Remove special chars
        .replace(/\s+/g, ' ')            // Multiple spaces to single
        .trim();
    };

    const raw = transcript.toLowerCase().trim();
    const text = normalizeText(transcript);
    console.log('Voice command (raw):', raw);
    console.log('Voice command (normalized):', text);

    // ===== STEP 2: Helper functions (use ref to avoid stale closure) =====
    const goNext = () => {
      const step = currentStepRef.current;
      if (step < totalPages - 1) {
        const newStep = step + 1;
        setCurrentStep(newStep);
        setTimeout(() => speakStep(newStep), 200);
        console.log('→ Going to step', newStep, '(from', step, ')');
        return true;
      }
      console.log('→ Already at last step');
      return false;
    };

    const goPrev = () => {
      const step = currentStepRef.current;
      if (step > 0) {
        const newStep = step - 1;
        setCurrentStep(newStep);
        setTimeout(() => speakStep(newStep), 200);
        console.log('→ Going to step', newStep, '(from', step, ')');
        return true;
      }
      console.log('→ Already at first step');
      return false;
    };

    const goToStep = (targetStep: number) => {
      if (targetStep >= 0 && targetStep < totalPages) {
        setCurrentStep(targetStep);
        setTimeout(() => speakStep(targetStep), 200);
        console.log('→ Going to step', targetStep);
        return true;
      }
      return false;
    };

    const readCurrent = () => {
      const step = currentStepRef.current;
      console.log('→ Reading current step', step);
      speakStep(step);
      return true;
    };

    // Timer control helpers
    const resumeT = () => {
      if (!isTimerRunningRef.current && timeRemainingRef.current != null && timeRemainingRef.current > 0) {
        console.log('→ Resuming timer');
        resumeTimer();
        return true;
      }
      return false;
    };
    const pauseT = () => {
      if (isTimerRunningRef.current) {
        console.log('→ Pausing timer');
        pauseTimer();
        return true;
      }
      return false;
    };
    const resetT = () => {
      console.log('→ Resetting timer');
      resetTimer();
      return true;
    };
    const stopA = () => {
      if (isAlarmPlayingRef.current) {
        console.log('→ Stopping alarm');
        stopAlarm();
        return true;
      }
      return false;
    };
    const setAndStartTimer = (duration: { hours?: number, minutes?: number, seconds?: number }) => {
      const { hours = 0, minutes = 0, seconds = 0 } = duration;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds > 0) {
        setTimeRemaining(totalSeconds);
        setIsTimerRunning(true);
        setShowTimerModal(false); // Close if open
        console.log(`→ Timer set and started for ${hours}h ${minutes}m ${seconds}s`);
        return true;
      }
      return false;
    };


    // ===== STEP 3: Word matching with better accuracy =====
    const matchesAny = (patterns: string[]): boolean => {
      return patterns.some(pattern => {
        // Use word boundaries for more precise matching
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        return regex.test(text) || regex.test(raw);
      });
    };

    // ===== STEP 4: Extract numbers and duration =====
    const extractNumber = (): number | null => {
      const digitMatch = text.match(/\b(\d+)\b/);
      if (digitMatch) return parseInt(digitMatch[1]);

      const numberWords: Record<string, number> = {
        'un': 1, 'une': 1, 'premier': 1, 'premiere': 1, 'first': 1, 'one': 1,
        'deux': 2, 'deuxieme': 2, 'second': 2, 'seconde': 2, 'two': 2, 'to': 2,
        'trois': 3, 'troisieme': 3, 'third': 3, 'three': 3,
        'quatre': 4, 'quatrieme': 4, 'fourth': 4, 'four': 4,
        'cinq': 5, 'cinquieme': 5, 'fifth': 5, 'five': 5,
        'six': 6, 'sixieme': 6, 'sixth': 6, 'sex': 6,
        'sept': 7, 'septieme': 7, 'seventh': 7, 'seven': 7,
        'huit': 8, 'huitieme': 8, 'eighth': 8, 'eight': 8, 'width': 8,
        'neuf': 9, 'neuvieme': 9, 'ninth': 9, 'nine': 9,
        'dix': 10, 'dixieme': 10, 'tenth': 10, 'ten': 10,
        'onze': 11, 'eleven': 11, 'douze': 12, 'twelve': 12, 'treize': 13, 'thirteen': 13,
        'quatorze': 14, 'fourteen': 14, 'quinze': 15, 'fifteen': 15, 'seize': 16, 'sixteen': 16,
        'vingt': 20, 'twenty': 20, 'trente': 30, 'thirty': 30, 'quarante': 40, 'forty': 40,
        'cinquante': 50, 'fifty': 50, 'soixante': 60, 'sixty': 60,
      };

      for (const [word, num] of Object.entries(numberWords)) {
        if (text.includes(word)) return num;
      }
      return null;
    };

    const extractDuration = (): { hours: number, minutes: number, seconds: number } | null => {
        let hours = 0, minutes = 0, seconds = 0;
        let found = false;

        let processedText = ` ${text} `;
        const numberWords: Record<string, number> = {
            'un': 1, 'une': 1, 'one': 1, 'deux': 2, 'two': 2, 'trois': 3, 'three': 3, 'quatre': 4, 'four': 4,
            'cinq': 5, 'five': 5, 'six': 6, 'sept': 7, 'seven': 7, 'huit': 8, 'eight': 8,
            'neuf': 9, 'nine': 9, 'dix': 10, 'ten': 10, 'onze': 11, 'eleven': 11, 'douze': 12, 'twelve': 12,
            'treize': 13, 'thirteen': 13, 'quatorze': 14, 'fourteen': 14, 'quinze': 15, 'fifteen': 15,
            'seize': 16, 'sixteen': 16, 'vingt': 20, 'twenty': 20, 'trente': 30, 'thirty': 30,
            'quarante': 40, 'forty': 40, 'cinquante': 50, 'fifty': 50, 'soixante': 60, 'sixty': 60,
        };

        for (const [word, num] of Object.entries(numberWords)) {
            processedText = processedText.replace(` ${word} `, ` ${num} `);
        }

        const hRegex = /(\d+)\s*(h|heure|heures|hour|hours)/;
        const mRegex = /(\d+)\s*(m|min|minute|minutes)/;
        const sRegex = /(\d+)\s*(s|sec|seconde|secondes|second|seconds)/;

        const hMatch = processedText.match(hRegex);
        if (hMatch) { hours = parseInt(hMatch[1], 10); found = true; }

        const mMatch = processedText.match(mRegex);
        if (mMatch) { minutes = parseInt(mMatch[1], 10); found = true; }

        const sMatch = processedText.match(sRegex);
        if (sMatch) { seconds = parseInt(sMatch[1], 10); found = true; }

        if (!found) {
            const numMatch = processedText.match(/\b(\d+)\b/);
            if (numMatch) {
                minutes = parseInt(numMatch[1], 10); // Default to minutes
                found = true;
            }
        }
        return found ? { hours, minutes, seconds } : null;
    };

    // ===== COMMAND PATTERNS (ordered by priority) =====

    // 1. STOP ALARM (highest priority)
    const stopAlarmPatterns = ['stop alarme', 'arrete l alarme', 'stop alarm', 'turn off alarm'];
    if (matchesAny(stopAlarmPatterns)) {
      if (stopA()) {
        console.log('✓ STOP ALARM detected');
        return;
      }
    }

    // 2. SET TIMER
    const timerTriggers = ['minuterie', 'minuteur', 'timer', 'set a timer', 'mets une minuterie'];
    if (matchesAny(timerTriggers)) {
      const duration = extractDuration();
      if (duration && setAndStartTimer(duration)) {
        console.log('✓ SET TIMER detected');
        return;
      }
    }

    // 3. TIMER CONTROLS (PAUSE/RESUME/RESET)
    const pauseTimerPatterns = ['pause minuterie', 'pause timer', 'pause'];
    if (matchesAny(pauseTimerPatterns)) {
      if (pauseT()) {
        console.log('✓ PAUSE TIMER detected');
        return;
      }
    }
    const resumeTimerPatterns = ['reprends la minuterie', 'demarre la minuterie', 'resume timer', 'start timer'];
    if (matchesAny(resumeTimerPatterns)) {
      if (resumeT()) {
        console.log('✓ RESUME/START TIMER detected');
        return;
      }
    }
    const resetTimerPatterns = ['reinitialise la minuterie', 'reset timer', 'recommence la minuterie'];
    if (matchesAny(resetTimerPatterns)) {
      if (resetT()) {
        console.log('✓ RESET TIMER detected');
        return;
      }
    }

    // 4. NEXT STEP - Most common, check first
    const nextPatterns = [
      'suivant', 'suivante', 'suivan', 'prochain', 'prochaine', 'apres', 'ensuite',
      'continue', 'continuer', 'continue', 'avance', 'avancer', 'passe', 'passer',
      'etape suivante', 'prochaine etape', 'savant', 'vivant', 'devant',
      'next', 'forward', 'proceed', 'go on', 'move on', 'keep going', 'carry on', 'advance', 'next step',
    ];
    if (matchesAny(nextPatterns)) {
      console.log('✓ NEXT detected');
      goNext();
      return;
    }

    // 5. PREVIOUS STEP
    const prevPatterns = [
      'precedent', 'precedente', 'retour', 'retourne', 'arriere', 'derriere',
      'recule', 'reculer', 'revenir', 'reviens', 'etape precedente', 'etape avant', 'etape d avant',
      'previous', 'back', 'backward', 'backwards', 'go back', 'step back', 'before', 'prior',
    ];
    if (matchesAny(prevPatterns)) {
      console.log('✓ PREVIOUS detected');
      goPrev();
      return;
    }

    // 6. REPEAT/READ CURRENT
    const repeatPatterns = [
      'repete', 'repeter', 'repetez', 'encore', 'encore une fois', 'relis', 'relire', 'relisez',
      'redis', 'redire', 'redites', 'recommence', 'recommencer', 'lis', 'lire', 'lisez',
      'parle', 'parler', 'parlez', 'dis', 'dire', 'dites', 'c est quoi', 'qu est ce que', 'ca dit quoi',
      'repeat', 'again', 'one more time', 'once more', 'read', 'read it', 'read aloud', 'say again', 'what was that',
    ];
    if (matchesAny(repeatPatterns)) {
      console.log('✓ REPEAT/READ detected');
      readCurrent();
      return;
    }

    // 7. STOP SPEAKING
    const stopPatterns = [
      'stop', 'stoppe', 'stopper', 'arrete', 'arreter', 'tais', 'taisez', 'silence', 'silencieux',
      'pause', 'pauser', 'chut', 'suffit', 'assez', 'ferme', 'la ferme',
      'quiet', 'be quiet', 'hush', 'shush', 'shut up', 'enough', 'stop talking', 'stop reading',
    ];
    if (matchesAny(stopPatterns)) {
      console.log('✓ STOP detected');
      stopSpeaking();
      return;
    }

    // 8. GO TO INGREDIENTS
    const ingredientPatterns = ['ingredient', 'ingredients', 'ingredien', 'liste', 'shopping', 'list'];
    if (matchesAny(ingredientPatterns)) {
      console.log('✓ INGREDIENTS detected');
      goToStep(0);
      return;
    }

    // 9. GO TO SPECIFIC STEP (with number)
    const stepTriggers = ['etape', 'step', 'numero', 'number', 'va a', 'aller a', 'go to'];
    if (matchesAny(stepTriggers)) {
      const num = extractNumber();
      if (num !== null && num >= 1 && num <= totalPages - 1) {
        console.log('✓ GO TO STEP', num, 'detected');
        goToStep(num);
        return;
      }
    }

    // 10. FIRST STEP
    const firstPatterns = [
      'debut', 'commencement', 'commencer', 'commence', 'premiere etape', 'etape une', 'etape un',
      'first', 'first step', 'beginning', 'start',
    ];
    if (matchesAny(firstPatterns)) {
      console.log('✓ FIRST STEP detected');
      goToStep(1);
      return;
    }

    // 11. LAST STEP
    const lastPatterns = [
      'fin', 'derniere', 'dernier', 'finale', 'derniere etape', 'etape finale',
      'last', 'last step', 'final', 'end',
    ];
    if (matchesAny(lastPatterns)) {
      console.log('✓ LAST STEP detected');
      goToStep(totalPages - 1);
      return;
    }

    // 12. Easter egg - Fresh N' Grill!
    if (matchesAny(['fresh and grill', 'fresh n grill'])) {
      console.log('🔥 FRESH N GRILL detected!');
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        stopSpeaking();
        const utterance = new SpeechSynthesisUtterance("Fresh N' Grill, fire up the grill!");
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        if (englishVoice) utterance.voice = englishVoice;
        window.speechSynthesis.speak(utterance);
      }
      return;
    }

    // 13. Fallback - check for simple confirmations that might mean "next"
    const confirmPatterns = [
      'ok', 'okay', 'd accord', 'daccord', 'oui', 'yes', 'yeah',
      'compris', 'c est bon', 'parfait', 'super', 'bien',
      'got it', 'alright', 'understood',
    ];
    if (matchesAny(confirmPatterns)) {
      console.log('✓ CONFIRMATION → NEXT detected');
      goNext();
      return;
    }

    console.log('✗ Unrecognized command:', text);
  }, [totalPages, speakStep, stopSpeaking, isEN, resumeTimer, pauseTimer, resetTimer, stopAlarm, setTimeRemaining, setIsTimerRunning, setShowTimerModal]);

  // Voice recognition - start/stop listening
  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.error('Speech recognition not supported');
      alert(isEN ? 'Speech recognition is not supported by your browser.' : 'La reconnaissance vocale n\'est pas supportée par votre navigateur.');
      return;
    }

    // If listening, stop it.
    if (isListeningRef.current && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // If not listening, start it.
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true; // Keep listening even after a result
    recognition.interimResults = false; // We only want final results
    recognition.lang = isEN ? 'en-US' : 'fr-FR';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      processVoiceCommand(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      // 'no-speech' is common, we can ignore it or just stop listening.
      // Other errors like 'network' or 'not-allowed' are more critical.
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Some browsers stop recognition after a period of silence.
      // If we are still supposed to be listening, restart it.
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Error restarting recognition:', e);
          setIsListening(false); // Stop if restart fails
        }
      } else {
        setIsListening(false); // Ensure UI is synced
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
      setIsListening(false);
    }
  }, [isEN, processVoiceCommand]);

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
          compact ? 'px-3 py-2 md:px-4 md:py-2' : 'px-5 py-2.5'
        }`}
        title={t.cookMode}
      >
        <Maximize2 className={compact ? 'w-4 h-4 md:w-5 md:h-5' : 'w-5 h-5'} />
        <span className={compact ? 'text-xs md:text-sm' : ''}>{t.cookMode}</span>
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
