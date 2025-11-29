// Spawn Yardımcıları - Platform, Düşman, PowerUp oluşturma
import { GAME_CONFIG } from '../constants/gameConfig';

export function generateInitialPlatforms() {
  const platforms = [];

  // Starting platform
  platforms.push({
    x: 350,
    y: GAME_CONFIG.PLATFORM.INITIAL_Y,
    width: GAME_CONFIG.PLATFORM.WIDTH,
    height: GAME_CONFIG.PLATFORM.HEIGHT,
    type: 'normal',
    moving: false,
    broken: false
  });

  // Generate platforms going up
  for (let i = 0; i < GAME_CONFIG.PLATFORM.INITIAL_COUNT; i++) {
    platforms.push(createPlatform(GAME_CONFIG.PLATFORM.INITIAL_Y - i * GAME_CONFIG.PLATFORM.VERTICAL_SPACING));
  }

  return platforms;
}

export function createPlatform(y) {
  const types = ['normal', 'normal', 'normal', 'moving', 'breaking', 'spring'];
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    x: Math.random() * 700 + 50,
    y: y,
    width: type === 'spring' ? GAME_CONFIG.PLATFORM.SPRING_WIDTH : GAME_CONFIG.PLATFORM.WIDTH,
    height: GAME_CONFIG.PLATFORM.HEIGHT,
    type: type,
    moving: type === 'moving',
    moveSpeed: type === 'moving' ? (Math.random() > 0.5 ? GAME_CONFIG.PLATFORM.MOVE_SPEED : -GAME_CONFIG.PLATFORM.MOVE_SPEED) : 0,
    broken: false,
    compressed: 0
  };
}

export function createEnemy(y) {
  const types = ['flying', 'static'];
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    x: Math.random() * 700 + 50,
    y: y,
    width: GAME_CONFIG.ENEMY.WIDTH,
    height: GAME_CONFIG.ENEMY.HEIGHT,
    type: type,
    moving: type === 'flying',
    moveSpeed: type === 'flying' ? (Math.random() > 0.5 ? GAME_CONFIG.ENEMY.MOVE_SPEED : -GAME_CONFIG.ENEMY.MOVE_SPEED) : 0,
    alive: true,
    animFrame: 0
  };
}

export function createPowerUp(y) {
  const types = ['jetpack', 'shield', 'magnet', 'slowmo', 'star'];
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    x: Math.random() * 700 + 50,
    y: y,
    width: GAME_CONFIG.POWERUP.WIDTH,
    height: GAME_CONFIG.POWERUP.HEIGHT,
    type: type,
    collected: false,
    pulse: 0,
    rotation: 0
  };
}

export function createParticle(x, y, color, count = 10, size = 3, particles) {
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
}
