import React from 'react';
import { useApp } from '../../context/AppContext';

export const ToastNotification = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="glass-panel px-5 py-3 rounded-2xl border border-[#ea9ab2]/40 shadow-2xl shadow-[#b82e4f]/25 flex items-center gap-3 backdrop-blur-xl bg-[#160a22]/95">
        <span className="text-2xl animate-bounce">{toast.icon || '💖'}</span>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#ea9ab2] uppercase tracking-wider font-album">
            {toast.title}
          </span>
          <span className="text-sm font-medium text-white/90 font-poetic">
            {toast.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};
