// Yılan Sınıfı
import { DIRECTIONS, GAME_CONFIG } from '../constants/gameConfig';

export class Snake {
  constructor() {
    const midX = Math.floor(GAME_CONFIG.GRID_SIZE / 2);
    const midY = Math.floor(GAME_CONFIG.GRID_SIZE / 2);

    this.body = [
      { x: midX, y: midY },
      { x: midX - 1, y: midY },
      { x: midX - 2, y: midY }
    ];
    this.direction = DIRECTIONS.RIGHT;
    this.nextDirection = DIRECTIONS.RIGHT;
    this.growing = false;
  }

  move() {
    this.direction = this.nextDirection;
    const head = { ...this.body[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;

    // Wrap around
    if (head.x < 0) head.x = GAME_CONFIG.GRID_SIZE - 1;
    if (head.x >= GAME_CONFIG.GRID_SIZE) head.x = 0;
    if (head.y < 0) head.y = GAME_CONFIG.GRID_SIZE - 1;
    if (head.y >= GAME_CONFIG.GRID_SIZE) head.y = 0;

    this.body.unshift(head);
    if (!this.growing) {
      this.body.pop();
    }
    this.growing = false;
  }

  grow() {
    this.growing = true;
  }

  changeDirection(newDirection) {
    // Prevent 180 degree turns
    if (this.direction.x + newDirection.x === 0 &&
        this.direction.y + newDirection.y === 0) {
      return;
    }
    this.nextDirection = newDirection;
  }

  checkSelfCollision() {
    const head = this.body[0];
    return this.body.slice(1).some(segment =>
      segment.x === head.x && segment.y === head.y
    );
  }

  getHead() {
    return this.body[0];
  }
}
