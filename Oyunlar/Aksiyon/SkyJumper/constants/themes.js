// Theme configurations for SkyJumper

export const THEMES = {
  SKY: {
    name: 'sky',
    gradient: {
      start: (heightFactor) => `hsl(${210 - heightFactor * 60}, 70%, ${70 - heightFactor * 20}%)`,
      middle: (heightFactor) => `hsl(${200 - heightFactor * 40}, 65%, ${80 - heightFactor * 30}%)`,
      end: (heightFactor) => `hsl(${190 - heightFactor * 20}, 60%, ${90 - heightFactor * 40}%)`
    },
    decoration: 'clouds'
  },
  SPACE: {
    name: 'space',
    gradient: {
      start: () => '#0a0e27',
      middle: () => '#1a1f3a',
      end: () => '#2d1b4e'
    },
    decoration: 'stars'
  }
};

export const PLATFORM_COLORS = {
  NORMAL: { base: '#10b981', top: '#34d399' },
  MOVING: { base: '#3b82f6', top: '#60a5fa' },
  BREAKING: { base: '#b45309', top: '#f59e0b', broken: { base: '#991b1b', top: '#dc2626' } },
  SPRING: { base: '#dc2626', top: '#f87171', accent: '#7f1d1d' }
};

export const POWERUP_COLORS = {
  jetpack: { main: '#f59e0b', glow: '#fbbf24' },
  shield: { main: '#3b82f6', glow: '#60a5fa' },
  magnet: { main: '#8b5cf6', glow: '#a78bfa' },
  slowmo: { main: '#06b6d4', glow: '#22d3ee' },
  star: { main: '#fbbf24', glow: '#fef08a' }
};

export const POWERUP_ICONS = {
  jetpack: '🚀',
  shield: '🛡️',
  magnet: '🧲',
  slowmo: '⏱️',
  star: '⭐'
};
