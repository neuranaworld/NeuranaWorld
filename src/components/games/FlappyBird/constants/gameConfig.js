// Flappy Bird Oyun Konfigürasyonu
export const GAME_CONFIG = {
  // Canvas
  CANVAS: {
    WIDTH: 400,
    HEIGHT: 600,
  },

  // Bird
  BIRD: {
    X: 80,
    SIZE: 30,
    GRAVITY: 0.6,
    JUMP_STRENGTH: -10,
  },

  // Pipes
  PIPE: {
    WIDTH: 60,
    GAP: 150,
    SPEED: 3,
    SPAWN_INTERVAL: 90, // frames
  },

  // Scoring
  POINTS_PER_PIPE: 10,
};

export const BIRD_COLORS = {
  YELLOW: '#fbbf24',
  BLUE: '#3b82f6',
  RED: '#ef4444',
  GREEN: '#10b981',
};
