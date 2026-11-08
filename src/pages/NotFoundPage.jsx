import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, AlertTriangle } from 'lucide-react';
import sound from '../utils/soundEffects';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md glass-panel p-8 rounded-3xl border border-pink-500/30 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <span className="font-mono text-xs text-rose-300 font-bold uppercase tracking-wider block mb-2">
          ERROR 404 • DEEP SPACE DRIFT
        </span>
        <h2 className="text-2xl font-black text-white mb-3">
          Lost in the Cosmos
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
          You navigated beyond the charted coordinates of our little universe. Don't worry, your boyfriend's gravitational pull will guide you back home!
        </p>
        <NavLink
          to="/universe"
          onClick={() => sound.playClick()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>RETURN TO UNIVERSE</span>
        </NavLink>
      </div>
    </div>
  );
};
