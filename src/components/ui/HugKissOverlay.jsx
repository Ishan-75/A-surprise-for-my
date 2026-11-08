import React, { useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import sound from '../../utils/soundEffects';

export const HugKissOverlay = ({ type, onClose }) => {
  useEffect(() => {
    if (type === 'hug') {
      sound.playHug();
    } else if (type === 'kiss') {
      sound.playKiss();
      try {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#ff2d75', '#ff758f', '#ffb3c1', '#ffffff']
        });
      } catch {}
    }
  }, [type]);

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <button
        onClick={() => {
          sound.playClick();
          onClose();
        }}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-20"
        aria-label="Close Animation"
      >
        <X className="w-6 h-6" />
      </button>

      {type === 'hug' ? (
        <div className="flex flex-col items-center text-center max-w-lg z-10 animate-in zoom-in-75 duration-500">
          {/* Animated Glowing Hug Aura */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#ea9ab2]/30 blur-3xl animate-pulse" />
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[#941b36] via-[#b82e4f] to-[#fae19c] p-1 flex items-center justify-center shadow-[0_0_60px_rgba(184,46,79,0.5)] animate-heartbeat">
              <div className="w-full h-full rounded-full bg-[#12071e] flex items-center justify-center text-6xl sm:text-7xl">
                🤗
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-album font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fae19c] via-[#ea9ab2] to-white mb-3">
            EMERGENCY WARM HUG DEPLOYED!
          </h2>
          <p className="text-base sm:text-lg text-[#f7d6e0]/90 font-poetic leading-relaxed max-w-md">
            Close your eyes for 5 seconds and feel this giant squeeze! You are loved, you are appreciated, and you are never alone. ❤️
          </p>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-semibold shadow-lg shadow-[#b82e4f]/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-[#ea9ab2]/35"
          >
            Hug Received & Absorbed 🥰
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center max-w-lg z-10 animate-in zoom-in-75 duration-500">
          {/* Animated Kiss Barrage */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#b82e4f]/40 blur-3xl animate-pulse" />
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[#941b36] via-[#b82e4f] to-[#ea9ab2] p-1 flex items-center justify-center shadow-[0_0_60px_rgba(184,46,79,0.6)] animate-bounce">
              <div className="w-full h-full rounded-full bg-[#12071e] flex items-center justify-center text-6xl sm:text-7xl">
                💋
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-album font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fae19c] via-[#ea9ab2] to-white mb-3">
            DIGITAL KISS BARRAGE!
          </h2>
          <p className="text-base sm:text-lg text-[#f7d6e0]/90 font-poetic leading-relaxed max-w-md">
            One on your forehead, one on each cheek, and a million more sent straight through cyberspace to you right now!
          </p>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-semibold shadow-lg shadow-[#b82e4f]/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-[#ea9ab2]/35"
          >
            Kisses Accepted With a Blush 😘
          </button>
        </div>
      )}
    </div>
  );
};
