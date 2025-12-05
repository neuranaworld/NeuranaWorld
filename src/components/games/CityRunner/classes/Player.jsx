// Oyuncu Sınıfı
import { GAME_CONFIG } from '../constants/gameConfig';

export class Player {
  constructor() {
    this.lane = 1;
    this.y = GAME_CONFIG.PLAYER.GROUND_Y;
    this.velocityY = 0;
    this.width = GAME_CONFIG.PLAYER.WIDTH;
    this.height = GAME_CONFIG.PLAYER.HEIGHT;
    this.isJumping = false;
    this.isDucking = false;
    this.gravity = GAME_CONFIG.PLAYER.GRAVITY;
    this.jumpStrength = GAME_CONFIG.PLAYER.JUMP_STRENGTH;
    this.animFrame = 0;
    this.rotation = 0;
  }

  jump() {
    if (!this.isJumping && !this.isDucking) {
      this.velocityY = this.jumpStrength;
      this.isJumping = true;
      return true;
    }
    return false;
  }

  duck() {
    if (!this.isJumping) {
      this.isDucking = true;
      this.height = GAME_CONFIG.PLAYER.HEIGHT / 2;
      return true;
    }
    return false;
  }

  standUp() {
    this.isDucking = false;
    this.height = GAME_CONFIG.PLAYER.HEIGHT;
  }

  moveLeft() {
    if (this.lane > 0) {
      this.lane--;
      return true;
    }
    return false;
  }

  moveRight() {
    if (this.lane < GAME_CONFIG.LANES.length - 1) {
      this.lane++;
      return true;
    }
    return false;
  }

  update() {
    // Gravity
    if (this.isJumping) {
      this.velocityY += this.gravity;
      this.y += this.velocityY;

      // Landing
      if (this.y >= GAME_CONFIG.PLAYER.GROUND_Y) {
        this.y = GAME_CONFIG.PLAYER.GROUND_Y;
        this.velocityY = 0;
        this.isJumping = false;
        this.rotation = 0;
      } else {
        this.rotation = this.velocityY * 2;
      }
    }

    // Animation
    this.animFrame = (this.animFrame + 0.2) % 4;
  }

  getX() {
    return GAME_CONFIG.LANES[this.lane];
  }

  getBounds() {
    return {
      x: this.getX(),
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  reset() {
    this.lane = 1;
    this.y = GAME_CONFIG.PLAYER.GROUND_Y;
    this.velocityY = 0;
    this.isJumping = false;
    this.isDucking = false;
    this.animFrame = 0;
    this.rotation = 0;
    this.height = GAME_CONFIG.PLAYER.HEIGHT;
  }
}
