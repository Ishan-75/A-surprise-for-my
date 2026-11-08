import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import sound from '../utils/soundEffects';

export const FinalSurprisePage = () => {
  const { siteConfig, unlockAchievement } = useApp();

  const [step, setStep] = useState(1); // 1 = Constellation Drawing, 2 = Letter Lines, 3 = Final Reveal
  const [lineIndex, setLineIndex] = useState(0);

  const finalData = siteConfig.finalSurprise || {
    title: "A Message from My Heart to Yours",
    paragraphs: [
      "Out of all the places I could have built, I built this little universe because one ordinary world wasn't enough to fit all the ways you make me feel.",
      "You're my favorite plot twist, my favorite notification, and the person I'd choose even when you're being ridiculously annoying.",
      "Thank you for being part of my story. I hope this little corner of the internet makes you smile whenever you visit."
    ],
    closing: "End of website. Beginning of our next adventure. ❤️"
  };

  const paragraphs = finalData.paragraphs || [];

  // Step 1 -> Step 2 after constellation forms
  useEffect(() => {
    unlockAchievement('ach-forever-love');

    const timer = setTimeout(() => {
      setStep(2);
    }, 2800);

    return () => clearTimeout(timer);
  }, [unlockAchievement]);

  // Reveal paragraphs line-by-line in Step 2
  useEffect(() => {
    if (step !== 2) return;

    if (lineIndex < paragraphs.length) {
      const lineTimer = setTimeout(() => {
        sound.playHeartCatch();
        setLineIndex((prev) => prev + 1);
      }, 1600);
      return () => clearTimeout(lineTimer);
    }
  }, [step, lineIndex, paragraphs.length]);

  const handleRevealFinal = () => {
    sound.playAchievement();
    setStep(3);

    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ea9ab2', '#b82e4f', '#fae19c', '#c8b6ff']
      });
    } catch {}
  };

  const handleReplay = () => {
    sound.playClick();
    setStep(1);
    setLineIndex(0);
    setTimeout(() => setStep(2), 2500);
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center px-4 sm:px-6 py-12 overflow-hidden">
      {/* Background Soft Atmospheric Ambient Glow (Taylor Midnights & Lana Del Rey cinematic mood) */}
      <div className="absolute inset-0 bg-[#07050f]/85 pointer-events-none transition-opacity duration-1000" />
      <div className="absolute w-[520px] h-[520px] rounded-full bg-[#b82e4f]/15 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#c8b6ff]/10 blur-[100px] pointer-events-none translate-x-32 -translate-y-24" />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Step 1: Glowing Heart Constellation Drawing */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-1000 py-16">
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full bg-[#b82e4f]/30 blur-2xl animate-pulse" />
              <div className="w-36 h-36 rounded-full border border-[#ea9ab2]/40 flex items-center justify-center shadow-[0_0_50px_rgba(234,154,178,0.5)]">
                <Heart className="w-16 h-16 text-[#fae19c] fill-[#ea9ab2] animate-heartbeat" />
              </div>
            </div>

            <span className="font-mono text-xs text-[#fae19c] tracking-widest uppercase animate-pulse">
              ALIGNED IN THE STARS FOR {siteConfig.girlfriendName.toUpperCase()}
            </span>
          </div>
        )}

        {/* Step 2 & 3: The Personal Love Letter */}
        {step >= 2 && (
          <div className="w-full glass-panel p-8 sm:p-12 rounded-3xl border border-[#ea9ab2]/35 shadow-2xl animate-in fade-in duration-700">
            {/* Top Icon */}
            <div className="w-12 h-12 rounded-2xl bg-[#b82e4f]/25 border border-[#ea9ab2]/40 flex items-center justify-center mx-auto mb-6 text-[#ea9ab2] shadow-md shadow-[#b82e4f]/20">
              <Heart className="w-6 h-6 fill-[#ea9ab2]" />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-4xl font-album font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fae19c] via-[#ea9ab2] to-[#c8b6ff] mb-8 leading-tight">
              {finalData.title}
            </h2>

            {/* Paragraphs revealed line by line */}
            <div className="space-y-6 text-left mb-10">
              {paragraphs.slice(0, lineIndex + 1).map((p, idx) => (
                <div
                  key={idx}
                  className="text-lg sm:text-xl font-poetic text-[#fdf0f4] leading-relaxed p-5 rounded-2xl bg-[#170e28]/50 border border-[#ea9ab2]/15 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  "{p}"
                </div>
              ))}
            </div>

            {/* Step 2 Button to trigger final reveal */}
            {step === 2 && lineIndex >= paragraphs.length - 1 && (
              <button
                onClick={handleRevealFinal}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#b82e4f]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto animate-bounce"
              >
                <Sparkles className="w-4 h-4 text-[#fae19c]" />
                <span>ONE LAST THING...</span>
              </button>
            )}

            {/* Step 3: Ultimate Emotional Ending */}
            {step === 3 && (
              <div className="mt-8 pt-8 border-t border-white/10 animate-in zoom-in-95 duration-500">
                <p className="text-xl sm:text-3xl font-album font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fae19c] via-[#f3b7c8] to-[#c8b6ff] mb-8">
                  {finalData.closing}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleReplay}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-[#fae19c] font-semibold text-xs border border-[#ea9ab2]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>REPLAY ENDING</span>
                  </button>

                  <NavLink
                    to="/universe"
                    onClick={() => sound.playClick()}
                    className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-bold text-xs tracking-wider shadow-lg shadow-[#b82e4f]/35 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>RETURN TO OUR UNIVERSE</span>
                    <ArrowRight className="w-4 h-4" />
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
