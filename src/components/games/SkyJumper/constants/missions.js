// Görev Tanımları
export const MISSIONS = [
  { type: 'height', target: 5000, desc: '5000m Yüksel', icon: '🎯', reward: 500 },
  { type: 'platforms', target: 50, desc: '50 Platform', icon: '📦', reward: 300 },
  { type: 'combo', target: 15, desc: '15x Kombo', icon: '🔥', reward: 400 },
  { type: 'enemies', target: 10, desc: '10 Düşman Yok Et', icon: '💥', reward: 350 },
  { type: 'powerups', target: 5, desc: '5 Power-up', icon: '⚡', reward: 250 },
];

export function generateRandomMission() {
  const randomMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
  return { ...randomMission, progress: 0 };
}
