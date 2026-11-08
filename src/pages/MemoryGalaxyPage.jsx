import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Volume2, 
  Grid, 
  Star,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import sound from '../utils/soundEffects';

export const MemoryGalaxyPage = () => {
  const { memories, unlockAchievement } = useApp();

  const [selectedMemoryIdx, setSelectedMemoryIdx] = useState(null);
  const [viewMode, setViewMode] = useState('constellation'); // 'constellation' or 'scrapbook'
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenMemory = (idx) => {
    sound.playHeartCatch();
    setSelectedMemoryIdx(idx);
    unlockAchievement('ach-stargazer');
  };

  const handleNext = () => {
    sound.playClick();
    setSelectedMemoryIdx((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    sound.playClick();
    setSelectedMemoryIdx((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const currentMem = selectedMemoryIdx !== null ? memories[selectedMemoryIdx] : null;

  // Keyboard navigation for Lightbox / Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedMemoryIdx === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          setSelectedMemoryIdx(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemoryIdx, isLightboxOpen, memories.length]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ea9ab2]/15 border border-[#ea9ab2]/35 text-[#fae19c] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#fae19c]" />
          <span>CELESTIAL SCRAPBOOK ARCHIVE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-album font-bold text-white tracking-tight mb-2">
          Our Memory Galaxy
        </h1>
        <p className="text-base sm:text-lg text-[#f7d6e0]/85 font-poetic italic leading-relaxed">
          Click on the glowing constellation stars or browse the scrapbook timeline to relive our favorite memories.
        </p>
      </div>

      {/* View Switcher */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => {
            sound.playClick();
            setViewMode('constellation');
          }}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            viewMode === 'constellation'
              ? 'bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white shadow-lg shadow-[#b82e4f]/35'
              : 'glass-panel text-gray-300 hover:text-white border-white/10'
          }`}
        >
          <Star className="w-4 h-4 text-[#fae19c]" />
          <span>CONSTELLATION SKY VIEW</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setViewMode('scrapbook');
          }}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            viewMode === 'scrapbook'
              ? 'bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white shadow-lg shadow-[#b82e4f]/35'
              : 'glass-panel text-gray-300 hover:text-white border-white/10'
          }`}
        >
          <Grid className="w-4 h-4 text-[#fae19c]" />
          <span>POLAROID SCRAPBOOK</span>
        </button>
      </div>

      {/* ================= VIEW 1: INTERACTIVE CONSTELLATION SKY ================= */}
      {viewMode === 'constellation' ? (
        <div className="relative w-full h-[460px] sm:h-[530px] rounded-3xl glass-panel border border-[#ea9ab2]/30 overflow-hidden shadow-2xl p-4">
          {/* Constellation SVG Lines Connecting the Memory Stars */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true">
            {memories.map((mem, idx) => {
              if (idx === memories.length - 1) return null;
              const nextMem = memories[idx + 1];
              return (
                <line
                  key={idx}
                  x1={`${mem.x}%`}
                  y1={`${mem.y}%`}
                  x2={`${nextMem.x}%`}
                  y2={`${nextMem.y}%`}
                  stroke="rgba(250, 225, 156, 0.45)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}
          </svg>

          {/* Clickable Stars */}
          {memories.map((mem, idx) => (
            <button
              key={mem.id}
              onClick={() => handleOpenMemory(idx)}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer p-3 focus:outline-none"
              style={{ left: `${mem.x}%`, top: `${mem.y}%` }}
              title={mem.title}
            >
              {/* Star Glow Pulse */}
              <div className="w-9 h-9 rounded-full bg-[#fae19c]/20 group-hover:bg-[#fae19c]/40 group-hover:scale-150 transition-all flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#fae19c] to-white shadow-[0_0_18px_rgba(250,225,156,0.95)] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* Memory Label Tooltip */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#120920]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#ea9ab2]/40 whitespace-nowrap opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all text-[11px] text-[#fae19c] shadow-xl pointer-events-none flex items-center gap-1.5">
                <span>{mem.title}</span>
                {mem.photoUrl && <span className="text-[10px]">📸</span>}
              </div>
            </button>
          ))}

          <div className="absolute bottom-4 left-4 z-20 text-[11px] text-gray-300 font-mono bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#fae19c]" />
            <span>Click any glowing constellation star to open memory polaroid</span>
          </div>
        </div>
      ) : (
        /* ================= VIEW 2: POLAROID SCRAPBOOK ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((mem, idx) => (
            <div
              key={mem.id}
              onClick={() => handleOpenMemory(idx)}
              className="glass-card p-5 rounded-3xl border border-[#ea9ab2]/20 hover:border-[#fae19c]/50 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              {/* Polaroid Frame */}
              <div className="w-full h-56 sm:h-64 rounded-2xl bg-[#090514] border border-white/10 overflow-hidden mb-4 relative flex items-center justify-center p-2">
                {mem.photoUrl ? (
                  <img
                    src={mem.photoUrl}
                    alt={mem.title}
                    className="w-full h-full rounded-xl object-contain transition-transform duration-300 group-hover:scale-102"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#941b36]/40 via-[#b82e4f]/30 to-[#1a0e28]/60 flex flex-col items-center justify-center text-center p-4">
                    <Sparkles className="w-8 h-8 text-[#fae19c] mb-2 animate-pulse" />
                    <span className="text-xs font-handwriting text-2xl text-[#fce4ec]">
                      "{mem.title}"
                    </span>
                  </div>
                )}
                <span className="absolute top-3 right-3 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/75 text-[#fae19c] border border-white/15 backdrop-blur-md">
                  {mem.tag}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-gray-400 block mb-1">
                  📅 {mem.date}
                </span>
                <h3 className="text-base font-album font-bold text-white group-hover:text-[#fae19c] transition-colors mb-2">
                  {mem.title}
                </h3>
                <p className="text-xs text-[#fce4ec]/80 line-clamp-3 leading-relaxed mb-3">
                  {mem.story}
                </p>
                {mem.audioCaption && (
                  <span className="text-xs font-handwriting text-base text-[#fae19c] block truncate">
                    💬 "{mem.audioCaption}"
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MEMORY POLAROID MODAL ================= */}
      {currentMem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-[#ea9ab2]/40 shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto">
            {/* Top Close Button & Date Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#b82e4f]/25 text-[#fae19c] border border-[#ea9ab2]/35 font-bold uppercase">
                  {currentMem.tag}
                </span>
                <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#fae19c]" /> {currentMem.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {currentMem.photoUrl && (
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-[#fae19c] hover:text-white transition-colors cursor-pointer"
                    title="Fullscreen View"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedMemoryIdx(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Memory Title */}
            <h3 className="text-xl sm:text-2xl font-album font-bold text-white mb-4">
              {currentMem.title}
            </h3>

            {/* Photo / Visual Frame */}
            <div className="w-full h-[360px] sm:h-[430px] rounded-2xl bg-[#07040f] border border-[#ea9ab2]/25 overflow-hidden mb-5 flex items-center justify-center p-2 relative shadow-inner">
              {currentMem.photoUrl ? (
                <img
                  src={currentMem.photoUrl}
                  alt={currentMem.title}
                  onClick={() => setIsLightboxOpen(true)}
                  className="max-h-full max-w-full object-contain rounded-xl cursor-pointer hover:scale-102 transition-transform duration-200"
                  title="Click for fullscreen view"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#941b36]/40 via-[#b82e4f]/30 to-[#1a0e28]/60 flex flex-col items-center justify-center text-center p-6 border border-white/5">
                  <Sparkles className="w-10 h-10 text-[#fae19c] mb-2 animate-pulse" />
                  <span className="text-xs text-[#fae19c]/90 font-mono">
                    Constellation Chapter #{selectedMemoryIdx + 1}
                  </span>
                  <span className="text-xl font-handwriting text-[#fce4ec] mt-2">
                    Two idiots making beautiful memories
                  </span>
                </div>
              )}
            </div>

            {/* Story Text */}
            <p className="text-base sm:text-lg text-[#fce4ec] leading-relaxed font-poetic mb-5 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              "{currentMem.story}"
            </p>

            {/* Audio Caption Note */}
            {currentMem.audioCaption && (
              <div className="p-3.5 rounded-2xl bg-[#1d102b]/60 border border-[#ea9ab2]/30 text-xs text-[#fae19c] flex items-center gap-2.5 mb-5">
                <Volume2 className="w-4 h-4 text-[#fae19c] flex-shrink-0" />
                <span className="font-handwriting text-xl">{currentMem.audioCaption}</span>
              </div>
            )}

            {/* Modal Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Memory
              </button>

              <span className="text-gray-400 font-mono">
                {selectedMemoryIdx + 1} / {memories.length}
              </span>

              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                Next Memory <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FULLSCREEN VIEW MODAL ================= */}
      {isLightboxOpen && currentMem?.photoUrl && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none">
          {/* Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3 z-30">
            <div>
              <span className="text-xs text-[#fae19c] font-mono block">{currentMem.date}</span>
              <h2 className="text-base sm:text-lg font-album font-bold">{currentMem.title}</h2>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Close Fullscreen (Esc)"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image Viewport */}
          <div className="flex-1 w-full flex items-center justify-center overflow-hidden my-4">
            <img
              src={currentMem.photoUrl}
              alt={currentMem.title}
              className="max-h-[82vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between text-xs text-gray-300 border-t border-white/10 pt-3 z-30">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Photo
            </button>

            <span className="font-mono text-gray-400">
              {selectedMemoryIdx + 1} of {memories.length} • Arrow Keys to Navigate
            </span>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 cursor-pointer"
            >
              Next Photo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
