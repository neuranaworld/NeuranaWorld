/**
 * CityRunner - Skor ve Kombo Sistemi
 * Skor, mesafe ve kombo hesaplamaları
 */

import { COMBO_CONFIG } from '../utils/Config.js';

export class ScoreSystem {
  constructor() {
    this.combo = 0;
    this.maxCombo = 0;
    this.comboTimer = 0;
  }

  /**
   * Komboyu artırır
   * @returns {number} - Yeni kombo değeri
   */
  increaseCombo() {
    this.combo++;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }
    this.comboTimer = COMBO_CONFIG.DURATION;
    return this.combo;
  }

  /**
   * Kombo timer'ını günceller
   */
  updateComboTimer() {
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        this.combo = 0;
      }
    }
  }

  /**
   * Komboyu sıfırlar
   */
  resetCombo() {
    this.combo = 0;
    this.comboTimer = 0;
  }

  /**
   * Tüm istatistikleri sıfırlar
   */
  reset() {
    this.combo = 0;
    this.maxCombo = 0;
    this.comboTimer = 0;
  }

  /**
   * Engel geçme puanı hesaplar
   * @param {number} basePoints - Temel puan (default: 10)
   * @returns {number} - Hesaplanan puan
   */
  static calculateObstaclePoints(basePoints = 10) {
    return basePoints;
  }

  /**
   * Coin toplama puanı hesaplar
   * @param {boolean} doubleCoins - 2x coin aktif mi
   * @returns {Object} - { points, coinValue }
   */
  static calculateCoinPoints(doubleCoins = false) {
    const coinValue = doubleCoins ? 2 : 1;
    const points = 5 * coinValue;
    return { points, coinValue };
  }

  /**
   * Power-up ile engel yok etme puanı
   * @returns {number} - Puan
   */
  static calculateDestroyPoints() {
    return 50;
  }
}

export class DistanceTracker {
  constructor() {
    this.distance = 0;
  }

  /**
   * Mesafeyi artırır
   * @param {number} increment - Artış miktarı (default: 1)
   * @returns {number} - Yeni mesafe değeri
   */
  increase(increment = 1) {
    this.distance += increment;
    return this.distance;
  }

  /**
   * Metre cinsinden mesafe döndürür
   * @returns {number} - Metre cinsinden mesafe
   */
  getMeters() {
    return Math.floor(this.distance / 10);
  }

  /**
   * Mesafeyi sıfırlar
   */
  reset() {
    this.distance = 0;
  }

  /**
   * Belirli bir km taşına ulaşıldı mı kontrol eder
   * @param {number} milestone - Milestone değeri
   * @returns {boolean} - Milestone'a ulaşıldı mı
   */
  checkMilestone(milestone) {
    return this.distance % (milestone * 100) === 0;
  }
}
