// Raket Sınıfı
import { GAME_CONFIG } from '../constants/gameConfig';

export class Paddle {
  constructor(isLeft) {
    this.width = GAME_CONFIG.PADDLE.WIDTH;
    this.height = GAME_CONFIG.PADDLE.HEIGHT;
    this.speed = GAME_CONFIG.PADDLE.SPEED;
    this.y = GAME_CONFIG.CANVAS.HEIGHT / 2 - this.height / 2;
    this.x = isLeft ? 20 : GAME_CONFIG.CANVAS.WIDTH - 20 - this.width;
  }

  moveUp() {
    this.y = Math.max(0, this.y - this.speed);
  }

  moveDown() {
    this.y = Math.min(GAME_CONFIG.CANVAS.HEIGHT - this.height, this.y + this.speed);
  }

  moveTo(targetY) {
    const center = this.y + this.height / 2;
    if (Math.abs(targetY - center) > 5) {
      if (targetY > center) {
        this.moveDown();
      } else {
        this.moveUp();
      }
    }
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
