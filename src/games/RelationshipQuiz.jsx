import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, RotateCcw, Award, ChevronRight, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { defaultQuizQuestions, quizResultTiers } from '../data/quizData';
import { useApp } from '../context/AppContext';
import sound from '../utils/soundEffects';

export const RelationshipQuiz = () => {
  const { recordQuizCompletion, siteConfig } = useApp();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = defaultQuizQuestions;
  const currentQ = questions[currentQuestionIdx];

  const handleSelectOption = (option) => {
    if (hasAnswered) return;
    setSelectedOption(option);
    setHasAnswered(true);

    if (option.isCorrect) {
      sound.playQuizCorrect();
      setScore((prev) => prev + 1);
    } else {
      sound.playQuizWrong();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Completed!
      const finalScore = score + (selectedOption?.isCorrect ? 0 : 0);
      setIsCompleted(true);
      recordQuizCompletion(finalScore);
      sound.playAchievement();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {}
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const resultTier = quizResultTiers.find((tier) => score >= tier.minScore) || quizResultTiers[quizResultTiers.length - 1];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {!isCompleted ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#ea9ab2]/35 shadow-2xl shadow-[#b82e4f]/20 relative">
          {/* Progress & Counter */}
          <div className="flex items-center justify-between mb-4 text-xs font-mono text-gray-400">
            <span className="text-[#ea9ab2] font-bold">
              QUESTION {currentQuestionIdx + 1} OF {questions.length}
            </span>
            <span className="text-[#fae19c]">SCORE: {score}</span>
          </div>

          <div className="w-full h-1.5 bg-black/40 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Title */}
          <h3 className="text-xl sm:text-2xl font-album font-bold text-white mb-6 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'border-white/10 hover:border-[#ea9ab2]/50 bg-white/[0.03] text-gray-200';

              if (hasAnswered) {
                if (isSelected) {
                  btnStyle = opt.isCorrect
                    ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200'
                    : 'border-[#b82e4f]/80 bg-[#b82e4f]/30 text-rose-200';
                } else if (opt.isCorrect) {
                  btnStyle = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300';
                } else {
                  btnStyle = 'border-white/5 opacity-40 text-gray-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed font-poetic text-base">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Commentary when answered */}
          {hasAnswered && selectedOption && (
            <div className="p-4 rounded-2xl bg-[#1a0824]/60 border border-[#ea9ab2]/30 text-xs sm:text-sm text-[#f7d6e0] mb-6 flex items-start gap-3 animate-in fade-in duration-200">
              <span className="text-lg">💬</span>
              <div>
                <span className="font-bold block text-[#ea9ab2] mb-0.5 font-album">
                  {selectedOption.isCorrect ? "Boyfriend's Reaction:" : "Hold on a second..."}
                </span>
                <span className="font-poetic text-sm sm:text-base leading-relaxed">{selectedOption.comment}</span>
              </div>
            </div>
          )}

          {/* Next Button */}
          {hasAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-semibold text-sm shadow-xl shadow-[#b82e4f]/35 hover:scale-102 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2 border border-[#ea9ab2]/40"
            >
              <span>{currentQuestionIdx + 1 === questions.length ? "VIEW FINAL RESULTS" : "NEXT QUESTION"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Results Screen */
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#ea9ab2]/40 shadow-2xl shadow-[#b82e4f]/25 text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#fae19c] to-[#b82e4f] flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl shadow-[#fae19c]/25">
            🏆
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#ea9ab2]/15 border border-[#ea9ab2]/35 text-[#fae19c] font-mono text-xs font-bold uppercase mb-2">
            OFFICIAL RELATIONSHIP CERTIFICATE
          </span>

          <h3 className="text-2xl sm:text-3xl font-album font-bold text-white mb-2">
            {resultTier.title}
          </h3>

          <p className="text-base font-bold text-[#fae19c] mb-4">
            {resultTier.badge} • Score: {score}/{questions.length}
          </p>

          <p className="text-sm sm:text-base text-[#f7d6e0]/90 font-poetic leading-relaxed max-w-md mx-auto mb-6">
            {resultTier.description}
          </p>

          <div className="text-[11px] text-gray-400 italic mb-8 max-w-sm mx-auto font-poetic">
            *Disclaimer: Not scientifically reviewed by NASA, but emotionally verified with 100% precision by {siteConfig.boyfriendName}.
          </div>

          <button
            onClick={handleRestart}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-semibold text-sm shadow-xl shadow-[#b82e4f]/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2 mx-auto border border-[#ea9ab2]/40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETAKE QUIZ</span>
          </button>
        </div>
      )}
    </div>
  );
};
