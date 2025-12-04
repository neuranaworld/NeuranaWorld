// Oyuncu Sınıfı
import { GAME_CONFIG } from '../constants/gameConfig';

export class Player {
  constructor() {
    this.x = GAME_CONFIG.PLAYER.START_X;
    this.y = GAME_CONFIG.PLAYER.START_Y;
    this.width = GAME_CONFIG.PLAYER.WIDTH;
    this.height = GAME_CONFIG.PLAYER.HEIGHT;
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = GAME_CONFIG.PLAYER.GRAVITY;
    this.jumpPower = GAME_CONFIG.PLAYER.JUMP_POWER;
    this.maxVelocityX = GAME_CONFIG.PLAYER.MAX_VELOCITY_X;
    this.acceleration = GAME_CONFIG.PLAYER.ACCELERATION;
    this.friction = GAME_CONFIG.PLAYER.FRICTION;
    this.animFrame = 0;
    this.rotation = 0;
    this.trail = [];
    this.isJumping = false;
  }

  jump(force = this.jumpPower) {
    this.velocityY = force;
    this.isJumping = true;
  }

  moveLeft() {
    this.velocityX = Math.max(this.velocityX - this.acceleration, -this.maxVelocityX);
  }

  moveRight() {
    this.velocityX = Math.min(this.velocityX + this.acceleration, this.maxVelocityX);
  }

  update(jetpackActive = false) {
    // Apply gravity or jetpack
    if (jetpackActive) {
      this.velocityY = Math.max(this.velocityY - 0.8, -10);
    } else {
      this.velocityY += this.gravity;
    }

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Apply friction
    this.velocityX *= this.friction;

    // Wrap around screen horizontally
    if (this.x < -this.width / 2) {
      this.x = GAME_CONFIG.CANVAS.WIDTH + this.width / 2;
    }
    if (this.x > GAME_CONFIG.CANVAS.WIDTH + this.width / 2) {
      this.x = -this.width / 2;
    }

    // Update rotation based on velocity
    this.rotation = this.velocityX * 0.02;

    // Animation frame
    this.animFrame++;

    // Reset jumping state when moving up
    if (this.velocityY < 0) {
      this.isJumping = true;
    }
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  reset() {
    this.x = GAME_CONFIG.PLAYER.START_X;
    this.y = GAME_CONFIG.PLAYER.START_Y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.animFrame = 0;
    this.rotation = 0;
    this.trail = [];
    this.isJumping = false;
  }
}
