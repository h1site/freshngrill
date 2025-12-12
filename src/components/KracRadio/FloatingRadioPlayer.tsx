'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Play,
  Pause,
  X,
  CaretUp,
  CaretDown,
  SpeakerHigh,
  SpeakerLow,
  SpeakerSlash
} from '@phosphor-icons/react';
import {
  useKracRadio,
  KracRadioNowPlaying,
  KRACRADIO_CHANNELS
} from './KracRadio';

export default function FloatingRadioPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [isMounted, setIsMounted] = useState(false);

  const {
    musicEnabled,
    selectedChannel,
    nowPlaying,
    showNowPlaying,
    setShowNowPlaying,
    toggleMusic,
    changeChannel,
    radioManager
  } = useKracRadio('francophonie');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (radioManager) {
      radioManager.setVolume(newVolume);
    }
  };

  const currentChannel = KRACRADIO_CHANNELS.find(c => c.key === selectedChannel);

  if (!isMounted) return null;

  return (
    <>
      {/* Now Playing Popup */}
      <KracRadioNowPlaying
        nowPlaying={nowPlaying}
        show={showNowPlaying}
        onClose={() => setShowNowPlaying(false)}
      />

      {/* Floating Button / Expanded Player */}
      <div className="floating-radio-container">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              className="floating-radio-expanded"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              <div className="floating-radio-header">
                <div className="floating-radio-title">
                  <Radio weight="fill" className="floating-radio-icon" />
                  <span>KracRadio</span>
                </div>
                <button
                  className="floating-radio-close"
                  onClick={() => setIsExpanded(false)}
                >
                  <CaretDown weight="bold" />
                </button>
              </div>

              {/* Current Playing */}
              {musicEnabled && nowPlaying && (
                <div className="floating-radio-current">
                  <div className="floating-radio-current-info">
                    <span className="floating-radio-current-title">{nowPlaying.title}</span>
                    <span className="floating-radio-current-artist">{nowPlaying.artist}</span>
                  </div>
                  <div className="floating-radio-equalizer-mini">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className="eq-bar" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Channel Grid */}
              <div className="floating-radio-channels">
                {KRACRADIO_CHANNELS.map((channel) => (
                  <button
                    key={channel.key}
                    className={`floating-radio-channel ${selectedChannel === channel.key ? 'active' : ''}`}
                    onClick={() => changeChannel(channel.key)}
                    style={{ '--channel-color': channel.color } as React.CSSProperties}
                  >
                    <span
                      className="channel-dot"
                      style={{ backgroundColor: channel.color }}
                    />
                    <span className="channel-name">{channel.name}</span>
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="floating-radio-controls">
                <button
                  className={`floating-radio-play ${musicEnabled ? 'playing' : ''}`}
                  onClick={toggleMusic}
                  style={{ '--channel-color': currentChannel?.color || '#f472b6' } as React.CSSProperties}
                >
                  {musicEnabled ? <Pause weight="fill" /> : <Play weight="fill" />}
                </button>

                {/* Volume */}
                <div className="floating-radio-volume">
                  <button
                    className="volume-btn"
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  >
                    {volume === 0 ? (
                      <SpeakerSlash weight="regular" />
                    ) : volume < 0.5 ? (
                      <SpeakerLow weight="regular" />
                    ) : (
                      <SpeakerHigh weight="regular" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        className="volume-slider-container"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="volume-slider"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Credit */}
              <a
                href="https://kracradio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-radio-credit"
              >
                kracradio.com
              </a>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              className={`floating-radio-btn ${musicEnabled ? 'playing' : ''}`}
              onClick={() => setIsExpanded(true)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ '--channel-color': currentChannel?.color || '#f472b6' } as React.CSSProperties}
            >
              <Radio weight={musicEnabled ? 'fill' : 'regular'} />
              {musicEnabled && (
                <span className="floating-radio-btn-indicator" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .floating-radio-container {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 999;
        }

        /* Collapsed Button */
        .floating-radio-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          position: relative;
        }

        .floating-radio-btn:hover {
          border-color: var(--channel-color, #f472b6);
          color: white;
        }

        .floating-radio-btn.playing {
          border-color: var(--channel-color, #f472b6);
          color: var(--channel-color, #f472b6);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .floating-radio-btn svg {
          font-size: 1.5rem;
        }

        .floating-radio-btn-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 10px;
          height: 10px;
          background: var(--channel-color, #f472b6);
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(244, 114, 182, 0.4); }
          50% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px 2px rgba(244, 114, 182, 0.2); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }

        /* Expanded Panel */
        .floating-radio-expanded {
          width: 280px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        .floating-radio-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .floating-radio-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-weight: 700;
          font-size: 1rem;
        }

        .floating-radio-icon {
          color: #f472b6;
          font-size: 1.25rem;
        }

        .floating-radio-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .floating-radio-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        /* Current Playing */
        .floating-radio-current {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin-bottom: 0.75rem;
        }

        .floating-radio-current-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .floating-radio-current-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .floating-radio-current-artist {
          font-size: 0.7rem;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .floating-radio-equalizer-mini {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 16px;
          margin-left: 0.5rem;
        }

        .eq-bar {
          width: 3px;
          background: linear-gradient(to top, #f472b6, #a855f7);
          border-radius: 2px;
          animation: eq-bounce 0.6s ease-in-out infinite;
        }

        .eq-bar:nth-child(1) { height: 8px; }
        .eq-bar:nth-child(2) { height: 14px; }
        .eq-bar:nth-child(3) { height: 10px; }

        @keyframes eq-bounce {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }

        /* Channel Grid */
        .floating-radio-channels {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.4rem;
          margin-bottom: 0.75rem;
        }

        .floating-radio-channel {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.6rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1.5px solid transparent;
          border-radius: 10px;
          color: #94a3b8;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .floating-radio-channel:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .floating-radio-channel.active {
          border-color: var(--channel-color, #f472b6);
          background: rgba(244, 114, 182, 0.1);
          color: white;
        }

        .channel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .channel-name {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Controls */
        .floating-radio-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .floating-radio-play {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--channel-color, #f472b6) 0%, #a855f7 100%);
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(244, 114, 182, 0.3);
        }

        .floating-radio-play:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(244, 114, 182, 0.4);
        }

        .floating-radio-play:active {
          transform: scale(0.95);
        }

        .floating-radio-play svg {
          font-size: 1.5rem;
        }

        .floating-radio-volume {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        .volume-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .volume-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .volume-btn svg {
          font-size: 1.1rem;
        }

        .volume-slider-container {
          position: absolute;
          left: calc(100% + 0.5rem);
          top: 50%;
          transform: translateY(-50%);
          padding: 0.5rem 0.75rem;
          background: rgba(15, 20, 41, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .volume-slider {
          width: 80px;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #f472b6;
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #f472b6;
          cursor: pointer;
          border: none;
        }

        /* Credit */
        .floating-radio-credit {
          display: block;
          text-align: center;
          font-size: 0.65rem;
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .floating-radio-credit:hover {
          color: #f472b6;
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
          .floating-radio-container {
            bottom: 0.75rem;
            right: 0.75rem;
          }

          .floating-radio-expanded {
            width: calc(100vw - 1.5rem);
            max-width: 320px;
          }

          .floating-radio-btn {
            width: 48px;
            height: 48px;
          }

          .floating-radio-btn svg {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  );
}
