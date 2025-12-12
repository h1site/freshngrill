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

// Custom hook for using KracRadio in games
export function useKracRadio(defaultChannel = 'francophonie') {
  const radioRef = useRef<KracRadioManager | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(defaultChannel);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

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
    if (radioRef.current && musicEnabled) {
      radioRef.current.startMusic(selectedChannel);
    }
  }, [musicEnabled, selectedChannel]);

  const stopMusic = useCallback(() => {
    if (radioRef.current) {
      radioRef.current.stopMusic();
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (radioRef.current) {
      const isPlaying = radioRef.current.toggleMusic(selectedChannel);
      setMusicEnabled(isPlaying);
      return isPlaying;
    }
    return false;
  }, [selectedChannel]);

  const changeChannel = useCallback((channelKey: string) => {
    setSelectedChannel(channelKey);
    if (radioRef.current) {
      radioRef.current.changeChannel(channelKey);
    }
    setShowChannelSelector(false);
  }, []);

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
    startMusic,
    stopMusic,
    toggleMusic,
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
  useKracRadio
};
