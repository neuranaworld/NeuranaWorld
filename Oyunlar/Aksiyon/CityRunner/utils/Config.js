/**
 * CityRunner - Oyun Konfigürasyonu
 * Tüm oyun sabitleri ve ayarları
 */

export const GAME_CONFIG = {
  // Canvas boyutları
  CANVAS_WIDTH: 900,
  CANVAS_HEIGHT: 550,

  // Şerit pozisyonları
  LANES: [120, 300, 480],
  GROUND_Y: 380,

  // Hız ayarları
  BASE_SPEED: 6,
  MAX_SPEED: 14,
  SPEED_INCREMENT: 0.8,
  SPEED_INCREASE_INTERVAL: 500, // frame

  // Spawn intervalleri (frame)
  OBSTACLE_SPAWN_INTERVAL: 60,
  COIN_SPAWN_INTERVAL: 50,
  POWERUP_SPAWN_INTERVAL: 400,
};

export const PLAYER_CONFIG = {
  INITIAL_LANE: 1,
  WIDTH: 45,
  HEIGHT: 70,
  DUCK_HEIGHT: 35,
  DUCK_DURATION: 500, // ms

  // Fizik
  GRAVITY: 0.9,
  JUMP_STRENGTH: -16,
};

export const OBSTACLE_TYPES = {
  CAR: { width: 70, height: 45, name: 'car' },
  BARRIER: { width: 45, height: 55, name: 'barrier' },
  CONE: { width: 45, height: 55, name: 'cone' },
  TRASH: { width: 45, height: 35, name: 'trash' },
};

export const CAR_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

export const COIN_CONFIG = {
  RADIUS: 14,
  TRAIL_COUNT: 5,
  TRAIL_SPACING: 40,
  TRAIL_PROBABILITY: 0.7,
  BASE_Y_OFFSET: 90,
  MAX_Y_VARIANCE: 110,
};

export const POWERUP_CONFIG = {
  WIDTH: 35,
  HEIGHT: 35,
  DURATION: {
    shield: 7000,
    magnet: 7000,
    doubleCoins: 7000,
    boost: 5000,
    invincible: 6000,
  },
  COLORS: {
    shield: { main: '#3b82f6', glow: '#60a5fa' },
    magnet: { main: '#8b5cf6', glow: '#a78bfa' },
    doubleCoins: { main: '#10b981', glow: '#34d399' },
    boost: { main: '#f59e0b', glow: '#fbbf24' },
    invincible: { main: '#a855f7', glow: '#c084fc' },
  },
  ICONS: {
    shield: '🛡️',
    magnet: '🧲',
    doubleCoins: '💰',
    boost: '⚡',
    invincible: '✨',
  },
};

export const COMBO_CONFIG = {
  DURATION: 120, // frames (2 seconds)
};

export const MISSIONS = [
  { type: 'coins', target: 50, desc: '50 Coin Topla', icon: '💰', reward: 100 },
  { type: 'distance', target: 500, desc: '500m Koş', icon: '🏃', reward: 150 },
  { type: 'combo', target: 10, desc: '10 Kombo Yap', icon: '🔥', reward: 200 },
  { type: 'jump', target: 20, desc: '20 Kez Zıpla', icon: '⬆️', reward: 80 },
  { type: 'powerups', target: 5, desc: '5 Power-up Topla', icon: '⚡', reward: 120 },
];

export const ACHIEVEMENTS = {
  combo10: { threshold: 10, type: 'combo', message: '🏆 Başarı: 10x Kombo!' },
  distance1000: { threshold: 1000, type: 'distance', message: '🏆 Başarı: 1000m Koşu!' },
  coins100: { threshold: 100, type: 'coins', message: '🏆 Başarı: 100 Coin!' },
};

export const PARTICLE_CONFIG = {
  DEFAULT_COUNT: 10,
  GRAVITY: 0.3,
  MIN_LIFE: 30,
  MAX_LIFE_BONUS: 20,
  MIN_SIZE: 3,
  MAX_SIZE_BONUS: 4,
};

export const BUILDING_CONFIG = {
  COUNT: 10,
  SPACING: 180,
  MIN_HEIGHT: 120,
  MAX_HEIGHT_BONUS: 180,
  MIN_WIDTH: 90,
  MAX_WIDTH_BONUS: 50,
  COLORS: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6'],
  MIN_WINDOWS: 2,
  MAX_WINDOWS: 4,
  SPEED_MULTIPLIER: 0.4,
};

export const CLOUD_CONFIG = {
  COUNT: 6,
  MIN_Y: 40,
  MAX_Y: 140,
  MIN_SIZE: 30,
  MAX_SIZE: 60,
  MIN_SPEED: 0.2,
  MAX_SPEED: 0.5,
};

export const MAGNET_RANGE = 150;
export const MAGNET_PULL_SPEED = 8;

export const COLLISION_BUFFER = {
  COIN: 20,
  POWERUP: 60,
  OBSTACLE_PASSED_DISTANCE: 50,
};
