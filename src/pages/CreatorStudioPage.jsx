import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Lock, 
  Unlock, 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  FileCode, 
  AlertCircle, 
  Sparkles,
  Heart,
  Terminal,
  Trash2,
  Music,
  Plus,
  Upload,
  Play,
  Pause,
  Image as ImageIcon,
  Calendar,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { defaultSiteConfig } from '../data/siteConfig';
import sound from '../utils/soundEffects';

export const CreatorStudioPage = () => {
  const { 
    siteConfig, 
    updateSiteConfig, 
    resetSiteConfig, 
    clearAllProgress, 
    showToast,
    playlist,
    selectTrack,
    currentTrackIndex,
    musicPlaying,
    toggleMusic,
    memories,
    updateMemory,
    uploadMemoryPhoto
  } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ ...siteConfig });
  const [activeTab, setActiveTab] = useState('memories'); // 'memories', 'audio', 'names', 'intro', 'final', 'secrets', 'sync'
  const memoryPhotoInputRefs = useRef({});

  const handleLogin = (e) => {
    e.preventDefault();
    const correctCode = siteConfig.creatorStudioPasscode || "1402";
    const lower = passcode.trim().toLowerCase();
    if (passcode.trim() === correctCode || lower === "suganthi" || lower === "boyfriend") {
      sound.playAchievement();
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      sound.playRedFlag();
      setPasscodeError(true);
    }
  };

  const handleSave = () => {
    sound.playHeartCatch();
    updateSiteConfig(formData);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore default configuration?")) {
      sound.playClick();
      resetSiteConfig();
      setFormData(defaultSiteConfig);
    }
  };

  const handleCopyConfig = () => {
    sound.playClick();
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    showToast("Copied to Clipboard!", "Paste into src/data/siteConfig.js to persist permanently.");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
          <Settings className="w-3.5 h-3.5 text-pink-400" />
          <span>BOYFRIEND CONTROL ROOM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
          Creator Studio
        </h1>
        <p className="text-xs sm:text-sm text-pink-200/80 leading-relaxed font-medium">
          Customize background songs, memory photos, text messages, secret codes, and emotional letters.
        </p>
      </div>

      {!isAuthenticated ? (
        /* ================= PASSCODE LOCK SCREEN ================= */
        <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-pink-500/40 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center mx-auto mb-5 text-pink-400">
            <Lock className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Creator Authentication Required</h3>
          <p className="text-xs text-gray-300 mb-6">
            Enter your secret access code to customize LOVE.EXE. (Default access code is <code className="text-pink-400 font-bold">1402</code> or <code className="text-pink-400 font-bold">suganthi</code>).
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter access code..."
                className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-center font-mono text-base text-white focus:outline-none focus:border-pink-500"
                autoFocus
              />
              {passcodeError && (
                <span className="text-xs text-rose-400 mt-1 block">
                  Incorrect access code. Try '1402' or 'suganthi'!
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-500/30 hover:scale-102 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>ACCESS STUDIO</span>
            </button>
          </form>

          <div className="mt-6 text-[11px] text-gray-400 border-t border-white/10 pt-4">
            🔒 Client-side security notice: Used to keep your girlfriend from accidentally spoiling surprises before exploring.
          </div>
        </div>
      ) : (
        /* ================= STUDIO DASHBOARD ================= */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/30 shadow-2xl">
          {/* Top Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 mb-6">
            {[
              { id: 'memories', label: 'Memories & Photos 📸', icon: ImageIcon },
              { id: 'audio', label: 'Soundtrack 🎵', icon: Music },
              { id: 'names', label: 'Names & Characters', icon: Heart },
              { id: 'intro', label: 'Intro & Welcome', icon: Sparkles },
              { id: 'final', label: 'Final Love Letter', icon: FileCode },
              { id: 'secrets', label: 'Secret Console Codes', icon: Terminal },
              { id: 'sync', label: 'Code Export & Reset', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#941b36] via-[#b82e4f] to-[#ea9ab2] text-white shadow-md shadow-[#b82e4f]/30'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ================= TAB: BACKGROUND SONGS (FIXED IN CODE) ================= */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2 font-album">
                  <Music className="w-4 h-4 text-[#ea9ab2]" /> Soundtrack (Configured in Code)
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-poetic text-sm">
                  Your website songs are configured directly in the code at <code className="text-[#fae19c] font-mono">src/data/playlist.js</code>.
                </p>
              </div>

              {/* Instructions Box */}
              <div className="p-4 bg-black/40 rounded-2xl border border-[#ea9ab2]/30 space-y-2">
                <span className="text-xs font-bold text-[#fae19c] uppercase tracking-wider block font-mono">
                  💡 How to add or change songs in code:
                </span>
                <ol className="text-xs text-gray-300 list-decimal list-inside space-y-1 leading-relaxed font-mono">
                  <li>Copy your music file into the folder: <span className="text-white">public/audio/</span></li>
                  <li>Open <span className="text-[#fae19c]">src/data/playlist.js</span> and add or update the track entry:</li>
                </ol>
                <pre className="p-3 bg-black/70 rounded-xl text-[11px] text-[#ea9ab2] font-mono overflow-x-auto border border-white/5">
{`{
  id: "track-daylight",
  title: "Daylight",
  artist: "Taylor Swift",
  type: "file",
  src: "/audio/Taylor Swift - Daylight (Official Audio)(MP3_160K).mp3"
}`}
                </pre>
              </div>

              {/* Current Playlist View */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block font-mono mb-2">
                  Active Fixed Playlist ({playlist.length} {playlist.length === 1 ? 'Track' : 'Tracks'})
                </span>
                <div className="space-y-2">
                  {playlist.map((track, idx) => {
                    const isActive = currentTrackIndex === idx;
                    return (
                      <div
                        key={track.id || idx}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                          isActive
                            ? 'bg-[#b82e4f]/25 border-[#ea9ab2]/50 text-white'
                            : 'bg-white/[0.02] border-white/10 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => {
                              selectTrack(idx);
                              if (!musicPlaying) toggleMusic();
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
                              isActive && musicPlaying
                                ? 'bg-gradient-to-r from-[#941b36] to-[#b82e4f] text-white shadow-md shadow-[#b82e4f]/40'
                                : 'bg-white/10 text-gray-300 hover:text-white'
                            }`}
                          >
                            {isActive && musicPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                          </button>
                          <div className="truncate">
                            <span className="text-sm font-bold text-white block truncate font-album">{track.title}</span>
                            <span className="text-xs text-gray-400 block truncate font-poetic">
                              {track.artist} • <span className="font-mono text-[10px] text-[#fae19c]">{track.src || 'Procedural Synth'}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive && (
                            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                              ACTIVE
                            </span>
                          )}
                          <button
                            onClick={() => selectTrack(idx)}
                            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: MEMORIES & PHOTOS ================= */}
          {activeTab === 'memories' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" /> Memory Galaxy Photos & Stories
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Update photo files, titles, dates, stories, and audio voice captions for each constellation star.
                </p>
              </div>

              <div className="space-y-4">
                {memories.map((mem) => (
                  <div key={mem.id} className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-[#120726] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {mem.photoUrl ? (
                            <img src={mem.photoUrl} alt={mem.title} className="w-full h-full object-cover" />
                          ) : (
                            <Sparkles className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 font-bold">{mem.tag}</span>
                          <h4 className="text-sm font-bold text-white">{mem.title}</h4>
                        </div>
                      </div>

                      {/* Photo Upload Button */}
                      <div>
                        <input
                          type="file"
                          ref={(el) => (memoryPhotoInputRefs.current[mem.id] = el)}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadMemoryPhoto(mem.id, file);
                          }}
                          className="hidden"
                        />
                        <button
                          onClick={() => memoryPhotoInputRefs.current[mem.id]?.click()}
                          className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Title</label>
                        <input
                          type="text"
                          value={mem.title}
                          onChange={(e) => updateMemory(mem.id, { title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Date Caption</label>
                        <input
                          type="text"
                          value={mem.date}
                          onChange={(e) => updateMemory(mem.id, { date: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Story</label>
                      <textarea
                        rows={2}
                        value={mem.story}
                        onChange={(e) => updateMemory(mem.id, { story: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: NAMES ================= */}
          {activeTab === 'names' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Characters & Display Names</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 block mb-1 font-mono">Girlfriend's Name</label>
                  <input
                    type="text"
                    value={formData.girlfriendName}
                    onChange={(e) => setFormData({ ...formData, girlfriendName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1 font-mono">Girlfriend's Nickname</label>
                  <input
                    type="text"
                    value={formData.girlfriendNickname}
                    onChange={(e) => setFormData({ ...formData, girlfriendNickname: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1 font-mono">Boyfriend's Name</label>
                  <input
                    type="text"
                    value={formData.boyfriendName}
                    onChange={(e) => setFormData({ ...formData, boyfriendName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1 font-mono">Project Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: INTRO ================= */}
          {activeTab === 'intro' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Intro Sequence & Welcome Screen</h3>
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-mono">Welcome Title</label>
                <input
                  type="text"
                  value={formData.welcomeTitle}
                  onChange={(e) => setFormData({ ...formData, welcomeTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-mono">Welcome Subtitle</label>
                <input
                  type="text"
                  value={formData.welcomeSubtitle}
                  onChange={(e) => setFormData({ ...formData, welcomeSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-mono">Alert 404 Message</label>
                <textarea
                  rows={2}
                  value={formData.alertMessage}
                  onChange={(e) => setFormData({ ...formData, alertMessage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          )}

          {/* ================= TAB: FINAL ================= */}
          {activeTab === 'final' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Final Surprise Love Letter</h3>
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-mono">Letter Title</label>
                <input
                  type="text"
                  value={formData.finalSurprise?.title || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    finalSurprise: { ...formData.finalSurprise, title: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-mono">Final Reveal Closing Line</label>
                <input
                  type="text"
                  value={formData.finalSurprise?.closing || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    finalSurprise: { ...formData.finalSurprise, closing: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-mono">Paragraph 1</label>
                <textarea
                  rows={2}
                  value={formData.finalSurprise?.paragraphs?.[0] || ''}
                  onChange={(e) => {
                    const pars = [...(formData.finalSurprise?.paragraphs || [])];
                    pars[0] = e.target.value;
                    setFormData({ ...formData, finalSurprise: { ...formData.finalSurprise, paragraphs: pars } });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-mono">Paragraph 2</label>
                <textarea
                  rows={2}
                  value={formData.finalSurprise?.paragraphs?.[1] || ''}
                  onChange={(e) => {
                    const pars = [...(formData.finalSurprise?.paragraphs || [])];
                    pars[1] = e.target.value;
                    setFormData({ ...formData, finalSurprise: { ...formData.finalSurprise, paragraphs: pars } });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          )}

          {/* ================= TAB: SECRETS ================= */}
          {activeTab === 'secrets' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Hacker Terminal Codewords</h3>
              <p className="text-xs text-gray-300">
                These codewords can be typed into the Cyber Console modal.
              </p>
              <div className="space-y-3">
                {Object.entries(formData.secretCodes || {}).map(([code, response]) => (
                  <div key={code} className="p-3 bg-black/30 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-500/30">
                      {code}
                    </span>
                    <span className="text-xs text-gray-200 flex-1 ml-2">{response}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: SYNC & RESET ================= */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                <h4 className="text-sm font-bold text-purple-200 mb-1 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-purple-400" /> Permanent Source Code Persistence
                </h4>
                <p className="text-xs text-purple-300/80 leading-relaxed mb-4">
                  Changes saved in the Creator Studio are saved to your browser's local storage and IndexedDB. To make custom texts permanent across fresh browsers or when deploying to Vercel/Netlify, click below to copy the JSON and paste it into <code className="text-pink-300 font-mono">src/data/siteConfig.js</code>!
                </p>
                <button
                  onClick={handleCopyConfig}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "COPIED TO CLIPBOARD" : "COPY SITE CONFIG JSON"}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                <h4 className="text-sm font-bold text-rose-300 mb-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" /> Factory Reset Options
                </h4>
                <p className="text-xs text-rose-200/80 mb-4">
                  Reset config to defaults or wipe all testing progress (scores, trophies, secrets) so Suganthi can experience everything fresh from 0%.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    Restore Default Texts
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Wipe all achievements, high scores, and opened secrets?")) {
                        clearAllProgress();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Wipe Progression for Fresh Experience
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              * Edits are applied immediately across all screens.
            </span>
            <button
              onClick={handleSave}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE CONFIGURATION</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
