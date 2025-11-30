// Mission definitions for SkyJumper

export const MISSION_TYPES = [
  {
    type: 'height',
    target: 5000,
    desc: '5000m Yüksel',
    icon: '🎯',
    reward: 500
  },
  {
    type: 'platforms',
    target: 50,
    desc: '50 Platform',
    icon: '📦',
    reward: 300
  },
  {
    type: 'combo',
    target: 15,
    desc: '15x Kombo',
    icon: '🔥',
    reward: 400
  },
  {
    type: 'enemies',
    target: 10,
    desc: '10 Düşman Yok Et',
    icon: '💥',
    reward: 350
  },
  {
    type: 'powerups',
    target: 5,
    desc: '5 Power-up',
    icon: '⚡',
    reward: 250
  }
];

export const ACHIEVEMENTS = [
  { id: 'height1000', type: 'height', value: 1000, name: '1000m Yükseklik' },
  { id: 'height5000', type: 'height', value: 5000, name: '5000m Yükseklik' },
  { id: 'height10000', type: 'height', value: 10000, name: '10000m Yükseklik' },
  { id: 'combo15', type: 'combo', value: 15, name: '15x Kombo' },
  { id: 'combo25', type: 'combo', value: 25, name: '25x Kombo' },
  { id: 'platforms100', type: 'platforms', value: 100, name: '100 Platform' },
  { id: 'enemies20', type: 'enemies', value: 20, name: '20 Düşman' }
];
