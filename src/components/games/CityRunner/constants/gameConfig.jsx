// CityRunner Oyun Konfigürasyonu
export const GAME_CONFIG = {
  // Lane (Şerit) Ayarları
  LANES: [120, 300, 480],

  // Hız Ayarları
  BASE_SPEED: 6,
  MAX_SPEED: 15,
  SPEED_INCREMENT: 0.01,

  // Oyuncu Ayarları
  PLAYER: {
    WIDTH: 45,
    HEIGHT: 70,
    GRAVITY: 0.9,
    JUMP_STRENGTH: -16,
    GROUND_Y: 380,
  },

  // Canvas Boyutları
  CANVAS: {
    WIDTH: 800,
    HEIGHT: 500,
  },

  // Spawn Ayarları
  SPAWN: {
    OBSTACLE_INTERVAL: 100,
    COIN_INTERVAL: 50,
    POWERUP_INTERVAL: 300,
  },

  // Combo Sistemi
  COMBO: {
    TIME_WINDOW: 120, // frames
    SCORE_MULTIPLIER: 1.5,
  },
};
