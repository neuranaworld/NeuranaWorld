// OkeyGame101 Oyun Konfigürasyonu
export const GAME_CONFIG = {
  // Istaka Ayarları
  RACK: {
    COUNT: 3,
    MAX_TILES_PER_RACK: 15,
  },

  // Taş Ayarları
  TILE: {
    WIDTH: 50,
    HEIGHT: 70,
    NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },

  // Oyuncu Başlangıç Taş Sayısı
  INITIAL_TILE_COUNT: 21,

  // Oyuncu Pozisyonları
  PLAYER_POSITIONS: {
    user: 'bottom',
    ai1: 'left',
    ai2: 'top',
    ai3: 'right',
  },
};

// Rakam Renkleri
export const NUMBER_COLORS = {
  red: '#DC2626',
  blue: '#2563EB',
  black: '#1F2937',
  yellow: '#EAB308',
};

// API Configuration
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export const API_ENDPOINTS = {
  BASE: `${BACKEND_URL}/api`,
  GAMES: {
    START: (userId) => `${BACKEND_URL}/api/games/okey/start?user_id=${userId}`,
    DRAW: (gameId, fromDiscard) => `${BACKEND_URL}/api/games/okey/${gameId}/draw?from_discard=${fromDiscard}`,
    DISCARD: (gameId, tileId) => `${BACKEND_URL}/api/games/okey/${gameId}/discard?tile_id=${tileId}`,
    OPEN: (gameId) => `${BACKEND_URL}/api/games/okey/${gameId}/open`,
    RACK_ADD: (gameId, rackIndex) => `${BACKEND_URL}/api/games/okey/${gameId}/rack/add?rack_index=${rackIndex}`,
  },
};
