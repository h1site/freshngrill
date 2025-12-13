'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MusicNote,
  SpeakerHigh,
  SpeakerSlash,
  Radio,
  X,
  Waveform
} from '@phosphor-icons/react';
import './KracRadio.css';

// KracRadio channels configuration
export const KRACRADIO_CHANNELS = [
  {
    key: 'kracradio',
    name: 'KracRadio',
    description: 'Mix eclectique',
    streamUrl: 'https://stream.kracradio.com/listen/kracradio/radio.mp3',
    apiUrl: 'https://stream.kracradio.com/api/nowplaying/1',
    color: '#f472b6'
  },
  {
    key: 'ebm_industrial',
    name: 'EBM / Industrial',
    description: 'Dark electro & industrial',
    streamUrl: 'https://stream.kracradio.com/listen/ebm_industrial/radio.mp3',
    apiUrl: 'https://stream.kracradio.com/api/nowplaying/4',
    color: '#ef4444'
  },
  {
    key: 'electro',
    name: 'Electro',
    description: 'Electronic music',
    streamUrl: 'https://stream.kracradio.com/listen/electro/radio.mp3',
    apiUrl: 'https://stream.kracradio.com/api/nowplaying/7',
    color: '#22d3ee'
  },
  {
    key: 'francophonie',
    name: 'Francophonie',
    description: 'Musique francophone',
    streamUrl: 'https://stream.kracradio.com/listen/franco/radio.mp3',
    apiUrl: 'https://stream.kracradio.com/api/nowplaying/6',
    color: '#3b82f6'
  },
  {
    key: 'jazz',
    name: 'Jazz',
    description: 'Jazz & smooth',
    streamUrl: 'https://stream.kracradio.com/listen/jazz/radio.mp3',
    apiUrl: 'https://stream.kracradio.com/api/nowplaying/2',
    color: '#fbbf24'
  },
  {
    key: 'metal',
    name: 'Metal',
    description: 'Heavy metal & rock',
    streamUrl: 'https://stream.kracradio.com/listen/metal/radio.mp3',
    apiUrl: 'https://stream.kracradio.com/api/nowplaying/5',
    color: '#64748b'
  },
  {
    key: 'rock',
    name: 'Rock',
    description: 'Classic & modern rock',
    streamUrl: 'https://stream.kracradio.com/listen/rock/radio.mp3',
    apiUrl: 'https://stream.kracradio.com/api/nowplaying/8',
    color: '#a855f7'
  }
];

interface NowPlayingData {
  title: string;
  artist: string;
  album: string;
  art: string | null;
  channelName: string;
  channelColor: string;
}

interface Channel {
  key: string;
  name: string;
  description: string;
  streamUrl: string;
  apiUrl: string;
  color: string;
}

// Audio Manager class for music streaming
class KracRadioManager {
  audioElement: HTMLAudioElement | null = null;
  currentChannel: Channel | null = null;
  nowPlayingCallback: ((data: NowPlayingData, isNewSong: boolean) => void) | null = null;
  nowPlayingInterval: NodeJS.Timeout | null = null;
  lastSongId: string | null = null;
  musicPlaying: boolean = false;
  volume: number = 0.25;

  init() {
    if (this.audioElement) return;
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.volume = this.volume;
  }

  setNowPlayingCallback(callback: ((data: NowPlayingData, isNewSong: boolean) => void) | null) {
    this.nowPlayingCallback = callback;
  }

  async fetchNowPlaying(): Promise<NowPlayingData | null> {
    if (!this.currentChannel?.apiUrl) return null;

    try {
      const response = await fetch(this.currentChannel.apiUrl);
      const data = await response.json();

      if (data?.now_playing?.song) {
        const song = data.now_playing.song;
        const nowPlaying: NowPlayingData = {
          title: song.title || 'Unknown',
          artist: song.artist || 'Unknown Artist',
          album: song.album || '',
          art: song.art || null,
          channelName: this.currentChannel.name,
          channelColor: this.currentChannel.color
        };

        const songId = `${song.artist}-${song.title}`;
        if (songId !== this.lastSongId) {
          this.lastSongId = songId;
          if (this.nowPlayingCallback) {
            this.nowPlayingCallback(nowPlaying, true);
          }
        }

        return nowPlaying;
      }
    } catch (e) {
      console.warn('Could not fetch now playing:', e);
    }
    return null;
  }

  startNowPlayingPolling() {
    if (this.nowPlayingInterval) return;
    this.fetchNowPlaying();
    this.nowPlayingInterval = setInterval(() => {
      if (this.musicPlaying) {
        this.fetchNowPlaying();
      }
    }, 15000);
  }

  stopNowPlayingPolling() {
    if (this.nowPlayingInterval) {
      clearInterval(this.nowPlayingInterval);
      this.nowPlayingInterval = null;
    }
  }

