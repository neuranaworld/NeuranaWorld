// Ses Sistemi
export class AudioEngine {
  constructor() {
    this.enabled = true;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  playSound(type) {
    if (!this.enabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch(type) {
      case 'draw':
        oscillator.frequency.value = 300;
        gainNode.gain.value = 0.1;
        break;
      case 'discard':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.15;
        break;
      case 'select':
        oscillator.frequency.value = 400;
        gainNode.gain.value = 0.05;
        break;
      default:
        oscillator.frequency.value = 250;
        gainNode.gain.value = 0.1;
    }

    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  playDraw() {
    this.playSound('draw');
  }

  playDiscard() {
    this.playSound('discard');
  }

  playSelect() {
    this.playSound('select');
  }
}

export const audioEngine = new AudioEngine();
