// Ball class for Breakout

import { BALL } from '../constants/gameConfig';

export class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = BALL.RADIUS;
    this.speed = BALL.SPEED;
    this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
    this.dy = -this.speed;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  reverseX() {
    this.dx = -this.dx;
  }

  reverseY() {
    this.dy = -this.dy;
  }

  bounceOffPaddle(paddle) {
    const hitPos = (this.x - paddle.x) / paddle.width;
    this.dx = (hitPos - 0.5) * this.speed * 2;
    this.dy = -Math.abs(this.dy);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
    this.dy = -this.speed;
  }
}
