'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, X, MessageCircle } from 'lucide-react';
import { Radio, SpeakerHigh } from '@phosphor-icons/react';
import { useKracRadio, KracRadioModal, KRACRADIO_CHANNELS } from './KracRadio';
import type { Locale } from '@/i18n/config';

interface Props {
  locale?: Locale;
  onOpenChatbot?: () => void;
}

export default function MobileRadioBar({ locale = 'fr', onOpenChatbot }: Props) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {
    musicEnabled,
    selectedChannel,
    nowPlaying,
    showChannelSelector,
    setShowChannelSelector,
    isPlaying,
    toggleMusic,
    togglePlayPause,
    changeChannel,
  } = useKracRadio('francophonie');

  useEffect(() => {
    setIsMounted(true);
    // Check if user previously dismissed the bar
    const dismissed = localStorage.getItem('mobileRadioDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('mobileRadioDismissed', 'true');
  };

  const currentChannel = KRACRADIO_CHANNELS.find(c => c.key === selectedChannel);

  // Only show on mobile, when mounted, and not dismissed
  if (!isMounted || isDismissed) return null;

  return (
    <>
      {/* Mobile Radio Bar - Only visible on small screens */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div
          className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 border-t border-neutral-700/50 px-3 py-2 safe-area-pb"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center gap-3">
            {/* Radio icon / Open selector */}
            <button
              onClick={() => setShowChannelSelector(true)}
              className="flex items-center gap-2 min-w-0 flex-1"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  musicEnabled
                    ? 'bg-pink-500/20 text-pink-400'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
                style={musicEnabled && currentChannel ? {
                  backgroundColor: `${currentChannel.color}20`,
                  color: currentChannel.color
                } : undefined}
              >
                {musicEnabled ? (
                  <SpeakerHigh weight="fill" className="w-4 h-4" />
                ) : (
                  <Radio weight="regular" className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                {musicEnabled && nowPlaying ? (
                  <>
                    <p className="text-white text-xs font-medium truncate">
                      {nowPlaying.title}
                    </p>
                    <p className="text-neutral-500 text-[10px] truncate">
                      {nowPlaying.artist} • {currentChannel?.name}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-neutral-300 text-xs font-medium">
                      KracRadio
                    </p>
                    <p className="text-neutral-500 text-[10px]">
                      {locale === 'en' ? 'Tap to listen' : 'Appuyez pour écouter'}
                    </p>
                  </>
                )}
              </div>
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={musicEnabled ? togglePlayPause : toggleMusic}
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                musicEnabled
                  ? 'bg-pink-500 text-white'
                  : 'bg-neutral-700 text-white hover:bg-neutral-600'
              }`}
              style={musicEnabled && currentChannel ? {
                backgroundColor: currentChannel.color
              } : undefined}
            >
              {musicEnabled && isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Chatbot Button */}
            {onOpenChatbot && (
              <button
                onClick={onOpenChatbot}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#F77313] text-white hover:bg-[#e56610] transition-all shadow-lg"
                title={locale === 'en' ? 'Need help?' : "Besoin d'aide?"}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            )}

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 flex-shrink-0 transition-all"
              title={locale === 'en' ? 'Hide radio bar' : 'Masquer la barre radio'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KracRadio Modal */}
      <KracRadioModal
        isOpen={showChannelSelector}
        onClose={() => setShowChannelSelector(false)}
        selectedChannel={selectedChannel}
        onChannelChange={changeChannel}
        musicEnabled={musicEnabled}
        isPlaying={isPlaying}
        onToggleMusic={toggleMusic}
        onTogglePlayPause={togglePlayPause}
        locale={locale}
      />
    </>
  );
}
