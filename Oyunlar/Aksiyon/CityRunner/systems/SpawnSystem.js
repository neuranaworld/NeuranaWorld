/**
 * CityRunner - Spawn Sistemi
 * Engel, coin ve power-up spawn yönetimi
 */

import { GAME_CONFIG } from '../utils/Config.js';
import { ObstacleFactory } from '../entities/Obstacles.js';
import { CoinFactory, PowerUpFactory } from '../entities/Collectibles.js';

export class SpawnSystem {
  /**
   * Frame sayısına göre engel spawn etmeli mi kontrol eder ve spawn eder
   * @param {number} frame - Mevcut frame
   * @param {number} level - Oyun seviyesi
   * @param {Array} obstacles - Mevcut engeller dizisi
   * @returns {Object|null} - Yeni engel veya null
   */
  static spawnObstacle(frame, level, obstacles) {
    // Seviyeye göre dinamik interval (min 30 frame)
    const interval = Math.max(GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL - level * 5, 30);

    if (frame % interval === 0) {
      const obstacle = ObstacleFactory.create();
      obstacles.push(obstacle);
      return obstacle;
    }
    return null;
  }

  /**
   * Frame sayısına göre coin spawn etmeli mi kontrol eder ve spawn eder
   * @param {number} frame - Mevcut frame
   * @param {Array} coins - Mevcut coinler dizisi
   * @returns {Array|null} - Yeni coinler veya null
   */
  static spawnCoins(frame, coins) {
    if (frame % GAME_CONFIG.COIN_SPAWN_INTERVAL === 0) {
      const newCoins = CoinFactory.create();
      coins.push(...newCoins);
      return newCoins;
    }
    return null;
  }

  /**
   * Frame sayısına göre power-up spawn etmeli mi kontrol eder ve spawn eder
   * @param {number} frame - Mevcut frame
   * @param {Array} powerUps - Mevcut power-up'lar dizisi
   * @returns {Object|null} - Yeni power-up veya null
   */
  static spawnPowerUp(frame, powerUps) {
    if (frame % GAME_CONFIG.POWERUP_SPAWN_INTERVAL === 0) {
      const powerUp = PowerUpFactory.create();
      powerUps.push(powerUp);
      return powerUp;
    }
    return null;
  }

  /**
   * Ekrandan çıkan öğeleri temizler
   * @param {Array} items - Temizlenecek öğeler dizisi
   * @param {number} threshold - Temizleme eşiği (default: -100)
   */
  static cleanupOffscreen(items, threshold = -100) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i] && items[i].x < threshold) {
        items.splice(i, 1);
      }
    }
  }

  /**
   * Tüm spawn sistemini günceller
   * @param {number} frame - Mevcut frame
   * @param {number} level - Oyun seviyesi
   * @param {Object} gameObjects - Oyun objeleri (obstacles, coins, powerUps)
   * @returns {Object} - Spawn edilen objeler
   */
  static update(frame, level, gameObjects) {
    const spawned = {
      obstacle: this.spawnObstacle(frame, level, gameObjects.obstacles),
      coins: this.spawnCoins(frame, gameObjects.coins),
      powerUp: this.spawnPowerUp(frame, gameObjects.powerUps),
    };

    // Cleanup
    this.cleanupOffscreen(gameObjects.obstacles);
    this.cleanupOffscreen(gameObjects.coins, -50);
    this.cleanupOffscreen(gameObjects.powerUps, -50);

    return spawned;
  }
}
