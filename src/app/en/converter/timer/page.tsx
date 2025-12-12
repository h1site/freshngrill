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
  { food: 'Al dente pasta', method: 'Boiling water', time: '8-10 min' },
  { food: 'White rice', method: 'Boiling water', time: '12-15 min' },
  { food: 'Basmati rice', method: 'Boiling water', time: '10-12 min' },
  { food: 'Soft-boiled egg', method: 'Boiling water', time: '3-4 min' },
  { food: 'Medium-boiled egg', method: 'Boiling water', time: '5-6 min' },
  { food: 'Hard-boiled egg', method: 'Boiling water', time: '9-10 min' },
  { food: 'Potatoes', method: 'Boiling water', time: '20-25 min' },
  { food: 'Broccoli', method: 'Steamed', time: '5-7 min' },
  { food: 'Carrots', method: 'Steamed', time: '8-10 min' },
  { food: 'Green beans', method: 'Boiling water', time: '5-7 min' },
  { food: 'Chicken (breast)', method: 'Oven 400°F', time: '25-30 min' },
  { food: 'Salmon (fillet)', method: 'Oven 400°F', time: '12-15 min' },
  { food: 'Rare steak', method: 'Pan', time: '2-3 min/side' },
  { food: 'Medium steak', method: 'Pan', time: '3-4 min/side' },
  { food: 'Bacon', method: 'Pan', time: '4-5 min' },
];

export default function TimerPageEN() {
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
            <Link href="/en" className="text-neutral-500 hover:text-black">
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href="/en/converter" className="text-neutral-500 hover:text-black">
              Converter
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-medium">Timer</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/en/converter"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            All tools
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-orange-500 text-white flex items-center justify-center">
              <Timer className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white">
                Online Timer
              </h1>
              <p className="text-neutral-400 mt-1">Free and no registration required</p>
            </div>
          </div>
          <p className="text-neutral-400 text-lg max-w-3xl">
            In the kitchen, timing is often the key to success. One minute too long, and your
            cookies become dry. Use our timer for perfect cooking.
          </p>
        </div>
      </section>

      {/* Ad after hero */}
      <div className="container mx-auto px-4 py-8">
        <GoogleAd slot="7610644087" />
      </div>

      {/* Timer */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className={`border-4 ${isFinished ? 'border-red-500 bg-red-50' : 'border-neutral-200 bg-neutral-50'} p-8 transition-colors`}>
            {/* Time display */}
            <div className="text-center mb-8">
              <div className={`font-mono text-6xl md:text-8xl font-bold ${isFinished ? 'text-red-500 animate-pulse' : 'text-black'}`}>
                {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
              </div>
              {isFinished && (
                <div className="mt-4 flex items-center justify-center gap-2 text-red-500 text-xl font-semibold">
                  <Volume2 className="w-6 h-6 animate-bounce" />
                  Time&apos;s up!
                </div>
              )}
            </div>

            {/* Manual inputs */}
            {!isRunning && (
              <div className="flex justify-center gap-4 mb-8">
                <div className="text-center">
                  <label className="block text-xs text-neutral-500 mb-1">Hours</label>
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
                  <label className="block text-xs text-neutral-500 mb-1">Seconds</label>
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

            {/* Control buttons */}
            <div className="flex justify-center gap-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  disabled={totalSeconds === 0}
                  className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  Start
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
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preset times */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl text-black mb-6 text-center">
            Preset Times
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

      {/* Cooking times table */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-black mb-8 text-center">
            Common Cooking Times
          </h2>

          <div className="bg-white border border-neutral-200 overflow-hidden">
            <div className="bg-[#F77313] text-white px-6 py-4">
              <h3 className="font-display text-lg">Cooking Guide</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Food</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Method</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
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

      {/* Benefits */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl text-black mb-6">
              Benefits of Our Timer
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-200 p-4">
                <h3 className="font-semibold text-black mb-2">Quick Start</h3>
                <p className="text-neutral-600 text-sm">Enter the time and click start</p>
              </div>
              <div className="bg-white border border-neutral-200 p-4">
                <h3 className="font-semibold text-black mb-2">Sound Alert</h3>
                <p className="text-neutral-600 text-sm">Automatic notification at the end of the countdown</p>
              </div>
              <div className="bg-white border border-neutral-200 p-4">
                <h3 className="font-semibold text-black mb-2">Clear Interface</h3>
                <p className="text-neutral-600 text-sm">Minimalist and easy-to-use design</p>
              </div>
              <div className="bg-white border border-neutral-200 p-4">
                <h3 className="font-semibold text-black mb-2">Multi-Device</h3>
                <p className="text-neutral-600 text-sm">Compatible with mobile, tablet, and computer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl text-black mb-6">
            Perfect For
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm">
              Baking enthusiasts
            </span>
            <span className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm">
              Everyday cooks
            </span>
            <span className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm">
              Parents preparing meals
            </span>
            <span className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm">
              Meal prep lovers
            </span>
          </div>
        </div>
      </section>

      {/* Other tools */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl text-black mb-6">
            Other Tools
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href="/en/converter/celsius-fahrenheit"
              className="p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors"
            >
              <span className="font-display text-black">Celsius - Fahrenheit</span>
            </Link>
            <Link
              href="/en/converter/meter-feet"
              className="p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors"
            >
              <span className="font-display text-black">Meters to Feet</span>
            </Link>
            <Link
              href="/en/converter/inch-feet"
              className="p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors"
            >
              <span className="font-display text-black">Inches to Feet</span>
            </Link>
            <Link
              href="/en/converter/centimeter-feet"
              className="p-4 bg-white border border-neutral-200 hover:border-[#F77313] transition-colors"
            >
              <span className="font-display text-black">Centimeters to Feet</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
