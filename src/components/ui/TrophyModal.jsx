import React from 'react';
import { X, Trophy, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { defaultAchievements } from '../../data/achievements';
import { useApp } from '../../context/AppContext';
import sound from '../../utils/soundEffects';

export const TrophyModal = ({ isOpen, onClose }) => {
  const { unlockedAchievements } = useApp();

  if (!isOpen) return null;

  const unlockedCount = Object.keys(unlockedAchievements).length;
  const progressPercent = Math.round((unlockedCount / defaultAchievements.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-[#ea9ab2]/35 shadow-2xl shadow-[#b82e4f]/25 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#12071e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#fae19c] to-[#b82e4f] flex items-center justify-center shadow-lg shadow-[#fae19c]/20">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-album font-bold text-white flex items-center gap-2">
                Girlfriend Trophy Room <Sparkles className="w-4 h-4 text-[#fae19c]" />
              </h2>
              <p className="text-xs text-[#f7d6e0]/80 font-poetic">
                Unlock badges by playing games, discovering secrets, and teasing your boyfriend!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-4 bg-[#180928]/70 border-b border-white/10">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-gray-300">Total Universe Completion</span>
            <span className="text-[#fae19c] font-mono">{unlockedCount} / {defaultAchievements.length} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#fae19c] rounded-full transition-all duration-500 shadow-sm shadow-[#b82e4f]/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {defaultAchievements.map((ach) => {
            const isUnlocked = !!unlockedAchievements[ach.id];
            const unlockedData = unlockedAchievements[ach.id];

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'glass-card border-[#ea9ab2]/40 bg-[#b82e4f]/15 shadow-md shadow-[#b82e4f]/15'
                    : 'bg-white/[0.02] border-white/5 opacity-55'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-[#b82e4f]/30 to-[#ea9ab2]/25 border border-[#ea9ab2]/40 shadow-inner'
                      : 'bg-gray-800/50 border border-gray-700/50 grayscale'
                  }`}
                >
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className={`text-sm font-bold truncate ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                      {ach.title}
                    </h3>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                    {ach.subtitle}
                  </p>
                  {isUnlocked && unlockedData?.unlockedAt && (
                    <span className="text-[10px] text-[#ea9ab2]/90 font-mono block mt-1">
                      Unlocked: {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
