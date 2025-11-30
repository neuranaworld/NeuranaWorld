// Score calculation and achievement/mission tracking

import { ACHIEVEMENTS } from '../constants/missions';
import { SCORE } from '../constants/gameConfig';

export class ScoreCalculator {
  static calculateHeightScore(height, starMultiplier = 1) {
    return Math.floor(height) * SCORE.HEIGHT_MULTIPLIER * starMultiplier;
  }

  static calculateEnemyKillScore(starMultiplier = 1) {
    return SCORE.ENEMY_KILL * starMultiplier;
  }

  static checkAchievements(type, value, currentAchievements, onUnlock) {
    const newAchievements = [...currentAchievements];
    let unlocked = false;

    ACHIEVEMENTS.forEach(ach => {
      if (ach.type === type && value >= ach.value && !currentAchievements.includes(ach.id)) {
        newAchievements.push(ach.id);
        unlocked = true;
        if (onUnlock) {
          onUnlock(`🏆 ${ach.name}!`);
        }
      }
    });

    return unlocked ? newAchievements : currentAchievements;
  }

  static shouldCheckAchievement(height) {
    return Math.floor(height) % SCORE.ACHIEVEMENT_CHECK_INTERVAL === 0 && height > 0;
  }
}
