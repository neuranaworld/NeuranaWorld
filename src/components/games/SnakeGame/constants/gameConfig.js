// Snake Oyun Konfigürasyonu
export const GAME_CONFIG = {
  GRID_SIZE: 20,
  CELL_SIZE: 20,
  INITIAL_SNAKE_LENGTH: 3,
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 5,
  MIN_SPEED: 50,
};

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const FOOD_TYPES = {
  NORMAL: { points: 10, color: '#ef4444', icon: '🍎' },
  GOLDEN: { points: 50, color: '#fbbf24', icon: '⭐' },
  SPEED: { points: 20, color: '#3b82f6', icon: '⚡' },
};
