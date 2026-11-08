import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Music, 
  Sparkles, 
  ChevronUp, 
  ChevronDown,
  Repeat
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import sound from '../../utils/soundEffects';

export const AudioPlayer = () => {
  const {
    musicPlaying,
    toggleMusic,
    volume,
    setVolume,
    currentTrackIndex,
    playlist,
    sfxEnabled,
    toggleSfx
  } = useApp();

  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fileError, setFileError] = useState(false);

  const audioRef = useRef(null);
  // Daylight by Taylor Swift is the one and only song
  const currentTrack = playlist[0] || {
    id: "track-daylight",
    title: "Daylight",
    artist: "Taylor Swift",
    type: "file",
    src: "/audio/Taylor Swift - Daylight (Official Audio)(MP3_160K).mp3"
  };

  // Helper to resolve public/audio paths across development and production
  const resolveAudioSrc = (src) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:') || src.startsWith('data:')) {
      return src;
    }
    const cleanPath = src.replace(/^public\//, '').replace(/^\/+/, '');
    const base = import.meta.env.BASE_URL || '/';
    const prefix = base.endsWith('/') ? base : `${base}/`;
    return encodeURI(`${prefix}${cleanPath}`);
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Load the audio source once and initialize volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;

    const targetSrc = resolveAudioSrc(currentTrack.src);
    // Only update src if it differs to prevent reloading/restarting while already playing
    if (!audioRef.current.src || !audioRef.current.src.endsWith(targetSrc)) {
      audioRef.current.src = targetSrc;
      audioRef.current.load();
    }

    if (musicPlaying && audioRef.current.paused) {
      audioRef.current.play().catch((err) => {
        if (err.name !== 'NotAllowedError') {
          console.warn('Audio playback error', err);
        }
      });
    }
  }, [currentTrack?.src]);

  // Handle Play / Pause state changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;

    if (musicPlaying) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          if (err.name !== 'NotAllowedError') {
            console.warn('Playback error', err);
          }
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [musicPlaying, volume]);

  // Window interaction listener to ensure audio starts and never gets blocked
  useEffect(() => {
    if (!musicPlaying) return;

    const ensurePlaying = () => {
      if (audioRef.current && audioRef.current.paused && musicPlaying) {
        audioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('click', ensurePlaying, { passive: true });
    window.addEventListener('touchstart', ensurePlaying, { passive: true });
    window.addEventListener('keydown', ensurePlaying, { passive: true });

    return () => {
      window.removeEventListener('click', ensurePlaying);
      window.removeEventListener('touchstart', ensurePlaying);
      window.removeEventListener('keydown', ensurePlaying);
    };
  }, [musicPlaying]);

  const handleTogglePlay = () => {
    sound.playClick();
    toggleMusic();
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop={true}
        preload="auto"
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={() => {
          // Continuous loop guarantee: rewind and keep playing!
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
        onError={() => setFileError(true)}
      />

      <aside
        aria-label="Soundtrack Controls"
        className="fixed bottom-4 right-4 z-40 transition-all duration-300 max-w-[calc(100vw-2rem)]"
      >
        {/* Compact Bar / Toggle */}
        <div className="glass-panel rounded-full px-3 py-2 flex items-center gap-2.5 sm:gap-3 border border-[#ea9ab2]/30 shadow-xl shadow-black/70">
          <button
            onClick={handleTogglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] flex items-center justify-center text-white shadow-md shadow-[#b82e4f]/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title={musicPlaying ? "Pause Daylight" : "Play Daylight"}
            aria-label={musicPlaying ? "Pause Daylight" : "Play Daylight"}
          >
            {musicPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          {/* Track info ticker */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-left cursor-pointer group"
            title="Toggle Soundtrack Controls"
          >
            <div className="flex flex-col max-w-[130px] sm:max-w-[180px] overflow-hidden">
              <span className="text-xs font-semibold text-[#fce4ec] truncate group-hover:text-[#fae19c] transition-colors font-album">
                Daylight
              </span>
              <span className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                {musicPlaying ? (
                  <span className="flex items-center gap-1 text-[#fae19c] font-mono">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fae19c] animate-pulse" />
                    {duration > 0 ? `${formatTime(currentTime)} / ${formatTime(duration)}` : 'Playing Endless Love'}
                  </span>
                ) : (
                  'Soundtrack Paused'
                )}
              </span>
            </div>
            {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
          </button>

          {/* SFX Quick Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              toggleSfx();
            }}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              sfxEnabled ? 'text-[#fae19c] hover:text-white bg-[#fae19c]/15' : 'text-gray-500 hover:text-gray-400'
            }`}
            title={sfxEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
            aria-label={sfxEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded Panel */}
        {expanded && (
          <div className="glass-panel mt-2 p-4 rounded-3xl border border-[#ea9ab2]/35 shadow-2xl flex flex-col gap-3 min-w-[280px] sm:min-w-[320px] max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-[#fae19c] font-album text-sm">
                <Music className="w-4 h-4 text-[#ea9ab2]" /> LOVE.EXE Soundtrack
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fae19c]/15 text-[#fae19c] font-mono font-semibold flex items-center gap-1">
                <Repeat className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} /> Endless Loop
              </span>
            </div>

            {/* Notification if file error */}
            {fileError && (
              <div className="text-[11px] bg-[#1a0e28]/70 border border-[#ea9ab2]/30 text-[#f7d6e0] px-3 py-2 rounded-xl">
                💡 Daylight audio file not found at <code className="text-[#fae19c]">{currentTrack.src}</code>.
              </div>
            )}

            {/* Track Info */}
            <div className="text-center py-1">
              <span className="text-lg font-album font-bold text-white block truncate px-2">
                Daylight
              </span>
              <span className="text-xs text-[#ea9ab2]/90 block truncate font-poetic text-sm">
                Taylor Swift • Official Soundtrack
              </span>
            </div>

            {/* Audio Progress Scrubber */}
            {duration > 0 && (
              <div className="space-y-1 px-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.5"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-[#ea9ab2] h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  title="Audio Progress"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#fae19c]/80">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Controls (Big Play/Pause button) */}
            <div className="flex items-center justify-center gap-4 py-1">
              <button
                onClick={handleTogglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] flex items-center justify-center text-white shadow-xl shadow-[#b82e4f]/40 hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-[#ea9ab2]/30"
                aria-label={musicPlaying ? "Pause Daylight" : "Play Daylight"}
              >
                {musicPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                className="text-gray-400 hover:text-white cursor-pointer"
                title={volume === 0 ? "Unmute" : "Mute"}
                aria-label={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#fae19c]" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#ea9ab2] h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                title="Volume Slider"
                aria-label="Volume Slider"
              />
              <span className="text-[10px] text-[#fae19c] w-7 text-right font-mono">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
