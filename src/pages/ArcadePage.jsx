import React, { useState } from 'react';
import { Gamepad2, HelpCircle, Award } from 'lucide-react';
import { CatchMyLove } from '../games/CatchMyLove';
import { RelationshipQuiz } from '../games/RelationshipQuiz';
import { BoyfriendChallenge } from '../games/BoyfriendChallenge';
import sound from '../utils/soundEffects';

export const ArcadePage = () => {
  const [activeTab, setActiveTab] = useState('catch'); // 'catch', 'quiz', 'challenges'

  const tabs = [
    { id: 'catch', label: 'Catch My Love', icon: Gamepad2, desc: 'Fast-paced arcade reflex game' },
    { id: 'quiz', label: 'How Well Do You Know Us?', icon: HelpCircle, desc: 'Funny relationship quiz' },
    { id: 'challenges', label: 'Boyfriend Challenges', icon: Award, desc: 'Silly titles & achievements' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ea9ab2]/15 border border-[#ea9ab2]/35 text-[#fae19c] text-xs font-semibold mb-3">
          <Gamepad2 className="w-3.5 h-3.5 text-[#ea9ab2]" />
          <span>SUGANTHI'S ARCADE ZONE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-album font-bold text-white tracking-tight mb-3">
          Girlfriend Arcade
        </h1>
        <p className="text-sm sm:text-base text-[#f7d6e0]/85 font-poetic text-lg sm:text-xl leading-relaxed italic">
          Play interactive games, test how well we know each other, and collect silly relationship trophies!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id);
              }}
              className={`flex-1 min-w-[150px] py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white shadow-lg shadow-[#b82e4f]/35 scale-102 border border-[#ea9ab2]/40'
                  : 'glass-panel text-gray-300 hover:text-white hover:bg-white/10 border-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'catch' && <CatchMyLove />}
        {activeTab === 'quiz' && <RelationshipQuiz />}
        {activeTab === 'challenges' && <BoyfriendChallenge />}
      </div>
    </div>
  );
};
