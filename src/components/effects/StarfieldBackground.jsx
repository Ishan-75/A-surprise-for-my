import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const StarfieldBackground = () => {
  const canvasRef = useRef(null);
  const { loverMode, collectMicroHeart, foundHearts } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Taylor Swift & Lana Del Rey Starfield Palette (Champagne gold, dusty rose, lavender haze, star white)
    const romanticStarColors = ['#ffffff', '#fae19c', '#ea9ab2', '#c8b6ff', '#f3b7c8'];
    const starCount = Math.min(115, Math.floor((width * height) / 11000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.3 + 0.6,
      opacity: Math.random() * 0.75 + 0.25,
      speed: Math.random() * 0.018 + 0.005,
      color: loverMode
        ? `hsl(${Math.random() * 360}, 85%, 75%)`
        : romanticStarColors[Math.floor(Math.random() * romanticStarColors.length)],
      pulse: Math.random() * Math.PI
    }));

    // Floating romantic hearts (Lover & Lana Del Rey aesthetic)
    const hearts = Array.from({ length: 14 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      size: Math.random() * 12 + 8,
      speed: Math.random() * 0.5 + 0.25,
      drift: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.25 + 0.1,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      color: ['#ea9ab2', '#f3b7c8', '#fae19c', '#c8b6ff'][Math.floor(Math.random() * 4)]
    }));

    // Shooting stars with champagne-golden trails
    let shootingStar = null;
    const spawnShootingStar = () => {
      if (Math.random() < 0.012 && !shootingStar) {
        shootingStar = {
          x: Math.random() * width * 0.75,
          y: Math.random() * height * 0.35,
          length: Math.random() * 85 + 50,
          speed: Math.random() * 9 + 10,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
          opacity: 1
        };
      }
    };

    const drawHeart = (ctx, x, y, size, color, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.3, 0, size);
      ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.3, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Midnight Sapphire & Velvet Mauve background gradient (Taylor Midnights & Lana Honeymoon)
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        80,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#17102b'); // Velvet twilight
      bgGrad.addColorStop(0.5, '#0f0a1c'); // Smoky midnight
      bgGrad.addColorStop(1, '#07050f'); // Deep midnight space
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars
      stars.forEach((star) => {
        star.pulse += star.speed;
        const currentOpacity = star.opacity * (0.65 + 0.35 * Math.sin(star.pulse));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, currentOpacity);
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.size > 1.8 ? 9 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Floating Hearts
      hearts.forEach((h) => {
        h.y -= h.speed;
        h.x += h.drift;
        h.rotation += h.rotSpeed;

        if (h.y < -50) {
          h.y = height + 40;
          h.x = Math.random() * width;
        }

        drawHeart(
          ctx,
          h.x,
          h.y,
          h.size,
          loverMode ? '#c8b6ff' : h.color,
          h.opacity
        );
      });

      // Shooting Star
      spawnShootingStar();
      if (shootingStar) {
        ctx.save();
        ctx.beginPath();
        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
        const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
        grad.addColorStop(0, 'rgba(234, 154, 178, 0)');
        grad.addColorStop(0.7, 'rgba(250, 225, 156, 0.6)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.02;

        if (shootingStar.y > height || shootingStar.x > width || shootingStar.opacity <= 0) {
          shootingStar = null;
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [loverMode]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />
      {/* Easter Egg Micro Heart 1 (Bottom Left) */}
      {!foundHearts.includes('heart-space') && (
        <button
          onClick={() => collectMicroHeart('heart-space')}
          className="fixed bottom-4 left-4 z-10 w-4 h-4 opacity-30 hover:opacity-100 transition-opacity cursor-pointer text-xs"
          title="What's this tiny speck?"
          aria-label="Secret space heart"
        >
          💌
        </button>
      )}
    </>
  );
};
