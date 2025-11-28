// === Farm Dominion v5 - ui.js ===
export class UIManager {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");
    this.loadingBar = document.getElementById("loading-bar");
    this.posEl = document.getElementById("hud-pos");
    this.timeEl = document.getElementById("hud-time");
    this.fpsEl = document.getElementById("hud-fps");
    this.lastTime = performance.now();
    this.frames = 0;
    this.fps = 0;
  }

  updateProgress(percent) {
    this.loadingBar.style.width = `${percent}%`;
  }

  hideLoading() {
    this.loadingScreen.style.opacity = 0;
    setTimeout(() => (this.loadingScreen.style.display = "none"), 1000);
  }

  updateHUD(position, time) {
    this.posEl.textContent = `📍 Pozisyon: ${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}`;
    this.timeEl.textContent = `⏰ Zaman: ${time.toFixed(2)}s`;

    this.frames++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = now;
      this.fpsEl.textContent = `🎮 FPS: ${this.fps}`;
    }
  }
}
