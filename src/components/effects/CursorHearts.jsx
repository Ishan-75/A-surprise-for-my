import React, { useEffect, useState } from 'react';

export const CursorHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Only enable on pointer fine (desktop mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let lastTime = 0;
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 75) return; // limit spawn rate
      lastTime = now;

      // Taylor Swift Lover pinks, Lana cherry velvet, Midnights lavender, Champagne gold
      const romanticColors = ['#ea9ab2', '#b82e4f', '#c8b6ff', '#fae19c', '#f3b7c8'];
      const icons = ['✨', '🌸', '💖', '🥀', '🤍'];

      const newHeart = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 10,
        color: romanticColors[Math.floor(Math.random() * romanticColors.length)],
        icon: icons[Math.floor(Math.random() * icons.length)],
        driftX: (Math.random() - 0.5) * 35
      };

      setHearts((prev) => [...prev.slice(-15), newHeart]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 950);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute select-none pointer-events-none"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            fontSize: `${h.size}px`,
            color: h.color,
            transform: 'translate(-50%, -50%)',
            animation: 'cursorHeartFade 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {h.icon}
        </span>
      ))}
      <style>{`
        @keyframes cursorHeartFade {
          0% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(0.6);
          }
          50% {
            opacity: 0.8;
            transform: translate(calc(-50% + 5px), -28px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + 12px), -50px) scale(0.4);
          }
        }
      `}</style>
    </div>
  );
};
