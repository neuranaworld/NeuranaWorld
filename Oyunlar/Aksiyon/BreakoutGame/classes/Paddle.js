// Paddle class for Breakout

import { PADDLE } from '../constants/gameConfig';

export class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = PADDLE.WIDTH;
    this.height = PADDLE.HEIGHT;
    this.speed = PADDLE.SPEED;
  }

  moveLeft() {
    this.x = Math.max(0, this.x - this.speed);
  }

  moveRight(canvasWidth) {
    this.x = Math.min(canvasWidth - this.width, this.x + this.speed);
  }

  expand() {
    this.width = Math.min(PADDLE.EXPAND_WIDTH, this.width + PADDLE.EXPAND_BONUS);
  }

  reset() {
    this.width = PADDLE.WIDTH;
  }
}
