import React, { useState } from 'react';
import { Award, CheckCircle2, Sparkles, Flame, ShieldAlert, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import sound from '../utils/soundEffects';

export const BoyfriendChallenge = () => {
  const { siteConfig, unlockAchievement, showToast } = useApp();

  const [claimedBonus, setClaimedBonus] = useState({});

  const challenges = [
    {
      id: "chal-teaser",
      title: "Professional Teaser",
      role: "Boyfriend Specialty",
      level: "Level 99 Smirk Master",
      desc: "Guaranteed to tease you about something goofy until you say 'stooop' while trying not to laugh.",
      badge: "😏",
      action: "Request Formal Apology",
      response: "Apology issued: 'I'm sorry for being right and looking adorable while doing it.'"
    },
    {
      id: "chal-overthinker",
      title: "Certified Overthinker",
      role: "Suganthi's Specialty",
      level: "Level 100 Mind Reader",
      desc: "Has solved 400 problems that haven't actually happened yet just in case.",
      badge: "🧠",
      action: "Dispense Calm Pills",
      response: "Prescription: 1 hot chocolate and 20 forehead kisses."
    },
    {
      id: "chal-missingyou",
      title: "CEO of Missing You",
      role: "Joint Enterprise",
      level: "Infinite Hours",
      desc: "Begins missing the other person approximately 4.2 seconds after saying goodbye.",
      badge: "🥺",
      action: "Send Digital Ping",
      response: "Boyfriend Heart Status: Pinging back with 10,000 heart emojis!"
    },
    {
      id: "chal-partnerincrime",
      title: "Partner in Crime",
      role: "Unstoppable Duo",
      level: "Legendary Bond",
      desc: "Together we can conquer any obstacle, survive bad movies, and order too much food.",
      badge: "👯‍♂️",
      action: "High Five",
      response: "Virtual High Five! Power level amplified by 200%!"
    },
    {
      id: "chal-suspicious",
      title: "Suspiciously Romantic Boyfriend",
      role: "Boyfriend Specialty",
      level: "Mastermind",
      desc: "Built this entire website just to make you smile, blush, and know how deeply you are loved.",
      badge: "👑",
      action: "Accept Love",
      response: "Love accepted and locked into your galactic memory vault forever! ❤️"
    }
  ];

  const handleAction = (chal) => {
    sound.playAchievement();
    setClaimedBonus((prev) => ({ ...prev, [chal.id]: true }));
    showToast(chal.title, chal.response, chal.badge);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="text-center mb-2">
        <h3 className="text-2xl sm:text-3xl font-album font-bold text-white mb-2">Relationship Titles & Silly Badges</h3>
        <p className="text-sm sm:text-base text-[#f7d6e0]/85 font-poetic max-w-lg mx-auto">
          Here is our official dossier of titles earned through months of goofy dates, inside jokes, and food battles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((chal) => {
          const isClaimed = !!claimedBonus[chal.id];
          return (
            <div
              key={chal.id}
              className="glass-card p-5 rounded-3xl border border-[#ea9ab2]/25 flex flex-col justify-between hover:border-[#ea9ab2]/50 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-[#b82e4f]/20 border border-[#ea9ab2]/30 shadow-inner">
                      {chal.badge}
                    </span>
                    <div>
                      <h4 className="text-base font-album font-bold text-white leading-tight">
                        {chal.title}
                      </h4>
                      <span className="text-[11px] text-[#fae19c] font-mono">
                        {chal.role} • {chal.level}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 font-poetic leading-relaxed mb-5">
                  {chal.desc}
                </p>
              </div>

              <button
                onClick={() => handleAction(chal)}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isClaimed
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                    : 'bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white border border-[#ea9ab2]/40 shadow-md shadow-[#b82e4f]/25 hover:scale-102 active:scale-98'
                }`}
              >
                {isClaimed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CLAIMED: {chal.action}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#fae19c]" />
                    <span>{chal.action}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
