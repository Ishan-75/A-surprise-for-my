import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Pause, Heart, Trophy, Zap, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import sound from '../utils/soundEffects';

export const CatchMyLove = () => {
  const { arcadeHighScore, updateArcadeHighScore } = useApp();

  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'paused', 'gameover'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState([]);
  const [penaltyActive, setPenaltyActive] = useState(false);
  const [penaltyMessage, setPenaltyMessage] = useState('');

  const playAreaRef = useRef(null);
  const targetIdCounter = useRef(0);

  // Start game
  const startGame = () => {
    sound.playClick();
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setTargets([]);
    setPenaltyActive(false);
    setGameState('playing');
  };

  // Timer tick
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, score]);

  const endGame = () => {
    setGameState('gameover');
    sound.playAchievement();
    updateArcadeHighScore(score);

    if (score > arcadeHighScore) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  // Spawn targets periodically
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      if (targets.length > 8) return;

      const randomVal = Math.random();
      let type = 'heart';
      let points = 10;
      let label = '💖';

      if (randomVal > 0.85) {
        type = 'gold';
        points = 30;
        label = '⭐';
      } else if (randomVal > 0.65) {
        type = 'redflag';
        points = -15;
        label = '🚩';
      } else if (randomVal > 0.55) {
        type = 'overthinking';
        points = -5;
        label = '🌧️';
      }

      const newTarget = {
        id: ++targetIdCounter.current,
        type,
        points,
        label,
        x: Math.random() * 85 + 5, // percentage
        y: Math.random() * 75 + 10,
        scale: type === 'gold' ? 1.3 : 1
      };

      setTargets((prev) => [...prev, newTarget]);

      // Remove after 2.8 seconds if not clicked
      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
      }, 2800);
    }, 650);

    return () => clearInterval(spawnInterval);
  }, [gameState, targets.length]);

  // Click target
  const handleCatch = (target, e) => {
    e.stopPropagation();

    // Remove clicked target
    setTargets((prev) => prev.filter((t) => t.id !== target.id));

    if (target.type === 'heart') {
      sound.playHeartCatch();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const bonus = newCombo >= 5 ? 5 : 0;
      setScore((prev) => prev + target.points + bonus);
    } else if (target.type === 'gold') {
      sound.playGoldHeart();
      setCombo((prev) => prev + 2);
      setScore((prev) => prev + target.points);
      try {
        confetti({ particleCount: 25, spread: 45, origin: { x: target.x / 100, y: target.y / 100 } });
      } catch {}
    } else if (target.type === 'redflag') {
      sound.playRedFlag();
      setCombo(0);
      setScore((prev) => Math.max(0, prev + target.points));
      setPenaltyActive(true);
      setPenaltyMessage("Caught a Red Flag! 'Leaving dishes in the sink!' (-15 pts)");
      setTimeout(() => setPenaltyActive(false), 1500);
    } else if (target.type === 'overthinking') {
      sound.playRedFlag();
      setCombo(0);
      setScore((prev) => Math.max(0, prev + target.points));
      setPenaltyActive(true);
      setPenaltyMessage("Overthinking Cloud: 'Did his text sound slightly dry?!' (-5 pts)");
      setTimeout(() => setPenaltyActive(false), 1500);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {/* Top Scoreboard */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-mono">SCORE</span>
            <span className="text-xl sm:text-2xl font-black text-pink-400 font-cyber">{score}</span>
          </div>
          {combo > 2 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 animate-pulse">
              {combo}x COMBO! 🔥
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 font-mono">TIME LEFT</span>
            <span className={`text-xl sm:text-2xl font-black font-cyber ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-400 font-mono">PERSONAL BEST</span>
          <span className="text-base sm:text-lg font-bold text-[#fae19c] font-mono flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> {arcadeHighScore}
          </span>
        </div>
      </div>

      {/* Main Play Area */}
      <div
        ref={playAreaRef}
        className={`relative w-full h-[380px] sm:h-[440px] rounded-3xl glass-panel border border-[#ea9ab2]/35 overflow-hidden select-none cursor-crosshair transition-all ${
          penaltyActive ? 'ring-4 ring-[#b82e4f]/60 bg-[#b82e4f]/20 animate-shake' : ''
        }`}
      >
        {/* Penalty Notification Toast */}
        {penaltyActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-[#b82e4f] text-white font-bold text-xs shadow-lg animate-bounce flex items-center gap-1.5 border border-[#ea9ab2]/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{penaltyMessage}</span>
          </div>
        )}

        {/* Targets when playing */}
        {gameState === 'playing' &&
          targets.map((target) => (
            <button
              key={target.id}
              onClick={(e) => handleCatch(target, e)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full hover:scale-125 active:scale-90 transition-transform cursor-pointer animate-float focus:outline-none"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                fontSize: target.type === 'gold' ? '2.4rem' : '2rem'
              }}
              title={target.type}
              aria-label={`Catch ${target.type}`}
            >
              <span className="drop-shadow-[0_0_12px_rgba(234,154,178,0.7)]">
                {target.label}
              </span>
            </button>
          ))}

        {/* Start / Idle Screen */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#941b36] via-[#b82e4f] to-[#ea9ab2] flex items-center justify-center text-white mb-4 shadow-xl shadow-[#b82e4f]/40 border border-[#ea9ab2]/30">
              <Heart className="w-8 h-8 fill-white animate-heartbeat" />
            </div>
            <h3 className="text-2xl font-album font-bold text-white mb-2">CATCH MY LOVE</h3>
            <p className="text-xs sm:text-sm text-[#f7d6e0]/85 font-poetic max-w-sm mb-6 leading-relaxed">
              Tap the hearts (💖) and golden stars (⭐) as fast as you can! Avoid red flags (🚩) and overthinking clouds (🌧️)!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-semibold text-sm shadow-xl shadow-[#b82e4f]/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center gap-2 border border-[#ea9ab2]/40"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START PLAYING</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-2xl font-album font-bold text-white mb-1">TIME'S UP!</h3>
            <p className="text-sm text-[#ea9ab2] mb-4 font-mono">
              Final Score: <span className="text-2xl font-bold text-white ml-1">{score}</span>
            </p>

            {score >= arcadeHighScore && score > 0 ? (
              <div className="text-xs text-[#fae19c] font-semibold bg-[#fae19c]/15 border border-[#fae19c]/40 px-3 py-1 rounded-full mb-6 animate-pulse">
                🏆 NEW PERSONAL RECORD! Boyfriend is thoroughly impressed!
              </div>
            ) : (
              <div className="text-xs text-[#f7d6e0]/80 font-poetic mb-6">
                Good effort! Give it another shot to beat your record of {arcadeHighScore}!
              </div>
            )}

            <button
              onClick={startGame}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white font-semibold text-sm shadow-xl shadow-[#b82e4f]/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center gap-2 border border-[#ea9ab2]/40"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* Guide Note */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 text-center">
        <span className="flex items-center gap-1">💖 Hearts (+10 pts)</span>
        <span className="flex items-center gap-1">⭐ Star (+30 pts)</span>
        <span className="flex items-center gap-1">🚩 Red Flag (-15 pts)</span>
        <span className="flex items-center gap-1">🌧️ Overthinking (-5 pts)</span>
      </div>
    </div>
  );
};
