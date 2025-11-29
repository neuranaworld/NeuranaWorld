// Karakter Tanımları
export const CHARACTERS = {
  runner: {
    id: 'runner',
    name: 'Koşucu',
    color: '#3b82f6',
    speed: 1.0,
    jump: 1.0,
    special: 'balanced',
  },
  athlete: {
    id: 'athlete',
    name: 'Atlet',
    color: '#f59e0b',
    speed: 1.2,
    jump: 0.9,
    special: 'fast',
  },
  ninja: {
    id: 'ninja',
    name: 'Ninja',
    color: '#8b5cf6',
    speed: 0.9,
    jump: 1.3,
    special: 'jumper',
  },
  robot: {
    id: 'robot',
    name: 'Robot',
    color: '#10b981',
    speed: 1.1,
    jump: 1.1,
    special: 'shield',
  },
};

export const DEFAULT_CHARACTER = 'runner';
