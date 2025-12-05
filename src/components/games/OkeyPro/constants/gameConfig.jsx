// OkeyPro Oyun Konfigürasyonu
export const GAME_CONFIG = {
  RACK: {
    COUNT: 3,
    MAX_TILES_PER_RACK: 15,
  },
  TILE: {
    WIDTH: 50,
    HEIGHT: 70,
  },
  INITIAL_TILE_COUNT: 21,
};

// Renk Paleti - Pro tasarım
export const COLORS = {
  // Masa
  tableTop: '#12508A',
  tableBottom: '#0B2A4A',
  tableMid: '#0E3A67',

  // Ahşap Istaka
  woodBase: '#8E6C48',
  woodDark: '#6D533B',
  woodDarker: '#5B402B',

  // Taş (Beyaz)
  tileBase: '#FAF7F2',

  // Rakam Renkleri
  numberRed: '#D43C3C',
  numberBlue: '#2D7BE0',
  numberBlack: '#1E1E1E',
  numberYellow: '#D6A431',

  // Vurgu
  highlightBlue: '#4DA3FF',
  highlightGreen: '#39D98A',

  // Metin
  textLight: '#EAF2FF',
  textSecondary: '#BFD7FF',
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
