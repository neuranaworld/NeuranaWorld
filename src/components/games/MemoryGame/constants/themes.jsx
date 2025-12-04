// Tema Tanımları
export const THEMES = {
  emojis: {
    name: '😊 Emojiler',
    cards: ['😀', '😍', '🎉', '🌟', '🔥', '💎', '🎮', '🎯', '🎨', '🎵', '🚀', '⚡', '🌈', '🦄', '🐱', '🐶', '🦊', '🐼', '🦁', '🐯'],
    bg: 'from-yellow-400 to-orange-500'
  },
  animals: {
    name: '🐾 Hayvanlar',
    cards: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦉'],
    bg: 'from-green-400 to-blue-500'
  },
  food: {
    name: '🍕 Yemekler',
    cards: ['🍎', '🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍰', '🎂', '🍪', '🍩', '🍫', '🍬', '🍭', '🍮', '🍯', '🍓', '🍌', '🍉', '🍇'],
    bg: 'from-pink-400 to-red-500'
  },
  space: {
    name: '🚀 Uzay',
    cards: ['🌍', '🌎', '🌏', '🌑', '🌕', '⭐', '🌟', '💫', '✨', '☄️', '🚀', '🛸', '🛰️', '🌌', '🔭', '👽', '🪐', '🌠', '☀️', '🌙'],
    bg: 'from-purple-400 to-indigo-600'
  },
  sports: {
    name: '⚽ Spor',
    cards: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥅', '⛳', '🎯', '🥊', '🥋', '⛷️', '🏊'],
    bg: 'from-blue-400 to-cyan-500'
  }
};

export const DIFFICULTY_LEVELS = {
  easy: { name: 'Kolay', pairs: 6, timeBonus: 0, icon: '🌱' },
  medium: { name: 'Orta', pairs: 10, timeBonus: 30, icon: '🌿' },
  hard: { name: 'Zor', pairs: 15, timeBonus: 60, icon: '🌳' },
  expert: { name: 'Uzman', pairs: 18, timeBonus: 90, icon: '👑' }
};
