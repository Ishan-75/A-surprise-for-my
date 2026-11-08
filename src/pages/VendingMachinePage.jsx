import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Gift, Coins, Sparkles, CheckCircle2, Heart, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { defaultSurprises } from '../data/surprises';
import { useApp } from '../context/AppContext';
import sound from '../utils/soundEffects';

export const VendingMachinePage = () => {
  const { triggerOverlay } = useOutletContext() || {};
  const { 
    unlockedSurprises, 
    addUnlockedSurprise, 
    redeemedCoupons, 
    redeemCoupon,
    discoverSecret
  } = useApp();

  const [isDispensing, setIsDispensing] = useState(false);
  const [currentSurprise, setCurrentSurprise] = useState(null);
  const [coinClicks, setCoinClicks] = useState(0);
  const [activeTab, setActiveTab] = useState('machine'); // 'machine' or 'inventory'

  // Easter Egg 5: Coin slot tapped 3 times
  const handleCoinSlotClick = () => {
    sound.playClick();
    const next = coinClicks + 1;
    setCoinClicks(next);
    if (next >= 3) {
      sound.playGoldHeart();
      discoverSecret('egg-vending-jackpot');
      setCoinClicks(0);
    }
  };

  // Dispense mystery capsule
  const handleDispense = () => {
    if (isDispensing) return;
    sound.playClick();
    setIsDispensing(true);
    setCurrentSurprise(null);

    const unOpened = defaultSurprises.filter((s) => !unlockedSurprises.includes(s.id));
    const pool = unOpened.length > 0 ? unOpened : defaultSurprises;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
      sound.playCapsulePop();
      setCurrentSurprise(selected);
      addUnlockedSurprise(selected.id);
      setIsDispensing(false);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ea9ab2', '#fae19c', '#c8b6ff', '#b82e4f']
        });
      } catch {}
    }, 1800);
  };

  const openedSurprisesList = defaultSurprises.filter((s) => unlockedSurprises.includes(s.id));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ea9ab2]/15 border border-[#ea9ab2]/35 text-[#fae19c] text-xs font-semibold mb-3">
          <Gift className="w-3.5 h-3.5 text-[#fae19c]" />
          <span>CYBERNETIC DISPENSER OF AFFECTION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-album font-bold text-white tracking-tight mb-2">
          Love Vending Machine
        </h1>
        <p className="text-base sm:text-lg text-[#f7d6e0]/85 font-poetic italic leading-relaxed">
          Insert unlimited virtual tokens to dispense mystery capsules, boyfriend coupons, and personalized love notes.
        </p>
      </div>

      {/* Mode Switcher: Machine vs Inventory */}
      <div className="flex justify-center gap-3 mb-10">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('machine');
          }}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'machine'
              ? 'bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white shadow-lg shadow-[#b82e4f]/35'
              : 'glass-panel text-gray-300 hover:text-white border-white/10'
          }`}
        >
          <Gift className="w-4 h-4 text-[#fae19c]" />
          <span>CAPSULE DISPENSER</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('inventory');
          }}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-gradient-to-r from-[#b82e4f] to-[#c8b6ff] text-white shadow-lg shadow-[#b82e4f]/35'
              : 'glass-panel text-gray-300 hover:text-white border-white/10'
          }`}
        >
          <Ticket className="w-4 h-4 text-[#fae19c]" />
          <span>MY VAULT ({openedSurprisesList.length}/{defaultSurprises.length})</span>
        </button>
      </div>

      {activeTab === 'machine' ? (
        /* ================= VENDING MACHINE VIEW ================= */
        <div className="max-w-md mx-auto flex flex-col items-center">
          {/* Machine Outer Frame */}
          <div className="w-full glass-panel rounded-3xl border-2 border-[#ea9ab2]/40 p-6 shadow-2xl relative overflow-hidden bg-[#120822]">
            {/* Top Display Window with Floating Capsules */}
            <div className="relative w-full h-56 rounded-2xl bg-black/60 border border-white/10 p-4 overflow-hidden mb-6 flex items-center justify-center">
              {/* Glass Reflection Highlight */}
              <div className="absolute -top-12 -left-12 w-36 h-80 bg-white/5 rotate-45 pointer-events-none" />

              {/* Floating Capsules inside */}
              <div className="relative w-full h-full flex flex-wrap items-center justify-around gap-2 p-2">
                {['#ea9ab2', '#fae19c', '#c8b6ff', '#b82e4f', '#80b6b2', '#f3b7c8'].map((color, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-full border-2 border-white/40 shadow-lg flex items-center justify-center text-xl transition-all ${
                      isDispensing ? 'animate-bounce' : 'animate-float'
                    }`}
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${color}, #0d0617)`,
                      animationDelay: `${idx * 0.3}s`
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>

              {/* Falling Capsule Animation during Dispense */}
              {isDispensing && (
                <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center z-20">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#fae19c] to-[#ea9ab2] animate-spin flex items-center justify-center text-2xl shadow-xl shadow-[#fae19c]/40">
                    🎁
                  </div>
                  <span className="text-xs font-mono text-[#fae19c] mt-3 animate-pulse font-bold">
                    DISPENSING LOVE CAPSULE...
                  </span>
                </div>
              )}
            </div>

            {/* Middle Controls: Coin Slot & Dispense Button */}
            <div className="flex items-center justify-between gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 mb-6">
              {/* Secret Coin Slot (Easter Egg 5) */}
              <button
                onClick={handleCoinSlotClick}
                className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#fae19c] cursor-pointer"
                title="Coin Slot (Tap 3 times for a secret)"
                aria-label="Coin Slot"
              >
                <Coins className="w-5 h-5 text-[#fae19c] animate-pulse" />
                <div className="text-left">
                  <span className="text-[10px] text-gray-400 block font-mono">TOKEN BALANCE</span>
                  <span className="text-xs font-bold text-[#fae19c]">INFINITE 🪙</span>
                </div>
              </button>

              {/* Push Button */}
              <button
                onClick={handleDispense}
                disabled={isDispensing}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isDispensing
                    ? 'bg-gray-700 opacity-60'
                    : 'bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] hover:scale-102 active:scale-95 shadow-[#b82e4f]/35'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#fae19c]" />
                <span>{isDispensing ? 'DISPENSING...' : 'DISPENSE CAPSULE'}</span>
              </button>
            </div>

            {/* Bottom Capsule Chute Door */}
            <div className="w-full py-2.5 rounded-xl bg-black/60 border border-white/10 text-center text-[11px] font-mono text-[#fae19c]/70">
              ▼ CAPSULE RETRIEVAL CHUTE ▼
            </div>
          </div>

          {/* Revealed Capsule Popup Card */}
          {currentSurprise && (
            <div className="w-full mt-6 glass-panel p-6 rounded-3xl border border-[#ea9ab2]/45 shadow-2xl animate-in zoom-in-95 duration-300 relative text-center">
              <span
                className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase mb-3 border border-[#ea9ab2]/40 bg-[#b82e4f]/25 text-[#fae19c]"
              >
                {currentSurprise.rarity} {currentSurprise.category}
              </span>

              <h3 className="text-xl font-album font-bold text-white mb-2">
                {currentSurprise.title}
              </h3>

              <p className="text-sm sm:text-base text-[#fce4ec] font-poetic text-lg leading-relaxed mb-6">
                "{currentSurprise.content}"
              </p>

              {/* Special Action Triggers for Hug / Kiss */}
              {currentSurprise.type === 'hug' && (
                <button
                  onClick={() => triggerOverlay && triggerOverlay('hug')}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#fae19c] to-[#f4d06f] hover:brightness-105 text-black font-bold text-xs shadow-lg shadow-[#fae19c]/30 transition-transform hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2 mb-3"
                >
                  <Heart className="w-4 h-4 fill-black" />
                  <span>TRIGGER FULLSCREEN VIRTUAL HUG</span>
                </button>
              )}

              {currentSurprise.type === 'kiss' && (
                <button
                  onClick={() => triggerOverlay && triggerOverlay('kiss')}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#b82e4f] to-[#ea9ab2] text-white font-bold text-xs shadow-lg shadow-[#b82e4f]/30 transition-transform hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2 mb-3"
                >
                  <span>💋 LAUNCH KISS BARRAGE</span>
                </button>
              )}

              {/* Coupon Redemption Button */}
              {currentSurprise.type === 'coupon' && (
                <button
                  onClick={() => redeemCoupon(currentSurprise.id)}
                  disabled={redeemedCoupons.includes(currentSurprise.id)}
                  className={`w-full py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    redeemedCoupons.includes(currentSurprise.id)
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      : 'bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white shadow-lg shadow-[#b82e4f]/35 hover:scale-102 active:scale-98'
                  }`}
                >
                  {redeemedCoupons.includes(currentSurprise.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>COUPON REDEEMED & LOGGED</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>REDEEM THIS COUPON NOW</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ================= INVENTORY / VAULT VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openedSurprisesList.length === 0 ? (
            <div className="col-span-2 text-center py-12 glass-panel rounded-3xl border border-white/10">
              <Gift className="w-12 h-12 text-[#ea9ab2]/40 mx-auto mb-3" />
              <h3 className="text-lg font-album font-bold text-white mb-1">Your Vault is Empty</h3>
              <p className="text-xs text-gray-400 mb-4 font-poetic text-sm">
                Head to the Capsule Dispenser and insert tokens to discover love notes & coupons!
              </p>
              <button
                onClick={() => setActiveTab('machine')}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#941b36] to-[#b82e4f] text-white font-bold text-xs cursor-pointer"
              >
                Go to Dispenser
              </button>
            </div>
          ) : (
            openedSurprisesList.map((item) => {
              const isRedeemed = redeemedCoupons.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="glass-card p-5 rounded-3xl border border-[#ea9ab2]/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[#ea9ab2]/35 bg-[#b82e4f]/20 text-[#fae19c]">
                        {item.rarity} {item.category}
                      </span>
                      {isRedeemed && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Redeemed
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-album font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-[#fce4ec]/85 font-poetic text-sm leading-relaxed mb-4">{item.content}</p>
                  </div>

                  <div className="flex gap-3 pt-2 border-t border-white/10">
                    {item.type === 'hug' && (
                      <button
                        onClick={() => triggerOverlay && triggerOverlay('hug')}
                        className="text-xs text-[#fae19c] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        🤗 Replay Virtual Hug
                      </button>
                    )}
                    {item.type === 'kiss' && (
                      <button
                        onClick={() => triggerOverlay && triggerOverlay('kiss')}
                        className="text-xs text-[#ea9ab2] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        💋 Replay Kiss Barrage
                      </button>
                    )}
                    {item.type === 'coupon' && !isRedeemed && (
                      <button
                        onClick={() => redeemCoupon(item.id)}
                        className="text-xs text-[#fae19c] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        🎟️ Redeem Coupon
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
