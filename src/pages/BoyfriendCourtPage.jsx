import React, { useState } from 'react';
import { Scale, Gavel, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { defaultCourtCases } from '../data/courtData';
import { useApp } from '../context/AppContext';
import sound from '../utils/soundEffects';

export const BoyfriendCourtPage = () => {
  const { siteConfig, unlockAchievement, discoverSecret } = useApp();

  const [selectedCase, setSelectedCase] = useState(defaultCourtCases[0]);
  const [defenseText, setDefenseText] = useState(null);
  const [verdictSentence, setVerdictSentence] = useState(null);
  const [isGavelSlammed, setIsGavelSlammed] = useState(false);
  const [gavelPesterCount, setGavelPesterCount] = useState(0);

  // Easter Egg 4: Gavel clicked 5 times
  const handleGavelClick = () => {
    sound.playGavel();
    setIsGavelSlammed(true);
    setTimeout(() => setIsGavelSlammed(false), 300);

    const next = gavelPesterCount + 1;
    setGavelPesterCount(next);
    if (next >= 5) {
      discoverSecret('egg-court-judge-pester');
      setGavelPesterCount(0);
    }
  };

  // Case Selection
  const handleSelectCase = (caseItem) => {
    sound.playClick();
    setSelectedCase(caseItem);
    setDefenseText(null);
    setVerdictSentence(null);
  };

  // Hear Defense
  const handleHearDefense = () => {
    sound.playClick();
    const randomDefense = selectedCase.defenses[Math.floor(Math.random() * selectedCase.defenses.length)];
    setDefenseText(randomDefense);
  };

  // Deliver Verdict
  const handleDeliverVerdict = () => {
    sound.playGavel();
    setIsGavelSlammed(true);
    setTimeout(() => setIsGavelSlammed(false), 300);

    const randomSentence = selectedCase.sentences[Math.floor(Math.random() * selectedCase.sentences.length)];
    setVerdictSentence(randomSentence);
    unlockAchievement('ach-supreme-judge');

    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ea9ab2', '#fae19c', '#b82e4f']
      });
    } catch {}
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title & Animated Judge */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ea9ab2]/15 border border-[#ea9ab2]/35 text-[#fae19c] text-xs font-semibold mb-4">
          <Scale className="w-3.5 h-3.5 text-[#fae19c]" />
          <span>INTERGALACTIC HIGH COURT OF ROMANCE</span>
        </div>

        {/* Animated Judge Avatar */}
        <div className="flex flex-col items-center justify-center mb-4">
          <button
            onClick={handleGavelClick}
            className={`w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#941b36] via-[#b82e4f] to-[#ea9ab2] p-1 flex items-center justify-center shadow-xl shadow-[#b82e4f]/35 cursor-pointer transition-transform ${
              isGavelSlammed ? 'scale-125 rotate-12' : 'hover:scale-105'
            }`}
            title="Click to slam the judge's gavel!"
            aria-label="Judge's Gavel"
          >
            <div className="w-full h-full rounded-3xl bg-[#140822] flex items-center justify-center text-4xl">
              ⚖️
            </div>
          </button>
          <span className="text-xs text-[#fae19c] font-mono mt-2">
            Presiding Magistrate: <span className="font-bold text-white">{siteConfig.girlfriendName}</span>
          </span>
          <span className="text-[10px] text-gray-400">
            Defendant: <span className="text-[#ea9ab2] font-semibold">{siteConfig.boyfriendName}</span> (Pleading desperately for mercy)
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-album font-bold text-white tracking-tight mb-2">
          Boyfriend Court
        </h1>
        <p className="text-xs sm:text-sm text-[#f7d6e0]/85 font-poetic text-base sm:text-lg italic leading-relaxed">
          Put your boyfriend on trial for crimes of snack theft, reckless teasing, and looking annoyingly cute.
        </p>
      </div>

      {/* Main Courtroom Grid: Left = Case Docket, Right = Trial Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Selector Docket (Left Column) */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-[#ea9ab2]" /> Active Crime Docket
          </h2>

          <div className="space-y-2.5">
            {defaultCourtCases.map((c) => {
              const isSelected = selectedCase.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCase(c)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#b82e4f]/30 to-[#ea9ab2]/20 border-[#ea9ab2]/55 shadow-md'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-[#fae19c] px-2 py-0.5 rounded bg-[#b82e4f]/25 border border-[#ea9ab2]/30">
                    {c.caseNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {c.crimeTitle}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Trial Dossier (Center & Right Column) */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-[#ea9ab2]/30 flex flex-col justify-between shadow-2xl">
          <div>
            {/* Dossier Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-[#fae19c] font-bold">
                  OFFICIAL CASE FILE {selectedCase.caseNumber}
                </span>
                <h3 className="text-xl sm:text-2xl font-album font-bold text-white mt-0.5">
                  {selectedCase.crimeTitle}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#b82e4f]/25 border border-[#b82e4f]/45 text-[#f3b7c8] text-xs font-mono font-bold uppercase">
                GUILTY
              </span>
            </div>

            {/* Charge Description */}
            <div className="mb-6">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Formal Indictment
              </span>
              <p className="text-sm sm:text-base text-gray-200 font-poetic text-lg leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/5">
                "{selectedCase.chargeDescription}"
              </p>
            </div>

            {/* Evidence Exhibit */}
            <div className="mb-6">
              <span className="text-xs font-bold text-[#fae19c] uppercase tracking-wider block mb-1">
                Prosecution Evidence
              </span>
              <div className="text-xs sm:text-sm text-[#fae19c]/90 bg-[#2b1e0f]/40 border border-[#fae19c]/30 p-3.5 rounded-2xl">
                {selectedCase.evidenceExhibit}
              </div>
            </div>

            {/* Defense Statement (Revealed upon clicking) */}
            {defenseText && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="text-xs font-bold text-[#c8b6ff] uppercase tracking-wider block mb-1">
                  Defense Attorney's Desperate Argument
                </span>
                <div className="text-xs sm:text-sm text-[#dfd4f8] bg-[#1a1230]/50 border border-[#c8b6ff]/40 p-4 rounded-2xl leading-relaxed italic">
                  "{defenseText}"
                </div>
              </div>
            )}

            {/* Verdict & Punishment (Revealed upon clicking) */}
            {verdictSentence && (
              <div className="mb-6 animate-in zoom-in-95 duration-300">
                <span className="text-xs font-bold text-[#ea9ab2] uppercase tracking-wider block mb-1">
                  Judicial Sentence & Punishment
                </span>
                <div className="text-sm sm:text-base font-bold text-[#fce4ec] bg-gradient-to-r from-[#4a0d1b]/70 to-[#1e1028]/70 border border-[#ea9ab2]/55 p-5 rounded-2xl leading-relaxed shadow-lg shadow-[#b82e4f]/20 flex items-start gap-3">
                  <span className="text-2xl">📜</span>
                  <div>
                    <span className="text-[#fae19c] text-xs uppercase tracking-wider block mb-1">FINAL BINDING DECREE:</span>
                    <span className="font-poetic text-lg">{verdictSentence}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleHearDefense}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-[#c8b6ff] font-semibold text-xs border border-[#c8b6ff]/35 hover:border-[#c8b6ff] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>HEAR BOYFRIEND'S DEFENSE 🗣️</span>
            </button>

            <button
              onClick={handleDeliverVerdict}
              className="w-full sm:flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#b82e4f]/35 hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              <span>DELIVER VERDICT & SLAM GAVEL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
