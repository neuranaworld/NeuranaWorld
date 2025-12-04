// Pong Oyun Konfigürasyonu
export const GAME_CONFIG = {
  CANVAS: {
    WIDTH: 800,
    HEIGHT: 600,
  },

  PADDLE: {
    WIDTH: 15,
    HEIGHT: 100,
    SPEED: 8,
    AI_SPEED: 6,
  },

  BALL: {
    SIZE: 12,
    INITIAL_SPEED: 5,
    MAX_SPEED: 12,
    SPEED_INCREMENT: 0.5,
  },

  GAME: {
    WINNING_SCORE: 11,
    AI_DIFFICULTY: {
      EASY: 0.5,
      MEDIUM: 0.7,
      HARD: 0.9,
    },
  },
};

export const GAME_MODES = {
  PVP: 'pvp',
  AI: 'ai',
};
