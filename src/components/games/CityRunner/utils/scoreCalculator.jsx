// Skor Hesaplama Yardımcıları
import { GAME_CONFIG } from '../constants/gameConfig';

export function calculateScore(distance, coins, combo) {
  const baseScore = Math.floor(distance / 10);
  const coinBonus = coins * 5;
  const comboMultiplier = combo > 0 ? GAME_CONFIG.COMBO.SCORE_MULTIPLIER : 1;

  return Math.floor((baseScore + coinBonus) * comboMultiplier);
}

export function calculateComboBonus(combo) {
  if (combo < 3) return 0;
  if (combo < 5) return 10;
  if (combo < 10) return 25;
  return 50;
}

export function getLevelFromScore(score) {
  return Math.floor(score / 1000) + 1;
}

export function getSpeedMultiplier(level) {
  return 1 + (level - 1) * 0.1;
}
