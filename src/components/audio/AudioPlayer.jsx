import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Music, 
  Sparkles, 
  ChevronUp, 
  ChevronDown,
  Repeat, 
  ListMusic
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
    changeTrack,
    selectTrack,
    playlist,
    sfxEnabled,
    toggleSfx
  } = useApp();

  const [expanded, setExpanded] = useState(false);
  const [loopMode, setLoopMode] = useState(true); // loop current song by default
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fileError, setFileError] = useState(false);

  const audioRef = useRef(null);
  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  // Helper to resolve public/audio paths across development and static deployments
  const resolveAudioSrc = (src) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:') || src.startsWith('data:')) {
      return src;
    }
    // Strip accidental 'public/' prefix or multiple leading slashes
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

  // Handle HTMLAudio for file / url tracks
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;

    if (currentTrack?.type !== 'synth' && currentTrack?.src) {
      const resolvedSrc = resolveAudioSrc(currentTrack.src);
      audioRef.current.src = resolvedSrc;
      setFileError(false);
      setCurrentTime(0);

      if (musicPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Audio play prevented or file not found', err);
          setFileError(true);
          sound.startAmbientMusic();
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [currentTrackIndex, currentTrack?.src, currentTrack?.type]);

  // Synchronize playing state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (currentTrack?.type !== 'synth') {
        if (musicPlaying && !fileError) {
          audioRef.current.play().catch(() => setFileError(true));
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [musicPlaying, volume, fileError, currentTrack?.type]);

  const handleNext = () => {
    sound.playClick();
    setFileError(false);
    changeTrack(1);
  };

  const handlePrev = () => {
    sound.playClick();
    setFileError(false);
    changeTrack(-1);
  };

  const handleTogglePlay = () => {
    sound.playClick();
    if (!musicPlaying) {
      setFileError(false);
    }
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
        loop={loopMode}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={() => {
          if (!loopMode) {
            handleNext();
          }
        }}
        onError={() => setFileError(true)}
      />

      <aside
        aria-label="Music and Sound Controls"
        className="fixed bottom-4 right-4 z-40 transition-all duration-300 max-w-[calc(100vw-2rem)]"
      >
        {/* Compact Bar / Toggle */}
        <div className="glass-panel rounded-full px-3 py-2 flex items-center gap-2.5 sm:gap-3 border border-[#ea9ab2]/30 shadow-xl shadow-black/70">
          <button
            onClick={handleTogglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] flex items-center justify-center text-white shadow-md shadow-[#b82e4f]/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title={musicPlaying ? "Pause Soundtrack" : "Play Romantic Soundtrack"}
            aria-label={musicPlaying ? "Pause Soundtrack" : "Play Romantic Soundtrack"}
          >
            {musicPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          {/* Track info ticker */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-left cursor-pointer group"
            title="Toggle Audio Controls & Playlist"
          >
            <div className="flex flex-col max-w-[130px] sm:max-w-[180px] overflow-hidden">
              <span className="text-xs font-semibold text-[#fce4ec] truncate group-hover:text-[#fae19c] transition-colors">
                {currentTrack?.title}
              </span>
              <span className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                {musicPlaying ? (
                  <span className="flex items-center gap-1 text-[#fae19c] font-mono">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fae19c] animate-pulse" />
                    {currentTrack?.type === 'synth' ? 'Dreamy Lo-Fi' : `${formatTime(currentTime)} / ${formatTime(duration)}`}
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
          <div className="glass-panel mt-2 p-4 rounded-3xl border border-[#ea9ab2]/35 shadow-2xl flex flex-col gap-3 min-w-[290px] sm:min-w-[340px] max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-[#fae19c] font-album text-sm">
                <Music className="w-4 h-4 text-[#ea9ab2]" /> LOVE.EXE Soundtrack
              </span>
              <span className="text-[10px] text-[#ea9ab2]/80 font-mono">
                {playlist.length} {playlist.length === 1 ? 'Track' : 'Tracks'}
              </span>
            </div>

            {/* Notification if custom file fallback is used */}
            {fileError && currentTrack?.type === 'file' && (
              <div className="text-[11px] bg-[#1a0e28]/70 border border-[#ea9ab2]/30 text-[#f7d6e0] px-3 py-2 rounded-xl">
                💡 Song file not found at <code className="text-[#fae19c]">{currentTrack?.src}</code>. Playing ambient synthesizer fallback!
              </div>
            )}

            {/* Track Info & Current Status */}
            <div className="text-center py-1">
              <span className="text-base font-album font-bold text-white block truncate px-2">
                {currentTrack?.title}
              </span>
              <span className="text-xs text-[#ea9ab2]/90 block truncate font-poetic text-sm">
                {currentTrack?.artist}
              </span>
            </div>

            {/* Audio Progress Scrubber */}
            {currentTrack?.type !== 'synth' && duration > 0 && (
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

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 py-1">
              <button
                onClick={() => setLoopMode(!loopMode)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  loopMode ? 'text-[#fae19c] bg-[#fae19c]/15' : 'text-gray-400 hover:text-white'
                }`}
                title={loopMode ? "Looping Current Song" : "Playing Playlist in Order"}
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handlePrev}
                className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Previous Track"
                aria-label="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] flex items-center justify-center text-white shadow-lg shadow-[#b82e4f]/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                aria-label={musicPlaying ? "Pause" : "Play"}
              >
                {musicPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Next Track"
                aria-label="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
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

            {/* Full Playlist View */}
            {playlist.length > 1 && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono block mb-2 flex items-center gap-1.5">
                  <ListMusic className="w-3.5 h-3.5 text-[#ea9ab2]" /> Tracks ({playlist.length})
                </span>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {playlist.map((track, idx) => {
                    const isActive = currentTrackIndex === idx;
                    return (
                      <div
                        key={track.id || idx}
                        className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#b82e4f]/25 border border-[#ea9ab2]/40 text-[#fae19c]'
                            : 'bg-white/[0.02] hover:bg-white/5 border border-transparent text-gray-300'
                        }`}
                        onClick={() => {
                          sound.playClick();
                          setFileError(false);
                          selectTrack(idx);
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isActive ? (
                            <span className="w-2 h-2 rounded-full bg-[#fae19c] animate-ping flex-shrink-0" />
                          ) : (
                            <span className="text-[10px] text-gray-500 font-mono w-3.5 text-center flex-shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <div className="truncate">
                            <span className="font-semibold block truncate">{track.title}</span>
                            <span className="text-[10px] text-gray-400 block truncate font-poetic text-xs">{track.artist}</span>
                          </div>
                        </div>

                        {isActive && (
                          <span className="text-[10px] font-mono font-bold text-[#fae19c] flex-shrink-0">
                            PLAYING
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};
