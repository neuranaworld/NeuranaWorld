/**
 * Ses Motoru
 * Web Audio API kullanarak oyun ses efektlerini yöneten sınıf
 */

class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playMatch(matchLength) {
    const baseFreq = 400 + (matchLength * 100);
    this.playTone(baseFreq, 0.15, 'triangle', 0.2);
    setTimeout(() => this.playTone(baseFreq * 1.5, 0.1, 'sine', 0.15), 50);
  }

  playSwap() {
    this.playTone(600, 0.1, 'sine', 0.15);
    setTimeout(() => this.playTone(800, 0.08, 'sine', 0.1), 60);
  }

  playCombo(comboLevel) {
    const notes = [523, 587, 659, 784, 880];
    const freq = notes[Math.min(comboLevel - 1, notes.length - 1)];
    this.playTone(freq, 0.2, 'square', 0.25);
    setTimeout(() => this.playTone(freq * 2, 0.15, 'sine', 0.2), 80);
  }

  playLevelComplete() {
    const melody = [523, 659, 784, 1047];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'triangle', 0.2), i * 150);
    });
  }

  playPowerUp() {
    this.playTone(800, 0.1, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(1200, 0.15, 'sine', 0.25), 80);
  }

  playBomb() {
    this.playTone(200, 0.3, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(100, 0.2, 'square', 0.25), 100);
  }

  playRainbow() {
    [400, 500, 600, 700, 800, 900, 1000].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 'sine', 0.15), i * 50);
    });
  }
}

export const audioEngine = new AudioEngine();
