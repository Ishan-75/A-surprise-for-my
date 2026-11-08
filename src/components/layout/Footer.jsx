import React, { useState } from 'react';
import { Heart, Lock, RotateCcw, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import sound from '../../utils/soundEffects';

export const Footer = () => {
  const { 
    siteConfig, 
    setHasSeenIntro, 
    discoverSecret, 
    collectMicroHeart, 
    foundHearts
  } = useApp();
  const [confessionModal, setConfessionModal] = useState(false);

  const handleConfessionClick = () => {
    sound.playSecret();
    discoverSecret('egg-boyfriend-confession');
    setConfessionModal(true);
  };

  return (
    <footer className="w-full border-t border-[#ea9ab2]/15 glass-panel py-8 px-6 mt-16 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-400">
        {/* Left: Romantic Dedication */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-1.5 font-bold text-white text-sm font-album">
            <span>{siteConfig.projectName}</span>
            <span className="text-[#ea9ab2]">•</span>
            <span className="text-[#fae19c]">Dedicated to {siteConfig.girlfriendName}</span>
          </div>
          <p className="text-[#fce4ec]/70 text-xs font-poetic text-sm italic">
            {siteConfig.subtitle}
          </p>
        </div>

        {/* Center: Secret Lock Easter Egg */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleConfessionClick}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-[#ea9ab2] transition-colors cursor-pointer group"
            title="A tiny locked padlock... wonder what's inside?"
            aria-label="Secret boyfriend confession"
          >
            <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          {/* Micro Heart #2 Easter Egg */}
          {!foundHearts.includes('heart-footer') && (
            <button
              onClick={() => collectMicroHeart('heart-footer')}
              className="w-4 h-4 opacity-30 hover:opacity-100 transition-opacity cursor-pointer text-xs"
              title="Another hidden heart in the footer!"
              aria-label="Secret footer heart"
            >
              🌸
            </button>
          )}
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            onClick={() => {
              sound.playClick();
              setHasSeenIntro(false);
            }}
            className="hover:text-[#fae19c] transition-colors flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#ea9ab2]" /> Replay Intro
          </NavLink>

          <NavLink
            to="/creator-studio"
            onClick={() => sound.playClick()}
            className="hover:text-[#fae19c] transition-colors flex items-center gap-1 text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fae19c]" /> Creator Studio
          </NavLink>
        </div>
      </div>

      {/* Secret Confession Modal */}
      {confessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-[#ea9ab2]/40 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#b82e4f]/25 border border-[#ea9ab2]/40 mx-auto flex items-center justify-center text-[#ea9ab2] mb-4">
              <Heart className="w-6 h-6 fill-[#ea9ab2]" />
            </div>
            <h3 className="text-lg font-album font-bold text-white mb-2">Secret Boyfriend Confession #08</h3>
            <p className="text-sm text-[#fce4ec] leading-relaxed font-handwriting text-xl italic mb-6">
              "I still remember the exact outfit you were wearing the day I realized I was falling for you. You were talking animatedly with your hands and laughing, and my brain simply stopped thinking about anything else in the world."
            </p>
            <button
              onClick={() => {
                sound.playClick();
                setConfessionModal(false);
              }}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#941b36] to-[#b82e4f] text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Keep This Secret Safe 🤫
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
