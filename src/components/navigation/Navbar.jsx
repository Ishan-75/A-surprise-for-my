import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Gamepad2, 
  Scale, 
  Sparkles, 
  Trophy, 
  Terminal, 
  Settings, 
  Compass, 
  Menu, 
  X, 
  Gift, 
  Star,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import sound from '../../utils/soundEffects';

export const Navbar = ({ onOpenTerminal, onOpenTrophies }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    siteConfig, 
    unlockedAchievements, 
    discoveredSecrets, 
    discoverSecret, 
    loverMode, 
    setLoverMode
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [starClicks, setStarClicks] = useState(0);

  const achievementCount = Object.keys(unlockedAchievements).length;
  const secretsCount = discoveredSecrets.length;

  // Easter Egg 7: Click Logo 3 times for Lover Mode
  const handleLogoClick = (e) => {
    e.preventDefault();
    sound.playClick();
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 3) {
      setLoverMode(!loverMode);
      discoverSecret('egg-konami-lover-mode');
      setLogoClicks(0);
    }
    navigate('/universe');
  };

  // Easter Egg 1: Click star 5 times
  const handleStarClick = () => {
    sound.playClick();
    const next = starClicks + 1;
    setStarClicks(next);
    if (next >= 5) {
      discoverSecret('egg-corner-star');
      setStarClicks(0);
    }
  };

  const navItems = [
    { name: 'Universe', path: '/universe', icon: Compass },
    { name: 'Arcade', path: '/arcade', icon: Gamepad2 },
    { name: 'Boyfriend Court', path: '/court', icon: Scale },
    { name: 'Vending Machine', path: '/vending-machine', icon: Gift },
    { name: 'Memory Galaxy', path: '/memory-galaxy', icon: Sparkles },
    { name: 'The Final Surprise', path: '/final-surprise', icon: Heart, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 border-b border-[#ea9ab2]/15 glass-panel">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Pulsing Wish Star */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            title="Click 3 times to trigger Hyper Lover Mode!"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#941b36] via-[#b82e4f] to-[#ea9ab2] flex items-center justify-center shadow-md shadow-[#b82e4f]/35 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white animate-heartbeat" />
            </div>
            <div>
              <span className={`font-album text-lg font-bold tracking-wide transition-all duration-300 ${
                loverMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ea9ab2] via-[#fae19c] to-[#c8b6ff] animate-pulse' 
                  : 'text-[#f7f3f6]'
              }`}>
                {siteConfig.projectName}
              </span>
              <span className="hidden sm:block text-[10px] text-[#ea9ab2]/80 tracking-widest font-mono uppercase">
                {siteConfig.girlfriendName} Edition
              </span>
            </div>
          </button>

          {/* Secret Wish Star (Easter Egg 1) */}
          <button
            onClick={handleStarClick}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#fae19c]/60 hover:text-[#fae19c] hover:scale-125 transition-all cursor-pointer"
            title="A curious little star..."
            aria-label="Twinkling wish star"
          >
            <Star className={`w-3.5 h-3.5 ${starClicks > 0 ? 'fill-[#fae19c] text-[#fae19c] animate-spin' : ''}`} />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => sound.playClick()}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white shadow-md shadow-[#b82e4f]/40 font-semibold'
                      : 'bg-[#ea9ab2]/15 text-[#fae19c] border border-[#ea9ab2]/30 shadow-inner'
                    : item.highlight
                    ? 'text-[#ea9ab2] hover:text-[#fae19c] hover:bg-[#ea9ab2]/10 border border-[#ea9ab2]/25'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-[#ea9ab2] fill-[#ea9ab2]' : ''}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-2">
          {/* Trophy Room Modal Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenTrophies) onOpenTrophies();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1e1333]/70 border border-[#c8b6ff]/30 hover:border-[#c8b6ff] text-[#c8b6ff] text-xs transition-colors cursor-pointer"
            title="View Trophies & Badges"
          >
            <Trophy className="w-3.5 h-3.5 text-[#fae19c]" />
            <span className="font-mono text-[11px] font-bold">{achievementCount}/10</span>
          </button>

          {/* Secrets Tracker */}
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenTerminal) onOpenTerminal();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a0f26]/70 border border-[#ea9ab2]/30 hover:border-[#ea9ab2] text-[#ea9ab2] text-xs transition-colors cursor-pointer"
            title="Discovered Secrets & Hacker Terminal"
          >
            <Eye className="w-3.5 h-3.5 text-[#ea9ab2]" />
            <span className="font-mono text-[11px] font-bold">{secretsCount}/8</span>
          </button>

          {/* Terminal Console Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenTerminal) onOpenTerminal();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#ea9ab2] border border-white/10 transition-colors cursor-pointer"
            title="Open Secret Cyber Terminal"
            aria-label="Secret Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Creator Studio Link */}
          <NavLink
            to="/creator-studio"
            onClick={() => sound.playClick()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#ea9ab2] border border-white/10 transition-colors cursor-pointer"
            title="Creator Studio (Content Editor)"
            aria-label="Creator Studio"
          >
            <Settings className="w-4 h-4" />
          </NavLink>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#b82e4f]/25 to-[#ea9ab2]/25 text-[#fae19c] border border-[#ea9ab2]/35'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-[#ea9ab2]' : ''}`} />
                <span>{item.name}</span>
                {item.highlight && <span className="ml-auto text-[10px] bg-[#b82e4f] text-white px-2 py-0.5 rounded-full font-bold">ROMANTIC</span>}
              </NavLink>
            );
          })}

          <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between px-2 text-xs text-gray-400">
            <span>Secrets Found: {secretsCount}/8</span>
            <span>Achievements: {achievementCount}/10</span>
          </div>
        </div>
      )}
    </header>
  );
};
