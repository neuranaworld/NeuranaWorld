// Dart Oyun Konfigürasyonu
export const GAME_CONFIG = {
  BOARD: {
    RADIUS: 200,
    CENTER_X: 250,
    CENTER_Y: 250,
  },

  DART: {
    RADIUS: 8,
    SPEED: 15,
  },

  ZONES: {
    BULLSEYE: { radius: 15, points: 50, color: '#ef4444' },
    INNER_BULL: { radius: 40, points: 25, color: '#fbbf24' },
    TRIPLE_RING: { innerRadius: 100, outerRadius: 110, multiplier: 3, color: '#10b981' },
    DOUBLE_RING: { innerRadius: 190, outerRadius: 200, multiplier: 2, color: '#3b82f6' },
  },

  SECTORS: [
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5
  ],
};

export const GAME_MODES = {
  CLASSIC: { name: 'Klasik', darts: 3, rounds: 10 },
  CHALLENGE: { name: 'Meydan Okuma', darts: 5, rounds: 5 },
  PRACTICE: { name: 'Pratik', darts: 10, rounds: 1 },
};
