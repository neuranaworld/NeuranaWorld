/**
 * CityRunner - Görev Sistemi
 * Rastgele görev oluşturma ve ilerleme takibi
 */

import { MISSIONS } from '../utils/Config.js';

export class MissionSystem {
  constructor() {
    this.currentMission = null;
  }

  /**
   * Rastgele yeni görev oluşturur
   * @returns {Object} - Yeni görev objesi
   */
  generateMission() {
    const randomMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    this.currentMission = { ...randomMission, progress: 0 };
    return this.currentMission;
  }

  /**
   * Görev ilerlemesini günceller
   * @param {string} type - Görev tipi (coins, distance, combo, jump, powerups)
   * @param {number} amount - İlerleme miktarı (default: 1)
   * @returns {Object|null} - Tamamlanmış görev veya null
   */
  updateProgress(type, amount = 1) {
    if (!this.currentMission || this.currentMission.type !== type) {
      return null;
    }

    this.currentMission.progress += amount;

    if (this.currentMission.progress >= this.currentMission.target) {
      const completedMission = { ...this.currentMission };
      return completedMission;
    }

    return null;
  }

  /**
   * Görev tamamlandığında ödül döndürür ve yeni görev oluşturur
   * @returns {Object} - { reward, newMission }
   */
  completeMission() {
    const reward = this.currentMission.reward;
    const newMission = this.generateMission();
    return { reward, newMission };
  }

  /**
   * Mevcut görevi döndürür
   * @returns {Object|null} - Mevcut görev
   */
  getCurrentMission() {
    return this.currentMission;
  }

  /**
   * Görev tamamlanma yüzdesini hesaplar
   * @returns {number} - 0-100 arası yüzde
   */
  getProgressPercentage() {
    if (!this.currentMission) return 0;
    return Math.min(100, (this.currentMission.progress / this.currentMission.target) * 100);
  }

  /**
   * Görevi sıfırlar
   */
  reset() {
    this.currentMission = null;
  }
}
