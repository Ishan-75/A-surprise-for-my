import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Terminal, Sparkles, AlertTriangle, ArrowRight, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import sound from '../utils/soundEffects';

export const IntroPage = () => {
  const navigate = useNavigate();
  const { siteConfig, setHasSeenIntro, unlockAchievement, discoverSecret, startMusic } = useApp();

  // Scene state: 1 = Boot, 2 = Error 404, 3 = Heart Portal, 4 = Personal Welcome
  const [scene, setScene] = useState(1);
  const [bootLineIndex, setBootLineIndex] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const lines = siteConfig.introSequence || [];

  // Scene 1: Typewriter boot sequence
  useEffect(() => {
    if (scene !== 1) return;

    if (bootLineIndex < lines.length) {
      const timer = setTimeout(() => {
        sound.playKeyBlip();
        setBootLineIndex((prev) => prev + 1);
        setBootProgress(Math.round(((bootLineIndex + 1) / lines.length) * 100));
      }, 750);
      return () => clearTimeout(timer);
    } else {
      const delayToError = setTimeout(() => {
        sound.playRedFlag();
        setScene(2); // Jump to Error 404
      }, 900);
      return () => clearTimeout(delayToError);
    }
  }, [scene, bootLineIndex, lines]);

  // Handle [ FIX MY HEART ] button
  const handleFixHeart = () => {
    sound.playHeartCatch();
    setScene(3); // Heart portal transition

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ea9ab2', '#b82e4f', '#fae19c', '#c8b6ff']
      });
    } catch {}

    // Transition from portal to Welcome
    setTimeout(() => {
      sound.playSecret();
      setScene(4);
    }, 2400);
  };

  // Enter Universe
  const handleEnterUniverse = () => {
    startMusic();
    sound.playAchievement();
    setHasSeenIntro(true);
    unlockAchievement('ach-first-boot');
    navigate('/universe');
  };

  // Discover Secret Button
  const handleDiscoverSecret = () => {
    startMusic();
    sound.playSecret();
    discoverSecret('egg-konami-lover-mode');
    setHasSeenIntro(true);
    unlockAchievement('ach-first-boot');
    navigate('/universe');
  };

  // Skip Intro
  const handleSkip = () => {
    startMusic();
    sound.playClick();
    setHasSeenIntro(true);
    unlockAchievement('ach-first-boot');
    navigate('/universe');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Skip button in top corner */}
      <button
        onClick={handleSkip}
        className="fixed top-6 right-6 z-50 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#fae19c] hover:text-white text-xs font-mono backdrop-blur-md border border-[#ea9ab2]/20 transition-all cursor-pointer"
        title="Skip straight to the universe"
      >
        <span>SKIP INTRO</span>
        <SkipForward className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence mode="wait">
        {/* ================= SCENE 1: BOOT SEQUENCE ================= */}
        {scene === 1 && (
          <motion.div
            key="scene-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl glass-panel rounded-3xl border border-[#ea9ab2]/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#b82e4f]" />
                <span className="w-3 h-3 rounded-full bg-[#fae19c]" />
                <span className="w-3 h-3 rounded-full bg-[#80b6b2]" />
                <span className="font-mono text-xs text-[#ea9ab2] ml-2 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> BOOT SEQUENCE — {siteConfig.projectName}
                </span>
              </div>
              <span className="font-mono text-xs text-[#fae19c] font-bold">{bootProgress}%</span>
            </div>

            {/* Terminal Lines */}
            <div className="font-mono text-xs sm:text-sm space-y-3 min-h-[220px]">
              {lines.slice(0, bootLineIndex + 1).map((line, idx) => {
                const isWarning = line.includes('Warning') || line.includes('0%');
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-2 ${
                      isWarning ? 'text-[#f2708a] font-semibold' : 'text-[#fce4ec]/95'
                    }`}
                  >
                    <span className="text-[#ea9ab2] font-bold select-none">{'>'}</span>
                    <span>{line}</span>
                  </motion.div>
                );
              })}

              <div className="inline-block w-2.5 h-4 bg-[#ea9ab2] animate-pulse ml-4 align-middle" />
            </div>

            {/* Progress bar */}
            <div className="mt-6 w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#b82e4f] via-[#ea9ab2] to-[#fae19c] transition-all duration-300"
                style={{ width: `${bootProgress}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* ================= SCENE 2: SYSTEM ALERT (ERROR 404) ================= */}
        {scene === 2 && (
          <motion.div
            key="scene-2"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-lg glass-panel rounded-3xl border border-[#b82e4f]/50 p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#b82e4f]/25 border border-[#b82e4f]/45 flex items-center justify-center mx-auto mb-5 text-[#ea9ab2] shadow-lg shadow-[#b82e4f]/30 animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-[#b82e4f]/25 border border-[#b82e4f]/40 text-[#f3b7c8] font-mono text-xs font-bold tracking-widest uppercase mb-3">
              {siteConfig.alertTitle}
            </span>

            <h2 className="text-2xl sm:text-3xl font-album font-bold text-white mb-3">
              Boyfriend Brain Overload
            </h2>

            <p className="text-sm sm:text-base text-[#f7d6e0] leading-relaxed mb-8 max-w-md mx-auto">
              {siteConfig.alertMessage}
            </p>

            <button
              onClick={handleFixHeart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#b82e4f]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>[ {siteConfig.alertButtonText} ]</span>
            </button>
          </motion.div>
        )}

        {/* ================= SCENE 3: HEART PORTAL ================= */}
        {scene === 3 && (
          <motion.div
            key="scene-3"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: [0.6, 1.4, 3], rotate: [0, 90, 180] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#b82e4f] to-[#c8b6ff] blur-3xl opacity-80 animate-pulse" />
              <div className="w-44 h-44 rounded-full border-4 border-[#ea9ab2]/80 flex items-center justify-center shadow-[0_0_100px_rgba(234,154,178,0.7)]">
                <Heart className="w-24 h-24 text-[#fae19c] fill-[#ea9ab2] animate-heartbeat" />
              </div>
            </div>
            <p className="font-mono text-sm text-[#fae19c] mt-6 tracking-widest uppercase animate-pulse">
              WARPING TO SUGANTHI'S UNIVERSE...
            </p>
          </motion.div>
        )}

        {/* ================= SCENE 4: PERSONAL WELCOME ================= */}
        {scene === 4 && (
          <motion.div
            key="scene-4"
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl glass-panel rounded-3xl border border-[#ea9ab2]/35 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ea9ab2]/15 border border-[#ea9ab2]/35 text-[#fae19c] text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#fae19c]" />
              <span>AUTHENTICATED AS {siteConfig.girlfriendName.toUpperCase()}</span>
            </div>

            {/* Welcome Heading with Taylor/Lana Album Typography */}
            <h1 className="text-3xl sm:text-5xl font-album font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fae19c] via-[#ea9ab2] to-[#c8b6ff] leading-tight mb-4">
              {siteConfig.welcomeTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#f8d7e3]/90 font-poetic italic text-xl sm:text-2xl mb-10 max-w-lg mx-auto">
              "{siteConfig.welcomeSubtitle}"
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleEnterUniverse}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#b82e4f]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ENTER MY UNIVERSE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDiscoverSecret}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-[#fae19c] font-semibold text-sm border border-[#ea9ab2]/30 hover:border-[#ea9ab2] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#fae19c]" />
                <span>DISCOVER SOMETHING SECRET</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
