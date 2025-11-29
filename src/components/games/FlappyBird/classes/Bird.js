// Kuş Sınıfı
import { GAME_CONFIG } from '../constants/gameConfig';

export class Bird {
  constructor() {
    this.x = GAME_CONFIG.BIRD.X;
    this.y = GAME_CONFIG.CANVAS.HEIGHT / 2;
    this.velocity = 0;
    this.size = GAME_CONFIG.BIRD.SIZE;
    this.gravity = GAME_CONFIG.BIRD.GRAVITY;
    this.jumpStrength = GAME_CONFIG.BIRD.JUMP_STRENGTH;
    this.rotation = 0;
  }

  jump() {
    this.velocity = this.jumpStrength;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Rotation based on velocity
    this.rotation = Math.min(Math.max(this.velocity * 3, -30), 90);

    // Clamp position
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
    if (this.y > GAME_CONFIG.CANVAS.HEIGHT - this.size) {
      this.y = GAME_CONFIG.CANVAS.HEIGHT - this.size;
      this.velocity = 0;
    }
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size,
    };
  }

  reset() {
    this.y = GAME_CONFIG.CANVAS.HEIGHT / 2;
    this.velocity = 0;
    this.rotation = 0;
  }
}
