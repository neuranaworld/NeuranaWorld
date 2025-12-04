// Tema Tanımları
export const THEMES = {
  sky: {
    id: 'sky',
    name: 'Gökyüzü',
    gradient: (heightFactor) => [
      `hsl(${210 - heightFactor * 60}, 70%, ${70 - heightFactor * 20}%)`,
      `hsl(${200 - heightFactor * 40}, 65%, ${80 - heightFactor * 30}%)`,
      `hsl(${190 - heightFactor * 20}, 60%, ${90 - heightFactor * 40}%)`
    ],
    hasClouds: true,
  },
  space: {
    id: 'space',
    name: 'Uzay',
    gradient: () => ['#0a0e27', '#1a1f3a', '#2d1b4e'],
    hasStars: true,
  },
};

export const DEFAULT_THEME = 'sky';
