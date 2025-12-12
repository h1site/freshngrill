# KracRadio Integration Guide

Instructions exactes pour intégrer le player audio KracRadio dans un projet Next.js.

## Prérequis

```bash
npm install framer-motion @phosphor-icons/react
```

## Structure des fichiers

```
components/
  KracRadio/
    KracRadio.jsx
    KracRadio.css
    index.js
```

---

## FICHIER 1: `components/KracRadio/KracRadio.jsx`

```jsx
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

// Audio Manager class for music streaming
class KracRadioManager {
  constructor() {
    this.audioElement = null;
    this.currentChannel = null;
    this.nowPlayingCallback = null;
    this.nowPlayingInterval = null;
    this.lastSongId = null;
    this.musicPlaying = false;
    this.volume = 0.25;
  }

  init() {
    if (this.audioElement) return;
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.volume = this.volume;
  }

  setNowPlayingCallback(callback) {
    this.nowPlayingCallback = callback;
  }

  async fetchNowPlaying() {
    if (!this.currentChannel?.apiUrl) return null;

    try {
      const response = await fetch(this.currentChannel.apiUrl);
      const data = await response.json();

      if (data?.now_playing?.song) {
        const song = data.now_playing.song;
        const nowPlaying = {
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

  startMusic(channelKey = 'ebm_industrial') {
    if (!this.audioElement) this.init();

    const channel = KRACRADIO_CHANNELS.find(c => c.key === channelKey) || KRACRADIO_CHANNELS[1];
    this.currentChannel = channel;
    this.lastSongId = null;

    try {
      if (this.musicPlaying) {
        this.audioElement.pause();
      }

      this.audioElement.src = channel.streamUrl;
      this.audioElement.volume = this.volume;
      this.audioElement.play()
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

  changeChannel(channelKey) {
    if (this.musicPlaying) {
      this.stopNowPlayingPolling();
      this.startMusic(channelKey);
    } else {
      const channel = KRACRADIO_CHANNELS.find(c => c.key === channelKey) || KRACRADIO_CHANNELS[1];
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

  toggleMusic(channelKey) {
    if (this.musicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic(channelKey || this.currentChannel?.key || 'ebm_industrial');
      return true;
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  isPlaying() {
    return this.musicPlaying;
  }

  getCurrentChannel() {
    return this.currentChannel;
  }

  destroy() {
    this.stopMusic();
    this.audioElement = null;
  }
}

// Singleton instance
let radioManagerInstance = null;
export const getRadioManager = () => {
  if (!radioManagerInstance) {
    radioManagerInstance = new KracRadioManager();
  }
  return radioManagerInstance;
};

// Channel selector component for menu (grid layout)
export function KracRadioSelector({ selectedChannel, onChannelChange, compact = false }) {
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
            style={{ '--channel-color': channel.color }}
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
export function KracRadioDropdown({ selectedChannel, onChannelChange, isOpen, onToggle }) {
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
export function KracRadioNowPlaying({ nowPlaying, show, onClose }) {
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
export function KracRadioToggle({ musicEnabled, onToggle, showLabel = true }) {
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
export function useKracRadio(defaultChannel = 'ebm_industrial') {
  const radioRef = useRef(null);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(defaultChannel);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  const handleNowPlayingUpdate = useCallback((data, isNewSong) => {
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

  const changeChannel = useCallback((channelKey) => {
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
```

---

## FICHIER 2: `components/KracRadio/KracRadio.css`

```css
/* KracRadio Component Styles */

/* Section Container */
.kracradio-section {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.kracradio-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.kracradio-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.kracradio-header h3 svg {
  color: #f472b6;
}

.kracradio-credit {
  font-size: 0.7rem;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.kracradio-credit:hover {
  color: #f472b6;
  text-decoration: underline;
}

/* Channel Grid */
.kracradio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.kracradio-grid-compact {
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
}

.kracradio-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.kracradio-card:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.kracradio-card.active {
  border-color: var(--channel-color, #f472b6);
  background: rgba(244, 114, 182, 0.15);
}

.kracradio-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8px currentColor;
}

.kracradio-card .kracradio-dot {
  width: 16px;
  height: 16px;
}

.kracradio-card-name {
  font-weight: 700;
  font-size: 0.8rem;
  color: white;
  line-height: 1.2;
}

.kracradio-card-desc {
  font-size: 0.65rem;
  opacity: 0.7;
  line-height: 1.2;
}

.kracradio-grid-compact .kracradio-card {
  padding: 0.5rem 0.25rem;
}

.kracradio-grid-compact .kracradio-card-name {
  font-size: 0.7rem;
}

/* Dropdown Container (in-game) */
.kracradio-dropdown-container {
  position: relative;
}

.kracradio-mini-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.kracradio-mini-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.kracradio-mini-btn svg {
  font-size: 1.1rem;
}

.kracradio-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  background: rgba(15, 20, 41, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 1002;
  max-height: 300px;
  overflow-y: auto;
}

.kracradio-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.kracradio-option:last-child {
  border-bottom: none;
}

.kracradio-option:hover {
  background: rgba(99, 102, 241, 0.2);
  color: white;
}

.kracradio-option.active {
  background: rgba(244, 114, 182, 0.2);
  color: #f472b6;
}

.kracradio-option-name {
  font-weight: 600;
  font-size: 0.9rem;
}

/* Toggle Button */
.kracradio-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #64748b;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.kracradio-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

.kracradio-toggle.active {
  background: rgba(244, 114, 182, 0.2);
  border-color: rgba(244, 114, 182, 0.4);
  color: #f472b6;
}

.kracradio-toggle svg {
  font-size: 1.1rem;
}

.kracradio-toggle span {
  font-weight: 500;
}

/* Now Playing Popup */
.kracradio-now-playing {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, rgba(15, 20, 41, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%);
  border: 1px solid rgba(244, 114, 182, 0.3);
  border-radius: 16px;
  padding: 1rem;
  max-width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(244, 114, 182, 0.2);
  z-index: 1100;
  backdrop-filter: blur(10px);
}

.kracradio-now-playing-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.kracradio-now-playing-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.kracradio-now-playing-content {
  display: flex;
  gap: 0.75rem;
}

.kracradio-now-playing-art {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
}

.kracradio-now-playing-art-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
}

.kracradio-now-playing-art-placeholder svg {
  font-size: 1.5rem;
}

.kracradio-now-playing-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
}

.kracradio-now-playing-channel {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kracradio-now-playing-channel svg {
  font-size: 0.8rem;
}

.kracradio-now-playing-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kracradio-now-playing-artist {
  font-size: 0.8rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kracradio-now-playing-album {
  font-size: 0.7rem;
  color: #64748b;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Equalizer Animation */
.kracradio-equalizer {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 3px;
  height: 16px;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.kracradio-equalizer-bar {
  width: 4px;
  background: linear-gradient(to top, #f472b6, #a855f7);
  border-radius: 2px;
  animation: kracradio-equalizer 0.8s ease-in-out infinite;
}

.kracradio-equalizer-bar:nth-child(1) { height: 8px; }
.kracradio-equalizer-bar:nth-child(2) { height: 12px; }
.kracradio-equalizer-bar:nth-child(3) { height: 16px; }
.kracradio-equalizer-bar:nth-child(4) { height: 10px; }
.kracradio-equalizer-bar:nth-child(5) { height: 6px; }

@keyframes kracradio-equalizer {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.4); }
}

/* Responsive */
@media (max-width: 400px) {
  .kracradio-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .kracradio-grid-compact {
    grid-template-columns: repeat(2, 1fr);
  }

  .kracradio-card {
    padding: 0.6rem 0.4rem;
  }

  .kracradio-card-name {
    font-size: 0.75rem;
  }

  .kracradio-now-playing {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
```

