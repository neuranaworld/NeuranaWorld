// SkyJumper Oyun Konfigürasyonu
export const GAME_CONFIG = {
  // Canvas Boyutları
  CANVAS: {
    WIDTH: 800,
    HEIGHT: 600,
  },

  // Oyuncu Ayarları
  PLAYER: {
    WIDTH: 50,
    HEIGHT: 50,
    START_X: 400,
    START_Y: 400,
    GRAVITY: 0.5,
    JUMP_POWER: -15,
    MAX_VELOCITY_X: 8,
    ACCELERATION: 0.6,
    FRICTION: 0.85,
  },

  // Platform Ayarları
  PLATFORM: {
    WIDTH: 100,
    HEIGHT: 15,
    SPRING_WIDTH: 80,
    VERTICAL_SPACING: 80,
    INITIAL_Y: 500,
    INITIAL_COUNT: 15,
    MOVE_SPEED: 2,
  },

  // Düşman Ayarları
  ENEMY: {
    WIDTH: 40,
    HEIGHT: 40,
    MOVE_SPEED: 1.5,
  },

  // Power-up Ayarları
  POWERUP: {
    WIDTH: 35,
    HEIGHT: 35,
    DURATION: {
      JETPACK: 5000,
      SHIELD: 7000,
      MAGNET: 6000,
      SLOWMO: 4000,
      STAR: 5000,
    },
  },

  // Spawn Ayarları
  SPAWN: {
    PLATFORM_THRESHOLD: 800,
    ENEMY_CHANCE: 0.15,
    POWERUP_CHANCE: 0.08,
  },

  // Kombo Sistemi
  COMBO: {
    TIME_WINDOW: 100, // frames
    SCORE_MULTIPLIER: 1.5,
  },

  // Kamera
  CAMERA: {
    SMOOTH_FACTOR: 0.1,
    OFFSET_Y: 200,
  },
};
