// Top Sınıfı
import { GAME_CONFIG } from '../constants/gameConfig';

export class Ball {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = GAME_CONFIG.CANVAS.WIDTH / 2;
    this.y = GAME_CONFIG.CANVAS.HEIGHT / 2;
    this.size = GAME_CONFIG.BALL.SIZE;
    this.speed = GAME_CONFIG.BALL.INITIAL_SPEED;

    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
    const direction = Math.random() < 0.5 ? 1 : -1;
    this.vx = Math.cos(angle) * this.speed * direction;
    this.vy = Math.sin(angle) * this.speed;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off top/bottom walls
    if (this.y - this.size / 2 <= 0 || this.y + this.size / 2 >= GAME_CONFIG.CANVAS.HEIGHT) {
      this.vy = -this.vy;
      this.y = Math.max(this.size / 2, Math.min(GAME_CONFIG.CANVAS.HEIGHT - this.size / 2, this.y));
    }
  }

  reverseX() {
    this.vx = -this.vx;
    this.increaseSpeed();
  }

  increaseSpeed() {
    if (this.speed < GAME_CONFIG.BALL.MAX_SPEED) {
      this.speed += GAME_CONFIG.BALL.SPEED_INCREMENT;
      const ratio = this.speed / Math.sqrt(this.vx ** 2 + this.vy ** 2);
      this.vx *= ratio;
      this.vy *= ratio;
    }
  }

  getBounds() {
    return {
      x: this.x - this.size / 2,
      y: this.y - this.size / 2,
      width: this.size,
      height: this.size,
    };
  }
}
