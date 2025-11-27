/**
 * CityRunner - Çarpışma Tespiti
 * Oyuncu-engel, oyuncu-coin, oyuncu-powerup çarpışmaları
 */

import { COLLISION_BUFFER } from '../utils/Config.js';

export class Collision {
  /**
   * Oyuncu ile engel arasında çarpışma kontrolü (AABB)
   * @param {Object} player - Oyuncu objesi
   * @param {Object} obstacle - Engel objesi
   * @param {Array} lanes - Şerit pozisyonları
   * @param {number} groundY - Zemin Y pozisyonu
   * @returns {boolean} - Çarpışma var mı
   */
  static checkObstacleCollision(player, obstacle, lanes, groundY) {
    // Farklı şeritteyse çarpışma yok
    if (player.lane !== obstacle.lane) return false;

    const playerX = lanes[player.lane];
    const playerY = player.y;
    const obstacleX = lanes[obstacle.lane];
    const obstacleY = groundY;

    const playerLeft = playerX - player.width / 2;
    const playerRight = playerX + player.width / 2;
    const playerTop = playerY - player.height;
    const playerBottom = playerY;

    const obstacleLeft = obstacleX - obstacle.width / 2;
    const obstacleRight = obstacleX + obstacle.width / 2;
    const obstacleTop = obstacleY - obstacle.height;
    const obstacleBottom = obstacleY;

    return (
      playerRight > obstacleLeft &&
      playerLeft < obstacleRight &&
      playerBottom > obstacleTop &&
      playerTop < obstacleBottom
    );
  }

  /**
   * Oyuncu ile coin arasında çarpışma kontrolü (mesafe bazlı)
   * @param {Object} player - Oyuncu objesi
   * @param {Object} coin - Coin objesi
   * @param {Array} lanes - Şerit pozisyonları
   * @returns {boolean} - Çarpışma var mı
   */
  static checkCoinCollection(player, coin, lanes) {
    // Şerit kontrolü (yarım şerit toleransı)
    if (Math.abs(player.lane - coin.lane) > 0.5) return false;

    const playerX = lanes[player.lane];
    const playerY = player.y - player.height / 2;
    const coinX = lanes[coin.lane];
    const coinY = coin.y;

    const distance = Math.hypot(playerX - coinX, playerY - coinY);
    const collectionRadius = player.width / 2 + coin.radius + COLLISION_BUFFER.COIN;

    return distance < collectionRadius;
  }

  /**
   * Oyuncu ile power-up arasında çarpışma kontrolü
   * @param {Object} player - Oyuncu objesi
   * @param {Object} powerUp - Power-up objesi
   * @param {Array} lanes - Şerit pozisyonları
   * @returns {boolean} - Çarpışma var mı
   */
  static checkPowerUpCollection(player, powerUp, lanes) {
    if (player.lane !== powerUp.lane) return false;

    const playerX = lanes[player.lane];
    const playerY = player.y - player.height / 2;

    const distanceX = Math.abs(playerX - powerUp.x);
    const distanceY = Math.abs(playerY - powerUp.y);

    return distanceX < COLLISION_BUFFER.POWERUP && distanceY < COLLISION_BUFFER.POWERUP;
  }

  /**
   * Engelin oyuncu tarafından geçilip geçilmediğini kontrol eder
   * @param {Object} obstacle - Engel objesi
   * @param {number} playerLane - Oyuncu şeridi
   * @param {Array} lanes - Şerit pozisyonları
   * @returns {boolean} - Geçildi mi
   */
  static isObstaclePassed(obstacle, playerLane, lanes) {
    const playerX = lanes[playerLane];
    return obstacle.x < playerX - COLLISION_BUFFER.OBSTACLE_PASSED_DISTANCE;
  }
}
