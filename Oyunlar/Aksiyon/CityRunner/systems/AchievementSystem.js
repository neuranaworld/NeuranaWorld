/**
 * CityRunner - Başarı Sistemi
 * Başarı kontrolü ve bildirim yönetimi
 */

import { ACHIEVEMENTS } from '../utils/Config.js';

export class AchievementSystem {
  constructor(unlockedAchievements = []) {
    this.unlocked = unlockedAchievements;
    this.pendingNotifications = [];
  }

  /**
   * Başarı kontrolü yapar ve yeni başarıları açar
   * @param {string} type - Başarı tipi (combo, distance, coins)
   * @param {number} value - Kontrol edilecek değer
   * @returns {Array} - Yeni açılan başarılar
   */
  checkAchievements(type, value) {
    const newUnlocks = [];

    Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
      if (achievement.type === type &&
          value >= achievement.threshold &&
          !this.unlocked.includes(key)) {
        this.unlocked.push(key);
        newUnlocks.push({
          key,
          ...achievement
        });
        this.pendingNotifications.push(achievement.message);
      }
    });

    return newUnlocks;
  }

  /**
   * Bekleyen bildirimleri döndürür ve temizler
   * @returns {Array} - Bildirim mesajları
   */
  getAndClearNotifications() {
    const notifications = [...this.pendingNotifications];
    this.pendingNotifications = [];
    return notifications;
  }

  /**
   * Başarının açık olup olmadığını kontrol eder
   * @param {string} achievementKey - Başarı anahtarı
   * @returns {boolean} - Açık mı
   */
  isUnlocked(achievementKey) {
    return this.unlocked.includes(achievementKey);
  }

  /**
   * Açılan başarı sayısını döndürür
   * @returns {number} - Açılan başarı sayısı
   */
  getUnlockedCount() {
    return this.unlocked.length;
  }

  /**
   * Toplam başarı sayısını döndürür
   * @returns {number} - Toplam başarı sayısı
   */
  getTotalCount() {
    return Object.keys(ACHIEVEMENTS).length;
  }

  /**
   * Açılan başarıları döndürür
   * @returns {Array} - Açılan başarı anahtarları
   */
  getUnlocked() {
    return [...this.unlocked];
  }
}
