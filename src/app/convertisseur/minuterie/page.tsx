'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Timer, ArrowLeft, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';

const presetTimes = [
  { label: '30 sec', seconds: 30 },
  { label: '45 sec', seconds: 45 },
  { label: '1 min', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2 min', seconds: 120 },
  { label: '2:30', seconds: 150 },
  { label: '3 min', seconds: 180 },
  { label: '3:30', seconds: 210 },
  { label: '4 min', seconds: 240 },
  { label: '5 min', seconds: 300 },
  { label: '6 min', seconds: 360 },
  { label: '7 min', seconds: 420 },
  { label: '8 min', seconds: 480 },
  { label: '9 min', seconds: 540 },
  { label: '10 min', seconds: 600 },
  { label: '12 min', seconds: 720 },
  { label: '15 min', seconds: 900 },
  { label: '20 min', seconds: 1200 },
  { label: '30 min', seconds: 1800 },
  { label: '40 min', seconds: 2400 },
];

const cookingTimes = [
  { food: 'Pâtes al dente', method: 'Eau bouillante', time: '8-10 min' },
  { food: 'Riz blanc', method: 'Eau bouillante', time: '12-15 min' },
  { food: 'Riz basmati', method: 'Eau bouillante', time: '10-12 min' },
  { food: 'Œuf à la coque', method: 'Eau bouillante', time: '3-4 min' },
  { food: 'Œuf mollet', method: 'Eau bouillante', time: '5-6 min' },
  { food: 'Œuf dur', method: 'Eau bouillante', time: '9-10 min' },
  { food: 'Pommes de terre', method: 'Eau bouillante', time: '20-25 min' },
  { food: 'Brocoli', method: 'Vapeur', time: '5-7 min' },
  { food: 'Carottes', method: 'Vapeur', time: '8-10 min' },
  { food: 'Haricots verts', method: 'Eau bouillante', time: '5-7 min' },
  { food: 'Poulet (poitrine)', method: 'Four 200°C', time: '25-30 min' },
  { food: 'Saumon (filet)', method: 'Four 200°C', time: '12-15 min' },
  { food: 'Steak saignant', method: 'Poêle', time: '2-3 min/côté' },
  { food: 'Steak à point', method: 'Poêle', time: '3-4 min/côté' },
  { food: 'Bacon', method: 'Poêle', time: '4-5 min' },
];

export default function MinuteriePage() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Audio autoplay blocked, show visual alert
      });
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds, playAlarm]);

  useEffect(() => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }, [totalSeconds]);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  const handleStart = () => {
    if (totalSeconds > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setIsFinished(false);
  };

  const setPresetTime = (secs: number) => {
    setTotalSeconds(secs);
    setIsFinished(false);
  };

  const handleInputChange = (type: 'h' | 'm' | 's', value: string) => {
    const num = parseInt(value) || 0;
    let h = hours;
    let m = minutes;
    let s = seconds;

    if (type === 'h') h = Math.min(99, Math.max(0, num));
    if (type === 'm') m = Math.min(59, Math.max(0, num));
    if (type === 's') s = Math.min(59, Math.max(0, num));

    setTotalSeconds(h * 3600 + m * 60 + s);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Audio element for alarm */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleC8LW6TW4bFsIwxRndjnuXYpEFWh2em8eCsQVaHY57x5KxJUoNfmu3kqElSg1+a6eSoSVJ/X5rp4KhJUn9bluXgqElSf1uW5dyoSVJ/W5bl3KhJTn9bluXcqElOf1uW4dyoSU5/V5bh3KhJTn9XluHYqElOf1eW4dioSU5/V5bh2KRJTntXkt3YpElOe1OS3dikRU57U5Ld1KRFTntTkt3UpEVOe1OS3dCkRU53U5LZ0KRFTndPktnQoEVOd0+S2dCgRU53T47Z0KBBS" type="audio/wav" />
      </audio>

      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-neutral-500 hover:text-black">
              Accueil
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/convertisseur" className="text-neutral-500 hover:text-black">
              Convertisseur
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-medium">Minuterie</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/convertisseur"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Tous les outils
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-orange-500 text-white flex items-center justify-center">
              <Timer className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Minuterie en ligne
              </h1>
              <p className="text-neutral-400 mt-1">Gratuite et sans inscription</p>
            </div>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl">
            En cuisine, le temps est souvent la clé du succès. Une minute de trop, et vos
            biscuits deviennent secs. Utilisez notre minuterie pour des cuissons parfaites.
          </p>
        </div>
      </section>

      {/* Minuterie */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className={`border-4 ${isFinished ? 'border-red-500 bg-red-50' : 'border-neutral-200 bg-neutral-50'} p-8 transition-colors`}>
            {/* Affichage du temps */}
            <div className="text-center mb-8">
              <div className={`font-mono text-6xl md:text-8xl font-bold ${isFinished ? 'text-red-500 animate-pulse' : 'text-black'}`}>
                {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
              </div>
              {isFinished && (
                <div className="mt-4 flex items-center justify-center gap-2 text-red-500 text-xl font-semibold">
                  <Volume2 className="w-6 h-6 animate-bounce" />
                  Temps écoulé !
                </div>
              )}
            </div>

            {/* Inputs manuels */}
            {!isRunning && (
              <div className="flex justify-center gap-4 mb-8">
                <div className="text-center">
                  <label className="block text-xs text-neutral-500 mb-1">Heures</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={hours}
                    onChange={(e) => handleInputChange('h', e.target.value)}
                    className="w-16 px-2 py-2 text-center text-2xl border border-neutral-300 focus:border-[#F77313] outline-none"
                  />
                </div>
                <div className="text-center">
                  <label className="block text-xs text-neutral-500 mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => handleInputChange('m', e.target.value)}
                    className="w-16 px-2 py-2 text-center text-2xl border border-neutral-300 focus:border-[#F77313] outline-none"
                  />
                </div>
                <div className="text-center">
                  <label className="block text-xs text-neutral-500 mb-1">Secondes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => handleInputChange('s', e.target.value)}
                    className="w-16 px-2 py-2 text-center text-2xl border border-neutral-300 focus:border-[#F77313] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Boutons de contrôle */}
            <div className="flex justify-center gap-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  disabled={totalSeconds === 0}
                  className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  Démarrer
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-8 py-3 bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-8 py-3 bg-neutral-200 text-neutral-700 font-medium hover:bg-neutral-300 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ad après minuterie */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Temps prédéfinis */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl text-black mb-6 text-center">
            Temps prédéfinis
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              {presetTimes.map((preset) => (
                <button
                  key={preset.seconds}
                  onClick={() => setPresetTime(preset.seconds)}
                  className="px-4 py-2 bg-white border border-neutral-200 hover:border-[#F77313] hover:bg-[#F77313] hover:text-white transition-all text-sm font-medium"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tableau des temps de cuisson */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-black mb-8 text-center">
            Temps de cuisson courants
          </h2>

          <div className="bg-white border border-neutral-200 overflow-hidden">
            <div className="bg-[#F77313] text-white px-6 py-4">
              <h3 className="font-display text-lg">Guide de cuisson</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Aliment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Méthode</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Temps</th>
                  </tr>
                </thead>
                <tbody>
                  {cookingTimes.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-neutral-50'}>
                      <td className="px-4 py-2 text-sm font-medium">{item.food}</td>
                      <td className="px-4 py-2 text-sm text-neutral-600">{item.method}</td>
                      <td className="px-4 py-2 text-sm font-semibold text-[#F77313]">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              Avantages de notre minuterie
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-200 p-4">
                <h3 className="font-semibold text-black mb-2">Démarrage rapide</h3>
                <p className="text-neutral-600 text-sm">Entrez le temps et cliquez sur démarrer</p>
              </div>
              <div className="bg-white border border-neutral-200 p-4">
                <h3 className="font-semibold text-black mb-2">Alerte sonore</h3>
                <p className="text-neutral-600 text-sm">Notification automatique à la fin du compte à rebours</p>
              </div>
              <div className="bg-white border border-neutral-200 p-4">
                <h3 className="font-semibold text-black mb-2">Interface claire</h3>
                <p className="text-neutral-600 text-sm">Design minimaliste et facile à utiliser</p>
              </div>
              <div className="bg-white border border-neutral-200 p-4">
                <h3 className="font-semibold text-black mb-2">Multi-appareils</h3>
                <p className="text-neutral-600 text-sm">Compatible mobile, tablette et ordinateur</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl text-black mb-6">
            Idéal pour
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm">
              Passionnés de pâtisserie
            </span>
            <span className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm">
              Cuisiniers du quotidien
            </span>
            <span className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm">
              Parents préparant les repas
            </span>
            <span className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm">
              Adeptes du batch cooking
            </span>
          </div>
        </div>
      </section>

      {/* Autres convertisseurs */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl text-black mb-6">
            Autres outils
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href="/convertisseur/celsius-fahrenheit"
              className="p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors"
            >
              <span className="font-display text-black">Celsius - Fahrenheit</span>
            </Link>
            <Link
              href="/convertisseur/metre-pied"
              className="p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors"
            >
              <span className="font-display text-black">Mètre en Pieds</span>
            </Link>
            <Link
              href="/convertisseur/pouce-pied"
              className="p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors"
            >
              <span className="font-display text-black">Pouce en Pieds</span>
            </Link>
            <Link
              href="/convertisseur/centimetre-pied"
              className="p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors"
            >
              <span className="font-display text-black">Centimètre en Pieds</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
