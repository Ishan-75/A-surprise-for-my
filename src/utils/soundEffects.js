// Web Audio API Procedural Synthesizer for LOVE.EXE
// Works without any external audio files, completely zero-latency and cross-browser.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = false;
    this.ambientGain = null;
    this.ambientInterval = null;
    this.volume = 0.6;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSfxEnabled(val) {
    this.sfxEnabled = val;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);
    }
  }

  // Soft tone generator helper
  playTone(freq, duration = 0.2, type = 'sine', gainVal = 0.1, pitchDecay = false) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (pitchDecay) {
        osc.frequency.exponentialRampToValueAtTime(freq * 0.3, this.ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(gainVal * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might still be waiting for user gesture
    }
  }

  // Click tick
  playClick() {
    this.playTone(800, 0.04, 'triangle', 0.05);
  }

  // Heart Catch Chime
  playHeartCatch() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.18, 'sine', 0.08);
      }, idx * 40);
    });
  }

  // Golden Heart Catch (Double chime + sparkle)
  playGoldHeart() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'triangle', 0.1);
      }, idx * 50);
    });
  }

  // Red Flag Penalty Sound (Comical buzz)
  playRedFlag() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  // Courtroom Gavel Thud
  playGavel() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Low impact strike
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.3 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);

      // Wood resonance slap
      setTimeout(() => {
        this.playTone(420, 0.08, 'sawtooth', 0.1, true);
      }, 20);
    } catch {}
  }

  // Vending Machine Capsule Pop
  playCapsulePop() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    // Pop sound
    this.playTone(320, 0.08, 'square', 0.1, true);
    // Sparkle reveal
    setTimeout(() => {
      const chord = [880, 1108.73, 1318.51, 1760];
      chord.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 0.3, 'sine', 0.07);
        }, idx * 60);
      });
    }, 120);
  }

  // Achievement Unlocked Fanfare
  playAchievement() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'triangle', 0.12);
      }, idx * 75);
    });
  }

  // Secret Unlocked Chime
  playSecret() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [587.33, 739.99, 880, 1174.66, 1479.98, 1760];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.4, 'sine', 0.08);
      }, idx * 70);
    });
  }

  // Quiz correct
  playQuizCorrect() {
    this.playHeartCatch();
  }

  // Quiz wrong
  playQuizWrong() {
    this.playRedFlag();
  }

  // Cute kiss chirp
  playKiss() {
    this.playTone(950, 0.1, 'sine', 0.08);
    setTimeout(() => this.playTone(1200, 0.15, 'sine', 0.09), 80);
  }

  // Warm hug swell
  playHug() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const chord = [261.63, 329.63, 392.00, 523.25]; // C major warm
    chord.forEach((f) => {
      this.playTone(f, 0.6, 'sine', 0.05);
    });
  }

  // Terminal keystroke blip
  playKeyBlip() {
    const freqs = [600, 750, 820, 900];
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    this.playTone(f, 0.025, 'triangle', 0.03);
  }

  // Procedural Romantic Lo-Fi Ambient Synth Generator
  startAmbientMusic() {
    this.init();
    if (!this.ctx) return;
    this.stopAmbientMusic();

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    // Romantic dreamy chord progression: Fmaj7 -> G -> Em7 -> Am7
    const chords = [
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [392.00, 493.88, 587.33, 698.46], // G7
      [329.63, 392.00, 493.88, 587.33], // Em7
      [440.00, 523.25, 659.25, 783.99], // Am7
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.ambientGain || !this.ctx) return;
      const currentNotes = chords[chordIdx % chords.length];
      chordIdx++;

      currentNotes.forEach((freq) => {
        try {
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
          noteGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.2);
          noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.8);

          osc.connect(noteGain);
          noteGain.connect(this.ambientGain);

          osc.start();
          osc.stop(this.ctx.currentTime + 3.9);
        } catch {}
      });
    };

    playChord();
    this.ambientInterval = setInterval(playChord, 3800);
  }

  stopAmbientMusic() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {}
    }
  }
}

export const sound = new SoundEngine();
export default sound;
