// Player class for SkyJumper

import { PLAYER } from '../constants/gameConfig';

export class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = PLAYER.INIT_X;
    this.y = PLAYER.INIT_Y;
    this.width = PLAYER.WIDTH;
    this.height = PLAYER.HEIGHT;
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = PLAYER.GRAVITY;
    this.jumpPower = PLAYER.JUMP_POWER;
    this.maxVelocityX = PLAYER.MAX_VELOCITY_X;
    this.animFrame = 0;
    this.rotation = 0;
    this.trail = [];
  }

  update(keys, canvasWidth, timeScale, jetpack) {
    // Horizontal movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      this.velocityX = Math.max(-this.maxVelocityX, this.velocityX - 0.8);
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      this.velocityX = Math.min(this.maxVelocityX, this.velocityX + 0.8);
    } else {
      this.velocityX *= PLAYER.FRICTION;
    }

    this.x += this.velocityX;

    // Screen wrap
    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;

    // Jetpack or normal physics
    if (jetpack) {
      this.velocityY = -12;
    } else {
      this.velocityY += this.gravity * timeScale;
    }

    this.y += this.velocityY * timeScale;
    this.animFrame++;

    // Rotation based on horizontal velocity
    this.rotation = this.velocityX * 0.02;
  }

  jump(multiplier = 1) {
    this.velocityY = this.jumpPower * multiplier;
  }

  getCenter() {
    return { x: this.x, y: this.y };
  }

  getBounds() {
    return {
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      top: this.y - this.height / 2,
      bottom: this.y + this.height / 2
    };
  }
}
