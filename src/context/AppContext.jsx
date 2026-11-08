import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { defaultSiteConfig } from '../data/siteConfig';
import { defaultAchievements } from '../data/achievements';
import { defaultSurprises } from '../data/surprises';
import { defaultPlaylist } from '../data/playlist';
import { defaultEasterEggs } from '../data/easterEggs';
import { defaultMemories } from '../data/memoryData';
import { saveMediaBlob, getMediaBlob, deleteMediaBlob } from '../utils/mediaStorage';
import sound from '../utils/soundEffects';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  CONFIG: 'love_exe_site_config_v1',
  INTRO: 'love_exe_has_seen_intro',
  ACHIEVEMENTS: 'love_exe_unlocked_achievements',
  ARCADE_SCORE: 'love_exe_arcade_highscore',
  QUIZ_SCORE: 'love_exe_quiz_score',
  SURPRISES: 'love_exe_unlocked_surprises',
  COUPONS: 'love_exe_redeemed_coupons',
  SECRETS: 'love_exe_discovered_secrets',
  FOUND_HEARTS: 'love_exe_found_micro_hearts',
  PLAYLIST: 'love_exe_custom_playlist_v2',
  MEMORIES: 'love_exe_custom_memories_v2',
  SETTINGS: 'love_exe_settings',
};

