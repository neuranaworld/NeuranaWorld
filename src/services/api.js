import axios from 'axios'

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Unauthorized - clear token
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_id')
    }
    return Promise.reject(error)
  }
)

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  // Create anonymous user
  createAnonymous: () => apiClient.post('/auth/anonymous'),

  // Register user
  register: (data) => apiClient.post('/auth/register', data),

  // Login user
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
}

// ============================================
// USER API
// ============================================

export const userAPI = {
  // Get user stats
  getStats: (userId) => apiClient.get(`/user/${userId}/stats`),

  // Get user settings
  getSettings: (userId) => apiClient.get(`/user/${userId}/settings`),

  // Update user settings
  updateSettings: (userId, settings) => apiClient.put(`/user/${userId}/settings`, settings),
}

// ============================================
// AI API
// ============================================

export const aiAPI = {
  // Deep think mode
  deepThink: (question, mode = 'DEEP') =>
    apiClient.post('/llm/deep-think', { question, mode }),

  // Translate text
  translate: (text, sourceLang, targetLang) =>
    apiClient.post('/llm/translate', { text, source_lang: sourceLang, target_lang: targetLang }),

  // Multi-AI comparison
  multiAICompare: (question, selectedAIs, detailedMode = false, timeout = 60) =>
    apiClient.post('/multi-ai/compare', {
      question,
      selected_ais: selectedAIs,
      detailed_mode: detailedMode,
      timeout
    }),
}

// ============================================
// GAME API (if backend has game endpoints)
// ============================================

export const gameAPI = {
  // Save game score
  saveScore: (userId, gameId, score) =>
    apiClient.post('/game/score', { user_id: userId, game_id: gameId, score }),

  // Get leaderboard
  getLeaderboard: (gameId, limit = 10) =>
    apiClient.get(`/game/leaderboard/${gameId}?limit=${limit}`),
}

export default apiClient
