/**
 * CityRunner - Fizik Motoru
 * Yerçekimi, zıplama ve hareket hesaplamaları
 */

import { PLAYER_CONFIG, GAME_CONFIG } from '../utils/Config.js';

export class Physics {
  /**
   * Oyuncunun fizik güncellemesini yapar
   * @param {Object} player - Oyuncu objesi
   * @returns {Object} - Güncellenmiş oyuncu ve landing durumu
   */
  static updatePlayer(player) {
    let landed = false;

    if (player.isJumping) {
      // Yerçekimi uygula
      player.velocityY += player.gravity;
      player.y += player.velocityY;

      // Rotasyon efekti
      player.rotation = player.velocityY * 0.02;

      // Yere indi mi kontrol et
      if (player.y >= GAME_CONFIG.GROUND_Y) {
        player.y = GAME_CONFIG.GROUND_Y;
        player.velocityY = 0;
        player.isJumping = false;
        player.rotation = 0;
        landed = true;
      }
    } else {
      player.rotation = 0;
    }

    // Animasyon frame'ini güncelle
    player.animFrame++;

    return { landed };
  }

  /**
   * Oyuncuyu zıplatır
   * @param {Object} player - Oyuncu objesi
   * @returns {boolean} - Zıplama başarılı mı
   */
  static jump(player) {
    if (!player.isJumping && !player.isDucking) {
      player.isJumping = true;
      player.velocityY = player.jumpStrength;
      return true;
    }
    return false;
  }

  /**
   * Oyuncuyu eğdirir
   * @param {Object} player - Oyuncu objesi
   * @returns {boolean} - Eğilme başarılı mı
   */
  static duck(player) {
    if (!player.isJumping && !player.isDucking) {
      player.isDucking = true;
      player.height = PLAYER_CONFIG.DUCK_HEIGHT;
      return true;
    }
    return false;
  }

  /**
   * Eğilmeyi bitirir
   * @param {Object} player - Oyuncu objesi
   */
  static unduck(player) {
    player.isDucking = false;
    player.height = PLAYER_CONFIG.HEIGHT;
  }

  /**
   * Oyuncuyu şerit değiştirir
   * @param {Object} player - Oyuncu objesi
   * @param {string} direction - 'left' veya 'right'
   */
  static changeLane(player, direction) {
    if (direction === 'left') {
      player.lane = Math.max(0, player.lane - 1);
    } else if (direction === 'right') {
      player.lane = Math.min(2, player.lane - 1);
    }
  }
}
