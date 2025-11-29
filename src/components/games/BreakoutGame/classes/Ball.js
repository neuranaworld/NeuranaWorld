// Top Sınıfı
import { GAME_CONFIG } from '../constants/gameConfig';

export class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = GAME_CONFIG.BALL.RADIUS;
    this.speed = GAME_CONFIG.BALL.SPEED;
    this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
    this.dy = -this.speed;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  bounceX() {
    this.dx = -this.dx;
  }

  bounceY() {
    this.dy = -this.dy;
  }

  setSpeed(speed) {
    const ratio = speed / this.speed;
    this.dx *= ratio;
    this.dy *= ratio;
    this.speed = speed;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
    this.dy = -this.speed;
  }

  getBounds() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    };
  }
}