export const AppProvider = ({ children }) => {
  // 1. Site Config (with localStorage override for Creator Studio)
  const [siteConfig, setSiteConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? { ...defaultSiteConfig, ...JSON.parse(saved) } : defaultSiteConfig;
    } catch {
      return defaultSiteConfig;
    }
  });

  // 2. Intro Seen State
  const [hasSeenIntro, setHasSeenIntroState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.INTRO) === 'true';
    } catch {
      return false;
    }
  });

  const setHasSeenIntro = (seen) => {
    setHasSeenIntroState(seen);
    try {
      localStorage.setItem(STORAGE_KEYS.INTRO, String(seen));
    } catch {}
  };

  // 3. Audio & SFX settings
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioError, setAudioError] = useState(null);

  // Fixed Playlist defined directly in src/data/playlist.js
  const playlist = defaultPlaylist;

  // Clean up any old dynamic playlist storage to ensure code configuration takes precedence
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PLAYLIST);
    } catch {}
  }, []);

  const addCustomTrack = async () => {};
  const removeTrack = async () => {};

  // 4. Memory Galaxy data with persistence and custom image uploads
  const [memories, setMemories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return defaultMemories;
  });

  // Restore any IndexedDB memory photo blobs on mount
  useEffect(() => {
    let isMounted = true;
    const restoreMemoryPhotos = async () => {
      let changed = false;
      const updatedMemories = await Promise.all(
        memories.map(async (mem) => {
          if (mem.photoBlobKey) {
            try {
              const blob = await getMediaBlob(mem.photoBlobKey);
              if (blob) {
                const objectUrl = URL.createObjectURL(blob);
                changed = true;
                return { ...mem, photoUrl: objectUrl };
              }
            } catch (err) {
              console.warn('Failed to restore photo blob', err);
            }
          }
          return mem;
        })
      );

      if (changed && isMounted) {
        setMemories(updatedMemories);
      }
    };

    restoreMemoryPhotos();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveMemoriesToStorage = (mems) => {
    try {
      const serializable = mems.map((m) => ({
        ...m,
        photoUrl: m.photoBlobKey ? '' : m.photoUrl
      }));
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(serializable));
    } catch {}
  };

  // Update memory fields
  const updateMemory = (id, fields) => {
    const updated = memories.map((m) => (m.id === id ? { ...m, ...fields } : m));
    setMemories(updated);
    saveMemoriesToStorage(updated);
    showToast('Memory Updated! ✨', 'Your changes have been saved.');
  };

  // Upload custom photo for memory
  const uploadMemoryPhoto = async (id, file) => {
    if (!file) return;
    const blobKey = `photo_${id}_${Date.now()}`;
    await saveMediaBlob(blobKey, file);
    const objectUrl = URL.createObjectURL(file);

    const updated = memories.map((m) =>
      m.id === id ? { ...m, photoUrl: objectUrl, photoBlobKey: blobKey } : m
    );
    setMemories(updated);
    saveMemoriesToStorage(updated);
    sound.playHeartCatch();
    showToast('Photo Uploaded! 📸', 'New photo saved for this memory.');
  };

  // 5. Lover Mode (Rainbow effect)
  const [loverMode, setLoverMode] = useState(false);

  // 6. Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = useCallback((title, subtitle, icon = '💖', duration = 4000) => {
    setToast({ title, subtitle, icon });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, duration);
  }, []);

  // 7. Achievements
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const unlockAchievement = useCallback((achId) => {
    setUnlockedAchievements((prev) => {
      if (prev[achId]) return prev;
      const achievement = defaultAchievements.find((a) => a.id === achId);
      if (!achievement) return prev;

      sound.playAchievement();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff2d75', '#9b5de5', '#00f5d4', '#ffd166']
        });
      } catch {}

      showToast(`Achievement Unlocked!`, `${achievement.icon} ${achievement.title}: ${achievement.subtitle}`);

      const updated = {
        ...prev,
        [achId]: {
          unlockedAt: new Date().toISOString(),
          ...achievement
        }
      };
      try {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [showToast]);

  // 8. Arcade High Score
  const [arcadeHighScore, setArcadeHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.ARCADE_SCORE) || '0', 10);
    } catch {
      return 0;
    }
  });

  const updateArcadeHighScore = (score) => {
    if (score > arcadeHighScore) {
      setArcadeHighScore(score);
      try {
        localStorage.setItem(STORAGE_KEYS.ARCADE_SCORE, String(score));
      } catch {}
      if (score >= 15) {
        unlockAchievement('ach-heart-catcher');
      }
      if (score >= 35) {
        unlockAchievement('ach-red-flag-dodger');
      }
    }
  };

  // 9. Quiz High Score
  const [quizScore, setQuizScoreState] = useState(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.QUIZ_SCORE) || '0', 10);
    } catch {
      return 0;
    }
  });

  const recordQuizCompletion = (score) => {
    setQuizScoreState(score);
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_SCORE, String(score));
    } catch {}
    unlockAchievement('ach-certified-quiz');
  };

  // 10. Unlocked Vending Capsules
  const [unlockedSurprises, setUnlockedSurprises] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SURPRISES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addUnlockedSurprise = (surpriseId) => {
    setUnlockedSurprises((prev) => {
      if (prev.includes(surpriseId)) return prev;
      const next = [...prev, surpriseId];
      try {
        localStorage.setItem(STORAGE_KEYS.SURPRISES, JSON.stringify(next));
      } catch {}
      if (next.length >= 3) {
        unlockAchievement('ach-vending-addict');
      }
      return next;
    });
  };

  // 11. Redeemed Coupons
  const [redeemedCoupons, setRedeemedCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const redeemCoupon = (id) => {
    setRedeemedCoupons((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(next));
      } catch {}
      sound.playCapsulePop();
      showToast('Coupon Claimed!', 'Your boyfriend has been notified to fulfill this order ❤️');
      return next;
    });
  };

  // 12. Discovered Secrets & Easter Eggs
  const [discoveredSecrets, setDiscoveredSecrets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECRETS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const discoverSecret = (secretId) => {
    setDiscoveredSecrets((prev) => {
      if (prev.includes(secretId)) return prev;
      const next = [...prev, secretId];
      try {
        localStorage.setItem(STORAGE_KEYS.SECRETS, JSON.stringify(next));
      } catch {}

      sound.playSecret();
      const egg = defaultEasterEggs.find((e) => e.id === secretId);
      showToast('Secret Discovered! 🕵️‍♀️', egg ? egg.name : 'You found a secret!', '✨');

      if (next.length >= 3) {
        unlockAchievement('ach-secret-agent');
      }
      return next;
    });
  };

  // 13. Micro-Hearts Collector
  const [foundHearts, setFoundHearts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOUND_HEARTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const collectMicroHeart = (heartId) => {
    setFoundHearts((prev) => {
      if (prev.includes(heartId)) return prev;
      const next = [...prev, heartId];
      try {
        localStorage.setItem(STORAGE_KEYS.FOUND_HEARTS, JSON.stringify(next));
      } catch {}
      sound.playHeartCatch();
      showToast(`Hidden Heart Found! (${next.length}/5)`, 'Keep looking for more secret hearts in the cosmos!');
      if (next.length >= 5) {
        discoverSecret('egg-hidden-hearts-all');
      }
      return next;
    });
  };

  // Audio Handlers
  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    sound.setSfxEnabled(next);
  };

  const setVolume = (val) => {
    setVolumeState(val);
    sound.setVolume(val);
  };

  const startMusic = () => {
    const currentTrack = playlist[currentTrackIndex];
    if (currentTrack?.type === 'synth') {
      sound.startAmbientMusic();
    }
    setMusicPlaying(true);
  };

  const toggleMusic = () => {
    const currentTrack = playlist[currentTrackIndex];
    if (musicPlaying) {
      if (currentTrack?.type === 'synth') {
        sound.stopAmbientMusic();
      }
      setMusicPlaying(false);
    } else {
      if (currentTrack?.type === 'synth') {
        sound.startAmbientMusic();
      }
      setMusicPlaying(true);
    }
  };

  const changeTrack = (direction) => {
    const wasPlaying = musicPlaying;
    if (wasPlaying) {
      sound.stopAmbientMusic();
      setMusicPlaying(false);
    }
    const nextIdx = (currentTrackIndex + direction + playlist.length) % playlist.length;
    setCurrentTrackIndex(nextIdx);
    setAudioError(null);

    if (wasPlaying) {
      setTimeout(() => {
        const nextTrack = playlist[nextIdx];
        if (nextTrack?.type === 'synth') {
          sound.startAmbientMusic();
          setMusicPlaying(true);
        } else {
          setMusicPlaying(true);
        }
      }, 100);
    }
  };

  const selectTrack = (index) => {
    sound.playClick();
    sound.stopAmbientMusic();
    setCurrentTrackIndex(index);
    setAudioError(null);
    setMusicPlaying(true);
    const targetTrack = playlist[index];
    if (targetTrack?.type === 'synth') {
      sound.startAmbientMusic();
    }
  };

  // Update site config from Creator Studio
  const updateSiteConfig = (newConfig) => {
    setSiteConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
    } catch {}
    showToast('Saved!', 'Settings and texts updated successfully.');
  };

  const resetSiteConfig = () => {
    setSiteConfig(defaultSiteConfig);
    try {
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
    } catch {}
    showToast('Reset Complete', 'Default values restored.');
  };

  const clearAllProgress = () => {
    localStorage.clear();
    setHasSeenIntroState(false);
    setUnlockedAchievements({});
    setArcadeHighScore(0);
    setQuizScoreState(0);
    setUnlockedSurprises([]);
    setRedeemedCoupons([]);
    setDiscoveredSecrets([]);
    setFoundHearts([]);
    setPlaylist(defaultPlaylist);
    setMemories(defaultMemories);
    showToast('Universe Reset', 'All progression has been reset.');
  };

  return (
    <AppContext.Provider
      value={{
        siteConfig,
        updateSiteConfig,
        resetSiteConfig,
        hasSeenIntro,
        setHasSeenIntro,
        sfxEnabled,
        toggleSfx,
        musicPlaying,
        setMusicPlaying,
        startMusic,
        toggleMusic,
        volume,
        setVolume,
        currentTrackIndex,
        changeTrack,
        selectTrack,
        playlist,
        addCustomTrack,
        removeTrack,
        audioError,
        setAudioError,
        memories,
        updateMemory,
        uploadMemoryPhoto,
        unlockedAchievements,
        unlockAchievement,
        arcadeHighScore,
        updateArcadeHighScore,
        quizScore,
        recordQuizCompletion,
        unlockedSurprises,
        addUnlockedSurprise,
        redeemedCoupons,
        redeemCoupon,
        discoveredSecrets,
        discoverSecret,
        foundHearts,
        collectMicroHeart,
        loverMode,
        setLoverMode,
        toast,
        showToast,
        clearAllProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
