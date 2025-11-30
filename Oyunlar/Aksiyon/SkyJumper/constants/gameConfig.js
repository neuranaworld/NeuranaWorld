// SkyJumper Game Configuration

export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 600
};

export const PLAYER = {
  INIT_X: 400,
  INIT_Y: 400,
  WIDTH: 50,
  HEIGHT: 50,
  GRAVITY: 0.5,
  JUMP_POWER: -15,
  MAX_VELOCITY_X: 8,
  FRICTION: 0.9
};

export const CAMERA = {
  FOLLOW_OFFSET: 200,
  SMOOTHING: 0.1
};

export const PLATFORM = {
  INIT_Y: 500,
  SPACING: 80,
  INIT_COUNT: 15,
  SPAWN_DISTANCE: 80,
  TYPES: {
    NORMAL: { width: 100, height: 15, weight: 3 },
    MOVING: { width: 100, height: 15, weight: 1, speed: 2 },
    BREAKING: { width: 100, height: 15, weight: 1 },
    SPRING: { width: 80, height: 15, weight: 1, jumpMultiplier: 1.8 }
  }
};

export const ENEMY = {
  WIDTH: 40,
  HEIGHT: 40,
  SPAWN_CHANCE: 0.15,
  MIN_HEIGHT: 500,
  TYPES: {
    FLYING: { speed: 1.5 },
    STATIC: { speed: 0 }
  }
};

export const POWERUP = {
  WIDTH: 35,
  HEIGHT: 35,
  SPAWN_CHANCE: 0.08,
  MIN_HEIGHT: 200,
  DURATIONS: {
    JETPACK: 3000,
    SHIELD: 8000,
    MAGNET: 6000,
    SLOWMO: 5000,
    STAR: 7000
  },
  EFFECTS: {
    JETPACK: { velocityY: -12 },
    SHIELD: { protection: true },
    MAGNET: { range: 200, speed: 5 },
    SLOWMO: { timeScale: 0.5 },
    STAR: { scoreMultiplier: 2 }
  }
};

export const PHYSICS = {
  SLOWMO_SCALE: 0.5,
  NORMAL_SCALE: 1,
  COMBO_TIMEOUT: 180 // 3 seconds at 60fps
};

export const PARTICLES = {
  DEFAULT_COUNT: 10,
  DEFAULT_SIZE: 3,
  GRAVITY: 0.2,
  MAX_LIFE: 70
};

export const SCORE = {
  HEIGHT_MULTIPLIER: 1,
  ENEMY_KILL: 50,
  ACHIEVEMENT_CHECK_INTERVAL: 100
};

export const STORAGE_KEYS = {
  BEST_SCORE: 'skyjumper-best',
  ACHIEVEMENTS: 'skyjumper-achievements'
};
