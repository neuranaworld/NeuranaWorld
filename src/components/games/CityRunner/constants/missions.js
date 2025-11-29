// Görev Tanımları
export const MISSIONS = [
  {
    type: 'coins',
    target: 50,
    desc: '50 Coin Topla',
    icon: '💰',
    reward: 100
  },
  {
    type: 'distance',
    target: 500,
    desc: '500m Koş',
    icon: '🏃',
    reward: 150
  },
  {
    type: 'combo',
    target: 10,
    desc: '10 Kombo Yap',
    icon: '🔥',
    reward: 200
  },
  {
    type: 'jump',
    target: 20,
    desc: '20 Kez Zıpla',
    icon: '⬆️',
    reward: 80
  },
  {
    type: 'powerups',
    target: 5,
    desc: '5 Power-up Topla',
    icon: '⚡',
    reward: 120
  },
];

export const generateRandomMission = () => {
  const randomMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
  return { ...randomMission, progress: 0 };
};
