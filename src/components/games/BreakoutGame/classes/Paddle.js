// Raket Sınıfı
import { GAME_CONFIG } from '../constants/gameConfig';

export class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = GAME_CONFIG.PADDLE.WIDTH;
    this.height = GAME_CONFIG.PADDLE.HEIGHT;
    this.speed = GAME_CONFIG.PADDLE.SPEED;
    this.baseWidth = GAME_CONFIG.PADDLE.WIDTH;
  }

  moveLeft(canvasWidth) {
    this.x = Math.max(0, this.x - this.speed);
  }

  moveRight(canvasWidth) {
    this.x = Math.min(canvasWidth - this.width, this.x + this.speed);
  }

  expand() {
    this.width = this.baseWidth * 1.5;
  }

  resetWidth() {
    this.width = this.baseWidth;
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
