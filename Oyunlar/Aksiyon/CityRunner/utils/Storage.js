/**
 * CityRunner - LocalStorage Yönetimi
 * Skor, coin ve başarıları kaydetme/yükleme
 */

const STORAGE_KEYS = {
  BEST_SCORE: 'cityrunner-best',
  TOTAL_COINS: 'cityrunner-total-coins',
  ACHIEVEMENTS: 'cityrunner-achievements',
};

export class Storage {
  static getBestScore() {
    const saved = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    return saved ? parseInt(saved) : 0;
  }

  static saveBestScore(score) {
    localStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
  }

  static getTotalCoins() {
    const saved = localStorage.getItem(STORAGE_KEYS.TOTAL_COINS);
    return saved ? parseInt(saved) : 0;
  }

  static saveTotalCoins(coins) {
    localStorage.setItem(STORAGE_KEYS.TOTAL_COINS, coins.toString());
  }

  static getAchievements() {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return saved ? JSON.parse(saved) : [];
  }

  static saveAchievements(achievements) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  static updateBestScoreIfNeeded(currentScore, currentBest) {
    if (currentScore > currentBest) {
      this.saveBestScore(currentScore);
      return currentScore;
    }
    return currentBest;
  }

  static addCoins(amount) {
    const current = this.getTotalCoins();
    const newTotal = current + amount;
    this.saveTotalCoins(newTotal);
    return newTotal;
  }

  static unlockAchievement(achievementId) {
    const achievements = this.getAchievements();
    if (!achievements.includes(achievementId)) {
      achievements.push(achievementId);
      this.saveAchievements(achievements);
      return true;
    }
    return false;
  }
}
