// Spawner for bricks and power-ups

import { BRICK, COLORS, POWERUP_TYPES } from '../constants/gameConfig';

export const createBricks = (level) => {
  const bricks = [];
  const rows = 4 + level;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < BRICK.COLS; col++) {
      const brickX = BRICK.OFFSET_X + col * (BRICK.WIDTH + BRICK.PADDING);
      const brickY = BRICK.OFFSET_Y + row * (BRICK.HEIGHT + BRICK.PADDING);
      const hits = Math.min(level, 3);
      const hasPowerUp = Math.random() < BRICK.POWER_UP_CHANCE;

      bricks.push({
        x: brickX,
        y: brickY,
        width: BRICK.WIDTH,
        height: BRICK.HEIGHT,
        color: COLORS.BRICKS[row % COLORS.BRICKS.length],
        hits,
        maxHits: hits,
        visible: true,
        hasPowerUp
      });
    }
  }

  return bricks;
};

export const createPowerUp = (x, y) => {
  const type = POWERUP_TYPES[Math.floor(Math.random() * 2)]; // Only expand and multiball
  const icons = { expand: '↔', multiball: '●', slow: '⏱', laser: '⚡' };

  return {
    x,
    y,
    dy: 2,
    type,
    color: COLORS.POWERUP,
    icon: icons[type],
    collected: false
  };
};

export const createParticles = (x, y, color, particles) => {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      color,
      life: 30
    });
  }
};
