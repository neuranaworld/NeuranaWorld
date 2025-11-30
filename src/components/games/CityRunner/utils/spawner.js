// Spawn Yardımcıları - Engel, Coin, PowerUp oluşturma
import { GAME_CONFIG } from '../constants/gameConfig';

export function createObstacle() {
  const types = ['car', 'barrier', 'cone', 'trash'];
  const type = types[Math.floor(Math.random() * types.length)];
  const lane = Math.floor(Math.random() * 3);

  return {
    x: 900,
    lane: lane,
    type: type,
    width: type === 'car' ? 70 : 45,
    height: type === 'car' ? 45 : type === 'trash' ? 35 : 55,
    passed: false,
    color: type === 'car' ? ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)] : null
  };
}

export function createCoin(groundY) {
  const lane = Math.floor(Math.random() * 3);
  const pattern = Math.random();

  if (pattern > 0.7) {
    // Coin trail - dizi halinde coinler
    const coins = [];
    for (let i = 0; i < 5; i++) {
      coins.push({
        x: 900 + i * 40,
        lane: lane,
        y: groundY - 100 - Math.sin(i * 0.5) * 30,
        collected: false,
        radius: 14,
        glow: 0
      });
    }
    return coins;
  }

  // Tek coin
  return [{
    x: 900,
    lane: lane,
    y: groundY - 90 - Math.random() * 110,
    collected: false,
    radius: 14,
    glow: 0
  }];
}

export function createPowerUp(groundY) {
  const types = ['shield', 'magnet', 'doubleCoins', 'boost', 'invincible'];
  const type = types[Math.floor(Math.random() * types.length)];
  const lane = Math.floor(Math.random() * 3);

  return {
    x: 900,
    lane: lane,
    y: groundY - 110,
    type: type,
    collected: false,
    width: 35,
    height: 35,
    pulse: 0
  };
}

export function createParticle(x, y, color, count = 10, particles) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: 3 + Math.random() * 4,
      gravity: 0.3
    });
  }
}

export function initBuildings() {
  const buildings = [];
  for (let i = 0; i < 10; i++) {
    buildings.push({
      x: i * 180,
      height: 120 + Math.random() * 180,
      width: 90 + Math.random() * 50,
      color: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6'][Math.floor(Math.random() * 4)],
      windows: Math.floor(Math.random() * 3) + 2
    });
  }
  return buildings;
}

export function initClouds() {
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: Math.random() * 800,
      y: 40 + Math.random() * 100,
      size: 30 + Math.random() * 30,
      speed: 0.2 + Math.random() * 0.3
    });
  }
  return clouds;
}
