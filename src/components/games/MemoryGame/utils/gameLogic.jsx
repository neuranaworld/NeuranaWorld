// Oyun Mantığı
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createCardDeck(themeCards, pairCount) {
  const selectedCards = themeCards.slice(0, pairCount);
  const pairs = [...selectedCards, ...selectedCards];
  const shuffled = shuffleArray(pairs);
  return shuffled.map((value, index) => ({
    id: index,
    value: value,
    isFlipped: false,
    isMatched: false
  }));
}

export function calculateScore(moves, time, combo, difficulty) {
  let baseScore = 1000;
  baseScore -= moves * 5;
  baseScore -= time * 2;
  baseScore += combo * 20;

  // Difficulty multiplier
  const multipliers = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    expert: 2.5
  };

  return Math.max(0, Math.floor(baseScore * multipliers[difficulty]));
}

export function checkAchievement(type, value) {
  const achievements = {
    perfect: { condition: (v) => v === true, name: '🏆 Mükemmel!', desc: 'Hatasız bitir' },
    speed: { condition: (v) => v < 30, name: '⚡ Hızlı', desc: '30 saniyede bitir' },
    combo: { condition: (v) => v >= 5, name: '🔥 Kombo Kralı', desc: '5x kombo yap' },
    expert: { condition: (v) => v === 'expert', name: '👑 Uzman', desc: 'Expert seviyesini bitir' }
  };

  const achievement = achievements[type];
  if (achievement && achievement.condition(value)) {
    return achievement;
  }
  return null;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
