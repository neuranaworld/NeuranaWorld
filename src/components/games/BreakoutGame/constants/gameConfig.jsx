// Breakout Oyun Konfigürasyonu
export const GAME_CONFIG = {
  // Canvas
  CANVAS: {
    WIDTH: 800,
    HEIGHT: 600,
  },

  // Ball
  BALL: {
    RADIUS: 8,
    SPEED: 5,
  },

  // Paddle
  PADDLE: {
    WIDTH: 100,
    HEIGHT: 12,
    SPEED: 8,
    Y_OFFSET: 40,
  },

  // Bricks
  BRICK: {
    WIDTH: 70,
    HEIGHT: 20,
    PADDING: 5,
    OFFSET_X: 35,
    OFFSET_Y: 60,
    BASE_ROWS: 4,
    COLS: 8,
    POWERUP_CHANCE: 0.1,
  },

  // Lives & Scoring
  INITIAL_LIVES: 3,
  INITIAL_LEVEL: 1,
  POINTS_PER_BRICK: 10,
};

// Brick Colors
export const BRICK_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
];

// Power-up Types
export const POWERUP_TYPES = {
  EXPAND: 'expand',
  MULTI_BALL: 'multiBall',
  SLOW: 'slow',
  FIRE: 'fire',
};

export const POWERUP_COLORS = {
  [POWERUP_TYPES.EXPAND]: '#10b981',
  [POWERUP_TYPES.MULTI_BALL]: '#f59e0b',
  [POWERUP_TYPES.SLOW]: '#3b82f6',
  [POWERUP_TYPES.FIRE]: '#ef4444',
};

export const POWERUP_ICONS = {
  [POWERUP_TYPES.EXPAND]: '⬌',
  [POWERUP_TYPES.MULTI_BALL]: '●●',
  [POWERUP_TYPES.SLOW]: '🐌',
  [POWERUP_TYPES.FIRE]: '🔥',
};
