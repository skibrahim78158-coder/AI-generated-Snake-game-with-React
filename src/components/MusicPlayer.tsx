import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { DUMMY_TRACKS, Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div id="music-player-card" className="w-full max-w-md bg-[#151619] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden relative group">
      {/* Background Glow */}
      <div id="player-glow-top" className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full" />
      <div id="player-glow-bottom" className="absolute -bottom-24 -left-24 w-48 h-48 bg-magenta-500/10 blur-[80px] rounded-full" style={{ backgroundColor: 'rgba(255, 0, 255, 0.1)' }} />

      <audio
        id="audio-element"
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div id="track-info-container" className="flex items-center gap-6 relative z-10">
        <div id="album-art-wrapper" className="relative w-24 h-24 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              id={`album-art-${currentTrack.id}`}
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          {isPlaying && (
            <div id="playback-indicator" className="absolute -bottom-2 -right-2 bg-cyan-500 p-1.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Music className="w-3 h-3 text-black" />
            </div>
          )}
        </div>

        <div id="track-metadata" className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              id={`track-text-${currentTrack.id}`}
              key={currentTrack.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h3 id="track-title" className="text-white font-bold truncate text-lg tracking-tight leading-tight">
                {currentTrack.title}
              </h3>
              <p id="track-artist" className="text-cyan-500/70 text-sm font-mono uppercase tracking-widest mt-1">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div id="player-controls-section" className="mt-8 space-y-6 relative z-10">
        {/* Progress Bar */}
        <div id="progress-container" className="space-y-2">
          <div id="progress-track" className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden cursor-pointer group/progress">
            <motion.div
              id="progress-fill"
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 relative"
              style={{ width: `${progress}%` }}
            >
              <div id="progress-handle" className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </motion.div>
          </div>
          <div id="time-display" className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-tighter">
            <span id="current-time">{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
            <span id="total-duration">{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
          </div>
        </div>

        {/* Controls */}
        <div id="playback-controls" className="flex items-center justify-between">
          <div id="volume-control" className="flex items-center gap-1">
            <Volume2 className="w-4 h-4 text-white/20" />
            <div id="volume-track" className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div id="volume-fill" className="w-3/4 h-full bg-white/20" />
            </div>
          </div>

          <div id="control-buttons" className="flex items-center gap-6">
            <button
              id="prev-track-btn"
              onClick={prevTrack}
              className="text-white/40 hover:text-cyan-400 transition-colors transform active:scale-90"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            
            <button
              id="play-pause-btn"
              onClick={togglePlay}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? (
                <Pause id="pause-icon" className="w-6 h-6 fill-current" />
              ) : (
                <Play id="play-icon" className="w-6 h-6 fill-current ml-1" />
              )}
            </button>

            <button
              id="next-track-btn"
              onClick={nextTrack}
              className="text-white/40 hover:text-cyan-400 transition-colors transform active:scale-90"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <div id="control-spacer" className="w-20" /> {/* Spacer for symmetry */}
        </div>
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
