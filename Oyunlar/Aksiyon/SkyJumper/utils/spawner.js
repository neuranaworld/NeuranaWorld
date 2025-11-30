// Spawner utility for platforms, enemies, and power-ups

import { PLATFORM, ENEMY, POWERUP, CANVAS } from '../constants/gameConfig';

export const createPlatform = (y) => {
  // Weight-based type selection
  const types = [];
  Object.entries(PLATFORM.TYPES).forEach(([type, config]) => {
    const weight = config.weight || 1;
    for (let i = 0; i < weight; i++) {
      types.push(type.toLowerCase());
    }
  });

  const type = types[Math.floor(Math.random() * types.length)];
  const config = PLATFORM.TYPES[type.toUpperCase()];

  return {
    x: Math.random() * 700 + 50,
    y: y,
    width: config.width,
    height: config.height,
    type: type,
    moving: type === 'moving',
    moveSpeed: type === 'moving' ? (Math.random() > 0.5 ? PLATFORM.TYPES.MOVING.speed : -PLATFORM.TYPES.MOVING.speed) : 0,
    broken: false,
    compressed: 0
  };
};

export const generateInitialPlatforms = () => {
  const platforms = [];

  // Starting platform
  platforms.push({
    x: 350,
    y: PLATFORM.INIT_Y,
    width: 100,
    height: 15,
    type: 'normal',
    moving: false,
    broken: false
  });

  // Generate platforms going up
  for (let i = 0; i < PLATFORM.INIT_COUNT; i++) {
    platforms.push(createPlatform(400 - i * PLATFORM.SPACING));
  }

  return platforms;
};

export const createEnemy = (y) => {
  const type = Math.random() > 0.5 ? 'flying' : 'static';
  const config = ENEMY.TYPES[type.toUpperCase()];

  return {
    x: Math.random() * 700 + 50,
    y: y,
    width: ENEMY.WIDTH,
    height: ENEMY.HEIGHT,
    type: type,
    moving: type === 'flying',
    moveSpeed: type === 'flying' ? (Math.random() > 0.5 ? config.speed : -config.speed) : 0,
    alive: true,
    animFrame: 0
  };
};

export const createPowerUp = (y) => {
  const types = ['jetpack', 'shield', 'magnet', 'slowmo', 'star'];
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    x: Math.random() * 700 + 50,
    y: y,
    width: POWERUP.WIDTH,
    height: POWERUP.HEIGHT,
    type: type,
    collected: false,
    pulse: 0,
    rotation: 0
  };
};

export const createParticle = (x, y, color, count = 10, size = 3, particles) => {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 3,
      life: 40 + Math.random() * 30,
      maxLife: 70,
      color,
      size: size + Math.random() * 3,
      gravity: 0.2
    });
  }
};
