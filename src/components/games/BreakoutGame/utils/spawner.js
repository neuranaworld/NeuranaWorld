// Brick & PowerUp Spawner
import { GAME_CONFIG, BRICK_COLORS, POWERUP_TYPES } from '../constants/gameConfig';

export function createBricks(level) {
  const bricks = [];
  const rows = GAME_CONFIG.BRICK.BASE_ROWS + level;
  const cols = GAME_CONFIG.BRICK.COLS;
  const brickWidth = GAME_CONFIG.BRICK.WIDTH;
  const brickHeight = GAME_CONFIG.BRICK.HEIGHT;
  const padding = GAME_CONFIG.BRICK.PADDING;
  const offsetX = GAME_CONFIG.BRICK.OFFSET_X;
  const offsetY = GAME_CONFIG.BRICK.OFFSET_Y;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const brickX = offsetX + col * (brickWidth + padding);
      const brickY = offsetY + row * (brickHeight + padding);
      const hits = Math.min(level, 3);
      const hasPowerUp = Math.random() < GAME_CONFIG.BRICK.POWERUP_CHANCE;

      bricks.push({
        x: brickX,
        y: brickY,
        width: brickWidth,
        height: brickHeight,
        color: BRICK_COLORS[row % BRICK_COLORS.length],
        hits: hits,
        maxHits: hits,
        visible: true,
        hasPowerUp: hasPowerUp,
      });
    }
  }

  return bricks;
}

export function createPowerUp(x, y) {
  const types = Object.values(POWERUP_TYPES);
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    x: x,
    y: y,
    width: 30,
    height: 30,
    type: type,
    vy: 2,
    active: true,
  };
}

export function createParticles(x, y, color, count = 10, particles) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: 2 + Math.random() * 3,
      gravity: 0.2,
    });
  }
}
