// Breakout Game Configuration

export const CANVAS = { WIDTH: 800, HEIGHT: 600 };

export const BALL = {
  RADIUS: 8,
  SPEED: 5,
  INIT_Y_OFFSET: 60
};

export const PADDLE = {
  WIDTH: 100,
  HEIGHT: 12,
  SPEED: 8,
  Y_OFFSET: 40,
  EXPAND_WIDTH: 150,
  EXPAND_BONUS: 30
};

export const BRICK = {
  WIDTH: 70,
  HEIGHT: 20,
  PADDING: 5,
  OFFSET_X: 35,
  OFFSET_Y: 60,
  COLS: 8,
  POWER_UP_CHANCE: 0.1
};

export const COLORS = {
  BRICKS: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
  BALL: '#ffffff',
  BALL_GLOW: '#fbbf24',
  PADDLE: { start: '#3b82f6', mid: '#60a5fa', end: '#3b82f6' },
  POWERUP: '#fbbf24'
};

export const POWERUP_TYPES = ['expand', 'multiball', 'slow', 'laser'];
export const POWERUP_DURATION = 5000;

export const SCORING = {
  BRICK_BASE: 10
};

export const STORAGE_KEY = 'breakout-best';
