import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Gamepad2, 
  Scale, 
  Gift, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  Zap, 
  AlertOctagon, 
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import sound from '../utils/soundEffects';

export const UniversePage = () => {
  const { 
    siteConfig, 
    unlockedAchievements, 
    discoveredSecrets, 
    discoverSecret, 
    unlockAchievement,
    arcadeHighScore,
    unlockedSurprises
  } = useApp();

  // Easter Egg 2: "DO NOT PRESS" Button state
  const [panicClicks, setPanicClicks] = useState(0);
  const panicMessages = [
    "DO NOT PRESS",
    "Hey! I said do not press!",
    "Why are you still clicking?! 😭",
    "Boyfriend warning: Hug protocol priming...",
    "System overheat! Too much curiosity!",
    "One more click and you owe me a kiss!",
    "🚨 CRITICAL OVERLOAD: You broke the rules! 🚨"
  ];

  const handlePanicClick = () => {
    sound.playRedFlag();
    const next = panicClicks + 1;
    setPanicClicks(next);
    if (next >= 6) {
      sound.playAchievement();
      discoverSecret('egg-do-not-press');
      unlockAchievement('ach-button-masher');
    }
  };

  const destinations = [
    {
      id: "dest-arcade",
      title: "Girlfriend Arcade",
      subtitle: "Play 'Catch My Love', relationship quiz & unlock badges",
      path: "/arcade",
      icon: Gamepad2,
      gradient: "from-[#b82e4f]/35 via-[#ea9ab2]/25 to-[#7d142b]/35",
      accent: "#ea9ab2",
      badge: arcadeHighScore > 0 ? `Best Score: ${arcadeHighScore}` : "3 Playable Games"
    },
    {
      id: "dest-court",
      title: "Boyfriend Court",
      subtitle: "Sue your boyfriend for food theft, teasing & excessive cuteness",
      path: "/court",
      icon: Scale,
      gradient: "from-[#941b36]/40 via-[#b82e4f]/30 to-[#4a0d1b]/35",
      accent: "#f3b7c8",
      badge: "Comedy Courtroom"
    },
    {
      id: "dest-vending",
      title: "Love Vending Machine",
      subtitle: "Dispense mystery capsules, boyfriend coupons & warm hugs",
      path: "/vending-machine",
      icon: Gift,
      gradient: "from-[#c8b6ff]/35 via-[#b8a4f0]/25 to-[#80b6b2]/30",
      accent: "#c8b6ff",
      badge: `${unlockedSurprises.length} Surprises Collected`
    },
    {
      id: "dest-galaxy",
      title: "Our Memory Galaxy",
      subtitle: "Interactive constellation timeline of our favorite moments",
      path: "/memory-galaxy",
      icon: Sparkles,
      gradient: "from-[#f4d06f]/35 via-[#fae19c]/25 to-[#dfaf5f]/30",
      accent: "#fae19c",
      badge: "Starfield Scrapbook"
    },
    {
      id: "dest-final",
      title: "The Final Surprise",
      subtitle: "A cinematic romantic conclusion built just for you",
      path: "/final-surprise",
      icon: Heart,
      gradient: "from-[#941b36]/50 via-[#b82e4f]/40 to-[#ea9ab2]/40",
      accent: "#ea9ab2",
      highlight: true,
      badge: "Emotional Ending"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ea9ab2]/15 border border-[#ea9ab2]/30 text-[#fae19c] text-xs font-semibold mb-4">
          <Flame className="w-3.5 h-3.5 text-[#ea9ab2]" />
          <span>GALACTIC COORDINATES LOCKED: {siteConfig.girlfriendName.toUpperCase()} & BOYFRIEND</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-album font-bold text-white tracking-tight mb-4 leading-tight">
          Welcome to Our Universe
        </h1>

        <p className="text-sm sm:text-lg text-[#fce4ec]/85 font-poetic text-lg sm:text-xl leading-relaxed max-w-xl mx-auto">
          Every star, game, courtroom trial, and surprise here was engineered with love. Pick a portal below to begin your adventure.
        </p>
      </motion.div>

      {/* 5 Explorable Destination Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {destinations.map((dest, idx) => {
          const Icon = dest.icon;
          return (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <NavLink
                to={dest.path}
                onClick={() => sound.playClick()}
                className={`group block h-full p-6 sm:p-7 rounded-3xl glass-card relative overflow-hidden transition-all duration-300 ${
                  dest.highlight
                    ? 'border-[#ea9ab2]/55 shadow-xl shadow-[#b82e4f]/25 md:col-span-2 lg:col-span-1'
                    : 'border-white/10'
                }`}
              >
                {/* Background Ambient Glow */}
                <div
                  className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-gradient-to-tr ${dest.gradient} blur-3xl opacity-40 group-hover:opacity-75 transition-opacity`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-13 h-13 rounded-2xl flex items-center justify-center p-3 shadow-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${dest.accent}25`, border: `1px solid ${dest.accent}60` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: dest.accent }} />
                      </div>

                      <span
                        className="text-[11px] font-mono px-3 py-1 rounded-full border"
                        style={{
                          backgroundColor: `${dest.accent}15`,
                          borderColor: `${dest.accent}40`,
                          color: dest.accent
                        }}
                      >
                        {dest.badge}
                      </span>
                    </div>

                    {/* Title and Subtitle */}
                    <h2 className="text-xl sm:text-2xl font-album font-bold text-white mb-2 group-hover:text-[#fae19c] transition-colors flex items-center gap-2">
                      {dest.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#f7d6e0]/85 leading-relaxed mb-6 font-normal">
                      {dest.subtitle}
                    </p>
                  </div>

                  {/* Explore Link Action */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#ea9ab2] group-hover:text-[#fae19c] group-hover:translate-x-1 transition-all">
                    <span>EXPLORE DESTINATION</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </NavLink>
            </motion.div>
          );
        })}

        {/* 6th Destination: Forbidden "DO NOT PRESS" Button (Easter Egg 2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="p-6 sm:p-7 rounded-3xl glass-card border border-[#b82e4f]/40 flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#b82e4f]/25 border border-[#b82e4f]/45 flex items-center justify-center text-[#ea9ab2]">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#b82e4f]/25 text-[#f3b7c8] px-2.5 py-1 rounded-full border border-[#b82e4f]/40">
                Top Secret Protocol
              </span>
            </div>

            <h2 className="text-xl font-album font-bold text-white mb-1">
              Forbidden Quarantine Box
            </h2>
            <p className="text-xs text-[#fce4ec]/75 mb-6">
              Whatever you do, under no circumstances should you tap this button. It is extremely volatile.
            </p>
          </div>

          <button
            onClick={handlePanicClick}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
              panicClicks >= 5
                ? 'bg-[#b82e4f] hover:bg-[#941b36] text-white animate-bounce shadow-[#b82e4f]/50'
                : 'bg-[#b82e4f]/20 hover:bg-[#b82e4f]/30 text-[#f3b7c8] border border-[#b82e4f]/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{panicMessages[Math.min(panicClicks, panicMessages.length - 1)]}</span>
          </button>
        </motion.div>
      </div>

      {/* Quick Stats Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-[#ea9ab2]/15 flex flex-wrap items-center justify-around gap-6 text-center">
        <div>
          <span className="text-xs text-[#ea9ab2]/80 block font-mono">SECRETS DISCOVERED</span>
          <span className="text-2xl font-bold text-[#fae19c] font-album">{discoveredSecrets.length} / 8</span>
        </div>
        <div className="h-8 w-px bg-white/10 hidden sm:block" />
        <div>
          <span className="text-xs text-[#ea9ab2]/80 block font-mono">BADGES UNLOCKED</span>
          <span className="text-2xl font-bold text-[#c8b6ff] font-album">{Object.keys(unlockedAchievements).length} / 10</span>
        </div>
        <div className="h-8 w-px bg-white/10 hidden sm:block" />
        <div>
          <span className="text-xs text-[#ea9ab2]/80 block font-mono">SURPRISES OPENED</span>
          <span className="text-2xl font-bold text-[#ea9ab2] font-album">{unlockedSurprises.length}</span>
        </div>
        <div className="h-8 w-px bg-white/10 hidden sm:block" />
        <div>
          <span className="text-xs text-[#ea9ab2]/80 block font-mono">BOYFRIEND AFFECTION</span>
          <span className="text-2xl font-bold text-[#f3b7c8] font-album">∞ %</span>
        </div>
      </div>
    </div>
  );
};