---

## FICHIER 3: `components/KracRadio/index.js`

```js
export {
  KRACRADIO_CHANNELS,
  getRadioManager,
  KracRadioSelector,
  KracRadioDropdown,
  KracRadioNowPlaying,
  KracRadioToggle,
  useKracRadio
} from './KracRadio';
```

---

## UTILISATION DANS UN COMPOSANT/PAGE

### Import

```jsx
import {
  KracRadioDropdown,
  KracRadioNowPlaying,
  useKracRadio
} from '@/components/KracRadio';
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
```

### Hook dans le composant

```jsx
export default function MyGamePage() {
  // KracRadio - channel par défaut: 'francophonie', 'electro', 'jazz', 'metal', 'rock', 'ebm_industrial', 'kracradio'
  const {
    musicEnabled,
    selectedChannel,
    showChannelSelector,
    setShowChannelSelector,
    nowPlaying,
    showNowPlaying,
    setShowNowPlaying,
    toggleMusic,
    changeChannel
  } = useKracRadio('francophonie');

  return (
    <div>
      {/* Now Playing Popup - affiche la chanson en cours */}
      <KracRadioNowPlaying
        nowPlaying={nowPlaying}
        show={showNowPlaying}
        onClose={() => setShowNowPlaying(false)}
      />

      {/* Barre avec contrôles audio */}
      <div className="audio-controls">
        {/* Bouton toggle musique */}
        <button
          className={`audio-toggle ${!musicEnabled ? 'muted' : ''}`}
          onClick={toggleMusic}
          title={musicEnabled ? 'Couper la musique' : 'Activer la musique'}
        >
          {musicEnabled ? <SpeakerHigh weight="fill" /> : <SpeakerSlash weight="regular" />}
        </button>

        {/* Dropdown sélection de station */}
        <KracRadioDropdown
          selectedChannel={selectedChannel}
          onChannelChange={changeChannel}
          isOpen={showChannelSelector}
          onToggle={() => setShowChannelSelector(!showChannelSelector)}
        />
      </div>
    </div>
  );
}
```

---

## CSS POUR LE BOUTON TOGGLE (à ajouter dans ton CSS)

```css
.audio-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.audio-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #f472b6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.audio-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.audio-toggle.muted {
  color: #64748b;
}

.audio-toggle svg {
  font-size: 1.1rem;
}
```

---

## CHANNELS DISPONIBLES

| Key | Nom | Description |
|-----|-----|-------------|
| `kracradio` | KracRadio | Mix eclectique |
| `ebm_industrial` | EBM / Industrial | Dark electro & industrial |
| `electro` | Electro | Electronic music |
| `francophonie` | Francophonie | Musique francophone |
| `jazz` | Jazz | Jazz & smooth |
| `metal` | Metal | Heavy metal & rock |
| `rock` | Rock | Classic & modern rock |

---

## FONCTIONNALITÉS

1. **Streaming audio** via les flux MP3 de kracradio.com
2. **Now Playing** - Affiche automatiquement la chanson en cours (titre, artiste, album, pochette)
3. **Changement de station** via dropdown
4. **Toggle musique** on/off
5. **Singleton audio manager** - Une seule instance audio partagée entre tous les composants
6. **Polling automatique** - Mise à jour du "Now Playing" toutes les 15 secondes

---

## NOTES IMPORTANTES

- Le composant utilise `'use client'` car il utilise des hooks React et l'API Audio du navigateur
- L'audio ne démarre qu'après une interaction utilisateur (clic sur toggle) pour respecter les politiques des navigateurs
- Le volume par défaut est à 25% (`this.volume = 0.25`)
- Le popup "Now Playing" disparaît automatiquement après 5 secondes