  startMusic(channelKey = 'francophonie') {
    if (!this.audioElement) this.init();

    const channel = KRACRADIO_CHANNELS.find(c => c.key === channelKey) || KRACRADIO_CHANNELS[3];
    this.currentChannel = channel;
    this.lastSongId = null;

    try {
      if (this.musicPlaying) {
        this.audioElement!.pause();
      }

      this.audioElement!.src = channel.streamUrl;
      this.audioElement!.volume = this.volume;
      this.audioElement!.play()
        .then(() => {
          this.musicPlaying = true;
          this.startNowPlayingPolling();
        })
        .catch(err => {
          console.warn('Could not start music stream:', err);
          this.musicPlaying = false;
        });
    } catch (e) {
      console.warn('Error starting music:', e);
    }
  }

  changeChannel(channelKey: string) {
    if (this.musicPlaying) {
      this.stopNowPlayingPolling();
      this.startMusic(channelKey);
    } else {
      const channel = KRACRADIO_CHANNELS.find(c => c.key === channelKey) || KRACRADIO_CHANNELS[3];
      this.currentChannel = channel;
    }
  }

  stopMusic() {
    this.musicPlaying = false;
    this.stopNowPlayingPolling();
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }
  }

  toggleMusic(channelKey?: string): boolean {
    if (this.musicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic(channelKey || this.currentChannel?.key || 'francophonie');
      return true;
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  isPlaying(): boolean {
    return this.musicPlaying;
  }

  getCurrentChannel(): Channel | null {
    return this.currentChannel;
  }

  destroy() {
    this.stopMusic();
    this.audioElement = null;
  }
}

// Singleton instance
let radioManagerInstance: KracRadioManager | null = null;
export const getRadioManager = (): KracRadioManager => {
  if (!radioManagerInstance) {
    radioManagerInstance = new KracRadioManager();
  }
  return radioManagerInstance;
};

// Channel selector component for menu (grid layout)
interface KracRadioSelectorProps {
  selectedChannel: string;
  onChannelChange: (key: string) => void;
  compact?: boolean;
}

export function KracRadioSelector({ selectedChannel, onChannelChange, compact = false }: KracRadioSelectorProps) {
  return (
    <div className="kracradio-section">
      <div className="kracradio-header">
        <h3><Radio weight="bold" /> Station Radio</h3>
        <a
          href="https://kracradio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="kracradio-credit"
        >
          Musique gracieuseté de kracradio.com
        </a>
      </div>
      <div className={`kracradio-grid ${compact ? 'kracradio-grid-compact' : ''}`}>
        {KRACRADIO_CHANNELS.map((channel) => (
          <button
            key={channel.key}
            className={`kracradio-card ${selectedChannel === channel.key ? 'active' : ''}`}
            onClick={() => onChannelChange(channel.key)}
            style={{ '--channel-color': channel.color } as React.CSSProperties}
          >
            <span
              className="kracradio-dot"
              style={{ background: channel.color }}
            />
            <span className="kracradio-card-name">{channel.name}</span>
            {!compact && <span className="kracradio-card-desc">{channel.description}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// In-game channel dropdown
interface KracRadioDropdownProps {
  selectedChannel: string;
  onChannelChange: (key: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function KracRadioDropdown({ selectedChannel, onChannelChange, isOpen, onToggle }: KracRadioDropdownProps) {
  return (
    <div className="kracradio-dropdown-container">
      <button
        className="kracradio-mini-btn"
        onClick={onToggle}
        title="Changer de station"
      >
        <Radio weight="bold" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="kracradio-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            {KRACRADIO_CHANNELS.map((channel) => (
              <button
                key={channel.key}
                className={`kracradio-option ${selectedChannel === channel.key ? 'active' : ''}`}
                onClick={() => onChannelChange(channel.key)}
              >
                <span
                  className="kracradio-dot"
                  style={{ background: channel.color }}
                />
                <span className="kracradio-option-name">{channel.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Now Playing popup
interface KracRadioNowPlayingProps {
  nowPlaying: NowPlayingData | null;
  show: boolean;
  onClose: () => void;
}

export function KracRadioNowPlaying({ nowPlaying, show, onClose }: KracRadioNowPlayingProps) {
  if (!nowPlaying) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="kracradio-now-playing"
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            className="kracradio-now-playing-close"
            onClick={onClose}
          >
            <X weight="bold" />
          </button>
          <div className="kracradio-now-playing-content">
            {nowPlaying.art ? (
              <img
                src={nowPlaying.art}
                alt={nowPlaying.album || nowPlaying.title}
                className="kracradio-now-playing-art"
              />
            ) : (
              <div className="kracradio-now-playing-art kracradio-now-playing-art-placeholder">
                <Waveform weight="fill" />
              </div>
            )}
            <div className="kracradio-now-playing-info">
              <span className="kracradio-now-playing-channel" style={{ color: nowPlaying.channelColor }}>
                <Radio weight="fill" /> {nowPlaying.channelName}
              </span>
              <span className="kracradio-now-playing-title">{nowPlaying.title}</span>
              <span className="kracradio-now-playing-artist">{nowPlaying.artist}</span>
              {nowPlaying.album && (
                <span className="kracradio-now-playing-album">{nowPlaying.album}</span>
              )}
            </div>
          </div>
          <div className="kracradio-equalizer">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="kracradio-equalizer-bar" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Audio controls (music toggle)
interface KracRadioToggleProps {
  musicEnabled: boolean;
  onToggle: () => void;
  showLabel?: boolean;
}

export function KracRadioToggle({ musicEnabled, onToggle, showLabel = true }: KracRadioToggleProps) {
  return (
    <button
      className={`kracradio-toggle ${musicEnabled ? 'active' : ''}`}
      onClick={onToggle}
      title={musicEnabled ? 'Couper la musique' : 'Activer la musique'}
    >
      {musicEnabled ? <SpeakerHigh weight="fill" /> : <SpeakerSlash weight="regular" />}
      {showLabel && <span>Musique</span>}
    </button>
  );
}

// Radio Modal Popup
interface KracRadioModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChannel: string;
  onChannelChange: (key: string) => void;
  musicEnabled: boolean;
  isPlaying?: boolean;
  onToggleMusic: () => void;
  onTogglePlayPause?: () => void;
  locale?: 'fr' | 'en';
}

export function KracRadioModal({
  isOpen,
  onClose,
  selectedChannel,
  onChannelChange,
  musicEnabled,
  isPlaying = false,
  onToggleMusic,
  onTogglePlayPause,
  locale = 'fr'
}: KracRadioModalProps) {
  const isEN = locale === 'en';

  const handleChannelClick = (channelKey: string) => {
    onChannelChange(channelKey);
    if (!musicEnabled) {
      onToggleMusic();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-[95vw] max-w-md bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
            {/* Header */}
            <div className="relative p-6 pb-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X weight="bold" className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Radio weight="fill" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">KracRadio</h2>
                  <p className="text-xs text-white/60 uppercase tracking-wider">
                    {isEN ? 'World Music' : 'Musique du Monde'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {isEN
                  ? 'Cook and discover music from artists around the world'
                  : 'Cuisinez et découvrez de la musique d\'artistes partout dans le monde'}
              </p>
            </div>

            {/* Status indicator */}
            {musicEnabled && (
              <div className="px-6 py-3 bg-pink-500/10 border-y border-pink-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isPlaying ? (
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <span
                          key={i}
                          className="w-1 bg-pink-500 rounded-full animate-pulse"
                          style={{
                            height: `${8 + Math.random() * 8}px`,
                            animationDelay: `${i * 0.15}s`
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-pink-500/50" />
                  )}
                  <span className="text-sm text-pink-400 font-medium">
                    {isPlaying
                      ? (isEN ? 'Now playing' : 'En lecture')
                      : (isEN ? 'Paused' : 'En pause')
                    }: {KRACRADIO_CHANNELS.find(c => c.key === selectedChannel)?.name}
                  </span>
                </div>
                {onTogglePlayPause && (
                  <button
                    onClick={onTogglePlayPause}
                    className="p-2 text-pink-400 hover:text-pink-300 hover:bg-pink-500/20 rounded-full transition-all"
                    title={isPlaying ? (isEN ? 'Pause' : 'Pause') : (isEN ? 'Play' : 'Lecture')}
                  >
                    {isPlaying ? (
                      <SpeakerSlash weight="bold" className="w-4 h-4" />
                    ) : (
                      <SpeakerHigh weight="fill" className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Channels Grid */}
            <div className="p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
                {isEN ? 'Choose a station' : 'Choisir une station'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {KRACRADIO_CHANNELS.map((channel) => (
                  <button
                    key={channel.key}
                    onClick={() => handleChannelClick(channel.key)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      selectedChannel === channel.key
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {selectedChannel === channel.key && musicEnabled && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                    )}
                    <span
                      className="w-4 h-4 rounded-full shadow-lg"
                      style={{ background: channel.color, boxShadow: `0 0 12px ${channel.color}` }}
                    />
                    <span className="text-sm font-semibold text-white">{channel.name}</span>
                    <span className="text-xs text-white/50">{channel.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-black/30 border-t border-white/5 flex items-center justify-between">
              <a
                href="https://kracradio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-pink-400 transition-colors"
              >
                {isEN ? 'Powered by kracradio.com' : 'Propulsé par kracradio.com'}
              </a>
              {musicEnabled && (
                <button
                  onClick={onToggleMusic}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
                >
                  <SpeakerSlash weight="bold" className="w-4 h-4" />
                  {isEN ? 'Stop' : 'Arrêter'}
                </button>
              )}
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Custom hook for using KracRadio in games
export function useKracRadio(defaultChannel = 'francophonie') {
  const radioRef = useRef<KracRadioManager | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(defaultChannel);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasInitialized = useRef(false);

  // Restore state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasInitialized.current) {
      hasInitialized.current = true;
      const savedChannel = localStorage.getItem('kracradio-channel');
      const wasPlaying = localStorage.getItem('kracradio-playing') === 'true';

      if (savedChannel) {
        setSelectedChannel(savedChannel);
      }

      // Auto-resume if was playing before navigation
      if (wasPlaying) {
        setMusicEnabled(true);
        setIsPlaying(true);
        // Small delay to let the component mount properly
        setTimeout(() => {
          if (radioRef.current) {
            radioRef.current.startMusic(savedChannel || defaultChannel);
          }
        }, 100);
      }
    }
  }, [defaultChannel]);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && hasInitialized.current) {
      localStorage.setItem('kracradio-channel', selectedChannel);
      localStorage.setItem('kracradio-playing', String(musicEnabled && isPlaying));
    }
  }, [selectedChannel, musicEnabled, isPlaying]);

  const handleNowPlayingUpdate = useCallback((data: NowPlayingData, isNewSong: boolean) => {
    setNowPlaying(data);
    if (isNewSong && musicEnabled) {
      setShowNowPlaying(true);
      setTimeout(() => setShowNowPlaying(false), 5000);
    }
  }, [musicEnabled]);

  useEffect(() => {
    radioRef.current = getRadioManager();
    radioRef.current.init();
    radioRef.current.setNowPlayingCallback(handleNowPlayingUpdate);

    return () => {
      if (radioRef.current) {
        radioRef.current.setNowPlayingCallback(null);
      }
    };
  }, [handleNowPlayingUpdate]);

  const startMusic = useCallback(() => {
    if (radioRef.current) {
      radioRef.current.startMusic(selectedChannel);
      setMusicEnabled(true);
      setIsPlaying(true);
    }
  }, [selectedChannel]);

  const stopMusic = useCallback(() => {
    if (radioRef.current) {
      radioRef.current.stopMusic();
      setMusicEnabled(false);
      setIsPlaying(false);
    }
  }, []);

  const pauseMusic = useCallback(() => {
    if (radioRef.current) {
      radioRef.current.stopMusic();
      setIsPlaying(false);
      // Keep musicEnabled true so UI shows it's paused, not stopped
    }
  }, []);

  const resumeMusic = useCallback(() => {
    if (radioRef.current && musicEnabled) {
      radioRef.current.startMusic(selectedChannel);
      setIsPlaying(true);
    }
  }, [musicEnabled, selectedChannel]);

  const toggleMusic = useCallback(() => {
    if (radioRef.current) {
      if (isPlaying) {
        radioRef.current.stopMusic();
        setIsPlaying(false);
        setMusicEnabled(false);
      } else {
        radioRef.current.startMusic(selectedChannel);
        setIsPlaying(true);
        setMusicEnabled(true);
      }
      return !isPlaying;
    }
    return false;
  }, [selectedChannel, isPlaying]);

  const togglePlayPause = useCallback(() => {
    if (radioRef.current) {
      if (isPlaying) {
        radioRef.current.stopMusic();
        setIsPlaying(false);
      } else {
        radioRef.current.startMusic(selectedChannel);
        setIsPlaying(true);
        setMusicEnabled(true);
      }
      return !isPlaying;
    }
    return false;
  }, [selectedChannel, isPlaying]);

  const changeChannel = useCallback((channelKey: string) => {
    setSelectedChannel(channelKey);
    if (radioRef.current) {
      radioRef.current.changeChannel(channelKey);
      if (musicEnabled) {
        setIsPlaying(true);
      }
    }
    setShowChannelSelector(false);
  }, [musicEnabled]);

  return {
    musicEnabled,
    setMusicEnabled,
    selectedChannel,
    setSelectedChannel,
    showChannelSelector,
    setShowChannelSelector,
    nowPlaying,
    showNowPlaying,
    setShowNowPlaying,
    isPlaying,
    startMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    toggleMusic,
    togglePlayPause,
    changeChannel,
    radioManager: radioRef.current
  };
}

export default {
  KRACRADIO_CHANNELS,
  getRadioManager,
  KracRadioSelector,
  KracRadioDropdown,
  KracRadioNowPlaying,
  KracRadioToggle,
  KracRadioModal,
  useKracRadio
};
