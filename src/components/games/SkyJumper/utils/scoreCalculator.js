// Skor Hesaplama Fonksiyonları
import { GAME_CONFIG } from '../constants/gameConfig';

export function calculateScore(height, platforms, combo) {
  let score = Math.floor(height / 10);
  score += platforms * 10;
  score += calculateComboBonus(combo);
  return score;
}

export function calculateComboBonus(combo) {
  if (combo <= 1) return 0;
  return Math.floor(combo * combo * GAME_CONFIG.COMBO.SCORE_MULTIPLIER);
}

export function getHeightLevel(height) {
  return Math.floor(Math.abs(height) / 1000) + 1;
}
